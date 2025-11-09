import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      pickup_time,
      items,
      total_amount,
      status = 'pending',
      payment_method = 'online',
      order_id,
      stripe_session_id,
      stripe_customer_id,
    } = body;

    // Validate required fields
    if (!customer_name || !customer_email || !items || !total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_name, customer_email, items, total_amount' },
        { status: 400 }
      );
    }

    // Insert order into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        pickup_time: pickup_time || null,
        items,
        total_amount,
        status,
        payment_method,
        order_id: order_id || null,
        stripe_session_id: stripe_session_id || null,
        stripe_customer_id: stripe_customer_id || null,
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error) {
      console.error('Error inserting order into Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to create order', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: data?.[0] || null,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in orders API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
