"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ReviewCardProps {
  post: {
    title: string;
    slug: string;
    date: string;
    featuredImage?: {
      node: {
        sourceUrl: string;
      };
    };
    camposDoReview: {
      notaDoReview: number;
    };
  };
}

export default function ReviewCard({ post }: ReviewCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/reviews/${post.slug}`}>
        {/* Fundo Card Escuro (#1A1A1A) */}
        <Card className="h-full overflow-hidden border-border bg-card hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:border-primary/50 transition-all duration-300 group">
          
          {/* Imagem */}
          <div className="relative w-full h-52 bg-background/50">
            {post.featuredImage?.node?.sourceUrl ? (
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sem imagem
              </div>
            )}
            
            {/* Nota */}
            <div className="absolute top-3 right-3 bg-background/80 backdrop-blur border border-white/10 shadow-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-white text-sm">
                {post.camposDoReview.notaDoReview}
              </span>
            </div>
          </div>

          <CardHeader className="p-5 pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(post.date), {
                addSuffix: true,
                locale: ptBR,
              })}
            </div>
            {/* Título Branco, Hover Azul Brilhante */}
            <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {post.title}
            </h3>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            {/* Espaço para resumo */}
          </CardContent>

          <CardFooter className="p-5 pt-0 mt-auto pb-5">
            {/* Botão "Ler Review" Roxo Vibrante (#7C3AED) */}
            <Badge className="bg-primary hover:bg-secondary text-white transition-colors">
              Ler Review
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}