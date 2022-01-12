/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable no-undef */
// rfce
import React from 'react';

const Hero = ({ heroName }: any): JSX.Element => {
  // if ( heroName === 'Joker') {
  //   throw new Error('Not a hero!');
  // }
  return <div style={{ color: "white", fontSize: "24px", border: "1px solid aquamarine", width: "fit-content", borderRadius: "10px", padding: "10px" }}>
    {heroName}
  </div>;
}

export default Hero;
