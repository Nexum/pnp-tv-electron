import {useCallback, useEffect, useRef, useState} from "react";
import {Stage, Layer, Rect, Image} from "react-konva";
import MapLayer from "./Map/MapLayer";
import FowLayer from "./Map/FowLayer";
import BackgroundLayer from "./Map/BackgroundLayer";
import {remote} from "electron";
import {debounce} from "lodash";

export default function Map({isGm}) {
    const stage = useRef();
    const base = {
        width: 1920,
        height: 1080,
    };

    const [scale, setScale] = useState({
        x: window.document.body.clientWidth / base.width,
        y: window.document.body.clientHeight / base.height,
    });

    const layers = {
        background: <BackgroundLayer key="background" isGm={isGm} base={base}></BackgroundLayer>,
        map: <MapLayer key="map" isGm={isGm} base={base}></MapLayer>,
        fow: <FowLayer key="fow" isGm={isGm} base={base}></FowLayer>,
    };

    let layerOrder = [
        "background",
        "map",
        "fow",
    ];

    let currentWindow = remote.getCurrentWindow().removeAllListeners();
    currentWindow.on('resize', debounce(function () {
        setScale({
            x: window.document.body.clientWidth / base.width,
            y: window.document.body.clientWidth / base.width,
        });
    }, 500));

    return (
        <Stage className="screen" ref={stage} scale={scale} width={base.width} height={base.height}>
            {layerOrder.map((v, i) => {
                return layers[v];
            })}
        </Stage>
    );
}
