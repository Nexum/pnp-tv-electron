import {useEffect, useRef, useState} from "react";
import {Group, Layer, Line, Rect} from "react-konva";
import Konva from "konva";

let painting;

export default function FowLayer({isGm, base}) {
    const layer = useRef();
    const line = useRef();
    const fow = useRef();
    const group = useRef();
    const fogColor = "#dedede";
    const gmOptions = {
        fowMode: "remove",
        fowBrushSize: 120,
    };
    const map = {
        fow: null,
        _id: "test"
    }

    useEffect(() => {
        if (group.current) {
            if (fow.current) {
                fow.current.destroy();
            }

            if (!map.fow) {
                layer.current.batchDraw();
                return;
            }

            const imageObj = document.createElement("img");
            imageObj.src = map.fow;
            imageObj.onload = function () {
                const newImage = new Konva.Image({
                    image: imageObj,
                    width: layer.current.getStage().width(),
                    height: layer.current.getStage().height(),
                    globalCompositeOperation: "destination-out",
                });

                newImage.cache();
                newImage.filters([Konva.Filters.Blur]);
                newImage.blurRadius(50);

                fow.current = newImage;
                group.current.add(newImage);
                newImage.moveToTop();
                line.current.points([]);
                line.current.moveToTop();
                layer.current.batchDraw();
            };
        }
    }, [map]);

    useEffect(() => {
        Konva.Image.fromURL(`/img/fow_base_2.jpg`, function (image) {
            image.cache();
            if (isGm) {
                image.opacity(0.8);
            }
            image.filters([Konva.Filters.Grayscale]);

            layer.current.add(image);
            image.moveToBottom();
            layer.current.batchDraw();
        });
    }, []);

    async function save(data) {
        if (!isGm) {
            return;
        }

        await fetch(`/api/map/${map._id}/fow`, {
            method: "POST",
            body: JSON.stringify({
                fow: data,
            }),
        });
    }

    function onMouseDown(e) {
        if (!isGm) {
            return;
        }

        line.current.points(getPointerCoords());

        if (gmOptions.fowMode === "remove") {
            line.current.globalCompositeOperation("destination-out");
        } else {
            line.current.globalCompositeOperation("destination-over");
        }

        painting = true;
    }

    function getPointerCoords() {
        if (layer.current) {
            const pos = layer.current.getStage().getPointerPosition();
            let newPoint = [
                pos.x / layer.current.getStage().scaleX(),
                pos.y / layer.current.getStage().scaleY(),
            ];

            const halfBrushWidht = gmOptions.fowBrushSize / 2;
            const edgeX = layer.current.getStage().width() - halfBrushWidht;
            const edgeY = layer.current.getStage().height() - halfBrushWidht;

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
        layer.current.batchDraw();
    }

    function onMouseUp(e) {
        if (!isGm || !painting) {
            return;
        }

        painting = false;

        if (gmOptions.fowMode === "remove") {
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
        <Layer ref={layer}
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
                    strokeWidth={gmOptions.fowBrushSize}
                    opacity={1}
                    lineJoin="round"
                    lineCap="round"
                    globalCompositeOperation={"destination-out"}
                />
            </Group>
        </Layer>
    );
}