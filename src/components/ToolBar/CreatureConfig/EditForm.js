import {useCallback, useEffect, useRef, useState} from "react";
import MapStore from "../../../lib/MapStore";
import CreatureStore from "../../../lib/CreatureStore";
import ConfigStore from "../../../lib/ConfigStore";

export default function EditForm({}) {
    const selected = ConfigStore.useConfig("selectedCreature");
    const [creature, setCreature] = useState(selected);

    useEffect(() => {
        if (selected) {
            setCreature(CreatureStore.get(selected.map, selected._id));
        } else {
            setCreature(null);
        }
    }, [selected]);

    if (!creature) {
        return null;
    }


    function onInputChange(path, {currentTarget}) {
        setCreature({
            ...creature,
            [path]: currentTarget.value,
        });
    }

    async function handeSubmit() {
        CreatureStore.save({
            name: creature.name,
            health: creature.health,
            currentHealth: creature.currentHealth,
            size: creature.size,
            map: creature.map,
            _id: creature._id,
        });
    }

    function onSubmit(e) {
        e.preventDefault();
        handeSubmit();
        return false;
    }

    return (
        <form onSubmit={onSubmit} className="creature-form form p-2 panel mt-2">
            <div className="form-group">
                <input type="text" className="form-control" value={creature.name} onChange={onInputChange.bind(null, "name")} placeholder="Name"/>
            </div>
            <div className="form-group">
                <div className="input-group">
                    <input type="number" className="form-control" onChange={onInputChange.bind(null, "currentHealth")} value={creature.currentHealth}/>
                    <span className="input-group-text">/</span>
                    <input type="number" className="form-control" onChange={onInputChange.bind(null, "health")} value={creature.health}/>
                </div>

            </div>
            <div className="form-group">
                <select className="form-control" onChange={onInputChange.bind(null, "size")} value={creature.size}>
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                </select>
            </div>
            <div className="form-group d-flex">
                <button className="btn btn-success flex-fill">Save</button>
            </div>
        </form>
    );
}