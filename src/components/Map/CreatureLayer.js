import {useEffect, useRef, useState} from "react";
import {Stage, Group, Layer, Rect, Image} from "react-konva";
import Creature from "./Object/Creature";
import MapStore from "../../lib/MapStore";
import CreatureStore from "../../lib/CreatureStore";
import ConfigStore from "../../lib/ConfigStore";

export default function CreatureLayer({isGm}) {
    const layer = useRef();
    const creatures = CreatureStore.useActiveCreatures();
    const creatureConfigs = ConfigStore.useConfig("gdrive.creatures");

    return (
        <Group ref={layer}>
            {creatures.map((v, i) => <Creature
                key={i}
                isGm={isGm}
                remoteConfig={creatureConfigs ? creatureConfigs[v.creatureType] || null : null}
                pos={{x: 100, y: 150}}
                scale={{x: 1, y: 1}}
                size={"small"}
                visible={false}
                currentHealth={v.health}
                {...v}/>)}
        </Group>
    );
}