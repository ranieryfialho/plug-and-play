import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  color?: string;
}

export default function SectionHeader({ title, href, color = "bg-primary" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-6 rounded-full ${color}`} />
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link 
          href={href} 
          className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          Ver mais <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}