import {useEffect, useRef, useState} from "react";
import {Group, Layer, Line, Rect} from "react-konva";
import Konva from "konva";
import MapStore from "../../lib/MapStore";
import ConfigStore from "../../lib/ConfigStore";
import {layer} from "@fortawesome/fontawesome-svg-core";

let painting;
let saving = false;

export default function MarkerLayer({isGm, listening, base}) {
    const layerGroup = useRef();
    const line = useRef();
    const marker = useRef();
    const [map, setActiveMap] = MapStore.useActive();
    const markerListener = MapStore.useActiveMarker();
    const markerMode = ConfigStore.useConfig("markerMode");
    const markerColor = ConfigStore.useConfig("markerColor");
    const markerColorAlpha = ConfigStore.useConfig("markerColorAlpha");
    const markerBrushSize = ConfigStore.useConfig("markerBrushSize");

    async function updateMarker() {
        if (layerGroup.current) {
            const markerImage = await getImageFromSrc(MapStore.getMarkerFilePath(map._id) + "?time=" + Date.now());
            const newImage = new Konva.Image({
                image: markerImage,
                width: layerGroup.current.getStage().width(),
                height: layerGroup.current.getStage().height(),
            });

            layerGroup.current.add(newImage);

            if (marker.current) {
                marker.current.destroy();
            }

            marker.current = newImage;
            newImage.moveToTop();
            line.current.points([]);
            line.current.moveToTop();
            layerGroup.current.getLayer().batchDraw();
        }
    }

    useEffect(() => {
        updateMarker();
    }, [markerListener]);

    async function getImageFromSrc(src) {
        return new Promise((res, rej) => {
            const imageObj = document.createElement("img");
            imageObj.src = src;
            imageObj.onload = function () {
                res(imageObj);
            };
            imageObj.onerror = function () {
                console.log("MarkerLayer.js:86 / onerror");
                res(null);
            };
        });
    }

    async function save(dataUrl) {
        if (!isGm || !map || saving) {
            return;
        }

        saving = true;
        MapStore.saveMarker(map._id, dataUrl);
        saving = false;
    }

    function onMouseDown(e) {
        if (!isGm) {
            return;
        }

        line.current.points(getPointerCoords());

        if (markerMode === "remove") {
            line.current.globalCompositeOperation("destination-out");
        } else {
            line.current.globalCompositeOperation(null);
        }

        painting = true;
    }

    function getPointerCoords() {
        if (layerGroup.current) {
            const pos = layerGroup.current.getStage().getPointerPosition();
            let newPoint = [
                pos.x / layerGroup.current.getStage().scaleX(),
                pos.y / layerGroup.current.getStage().scaleY(),
            ];

            const halfBrushWidht = parseInt(markerBrushSize) / 2;
            const edgeX = layerGroup.current.getStage().width() - halfBrushWidht;
            const edgeY = layerGroup.current.getStage().height() - halfBrushWidht;

            if (newPoint[0] > edgeX) {
                newPoint[0] = edgeX;
            } else if (newPoint[0] < halfBrushWidht) {
                newPoint[0] = halfBrushWidht;
            }

            if (newPoint[1] > edgeY) {
                newPoint[1] = edgeY;
            } else if (newPoint[1] < halfBrushWidht) {
                newPoint[1] = halfBrushWidht;
            }

            return newPoint;
        }

        return [];
    }

    function onMouseMove(e) {
        if (!isGm || !painting) {
            return;
        }

        const newPoints = line.current.points().concat(getPointerCoords());

        line.current.points(newPoints);
        layerGroup.current.getLayer().batchDraw();
    }

    function onMouseUp(e) {
        if (!isGm || !painting) {
            return;
        }

        painting = false;
        save(layerGroup.current.toDataURL());
    }

    return (
        <Group ref={layerGroup}
               listening={listening}
               onMouseDown={onMouseDown}
               onTouchStart={onMouseDown}
               onMouseUp={onMouseUp}
               onTouchEnd={onMouseUp}
               onMouseLeave={onMouseUp}
               onMouseMove={onMouseMove}
               onTouchMove={onMouseMove}
               width={base.width}
               height={base.height}
        >
            <Rect
                width={base.width}
                height={base.height}
            >
            </Rect>
            <Line
                ref={line}
                stroke={markerColor}
                strokeWidth={markerBrushSize}
                opacity={markerColorAlpha}
                lineJoin="round"
                lineCap="round"
            />
        </Group>
    );
}