import React from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";
import Hero from "./Hero";
import RebellionSection from "./RebellionSection";
import ChooseYourArmor from "./ChooseYourArmor";
import WhyIWearMine from "./WhyIWearMine";
import PurchasePower from "./PurchasePower";
import CircleThatNeverCloses from "./CircleThatNeverCloses";
import RebellionNewsletter from "./RebellionNewsletter";
import { SocialLinks } from "../shared/socialLinks";

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
      <RebellionNewsletter />
      <SocialLinks />
      <Footer />
    </div>
  );
};

export default HomePage;
