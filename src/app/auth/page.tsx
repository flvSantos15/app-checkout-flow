import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl grid lg:grid-cols-1 gap-12 items-center">
        <div className="hidden lg:block space-y-8">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo ao <span className="text-blue-600">Checkout App</span>
          </h1>
        </div>

        <div>
          <div
            id="error-announcement"
            className="sr-only"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          />

          <AuthForm />
        </div>
      </div>
    </div>
  )
}