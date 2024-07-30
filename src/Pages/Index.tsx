// src/pages/index.tsx
import React from 'react';
import TipLink from '../Components/TipLink'; // Correct import paths
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Tokenomics from '../Components/Tokenomics';
import Footer from '../Components/Footer';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar logo="/path_to_logo_image" />
      <Hero logo="/path_to_logo_image" />
      <Tokenomics />
      <TipLink />
      <Footer logo="/path_to_logo_image" />
    </div>
  );
};

export default Home;




