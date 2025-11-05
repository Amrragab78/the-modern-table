// app/api/reserve/route.ts - SendGrid Integration

import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set the SendGrid API Key from environment variables
// This assumes the environment variable is set in your hosting environment or .env.local
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Define the expected shape of the request body
interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

// Function to send the email notification
async function sendReservationEmail(data: ReservationData) {
  // !!! IMPORTANT: Change these emails to the restaurant's actual email and a verified SendGrid sender !!!
  const restaurantEmail = 'restaurant@yourdomain.com'; 
  const senderEmail = 'noreply@yourdomain.com'; 

  const msg = {
    to: restaurantEmail,
    from: senderEmail,
    subject: `NEW RESERVATION: ${data.name} - ${data.date} at ${data.time}`,
    html: `
      <p>A new reservation request has been submitted:</p>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
        <li><strong>Date:</strong> ${data.date}</li>
        <li><strong>Time:</strong> ${data.time}</li>
        <li><strong>Guests:</strong> ${data.guests}</li>
        <li><strong>Special Requests:</strong> ${data.notes || 'None'}</li>
      </ul>
      <p>Please log in to your booking system to confirm or manage this reservation.</p>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    // Log the error but throw a user-friendly message
    console.error('SendGrid Email Error:', error);
    throw new Error('Failed to send reservation email notification. Please check server logs.');
  }
}

// Handler for POST requests
export async function POST(request: Request) {
  try {
    const data: ReservationData = await request.json();
    const { name, email, date, time, guests } = data;

    // 1. Basic Validation
    if (!name || !email || !date || !time || !guests) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields.' 
        }, 
        { status: 400 }
      );
    }

    // 2. Send Email Notification
    await sendReservationEmail(data);

    // 3. Return a success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Reservation request submitted successfully. A confirmation will be sent to your email shortly.' 
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Reservation API Error:', error);
    
    // Return more specific error messages
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error.';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        ...(isDevelopment && { details: error.stack })
      }, 
      { status: 500 }
    );
  }
}

// Optional: Handler for other methods
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
