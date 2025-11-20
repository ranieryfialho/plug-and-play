import { fetchAPI } from "@/services/wordpress";
import Link from "next/link";
import { Zap, Gamepad2, Smartphone } from "lucide-react";
import ReviewCard from "@/components/reviews/ReviewCard";
import ProductCard from "@/components/reviews/ProductCard";
import HorizontalCard from "@/components/reviews/HorizontalCard";
import SectionHeader from "@/components/ui/section-header";
import AdUnit from "@/components/ads/AdUnit";
import { Button } from "@/components/ui/button";
import HeroTitle from "@/components/ui/hero-title";
import HeroCarousel from "@/components/home/HeroCarousel";

const PORTAL_QUERY = `
  query PortalData {
    # 1. Busca TUDO misturado para o carrossel (Reviews + Notícias)
    # Pegamos 50 para ter estoque para as outras seções também
    allContent: posts(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id, title, slug, date, content, excerpt
          featuredImage { node { sourceUrl } }
          categories { nodes { name, slug } }
        }
    }
    # Reviews específicos para garantir que temos dados de nota/preço
    reviews(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id, title, slug, date, content
        featuredImage { node { sourceUrl } }
        categories { nodes { name, slug } }
        camposDoReview { notaDoReview, precoAtual }
      }
    }
  }
`;

export default async function Home() {
  let allPosts = [];
  let reviews = [];
  
  try {
    const data = await fetchAPI(PORTAL_QUERY);
    const rawPosts = data?.allContent?.nodes || [];
    reviews = data?.reviews?.nodes || [];
    
    allPosts = [...reviews, ...rawPosts].sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    allPosts = Array.from(new Map(allPosts.map(item => [item.id, item])).values());

  } catch (error) {
    console.error("Erro crítico na Home:", error);
  }

  const carouselPosts = allPosts.slice(0, 5);

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

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <section className="relative border-b border-border py-32 px-6 mb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative container mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm text-xs font-bold text-white mb-8 border border-white/10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Tech Descomplicada
          </div>
          <HeroTitle />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Muito além de reviews. O seu hub definitivo sobre <strong>Hardware, Inteligência Artificial e Games</strong>. 
            Notícias, tutoriais e análises aprofundadas para quem respira tecnologia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)] h-12 px-8 rounded-full cursor-pointer">
               <Link href="/category/reviews">Explorar Artigos</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 px-8 rounded-full backdrop-blur-sm cursor-pointer">
               <Link href="/sobre">Quem somos</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mb-16">
         <SectionHeader title="✨ Destaques da Semana" />
         <HeroCarousel posts={carouselPosts} />
      </div>

      <div className="container mx-auto px-6 my-12">
         <AdUnit slotId="home-top" className="w-full h-[250px]" />
      </div>

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
        
        <div className="lg:col-span-8 space-y-16">
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
               </div>
             )}
          </section>

          <AdUnit slotId="home-mid" className="w-full h-[250px]" />

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

        <div className="lg:col-span-4 space-y-12">
           <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-bold text-white mb-2">Plug & Play</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Seu guia definitivo no universo da tecnologia.
              </p>
              <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white cursor-pointer">
                 <Link href="/sobre">Conheça a equipe</Link>
              </Button>
           </div>

           <div>
              <AdUnit slotId="home-sidebar" format="rectangle" className="w-full h-[600px]" />
           </div>
        </div>
      </div>
    </div>
  );
}