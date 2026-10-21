/* =========================================================
   SIDDHARTH MISHRA PORTFOLIO
   MASTER JAVASCRIPT SYSTEM
   Real-Time Weather + Portfolio Interactions
========================================================= */

"use strict";

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {
    typingWords: [
        "Retail Operations",
        "Sales Professional",
        "Sales & Marketing",
        "Human Resource Management",
        "Management Information System",
        "Aspiring Business Analyst",
        "Future Entrepreneur",
        "Developer",
        "Digital Builder",
        "Problem Solver",
        "Technology Explorer",
        "Continuous Learner"
    ],

    typingIndex: 0,
    typingCharacter: 0,
    typingDeleting: false,

    selectedResumeTemplate: 1,

    uploadedCertificates: [],

    resumePhoto:
        localStorage.getItem("siddharthResumePhoto") ||
        "assets/profile.jpg",

    weather: {
        state: "unknown",
        temperature: null,
        humidity: null,
        windSpeed: null,
        description: "Loading weather...",
        icon: "◌",
        isDay: true,
        period: "unknown",
        location: null,
        latitude: null,
        longitude: null,
        timezone: null,
        lastUpdated: null
    }
};

/* =========================================================
   PAGE LOADER
========================================================= */

(function initLoader() {
    const loader = $("#pageLoader");
    const progress = $("#loaderProgress");
    const text = $("#loaderText");

    if (!loader) return;

    const messages = [
        "initializing portfolio...",
        "loading developer profile...",
        "mounting interface...",
        "starting city engine...",
        "loading interactive systems...",
        "connecting weather service...",
        "portfolio ready."
    ];

    let value = 0;
    let messageIndex = 0;

    const timer = setInterval(() => {
        value += Math.floor(Math.random() * 14) + 7;

        if (value > 100) {
            value = 100;
        }

        if (
            messageIndex < messages.length &&
            value >= (messageIndex + 1) * (100 / messages.length)
        ) {
            if (text) {
                text.textContent = messages[messageIndex];
            }

            messageIndex++;
        }

        if (progress) {
            progress.style.width = `${value}%`;
        }

        if (value >= 100) {
            clearInterval(timer);

            setTimeout(() => {
                loader.classList.add("hidden");
            }, 450);
        }
    }, 160);
})();

/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear = $("#currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const mobileMenuButton = $("#mobileMenuButton");
const mainNav = $("#mainNav");

if (mobileMenuButton && mainNav) {
    mobileMenuButton.addEventListener("click", () => {
        const open = mainNav.classList.toggle("open");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(open)
        );
    });

    $$(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}

/* =========================================================
   HEADER + SCROLL PROGRESS
========================================================= */

const header = $("#siteHeader");
const scrollProgress = $("#scrollProgress");
const backTop = $("#backTop");

function handleScroll() {
    const scrollTop = window.scrollY;

    if (header) {
        header.classList.toggle(
            "scrolled",
            scrollTop > 20
        );
    }

    if (backTop) {
        backTop.classList.toggle(
            "show",
            scrollTop > 500
        );
    }

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const percentage =
        documentHeight > 0
            ? (scrollTop / documentHeight) * 100
            : 0;

    if (scrollProgress) {
        scrollProgress.style.width = `${percentage}%`;
    }
}

window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
);

handleScroll();

