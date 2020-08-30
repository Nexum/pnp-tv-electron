import {useCallback, useEffect, useRef, useState} from "react";
import MapStore from "../../../lib/MapStore";
import CreatureStore from "../../../lib/CreatureStore";
import ConfigStore from "../../../lib/ConfigStore";

export default function Overview({}) {
    const selected = ConfigStore.useConfig("selectedCreature");
    const [map, setActiveMap] = MapStore.useActive();
    const creatures = CreatureStore.useActiveCreatures();
    const creatureConfigs = ConfigStore.useConfig("gdrive.creatures");

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

    function getNextName(name) {
        let parts = name.split(" ");
        let lastPart = parts.pop();

        if (lastPart.match(/[0-9]+/)) {
            return parts.join(" ") + " " + (parseInt(lastPart) + 1);
        }

        return name + " 1";
    }

    function createNew() {
        const selectedData = selected ? creatures.find((v => v._id === selected._id)) : null;
        const newCreature = CreatureStore.save({
            map: map._id,
            name: selectedData ? getNextName(selectedData.name) : "",
            health: selectedData ? selectedData.health : 0,
            currentHealth: selectedData ? selectedData.health : 0,
            size: selectedData ? selectedData.size : "small",
            imageType: selectedData ? selectedData.imageType : null,
        });

        select(newCreature);
    }

    return (
        <>

            <div className="creature-table-header">
                <button type="button" onClick={createNew} className={"btn btn-primary"}>+</button>
            </div>
            <div className="creature-table">
                <div className="d-flex flex-column">
                    {creatures.map((v, i) => {

                        let imgSrc = null;
                        if (creatureConfigs[v.imageType]) {
                            imgSrc = creatureConfigs[v.imageType].image;
                        }

                        return (
                            <div key={i} className={"d-flex creature-row " + (selected._id === v._id ? "selected" : "")}>
                                <div className="creature-name" onClick={select.bind(null, v)}>
                                    {imgSrc && <img src={imgSrc} style={{width: 20, height: 20}}/>}
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
                        );
                    })}
                </div>
            </div>
        </>
    );
}