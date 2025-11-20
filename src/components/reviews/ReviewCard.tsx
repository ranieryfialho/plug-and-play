"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Calendar, Newspaper } from "lucide-react"; // Adicionei Newspaper
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
    camposDoReview?: {
      notaDoReview: number;
    };
  };
}

export default function ReviewCard({ post }: ReviewCardProps) {
  const isReview = !!post.camposDoReview;
  const link = isReview ? `/reviews/${post.slug}` : `/artigos/${post.slug}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={link}>
        <Card className="h-full overflow-hidden border-border bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 group">
          
          <div className="relative w-full h-52 bg-white">
            {post.featuredImage?.node?.sourceUrl ? (
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/50">
                 <Newspaper className="w-10 h-10 opacity-20" />
              </div>
            )}
            
            {isReview && post.camposDoReview?.notaDoReview && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur shadow-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-black text-sm">
                  {post.camposDoReview.notaDoReview}
                </span>
              </div>
            )}
          </div>

          <CardHeader className="p-5 pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(post.date), {
                addSuffix: true,
                locale: ptBR,
              })}
            </div>
            <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </CardHeader>

          <CardContent className="p-5 pt-0">
          </CardContent>

          <CardFooter className="p-5 pt-0 mt-auto pb-5">
            <Badge variant="secondary" className="bg-white hover:bg-primary hover:text-white text-primary transition-colors border border-primary/10">
              {isReview ? "Ler Review" : "Ler Artigo"}
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}