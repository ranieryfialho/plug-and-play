import { fetchAPI } from "@/services/wordpress";
import Link from "next/link";
import { Zap, Gamepad2, Smartphone, Newspaper } from "lucide-react";
import ReviewCard from "@/components/reviews/ReviewCard";
import ProductCard from "@/components/reviews/ProductCard";
import HorizontalCard from "@/components/reviews/HorizontalCard";
import SectionHeader from "@/components/ui/section-header";
import AdUnit from "@/components/ads/AdUnit";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import HeroTitle from "@/components/ui/hero-title"; // <--- IMPORTADO AQUI

// Função auxiliar para resumo
function getExcerpt(html: string, limit = 150) {
  if (!html) return "";
  const text = html.replace(/<[^>]*>?/gm, ''); 
  return text.slice(0, limit) + (text.length > limit ? "..." : "");
}

// --- QUERY HÍBRIDA ---
const PORTAL_QUERY = `
  query PortalData {
    # 1. Reviews (Produtos, Análises)
    reviews(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
        content
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
          precoAtual
        }
      }
    }

    # 2. Posts (Notícias, Artigos Gerais)
    posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        date
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
  }
`;

export default async function Home() {
  let reviews = [];
  let articles = [];
  
  try {
    const data = await fetchAPI(PORTAL_QUERY);
    reviews = data?.reviews?.nodes || [];
    articles = data?.posts?.nodes || [];
  } catch (error) {
    console.error("Erro crítico na Home:", error);
  }

  // --- FILTRAGEM DE REVIEWS (Javascript) ---
  
  // Ofertas
  const ofertasPosts = reviews.filter((post: any) => 
    post.categories?.nodes?.some((cat: any) => cat.slug === 'ofertas')
  ).slice(0, 4);

  // Games
  const gamesPosts = reviews.filter((post: any) => 
    post.categories?.nodes?.some((cat: any) => cat.slug === 'games')
  ).slice(0, 5);

  // Celulares
  const celularesPosts = reviews.filter((post: any) => 
    post.categories?.nodes?.some((cat: any) => cat.slug === 'celulares' || cat.slug === 'smartphones')
  ).slice(0, 4);

  // Destaques Gerais
  const generalPosts = reviews.filter((post: any) => 
    !post.categories?.nodes?.some((cat: any) => cat.slug === 'ofertas')
  );

  // Hero Logic
  const heroPost = generalPosts[0]; 
  const heroSidePosts = generalPosts.slice(1, 5);
  const heroExcerpt = heroPost ? getExcerpt(heroPost.content, 120) : "";

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative border-b border-border py-32 px-6 mb-12 overflow-hidden">
        {/* Efeito de fundo roxo (Glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative container mx-auto text-center z-10">
          
          {/* Badge Novidade */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm text-xs font-bold text-white mb-8 border border-white/10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Tech Descomplicada
          </div>
          
          {/* TÍTULO ANIMADO (Aqui está ele de volta!) */}
          <HeroTitle />
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Reviews honestos e guias práticos. Focado no que realmente importa 
            para o seu dia a dia tecnológico.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)] h-12 px-8 rounded-full cursor-pointer">
               <Link href="/category/reviews">Explorar Artigos</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 px-8 rounded-full backdrop-blur-sm cursor-pointer">
               <Link href="/sobre">Conheça a equipe</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DESTAQUES (Hero Post + Lista Lateral) --- */}
      <div className="container mx-auto px-6 mb-16">
         <SectionHeader title="✨ Destaques da Semana" />
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Destaque Principal */}
            <div className="lg:col-span-8 relative group">
              {heroPost ? (
                <Link href={`/reviews/${heroPost.slug}`} className="block h-[500px] relative rounded-2xl overflow-hidden border border-border">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                   {heroPost.featuredImage?.node?.sourceUrl ? (
                     <img 
                        src={heroPost.featuredImage.node.sourceUrl} 
                        alt={heroPost.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                   ) : (
                     <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-muted-foreground">Sem Imagem</div>
                   )}
                   <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
                      <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-white uppercase bg-primary rounded-full shadow-lg">
                        Destaque
                      </span>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
                        {heroPost.title}
                      </h2>
                      <p className="text-gray-200 line-clamp-2 text-lg font-medium drop-shadow-md">
                        {heroExcerpt}
                      </p>
                   </div>
                </Link>
              ) : (
                <div className="h-[500px] rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground">
                  Nenhum destaque encontrado.
                </div>
              )}
            </div>

            {/* Lista Lateral (Reviews Recentes) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-card/50 p-4 rounded-xl border border-border h-full">
                <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-4 pl-2 border-l-4 border-accent">
                  Análises Recentes
                </h3>
                <div className="flex flex-col gap-5">
                  {heroSidePosts.length > 0 ? (
                    heroSidePosts.map((post: any) => (
                      <HorizontalCard key={post.id} post={post} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-4">Sem posts recentes.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* --- ANÚNCIO BILLBOARD --- */}
      <div className="container mx-auto px-6 my-12">
         <AdUnit slotId="home-top" className="w-full h-[250px]" />
      </div>

      {/* --- SEÇÃO OFERTAS --- */}
      {ofertasPosts.length > 0 && (
        <section className="py-12 bg-secondary/5 border-y border-border mb-12">
          <div className="container mx-auto px-6">
             <SectionHeader title="🔥 Ofertas do Dia" href="/category/ofertas" color="bg-red-500" />
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {ofertasPosts.map((post: any) => (
                   <ProductCard key={post.id} post={post} />
                ))}
             </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- COLUNA PRINCIPAL (Esquerda) --- */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Seção Celulares */}
          <section>
             <SectionHeader title="📱 Celulares & Tablets" href="/category/celulares" color="bg-blue-500" />
             {celularesPosts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {celularesPosts.map((post: any) => (
                    <ReviewCard key={post.id} post={post} />
                  ))}
               </div>
             ) : (
               <div className="p-6 border border-dashed border-border rounded-xl text-center text-muted-foreground bg-card/30">
                 <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                 <p>Nenhum review de celular encontrado.</p>
                 <p className="text-xs mt-1">Verifique a categoria 'celulares' no WordPress.</p>
               </div>
             )}
          </section>

          {/* Anúncio In-Feed */}
          <AdUnit slotId="home-mid" className="w-full h-[250px]" />

          {/* Seção Games */}
          <section>
             <SectionHeader title="🎮 Mundo Gamer" href="/category/games" color="bg-purple-500" />
             {gamesPosts.length > 0 ? (
               <div className="grid grid-cols-1 gap-6">
                  {gamesPosts.map((post: any) => (
                     <HorizontalCard key={post.id} post={post} />
                  ))}
               </div>
             ) : (
                <p className="text-muted-foreground text-sm">Nenhum review de game encontrado.</p>
             )}
          </section>

        </div>

        {/* --- SIDEBAR (Direita - Mix) --- */}
        <div className="lg:col-span-4 space-y-12">
           
           {/* Widget: ÚLTIMAS NOTÍCIAS (Posts Padrão) */}
           <div className="p-6 rounded-xl border border-border bg-card/50">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-green-500" />
                Últimas Notícias
              </h3>
              
              <div className="flex flex-col gap-4">
                {articles.length > 0 ? (
                  articles.map((item: any) => (
                    <Link key={item.id} href={`/artigos/${item.slug}`} className="flex gap-3 group border-b border-border/50 pb-3 last:border-0 last:pb-0">
                       <div>
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                            {item.categories?.nodes?.[0]?.name || "Notícia"}
                          </span>
                          <h5 className="text-sm font-medium text-gray-200 leading-snug group-hover:text-primary transition-colors line-clamp-2 mt-1">
                            {item.title}
                          </h5>
                          <span className="text-[10px] text-muted-foreground mt-1 block">
                            {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: ptBR })}
                          </span>
                       </div>
                    </Link>
                  ))
                ) : (
                   <p className="text-sm text-muted-foreground py-4">Nenhuma notícia publicada.</p>
                )}
              </div>
           </div>

           {/* Widget Sobre */}
           <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-bold text-white mb-2">Plug & Play</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Seu guia definitivo no universo da tecnologia.
              </p>
              <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white cursor-pointer">
                 <Link href="/sobre">Conheça a equipe</Link>
              </Button>
           </div>

           {/* Anúncio Lateral */}
           <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block text-center mb-2">Publicidade</span>
              <AdUnit slotId="home-sidebar" format="rectangle" className="w-full h-[600px]" />
           </div>

           {/* Newsletter */}
           <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-purple-900/20 border border-primary/20">
              <h3 className="font-bold text-white mb-2">Receba novidades</h3>
              <input type="email" placeholder="Seu melhor email" className="w-full p-2 rounded bg-background border border-border text-sm mb-2 text-white placeholder:text-muted-foreground" />
              <Button className="w-full bg-primary text-white">Inscrever-se</Button>
           </div>

        </div>
      </div>
    </div>
  );
}