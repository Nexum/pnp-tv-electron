import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import {SketchPicker} from 'react-color';

export default function ColorControl({map, gmOptions, setGmOptions}) {
    if (!map || !map._id) {
        return null;
    }


    function onChange(data) {
        setGmOptions({
            paintColor: data.hex,
            paintColorRBGA: data.rgb,
            paintColorAlpha: data.rgb.a,
        });
    }


    return (
        <SketchPicker onChange={onChange} color={gmOptions.paintColorRBGA}/>
    );
}