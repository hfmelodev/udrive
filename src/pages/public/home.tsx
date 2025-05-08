import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export function Home() {
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

      <main className="w-full max-w-7xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <section
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition overflow-hidden border"
            >
              <img
                src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202504/20250428/jeep-compass-2.0-td350-turbo-diesel-longitude-at9-wmimagem1515357461.jpg?s=fill&w=1920&h=1440&q=75"
                alt="Carro"
                className="w-full h-48 object-cover"
              />

              <div className="p-4 space-y-2">
                <p className="text-lg font-semibold text-slate-800">
                  Jeep Compass
                </p>

                <div className="flex justify-between text-sm text-slate-500">
                  <span>Ano 2022/2023 • 23.000 km</span>
                  <strong className="text-slate-900">R$ 200.000</strong>
                </div>

                <Separator />

                <div className="text-sm text-slate-600">São Paulo - SP</div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
