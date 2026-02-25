import React, { useEffect, useState } from 'react'
import { Leaf, ShieldCheck, Truck, Recycle, Handshake, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import Hero1 from "@/assets/Hero1.png";
import Hero2 from "@/assets/Hero2.png";
import Hero3 from "@/assets/Hero3.png";
import Hero4 from "@/assets/Hero4.png";
import Hero5 from "@/assets/Hero5.png";

const CAROUSEL_IMAGES = [
  Hero1,
  Hero2,
  Hero3,
  Hero4,
  Hero5,
]

const WHY_CHOOSE_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Trusted Green Standards',
    description: 'Every listed item is reviewed for eco-certification, sourcing transparency, and safer production practices.',
  },
  {
    icon: Truck,
    title: 'Fast Local Delivery',
    description: 'EcoMart prioritizes nearby suppliers to reduce travel emissions while getting fresh products to your door faster.',
  },
  {
    icon: Recycle,
    title: 'Low-Waste Packaging',
    description: 'We encourage reusable, recyclable, and biodegradable packaging choices across our marketplace partners.',
  },
  {
    icon: Handshake,
    title: 'Support Local Communities',
    description: 'Your purchases directly empower small local producers and sustainable businesses in your region.',
  },
]

export function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="min-h-screen bg-white">
      <main className="mb-0">
        {/* Hero */}
        <section className="px-4 md:px-6 lg:px-8 pt-4 pb-12 max-w-8xl mx-auto">
          <div className="relative h-[95vh] min-h-[500px] overflow-hidden rounded-xl md:rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-100 via-lime-200 to-lime-400" />
            <div className="relative h-full flex items-center justify-center px-4 text-center">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-white/10 rounded-l-full blur-3xl transform translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-lime-300/20 blur-3xl rounded-full pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-center">
                {/* Left Content */}
                <div className="w-full lg:w-[45%] text-center lg:text-left mb-16 lg:mb-0 relative z-10">
                  <span className="inline-block text-lime-800 font-bold tracking-widest text-xs md:text-sm mb-4 uppercase">
                    ECO FRIENDLY LOCAL PRODUCTS
                  </span>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-dark leading-[1.1] mb-6">
                    LOVE FOR NATURE
                    <br />
                    LOVE LOCAL
                  </h1>

                  <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
                    Discover the best of local, sustainable products that nourish you and the planet. From farm-fresh produce to eco-friendly essentials, we bring you a curated selection of goods that support local communities and promote a greener lifestyle. Join us in making conscious choices for a healthier you and a happier Earth.
                  </p>

                  {/* Explore More Button */}
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-[#0D0D0D] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wider hover:bg-gray-800 transition-colors uppercase shadow-lg"
                  >
                    Explore More
                  </button>
                </div>

                {/* Right Image Content */}
                <div className="w-full lg:w-[55%] relative flex justify-center lg:justify-end">
                  <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[460px] lg:h-[460px]">
                    {/* Main Bowl Image Container with Float Animation */}
                    <div className="w-full h-full relative z-10 animate-float -mt-12">
                      <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/20 relative">
                        {CAROUSEL_IMAGES.map((src, index) => (
                          <img
                            key={src}
                            src={src}
                            alt={`Healthy food ${index + 1}`}
                            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 animate-ken-burns' : 'opacity-0'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                      {CAROUSEL_IMAGES.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-lime-600 scale-125' : 'bg-lime-300 hover:bg-lime-400'}`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Decorative Elements */}
                    {/* Top Right Leaf */}
                    <div
                      className="absolute -top-4 -right-4 md:top-0 md:right-0 text-lime-700 animate-float"
                      style={{
                        animationDelay: '1s',
                      }}
                    >
                      <Leaf size={32} className="rotate-45" fill="currentColor" />
                    </div>

                    {/* Bottom Left Leaf */}
                    <div
                      className="absolute bottom-10 -left-4 md:bottom-20 md:left-0 text-lime-600 animate-float"
                      style={{
                        animationDelay: '2s',
                      }}
                    >
                      <Leaf size={24} className="-rotate-12" fill="currentColor" />
                    </div>

                    {/* Small circles/dots for organic feel */}
                    <div className="absolute top-1/4 -left-8 w-3 h-3 bg-red-500 rounded-full opacity-80 animate-pulse" />
                    <div className="absolute bottom-1/3 -right-6 w-2 h-2 bg-lime-600 rounded-full opacity-60" />
                    <div className="absolute top-10 right-10 w-4 h-4 bg-yellow-400 rounded-full opacity-80 blur-[1px]" />

                    {/* Spices/Small Bowl (Simulated with CSS) */}
                    <div
                      className="absolute top-0 left-0 md:top-10 md:left-10 w-16 h-16 md:w-24 md:h-24 bg-amber-900/80 rounded-full shadow-lg border-2 border-white/30 flex items-center justify-center animate-float"
                      style={{
                        animationDelay: '1.5s',
                      }}
                    >
                      <div className="w-3/4 h-3/4 bg-black/40 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🌿</span>
                      </div>
                    </div>

                    {/* Oil/Sauce Bottle (Simulated) */}
                    <div
                      className="absolute -bottom-6 left-10 md:bottom-0 md:left-20 w-12 h-12 md:w-20 md:h-20 bg-amber-600/40 backdrop-blur-sm rounded-full shadow-lg border border-white/40 flex items-center justify-center animate-float"
                      style={{
                        animationDelay: '0.5s',
                      }}
                    >
                      <div className="w-1/2 h-1/2 bg-amber-700 rounded-full opacity-50"></div>
                    </div>

                    {/* Cutlery (Simulated) */}
                    <div className="absolute -bottom-10 right-0 md:-bottom-8 md:right-10 flex flex-col space-y-1 rotate-[-15deg] opacity-90">
                      <div className="w-32 h-3 bg-gray-800 rounded-full shadow-md flex items-center px-2">
                        <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                        <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                      </div>
                      <div className="w-32 h-3 bg-gray-800 rounded-full shadow-md flex items-center px-2 ml-4">
                        <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                        <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Curve Separator at bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
              <svg
                className="relative block w-full h-[100px] md:h-[150px]"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M985.66,92.83C906.67,72,823.78,31,432.84,37.88a1231.53,1231.53,0,0,0-293.26,26.5C73.13,79.55,14.73,111,0,119.88V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                  className="fill-white opacity-30"
                ></path>
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,2.92V0H0V25.61c61.27,1.14,124.1,11.81,186.29,21.86C231.86,55.61,276.62,58.42,321.39,56.44Z"
                  className="fill-transparent"
                ></path>
              </svg>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="px-4 md:px-6 lg:px-8 pb-16 md:pb-20 max-w-8xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-lime-200/70 bg-gradient-to-br from-white via-lime-50 to-lime-100 p-6 md:p-8 lg:p-12 shadow-[0_25px_80px_rgba(132,204,22,0.14)]">
            <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-lime-300/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-lime-400/25 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-10">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-lime-300 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-lime-800 backdrop-blur-sm">
                  <Sparkles size={14} className="text-lime-700" />
                  Why Choose EcoMart?
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight text-gray-900">
                  A Smarter Way to Shop for a
                  <span className="block text-lime-700">Greener Tomorrow</span>
                </h2>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-gray-600">
                  EcoMart blends sustainability, quality, and convenience in one beautifully curated marketplace designed for conscious living.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                {WHY_CHOOSE_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <article
                      key={item.title}
                      className="group relative overflow-hidden rounded-2xl border border-lime-200/80 bg-white/85 p-5 md:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-lime-400 hover:shadow-[0_18px_40px_rgba(132,204,22,0.18)]"
                    >
                      <div className="absolute -top-10 -right-8 h-24 w-24 rounded-full bg-lime-300/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-70" />
                      <div className="relative z-10">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D0D0D] text-lime-300 shadow-lg ring-1 ring-black/10">
                          <Icon size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="relative rounded-2xl border border-lime-300/70 bg-[#0D0D0D] p-6 md:p-8 text-white shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lime-500/20 via-transparent to-lime-300/10" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">Join the movement</p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-serif font-bold">Choose products that care for people and planet.</h3>
                  </div>
                  <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center justify-center rounded-full bg-lime-300 px-7 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-lime-200"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}