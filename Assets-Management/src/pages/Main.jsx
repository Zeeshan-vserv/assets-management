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
      <Header toggleNav={toggleNav} />
      <Body nav={nav} setNav={setNav} />
    </div>
  );
};

export default Main;
