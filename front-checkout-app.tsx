import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, CreditCard, QrCode, FileText, Check, X, Loader2, Trash2, Plus, Minus, LogOut, User, Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/**
 * ESTRUTURA COMPLETA DO PROJETO NEXT.JS 15 + REACT 19
 * 
 * Estrutura de pastas recomendada:
 * 
 * /
 * ├── .dockerignore
 * ├── Dockerfile
 * ├── docker-compose.yml
 * ├── next.config.ts
 * ├── tsconfig.json
 * ├── tailwind.config.ts
 * ├── package.json
 * ├── .env.local
 * │
 * ├── src/
 * │   ├── app/                          # App Router (Next.js 15)
 * │   │   ├── layout.tsx                # Root layout (SSR)
 * │   │   ├── page.tsx                  # Home page (SSG)
 * │   │   ├── auth/
 * │   │   │   └── page.tsx              # Login/Register (SSR)
 * │   │   ├── catalog/
 * │   │   │   └── page.tsx              # Product catalog (SSG)
 * │   │   ├── cart/
 * │   │   │   └── page.tsx              # Cart page (SSR)
 * │   │   ├── checkout/
 * │   │   │   └── page.tsx              # Checkout flow (SSR)
 * │   │   └── order/
 * │   │       └── [id]/
 * │   │           └── page.tsx          # Order status (SSR)
 * │   │
 * │   ├── components/                   # Componentes reutilizáveis
 * │   │   ├── ui/                       # Shadcn/UI components
 * │   │   ├── auth/
 * │   │   │   └── AuthForm.tsx
 * │   │   ├── cart/
 * │   │   │   ├── CartItem.tsx
 * │   │   │   └── CartSummary.tsx
 * │   │   ├── checkout/
 * │   │   │   ├── PaymentMethodSelector.tsx
 * │   │   │   ├── PixPayment.tsx
 * │   │   │   ├── CreditCardForm.tsx
 * │   │   │   └── BoletoPayment.tsx
 * │   │   └── products/
 * │   │       └── ProductCard.tsx
 * │   │
 * │   ├── contexts/                     # React Context API
 * │   │   ├── AuthContext.tsx
 * │   │   └── CartContext.tsx
 * │   │
 * │   ├── hooks/                        # Custom hooks
 * │   │   ├── useAuth.ts
 * │   │   ├── useCart.ts
 * │   │   └── usePayment.ts
 * │   │
 * │   ├── types/                        # TypeScript types
 * │   │   ├── product.ts
 * │   │   ├── user.ts
 * │   │   ├── order.ts
 * │   │   └── payment.ts
 * │   │
 * │   ├── lib/                          # Utilities
 * │   │   ├── utils.ts
 * │   │   └── mock-api.ts
 * │   │
 * │   └── styles/
 * │       └── globals.css
 * │
 * └── public/
 *     └── images/
 * 
 * CONFIGURAÇÕES IMPORTANTES:
 * 
 * 1. tsconfig.json - TypeScript strict mode habilitado
 * 2. next.config.ts - Configuração para SSR/SSG
 * 3. Dockerfile - Containerização da aplicação
 * 4. docker-compose.yml - Orquestração de containers
 * 5. .env.local - Variáveis de ambiente
 */

