import React from "react";
import { supabaseAdmin } from "@/lib/supabase";
import BusinessOverviewClient from "./BusinessOverviewClient";

interface Order {
  status: string;
  total_amount: number;
  created_at: string;
}

interface Reservation {
  status: string;
  date: string;
  time: string;
}

export default async function AdminOverviewPage() {
  // Guard against missing admin client
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }

  // Fetch data from Supabase
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("status,total_amount,created_at");

  const { data: reservations, error: reservationsError } = await supabaseAdmin
    .from("reservations")
    .select("status,date,time");

  if (ordersError || reservationsError) {
    console.error("Error fetching data:", ordersError || reservationsError);
    throw new Error("Failed to fetch dashboard data");
  }

  const ordersData: Order[] = orders || [];
  const reservationsData: Reservation[] = reservations || [];

  // Calculate metrics
  const totalOrders = ordersData.length;
  const pendingOrders = ordersData.filter((o) => o.status === "pending").length;
  const fulfilledOrders = ordersData.filter((o) => o.status === "fulfilled").length;
  const totalRevenue = ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalReservations = reservationsData.length;

  // Calculate upcoming reservations (next 7 days)
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingReservations = reservationsData.filter((r) => {
    const resDate = new Date(r.date);
    return resDate >= now && resDate <= sevenDaysFromNow;
  }).length;

  // Calculate revenue trend for last 7 days
  const revenueByDate: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    revenueByDate[dateStr] = 0;
  }

  ordersData.forEach((order) => {
    if (order.created_at && order.total_amount) {
      const orderDate = new Date(order.created_at).toISOString().split("T")[0];
      if (revenueByDate.hasOwnProperty(orderDate)) {
        revenueByDate[orderDate] += order.total_amount;
      }
    }
  });

  const revenueData = Object.entries(revenueByDate).map(([date, revenue]) => {
    const dateObj = new Date(date);
    return {
      date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue,
    };
  });

  const metrics = {
    totalOrders,
    pendingOrders,
    fulfilledOrders,
    totalReservations,
    upcomingReservations,
    totalRevenue,
  };

  return <BusinessOverviewClient metrics={metrics} revenueData={revenueData} />;
}
