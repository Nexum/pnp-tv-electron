import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import ConfigStore from "../../../lib/ConfigStore";

export default function ShapeControl({map, setGmOptions, gmOptions}) {
    if (!map || !map._id) {
        return null;
    }

    const fowMode = ConfigStore.useConfig("fowMode");
    const fowBrushSize = ConfigStore.useConfig("fowBrushSize");

    function onSizeChange(e) {
        ConfigStore.set("fowBrushSize", parseInt(e.target.value));
    }

    function onModeChange(e) {
        ConfigStore.set("fowMode", e.target.value);
    }

    return (
        <>
            <div className="form-group">
                <select className="custom-select" value={fowMode || ""} onChange={onModeChange}>
                    <option value="add">Add Fog</option>
                    <option value="remove">Remove Fog</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="brush-size">Brush size ({fowBrushSize})</label>
                <input type="range" className="custom-range" min={40} max={200} name="brush-size" id="brush-size" onChange={onSizeChange}/>
            </div>
        </>
    );
}