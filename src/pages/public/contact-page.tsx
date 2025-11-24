import { Mail, MapPin, MessageSquare, Send, Twitter, Twitch, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container max-w-6xl px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Entre em Contato</h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
                Tem dúvidas sobre o torneio, quer ser um parceiro ou precisa de suporte?
                Nossa equipe está pronta para ajudar.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left: Contact Info */}
            <div className="space-y-8">
                
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Canais Oficiais</h2>
                    
                    <Card className="bg-zinc-900/50 border-white/10 hover:bg-zinc-900 transition-colors">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Email Comercial</h3>
                                <p className="text-zinc-400 text-sm">contato@cselol.com.br</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-white/10 hover:bg-zinc-900 transition-colors">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Discord</h3>
                                <p className="text-zinc-400 text-sm">Suporte rápido e comunidade</p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto border-white/10">
                                Entrar
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Redes Sociais</h2>
                    <div className="flex gap-4">
                        <a href="#" className="h-12 w-12 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-primary hover:border-primary transition-all">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-12 w-12 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-all">
                            <Twitch className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-12 w-12 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all">
                            <Instagram className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 mt-8">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-zinc-500 mt-1" />
                        <div>
                            <h4 className="font-bold text-zinc-300">Sede Operacional</h4>
                            <p className="text-sm text-zinc-500 mt-1">
                                Aracaju, Sergipe - Brasil<br />
                                Atendimento presencial apenas com agendamento.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right: Contact Form */}
            <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-300">Nome / Organização</Label>
                            <Input id="name" placeholder="Seu nome ou time" className="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                            <Input id="email" type="email" placeholder="contato@exemplo.com" className="bg-black/20 border-white/10 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-300">Assunto</Label>
                        <Select>
                            <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                <SelectValue placeholder="Selecione o motivo" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                <SelectItem value="partnership">Parceria / Patrocínio</SelectItem>
                                <SelectItem value="support">Dúvidas sobre o Torneio</SelectItem>
                                <SelectItem value="inscription">Problemas com Inscrição</SelectItem>
                                <SelectItem value="report">Reportar Jogador/Bug</SelectItem>
                                <SelectItem value="other">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-zinc-300">Mensagem</Label>
                        <Textarea 
                            id="message" 
                            placeholder="Como podemos ajudar?" 
                            className="min-h-[150px] bg-black/20 border-white/10 text-white resize-none" 
                        />
                    </div>

                    <Button className="w-full bg-primary text-primary-foreground font-bold h-12">
                        <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                    </Button>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
}