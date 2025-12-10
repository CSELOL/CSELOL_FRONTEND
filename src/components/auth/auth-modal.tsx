import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Zap } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  // Reset when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccess(null);
      setEmail("");
      setPassword("");
      setNickname("");
    }
  }, [isOpen, initialMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Explicitly redirect on successful manual login
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Falha ao entrar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname || email.split("@")[0],
          },
        },
      });

      if (error) throw error;
      
      setSuccess("Conta criada! Por favor verifique seu email.");
    } catch (err: any) {
      setError(err.message || "Falha ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Zap className="h-6 w-6 fill-current" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            {mode === "login" ? "Bem-vindo de Volta" : "Junte-se à CSELOL"}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            {mode === "login"
              ? "Faça login para acessar seu painel"
              : "Crie uma conta para iniciar sua jornada"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4 mt-4">
          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Nickname field (register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-zinc-300">
                Nickname
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Seu nick de jogo"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Entrando..." : "Criando conta..."}
              </>
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-sm text-zinc-400">
          {mode === "login" ? (
            <>
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-primary hover:underline font-medium"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-primary hover:underline font-medium"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
