import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionCookie, verifyToken } from '@/lib/auth';
import { AuditLogEntry } from '@/lib/types';

// Helper to seed initial logs if table is empty
async function getOrSeedAuditLogs(): Promise<AuditLogEntry[]> {
  let logs = (await db.getTable('auditLogs' as any)) || [];
  if (!Array.isArray(logs) || logs.length === 0) {
    const now = Date.now();
    logs = [
      {
        id: `log_init_1`,
        timestamp: new Date(now - 1000 * 60 * 15).toISOString(),
        userId: 'usr_super_admin',
        userName: 'Dr. Evelyn Montgomery',
        userEmail: 'admin@fccglobaleducation.com',
        userRole: 'super_admin',
        action: 'LOGIN',
        entity: 'Auth',
        details: 'Super Administrator logged into FCC Global Education Admin Portal',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
      },
      {
        id: `log_init_2`,
        timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
        userId: 'usr_super_admin',
        userName: 'Dr. Evelyn Montgomery',
        userEmail: 'admin@fccglobaleducation.com',
        userRole: 'super_admin',
        action: 'UPLOAD',
        entity: 'VisaSuccess',
        details: 'Uploaded 96 Australia student visa approval grant letters (Batch Upload)',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
      },
      {
        id: `log_init_3`,
        timestamp: new Date(now - 1000 * 60 * 90).toISOString(),
        userId: 'usr_editor',
        userName: 'Julian Vance, Esq.',
        userEmail: 'editor@fccglobaleducation.com',
        userRole: 'editor',
        action: 'UPDATE',
        entity: 'HomepageSettings',
        details: 'Updated Homepage Visa Success Rows configuration and slider timing',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
      },
      {
        id: `log_init_4`,
        timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
        userId: 'usr_counselor',
        userName: 'Samantha Rao',
        userEmail: 'counselor@fccglobaleducation.com',
        userRole: 'counselor',
        action: 'STATUS_CHANGE',
        entity: 'Appointment',
        details: 'Confirmed and issued video consultation link for Maya Sterling',
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
      },
    ];
    await db.updateTable('auditLogs' as any, logs);
  }
  return logs;
}

export async function GET(request: Request) {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired session token.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const actionFilter = searchParams.get('action');
    const entityFilter = searchParams.get('entity');
    const userFilter = searchParams.get('user');
    const search = (searchParams.get('search') || '').trim().toLowerCase();

    let logs = await getOrSeedAuditLogs();

    // Filtering
    if (actionFilter && actionFilter !== 'all') {
      logs = logs.filter((l) => l.action?.toLowerCase() === actionFilter.toLowerCase());
    }
    if (entityFilter && entityFilter !== 'all') {
      logs = logs.filter((l) => l.entity?.toLowerCase() === entityFilter.toLowerCase());
    }
    if (userFilter && userFilter !== 'all') {
      logs = logs.filter((l) => (l.userEmail || '').toLowerCase() === userFilter.toLowerCase() || (l.userId || '').toLowerCase() === userFilter.toLowerCase());
    }
    if (search) {
      logs = logs.filter(
        (l) =>
          (l.details || '').toLowerCase().includes(search) ||
          (l.userName || '').toLowerCase().includes(search) ||
          (l.userEmail || '').toLowerCase().includes(search) ||
          (l.action || '').toLowerCase().includes(search) ||
          (l.entity || '').toLowerCase().includes(search) ||
          (l.ip || '').toLowerCase().includes(search)
      );
    }

    // Compute stats
    const allLogs = await getOrSeedAuditLogs();
    const stats = {
      total: allLogs.length,
      logins: allLogs.filter((l) => l.action === 'LOGIN').length,
      uploads: allLogs.filter((l) => l.action === 'UPLOAD').length,
      updates: allLogs.filter((l) => l.action === 'UPDATE' || l.action === 'STATUS_CHANGE').length,
      creates: allLogs.filter((l) => l.action === 'CREATE').length,
      deletions: allLogs.filter((l) => l.action === 'DELETE').length,
    };

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
}

// STRICT IMMUTABILITY: Reject any attempt to delete or alter logs!
export async function DELETE() {
  return NextResponse.json(
    {
      error: 'Access Denied: Audit activity logs are strictly immutable and permanent. Deletion is forbidden by security compliance.',
    },
    { status: 403 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Access Denied: Audit activity logs are strictly immutable and cannot be updated or modified.',
    },
    { status: 403 }
  );
}
