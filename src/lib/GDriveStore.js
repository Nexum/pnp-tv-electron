import {google} from "googleapis";
import {file} from "googleapis/build/src/apis/file";
import fs from "fs-jetpack";
import path from "path";
import {remote} from "electron";
import ConfigStore from "./ConfigStore";

const {app} = remote;

class GDriveStore {

    setConfig(conf) {
        this.config = conf;
        this.drive = google.drive({version: 'v3', auth: this.config.token});
    }

    async reloadEffects() {
        const dbFile = await this.getDatabaseFile(this.config.folderEffects);

        if (!dbFile) {
            console.log("GDriveStore.js:27 / DB NOT FOUND");
            return;
        }

        const dbContent = await this.getFileContent(dbFile.id);

        if (!dbContent) {
            console.log("GDriveStore.js:27 / DB EMPTY");
            return;
        }

        const dbContentArr = dbContent.split("\n").map(v => v.split(","));
        const imageFiles = await this.getImageFiles(this.config.folderEffects);
        const localImageMap = await this.downloadImages(imageFiles, "effects");
        const effects = {};

        for (let i = 1; i < dbContentArr.length; i++) {
            const [ID, name, height, frameCount, loop, bounce, reverse, frameRate] = dbContentArr[i];

            effects[parseInt(ID)] = {
                name: name,
                file: localImageMap[ID] || null,
                height: height,
                frameCount: frameCount,
                frameRate: frameRate || 16,
                loop: loop === "TRUE",
                bounce: bounce === "TRUE",
                reverse: reverse === "TRUE",
            };
        }

        ConfigStore.set("gdrive.effects", effects);
    }

    async reloadCreatures() {
        const dbFile = await this.getDatabaseFile(this.config.folder);

        if (!dbFile) {
            console.log("GDriveStore.js:27 / DB NOT FOUND");
            return;
        }

        const dbContent = await this.getFileContent(dbFile.id);

        if (!dbContent) {
            console.log("GDriveStore.js:27 / DB EMPTY");
            return;
        }

        const dbContentArr = dbContent.split("\n").map(v => v.split(","));
        const imageFiles = await this.getImageFiles(this.config.folder);
        const localImageMap = await this.downloadImages(imageFiles, "creatures");

        const creatures = {};
        for (let i = 1; i < dbContentArr.length; i++) {
            const [ID, name, hp, initiative, baseSize] = dbContentArr[i];

            creatures[ID] = {
                _id: ID,
                name: String(name).trim(),
                health: parseInt(hp) || 0,
                size: String(baseSize).trim(),
                initiative: parseInt(initiative || 0),
                image: localImageMap[ID] || null,
            };
        }

        ConfigStore.set("gdrive.creatures", creatures);
    }

    wait(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    async getFileContent(fileId) {
        const file = await this.drive.files.export({
            fileId: fileId,
            mimeType: "text/csv",
        });

        return file.data;
    }

    getRootPath(type) {
        return path.join(app.getPath("userData"), "gdrive", type);
    }

    async downloadImages(images, type) {
        const map = {};

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const destPath = path.join(this.getRootPath(type), image.name);
            const file = await this.drive.files.get({
                fileId: image.id,
                alt: "media",
            }, {responseType: 'blob'});

            fs.write(destPath, new Buffer(await file.data.arrayBuffer()));

            const id = image.name.split(".").shift();
            map[id] = destPath;
            await this.wait(500);
        }

        return map;
    }

    async getImageFiles(folder) {
        const drive = this.drive;

        const res = await drive.files.list({
            q: "'" + folder + "' in parents AND mimeType:'image/png'",
            fields: 'files(id,name)',
        });

        return res.data.files;
    }

    async getDatabaseFile(folder) {
        const drive = this.drive;

        const res = await drive.files.list({
            q: "'" + folder + "' in parents AND mimeType:'application/vnd.google-apps.spreadsheet'",
            pageSize: 1,
            fields: 'files(id)',
        });

        const files = res.data.files;

        if (files.length) {
            return files[0];
        }

        return null;
    }

}

export default new GDriveStore();