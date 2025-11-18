import Image from "next/image";
import { Metadata } from "next";
import { Sparkles, Zap, ShieldCheck, Users, ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Sobre Nós | Plug & Play",
  description: "Conheça a missão do Plug & Play e quem está por trás do conteúdo.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative border-b border-border py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative container mx-auto text-center z-10 max-w-3xl">
          <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/5 px-4 py-1 text-sm uppercase tracking-widest">
            Nossa Missão
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Descomplicando a tecnologia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              para todos.
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            O <strong>Plug & Play</strong> nasceu da necessidade de traduzir o "technês" para o português claro. 
            Nós testamos, analisamos e explicamos gadgets, games e IA para que você faça as melhores escolhas, 
            sem perder tempo com especificações confusas.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card border-border p-8 hover:border-primary/50 transition-colors group">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Agilidade</h3>
            <p className="text-muted-foreground">
              O mundo tech muda rápido. Nossas análises são diretas ao ponto, focadas no que realmente importa para o seu dia a dia.
            </p>
          </Card>

          <Card className="bg-card border-border p-8 hover:border-primary/50 transition-colors group">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
              <ShieldCheck className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Honestidade</h3>
            <p className="text-muted-foreground">
              Não vendemos nossa opinião. Se um produto tem defeitos, nós falamos. Nossos reviews são 100% imparciais e transparentes.
            </p>
          </Card>

          <Card className="bg-card border-border p-8 hover:border-primary/50 transition-colors group">
            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Comunidade</h3>
            <p className="text-muted-foreground">
              Focamos nas gerações Millennial e Z, entendendo as necessidades reais de quem vive conectado 24/7.
            </p>
          </Card>
        </div>
      </div>

      {/* --- BIO DO AUTOR --- */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-auto">
            
            {/* Foto do Autor (Placeholder ou Gravatar) */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-2xl opacity-20"></div>
              <div className="relative w-full h-full rounded-full border-2 border-primary/30 overflow-hidden bg-background p-1">
                {/* Se quiser usar sua foto real, troque o src pela URL do seu Gravatar ou imagem local */}
                <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                   <span className="text-4xl font-bold text-muted-foreground">RF</span>
                   {/* <Image src="/sua-foto.jpg" alt="Raniery Fialho" fill className="object-cover" /> */}
                </div>
              </div>
            </div>

            {/* Texto Bio */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Raniery Fialho</h2>
              <p className="text-primary font-medium mb-4">Fundador & Editor Chefe</p>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Apaixonado por tecnologia e desenvolvimento web. Criei o <strong>Plug & Play</strong> com o objetivo de compartilhar conhecimento e ajudar pessoas a navegarem pelo mundo digital sem complicações. Desenvolvedor, entusiasta de IA e gamer nas horas vagas.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4">
                <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Quer conversar com a gente?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Seja para tirar dúvidas, sugerir pautas ou parcerias comerciais, estamos sempre abertos a ouvir você.
        </p>
        <Button size="lg" className="bg-primary hover:bg-secondary text-white text-lg px-8 py-6" asChild>
           <a href="/contato">
             Entre em Contato <ArrowRight className="ml-2 h-5 w-5" />
           </a>
        </Button>
      </div>
    </div>
  );
}