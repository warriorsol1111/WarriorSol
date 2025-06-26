import React from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";
import Hero from "./Hero";
import RebellionSection from "./RebellionSection";
import ChooseYourArmor from "./ChooseYourArmor";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <RebellionSection />
      <ChooseYourArmor />
      <Footer />
    </div>
  );
};

export default HomePage;
   