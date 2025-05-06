import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, LogIn, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import UDrive from '../assets/udrive-roudend.png'

const signInFormSchema = z.object({
  email: z.string().email({ message: 'Insira um e-mail válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
})

type SignInFormType = z.infer<typeof signInFormSchema>

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
  })

  async function handleSignIn(data: SignInFormType) {
    console.log(data)
  }

  return (
    <>
      <Helmet title="SignIn" />

      <div className="flex flex-col items-center justify-center w-full">
        <img
          src={UDrive}
          className="w-full max-w-sm object-cover"
          alt="Logo UDrive"
        />

        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="flex flex-col gap-4 mt-4 w-full max-w-2xl mx-auto bg-white rounded-md p-6"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Seu melhor e-mail</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <Mail className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  className="pl-10"
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <span className="text-sm mt-1 text-rose-500">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Sua senha</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <Lock className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  className="pl-10"
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <span className="text-sm mt-1 text-rose-500">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <Button className="w-full mt-4">
            <LogIn />
            Entrar
          </Button>
        </form>
      </div>
    </>
  )
}
