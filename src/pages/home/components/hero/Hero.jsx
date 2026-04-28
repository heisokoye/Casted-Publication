// Import necessary libraries and components
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async'; // Import Helmet for managing the document head
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs'; // Icons for slider navigation
import { motion, AnimatePresence } from 'framer-motion'; // For animations

// Hero component definition
const Hero = () => {
    // State to track the current slide index
    const [currentSlide, setCurrentSlide] = useState(0);
    // State to track the direction of the slide transition (for animation)
    const [direction, setDirection] = useState(0);
    // Refs for DOM elements
    const heroRef = useRef(null);
    const sliderRef = useRef(null);

    const preview = [
        { pictures: "pitch.png", loading: "lazy" },
    ];

    // Function to go to the previous slide
    const prevSlide = () => {
        setDirection(-1); // Set direction to left
        const isFirstSlide = currentSlide === 0;
        const newIndex = isFirstSlide ? preview.length - 1 : currentSlide - 1;
        setCurrentSlide(newIndex);
    };

    // Function to go to the next slide
    const nextSlide = useCallback(() => {
        setDirection(1);
        const isLastSlide = currentSlide === preview.length - 1;
        const newIndex = isLastSlide ? 0 : currentSlide + 1;
        setCurrentSlide(newIndex);
    }, [currentSlide, preview.length]);

    // Animation variants for the slide transitions
    const slideVariants = {
        hidden: (direction) => ({
            x: direction > 0 ? '100%' : '-100%', // Enters from right or left
            opacity: 0,
            translateZ: 0,
        }),
        visible: {
            x: '0%', // Moves to the center
            opacity: 1,
            translateZ: 0,
            transition: { duration: 0.5, ease: 'easeInOut' },
        },
        exit: (direction) => ({
            x: direction < 0 ? '100%' : '-100%', // Exits to right or left
            opacity: 0,
            translateZ: 0,
            transition: { duration: 0.5, ease: 'easeInOut' },
        }),
    };


    // Animation variants for the arrow icon on the subscribe button
    const arrowVariants = {
        rest: { x: 0 },
        hover: { x: 8, transition: { type: 'spring', stiffness: 300 } } // Bounces on hover
    };

    // useEffect hook for automatic sliding
    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);

    return (
        // Main container for the hero section
        <div className="w-full border-b  border-gray-300">
            {/* Preload the LCP image for faster loading on large screens */}
            <Helmet>
                <link rel="preload" decoding="async" as="image" href={preview[0].pictures} />
            </Helmet>
            <section className=' bg-cover w-full h-[50vh] md:h-[60vh] lg:h-[80vh]' style={{ minHeight: '400px' }}>
                <div ref={heroRef} className='flex lg:justify-between  items-center justify-center h-full relative z-10 mx-auto w-[80%]'>
                    {/* Left side: Hero Text and Subscribe Button */}
                    <div>
                        {/* Heading - no initial animation for better FCP/LCP */}
                        <h1 className='hero-text text-3xl md:text-4xl md:w-full lg:text-5xl lg:w-140 text-orange-400 font-medium'>
                            Discover the latest social events, gossip and more.
                        </h1>
                        {/* Subscribe button - no initial animation for better FCP */}
                        <motion.button
                            className='hero-text mt-4 bg-white border text-amber-700 px-4 py-2 cursor-pointer rounded-lg shadow-lg flex items-center gap-2'
                            whileHover="hover" // Trigger 'hover' variant on mouse over
                            variants={{
                                hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 15 } }
                            }}
                        >
                            <a href="https://whatsapp.com/channel/0029Vb56767I1rckrGeYrs1E" target='_blank' rel="noopener noreferrer" className='font-medium'>Subscribe</a>
                            {/* Animated arrow icon */}
                            <motion.div variants={arrowVariants}><BsArrowRight /></motion.div>
                        </motion.button>
                    </div>

                    <div className='hidden feature-above-1500 items-center justify-center'>
                        {/* Right side: Image and blog preview slider (hidden on small screens) */}
                        <div ref={sliderRef} className="relative xl:w-200 h-120 rounded-lg shadow-2xl overflow-hidden">
                            {/* AnimatePresence handles the mounting and unmounting of slides */}
                            <AnimatePresence initial={false} custom={direction}>
                                {/* The motion.div represents a single slide */}
                                <motion.div
                                    key={currentSlide} // Key is crucial for AnimatePresence to track items
                                    custom={direction} // Pass direction to variants
                                    variants={slideVariants}
                                    initial={currentSlide === 0 && direction === 0 ? "visible" : "hidden"}
                                    animate="visible"
                                    exit="exit"
                                    className="absolute w-full h-full"
                                >
                                    {/* Slide image */}
                                    <img
                                        src={preview[currentSlide].pictures}
                                        alt={preview[currentSlide].titles}
                                        className="w-full object-cover"
                                        loading={currentSlide === 0 ? 'eager' : 'lazy'}
                                        fetchpriority={currentSlide === 0 ? 'high' : 'low'}
                                        decoding="async"
                                        width={1280}
                                        height={720}
                                    />
                                </motion.div>
                            </AnimatePresence>
                            {/* Slider navigation arrows */}
                            {/* Left Arrow */}
                            <button onClick={prevSlide} aria-label="Previous slide" className='absolute top-[50%] -translate-y-1/2 left-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-20'>
                                <BsArrowLeft size={20} />
                            </button>
                            {/* Right Arrow */}
                            <button onClick={nextSlide} aria-label="Next slide" className='absolute top-[50%] -translate-y-1/2 right-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-20'>
                                <BsArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Export the component
export default Hero;