"use client";

import { useEffect } from "react";

interface AdUnitProps {
  slotId: string;
  format?: "auto" | "fluid" | "rectangle";
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({ slotId, format = "auto", style, className = "h-64" }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      const adsbygoogle = window.adsbygoogle || [];
      // @ts-ignore
      adsbygoogle.push({});
    } catch (e) {
      console.error("Erro AdSense:", e);
    }
  }, []);

  const isDev = process.env.NODE_ENV === "development";

  const AD_CLIENT_ID = "ca-pub-6203949560211327"; 

  return (
    <div className={`block w-full my-8 overflow-hidden rounded-xl ${className}`} style={style}>
      {/* Simulação Visual (Localhost) */}
      {isDev && (
        <div className="w-full h-full bg-card/50 border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ffffff05_10px,#ffffff05_20px)] p-4 text-center">
          <span className="font-bold tracking-widest uppercase text-xs mb-2 text-primary/70">Publicidade</span>
          <span className="text-[10px] opacity-50">Espaço reservado (AdSense)</span>
        </div>
      )}

      {/* AdSense Real (Produção) */}
      <ins
        className={`adsbygoogle ${isDev ? "hidden" : "block"}`}
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={AD_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}