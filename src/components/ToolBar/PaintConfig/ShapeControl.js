import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import { SketchPicker } from 'react-color';

export default function ShapeControl({map, setGmOptions, gmOptions}) {
    if (!map || !map._id) {
        return null;
    }

    function onSizeChange(e) {
        setGmOptions({
            paintBrushSize: parseInt(e.target.value),
        });
    }

    function onModeChange(e) {
        setGmOptions({
            paintMode: e.target.value,
            paintColorAlpha: 1,
        });
    }

    return (
        <>
            <div className="form-group">
                <select className="custom-select" value={gmOptions.paintMode} onChange={onModeChange}>
                    <option value="paint">Paint</option>
                    <option value="erase">Erase</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="brush-size">Brush size ({gmOptions.paintBrushSize})</label>
                <input type="range" className="custom-range" min={10} max={100} name="brush-size" id="brush-size" onChange={onSizeChange}/>
            </div>
            <div className="form-group">
                <select className="custom-select" value={gmOptions.paintMode} onChange={onModeChange}>
                    <option value="paint">Paint</option>
                    <option value="erase">Erase</option>
                </select>
            </div>
        </>
    );
}