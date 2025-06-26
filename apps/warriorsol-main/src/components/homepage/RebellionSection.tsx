import React from 'react';
import Image from 'next/image';
import rebellionImage from '@/assets/rebellion-image.png'; // update the path if needed

const RebellionSection: React.FC = () => {
  return (
    <section className="relative w-full h-[596px] text-[#1F1F1F]">
      {/* Background Image */}
      <Image
        src={rebellionImage}
        alt="Rebellion"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Bottom Gradient Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(31, 31, 31, 0) 0%, rgba(31, 31, 31, 0.6) 100%)',
        }}
      />

      {/* Top White Block with Text and Circle */}
      <div className="absolute top-0 left-0 right-0 bg-white px-16 py-12 z-20 flex justify-between items-start">
        {/* Left-aligned Text */}
        <h2 className="text-[62px] leading-[62px] font-['Cormorant_SC'] font-normal text-left capitalize max-w-[900px]">
          Not Just Apparel.<br />
          A Rebellion Wrapped In Thread.
        </h2>
      </div>
    </section>
  );
};

export default RebellionSection;
