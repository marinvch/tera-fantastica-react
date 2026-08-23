import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import { getBooks } from "../archive";
import type { ArchiveItem } from "../types";

const Books: React.FC = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  // replace, not push: swiping a carousel should not fill the back button with every cover.
  const handleActiveChange = (item: ArchiveItem) =>
    navigate(`/books/${item.uid}`, { replace: true });

  return <Carousel data={getBooks()} initialUid={uid} onActiveChange={handleActiveChange} />;
};

export default Books;
