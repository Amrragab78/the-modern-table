import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Admin client not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("reservations")
      .select("*");

    if (error) {
      console.error("Error fetching reservations:", error);
      return NextResponse.json(
        { error: "Failed to fetch reservations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reservations: data || [] });
  } catch (error) {
    console.error("Error in get-reservations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
