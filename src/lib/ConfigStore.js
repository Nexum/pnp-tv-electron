import ElectronStore from "electron-store";
import EventEmitter from "events";
import ObjectID from "bson-objectid";
import {useEffect, useState} from "react";
import fs from "fs-jetpack";
import path from "path";
import {remote} from "electron";

const {app} = remote;

class ConfigStore extends EventEmitter {

    constructor() {
        super();

        this.Store = new ElectronStore({
            defaults: {
                config: {
                    activeToolbarItem: null,
                    gmUiVisible: true,
                    fowMode: "remove",
                    fowBrushSize: 100,
                    paintColor: "#FF0000",
                    paintBrushSize: 100,
                    paintColorAlpha: 0.8,
                    paintColorRGBA: "#FF0000",
                    paintMode: "add",
                    selectedCreature: null,
                },
            },
            watch: true,
        });

        this.Store.onDidChange("config", (newVal, oldValue) => {
            return this.emit("config.change");
        });

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(path, e) {
        this.set(path, e.target.value);
    }

    get(path) {

        if (path === "effects") {
            return {
                1: {
                    name: "Explosion",
                    file: "1.Explosion.png",
                    rows: 4,
                    size: 64,
                    frames: 16,
                    frameRate: 16,
                    loop: false,
                    bounce: true,
                    reverse: true,
                },
                2: {
                    name: "Smoke",
                    file: "2.Smoke.png",
                    rows: 5,
                    size: 256,
                    frames: 30,
                    frameRate: 16,
                    loop: true,
                    bounce: false,
                    reverse: false,
                },
                3: {
                    name: "Fire",
                    file: "3.Fire.png",
                    rows: 1,
                    size: 81,
                    height: 123,
                    frames: 40,
                    frameRate: 16,
                    loop: true,
                    bounce: false,
                    reverse: true,
                },
                4: {
                    name: "Magic Circle",
                    file: "4.Magic-Circle.png",
                    rows: 4,
                    size: 256,
                    frames: 32,
                    frameRate: 16,
                    loop: false,
                    bounce: false,
                    reverse: false,
                },
            };
        }

        return this.Store.get("config." + path);
    }

    set(path, value) {
        console.log("ConfigStore.js:44 / set", path, value);
        this.Store.set("config." + path, value);
    }

    getEffectFilePath(file) {
        return path.join("img", "effects", file);
    }


    onChange(cb) {
        useEffect(() => {
            this.on("config.change", cb);

            return () => {
                this.off("config.change", cb);
            };
        }, [cb]);
    }

    useConfig(path) {
        const [val, setValue] = useState(this.get(path));

        this.onChange(() => {
            setValue(this.get(path));
        });

        return val;
    }
}

export default new ConfigStore();