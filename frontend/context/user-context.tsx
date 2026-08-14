"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { userApi } from "@/api/user"
import { authApi } from "@/api/auth"
import { User } from "@/types/user"

interface UserContextType {
  user: User | null
  isLoading: boolean
  refetchUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reloadIndex, setReloadIndex] = useState(0)

  useEffect(() => {
    let isCancelled = false

    async function loadUser() {
      try {
        const data = await userApi.getProfile()
        if (!isCancelled) {
          setUser(data)
        }
      } catch (error: unknown) {
        console.error("Error fetching user profile:", error)
        if (!isCancelled) {
          setUser(null)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      isCancelled = true
    }
  }, [reloadIndex])

  const refetchUser = useCallback(async () => {
    setIsLoading(true)
    setReloadIndex((prev) => prev + 1)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, refetchUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
