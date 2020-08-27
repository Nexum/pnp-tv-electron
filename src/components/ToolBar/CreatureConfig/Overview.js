import {useCallback, useEffect, useRef, useState} from "react";
import MapStore from "../../../lib/MapStore";
import CreatureStore from "../../../lib/CreatureStore";
import ConfigStore from "../../../lib/ConfigStore";

export default function Overview({}) {
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

    return (
        <div className="creature-table">
            <table className="table table-striped">
                <tbody>
                {creatures.map((v, i) => (
                    <tr key={i}>
                        <td><a className="creature-name" onClick={select.bind(null, v)}>{v.name}</a></td>
                        <td>{v.currentHealth} / {v.health}</td>
                        <td>
                            <button className="btn btn-sm btn-danger" onClick={deleteCreature.bind(this, v)}>X</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}