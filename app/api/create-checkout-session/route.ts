import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { nanoid } from 'nanoid';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(req: NextRequest) {
  try {
    const { items, customerName, phone, pickupTime } = await req.json();

    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: Cart items are required' },
        { status: 400 }
      );
    }

    if (!customerName || !phone || !pickupTime) {
      return NextResponse.json(
        { error: 'Invalid request: Customer information is incomplete' },
        { status: 400 }
      );
    }

    // Generate custom order ID
    const orderId = `ORD-${nanoid(6).toUpperCase()}`;

    // Create line items from cart
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.desc,
          images: [item.img],
        },
        unit_amount: Math.round(parseFloat(item.price.replace('$', '')) * 100),
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&name=${encodeURIComponent(customerName)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/takeout`,
      metadata: {
        orderId: orderId,
        customerName: customerName,
        customerPhone: phone,
        pickupTime: pickupTime,
      },
    });

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);

    // Insert order into Supabase orders table using admin client
    if (!supabaseAdmin) {
      console.error('Supabase admin client not configured');
    } else {
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([{
          customer_name: customerName,
          customer_email: '',
          customer_phone: phone,
          pickup_time: pickupTime,
          items: items,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: 'online',
          stripe_session_id: session.id,
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

    return NextResponse.json({ url: session.url, orderId: orderId });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    
    // Return more specific error messages
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = isDevelopment 
      ? `Failed to create checkout session: ${error.message}` 
      : 'Failed to create checkout session. Please try again.';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(isDevelopment && { details: error.stack })
      },
      { status: 500 }
    );
  }
}
