import ElectronStore from "electron-store";
import EventEmitter from "events";
import ObjectID from "bson-objectid";
import {useEffect, useState} from "react";
import fs from "fs-jetpack";
import path from "path";
import {remote} from "electron";

const {app} = remote;

class MapStore extends EventEmitter {

    constructor() {
        super();

        this.Store = new ElectronStore({
            watch: true,
        });

        this.Store.onDidChange("maps", (newVal, oldValue) => {
            return this.emit("maps.change");
        });

        this.Store.onDidChange("fow", (newVal, oldValue) => {
            return this.emit("fow.change");
        });
    }

    getMaps() {
        return this.Store.get("maps", {});
    }

    getMapsArray() {
        return Object.keys(this.getMaps()).map(v => this.getMap(v));
    }

    getMap(_id) {
        return this.Store.get("maps." + _id, null);
    }

    getFow(_id) {
        return this.Store.get("fow." + _id, null);
    }

    getActiveFow() {
        const map = this.getActive();
        return this.getFow(map._id);
    }

    getActive() {
        const maps = this.getMaps();

        for (let _id in maps) {
            if (maps[_id].active) {
                return maps[_id];
            }
        }

        return null;
    }

    setActive(_id) {
        const maps = this.getMaps();

        if (!maps[_id]) {
            return null;
        }

        for (let mapId in maps) {
            maps[mapId].active = false;
        }

        maps[_id].active = true;

        this.Store.set("maps", maps);
    }

    delete(_id) {
        const maps = this.getMaps();
        delete maps[_id];
        this.Store.set("maps", maps);
        const mapsArr = this.getMapsArray();
        if (mapsArr.length) {
            this.setActive(mapsArr[0]._id);
        }
    }

    saveFow(_id, fow) {
        this.Store.set("fow." + _id, fow);
    }

    save(values) {
        if (!values._id) {
            values._id = (new ObjectID()).toHexString();
        }
        const maps = this.getMaps();

        if (values.active) {
            for (let mapId in maps) {
                maps[mapId].active = false;
            }
        }

        if (!maps[values._id]) {
            maps[values._id] = values;

            this.Store.set("maps", maps);
        } else {
            for (let path in values) {
                this.Store.set("maps." + values._id + "." + path, values[path]);
            }
        }

        return this.getMap(values._id);
    }

    getMapFilePath(_id) {
        return path.join(app.getPath("userData"), "maps", _id);
    }

    saveMapFile(_id, srcFilePath) {
        const targetFilePath = this.getMapFilePath(_id);
        fs.copy(srcFilePath, targetFilePath, {
            overwrite: true,
        });
        this.save({
            _id: _id,
            fileUpdatedAt: new Date(),
        });
    }

    useActive() {
        const [map, setMap] = useState(this.getActive());

        this.onChange(() => {
            setMap(this.getActive());
        });

        return [map, this.setActive.bind(this)];
    }

    useActiveFow() {
        const [fow, setFow] = useState(this.getActiveFow());

        this.onChangeFow(() => {
            setFow(this.getActiveFow());
        });

        return fow;
    }

    useArray() {
        const [maps, setMaps] = useState(this.getMapsArray());

        this.onChange(() => {
            setMaps(this.getMapsArray());
        });

        return maps;
    }

    onChange(cb) {
        useEffect(() => {
            this.on("maps.change", cb);

            return () => {
                this.off("maps.change", cb);
            };
        });
    }

    onChangeFow(cb) {
        useEffect(() => {
            this.on("fow.change", cb);

            return () => {
                this.off("fow.change", cb);
            };
        });
    }

}

export default new MapStore();