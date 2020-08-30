import {useCallback, useEffect, useRef, useState} from "react";
import MapStore from "../../../lib/MapStore";
import CreatureStore from "../../../lib/CreatureStore";
import ConfigStore from "../../../lib/ConfigStore";

export default function Overview({}) {
    const selected = ConfigStore.useConfig("selectedCreature");
    const creatures = CreatureStore.useActiveCreatures();

    function select(creature) {
        const {_id} = creature;
        ConfigStore.set("selectedCreature", {
            map: creature.map,
            _id: _id,
        });
    }

    function deleteCreature(creature) {
        CreatureStore.delete(creature.map, creature._id);
    }

    function toggleVisible(creature) {
        CreatureStore.save({
            visible: !creature.visible,
            map: creature.map,
            _id: creature._id,
        });
    }

    function onInputChange(creature, path, {currentTarget}) {
        CreatureStore.save({
            map: creature.map,
            _id: creature._id,
            [path]: currentTarget.value,
        });
    }

    return (
        <div className="creature-table">
            <div className="d-flex flex-column">
                {creatures.map((v, i) => (
                    <div key={i} className={"d-flex creature-row " + (selected._id === v._id ? "selected" : "")}>
                        <div className="creature-name" onClick={select.bind(null, v)}>
                            <img src={v.imageType} style={{width: 20, height: 20}}/>
                            <input type="text" value={v.name} onChange={onInputChange.bind(null, v, "name")}/>
                        </div>


                        <div className="creature-health">
                            <input type="text" value={v.currentHealth} onChange={onInputChange.bind(null, v, "currentHealth")}/>
                            /
                            <input type="text" value={v.health} onChange={onInputChange.bind(null, v, "health")}/>
                        </div>


                        <div className="creature-actions">
                            <button
                                type="button"
                                onClick={toggleVisible.bind(null, v)}
                                className={"btn btn-sm " + (v.visible ? "btn-primary" : "btn-danger")}>
                                👁
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={deleteCreature.bind(this, v)}>
                                X
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}