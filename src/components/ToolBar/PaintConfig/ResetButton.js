import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";

export default function ResetButton({map}) {
    if (!map || !map._id) {
        return null;
    }

    async function resetMarker() {
        await fetch(`/api/map/${map._id}/marker`, {
            method: "POST",
            body: JSON.stringify({
                marker: null,
            }),
        });
    }

    return (
        <button type="button" className="btn btn-danger" onClick={resetMarker}>
            Erase everything
        </button>
    );
}