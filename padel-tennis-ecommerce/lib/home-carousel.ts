// Types shared by both server and client code. Server-only queries live in
// `./home-carousel.server.ts`.

export type CarouselSlide = {
  id: number
  image_url: string
  alt: string
  display_order: number
  created_at: string
}