if (backTop) {
    backTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursorDot = $("#cursorDot");
const cursorRing = $("#cursorRing");

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

const cursorEnabled =
    window.matchMedia("(pointer:fine)").matches;

if (cursorEnabled) {
    document.addEventListener("mousemove", event => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;

        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    const interactiveSelectors =
        "a, button, input, textarea, select, " +
        ".skill-card, .project-card, .contact-link, " +
        ".template-select, .editor-template";

    document.addEventListener("mouseover", event => {
        if (event.target.closest(interactiveSelectors)) {
            document.body.classList.add("cursor-hover");
        }
    });

    document.addEventListener("mouseout", event => {
        if (event.target.closest(interactiveSelectors)) {
            document.body.classList.remove("cursor-hover");
        }
    });
} else {
    if (cursorDot) {
        cursorDot.style.display = "none";
    }

    if (cursorRing) {
        cursorRing.style.display = "none";
    }
}

/* =========================================================
   TYPING ENGINE
========================================================= */

const typingText = $("#typingText");

function typingLoop() {
    if (!typingText) return;

    const words = state.typingWords;
    const currentWord = words[state.typingIndex];

    if (!state.typingDeleting) {
        state.typingCharacter++;

        typingText.textContent =
            currentWord.substring(
                0,
                state.typingCharacter
            );

        if (
            state.typingCharacter >=
            currentWord.length
        ) {
            state.typingDeleting = true;

            setTimeout(typingLoop, 1200);
            return;
        }
    } else {
        state.typingCharacter--;

        typingText.textContent =
            currentWord.substring(
                0,
                state.typingCharacter
            );

        if (state.typingCharacter <= 0) {
            state.typingDeleting = false;

            state.typingIndex =
                (state.typingIndex + 1) %
                words.length;
        }
    }

    setTimeout(
        typingLoop,
        state.typingDeleting ? 45 : 85
    );
}

typingLoop();

/* =========================================================
   RAIN GENERATOR
========================================================= */

(function createRain() {
    const rain = $("#rain");

    if (!rain) return;

    const amount =
        window.innerWidth < 600 ? 55 : 120;

    const fragment =
        document.createDocumentFragment();

    for (let index = 0; index < amount; index++) {
        const drop = document.createElement("span");

        drop.className = "raindrop";

        drop.style.left =
            `${Math.random() * 100}%`;

        drop.style.height =
            `${35 + Math.random() * 80}px`;

        drop.style.opacity =
            `${0.15 + Math.random() * 0.55}`;

        drop.style.animationDuration =
            `${0.65 + Math.random() * 1.15}s`;

        drop.style.animationDelay =
            `${Math.random() * -3}s`;

        fragment.appendChild(drop);
    }

    rain.appendChild(fragment);
})();

/* =========================================================
   REAL-TIME WEATHER + VISITOR LOCATION SYSTEM
   Browser Geolocation + Open-Meteo
========================================================= */

(function initRealTimeWeather() {
    "use strict";

    /*
     * Support multiple weather panels.
     *
     * querySelector() was previously used here, which meant
     * only the first weather panel could be updated.
     */
    const weatherPanels = $$("[data-weather-panel]");

    if (!weatherPanels.length) {
        return;
    }

    const cityBackground = $("#cityBackground");
    const body = document.body;

    /*
     * Visitor coordinates are requested from the browser once.
     *
     * Weather refreshes reuse these coordinates instead of
     * asking for location permission every minute.
     */
    let visitorLocation = null;

    let locationRequestInProgress = false;

    let locationLabel =
        "Detecting your location...";

    /* =====================================================
       WEATHER CODE MAP
    ===================================================== */

    const weatherCodeMap = {
        0: {
            state: "clear",
            icon: "☀",
            nightIcon: "☾",
            description: "Clear sky"
        },

        1: {
            state: "clear",
            icon: "🌤",
            nightIcon: "☾",
            description: "Mainly clear"
        },

        2: {
            state: "cloudy",
            icon: "⛅",
            nightIcon: "☁",
            description: "Partly cloudy"
        },

        3: {
            state: "cloudy",
            icon: "☁",
            nightIcon: "☁",
            description: "Overcast"
        },

        45: {
            state: "fog",
            icon: "〰",
            nightIcon: "〰",
            description: "Fog"
        },

        48: {
            state: "fog",
            icon: "〰",
            nightIcon: "〰",
            description: "Depositing rime fog"
        },

        51: {
            state: "rain",
            icon: "☂",
            nightIcon: "☂",
            description: "Light drizzle"
        },

        53: {
            state: "rain",
            icon: "☂",
            nightIcon: "☂",
            description: "Moderate drizzle"
        },

        55: {
            state: "rain",
            icon: "☂",
            nightIcon: "☂",
            description: "Dense drizzle"
        },

        56: {
            state: "rain",
            icon: "☂",
            nightIcon: "☂",
            description: "Freezing drizzle"
        },

        57: {
            state: "rain",
            icon: "☂",
            nightIcon: "☂",
            description: "Heavy freezing drizzle"
        },

        61: {
            state: "rain",
            icon: "☔",
            nightIcon: "☔",
            description: "Slight rain"
        },

        63: {
            state: "rain",
            icon: "☔",
            nightIcon: "☔",
            description: "Moderate rain"
        },

        65: {
            state: "rain",
            icon: "☔",
            nightIcon: "☔",
            description: "Heavy rain"
        },

        66: {
            state: "rain",
            icon: "☔",
            nightIcon: "☔",
            description: "Freezing rain"
        },

        67: {
            state: "rain",
            icon: "☔",
            nightIcon: "☔",
            description: "Heavy freezing rain"
        },

        71: {
            state: "snow",
            icon: "❄",
            nightIcon: "❄",
            description: "Slight snow"
        },

        73: {
            state: "snow",
            icon: "❄",
            nightIcon: "❄",
            description: "Moderate snow"
        },

        75: {
            state: "snow",
            icon: "❄",
            nightIcon: "❄",
            description: "Heavy snow"
        },

        77: {
            state: "snow",
            icon: "❄",
            nightIcon: "❄",
            description: "Snow grains"
        },

        80: {
            state: "rain",
            icon: "🌦",
            nightIcon: "☔",
            description: "Slight rain showers"
        },

        81: {
            state: "rain",
            icon: "🌦",
            nightIcon: "☔",
            description: "Moderate rain showers"
        },

        82: {
            state: "storm",
            icon: "⛈",
            nightIcon: "⛈",
            description: "Violent rain showers"
        },

        85: {
            state: "snow",
            icon: "🌨",
            nightIcon: "🌨",
            description: "Slight snow showers"
        },

        86: {
            state: "snow",
            icon: "🌨",
            nightIcon: "🌨",
            description: "Heavy snow showers"
        },

        95: {
            state: "storm",
            icon: "⚡",
            nightIcon: "⚡",
            description: "Thunderstorm"
        },

        96: {
            state: "storm",
            icon: "⛈",
            nightIcon: "⛈",
            description: "Thunderstorm with hail"
        },

        99: {
            state: "storm",
            icon: "⛈",
            nightIcon: "⛈",
            description: "Heavy thunderstorm with hail"
        }
    };

    /* =====================================================
       DAY PERIOD LABELS
    ===================================================== */

    const periodLabels = {
        morning: "Morning",
        day: "Day",
        afternoon: "Afternoon",
        evening: "Evening",
        night: "Night",
        unknown: "Detecting..."
    };

    /* =====================================================
       PANEL ELEMENTS
    ===================================================== */

    function getPanelElements(panel) {
        return {
            location: panel.querySelector(
                "[data-weather-location]"
            ),

            icon: panel.querySelector(
                "[data-weather-icon]"
            ),

            temperature: panel.querySelector(
                "[data-weather-temperature]"
            ),

            description: panel.querySelector(
                "[data-weather-description]"
            ),

            humidity: panel.querySelector(
                "[data-weather-humidity]"
            ),

            wind: panel.querySelector(
                "[data-weather-wind]"
            ),

            updated: panel.querySelector(
                "[data-weather-updated]"
            ),

            feels: panel.querySelector(
                "[data-weather-feels]"
            ),

            visibility: panel.querySelector(
                "[data-weather-visibility]"
            ),

            pressure: panel.querySelector(
                "[data-weather-pressure]"
            ),

            period: panel.querySelector(
                "[data-weather-period]"
            ),

            status: panel.querySelector(
                "[data-weather-status]"
            )
        };
    }

    const panelElements =
        weatherPanels.map(
            getPanelElements
        );

    function updatePanels(callback) {
        panelElements.forEach(callback);
    }

    /* =====================================================
       WEATHER STATUS
    ===================================================== */

    function setPanelStatus(
        text,
        isError = false
    ) {
        updatePanels(elements => {
            if (!elements.status) {
                return;
            }

            elements.status.textContent = text;

            elements.status.classList.toggle(
                "error",
                isError
            );
        });
    }

    /* =====================================================
       LOCATION TEXT
    ===================================================== */

    function setLocationText(text) {
        updatePanels(elements => {
            if (elements.location) {
                elements.location.textContent =
                    text;
            }
        });
    }

    /* =====================================================
       TIME PARSER
    ===================================================== */

    function getMinutesFromIso(value) {
        if (!value) {
            return null;
        }

        const match =
            String(value).match(
                /T(\d{2}):(\d{2})/
            );

        if (!match) {
            return null;
        }

        return (
            Number(match[1]) * 60 +
            Number(match[2])
        );
    }

    function getCurrentMinutes(
        currentTime
    ) {
        const apiMinutes =
            getMinutesFromIso(
                currentTime
            );

        if (apiMinutes !== null) {
            return apiMinutes;
        }

        const now = new Date();

        return (
            now.getHours() * 60 +
            now.getMinutes()
        );
    }

    /* =====================================================
       DAY PERIOD
    ===================================================== */

    function getDayPeriod(
        currentTime,
        sunriseTime,
        sunsetTime
    ) {
        const currentMinutes =
            getCurrentMinutes(
                currentTime
            );

        const sunriseMinutes =
            getMinutesFromIso(
                sunriseTime
            );

        const sunsetMinutes =
            getMinutesFromIso(
                sunsetTime
            );

        /*
         * Fallback if sunrise/sunset are unavailable.
         */
        if (
            sunriseMinutes === null ||
            sunsetMinutes === null
        ) {
            const hour =
                Math.floor(
                    currentMinutes / 60
                );

            if (
                hour >= 5 &&
                hour < 10
            ) {
                return "morning";
            }

            if (
                hour >= 10 &&
                hour < 12
            ) {
                return "day";
            }

            if (
                hour >= 12 &&
                hour < 16
            ) {
                return "afternoon";
            }

            if (
                hour >= 16 &&
                hour < 19
            ) {
                return "evening";
            }

            return "night";
        }

        /*
         * Before sunrise or after sunset.
         */
        if (
            currentMinutes <
                sunriseMinutes ||
            currentMinutes >=
                sunsetMinutes
        ) {
            return "night";
        }

        /*
         * Morning.
         */
        if (
            currentMinutes <
            10 * 60
        ) {
            return "morning";
        }

        /*
         * Day.
         */
        if (
            currentMinutes <
            12 * 60
        ) {
            return "day";
        }

        /*
         * Afternoon.
         */
        if (
            currentMinutes <
            16 * 60
        ) {
            return "afternoon";
        }

        /*
         * Evening.
         */
        return "evening";
    }

    /* =====================================================
       WEATHER STATE
    ===================================================== */

    function setWeatherState(
        weatherState
    ) {
        state.weather.state =
            weatherState;

        body.dataset.weatherState =
            weatherState;

        if (!cityBackground) {
            return;
        }

        cityBackground.classList.remove(
            "weather-clear",
            "weather-cloudy",
            "weather-fog",
            "weather-rain",
            "weather-storm",
            "weather-snow"
        );

        cityBackground.classList.add(
            `weather-${weatherState}`
        );
    }

    /* =====================================================
       DAY PERIOD STATE
    ===================================================== */

    function setDayPeriod(period) {
        body.dataset.dayPeriod =
            period;

        if (cityBackground) {
            cityBackground.classList.remove(
                "period-morning",
                "period-day",
                "period-afternoon",
                "period-evening",
                "period-night",
                "period-unknown"
            );

            cityBackground.classList.add(
                `period-${period}`
            );
        }

        state.weather.period =
            period;

        updatePanels(elements => {
            if (elements.period) {
                elements.period.textContent =
                    periodLabels[period] ||
                    periodLabels.unknown;
            }
        });
    }

    /* =====================================================
       UPDATED TIME
    ===================================================== */

    function formatUpdatedTime() {
        return new Intl.DateTimeFormat(
            undefined,
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        ).format(
            new Date()
        );
    }

    /* =====================================================
       WEATHER ERROR
    ===================================================== */

    function showWeatherError(
        message = "Weather unavailable"
    ) {
        state.weather.state =
            "unknown";

        body.dataset.weatherState =
            "unknown";

        setPanelStatus(
            "OFFLINE",
            true
        );

        setDayPeriod(
            "unknown"
        );

        updatePanels(elements => {
            if (elements.temperature) {
                elements.temperature.textContent =
                    "--°";
            }

            if (elements.description) {
                elements.description.textContent =
                    message;
            }

            if (elements.humidity) {
                elements.humidity.textContent =
                    "--%";
            }

            if (elements.wind) {
                elements.wind.textContent =
                    "-- km/h";
            }

            if (elements.updated) {
                elements.updated.textContent =
                    "Connection unavailable";
                elements.updated.title =
                    "Last updated";
            }

            if (elements.feels) 
                elements.feels.textContent = 
                    "--°C";

            if (elements.visibility) 
                elements.visibility.textContent = 
                    "-- km";

            if (elements.pressure) 
                elements.pressure.textContent = 
                    "---- hPa";

        });
    }

    /* =====================================================
       BUILD DYNAMIC WEATHER URL
    ===================================================== */

    function buildWeatherUrl(
        latitude,
        longitude
    ) {
        const params =
            new URLSearchParams({
                latitude:
                    String(latitude),

                longitude:
                    String(longitude),

                current: [
                  "temperature_2m",
                  "relative_humidity_2m",
                  "apparent_temperature",
                  "precipitation",
                  "weather_code",
                  "wind_speed_10m",
                  "wind_direction_10m",
                  "surface_pressure",
                  "visibility",
                  "is_day"
                ].join(","),

                daily:
                    "sunrise,sunset",

                forecast_days:
                    "1",

                /*
                 * IMPORTANT:
                 * Do not use Asia/Kolkata.
                 *
                 * Open-Meteo will return local
                 * sunrise/sunset/time for the
                 * visitor's coordinates.
                 */
                timezone:
                    "auto"
            });

        return (
            "https://api.open-meteo.com/v1/forecast?" +
            params.toString()
        );
    }

    /* =====================================================
   RESOLVE CURRENT CITY (Google-style)
===================================================== */

async function resolveVisitorLocation(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { cache: "no-store" }
        );

        const data = await response.json();

        const area = data.locality || data.localityName;
        const city = data.city || data.principalSubdivision || "Unknown";

        locationLabel = area && area !== city
            ? `${area}, ${city}`
            : city;

        setLocationText(locationLabel);
        return locationLabel;

    } catch (error) {
        locationLabel = "Location unavailable";
        setLocationText(locationLabel);
        return locationLabel;
    }
}

    /* =====================================================
       WEATHER FETCH
    ===================================================== */

    async function fetchWeather(latitude, longitude) {
    const response = await fetch(
        buildWeatherUrl(latitude, longitude),
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(`Weather API: ${response.status}`);
    }

    return await response.json();
}

    /* =====================================================
       UPDATE WEATHER INTERFACE
    ===================================================== */

    function updateWeatherInterface(
        data
    ) {
        if (
            !data ||
            !data.current
        ) {
            showWeatherError();
            return;
        }

        const current =
            data.current;

        const daily =
            data.daily || {};

        const weatherCode =
            Number(
                current.weather_code
            );

        const weatherInfo =
            weatherCodeMap[
                weatherCode
            ] || {
                state: "cloudy",
                icon: "☁",
                nightIcon: "☁",
                description:
                    "Variable conditions"
            };

        const period =
            getDayPeriod(
                current.time,
                daily.sunrise?.[0],
                daily.sunset?.[0]
            );

        const isNight =
            period === "night";

        const temperature =
            Number(
                current.temperature_2m
            );

        const humidity =
            Number(
                current.relative_humidity_2m
            );

        const windSpeed =
            Number(
                current.wind_speed_10m
            );

        const feelsLike =
            Number(
                current.apparent_temperature
            );

        const visibility =
            Number(
                current.visibility) / 1000;

        const pressure =
            Number(
                current.surface_pressure);    

        setWeatherState(
            weatherInfo.state
        );

        setDayPeriod(
            period
        );

        setPanelStatus(
            "LIVE"
        );

        state.weather.temperature =
            Number.isFinite(
                temperature
            )
                ? temperature
                : null;

        state.weather.humidity =
            Number.isFinite(
                humidity
            )
                ? humidity
                : null;

        state.weather.windSpeed =
            Number.isFinite(
                windSpeed
            )
                ? windSpeed
                : null;

        state.weather.description =
            weatherInfo.description;

        state.weather.icon =
            isNight
                ? weatherInfo.nightIcon
                : weatherInfo.icon;

        state.weather.isDay =
            !isNight;

        state.weather.lastUpdated =
            new Date().toISOString();

        state.weather.location =
            locationLabel;

        state.weather.latitude =
            visitorLocation?.latitude ??
            null;

        state.weather.longitude =
            visitorLocation?.longitude ??
            null;

        state.weather.timezone =
            data.timezone ||
            null;

        updatePanels(elements => {
            if (elements.location) {
                elements.location.textContent =
                    locationLabel;
            }

            if (elements.icon) {
                elements.icon.textContent =
                    state.weather.icon;
            }

            if (
                elements.temperature
            ) {
                elements.temperature.textContent =
                    Number.isFinite(
                        temperature
                    )
                        ? `${Math.round(
                            temperature
                        )}°C`
                        : "--°";
            }

            if (
                elements.description
            ) {
                elements.description.textContent =
                    weatherInfo.description;
            }

            if (elements.humidity) {
                elements.humidity.textContent =
                    Number.isFinite(
                        humidity
                    )
                        ? `${Math.round(
                            humidity
                        )}%`
                        : "--%";
            }

            if (elements.wind) {
                elements.wind.textContent =
                    Number.isFinite(
                        windSpeed
                    )
                        ? `${Math.round(
                            windSpeed
                        )} km/h`
                        : "-- km/h";
            }

            if (elements.feels) {
                elements.feels.textContent = `${Math.round(feelsLike)}°C`;
            }

            if (elements.visibility) {
                elements.visibility.textContent = `${visibility.toFixed(1)} km`;
            }

            if (elements.pressure) {
                elements.pressure.textContent = `${Math.round(pressure)} hPa`;
            }

            if (elements.updated) {
                elements.updated.textContent =
                    formatUpdatedTime();
            }
        });
    }

    /* =====================================================
       LOCATION ERROR HANDLER
    ===================================================== */

    function handleLocationError(
        error
    ) {

        console.error("GPS Error:", error.code, error.message);

        locationRequestInProgress = false;

        body.dataset.locationState = "unavailable";

        locationRequestInProgress =
            false;

        body.dataset.locationState =
            "unavailable";

        let message =
            "Location permission required";

        if (
            error?.code === 1
        ) {
            message =
                "Allow location to show local weather";
        } else if (
            error?.code === 2
        ) {
            message =
                "Location could not be detected";
        } else if (
            error?.code === 3
        ) {
            message =
                "Location detection timed out";
        }

        setLocationText(
            message
        );

        if (visitorLocation) {
            loadRealWeather();
            return;
        }

        showWeatherError(message);

        console.warn(
            "Visitor location was not available:",
            error
        );
    }

    /* =====================================================
       REQUEST VISITOR LOCATION
    ===================================================== */

    function requestVisitorLocation() {
        if (
            locationRequestInProgress
        ) {
            return;
        }

        if (
            !navigator.geolocation
        ) {
            handleLocationError({
                code: 2
            });

            return;
        }

        locationRequestInProgress =
            true;

        body.dataset.locationState =
            "requesting";

        setPanelStatus(
            "LOCATING"
        );

        setLocationText(
            "Detecting your location..."
        );

        navigator.geolocation.watchPosition(
            async position => {
                visitorLocation = {
                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

                    accuracy:
                        position.coords.accuracy
                };

                

                locationRequestInProgress =
                    false;

                body.dataset.locationState =
                    "ready";

                setPanelStatus(
                    "SYNCING"
                );

                await resolveVisitorLocation(
                    visitorLocation.latitude,
                    visitorLocation.longitude
                );

                loadRealWeather();
            },

            handleLocationError,

            {
                /*
                 * High accuracy is not necessary
                 * for city-level weather.
                 *
                 * This also saves battery on mobile.
                 */
                enableHighAccuracy:
                    true,

                /*
                 * Do not wait forever.
                 */
                timeout:
                    15000,

                /*
                 * Browser may reuse a recent
                 * location for up to 5 minutes.
                 */
                maximumAge:
                    0
            }
        );
    }

    /* =====================================================
   LOAD REAL-TIME WEATHER
   - Gets fresh GPS location every refresh
   - No cached coordinates (maximumAge: 0)
   - Resolves current city name
   - Loads latest weather from Open-Meteo
===================================================== */

/* =====================================================
   LOAD REAL-TIME WEATHER
   Google-style live refresh
===================================================== */

async function loadRealWeather() {

    if (!visitorLocation) {
        requestVisitorLocation();
        return;
    }

    setPanelStatus("SYNCING");

    try {
        const data = await fetchWeather(
            visitorLocation.latitude,
            visitorLocation.longitude
        );

        updateWeatherInterface(data);

    } catch (error) {
        console.error("Weather Fetch Error:", error);
        showWeatherError("Weather unavailable");
    }
}

    /* =====================================================
       INITIAL LOCATION REQUEST
    ===================================================== */

    requestVisitorLocation();


    /* =====================================================
   WEATHER AUTO REFRESH
===================================================== */

const weatherRefreshTimer = setInterval(() => {
    loadRealWeather();
}, 300000); // 5 minutes

    

    

    /* =====================================================
       TAB VISIBILITY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {
            if (!document.hidden) {
                loadRealWeather();
            }
        }
    );

    /* =====================================================
       PUBLIC WEATHER API
    ===================================================== */

    window.SiddharthWeather = {
        reload:
            loadRealWeather,

        locate:
            requestVisitorLocation,

        getLocation:
            () => visitorLocation,

        destroy: () => {
            clearInterval(weatherRefreshTimer);
        }
    };
})();

