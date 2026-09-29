import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';
import { handleCorsPreflight } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

// Helper to generate a unique readable request code
function generateRequestCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${yyyy}${mm}${dd}-${random}`;
}

function evaluateOverdue(lead: any) {
  let isFirstResponseOverdue = false;
  let isFollowUpOverdue = false;
  const now = new Date();

  if ((lead.status === 'NEW' || !lead.firstResponseAt) && lead.status !== 'CLOSED') {
    const created = new Date(lead.createdAt || now);
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    if (diffHours >= 4 && !lead.firstResponseAt) {
      isFirstResponseOverdue = true;
    }
  }

  if (lead.nextFollowUpDate && lead.status !== 'CLOSED') {
    const followUp = new Date(lead.nextFollowUpDate);
    if (!isNaN(followUp.getTime()) && followUp < now) {
      isFollowUpOverdue = true;
    }
  }

  return { isFirstResponseOverdue, isFollowUpOverdue };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/leads
//
// KEY CHANGES vs old implementation:
// 1. Push WHERE filters into the Prisma query (DB does the filtering, not JS)
// 2. Stats computed via Prisma `_count` groupBy in parallel — no JS array scans
// 3. Falls back to in-memory store only when DATABASE_URL is absent
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const url      = new URL(request.url);
  const search   = url.searchParams.get('search')?.toLowerCase().trim() || '';
  const purpose  = url.searchParams.get('purpose');
  const status   = url.searchParams.get('status');
  const priority = url.searchParams.get('priority');
  const assignee = url.searchParams.get('assignee');
  const isRead   = url.searchParams.get('isRead');
  const isOverdue   = url.searchParams.get('isOverdue');
  const unassigned  = url.searchParams.get('unassigned');
  const startDate   = url.searchParams.get('startDate');
  const endDate     = url.searchParams.get('endDate');

  if (process.env.DATABASE_URL) {
    try {
      // Build Prisma WHERE at the DB level (avoids loading all rows)
      const where: any = {};

      if (status && status !== 'ALL') {
        where.status = status;
      }
      if (priority && priority !== 'ALL') {
        where.priority = priority;
      }
      if (assignee && assignee !== 'ALL') {
        where.assignee = assignee;
      }
      if (purpose && purpose !== 'ALL') {
        where.OR = [{ purpose }, { productGroup: purpose }];
      }
      if (isRead === 'false') {
        where.isRead = false;
      }
      if (unassigned === 'true') {
        where.assignee = null;
        where.status = { not: 'CLOSED' };
      }
      if (startDate) {
        where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
      }
      if (endDate) {
        const eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);
        where.createdAt = { ...where.createdAt, lte: eDate };
      }
      if (search) {
        // Full-text search requires loading rows — keep it manageable
        where.OR = [
          { requestCode: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
          { productGroup: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Fetch leads + aggregate stats in parallel
      const [dbLeads, statsGroups, totalCount] = await Promise.all([
        prisma.lead.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          // Limit to 500 rows by default to prevent memory spikes
          take: 500,
        }),
        // Aggregate counts by status for the full dataset (no WHERE filters except date)
        prisma.lead.groupBy({
          by: ['status'],
          _count: { _all: true },
          where: (() => {
            const w: any = {};
            if (startDate) w.createdAt = { ...w.createdAt, gte: new Date(startDate) };
            if (endDate) {
              const eDate = new Date(endDate);
              eDate.setHours(23, 59, 59, 999);
              w.createdAt = { ...w.createdAt, lte: eDate };
            }
            return w;
          })(),
        }),
        prisma.lead.count({ where }),
      ]);

      // Build stats from groupBy
      const byStatus = Object.fromEntries(
        statsGroups.map((g: any) => [g.status, g._count._all]),
      );
      const [unassignedCount, overdueCheck, convertedCount] = await Promise.all([
        prisma.lead.count({ where: { assignee: null, status: { not: 'CLOSED' } } }),
        // Unread count
        prisma.lead.count({ where: { isRead: false } }),
        prisma.lead.count({ where: { status: 'CLOSED', closingResult: 'ORDER_CREATED' } }),
      ]);

      const closedNonSupport = (byStatus['CLOSED'] || 0);
      const stats = {
        total:              Object.values(byStatus).reduce((s: number, v: any) => s + v, 0),
        new:                byStatus['NEW'] || 0,
        assigned:           byStatus['ASSIGNED'] || 0,
        processing:         byStatus['PROCESSING'] || 0,
        waitingCustomer:    byStatus['WAITING_CUSTOMER'] || 0,
        waitingInternal:    byStatus['WAITING_INTERNAL'] || 0,
        closed:             byStatus['CLOSED'] || 0,
        unassigned:         unassignedCount,
        overdue:            0, // computed in JS below (needs timestamp math)
        unread:             overdueCheck,
        ordersConverted:    convertedCount,
        conversionRate:     closedNonSupport > 0
          ? `${Math.round((convertedCount / closedNonSupport) * 100)}%`
          : '0%',
      };

      // Enrich with overdue flags (JS only — Postgres can't do this easily)
      const processed = dbLeads.map((lead: any) => {
        const { isFirstResponseOverdue, isFollowUpOverdue } = evaluateOverdue(lead);
        return {
          ...lead,
          isFirstResponseOverdue,
          isFollowUpOverdue,
          hasWarning: isFirstResponseOverdue || isFollowUpOverdue || (!lead.assignee && lead.status === 'NEW'),
          requestCode: lead.requestCode || `REQ-OLD-${lead.id}`,
        };
      });

      // isOverdue filter (JS, post-enrich)
      const filtered = isOverdue === 'true'
        ? processed.filter((l: any) => l.isFirstResponseOverdue || l.isFollowUpOverdue)
        : processed;

      stats.overdue = processed.filter(
        (l: any) => l.isFirstResponseOverdue || l.isFollowUpOverdue,
      ).length;

      return NextResponse.json({ leads: filtered, stats, total: totalCount });
    } catch (e) {
      console.warn('Prisma get leads error, fallback to store:', e);
      // fall through to in-memory store
    }
  }

  // ── In-memory store fallback ─────────────────────────────────────────────
  let allLeads: any[] = store?.leads || [];

  let processed = allLeads.map((lead: any) => {
    const { isFirstResponseOverdue, isFollowUpOverdue } = evaluateOverdue(lead);
    return {
      ...lead,
      isFirstResponseOverdue,
      isFollowUpOverdue,
      hasWarning: isFirstResponseOverdue || isFollowUpOverdue || (!lead.assignee && lead.status === 'NEW'),
      requestCode: lead.requestCode || `REQ-OLD-${lead.id}`,
    };
  });

  const stats = {
    total: processed.length,
    new: processed.filter((l) => l.status === 'NEW').length,
    assigned: processed.filter((l) => l.status === 'ASSIGNED').length,
    processing: processed.filter((l) => l.status === 'PROCESSING').length,
    waitingCustomer: processed.filter((l) => l.status === 'WAITING_CUSTOMER').length,
    waitingInternal: processed.filter((l) => l.status === 'WAITING_INTERNAL').length,
    closed: processed.filter((l) => l.status === 'CLOSED').length,
    unassigned: processed.filter((l) => !l.assignee && l.status !== 'CLOSED').length,
    overdue: processed.filter((l) => l.isFirstResponseOverdue || l.isFollowUpOverdue).length,
    unread: processed.filter((l) => !l.isRead).length,
    ordersConverted: processed.filter((l) => l.closingResult === 'ORDER_CREATED').length,
    conversionRate: '0%',
  };

  const eligibleForConversion = processed.filter(
    (l) => l.status === 'CLOSED' && l.purpose !== 'SUPPORT',
  ).length;
  if (eligibleForConversion > 0) {
    stats.conversionRate = `${Math.round((stats.ordersConverted / eligibleForConversion) * 100)}%`;
  }

  // Apply filters in-memory
  if (search) {
    processed = processed.filter(
      (l) =>
        (l.requestCode  && l.requestCode.toLowerCase().includes(search)) ||
        (l.customerName && l.customerName.toLowerCase().includes(search)) ||
        (l.companyName  && l.companyName.toLowerCase().includes(search)) ||
        (l.phone        && l.phone.toLowerCase().includes(search)) ||
        (l.email        && l.email.toLowerCase().includes(search)) ||
        (l.notes        && l.notes.toLowerCase().includes(search)) ||
        (l.productGroup && l.productGroup.toLowerCase().includes(search)),
    );
  }
  if (purpose   && purpose   !== 'ALL') processed = processed.filter((l) => l.purpose === purpose || l.productGroup === purpose);
  if (status    && status    !== 'ALL') processed = processed.filter((l) => l.status === status);
  if (priority  && priority  !== 'ALL') processed = processed.filter((l) => l.priority === priority);
  if (assignee  && assignee  !== 'ALL') processed = processed.filter((l) => l.assignee === assignee);
  if (unassigned === 'true')            processed = processed.filter((l) => !l.assignee && l.status !== 'CLOSED');
  if (isOverdue === 'true')             processed = processed.filter((l) => l.isFirstResponseOverdue || l.isFollowUpOverdue);
  if (isRead === 'false')               processed = processed.filter((l) => !l.isRead);
  if (startDate) {
    const sDate = new Date(startDate);
    processed = processed.filter((l) => new Date(l.createdAt) >= sDate);
  }
  if (endDate) {
    const eDate = new Date(endDate);
    eDate.setHours(23, 59, 59, 999);
    processed = processed.filter((l) => new Date(l.createdAt) <= eDate);
  }

  return NextResponse.json({ leads: processed, stats });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const customerName    = data.customerName || data.name || data.fullName || 'Khách hàng';
    const companyName     = data.companyName || data.company || null;
    const phone           = data.phone || data.phoneNumber || '';
    const email           = data.email || null;
    const location        = data.location || data.shippingLocation || data.address || null;
    const source          = data.source || 'Website - Form Liên Hệ';
    const sourceUrl       = data.sourceUrl || null;
    const sourceProduct   = data.sourceProduct || null;
    const utmParams       = data.utmParams || null;
    const purpose         = data.purpose || 'BUY_PRODUCT';
    const productGroup    = data.productGroup || data.purposeLabel || 'Mua sản phẩm';
    const preferredChannel = data.preferredChannel || 'Điện thoại';
    const preferredTime   = data.preferredTime || null;
    const quantity        = data.quantity || data.details?.quantity || data.details?.giftQuantity || data.details?.expectedVolume || null;
    const budget          = data.budget || data.details?.budgetRange || null;
    const timeline        = data.timeline || data.details?.desiredDate || data.deliveryDate || null;
    const customization   = data.customization || (Array.isArray(data.details?.customization) ? data.details.customization.join(', ') : null);
    const notes           = data.notes || data.message || data.details?.issueDescription || data.details?.partnershipProposal || null;
    const details         = data.details || {};
    const attachments     = Array.isArray(data.attachments) ? data.attachments : [];
    const consentVersion  = data.consentVersion || 'v1.0';
    const marketingOptIn  = Boolean(data.marketingOptIn);
    const requestCode     = data.requestCode || generateRequestCode();
    const status          = data.status || 'NEW';
    const priority        = data.priority || (purpose === 'CORPORATE_GIFT' || purpose === 'WHOLESALE' ? 'HIGH' : 'NORMAL');
    const leadClassification = data.leadClassification || 'WARM';
    const assignee        = data.assignee || null;

    const auditLog = [
      {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Hệ thống',
        action: 'Tiếp nhận yêu cầu',
        details: `Nhận yêu cầu [${requestCode}] từ ${source}`,
      },
    ];

    let createdLead: any = null;

    if (process.env.DATABASE_URL) {
      try {
        // Anti-double submit: check last 15 seconds
        const fifteenSecondsAgo = new Date(Date.now() - 15_000);
        const duplicate = await prisma.lead.findFirst({
          where: {
            customerName,
            ...(phone ? { phone } : {}),
            createdAt: { gte: fifteenSecondsAgo },
          },
          select: { id: true, requestCode: true },
        });

        if (duplicate) {
          return NextResponse.json(
            {
              message: 'Yêu cầu của bạn đã được tiếp nhận trước đó ít giây. Đang xử lý!',
              lead: duplicate,
              requestCode: duplicate.requestCode,
            },
            { status: 200 },
          );
        }

        // Create lead + sync customer in parallel for speed
        const [newLead] = await Promise.all([
          prisma.lead.create({
            data: {
              requestCode, customerName, companyName, phone, email,
              location, source, sourceUrl, sourceProduct,
              utmParams: utmParams ? (utmParams as any) : undefined,
              purpose, productGroup, preferredChannel, preferredTime,
              quantity: quantity ? String(quantity) : null,
              budget: budget ? String(budget) : null,
              timeline: timeline ? String(timeline) : null,
              customization: customization ? String(customization) : null,
              notes, details: details as any, attachments: attachments as any,
              consentVersion, marketingOptIn, isRead: false,
              status, priority, leadClassification, assignee,
              auditLog: auditLog as any,
              activities: [] as any,
              quotations: [] as any,
              projectType: productGroup,
            },
          }),
          // Async customer sync (fire and don't await — reduces lead POST latency)
          (async () => {
            if (!phone && !email && !customerName) return;
            try {
              const existingCustomer = await prisma.customer.findFirst({
                where: {
                  OR: [
                    ...(phone ? [{ phoneNumber: phone }] : []),
                    ...(email ? [{ email }] : []),
                  ],
                },
                select: { id: true, notes: true, requestType: true },
              });

              if (!existingCustomer) {
                await prisma.customer.create({
                  data: {
                    fullName: customerName,
                    phoneNumber: phone || '---',
                    email: email || null,
                    address: location || '---',
                    requestType: productGroup,
                    totalOrders: 0,
                    notes: `Tạo từ yêu cầu: ${requestCode} (${source})`,
                  },
                });
              } else {
                await prisma.customer.update({
                  where: { id: existingCustomer.id },
                  data: {
                    requestType: productGroup || existingCustomer.requestType,
                    notes: `${existingCustomer.notes || ''} | Yêu cầu mới: ${requestCode}`,
                  },
                });
              }
            } catch (custErr) {
              console.error('Lỗi đồng bộ customer:', custErr);
            }
          })(),
        ]);

        createdLead = newLead;
      } catch (dbErr) {
        console.error('Prisma lead create error:', dbErr);
      }
    }

    const finalLead = createdLead || {
      id: store?.leads?.length
        ? Math.max(...store.leads.map((l: any) => Number(l.id) || 0)) + 1
        : 1,
      requestCode, customerName, companyName, phone, email, location,
      source, sourceUrl, sourceProduct, utmParams,
      purpose, productGroup, preferredChannel, preferredTime,
      quantity, budget, timeline, customization, notes,
      details, attachments, consentVersion, marketingOptIn,
      isRead: false, status, priority, leadClassification, assignee,
      auditLog, activities: [], quotations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (store?.leads) {
      store.leads.unshift(finalLead);
      if (store.stats) store.stats.totalLeads++;
      savePersistedData();
    }

    return NextResponse.json(
      {
        success: true,
        lead: finalLead,
        requestCode: finalLead.requestCode,
        message: 'Gửi yêu cầu thành công!',
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error handling lead submission:', error);
    return NextResponse.json(
      { message: 'Lỗi dữ liệu đầu vào: ' + (error.message || '') },
      { status: 400 },
    );
  }
}
