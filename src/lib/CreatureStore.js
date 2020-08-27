import ElectronStore from "electron-store";
import EventEmitter from "events";
import ObjectID from "bson-objectid";
import {useEffect, useState} from "react";
import fs from "fs-jetpack";
import path from "path";
import {remote} from "electron";
import MapStore from "./MapStore";
import ConfigStore from "./ConfigStore";

const {app} = remote;

class CreatureStore extends EventEmitter {

    constructor() {
        super();

        this.Store = new ElectronStore({
            watch: true,
        });

        this.Store.onDidChange("creatures", (newVal, oldValue) => {
            return this.emit("creatures.change");
        });
    }

    get(mapId, id) {
        if (id) {
            return this.Store.get("creatures." + mapId + "." + id);
        } else {
            const creatures = this.Store.get("creatures." + mapId);
            if (!creatures) {
                return [];
            }
            return Object.keys(creatures).map(v => creatures[v]);
        }
    }

    delete(map, _id) {
        const creatures = this.Store.get("creatures." + map, {});
        delete creatures[_id];
        this.Store.set("creatures." + map, creatures);
    }

    save(values) {
        if (!values._id) {
            values._id = (new ObjectID()).toHexString();
        }

        let existing = this.get(values.map, values._id);

        if (!existing) {
            this.Store.set("creatures." + values.map + "." + values._id, values);
        } else {
            for (let path in values) {
                existing[path] = values[path];
            }

            console.log("CreatureStore.js:59 / save", values, existing);
            this.Store.set("creatures." + values.map + "." + values._id, existing);
        }
    }


    onChange(cb) {
        useEffect(() => {
            this.on("creatures.change", cb);

            return () => {
                this.off("creatures.change", cb);
            };
        }, [cb]);
    }

    useActiveCreatures() {
        const map = MapStore.getActive();
        const [val, setValue] = useState(this.get(map._id));

        this.onChange(() => {
            const map = MapStore.getActive();
            setValue(this.get(map._id));
        });

        MapStore.onChange(() => {
            ConfigStore.set("selectedCreature", null);
            const map = MapStore.getActive();
            setValue(this.get(map._id));
        });

        return val;
    }
}

export default new CreatureStore();