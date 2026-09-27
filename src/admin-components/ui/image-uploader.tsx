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
  errorMessage?: string;
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

    if (previewUrls.length + uploadingFiles.length + fileList.length > maxFiles) {
      setError(`Chỉ được tải lên tối đa ${maxFiles} ảnh. Bạn đã chọn ${previewUrls.length} ảnh.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setError("");
    setIsUploading(true);

    // Create an uploading box entry for each file immediately (e.g. 3 files -> 3 boxes)
    const newItems: UploadingFile[] = fileList.map((file, i) => ({
      id: `uploader_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const successfulUrls: string[] = [];

    // Upload each file individually to accurately track per-file progress percentage
    await Promise.all(
      newItems.map(async (item) => {
        const formData = new FormData();
        formData.append("files", item.file);

        try {
          const response = await axios.post('/api/upload/images', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || item.file.size;
              const percent = Math.min(98, Math.round((progressEvent.loaded * 100) / total));
              setUploadingFiles(current =>
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

            setUploadingFiles(current =>
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

    if (successfulUrls.length > 0) {
      setPreviewUrls((prev) => [...prev, ...successfulUrls]);
      onUploadSuccess(successfulUrls);
      toast.success(`Đã thêm thành công ${successfulUrls.length} ảnh`);
    }

    setTimeout(() => {
      setUploadingFiles(current => current.filter(it => it.status !== 'success'));
      setIsUploading(false);
    }, 800);
  };

  const handleDismissUploadingItem = (id: string) => {
    setUploadingFiles(current => current.filter(it => it.id !== id));
  };

  const removeImage = (indexToRemove: number) => {
    const urlToRemove = previewUrls[indexToRemove];
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (onRemoveImage) onRemoveImage(urlToRemove);
  };

  const remainingFiles = Math.max(0, maxFiles - previewUrls.length - uploadingFiles.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 w-full relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={isUploading || remainingFiles === 0}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-[4px] bg-gray-50 dark:bg-[#1a1b23] hover:bg-gray-100 dark:hover:bg-[#262930] transition-colors focus:outline-none ${remainingFiles === 0 ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 dark:text-gray-400">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-3 animate-spin text-blue-500" />
            ) : (
              <div className="p-3 bg-white dark:bg-[#2a2d36] rounded-full mb-3 border border-gray-100 dark:border-gray-800">
                <UploadCloud className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
            )}
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium text-blue-600 dark:text-blue-400">Nhấn để thêm ảnh mới</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Hỗ trợ PNG, JPG, WEBP (Tối đa {maxFiles} file • Còn lại: {remainingFiles})
            </p>
          </div>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
            <div className="absolute bottom-[135px] left-1/2 -translate-x-1/2 z-50 w-64 bg-white dark:bg-[#14151a] p-1.5 shadow-md shadow-black/5 dark:shadow-none border border-gray-200 dark:border-gray-800 rounded-lg animate-in zoom-in-95 slide-in-from-bottom-2 duration-100">
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
                Chọn từ thư viện hệ thống
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

      {/* Images List + Live Uploading Boxes */}
      {(previewUrls.length > 0 || uploadingFiles.length > 0) && (
        <div className="flex flex-wrap gap-4 mt-4">
          {/* 1. Existing uploaded images */}
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative w-28 h-28 rounded-[6px] border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1a1b23] group shadow-sm">
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1.5 bg-white/80 dark:bg-black/50 hover:bg-red-500 rounded-[4px] text-gray-700 dark:text-gray-300 hover:text-white transition-all shadow-sm backdrop-blur-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* 2. Actively uploading boxes with real-time percentage */}
          {uploadingFiles.map((item) => (
            <div
              key={item.id}
              className={`relative w-28 h-28 rounded-[6px] border-2 overflow-hidden shadow-md transition-all ${
                item.status === 'error'
                  ? 'border-rose-500 bg-rose-950/20'
                  : item.status === 'success'
                  ? 'border-emerald-500 bg-emerald-950/20'
                  : 'border-[#5865f2] bg-gray-900'
              }`}
            >
              {/* Local image thumbnail */}
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="w-full h-full object-cover opacity-40 scale-105 filter blur-[0.5px]"
              />

              {/* Progress Overlay */}
              <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col justify-between p-2 text-white">
                {/* Header */}
                <div className="flex items-center justify-between w-full text-[10px]">
                  <span className="truncate max-w-[70%] font-medium text-gray-200" title={item.file.name}>
                    {item.file.name}
                  </span>
                  {item.status === 'error' && (
                    <button
                      type="button"
                      onClick={() => handleDismissUploadingItem(item.id)}
                      className="p-0.5 rounded hover:bg-rose-500/30 text-rose-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Center Percentage Display */}
                <div className="flex flex-col items-center justify-center gap-0.5 my-auto">
                  {item.status === 'error' ? (
                    <div className="flex flex-col items-center gap-0.5 text-rose-400 text-center">
                      <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />
                      <span className="text-[9px] font-semibold text-rose-300">Lỗi</span>
                    </div>
                  ) : item.status === 'success' ? (
                    <div className="flex flex-col items-center gap-0.5 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                      <span className="text-[10px] font-bold text-emerald-300">100% Xong</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="relative flex items-center justify-center">
                        <Loader2 className="w-7 h-7 animate-spin text-[#5865f2]" />
                        <span className="absolute text-[9px] font-extrabold text-white font-mono">
                          {item.progress}%
                        </span>
                      </div>
                      <span className="text-[9px] font-medium text-gray-300">
                        {item.status === 'processing' ? 'Lưu ảnh...' : `${item.progress}%`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Progress Bar */}
                <div className="w-full">
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
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
