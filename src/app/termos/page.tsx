import { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso | Plug & Play",
  description: "Termos e condições de uso do blog Plug & Play.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-12">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
             <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Termos de Uso</h1>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 prose-headings:text-white prose-a:text-primary hover:prose-a:text-accent">
          <h3>1. Termos</h3>
          <p>Ao acessar ao site <a href="https://plugnplaytech.com.br">Plug & Play</a>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.</p>
          
          <h3>2. Uso de Licença</h3>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Plug & Play , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
          <ul>
            <li>modificar ou copiar os materiais;</li>
            <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
            <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Plug & Play;</li>
            <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
            <li>transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
          </ul>
          
          <h3>3. Isenção de responsabilidade</h3>
          <p>Os materiais no site da Plug & Play são fornecidos 'como estão'. Plug & Play não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>
          
          <h3>4. Limitações</h3>
          <p>Em nenhum caso o Plug & Play ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Plug & Play.</p>
          
          <h3>5. Precisão dos materiais</h3>
          <p>Os materiais exibidos no site da Plug & Play podem incluir erros técnicos, tipográficos ou fotográficos. Plug & Play não garante que qualquer material em seu site seja preciso, completo ou atual. Plug & Play pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.</p>

          <div className="mt-12 p-6 bg-card border border-border rounded-xl text-sm text-muted-foreground">
             <p>Estes termos são efetivos a partir de <strong>Novembro/2025</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}