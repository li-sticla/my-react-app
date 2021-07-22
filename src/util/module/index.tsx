import { caculate } from "entry";
import React, { useEffect } from "react";
import logo from "logo.svg";

export const Demo = () => {
  useEffect(() => {
    caculate();
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo"></img>
      </header>
    </div>
  );
};