/* =========================================================
   CITY PARALLAX
========================================================= */

(function cityParallax() {
    const city = $("#cityBackground");

    if (!city) return;

    const finePointer =
        window.matchMedia(
            "(pointer:fine)"
        ).matches;

    if (!finePointer) return;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    document.addEventListener(
        "mousemove",
        event => {
            targetX =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                ) * 10;

            targetY =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                ) * 7;
        }
    );

    function animate() {
        currentX +=
            (targetX - currentX) *
            0.025;

        currentY +=
            (targetY - currentY) *
            0.025;

        city.style.transform =
            `scale(1.025) translate3d(` +
            `${currentX}px, ${currentY}px, 0)`;

        requestAnimationFrame(
            animate
        );
    }

    animate();
})();

/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements =
    $$(".reveal");

if (
    "IntersectionObserver" in
    window
) {
    const revealObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.12
            }
        );

    revealElements.forEach(
        element => {
            revealObserver.observe(
                element
            );
        }
    );
} else {
    revealElements.forEach(
        element => {
            element.classList.add(
                "visible"
            );
        }
    );
}

/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    $$("main section[id]");

const navLinks =
    $$(".nav-link");

if (
    "IntersectionObserver" in
    window
) {
    const sectionObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        navLinks.forEach(
                            link => {
                                link.classList.remove(
                                    "active"
                                );
                            }
                        );

                        const activeLink =
                            $(
                                `.nav-link[href="#${entry.target.id}"]`
                            );

                        if (activeLink) {
                            activeLink.classList.add(
                                "active"
                            );
                        }
                    }
                );
            },
            {
                rootMargin:
                    "-30% 0px -55% 0px"
            }
        );

    sections.forEach(
        section => {
            sectionObserver.observe(
                section
            );
        }
    );
}

