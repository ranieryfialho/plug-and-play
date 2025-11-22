"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { submitComment } from "@/app/actions";

export default function CommentsSection({ postId, comments, path }: { postId: number, comments: any[], path: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    
    const result = await submitComment(formData);
    
    setLoading(false);
    setMessage(result.message);
    
    if (result.success) {
      const form = document.getElementById("comment-form") as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-primary" />
        Comentários ({comments.length})
      </h3>

      <div className="space-y-6 mb-12">
        {comments.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment.id} className="bg-card border border-border p-4 rounded-xl flex gap-4">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-sm">{comment.author?.node?.name || "Anônimo"}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <div 
                  className="text-sm text-gray-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: comment.content }} 
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground italic">Seja o primeiro a comentar!</p>
        )}
      </div>

      <div className="bg-card/50 p-6 rounded-xl border border-border">
        <h4 className="text-lg font-semibold text-white mb-4">Deixe sua opinião</h4>
        
        <form id="comment-form" action={handleSubmit} className="space-y-4">
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="path" value={path} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="author" placeholder="Seu Nome" required className="bg-background border-border text-white" />
            <Input name="email" type="email" placeholder="Seu Email (não será publicado)" required className="bg-background border-border text-white" />
          </div>
          
          <Textarea name="content" placeholder="O que você achou?" required className="bg-background border-border text-white min-h-[100px]" />
          
          <div className="flex items-center justify-between">
             {message && <span className="text-sm text-primary font-medium">{message}</span>}
             <Button type="submit" disabled={loading} className="bg-primary hover:bg-secondary text-white">
               {loading ? "Enviando..." : "Enviar Comentário"}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}