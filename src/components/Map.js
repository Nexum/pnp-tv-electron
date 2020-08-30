import {useCallback, useEffect, useRef, useState} from "react";
import {Stage, Layer, Rect, Image} from "react-konva";
import MapLayer from "./Map/MapLayer";
import __FowLayer from "./Map/FowLayer";
import BackgroundLayer from "./Map/BackgroundLayer";
import MarkerLayer from "./Map/MarkerLayer";
import {remote} from "electron";
import {debounce} from "lodash";
import ConfigStore from "../lib/ConfigStore";
import CreatureLayer from "./Map/CreatureLayer";

export default function Map({isGm}) {
    const stage = useRef();
    const base = {
        width: 1920,
        height: 1080,
    };

    const [scale, setScale] = useState({
        x: getFactor(),
        y: getFactor(),
    });

    const activeToolbarItem = ConfigStore.useConfig("activeToolbarItem");
    const layers = {
        background: <BackgroundLayer key="background" isGm={isGm} base={base}></BackgroundLayer>,
        map: <MapLayer key="map" isGm={isGm} base={base}></MapLayer>,
        fow: (
            <Layer key="fow">
                <__FowLayer isGm={isGm} base={base}></__FowLayer>
                <CreatureLayer isGm={isGm} base={base}></CreatureLayer>
            </Layer>
        ),
        paint: <MarkerLayer key="marker" isGm={isGm} base={base}></MarkerLayer>,
        creature: null,
    };

    let layerOrder = [
        "background",
        "map",
        "paint",
        "creature",
        "fow",
    ];

    if (isGm) {
        if (activeToolbarItem === 1) {
            layerOrder = [
                "background",
                "map",
                "creature",
                "fow",
                "paint",
            ];
        }

        if (activeToolbarItem === 3) {
            layerOrder = [
                "background",
                "map",
                "paint",
                "fow",
                "creature",
            ];
        }
    }

    let currentWindow = remote.getCurrentWindow().removeAllListeners();
    currentWindow.on('resize', debounce(function () {
        setScale({
            x: getFactor(),
            y: getFactor(),
        });
    }, 500));

    function getFactor() {
        return window.innerWidth / base.width;
    }

    return (
        <Stage className="screen" ref={stage} scale={scale} width={base.width} height={base.height}>
            {layerOrder.map((v, i) => {
                return layers[v];
            })}
        </Stage>
    );
}
