import { fetchAPI } from "@/services/wordpress";
import Link from "next/link";
import { Compass, Star, Newspaper, BookOpen } from "lucide-react";
import ReviewCard from "@/components/reviews/ReviewCard";
import SectionHeader from "@/components/ui/section-header";
import AdUnit from "@/components/ads/AdUnit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar Todo o Conteúdo | Plug & Play",
  description: "Navegue por todos os nossos reviews, notícias, artigos e tutoriais em um só lugar.",
};

const EXPLORE_QUERY = `
  query ExploreData {
    # 1. Reviews (20 últimos)
    reviews(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id, title, slug, date
        featuredImage { node { sourceUrl } }
        categories { nodes { name, slug } }
        camposDoReview { notaDoReview }
      }
    }

    # 2. Posts Gerais (Notícias e Tutoriais - 20 últimos)
    posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id, title, slug, date
        featuredImage { node { sourceUrl } }
        categories { nodes { name, slug } }
      }
    }
  }
`;

export default async function ExplorePage() {
  let reviews = [];
  let posts = [];

  try {
    const data = await fetchAPI(EXPLORE_QUERY);
    reviews = data?.reviews?.nodes || [];
    posts = data?.posts?.nodes || [];
  } catch (error) {
    console.error("Erro ao carregar página Explorar:", error);
  }

  const tutorials = posts.filter((post: any) => 
    post.categories?.nodes?.some((cat: any) => cat.slug === 'tutoriais')
  );

  const news = posts.filter((post: any) => 
    !post.categories?.nodes?.some((cat: any) => cat.slug === 'tutoriais')
  );

  return (
    <div className="min-h-screen bg-background pb-20 pt-12">
      
      <div className="container mx-auto px-6 mb-12 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-card border border-border rounded-2xl mb-6 shadow-lg shadow-primary/10">
          <Compass className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Explorar Conteúdo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          O arquivo completo do Plug & Play. Mergulhe em nossas análises, notícias e guias.
        </p>
      </div>

      <div className="container mx-auto px-6 space-y-20">
        
        <section>
          <div className="flex items-center gap-3 mb-8">
             <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
             <h2 className="text-3xl font-bold text-white">Últimas Análises</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.slice(0, 8).map((item: any) => (
              <ReviewCard key={item.id} post={item} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
             <Link href="/reviews" className="text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-widest border-b border-primary pb-1">
                Ver todos os Reviews
             </Link>
          </div>
        </section>

        <AdUnit slotId="explore-mid" className="w-full h-[200px]" />

        <section>
          <div className="flex items-center gap-3 mb-8">
             <Newspaper className="w-6 h-6 text-blue-400" />
             <h2 className="text-3xl font-bold text-white">Notícias & Artigos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.length > 0 ? news.slice(0, 8).map((item: any) => (
              <ReviewCard key={item.id} post={item} />
            )) : (
              <p className="text-muted-foreground col-span-4 text-center py-10 border border-dashed border-border rounded-xl">Nenhuma notícia encontrada.</p>
            )}
          </div>
        </section>

        {tutorials.length > 0 && (
          <section>
            <SectionHeader title="Tutoriais & Guias" color="bg-green-500" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tutorials.slice(0, 6).map((item: any) => (
                <ReviewCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}