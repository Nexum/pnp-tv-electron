import {Group, Text, Rect, Transformer} from "react-konva";
import Konva from "konva";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";

export default function Creature({name, width, scale, visible, rotation, _id, height, pos, health, currentHealth, isGm}) {
    const group = useRef();
    const transformer = useRef();
    const [label, setLabel] = useState();
    const [percentage, setPercentage] = useState(currentHealth / health);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        setPercentage(Math.round((currentHealth / health) * 100));
    }, [health, currentHealth]);

    useEffect(() => {
        setLabel(`${name}`);
    }, [name, percentage]);

    useEffect(() => {
        if (isSelected) {
            transformer.current.setNode(group.current);
            transformer.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    async function saveCreature(data, e) {
        if (e) {
            e.cancelBubble = true;
        }

        await fetch(`/api/creature/${_id}/save`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async function deleteCreature() {
        await fetch(`/api/creature/${_id}/delete`, {
            method: "POST",
        });
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

    function onTransformEnd(e) {
        saveCreature({
            pos: {
                x: e.target.x(),
                y: e.target.y(),
            },
            scale: {
                x: e.target.scaleX(),
                y: e.target.scaleY(),
            },
            rotation: e.target.rotation(),
        });
    }

    function toggleSelected() {
        if (!isGm) {
            return;
        }

        setIsSelected(!isSelected);
    }

    return (
        <>
            <Group
                ref={group}
                x={pos.x}
                y={pos.y}
                scaleX={scale.x}
                scaleY={scale.y}
                rotation={rotation}
                draggable={isGm}
                onTransformEnd={onTransformEnd}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={toggleSelected}
                width={width}
                height={height}
            >
                <Rect
                    width={width + 4}
                    height={height + 4}
                    cornerRadius={3}
                    fill={"#240000"}
                >
                </Rect>

                <Rect
                    width={width * (percentage / 100)}
                    height={height}
                    x={2}
                    y={2}
                    cornerRadius={3}
                    fill={"#8a0303"}>
                </Rect>

                <Text
                    text={label}
                    fill={"#d6d6d6"}
                    padding={12}
                    fontStyle={"bold"}
                />

                <Text
                    text={percentage + "%"}
                    fill={"#d6d6d6"}
                    padding={12}
                    x={width - 50}
                    fontStyle={"bold"}
                />

                {isGm && <Text
                    text="👁"
                    fontSize={36}
                    x={width + 5}
                    fill={visible ? "#a5ff6c" : "#FF0000"}
                    onClick={saveCreature.bind(null, {
                        visible: !visible,
                    })}
                />}

                {isSelected && <Button
                    color={"#650e0e"}
                    textColor={"#FFFFFF"}
                    x={0}
                    y={group.current.height() + 5}
                    label={"Hit"}
                    onClick={saveCreature.bind(null, {
                        currentHealth: currentHealth - 1,
                    })}
                />}

                {isSelected && <Button
                    color={"#a5ff6c"}
                    x={40}
                    y={group.current.height() + 5}
                    label={"Heal"}
                    onClick={saveCreature.bind(null, {
                        currentHealth: currentHealth + 1,
                    })}
                />}

                {isSelected && <Button
                    color={"#a5ff6c"}
                    x={89}
                    y={group.current.height() + 5}
                    label={"Delete"}
                    onClick={deleteCreature}
                />}
            </Group>

            {isSelected && (
                <Transformer
                    ref={transformer}
                />
            )}
        </>
    );

}