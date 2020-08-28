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
            return this.emit("maps.change");
        });

        this.Store.onDidChange("marker", (newVal, oldValue) => {
            return this.emit("maps.change");
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

    getMarker(_id) {
        return this.Store.get("marker." + _id, null);
    }

    getActiveFow() {
        const map = this.getActive();

        if(!map) {
            return null;
        }

        return this.getFow(map._id);
    }

    getActiveMarker() {
        const map = this.getActive();

        if(!map) {
            return null;
        }

        return this.getMarker(map._id);
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
        this.emit("fow.change");
        this.emit("marker.change");
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

    saveMarker(_id, fow) {
        this.Store.set("marker." + _id, fow);
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
        } else {
            for (let path in values) {
                maps[values._id][path] = values[path];
            }
        }

        this.Store.set("maps", maps);
        return;
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

    useActiveMarker() {
        const [marker, setMarker] = useState(this.getActiveMarker());

        this.onChangeMarker(() => {
            setMarker(this.getActiveMarker());
        });

        return marker;
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
        }, [cb]);
    }

    onChangeFow(cb) {
        return this.onChange(cb);
    }

    onChangeMarker(cb) {
        return this.onChange(cb);
    }

}

export default new MapStore();