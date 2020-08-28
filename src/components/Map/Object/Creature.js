import {Group, Text, Rect, Transformer, Circle, Wedge} from "react-konva";
import Konva from "konva";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import CreatureStore from "../../../lib/CreatureStore";
import ConfigStore from "../../../lib/ConfigStore";

export default function Creature({name, scale, map, visible, size, imageType, rotation, _id, pos, health, currentHealth, isGm}) {
    const group = useRef();
    const [label, setLabel] = useState();
    const [fillImage, setFillImage] = useState();
    const [percentage, setPercentage] = useState(currentHealth / health);
    const selectedCreature = ConfigStore.useConfig("selectedCreature");
    const sizes = {
        small: 80,
        medium: 120,
        large: 150,
    };
    const width = sizes[size];

    useEffect(() => {
        setPercentage(Math.round((currentHealth / health) * 100));
    }, [health, currentHealth]);

    useEffect(() => {
        setLabel(`${name}`);
    }, [name, percentage]);

    useEffect(() => {
        if (!imageType) {
            setFillImage(null);
            return;
        }

        const image = new Image();
        image.onload = function () {
            setFillImage(image);
        };

        image.src = imageType;
    }, [imageType]);

    async function saveCreature(data, e) {
        if (e) {
            e.cancelBubble = true;
        }

        CreatureStore.save({
            ...data,
            map,
            _id,
        });
    }

    async function deleteCreature() {
        CreatureStore.delete(map, _id);
    }

    function onDragStart() {
        group.current.moveToTop();
    }

    function onDragEnd(e) {
        saveCreature({
            pos: {
                x: e.target.x(),
                y: e.target.y(),
            },
        });
    }

    function toggleSelected() {
        if (!isGm) {
            return;
        }

        ConfigStore.set("selectedCreature", {
            map: map,
            _id: _id,
        });
    }

    const groupHeight = group && group.current && group.current.height();
    const groupWidth = group && group.current && group.current.width();
    const patternScale = fillImage ? width / fillImage.width : 1;
    const isSelected = selectedCreature._id === _id;

    if (!visible && !isGm) {
        return null;
    }

    return (
        <Group
            ref={group}
            x={pos.x}
            y={pos.y}
            scaleX={scale.x}
            scaleY={scale.y}
            width={width}
            height={width}
            rotation={rotation}
            draggable={isGm}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={toggleSelected}
        >
            <Wedge
                radius={(width / 2) + 8}
                fill={"#8a0303"}
                angle={360 * (percentage / 100)}
                rotationDeg={-90}
            >
            </Wedge>

            <Circle
                radius={(width / 2)}
                x={0}
                y={0}
                fill={fillImage ? null : "#410000"}
                fillPatternImage={fillImage}
                fillPatternX={-1 * (width / 2)}
                fillPatternY={-1 * (width / 2)}
                fillPatternScale={{x: patternScale, y: patternScale}}
                fillPatternRepeat="no-repeat"
                stroke={isSelected ? "#00d8ff" : null}
            >
            </Circle>

            <Text
                text={(visible && isGm ? '👁 ' : '') + label + "\n" + percentage + "%"}
                fill={"#d6d6d6"}
                width={width}
                height={width}
                x={(groupWidth / 2) * -1}
                y={30}
                align={"center"}
                verticalAlign={"middle"}
                fontStyle={"bold"}
            />
        </Group>
    );

}