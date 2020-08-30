import {Group, Text, Line, Label, Circle, Wedge} from "react-konva";
import Konva from "konva";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import CreatureStore from "../../../lib/CreatureStore";
import ConfigStore from "../../../lib/ConfigStore";

export default function Creature({name, scale, map, visible, size, remoteConfig, rotation, _id, pos, health, currentHealth, isGm}) {
    const group = useRef();
    const dragLine = useRef();
    const [label, setLabel] = useState();
    const [dragLinePointsStart, setDragLinePointsStart] = useState([]);
    const [dragLinePointsCurrent, setDragLinePointsCurrent] = useState([]);
    const [fillImage, setFillImage] = useState();
    const [percentage, setPercentage] = useState(currentHealth / health);
    const selectedCreature = ConfigStore.useConfig("selectedCreature");
    const sizes = {
        small: 40,
        medium: 60,
        large: 80,
        epic: 140,
    };
    const width = sizes[size];

    useEffect(() => {
        setPercentage(Math.round((currentHealth / health) * 100));
    }, [health, currentHealth]);

    useEffect(() => {
        setLabel(`${name}`);
    }, [name, percentage]);

    useEffect(() => {
        if (!remoteConfig) {
            setFillImage(null);
            return;
        }

        const image = new Image();
        image.onload = function () {
            setFillImage(image);
        };

        image.src = remoteConfig.image;
    }, [remoteConfig]);

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
        const pos = group.current.position();

        setDragLinePointsStart([
            pos.x,
            pos.y,
        ]);

        group.current.moveToTop();
    }

    function onDragMove(e) {
        setDragLinePointsCurrent([
            e.target.x(),
            e.target.y(),
        ]);
    }

    function onDragEnd(e) {
        saveCreature({
            moving: null,
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
    const isSelected = selectedCreature && selectedCreature._id === _id;

    if (!visible && !isGm) {
        return null;
    }

    let midpoint = null;
    let distance = 0;
    let distanceInch = 0;

    if (dragLinePointsStart[0] && dragLinePointsCurrent[0]) {
        distance = Math.sqrt(Math.pow(dragLinePointsStart[0] - dragLinePointsCurrent[0], 2) + Math.pow(dragLinePointsStart[1] - dragLinePointsCurrent[1], 2));
        distanceInch = (distance / 30).toFixed(2);
        midpoint = {
            x: (dragLinePointsStart[0] + dragLinePointsCurrent[0]) / 2,
            y: (dragLinePointsStart[1] + dragLinePointsCurrent[1]) / 2,
        };
    }

    if (group && group.current && group.current.isDragging()) {

        if (distance < width + 20) {
            dragLine.current.moveToTop();
        } else {
            group.current.moveToTop();
        }
    }

    return (
        <>
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
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onClick={toggleSelected}
            >

                <Wedge
                    radius={(width / 2) + 8}
                    fill={"#8a0303"}
                    opacity={0.8}
                    angle={360 * (percentage / 100)}
                    rotation={-90}
                    shadowOpacity={0.4}
                    shadowBlur={4}
                    shadowOffset={{x: 3, y: 3}}
                    shadowEnabled={true}
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
                    strokeWidth={4}
                    stroke={isSelected ? "#00d8ff" : "#000000"}
                >
                </Circle>

                <Text
                    text={label}
                    fill={"#d6d6d6"}
                    width={900}
                    height={width}
                    listening={false}
                    x={-450}
                    y={25}
                    align={"center"}
                    wrap={"none"}
                    verticalAlign={"middle"}
                    fontStyle={"bold"}
                />
                <Text
                    text={visible && isGm ? '👁 ' : ''}
                    fill={"#d6d6d6"}
                    width={900}
                    height={width}
                    listening={false}
                    x={-450}
                    y={-1 * width}
                    align={"center"}
                    wrap={"none"}
                    verticalAlign={"middle"}
                    fontStyle={"bold"}
                />
            </Group>
            <Group ref={dragLine} opacity={(group && group.current && group.current.isDragging() ? 1 : 0)}>
                <Line
                    points={[
                        ...dragLinePointsStart,
                        ...dragLinePointsCurrent,
                    ]}
                    stroke={"#ccffc9"}
                    strokeWidth={4}
                />
                {midpoint && (
                    <Text
                        x={dragLinePointsStart[0]}
                        y={dragLinePointsStart[1]}
                        text={distanceInch + " inch"}
                        fill={"#d6d6d6"}
                        fontStyle={"bold"}
                    />
                )}
            </Group>
        </>
    );

}