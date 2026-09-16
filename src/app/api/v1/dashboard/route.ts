import { NextResponse } from 'next/server';
import { store } from '../store';
import { mockDashboardChartData } from '@/admin-utils/mockData';

export async function GET() {
  return NextResponse.json({
    stats: store.stats,
    chartData: mockDashboardChartData
  });
}
