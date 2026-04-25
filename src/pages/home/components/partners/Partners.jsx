import React from 'react';
import './Partners.css';

const Partners = () => {
  const partners = ["natada.png", "brix.png", "deggia.png"];
  
  // Duplicate logos dynamically for infinite effect
  const logos = [...partners, ...partners, ...partners];

  return (
    <div className='overflow-hidden bg-black py-6'>
      <div className='mx-auto w-[80%]'>
        <h2 className='text-white font-medium flex justify-center mb-4 text-base'>OUR PARTNERS</h2>
        <div className='animate-scrollLeft lg:gap-50'>
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt='partner logo'
              className='h-24 w-48 object-cover  grayscale hover:grayscale-0 transition duration-300'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;
