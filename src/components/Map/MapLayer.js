import {useCallback, useEffect, useRef, useState} from "react";
import {Stage, Layer, Rect, Image} from "react-konva";
import Konva from "konva";


export default function MapLayer({base}) {
    const layer = useRef();

    useEffect(() => {
        Konva.Image.fromURL(`/api/file/test/png?loadTimestamp=${Date.now()}`, function (image) {
            // delete everything
            layer.current.destroyChildren();

            // scale image to fit
            const imageScale = (base.height / image.height());

            image.scale({
                x: imageScale,
                y: imageScale,
            });

            image.width(Math.round(image.width() * image.scaleX()));
            image.height(Math.round(image.height() * image.scaleY()));
            image.scaleX(1);
            image.scaleY(1);

            // move image to center
            const centerX = (layer.current.width() / 2) - (image.width() / 2);
            image.position({
                x: centerX,
                y: 0,
            });

            image.cache();
            // draw image
            layer.current.add(image);
            layer.current.draw();
        });
    }, []);

    return (
        <Layer ref={layer} listening={false}></Layer>
    );
}