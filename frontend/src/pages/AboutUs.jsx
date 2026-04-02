import { Link } from 'react-router-dom'
import { ArrowRight, Handshake, Leaf, Recycle, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import hero from '@/assets/AboutHero.png'
import mission from '@/assets/Hero2.png'
import service1 from '@/assets/Hero1.png'
import service2 from '@/assets/Hero5.png'
import vision from '@/assets/Hero3.png'
import journey from '@/assets/Hero4.png'
import know from '@/assets/KnowAbout.png'

const JourneyStats = ({ destinationsSearched = '34K', successfulTrips = 400, travelExperts = 50 }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
			<div className="rounded-2xl bg-white/10 p-4 md:p-5 backdrop-blur-sm border border-white/10">
				<p className="text-3xl md:text-4xl font-inter font-semibold text-white mb-1">{destinationsSearched}+</p>
				<p className="text-white/70 text-sm font-inter">Eco Products Searched</p>
			</div>
			<div className="rounded-2xl bg-white/10 p-4 md:p-5 backdrop-blur-sm border border-white/10">
				<p className="text-3xl md:text-4xl font-inter font-semibold text-white mb-1">{successfulTrips}+</p>
				<p className="text-white/70 text-sm font-inter">Successful Orders</p>
			</div>
			<div className="rounded-2xl bg-white/10 p-4 md:p-5 backdrop-blur-sm border border-white/10">
				<p className="text-3xl md:text-4xl font-inter font-semibold text-white mb-1">{travelExperts}+</p>
				<p className="text-white/70 text-sm font-inter">Local Vendors</p>
			</div>
		</div>
	)
}

const featureItems = [
	{
		icon: ShieldCheck,
		title: 'Trusted Green Standards',
		description: 'Every listed item is reviewed for sourcing transparency, practical quality, and better everyday use.',
	},
	{
		icon: Truck,
		title: 'Fast Local Delivery',
		description: 'Eco Mart prioritizes nearby suppliers to reduce travel emissions while getting products to customers faster.',
	},
	{
		icon: Recycle,
		title: 'Low-Waste Packaging',
		description: 'We encourage reusable, recyclable, and biodegradable packaging choices across our marketplace partners.',
	},
	{
		icon: Handshake,
		title: 'Support Local Communities',
		description: 'Every purchase helps local producers and sustainable small businesses grow with stronger demand.',
	},
]

