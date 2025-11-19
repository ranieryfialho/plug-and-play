"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Games",
  "Smartphones",
  "Hardware",
  "Inteligência Artificial",
  "Apps"
];

export default function HeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 text-white flex flex-col items-center justify-center leading-tight">
      
      {/* Linha 1: "Analisamos" + Palavra Animada */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4">
        
        <span>Analisamos</span>

        {/* Container da Animação */}
        <span className="relative flex h-[1.2em] items-center justify-center min-w-[1ch]">
          
          {/* Palavra invisível para manter a altura e largura aproximada do container estável */}
          <span className="opacity-0 whitespace-nowrap">{words[index]}</span>

          <AnimatePresence mode="wait">
            <motion.span
              key={words[index]}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute left-0 right-0 mx-auto bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent text-center whitespace-nowrap pb-1"
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      {/* Linha 2 */}
      <span>para você.</span>
    </h1>
  );
}