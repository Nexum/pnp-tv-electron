import ElectronStore from "electron-store";
import EventEmitter from "events";
import ObjectID from "bson-objectid";
import {useEffect, useState} from "react";

class PlayerStore extends EventEmitter {

    constructor() {
        super();

        this.Store = new ElectronStore({
            watch: true,
        });

        this.Store.onDidChange("players", (newVal, oldValue) => {
            return this.emit("players.change");
        });

        //this.Store.set("players", {});
    }


    get(id) {
        if (id) {
            return this.Store.get("players." + id);
        } else {
            const players = this.Store.get("players", []);
            return Object.keys(players).map(v => players[v]);
        }
    }

    delete(id) {
        const players = this.Store.get("players", {});
        delete players[id];
        this.Store.set("players", players);
    }

    save(values) {
        if (!values._id) {
            values._id = (new ObjectID()).toHexString();
        }

        let existing = this.get(values._id);

        if (!existing) {
            this.Store.set("players." + values._id, values);
            return values;
        } else {
            for (let path in values) {
                existing[path] = values[path];
            }

            this.Store.set("players." + values._id, existing);
            return existing;
        }
    }

    onChange(cb) {
        useEffect(() => {
            this.on("players.change", cb);

            return () => {
                this.off("players.change", cb);
            };
        }, [cb]);
    }

    usePlayers() {
        const [val, setValue] = useState(this.get());

        this.onChange(() => {
            setValue(this.get());
        });

        return val;
    }
}

export default new PlayerStore();