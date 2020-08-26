import {useEffect, useRef, useState} from "react";
import {Group, Layer, Line, Rect} from "react-konva";
import Konva from "konva";

let painting;

export default function FowLayer({map, isGm, base, gmOptions}) {
    const layer = useRef();
    const line = useRef();
    const marker = useRef();
    const group = useRef();

    useEffect(() => {
        if (group.current) {
            if (marker.current) {
                marker.current.destroy();
            }

            if (!map.marker) {
                layer.current.batchDraw();
                return;
            }

            const imageObj = document.createElement("img");
            imageObj.src = map.marker;
            imageObj.onload = function () {
                const newImage = new Konva.Image({
                    image: imageObj,
                    width: layer.current.getStage().width(),
                    height: layer.current.getStage().height(),
                });

                marker.current = newImage;
                group.current.add(newImage);
                newImage.moveToTop();
                line.current.points([]);
                line.current.moveToTop();
                layer.current.batchDraw();
            };
        }
    }, [map]);

    async function save(data) {
        if (!isGm) {
            return;
        }

        await fetch(`/api/map/${map._id}/marker`, {
            method: "POST",
            body: JSON.stringify({
                marker: data,
            }),
        });
    }

    function onMouseDown(e) {
        if (!isGm) {
            return;
        }

        line.current.points(getPointerCoords());
        painting = true;
    }

    function getPointerCoords() {
        if (layer.current) {
            const pos = layer.current.getStage().getPointerPosition();
            let newPoint = [
                pos.x / layer.current.getStage().scaleX(),
                pos.y / layer.current.getStage().scaleY(),
            ];

            const halfBrushWidht = gmOptions.paintBrushSize / 2;
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
        save(group.current.toDataURL());
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
                    stroke={gmOptions.paintColor}
                    strokeWidth={gmOptions.paintBrushSize}
                    opacity={gmOptions.paintColorAlpha}
                    lineJoin="round"
                    lineCap="round"
                    globalCompositeOperation={gmOptions.paintMode === "erase" ? "destination-out" : null}
                />
            </Group>
        </Layer>
    );
}
