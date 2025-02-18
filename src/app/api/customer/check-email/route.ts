import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/secrets";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const response = await fetch(
      `${API_URL}/v1/customer/purchase/check-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (!response.ok) {
      const customerErrorData = await response.json();
      console.log("Error checking email:", customerErrorData);
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
    }

    const customerData = await response.json();

    return NextResponse.json(customerData, { status: 200 });
  } catch (error) {
    console.error("Error customer email check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
