import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../../store';
import { handleCorsPreflight, getCorsHeaders } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

function sanitizeStaff(staff: any) {
  const { password, ...rest } = staff;
  return rest;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = Number(id);

    const staff = (store.staff || []).find((s: any) => s.id === staffId);
    if (!staff) {
      return NextResponse.json({ message: 'Không tìm thấy nhân viên' }, { status: 404 });
    }

    return NextResponse.json(sanitizeStaff(staff));
  } catch (error) {
    console.error('Failed to get staff by id:', error);
    return NextResponse.json({ message: 'Lỗi tải thông tin nhân viên' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = Number(id);
    const body = await request.json();

    const staffIndex = (store.staff || []).findIndex((s: any) => s.id === staffId);
    if (staffIndex === -1) {
      return NextResponse.json({ message: 'Không tìm thấy nhân viên' }, { status: 404 });
    }

    const currentStaff = store.staff[staffIndex];

    // If changing role or status, ensure at least one active ADMIN remains in system
    if (
      currentStaff.role === 'ADMIN' &&
      ((body.role && body.role !== 'ADMIN') || (body.status && body.status === 'INACTIVE'))
    ) {
      const activeAdminCount = (store.staff || []).filter(
        (s: any) => s.role === 'ADMIN' && s.status === 'ACTIVE' && s.id !== staffId
      ).length;

      if (activeAdminCount === 0) {
        return NextResponse.json(
          { message: 'Không thể hạ quyền hoặc khóa Quản trị viên duy nhất của hệ thống' },
          { status: 400 }
        );
      }
    }

    // Update fields
    if (body.fullName !== undefined) currentStaff.fullName = String(body.fullName).trim();
    if (body.email !== undefined) currentStaff.email = String(body.email).trim();
    if (body.phone !== undefined) currentStaff.phone = String(body.phone).trim();
    if (body.department !== undefined) currentStaff.department = String(body.department).trim();
    if (body.role && (body.role === 'ADMIN' || body.role === 'STAFF')) {
      currentStaff.role = body.role;
    }
    if (body.status && (body.status === 'ACTIVE' || body.status === 'INACTIVE')) {
      currentStaff.status = body.status;
    }
    if (body.permissions !== undefined) {
      currentStaff.permissions = {
        ...(currentStaff.permissions || {}),
        ...body.permissions
      };
    }
    if (currentStaff.role === 'ADMIN') {
      currentStaff.permissions = {
        products: true,
        articles: true,
        categories: true,
        media: true,
        leads: true,
        canDelete: true,
        canManageStaff: true,
      };
    }
    // Update password if provided
    if (body.password && String(body.password).trim().length >= 3) {
      currentStaff.password = String(body.password).trim();
    }

    currentStaff.updatedAt = new Date().toISOString();
    store.staff[staffIndex] = currentStaff;
    savePersistedData();

    return NextResponse.json(sanitizeStaff(currentStaff));
  } catch (error: any) {
    console.error('Failed to update staff:', error);
    return NextResponse.json({ message: error.message || 'Lỗi cập nhật nhân viên' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = Number(id);

    const staffIndex = (store.staff || []).findIndex((s: any) => s.id === staffId);
    if (staffIndex === -1) {
      return NextResponse.json({ message: 'Không tìm thấy nhân viên' }, { status: 404 });
    }

    const currentStaff = store.staff[staffIndex];

    // Protect primary root admin
    if (currentStaff.id === 1 || currentStaff.username === 'admin') {
      return NextResponse.json(
        { message: 'Không được phép xóa tài khoản Quản trị viên gốc (admin)' },
        { status: 400 }
      );
    }

    // Protect last active admin
    if (currentStaff.role === 'ADMIN') {
      const activeAdminCount = (store.staff || []).filter(
        (s: any) => s.role === 'ADMIN' && s.id !== staffId
      ).length;

      if (activeAdminCount === 0) {
        return NextResponse.json(
          { message: 'Hệ thống cần ít nhất một Quản trị viên (ADMIN)' },
          { status: 400 }
        );
      }
    }

    store.staff.splice(staffIndex, 1);
    savePersistedData();

    return NextResponse.json({ success: true, message: 'Đã xóa nhân viên thành công' });
  } catch (error) {
    console.error('Failed to delete staff:', error);
    return NextResponse.json({ message: 'Lỗi xóa nhân viên' }, { status: 500 });
  }
}
