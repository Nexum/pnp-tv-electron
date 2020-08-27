import {useEffect, useRef, useState} from "react";
import FowConfig from "./ToolBar/FowConfig";
import ConfigWindow from "./ToolBar/ConfigWindow";
import MapConfig from "./ToolBar/MapConfig";
import CreatureConfig from "./ToolBar/CreatureConfig";
import PaintConfig from "./ToolBar/PaintConfig";
import ConfigStore from "../lib/ConfigStore";

export default function ControlPanel({}) {
    const panels = [
        {
            label: "FOW",
            layer: "fow",
            config: FowConfig,
            button: useRef(),
        },
        {
            label: "Paint",
            layer: "marker",
            config: PaintConfig,
            button: useRef(),
        },
        {
            label: "Maps",
            layer: "map",
            config: MapConfig,
            button: useRef(),
        },
        {
            label: "Creatures",
            layer: "creature",
            button: useRef(),
            config: CreatureConfig,
        },
    ];
    const activeToolbarItem = ConfigStore.useConfig("activeToolbarItem");

    function togglePanel(panel) {
        if (activeToolbarItem === panel) {
            ConfigStore.set("activeToolbarItem", null);
        } else {
            ConfigStore.set("activeToolbarItem", panel);
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
                <button className="navbar-toggler" type="button">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {
                            panels.map((v, i) => {
                                return (
                                    <li
                                        ref={v.button}
                                        key={i}
                                        className={"nav-item " + (i === activeToolbarItem && "active")}
                                    >
                                        <a className="nav-link" href="#" onClick={togglePanel.bind(null, i)}>{v.label}</a>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </nav>
            {activeToolbarItem !== null && panels[activeToolbarItem] && (
                <ConfigWindow panel={panels[activeToolbarItem]}/>
            )}
        </>
    );
}