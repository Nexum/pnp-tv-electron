import {useCallback, useEffect, useRef, useState} from "react";
import {SketchPicker} from 'react-color';
import ConfigStore from "../../../lib/ConfigStore";

export default function ColorControl({map, gmOptions, setGmOptions}) {
    if (!map || !map._id) {
        return null;
    }

    const paintColorRBGA = ConfigStore.useConfig("paintColorRGBA");

    function onChange(data) {
        ConfigStore.set("paintColor", data.hex);
        ConfigStore.set("paintColorRGBA", data.rgb);
        ConfigStore.set("paintColorAlpha", data.rgb.a);
    }

    return (
        <SketchPicker onChange={onChange} color={paintColorRBGA}/>
    );
}