const AboutUsPage = () => {
	return (
		<div className="min-h-screen flex flex-col overflow-x-hidden bg-white font-sans selection:bg-lime-500 selection:text-white">
			<section className="pt-4 pb-12 px-4 md:px-8 bg-white">
				<div
					className="container mx-auto rounded-[3rem] relative overflow-hidden h-[800px] md:h-[560px] 2xl:h-[500px] flex items-center justify-center text-center px-6"
					style={{
						backgroundImage: `url(${hero})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				>
					<div className="absolute inset-0 bg-[#0F1D14]/55"></div>
					<div className="relative z-10 max-w-4xl mx-auto text-white">
						<h1 className="text-3xl md:text-5xl lg:text-6xl font-inter font-bold mb-6">
							Where Smart Shopping Meets Sustainable Living
						</h1>
						<p className="text-md md:text-lg font-inter font-normal leading-relaxed text-white/80">
							Eco Mart is more than a marketplace. It is a practical way to discover products that are better for your home, your routine, and the planet. We bring together trusted local vendors, eco-conscious essentials, and reliable delivery in one simple experience so shopping feels easier and more intentional.
						</p>
					</div>
				</div>
			</section>

			<section className="relative w-full bg-white py-16 md:py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="relative w-full max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
							<img src={know} alt="Eco Mart sustainable products" className="w-full h-full rounded-none mt-10 2xl:mt-0" />
						</div>

						<div className="max-w-2xl mx-auto lg:mx-0 order-1 lg:order-2 lg:pl-12 -mt-12 2xl:mt-0">
							<div className="mb-6">
								<div className="flex items-center gap-2">
									<div className="w-14 h-[2px] bg-lime-600"></div>
									<span className="text-black text-sm font-inter font-bold tracking-widest">KNOW ABOUT US</span>
								</div>
							</div>
							<h1 className="text-4xl md:text-5xl font-inter font-bold text-black mb-8 leading-tight">
								A Better Way to Shop for Daily Life
							</h1>
							<p className="text-black text-lg font-inter font-bold mb-6">
								Eco Mart helps customers find better products without sacrificing convenience. We bring together eco-friendly essentials, trusted local brands, and thoughtfully sourced items in one simple marketplace.
							</p>
							<p className="text-black/60 font-inter font-regular text-lg">
								Our platform is built to make conscious shopping clear and accessible. Whether you are choosing reusable home goods, cleaner personal care items, or everyday products from responsible sellers, we keep the experience straightforward and dependable from start to finish.
							</p>

							<Link to="/products" className="inline-block mt-6">
								<button className="rounded-full bg-[#4F9D69] px-8 py-6 text-base font-inter font-medium text-white transition-all duration-300 hover:bg-[#3f8256]">
									Explore More
								</button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="relative w-full bg-white py-16 md:py-16">
				<div className="w-full px-0 md:px-0 mx-auto container">
					<div className="flex flex-col lg:flex-row gap-12 items-center">
						<div className="lg:w-2/3 -mt-24 2xl:-mt-32 relative z-10">
							<div className="relative overflow-hidden">
								<img src={vision} alt="Eco Mart vision" className="w-full h-auto object-cover" />
							</div>
						</div>

						<div className="lg:w-1/2 lg:pl-16 2xl:-mt-24 relative">
							<div className="absolute right-10 top-1/2 -translate-y-1/2 w-[600px] h-[400px] -translate-x-1/3 z-0">
								<div className="w-full h-full bg-gradient-to-r from-lime-300/40 via-lime-500/20 to-transparent rounded-full blur-3xl"></div>
							</div>
							<div className="mb-6">
								<div className="flex items-center">
									<span className="text-black text-sm font-inter font-bold tracking-widest">OUR VISION</span>
								</div>
							</div>
							<h2 className="text-3xl md:text-4xl font-inter font-bold text-black mb-6 leading-tight">
								To inspire meaningful eco-conscious shopping across the globe
							</h2>
							<p className="text-black/70 font-inter italic text-lg mb-0">
								To become a trusted symbol of sustainable, affordable, and practical everyday shopping.
							</p>
							<p className="text-black/70 font-inter italic text-lg mb-0">
								Where every purchase supports a cleaner future and a better local economy.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="relative w-full bg-white pt-0 pb-8 md:pt-0 md:pb-24 mt-0 2xl:-mt-28">
				<div className="w-full px-0 md:px-0 mx-auto container">
					<div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
						<div className="lg:w-2/3 relative z-10 2xl:ml-20 2xl:transform 2xl:scale-110">
							<div className="relative overflow-hidden">
								<img src={mission} alt="Eco Mart mission" className="w-full h-auto object-cover" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
							</div>
						</div>

						<div className="lg:w-1/2 lg:pr-16 2xl:mt-12 relative">
							<div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[400px] translate-x-1/3 z-0">
								<div className="w-full h-full bg-gradient-to-l from-lime-300/40 via-lime-500/20 to-transparent rounded-full blur-3xl"></div>
							</div>
							<div className="mb-6">
								<div className="flex items-center">
									<span className="text-black text-sm font-inter font-bold tracking-widest">OUR MISSION</span>
								</div>
							</div>
							<h2 className="text-3xl md:text-4xl font-inter font-bold text-black mb-6 leading-tight">
								We make greener choices easy, affordable, and practical
							</h2>
							<p className="text-black/70 font-inter italic text-lg mb-0">
								To connect shoppers with reliable eco-friendly products and local vendors they can trust.
							</p>
							<p className="text-black/70 font-inter italic text-lg mb-0">
								To make conscious buying feel natural in everyday life, not complicated or exclusive.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="relative bg-white pt-12">
				<div className="w-full max-w-[1440px] mx-auto px-6 2xl:px-10 -mt-4 md:-mt-16">
					<div className="relative">
						<div className="bg-[#0E1A12] rounded-3xl overflow-hidden 2xl:max-w-[70%] min-h-[400px] flex items-center">
							<div className="w-full p-8 md:p-12 2xl:pr-60 text-white">
								<div className="flex items-center gap-4 mb-6">
									<span className="text-sm font-inter font-bold tracking-widest">OUR JOURNEY</span>
								</div>
								<h2 className="text-3xl md:text-5xl font-inter font-bold mb-6">How Eco Mart Helps People Shop Smarter</h2>
								<p className="text-white/60 font-inter font-regular mb-10 text-md md:text-lg">
									Since launching, we have focused on making sustainable shopping easier by connecting customers to products, brands, and ideas that support a better way of living.
								</p>

								<JourneyStats destinationsSearched="34K" successfulTrips={400} travelExperts={50} />
							</div>
						</div>

						<div className="relative z-10 2xl:absolute right-0 top-8 2xl:top-40 w-full 2xl:w-[48%] 2xl:h-[600px]">
							<img src={journey} alt="Eco Mart journey" className="w-full h-full object-cover rounded-sm" />
						</div>
					</div>
				</div>
			</section>

			<section className="relative w-full bg-white pt-20 md:pt-12 pb-12">
				<div className="w-full max-w-[1440px] mx-auto px-6 2xl:px-10">
					<div className="flex flex-col lg:flex-row gap-8 items-start">
						<div className="w-full 2xl:w-7/12">
							<div className="relative">
								<img src={service1} alt="Eco Mart products" className="w-full h-auto object-cover rounded-lg" />
							</div>
							<div className="mt-6 w-full relative">
								<img src={service2} alt="Eco Mart shopping" className="w-full h-auto object-cover rounded-lg" />
								<ArrowRight className="absolute bottom-4 right-4 w-16 h-16 md:w-32 md:h-32 lg:w-24 lg:h-24 2xl:w-32 2xl:h-32 text-[#6DBE7B] bg-[#0E1A12] rounded-full p-2" />
							</div>
						</div>

						<div className="w-full lg:w-7/12 bg-transparent p-0 px-4 2xl:px-24 mt-8 lg:mt-[20rem] 2xl:mt-[30rem]">
							<div className="flex items-center gap-2 mb-4">
								<span className="text-lg font-inter font-medium tracking-widest text-black">Welcome to Eco Mart</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-inter font-medium text-black mb-6">
								Choose Eco Mart with Our Expert Services
							</h2>
							<p className="text-[#454545] font-inter font-regular text-md mb-8">
								Discover the benefits that set us apart and make your shopping experience smoother, cleaner, and more enjoyable.
							</p>

							<div className="space-y-6 mb-0">
								{featureItems.map((item) => {
									const Icon = item.icon
									return (
										<div key={item.title} className="flex items-start gap-4">
											<div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2F4734] flex items-center justify-center mt-1">
												<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
												</svg>
											</div>
											<div>
												<h3 className="font-inter font-medium text-lg text-[#141414] mb-1 flex items-center gap-2">
													<Icon className="w-4 h-4 text-lime-700" />
													{item.title}
												</h3>
												<p className="font-inter font-regular text-[#454545]">{item.description}</p>
											</div>
										</div>
									)
								})}

								<div className="pt-6">
									<button className="bg-[#4F9D69] text-white font-roboto font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition-colors">
										Start Shopping Sustainably
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

		</div>
	)
}

export default AboutUsPage
