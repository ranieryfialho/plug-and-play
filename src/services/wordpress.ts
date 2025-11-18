const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function fetchAPI(query: string, variables: any = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL não está definida no .env.local');
  }

  // Log para debug
  console.log('🔍 Buscando dados no WordPress...');

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
    throw new Error('Falha ao buscar API do WP');
  }

  return json.data;
}