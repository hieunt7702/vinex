"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Check, Folder, ChevronRight, X, Layers } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug?: string;
  parentId?: number | null;
  type?: string;
}

interface CategoryTreeSelectProps {
  categories: Category[];
  selectedCategoryIds: number[];
  onChange: (selectedIds: number[]) => void;
  placeholder?: string;
}

export function CategoryTreeSelect({
  categories = [],
  selectedCategoryIds = [],
  onChange,
  placeholder = "Chọn phân loại danh mục..."
}: CategoryTreeSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside without blocking page scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Auto scroll into view when opened so it's never cut off
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      requestAnimationFrame(() => {
        dropdownRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }, [isOpen]);

  // Build tree & flat representation with depth level and breadcrumb path
  const { flatTree } = useMemo(() => {
    const map = new Map<number, Category>();
    categories.forEach(c => map.set(c.id, c));

    // build children map
    const childrenMap = new Map<number | null, Category[]>();
    categories.forEach(c => {
      const pId = c.parentId || null;
      if (!childrenMap.has(pId)) childrenMap.set(pId, []);
      childrenMap.get(pId)!.push(c);
    });

    const result: Array<{
      category: Category;
      level: number;
      path: string;
      hasChildren: boolean;
    }> = [];

    const traverse = (parentId: number | null, level: number, currentPath: string) => {
      const list = childrenMap.get(parentId) || [];
      list.forEach(c => {
        const fullPath = currentPath ? `${currentPath} > ${c.name}` : c.name;
        const children = childrenMap.get(c.id) || [];
        result.push({
          category: c,
          level,
          path: fullPath,
          hasChildren: children.length > 0
        });
        if (children.length > 0) {
          traverse(c.id, level + 1, fullPath);
        }
      });
    };

    traverse(null, 0, "");
    return { flatTree: result };
  }, [categories]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return flatTree;
    const q = searchQuery.toLowerCase();
    return flatTree.filter(item =>
      item.category.name.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q)
    );
  }, [flatTree, searchQuery]);

  const toggleCategory = (id: number) => {
    if (selectedCategoryIds.includes(id)) {
      onChange(selectedCategoryIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedCategoryIds, id]);
    }
  };

  const removeCategory = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedCategoryIds.filter(selectedId => selectedId !== id));
  };

  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If space below is limited (< 320px) and there's enough space above, flip upwards
      if (spaceBelow < 320 && rect.top > 250) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
    setIsOpen(prev => !prev);
  };

  // Selected items with paths
  const selectedDetails = useMemo(() => {
    return selectedCategoryIds
      .map(id => flatTree.find(item => item.category.id === id))
      .filter(Boolean);
  }, [selectedCategoryIds, flatTree]);

  return (
    <div ref={containerRef} className="space-y-2 relative">
      {/* Selected tags display */}
      <div
        onClick={handleToggle}
        className="min-h-[42px] p-2 bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] cursor-pointer hover:bg-white dark:hover:bg-[#20222a] transition-all flex flex-wrap items-center gap-1.5"
      >
        {selectedDetails.length > 0 ? (
          selectedDetails.map(item => item && (
            <span
              key={item.category.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 rounded-[4px] shadow-sm animate-in fade-in"
            >
              <Layers className="w-3 h-3 text-[#5865f2] shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white truncate max-w-[220px]" title={item.path}>
                {item.category.name}
              </span>
              <span className="text-[10px] text-gray-400 font-normal">
                (Cấp {item.level + 1})
              </span>
              <button
                type="button"
                onClick={(e) => removeCategory(item.category.id, e)}
                className="hover:text-rose-500 rounded p-0.5 text-gray-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400 pl-1">{placeholder}</span>
        )}
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute ${openUpwards ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} left-0 right-0 z-50 bg-white dark:bg-[#14151a] border border-gray-200 dark:border-gray-800 rounded-[6px] shadow-2xl p-3 space-y-2 animate-in fade-in duration-150 flex flex-col max-h-[380px]`}
        >
          {/* Search input (shrink-0) */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm danh mục phân cấp..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/30"
            />
          </div>

          {/* Tree list (flex-1 with internal scrollbar) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 divide-y divide-gray-100 dark:divide-gray-800/40 min-h-[140px] pr-1">
            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">
                Không tìm thấy danh mục nào phù hợp
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = selectedCategoryIds.includes(item.category.id);
                return (
                  <div
                    key={item.category.id}
                    onClick={() => toggleCategory(item.category.id)}
                    className={`flex items-center justify-between py-2 px-2.5 rounded-[4px] cursor-pointer text-xs transition-colors hover:bg-gray-100 dark:hover:bg-[#20222a] ${
                      isSelected ? "bg-[#5865f2]/10 dark:bg-[#5865f2]/20 font-medium" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0" style={{ paddingLeft: `${item.level * 18}px` }}>
                      <div
                        className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? "bg-[#5865f2] border-[#5865f2] text-white"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      {item.level === 0 ? (
                        <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <span className="text-gray-400 font-mono text-xs select-none">└──</span>
                      )}
                      <span className="text-gray-900 dark:text-gray-100 truncate">
                        {item.category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          item.level === 0
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                            : item.level === 1
                            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                            : "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                        }`}
                      >
                        Cấp {item.level + 1}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer (shrink-0) */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
            <span>Đã chọn: <strong className="text-gray-900 dark:text-white">{selectedCategoryIds.length}</strong> danh mục</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-[4px] text-xs font-medium cursor-pointer transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
