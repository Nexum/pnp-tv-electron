import {Group, Text, Sprite, Transformer} from "react-konva";
import {useEffect, useRef, useState} from "react";
import ConfigStore from "../../../lib/ConfigStore";

export default function Effect({config, pos, scale, isGm, rotation, visible, configKey}) {

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

    function hideEffect(effectKey) {
        const effects = ConfigStore.get("activeEffects");
        effects[effectKey].visible = false;
        ConfigStore.set("activeEffects", effects);
    }

    useEffect(() => {
        if (sprite.current) {
            sprite.current.start();

            sprite.current.on('frameIndexChange', function () {
                if (!config.loop && !isGm) {
                    let lastFrame = config.frames;
                    if (config.bounce) {
                        lastFrame = lastFrame * 2;
                    }

                    if (this.frameIndex() === lastFrame - 1) {
                        sprite.current.stop();
                        hideEffect(configKey);
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

        console.log("Effect.js:120 / Effect", config.name, e.target.scaleX());
        const effects = ConfigStore.get("activeEffects");
        effects[configKey].scale = {
            x: e.target.scaleX(),
            y: e.target.scaleY(),
        };
        effects[configKey].pos = {
            x: e.target.x(),
            y: e.target.y(),
        };
        effects[configKey].rotation = e.target.attrs.rotation;
        ConfigStore.set("activeEffects", effects);
    }

    function toggleSelected() {
        setSelected(!selected);
    }


    if (!isGm && !visible) {
        return null;
    }

    return (
        <>
            {image && <Sprite
                drawBorder={true}
                x={pos.x}
                y={pos.y}
                draggable={true}
                onDragEnd={onDragEnd}
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
            {selected && <Transformer
                ref={transformer}
            />}
        </>
    );

}