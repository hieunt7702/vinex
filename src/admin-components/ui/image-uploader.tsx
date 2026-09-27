"use client";

import { useState, useEffect, useRef, useId } from "react";
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

interface UploadingFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  finalUrl?: string;
  errorMessage?: string;
  /** True once the success animation has finished and the item transitions into previewUrls */
  committed?: boolean;
}

export function ImageUploader({ onUploadSuccess, onRemoveImage, maxFiles = 5, initialImages = [] }: ImageUploaderProps) {
  const uploaderId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialImages when they change (useful for edit mode)
  useEffect(() => {
    setPreviewUrls(initialImages);
  }, [initialImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMenuOpen(false);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    if (previewUrls.length + uploadingFiles.filter(f => f.status !== 'error').length + fileList.length > maxFiles) {
      setError(`Chỉ được tải lên tối đa ${maxFiles} ảnh. Bạn đã có ${previewUrls.length} ảnh.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setError("");
    setIsUploading(true);

    // Create an uploading box entry for each file immediately
    const newItems: UploadingFile[] = fileList.map((file, i) => ({
      id: `uploader_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const successResults: { itemId: string; url: string }[] = [];

    // Upload each file individually
    await Promise.all(
      newItems.map(async (item) => {
        const formData = new FormData();
        formData.append("files", item.file);

        try {
          const response = await axios.post('/api/upload/images', formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || item.file.size;
              const percent = Math.min(95, Math.round((progressEvent.loaded * 100) / total));
              setUploadingFiles(current =>
                current.map(it =>
                  it.id === item.id
                    ? { ...it, progress: percent, status: percent >= 90 ? 'processing' : 'uploading' }
                    : it
                )
              );
            }
          });

          const uploadedUrls = response.data as string[];
          if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
            const finalUrl = uploadedUrls[0];
            successResults.push({ itemId: item.id, url: finalUrl });

            // Mark as success (show green ✓ tick), store finalUrl
            setUploadingFiles(current =>
              current.map(it =>
                it.id === item.id
                  ? { ...it, progress: 100, status: 'success', finalUrl }
                  : it
              )
            );
          } else {
            throw new Error("Không nhận được URL từ server");
          }
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || "Tải ảnh thất bại";
          setUploadingFiles(current =>
            current.map(it =>
              it.id === item.id
                ? { ...it, status: 'error', errorMessage: msg }
                : it
            )
          );
          toast.error(`Ảnh ${item.file.name}: ${msg}`);
        }
      })
    );

    // After all uploads done: wait for success animation (600ms), 
    // then commit successful images to previewUrls and remove them from uploadingFiles
    if (successResults.length > 0) {
      const successUrls = successResults.map(r => r.url);
      const successIds = new Set(successResults.map(r => r.itemId));

      // Small delay for the green tick animation to show
      await new Promise(resolve => setTimeout(resolve, 700));

      // Atomically: remove successful uploading items AND add to previewUrls
      setUploadingFiles(current => current.filter(it => !successIds.has(it.id)));
      setPreviewUrls(prev => [...prev, ...successUrls]);
      onUploadSuccess(successUrls);
      toast.success(`Đã tải lên thành công ${successUrls.length} ảnh`);
    }

    setIsUploading(false);
  };

  const handleDismissError = (id: string) => {
    setUploadingFiles(current => current.filter(it => it.id !== id));
  };

  const removeImage = (indexToRemove: number) => {
    const urlToRemove = previewUrls[indexToRemove];
    setPreviewUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
    if (onRemoveImage) onRemoveImage(urlToRemove);
  };

  const remainingFiles = Math.max(0, maxFiles - previewUrls.length - uploadingFiles.filter(f => f.status !== 'error').length);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 w-full relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={isUploading || remainingFiles === 0}
          className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-[6px] transition-all focus:outline-none
            ${remainingFiles === 0
              ? 'opacity-50 pointer-events-none border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1b23]'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1b23] hover:border-[#5865f2]/50 hover:bg-[#5865f2]/5 dark:hover:bg-[#5865f2]/10 hover:dark:border-[#5865f2]/40'
            }`}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-[#5865f2]" />
                <p className="text-xs font-medium text-[#5865f2]">Đang tải ảnh lên...</p>
              </>
            ) : (
              <>
                <div className="p-2.5 bg-white dark:bg-[#2a2d36] rounded-full border border-gray-100 dark:border-gray-700">
                  <UploadCloud className="w-5 h-5 text-[#5865f2] dark:text-[#5865f2]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="text-[#5865f2]">Nhấn để thêm ảnh</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    PNG, JPG, WEBP · Tối đa {maxFiles} ảnh · Còn {remainingFiles} chỗ
                  </p>
                </div>
              </>
            )}
          </div>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
            <div className="absolute bottom-[118px] left-1/2 -translate-x-1/2 z-50 w-60 bg-white dark:bg-[#14151a] p-1.5 shadow-lg shadow-black/10 dark:shadow-black/30 border border-gray-200 dark:border-gray-800 rounded-lg animate-in zoom-in-95 slide-in-from-bottom-2 duration-100">
              <label
                htmlFor={`dropzone-file-${uploaderId}`}
                className="flex items-center w-full cursor-pointer py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
                onClick={() => setTimeout(() => setIsMenuOpen(false), 100)}
              >
                <MonitorUp className="w-4 h-4 mr-2.5 text-gray-500 dark:text-gray-400" />
                Tải lên từ máy tính
              </label>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsMediaPickerOpen(true); }}
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
          disabled={isUploading || remainingFiles === 0}
        />
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {/* Combined preview grid: committed images + active upload progress items */}
      {(previewUrls.length > 0 || uploadingFiles.length > 0) && (
        <div className="flex flex-wrap gap-3 mt-2">
          {/* Committed / uploaded images */}
          {previewUrls.map((url, idx) => (
            <div key={`preview-${idx}`} className="relative w-24 h-24 rounded-[6px] border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1a1b23] group shadow-sm flex-shrink-0">
              <img src={normalizeImageUrl(url)} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 bg-white/80 dark:bg-black/50 hover:bg-red-500 rounded-[3px] text-gray-700 dark:text-gray-300 hover:text-white transition-all shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Active upload progress items */}
          {uploadingFiles.map((item) => (
            <div
              key={item.id}
              className={`relative w-24 h-24 rounded-[6px] border-2 overflow-hidden shadow-sm flex-shrink-0 transition-all duration-300 ${
                item.status === 'error'
                  ? 'border-red-400 bg-red-950/10'
                  : item.status === 'success'
                  ? 'border-emerald-400 bg-emerald-950/10 scale-[0.97] opacity-80'
                  : 'border-[#5865f2]/60 bg-gray-900'
              }`}
            >
              {/* Blurred thumbnail background */}
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[1px] scale-105"
              />

              {/* Dark overlay + content */}
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1 p-2">
                {item.status === 'error' ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-[9px] font-semibold text-red-300 text-center leading-tight">Lỗi tải</span>
                    <button
                      type="button"
                      onClick={() => handleDismissError(item.id)}
                      className="mt-0.5 px-2 py-0.5 text-[9px] font-medium bg-red-500/30 hover:bg-red-500/50 text-red-200 rounded-[3px] transition-colors cursor-pointer"
                    >
                      Đóng
                    </button>
                  </>
                ) : item.status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                    <span className="text-[9px] font-bold text-emerald-300">Xong!</span>
                  </>
                ) : (
                  <>
                    {/* Circular progress */}
                    <div className="relative w-8 h-8">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15"
                          fill="none"
                          stroke="#5865f2"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${(item.progress / 100) * 94.2} 94.2`}
                          className="transition-all duration-200"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                        {item.progress}%
                      </span>
                    </div>
                    <span className="text-[9px] font-medium text-gray-300">
                      {item.status === 'processing' ? 'Lưu...' : 'Tải lên'}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <MediaPickerModal
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        maxFiles={maxFiles}
        initialSelectedUrls={previewUrls}
        onSelect={(urls) => {
          setPreviewUrls(urls);
          onUploadSuccess(urls);
        }}
      />
    </div>
  );
}
