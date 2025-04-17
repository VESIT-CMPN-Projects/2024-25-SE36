import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section with gradient overlay */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
        <Image
          src="/Screenshot 2025-03-01 144314.png"
          alt="Team Background"
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">Our Team</h1>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full transition-all duration-300 group hover:shadow-lg hover:scale-110"
            aria-label="Play video"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 group-hover:scale-110 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Statistics Section with animation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { number: '1250', label: 'Properties sold' },
          { number: '320', label: 'Apartments sold' },
          { number: '125', label: 'Houses sold' },
          { number: '120', label: 'Villas sold' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</h2>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Expert Advice Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/Screenshot 2025-03-01 144314.png"
            alt="Expert Advice"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Expert advice for all your real estate needs</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            For all your real estate needs, trust expert advice to navigate buying, selling, or investing with confidence. Professional guidance ensures you make informed decisions, maximize value, and avoid costly mistakes.
          </p>
        </div>
      </div>

      {/* Blog News Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-center mb-10">Blog News</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { image: '/Screenshot 2025-03-01 144314.png', date: '23.12.2023', title: 'Home sales start to rise' },
            { image: '/Screenshot 2025-03-01 144314.png', date: '23.12.2023', title: 'Real estate and design trends' },
            { image: '/Screenshot 2025-03-01 144314.png', date: '23.12.2023', title: 'Mortgage rates dip below 7%' },
          ].map((blog, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
                <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">{blog.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Blog Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-12 mb-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">My Blog</h2>
        <Link
          href="https://realtygrabchronicles.blogspot.com/p/realtygrab-creating-user-friendly.html"
          target="_blank"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
        >
          Visit My Blog
        </Link>
      </div>

      {/* About Content */}
      <div className="prose prose-lg max-w-none">
        <div className="mb-12">
          <p className="text-gray-600 mb-6">
            Welcome to Ark Property Solutions, your trusted partner in finding the perfect property. With years of experience in the real estate industry, we pride ourselves on delivering exceptional service and helping our clients achieve their property goals.
          </p>
          <p className="text-gray-600 mb-6">
            Our team of experienced professionals is dedicated to providing personalized solutions for all your real estate needs. Whether you're buying, selling, or renting, we're here to guide you through every step of the process.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <ul className="grid grid-cols-2 gap-4">
            {[
              'Integrity in every transaction',
              'Professional excellence',
              'Client-focused approach',
              'Transparent communication'
            ].map((value, index) => (
              <li key={index} className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}