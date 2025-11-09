import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const body = await request.json();
    const { customer_name, customer_email, items, total_amount } = body;

    // Validate required fields
    if (!customer_name || !customer_email || !items || !total_amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert order into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name,
        customer_email,
        items,
        total_amount,
        status: 'pending',
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error) {
      console.error('Error saving order to Supabase:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order saved',
      order: data?.[0],
    });

  } catch (error: any) {
    console.error('Error in create-order route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
