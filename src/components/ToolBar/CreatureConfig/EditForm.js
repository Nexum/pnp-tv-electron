import {useCallback, useEffect, useRef, useState} from "react";
import MapStore from "../../../lib/MapStore";
import CreatureStore from "../../../lib/CreatureStore";
import ConfigStore from "../../../lib/ConfigStore";
import CreatureTypeSelect from "./CreatureTypeSelect";

export default function EditForm({}) {
    const selected = ConfigStore.useConfig("selectedCreature");
    const creatures = CreatureStore.useActiveCreatures();
    const [creature, setCreature] = useState(selected);

    useEffect(() => {
        if (selected) {
            setCreature(CreatureStore.get(selected.map, selected._id));
        } else {
            setCreature(null);
        }
    }, [selected, creatures]);

    if (!creature) {
        return null;
    }

    function onInputChange(path, {currentTarget}) {
        CreatureStore.save({
            map: creature.map,
            _id: creature._id,
            [path]: currentTarget.value,
        });
    }

    function toggleVisible() {
        CreatureStore.save({
            visible: !creature.visible,
            map: creature.map,
            _id: creature._id,
        });

        setCreature({
            ...creature,
            visible: !creature.visible,
        });
    }

    return (
        <form className="creature-form form p-2 panel mt-2">
            <h3>Edit</h3>
            <div className="form-group">
                <select className="form-control" onChange={onInputChange.bind(null, "size")} value={creature.size}>
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                    <option value="epic">epic</option>
                </select>
            </div>
            <div className="form-group">
                <CreatureTypeSelect onChange={onInputChange.bind(null, "imageType")} value={creature.imageType}></CreatureTypeSelect>
            </div>
            <div className="form-group d-flex">
                <button type="button" onClick={toggleVisible} className={"btn flex-fill " + (creature.visible ? "btn-primary" : "btn-danger")}>👁</button>
            </div>
        </form>
    );
}