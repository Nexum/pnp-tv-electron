import "../stylesheets/App.scss";

import Map from "./Map";
import ToolBar from "./ToolBar";
import ConfigStore from "../lib/ConfigStore";
import GDriveStore from "../lib/GDriveStore";
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useDrop} from 'react-dnd';
import Combat from "./Map/Combat";

export default function Screen({isGm}) {

    const token = ConfigStore.useConfig("gdrive.token");
    const folder = ConfigStore.useConfig("gdrive.folder");

    GDriveStore.setConfig({
        token: token,
        folder: folder,
    });

    const [, drop] = useDrop({
        accept: "configWindow",
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round(item.x + delta.x);
            const top = Math.round(item.y + delta.y);

            ConfigStore.set("configWindow." + item.id + ".pos", {
                x: left,
                y: top,
            });

            return undefined;
        },
    });

    return (
        <div className="screen" ref={drop}>
            <Map isGm={isGm}/>
            {isGm && <ToolBar/>}
            <Combat isGm={isGm}/>
        </div>
    );
}
