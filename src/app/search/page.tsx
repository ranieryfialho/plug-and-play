import { fetchAPI } from "@/services/wordpress";
import ReviewCard from "@/components/reviews/ReviewCard";
import { Search as SearchIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const term = q || "";
  let reviews = [];
  let error = false;

  if (term) {
    const data = await fetchAPI(SEARCH_QUERY, { term });
    if (data) {
      reviews = data.reviews?.nodes || [];
    } else {
      error = true; // Marcou erro se a API não respondeu
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="border-b border-border py-16 px-6 bg-card/50">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Resultados para &quot;<span className="text-primary">{term}</span>&quot;
          </h1>
          <p className="text-muted-foreground">
            {error 
              ? "Houve um problema na comunicação." 
              : `Encontramos ${reviews.length} ${reviews.length === 1 ? "resultado" : "resultados"}.`
            }
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        
        {/* Caso de Erro de Conexão */}
        {error && (
           <div className="flex flex-col items-center justify-center py-10 text-center border border-red-900/50 bg-red-900/10 rounded-xl mb-8">
             <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
             <h3 className="text-white font-bold">Erro de Conexão</h3>
             <p className="text-muted-foreground text-sm">Verifique se o seu WordPress está ligado.</p>
           </div>
        )}

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review: any) => (
              <ReviewCard key={review.id} post={review} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-card/30">
              <div className="bg-secondary/50 p-4 rounded-full mb-4">
                <SearchIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum review encontrado
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Não encontramos nada com esse termo. Tente buscar por outra palavra-chave.
              </p>
              <Link href="/">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-white">
                  Voltar para o Início
                </Button>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}