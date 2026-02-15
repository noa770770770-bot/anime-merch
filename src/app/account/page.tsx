import Link from 'next/link';

export default function AccountPage() {
  return (
    <div style={{maxWidth:480, margin:'40px auto'}}>
      <h1>Account</h1>
      <ul style={{marginTop:24, fontSize:18, fontWeight:600}}>
        <li><Link href="/account/login">Login</Link></li>
        <li><Link href="/account/register">Register</Link></li>
        <li><Link href="/account/orders">Order History</Link></li>
        <li><Link href="/account/profile">Profile</Link></li>
      </ul>
    </div>
  );
}
