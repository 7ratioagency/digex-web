import { setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Problem } from '@/components/sections/Problem'
import { Process } from '@/components/sections/Process'
import { SelectedWork } from '@/components/sections/SelectedWork'
import { Proof } from '@/components/sections/Proof'
import { ContactCTA } from '@/components/sections/ContactCTA'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  /*
   * Services before Problem — the offer first, the reason for it second.
   *
   * On the background rhythm this costs nothing, though it does move where
   * the page's one repeated tone sits. `.section-alt` runs Services, Work and
   * the contact CTA; with seven sections and the CTA fixed on alt, a strict
   * alternation is arithmetically impossible unless the hero takes the alt
   * tone, so exactly one pair of base bands has to touch somewhere. Before
   * the swap that pair was Hero → Problem; now it is Problem → Process. Both
   * of those sections carry heavy treatments of their own (the cycling panel,
   * the pinned stack), so the join reads as a change of subject rather than a
   * missed beat. The alternatives all cost more: flipping Services to base
   * takes away the slab its "under one roof" claim arrives on, and flipping
   * Work to base takes away the navy beat that section was built around.
   */
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Services />
      <Problem />
      <Process />
      <SelectedWork />
      <Proof />
      <ContactCTA />
    </main>
  )
}
