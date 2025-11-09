import React from "react";
import { supabaseAdmin } from "@/lib/supabase";
import AdminDashboardWrapper from "../AdminDashboardWrapper";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  status: string;
  requests?: string;
  created_at: string;
}

export default async function ReservationsPage() {
  // Guard against missing admin client on the server
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }

  // Fetch reservations on the server using admin client
  const { data, error } = await supabaseAdmin
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
  }

  const reservations: Reservation[] = data ?? [];

  // Calculate stats
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  return <AdminDashboardWrapper reservations={reservations} stats={stats} />;
}
