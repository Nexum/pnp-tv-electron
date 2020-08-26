import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import ModifyForm from "./MapConfig/ModifyForm";
import NewForm from "./MapConfig/NewForm";
import DeleteForm from "./MapConfig/DeleteForm";
import SwitchForm from "./MapConfig/SwitchForm";
import ResetButton from "./FowConfig/ResetButton";
import MapStore from "../../lib/MapStore";

export default function MapConfig({}) {
    const [map, setActive] = MapStore.useActive();

    return (
        <div className="d-flex">
            {map && (
                <div className="mr-5">
                    <ModifyForm map={map}></ModifyForm>
                </div>
            )}
            <div className="mr-5">
                <SwitchForm map={map}></SwitchForm>
                <NewForm map={map}></NewForm>
            </div>
            {map && (
                <div>
                    <div className="mb-1">
                        <ResetButton map={map}></ResetButton>
                    </div>
                    <div>
                        <DeleteForm map={map}></DeleteForm>
                    </div>
                </div>
            )}
        </div>
    );
}