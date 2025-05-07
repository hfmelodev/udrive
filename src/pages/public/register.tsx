import { Helmet } from 'react-helmet-async'

import UDrive from '@/assets/udrive-roudend.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { Loader2, Lock, Mail, User, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

const registerFormSchema = z.object({
  name: z.string().nonempty({ message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'Insira um e-mail válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
})

type RegisterFormType = z.infer<typeof registerFormSchema>

export function Register() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
  })

  async function handleRegister(data: RegisterFormType) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      // Atualiza o displayName com o nome passado pelo usuário
      await updateProfile(user, {
        displayName: data.name,
      })

      // Atualiza o usuário no store
      setUser(user)

      toast.success('Conta criada com sucesso', {
        description: 'Você já pode fazer login',
      })

      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.log(err)

      if (err instanceof FirebaseError) {
        if (err.code === 'auth/email-already-in-use') {
          toast.error('O e-mail informado já está em uso', {
            description: 'Tente novamente com outro e-mail',
          })
        }

        return
      }

      toast.error('Não foi possível criar sua conta', {
        description: 'Tente novamente ou entre em contato com o suporte',
      })
    }
  }

  return (
    <>
      <Helmet title="Register" />

      <div className="flex flex-col items-center justify-center w-full mx-4">
        <Link to="/">
          <img
            src={UDrive}
            className="w-full max-w-sm object-cover"
            alt="Logo UDrive"
          />
        </Link>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-4 mt-4 w-full max-w-2xl mx-auto bg-white rounded-md p-6"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Seu nome completo</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <User className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  className="pl-10"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <span className="text-sm mt-1 text-rose-500">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Seu melhor e-mail</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <Mail className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  className="pl-10"
                  id="email"
                  type="email"
                  placeholder="john.doe@me.com"
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
                  placeholder="********"
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
                Registrando...
              </>
            ) : (
              <>
                <UserPlus />
                Registrar
              </>
            )}
          </Button>
        </form>

        <div className="flex gap-2 items-center justify-center mt-4">
          <span className="text-sm text-muted-foreground">
            Já possui uma conta?
          </span>
          <a href="/auth" className="text-sm font-medium text-primary">
            Entrar
          </a>
        </div>
      </div>
    </>
  )
}
