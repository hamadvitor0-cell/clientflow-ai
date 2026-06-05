import OpenAI from "openai";
import { z } from "zod";
import {
  generatedContractSchema,
  generatedProposalSchema,
  structuredBriefingSchema,
} from "@/lib/validations";

type AiResult<T> = {
  data: T;
  model: string;
  status: "MOCK" | "SUCCESS";
  error?: string;
};

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

async function withTimeout<T>(promise: Promise<T>, ms = 20000) {
  let timeout: ReturnType<typeof setTimeout>;
  const timer = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error("Timeout na IA")), ms);
  });

  try {
    return await Promise.race([promise, timer]);
  } finally {
    clearTimeout(timeout!);
  }
}

async function generateJson<T>({
  type,
  prompt,
  schema,
  fallback,
}: {
  type: string;
  prompt: string;
  schema: z.ZodSchema<T>;
  fallback: T;
}): Promise<AiResult<T>> {
  const client = getOpenAI();
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (!client) {
    return { data: fallback, model: "mock-demo", status: "MOCK" };
  }

  try {
    const completion = await withTimeout(
      client.chat.completions.create({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Voce e um consultor senior para freelancers. Responda apenas JSON valido, sem markdown.",
          },
          {
            role: "user",
            content: `${type}\n\n${prompt}`,
          },
        ],
      }),
    );

    const raw = completion.choices[0]?.message.content;
    if (!raw) throw new Error("Resposta vazia da IA");

    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      throw new Error("JSON da IA nao passou na validacao Zod");
    }

    return { data: parsed.data, model, status: "SUCCESS" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha inesperada na IA";
    return { data: fallback, model: "mock-demo", status: "MOCK", error: message };
  }
}

export async function generateStructuredBriefing(input: string) {
  const fallback = structuredBriefingSchema.parse({
    projectType: "Site profissional para freelancer",
    objective:
      "Transformar a conversa inicial em um escopo claro, com entregas, riscos e proximas perguntas para o cliente.",
    targetAudience: "Clientes que chegam por WhatsApp, Instagram ou indicacao.",
    pages: ["Inicio", "Sobre", "Servicos", "Contato"],
    features: ["Formulario de contato", "Botao de WhatsApp", "Design responsivo"],
    optionalFeatures: ["Blog", "Area de depoimentos", "Integracao com CRM"],
    missingInfo: ["Prazo ideal", "Referencias visuais", "Materiais de marca"],
    risks: ["Escopo ainda amplo", "Dependencia de conteudo enviado pelo cliente"],
    suggestedTimeline: "21 a 30 dias",
    complexity: "MEDIA",
    suggestedPriceMin: 3500,
    suggestedPriceMax: 6500,
    nextQuestions: [
      "Qual e o objetivo comercial principal?",
      "Quem aprova textos e design?",
      "Ha integracoes obrigatorias?",
    ],
  });

  return generateJson({
    type: "Organize este briefing em JSON com campos profissionais.",
    prompt: input,
    schema: structuredBriefingSchema,
    fallback,
  });
}

export async function generateProposalFromBriefing(briefing: unknown) {
  const fallback = generatedProposalSchema.parse({
    title: "Desenvolvimento de projeto digital sob medida",
    summary:
      "Criacao de uma solucao digital responsiva, organizada em etapas claras e preparada para gerar valor comercial ao cliente.",
    includedScope: [
      "Briefing e planejamento",
      "Design responsivo",
      "Desenvolvimento da primeira versao",
      "Publicacao assistida",
    ],
    excludedScope: [
      "Gestao mensal de conteudo",
      "Custos de ferramentas terceiras",
      "Funcionalidades nao descritas no escopo aprovado",
    ],
    deliverables: ["Aplicacao ou site publicado", "Treinamento rapido", "Documentacao de entrega"],
    milestones: ["Briefing", "Estruturacao", "Design", "Desenvolvimento", "Revisao", "Publicacao", "Entrega"],
    timeline: "21 a 30 dias, conforme complexidade e aprovacoes",
    totalPrice: 5800,
    paymentTerms:
      "50% para iniciar e 50% na entrega. Alteracoes fora do escopo serao orcadas separadamente.",
    notes: "Inclui 2 rodadas de revisao.",
  });

  return generateJson({
    type:
      "Gere uma proposta comercial para freelancer. O JSON deve conter titulo, resumo, escopos, entregaveis, etapas, prazo, valor e termos.",
    prompt: JSON.stringify(briefing),
    schema: generatedProposalSchema,
    fallback,
  });
}

