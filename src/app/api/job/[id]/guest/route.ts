import { API_URL } from "@/lib/secrets";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const jobId = (await params).id;
  const res = await fetch(`${API_URL}/v1/job/${jobId}/guest`);

  if (!res.ok) {
    const errorData = await res.json();
    console.log("Error fetching job data:", errorData);
    return NextResponse.json(
      { error: "Failed to fetch job data" },
      { status: 500 }
    );
  }

  const data = await res.json();

  return NextResponse.json(data, { status: 200 });
}
