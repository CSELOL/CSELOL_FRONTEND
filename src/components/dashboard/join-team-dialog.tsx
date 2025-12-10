import * as React from "react";
import { Loader2, UserPlus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { joinTeamAPI } from "@/api/teams";

interface JoinTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinTeamDialog({ open, onOpenChange }: JoinTeamDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await joinTeamAPI(code);
      onOpenChange(false);
      // Force reload to update dashboard state from "No Team" to "Has Team"
      window.location.reload();
    } catch (err: any) {
      setError("Código inválido ou não foi possível entrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-400" />
            Entrar em Time Existente
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Insira o código de convite fornecido pelo seu Capitão.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="code" className="text-zinc-300">
              Código de Convite
            </Label>
            <div className="relative">
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SLY-8823"
                className="bg-zinc-900/50 border-white/10 focus-visible:ring-blue-500 font-mono tracking-widest text-center uppercase pl-9"
                required
              />
              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            </div>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Entrar no Esquadrão"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
