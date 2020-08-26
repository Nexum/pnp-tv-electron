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
                bottom: box.height + 16,
            });
        }
    }, [panel, win, map]);


    return (
        <div draggable className="config-window card" ref={win} style={{
            ...pos,
        }}>
            <div className="card-body">
                {<panel.config map={map} setGmOptions={setGmOptions} gmOptions={gmOptions}/>}
            </div>
        </div>
    );
}