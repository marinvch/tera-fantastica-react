import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import { getMagazines } from "../archive";
import type { ArchiveItem } from "../types";

const Magazines: React.FC = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  const handleActiveChange = (item: ArchiveItem) =>
    navigate(`/magazines/${item.uid}`, { replace: true });

  return (
    <Carousel data={getMagazines()} initialUid={uid} onActiveChange={handleActiveChange} />
  );
};

export default Magazines;
