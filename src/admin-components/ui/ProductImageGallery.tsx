"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { 
  Loader2, 
  UploadCloud, 
  X, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Image as ImageIcon, 
  MonitorUp, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";
import { toast } from "sonner";

interface ProductImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

interface UploadingItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}

export function ProductImageGallery({ images = [], onChange, maxImages = 12 }: ProductImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingItems, setUploadingItems] = useState<UploadingItem[]>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    if (images.length + uploadingItems.length + fileList.length > maxImages) {
      toast.error(`Chỉ được tải lên tối đa ${maxImages} ảnh. Hiện tại đã có ${images.length} ảnh.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Create an uploading box entry for each file immediately
    const newItems: UploadingItem[] = fileList.map((file, i) => ({
      id: `upload_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading'
    }));

    setUploadingItems(prev => [...prev, ...newItems]);
    setIsUploading(true);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const successfulUrls: string[] = [];

    // Upload each file individually to accurately track per-file progress percentage
    await Promise.all(
      newItems.map(async (item) => {
        const formData = new FormData();
        formData.append("files", item.file);

        try {
          const response = await axios.post('/api/upload/images', formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || item.file.size;
              const percent = Math.min(98, Math.round((progressEvent.loaded * 100) / total));
              setUploadingItems(current =>
                current.map(it => 
                  it.id === item.id 
                    ? { ...it, progress: percent, status: percent >= 95 ? 'processing' : 'uploading' } 
                    : it
                )
              );
            }
          });

          const uploadedUrls = response.data as string[];
          if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
            const finalUrl = uploadedUrls[0];
            successfulUrls.push(finalUrl);

            setUploadingItems(current =>
              current.map(it => 
                it.id === item.id 
                  ? { ...it, progress: 100, status: 'success' } 
                  : it
              )
            );
          } else {
            throw new Error("Không nhận được URL từ server");
          }
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || "Tải ảnh thất bại";
          setUploadingItems(current =>
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

    // Merge successful uploads into product gallery
    if (successfulUrls.length > 0) {
      onChange([...images, ...successfulUrls]);
      toast.success(`Đã tải lên thành công ${successfulUrls.length} ảnh`);
    }

    // Clean up successful uploading boxes after short display
    setTimeout(() => {
      setUploadingItems(current => current.filter(it => it.status !== 'success'));
      setIsUploading(false);
    }, 800);
  };

  const handleDismissUploadingItem = (id: string) => {
    setUploadingItems(current => current.filter(it => it.id !== id));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    onChange(newImages);
    toast.success("Đã chọn làm ảnh đại diện chính");
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    onChange(newImages);
  };

  const handleRemove = (indexToRemove: number) => {
    const newImages = images.filter((_, idx) => idx !== indexToRemove);
    onChange(newImages);
    toast.info("Đã xóa ảnh khỏi danh sách");
  };

  const handleMediaPickerSelect = (urls: string[]) => {
    const newUrls = urls.filter(u => !images.includes(u));
    const combined = [...images, ...newUrls].slice(0, maxImages);
    onChange(combined);
  };

  const totalSlotUsed = images.length + uploadingItems.length;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Thư viện ảnh sản phẩm ({images.length}/{maxImages})
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
            ⭐ Ảnh đầu tiên là Ảnh chính (Cover)
          </span>
          {uploadingItems.length > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40 animate-pulse font-medium">
              Đang tải {uploadingItems.length} ảnh...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || totalSlotUsed >= maxImages}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#1a1b23] hover:bg-gray-200 dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-xs font-medium border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" /> : <MonitorUp className="w-3.5 h-3.5" />}
            Tải từ máy tính
          </button>
          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            disabled={totalSlotUsed >= maxImages}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865f2]/10 hover:bg-[#5865f2]/20 text-[#5865f2] rounded-[4px] text-xs font-medium border border-[#5865f2]/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Chọn từ Media
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Image Grid with both existing images and uploading boxes */}
      {images.length > 0 || uploadingItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {/* 1. Existing Gallery Images */}
          {images.map((url, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={url + idx}
                className={`group relative rounded-[6px] overflow-hidden border transition-all shadow-sm aspect-square bg-gray-50 dark:bg-[#1a1b23] ${
                  isPrimary
                    ? "border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                {/* Main image */}
                <img
                  src={url}
                  alt={`Product img ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
                  {isPrimary ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold bg-amber-500 text-white shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Ảnh chính
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(url)}
                      title="Xem ảnh lớn"
                      className="p-1.5 rounded-[4px] bg-black/50 hover:bg-black/70 text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      title="Xóa ảnh này"
                      className="p-1.5 rounded-[4px] bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'left')}
                        title="Di chuyển sang trái"
                        className="p-1 rounded-[4px] bg-black/50 hover:bg-black/70 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => handleMove(idx, 'right')}
                        title="Di chuyển sang phải"
                        className="p-1 rounded-[4px] bg-black/50 hover:bg-black/70 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-medium rounded-[4px] flex items-center gap-1 transition-colors"
                      >
                        <Star className="w-3 h-3" /> Đặt làm ảnh chính
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 2. Actively Uploading Boxes with Real-time Percentage & Preview */}
          {uploadingItems.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-[6px] overflow-hidden aspect-square border-2 shadow-md transition-all ${
                item.status === 'error'
                  ? 'border-rose-500 bg-rose-950/20'
                  : item.status === 'success'
                  ? 'border-emerald-500 bg-emerald-950/20'
                  : 'border-[#5865f2] bg-gray-900'
              }`}
            >
              {/* Local instant thumbnail preview */}
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="w-full h-full object-cover opacity-40 scale-105 filter blur-[0.5px]"
              />

              {/* Progress Overlay */}
              <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col justify-between p-2.5 text-white">
                {/* File info header */}
                <div className="flex items-center justify-between w-full text-[11px]">
                  <span className="truncate max-w-[70%] font-medium text-gray-200" title={item.file.name}>
                    {item.file.name}
                  </span>
                  {item.status === 'error' ? (
                    <button
                      type="button"
                      onClick={() => handleDismissUploadingItem(item.id)}
                      className="p-0.5 rounded hover:bg-rose-500/30 text-rose-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono">
                      {(item.file.size / 1024).toFixed(0)} KB
                    </span>
                  )}
                </div>

                {/* Center loading & percentage indicator */}
                <div className="flex flex-col items-center justify-center gap-1 my-auto">
                  {item.status === 'error' ? (
                    <div className="flex flex-col items-center gap-1 text-rose-400 text-center">
                      <AlertCircle className="w-7 h-7 text-rose-500 animate-pulse" />
                      <span className="text-[11px] font-semibold text-rose-300 line-clamp-1">
                        {item.errorMessage || 'Lỗi tải ảnh'}
                      </span>
                    </div>
                  ) : item.status === 'success' ? (
                    <div className="flex flex-col items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                      <span className="text-[11px] font-bold text-emerald-300">Hoàn tất 100%</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative flex items-center justify-center">
                        <Loader2 className="w-9 h-9 animate-spin text-[#5865f2]" />
                        <span className="absolute text-[11px] font-extrabold text-white font-mono">
                          {item.progress}%
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-300 mt-0.5">
                        {item.status === 'processing' ? 'Đang lưu Cloudinary...' : `Đang tải lên ${item.progress}%`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Progress Bar */}
                <div className="w-full space-y-1">
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        item.status === 'error'
                          ? 'bg-rose-500'
                          : item.status === 'success'
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-[#5865f2]'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[6px] bg-gray-50/50 dark:bg-[#1a1b23]/50 hover:bg-gray-50 dark:hover:bg-[#1a1b23] transition-colors cursor-pointer"
        >
          <div className="p-3 bg-white dark:bg-[#252830] rounded-full border border-gray-200 dark:border-gray-700 mb-3 shadow-sm">
            <UploadCloud className="w-6 h-6 text-[#5865f2]" />
          </div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
            Chưa có hình ảnh nào cho sản phẩm này
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Tải lên nhiều hình ảnh để khách hàng xem chi tiết từng góc độ (Hỗ trợ JPG, PNG, WEBP)
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-xs font-medium transition-colors"
          >
            Tải ảnh lên ngay
          </button>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-lg bg-black" onClick={(e) => e.stopPropagation()}>
            <img src={previewModalUrl} alt="Preview large" className="w-full h-full object-contain max-h-[80vh]" />
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        maxFiles={maxImages}
        initialSelectedUrls={images}
        onSelect={handleMediaPickerSelect}
      />
    </div>
  );
}
