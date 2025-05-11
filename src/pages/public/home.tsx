import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { firebase } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router'

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

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([])

  useEffect(() => {
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

    getCars()
  }, [])

  return (
    <>
      <Helmet title="Home" />

      <section className="w-full max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Digite o nome do carro que você procura..."
              className="pl-10 w-full text-base placeholder:text-sm placeholder:sm:text-base"
            />
          </div>
          <Button className="shrink-0 h-10 px-6 gap-2">
            <Search className="size-4" />
            <span className="text-sm font-medium">Buscar</span>
          </Button>
        </div>

        <h1 className="text-lg md:text-xl font-medium text-center">
          Encontre{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
            carros novos
          </span>{' '}
          e{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
            seminovos
          </span>{' '}
          em todo o Brasil
        </h1>
      </section>

      <main className="w-full max-w-7xl mx-auto px-4 pb-10 min-h-screen">
        {cars.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-muted-foreground/50 text-sm sm:text-base rounded-md py-4 px-6 text-center">
              Nenhum carro encontrado
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <Link to={`/car/${car.id}`} key={car.id}>
                <section className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition overflow-hidden border">
                  <img
                    key={car.uid}
                    src={car.images[0].url}
                    alt={car.name}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-4 space-y-2">
                    <p className="text-lg font-semibold text-slate-800">
                      {car.name}
                    </p>

                    <div className="flex justify-between text-sm text-slate-500">
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

                    <div className="text-sm text-slate-600">{car.city}</div>
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
