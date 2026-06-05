import Link from "next/link";
import { registerAction } from "@/server/actions/auth";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/forms/auth-forms";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <Card className="w-full max-w-lg">
        <Link href="/" className="text-sm font-semibold text-primary">
          ClientFlow AI
        </Link>
        <h1 className="mt-5 text-2xl font-semibold">Criar conta</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Configure sua marca e comece a organizar propostas e contratos.
        </p>
        {params.error ? (
          <div className="mt-5 rounded-md border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
            {params.error === "exists"
              ? "Este e-mail já está cadastrado."
              : "Revise os campos obrigatórios."}
          </div>
        ) : null}
        <RegisterForm action={registerAction} />
        <p className="mt-6 text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary">
            Entrar
          </Link>
        </p>
      </Card>
    </main>
  );
}
