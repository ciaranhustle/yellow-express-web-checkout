import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/secrets";

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Discount code is required" },
        { status: 400 }
      );
    }

    const queryParams = new URLSearchParams();
    if (email) {
      queryParams.set("email", email);
    }

    // Construct the URL with optional customer ID
    const url = new URL(
      `${API_URL}/v1/coupon/${code}?${queryParams.toString()}`
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Invalid discount code" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error processing discount code:", error);
    return NextResponse.json(
      { error: "Failed to process discount code" },
      { status: 500 }
    );
  }
}