export async function generateContractFromProposal(proposal: unknown) {
  const fallback = generatedContractSchema.parse({
    title: "Contrato de prestacao de servicos digitais",
    contractorData: "Dados do freelancer ou empresa contratada",
    clientData: "Dados do cliente contratante",
    object:
      "Prestacao de servicos digitais conforme proposta comercial aprovada pelas partes.",
    scope:
      "Execucao do escopo aprovado, incluindo planejamento, desenvolvimento, revisoes previstas e entrega final.",
    totalPrice: 5800,
    paymentTerms: "50% para iniciar e 50% antes da entrega final.",
    deadline: "Conforme cronograma aprovado na proposta comercial.",
    includedRevisions: 2,
    freelancerResponsibilities: [
      "Executar o escopo aprovado",
      "Comunicar riscos e dependencias",
      "Entregar os materiais finais apos quitacao",
    ],
    clientResponsibilities: [
      "Enviar materiais e acessos necessarios",
      "Aprovar etapas em prazo razoavel",
      "Efetuar pagamentos nas datas combinadas",
    ],
    cancellationTerms:
      "Em caso de cancelamento, valores proporcionais ao trabalho executado poderao ser retidos.",
    penaltyTerms: "Atrasos de pagamento podem suspender o cronograma.",
    rightsAndOwnership:
      "Os direitos de uso da entrega final sao transferidos ao cliente apos pagamento integral.",
    supportTerms: "30 dias de suporte tecnico para correcoes relacionadas a entrega.",
    additionalClauses: [
      "Alteracoes fora do escopo serao orcadas separadamente.",
      "Ferramentas de terceiros podem gerar custos adicionais.",
      "Este modelo nao substitui orientacao juridica profissional.",
    ],
  });

  return generateJson({
    type:
      "Gere um contrato claro para freelancer, com clausulas profissionais sem juridiquês exagerado.",
    prompt: JSON.stringify(proposal),
    schema: generatedContractSchema,
    fallback,
  });
}

export async function suggestProjectPrice(briefing: unknown) {
  const result = await generateProposalFromBriefing(briefing);
  return {
    ...result,
    data: {
      min: Math.round(result.data.totalPrice * 0.8),
      max: Math.round(result.data.totalPrice * 1.25),
    },
  };
}

export async function detectProjectRisks(briefing: unknown) {
  const result = await generateStructuredBriefing(JSON.stringify(briefing));
  return {
    ...result,
    data: result.data.risks,
  };
}

export async function generateClientMessage(
  type: "educada" | "direta" | "firme",
  context: unknown,
) {
  const tone = {
    educada: "tom cordial, colaborativo e leve",
    direta: "tom objetivo e profissional",
    firme: "tom firme, claro e respeitoso",
  }[type];

  const schema = z.object({ message: z.string().min(10) });
  const fallback = {
    message:
      type === "firme"
        ? "Oi! Passando para reforcar que o pagamento esta pendente e preciso da regularizacao para mantermos o cronograma combinado. Pode me enviar uma previsao ainda hoje?"
        : type === "direta"
          ? "Oi! O pagamento combinado ainda esta pendente. Pode me confirmar a previsao de pagamento para eu manter o projeto organizado?"
          : "Oi! Tudo bem? Passando para lembrar do pagamento em aberto e confirmar se posso ajudar com alguma informacao para facilitar.",
  };

  return generateJson({
    type: `Gere uma mensagem de cobranca ${type}, com ${tone}.`,
    prompt: JSON.stringify(context),
    schema,
    fallback,
  });
}
