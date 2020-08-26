import {useCallback, useEffect, useRef, useState} from "react";
import ShapeControl from "./PaintConfig/ShapeControl";
import ResetButton from "./PaintConfig/ResetButton";
import ColorControl from "./PaintConfig/ColorControl";

export default function FowConfig({map, setGmOptions, gmOptions}) {

    const [colorPickerActive, setColorPickerActive] = useState();

    function toggleColorPicker() {
        setColorPickerActive(!colorPickerActive);
    }

    return (
        <div className="d-flex">
            <div className="mr-1">
                <ShapeControl map={map} setGmOptions={setGmOptions} gmOptions={gmOptions}></ShapeControl>
            </div>
            <div className="mr-1">
                <div className="mb-1">
                    <ResetButton map={map}></ResetButton>
                </div>
                <div>
                    <button type="button" className="btn btn-danger" onClick={toggleColorPicker}>
                        {colorPickerActive ? "Close" : "Open"} colorpicker
                    </button>
                </div>
            </div>
            {colorPickerActive && <ColorControl map={map} setGmOptions={setGmOptions} gmOptions={gmOptions}></ColorControl>}
        </div>
    );
}