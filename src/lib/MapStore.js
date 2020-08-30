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
            this.emit("maps.change");
            this.emit("fow.change");
            this.emit("marker.change");
        });
        this.Store.onDidChange("fow", (newVal, oldValue) => {
            return this.emit("fow.change");
        });

        this.Store.onDidChange("marker", (newVal, oldValue) => {
            return this.emit("marker.change");
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

    saveFow(_id, content) {
        const targetFilePath = this.getFowFilePath(_id);
        if (!content) {
            fs.remove(targetFilePath);
        } else {
            const data = content.replace(/^data:image\/\w+;base64,/, "");
            const buf = new Buffer(data, 'base64');
            fs.write(targetFilePath, buf);
        }
        this.Store.set("fow." + _id, Date.now());
    }

    saveMarker(_id, content) {
        const targetFilePath = this.getMarkerFilePath(_id);
        if (!content) {
            fs.remove(targetFilePath);
        } else {
            const data = content.replace(/^data:image\/\w+;base64,/, "");
            const buf = new Buffer(data, 'base64');
            fs.write(targetFilePath, buf);
        }
        this.Store.set("marker." + _id, Date.now());
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

    getFowFilePath(_id) {
        return path.join(app.getPath("userData"), "maps", "fow_" + _id + ".png");
    }

    getMarkerFilePath(_id) {
        return path.join(app.getPath("userData"), "maps", "marker_" + _id + ".png");
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
        const [fow, setFow] = useState(Date.now());

        this.onChangeFow(() => {
            console.log("MapStore.js:164 / FOW CHANGED");
            setFow(Date.now());
        });

        return fow;
    }

    useActiveMarker() {
        const [marker, setMarker] = useState(Date.now());

        this.onChangeMarker(() => {
            setMarker(Date.now());
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
        useEffect(() => {
            this.on("fow.change", cb);

            return () => {
                this.off("fow.change", cb);
            };
        }, [cb]);
    }

    onChangeMarker(cb) {
        useEffect(() => {
            this.on("marker.change", cb);

            return () => {
                this.off("marker.change", cb);
            };
        }, [cb]);
    }

}

export default new MapStore();