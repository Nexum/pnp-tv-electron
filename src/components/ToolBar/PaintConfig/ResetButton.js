import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import MapStore from "../../../lib/MapStore";

export default function ResetButton({map}) {
    if (!map || !map._id) {
        return null;
    }

    async function resetMarker() {
        MapStore.saveMarker(map._id, null);
    }

    return (
        <button type="button" className="btn btn-danger" onClick={resetMarker}>
            Erase everything
        </button>
    );
}