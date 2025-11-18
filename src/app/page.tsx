import { fetchAPI } from "@/services/wordpress";
import ReviewCard from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link"; // <--- IMPORTANTE: Adicionado

const HOME_QUERY = `
  query HomeData {
    reviews(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
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
        camposDoReview {
          notaDoReview
        }
      }
    }
  }
`;

export default async function Home() {
  const data = await fetchAPI(HOME_QUERY);
  const reviews = data?.reviews?.nodes || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section Dark */}
      <section className="relative border-b border-border py-24 px-6 mb-12 overflow-hidden">
        
        {/* Efeito de brilho de fundo roxo bem sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative container mx-auto text-center z-10">
          {/* Badge Novidade */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-xs font-bold text-accent mb-6 border border-border">
            <Zap className="w-3 h-3 fill-accent" />
            Novidade: Blog 2.0 no Ar
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Tecnologia descomplicada <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              para o seu dia a dia.
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Reviews honestos, guias práticos e as últimas novidades sobre IA e Games.
            Focado no que realmente importa para você.
          </p>

          <div className="flex justify-center gap-4">
            {/* Botão Ver Reviews (Com Link) */}
            <Link href="/category/reviews"> 
              <Button size="lg" className="bg-primary hover:bg-secondary text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                Ver Reviews
              </Button>
            </Link>

            {/* Botão Sobre Nós (Com Link) - CORRIGIDO AQUI */}
            <Link href="/sobre">
              <Button size="lg" variant="outline" className="border-border bg-card text-white hover:bg-border hover:text-accent">
                Sobre Nós
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid de Reviews */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Últimos Reviews
          </h2>
          
          <Link href="/category/reviews">
            <Button variant="ghost" className="text-accent hover:text-accent hover:bg-card gap-2 group">
              Ver todos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <ReviewCard key={review.id} post={review} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center rounded-xl border border-dashed border-border bg-card/50">
              <p className="text-muted-foreground">
                Nenhum review encontrado. Comece a publicar no WordPress! 🚀
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}