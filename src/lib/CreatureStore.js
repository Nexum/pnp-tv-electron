import ElectronStore from "electron-store";
import EventEmitter from "events";
import ObjectID from "bson-objectid";
import {useEffect, useState} from "react";
import fs from "fs-jetpack";
import path from "path";
import {remote} from "electron";

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

    getAll() {
        const creatures = this.Store.get("creatures");

        return Object.keys(creatures).map(v => creatures[v]);
    }

    get(_id) {
        return this.Store.get("creatures." + _id);
    }

    save(values) {
        if (!values._id) {
            values._id = (new ObjectID()).toHexString();
        }

        const existing = this.get(_id);

        if (!existing) {
            this.Store.set("creatures." + _id, values);
        } else {
            for (let path in values) {
                this.Store.set("creatures." + values._id + "." + path, values[path]);
            }
        }

        return this.get(values._id);
    }


    onChange(cb) {
        useEffect(() => {
            this.on("creatures.change", cb);

            return () => {
                this.off("creatures.change", cb);
            };
        });
    }

    useCreatures(path) {
        const [val, setValue] = useState(this.get(path));

        this.onChange(() => {
            setValue(this.get(path));
        });

        return val;
    }
}

export default new CreatureStore();