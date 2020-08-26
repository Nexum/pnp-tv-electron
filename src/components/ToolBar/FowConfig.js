import {useCallback, useEffect, useRef, useState} from "react";
import ResetButton from "./FowConfig/ResetButton";
import ShapeControl from "./FowConfig/ShapeControl";

export default function FowConfig({map, setGmOptions, gmOptions}) {
    return (
        <div className="d-flex">
            <div className="mr-1">
                <ShapeControl map={map} setGmOptions={setGmOptions} gmOptions={gmOptions}></ShapeControl>
            </div>
            <div>
                <ResetButton map={map}></ResetButton>
            </div>
        </div>
    );
}