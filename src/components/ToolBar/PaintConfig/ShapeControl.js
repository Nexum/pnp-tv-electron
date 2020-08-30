import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import {SketchPicker} from 'react-color';
import ConfigStore from "../../../lib/ConfigStore";

export default function ShapeControl({map, setGmOptions, gmOptions}) {
    if (!map || !map._id) {
        return null;
    }

    const paintMode = ConfigStore.useConfig("markerMode");
    const paintBrushSize = ConfigStore.useConfig("markerBrushSize");

    function onSizeChange(e) {
        ConfigStore.set("markerBrushSize", parseInt(e.target.value));
    }

    function onModeChange(e) {
        ConfigStore.set("markerMode", e.target.value);
        ConfigStore.set("markerColorAlpha", 1);
    }

    return (
        <>
            <div className="form-group">
                <select className="custom-select" value={paintMode} onChange={onModeChange}>
                    <option value="paint">Paint</option>
                    <option value="remove">Erase</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="brush-size">Brush size ({paintBrushSize})</label>
                <input type="range" className="custom-range"
                       min={10}
                       max={100}
                       value={paintBrushSize}
                       name="brush-size"
                       id="brush-size"
                       onChange={onSizeChange}/>
            </div>
        </>
    );
}