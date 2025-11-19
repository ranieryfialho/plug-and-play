import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  post: any;
}

export default function ProductCard({ post }: ProductCardProps) {
  // MUDANÇA AQUI: Lendo 'precoAtual' em vez de 'preco'
  const price = post.camposDoReview?.precoAtual; 

  return (
    <Link href={`/reviews/${post.slug}`} className="group">
      <Card className="h-full bg-card border-border overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1">
        <div className="relative w-full h-48 bg-white p-4">
          {post.featuredImage?.node?.sourceUrl && (
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none font-bold">
              OFERTA
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-xs text-muted-foreground">A partir de</p>
              <p className="text-xl font-bold text-white">
                {price || "Ver Preço"}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}