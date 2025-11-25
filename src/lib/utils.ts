import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToNow(dateString: string) {
  if (!dateString) return "";
  const rawDate = dateString.replace(' ', 'T').split('+')[0].split('-03:')[0].replace('Z', '');
  const localDate = new Date(`${rawDate}-03:00`);
  const utcDate = new Date(`${rawDate}Z`);
  const now = new Date();
  const fiveMinutesInMs = 5 * 60 * 1000;

  let finalDate = localDate;
  if (localDate.getTime() > (now.getTime() + fiveMinutesInMs)) {
    finalDate = utcDate;
  }

  try {
    return formatDistanceToNow(finalDate, {
      addSuffix: true,
      locale: ptBR,
    });
  } catch (error) {
    console.error("Erro ao formatar data:", dateString, error);
    return "Recentemente";
  }
}