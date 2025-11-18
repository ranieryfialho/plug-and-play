import Link from "next/link";
import { Sparkles, Instagram, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v4a9 9 0 0 1-9-9Z" />
  </svg>
);

const FOOTER_LINKS = [
  {
    title: "Navegação Rápida",
    items: [
      { name: "Reviews", href: "/category/reviews" },
      { name: "Games", href: "/category/games" },
      { name: "Inteligência Artificial", href: "/category/inteligencia-artificial" },
      { name: "Tutoriais", href: "/category/tutoriais" },
    ],
  },
  {
    title: "Informações Legais",
    items: [
      { name: "Sobre Nós", href: "/sobre" },
      { name: "Contato", href: "/contato" },
      { name: "Política de Privacidade", href: "/privacidade" },
      { name: "Termos de Uso", href: "/termos" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container mx-auto px-6 py-12">
        
        {/* Top Section: Logo e Links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Coluna 1: Logo e Social */}
          <div className="col-span-2 lg:col-span-2 flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="bg-primary p-1.5 rounded-lg shadow-md shadow-primary/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Plug & <span className="text-primary">Play</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tecnologia descomplicada, reviews honestos e as últimas tendências.
            </p>
            
            {/* Ícones Sociais */}
            <div className="flex space-x-3 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Github">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Colunas de Navegação */}
          {FOOTER_LINKS.map((section, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <Separator className="my-8 bg-border" />
        
        {/* Bottom Section: Copyright */}
        <div className="flex flex-col items-center justify-between text-center md:flex-row md:text-left gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Plug & Play. Todos os direitos reservados.
          </p>
          
          {/* CRÉDITOS COM LINK E HOVER */}
          <p className="text-xs text-muted-foreground">
            Design e Arquitetura por{" "}
            <a 
              href="https://github.com/ranieryfialho" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary"
            >
              Raniery Fialho
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}