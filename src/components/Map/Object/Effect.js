import {Group, Rect, Sprite, Transformer} from "react-konva";
import {useEffect, useRef, useState} from "react";
import ConfigStore from "../../../lib/ConfigStore";
import {HotKeys} from "react-hotkeys";

export default function Effect({config, pos, scale, rotation, configKey}) {

    const [image, setImage] = useState(null);
    const [selected, setSelected] = useState(false);

    const sprite = useRef();
    const transformer = useRef();

    useEffect(() => {
        let imageObj = new Image();
        imageObj.onload = function () {
            setImage(imageObj);
        };
        const filePath = ConfigStore.getEffectFilePath(config.file);
        imageObj.src = filePath;
    }, [config]);

    useEffect(() => {
        if (sprite.current) {
            sprite.current.start();

            sprite.current.on('frameIndexChange', function () {
                if (!config.loop) {
                    let lastFrame = config.frames;
                    if (config.bounce) {
                        lastFrame = lastFrame * 2;
                    }

                    if (this.frameIndex() === lastFrame - 1) {
                        sprite.current.stop();
                        deleteEffect();
                    }
                }
            });
        }
    }, [image]);

    useEffect(() => {
        if (selected && transformer.current && sprite.current) {
            transformer.current.setNode(sprite.current);
            transformer.current.getLayer().batchDraw();
        }
    }, [selected]);

    let animations = {idle: []};
    const perRow = Math.ceil(config.frames / config.rows);

    for (let row = 0; row < (config.rows || 1); row++) {
        for (let i = 0; i < perRow; i++) {
            let frameConfig = [
                i * config.size,
                row * config.size,
                config.size,
                config.height || config.size,
            ];

            animations.idle.push(frameConfig);
        }
    }

    if (config.reverse) {
        animations.idle.reverse();
    }

    if (config.bounce) {
        const copy = animations.idle.concat([]);
        copy.reverse();
        animations.idle = animations.idle.concat(copy);
    }

    const idle = animations.idle;
    animations.idle = [];
    for (let i = 0; i < idle.length; i++) {
        const animationFrame = idle[i];
        animations.idle = animations.idle.concat(animationFrame);
    }

    function onDragEnd(e) {
        const effects = ConfigStore.get("activeEffects");
        effects[configKey].pos = {
            x: e.target.x(),
            y: e.target.y(),
        };
        ConfigStore.set("activeEffects", effects);
    }

    function onTransformEnd(e) {
        const effects = ConfigStore.get("activeEffects");
        effects[configKey].scale = {
            x: e.target.attrs.scaleX,
            y: e.target.attrs.scaleY,
        };
        /*
        effects[configKey].pos = {
            x: e.target.x(),
            y: e.target.y(),
        };
         */
        effects[configKey].rotation = e.target.attrs.rotation;
        ConfigStore.set("activeEffects", effects);
    }

    function toggleSelected() {
        setSelected(!selected);
    }

    function deleteEffect() {
        if (!selected) {
            return;
        }

        const effects = ConfigStore.get("activeEffects");
        effects.splice(configKey, 1);
        ConfigStore.set("activeEffects", effects);
    }

    return (
        <>
            <Group
                x={pos.x}
                y={pos.y}
                draggable={true}
                onDragEnd={onDragEnd}
            >
                {image && <Sprite
                    drawBorder={true}
                    ref={sprite}
                    rotation={rotation}
                    scaleX={scale.x}
                    onClick={toggleSelected}
                    onTransformEnd={onTransformEnd}
                    scaleY={scale.y}
                    animation={"idle"}
                    frameRate={config.frameRate}
                    animations={animations}
                    width={config.size}
                    height={config.height || config.size}
                    image={image}
                />}
                {selected && <Rect
                    width={50}
                    height={50}
                    fill={"#FF0000"}
                    x={sprite.current.width() * scale.x}
                    y={0}
                    onClick={deleteEffect}
                />}
            </Group>
            {selected && <Transformer
                ref={transformer}
            />}
        </>
    );

}