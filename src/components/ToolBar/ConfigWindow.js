import {useCallback, useEffect, useRef, useState} from "react";

export default function ConfigWindow({map, panel, setGmOptions, gmOptions}) {
    const win = useRef();
    const [pos, setPos] = useState({
        bottom: 36,
        left: 0,
    });

    useEffect(() => {
        if (panel && panel.button && panel.button.current) {
            const box = panel.button.current.getBoundingClientRect();

            setPos({
                left: box.left,
                top: box.height + 0,
            });
        }
    }, [panel, win, map]);


    return (
        <div className="config-window" ref={win} style={{
            ...pos,
        }}>
            <div className="config-window-body">
                {<panel.config map={map} setGmOptions={setGmOptions} gmOptions={gmOptions}/>}
            </div>
        </div>
    );
}