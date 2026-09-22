import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Eye, EyeOff, LoaderCircle, LogIn } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from './auth'
import { messageForLoginError } from './authApi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { z } from '@/lib/zod'

const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

type LoginValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)
  const baseId = useId()
  const ids = { email: `${baseId}-email`, password: `${baseId}-password` }

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })
  const { isSubmitting } = form.formState

  // Failed attempts are announced and focused (WCAG focus management).
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  const onSubmit = async (values: LoginValues) => {
    setError(null)
    try {
      await login(values.email, values.password)
      onSuccess()
    } catch (caught) {
      setError(messageForLoginError(caught))
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {error && (
        <Alert ref={errorRef} tabIndex={-1} variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Could not sign in</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.email}>Email</FieldLabel>
              <Input
                {...field}
                id={ids.email}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-required="true"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `${ids.email}-error` : undefined}
                className="h-11"
              />
              {fieldState.invalid && (
                <FieldError id={`${ids.email}-error`} errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.password}>Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={ids.password}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? `${ids.password}-error` : undefined}
                  className="h-11 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 size-9 -translate-y-1/2"
                  aria-label="Show password"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </Button>
              </div>
              {fieldState.invalid && (
                <FieldError id={`${ids.password}-error`} errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <div>
        <Button type="submit" className="h-11 px-6 text-base" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <LogIn aria-hidden="true" className="size-4" />
          )}
          {isSubmitting ? 'Signing in' : 'Log in'}
        </Button>
      </div>
    </form>
  )
}
