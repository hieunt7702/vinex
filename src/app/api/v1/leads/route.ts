import { NextResponse } from 'next/server';
import { store, savePersistedData } from '../store';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const dbLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbLeads && dbLeads.length > 0) {
        return NextResponse.json(dbLeads);
      }
    } catch (e) {
      // fallback
    }
  }
  return NextResponse.json(store?.leads || []);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let createdLead: any = null;

    const customerName = data.customerName || data.contactName || data.name || data.fullName || 'Khách hàng';
    const companyName = data.companyName || data.company || null;
    const phone = data.phone || data.phoneNumber || '';
    const email = data.email || null;
    const location = data.location || data.address || null;
    const source = data.source || 'Website';
    const productGroup = data.productGroup || data.projectType || 'Quà tặng doanh nghiệp';
    const purpose = data.purpose || data.occasion || null;
    const quantity = data.quantity || null;
    const budget = data.budget || null;
    const timeline = data.timeline || data.deliveryDate || null;
    const customization = data.customization || (Array.isArray(data.branding) ? data.branding.join(', ') : null);
    const notes = data.notes || data.requirements || data.needs || data.message || null;
    const status = data.status || 'NEW';
    const leadClassification = data.leadClassification || 'WARM';
    const assignee = data.assignee || null;

    if (process.env.DATABASE_URL) {
      try {
        createdLead = await prisma.lead.create({
          data: {
            customerName,
            companyName,
            phone,
            email,
            location,
            source,
            productGroup,
            purpose,
            quantity,
            budget,
            timeline,
            customization,
            notes,
            status,
            leadClassification,
            assignee,
            projectType: productGroup
          }
        });

        // Tự động đồng bộ sang bảng Customer để trang Admin Khách Hàng luôn có dữ liệu thực tế
        if (phone || email || customerName) {
          try {
            const existingCustomer = await prisma.customer.findFirst({
              where: {
                OR: [
                  ...(phone ? [{ phoneNumber: phone }] : []),
                  ...(email ? [{ email: email }] : [])
                ]
              }
            });

            if (!existingCustomer) {
              await prisma.customer.create({
                data: {
                  fullName: customerName,
                  phoneNumber: phone || '---',
                  email: email || null,
                  address: location || 'Hà Nội',
                  requestType: productGroup || purpose || 'Quà tặng doanh nghiệp',
                  totalOrders: 1,
                  notes: notes ? `${notes} (Từ: ${source})` : `Nguồn: ${source}`
                }
              });
            } else {
              await prisma.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  requestType: productGroup || purpose || existingCustomer.requestType,
                  totalOrders: (existingCustomer.totalOrders || 0) + 1,
                  notes: notes ? `${notes} | ${existingCustomer.notes || ''}` : existingCustomer.notes
                }
              });
            }
          } catch (custErr) {
            console.error('Lỗi đồng bộ customer từ lead:', custErr);
          }
        }
      } catch (dbErr) {
        console.error('Prisma lead create error:', dbErr);
      }
    }

    const finalLead = createdLead || {
      ...data,
      id: store?.leads?.length ? Math.max(...store.leads.map((l: any) => l.id)) + 1 : 1,
      customerName,
      companyName,
      phone,
      email,
      location,
      source,
      productGroup,
      purpose,
      quantity,
      budget,
      timeline,
      customization,
      notes,
      status,
      leadClassification,
      assignee,
      createdAt: new Date().toISOString()
    };

    if (store?.leads) {
      store.leads.unshift(finalLead);
      if (store.stats) store.stats.totalLeads++;
    }

    if (store?.customers) {
      const existing = store.customers.find((c: any) => (phone && c.phoneNumber === phone) || (email && c.email === email));
      if (!existing) {
        store.customers.unshift({
          id: store.customers.length ? Math.max(...store.customers.map((c: any) => c.id)) + 1 : 1,
          fullName: customerName,
          phoneNumber: phone || '---',
          email: email || null,
          address: location || 'Hà Nội',
          requestType: productGroup || purpose || 'Quà tặng doanh nghiệp',
          totalOrders: 1,
          notes: notes || null,
          createdAt: new Date().toISOString()
        });
        if (store.stats) store.stats.totalCustomers++;
      }
    }

    if (store?.leads || store?.customers) {
      savePersistedData();
    }
    
    return NextResponse.json(finalLead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi dữ liệu đầu vào' }, { status: 400 });
  }
}
