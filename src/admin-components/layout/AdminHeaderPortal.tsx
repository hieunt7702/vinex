"use client";
import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAdminHeaderStore } from "@/admin-stores/useAdminHeaderStore";

interface AdminHeaderPortalProps {
  title: string;
  description?: string;
  search?: ReactNode;
  actions?: ReactNode;
}

export function AdminHeaderPortal({
  title,
  description,
  search,
  actions,
}: AdminHeaderPortalProps) {
  const setHeader = useAdminHeaderStore((s) => s.setHeader);
  const resetHeader = useAdminHeaderStore((s) => s.resetHeader);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // Sync title & description to global header
  useEffect(() => {
    setHeader({ title, description });
  }, [title, description, setHeader]);

  // Reset header back to default only when unmounting the page
  useEffect(() => {
    return () => {
      resetHeader();
    };
  }, [resetHeader]);

  // Find portal target in DOM
  useEffect(() => {
    const el = document.getElementById("admin-header-actions-portal");
    if (el) {
      setPortalTarget(el);
    }
  }, []);

  if (!portalTarget || (!search && !actions)) {
    return null;
  }

  return createPortal(
    <>
      {search}
      {actions}
    </>,
    portalTarget
  );
}
