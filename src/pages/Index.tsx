import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  MessageSquare, 
  Calendar, 
  Bell, 
  Users,
  ArrowRight,
  Sparkles,
  Banknote,
  Star,
  Megaphone
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-clara.jpg";
import logoClara from "@/assets/logo-clara.png";

const Index = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, insira seu email");
      return;
    }
    // Here you would integrate with your backend
    toast.success("Obrigado! Entraremos em contato em breve.");
    const response = await fetch('https://leadsclara-504763904926.southamerica-east1.run.app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  
    if (response.ok) {
      console.log("Email saved successfully!");
    } else {
      console.log('Error saving email');
    }
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <img 
              src={logoClara} 
              alt="Clara - Assistente Digital" 
              className="h-32 sm:h-24 md:h-32 w-auto"
            />
            <Button 
              variant="hero" 
              size="lg"
              className="text-xs sm:text-sm whitespace-nowrap px-3 sm:px-8"
              onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Começar agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 pt-48 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Sua assistente digital por WhatsApp</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Organize seus cliente com a Clara
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                A Clara é sua secretária digital no WhatsApp: agenda compromissos, envia lembretes e organiza suas cobranças — Simples, rápida e eficiente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Começar agora <ArrowRight className="ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Ver como funciona
                </Button>
              </div>
            </div>
            <div className="animate-fade-in-delayed">
              <img 
                src={heroImage} 
                alt="Clara - Assistente Digital por WhatsApp" 
                className="rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#E8F4F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#4A9B8E]">Funcionalidades da Clara</h2>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para gerenciar seus clientes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Agendamento automático",
                description: "A Clara marca seus atendimentos direto no WhatsApp — sem precisar abrir agenda ou aplicativos. Ela confirma a disponibilidade, envia as opções e atualiza seu calendário automaticamente."
              },
              {
                icon: Bell,
                title: "Confirmação e lembrete de presença",
                description: "Antes de cada atendimento, a Clara envia mensagens automáticas para confirmar a presença do cliente e lembrá-lo do horário."
              },
              {
                icon: Users,
                title: "Reativação de clientes",
                description: "A Clara identifica quem não agenda há algum tempo e envia mensagens personalizadas para reaproximar o cliente."
              },
              {
                icon: Banknote,
                title: "Cobrança simples por Pix ou boleto",
                description: "A Clara envia automaticamente sua chave Pix ou boleto de cobrança, acompanha se o pagamento foi feito e avisa quando está tudo certo."
              },
              {
                icon: Star,
                title: "Avaliação e indicação",
                description: "Após o atendimento, a Clara pergunta como foi a experiência. Se o cliente estiver satisfeito, ela incentiva a deixar um review no Google ou indicar novos clientes."
              },
              {
                icon: Megaphone,
                title: "Campanhas e promoções em massa",
                description: "Quer divulgar uma promoção ou novidade? A Clara envia mensagens personalizadas para todos os seus clientes, com filtros por frequência ou tipo de serviço."
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-secondary/20"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="hero" 
              size="lg"
              className="text-xs sm:text-sm md:text-base px-4 sm:px-8"
              onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="hidden sm:inline">Fale com a Clara e veja como ela pode ajudar seu negócio</span>
              <span className="inline sm:hidden">Fale com a Clara</span>
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que nossos usuários dizem</h2>
            <p className="text-xl text-muted-foreground">
              Mais tempo para o que realmente importa!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Mariana Costa",
                role: "Psicóloga",
                content: "Antes da Clara eu perdia muito tempo confirmando sessões e cobrando atrasados. Agora tudo acontece sozinho — meus pacientes recebem lembretes e até feedbacks automáticos. Ganhei tempo e tranquilidade."
              },
              {
                name: "Rafael Oliveira",
                role: "Fisioterapeuta",
                content: "A Clara virou parte da minha rotina. Ela confirma os atendimentos, avisa quando alguém cancela e até ajuda a reativar pacientes antigos. É como ter uma secretária de verdade, mas no WhatsApp."
              },
              {
                name: "Juliana Mendes",
                role: "Personal Trainer",
                content: "Eu vivia esquecendo de cobrar alunos ou mandar lembrete das aulas. A Clara faz tudo isso pra mim. Meu dia ficou muito mais leve e consigo focar nos treinos e não nas mensagens."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-card bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4 text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-muted-foreground">
              Tire suas dúvidas sobre a Clara
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left">
                  A Clara é um aplicativo?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Não! A Clara funciona direto no WhatsApp, sem precisar baixar nada. É só começar a conversar e ela organiza sua agenda, lembretes e cobranças automaticamente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left">
                  Como a Clara ajuda no meu dia a dia?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ela cuida das tarefas repetitivas: confirma presença, envia lembretes, faz cobranças e até reativa clientes antigos. Assim, você ganha tempo para atender mais e se preocupar menos com mensagens.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left">
                  Preciso saber mexer em tecnologia?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  De forma alguma. A Clara foi feita para quem não quer perder tempo com sistemas complicados. Tudo é feito por conversa — simples e natural, como falar com uma secretária de verdade.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left">
                  A Clara pode falar com meus clientes automaticamente?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim. Ela envia mensagens personalizadas no momento certo: antes do atendimento, após o pagamento e até quando o cliente está sumido. Tudo com seu nome e tom de voz.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left">
                  E se eu quiser parar de usar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Você pode parar a qualquer momento, sem contratos ou multa. A Clara acredita em relacionamento leve e transparente, assim como nas suas conversas com os clientes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left">
                  Quanto custa usar a Clara?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Você pode testar grátis e só depois decidir se quer continuar. Os planos são acessíveis para autônomos e pequenos negócios — menos do que o valor de uma hora de trabalho por mês.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cadastro" className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para ter sua assistente digital?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Cadastre-se agora e seja um dos primeiros a experimentar a Clara
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="hero" size="lg">
                Começar grátis
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-4">
              Sem compromisso. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Clara
              </h3>
              <p className="text-muted-foreground text-sm">
                Sua secretária digital por WhatsApp
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Segurança</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Clara. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
