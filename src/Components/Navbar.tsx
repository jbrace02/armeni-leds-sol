import React, { useState } from 'react';
import styles from "./Navbar.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { Pivot as Hamburger } from "hamburger-react";

interface NavbarProps {
  logo: string;
}

const Navbar: React.FC<NavbarProps> = ({ logo }) => {
  // mobile menu state
  const [isMenuOpen, setMenuOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <nav className={styles.nav}>
      {/* logo */}
      <img src={logo} alt="gif logo" className={styles.logo} />
      {/* nav list items */}
      <ul className={styles.navlist}>
        {/* twitter */}
        <a
          href="https://x.com/ArmeniLeds_SOL"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className={styles.navitem}>Twitter(X)</li>
        </a>
        {/* telegram */}
        <a
          href="https://t.me/armenileds"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className={styles.navitem}>Telegram</li>
        </a>
        {/* chart */}
        <a
          href="https://birdeye.so/token/5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb?chain=solana"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className={styles.navitem}>Chart</li>
        </a>
      </ul>
      {/* nav buttons */}
      <ul className={styles.navbuttons}>
        <a
          href="https://jup.ag/swap/SOL-ARMENI_5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className={`${styles.btn} ${styles.buy_btn}`}>Buy $ARMENI</button>
        </a>
      </ul>
      {/* mobile nav */}
      <div className={styles.hamburger}>
        <Hamburger toggled={isMenuOpen} toggle={setMenuOpen} />
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.menu_container}
            key="menu"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <motion.ul
              className={styles.navlist_mobile}
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.a
                href="https://x.com/ArmeniLeds_SOL"
                target="_blank"
                rel="noopener noreferrer"
                variants={item}
              >
                <li className={styles.navitem}>Twitter(X)</li>
              </motion.a>
              <motion.a
                href="https://t.me/armenileds"
                target="_blank"
                rel="noopener noreferrer"
                variants={item}
              >
                <li className={styles.navitem}>Telegram</li>
              </motion.a>
              <motion.a
                href="https://birdeye.so/token/5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb?chain=solana"
                target="_blank"
                rel="noopener noreferrer"
                variants={item}
              >
                <li className={styles.navitem}>Chart</li>
              </motion.a>
              {/* nav buttons */}
              <motion.li className={styles.navitem_btn} variants={item}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://jup.ag/swap/SOL-ARMENI_5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb"
                >
                  <button className={styles.btn_mobile}>BUY $ARMENI</button>
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

