import { getFormattedAddress } from "@/lib/google";
import { API_URL } from "@/lib/secrets";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { bookingDetails, ...body } = await request.json();

  const pickUpAddress = await getFormattedAddress(
    bookingDetails.pickUpAddress.value.place_id
  );
  const dropOffAddress = await getFormattedAddress(
    bookingDetails.dropOffAddress.value.place_id
  );

  const res = await fetch(`${API_URL}/v1/quote/enquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      bookingDetails: {
        ...bookingDetails,
        pickUpAddress: pickUpAddress,
        dropOffAddress: dropOffAddress,
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.log("Error creating enquiry:", errorData);
    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    );
  }

  const data = await res.json();

  return NextResponse.json(data, { status: 200 });
} 