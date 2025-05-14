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
        className="relative mx-auto mb-6 w-full max-w-7xl overflow-hidden rounded-xl"
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
              className="h-[250px] w-full rounded-lg object-cover shadow-md sm:h-[300px] md:h-[400px]"
            />
          </SwiperSlide>
        ))}

        {/* Botões personalizados com ícones */}
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="custom-prev -translate-y-1/2 absolute top-1/2 left-2 z-10 sm:left-4"
        >
          <ChevronLeft className="size-5 text-primary" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="custom-next -translate-y-1/2 absolute top-1/2 right-2 z-10 sm:right-4"
        >
          <ChevronRight className="size-5 text-primary" />
        </Button>
      </Swiper>

      {car && (
        <main className="mx-auto w-full max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
          <header className="mb-6 flex flex-row items-center justify-between gap-2">
            <h1 className="font-semibold text-2xl text-slate-800 sm:text-3xl">
              {car.name}
            </h1>
            <p className="font-bold text-2xl text-green-600 sm:text-3xl">
              {Number(car.price).toLocaleString('pt-BR', {
                currency: 'BRL',
                style: 'currency',
              })}
            </p>
          </header>

          <section className="mb-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <span className="text-slate-500 text-sm">Cidade</span>
              <p className="font-medium text-lg text-slate-800">{car.city}</p>
            </div>
            <div>
              <span className="text-slate-500 text-sm">Ano</span>
              <p className="font-medium text-lg text-slate-800">{car.year}</p>
            </div>
            <div>
              <span className="text-slate-500 text-sm">Kilometragem</span>
              <p className="font-medium text-lg text-slate-800">{car.km}</p>
            </div>
          </section>

          <section className="mb-4">
            <span className="text-slate-500 text-sm">Descrição</span>
            <p className="mt-1 font-medium text-base text-slate-700 sm:text-lg">
              {car.description}
            </p>
          </section>

          <section className="mb-6">
            <span className="text-slate-500 text-sm">Telefone / WhatsApp</span>
            <p className="mt-1 font-medium text-base text-slate-700 sm:text-lg">
              {formatPhoneNumber(car.whatsapp)}
            </p>
          </section>

          <Button className="w-full" asChild>
            <Link
              to={`https://wa.me/${car.whatsapp}?text=Olá, gostaria de saber mais sobre o carro ${car.name}`}
              target="_blank"
            >
              <FaWhatsapp />
              Conversar com o vendedor
            </Link>
          </Button>

          <footer className="mt-8 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} UDrive. Todos os direitos reservados.
          </footer>
        </main>
      )}
    </>
  )
}
