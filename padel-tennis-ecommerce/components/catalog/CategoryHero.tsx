interface CategoryHeroProps {
  eyebrow: string
  title: string
  description: string
}

export default function CategoryHero({
  eyebrow,
  title,
  description,
}: CategoryHeroProps) {
  return (
    <section className="bg-brand-blue-dark py-16 text-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 inline-block rounded-full border border-brand-cream/25 bg-brand-cream/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-cream">
          {eyebrow}
        </div>
        <h1 className="text-balance text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-brand-cream/85 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  )
}
