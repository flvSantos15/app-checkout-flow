import { delay } from "@/lib/delay"
import { User } from "@/types/user"
import { createContext, useState } from "react"

export type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string, name: string) => Promise<User>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      return JSON.parse(savedUser)
    }

    return null
  })
  const [loading, setLoading] = useState<boolean>(true)

  const login = async (email: string, password: string): Promise<User> => {
    await delay(800)
    // Preciso buscar o user no localStorage e comparar os dados com esse.
    // Se o email ou senha noa bater, vou enviar um invalid credentials
    // Se o email nao foi encontrado, vou enviar um not found.
    const mockUser: Partial<User> = {
      email,
      password
    }

    // Se der sucesso, entao salvo o user completo.
    // Preciso ver a nescessidade de aplicar JWT.

    // setUser(mockUser)
    // localStorage.setItem('user', JSON.stringify(mockUser))
    // return mockUser
    setLoading(false)
    return {} as User
  }

  const register = async (email: string, password: string, name: string) => {
    await delay(1000)
    const mockUser: User = {
      id: Date.now(),
      email,
      name,
      password
    }

    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    setLoading(false)
    return mockUser
  }

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}