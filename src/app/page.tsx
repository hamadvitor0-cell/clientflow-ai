import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
  FileSignature,
  FileText,
  Sparkles,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const features = [
  { title: "CRM de clientes", icon: Users, text: "Histórico, status e próximos passos em um só lugar." },
  { title: "Briefing com IA", icon: Sparkles, text: "Transforme conversas soltas em escopo profissional." },
  { title: "Propostas em PDF", icon: FileText, text: "Documentos comerciais editáveis e exportáveis." },
  { title: "Contratos editáveis", icon: FileSignature, text: "Modelos claros com aceite digital simples." },
  { title: "Área do cliente", icon: BriefcaseBusiness, text: "Links públicos por token para aprovar e comentar." },
  { title: "Controle de pagamentos", icon: CreditCard, text: "Receita prevista, pendências e mensagens de cobrança." },
];

export default function HomePage() {
  return (
    <main>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-sm font-bold text-slate-950">
            CF
          </span>
          <span className="font-semibold">ClientFlow AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#fluxo">Como funciona</a>
          <a href="#planos">Planos</a>
        </nav>
        <ButtonLink href="/login" variant="secondary">
          Entrar
        </ButtonLink>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 pb-12 pt-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
            Transforme conversas com clientes em propostas, contratos e projetos organizados.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
            Um SaaS para freelancers criarem briefings, propostas comerciais, contratos e acompanharem entregas com ajuda de IA.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register">
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Ver demo
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-slate-950/72 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
          <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
            <div className="rounded-md border border-border bg-white/[0.03] p-4">
              <p className="text-sm font-semibold">ClientFlow AI</p>
              <div className="mt-6 grid gap-2 text-sm text-muted">
                {["Dashboard", "Clientes", "Briefings", "Propostas", "Contratos", "Projetos", "Pagamentos"].map((item) => (
                  <span key={item} className="rounded-md px-3 py-2 hover:bg-white/8">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="p-4">
                  <p className="text-xs text-muted">Receita prevista</p>
                  <p className="mt-2 font-mono text-xl font-semibold">R$ 21.700</p>
                </Card>
                <Card className="p-4">
                  <p className="text-xs text-muted">Propostas pendentes</p>
                  <p className="mt-2 font-mono text-xl font-semibold">2</p>
                </Card>
                <Card className="p-4">
                  <p className="text-xs text-muted">Projetos ativos</p>
                  <p className="mt-2 font-mono text-xl font-semibold">3</p>
                </Card>
              </div>
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Pipeline de entregas</h2>
                  <Badge tone="info">IA demo pronta</Badge>
                </div>
                <div className="mt-5 grid gap-3">
                  {["Briefing organizado", "Proposta enviada", "Contrato aguardando aceite", "Projeto em revisão"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-md border border-border bg-white/[0.03] p-3">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item}</span>
                      <span className="ml-auto font-mono text-xs text-muted">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="mx-auto max-w-7xl px-5 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold">Tudo que o freelancer precisa para vender e entregar com clareza.</h2>
          <p className="mt-4 leading-7 text-muted">
            Fluxos reais para sair da conversa inicial e chegar em proposta, contrato, projeto, tarefa e pagamento.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <feature.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-5 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="fluxo" className="border-y border-border bg-slate-950/38">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="text-3xl font-semibold">Como funciona</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {["Cole a conversa", "Gere briefing", "Crie proposta", "Gere contrato", "Acompanhe o projeto"].map((step, index) => (
              <div key={step} className="rounded-lg border border-border bg-surface/70 p-4">
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                <p className="mt-4 text-sm font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-3xl font-semibold">Planos para portfolio e produto real</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Free", "R$ 0", "Para testar o fluxo com poucos clientes."],
            ["Pro", "R$ 49", "Para freelancers em operação recorrente."],
            ["Agency", "R$ 149", "Para quem gerencia múltiplas marcas."],
          ].map(([name, price, text]) => (
            <Card key={name}>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="mt-4 font-mono text-3xl">{price}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted">
        ClientFlow AI - SaaS demonstravel para freelancers.
      </footer>
    </main>
  );
}
