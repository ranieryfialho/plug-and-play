import { fetchAPI } from "@/services/wordpress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdUnit from "@/components/ads/AdUnit";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

// QUERY: Busca um POST padrão (Notícia/Artigo), não um Review
const POST_QUERY = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      date
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

// Função auxiliar para limpar HTML (SEO)
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

// SEO Dinâmico
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchAPI(POST_QUERY, { slug });
  const post = data?.post;

  if (!post) return { title: "Artigo não encontrado" };

  const cleanDescription = post.content 
    ? stripHtml(post.content).slice(0, 160) + "..." 
    : `Leia mais sobre ${post.title} no Plug & Play.`;

  const ogImage = post.featuredImage?.node?.sourceUrl || "/og-default.jpg";

  return {
    title: `${post.title} | Plug & Play`,
    description: cleanDescription,
    openGraph: {
      title: post.title,
      description: cleanDescription,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchAPI(POST_QUERY, { slug });

  if (!data?.post) {
    notFound();
  }

  const post = data.post;
  const authorName = post.author?.node?.name || 'Redação';
  const authorAvatarUrl = post.author?.node?.avatar?.url;

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* --- CABEÇALHO DO ARTIGO --- */}
      <div className="container mx-auto px-6 pt-12 pb-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Home
        </Link>

        <div className="flex gap-2 mb-6">
            {post.categories?.nodes?.map((cat: any) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <Badge className="bg-primary text-white hover:bg-secondary border-none cursor-pointer uppercase tracking-wider text-xs">
                {cat.name}
                </Badge>
            </Link>
            ))}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary/50 overflow-hidden relative border border-border">
                {authorAvatarUrl ? (
                     <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" />
                ) : <User className="w-5 h-5 text-primary m-auto" />}
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-white text-sm">{authorName}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: ptBR })}</span>
                </div>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Imagem Principal */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12 border border-border shadow-lg">
             <Image 
               src={post.featuredImage.node.sourceUrl} 
               alt={post.title} 
               fill 
               className="object-cover"
               priority
             />
          </div>
        )}
      </div>

      {/* --- CORPO DO TEXTO + SIDEBAR --- */}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl">
        
        {/* Coluna Esquerda: Texto */}
        <div className="lg:col-span-8">
          <article 
            className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-primary hover:prose-a:text-accent
            prose-ul:text-gray-300 prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content || '' }} 
          />
        </div>

        {/* Coluna Direita: Sidebar Simples */}
        <div className="lg:col-span-4 space-y-8">
           {/* Anúncio Lateral */}
           <div className="w-full sticky top-24">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block text-center opacity-50">
                Publicidade
              </span>
              <AdUnit slotId="article-sidebar" format="rectangle" className="w-full h-[600px]" />
            </div>
        </div>

      </div>
    </div>
  );
}