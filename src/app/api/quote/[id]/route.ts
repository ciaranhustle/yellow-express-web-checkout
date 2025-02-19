import { API_URL } from "@/lib/secrets";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const quoteId = (await params).id;
  const res = await fetch(`${API_URL}/v1/quote/${quoteId}`);

  if (!res.ok) {
    const errorData = await res.json();
    console.log("Error fetching quote data:", errorData);
    return NextResponse.json(
      { error: "Failed to fetch quote data" },
      { status: 500 }
    );
  }

  const data = await res.json();

  return NextResponse.json(data, { status: 200 });
}
