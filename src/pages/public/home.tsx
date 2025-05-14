import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { firebase } from '@/lib/firebase'
import { zodResolver } from '@hookform/resolvers/zod'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'

interface CarImageProps {
  uid: string
  name: string
  url: string
}

interface CarsProps {
  id: string
  name: string
  year: string
  km: string
  price: string
  city: string
  uid: string
  images: CarImageProps[]
}

const homeFormSchema = z.object({
  name: z.string().nonempty({ message: 'O nome é obrigatório' }),
})

type HomeFormType = z.infer<typeof homeFormSchema>

export function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HomeFormType>({
    resolver: zodResolver(homeFormSchema),
  })
  const [cars, setCars] = useState<CarsProps[]>([])

  useEffect(() => {
    getCars()
  }, [])

  async function getCars() {
    const carsRef = collection(firebase, 'cars')
    // Ordena os carros por data de criação em ordem decrescente (mais recentes primeiro)
    const queryRef = query(carsRef, orderBy('createdAt', 'desc'))

    // Busca os carros no Firebase
    getDocs(queryRef).then(snapshot => {
      const carsData = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      }) as CarsProps[]

      setCars(carsData)
    })
  }

  async function handleSearchCar(data: HomeFormType) {
    setCars([])

    const q = query(
      collection(firebase, 'cars'),
      where('name', '>=', data.name.toUpperCase()),
      where('name', '<=', `${data.name.toUpperCase()}\uf8ff`) // Busca os carros que começam com o valor digitado
    )

    const querySnapshot = await getDocs(q)

    const listCars = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    }) as CarsProps[]

    setCars(listCars)

    reset()
  }

  return (
    <>
      <Helmet title="Home" />

      <section className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
        <form
          onSubmit={handleSubmit(handleSearchCar)}
          className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <div className="flex w-full flex-col gap-1">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Digite o nome do carro que você procura..."
                className="w-full pl-10 text-base placeholder:text-sm "
                {...register('name')}
              />
            </div>
            {errors.name && (
              <span className="mt-1 text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <Button className="h-10 shrink-0 gap-2 px-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="font-medium text-sm">Buscando...</span>
              </>
            ) : (
              <>
                <Search className="size-4" />
                <span className="font-medium text-sm">Buscar</span>
              </>
            )}
          </Button>
        </form>

        <h1 className="text-center font-medium text-lg md:text-xl">
          Encontre{' '}
          <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            carros novos
          </span>{' '}
          e{' '}
          <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            seminovos
          </span>{' '}
          em todo o Brasil
        </h1>
      </section>

      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-10">
        {cars.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <p className="rounded-md px-6 py-4 text-center text-muted-foreground/50 text-sm sm:text-base">
              Nenhum carro encontrado
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map(car => (
              <Link to={`/car/${car.id}`} key={car.id}>
                <section className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:border-primary hover:shadow-md">
                  <img
                    key={car.uid}
                    src={car.images[0].url}
                    alt={car.name}
                    className="h-40 w-full object-cover"
                  />

                  <div className="space-y-2 p-4">
                    <p className="font-semibold text-lg text-slate-800">
                      {car.name}
                    </p>

                    <div className="flex justify-between text-slate-500 text-sm">
                      <span>
                        Ano {car.year} •{' '}
                        {Number(car.km).toLocaleString('pt-BR')} km
                      </span>
                      <strong className="text-slate-900">
                        {Number(car.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </strong>
                    </div>

                    <Separator />

                    <div className="text-slate-600 text-sm">{car.city}</div>
                  </div>
                </section>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
