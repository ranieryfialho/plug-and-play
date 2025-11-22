import { fetchAPI } from "@/services/wordpress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User, ArrowLeft, Tag, Share2, ShoppingCart, ExternalLink, Facebook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AdUnit from "@/components/ads/AdUnit";
import CommentsSection from "@/components/comments/CommentsSection";
import { Metadata } from "next";

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
);

const POST_QUERY = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      content
      excerpt
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
      camposDoReview {
        precoAtual
        linkDeAfiliadoMlolx
      }
      comments(first: 50, where: { orderby: COMMENT_DATE, order: ASC }) {
        nodes {
          id
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
        }
      }
    }
  }
`;

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchAPI(POST_QUERY, { slug });
  const post = data?.post;

  if (!post) return { title: "Artigo não encontrado" };

  const cleanDescription = post.excerpt 
    ? stripHtml(post.excerpt).slice(0, 160) 
    : stripHtml(post.content).slice(0, 160) + "...";

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
  const comments = post.comments?.nodes || [];

  const currentUrl = `https://plugnplaytech.com.br/artigos/${slug}`; 
  const shareText = encodeURIComponent(post.title);
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* --- CABEÇALHO DO ARTIGO --- */}
      <div className="container mx-auto px-6 pt-12 pb-6 max-w-4xl">
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

        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary/50 overflow-hidden relative border border-border flex items-center justify-center">
                {authorAvatarUrl ? (
                     <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" />
                ) : <User className="w-5 h-5 text-primary" />}
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-white text-sm">{authorName}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: ptBR })}</span>
                </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-all"><Facebook className="w-5 h-5" /></a>
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"><XIcon /></a>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366] transition-all"><WhatsAppIcon /></a>
           </div>
        </div>

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
        
        {/* Coluna Esquerda: Texto + Comentários */}
        <div className="lg:col-span-8">
          
          {/* FAIXA DE OFERTA */}
          {post.camposDoReview?.linkDeAfiliadoMlolx && (
            <div className="mb-10 bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md hover:border-primary/40 transition-colors group">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Produto mencionado</p>
                    <p className="text-2xl font-bold text-white">
                       {post.camposDoReview.precoAtual || "Ver Oferta"}
                    </p>
                  </div>
               </div>
               <Button asChild className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer">
                  <a href={post.camposDoReview.linkDeAfiliadoMlolx} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ver na Loja
                  </a>
               </Button>
            </div>
          )}

          <article 
            className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-primary hover:prose-a:text-accent
            prose-ul:text-gray-300 prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content || '' }} 
          />

          {/* --- SEÇÃO DE COMENTÁRIOS NATIVOS --- */}
          <CommentsSection 
            postId={post.databaseId} 
            comments={comments} 
            path={`/artigos/${slug}`} 
          />
          
        </div>

        {/* Coluna Direita: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           
           {post.camposDoReview?.linkDeAfiliadoMlolx && (
             <div className="sticky top-24 z-10">
                <Card className="bg-card border-border p-6 shadow-lg mb-8">
                  <h3 className="font-bold text-white mb-4">Interessou?</h3>
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-white block mb-1">
                      {post.camposDoReview.precoAtual || "Oferta"}
                    </span>
                    <span className="text-xs text-muted-foreground">Melhor preço encontrado</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" asChild>
                    <a href={post.camposDoReview.linkDeAfiliadoMlolx} target="_blank" rel="noopener noreferrer">
                      Comprar Agora
                    </a>
                  </Button>
                </Card>
             </div>
           )}

           <div className="w-full">
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