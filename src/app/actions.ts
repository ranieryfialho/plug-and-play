"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

export async function submitComment(formData: FormData) {
  const postId = formData.get("postId");
  const author = formData.get("author");
  const email = formData.get("email");
  const content = formData.get("content");
  const path = formData.get("path") as string;

  const mutation = `
    mutation CreateComment($author: String!, $authorEmail: String!, $content: String!, $commentOn: Int!) {
      createComment(input: {author: $author, authorEmail: $authorEmail, content: $content, commentOn: $commentOn}) {
        success
        comment {
          id
          content
          date
        }
      }
    }
  `;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: {
          author,
          authorEmail: email,
          content,
          commentOn: Number(postId),
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      return { success: false, message: "Erro ao enviar comentário. Tente novamente." };
    }

    revalidatePath(path);
    return { success: true, message: "Comentário enviado! Aguardando aprovação." };

  } catch (error) {
    return { success: false, message: "Erro de conexão." };
  }
}