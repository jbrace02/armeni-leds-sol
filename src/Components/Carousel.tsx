import React from 'react';
import { motion } from "framer-motion";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Image from 'next/image';
import meme1 from "../Assets/meme1.png";
import meme2 from "../Assets/meme2.png";
import meme3 from "../Assets/meme3.png";
import meme4 from "../Assets/meme4.png";
import meme5 from "../Assets/meme5.png";
import meme6 from "../Assets/meme6.png";

const Carousel: React.FC = () => {
  // slide images array
  const slideImages = [
    meme1,
    meme2,
    meme3,
    meme4,
    meme5,
    meme6,
  ];

  return (
    <motion.div>
      {/* images slider */}
      <motion.div>
        <Slide duration={3000}>
          {slideImages.map((image, index) => (
            <div key={index} className="each-slide-effect">
              <Image src={image} alt={`Meme ${index + 1}`} layout="fill" objectFit="cover" />
            </div>
          ))}
        </Slide>
      </motion.div>
    </motion.div>
  );
};

export default Carousel;



