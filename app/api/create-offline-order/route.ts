import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { nanoid } from 'nanoid';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(req: NextRequest) {
  try {
    const { items, customerInfo } = await req.json();

    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: Cart items are required' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.pickupTime) {
      return NextResponse.json(
        { error: 'Invalid request: Customer information is incomplete' },
        { status: 400 }
      );
    }

    // Generate custom order ID
    const orderId = `ORD-${nanoid(6).toUpperCase()}`;

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);

    // Create a Stripe Customer with order metadata for tracking
    // This is a simpler approach than Payment Intent and works for offline orders
    const customer = await stripe.customers.create({
      name: customerInfo.name,
      phone: customerInfo.phone,
      metadata: {
        orderId: orderId,
        pickupTime: customerInfo.pickupTime,
        paymentStatus: 'Pending Payment',
        paymentMethod: 'Pay at Pickup',
        orderTotal: totalAmount.toFixed(2),
        orderItems: JSON.stringify(items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))),
      },
    });

    // Insert order into Supabase orders table using admin client
    if (!supabaseAdmin) {
      console.error('Supabase admin client not configured');
    } else {
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([{
          customer_name: customerInfo.name,
          customer_email: customerInfo.email || '',
          customer_phone: customerInfo.phone,
          pickup_time: customerInfo.pickupTime,
          items: items,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: 'offline',
          stripe_customer_id: customer.id,
          order_id: orderId,
          created_at: new Date().toISOString(),
        }])
        .select();

      if (orderError) {
        console.error('Supabase insert error:', orderError);
      } else {
        console.log('Order saved successfully to Supabase:', orderData);
      }
    }

    return NextResponse.json({ 
      orderId: orderId, 
      customerName: customerInfo.name,
      success: true 
    });
  } catch (error: any) {
    console.error('Offline order creation error:', error);
    
    // Return more specific error messages
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = isDevelopment 
      ? `Failed to create offline order: ${error.message}` 
      : 'Failed to create order. Please try again.';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(isDevelopment && { details: error.stack })
      },
      { status: 500 }
    );
  }
}
