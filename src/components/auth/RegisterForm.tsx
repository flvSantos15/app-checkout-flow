import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { AlertCircle, Loader2, Lock, Mail, UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = searchParams.get('redirect') || '/catalog';


  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Preencha todos os campos")
      }

      if (name.trim().length < 3) {
        throw new Error('O nome deve ter no mínimo 3 caracteres')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('E-mail inválido');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      await register(email, password, name);

      toast({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo, ${name}!`,
      });

      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(errorMessage);

      const announcement = document.getElementById('error-announcement');
      if (announcement) {
        announcement.textContent = errorMessage;
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="register-name" className="text-base">
          Nome
          <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
        </Label>
        <div className="relative">
          <UserIcon
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="register-name"
            name="name"
            type="text"
            placeholder="João Silva"
            className="pl-10 h-12 text-base"
            required
            autoComplete="name"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-base">
          E-mail
          <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
        </Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10 h-12 text-base"
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-base">
          Senha
          <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
        </Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 h-12 text-base"
            required
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby="password-hint"
          />
        </div>
        <p id="password-hint" className="text-sm text-gray-500 mt-1">
          Mínimo de 6 caracteres
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm-password" className="text-base">
          Confirmar senha
          <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
        </Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="pl-10 h-12 text-base"
            required
            autoComplete="new-password"
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
            Criando conta...
          </>
        ) : (
          'Criar Conta Grátis'
        )}
      </Button>
    </form>
  )
}