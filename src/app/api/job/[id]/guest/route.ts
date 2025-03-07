import { API_URL } from "@/lib/secrets";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jobId = (await params).id;
    
    const res = await fetch(`${API_URL}/v1/job/${jobId}/guest`);
    
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch job" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in job guest route:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