/* =========================================================
   COUNTER ANIMATION
========================================================= */

function animateCounter(
    element
) {
    const target =
        Number(
            element.dataset.target
        );

    if (
        !Number.isFinite(
            target
        )
    ) {
        return;
    }

    const duration = 1200;

    const start =
        performance.now();

    function update(time) {
        const progress =
            Math.min(
                (time - start) /
                duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        element.textContent =
            Math.floor(
                target * eased
            );

        if (
            progress < 1
        ) {
            requestAnimationFrame(
                update
            );
        } else {
            element.textContent =
                target;
        }
    }

    requestAnimationFrame(
        update
    );
}

if (
    "IntersectionObserver" in
    window
) {
    const counterObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        if (
                            entry.isIntersecting
                        ) {
                            animateCounter(
                                entry.target
                            );

                            counterObserver.unobserve(
                                entry.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.6
            }
        );

    $$(".counter").forEach(
        counter => {
            counterObserver.observe(
                counter
            );
        }
    );
} else {
    $$(".counter").forEach(
        counter => {
            counter.textContent =
                counter.dataset.target ||
                "0";
        }
    );
}

/* =========================================================
   SKILL BARS
========================================================= */

if (
    "IntersectionObserver" in
    window
) {
    const skillObserver =
        new IntersectionObserver(
            entries => {
                entries.forEach(
                    entry => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        $$(".skill-bar span", entry.target)
                            .forEach(
                                bar => {
                                    setTimeout(
                                        () => {
                                            bar.style.width =
                                                bar.dataset.width;
                                        },
                                        150
                                    );
                                }
                            );

                        skillObserver.unobserve(
                            entry.target
                        );
                    }
                );
            },
            {
                threshold: 0.25
            }
        );

    $$(".skill-card").forEach(
        card => {
            skillObserver.observe(
                card
            );
        }
    );
} else {
    $$(".skill-bar span").forEach(
        bar => {
            bar.style.width =
                bar.dataset.width;
        }
    );
}

