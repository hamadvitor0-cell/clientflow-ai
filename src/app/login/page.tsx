import Link from "next/link";
import { demoLoginAction, loginAction } from "@/server/actions/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/forms/auth-forms";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <Card className="w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-primary">
          ClientFlow AI
        </Link>
        <h1 className="mt-5 text-2xl font-semibold">Entrar na conta</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Acesse o dashboard para gerenciar clientes, propostas e projetos.
        </p>
        {params.error ? (
          <div className="mt-5 rounded-md border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
            {params.error === "seed"
              ? "Rode o seed para usar a conta demo."
              : "E-mail ou senha inválidos."}
          </div>
        ) : null}
        <LoginForm action={loginAction} />
        <form action={demoLoginAction} className="mt-3">
          <Button type="submit" variant="secondary" className="w-full">
            Entrar como demo
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-primary">
            Criar cadastro
          </Link>
        </p>
      </Card>
    </main>
  );
}