// ==================== TYPES (TypeScript) ====================
type User = {
  id: number;
  email: string;
  name: string;
  cpf: string;
  phone: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

type CartItem = Product & {
  quantity: number;
};

type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | '';

type OrderStatus = 'awaiting_payment' | 'processing' | 'paid' | 'failed';

type Order = {
  status: OrderStatus;
  orderId: string;
  method: PaymentMethod;
  barcode?: string;
  error?: string;
};

// ==================== CONTEXTS ====================
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// ==================== MOCK DATA ====================
const PRODUCTS: Product[] = [
  { id: 1, name: 'Notebook Dell Inspiron', price: 3499.90, image: '💻', description: 'i5, 8GB RAM, 256GB SSD' },
  { id: 2, name: 'Mouse Logitech MX Master', price: 349.90, image: '🖱️', description: 'Wireless, ergonômico' },
  { id: 3, name: 'Teclado Mecânico RGB', price: 599.90, image: '⌨️', description: 'Switch Blue, iluminação RGB' },
  { id: 4, name: 'Monitor LG 27" 4K', price: 1899.90, image: '🖥️', description: 'IPS, 60Hz, HDR' },
  { id: 5, name: 'Webcam Logitech C920', price: 449.90, image: '📷', description: 'Full HD 1080p' },
  { id: 6, name: 'Headset HyperX Cloud II', price: 499.90, image: '🎧', description: '7.1 surround, microfone removível' },
];

// ==================== UTILITY FUNCTIONS ====================
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// ==================== PROVIDERS ====================
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simula verificação de sessão (em Next.js seria uma chamada ao servidor)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    await delay(800);
    const mockUser: User = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      cpf: '123.456.789-00',
      phone: '(98) 98765-4321',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = async (email: string, password: string, name: string): Promise<User> => {
    await delay(1000);
    const mockUser: User = {
      id: Date.now(),
      email,
      name,
      cpf: '',
      phone: '',
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product): void => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId: number): void => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = (): void => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

// ==================== COMPONENTS ====================

/**
 * AuthScreen Component
 * Acessibilidade: Labels associados, ARIA attributes, navegação por teclado
 */
function AuthScreen({ onSuccess }: { onSuccess?: () => void }) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      if (!email || !password || (!isLogin && !name)) {
        throw new Error('Preencha todos os campos');
      }

      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Acesse sua conta para continuar' : 'Cadastre-se para começar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome completo
                  <span className="text-red-500 ml-1" aria-label="obrigatório">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  required={!isLogin}
                  autoComplete="name"
                  aria-required={!isLogin}
                  aria-invalid={error ? 'true' : 'false'}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">
                E-mail
                <span className="text-red-500 ml-1" aria-label="obrigatório">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Senha
                <span className="text-red-500 ml-1" aria-label="obrigatório">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
              />
            </div>

            {error && (
              <Alert variant="destructive" role="alert" id="error-message">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Processando...</span>
                </>
              ) : (
                isLogin ? 'Entrar' : 'Criar Conta'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            type="button"
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/**
 * ProductCatalog Component
 * Acessibilidade: Botões com labels descritivos, feedback visual e sonoro
 */
function ProductCatalog() {
  const { addItem } = useCart();
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const handleAddToCart = (product: Product): void => {
    addItem(product);
    setAddedProducts(prev => new Set([...prev, product.id]));
    
    // Feedback de acessibilidade
    const announcement = `${product.name} adicionado ao carrinho`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('role', 'status');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);
    
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      document.body.removeChild(ariaLive);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" aria-hidden="true" />
        <h2 className="text-2xl font-bold">Produtos</h2>
      </div>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="Lista de produtos"
      >
        {PRODUCTS.map(product => (
          <Card key={product.id} role="listitem">
            <CardHeader>
              <div 
                className="text-6xl mb-2 text-center" 
                role="img" 
                aria-label={`Ícone do produto ${product.name}`}
              >
                {product.image}
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-2xl font-bold text-green-600" aria-label={`Preço: ${formatCurrency(product.price)}`}>
                {formatCurrency(product.price)}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleAddToCart(product)}
                disabled={addedProducts.has(product.id)}
                aria-label={`Adicionar ${product.name} ao carrinho`}
                aria-pressed={addedProducts.has(product.id)}
              >
                {addedProducts.has(product.id) ? (
                  <>
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                    Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                    Adicionar ao Carrinho
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * CartView Component
 * Acessibilidade: Controles numéricos acessíveis, labels descritivos
 */
function CartView({ onCheckout }: { onCheckout: () => void }) {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" aria-hidden="true" />
        <h3 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h3>
        <p className="text-gray-500">Adicione produtos para continuar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6" aria-hidden="true" />
        <h2 className="text-2xl font-bold">Carrinho</h2>
        <span className="text-sm text-gray-500" aria-live="polite">
          ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </span>
      </div>

      <div className="space-y-4" role="list" aria-label="Itens no carrinho">
        {items.map(item => (
          <Card key={item.id} role="listitem">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="text-4xl" role="img" aria-label={`Ícone do ${item.name}`}>
                {item.image}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-lg font-bold text-green-600 mt-1">
                  {formatCurrency(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-2" role="group" aria-label={`Controles de quantidade para ${item.name}`}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label={`Diminuir quantidade de ${item.name}`}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </Button>
                
                <span 
                  className="w-12 text-center font-semibold" 
                  role="status"
                  aria-label={`Quantidade: ${item.quantity}`}
                  aria-live="polite"
                >
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label={`Aumentar quantidade de ${item.name}`}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remover ${item.name} do carrinho`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span 
              className="text-2xl font-bold text-green-600"
              aria-label={`Total: ${formatCurrency(total)}`}
            >
              {formatCurrency(total)}
            </span>
          </div>
          
          <Button 
            className="w-full" 
            size="lg" 
            onClick={onCheckout}
            aria-label="Ir para finalização da compra"
          >
            Finalizar Compra
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * CheckoutFlow Component
 * Acessibilidade: Formulários acessíveis, feedback de validação
 */
function CheckoutFlow({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<'payment' | 'status'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<Order | null>(null);
  const [pixCode, setPixCode] = useState<string>('');

  const handlePayment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await delay(1500);

      const orderId = `ORD-${Date.now()}`;
      
      if (paymentMethod === 'pix') {
        setPixCode('00020126580014br.gov.bcb.pix0136' + orderId);
        setOrderStatus({ status: 'awaiting_payment', orderId, method: paymentMethod });
        
        setTimeout(async () => {
          setOrderStatus(prev => prev ? { ...prev, status: 'processing' } : null);
          await delay(2000);
          
          const success = Math.random() > 0.2;
          setOrderStatus(prev => prev ? {
            ...prev,
            status: success ? 'paid' : 'failed'
          } : null);
          
          if (success) {
            clearCart();
          }
        }, 3000);
      } else if (paymentMethod === 'credit_card') {
        setOrderStatus({ status: 'processing', orderId, method: paymentMethod });
        await delay(3000);
        
        const success = Math.random() > 0.15;
        setOrderStatus(prev => prev ? {
          ...prev,
          status: success ? 'paid' : 'failed'
        } : null);
        
        if (success) {
          clearCart();
        }
      } else if (paymentMethod === 'boleto') {
        const barcodeNumber = '23793.38128 60000.000001 00000.000009 1 98760000012345';
        setOrderStatus({
          status: 'awaiting_payment',
          orderId,
          method: paymentMethod,
          barcode: barcodeNumber
        });
        
        setTimeout(async () => {
          setOrderStatus(prev => prev ? { ...prev, status: 'processing' } : null);
          await delay(2000);
          setOrderStatus(prev => prev ? { ...prev, status: 'paid' } : null);
          clearCart();
        }, 5000);
      }
      
      setStep('status');
    } catch (err) {
      setOrderStatus({ 
        status: 'failed', 
        orderId: 'ERROR', 
        method: paymentMethod,
        error: err instanceof Error ? err.message : 'Erro desconhecido'
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'status' && orderStatus) {
    return <OrderStatus orderStatus={orderStatus} onComplete={onComplete} pixCode={pixCode} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" aria-hidden="true" />
        <h2 className="text-2xl font-bold">Finalizar Compra</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Comprador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyer-name">Nome</Label>
                  <Input 
                    id="buyer-name" 
                    value={user?.name || ''} 
                    disabled 
                    aria-readonly="true"
                  />
                </div>
                <div>
                  <Label htmlFor="buyer-email">E-mail</Label>
                  <Input 
                    id="buyer-email" 
                    value={user?.email || ''} 
                    disabled 
                    aria-readonly="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
              <CardDescription>Escolha como deseja pagar</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
                aria-label="Selecione o método de pagamento"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                    <QrCode className="h-5 w-5" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">PIX</div>
                      <div className="text-sm text-gray-500">Aprovação imediata</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">Cartão de Cr