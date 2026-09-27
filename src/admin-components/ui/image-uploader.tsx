"use client";

import { useState, useEffect, useRef, useId, useCallback } from "react";
import axios from "axios";
import {
  Loader2,
  UploadCloud,
  X,
  Image as ImageIcon,
  MonitorUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";
import { normalizeImageUrl } from "@/lib/imageUtils";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUploadSuccess: (urls: string[]) => void;
  onRemoveImage?: (url: string) => void;
  maxFiles?: number;
  initialImages?: string[];
}

// ─── Unified item model ───────────────────────────────────────────────────────
// A single list drives the entire UI. Items transition:
//   uploading → (success tick 500ms) → committed
//   uploading → error (user dismisses)
// This eliminates all double-display race conditions between previewUrls and uploadingFiles.

type CommittedItem = {
  id: string;
  kind: "committed";
  url: string;
};

type UploadingItem = {
  id: string;
  kind: "uploading";
  file: File;
  objectUrl: string;     // local blob URL for thumbnail preview
  progress: number;
  status: "uploading" | "processing" | "success" | "error";
  finalUrl?: string;
  errorMessage?: string;
};

type MediaItem = CommittedItem | UploadingItem;

// Helper: make committed item
const committed = (url: string): CommittedItem => ({
  id: `committed_${url}`,
  kind: "committed",
  url,
});

