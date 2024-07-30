import React from 'react';
import Carousel from "./Carousel";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

interface HeroProps {
  logo: string;
}

const Hero: React.FC<HeroProps> = ({ logo }) => {
  return (
    <header className={styles.hero_container}>
      {/* hero image slider top */}
      <div>
        <Carousel />
      </div>
      {/* text bottom */}
      <motion.div
        className={styles.hero_left}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.hero_header}>LEDS ON TEP!</h1>
        <p className={styles.hero_subtext}>
          $ARMENI is a medled communette takeover. FOCK ET!
        </p>
        {/* buttons */}
        <div className={styles.hero_buttons_container}>
          <a
            href="https://birdeye.so/token/5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb?chain=solana"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className={styles.hero_btn}>Chart</button>
          </a>
          <a
            href="https://jup.ag/swap/SOL-ARMENI_5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className={styles.hero_btn}>Buy</button>
          </a>
        </div>
      </motion.div>
    </header>
  );
};

export default Hero;

