import { Panel } from '@/components/app/panel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { firebase, storage } from '@/lib/firebase'
import { useAuthStore } from '@/store/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'

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

export function Dashboard() {
  const { user } = useAuthStore()
  const [cars, setCars] = useState<CarsProps[]>([])

  useEffect(() => {
    async function getCars() {
      if (!user?.uid) {
        return
      }

      const carsRef = collection(firebase, 'cars')
      // Busca os carros do usuário logado e ordena por data de criação em ordem decrescente (mais recentes primeiro)
      const queryRef = query(
        carsRef,
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      )

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
  }, [user?.uid])

  async function handleDeleteCar(car: CarsProps) {
    try {
      const docRef = doc(firebase, 'cars', car.id)
      await deleteDoc(docRef)

      // Remove as imagens dos carros no Storage
      // biome-ignore lint/complexity/noForEach: <explanation>
      car.images.forEach(async image => {
        const imagePath = `udrive-cars-images/${image.uid}/${image.name}`
        const imageRef = ref(storage, imagePath)

        try {
          await deleteObject(imageRef)
        } catch (err) {
          console.log(err)
          toast.error('Não foi possível excluir a imagem', {
            description: 'Tente novamente mais tarde',
          })
        }
      })

      setCars(cars.filter(carArray => carArray.id !== car.id))

      toast.success('Carro excluído com sucesso')
    } catch (err) {
      console.log(err)
      toast.error('Não foi possível excluir o carro', {
        description: 'Tente novamente mais tarde',
      })
    }
  }

  return (
    <>
      <Helmet title="Dashboard" />

      <div className="w-full max-w-7xl mx-auto px-4 pb-10 min-h-screen">
        <Panel />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
          {cars.map(car => (
            <section
              key={car.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition overflow-hidden border relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-white/70 hover:bg-rose-100 text-rose-600 hover:text-rose-700 shadow-sm backdrop-blur transition-all"
                aria-label="Remover imagem"
                title="Remover imagem"
                onClick={() => handleDeleteCar(car)}
              >
                <Trash className="size-4" />
              </Button>
              <img
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
                    Ano {car.year} • {car.km} km
                  </span>
                  <strong className="text-slate-900">{car.price}</strong>
                </div>

                <Separator />

                <div className="text-sm text-slate-600">{car.city}</div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
