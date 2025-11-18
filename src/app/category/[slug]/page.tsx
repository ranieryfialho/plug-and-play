import { fetchAPI } from "@/services/wordpress";
import ReviewCard from "@/components/reviews/ReviewCard";
import { notFound } from "next/navigation";
import { FolderOpen } from "lucide-react";

// QUERY: Busca a categoria e os reviews dentro dela
const CATEGORY_QUERY = `
  query GetCategoryAndPosts($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      name
      description
      reviews(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
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
  }
`;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchAPI(CATEGORY_QUERY, { slug });

  // Se a categoria não existir, 404
  if (!data?.category) {
    notFound();
  }

  const { name, description, reviews } = data.category;
  const posts = reviews?.nodes || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cabeçalho da Categoria */}
      <section className="border-b border-border py-16 px-6 bg-card">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-background border border-border rounded-full mb-4 shadow-sm">
            <FolderOpen className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {name}
          </h1>
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {description}
            </p>
          )}
        </div>
      </section>

      {/* Lista de Posts */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-muted-foreground">
            Mostrando {posts.length} {posts.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((review: any) => (
              <ReviewCard key={review.id} post={review} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card/50">
            <p className="text-muted-foreground">
              Ainda não há reviews nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}