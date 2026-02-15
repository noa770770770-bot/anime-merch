"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/account/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <div style={{maxWidth:400,margin:"40px auto"}}>Loading...</div>;
  if (!orders.length) return <div style={{maxWidth:400,margin:"40px auto"}}>No orders found.</div>;

  return (
    <div style={{maxWidth:600,margin:"40px auto"}}>
      <h1>Order History</h1>
      <ul style={{marginTop:24}}>
        {orders.map(order => (
          <li key={order.id} style={{marginBottom:16,padding:12,border:'1px solid #eee',borderRadius:8}}>
            <div><b>Order ID:</b> {order.id}</div>
            <div><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</div>
            <div><b>Status:</b> {order.status}</div>
            <div><b>Total:</b> {order.totalILS} ILS</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
