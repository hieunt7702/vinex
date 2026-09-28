export interface AuditUser {
  id: number | string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'STAFF' | string;
}

/**
 * Extracts staff/admin user info from incoming HTTP request headers or body payload
 */
export function getUserFromRequest(request: Request, body?: any): AuditUser {
  // 1. From body if explicitly passed
  if (body?.currentUser?.username) return body.currentUser;
  if (body?.updatedBy?.username) return body.updatedBy;
  if (body?.createdBy?.username) return body.createdBy;

  // 2. From headers (injected by apiClient)
  const id = request.headers.get('x-user-id');
  const rawUsername = request.headers.get('x-user-username');
  const rawFullName = request.headers.get('x-user-fullname');
  const role = request.headers.get('x-user-role');

  if (rawUsername) {
    try {
      return {
        id: id ? Number(id) || id : 1,
        username: decodeURIComponent(rawUsername),
        fullName: rawFullName ? decodeURIComponent(rawFullName) : decodeURIComponent(rawUsername),
        role: role || 'STAFF'
      };
    } catch (e) {
      // ignore
    }
  }

  // 3. Fallback default
  return {
    id: 1,
    username: 'admin',
    fullName: 'Quản trị viên Hệ thống',
    role: 'ADMIN'
  };
}

/**
 * Checks for concurrent editing conflicts between staff members.
 * Prevents accidental data overwriting when multiple staff edit the same item.
 */
export function checkConcurrencyConflict(existingRecord: any, incomingData: any) {
  if (!existingRecord || incomingData.forceOverwrite) {
    return null;
  }

  // 1. Version-based conflict detection
  if (
    incomingData.lastModifiedVersion !== undefined &&
    existingRecord.version !== undefined &&
    Number(existingRecord.version) > Number(incomingData.lastModifiedVersion)
  ) {
    const editorName = existingRecord.updatedBy?.fullName || existingRecord.updatedBy?.username || 'nhân viên khác';
    return {
      conflict: true,
      message: `Nội dung này vừa được cập nhật bởi ${editorName}. Vui lòng kiểm tra để tránh ghi đè dữ liệu của đồng nghiệp!`,
      currentVersion: existingRecord.version,
      updatedBy: existingRecord.updatedBy,
      updatedAt: existingRecord.updatedAt,
    };
  }

  // 2. Timestamp-based conflict detection (if client's base timestamp is older than server's latest update by > 2s)
  if (
    incomingData.lastUpdatedAt &&
    existingRecord.updatedAt &&
    new Date(existingRecord.updatedAt).getTime() - new Date(incomingData.lastUpdatedAt).getTime() > 2000
  ) {
    const editorName = existingRecord.updatedBy?.fullName || existingRecord.updatedBy?.username || 'nhân viên khác';
    return {
      conflict: true,
      message: `Nội dung này vừa được cập nhật bởi ${editorName}. Vui lòng kiểm tra để tránh ghi đè dữ liệu của đồng nghiệp!`,
      currentVersion: existingRecord.version || 1,
      updatedBy: existingRecord.updatedBy,
      updatedAt: existingRecord.updatedAt,
    };
  }

  return null;
}
