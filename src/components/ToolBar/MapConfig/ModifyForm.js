import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import MapStore from "../../../lib/MapStore";
import {backgrounds} from "../../Map/BackgroundLayer";

export default function ModifyForm({map}) {
    const [values, setValues] = useState({
        ...map,
    });
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        setValues({
            ...map,
        });
    }, [map]);

    async function getMaps() {
        setMaps({});
    }

    useEffect(() => {
        getMaps();
    }, []);

    function onInputChange(path, {currentTarget}) {
        setValues({
            ...values,
            [path]: currentTarget.value,
        });
    }

    function onFileSelected(e) {
        const data = new FormData();
        data.append("file", e.target.files[0]);
        fetch(`/api/file/${map._id}/upload`, {
            method: "POST",
            body: data,
        });
    }

    function onSubmit(e) {
        handleSubmit();
        e.preventDefault();
        return false;
    }

    async function handleSubmit() {
        MapStore.save(values);
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="modify-name">Change name</label>
                <input type="text" id="modify-name" value={values.name} name="name" onChange={onInputChange.bind(null, "name")} className="form-control"/>
            </div>
            <div className="form-group">
                <label htmlFor="modify-name">Change name</label>
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
            <button type="submit" className="btn btn-primary">Update</button>
        </form>
    );
}