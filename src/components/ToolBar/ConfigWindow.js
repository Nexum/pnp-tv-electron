import {useCallback, useEffect, useRef, useState} from "react";
import {useDrag} from 'react-dnd';
import ConfigStore from "../../lib/ConfigStore";

export default function ConfigWindow({map, panel, setGmOptions, gmOptions}) {
    const pos = ConfigStore.get("configWindow." + panel.configName + ".pos") || {};

    const [{isDragging}, win] = useDrag({
        item: {
            id: panel.configName,
            type: "configWindow",
            x: pos.x || 0,
            y: pos.y || 0,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    useEffect(() => {
        if (panel && panel.button && panel.button.current) {
            const box = panel.button.current.getBoundingClientRect();


        }
    }, [panel, win, map]);

    return (
        <div className="config-window" ref={win} style={{
            left: pos.x,
            top: pos.y,
        }}>
            <div className="config-window-body">
                {<panel.config map={map} setGmOptions={setGmOptions} gmOptions={gmOptions}/>}
            </div>
        </div>
    );
}