import {useCallback, useEffect, useRef, useState} from "react";
import PlayerStore from "../../../lib/PlayerStore";
import ConfigStore from "../../../lib/ConfigStore";
import CreatureStore from "../../../lib/CreatureStore";
import ObjectID from "bson-objectid";

export default function Overview({}) {
    const effects = ConfigStore.useConfig("gdrive.effects") || {};
    const activeEffects = ConfigStore.useConfig("activeEffects") || [];
    const selectedType = ConfigStore.useConfig("effectsForm.selectedType");

    function createNew() {
        const copy = [...activeEffects];
        copy.push({
            _id: (new ObjectID()).toHexString(),
            effect: selectedType,
        });
        ConfigStore.set("activeEffects", copy);
    }

    function typeChanged({currentTarget}) {
        ConfigStore.set("effectsForm.selectedType", currentTarget.value);
    }


    function deleteEffect(effectKey) {
        const effects = ConfigStore.get("activeEffects");
        effects.splice(effectKey, 1);
        ConfigStore.set("activeEffects", effects);
    }

    function toggleEffect(effectKey) {
        const effects = ConfigStore.get("activeEffects");
        effects[effectKey].visible = !effects[effectKey].visible;
        ConfigStore.set("activeEffects", effects);
    }

    return (
        <div style={{width: "300px"}}>
            <div className="effect-table-header">
                <form className="form-inline">
                    <select value={selectedType} onChange={typeChanged} className="form-control ">
                        <option>Select...</option>
                        {Object.keys(effects).map((v, i) => {
                            return <option key={v} value={v}>{effects[v].name}</option>;
                        })}
                    </select>
                    {selectedType && <button type="button" onClick={createNew} className={"btn btn-primary"}>+</button>}
                </form>
            </div>
            <div className="effect-table">
                <div className="d-flex flex-column">
                    {activeEffects.map((v, i) => {
                        const config = effects[v.effect];

                        if (!config) {
                            deleteEffect(i);
                            return;
                        }

                        return (
                            <div key={v._id} className="effect-row">
                                <div className="effect-name">
                                    {config.name}
                                </div>

                                <div className="effect-actions">
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={toggleEffect.bind(null, i)}>
                                        {v.visible ? (
                                            <>
                                                {config.loop ? "Hide" : "Playing..."}
                                            </>
                                        ) : (
                                            <>
                                                {config.loop ? "Show" : "Play"}
                                            </>
                                        )}

                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={deleteEffect.bind(null, i)}>
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