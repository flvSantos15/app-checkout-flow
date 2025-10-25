'use client'

import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const redirectTo = searchParams.get('redirect') || '/catalog';

  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl">
          {activeTab === 'login' ? 'Entrar na sua conta' : 'Criar nova conta'}
        </CardTitle>
        <CardDescription className="text-base">
          {activeTab === 'login'
            ? 'Acesse sua conta para continuar comprando'
            : 'Cadastre-se gratuitamente em segundos'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as 'login' | 'register');
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login" className="text-base cursor-pointer">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="text-base cursor-pointer">
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}