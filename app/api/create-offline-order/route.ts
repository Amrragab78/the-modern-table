import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { nanoid } from 'nanoid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function POST(req: NextRequest) {
  try {
    const { items, customerInfo } = await req.json();

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
    console.error('Offline order error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
