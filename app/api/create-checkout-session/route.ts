import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { nanoid } from 'nanoid';

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
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&name=${encodeURIComponent(customerInfo.name)}`,
      cancel_url: `${req.headers.get('origin')}/page-neo/takeout`,
      metadata: {
        orderId: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        pickupTime: customerInfo.pickupTime,
      },
    });

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
