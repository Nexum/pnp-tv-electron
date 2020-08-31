import ConfigStore from "../../../lib/ConfigStore";

export default function CreatureTypeSelect({onChange, value}) {
    const creatureConfigs = ConfigStore.useConfig("gdrive.creatures") || {};

    return (
        <select className="form-control" onChange={({currentTarget}) => {
            onChange(creatureConfigs[currentTarget.value]);
        }} value={value}>
            <option>Select</option>
            {Object.keys(creatureConfigs).map((id) => {
                const creature = creatureConfigs[id];
                return <option value={id} key={id}>{creature.name}</option>;
            })}
        </select>
    );
}