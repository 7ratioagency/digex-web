import { setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { Services } from '@/components/sections/Services'
import { Process } from '@/components/sections/Process'
import { SelectedWork } from '@/components/sections/SelectedWork'
import { Proof } from '@/components/sections/Proof'
import { Parfio } from '@/components/sections/Parfio'
import { ContactCTA } from '@/components/sections/ContactCTA'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Problem />
      <Services />
      <Process />
      <SelectedWork />
      <Proof />
      <Parfio />
      <ContactCTA />
    </main>
  )
}
