import {useCallback, useEffect, useRef, useState} from "react";
import ResetButton from "./FowConfig/ResetButton";
import ShapeControl from "./FowConfig/ShapeControl";
import MapStore from "../../lib/MapStore";

export default function FowConfig({}) {
    const [map, setActive] = MapStore.useActive();

    return (
        <div className="d-flex">
            <div className="mr-1">
                <ShapeControl map={map}></ShapeControl>
            </div>
            <div>
                <ResetButton map={map}></ResetButton>
            </div>
        </div>
    );
}