import {useEffect, useRef, useState} from "react";
import {Group, Sprite, Line, Rect} from "react-konva";
import ConfigStore from "../../lib/ConfigStore";
import Effect from "./Object/Effect";

export default function EffectLayer({isGm, base}) {
    const layerGroup = useRef();
    const effects = ConfigStore.useConfig("gdrive.effects");
    const activeEffects = ConfigStore.useConfig("activeEffects") || [];

    return (
        <Group ref={layerGroup}>
            {activeEffects.map((v, i) => {

                if (!effects[v.effect]) {
                    return null;
                }

                return <Effect
                    config={effects[v.effect]}
                    isGm={isGm}
                    visible={v.visible}
                    rotation={v.rotation || 0}
                    scale={v.scale || {x: 1, y: 1}}
                    pos={v.pos || {x: 100, y: 100}}
                    configKey={i}
                    key={v._id}
                />;
            })}
        </Group>
    );
}