import "dotenv/config";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL nao configurada. Copie .env.example para .env antes do seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const token = () => randomBytes(32).toString("hex");
const money = (value: number) => new Prisma.Decimal(value);
const futureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  const passwordHash = await bcrypt.hash("demo123456", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@clientflow.ai" },
    update: {
      name: "Marina Costa",
      brandName: "Studio Costa Digital",
      phone: "+55 11 98888-0101",
      website: "https://studiocosta.digital",
      document: "12.345.678/0001-90",
      pixKey: "financeiro@studiocosta.digital",
      footerText: "Proposta valida conforme condicoes comerciais apresentadas.",
      passwordHash,
    },
    create: {
      name: "Marina Costa",
      email: "demo@clientflow.ai",
      passwordHash,
      brandName: "Studio Costa Digital",
      phone: "+55 11 98888-0101",
      website: "https://studiocosta.digital",
      document: "12.345.678/0001-90",
      pixKey: "financeiro@studiocosta.digital",
      footerText: "Proposta valida conforme condicoes comerciais apresentadas.",
    },
  });

  await prisma.aiGenerationLog.deleteMany({ where: { userId: user.id } });
  await prisma.comment.deleteMany({ where: { userId: user.id } });
  await prisma.payment.deleteMany({ where: { userId: user.id } });
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.project.deleteMany({ where: { userId: user.id } });
  await prisma.contract.deleteMany({ where: { userId: user.id } });
  await prisma.proposal.deleteMany({ where: { userId: user.id } });
  await prisma.briefing.deleteMany({ where: { userId: user.id } });
  await prisma.client.deleteMany({ where: { userId: user.id } });

  const loja = await prisma.client.create({
    data: {
      userId: user.id,
      name: "Camila Rocha",
      company: "Lumiere Moda",
      email: "camila@lumieremoda.com.br",
      phone: "+55 11 97777-4545",
      document: "45.223.110/0001-08",
      type: "EMPRESA",
      source: "INSTAGRAM",
      status: "ATIVO",
      notes: "Precisa de uma presenca digital elegante, mas com foco em lancamento rapido.",
    },
  });

  const barbearia = await prisma.client.create({
    data: {
      userId: user.id,
      name: "Rafael Nunes",
      company: "Barbearia Nunes",
      email: "rafael@barbearianunes.com",
      phone: "+55 21 96666-2020",
      document: "31.802.997/0001-32",
      type: "EMPRESA",
      source: "WHATSAPP",
      status: "LEAD",
      notes: "Quer organizar agenda e diminuir mensagens manuais no WhatsApp.",
    },
  });

  const social = await prisma.client.create({
    data: {
      userId: user.id,
      name: "Bianca Alves",
      company: "Bia Social Media",
      email: "contato@biasocial.com",
      phone: "+55 31 95555-9090",
      type: "PESSOA_FISICA",
      source: "INDICACAO",
      status: "ATIVO",
      notes: "Busca landing page de captacao com visual forte para curso gravado.",
    },
  });

  const lojaBriefing = await prisma.briefing.create({
    data: {
      userId: user.id,
      clientId: loja.id,
      title: "Site institucional com catalogo para Lumiere Moda",
      rawInput:
        "Cliente quer um site para loja de roupas, com catalogo, botao de WhatsApp, pagina sobre, contato e integracao com Instagram. Quer algo rapido e barato.",
      projectType: "Site institucional com catalogo",
      objective: "Apresentar a marca, organizar colecoes e levar clientes para atendimento no WhatsApp.",
      targetAudience: "Mulheres de 24 a 42 anos que compram moda casual premium pelo Instagram.",
      pages: ["Inicio", "Catalogo", "Sobre", "Contato"],
      features: ["Catalogo gerenciavel", "Botao de WhatsApp", "Instagram embed", "Formulario de contato"],
      optionalFeatures: ["Blog de tendencias", "Cupom de primeira compra"],
      missingInfo: ["Quantidade inicial de produtos", "Fotos finais das colecoes"],
      risks: ["Prazo depende das fotos dos produtos", "Catalogo pode crescer alem do escopo"],
      suggestedTimeline: "21 dias",
      complexity: "MEDIA",
      suggestedPriceMin: money(4200),
      suggestedPriceMax: money(6800),
      nextQuestions: ["Quantas colecoes entram no lancamento?", "Quem envia textos e fotos?", "Havera loja online no futuro?"],
    },
  });

  const barbeariaBriefing = await prisma.briefing.create({
    data: {
      userId: user.id,
      clientId: barbearia.id,
      title: "Sistema de agendamento para Barbearia Nunes",
      rawInput: "Barbearia quer agenda online simples, confirmacao por WhatsApp e controle dos barbeiros.",
      projectType: "Sistema de agendamento",
      objective: "Reduzir remarcacoes manuais e permitir que clientes escolham horario online.",
      targetAudience: "Clientes recorrentes da barbearia e novos clientes vindos do Google Maps.",
      pages: ["Agenda publica", "Painel administrativo", "Servicos", "Contato"],
      features: ["Cadastro de servicos", "Agenda por profissional", "Bloqueio de horarios", "Confirmacao manual"],
      optionalFeatures: ["Pagamento antecipado", "Lembretes automaticos"],
      missingInfo: ["Quantidade de barbeiros", "Regras de cancelamento"],
      risks: ["Integracao de WhatsApp oficial pode exigir provedor pago"],
      suggestedTimeline: "35 dias",
      complexity: "ALTA",
      suggestedPriceMin: money(9000),
      suggestedPriceMax: money(14000),
      nextQuestions: ["Cada barbeiro tera agenda propria?", "Existe politica de sinal?", "Quais servicos e duracoes?"],
    },
  });

  const socialBriefing = await prisma.briefing.create({
    data: {
      userId: user.id,
      clientId: social.id,
      title: "Landing page para captacao de mentorias",
      rawInput: "Social media precisa vender mentoria com formulario, depoimentos e checkout externo.",
      projectType: "Landing page de captacao",
      objective: "Converter visitantes em leads qualificados para a mentoria de conteudo.",
      targetAudience: "Profissionais autônomos que querem vender mais pelo Instagram.",
      pages: ["Hero", "Metodo", "Depoimentos", "FAQ", "Captura"],
      features: ["Formulario de lead", "Integracao com checkout externo", "Secao de depoimentos", "FAQ"],
      optionalFeatures: ["Teste A/B de headline", "Pixel e eventos avancados"],
      missingInfo: ["Link do checkout", "Depoimentos finais"],
      risks: ["Copy precisa de aprovacao antes do design final"],
      suggestedTimeline: "14 dias",
      complexity: "BAIXA",
      suggestedPriceMin: money(2800),
      suggestedPriceMax: money(4500),
      nextQuestions: ["Qual a promessa central?", "Qual ferramenta de email sera usada?", "Tem provas sociais em video?"],
    },
  });

  const lojaProposal = await prisma.proposal.create({
    data: {
      userId: user.id,
      clientId: loja.id,
      briefingId: lojaBriefing.id,
      title: "Desenvolvimento de site institucional para Lumiere Moda",
      summary:
        "Criacao de um site responsivo para apresentar a marca, exibir colecoes em catalogo e direcionar clientes para atendimento comercial pelo WhatsApp.",
      includedScope: ["Design responsivo", "Catalogo inicial", "Formulario de contato", "Integracao visual com Instagram"],
      excludedScope: ["E-commerce completo", "Cadastro ilimitado de produtos", "Gestao mensal de conteudo"],
      deliverables: ["Site publicado", "Treinamento gravado", "Documentacao rapida", "30 dias de suporte"],
      milestones: ["Briefing", "Design", "Desenvolvimento", "Revisao", "Publicacao"],
      timeline: "21 dias corridos apos recebimento dos materiais",
      totalPrice: money(5800),
      paymentTerms: "50% para iniciar e 50% na entrega.",
      validUntil: futureDate(12),
      notes: "Inclui ate 2 rodadas de revisao.",
      status: "ENVIADA",
      publicToken: token(),
    },
  });

  const barbeariaProposal = await prisma.proposal.create({
    data: {
      userId: user.id,
      clientId: barbearia.id,
      briefingId: barbeariaBriefing.id,
      title: "Sistema de agendamento para Barbearia Nunes",
      summary:
        "Plataforma de agendamento online com servicos, profissionais, horarios disponiveis e painel para acompanhamento da agenda.",
      includedScope: ["Agenda online", "Painel administrativo", "Cadastro de servicos", "Fluxo de confirmacao"],
      excludedScope: ["Aplicativo nativo", "WhatsApp API oficial", "Gateway de pagamento proprio"],
      deliverables: ["Aplicacao web", "Manual de operacao", "Deploy inicial", "Suporte de implantacao"],
      milestones: ["Arquitetura", "UX", "Implementacao", "Testes", "Treinamento"],
      timeline: "35 a 45 dias",
      totalPrice: money(12000),
      paymentTerms: "40% na aprovacao, 30% no prototipo aprovado e 30% na entrega.",
      validUntil: futureDate(8),
      notes: "Valor pode variar se houver pagamento online na primeira versao.",
      status: "RASCUNHO",
      publicToken: token(),
    },
  });

  const socialProposal = await prisma.proposal.create({
    data: {
      userId: user.id,
      clientId: social.id,
      briefingId: socialBriefing.id,
      title: "Landing page de captacao para Bia Social Media",
      summary:
        "Landing page de alta conversao para divulgar a mentoria, capturar leads e encaminhar visitantes para checkout externo.",
      includedScope: ["Copy base", "Design responsivo", "Formulario de lead", "SEO tecnico essencial"],
      excludedScope: ["Gestao de anuncios", "Automacao complexa de email", "Checkout proprio"],
      deliverables: ["Landing page publicada", "Eventos de conversao basicos", "Checklist de lancamento"],
      milestones: ["Copy", "Layout", "Implementacao", "Publicacao"],
      timeline: "14 dias",
      totalPrice: money(3900),
      paymentTerms: "50% para iniciar e 50% antes da publicacao.",
      validUntil: futureDate(15),
      notes: "Prazo considera aprovacoes em ate 48h.",
      status: "APROVADA",
      approvedAt: new Date(),
      publicToken: token(),
    },
  });

  const socialContract = await prisma.contract.create({
    data: {
      userId: user.id,
      clientId: social.id,
      proposalId: socialProposal.id,
      title: "Contrato de desenvolvimento de landing page",
      contractorData: "Studio Costa Digital, CNPJ 12.345.678/0001-90",
      clientData: "Bianca Alves, CPF/CNPJ informado pela contratante",
      object: "Desenvolvimento de landing page para captacao de leads da mentoria.",
      scope: "Planejamento, copy base, design, desenvolvimento responsivo, formulario de lead e publicacao.",
      totalPrice: money(3900),
      paymentTerms: "50% na assinatura e 50% antes da publicacao.",
      deadline: "14 dias corridos apos envio dos materiais e pagamento inicial.",
      includedRevisions: 2,
      freelancerResponsibilities: ["Desenvolver a pagina conforme escopo aprovado", "Publicar a versao final", "Corrigir erros tecnicos reportados no suporte"],
      clientResponsibilities: ["Enviar materiais no prazo", "Aprovar etapas em ate 48h", "Fornecer acesso ao dominio quando necessario"],
      cancellationTerms: "Cancelamentos apos inicio retêm valores proporcionais ao trabalho executado.",
      penaltyTerms: "Atrasos de pagamento podem pausar a entrega.",
      rightsAndOwnership: "Os direitos de uso sao transferidos apos quitacao integral.",
      supportTerms: "30 dias de suporte para correcoes tecnicas apos entrega.",
      additionalClauses: ["Alteracoes fora do escopo serao orcadas separadamente.", "Ferramentas de terceiros podem ter custos proprios."],
      status: "AGUARDANDO_ACEITE",
      publicToken: token(),
    },
  });

  const lojaContract = await prisma.contract.create({
    data: {
      userId: user.id,
      clientId: loja.id,
      proposalId: lojaProposal.id,
      title: "Contrato de site institucional com catalogo",
      contractorData: "Studio Costa Digital, CNPJ 12.345.678/0001-90",
      clientData: "Lumiere Moda, CNPJ 45.223.110/0001-08",
      object: "Criacao de site institucional responsivo com catalogo inicial.",
      scope: "Design, desenvolvimento, cadastro inicial de produtos e publicacao.",
      totalPrice: money(5800),
      paymentTerms: "50% para iniciar e 50% na entrega.",
      deadline: "21 dias corridos apos materiais aprovados.",
      includedRevisions: 2,
      freelancerResponsibilities: ["Criar layout responsivo", "Implementar catalogo inicial", "Publicar o site"],
      clientResponsibilities: ["Enviar fotos e textos", "Revisar entregas", "Contratar hospedagem/dominio se necessario"],
      cancellationTerms: "Trabalhos executados ate o cancelamento serao cobrados proporcionalmente.",
      rightsAndOwnership: "Arquivos finais liberados apos pagamento total.",
      supportTerms: "30 dias para ajustes tecnicos.",
      additionalClauses: ["E-commerce completo nao esta incluso."],
      status: "RASCUNHO",
      publicToken: token(),
    },
  });

  const socialProject = await prisma.project.create({
    data: {
      userId: user.id,
      clientId: social.id,
      proposalId: socialProposal.id,
      contractId: socialContract.id,
      name: "Landing page Mentoria Bia Social",
      description: "Pagina de captacao para lancamento da mentoria de conteudo.",
      status: "EM_DESENVOLVIMENTO",
      startDate: futureDate(-5),
      dueDate: futureDate(9),
      value: money(3900),
      publicToken: token(),
      links: ["https://figma.com/file/demo-bia-social", "https://checkout.exemplo.com/mentoria"],
      notes: "Copy aprovada. Layout em refinamento.",
    },
  });

  const lojaProject = await prisma.project.create({
    data: {
      userId: user.id,
      clientId: loja.id,
      proposalId: lojaProposal.id,
      contractId: lojaContract.id,
      name: "Site Lumiere Moda",
      description: "Site institucional com catalogo e integracao comercial.",
      status: "AGUARDANDO_REVISAO",
      startDate: futureDate(-12),
      dueDate: futureDate(5),
      value: money(5800),
      publicToken: token(),
      links: ["https://preview.lumieremoda.com.br"],
      notes: "Aguardando aprovacao da pagina Catalogo.",
    },
  });

  const barbeariaProject = await prisma.project.create({
    data: {
      userId: user.id,
      clientId: barbearia.id,
      proposalId: barbeariaProposal.id,
      name: "Agenda Barbearia Nunes",
      description: "Sistema de agenda online e painel operacional.",
      status: "ORCAMENTO",
      dueDate: futureDate(45),
      value: money(12000),
      publicToken: token(),
      notes: "Aguardando aprovacao comercial.",
    },
  });

  await prisma.task.createMany({
    data: [
      { userId: user.id, projectId: socialProject.id, title: "Finalizar secao de depoimentos", description: "Inserir 3 provas sociais finais.", status: "EM_ANDAMENTO", priority: "ALTA", dueDate: futureDate(2) },
      { userId: user.id, projectId: socialProject.id, title: "Configurar formulario", description: "Enviar leads para planilha e email.", status: "PENDENTE", priority: "MEDIA", dueDate: futureDate(4) },
      { userId: user.id, projectId: lojaProject.id, title: "Revisar catalogo", description: "Validar fotos e nomes dos produtos.", status: "EM_ANDAMENTO", priority: "ALTA", dueDate: futureDate(1) },
      { userId: user.id, projectId: lojaProject.id, title: "Publicacao", description: "Apontar dominio apos aprovacao.", status: "PENDENTE", priority: "MEDIA", dueDate: futureDate(5) },
      { userId: user.id, projectId: barbeariaProject.id, title: "Refinar escopo tecnico", description: "Confirmar agenda por profissional.", status: "PENDENTE", priority: "BAIXA", dueDate: futureDate(7) },
    ],
  });

  await prisma.payment.createMany({
    data: [
      { userId: user.id, clientId: social.id, projectId: socialProject.id, description: "Entrada landing page", amount: money(1950), dueDate: futureDate(-3), paidAt: futureDate(-3), status: "PAGO", method: "PIX" },
      { userId: user.id, clientId: social.id, projectId: socialProject.id, description: "Saldo landing page", amount: money(1950), dueDate: futureDate(9), status: "PENDENTE", method: "PIX" },
      { userId: user.id, clientId: loja.id, projectId: lojaProject.id, description: "Parcela final site", amount: money(2900), dueDate: futureDate(3), status: "PENDENTE", method: "TRANSFERENCIA" },
      { userId: user.id, clientId: barbearia.id, projectId: barbeariaProject.id, description: "Entrada sistema agenda", amount: money(4800), dueDate: futureDate(-2), status: "ATRASADO", method: "PIX", notes: "Enviar lembrete apos aprovacao formal." },
    ],
  });

  await prisma.comment.createMany({
    data: [
      { userId: user.id, clientId: loja.id, entityType: "PROPOSAL", entityId: lojaProposal.id, authorType: "CLIENTE", authorName: "Camila Rocha", content: "Gostei da proposta. Podemos incluir uma pequena area para colecao de inverno?" },
      { userId: user.id, clientId: social.id, entityType: "PROJECT", entityId: socialProject.id, authorType: "FREELANCER", authorName: "Marina Costa", content: "Layout inicial enviado para revisao." },
      { userId: user.id, clientId: social.id, entityType: "CONTRACT", entityId: socialContract.id, authorType: "CLIENTE", authorName: "Bianca Alves", content: "Contrato recebido, vou revisar as datas ainda hoje." },
    ],
  });

  await prisma.aiGenerationLog.createMany({
    data: [
      {
        userId: user.id,
        type: "BRIEFING",
        input: { source: "seed", client: "Lumiere Moda" },
        output: { mode: "mock", title: lojaBriefing.title },
        model: "mock-demo",
        status: "MOCK",
      },
      {
        userId: user.id,
        type: "PROPOSAL",
        input: { source: "seed", briefing: socialBriefing.title },
        output: { mode: "mock", title: socialProposal.title },
        model: "mock-demo",
        status: "MOCK",
      },
    ],
  });

  console.log("Seed concluido: demo@clientflow.ai / demo123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
