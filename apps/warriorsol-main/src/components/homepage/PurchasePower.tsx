"use client";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCurrencyDollar, BsGlobe } from "react-icons/bs";
import { motion, useInView, Variants } from "framer-motion";

interface Statistic {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface PurchasePowerProps {
  statistics?: Statistic[];
  title?: {
    main: string;
    highlight?: string;
    suffix?: string;
  };
  subtitle?: string;
}

const defaultStats: Statistic[] = [
  {
    value: "1,200+",
    label: "warriors gifted",
    icon: <AiOutlineHeart className="text-[#EE9254] w-6 h-6 sm:w-8 sm:h-8" />,
  },
  {
    value: "$60,000",
    label: "donated to families",
    icon: <BsCurrencyDollar className="text-[#EE9254] w-6 h-6 sm:w-8 sm:h-8" />,
  },
  {
    value: "3",
    label: "countries and growing",
    icon: <BsGlobe className="text-[#EE9254] w-6 h-6 sm:w-8 sm:h-8" />,
  },
];

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96], // Custom easing
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96], // Custom easing
    },
  },
};

const PurchasePower: React.FC<PurchasePowerProps> = ({
  statistics = defaultStats,
  title = {
    main: "Your Purchase",
    highlight: "=",
    suffix: "Power",
  },
  subtitle = "Every Item Sold Creates Ripples Of Change In The Warrior Community",
}) => {
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24  overflow-hidden scroll-mt-16 bg-[#FFF7DF]"
    >
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="text-center mb-8 sm:mb-12 lg:mb-16 py-20 bg-[#FFF7DF]"
      >
        <h2 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-tight sm:leading-[1.1]  font-semibold  text-[#1F1F1F] capitalize">
          {title.main}{" "}
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }
            }
            transition={{
              delay: 0.4,
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              bounce: 0.5,
            }}
            className="text-[#EE9254] inline-block origin-center"
          >
            {title.highlight}
          </motion.span>{" "}
          {title.suffix}
        </h2>
        <motion.p
          variants={fadeInUp}
          className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium  text-[#1F1F1FB2] mt-2 sm:mt-3 px-4"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full "
      >
        {statistics.map((stat, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            className="bg-[#F9F9F9] p-6 sm:p-8 lg:p-12 flex flex-col items-center text-center transform-gpu w-full h-full"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            {/* icon + value + label */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={
                isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
              }
              transition={{
                delay: index * 0.2 + 0.5,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                bounce: 0.5,
              }}
              className="mb-4 sm:mb-6 w-10 h-10"
            >
              {stat.icon}
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="text-[24px] font-medium text-[#1F1F1F] mb-1 sm:mb-2"
            >
              {stat.value}
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#1F1F1F]"
            >
              {stat.label}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PurchasePower;
