import {useCallback, useEffect, useRef, useState} from "react";
import PlayerStore from "../../../lib/PlayerStore";
import ConfigStore from "../../../lib/ConfigStore";
import CreatureStore from "../../../lib/CreatureStore";

export default function Overview({}) {
    const players = PlayerStore.usePlayers();

    function onInputChange(player, path, {currentTarget}) {
        PlayerStore.save({
            _id: player._id,
            [path]: currentTarget.value,
        });
    }

    function createNew() {
        PlayerStore.save({
            name: "",
        });
    }

    function deletePlayer(player) {
        PlayerStore.delete(player._id);
    }

    return (
        <div style={{width: "300px"}}>
            <div className="player-table-header">
                <button type="button" onClick={createNew} className={"btn btn-primary"}>+</button>
            </div>
            <div className="player-table">
                <div className="d-flex flex-column">
                    {players.map((v, i) => {
                        return (
                            <div key={i} className={"d-flex player-row"}>
                                <div className="player-name">
                                    <input type="text" value={v.name} placeholder="name" onChange={onInputChange.bind(null, v, "name")}/>
                                </div>

                                <div className="player-initiative">
                                    <input type="text" value={v.initiative} placeholder="ini" onChange={onInputChange.bind(null, v, "initiative")}/>
                                </div>

                                <div className="player-actions">
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={deletePlayer.bind(this, v)}>
                                        X
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}