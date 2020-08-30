import {useEffect, useRef, useState} from "react";
import FowConfig from "./ToolBar/FowConfig";
import ConfigWindow from "./ToolBar/ConfigWindow";
import MapConfig from "./ToolBar/MapConfig";
import CreatureConfig from "./ToolBar/CreatureConfig";
import PaintConfig from "./ToolBar/PaintConfig";
import ConfigStore from "../lib/ConfigStore";
import hotkeys from 'hotkeys-js';

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
    const gmUiVisible = ConfigStore.useConfig("gmUiVisible");

    function toggleUI() {
        ConfigStore.set("gmUiVisible", !gmUiVisible);
    }

    useEffect(() => {
        hotkeys("f9", (e) => {
            e.preventDefault();
            toggleUI();
        });

        return () => {
            hotkeys.unbind("f9");
        };
    }, [gmUiVisible]);

    function togglePanel(panel) {
        if (activeToolbarItem === panel) {
            ConfigStore.set("activeToolbarItem", null);
        } else {
            ConfigStore.set("activeToolbarItem", panel);
        }
    }

    return (
        <>
            <div className="mini-toolbar">
                <div className={"mini-item window-ui " + (gmUiVisible ? "active" : "inactive")} onClick={toggleUI}>
                    &#x1F441;
                </div>
                <div className="mini-nav">
                    {
                        panels.map((v, i) => {
                            return (
                                <div
                                    ref={v.button}
                                    key={i}
                                    className={"mini-item " + (i === activeToolbarItem && "active")}
                                >
                                    <a href="#" onClick={togglePanel.bind(null, i)}>{v.label}</a>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="mini-item window-draggable">
                </div>
            </div>
            {gmUiVisible && activeToolbarItem !== null && panels[activeToolbarItem] && (
                <ConfigWindow panel={panels[activeToolbarItem]}/>
            )}
        </>
    );
}