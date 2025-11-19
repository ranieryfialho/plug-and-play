import { fetchAPI } from "@/services/wordpress";
import ReviewCard from "@/components/reviews/ReviewCard";
import { Star } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | Plug & Play",
  description: "Análises detalhadas dos últimos lançamentos de tecnologia.",
};

const ALL_REVIEWS_QUERY = `
  query AllReviewsPage {
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
`;

export default async function ReviewsIndexPage() {
  let reviews = [];
  try {
    const data = await fetchAPI(ALL_REVIEWS_QUERY);
    reviews = data?.reviews?.nodes || [];
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-12">
      <div className="container mx-auto px-6">
        
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Star className="w-8 h-8 fill-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Reviews</h1>
            <p className="text-muted-foreground">Nossas análises profundas e imparciais.</p>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review: any) => (
              <ReviewCard key={review.id} post={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum review encontrado.</p>
        )}
      </div>
    </div>
  );
}