import React from "react";
import Carousel from "../components/Carousel";
import { getBooks } from "../archive";

const Books: React.FC = () => {
  return <Carousel data={getBooks()} />;
};

export default Books;
