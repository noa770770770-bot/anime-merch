"use client";
import React from 'react';

export default function Input(props: any){
  return (
    <input
      {...props}
      className={`rounded-lg px-3 py-2 bg-white/4 placeholder:text-white/50 border border-white/6 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent ${props.className||''}`}
    />
  );
}
