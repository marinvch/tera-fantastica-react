import React from "react";
import MagazinedData from "../assets/magazines/magazines.json";
import Carousel from "../components/Carousel";

const Magazines = () => {
  return <Carousel data={MagazinedData} />;
};

export default Magazines;
