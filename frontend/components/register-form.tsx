"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { registerSchema, RegisterFormValues } from "@/lib/validations/auth"
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

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      router.push("/login?registered=true")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(
          error.message || "Unexpected error occurred. Please try again."
        )
      } else {
        console.error("Unexpected error:", error)
        setApiError("Unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Renseigne tes informations ci-dessous pour rejoindre Ariadne.
        </CardDescription>
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
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder="AriadneDev"
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </Field>

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
                  Your email will be used for account verification and
                  notifications.
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...register("password")} />
              {errors.password ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : (
                <FieldDescription>At least 8 characters</FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>

            <FieldGroup className="mt-2">
              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Création du compte..." : "Créer un compte"}
                </Button>
                <FieldDescription className="mt-4 px-6 text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary underline"
                  >
                    Sign in
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
