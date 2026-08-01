"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  cityIds,
  getLifeRoute,
  lifeLocations,
  type CityId,
  type TransitMode,
} from "../../content/life-locations";

type RouteState = {
  from: CityId | null;
  to: CityId | null;
  mode: TransitMode | null;
};

const emptyRoute: RouteState = { from: null, to: null, mode: null };

function VehicleIcon({ mode }: { mode: TransitMode }) {
  if (mode === "bus") {
    return (
      <g className="life-atlas-vehicle-drawing" aria-hidden="true">
        <rect x="-9" y="-5" width="18" height="10" rx="1.5" />
        <path d="M-6-5v-3h10l5 3M-5-1h4m3 0h4" />
        <circle cx="-5" cy="6" r="2" />
        <circle cx="5" cy="6" r="2" />
      </g>
    );
  }

  return (
    <g className="life-atlas-vehicle-drawing life-atlas-plane" aria-hidden="true">
      <path d="M13 0 2-3-3-12h-3l2 10-8-4-2 2 7 6-7 5 2 2 8-4-2 10h3l5-9 11-3Z" />
    </g>
  );
}

export default function LifeAtlas() {
  const [activeCity, setActiveCity] = useState<CityId>("guangzhou");
  const [hoveredCity, setHoveredCity] = useState<CityId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [routeState, setRouteState] = useState<RouteState>(emptyRoute);

  const archiveRef = useRef<HTMLElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const vehicleRef = useRef<SVGGElement>(null);
  const routeLayerRef = useRef<SVGGElement>(null);

  const activeLocation = lifeLocations[activeCity];
  const route = useMemo(() => {
    if (!routeState.from || !routeState.to) return null;
    return getLifeRoute(routeState.from, routeState.to);
  }, [routeState]);

  useEffect(() => {
    if (!route || !progressPathRef.current || !routeLayerRef.current) return;

    const archive = archiveRef.current;
    const progressPath = progressPathRef.current;
    const vehicle = vehicleRef.current;
    const routeLayer = routeLayerRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const routeLength = progressPath.getTotalLength();
    const travelDuration = route.mode === "bus" ? 1.35 : 1.65;
    const routeProxy = { distance: 0 };

    gsap.set(routeLayer, { opacity: 1 });
    gsap.set(progressPath, {
      strokeDasharray: routeLength,
      strokeDashoffset: routeLength,
    });

    const revealNewArchive = () => {
      if (!archive) return;
      const frames = archive.querySelectorAll<HTMLElement>("[data-life-photo]");
      gsap.set(archive, { opacity: 1, y: 0 });
      gsap.fromTo(
        frames,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: reduceMotion ? 0.01 : 0.52,
          stagger: reduceMotion ? 0 : 0.075,
          ease: "power2.out",
          clearProps: "opacity,transform",
          onComplete: () => {
            gsap.to(routeLayer, {
              opacity: 0,
              duration: reduceMotion ? 0.01 : 0.24,
              delay: reduceMotion ? 0 : 0.12,
              onComplete: () => {
                setRouteState(emptyRoute);
                setIsTransitioning(false);
              },
            });
          },
        },
      );
    };

    if (reduceMotion) {
      gsap.set(progressPath, { strokeDashoffset: 0 });
      gsap.set(vehicle, { opacity: 0 });
      gsap.to(archive, {
        opacity: 0,
        y: 10,
        duration: 0.01,
        delay: 0.18,
        onComplete: () => {
          setActiveCity(route.to);
          window.requestAnimationFrame(revealNewArchive);
        },
      });
      return () => gsap.killTweensOf([archive, progressPath, vehicle, routeLayer, routeProxy]);
    }

    gsap.set(vehicle, { opacity: 1 });
    const timeline = gsap.timeline({
      onComplete: () => {
        setActiveCity(route.to);
        window.requestAnimationFrame(() => window.requestAnimationFrame(revealNewArchive));
      },
    });

    timeline.to(
      progressPath,
      {
        strokeDashoffset: 0,
        duration: travelDuration,
        ease: "power2.inOut",
      },
      0,
    );
    timeline.to(
      routeProxy,
      {
        distance: routeLength,
        duration: travelDuration,
        ease: "power2.inOut",
        onUpdate: () => {
          if (!vehicle) return;
          const point = progressPath.getPointAtLength(routeProxy.distance);
          const next = progressPath.getPointAtLength(Math.min(routeLength, routeProxy.distance + 1));
          const direction = Math.atan2(next.y - point.y, next.x - point.x) * (180 / Math.PI);
          const wobble = route.mode === "bus" ? Math.sin((routeProxy.distance / routeLength) * Math.PI * 8) * 3 : 0;
          const lift = route.mode === "bus" ? Math.sin((routeProxy.distance / routeLength) * Math.PI * 6) * 1.5 : 0;
          gsap.set(vehicle, {
            attr: { transform: `translate(${point.x} ${point.y + lift}) rotate(${direction + wobble})` },
          });
        },
      },
      0,
    );
    timeline.to(
      archive,
      { opacity: 0, y: 12, duration: 0.48, ease: "power2.inOut" },
      0.2,
    );
    timeline.to(vehicle, { opacity: 0, duration: 0.18, ease: "power1.out" }, travelDuration - 0.02);

    return () => {
      timeline.kill();
      gsap.killTweensOf([archive, progressPath, vehicle, routeLayer, routeProxy]);
    };
  }, [route]);

  const selectCity = (nextCity: CityId) => {
    if (isTransitioning) return;

    if (nextCity === activeCity) {
      gsap.fromTo(
        `[data-city="${nextCity}"] .life-atlas-node-dot`,
        { scale: 1 },
        { scale: 0.78, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" },
      );
      return;
    }

    const nextRoute = getLifeRoute(activeCity, nextCity);
    setIsTransitioning(true);
    setHoveredCity(null);
    setRouteState({ from: activeCity, to: nextCity, mode: nextRoute.mode });
  };

  const statusLocation = hoveredCity ? lifeLocations[hoveredCity] : activeLocation;

  return (
    <main className="life-atlas" aria-labelledby="life-atlas-title">
      <section className="life-atlas-map-panel">
        <div className="life-atlas-heading">
          <p>03 / LIFE ATLAS</p>
          <h1 id="life-atlas-title">Three cities,<br /><em>many years.</em></h1>
        </div>

        <div className="life-atlas-map" aria-label="Life locations in China">
          {/* The local province outline is used only as a quiet navigational backdrop. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="life-atlas-map-image" src="/life/china.svg" alt="" aria-hidden="true" />

          <svg className="life-atlas-route" viewBox="0 0 774 569" aria-hidden="true">
            <g className="life-atlas-mobile-map-points">
              {cityIds.map((cityId) => {
                const city = lifeLocations[cityId];
                return (
                  <g key={cityId} transform={`translate(${city.map.x} ${city.map.y})`}>
                    <circle className={cityId === activeCity ? "is-active" : undefined} r="6" />
                    <text x="12" y="3">{city.label}</text>
                  </g>
                );
              })}
            </g>
            {route ? (
              <g ref={routeLayerRef} className={`life-atlas-route-layer is-${route.mode}`}>
                <path className="life-atlas-route-base" d={route.pathD} />
                <path ref={progressPathRef} className="life-atlas-route-progress" d={route.pathD} />
                <g ref={vehicleRef} className="life-atlas-vehicle">
                  <VehicleIcon mode={route.mode} />
                </g>
              </g>
            ) : null}
          </svg>

          <div className="life-atlas-map-nodes">
            {cityIds.map((cityId) => {
              const city = lifeLocations[cityId];
              const selected = cityId === activeCity;
              const highlighted = cityId === hoveredCity;
              return (
                <button
                  className={`life-atlas-city-node${selected ? " is-active" : ""}${highlighted ? " is-hovered" : ""}`}
                  data-city={cityId}
                  key={cityId}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${city.label}, ${city.role}`}
                  disabled={isTransitioning}
                  style={{ left: `${(city.map.x / 774) * 100}%`, top: `${(city.map.y / 569) * 100}%` }}
                  onMouseEnter={() => setHoveredCity(cityId)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onFocus={() => setHoveredCity(cityId)}
                  onBlur={() => setHoveredCity(null)}
                  onClick={() => selectCity(cityId)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectCity(cityId);
                    }
                  }}
                >
                  <span className="life-atlas-node-dot" />
                  <span className="life-atlas-node-label">
                    <strong>{city.label}</strong>
                    <span>{city.role}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="life-atlas-status" aria-live="polite">
          {routeState.from && routeState.to && routeState.mode ? (
            <>
              <span>TRANSIT</span>
              <strong>{lifeLocations[routeState.from].label} → {lifeLocations[routeState.to].label}</strong>
              <span>BY {routeState.mode === "plane" ? "AIR" : "BUS"}</span>
            </>
          ) : (
            <>
              <span>{activeCity === "guangzhou" ? "DEFAULT LOCATION" : "CURRENT LOCATION"}</span>
              <strong>{activeLocation.region}</strong>
              <span>{activeLocation.role}</span>
              {hoveredCity ? <span>HOVER: {statusLocation.label} / {statusLocation.role}</span> : null}
            </>
          )}
        </div>

        <div className="life-atlas-location-band">
          <h2>{activeLocation.label}</h2>
          <p>{activeLocation.description}</p>
          <div>
            <span>{activeLocation.coordinates}</span>
            <span>{activeLocation.elevation}</span>
          </div>
        </div>

        <div className="life-atlas-mobile-tabs" aria-label="Choose a life location">
          {cityIds.map((cityId) => {
            const city = lifeLocations[cityId];
            return (
              <button
                key={cityId}
                type="button"
                aria-pressed={cityId === activeCity}
                disabled={isTransitioning}
                onClick={() => selectCity(cityId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCity(cityId);
                  }
                }}
              >
                <strong>{city.label}</strong>
                <span>{city.role}</span>
              </button>
            );
          })}
        </div>

        <small className="life-atlas-map-credit">
          Map outline adapted from MapSVG · CC BY 4.0
        </small>
      </section>

      <section
        ref={archiveRef}
        className="life-atlas-archive"
        aria-labelledby="life-atlas-archive-title"
        aria-busy={isTransitioning}
        aria-live="polite"
      >
        <header>
          <span>{activeLocation.role}</span>
          <div>
            <h2 id="life-atlas-archive-title">{activeLocation.label}</h2>
            <p>{activeLocation.description}</p>
          </div>
        </header>

        {activeLocation.photos.length ? (
          <div className="life-atlas-archive-grid">
            {activeLocation.photos.map((photo, index) => (
              <figure
                className={index === 0 ? "life-atlas-photo is-featured" : "life-atlas-photo"}
                data-life-photo
                data-sequence={photo.id}
                key={photo.id}
              >
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.image}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <span>{photo.id} / {photo.category}</span>
                  <strong>{photo.title}</strong>
                  <p>{photo.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="life-atlas-empty" data-life-photo>
            <span>NO PHOTOGRAPHS FILED</span>
            <h3>CHONGQING</h3>
            <p>{activeLocation.emptyMessage}</p>
          </div>
        )}
      </section>
    </main>
  );
}
