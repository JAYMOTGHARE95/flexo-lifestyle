'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Package, 
  Users 
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/lib/supabase';
import { SAMPLE_PRODUCTS } from '@/lib/products-data';
import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const pendingUpi = orders.filter((o) => o.paymentMethod === 'upi' && o.paymentStatus === 'pending_verification').length;
  const lowStockProducts = SAMPLE_PRODUCTS.filter((p) => p.stock < 15);

  const handleVerifyUpi = async (orderId: string) => {
    await updateOrderStatus(orderId, 'confirmed', 'verified');
    const updated = await getAllOrders();
    setOrders(updated);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold">
            Live Overview
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            MERCHANT DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs uppercase tracking-wider transition-colors"
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-gold-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-white">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span>Free Tier • Direct to Merchant</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Total Lifetime Orders</span>
            <ShoppingBag className="w-4 h-4 text-gold-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-white">
            {totalOrders}
          </div>
          <div className="text-[11px] text-zinc-400">
            Recorded in database
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-white">
            {pendingOrders}
          </div>
          <div className="text-[11px] text-amber-400">
            {pendingUpi} awaiting UPI UTR confirmation
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-rose-400">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-zinc-400">
            Fewer than 15 units remaining
          </div>
        </div>
      </div>

      {/* 2-Column: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="font-display font-bold text-base text-white">Recent Customer Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-850/50">
                    <td className="py-3 font-mono font-bold text-white">#{order.id}</td>
                    <td className="py-3">
                      <div className="font-medium text-zinc-200">{order.customerName}</div>
                      <div className="text-[11px] text-zinc-500">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 font-mono font-bold text-gold-400">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3">
                      <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                        {order.paymentMethod}
                      </span>
                      {order.upiUtr && (
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          UTR: {order.upiUtr}
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : order.status === 'shipped'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {order.paymentMethod === 'upi' && order.paymentStatus === 'pending_verification' ? (
                        <button
                          onClick={() => handleVerifyUpi(order.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                        >
                          Verify UPI
                        </button>
                      ) : (
                        <Link
                          href="/admin/orders"
                          className="text-zinc-400 hover:text-white text-[11px]"
                        >
                          Details &rarr;
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="font-display font-bold text-base text-white">Low Inventory Alert</h2>
            <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">
              Urgent
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-10 h-12 object-cover rounded-lg border border-zinc-800 shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-zinc-500 capitalize">{p.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-rose-400 text-sm">{p.stock}</span>
                  <span className="text-[10px] text-zinc-500 block">left</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="block text-center text-xs text-gold-400 hover:underline pt-2"
          >
            Manage Product Inventory &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
