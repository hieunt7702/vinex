"use client";

import React, { Suspense } from 'react';
import { CustomerInquiryForm } from './CustomerInquiryForm';
import { Loader2 } from 'lucide-react';

interface ContactFormProps {
  submitText?: string;
  initialPurpose?: any;
  initialProduct?: string;
  initialProducts?: any[];
  sourceContext?: string;
  initialSettings?: any;
}

export function ContactForm({
  submitText,
  initialPurpose,
  initialProduct,
  initialProducts,
  sourceContext = 'Website - Trang Liên Hệ',
  initialSettings
}: ContactFormProps) {
  return (
    <Suspense
      fallback={
        <div className="py-12 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#074751] mb-2" />
          <span className="text-sm">Đang tải biểu mẫu liên hệ...</span>
        </div>
      }
    >
      <CustomerInquiryForm
        submitButtonText={submitText}
        initialPurpose={initialPurpose}
        initialProduct={initialProduct}
        initialProducts={initialProducts}
        sourceContext={sourceContext}
        initialSettings={initialSettings}
      />
    </Suspense>
  );
}
