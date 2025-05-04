import React from "react";
import booksData from "../assets/books/books.json";
import Carousel from "../components/Carousel";
import { CarouselItem } from "../types";

// Create a function to fix asset paths
const fixAssetPath = (path: string): string => {
  if (!path) return "";

  // Handle PDF links
  if (path.includes("/assets/")) {
    return path.replace("../assets/", "/src/Assets/");
  }

  // Handle image paths (if they don't start with /)
  if (path.includes("BooksImages/") && !path.startsWith("/")) {
    return `/${path}`;
  }

  return path;
};

// Map the raw data to the CarouselItem structure
const formattedBooksData: CarouselItem[] = booksData.map((item) => ({
  id: item.id,
  url: fixAssetPath(item.url),
  name: item.text.name,
  author: item.text.author,
  Format: item.text.Format,
  Pages: item.text.Pages,
  Year: item.text.Year,
  link: fixAssetPath(item.link),
}));

const Books: React.FC = () => {
  return <Carousel data={formattedBooksData} />;
};

export default Books;
