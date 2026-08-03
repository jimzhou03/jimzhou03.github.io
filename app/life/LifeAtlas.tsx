"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  chinaToGermanyRoute,
  cityIds,
  frankfurtToHeidelbergRoute,
  germanyLocations,
  germanyNodeIds,
  getLifeRoute,
  lifeLocations,
  type CityId,
  type GermanyNodeId,
  type LifeRoute,
  type TransitMode,
} from "../../content/life-locations";

type LifeView = "china" | "chinaToGermany" | "germany";
type GermanyStage = "overview" | "frankfurtToHeidelberg";

type ChinaRouteState = {
  from: CityId | null;
  to: CityId | null;
  mode: Exclude<TransitMode, "train"> | null;
};

type MotionRoute = LifeRoute & {
  kind: "china" | "international" | "germany";
  viewBox: string;
};

const emptyChinaRoute: ChinaRouteState = { from: null, to: null, mode: null };

const vehicleAssets: Record<TransitMode, string> = {
  bus: "/life/icon-bus.svg",
  plane: "/life/icon-plane.svg",
  train: "/life/icon-train.svg",
};

function VehicleIcon({ mode }: { mode: TransitMode }) {
  const size = mode === "plane" ? 24 : 21;
  return (
    <image
      className={`life-atlas-vehicle-icon is-${mode}`}
      href={vehicleAssets[mode]}
      x={-size / 2}
      y={-size / 2}
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
}

function activateWithKeyboard(
  event: React.KeyboardEvent<HTMLButtonElement>,
  callback: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

export default function LifeAtlas() {
  const [lifeView, setLifeView] = useState<LifeView>("china");
  const [activeChinaCity, setActiveChinaCity] = useState<CityId>("guangzhou");
  const [hoveredChinaCity, setHoveredChinaCity] = useState<CityId | null>(null);
  const [hoveredGermanyNode, setHoveredGermanyNode] = useState<GermanyNodeId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [germanyStage, setGermanyStage] = useState<GermanyStage>("overview");
  const [chinaRouteState, setChinaRouteState] = useState<ChinaRouteState>(emptyChinaRoute);

  const archiveRef = useRef<HTMLElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const vehicleRef = useRef<SVGGElement>(null);
  const routeLayerRef = useRef<SVGGElement>(null);

  const activeChinaLocation = lifeLocations[activeChinaCity];
  const chinaRoute = useMemo(() => {
    if (!chinaRouteState.from || !chinaRouteState.to) return null;
    return getLifeRoute(chinaRouteState.from, chinaRouteState.to);
  }, [chinaRouteState]);

  const motionRoute = useMemo<MotionRoute | null>(() => {
    if (lifeView === "chinaToGermany") {
      return { ...chinaToGermanyRoute, kind: "international", viewBox: "0 0 774 569" };
    }
    if (lifeView === "germany" && germanyStage === "frankfurtToHeidelberg") {
      return { ...frankfurtToHeidelbergRoute, kind: "germany", viewBox: "0 0 586 793" };
    }
    if (lifeView === "china" && chinaRoute) {
      return { ...chinaRoute, kind: "china", viewBox: "0 0 774 569" };
    }
    return null;
  }, [chinaRoute, germanyStage, lifeView]);

  useEffect(() => {
    if (!motionRoute || !progressPathRef.current || !routeLayerRef.current) return;

    const archive = archiveRef.current;
    const progressPath = progressPathRef.current;
    const vehicle = vehicleRef.current;
    const routeLayer = routeLayerRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const routeLength = progressPath.getTotalLength();
    const travelDuration = motionRoute.mode === "bus" ? 1.3 : motionRoute.mode === "train" ? 1.45 : 1.72;
    const routeProxy = { distance: 0 };

    const revealArchive = (onComplete?: () => void) => {
      if (!archive) {
        onComplete?.();
        return;
      }
      const entries = archive.querySelectorAll<HTMLElement>("[data-life-entry]");
      gsap.set(archive, { opacity: 1, y: 0 });
      gsap.fromTo(
        entries,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: reduceMotion ? 0.01 : 0.52,
          stagger: reduceMotion ? 0 : 0.075,
          ease: "power2.out",
          clearProps: "opacity,transform",
          onComplete,
        },
      );
    };

    const clearRoute = (onComplete?: () => void) => {
      gsap.to(routeLayer, {
        opacity: 0,
        duration: reduceMotion ? 0.01 : 0.24,
        delay: reduceMotion ? 0 : 0.1,
        onComplete,
      });
    };

    const finishJourney = () => {
      if (motionRoute.kind === "china") {
        setActiveChinaCity(motionRoute.to as CityId);
        window.requestAnimationFrame(() => {
          revealArchive(() => {
            clearRoute(() => {
              setChinaRouteState(emptyChinaRoute);
              setIsTransitioning(false);
            });
          });
        });
        return;
      }

      if (motionRoute.kind === "international") {
        setLifeView("germany");
        setGermanyStage("overview");
        window.requestAnimationFrame(() => {
          revealArchive(() => setIsTransitioning(false));
        });
        return;
      }

      clearRoute(() => {
        setGermanyStage("overview");
        setIsTransitioning(false);
      });
    };

    gsap.set(routeLayer, { opacity: 1 });
    gsap.set(progressPath, {
      strokeDasharray: routeLength,
      strokeDashoffset: reduceMotion ? 0 : routeLength,
    });

    if (motionRoute.kind === "international" && archive) {
      gsap.fromTo(
        archive,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.48, ease: "power2.out" },
      );
    }

    if (reduceMotion) {
      gsap.set(vehicle, { opacity: 0 });
      const delayedFinish = gsap.delayedCall(0.24, finishJourney);
      return () => {
        delayedFinish.kill();
        gsap.killTweensOf([archive, progressPath, vehicle, routeLayer, routeProxy]);
      };
    }

    gsap.set(vehicle, { opacity: 1 });
    const timeline = gsap.timeline({ onComplete: finishJourney });

    timeline.to(
      progressPath,
      { strokeDashoffset: 0, duration: travelDuration, ease: "power2.inOut" },
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
          const wobble = motionRoute.mode === "bus"
            ? Math.sin((routeProxy.distance / routeLength) * Math.PI * 8) * 3
            : 0;
          const lift = motionRoute.mode === "bus"
            ? Math.sin((routeProxy.distance / routeLength) * Math.PI * 6) * 1.5
            : 0;
          const rotation = direction + 90 + wobble;
          gsap.set(vehicle, {
            attr: { transform: `translate(${point.x} ${point.y + lift}) rotate(${rotation})` },
          });
        },
      },
      0,
    );

    if (motionRoute.kind === "china") {
      timeline.to(archive, { opacity: 0, y: 12, duration: 0.48, ease: "power2.inOut" }, 0.2);
    } else if (motionRoute.kind === "international") {
      timeline.to(
        archive,
        { opacity: 0, y: 12, duration: 0.42, ease: "power2.inOut" },
        travelDuration - 0.36,
      );
    } else {
      timeline.fromTo(
        archive,
        { opacity: 0.76, y: 5 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.22,
      );
    }

    timeline.to(vehicle, { opacity: 0, duration: 0.18, ease: "power1.out" }, travelDuration - 0.02);

    return () => {
      timeline.kill();
      gsap.killTweensOf([archive, progressPath, vehicle, routeLayer, routeProxy]);
    };
  }, [motionRoute]);

  const selectChinaCity = (nextCity: CityId) => {
    if (isTransitioning || lifeView !== "china") return;

    if (nextCity === activeChinaCity) {
      gsap.fromTo(
        `[data-city="${nextCity}"] .life-atlas-node-dot`,
        { scale: 1 },
        { scale: 0.78, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" },
      );
      return;
    }

    const nextRoute = getLifeRoute(activeChinaCity, nextCity);
    setIsTransitioning(true);
    setHoveredChinaCity(null);
    setChinaRouteState({
      from: activeChinaCity,
      to: nextCity,
      mode: nextRoute.mode as Exclude<TransitMode, "train">,
    });
  };

  const beginGermanyJourney = () => {
    if (isTransitioning || lifeView !== "china") return;
    setIsTransitioning(true);
    setHoveredChinaCity(null);
    setActiveChinaCity("guangzhou");
    setLifeView("chinaToGermany");
  };

  const beginGermanyRail = () => {
    if (isTransitioning || lifeView !== "germany") return;
    setIsTransitioning(true);
    setHoveredGermanyNode(null);
    setGermanyStage("frankfurtToHeidelberg");
  };

  const returnToChina = () => {
    if (isTransitioning || lifeView !== "germany") return;
    setIsTransitioning(true);
    const archive = archiveRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(archive, {
      opacity: 0,
      y: 12,
      duration: reduceMotion ? 0.01 : 0.36,
      ease: "power2.inOut",
      onComplete: () => {
        setLifeView("china");
        setGermanyStage("overview");
        window.requestAnimationFrame(() => {
          if (!archive) {
            setIsTransitioning(false);
            return;
          }
          gsap.fromTo(
            archive,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: reduceMotion ? 0.01 : 0.48,
              ease: "power2.out",
              onComplete: () => setIsTransitioning(false),
            },
          );
        });
      },
    });
  };

  const isChina = lifeView !== "germany";
  const displayedChinaCity = hoveredChinaCity
    ? lifeLocations[hoveredChinaCity]
    : activeChinaLocation;
  const transitLabel = lifeView === "chinaToGermany"
    ? "GUANGZHOU → FRANKFURT"
    : germanyStage === "frankfurtToHeidelberg"
      ? "FRANKFURT → HEIDELBERG"
      : null;

  return (
    <main
      className={`life-atlas is-${lifeView}${germanyStage === "frankfurtToHeidelberg" ? " is-rail-transit" : ""}`}
      aria-labelledby="life-atlas-title"
    >
      <section className="life-atlas-map-panel">
        {isChina ? (
          <button
            className="life-atlas-world-portal"
            type="button"
            disabled={isTransitioning}
            onClick={beginGermanyJourney}
            onKeyDown={(event) => activateWithKeyboard(event, beginGermanyJourney)}
            aria-label="Open route from Guangzhou to Frankfurt, continuing to Heidelberg"
          >
            <span className="life-atlas-world-kicker">04 / NEXT · WORLD ROUTE</span>
            <span className="life-atlas-world-globe" aria-hidden="true">
              {/* Wikimedia Commons public-domain world map. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/life/world-map.png" alt="" />
              <span className="life-atlas-world-destination">
                <i />
                <span>
                  <strong id="life-atlas-title">HEIDELBERG</strong>
                  <small>GERMANY · 49°24′N</small>
                </span>
              </span>
            </span>
            <span className="life-atlas-world-action">
              {lifeView === "chinaToGermany" ? "IN TRANSIT →" : "OPEN ROUTE →"}
            </span>
          </button>
        ) : (
          <div className="life-atlas-quiet-module life-atlas-germany-module">
            <span>05 / GERMANY</span>
            <h1 id="life-atlas-title">GERMANY</h1>
            <p>Arrival, rail and the next chapter.</p>
            <button
              type="button"
              disabled={isTransitioning}
              onClick={returnToChina}
              onKeyDown={(event) => activateWithKeyboard(event, returnToChina)}
            >
              RETURN TO CHINA ←
            </button>
          </div>
        )}

        <div
          className={`life-atlas-map is-${isChina ? "china" : "germany"}`}
          aria-label={isChina ? "Life locations in China" : "Arrival and study locations in Germany"}
        >
          <div className={`life-atlas-map-canvas is-${isChina ? "china" : "germany"}`}>
            {/* Local SVG maps are decorative navigation backdrops. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="life-atlas-map-image"
              src={isChina ? "/life/china.svg" : "/life/germany.svg"}
              alt=""
              aria-hidden="true"
            />

            <svg
              className="life-atlas-route"
              viewBox={motionRoute?.viewBox ?? (isChina ? "0 0 774 569" : "0 0 586 793")}
              aria-hidden="true"
            >
              {isChina ? (
                <g className="life-atlas-mobile-map-points">
                  {cityIds.map((cityId) => {
                    const city = lifeLocations[cityId];
                    return (
                      <g key={cityId} transform={`translate(${city.map.x} ${city.map.y})`}>
                        <circle className={cityId === activeChinaCity ? "is-active" : undefined} r="6" />
                        <text x="12" y="3">{city.label}</text>
                      </g>
                    );
                  })}
                </g>
              ) : (
                <g className="life-atlas-mobile-map-points">
                  {germanyNodeIds.map((nodeId) => {
                    const node = germanyLocations[nodeId];
                    return (
                      <g key={nodeId} transform={`translate(${node.map.x} ${node.map.y})`}>
                        <circle className={nodeId === "heidelberg" ? "is-active" : undefined} r="7" />
                        <text x="14" y="3">{node.label}</text>
                      </g>
                    );
                  })}
                </g>
              )}

              {lifeView === "chinaToGermany" ? (
                <g className="life-atlas-international-destination" transform="translate(92 304)">
                  <circle r="6" />
                  <text x="-12" y="-14" textAnchor="end">FRANKFURT</text>
                  <text x="-12" y="-2" textAnchor="end">GERMANY</text>
                </g>
              ) : null}

              {motionRoute ? (
                <g
                  ref={routeLayerRef}
                  className={`life-atlas-route-layer is-${motionRoute.mode} is-${motionRoute.kind}`}
                >
                  <path className="life-atlas-route-base" d={motionRoute.pathD} />
                  <path ref={progressPathRef} className="life-atlas-route-progress" d={motionRoute.pathD} />
                  <g ref={vehicleRef} className="life-atlas-vehicle">
                    <VehicleIcon mode={motionRoute.mode} />
                  </g>
                </g>
              ) : !isChina ? (
                <path
                  className="life-atlas-route-resting"
                  d={frankfurtToHeidelbergRoute.pathD}
                />
              ) : null}
            </svg>

            <div className="life-atlas-map-nodes">
              {isChina ? cityIds.map((cityId) => {
                const city = lifeLocations[cityId];
                const selected = cityId === activeChinaCity;
                const highlighted = cityId === hoveredChinaCity;
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
                    onMouseEnter={() => setHoveredChinaCity(cityId)}
                    onMouseLeave={() => setHoveredChinaCity(null)}
                    onFocus={() => setHoveredChinaCity(cityId)}
                    onBlur={() => setHoveredChinaCity(null)}
                    onClick={() => selectChinaCity(cityId)}
                    onKeyDown={(event) => activateWithKeyboard(event, () => selectChinaCity(cityId))}
                  >
                    <span className="life-atlas-node-dot" />
                    <span className="life-atlas-node-label">
                      <strong>{city.label}</strong>
                      <span>{city.role}</span>
                    </span>
                  </button>
                );
              }) : germanyNodeIds.map((nodeId) => {
                const node = germanyLocations[nodeId];
                const selected = nodeId === "heidelberg";
                const highlighted = nodeId === hoveredGermanyNode;
                return (
                  <button
                    className={`life-atlas-city-node life-atlas-germany-node${selected ? " is-active" : ""}${highlighted ? " is-hovered" : ""}`}
                    data-city={nodeId}
                    key={nodeId}
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${node.label}, ${node.role}. Play rail route.`}
                    disabled={isTransitioning}
                    style={{ left: `${(node.map.x / 586) * 100}%`, top: `${(node.map.y / 793) * 100}%` }}
                    onMouseEnter={() => setHoveredGermanyNode(nodeId)}
                    onMouseLeave={() => setHoveredGermanyNode(null)}
                    onFocus={() => setHoveredGermanyNode(nodeId)}
                    onBlur={() => setHoveredGermanyNode(null)}
                    onClick={beginGermanyRail}
                    onKeyDown={(event) => activateWithKeyboard(event, beginGermanyRail)}
                  >
                    <span className="life-atlas-node-dot" />
                    <span className="life-atlas-node-label">
                      <strong>{node.label}</strong>
                      <span>{node.role}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="life-atlas-status" aria-live="polite">
          {transitLabel ? (
            <>
              <span>TRANSIT</span>
              <strong>{transitLabel}</strong>
              <span>BY {lifeView === "chinaToGermany" ? "AIR" : "RAIL"}</span>
            </>
          ) : isChina ? (
            <>
              <span>{activeChinaCity === "guangzhou" ? "DEFAULT LOCATION" : "CURRENT LOCATION"}</span>
              <strong>{activeChinaLocation.region}</strong>
              <span>{activeChinaLocation.role}</span>
              {hoveredChinaCity ? (
                <span>HOVER: {displayedChinaCity.label} / {displayedChinaCity.role}</span>
              ) : null}
            </>
          ) : (
            <>
              <span>ARRIVAL POINT</span>
              <strong>FRANKFURT</strong>
              <span>NEXT DESTINATION · HEIDELBERG</span>
            </>
          )}
        </div>

        <div className="life-atlas-location-band">
          <h2>{lifeView === "chinaToGermany" ? "FRANKFURT" : isChina ? activeChinaLocation.label : "HEIDELBERG"}</h2>
          <p>
            {lifeView === "chinaToGermany"
              ? "Arrival in Germany."
              : isChina
                ? activeChinaLocation.description
                : "Next stop, a new language and a new life."}
          </p>
          <div aria-hidden="true"><span>＋</span></div>
        </div>

        <div className={`life-atlas-mobile-tabs is-${isChina ? "china" : "germany"}`} aria-label="Choose a life location">
          {isChina ? cityIds.map((cityId) => {
            const city = lifeLocations[cityId];
            return (
              <button
                key={cityId}
                type="button"
                aria-pressed={cityId === activeChinaCity}
                disabled={isTransitioning}
                onClick={() => selectChinaCity(cityId)}
                onKeyDown={(event) => activateWithKeyboard(event, () => selectChinaCity(cityId))}
              >
                <strong>{city.label}</strong>
                <span>{city.role}</span>
              </button>
            );
          }) : germanyNodeIds.map((nodeId) => {
            const node = germanyLocations[nodeId];
            return (
              <button
                key={nodeId}
                type="button"
                aria-pressed={nodeId === "heidelberg"}
                disabled={isTransitioning}
                onClick={beginGermanyRail}
                onKeyDown={(event) => activateWithKeyboard(event, beginGermanyRail)}
              >
                <strong>{node.label}</strong>
                <span>{node.role}</span>
              </button>
            );
          })}
        </div>

        <small className="life-atlas-map-credit">
          Map outlines: MapSVG · CC BY 4.0 · World map: Wikimedia Commons · Public domain · Icons: Material Icons · Apache 2.0
        </small>
      </section>

      <section
        ref={archiveRef}
        className={`life-atlas-archive is-${lifeView}`}
        aria-labelledby="life-atlas-archive-title"
        aria-busy={isTransitioning}
        aria-live="polite"
      >
        {lifeView === "china" ? (
          <ChinaArchive activeCity={activeChinaCity} />
        ) : lifeView === "chinaToGermany" ? (
          <TransitArchive />
        ) : (
          <GermanyArchive isTransitioning={isTransitioning} onOpenRoute={beginGermanyRail} />
        )}
      </section>
    </main>
  );
}

function ChinaArchive({ activeCity }: { activeCity: CityId }) {
  const location = lifeLocations[activeCity];
  return (
    <>
      <header data-life-entry>
        <span>{location.role}</span>
        <div>
          <h2 id="life-atlas-archive-title">{location.label}</h2>
          <p>{location.description}</p>
        </div>
      </header>

      {location.photos.length ? (
        <div className="life-atlas-archive-grid">
          {location.photos.map((photo, index) => (
            <figure
              className={index === 0 ? "life-atlas-photo is-featured" : "life-atlas-photo"}
              data-life-entry
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
        <div className="life-atlas-empty" data-life-entry>
          <span>NO PHOTOGRAPHS FILED</span>
          <h3>CHONGQING</h3>
          <p>{location.emptyMessage}</p>
        </div>
      )}
    </>
  );
}

function TransitArchive() {
  return (
    <>
      <header data-life-entry>
        <span>TRANSIT</span>
        <div>
          <h2 id="life-atlas-archive-title">FRANKFURT</h2>
          <p>Arrival in Germany.</p>
        </div>
      </header>
      <div className="life-atlas-dossier life-atlas-transit-dossier">
        <article data-life-entry data-sequence="01">
          <span>DEPARTURE</span>
          <strong>GUANGZHOU</strong>
          <p>Home · Guangdong · China</p>
        </article>
        <article data-life-entry data-sequence="02">
          <span>ROUTE</span>
          <strong>BY AIR</strong>
          <p>One long arc toward a new chapter.</p>
        </article>
        <article data-life-entry data-sequence="03">
          <span>ARRIVAL</span>
          <strong>FRANKFURT</strong>
          <p>Germany · onward to Heidelberg.</p>
        </article>
      </div>
    </>
  );
}

function GermanyArchive({
  isTransitioning,
  onOpenRoute,
}: {
  isTransitioning: boolean;
  onOpenRoute: () => void;
}) {
  return (
    <>
      <header data-life-entry>
        <span>GERMANY</span>
        <div>
          <h2 id="life-atlas-archive-title">HEIDELBERG</h2>
          <p>Next stop, a new language and a new life.</p>
        </div>
      </header>
      <div className="life-atlas-dossier life-atlas-germany-dossier">
        <article data-life-entry data-sequence="01" className="is-primary">
          <span>NEXT CHAPTER</span>
          <strong>HEIDELBERG</strong>
          <p>Germany · October 2026</p>
        </article>
        <article data-life-entry data-sequence="02" className="life-atlas-facts">
          <span>STUDY FILE</span>
          <dl>
            <div><dt>UNIVERSITY</dt><dd>Heidelberg University</dd></div>
            <div><dt>PROGRAMME</dt><dd>Computational Linguistics</dd></div>
            <div><dt>START</dt><dd>October 2026</dd></div>
            <div><dt>STATUS</dt><dd>Next chapter</dd></div>
          </dl>
        </article>
        <article data-life-entry data-sequence="03" className="life-atlas-route-card">
          <span>LOCAL ROUTE</span>
          <strong>FRANKFURT → HEIDELBERG</strong>
          <p>Arrival by air, then south by rail.</p>
          <button
            type="button"
            disabled={isTransitioning}
            onClick={onOpenRoute}
            onKeyDown={(event) => activateWithKeyboard(event, onOpenRoute)}
          >
            OPEN LOCAL ROUTE →
          </button>
        </article>
      </div>
    </>
  );
}
