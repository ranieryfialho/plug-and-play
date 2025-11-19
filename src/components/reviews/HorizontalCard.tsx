import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HorizontalCard({ post }: { post: any }) {
  return (
    <Link href={`/reviews/${post.slug}`} className="group flex gap-4 items-start">
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-border bg-secondary/50">
        {post.featuredImage?.node?.sourceUrl && (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </div>
      <div className="flex flex-col justify-center py-1">
        <span className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">
            {post.categories?.nodes[0]?.name || "Review"}
        </span>
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {post.title}
        </h3>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: ptBR })}
        </span>
      </div>
    </Link>
  );
}