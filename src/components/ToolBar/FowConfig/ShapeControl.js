import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";

export default function ShapeControl({map, setGmOptions, gmOptions}) {
    if (!map || !map._id) {
        return null;
    }

    function onSizeChange(e) {
        setGmOptions({
            fowBrushSize: parseInt(e.target.value),
        });
    }

    function onModeChange(e) {
        setGmOptions({
            fowMode: e.target.value,
        });
    }

    return (
        <>
            <div className="form-group">
                <select className="custom-select" value={gmOptions.fowMode} onChange={onModeChange}>
                    <option value="add">Add Fog</option>
                    <option value="remove">Remove Fog</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="brush-size">Brush size ({gmOptions.fowBrushSize})</label>
                <input type="range" className="custom-range" min={40} max={200} name="brush-size" id="brush-size" onChange={onSizeChange}/>
            </div>
        </>
    );
}