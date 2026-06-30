import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import {
  LuSun,
  LuMoon,
  LuCloud,
  LuCloudSun,
  LuCloudRain,
  LuCloudSnow,
  LuCloudLightning,
} from "react-icons/lu";
import { useIntl } from "react-intl";
import "./Dashboard.scss";

const WEATHER_CITY = "Ho Chi Minh City";

const DEFAULT_WEATHER = {
  location: {
    name: WEATHER_CITY,
  },
  current: {
    temp_c: 0,
    is_day: 1,
    condition: {
      code: 1000,
      text: "",
    },
  },
};

const weatherIcons = {
  1000: (isDay) => (isDay ? <LuSun /> : <LuMoon />),
  1003: () => <LuCloudSun />,
  1006: () => <LuCloud />,
  1009: () => <LuCloud />,
  1030: () => <LuCloud />,
  1063: () => <LuCloudRain />,
  1180: () => <LuCloudRain />,
  1183: () => <LuCloudRain />,
  1210: () => <LuCloudSnow />,
  1273: () => <LuCloudLightning />,
};

const getWeatherIcon = (code, isDay) =>
  weatherIcons[code]?.(isDay) ?? <LuCloud />;

const getWeatherBg = (code, isDay) => {
  if (!isDay) {
    return "linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 58, 95, 1) 100%)";
  }

  if (code === 1000) {
    return "linear-gradient(135deg, rgba(14, 165, 233, 1) 0%, rgba(56, 189, 248, 1) 60%, rgba(186, 230, 253, 1) 100%)";
  }

  if (code <= 1009) {
    return "linear-gradient(135deg, rgba(2, 132, 199, 1) 0%, rgba(125, 211, 252, 1) 100%)";
  }

  if (code <= 1030) {
    return "linear-gradient(135deg, rgba(100, 116, 139, 1) 0%, rgba(148, 163, 184, 1) 100%)";
  }

  if (code <= 1201) {
    return "linear-gradient(135deg, rgba(51, 65, 85, 1) 0%, rgba(71, 85, 105, 1) 100%)";
  }

  return "linear-gradient(135deg, rgba(14, 165, 233, 1) 0%, rgba(125, 211, 252, 1) 100%)";
};

