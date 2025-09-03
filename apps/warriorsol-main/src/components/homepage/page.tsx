import React from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";
import Hero from "./Hero";
import ChooseYourArmor from "./ChooseYourArmor";
import PurchasePower from "./PurchasePower";
import CircleThatNeverCloses from "./CircleThatNeverCloses";
import RebellionNewsletter from "./RebellionNewsletter";
import { SocialLinks } from "../shared/socialLinks";
import RecommendedSection from "./RecommendedSection";
import GiftSection from "./GiftSection";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ChooseYourArmor />
      <PurchasePower />
      <RecommendedSection />
      <GiftSection />
      <CircleThatNeverCloses />
      <RebellionNewsletter />
      <SocialLinks />
      <Footer />
    </div>
  );
};

export default HomePage;
