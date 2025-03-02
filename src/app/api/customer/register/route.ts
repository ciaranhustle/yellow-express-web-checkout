import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/secrets";

export async function POST(request: NextRequest) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      mobile, 
      password, 
      jobId 
    } = await request.json();

    if (!firstName || !lastName || !email || !mobile || !password) {
      return NextResponse.json(
        { error: "Missing account details" },
        { status: 400 }
      );
    }

    const customerRes = await fetch(`${API_URL}/v1/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobile,
        password,
        jobid: jobId,
      }),
    });

    if (!customerRes.ok) {
      const customerErrorData = await customerRes.json();
      console.log("Error creating customer:", customerErrorData);
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
    }
    const customerData = await customerRes.json();

    const tokens = await authenticate({ email, password });

    if (!tokens?.access_token) {
      return NextResponse.json(
        {
          error:
            "Failed to authenticate, please try logging in with new account details.",
        },
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

    return NextResponse.json(customerData, { status: 200 });
  } catch (error) {
    console.error("Error during authentication or customer creation:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
