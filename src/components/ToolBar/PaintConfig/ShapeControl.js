import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import {SketchPicker} from 'react-color';
import ConfigStore from "../../../lib/ConfigStore";

export default function ShapeControl({map, setGmOptions, gmOptions}) {
    if (!map || !map._id) {
        return null;
    }

    const paintMode = ConfigStore.useConfig("paintMode");
    const paintBrushSize = ConfigStore.useConfig("paintBrushSize");

    function onSizeChange(e) {
        ConfigStore.set("paintBrushSize", parseInt(e.target.value));
    }

    function onModeChange(e) {
        ConfigStore.set("paintMode", e.target.value);
        ConfigStore.set("paintColorAlpha", 1);
    }

    return (
        <>
            <div className="form-group">
                <select className="custom-select" value={paintMode} onChange={onModeChange}>
                    <option value="paint">Paint</option>
                    <option value="erase">Erase</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="brush-size">Brush size ({paintBrushSize})</label>
                <input type="range" className="custom-range" min={10} max={100} name="brush-size" id="brush-size" onChange={onSizeChange}/>
            </div>
        </>
    );
}