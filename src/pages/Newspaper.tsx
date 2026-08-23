import React from "react";
import Viewer from "../components/Viewer";
import { NewspaperIssue } from "../types";
import { normalizePublicAssetPath } from "../utils/archivePaths";

const issueNumbers = [1, 2, 3, 4, 5, 7, 8];

const newspaperIssues: NewspaperIssue[] = issueNumbers.map((issueNumber) => ({
  id: `tfnpp${issueNumber}`,
  title: `Вестник Тера Фантастика ${issueNumber}`,
  imageUrl: normalizePublicAssetPath(`NewspaperImages/tfnpp${issueNumber}.png`),
  tileSourceUrl: normalizePublicAssetPath(
    `NewspaperDeepZoom/tfnpp${issueNumber}/dzc_output.xml`,
  ),
}));

const Newspaper: React.FC = () => {
  return <Viewer issues={newspaperIssues} />;
};

export default Newspaper;