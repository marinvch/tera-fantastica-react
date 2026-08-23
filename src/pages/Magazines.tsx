import React from "react";
import Carousel from "../components/Carousel";
import { getMagazines } from "../archive";

const Magazines: React.FC = () => {
  return <Carousel data={getMagazines()} />;
};

export default Magazines;
