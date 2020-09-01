import {useCallback, useEffect, useRef, useState} from "react";
import {Stage, Layer, Rect, Image} from "react-konva";
import MapLayer from "./Map/MapLayer";
import FowLayer from "./Map/FowLayer";
import BackgroundLayer from "./Map/BackgroundLayer";
import MarkerLayer from "./Map/MarkerLayer";
import {remote} from "electron";
import {debounce} from "lodash";
import ConfigStore from "../lib/ConfigStore";
import CreatureLayer from "./Map/CreatureLayer";
import EffectLayer from "./Map/EffectLayer";

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

    const activeToolbarItems = ConfigStore.useConfig("activeToolbarItems") || [];
    const layers = {
        background: <BackgroundLayer key="background" isGm={isGm} base={base}></BackgroundLayer>,
        map: <MapLayer key="map" isGm={isGm} base={base}></MapLayer>,
        fow: (
            <Layer key="fow">
                <FowLayer listening={activeToolbarItems.indexOf(1) === -1} isGm={isGm} base={base}></FowLayer>
                <MarkerLayer listening={activeToolbarItems.indexOf(1) !== -1} isGm={isGm} base={base}></MarkerLayer>
                <CreatureLayer isGm={isGm} base={base}></CreatureLayer>
                <EffectLayer isGm={isGm} base={base}></EffectLayer>
            </Layer>
        ),
    };

    let layerOrder = [
        "background",
        "map",
        "fow",
    ];

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
