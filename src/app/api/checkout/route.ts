import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/lib/secrets";
import { createJobFromQuote } from '@/lib/checkoutUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quote, paymentMethodId, bookingAssistOption, couponCode } = body;

    if (!quote || !paymentMethodId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log({ quote, paymentMethodId });

    const newJob = createJobFromQuote(quote, bookingAssistOption);

    const createJobResponse = await fetch(`${API_URL}/v1/job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    });

    if (!createJobResponse.ok) {
      const errorData = await createJobResponse.json();
      console.log("Error creating job:", errorData);
      return NextResponse.json(
        { error: "Failed to checkout" },
        { status: 400 }
      );
    }

    const jobData = await createJobResponse.json();

    const jobId = jobData.job._id;
    console.log({ jobId, jobData });

    const processPaymentResponse = await fetch(`${API_URL}/v1/job/${jobId}/guest/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guestInfo: {
          firstName: quote.customerDetails.firstName,
          lastName: quote.customerDetails.lastName,
          email: quote.customerDetails.email,
          mobile: quote.customerDetails.mobile,
        },  
        paymentMethodId,
        bookingAssistOption,
        couponCode,
      }),
    });

    if (!processPaymentResponse.ok) {
      const errorData = await processPaymentResponse.json();
      console.log("Error processing payment:", errorData);
      return NextResponse.json(
        { 
          error: errorData.message || "Failed to process payment",
          requiresAction: errorData.requiresAction,
          clientSecret: errorData.clientSecret
        },
        { status: processPaymentResponse.status }
      );
    }

    const paymentData = await processPaymentResponse.json();

    console.log({ paymentData });

    // Return success response with job ID
    return NextResponse.json({ 
      success: true, 
      jobId,
      message: "Checkout completed successfully"
    }, { status: 200 });
  } catch (error) {
    console.error('Error during checkout:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 