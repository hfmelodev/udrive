import { Button } from '@/components/ui/button'
import { firebase } from '@/lib/firebase'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaWhatsapp } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router'
// @ts-ignore
import 'swiper/css'
// @ts-ignore
import 'swiper/css/navigation'
// @ts-ignore
import 'swiper/css/pagination'
// @ts-ignore
import 'swiper/css/scrollbar'
import { Swiper, SwiperSlide } from 'swiper/react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { register } from 'swiper/element/bundle'
register()

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

      {/* Componente Swiper que exibe as imagens do carro com paginação */}
      <Swiper
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2 },
        }}
        spaceBetween={10}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        className="w-full max-w-7xl mx-auto rounded-xl overflow-hidden mb-6 relative"
      >
        {car?.images.map(image => (
          <SwiperSlide
            key={image.name}
            className="transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={image.url}
              alt={image.name}
              loading="lazy"
              className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-lg shadow-md"
            />
          </SwiperSlide>
        ))}

        {/* Botões personalizados com ícones */}
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="custom-prev absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10"
        >
          <ChevronLeft className="text-primary size-5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="custom-next absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10"
        >
          <ChevronRight className="text-primary size-5" />
        </Button>
      </Swiper>

      {car && (
        <main className="w-full max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
          <header className="flex flex-row items-center justify-between gap-2 mb-6">
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

          <Button className="w-full" asChild>
            <Link
              to={`https://wa.me/${car.whatsapp}?text=Olá, gostaria de saber mais sobre o carro ${car.name}`}
              target="_blank"
            >
              <FaWhatsapp />
              Conversar com Tasso Cornin e Israel Safadin
            </Link>
          </Button>

          <footer className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} UDrive. Todos os direitos reservados.
          </footer>
        </main>
      )}
    </>
  )
}