/* =========================================================
   PROJECT FILTERS
========================================================= */

const projectFilters =
    $$(".project-filter");

const projectCards =
    $$(".project-card");

projectFilters.forEach(
    filter => {
        filter.addEventListener(
            "click",
            () => {
                projectFilters.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                filter.classList.add(
                    "active"
                );

                const selected =
                    filter.dataset.filter;

                projectCards.forEach(
                    card => {
                        const category =
                            card.dataset.category;

                        const shouldShow =
                            selected === "all" ||
                            category === selected;

                        card.classList.toggle(
                            "hidden",
                            !shouldShow
                        );
                    }
                );
            }
        );
    }
);

/* =========================================================
   PROJECT PAGE NAVIGATION
========================================================= */

const projectPages = {
    univichar:
        "projects/univichar.html",

    powerbi:
        "projects/powerbi-dashboard.html",

    sql:
        "projects/sql-analysis.html",

    portfolio:
        "projects/portfolio-system.html",

    computer:
        "projects/fundamental-of-computer.html"
};

$$(".project-card").forEach(
    card => {
        const button =
            $(".project-open", card);

        const projectKey =
            card.dataset.project ||
            button?.dataset.project;

        if (
            !projectKey ||
            !projectPages[projectKey]
        ) {
            return;
        }

        card.dataset.project =
            projectKey;

        card.setAttribute(
            "tabindex",
            "0"
        );

        card.setAttribute(
            "role",
            "link"
        );

        const openProjectPage =
            () => {
                const page =
                    projectPages[
                        projectKey
                    ];

                if (page) {
                    window.location.href =
                        page;
                }
            };

        card.addEventListener(
            "click",
            event => {
                if (
                    event.target.closest(
                        ".project-open"
                    )
                ) {
                    return;
                }

                if (
                    event.target.closest(
                        "a"
                    )
                ) {
                    return;
                }

                openProjectPage();
            }
        );

        card.addEventListener(
            "keydown",
            event => {
                if (
                    event.key ===
                        "Enter" ||
                    event.key ===
                        " "
                ) {
                    event.preventDefault();

                    openProjectPage();
                }
            }
        );

        if (button) {
            button.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    openProjectPage();
                }
            );
        }
    }
);

