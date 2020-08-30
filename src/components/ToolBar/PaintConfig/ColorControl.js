import {useCallback, useEffect, useRef, useState} from "react";
import {SketchPicker} from 'react-color';
import ConfigStore from "../../../lib/ConfigStore";

export default function ColorControl({map, gmOptions, setGmOptions}) {
    if (!map || !map._id) {
        return null;
    }

    const markerColorRBGA = ConfigStore.useConfig("markerColorRGBA");

    function onChange(data) {
        ConfigStore.set("markerColor", data.hex);
        ConfigStore.set("markerColorRGBA", data.rgb);
        ConfigStore.set("markerColorAlpha", data.rgb.a);
    }

    return (
        <SketchPicker onChange={onChange} color={markerColorRBGA}/>
    );
}