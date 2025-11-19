const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchAPI(query: string, variables: any = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL não está definida no .env.local');
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 60 },
    });

    const json = await res.json();

    if (json.errors) {
      console.error('❌ Erro no GraphQL:', json.errors);
      // Não vamos dar throw aqui para não quebrar a página inteira, 
      // retornamos null para tratar no componente
      return null; 
    }

    return json.data;

  } catch (error) {
    console.error("🔥 Erro FATAL de conexão com WordPress:", error);
    // Se der erro de rede (WordPress desligado, URL errada), retorna null
    // Isso evita a tela vermelha de erro no navegador
    return null; 
  }
}