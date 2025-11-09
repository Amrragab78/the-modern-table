import React from "react";
import { supabaseAdmin } from "@/lib/supabase";
import BusinessOverviewClient from "./BusinessOverviewClient";

export default async function AdminDashboardPage() {
  // Guard against missing admin client on the server
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }

  // Fetch all data in parallel
  const [reservationsRes, ordersRes, employeesRes, suppliesRes, contactRes] = await Promise.all([
    supabaseAdmin.from('reservations').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('employees').select('*'),
    supabaseAdmin.from('supplies').select('*'),
    supabaseAdmin.from('contact').select('*').order('created_at', { ascending: false }),
  ]);

  // Calculate stats
  const stats = {
    reservations: reservationsRes.data?.length || 0,
    orders: ordersRes.data?.length || 0,
    employees: employeesRes.data?.length || 0,
    lowStock: suppliesRes.data?.filter((s: any) => s.quantity < (s.restock_level || 10)).length || 0,
    newMessages: contactRes.data?.filter((m: any) => m.status === "new" || !m.status).length || 0,
  };

  // Get recent activity
  const recentReservations = reservationsRes.data?.slice(0, 5) || [];
  const recentOrders = ordersRes.data?.slice(0, 5) || [];

  return (
    <BusinessOverviewClient
      stats={stats}
      recentReservations={recentReservations}
      recentOrders={recentOrders}
    />
  );
}
