'use client';
import React from 'react';

export default function SizeGuideModal({ onClose }: { onClose: () => void }){
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#fff', padding:20, maxWidth:600}}>
        <h2>Size Guide</h2>
        <p>Sizes: S, M, L, XL. Measurements in cm.</p>
        <ul>
          <li>S - Chest 90</li>
          <li>M - Chest 100</li>
          <li>L - Chest 110</li>
          <li>XL - Chest 120</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
