import React from "react";
import "../../App.css";

const Header: React.FC = () => { // Added React.FC type
  return (
    <div className="header">
      <input />
      <button>Search</button>
    </div>
  );
}

export default Header;
