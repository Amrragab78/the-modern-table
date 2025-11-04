import { NextResponse } from 'next/server';

// Define the expected shape of the request body
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Handler for POST requests
export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();
    const { name, email, message } = data;

    // 1. Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields: name, email, and message are required.' }, { status: 400 });
    }

    // 2. Email Validation (Simple regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }

    // 3. **The Critical Step: Replace this block with your actual email sending logic**
    //
    // In a real-world scenario, you would use a service like:
    // - Nodemailer (for a custom SMTP server)
    // - SendGrid, Mailgun, or Resend (recommended for reliability and deliverability)
    //
    // Example using a placeholder:
    console.log('--- New Contact Form Submission ---');
    console.log(`From: ${name} <${email}>`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');
    
    // Simulate a successful email send
    // await sendEmailService({ to: 'restaurant@example.com', subject: 'New Contact Form Submission', body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` });

    // 4. Return a success response
    return NextResponse.json({ message: 'Message sent successfully. We will be in touch shortly.' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error. Could not process the request.' }, { status: 500 });
  }
}

// Optional: Handler for other methods (e.g., to prevent GET requests)
export async function GET() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
