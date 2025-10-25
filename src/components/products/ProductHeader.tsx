import { Package } from "lucide-react";

export function ProductHeader() {
  return (
    <header className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Package className="h-6 w-6 text-blue-600" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Catálogo de Produtos
          </h1>
          <p className="text-gray-600">
            Confira nossa seleção de produtos de alta qualidade
          </p>
        </div>
      </div>
    </header>
  )
}