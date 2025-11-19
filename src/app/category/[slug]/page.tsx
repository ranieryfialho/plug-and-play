import { fetchAPI } from "@/services/wordpress";
import ReviewCard from "@/components/reviews/ReviewCard"; // Usaremos o mesmo card por enquanto
import HorizontalCard from "@/components/reviews/HorizontalCard"; // Ou um card mais simples para notícias
import { notFound } from "next/navigation";
import { FolderOpen, Newspaper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

// QUERY HÍBRIDA: Busca a categoria e TUDO que tem nela (Reviews + Posts)
const CATEGORY_QUERY = `
  query GetCategoryData($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      name
      description
      # 1. Busca Reviews nessa categoria
      reviews(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id, title, slug, date
          featuredImage { node { sourceUrl } }
          camposDoReview { notaDoReview }
        }
      }
      # 2. Busca Posts (Notícias/Artigos) nessa categoria
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id, title, slug, date
          featuredImage { node { sourceUrl } }
        }
      }
    }
  }
`;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchAPI(CATEGORY_QUERY, { slug });

  if (!data?.category) {
    notFound();
  }

  const { name, description, reviews, posts } = data.category;
  
  // Juntamos Reviews e Posts numa lista só
  const allContent = [...(reviews?.nodes || []), ...(posts?.nodes || [])];
  
  // Ordenamos por data
  allContent.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-background pb-20 pt-12">
      <div className="container mx-auto px-6">
        
        {/* Header da Categoria */}
        <div className="flex flex-col items-center text-center mb-16 border-b border-border pb-12">
          <div className="inline-flex items-center justify-center p-4 bg-card border border-border rounded-2xl mb-6 shadow-lg shadow-primary/5">
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 capitalize">
            {name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {description || `Tudo sobre ${name}, incluindo notícias, artigos e análises.`}
          </p>
        </div>

        {/* Lista de Conteúdo */}
        {allContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allContent.map((item: any) => {
              // Lógica para saber se é Review ou Artigo
              const isReview = !!item.camposDoReview;
              const link = isReview ? `/reviews/${item.slug}` : `/artigos/${item.slug}`;

              return (
                <Link key={item.id} href={link} className="group">
                   <div className="bg-card border border-border rounded-xl overflow-hidden h-full hover:border-primary/50 transition-all hover:-translate-y-1 shadow-lg">
                      {/* Imagem */}
                      <div className="relative h-48 w-full bg-secondary/20">
                         {item.featuredImage?.node?.sourceUrl ? (
                           <Image src={item.featuredImage.node.sourceUrl} alt={item.title} fill className="object-cover" />
                         ) : (
                           <div className="flex items-center justify-center h-full text-muted-foreground"><Newspaper className="w-8 h-8 opacity-20"/></div>
                         )}
                         
                         {/* Badge de Tipo */}
                         <div className="absolute top-3 right-3">
                            {isReview ? (
                              <Badge className="bg-yellow-500 text-black font-bold hover:bg-yellow-600">Review {item.camposDoReview.notaDoReview}</Badge>
                            ) : (
                              <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-white/10">Artigo</Badge>
                            )}
                         </div>
                      </div>

                      {/* Texto */}
                      <div className="p-6">
                         <span className="text-xs text-muted-foreground mb-2 block">
                           {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: ptBR })}
                         </span>
                         <h3 className="text-xl font-bold text-white leading-snug mb-2 group-hover:text-primary transition-colors">
                           {item.title}
                         </h3>
                      </div>
                   </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl bg-card/30">
            <p className="text-muted-foreground text-lg">
              Nenhum conteúdo encontrado nesta categoria ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}