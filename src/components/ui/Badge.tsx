"use client";
import React from 'react';

export default function Badge({ children, className = '' }: any){
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-600 text-white ${className}`}>
      {children}
    </span>
  );
}
