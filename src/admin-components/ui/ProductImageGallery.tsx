"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { Loader2, UploadCloud, X, Star, ArrowLeft, ArrowRight, Eye, Image as ImageIcon, MonitorUp, AlertCircle } from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";
import { toast } from "sonner";

interface ProductImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ProductImageGallery({ images = [], onChange, maxImages = 12 }: ProductImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Chỉ được tải lên tối đa ${maxImages} ảnh. Hiện tại đã có ${images.length} ảnh.`);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post('/api/upload/images', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrls = response.data as string[];
      if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
        toast.success(`Đã thêm thành công ${uploadedUrls.length} ảnh`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Tải ảnh thất bại");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
    // Add unique urls that are not yet in images
    const newUrls = urls.filter(u => !images.includes(u));
    const combined = [...images, ...newUrls].slice(0, maxImages);
    onChange(combined);
  };

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
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || images.length >= maxImages}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#1a1b23] hover:bg-gray-200 dark:hover:bg-[#262930] text-gray-700 dark:text-gray-200 rounded-[4px] text-xs font-medium border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MonitorUp className="w-3.5 h-3.5" />}
            Tải từ máy tính
          </button>
          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            disabled={images.length >= maxImages}
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

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
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
