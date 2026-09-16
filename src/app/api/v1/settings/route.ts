import { NextResponse } from 'next/server';
import { mockSettings } from '@/admin-utils/mockData';

export async function GET() {
  return NextResponse.json(mockSettings);
}
