import { fetchAPI } from "@/services/wordpress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star, CheckCircle2, XCircle, ShoppingCart, Calendar, User, Tag, Facebook, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const PAGE_QUERY = `
  query GetReviewData($slug: String) {
    reviews(where: { name: $slug }) {
      nodes {
        id
        databaseId # <--- IMPORTANTE: ID Numérico para comentários
        title
        content
        excerpt
        date
        author {
          node {
            name
            avatar { url }
            roles { nodes { displayName } }
          }
        }
        featuredImage {
          node { sourceUrl }
        }
        categories {
          nodes { name, slug }
        }
        camposDoReview {
          notaDoReview
          pros
          contras
          linkDeAfiliadoMlolx
          precoAtual
          resumoVeredito
        }
        # Comentários
        comments(first: 50, where: { orderby: COMMENT_DATE, order: ASC }) {
          nodes {
            id
            content
            date
            author {
              node {
                name
                avatar { url }
              }
            }
          }
        }
      }
    }
    # Sidebar: Mais Recentes
    recents: reviews(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id, title, slug, date
        featuredImage { node { sourceUrl } }
      }
    }
  }
`;

function getExcerpt(html: string, limit = 150) {
  if (!html) return "";
  const text = html.replace(/<[^>]*>?/gm, ''); 
  return text.slice(0, limit) + (text.length > limit ? "..." : "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchAPI(PAGE_QUERY, { slug });
  const post = data?.reviews?.nodes[0];

  if (!post) return { title: "Review não encontrado" };

  const cleanDescription = post.excerpt 
    ? getExcerpt(post.excerpt, 160) 
    : getExcerpt(post.content, 160);

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

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  
  let data = null;
  try {
    data = await fetchAPI(PAGE_QUERY, { slug });
  } catch (error) {
    console.error("Erro ao buscar review:", error);
  }

  if (!data?.reviews?.nodes || data.reviews.nodes.length === 0) {
    notFound();
  }

  const post = data.reviews.nodes[0];
  const recentPosts = data.recents?.nodes || [];
  const comments = post.comments?.nodes || [];
  const summary = getExcerpt(post.content, 180);

  const formatList = (text: string) => text ? text.split('\n').filter(item => item.trim() !== '') : [];
  const prosList = formatList(post.camposDoReview?.pros || '');
  const consList = formatList(post.camposDoReview?.contras || '');
  
  const authorName = post.author?.node?.name || 'Redação';
  const authorAvatarUrl = post.author?.node?.avatar?.url;
  const rawRole = post.author?.node?.roles?.nodes?.[0]?.displayName?.toLowerCase() || '';
  let authorRole = 'Colaborador'; 
  if (rawRole.includes('admin')) authorRole = 'Administrador';
  else if (rawRole.includes('editor')) authorRole = 'Editor';
  else if (authorName === 'Raniery Fialho') authorRole = 'Administrador';

  const currentUrl = `https://plugnplaytech.com.br/reviews/${slug}`; 
  const shareText = encodeURIComponent(post.title);
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* --- HEADER EDITORIAL --- */}
      <div className="container mx-auto px-6 pt-8 pb-6 max-w-6xl">
        <div className="flex gap-2 mb-4">
          {post.categories?.nodes?.map((cat: any) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <Badge className="bg-primary text-white hover:bg-secondary border-none px-3 py-1 text-sm font-medium transition-colors cursor-pointer uppercase tracking-wider">
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-6 gap-4">
           <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/50 border border-border flex items-center justify-center relative overflow-hidden">
                  {authorAvatarUrl ? (
                    <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" />
                  ) : <User className="w-6 h-6 text-primary" />}
              </div>
              <div className="flex flex-col">
                  <div className="text-sm text-gray-200">
                    Por <span className="text-primary font-bold">{authorName}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                     {formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: ptBR })}
                  </div>
              </div>
           </div>

           <div className="flex items-center gap-2">
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                <XIcon />
              </a>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366] transition-all">
                <WhatsAppIcon />
              </a>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl">
        
        <div className="lg:col-span-8">
          
          {post.featuredImage?.node?.sourceUrl && (
            <div className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden mb-8 border border-border shadow-lg">
               <Image 
                 src={post.featuredImage.node.sourceUrl} 
                 alt={post.title} 
                 fill 
                 className="object-cover"
                 priority
               />
            </div>
          )}

          {post.camposDoReview?.linkDeAfiliadoMlolx && (
            <div className="mb-10 bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md hover:border-primary/40 transition-colors group">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Melhor preço encontrado</p>
                    <p className="text-2xl font-bold text-white">
                       {post.camposDoReview.precoAtual || "Ver Oferta"}
                    </p>
                  </div>
               </div>
               <Button asChild className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer">
                  <a href={post.camposDoReview.linkDeAfiliadoMlolx} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ir para Loja
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

          <CommentsSection 
            postId={post.databaseId} 
            comments={comments} 
            path={`/reviews/${slug}`} 
          />

        </div>

        <div className="lg:col-span-4 space-y-8">
          
          <div className="sticky top-24">
            
            <Card className="bg-card border-border p-6 shadow-2xl shadow-primary/5 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  Veredito
                </h3>
                <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <span className="text-primary font-bold">{post.camposDoReview?.notaDoReview}/5</span>
                </div>
              </div>

              {post.camposDoReview?.resumoVeredito ? (
                 <p className="text-sm text-muted-foreground mb-6 italic border-l-2 border-primary pl-3">
                   "{post.camposDoReview.resumoVeredito}"
                 </p>
              ) : (
                 <p className="text-sm text-muted-foreground mb-6 italic border-l-2 border-primary pl-3">
                   "{summary}"
                 </p>
              )}

              <div className="space-y-4 mb-6">
                 {prosList.slice(0, 3).map((pro: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                       <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                       <span>{pro}</span>
                    </div>
                 ))}
                 {consList.slice(0, 3).map((con: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                       <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                       <span>{con}</span>
                    </div>
                 ))}
              </div>

              {post.camposDoReview?.linkDeAfiliadoMlolx && (
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-bold cursor-pointer shadow-lg shadow-green-900/20">
                  <a href={post.camposDoReview?.linkDeAfiliadoMlolx} target="_blank" rel="noopener noreferrer">
                    Comprar Agora
                  </a>
                </Button>
              )}
              
              <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-muted-foreground opacity-70">
                <ExternalLink className="w-3 h-3" />
                Link seguro de parceiro
              </div>
            </Card>

            <div className="mb-8 w-full flex justify-center">
              <AdUnit slotId="sidebar-article" format="rectangle" className="w-[300px] h-[250px]" />
            </div>

            <div className="bg-card/50 border border-border rounded-xl p-5">
               <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-yellow-400" /> Últimas do Blog
               </h4>
               <div className="flex flex-col gap-4">
                  {recentPosts.map((recent: any) => (
                    <Link key={recent.id} href={`/reviews/${recent.slug}`} className="flex gap-3 group">
                       <div className="relative w-20 h-16 rounded-md overflow-hidden bg-secondary shrink-0">
                          {recent.featuredImage?.node?.sourceUrl && (
                            <Image src={recent.featuredImage.node.sourceUrl} alt={recent.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                          )}
                       </div>
                       <div>
                          <h5 className="text-sm font-medium text-gray-200 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {recent.title}
                          </h5>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(recent.date), { addSuffix: true, locale: ptBR })}
                          </span>
                       </div>
                    </Link>
                  ))}
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}