/* =========================================================
   OWNER-MANAGED CERTIFICATES
========================================================= */

const ownerCertificates = [
    {
        src:
            "assets/certificates/certificate-.jpg",

        title:
            "Certificate Name"
    },

    {
        src:
            "assets/certificates/certificate-1.jpg",

        title:
            "Another Certificate"
    },

    {
        src:
            "assets/certificates/certificate-2.jpg",

        title:
            "Another Certificate"
    },

    {
        src:
            "assets/certificates/certificate-3.jpg",

        title:
            "Another Certificate"
    },

    {
        src:
            "assets/certificates/certificate-4.jpg",

        title:
            "Another Certificate"
    },

    {
        src:
            "assets/certificates/certificate-5.jpg",

        title:
            "Another Certificate"
    }
];

const certificateGrid =
    $("#certificateGrid");

function renderCertificates() {
    if (!certificateGrid) {
        return;
    }

    certificateGrid.innerHTML =
        "";

    if (
        ownerCertificates.length ===
        0
    ) {
        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "certificate-empty";

        const tag =
            document.createElement(
                "span"
            );

        tag.textContent =
            "<certificate />";

        const title =
            document.createElement(
                "p"
            );

        title.textContent =
            "No certificates published yet.";

        const description =
            document.createElement(
                "small"
            );

        description.textContent =
            "Owner-managed certificates will appear here.";

        empty.appendChild(
            tag
        );

        empty.appendChild(
            title
        );

        empty.appendChild(
            description
        );

        certificateGrid.appendChild(
            empty
        );

        return;
    }

    ownerCertificates.forEach(
        (certificate, index) => {
            const item =
                document.createElement(
                    "article"
                );

            item.className =
                "certificate-item";

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                certificate.src;

            image.alt =
                certificate.title ||
                `Certificate ${
                    index + 1
                }`;

            image.loading =
                "lazy";

            item.appendChild(
                image
            );

            certificateGrid.appendChild(
                item
            );
        }
    );
}

