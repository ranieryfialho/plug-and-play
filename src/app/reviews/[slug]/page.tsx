import { fetchAPI } from "@/services/wordpress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star, CheckCircle2, XCircle, ShoppingCart, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AdUnit from "@/components/ads/AdUnit";
import { Metadata } from "next";

// QUERY SEGURA: Removi 'excerpt' para evitar erro se não estiver ativado no WP
const POST_QUERY = `
  query GetReviewBySlug($slug: String) {
    reviews(where: { name: $slug }) {
      nodes {
        title
        content
        date
        author {
          node {
            name
            avatar {
              url
            }
            roles {
              nodes {
                displayName
              }
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
          notaDoReview
          pros
          contras
          linkDeAfiliadoMlolx
        }
      }
    }
  }
`;

// Função auxiliar para limpar tags HTML (útil para o SEO)
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
}

// --- SEO DINÂMICO ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchAPI(POST_QUERY, { slug });
  
  // Se der erro ou não achar, retorna título padrão
  if (!data?.reviews?.nodes || data.reviews.nodes.length === 0) {
    return { title: "Review não encontrado" };
  }

  const post = data.reviews.nodes[0];
  
  // Gera descrição a partir do conteúdo (já que removemos o excerpt)
  const cleanDescription = post.content 
    ? stripHtml(post.content).slice(0, 160) + "..." 
    : `Confira o review completo do ${post.title} no Plug & Play.`;

  const ogImage = post.featuredImage?.node?.sourceUrl || "/og-default.jpg"; 

  return {
    title: `${post.title} | Plug & Play`,
    description: cleanDescription,
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: `https://seusite.com/reviews/${slug}`,
      siteName: 'Plug & Play',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      locale: 'pt_BR',
      type: 'article',
    },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  const data = await fetchAPI(POST_QUERY, { slug });

  if (!data?.reviews?.nodes || data.reviews.nodes.length === 0) {
    notFound();
  }

  const post = data.reviews.nodes[0];
  
  const formatList = (text: string) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };

  const prosList = formatList(post.camposDoReview?.pros || '');
  const consList = formatList(post.camposDoReview?.contras || '');

  // Lógica do Autor
  const authorName = post.author?.node?.name || 'Redação';
  const authorAvatarUrl = post.author?.node?.avatar?.url;
  const rawRole = post.author?.node?.roles?.nodes?.[0]?.displayName?.toLowerCase() || '';
  
  let authorRole = 'Colaborador'; 
  if (rawRole.includes('admin')) authorRole = 'Administrador';
  else if (rawRole.includes('editor')) authorRole = 'Editor';
  else if (rawRole.includes('author') || rawRole.includes('autor')) authorRole = 'Redator';
  else if (authorName === 'Raniery Fialho') authorRole = 'Administrador'; 

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- HERO HEADER --- */}
      <div className="relative h-[400px] w-full border-b border-border">
        {post.featuredImage?.node?.sourceUrl ? (
          <>
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-secondary/20" />
        )}

        <div className="absolute bottom-0 w-full">
          <div className="container mx-auto px-6 pb-10">
            <div className="flex gap-2 mb-4">
              {post.categories?.nodes?.length > 0 ? (
                post.categories.nodes.map((cat: any) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`}>
                    <Badge className="bg-primary text-white hover:bg-secondary border-none px-3 py-1 text-sm font-medium transition-colors cursor-pointer">
                      {cat.name}
                    </Badge>
                  </Link>
                ))
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  Review
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/50 border border-border flex items-center justify-center relative overflow-hidden">
                    {authorAvatarUrl ? (
                      <Image src={authorAvatarUrl} alt={authorName} fill className="object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-white leading-none mb-1">{authorName}</span>
                    <span className="text-xs text-accent font-medium tracking-wide">{authorRole}</span>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-border"></div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Publicado {formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: ptBR })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Topo */}
      <div className="container mx-auto px-6 mt-8">
        <AdUnit slotId="1234567890" className="w-full h-[250px] md:h-[300px]" />
      </div>

      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Conteúdo */}
        <div className="lg:col-span-2">
          <article 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-primary hover:prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: post.content || '' }} 
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 w-full flex flex-col gap-8">
          <div className="sticky top-24 w-full">
            <Card className="w-full bg-card border-border p-6 shadow-[0_0_40px_rgba(124,58,237,0.1)] hover:border-primary/30 transition-colors mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Veredito
              </h3>
              <div className="text-center mb-8 p-6 bg-background/50 rounded-xl border border-border">
                <div className="text-5xl font-black text-primary mb-2">
                  {post.camposDoReview?.notaDoReview}
                  <span className="text-xl text-muted-foreground font-medium">/5</span>
                </div>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(post.camposDoReview?.notaDoReview || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`} />
                  ))}
                </div>
              </div>
              {prosList.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> O que gostamos</h4>
                  <ul className="space-y-2">
                    {prosList.map((pro: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2 items-start"><span className="text-green-500/50 mt-1">•</span> {pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {consList.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" /> O que não gostamos</h4>
                  <ul className="space-y-2">
                    {consList.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2 items-start"><span className="text-red-500/50 mt-1">•</span> {con}</li>
                    ))}
                  </ul>
                </div>
              )}
              {post.camposDoReview?.linkDeAfiliadoMlolx && (
                <Button className="w-full bg-primary hover:bg-secondary text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:scale-[1.02]" asChild>
                  <a href={post.camposDoReview.linkDeAfiliadoMlolx} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Ver Preço Atual
                  </a>
                </Button>
              )}
              <p className="text-xs text-center text-muted-foreground mt-4">Ao comprar através deste link, podemos receber uma comissão.</p>
            </Card>

            <div className="w-full">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block text-center opacity-50">Publicidade</span>
              <AdUnit slotId="0987654321" format="rectangle" className="w-full h-[500px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}