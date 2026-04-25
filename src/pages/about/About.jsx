import React from "react";
import { BsArrowDownRight } from "react-icons/bs";

const About = () => {

  return (
    <div className="bg-white min-h-screen pt-20 pb-32 text-gray-900 font-sans">
      <div className="mx-auto w-[90%] md:w-[80%] max-w-6xl">
        
        {/* Top Section */}
        <div 
          className="flex flex-col md:flex-row justify-between items-start mt-5 mb-16 gap-8"
        >
          <div className="md:w-2/3">
            <h3 className="text-[#e25822] font-medium text-lg mb-4">We are Casted!</h3>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight">
              <span>We set out to build</span>
              <br />
              <span className="text-gray-500">a better voice for the campus</span>
            </h1>
          </div>
          <div className="md:w-1/3 flex items-center md:pt-16">
            <p className="text-gray-800 text-sm md:text-base font-medium leading-relaxed">
              Together—the writers, creators, and students of Casted!—we are reinventing campus journalism end-to-end.
            </p>
          </div>
        </div>


        {/* Our Story Section */}
        <section 
          className="flex flex-col md:flex-row gap-12 lg:gap-24"
        >
          <div className="md:w-1/3 flex items-start">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium flex items-center gap-4">
              Our Story <BsArrowDownRight className="text-2xl stroke-1" />
            </h2>
          </div>
          <div className="md:w-2/3 text-gray-800">
            <p className="font-medium text-lg md:text-xl leading-relaxed mb-8">
              You know, few times in one’s life, an idea comes about creating a spark that ignites a chain reaction — changing one’s life and the surrounding environment. The birth of CASTED! is one such case.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
              Around February 2024, a conversation between two friends about shows like Bridgerton and Gossip Girl sparked a realization: our campus needed a voice, an entity to stir excitement and intrigue, much like Lady Whistledown or Gossip Girl.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-12">
              That idea evolved into what we have today — the entity striving to fill that gap and meet the need for its kind on campus. We platform experiences, amplify voices, and capture stories that matter. We’re not just ink on paper; we’re the megaphone for every student with something to say.
            </p>

            <div className="flex items-center gap-4 mb-4 mt-8">
              <img src="/castedicon.png" alt="Founder" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-medium text-sm text-gray-900 m-0">The Founders</p>
                <p className="text-xs text-gray-500 m-0">Casted! Publication</p>
              </div>
            </div>
            <p className="font-medium text-lg text-gray-900 leading-relaxed max-w-2xl">
              "We’re not just another dusty publication. We’re the dynamic, student-run mini-magazine rewriting the rules. A riot of perspectives. A chorus of voices. A powerhouse of change."
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;