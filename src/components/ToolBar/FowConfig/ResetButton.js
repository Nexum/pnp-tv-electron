import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";

export default function ResetButton({map}) {
    if (!map || !map._id) {
        return null;
    }

    async function resetFow() {
        await fetch(`/api/map/${map._id}/fow`, {
            method: "POST",
            body: JSON.stringify({
                fow: null,
            }),
        });
    }

    return (
        <button type="button" className="btn btn-danger" onClick={resetFow}>
            Reset Fog of War
        </button>
    );
}