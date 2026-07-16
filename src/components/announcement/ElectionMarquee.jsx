import React from 'react';

const winners = [
  { title: "PRESIDENT", name: "BATURE MICHAEL MABUR", color: "bg-red-50 text-red-700 border-red-200" },
  { title: "VICE PRESIDENT", name: "OKEIUKWU ANTHONY-MARIO", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { title: "GENERAL SECRETARY", name: "ADELEYE ADEDAYOMI", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { title: "ASSISTANT GEN. SECRETARY", name: "OLORUNTOBA AYOMIDE", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { title: "TREASURER", name: "OPESANWO AKINKUNMI", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { title: "FINANCIAL SECRETARY", name: "OKORO AMARACHI", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { title: "SPORTS SECRETARY", name: "ANIMASHAUN OLUWANIFEMI", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { title: "PUBLIC RELATIONS OFFICER", name: "ADENIYI ADEMIDE", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { title: "SOCIAL DIRECTOR", name: "BRIGHT SOKOGA", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { title: "WELFARE SECRETARY", name: "ADENIYI AYOMIDE", color: "bg-pink-50 text-pink-700 border-pink-200" },
];

const ElectionMarquee = () => {

  const marqueeText = winners
    .map((w) => `${w.title}: ${w.name}`)
    .join("  •  ");

  return (
    <>
      {/* Top Marquee Announcement Bar */}
      <div
        className="w-full h-10 bg-linear-to-r from-orange-600 via-amber-500 to-orange-600 border-b border-orange-700/20 fixed top-0 left-0 z-50 flex items-center select-none shadow-md"
      >
        {/* Pulsing Announcement Badge */}
        <div className="bg-white text-orange-600 text-[10px] md:text-xs font-bold px-3 py-1 ml-4 rounded-full shadow-sm animate-pulse z-10 whitespace-nowrap">
          BUSA ELECTION '26 WINNERS
        </div>

        {/* Clicking the marquee opens the modal */}
        <div
          className="flex-1 overflow-hidden h-full flex items-center cursor-pointer relative group"
          title="Click to view full results"
        >
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-sans font-medium text-xs md:text-sm text-white">
            <div className="flex items-center gap-12 shrink-0">
              <span>{marqueeText}</span>
            </div>
            <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
              <span>{marqueeText}</span>
            </div>
          </div>

          {/* Subtle Hover Glow Line */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>   
      </div>
    </>
  );
};

export default ElectionMarquee;
