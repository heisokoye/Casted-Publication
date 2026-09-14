import React from "react";
import { BsArrowDownRight } from "react-icons/bs";

const About = () => {
  return (
    <article className="bg-white min-h-screen pt-20 pb-32 text-gray-900 font-sans">
      <div className="mx-auto w-[90%] md:w-[80%] max-w-6xl">
        
        {/* HERO / TOP HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start pt-6 mb-16 md:mb-24 gap-8">
          <div className="md:w-2/3">
            <span className="inline-block text-[#e25822] font-medium text-base md:text-lg mb-3">
              We are Casted!
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-gray-900">
              <span>We set out to build</span>
              <br />
              <span className="text-gray-500">a better voice for the campus</span>
            </h1>
          </div>
          <div className="md:w-1/3 flex items-center md:pt-14">
            <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed">
              Together—the writers, creators, and students of Casted!—we are reinventing campus journalism end-to-end.
            </p>
          </div>
        </header>

        {/* OUR STORY SECTION */}
        <section 
          aria-labelledby="our-story-title"
          className="flex flex-col md:flex-row gap-12 lg:gap-24 border-t border-gray-100 pt-16"
        >
          {/* Section Heading */}
          <div className="md:w-1/3 flex items-start">
            <h2 
              id="our-story-title"
              className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 flex items-center gap-4"
            >
              Our Story <BsArrowDownRight className="text-2xl stroke-1 shrink-0" />
            </h2>
          </div>

          {/* Section Body & Founder Quote */}
          <div className="md:w-2/3 text-gray-800 space-y-6">
            <p className="font-medium text-lg md:text-xl leading-relaxed text-gray-900 mb-6">
              You know, few times in one’s life, an idea comes about creating a spark that ignites a chain reaction — changing one’s life and the surrounding environment. The birth of CASTED! is one such case.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Around February 2024, a conversation between two friends about shows like Bridgerton and Gossip Girl sparked a realization: our campus needed a voice, an entity to stir excitement and intrigue, much like Lady Whistledown or Gossip Girl.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              That idea evolved into what we have today — the entity striving to fill that gap and meet the need for its kind on campus. We platform experiences, amplify voices, and capture stories that matter. We’re not just ink on paper; we’re the megaphone for every student with something to say.
            </p>

            {/* Quote & Citation */}
            <blockquote className="mt-12 pt-8 border-t border-gray-200">
              <p className="font-medium text-lg md:text-xl text-gray-900 leading-relaxed max-w-2xl mb-6">
                "We’re not just another dusty publication. We’re the dynamic, student-run mini-magazine rewriting the rules. A riot of perspectives. A chorus of voices. A powerhouse of change."
              </p>
              <footer className="flex items-center gap-4">
                <img 
                  src="/castedicon.png" 
                  alt="The Founders" 
                  className="w-12 h-12 rounded-full object-cover border border-gray-200" 
                />
                <div>
                  <cite className="font-semibold text-sm text-gray-900 not-italic block">The Founders</cite>
                  <span className="text-xs text-gray-500 block">Casted! Publication</span>
                </div>
              </footer>
            </blockquote>
          </div>
        </section>

      </div>
    </article>
  );
};

export default About;