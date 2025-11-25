import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateToNow(dateString: string) {
  if (!dateString) return "";

  let dateToParse = dateString;
  
  if (!dateString.includes("Z") && !dateString.includes("+") && !dateString.match(/-\d{2}:\d{2}$/)) {
     dateToParse = `${dateString}-03:00`;
  }

  try {
    return formatDistanceToNow(new Date(dateToParse), {
      addSuffix: true,
      locale: ptBR,
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Recentemente";
  }
}