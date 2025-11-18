import { fetchAPI } from "@/services/wordpress";
import ReviewCard from "@/components/reviews/ReviewCard";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// QUERY DE BUSCA: Filtra reviews pelo termo 'search'
const SEARCH_QUERY = `
  query SearchReviews($term: String!) {
    reviews(where: { search: $term }) {
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

// Componente de Busca (Server Component)
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  // Tratamento para Next.js 15
  const { q } = await searchParams;
  const term = q || "";

  // Se não tiver termo, não busca nada
  const reviews = term ? (await fetchAPI(SEARCH_QUERY, { term }))?.reviews?.nodes || [] : [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="border-b border-border py-16 px-6 bg-card/50">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Resultados para &quot;<span className="text-primary">{term}</span>&quot;
          </h1>
          <p className="text-muted-foreground">
            Encontramos {reviews.length} {reviews.length === 1 ? "resultado" : "resultados"}.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review: any) => (
              <ReviewCard key={review.id} post={review} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-card/30">
            <div className="bg-secondary/50 p-4 rounded-full mb-4">
              <SearchIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum review encontrado
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Não encontramos nada com esse termo. Tente buscar por outra palavra-chave ou navegue pelas categorias.
            </p>
            <Link href="/">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-white">
                Voltar para o Início
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}