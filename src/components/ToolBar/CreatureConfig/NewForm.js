import {useCallback, useEffect, useRef, useState} from "react";
import MapStore from "../../../lib/MapStore";
import CreatureStore from "../../../lib/CreatureStore";
import CreatureTypeSelect from "./CreatureTypeSelect";

export default function NewForm({}) {
    const [map, setActive] = MapStore.useActive();
    const initialData = {
        health: 10,
        map: map._id,
        name: "",
    };
    const [data, setData] = useState(initialData);

    function onInputChange(path, {currentTarget}) {
        setData({
            ...data,
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

    async function handeSubmit() {
        CreatureStore.save({
            ...data,
            currentHealth: data.health,
            map: map._id,
        });
        setData({
            ...data,
            name: getNextName(data.name),
        });
    }

    function onSubmit(e) {
        e.preventDefault();
        handeSubmit();
        return false;
    }

    return (
        <form onSubmit={onSubmit} className="creature-form form p-2 panel mt-2">
            <h3>Create</h3>
            <div className="form-group">
                <input type="text" className="form-control" value={data.name} onChange={onInputChange.bind(null, "name")} placeholder="Creature name"/>
            </div>
            <div className="form-group">
                <input type="number" className="form-control" onChange={onInputChange.bind(null, "health")} value={data.health}/>
            </div>
            <div className="form-group">
                <select className="form-control" onChange={onInputChange.bind(null, "size")} value={data.size}>
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                    <option value="epic">epic</option>
                </select>
            </div>
            <div className="form-group">
                <CreatureTypeSelect onChange={onInputChange.bind(null, "imageType")} value={data.imageType}></CreatureTypeSelect>
            </div>
            <div className="form-group d-flex">
                <button className="btn btn-success flex-fill">Create</button>
            </div>
        </form>
    );
}