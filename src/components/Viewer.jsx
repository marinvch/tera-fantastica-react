import React from "react";
import HTMLFlipBook from "react-pageflip";
import Page8 from '../Assets/newspaper/page8.jpg'

function Newspapper() {
  const pages = [Page8]
  return (
    <HTMLFlipBook width={300} height={500}>
      {pages.map((page) => {
        return <div><img src={page} alt={'page 8'}/></div>
      })}

    </HTMLFlipBook>
  );
}

export default Newspapper;
