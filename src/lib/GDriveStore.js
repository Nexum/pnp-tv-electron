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

    async reloadCreatures() {
        const dbFile = await this.getDatabaseFile();

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
        const imageFiles = await this.getImageFiles();
        const localImageMap = await this.downloadImages(imageFiles);

        const creatures = {};
        for (let i = 1; i < dbContentArr.length; i++) {
            const [ID, name, hp, initiative] = dbContentArr[i];

            creatures[ID] = {
                _id: ID,
                name: name,
                health: hp,
                initiative: initiative,
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

    getRootPath() {
        return path.join(app.getPath("userData"), "gdrive");
    }

    async downloadImages(images) {
        const map = {};

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const destPath = path.join(this.getRootPath(), image.name);
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

    async getImageFiles() {
        const drive = this.drive;

        const res = await drive.files.list({
            q: "'" + this.config.folder + "' in parents AND mimeType:'image/png'",
            fields: 'files(id,name)',
        });

        return res.data.files;
    }

    async getDatabaseFile() {
        const drive = this.drive;

        const res = await drive.files.list({
            q: "'" + this.config.folder + "' in parents AND mimeType:'application/vnd.google-apps.spreadsheet'",
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