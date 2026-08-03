import WeatherCard from "../WeatherCard/WeatherCard";

import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";

const RECOMMENDATION_LIMIT = 6;

function Main({
  weatherData,
  onCardClick,
  onCardLike,
  clothingItems,
  isWeatherLoading,
  weatherError,
  locationStatus,
  onUseMyLocation,
}) {
  const weatherType = weatherData.type || "default";
  const filteredClothingItems = clothingItems
    .filter((item) => {
      return item.weather === weatherData.type;
    })
    .slice(0, RECOMMENDATION_LIMIT);

  return (
    <main className="main">
      <WeatherCard
        weatherData={weatherData}
        isWeatherLoading={isWeatherLoading}
        weatherError={weatherError}
        locationStatus={locationStatus}
        onUseMyLocation={onUseMyLocation}
      />
      <section
        className={`cards cards_weather_${weatherType}`}
        aria-labelledby="recommendationsTitle"
      >
        <div className="cards__header">
          <div className="cards__heading-group">
            <p className="cards__eyebrow">Outfit recommendations</p>
            <h2 className="cards__title" id="recommendationsTitle">
              Your WeatherFit for today
            </h2>
          </div>
        </div>
        <p className="cards__text">
          These pieces are selected to match today&rsquo;s weather conditions
        </p>
        <ul className="cards__list">
          {filteredClothingItems.map((item) => {
            return (
              <ItemCard
                key={item._id}
                item={item}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
              />
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default Main;
