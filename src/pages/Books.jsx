import React from "react";
import BooksData from "../Assets/books/books.json";
import Carousel from "../Components/Carousel";

const Books = () => {
  return <Carousel data={BooksData} />;
};

export default Books;
