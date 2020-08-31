import {useEffect, useRef, useState} from "react";
import FowConfig from "./ToolBar/FowConfig";
import ConfigWindow from "./ToolBar/ConfigWindow";
import MapConfig from "./ToolBar/MapConfig";
import CreatureConfig from "./ToolBar/CreatureConfig";
import PaintConfig from "./ToolBar/PaintConfig";
import ConfigStore from "../lib/ConfigStore";
import hotkeys from 'hotkeys-js';
import GDriveConfig from "./ToolBar/GDriveConfig";
import PlayerConfig from "./ToolBar/PlayerConfig";

export default function ControlPanel({}) {
    const panels = [
        {
            label: "FOW",
            layer: "fow",
            configName: "fow",
            config: FowConfig,
            button: useRef(),
        },
        {
            label: "Paint",
            layer: "marker",
            configName: "marker",
            config: PaintConfig,
            button: useRef(),
        },
        {
            label: "Maps",
            layer: "map",
            configName: "map",
            config: MapConfig,
            button: useRef(),
        },
        {
            label: "Creatures",
            layer: "creature",
            configName: "creature",
            button: useRef(),
            config: CreatureConfig,
        },
        {
            label: "GDrive",
            layer: "gdrive",
            configName: "gdrive",
            button: useRef(),
            config: GDriveConfig,
        },
        {
            label: "Player",
            layer: "player",
            configName: "fight",
            button: useRef(),
            config: PlayerConfig,
        },
    ];
    const activeToolbarItems = ConfigStore.useConfig("activeToolbarItems") || [];
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
        const copy = [...activeToolbarItems];
        const existingIndex = copy.indexOf(panel);

        if (existingIndex === -1) {
            copy.push(panel);
        } else {
            copy.splice(existingIndex, 1);
        }
        ConfigStore.set("activeToolbarItems", copy);
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
                                    className={"mini-item " + (activeToolbarItems.indexOf(i) !== -1 && "active")}
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
            {gmUiVisible ? activeToolbarItems.map((v, i) => {
                return (<ConfigWindow panel={panels[v]} key={i}/>);
            }) : null}
        </>
    );
}