import { NextResponse } from "next/server";
import { API_URL } from "@/lib/secrets";

export async function GET() {
  try {
    console.log("Fetching app settings", `${API_URL}/v1/appsettings`);
    const response = await fetch(`${API_URL}/v1/appsettings`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch app settings" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
