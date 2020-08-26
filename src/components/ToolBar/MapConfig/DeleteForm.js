import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import MapStore from "../../../lib/MapStore";

export default function DeleteForm({map}) {
    async function deleteCurrentMap() {
        if (confirm("Are you sure?")) {
            MapStore.delete(map._id);
        }
    }

    if (!map || !map._id) {
        return null;
    }

    return (
        <button type="submit" className="btn btn-danger" onClick={deleteCurrentMap}>Delete current map</button>
    );
}