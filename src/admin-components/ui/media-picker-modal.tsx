"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, Images, FolderOpen, Check, X } from 'lucide-react';
import apiClient from '@/admin-lib/apiClient';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/admin-components/ui/dialog';
import { Button } from '@/admin-components/ui/button';

export interface MediaFile {
  id: number;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (urls: string[]) => void;
  maxFiles?: number;
  initialSelectedUrls?: string[];
}

export function MediaPickerModal({ open, onOpenChange, onSelect, maxFiles = 10, initialSelectedUrls = [] }: MediaPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/media');
      setMediaFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Lỗi khi tải thư viện Media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelectedUrls(initialSelectedUrls);
      setSearchTerm('');
      setCustomUrlInput('');
    }
  }, [open]);

  const filteredMedia = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          file.url.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory === 'cloudinary') {
      return file.url.includes('cloudinary.com') || file.type?.toLowerCase().includes('cloudinary');
    }
    if (selectedCategory === 'internal_product') {
      return file.url.includes('/images/product');
    }
    if (selectedCategory === 'internal_news') {
      return file.url.includes('/images/news') || file.url.includes('/images/banner');
    }
    return true;
  });

  const toggleSelect = (url: string) => {
    setSelectedUrls(prev => {
      if (prev.includes(url)) {
        return prev.filter(u => u !== url);
      }
      if (prev.length >= maxFiles) {
        toast.warning(`Chỉ được chọn tối đa ${maxFiles} ảnh`);
        return prev;
      }
      return [...prev, url];
    });
  };

  const handleAddCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) {
      toast.warning('Vui lòng nhập đường dẫn ảnh');
      return;
    }
    if (selectedUrls.length >= maxFiles) {
      toast.warning(`Chỉ được chọn tối đa ${maxFiles} ảnh`);
      return;
    }
    if (!selectedUrls.includes(trimmed)) {
      setSelectedUrls(prev => [...prev, trimmed]);
      toast.success('Đã thêm đường dẫn vào danh sách chọn');
    }
    setCustomUrlInput('');
  };

  const handleConfirm = () => {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onOpenChange(false);
    } else {
      toast.warning('Vui lòng chọn ít nhất một ảnh');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ fontFamily: 'Roboto, sans-serif' }} className="sm:max-w-[1000px] w-[95vw] h-[85vh] !p-0 flex flex-col bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[8px] overflow-hidden shadow-xl !outline-none focus:outline-none ring-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-[#14151a] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              Thư Viện Ảnh (Cloudinary &amp; Ảnh Nội Bộ)
            </DialogTitle>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên file hoặc URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 focus:border-[#5865f2]/40 text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-[#1a1b23]"
              />
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'cloudinary', label: '☁️ Cloudinary Upload' },
              { id: 'internal_product', label: '🥜 Ảnh Sản phẩm nội bộ' },
              { id: 'internal_news', label: '📰 Banner & Tin tức' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1 rounded-[4px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#5865f2] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Direct URL input bar */}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800/80">
            <input
              type="text"
              placeholder="Hoặc dán URL Cloudinary / đường dẫn nội bộ (VD: /images/product/Cashew1.png)..."
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomUrl(); } }}
              className="flex-1 px-3 py-1.5 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-xs focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddCustomUrl}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-[4px] transition-colors shrink-0 cursor-pointer"
            >
              + Thêm URL
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50 dark:bg-[#0b0c10]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredMedia.map((file) => {
                const isSelected = selectedUrls.includes(file.url);
                return (
                  <div
                    key={file.id}
                    onClick={() => toggleSelect(file.url)}
                    title={`${file.name}\n${file.url}`}
                    className={`relative aspect-square rounded-[6px] overflow-hidden cursor-pointer border transition-all group ${
                      isSelected ? 'border-[#5865f2] ring-[3px] ring-[#5865f2]/20' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-[#14151a]'
                    }`}
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] text-white truncate font-medium">{file.name}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-white rounded-full shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#5865f2]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <FolderOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" strokeWidth={1} />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Không tìm thấy ảnh</p>
              <p className="text-xs mt-1 text-gray-500">Thử tìm kiếm khác hoặc dán trực tiếp đường dẫn ảnh ở thanh trên.</p>
            </div>
          )}
        </div>

        <DialogFooter className="m-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-[#14151a] flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#5865f2]/10 rounded-[4px] border border-[#5865f2]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5865f2]"></span>
            <span className="text-sm font-medium text-[#5865f2]">
              Đã chọn: {selectedUrls.length}/{maxFiles}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose render={
              <Button variant="outline" className="h-10 px-5 text-sm font-medium rounded-[4px] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-[#1a1b23] hover:text-gray-900 dark:hover:text-white shadow-none transition-colors flex items-center gap-2">
                <X className="w-4 h-4" /> Hủy
              </Button>
            } />
            <Button
              onClick={handleConfirm}
              disabled={selectedUrls.length === 0}
              className="h-10 px-5 text-sm font-medium rounded-[4px] bg-[#5865f2] hover:bg-[#4752c4] text-white disabled:opacity-50 shadow-none transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Xác nhận chọn ảnh
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
