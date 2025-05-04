import React from "react";
import magazinesData from "../assets/magazines/magazines.json";

import Carousel from "../components/Carousel";
import { CarouselItem } from "../types";

// Define the magazine data type to match the actual JSON structure
interface MagazineData {
  id: number;
  url: string;
  text: {
    name: string;
    author: string;
    Format: string;
    Pages: number;
    Year: number;
  };
  link: string;
}

// Create a function to fix asset paths
const fixAssetPath = (path: string): string => {
  if (!path) return "";

  // Handle image paths (if they don't start with /)
  if (path.includes("/MagazineImages/") && !path.startsWith("http")) {
    // Magazine paths already have leading slash
    return path;
  }

  return path;
};

// Map the raw data to the CarouselItem structure
const formattedMagazinesData: CarouselItem[] = (magazinesData as MagazineData[]).map((item) => ({
  id: item.id,
  url: fixAssetPath(item.url),
  name: item.text.name,
  author: item.text.author,
  Format: item.text.Format,
  Pages: item.text.Pages,
  Year: item.text.Year,
  link: item.link || "" // Ensure link is never undefined
}));

const Magazines: React.FC = () => {
  return <Carousel data={formattedMagazinesData} />;
};

export default Magazines;
