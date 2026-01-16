import geoip from "geoip-lite";

export const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress
  );
};

export const getGeoFromRequest = (req) => {
  // 1️⃣ Cloudflare (partial info)
  if (req.headers["cf-ipcountry"]) {
    return {
      country_code: req.headers["cf-ipcountry"],
      region: null,
      latitude: null,
      longitude: null,
    };
  }

  // 2️⃣ GeoIP lookup
  const ip = getClientIp(req);
  const geo = geoip.lookup(ip);

  if (!geo) return null;

  return {
    country_code: geo.country || null,
    region: geo.region || geo.city || null,
    latitude: geo.ll?.[0] ?? null,
    longitude: geo.ll?.[1] ?? null,
  };
};
