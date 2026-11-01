'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Filter, 
  X, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/lib/supabase';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const fetchOrders = async () => {
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) {
      if (statusFilter === 'pending_upi') {
        if (!(o.paymentMethod === 'upi' && o.paymentStatus === 'pending_verification')) {
          return false;
        }
      } else {
        return false;
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.upiUtr && o.upiUtr.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleVerifyUpiPayment = async (orderId: string) => {
    await updateOrderStatus(orderId, 'confirmed', 'verified');
    await fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: 'confirmed', paymentStatus: 'verified' } : null
      );
    }
  };

  const handleAddTracking = async (orderId: string) => {
    if (!trackingInput.trim()) return;
    await updateOrderStatus(orderId, 'shipped', undefined, trackingInput.trim());
    await fetchOrders();
    setTrackingInput('');
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: 'shipped', trackingNumber: trackingInput.trim() } : null
      );
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold">
            Fulfillment Center
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            ORDERS & PAYMENTS
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Validate UPI payments, update logistics status, and generate packaging slips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Total:</span>
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-white">
            {orders.length} Consignments
          </span>
        </div>
      </div>

      {/* Control Bar: Search + Filter Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Phone, Customer or UTR..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 font-mono"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { label: 'All', value: 'all' },
            { label: '⚡ Pending UPI', value: 'pending_upi' },
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-gold-400 text-black font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-500 bg-zinc-950/60 border-b border-zinc-800">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment & UTR</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No orders match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-850/40">
                    <td className="p-4">
                      <div className="font-mono font-bold text-white">#{ord.id}</div>
                      <div className="text-[11px] text-zinc-500">{formatDate(ord.createdAt)}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-zinc-200">{ord.customerName}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{ord.customerPhone}</div>
                      <div className="text-[11px] text-zinc-500">{ord.city}, {ord.state}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-white">{ord.items.length} items</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs">
                        {ord.items.map((i) => i.name).join(', ')}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-gold-400 text-sm">
                      {formatPrice(ord.total)}
                    </td>

                    <td className="p-4">
                      <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                        {ord.paymentMethod}
                      </span>
                      {ord.paymentMethod === 'upi' ? (
                        <div className="mt-1">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                              ord.paymentStatus === 'verified'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {ord.paymentStatus === 'verified' ? 'Verified' : 'Pending UTR Verification'}
                          </span>
                          {ord.upiUtr && (
                            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                              UTR: {ord.upiUtr}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                          Collect on delivery
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border bg-zinc-950 cursor-pointer focus:outline-none ${
                          ord.status === 'confirmed'
                            ? 'border-emerald-500/40 text-emerald-400'
                            : ord.status === 'shipped'
                            ? 'border-blue-500/40 text-blue-400'
                            : ord.status === 'delivered'
                            ? 'border-purple-500/40 text-purple-400'
                            : 'border-amber-500/40 text-amber-400'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ord.paymentMethod === 'upi' && ord.paymentStatus === 'pending_verification' && (
                          <button
                            onClick={() => handleVerifyUpiPayment(ord.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] tracking-wider uppercase transition-colors"
                          >
                            Verify UPI
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
                        >
                          View Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Slip / Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">Packaging & Invoice Slip</span>
                <h3 className="font-mono font-bold text-xl text-white">Order #{selectedOrder.id}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                  title="Print Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
              <div className="font-bold text-white text-sm">{selectedOrder.customerName}</div>
              <div className="text-zinc-300">
                {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
              </div>
              <div className="flex items-center gap-4 text-zinc-400 pt-1 font-mono">
                <span>Phone: {selectedOrder.customerPhone}</span>
                {selectedOrder.customerEmail && <span>Email: {selectedOrder.customerEmail}</span>}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Ordered Items
              </h4>
              <div className="divide-y divide-zinc-800">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-10 h-12 object-cover rounded-lg border border-zinc-800"
                      />
                      <div>
                        <p className="font-semibold text-white">{it.name}</p>
                        <p className="text-zinc-500">Qty: {it.quantity} • Size: {it.size} • {it.color}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono">
                  {selectedOrder.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-zinc-800">
                <span>Total Amount</span>
                <span className="font-mono text-gold-400 text-base">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
              {selectedOrder.upiUtr && (
                <div className="pt-2 text-zinc-400 font-mono text-[11px]">
                  UPI Transaction UTR: <strong className="text-white">{selectedOrder.upiUtr}</strong>
                </div>
              )}
            </div>

            {/* Actions in Modal */}
            <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded-xl px-3 py-1.5"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {selectedOrder.paymentMethod === 'upi' && selectedOrder.paymentStatus === 'pending_verification' && (
                <button
                  onClick={() => handleVerifyUpiPayment(selectedOrder.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Verify UPI & Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
