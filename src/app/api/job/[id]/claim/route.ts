import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/secrets';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jobId = (await params).id;

    console.log({ jobId });

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    const response = await fetch(`${API_URL}/v1/job/${jobId}/guest/claim`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: 'Failed to claim job' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to claim job' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error claiming job:', error);
    return NextResponse.json(
      { error: 'Failed to claim job' },
      { status: 500 }
    );
  }
} 