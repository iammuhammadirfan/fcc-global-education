import { db } from './db';
import { getSessionCookie, verifyToken } from './auth';
import { AuditLogEntry } from './types';

export async function getClientActor(request?: Request): Promise<{
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  ip: string;
  userAgent: string;
}> {
  let ip = '127.0.0.1';
  let userAgent = 'Browser';

  if (request) {
    ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    userAgent = request.headers.get('user-agent') || 'Browser';
  }

  try {
    const token = await getSessionCookie();
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const users = (await db.getTable('users')) || [];
        const found = users.find((u) => u.id === decoded.userId);
        return {
          userId: decoded.userId,
          userEmail: decoded.email,
          userRole: decoded.role,
          userName: found?.name || decoded.email,
          ip,
          userAgent,
        };
      }
    }
  } catch (err) {
    // Session token extraction failure
  }

  return {
    userId: 'system',
    userName: 'Public / Visitor',
    userEmail: 'visitor@website',
    userRole: 'public',
    ip,
    userAgent,
  };
}

export async function logActivity(entry: {
  action: AuditLogEntry['action'];
  entity: string;
  entityId?: string;
  details: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  ip?: string;
  userAgent?: string;
  metadata?: any;
}) {
  try {
    let logs = (await db.getTable('auditLogs' as any)) || [];
    if (!Array.isArray(logs)) logs = [];

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      details: entry.details,
      userId: entry.userId || 'system',
      userName: entry.userName || 'System / Administrator',
      userEmail: entry.userEmail,
      userRole: entry.userRole || 'admin',
      ip: entry.ip || '127.0.0.1',
      userAgent: entry.userAgent || 'Web Console',
      metadata: entry.metadata,
    };

    logs.unshift(newLog); // Newest on top
    if (logs.length > 2000) {
      logs = logs.slice(0, 2000);
    }

    await db.updateTable('auditLogs' as any, logs);
    return newLog;
  } catch (err) {
    console.error('Failed to append immutable audit log:', err);
    return null;
  }
}
