import React, { useState } from "react";
import Header from "../components/Header.jsx";
import Body from "../components/Body.jsx";

const Main = () => {
  const [nav, setNav] = useState(false);

  const toggleNav = () => {
    setNav(!nav);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
      <Header toggleNav={toggleNav} />
      </div>
      <Body nav={nav} setNav={setNav} />
    </div>
  );
};

export default Main;
