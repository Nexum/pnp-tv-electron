import Screen from "./components/Screen";
import ReactDOM from "react-dom";
import React from "react";

global.React = React;

ReactDOM.render(
  <Screen isGm={false}/>,
  document.getElementById('root'),
);
