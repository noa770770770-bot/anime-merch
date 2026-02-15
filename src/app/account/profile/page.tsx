"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/account/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) return <div style={{maxWidth:400,margin:"40px auto"}}>Loading...</div>;
  if (!user) return <div style={{maxWidth:400,margin:"40px auto"}}>Not logged in.</div>;

  return (
    <div style={{maxWidth:400,margin:"40px auto"}}>
      <h1>Profile</h1>
      <div><b>Name:</b> {user.name}</div>
      <div><b>Email:</b> {user.email}</div>
      <div style={{marginTop:24}}>
        <form method="post" action="/api/auth/logout">
          <button type="submit" style={{background:'#f472b6',color:'#fff',padding:10,borderRadius:8}}>Logout</button>
        </form>
      </div>
    </div>
  );
}
