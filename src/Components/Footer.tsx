import React from 'react';
import styles from "./Footer.module.css";
import XIcon from "@mui/icons-material/X";
import TelegramIcon from "@mui/icons-material/Telegram";

interface FooterProps {
  logo: string;
}

const Footer: React.FC<FooterProps> = ({ logo }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_top}>
        <img src={logo} alt="armeni logo" className={styles.footer_logo} />
        <ul className={styles.footer_nav}>
          <a
            href="https://jup.ag/swap/SOL-ARMENI_5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li className={styles.footer_nav_item}>Buy $ARMENI</li>
          </a>
          <a
            href="https://birdeye.so/token/5AJjM9VRFRDawVcCi7bsT56bMUij3iXcuovH7mxN1Spb?chain=solana"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li className={styles.footer_nav_item}>View Chart</li>
          </a>
        </ul>
        <div className={styles.footer_social}>
          <a
            href="https://x.com/ArmeniLeds_SOL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon />
          </a>
          <a
            href="https://t.me/armenileds"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TelegramIcon />
          </a>
        </div>
      </div>
      <p className={styles.footer_copyright}>
        Copyright &copy; {new Date().getFullYear()} $ARMENI - All rights
        reserved
      </p>
    </footer>
  );
};

export default Footer;

