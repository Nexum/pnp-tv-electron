import Screen from "./components/Screen";
import ReactDOM from "react-dom";
import React from "react";
import "./helpers/hotkeys";

global.React = React;

ReactDOM.render(
    <Screen isGm={true}/>,
    document.getElementById('root'),
);
