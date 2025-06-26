import React from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";
import Hero from "./Hero";
import RebellionSection from "./RebellionSection";
import ChooseYourArmor from "./ChooseYourArmor";
import WhyIWearMine from "./WhyIWearMine";
import PurchasePower from "./PurchasePower";
import CircleThatNeverCloses from "./CircleThatNeverCloses";
import GiveMeaning from "./GiveMeaning";
import RebellionNewsletter from "./RebellionNewsletter";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <RebellionSection />
      <ChooseYourArmor />
      <WhyIWearMine />
      <PurchasePower />
      <CircleThatNeverCloses />
      <GiveMeaning />
      <RebellionNewsletter />
      <Footer />
    </div>
  );
};

export default HomePage;
