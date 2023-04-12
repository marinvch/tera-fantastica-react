import React from "react";
import MagazinedData from "../Assets/magazines/magazines.json";
import Carousel from "../Components/Carousel";

const Magazines = () => {
  return <Carousel data={MagazinedData} />;
};

export default Magazines;
