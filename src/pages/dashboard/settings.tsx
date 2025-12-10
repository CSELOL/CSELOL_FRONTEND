import { useState } from "react";
import {
  User,
  Gamepad2,
  Bell,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [riotId, setRiotId] = useState("Faker#KR1");

  // Mock Save Function
  const onSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show toast or alert here
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações da Conta</h1>
        <p className="text-zinc-400">
          Gerencie seu perfil, contas de jogo e preferências.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-zinc-900/50 border border-white/5 w-full md:w-auto justify-start h-12 p-1">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-10 px-6"
          >
            <User className="mr-2 h-4 w-4" /> Geral
          </TabsTrigger>
          <TabsTrigger
            value="game-accounts"
            className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 h-10 px-6"
          >
            <Gamepad2 className="mr-2 h-4 w-4" /> Contas de Jogo
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-yellow-500/10 data-[state=active]:text-yellow-400 h-10 px-6"
          >
            <Bell className="mr-2 h-4 w-4" /> Notificações
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: GENERAL --- */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Informações do Perfil</CardTitle>
              <CardDescription>
                Esta informação será exibida publicamente no perfil do seu time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Nome de Exibição</Label>
                  <Input
                    defaultValue={user?.user_metadata?.nickname || user?.email?.split("@")[0] || "Invocador"}
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Endereço de Email</Label>
                  <Input
                    defaultValue={user?.email || "usuario@exemplo.com"}
                    disabled
                    className="bg-black/20 border-white/10 text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Email gerenciado via Supabase Auth.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Bio / Descrição</Label>
                <Input
                  placeholder="Conte-nos sobre seu estilo de jogo..."
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 py-4 bg-white/5 flex justify-end">
              <Button
                onClick={onSave}
                disabled={isLoading}
                className="bg-primary text-primary-foreground font-bold"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Zona de Perigo</CardTitle>
              <CardDescription className="text-red-400/60">
                Ações irreversíveis relacionadas à sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Sair</p>
                <p className="text-xs text-zinc-500">
                  Faça logout da sua sessão neste dispositivo.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => logout()}
                className="bg-red-600 hover:bg-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 2: GAME ACCOUNTS (Riot ID) --- */}
        <TabsContent value="game-accounts" className="mt-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-blue-400" /> Integração Riot Games
              </CardTitle>
              <CardDescription>
                Vincule sua conta League of Legends para participar de torneios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Banner */}
              <div className="flex items-center gap-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-emerald-400">Conta Vinculada</p>
                  <p className="text-xs text-emerald-300/70">
                    Suas partidas serão rastreadas automaticamente.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Riot ID (Nome de Jogo)</Label>
                    <Input
                      value={riotId.split("#")[0]}
                      onChange={(e) =>
                        setRiotId(`${e.target.value}#${riotId.split("#")[1]}`)
                      }
                      className="bg-black/20 border-white/10 text-white font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Tag Line</Label>
                    <div className="flex items-center">
                      <span className="bg-zinc-800 border border-white/10 border-r-0 rounded-l px-3 py-2 text-zinc-400 font-mono text-sm">
                        #
                      </span>
                      <Input
                        value={riotId.split("#")[1]}
                        onChange={(e) =>
                          setRiotId(`${riotId.split("#")[0]}#${e.target.value}`)
                        }
                        className="rounded-l-none bg-black/20 border-white/10 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Mudar isso exigirá nova verificação por um Admin.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 py-4 bg-white/5 flex justify-end">
              <Button
                onClick={onSave}
                disabled={isLoading}
                className="bg-primary text-primary-foreground font-bold"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- TAB 3: NOTIFICATIONS --- */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Escolha sobre o que você quer ser notificado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-zinc-200">
                    Lembretes de Partidas
                  </Label>
                  <p className="text-xs text-zinc-500">
                    Receba alertas 15 minutos antes da sua partida começar.
                  </p>
                </div>
                {/* Switch component would go here */}
                <div className="h-6 w-10 bg-primary rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-zinc-200">
                    Convites de Time
                  </Label>
                  <p className="text-xs text-zinc-500">
                    Seja notificado quando alguém te convidar para um time.
                  </p>
                </div>
                <div className="h-6 w-10 bg-primary rounded-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