renderCertificates();

/* =========================================================
   RESUME TEMPLATE SYSTEM
========================================================= */

const resumePaper =
    $("#resumePaper");

const templateButtons =
    $$(".template-select");

const editorTemplateButtons =
    $$(".editor-template");

function applyResumeTemplate(
    templateNumber
) {
    if (!resumePaper) {
        return;
    }

    state.selectedResumeTemplate =
        Number(
            templateNumber
        );

    resumePaper.classList.remove(
        "template-1",
        "template-2",
        "template-3",
        "template-4"
    );

    resumePaper.classList.add(
        `template-${templateNumber}`
    );

    templateButtons.forEach(
        button => {
            button.classList.toggle(
                "active",
                button.dataset.template ===
                String(
                    templateNumber
                )
            );
        }
    );

    editorTemplateButtons.forEach(
        button => {
            button.classList.toggle(
                "active",
                button.dataset.editorTemplate ===
                String(
                    templateNumber
                )
            );
        }
    );
}

templateButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                applyResumeTemplate(
                    button.dataset.template
                );
            }
        );
    }
);

editorTemplateButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                applyResumeTemplate(
                    button.dataset.editorTemplate
                );
            }
        );
    }
);

applyResumeTemplate(1);

/* =========================================================
   RESUME EDITOR
========================================================= */

const resumeEditor =
    $("#resumeEditor");

const printResumeButton =
    $("#printResume");

const closeResumeEditorButton =
    $("#closeResumeEditor");

const editorPrint =
    $("#editorPrint");

const editorDownloadPdf =
    $("#editorDownloadPdf");

function openResumeEditor() {
    if (!resumeEditor) {
        return;
    }

    resumeEditor.classList.add(
        "open"
    );

    resumeEditor.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    document.body.dataset.resumeEditorOpen =
        "true";
}

function closeResumeEditor() {
    if (!resumeEditor) {
        return;
    }

    resumeEditor.classList.remove(
        "open"
    );

    resumeEditor.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    document.body.dataset.resumeEditorOpen =
        "false";
}

if (printResumeButton) {
    printResumeButton.addEventListener(
        "click",
        openResumeEditor
    );
}

if (closeResumeEditorButton) {
    closeResumeEditorButton.addEventListener(
        "click",
        closeResumeEditor
    );
}

/* =========================================================
   RESUME PHOTO UPLOAD
========================================================= */

const resumePhotoInput =
    $("#resumePhotoInput");

const resumePhoto =
    $("#resumePhoto");

if (resumePhoto) {
    resumePhoto.src =
        state.resumePhoto;
}

if (resumePhotoInput) {
    resumePhotoInput.addEventListener(
        "change",
        event => {
            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                loadEvent => {
                    const source =
                        loadEvent.target.result;

                    state.resumePhoto =
                        source;

                    localStorage.setItem(
                        "siddharthResumePhoto",
                        source
                    );

                    if (resumePhoto) {
                        resumePhoto.src =
                            source;
                    }

                    const miniPhoto =
                        $(".mini-photo img");

                    if (miniPhoto) {
                        miniPhoto.src =
                            source;
                    }
                };

            reader.readAsDataURL(
                file
            );
        }
    );
}

/* =========================================================
   RESUME EDITABLE FIELDS
========================================================= */

const editableResumeFields =
    $$(
        '#resumePaper [contenteditable="true"]'
    );