export function ImageUploader({
  onUploadSuccess,
  onRemoveImage,
  maxFiles = 5,
  initialImages = [],
}: ImageUploaderProps) {
  const uploaderId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<MediaItem[]>(() =>
    initialImages.map(committed)
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [error, setError] = useState("");

  // Sync when parent provides new initialImages (edit mode: drawer re-opens)
  // Only sync if there are no in-progress uploads to avoid clobbering.
  useEffect(() => {
    setItems(prev => {
      const hasUploading = prev.some(it => it.kind === "uploading");
      if (hasUploading) return prev; // don't clobber active uploads
      return initialImages.map(committed);
    });
  }, [initialImages]);

  // Derived values
  const committedCount = items.filter(it => it.kind === "committed").length;
  const activeUploadCount = items.filter(
    it => it.kind === "uploading" && it.status !== "error"
  ).length;
  const totalOccupied = committedCount + activeUploadCount;
  const remainingSlots = Math.max(0, maxFiles - totalOccupied);
  const isUploading = items.some(
    it => it.kind === "uploading" && (it.status === "uploading" || it.status === "processing")
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsMenuOpen(false);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const fileList = Array.from(files);

      if (totalOccupied + fileList.length > maxFiles) {
        setError(`Chỉ được tải lên tối đa ${maxFiles} ảnh. Còn ${remainingSlots} chỗ trống.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setError("");

      // 1. Add uploading items immediately so user sees the progress boxes
      const newUploadingItems: UploadingItem[] = fileList.map((file, i) => ({
        id: `upload_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
        kind: "uploading",
        file,
        objectUrl: URL.createObjectURL(file),
        progress: 0,
        status: "uploading",
      }));

      setItems(prev => [...prev, ...newUploadingItems]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const successfulUploads: { itemId: string; finalUrl: string }[] = [];

      // 2. Upload all files concurrently, updating each item's progress
      await Promise.all(
        newUploadingItems.map(async item => {
          const formData = new FormData();
          formData.append("files", item.file);

          try {
            const response = await axios.post("/api/upload/images", formData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: progressEvent => {
                const total = progressEvent.total || item.file.size;
                const pct = Math.min(93, Math.round((progressEvent.loaded * 100) / total));
                setItems(prev =>
                  prev.map(it =>
                    it.id === item.id && it.kind === "uploading"
                      ? { ...it, progress: pct, status: pct >= 88 ? "processing" : "uploading" }
                      : it
                  )
                );
              },
            });

            const uploadedUrls = response.data as string[];
            if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
              const finalUrl = uploadedUrls[0];
              successfulUploads.push({ itemId: item.id, finalUrl });

              // Mark as success (show green tick for a moment)
              setItems(prev =>
                prev.map(it =>
                  it.id === item.id && it.kind === "uploading"
                    ? { ...it, progress: 100, status: "success", finalUrl }
                    : it
                )
              );
            } else {
              throw new Error("Không nhận được URL từ server");
            }
          } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Tải ảnh thất bại";
            setItems(prev =>
              prev.map(it =>
                it.id === item.id && it.kind === "uploading"
                  ? { ...it, status: "error", errorMessage: msg }
                  : it
              )
            );
            toast.error(`Ảnh ${item.file.name}: ${msg}`);
          }
        })
      );

      if (successfulUploads.length > 0) {
        const successIds = new Set(successfulUploads.map(s => s.itemId));

        // 3. Show green tick for 450ms, then atomically transition:
        //    uploading(success) → committed  — in a SINGLE state update
        //    This is the key: one setState call = one render = zero flash
        await new Promise(resolve => setTimeout(resolve, 450));

        const uploadedUrls = successfulUploads.map(s => s.finalUrl);

        setItems(prev => {
          const next: MediaItem[] = [];
          const newCommittedItems: CommittedItem[] = [];
          
          for (const it of prev) {
            if (it.kind === "uploading" && successIds.has(it.id)) {
              // Transition: uploading → committed (single atomic update)
              const c = committed(it.finalUrl!);
              newCommittedItems.push(c);
              next.push(c);
            } else {
              next.push(it);
            }
          }

          return next;
        });

        // Notify parent AFTER state is committed
        onUploadSuccess(uploadedUrls);
        toast.success(`Đã tải lên thành công ${successfulUploads.length} ảnh`);
      }
    },
    [totalOccupied, maxFiles, remainingSlots, onUploadSuccess]
  );

  const dismissError = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const removeCommitted = (id: string) => {
    const item = items.find(it => it.id === id && it.kind === "committed") as CommittedItem | undefined;
    if (!item) return;
    setItems(prev => prev.filter(it => it.id !== id));
    if (onRemoveImage) onRemoveImage(item.url);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone / trigger button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(v => !v)}
          disabled={isUploading || remainingSlots === 0}
          className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-[6px] transition-all focus:outline-none select-none
            ${remainingSlots === 0
              ? "opacity-50 pointer-events-none border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1b23]"
              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1b23] hover:border-[#5865f2]/50 hover:bg-[#5865f2]/5 dark:hover:bg-[#5865f2]/10"
            }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#5865f2]" />
              <p className="text-xs font-medium text-[#5865f2]">Đang tải ảnh lên…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-2.5 bg-white dark:bg-[#2a2d36] rounded-full border border-gray-100 dark:border-gray-700">
                <UploadCloud className="w-5 h-5 text-[#5865f2]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#5865f2]">Nhấn để thêm ảnh</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG, WEBP · Tối đa {maxFiles} ảnh · Còn {remainingSlots} chỗ
                </p>
              </div>
            </div>
          )}
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={e => { e.stopPropagation(); setIsMenuOpen(false); }}
            />
            <div className="absolute bottom-[118px] left-1/2 -translate-x-1/2 z-50 w-60 bg-white dark:bg-[#14151a] p-1.5 shadow-lg shadow-black/10 border border-gray-200 dark:border-gray-800 rounded-lg animate-in zoom-in-95 slide-in-from-bottom-2 duration-100">
              <label
                htmlFor={`dropzone-file-${uploaderId}`}
                className="flex items-center w-full cursor-pointer py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                onClick={() => setTimeout(() => setIsMenuOpen(false), 80)}
              >
                <MonitorUp className="w-4 h-4 mr-2.5 text-gray-500" />
                Tải lên từ máy tính
              </label>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setIsMenuOpen(false); setIsMediaPickerOpen(true); }}
                className="flex items-center w-full cursor-pointer py-2.5 px-3 text-sm font-medium text-[#5865f2] hover:text-[#4752c4] hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
              >
                <ImageIcon className="w-4 h-4 mr-2.5" />
                Chọn từ thư viện
              </button>
            </div>
          </>
        )}

        <input
          id={`dropzone-file-${uploaderId}`}
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || remainingSlots === 0}
        />
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {/* ─── Unified image grid ───────────────────────────────────────────────── */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {items.map(item => {
            if (item.kind === "committed") {
              // ── Committed image: normal preview with remove button ────────────
              return (
                <div
                  key={item.id}
                  className="relative w-24 h-24 rounded-[6px] border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1a1b23] group shadow-sm flex-shrink-0"
                >
                  <img
                    src={normalizeImageUrl(item.url)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeCommitted(item.id)}
                    className="absolute top-1 right-1 p-1 bg-white/80 dark:bg-black/60 hover:bg-red-500 rounded-[3px] text-gray-600 hover:text-white transition-all shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            }

            // ── Uploading / error item: progress box ──────────────────────────
            return (
              <div
                key={item.id}
                className={`relative w-24 h-24 rounded-[6px] border-2 overflow-hidden shadow-sm flex-shrink-0 transition-all duration-300 ${
                  item.status === "error"
                    ? "border-red-400 bg-red-950/10"
                    : item.status === "success"
                    ? "border-emerald-400 scale-[0.96] opacity-75"
                    : "border-[#5865f2]/60 bg-gray-900"
                }`}
              >
                {/* Blurred thumbnail */}
                <img
                  src={item.objectUrl}
                  alt={item.file.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-[2px] scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 p-2">
                  {item.status === "error" ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-[9px] font-semibold text-red-300 text-center">Lỗi</span>
                      <button
                        type="button"
                        onClick={() => dismissError(item.id)}
                        className="mt-0.5 px-2 py-0.5 text-[9px] font-medium bg-red-500/30 hover:bg-red-500/50 text-red-200 rounded-[3px] transition-colors cursor-pointer"
                      >
                        Đóng
                      </button>
                    </>
                  ) : item.status === "success" ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                      <span className="text-[9px] font-bold text-emerald-300">Xong!</span>
                    </>
                  ) : (
                    <>
                      {/* Circular SVG progress */}
                      <div className="relative w-9 h-9">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" />
                          <circle
                            cx="20" cy="20" r="16"
                            fill="none"
                            stroke="#5865f2"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray={`${(item.progress / 100) * 100.5} 100.5`}
                            className="transition-[stroke-dasharray] duration-200"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                          {item.progress}%
                        </span>
                      </div>
                      <span className="text-[9px] font-medium text-gray-300">
                        {item.status === "processing" ? "Lưu…" : "Tải lên"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MediaPickerModal
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        maxFiles={maxFiles}
        initialSelectedUrls={items.filter(it => it.kind === "committed").map(it => (it as CommittedItem).url)}
        onSelect={urls => {
          setItems(urls.map(committed));
          onUploadSuccess(urls);
        }}
      />
    </div>
  );
}
