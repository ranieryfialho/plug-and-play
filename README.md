# Plug & Play - Hub de Tecnologia (Headless CMS)

O **Plug & Play** é um portal moderno de notícias, reviews e análises de tecnologia. O projeto utiliza uma arquitetura **Headless**, onde o WordPress atua como o sistema de gestão de conteúdos (CMS) e o Next.js como o motor de renderização de alto desempenho.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as versões mais recentes das principais stacks do mercado:

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router).
* **Biblioteca de UI:** [React 19](https://react.dev/).
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com suporte a `typography`.
* **CMS (Backend):** [WordPress](https://wordpress.org/) (Headless).
* **API:** [GraphQL](https://graphql.org/) via WPGraphQL.
* **Animações:** [Framer Motion](https://www.framer.com/motion/).
* **Ícones:** [Lucide React](https://lucide.dev/).

## 🏗️ Arquitetura do Projeto

O projeto foca em performance e SEO, utilizando **Server Components** para buscar dados diretamente do WordPress:

1.  **WordPress (Headless):** Armazena Posts, Reviews e Categorias.
2.  **GraphQL API:** Serve como a ponte de dados entre o WordPress e o Frontend.
3.  **Next.js Frontend:** Consome os dados via `fetchAPI` no servidor e renderiza páginas com revalidação (ISR).

## 📡 Implementação GraphQL

O **GraphQL** é o "tecido conector" deste projeto, permitindo uma comunicação eficiente entre o Next.js e o WordPress.

### Por que GraphQL?
Diferente de uma API REST comum, o GraphQL permite que o frontend solicite exatamente os dados de que precisa em uma única requisição, evitando o *over-fetching* e melhorando drasticamente o tempo de carregamento.

### Como funciona no projeto:
* **Endpoint Centralizado:** Todas as requisições são feitas para um único endpoint definido em `NEXT_PUBLIC_WORDPRESS_API_URL`.
* **Serviços de Dados (`src/services/wordpress.ts`):** Centralizamos as queries GraphQL que buscam posts, reviews e categorias, garantindo tipagem e reutilização.
* **Integração com ACF:** Utilizamos o GraphQL para buscar campos personalizados do *Advanced Custom Fields*, como notas de reviews e especificações técnicas de produtos.
* **Performance:** As consultas são executadas no lado do servidor (Server-side), permitindo que o Next.js gere o HTML pronto para o usuário e para os motores de busca (SEO).

## 📂 Estrutura de Pastas Principal

```text
src/
├── app/            # Rotas (Home, Artigos, Reviews, Search, Category)
├── components/     # Componentes de UI, Ads, Reviews e Layout
├── lib/            # Utilitários e funções auxiliares
└── services/       # Lógica de conexão com a API GraphQL (wordpress.ts)
