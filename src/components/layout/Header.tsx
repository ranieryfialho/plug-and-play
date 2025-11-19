"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

// --- MENU ---
const NAVIGATION = [
  { name: "Reviews", href: "/reviews" },
  { name: "Notícias", href: "/category/noticias" },
  { name: "Artigos", href: "/category/artigos" },
  { name: "Tutoriais", href: "/category/tutoriais" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Plug & <span className="text-primary">Play</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent hover:underline decoration-2 underline-offset-4 decoration-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hover:bg-card">
                <Search className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[425px]">
              <DialogTitle className="text-white">Buscar no Blog</DialogTitle>
              <form onSubmit={handleSearch} className="flex gap-2 mt-4">
                <Input 
                  placeholder="O que você procura? (ex: iPhone)" 
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" className="bg-primary hover:bg-secondary text-white">
                  Buscar
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card border-border text-foreground">
                <nav className="flex flex-col gap-4 mt-8">
                  {NAVIGATION.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-muted-foreground hover:text-accent"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}