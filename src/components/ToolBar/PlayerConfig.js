import ConfigStore from "../../lib/ConfigStore";
import GDriveStore from "../../lib/GDriveStore";
import {useState} from "react";
import Overview from "./PlayerConfig/Overview";

export default function PlayerConfig({}) {

    return (
        <div className="row">
            <div className="col-md-12">
                <Overview/>
            </div>
        </div>
    );

}