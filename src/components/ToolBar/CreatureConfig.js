import {useCallback, useEffect, useRef, useState} from "react";
import NewForm from "./CreatureConfig/NewForm";
import EditForm from "./CreatureConfig/EditForm";
import Overview from "./CreatureConfig/Overview";

export default function CreatureConfig({}) {
    return (
        <div className="row">
            <div className="col-md-6">
                <Overview></Overview>
            </div>
            <div className="col-md-3">
                <EditForm></EditForm>
            </div>
        </div>
    );
}