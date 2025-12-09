import React from 'react'

const Hero = () => {
    return (
        <section className='pt-32 pb-20 bg-white'>
            <div className='max-w-7xl mx-auto grid md:grid-cols-2 items-center px-6 gap-10'>
                <img
                    src="/hero-illustration.png"
                    alt="hero"
                    className="w-full animate-fadeIn"
                />

                <div className="space-y-6">
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Transforming <span className="text-blue-600">Education</span>,
                        <br />
                        One <span className="text-blue-600">Innovation</span> at a Time!
                    </h1>

                    <p className="text-gray-600 text-lg">
                        Dedicated resources, full access, and intelligent learning tools designed
                        to give you the edge you deserve.
                    </p>

                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition">
                        Get Started
                    </button>

                    <div className="bg-blue-50 px-6 py-3 rounded-full inline-flex items-center gap-2 text-blue-700 font-medium shadow-md">
                        🎉 16,578+ Students Learning Right Now!
                    </div>
                </div>


            </div>

        </section>
    )
}

export default Hero