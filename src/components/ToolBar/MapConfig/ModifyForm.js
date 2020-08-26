import MapStore from "../../../lib/MapStore";
import {backgrounds} from "../../Map/BackgroundLayer";


export default function ModifyForm({}) {
    const [values, setActive] = MapStore.useActive();

    function onInputChange(path, {currentTarget}) {
        MapStore.save({
            ...values,
            [path]: currentTarget.value,
        });
    }

    function onFileSelected(e) {
        const srcFile = e.target.files[0];
        MapStore.saveMapFile(values._id, srcFile.path);
    }

    return (
        <form>
            <div className="form-group">
                <label htmlFor="modify-name">Change name</label>
                <input type="text" id="modify-name" value={values.name} name="name" onChange={onInputChange.bind(null, "name")} className="form-control"/>
            </div>
            <div className="form-group">
                <label htmlFor="modify-name">Change Background</label>
                <select id="modify-background" value={values.background} name="background" onChange={onInputChange.bind(null, "background")}
                        className="form-control">
                    {Object.keys(backgrounds).map(background => {
                        return <option key={background} value={background}>{background}</option>;
                    })}
                </select>
            </div>
            <div className="form-group">
                <div className="custom-file">
                    <input className="custom-file-input" type="file" onChange={onFileSelected}/>
                    <label htmlFor="modify-name" className="custom-file-label">Choose file</label>
                </div>
            </div>
        </form>
    );
}