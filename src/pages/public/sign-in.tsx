import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock, LogIn, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import UDrive from '@/assets/udrive-roudend.png'
import { auth } from '@/lib/firebase'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

const signInFormSchema = z.object({
  email: z.string().email({ message: 'Insira um e-mail válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
})

type SignInFormType = z.infer<typeof signInFormSchema>

export function SignIn() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
  })

  async function handleSignIn(data: SignInFormType) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)

      toast.success('Login realizado com sucesso', {
        description: 'Você já pode começar a usar o UDrive',
      })

      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.log(err)

      if (err instanceof FirebaseError) {
        if (err.code === 'auth/invalid-credential') {
          toast.error('E-mail ou senha inválidos', {
            description: 'Tente novamente ou entre em contato com o suporte',
          })
        }

        return
      }

      toast.error('Não foi possível fazer login', {
        description: 'Tente novamente ou entre em contato com o suporte',
      })
    }
  }

  return (
    <>
      <Helmet title="SignIn" />

      <div className="flex flex-col items-center justify-center w-full mx-4">
        <Link to="/">
          <img
            src={UDrive}
            className="w-full max-w-sm object-cover"
            alt="Logo UDrive"
          />
        </Link>

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

          <Button className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Validando dados...
              </>
            ) : (
              <>
                <LogIn />
                Entrar
              </>
            )}
          </Button>
        </form>

        <div className="flex gap-2 items-center justify-center mt-4">
          <span className="text-sm text-muted-foreground">
            Não possui uma conta?
          </span>
          <a href="/auth/register" className="text-sm font-medium text-primary">
            Cadastre-se
          </a>
        </div>
      </div>
    </>
  )
}
