import { useContext } from "react";
import "./ToggleSwitch.css";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

export default function ToggleSwitch() {
  const { currentTemperatureUnit, handleToggleSwitchChange } = useContext(
    CurrentTemperatureUnitContext
  );
  const nextTemperatureUnit =
    currentTemperatureUnit === "C" ? "Fahrenheit" : "Celsius";

  return (
    <label className="toggle-switch">
      <input
        onChange={handleToggleSwitchChange}
        type="checkbox"
        className="toggle-switch__checkbox"
        checked={currentTemperatureUnit === "C"}
        aria-label={`Use ${nextTemperatureUnit} temperature unit`}
      />
      <span className="toggle-switch__circle"></span>
      <span className="toggle-switch__text toggle-switch__text_F" aria-hidden="true">
        F
      </span>
      <span className="toggle-switch__text toggle-switch__text_C" aria-hidden="true">
        C
      </span>
    </label>
  );
}
