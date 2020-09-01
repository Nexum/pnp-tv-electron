import PlayerStore from "../../lib/PlayerStore";
import CreatureStore from "../../lib/CreatureStore";
import ConfigStore from "../../lib/ConfigStore";
import {useDrag} from "react-dnd";

export default function Combat({isGm}) {

    const visible = ConfigStore.useConfig("combatVisible");
    const activeInitiative = ConfigStore.useConfig("combat.activeInitiative") || 0;
    const pos = ConfigStore.useConfig("configWindow.combatWindow.pos") || {};
    const players = PlayerStore.usePlayers();
    const creatures = CreatureStore.useActiveCreatures();

    const data = [];
    let maxIni = 0;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (player.initiative > maxIni) {
            maxIni = player.initiative;
        }

        data.push({
            type: "player",
            name: player.name || "Unknown player",
            initiative: player.initiative || 0,
        });
    }

    for (let i = 0; i < creatures.length; i++) {
        const creature = creatures[i];

        if (parseInt(creature.currentHealth) === 0 || !creature.visible) {
            continue;
        }

        if (creature.initiative > maxIni) {
            maxIni = creature.initiative;
        }

        data.push({
            type: "creature",
            _id: creature._id,
            map: creature.map,
            name: creature.name || "Unknown creature",
            initiative: creature.initiative || 0,
        });
    }


    const [{isDragging}, win] = useDrag({
        item: {
            id: "combatWindow",
            type: "configWindow",
            x: pos.x || 0,
            y: pos.y || 0,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    data.sort((a, b) => {

        a = parseInt(a.initiative || 0);
        b = parseInt(b.initiative || 0);

        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        } else {
            return 0;
        }
    });


    function prev(currIni) {
        currIni--;
        if (currIni < 0) {
            return;
        }

        const foundEntry = data.find((v) => parseInt(v.initiative) === currIni);

        if (!foundEntry) {
            return prev(currIni);
        }

        ConfigStore.set("combat.activeInitiative", currIni);
    }

    function next(currIni) {
        currIni++;

        if (currIni > maxIni) {
            return;
        }

        const foundEntry = data.find((v) => parseInt(v.initiative) === currIni);

        if (!foundEntry) {
            return next(currIni);
        }

        ConfigStore.set("combat.activeInitiative", currIni);
    }

    function selectCreature({map, _id}) {
        if (!isGm) {
            return;
        }

        ConfigStore.set("selectedCreature", {
            map: map,
            _id: _id,
        });
    }

    return (
        <div className="combat-initiative config-window" ref={win} style={{
            left: pos.x,
            display: isDragging || !visible ? "none" : "",
            top: pos.y,
        }}>
            <div className="config-window-body">
                <div className="fight">
                    {data.map((v, i) => {
                        return (
                            <div key={i} className={["fighter", "type-" + v.type, activeInitiative === parseInt(v.initiative) ? "active" : ""].join(" ")}>
                                <div className="order">
                                    {i + 1}
                                </div>
                                {v.type === "player" ? (
                                    <div className="name">
                                        {v.name}
                                    </div>
                                ) : (
                                    <div className="name" onClick={selectCreature.bind(null, v)}>
                                        {v.name}
                                    </div>
                                )}

                                <div className="initiative">
                                    {v.initiative}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {isGm && (
                    <div className="gm-options">
                        <button type="button" className="btn btn-sm btn-primary" onClick={prev.bind(null, activeInitiative)}>{"<"}</button>
                        <button type="button" className="btn btn-sm btn-primary" onClick={next.bind(null, activeInitiative)}>{">"}</button>
                    </div>
                )}
            </div>
        </div>
    );
}