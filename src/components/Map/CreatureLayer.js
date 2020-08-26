import {useEffect, useRef, useState} from "react";
import {Stage, Layer, Rect, Image} from "react-konva";
import Creature from "./Object/Creature";

export default function CreatureLayer({map, isGm}) {
    const layer = useRef();
    const [creatures, setCreatures] = useState([]);

    async function getData() {
        if (!map) {
            setCreatures([]);
            return;
        }

        // @TODO Load Creatures
        setCreatures([]);
    }

    useEffect(() => {
        getData();
    }, [map]);

    return (
        <Layer ref={layer}>
            {creatures.map((v, i) => <Creature key={i} isGm={isGm} {...v}/>)}
        </Layer>
    );
}