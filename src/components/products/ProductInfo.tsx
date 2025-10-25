interface IProductInfoProps {
  productsAmount: number
}

export function ProductInfo({ productsAmount }: IProductInfoProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b">
      <div
        className="text-sm text-gray-600"
        role="status"
        aria-live="polite"
      >
        <span className="font-semibold text-gray-900">{productsAmount}</span>
        {' '}{productsAmount === 1 ? 'produto disponível' : 'produtos disponíveis'}
      </div>

      {/* Placeholder para filtros futuros */}
      <div className="text-sm text-gray-500">
        Frete grátis acima de R$ 500,00
      </div>
    </div>
  )
}