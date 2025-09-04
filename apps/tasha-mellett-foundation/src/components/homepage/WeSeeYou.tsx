import React from "react";

const WeSeeYouComponent = () => {
  const supportRoles = [
    "The Warriors",
    "The Spouse",
    "The Son daughter or Sibling",
    "The Caregiver",
    "The Guardian",
    "The Griever",
    "The Supporter",
    "The Unseen & Unheard",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b">
      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-[62px] font-semibold text-[#1F1F1F] mb-6">
            We See You
          </h1>
          <p className="text-lg md:text-[20px] font-medium text-[#1F1F1F]/70 max-w-5xl mx-auto leading-relaxed">
            Whether You&apos;re Battling Cancer, Carrying Someone Through It, Or
            Honouring Someone You Lost, We Know Your Battle. Our Guide Helps You
            Ask For And Offer The Right Support At Every Step Of Your Journey.
          </p>
        </div>

        {/* Support Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          {supportRoles.map((role, index) => (
            <div
              key={index}
              className="bg-[#D08A36] hover:bg-[#D08A36]/80 text-white p-6 rounded-lg shadow-lg h-[130px] transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex items-center justify-center"
            >
              <h3 className="text-lg font-semibold text-center">{role}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-[#EE9253] mt-16">
        <div className="container mx-auto md:px-20 py-10 lg:py-16">
          <h1 className="text-[21px] lg:text-[42px] font-medium text-white mb-6 text-center">
            No one should fight cancer alone.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default WeSeeYouComponent;
