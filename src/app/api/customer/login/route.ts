import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/secrets";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid email and password" },
        { status: 401 }
      );
    }

    const tokens = await authenticate({ email, password });

    if (!tokens.access_token) {
      return NextResponse.json(
        { error: "Invalid email and password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    const accessTokenMaxAge = tokens.expires_in || 3600;
    cookieStore.set("access_token", tokens.access_token, {
      maxAge: accessTokenMaxAge,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("refresh_token", tokens.refresh_token, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const customerRes = await fetch(`${API_URL}/v1/customer`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!customerRes.ok) {
      const customerErrorData = await customerRes.json();
      console.log("Error fetching customer data:", customerErrorData);
      return NextResponse.json(
        { error: "Failed to fetch customer data" },
        { status: 500 }
      );
    }

    const customerData = await customerRes.json();

    console.log("customerData", customerData);

    return NextResponse.json(customerData, { status: 200 });
  } catch (error) {
    console.error("Error during authentication or customer fetch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
