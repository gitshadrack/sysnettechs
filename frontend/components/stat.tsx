"use client";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect,useRef } from "react";
export function Stat({value,suffix,label}:{value:number;suffix:string;label:string}){const ref=useRef(null),seen=useInView(ref,{once:true}),count=useMotionValue(0),rounded=useTransform(count,v=>Math.round(v));useEffect(()=>{if(seen)animate(count,value,{duration:1.8})},[seen,count,value]);return <div ref={ref} className="text-center"><div className="font-display text-4xl font-bold text-white"><motion.span>{rounded}</motion.span>{suffix}</div><p className="mt-2 text-sm text-white/60">{label}</p></div>}
