import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductInfo } from '@/components/products/ProductInfo';
import { getProducts } from '@/lib/mock-api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Produtos - Checkout App',
  description: 'Explore nossa seleção completa de produtos eletrônicos com os melhores preços do mercado. Notebooks, periféricos e acessórios.',
  keywords: ['produtos', 'eletrônicos', 'computadores', 'periféricos', 'notebooks', 'acessórios'],
};

export const dynamic = 'force-static';

export const revalidate = 300;

export default async function CatalogPage() {
  const products = await getProducts()

  return (
    <div className='space-y-8'>
      <ProductHeader />

      <ProductInfo productsAmount={products.length} />

      {/* grid product aqui */}


    </div>
  )
}