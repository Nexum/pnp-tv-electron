import {useEffect, useRef, useState} from "react";
import {Group, Layer, Line, Rect} from "react-konva";
import Konva from "konva";
import MapStore from "../../lib/MapStore";
import ConfigStore from "../../lib/ConfigStore";

let painting;
let imageAlreadyLoading = false;

export default function FowLayer({isGm, base}) {
    const layerGroup = useRef();
    const line = useRef();
    const fow = useRef();
    const group = useRef();
    const fogColor = "#dedede";
    const [map, setActiveMap] = MapStore.useActive();
    const fowData = MapStore.useActiveFow();
    const fowMode = ConfigStore.useConfig("fowMode");
    const fowBrushSize = ConfigStore.useConfig("fowBrushSize");

    useEffect(() => {
        if (group.current) {
            if (!fowData) {
                if (fow.current) {
                    fow.current.destroy();
                }

                layerGroup.current.getLayer().batchDraw();
                return;
            }

            if (imageAlreadyLoading) {
                return;
            }

            imageAlreadyLoading = true;
            const imageObj = document.createElement("img");
            imageObj.src = fowData;
            imageObj.onload = function () {
                imageAlreadyLoading = false;
                const newImage = new Konva.Image({
                    image: imageObj,
                    width: layerGroup.current.getStage().width(),
                    height: layerGroup.current.getStage().height(),
                    globalCompositeOperation: "destination-out",
                });

                group.current.add(newImage);

                if (fow.current) {
                    fow.current.destroy();
                }

                newImage.cache();
                newImage.filters([Konva.Filters.Blur]);
                newImage.blurRadius(50);
                newImage.cache();

                fow.current = newImage;
                newImage.moveToTop();
                line.current.points([]);
                line.current.moveToTop();
                layerGroup.current.getLayer().batchDraw();
            };
        }
    }, [fowData]);

    useEffect(() => {
        Konva.Image.fromURL(`img/fow_base_2.jpg`, function (image) {
            image.cache();
            if (isGm) {
                image.opacity(0.8);
            }
            image.filters([Konva.Filters.Grayscale]);

            layerGroup.current.add(image);
            image.moveToBottom();
            layerGroup.current.getLayer().batchDraw();
        });
    }, []);

    async function save(data) {
        if (!isGm || !map) {
            return;
        }

        MapStore.saveFow(map._id, data);
    }

    function onMouseDown(e) {
        if (!isGm) {
            return;
        }

        line.current.points(getPointerCoords());

        if (fowMode === "remove") {
            line.current.globalCompositeOperation("destination-out");
        } else {
            line.current.globalCompositeOperation("destination-over");
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

            const halfBrushWidht = parseInt(fowBrushSize) / 2;
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

        if (fowMode === "remove") {
            line.current.globalCompositeOperation(null);
            fow.current && fow.current.globalCompositeOperation(null);
            fow.current && fow.current.blurRadius(0);
            save(group.current.toDataURL());
            fow.current && fow.current.globalCompositeOperation("destination-out");
            fow.current && fow.current.blurRadius(50);
            line.current.globalCompositeOperation("destination-out");
        } else {
            line.current.globalCompositeOperation("destination-out");
            fow.current && fow.current.globalCompositeOperation(null);
            fow.current && fow.current.blurRadius(0);
            save(group.current.toDataURL());
            fow.current && fow.current.globalCompositeOperation("destination-out");
            fow.current && fow.current.blurRadius(50);
            line.current.globalCompositeOperation("destination-out");
        }
    }

    return (
        <Group ref={layerGroup}
               onMouseDown={onMouseDown}
               onTouchStart={onMouseDown}
               onMouseUp={onMouseUp}
               onTouchEnd={onMouseUp}
               onMouseLeave={onMouseUp}
               onMouseMove={onMouseMove}
               onTouchMove={onMouseMove}
        >
            <Group
                ref={group}
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
                    stroke={fogColor}
                    strokeWidth={fowBrushSize}
                    opacity={1}
                    lineJoin="round"
                    lineCap="round"
                    globalCompositeOperation={"destination-out"}
                />
            </Group>
        </Group>
    );
}