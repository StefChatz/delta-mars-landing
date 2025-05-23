"use client";

import { useEffect, useState, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  label: string;
  value: number;
}

// Format large numbers with K/M suffixes
const formatValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

// Animated counting number for USD values
const CountingNumber = ({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${formatValue(
          Number(latest.toFixed(0))
        )}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref} />;
};

export default function MarketStatsClient() {
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/market-stats")
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(({ totalMarketSize, totalAvailable, totalBorrows }) => {
        setStats([
          { label: "Total Market Size", value: totalMarketSize },
          { label: "Total Available", value: totalAvailable },
          { label: "Total Borrows", value: totalBorrows },
        ]);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return;
  if (!stats) return;

  return (
    <section id="stats">
      <div className="container px-4 md:px-6 py-12 md:py-24">
        <div className="text-center space-y-4 py-6 mx-auto">
          <h2 className="text-[14px] text-primary font-mono font-medium tracking-tight">
            Our Liquidity
          </h2>
          <h4 className="text-[42px] font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
            Powered by Mars&apos;s Red Bank
          </h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="py-4 border-none shadow-none">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold">
                    <CountingNumber value={stat.value} prefix="$" suffix="" />
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
