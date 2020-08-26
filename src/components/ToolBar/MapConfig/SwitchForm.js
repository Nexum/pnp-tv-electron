import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import MapStore from "../../../lib/MapStore";

export default function SwitchForm({map}) {
    const maps = MapStore.useArray();

    async function switchMap(e) {
        MapStore.setActive(e.target.value);
    }

    if (!maps || !maps.length) {
        return null;
    }

    return (
        <div className="form-group">
            <label htmlFor="modify-name">Switch map</label>
            <select className="custom-select" onChange={switchMap} value={map ? map._id : ""}>
                {maps.map((v, i) => {
                    return <option key={i} value={v._id}>{v.name}</option>;
                })}
            </select>
        </div>
    );
}