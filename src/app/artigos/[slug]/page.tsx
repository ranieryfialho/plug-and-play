import { fetchAPI } from "@/services/wordpress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User, ArrowLeft, Tag, Share2, ShoppingCart, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AdUnit from "@/components/ads/AdUnit";
import CommentsSection from "@/components/comments/CommentsSection";
import { Metadata } from "next";

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
      # Busca comentários aprovados
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

  return (
    <div className="min-h-screen bg-background pb-20">
      
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

        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
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
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Share2 className="w-5 h-5" />
          </Button>
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

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl">
        
        <div className="lg:col-span-8">
          
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

          <CommentsSection 
            postId={post.databaseId} 
            comments={comments} 
            path={`/artigos/${slug}`} 
          />
          
        </div>

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