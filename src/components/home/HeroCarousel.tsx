"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface HeroCarouselProps {
  posts: any[];
}

export default function HeroCarousel({ posts }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotação Automática a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [posts.length]);

  if (!posts || posts.length === 0) return null;

  const activePost = posts[currentIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[500px]">
      
      <div className="lg:col-span-8 relative group h-[400px] lg:h-full rounded-2xl overflow-hidden border border-border bg-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePost.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <Link href={`/reviews/${activePost.slug}`} className="block w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              {activePost.featuredImage?.node?.sourceUrl ? (
                <Image
                  src={activePost.featuredImage.node.sourceUrl}
                  alt={activePost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-muted-foreground">
                  Sem Imagem
                </div>
              )}

              <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 max-w-3xl">
                <div className="flex gap-2 mb-3">
                   {activePost.categories?.nodes?.[0] && (
                     <Badge className="bg-primary text-white hover:bg-secondary border-none">
                       {activePost.categories.nodes[0].name}
                     </Badge>
                   )}
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg line-clamp-2">
                  {activePost.title}
                </h2>
                <div 
                  className="text-gray-200 line-clamp-2 text-sm md:text-base font-medium drop-shadow-md hidden md:block"
                  dangerouslySetInnerHTML={{ __html: activePost.excerpt || activePost.content.slice(0, 120) + "..." }}
                />
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:col-span-4 flex flex-col h-full">
        <div className="bg-card/50 p-4 rounded-xl border border-border h-full flex flex-col">
          <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-4 pl-2 border-l-4 border-primary">
            Mais Recentes
          </h3>
          
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
            {posts.map((post, index) => {
              const isActive = index === currentIndex;
              
              return (
                <div
                  key={post.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    relative cursor-pointer p-3 rounded-lg transition-all duration-300 flex gap-3 items-center group
                    ${isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/30 border border-transparent"}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"
                    />
                  )}

                  {/* Thumb Pequena */}
                  <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-secondary">
                    {post.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        fill
                        className={`object-cover ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
                      />
                    )}
                  </div>

                  {/* Texto */}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                       {post.categories?.nodes?.[0]?.name || "Geral"}
                    </span>
                    <h4 className={`text-xs md:text-sm font-medium leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {post.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}