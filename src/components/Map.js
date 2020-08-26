import {useCallback, useEffect, useRef, useState} from "react";
import {Stage, Layer, Rect, Image} from "react-konva";
import {remote} from "electron";

const {screen} = remote;
import MapLayer from "./Map/MapLayer";
import FowLayer from "./Map/FowLayer";
import BackgroundLayer from "./Map/BackgroundLayer";

export default function Map({isGm}) {
    const stage = useRef();
    const base = {
        width: 1920,
        height: 1080,
    };
    const {width, height} = screen.getPrimaryDisplay().workAreaSize;
    const [screenSize, setScreenSize] = useState({
        width: width,
        height: height,
    });
    const [scale, setScale] = useState({
        x: 1,
        y: 1,
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

    return (
        <Stage className="screen" ref={stage} scale={scale} width={base.width} height={base.height}>
            {layerOrder.map((v, i) => {
                return layers[v];
            })}
        </Stage>
    );
}
