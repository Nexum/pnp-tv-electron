import fs from "fs-jetpack";
import {remote} from "electron";
import path from "path";

const app = remote.app;
const files = fs.list(path.join(app.getAppPath(), "app", "creatures"));
const options = [];

for (let i = 0; i < files.length; i++) {
    const file = files[i];

    options.push({
        label: file.split(".").shift(),
        value: "creatures/" + file,
    });
}

export default function CreatureTypeSelect({onChange, value}) {
    return (
        <select className="form-control" onChange={onChange} value={value}>
            <option>Select</option>
            {options.map((v, i) => {
                return <option value={v.value} key={i}>{v.label}</option>;
            })}
        </select>
    );
}