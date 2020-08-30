import "../stylesheets/App.scss";

import Map from "./Map";
import ToolBar from "./ToolBar";
import ConfigStore from "../lib/ConfigStore";
import GDriveStore from "../lib/GDriveStore";
import CreatureStore from "../lib/CreatureStore";

export default function Screen({isGm}) {

    const token = ConfigStore.useConfig("gdrive.token");
    const folder = ConfigStore.useConfig("gdrive.folder");
    GDriveStore.setConfig({
        token: token,
        folder: folder,
    });

    return (
        <>
            <Map isGm={isGm}/>
            {isGm && <ToolBar/>}
        </>
    );
}
