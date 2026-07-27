"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { LoginFormValues, loginSchema } from "@/lib/validations/auth"
import { authApi } from "@/api/auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()

  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await authApi.login({
        email: data.email,
        password: data.password,
      })

      router.push("/")
    } catch (error: any) {
      setApiError(
        error.message || "Une erreur est survenue lors de la connexion"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connecte-toi à ton compte Ariadne.</CardDescription>
      </CardHeader>

      <CardContent>
        {apiError && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />

              {errors.email ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : (
                <FieldDescription>
                  Utilise l'adresse email associée à ton compte.
                </FieldDescription>
              )}
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>

                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm text-primary underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Input id="password" type="password" {...register("password")} />

              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </Field>

            <FieldGroup className="mt-2">
              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>

                {/* À réactiver lorsque Google OAuth sera implémenté */}
                {/*
                <Button
                  variant="outline"
                  type="button"
                  className="mt-2 w-full"
                >
                  Continuer avec Google
                </Button>
                */}

                <FieldDescription className="mt-4 px-6 text-center">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary underline"
                  >
                    Créer un compte
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
