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


    function onInputChange(path, {currentTarget}) {
        let val = typeof currentTarget.checked !== "undefined" ? currentTarget.checked : currentTarget.value;

        CreatureStore.save({
            map: creature.map,
            _id: creature._id,
            [path]: val,
        });
    }

    function onTypeChange(value) {
        console.log("EditForm.js:32 / onTypeChange", value);
        CreatureStore.save({
            map: creature.map,
            _id: creature._id,
            creatureType: value._id,
            size: value.size,
            health: value.health,
            currentHealth: value.health,
            initiative: value.initiative || 0,
        });
    }

    if (!creature) {
        return null;
    }

    return (
        <form className="creature-form form p-2 panel mt-2">
            <h3>Edit</h3>
            <div className="form-group">
                <label>Size</label>
                <select className="form-control" onChange={onInputChange.bind(null, "size")} value={creature.size}>
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                    <option value="epic">epic</option>
                </select>
            </div>
            <div className="form-group">
                <label>Typ</label>
                <CreatureTypeSelect onChange={onTypeChange} value={creature.creatureType}></CreatureTypeSelect>
            </div>
            <div className="form-check">
                <input className="form-check-input"
                       onChange={onInputChange.bind(null, "visible")}
                       type="checkbox"
                       checked={creature ? creature.visible : false}
                       value={true}
                       id="visibleCheck"/>
                <label className="form-check-label" htmlFor="visibleCheck">
                    Visible
                </label>
            </div>
        </form>
    );
}