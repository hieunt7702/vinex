"use client";
import { useConfirm } from '@/hooks/useConfirm';
import React, { useState, useEffect } from 'react';
import {
  Search, Image as ImageIcon, UploadCloud, Trash2,
  Link as LinkIcon, CheckCircle2, Loader2, CheckSquare, Square, X
} from 'lucide-react';
import { ImageUploader } from '@/admin-components/ui/image-uploader';
import apiClient from '@/admin-lib/apiClient';
import { safeFormatDate } from '@/admin-utils/dateUtils';
import { toast } from 'sonner';
import { AdminHeaderPortal } from '@/admin-components/layout/AdminHeaderPortal';

interface MediaFile {
  id: string;
  url: string;
  name: string;
  size: number;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const { confirm } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/media');
      setMediaFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Lỗi khi tải dữ liệu Media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = mediaFiles.filter(file =>
    file.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa file này khỏi hệ thống?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/media/${encodeURIComponent(id)}`);
          setMediaFiles(prev => prev.filter(f => String(f.id) !== String(id)));
          setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
          toast.success('Xóa ảnh thành công');
        } catch (error: any) {
          const msg = error?.response?.data?.message || 'Lỗi khi xóa ảnh';
          toast.error(msg);
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    confirm({
      title: `Xóa ${selectedIds.size} ảnh đã chọn?`,
      description: 'Hành động này không thể hoàn tác. Tất cả ảnh đã chọn sẽ bị xóa vĩnh viễn.',
      variant: 'danger',
      onConfirm: async () => {
        setIsBulkDeleting(true);
        const ids = Array.from(selectedIds);

        try {
          // Single request — server handles everything in parallel DB calls
          const res = await apiClient.delete('/media', { data: { ids } });
          const deleted: number = res.data?.deleted ?? ids.length;

          setMediaFiles(prev => prev.filter(f => !selectedIds.has(String(f.id))));
          setSelectedIds(new Set());
          toast.success(`Đã xóa ${deleted} ảnh thành công`);
        } catch (err: any) {
          const msg = err?.response?.data?.message || 'Lỗi khi xóa ảnh';
          toast.error(msg);
        } finally {
          setIsBulkDeleting(false);
        }
      }
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMedia.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMedia.map(f => String(f.id))));
    }
  };

  const handleUploadSuccess = () => {
    setTimeout(() => fetchMedia(), 600);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '–';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const allFilteredSelected = filteredMedia.length > 0 && selectedIds.size === filteredMedia.length;
  const someSelected = selectedIds.size > 0;

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminHeaderPortal
        title="Thư Viện Media"
        description="Quản lý tập trung toàn bộ hình ảnh và tài nguyên thương hiệu"
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-[220px] sm:w-[280px] bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-sm focus:outline-none focus:ring-[3px] focus:ring-[#5865f2]/20 text-gray-900 dark:text-white transition-all shadow-xs"
            />
          </div>
        }
      />

      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#14151a] rounded-[4px] border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Upload section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] flex-shrink-0">
          <h3 className="text-sm font-medium text-[#5865f2] uppercase tracking-wider mb-4 flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload hình ảnh mới
          </h3>
          <div className="max-w-xl">
            <ImageUploader
              initialImages={[]}
              onUploadSuccess={handleUploadSuccess}
              onRemoveImage={() => {}}
              maxFiles={10}
            />
          </div>
        </div>

        {/* Bulk action toolbar */}
        {someSelected && (
          <div className="flex items-center gap-3 px-6 py-3 bg-[#5865f2]/5 border-b border-[#5865f2]/20 flex-shrink-0">
            <span className="text-sm font-medium text-[#5865f2]">
              Đã chọn {selectedIds.size} ảnh
            </span>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white text-sm font-medium rounded-[4px] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isBulkDeleting
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xóa {selectedIds.size} ảnh…</>
                : <><Trash2 className="w-3.5 h-3.5" /> Xóa {selectedIds.size} ảnh</>
              }
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="flex items-center gap-1 px-2.5 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Bỏ chọn
            </button>
          </div>
        )}

        {/* Media grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : filteredMedia.length > 0 ? (
            <>
              {/* Select all row */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  {allFilteredSelected
                    ? <CheckSquare className="w-4 h-4 text-[#5865f2]" />
                    : <Square className="w-4 h-4" />
                  }
                  {allFilteredSelected ? 'Bỏ chọn tất cả' : `Chọn tất cả (${filteredMedia.length})`}
                </button>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {filteredMedia.length} ảnh
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMedia.map((file) => {
                  const isSelected = selectedIds.has(String(file.id));
                  return (
                    <div
                      key={file.id}
                      className={`group flex flex-col rounded-[6px] overflow-hidden border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#5865f2] ring-2 ring-[#5865f2]/20 bg-[#5865f2]/5 dark:bg-[#5865f2]/10'
                          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#14151a] hover:border-[#5865f2]/40'
                      }`}
                      onClick={() => toggleSelect(String(file.id))}
                    >
                      <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-[#1a1b23] border-b border-gray-200 dark:border-gray-800">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Selection overlay */}
                        <div className={`absolute inset-0 transition-opacity ${isSelected ? 'bg-[#5865f2]/15' : 'bg-transparent'}`} />

                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#5865f2] flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}

                        {/* Hover action buttons */}
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleCopyLink(file.url, String(file.id))}
                            className="w-8 h-8 rounded-full bg-white/90 dark:bg-[#14151a]/80 hover:bg-[#5865f2] text-gray-700 dark:text-gray-200 hover:text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer shadow-sm"
                            title="Copy link"
                          >
                            {copiedId === String(file.id) ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(String(file.id))}
                            className="w-8 h-8 rounded-full bg-white/90 dark:bg-[#14151a]/80 hover:bg-red-500 text-gray-700 dark:text-gray-200 hover:text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer shadow-sm"
                            title="Xóa ảnh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5">
                        <p className="text-[11px] font-medium text-gray-900 dark:text-white truncate" title={file.name}>{file.name}</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                          <span>{formatSize(file.size)}</span>
                          <span>{safeFormatDate(file.createdAt, 'dd/MM/yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-800">
                <ImageIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-base font-medium text-gray-900 dark:text-white">Không tìm thấy file media</p>
              <p className="text-sm mt-1">Vui lòng thử từ khóa tìm kiếm khác hoặc upload ảnh mới.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
