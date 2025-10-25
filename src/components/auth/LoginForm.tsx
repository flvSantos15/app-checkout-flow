import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = searchParams.get('redirect') || '/catalog';

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      if (!email || !password) {
        throw new Error('Preencha todos os campos');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('E-mail inválido');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres');
      }

      await login(email, password);

      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo de volta!`,
      });

      // Delay para melhor UX
      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);

      // Anúncio para leitores de tela
      const announcement = document.getElementById('error-announcement');
      if (announcement) {
        announcement.textContent = errorMessage;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-base">
          E-mail
          <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
        </Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10 h-12 text-base"
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : undefined}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-base">
          Senha
          <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
        </Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="login-password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 h-12 text-base"
            required
            autoComplete="current-password"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" role="alert" id="error-message">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  )
}