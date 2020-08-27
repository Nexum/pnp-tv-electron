import {remote} from "electron";
import hotkeys from 'hotkeys-js';

const currentWindow = remote.getCurrentWindow();

hotkeys('f5', function (event, handler) {
    event.preventDefault();
    window.location.reload();
});
hotkeys('ctrl+r', function (event, handler) {
    event.preventDefault();
    window.location.reload();
});

hotkeys('f11', function (event, handler) {
    event.preventDefault();
    currentWindow.setFullScreen(!currentWindow.isFullScreen());
});

hotkeys('f12', function (event, handler) {
    event.preventDefault();
    currentWindow.openDevTools();
});
