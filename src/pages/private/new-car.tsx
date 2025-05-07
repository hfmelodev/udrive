import { Panel } from '@/components/app/panel'
import { Helmet } from 'react-helmet-async'

export function NewCar() {
  return (
    <>
      <Helmet title="Novo Carro" />

      <div className="w-full flex flex-col gap-6">
        <Panel />

        <p>New Carro</p>
      </div>
    </>
  )
}
