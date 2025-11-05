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
