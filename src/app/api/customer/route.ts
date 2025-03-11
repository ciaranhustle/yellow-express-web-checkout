import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authenticate } from "@/lib/auth";
import { API_URL } from "@/lib/secrets";

export async function GET() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!accessToken) {
      try {
        const tokens = await authenticate({ refresh_token: refreshToken });

        if (!tokens.access_token) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        accessToken = tokens.accessToken;

        cookieStore.set("access_token", tokens.access_token, {
          httpOnly: true,
          maxAge: tokens.expires_in,
        });
        cookieStore.set("refresh_token", tokens.refresh_token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60,
        });
      } catch (error) {
        console.error("Failed to authenticate using refresh token:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const customerRes = await fetch(`${API_URL}/v1/customer`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

    const { customer } = await customerRes.json();

    return NextResponse.json(
      {
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          mobile: customer.mobile
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    return NextResponse.json({ error: "Failed to fetch customer data" }, { status: 500 });
  }
}
