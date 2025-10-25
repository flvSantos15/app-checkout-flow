import { Product } from "@/types/product";
import { delay } from "./delay";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Notebook Dell Inspiron 15',
    description: 'Intel Core i5 11ª geração, 8GB RAM, SSD 256GB, Tela 15.6" Full HD',
    price: 3499.90,
    image: '💻',
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3S',
    description: 'Wireless, ergonômico, 8000 DPI, silencioso, bateria de até 70 dias',
    price: 349.90,
    image: '🖱️',
  },
  {
    id: 3,
    name: 'Teclado Mecânico RGB Gamer',
    description: 'Switch Blue, iluminação RGB personalizável, anti-ghosting',
    price: 599.90,
    image: '⌨️',
  },
  {
    id: 4,
    name: 'Monitor LG 27" 4K UHD',
    description: 'IPS, 60Hz, HDR10, USB-C, ajuste de altura, FreeSync',
    price: 1899.90,
    image: '🖥️',
  },
  {
    id: 5,
    name: 'Webcam Logitech C920 HD Pro',
    description: 'Full HD 1080p, 30fps, microfone estéreo, correção de luz',
    price: 449.90,
    image: '📷',
  },
  {
    id: 6,
    name: 'Headset HyperX Cloud II',
    description: '7.1 surround virtual, microfone removível, almofadas memory foam',
    price: 499.90,
    image: '🎧',
  },
  {
    id: 7,
    name: 'SSD Kingston NV2 500GB',
    description: 'M.2 NVMe PCIe 4.0, leitura 3500MB/s, escrita 2100MB/s',
    price: 279.90,
    image: '💾',
  },
  {
    id: 8,
    name: 'Mousepad Gamer Extended RGB',
    description: 'RGB, 80x30cm, superfície speed, base antiderrapante',
    price: 89.90,
    image: '🎮',
  },
  {
    id: 9,
    name: 'Cadeira Gamer ThunderX3',
    description: 'Ergonômica, reclinável 180°, suporta até 150kg, almofadas incluídas',
    price: 1299.90,
    image: '🪑',
  },
  {
    id: 10,
    name: 'Hub USB-C 7 em 1',
    description: 'HDMI 4K, USB 3.0, leitor SD/microSD, USB-C PD 100W',
    price: 179.90,
    image: '🔌',
  },
  {
    id: 11,
    name: 'Microfone Blue Yeti',
    description: 'USB, condensador, 4 padrões polares, qualidade estúdio',
    price: 799.90,
    image: '🎙️',
  },
  {
    id: 12,
    name: 'Suporte Monitor Articulado',
    description: 'Para monitores de 13" a 32", VESA, rotação 360°, braço duplo',
    price: 159.90,
    image: '🖼️',
  },
];

// Simula: GET /api/products
export async function getProducts(): Promise<Product[]> {
  await delay(200);
  return [...PRODUCTS];
}

// Simula: GET /api/products/:id
export async function getProductById(id: number): Promise<Product | null> {
  await delay(150);
  const product = PRODUCTS.find(p => p.id === id);
  return product ? { ...product } : null;
}

// Simula: GET /api/products/search?q=:query
export async function searchProducts(query: string): Promise<Product[]> {
  await delay(300);
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery)
  );
}