import React from "react";
import { OpenSeadragonViewer } from "openseadragon-react-viewer";

function Newspapper() {
  return (
    <OpenSeadragonViewer
      className="content"
      manifestUrl=""
      options={{
        showToolbar: true,
        height: 550,
        width: 200,
      }}
    />
  );
}

export default Newspapper;
