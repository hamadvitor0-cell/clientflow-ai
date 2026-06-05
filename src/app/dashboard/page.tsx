import {
  AlertTriangle,
  Banknote,
  BriefcaseBusiness,
  CalendarClock,
  CreditCard,
  FileSignature,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { MoneyDisplay } from "@/components/dashboard/money-display";
import { DateDisplay } from "@/components/dashboard/date-display";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  projectStatusLabels,
  proposalStatusLabels,
} from "@/lib/status";
import { formatMoney } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();
  const prisma = getPrisma();
  const today = new Date();
  const soon = new Date();
  soon.setDate(today.getDate() + 7);

  const [
    clients,
    activeProjects,
    pendingProposals,
    waitingContracts,
    pendingPayments,
    overduePayments,
    revenueForecast,
    recentProjects,
    recentProposals,
    nextTasks,
  ] = await Promise.all([
    prisma.client.count({ where: { userId: user.id } }),
    prisma.project.count({
      where: { userId: user.id, status: { notIn: ["FINALIZADO", "CANCELADO"] } },
    }),
    prisma.proposal.count({
      where: { userId: user.id, status: { in: ["ENVIADA", "VISUALIZADA", "RASCUNHO"] } },
    }),
    prisma.contract.count({
      where: { userId: user.id, status: { in: ["ENVIADO", "AGUARDANDO_ACEITE"] } },
    }),
    prisma.payment.aggregate({
      where: { userId: user.id, status: { in: ["PENDENTE", "ATRASADO"] } },
      _sum: { amount: true },
    }),
    prisma.payment.count({
      where: {
        userId: user.id,
        OR: [{ status: "ATRASADO" }, { status: "PENDENTE", dueDate: { lt: today } }],
      },
    }),
    prisma.proposal.aggregate({
      where: { userId: user.id, status: { in: ["ENVIADA", "VISUALIZADA", "APROVADA"] } },
      _sum: { totalPrice: true },
    }),
    prisma.project.findMany({
      where: { userId: user.id },
      include: { client: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.proposal.findMany({
      where: { userId: user.id },
      include: { client: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.task.findMany({
      where: {
        userId: user.id,
        status: { not: "CONCLUIDA" },
        dueDate: { lte: soon },
      },
      include: { project: true },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão operacional dos clientes, propostas, contratos, projetos e pagamentos."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clientes" value={String(clients)} icon={Users} />
        <StatCard label="Projetos ativos" value={String(activeProjects)} icon={BriefcaseBusiness} />
        <StatCard label="Propostas pendentes" value={String(pendingProposals)} icon={FileText} />
        <StatCard label="Contratos aguardando" value={String(waitingContracts)} icon={FileSignature} />
        <StatCard label="Pagamentos pendentes" value={formatMoney(pendingPayments._sum.amount)} icon={CreditCard} />
        <StatCard label="Receita prevista" value={formatMoney(revenueForecast._sum.totalPrice)} icon={Banknote} />
        <StatCard label="Pagamentos atrasados" value={String(overduePayments)} icon={AlertTriangle} />
        <StatCard label="Próximos prazos" value={String(nextTasks.length)} icon={CalendarClock} />
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Projetos recentes" description="Status e entregas em andamento." />
          <DataTable headers={["Projeto", "Cliente", "Status", "Entrega", "Valor"]}>
            {recentProjects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/projects/${project.id}`} className="font-medium text-primary">
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-300">{project.client.company || project.client.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} label={projectStatusLabels[project.status]} />
                </td>
                <td className="px-4 py-3">
                  <DateDisplay value={project.dueDate} />
                </td>
                <td className="px-4 py-3">
                  <MoneyDisplay value={project.value} />
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>

        <Card>
          <CardHeader title="Alertas inteligentes" description="Resumo gerado a partir do pipeline." />
          <div className="grid gap-3">
            <div className="rounded-md border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
              {pendingProposals} propostas aguardando resposta.
            </div>
            <div className="rounded-md border border-cyan-400/25 bg-cyan-400/10 p-3 text-sm text-cyan-100">
              {nextTasks.length} tarefa(s) vencem nos próximos 7 dias.
            </div>
            <div className="rounded-md border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
              {overduePayments} pagamento(s) atrasado(s) precisam de atenção.
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader title="Propostas recentes" />
        <DataTable headers={["Proposta", "Cliente", "Status", "Validade", "Valor"]}>
          {recentProposals.map((proposal) => (
            <tr key={proposal.id}>
              <td className="px-4 py-3">
                <Link href={`/dashboard/proposals/${proposal.id}`} className="font-medium text-primary">
                  {proposal.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-300">{proposal.client.company || proposal.client.name}</td>
              <td className="px-4 py-3">
                <StatusBadge status={proposal.status} label={proposalStatusLabels[proposal.status]} />
              </td>
              <td className="px-4 py-3">
                <DateDisplay value={proposal.validUntil} />
              </td>
              <td className="px-4 py-3">
                <MoneyDisplay value={proposal.totalPrice} />
              </td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </>
  );
}
