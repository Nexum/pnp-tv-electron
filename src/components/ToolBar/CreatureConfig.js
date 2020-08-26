import {useCallback, useEffect, useRef, useState} from "react";

export default function CreatureConfig({map}) {
    if (!map) {
        return null;
    }

    const initialData = {
        _id: "new",
        health: 10,
        map: map._id,
        pos: {
            x: 0,
            y: 0,
        },
        name: "",
    };
    const [data, setData] = useState(initialData);

    function onInputChange(path, {currentTarget}) {
        setData({
            ...data,
            [path]: currentTarget.value,
        });
    }

    async function handeSubmit() {
        await fetch(`/api/creature/${data._id}/save`, {
            method: "POST",
            body: JSON.stringify({
                ...data,
                map: map._id,
            }),
        });
        setData(initialData);
    }

    function onSubmit(e) {
        e.preventDefault();
        handeSubmit();
        return false;
    }

    return (
        <form onSubmit={onSubmit} className="creature-form form p-2 panel mt-2">
            <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" value={data.name} onChange={onInputChange.bind(null, "name")} placeholder="Creature name"/>
            </div>
            <div className="form-group">
                <label>Health points</label>
                <input type="number" className="form-control" onChange={onInputChange.bind(null, "health")} value={data.health}/>
            </div>
            <div className="form-group d-flex">
                <button className="btn btn-success flex-fill">Create</button>
            </div>
        </form>
    );
}