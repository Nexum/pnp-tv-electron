import {useCallback, useEffect, useRef, useState} from "react";
import EditForm from "./CreatureConfig/EditForm";
import Overview from "./CreatureConfig/Overview";

export default function CreatureConfig({}) {
    return (
        <div className="row" style={{minWidth: "800px"}}>
            <div className="col-md-6">
                <Overview></Overview>
            </div>
            <div className="col-md-6">
                <EditForm></EditForm>
            </div>
        </div>
    );
}