const WeatherWidget = () => {
  const lang = useIntl();
  const [openWeather, setOpenWeather] = useState(false);
  const [weather, setWeather] = useState(DEFAULT_WEATHER);
  const [selectDay, setSelectDay] = useState(0);
  const weatherLang = lang.locale.startsWith("vi") ? "vi" : "en";

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER}&q=${10.924961214727357},${106.62117715081975}&days=7&aqi=no&alerts=no&lang=${weatherLang}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        setWeather(data);
      } catch (error) {
        console.log("Weather fetch error:", error);
      }
    };

    loadWeather();
  }, [weatherLang]);

  const hours =
    weather?.forecast?.forecastday?.[selectDay]?.hour || [];
  return (
    <>
      {isMobile ? (
        <div className="DAT_WeatherMobile_Card">
          <div className="DAT_WeatherMobile_Card_Icon">
            {getWeatherIcon(
              weather?.current?.condition?.code,
              weather?.current?.is_day,
              28,
            )}
          </div>

          <div className="DAT_WeatherMobile_Card_Temperature">
            {weather?.current?.temp_c ?? "--"}°C
          </div>

          <div className="DAT_WeatherMobile_Card_Condition">
            {weather?.current?.condition?.text ?? "Có mây"}
          </div>
        </div>
      ) : (
        <>
          <div
            className="DAT_Weather_Card"
            onClick={() => setOpenWeather(true)}
            data-state="ready"
            style={{
              background: getWeatherBg(
                weather?.current?.condition?.code,
                weather?.current?.is_day,
              ),
            }}
          >
            <div className="DAT_Weather_Card_Orb_1" />
            <div className="DAT_Weather_Card_Orb_2" />

            <div className="DAT_Weather_Card_Top">
              <div className="DAT_Weather_Card_Top_Content">
                <div className="DAT_Weather_Card_Top_Content_City">
                  {weather?.location?.name ?? "HCM"}
                </div>

                <div className="DAT_Weather_Card_Top_Content_Condition">
                  {weather?.current?.condition?.text ?? "Có mây"}
                </div>
              </div>

              <div className="DAT_Weather_Card_Top_Icon">
                {getWeatherIcon(
                  weather?.current?.condition?.code,
                  weather?.current?.is_day,
                )}
              </div>
            </div>

            <div className="DAT_Weather_Card_Temperature">
              {weather?.current?.temp_c ?? "--"}°C
            </div>
          </div>
          {openWeather && (
            <div className="DAT_Weather_Modal">
              <div className="DAT_Weather_Modal_Overlay" onClick={() => setOpenWeather(false)}></div>
              <div className="DAT_Weather_Modal_Container" style={{
                background: getWeatherBg(
                  weather?.current?.condition?.code,
                  weather?.current?.is_day,
                ),
              }}>
                <div className="DAT_Weather_Modal_Container_Left">
                  <div className="DAT_Weather_Card_Orb_1" />
                  <div className="DAT_Weather_Card_Orb_2" />
                  <div className="DAT_Weather_Modal_Container_Left_Top" >
                    <div className="DAT_Weather_Modal_Container_Left_Top_Content">
                      <div className="DAT_Weather_Modal_Container_Left_Top_Content_City">
                        {weather?.location?.name ?? "HCM"}
                      </div>

                      <div className="DAT_Weather_Modal_Container_Left_Top_Content_Condition">
                        {weather?.current?.condition?.text ?? "Có mây"}
                      </div>
                      <div className="DAT_Weather_Modal_Container_Left_Top_Content_Temperature">
                        {weather?.current?.temp_c ?? "--"}°C
                      </div>
                    </div>
                    <div className="DAT_Weather_Modal_Container_Left_Top_Icon">
                      {getWeatherIcon(
                        weather?.current?.condition?.code,
                        weather?.current?.is_day,
                      )}
                    </div>

                  </div>
                  <div className="DAT_Weather_Modal_Container_Left_Bottom">
                    <div className="DAT_Weather_Modal_Container_Left_Bottom_Header">Today's Forecast</div>
                    <div className="DAT_Weather_Modal_Container_Left_Bottom_List">
                      {hours
                        .filter((_, index) => index % 3 === 0)
                        .map((item) => (
                          <div className="DAT_Weather_Modal_Container_Left_Bottom_List_Item" key={item.time_epoch}>
                            <p>
                              {new Date(item.time).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                            <div className="DAT_Weather_Modal_Container_Left_Bottom_List_Item_Icon">
                              {getWeatherIcon(item.condition.code, item.is_day)}
                            </div>
                            <p>{Math.round(item.temp_c)}°</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="DAT_Weather_Modal_Container_Right">
                  <div className="DAT_Weather_Modal_Container_Right_Header">5-day Forecast</div>
                  <div className="DAT_Weather_Modal_Container_Right_List">
                    {weather?.forecast?.forecastday?.slice(0, 5).map((item, index) => (
                      <div className="DAT_Weather_Modal_Container_Right_List_Item" key={item.date}
                        onClick={() => setSelectDay(index)}>
                        <span>
                          {index === 0
                            ? "Today"
                            : new Date(item.date).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                        </span>
                        <div className="DAT_Weather_Modal_Container_Right_List_Item_Icon">
                          {getWeatherIcon(
                            item.day.condition.code,
                            true
                          )}
                        </div>

                        <span>{item.day.condition.text}</span>

                        <span>
                          {Math.round(item.day.maxtemp_c)}°
                          <span className="min-temp">
                            /{Math.round(item.day.mintemp_c)}°
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default WeatherWidget;