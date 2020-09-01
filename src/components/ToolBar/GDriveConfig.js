import ConfigStore from "../../lib/ConfigStore";
import GDriveStore from "../../lib/GDriveStore";
import {useState} from "react";


export default function GDriveConfig({}) {

    const [reloading, setReloading] = useState(false);
    const [error, setError] = useState(null);

    async function reload() {
        if (reloading) {
            return;
        }

        setReloading(true);
        try {
            await GDriveStore.reloadCreatures();
            await GDriveStore.reloadEffects();
        } catch (e) {
            setError(e.toString());
        }
        ConfigStore.set("gdrive.loaded", true);
        setReloading(false);
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <form>
                    <div className="form-group">
                        <label>API Token</label>
                        <input type="text" className="form-control" value={ConfigStore.useConfig("gdrive.token")}
                               onChange={ConfigStore.onInputChange.bind(null, "gdrive.token")}/>
                    </div>
                    <div className="form-group">
                        <label>Gdrive Creature Folder</label>
                        <input type="text" className="form-control" value={ConfigStore.useConfig("gdrive.folder")}
                               onChange={ConfigStore.onInputChange.bind(null, "gdrive.folder")}/>
                    </div>
                    <div className="form-group">
                        <label>Gdrive Effect Folder</label>
                        <input type="text" className="form-control" value={ConfigStore.useConfig("gdrive.folderEffects")}
                               onChange={ConfigStore.onInputChange.bind(null, "gdrive.folderEffects")}/>
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-primary" onClick={reload}>{reloading ? "Reloading..." : "Reload All Data"}</button>
                    </div>
                    {error ? <p>{error}</p> : ""}
                </form>
            </div>
        </div>
    );
}