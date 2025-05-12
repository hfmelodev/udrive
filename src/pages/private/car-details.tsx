import { Button } from '@/components/ui/button'
import { firebase } from '@/lib/firebase'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router'

interface CarImageProps {
  uid: string
  name: string
  url: string
}

interface CarProps {
  id: string
  name: string
  model: string
  city: string
  year: string
  km: string
  description: string
  createdAt: string
  price: string
  uid: string
  whatsapp: string
  images: CarImageProps[]
}

type ParamsProps = {
  id: string
}

export function CarDetails() {
  const { id } = useParams<ParamsProps>()
  const navigate = useNavigate()
  const [car, setCar] = useState<CarProps>()

  useEffect(() => {
    async function getCar() {
      if (!id) {
        return
      }

      const docRef = doc(firebase, 'cars', id)
      await getDoc(docRef).then(snapshot => {
        if (snapshot.exists()) {
          setCar({
            id: snapshot.id,
            ...snapshot.data(),
          } as CarProps)
        } else {
          navigate('/', { replace: true })
        }
      })
    }

    getCar()
  }, [id, navigate])

  return (
    <>
      <Helmet title="Detalhes do carro" />

      {car && (
        <main className="w-full max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
          <header className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
              {car.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              R$ {car.price}
            </p>
          </header>

          <section className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <span className="text-sm text-slate-500">Cidade</span>
              <p className="text-lg font-medium text-slate-800">{car.city}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Ano</span>
              <p className="text-lg font-medium text-slate-800">{car.year}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Kilometragem</span>
              <p className="text-lg font-medium text-slate-800">{car.km}</p>
            </div>
          </section>

          <section className="mb-4">
            <span className="text-sm text-slate-500">Descrição</span>
            <p className="text-base sm:text-lg font-medium text-slate-700 mt-1">
              {car.description}
            </p>
          </section>

          <section className="mb-6">
            <span className="text-sm text-slate-500">Telefone / WhatsApp</span>
            <p className="text-base sm:text-lg font-medium text-slate-700 mt-1">
              {formatPhoneNumber(car.whatsapp)}
            </p>
          </section>

          <Button className="w-full">
            <FaWhatsapp />
            Conversar com o Anunciante
          </Button>

          <footer className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} UDrive. Todos os direitos reservados.
          </footer>
        </main>
      )}
    </>
  )
}
