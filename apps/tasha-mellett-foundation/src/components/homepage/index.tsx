"use client";
import OurMission from "./ourMission";
import Hero from "./hero";
import BeingAWarrior from "./beingAWarrior";
import StoriesOfHope from "./storiesOfHope";
import ApplyForSupport from "./applyForSupport";
import RebellionNewsletter from "./rebellionNewsletter";
export default function HomePage() {
  return (
    <>
      <Hero />
      <OurMission />
      <BeingAWarrior />
      <StoriesOfHope />
      <ApplyForSupport />
      <RebellionNewsletter />
    </>
  );
}