editableResumeFields.forEach(
    field => {
        field.addEventListener(
            "focus",
            () => {
                field.dataset.original =
                    field.innerHTML;
            }
        );

        field.addEventListener(
            "keydown",
            event => {
                if (
                    event.key ===
                        "Enter" &&
                    !event.shiftKey
                ) {
                    event.preventDefault();

                    if (
                        field.tagName !==
                        "LI"
                    ) {
                        document.execCommand(
                            "insertLineBreak"
                        );
                    }
                }
            }
        );
    }
);

/* =========================================================
   DOWNLOAD ORIGINAL RESUME PDF
========================================================= */

const downloadResume =
    $("#downloadResume");

function downloadOriginalResume() {
    const anchor =
        document.createElement(
            "a"
        );

    anchor.href =
        "assets/resume.pdf";

    anchor.download =
        "Siddharth-Mishra-Resume.pdf";

    document.body.appendChild(
        anchor
    );

    anchor.click();

    anchor.remove();
}

if (downloadResume) {
    downloadResume.addEventListener(
        "click",
        () => {
            downloadOriginalResume();

            setTimeout(
                () => {
                    openResumeEditor();
                },
                450
            );
        }
    );
}

/* =========================================================
   PRINT A4 RESUME
========================================================= */

function printA4Resume() {
    openResumeEditor();

    setTimeout(
        () => {
            window.print();
        },
        250
    );
}

if (editorPrint) {
    editorPrint.addEventListener(
        "click",
        printA4Resume
    );
}

/* =========================================================
   EDITOR DOWNLOAD / SAVE AS PDF
========================================================= */

if (editorDownloadPdf) {
    editorDownloadPdf.addEventListener(
        "click",
        () => {
            openResumeEditor();

            setTimeout(
                () => {
                    window.print();
                },
                250
            );
        }
    );
}

/* =========================================================
   CONTACT INTERACTION
========================================================= */

$$(".contact-link").forEach(
    link => {
        link.addEventListener(
            "mouseenter",
            () => {
                link.style.setProperty(
                    "--contact-glow",
                    "1"
                );
            }
        );

        link.addEventListener(
            "mouseleave",
            () => {
                link.style.setProperty(
                    "--contact-glow",
                    "0"
                );
            }
        );
    }
);

/* =========================================================
   HASH NAVIGATION
========================================================= */

window.addEventListener(
    "load",
    () => {
        if (
            !window.location.hash
        ) {
            return;
        }

        setTimeout(
            () => {
                const target =
                    document.querySelector(
                        window.location.hash
                    );

                if (target) {
                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth"
                        }
                    );
                }
            },
            100
        );
    }
);

/* =========================================================
   RESUME EDITOR CLOSE WITH ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            resumeEditor &&
            resumeEditor.classList.contains(
                "open"
            )
        ) {
            closeResumeEditor();
        }
    }
);

/* =========================================================
   MOBILE CITY OPTIMIZATION
========================================================= */

function optimizeCityForDevice() {
    const isSmall =
        window.innerWidth < 600;

    const rain =
        $("#rain");

    if (
        isSmall &&
        rain
    ) {
        const drops =
            $$(".raindrop", rain);

        drops.forEach(
            (drop, index) => {
                if (
                    index > 58
                ) {
                    drop.remove();
                }
            }
        );
    }
}

window.addEventListener(
    "resize",
    optimizeCityForDevice
);

optimizeCityForDevice();

/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {
        const city =
            $("#cityBackground");

        if (!city) {
            return;
        }

        if (document.hidden) {
            city.style.animationPlayState =
                "paused";
        } else {
            city.style.animationPlayState =
                "running";

            /*
             * Fixed:
             * loadRealTimeWeather() was not
             * available in this scope.
             */
            window.SiddharthWeather
                ?.reload?.();
        }
    }
);

/* =========================================================
   CONSOLE BRANDING
========================================================= */

console.log(
    `%c SIDDHARTH MISHRA
%c Developer • Builder • Learner
%c Real-time portfolio system initialized.
%c Visitor-location weather system connected through Open-Meteo.
`,
    "color:#00eaff;font-size:20px;font-weight:bold;",
    "color:#9b5cff;font-size:12px;",
    "color:#47f6a0;font-size:11px;",
    "color:#ffd166;font-size:11px;"
);

/* =========================================================
   FINAL SYSTEM STATUS
========================================================= */

window.SiddharthPortfolio = {
    version:
        "FINAL-WEATHER-VISITOR-LOCATION",

    technologies: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Python",
        "SQL",
        "Power BI",
        "Git",
        "GitHub",
        "Open-Meteo API",
        "Browser Geolocation API"
    ],

    weather: {
        /*
         * Fixed:
         * Direct reference to the old
         * loadRealTimeWeather function
         * has been removed.
         */
        refresh:
            () =>
                window
                    .SiddharthWeather
                    ?.reload?.(),

        locate:
            () =>
                window
                    .SiddharthWeather
                    ?.locate?.(),

        location:
            () =>
                window
                    .SiddharthWeather
                    ?.getLocation?.(),

        current:
            () =>
                state.weather
    },

    resume: {
        templates: 4,

        currentTemplate:
            () =>
                state.selectedResumeTemplate,

        open:
            openResumeEditor,

        close:
            closeResumeEditor,

        print:
            printA4Resume
    },

    projects:
        Object.keys(
            projectPages
        ),

    status:
        "ONLINE"
};