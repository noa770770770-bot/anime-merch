"use client";
import React from 'react';

export default function Button({ children, className = '', variant = 'primary', ...props }: any) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold transition';
  const styles = variant === 'primary'
    ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-[0_6px_18px_rgba(124,58,237,0.16)] hover:brightness-105'
    : 'bg-white/5 border border-white/10 text-white hover:border-white/20';
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
