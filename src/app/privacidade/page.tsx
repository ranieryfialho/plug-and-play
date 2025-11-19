import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | Plug & Play",
  description: "Política de privacidade e termos de uso do Plug & Play.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-12">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
             <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Política de Privacidade</h1>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 prose-headings:text-white prose-a:text-primary hover:prose-a:text-accent">
          <p>A sua privacidade é importante para nós. É política do <strong>Plug & Play</strong> respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site <a href="https://plugnplaytech.com.br">Plug & Play</a>.</p>
          
          <h3>1. Informações que coletamos</h3>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
          
          <h3>2. Uso de Cookies e Web Beacons</h3>
          <p>Utilizamos cookies para armazenar informações, tais como as suas preferências pessoais quando visita o nosso site. Isto poderá incluir um simples popup, ou uma ligação em vários serviços que providenciamos, tais como fóruns.</p>
          <p>O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso site. Com o cookie DART, o Google pode exibir anúncios para seus usuários com base nas visitas feitas à Internet.</p>
          
          <h3>3. Google AdSense</h3>
          <p>O nosso site utiliza o Google AdSense para veicular anúncios. O Google utiliza cookies para exibir anúncios relevantes com base no seu histórico de navegação. Os usuários podem desativar o uso do cookie DART acessando a Política de privacidade da rede de conteúdo e dos anúncios do Google.</p>
          
          <h3>4. Links para Sites de Terceiros</h3>
          <p>O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
          
          <h3>5. Compromisso do Usuário</h3>
          <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Plug & Play oferece no site e com caráter enunciativo, mas não limitativo:</p>
          <ul>
            <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
            <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, casas de apostas, pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos.</li>
          </ul>

          <div className="mt-12 p-6 bg-card border border-border rounded-xl text-sm text-muted-foreground">
             <p>Esta política é efetiva a partir de <strong>Novembro/2025</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}