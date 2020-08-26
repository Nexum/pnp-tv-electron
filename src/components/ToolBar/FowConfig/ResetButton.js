import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import MapStore from "../../../lib/MapStore";

export default function ResetButton({map}) {
    if (!map || !map._id) {
        return null;
    }

    async function resetFow() {
        MapStore.save({
            _id: map._id,
            fow: null,
        });
    }

    return (
        <button type="button" className="btn btn-danger" onClick={resetFow}>
            Reset Fog of War
        </button>
    );
}