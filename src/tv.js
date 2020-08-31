import Screen from "./components/Screen";
import ReactDOM from "react-dom";
import React from "react";
import "./helpers/hotkeys";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

global.React = React;

ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <Screen isGm={false}/>
    </DndProvider>,
    document.getElementById('root'),
);
