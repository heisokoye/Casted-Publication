// Import React, lazy, and Suspense for lazy loading components
import React, { lazy, Suspense } from "react"
import { Helmet } from "react-helmet-async"
// Import Hero component
import Hero from "./components/hero/Hero" // default export - critical, load immediately
// Import motion from framer-motion for animations
import { motion } from "framer-motion"
import BlogPreview from "./components/preview/BlogPreview.jsx"
// Lazy load non-critical components to reduce initial TBT
const Cta = lazy(() => import("./components/cta/Cta.jsx"))
const Team = lazy(() => import("./components/team/Team.jsx"))
const Partners = lazy(() => import("./components/partners/Partners.jsx"))
// const YouTubeSection = lazy(() => import("./components/youtube/Youtube.jsx"))
const EventCalendar = lazy(() => import("./components/eventCalendar/EventCalendar.jsx"))

// Define the Home component
const Home = () => {
    return (
        < >
            {/* SEO Meta Tags */}
            <Helmet>
                <title>Casted! Publications - Student Media, News, and Stories</title>
                <meta name="description" content="The official source for student stories, campus news, and social events from Casted! Publications. Discover the latest articles and amplify your voice." />
                <meta name="keywords" content="students media publications, Bells University Media, Casted! Publications, castedpub" />
                <meta name="author" content="Bells University Media, Casted! Publications" />
                <link rel="preload" href="/bg.webp" as="image" />
            </Helmet>
            <div className="bg-[url('/bg.webp')] bg-no-repeat bg-cover lg:bg-[url('/v4.webp')] bg-fixed" rel="preload" as="image"> 
                {/* Hero section - no initial animation to improve FCP */}
                <div>
                    <Hero className="flex justify-center items-center"/>
                </div>

                {/* YouTube section - lazy loaded to reduce TBT
                <Suspense fallback={<div className="py-20" />}>
                        <YouTubeSection />
                </Suspense> */}

                 {/* BlogPreview section - lazy loaded to reduce TBT */}
                <Suspense fallback={<div className="py-20" />}>
                        <BlogPreview/>
                </Suspense>
                
                {/* Event Calendar section - Mobile Only - lazy loaded */}
                <Suspense fallback={<div className="py-14" />}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <EventCalendar/>
                    </motion.div>
                </Suspense>

                {/* Cta section - lazy loaded */}
                <Suspense fallback={<div className="py-16" />}>
                    <Cta className=""/>
                </Suspense>

                {/* Team section - lazy loaded */}
                <Suspense fallback={<div className="py-14" />}>
                    <Team/>
                </Suspense>

                


                {/* Partners section - lazy loaded */}
                <Suspense fallback={null}>
                    <Partners/>
                </Suspense>
            </div>
        </>
    )
}

// Export the Home component as the default export
export default Home