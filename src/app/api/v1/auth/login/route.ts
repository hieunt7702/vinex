import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../../store';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Vui lòng nhập tài khoản và mật khẩu' },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Check in staff list
    let staff = (store.staff || []).find(
      (s: any) => (s.username || '').toLowerCase() === cleanUsername
    );

    // Fallback: if username is 'admin' and password is 'admin', auto match admin staff
    if (!staff && cleanUsername === 'admin' && cleanPassword === 'admin') {
      staff = {
        id: 1,
        username: 'admin',
        password: 'admin',
        fullName: 'Quản trị viên Hệ thống',
        email: 'admin@vinex.vn',
        phone: '0901234567',
        role: 'ADMIN',
        status: 'ACTIVE',
        department: 'Ban Điều Hành',
        lastLogin: new Date().toISOString()
      };
      if (!store.staff) store.staff = [];
      store.staff.unshift(staff);
      savePersistedData();
    }

    if (!staff || staff.password !== cleanPassword) {
      return NextResponse.json(
        { message: 'Tài khoản hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Check active status
    if (staff.status === 'INACTIVE') {
      return NextResponse.json(
        { message: 'Tài khoản nhân viên này đang bị khóa. Vui lòng liên hệ Quản trị viên.' },
        { status: 403 }
      );
    }

    // Update lastLogin
    staff.lastLogin = new Date().toISOString();
    savePersistedData();

    const userProfile = {
      id: staff.id,
      username: staff.username,
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role || 'STAFF',
      status: staff.status || 'ACTIVE',
      department: staff.department || 'Nhân sự',
      permissions: staff.permissions || (staff.role === 'ADMIN' ? {
        products: true,
        articles: true,
        categories: true,
        media: true,
        leads: true,
        canDelete: true,
        canManageStaff: true
      } : {
        products: true,
        articles: true,
        categories: true,
        media: true,
        leads: false,
        canDelete: false,
        canManageStaff: false
      })
    };

    const accessToken = `vinex-token-${staff.role.toLowerCase()}-${staff.id}-${Date.now()}`;

    return NextResponse.json({
      user: userProfile,
      accessToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Lỗi hệ thống khi đăng nhập' }, { status: 500 });
  }
}
