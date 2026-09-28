"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, AlertOctagon, User, Clock, Check, X, ShieldAlert } from 'lucide-react';
import { safeFormatDate } from '@/admin-utils/dateUtils';

export interface ConflictInfo {
  message?: string;
  currentVersion?: number;
  updatedBy?: {
    id?: number | string;
    username?: string;
    fullName?: string;
    role?: string;
  };
  updatedAt?: string;
}

interface ConflictModalProps {
  isOpen: boolean;
  conflictInfo: ConflictInfo | null;
  onClose: () => void;
  onReload: () => void;
  onForceOverwrite: () => void;
  itemType?: string; // 'bài viết' | 'sản phẩm'
}

export function ConflictModal({
  isOpen,
  conflictInfo,
  onClose,
  onReload,
  onForceOverwrite,
  itemType = 'mục'
}: ConflictModalProps) {
  if (!isOpen || !conflictInfo) return null;

  const editorName = conflictInfo.updatedBy?.fullName || conflictInfo.updatedBy?.username || 'Một đồng nghiệp';
  const editorRole = conflictInfo.updatedBy?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên';
  const updatedTime = conflictInfo.updatedAt ? safeFormatDate(conflictInfo.updatedAt, 'HH:mm:ss dd/MM/yyyy') : 'Gần đây';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-[#1a1b23] w-full max-w-lg rounded-[12px] shadow-2xl border border-amber-300 dark:border-amber-800/80 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header with warning styling */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              Phát hiện xung đột chỉnh sửa đồng thời
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              {itemType.charAt(0).toUpperCase() + itemType.slice(1)} này vừa được cập nhật bởi một nhân viên khác!
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Trong thời gian bạn đang mở cửa sổ này, nội dung đã được chỉnh sửa và lưu trước bởi đồng nghiệp. Để bảo vệ dữ liệu không bị ghi đè ngoài ý muốn, hệ thống đã tạm ngưng lưu.
          </p>

          {/* Conflict details card */}
          <div className="bg-gray-50 dark:bg-[#20222a] border border-gray-200 dark:border-gray-700/80 rounded-[8px] p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" /> Người vừa lưu:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>{editorName}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                  {editorRole}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Thời gian lưu:
              </span>
              <span className="font-mono text-gray-800 dark:text-gray-200">
                {updatedTime}
              </span>
            </div>

            {conflictInfo.currentVersion !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Phiên bản trên máy chủ:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  v{conflictInfo.currentVersion}
                </span>
              </div>
            )}
          </div>

          <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-[8px] p-3 text-blue-900 dark:text-blue-200 text-[11px] leading-relaxed">
            💡 <strong>Khuyến nghị:</strong> Bạn nên chọn <strong>"Tải lại dữ liệu mới nhất"</strong> để xem các thay đổi của đồng nghiệp, sau đó mới tiếp tục bổ sung nội dung.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50/80 dark:bg-[#15161c] px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-[6px] border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Đóng xem lại
          </button>

          <button
            type="button"
            onClick={onForceOverwrite}
            className="w-full sm:w-auto px-4 py-2 rounded-[6px] border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            title="Ghi đè bằng dữ liệu đang soạn thảo hiện tại"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Vẫn lưu và ghi đè</span>
          </button>

          <button
            type="button"
            onClick={onReload}
            className="w-full sm:w-auto px-5 py-2 rounded-[6px] bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tải lại dữ liệu mới nhất</span>
          </button>
        </div>
      </div>
    </div>
  );
}
