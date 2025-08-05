import style from "./App.module.css";
import { LocationsList } from "./list/LocationsList";
import { MapView } from "./map/MapView";

export const App = () => (
  <div className={style.container}>
    <div className={style.mapView}>
      <MapView />
    </div>
    <div className={style.listView}>
      <LocationsList />
    </div>
  </div>
);
