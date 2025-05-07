import { Panel } from '@/components/app/panel'
import { Helmet } from 'react-helmet-async'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />

      <div className="w-full flex flex-col gap-6">
        <Panel />

        <p>Dashboard</p>
      </div>
    </>
  )
}
