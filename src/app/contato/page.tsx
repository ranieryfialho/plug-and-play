import { Metadata } from "next";
import { Mail, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Contato | Plug & Play",
  description: "Entre em contato com a equipe do Plug & Play para dúvidas, sugestões ou parcerias.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- HERO HEADER --- */}
      <section className="relative border-b border-border py-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative container mx-auto text-center z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Fale <span className="text-primary">Conosco</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida sobre um review? Quer sugerir uma pauta ou fechar uma parceria?
            Estamos prontos para ouvir você.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- COLUNA DA ESQUERDA: INFORMAÇÕES --- */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Canais de Atendimento</h2>
              <p className="text-muted-foreground mb-8">
                Escolha a melhor forma de falar com a gente. Tentamos responder a todos os emails em até 24 horas úteis.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Card Email */}
              <Card className="p-6 bg-card border-border flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email Geral</h3>
                  <p className="text-sm text-muted-foreground mb-2">Para dúvidas e leitores</p>
                  <a href="mailto:contato@plugplay.com" className="text-accent hover:underline">contato@plugplay.com</a>
                </div>
              </Card>

              {/* Card Parcerias */}
              <Card className="p-6 bg-card border-border flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Comercial & Parcerias</h3>
                  <p className="text-sm text-muted-foreground mb-2">Para anúncios e collabs</p>
                  <a href="mailto:parcerias@plugplay.com" className="text-accent hover:underline">parcerias@plugplay.com</a>
                </div>
              </Card>

              {/* Card Horário */}
              <Card className="p-6 bg-card border-border flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Horário de Atendimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Segunda a Sexta: 09h às 18h<br/>
                    Fins de semana: Apenas plantão urgente
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* --- COLUNA DA DIREITA: FORMULÁRIO --- */}
          <Card className="p-8 bg-card border-border shadow-2xl shadow-primary/5">
            <h3 className="text-xl font-bold text-white mb-6">Envie uma mensagem</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nome</Label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome" 
                    className="bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Assunto</Label>
                <Input 
                  id="subject" 
                  placeholder="Sobre o que você quer falar?" 
                  className="bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Escreva sua mensagem aqui..." 
                  className="min-h-[150px] bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary resize-none"
                />
              </div>

              <Button className="w-full bg-primary hover:bg-secondary text-white h-12 text-lg font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all hover:scale-[1.01]">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Ao enviar, você concorda com nossa Política de Privacidade.
              </p>
            </form>
          </Card>

        </div>
      </div>
    </div>
  );
}