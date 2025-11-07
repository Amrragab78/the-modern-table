import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const data: ReservationData = await request.json();
    const { name, email, phone, date, time, guests, notes } = data;

    // Validate required fields
    if (!name || !email || !date || !time || !guests) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields.' 
        }, 
        { status: 400 }
      );
    }

    // Log reservation data to console
    console.log('=================================');
    console.log('NEW RESERVATION REQUEST:');
    console.log('=================================');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Date:', date);
    console.log('Time:', time);
    console.log('Party Size:', guests);
    console.log('Special Requests:', notes || 'None');
    console.log('=================================');

    // Insert reservation into Supabase
    const { data: insertedData, error: insertError } = await supabase
      .from('reservations')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          date,
          time,
          guests: parseInt(guests, 10),
          special_requests: notes || null,
          status: 'pending'
        }
      ])
      .select();

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to save reservation to database'
        }, 
        { status: 500 }
      );
    }

    console.log('Reservation saved to Supabase:', insertedData);

    return NextResponse.json(
      { 
        success: true,
        message: 'Reservation submitted successfully' 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reservation API Error:', error);
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit reservation';
    
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

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
