// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import {app, Menu} from "electron";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
    const userDataPath = app.getPath("userData");
    app.setPath("userData", `${userDataPath} (${env.name})`);
    require('electron-reload')(__dirname);
}

app.on("ready", () => {
    initGmWindow();
    initTvWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});

const defaultWindowOptions = {
    webPreferences: {
        nodeIntegration: true,
    },
    frame: false,
};


function initGmWindow() {
    const mainWindow = createWindow("main", {
        ...defaultWindowOptions,
        width: 1280,
        height: 720,
    });

    mainWindow.setMenu(null);
    //mainWindow.openDevTools();

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "gm.html"),
            protocol: "file:",
            slashes: true,
        }),
    );
}

function initTvWindow() {
    const mainWindow = createWindow("tv", {
        ...defaultWindowOptions,
        width: 1280,
        height: 720,
    });

    mainWindow.setMenu(null);
    //mainWindow.openDevTools();

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "tv.html"),
            protocol: "file:",
            slashes: true,
        }),
    );
}
