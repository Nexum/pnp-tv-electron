import "../stylesheets/App.scss"

import Map from "./Map";
import ToolBar from "./ToolBar";

export default function Screen({isGm}) {
  return (
    <>
      <Map isGm={isGm}/>
      {isGm && <ToolBar/>}
    </>
  );
}
