import React from "react";
import BooksData from "../assets/books/books.json";
import Carousel from "../components/Carousel";

const Books = () => {
  return <Carousel data={BooksData} />;
};

export default Books;
