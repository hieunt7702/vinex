import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import { handleCorsPreflight, getCorsHeaders } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

// Helper to remove sensitive password from returned user object
function sanitizeStaff(staff: any) {
  const { password, ...rest } = staff;
  return rest;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const role = searchParams.get('role')?.toUpperCase().trim() || '';
    const status = searchParams.get('status')?.toUpperCase().trim() || '';

    let staffList = store.staff || [];

    if (search) {
      staffList = staffList.filter((s: any) =>
        (s.fullName || '').toLowerCase().includes(search) ||
        (s.username || '').toLowerCase().includes(search) ||
        (s.email || '').toLowerCase().includes(search) ||
        (s.phone || '').toLowerCase().includes(search) ||
        (s.department || '').toLowerCase().includes(search)
      );
    }

    if (role && (role === 'ADMIN' || role === 'STAFF')) {
      staffList = staffList.filter((s: any) => s.role === role);
    }

    if (status && (status === 'ACTIVE' || status === 'INACTIVE')) {
      staffList = staffList.filter((s: any) => s.status === status);
    }

    // Sort from newest to oldest (by createdAt desc, fallback id desc)
    staffList.sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    return NextResponse.json(staffList.map(sanitizeStaff));
  } catch (error) {
    console.error('Failed to get staff:', error);
    return NextResponse.json({ message: 'Lỗi tải danh sách nhân viên' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, fullName, email, phone, role, department, status } = body;

    // Validations
    if (!username || !username.trim()) {
      return NextResponse.json({ message: 'Tên đăng nhập không được để trống' }, { status: 400 });
    }

    if (!password || password.length < 3) {
      return NextResponse.json({ message: 'Mật khẩu phải từ 3 ký tự trở lên' }, { status: 400 });
    }

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ message: 'Họ tên nhân viên không được để trống' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = (store.staff || []).find(
      (s: any) => (s.username || '').toLowerCase() === cleanUsername
    );

    if (existing) {
      return NextResponse.json({ message: 'Tên đăng nhập này đã tồn tại trên hệ thống' }, { status: 400 });
    }

    const validRole = role === 'ADMIN' ? 'ADMIN' : 'STAFF';
    const validStatus = status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const defaultPermissions = {
      products: true,
      articles: true,
      categories: true,
      media: true,
      leads: false,
      canDelete: false,
      canManageStaff: false,
    };

    const assignedPermissions = validRole === 'ADMIN'
      ? {
          products: true,
          articles: true,
          categories: true,
          media: true,
          leads: true,
          canDelete: true,
          canManageStaff: true,
        }
      : {
          ...defaultPermissions,
          ...(body.permissions || {})
        };

    const maxId = (store.staff || []).reduce((max: number, s: any) => Math.max(max, Number(s.id) || 0), 0);
    const newStaff = {
      id: maxId + 1,
      username: cleanUsername,
      password: String(password).trim(),
      fullName: fullName.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      role: validRole,
      status: validStatus,
      department: department?.trim() || (validRole === 'ADMIN' ? 'Ban Quản Trị' : 'Phòng Nội Dung'),
      permissions: assignedPermissions,
      lastLogin: null,
      createdAt: new Date().toISOString()
    };

    if (!store.staff) store.staff = [];
    store.staff.push(newStaff);
    savePersistedData();

    return NextResponse.json(sanitizeStaff(newStaff), { status: 201 });
  } catch (error: any) {
    console.error('Failed to create staff:', error);
    return NextResponse.json({ message: error.message || 'Lỗi tạo nhân viên mới' }, { status: 500 });
  }
}
