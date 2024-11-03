import React from "react";
import styles from "./Sell.module.css";
import { motion } from 'framer-motion';
import Image from 'next/image';

const Sell: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, opacity: 1
    }
  };

  const steps = [
    {
      imageSrc: "/Assets/qouteb.png",
      altText: "Get an Instant Quote",
      head: "GET AN INSTANT QUOTE",
      text: "Get an instant quote for your electronic trade-in based on its condition."
    },
    {
      imageSrc: "/Assets/shipb.png",
      altText: "Ship for Free",
      head: "SHIP FOR FREE",
      text: "We provide you with a free, trackable pre-paid shipping label for sending us your item(s)."
    },
    {
      imageSrc: "/Assets/paidb.png",
      altText: "Get Paid in Crypto",
      head: "GET PAID IN CRYPTO",
      text: "Get paid fast in crypto or your preferred method once we receive and verify the item(s)."
    }
  ];

  return (
    <motion.section
      className={styles.sell_section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.h1 className={styles.howToSell} variants={itemVariants}>HOW TO SELL YOUR DEVICE</motion.h1>
      <motion.div className={styles.sell_flex} variants={containerVariants}>
        {steps.map((step, index) => (
          <motion.div key={index} className={styles.sell_flexbox} variants={itemVariants}>
            <div className={styles.image_container}>
              <Image
                src={step.imageSrc}
                alt={step.altText}
                layout="responsive"
                width={500}
                height={300}
                objectFit="contain"
                className={styles.sell_image}
              />
            </div>
            <p className={styles.sell_head}>{step.head}</p>
            <p className={styles.sell_text}>{step.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Sell;