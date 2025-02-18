import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/secrets";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerRes = await fetch(`${API_URL}/v1/customer/payment-methods`, {
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

  const customerData = await customerRes.json();

  return NextResponse.json(customerData, { status: 200 });
}
