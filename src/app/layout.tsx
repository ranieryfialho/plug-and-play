import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plug & Play - Tecnologia descomplicada",
  description: "Reviews de tecnologia, games e inteligência artificial para o seu dia a dia.",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "google-adsense-account": "ca-pub-6203949560211327"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Wrapper principal que força o rodapé para o final da página */}
        <div className="relative flex min-h-screen flex-col">
          
          {/* Cabeçalho Fixo */}
          <Header />
          
          {/* Conteúdo Principal (flex-1 faz ele ocupar todo o espaço disponível) */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Rodapé */}
          <Footer />
          
        </div>

        {/* SCRIPT DO GOOGLE ADSENSE */}
        {/* Carrega de forma otimizada sem travar o site */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}