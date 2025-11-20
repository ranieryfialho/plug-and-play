import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Zap } from "lucide-react";

export default function HorizontalCard({ post }: { post: any }) {
  const isReview = !!post.camposDoReview;
  const href = isReview ? `/reviews/${post.slug}` : `/artigos/${post.slug}`;

  return (
    <Link href={href} className="group flex gap-4 items-start">
      <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden border border-border bg-secondary/50">
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-muted-foreground/50" />
            </div>
        )}
      </div>
      <div className="flex flex-col justify-center py-1 min-w-0">
        <span className="text-[10px] text-primary font-bold mb-1 uppercase tracking-wider truncate">
            {post.categories?.nodes?.[0]?.name || (isReview ? "Review" : "Notícia")}
        </span>
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
          {post.title}
        </h3>
        <span className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: ptBR })}
        </span>
      </div>
    </Link>
  );
}