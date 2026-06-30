let cfSocketConnect = null;
try {
  import("cloudflare:sockets")
    .then((c) => {
      if (c && typeof c.connect === "function") {
        cfSocketConnect = c.connect;
      }
    })
    .catch(() => {});
} catch (d) {}
const Version = "V3.8.3";
let config_JSON;
let proxyIP = "";
let enableSocks5Proxy = null;
let enableSocks5GlobalProxy = false;
let mySocks5Account = "";
let parsedSocks5Address = {};
let cachedSocks5Whitelist = null;
let cachedProxyIP;
let cachedProxyResolvedArray;
let cachedProxyArrayIndex = 0;
let enableProxyFallback = true;
let debugLogPrint = false;
let connProxyWhitelist = [];
function hostMatchesProxyList(c) {
  const f = connProxyWhitelist.length
    ? SOCKS5whitelist.concat(connProxyWhitelist)
    : SOCKS5whitelist;
  return f.some((g) => {
    try {
      return new RegExp(
        "^" + String(g).trim().replace(/\*/g, ".*") + "$",
        "i",
      ).test(c);
    } catch (h) {
      return false;
    }
  });
}
let nat64Config = "";
let cachedNat64Prefixes = null;
let cachedNat64At = 0;
let cachedNat64Src = "";
let networkSettings = null;
let cachedNetworkSettings = null;
let cachedNetworkSettingsAt = 0;
let cachedAdminPass = null;
let cachedAdminPassAt = 0;
const _CFG_KEY = "config.json";
let _cfgRaw = null;
let _cfgRawAt = 0;
async function getConfigRaw(c) {
  if (_cfgRaw !== null && Date.now() - _cfgRawAt < 30000) {
    return _cfgRaw;
  }
  try {
    _cfgRaw =
      c.KV && typeof c.KV.get === "function" ? await c.KV.get(_CFG_KEY) : null;
    _cfgRawAt = Date.now();
  } catch (f) {}
  return _cfgRaw;
}
function putConfig(c, f) {
  _cfgRaw = f;
  _cfgRawAt = Date.now();
  return c.KV.put(_CFG_KEY, f);
}
let cachedWorkerUUID = null;
let cachedWorkerUUIDAt = 0;
let savedUsersAuth = null;
let savedUsersAuthAt = 0;
let lastCentralSync = 0;
let SOCKS5whitelist = [
  "*tapecontent.net",
  "*cloudatacdn.com",
  "*loadshare.org",
  "*cdn-centaurus.com",
  "scholar.google.com",
];
let PagesstaticPages = "https://nova-panel.github.io/";
globalThis.__workerStart = Date.now();
const SESSION_MAX_AGE_MS = 86400000;
const LOGIN_MAX_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 600000;
const LOGIN_BLOCK_MS = 900000;
const __loginAttempts = new Map();
const WSearlyDataMaxBytes = 8192;
const WSearlyDataMaxHeaderLength = Math.ceil((WSearlyDataMaxBytes * 4) / 3) + 4;
const upstreamBatchTargetBytes = 65536;
const upstreamQueueMaxBytes = 33554432;
const upstreamQueueMaxItems = 8192;
const downstreamGrainChunkBytes = 65536;
const downstreamGrainTailThreshold = 512;
const downstreamGrainSilentMs = 0;
const TCPconcurrentDialCount = 4;
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
const NODE_ADDR_REGEX =
  /^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/;
const NOVA_REPO_RAW =
  "https://raw.githubusercontent.com/IRNova/Nova-Proxy/main";
const NOVA_VERSION_URL = NOVA_REPO_RAW + "/public/version.json";
const NOVA_WORKER_SRC_FALLBACK = NOVA_REPO_RAW + "/worker.js";
function versionGreater(c, f) {
  const g = String(c || "")
    .replace(/^[vV]/, "")
    .split(".")
    .map((j) => parseInt(j, 10) || 0);
  const h = String(f || "")
    .replace(/^[vV]/, "")
    .split(".")
    .map((j) => parseInt(j, 10) || 0);
  for (let j = 0; j < Math.max(g.length, h.length); j++) {
    const k = g[j] || 0;
    const l = h[j] || 0;
    if (k > l) {
      return true;
    }
    if (k < l) {
      return false;
    }
  }
  return false;
}
async function serveUserHub() {
  try {
    const c = String(PagesstaticPages || "").replace(/\/+$/, "");
    if (!c || PANEL_PLACEHOLDER.test(c)) {
      return null;
    }
    const f = await fetch(c + "/user/index.html", {
      headers: {
        "User-Agent": "YNSProxy",
      },
      cf: {
        cacheTtl: 300,
        cacheEverything: true,
      },
    });
    if (!f || !f.ok) {
      return null;
    }
    const g = await f.text();
    if (!g || g.length < 50) {
      return null;
    }
    return new Response(g, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (h) {
    return null;
  }
}
async function fetchNovaVersion() {
  for (const c of [NOVA_VERSION_URL, NOVA_REPO_RAW + "/version.json"]) {
    try {
      const f = await fetch(c, {
        headers: {
          "User-Agent": "YNSProxy",
        },
        cf: {
          cacheTtl: 0,
        },
      });
      if (f.ok) {
        const g = await f.json();
        if (g && g.version) {
          return g;
        }
      }
    } catch (h) {}
  }
  return null;
}
let cachedAutoKey = null;
const _md5md5Cache = new Map();
const _sha224Cache = new Map();
let _kvMigratedFlag = false;
let cachedCfUsage = null;
let cachedCfUsageAt = 0;
const _cidrListCache = new Map();
const novaWorker = {
  async fetch(f, g, h) {
    if (g && g.DEBUG_PROBE === "1") {
      return new Response("YNS worker alive - module init OK", { status: 200 });
    }
    try {
      wrapKVWithD1(g);
      if (
        !_kvMigratedFlag &&
        g.__realKV &&
        h &&
        typeof h.waitUntil === "function"
      ) {
        h.waitUntil(migrateKvToD1(g));
      }
      let j = f.url.replace(/%5[Cc]/g, "").replace(/\\/g, "");
      const l = j.indexOf("#");
      const o = l === -1 ? j : j.slice(0, l);
      if (!o.includes("?") && /%3f/i.test(o)) {
        const H = l === -1 ? "" : j.slice(l);
        j = o.replace(/%3f/i, "?") + H;
      }
      const p = new URL(j);
      const q = f.headers.get("User-Agent") || "null";
      const s = (f.headers.get("Upgrade") || "").toLowerCase();
      const t = (f.headers.get("content-type") || "").toLowerCase();
      const w =
        g.ADMIN ||
        g.admin ||
        g.PASSWORD ||
        g.password ||
        g.pswd ||
        g.TOKEN ||
        g.KEY ||
        g.UUID ||
        g.uuid;
      let x = w;
      let z = g.KEY;
      if (!z && cachedAutoKey) {
        z = cachedAutoKey;
      }
      if (!z && g.KV && typeof g.KV.get === "function") {
        try {
          z = await g.KV.get("auto_key");
          if (!z) {
            z = Array.from(
              crypto.getRandomValues(new Uint8Array(24)),
              (I) => "abcdefghijklmnopqrstuvwxyz0123456789"[I % 36],
            ).join("");
            await g.KV.put("auto_key", z);
          }
          cachedAutoKey = z;
        } catch (I) {}
      }
      if (!z) {
        z = "doNotChangeDefaultKey，changeByAddingKeyVariable";
      }
      if (g.KV && typeof g.KV.get === "function") {
        if (
          cachedAdminPass !== null &&
          Date.now() - cachedAdminPassAt < 60000
        ) {
          if (cachedAdminPass) {
            x = cachedAdminPass;
          }
        } else {
          try {
            const J = await g.KV.get("admin_pass");
            if (J) {
              x = J;
              cachedAdminPass = J;
              cachedAdminPassAt = Date.now();
            } else {
              cachedAdminPass = "";
              cachedAdminPassAt = Date.now() - 55000;
            }
          } catch (K) {}
        }
      }
      const A = g.UUID || g.uuid;
      let B;
      if (A && uuidRegex.test(A)) {
        B = A.toLowerCase();
      } else {
        const L = w || x;
        const M = await MD5MD5(L + z);
        const N = [
          M.slice(0, 8),
          M.slice(8, 12),
          "4" + M.slice(13, 16),
          "8" + M.slice(17, 20),
          M.slice(20),
        ].join("-");
        let O = null;
        if (g.KV && typeof g.KV.get === "function") {
          if (
            cachedWorkerUUID !== null &&
            Date.now() - cachedWorkerUUIDAt < 600000
          ) {
            O = cachedWorkerUUID || null;
          } else {
            try {
              let P = await g.KV.get("worker_uuid");
              if (!P) {
                P = N;
                try {
                  await g.KV.put("worker_uuid", P);
                } catch (Q) {}
              }
              cachedWorkerUUID = P || "";
              cachedWorkerUUIDAt = Date.now();
              O = P || null;
            } catch (R) {}
          }
        }
        B = O && uuidRegex.test(O) ? O.toLowerCase() : N;
      }
      const C = g.HOST
        ? (await sortIntoArray(g.HOST)).map(
            (S) =>
              S.toLowerCase()
                .replace(/^https?:\/\//, "")
                .split("/")[0]
                .split(":")[0],
          )
        : [p.hostname];
      const D = C[0];
      const E = p.pathname.slice(1).toLowerCase();
      debugLogPrint = ["1", "true"].includes(g.DEBUG) || debugLogPrint;
      if (g.PAGES_URL || g.PAGES) {
        PagesstaticPages =
          String(g.PAGES_URL || g.PAGES).replace(/\/+$/, "") + "/";
      }
      if (g.PROXYIP) {
        const S = await sortIntoArray(g.PROXYIP);
        proxyIP = S[Math.floor(Math.random() * S.length)];
        enableProxyFallback = false;
      } else {
        proxyIP = (f.cf.colo + ".PrOxYIp.CmLiUsSsS.nEt").toLowerCase();
      }
      nat64Config = g.NAT64 || g.nat64 || "";
      const F =
        f.headers.get("CF-Connecting-IP") ||
        f.headers.get("True-Client-IP") ||
        f.headers.get("X-Real-IP") ||
        f.headers.get("X-Forwarded-For") ||
        f.headers.get("Fly-Client-IP") ||
        f.headers.get("X-Appengine-Remote-Addr") ||
        f.headers.get("X-Cluster-Client-IP") ||
        "unknownIp";
      connClientIp = F;
      try {
        if (g.KV && typeof g.KV.get === "function") {
          if (
            cachedNetworkSettings &&
            Date.now() - cachedNetworkSettingsAt < 30000
          ) {
            networkSettings = cachedNetworkSettings;
          } else {
            const T = await g.KV.get("network-settings.json");
            networkSettings = T
              ? JSON.parse(T)
              : {
                  enableRouting: true,
                  enableGeoIP: true,
                  enableGeoSite: true,
                  enableAdBlock: true,
                  enablePornBlock: false,
                  enableDomesticBypass: true,
                  enableDoH: true,
                  dohProvider: "cloudflare",
                  enableLocalDNS: false,
                  localDNSIP: "8.8.8.8",
                  localDNSPort: "53",
                  enableAntiSanctionDNS: false,
                  antiSanctionDNSProvider: "cloudflare",
                  antiSanctionCustomDNS: "",
                  enableFakeDNS: false,
                  fakeDNSIP: "198.51.100.1",
                  enableIPv6: true,
                  allowLAN: false,
                  logLevel: "error",
                  enableWarp: false,
                  warpMode: "warp",
                  warpEndpoint: "",
                  warpAmnezia: false,
                  customRules: "",
                  bypassCountries: [],
                  blockCategories: [],
                  warpNoise: {
                    mode: "",
                    count: "",
                    size: "",
                    delay: "",
                  },
                };
            cachedNetworkSettings = networkSettings;
            cachedNetworkSettingsAt = Date.now();
          }
        } else {
          networkSettings = {
            enablePornBlock: false,
            enableDomesticBypass: true,
            enableAdBlock: true,
          };
        }
      } catch (U) {
        networkSettings = {
          enablePornBlock: false,
          enableDomesticBypass: true,
          enableAdBlock: true,
        };
      }
      if (cachedSocks5Whitelist === null) {
        if (g.GO2SOCKS5) {
          SOCKS5whitelist = [
            ...new Set(
              SOCKS5whitelist.concat(await sortIntoArray(g.GO2SOCKS5)),
            ),
          ];
        }
        cachedSocks5Whitelist = SOCKS5whitelist;
      } else {
        SOCKS5whitelist = cachedSocks5Whitelist;
      }
      if (
        networkSettings &&
        networkSettings.multiUser &&
        g.KV &&
        typeof g.KV.get === "function"
      ) {
        await refreshUserUsageIfStale(g);
      }
      {
        const V =
          s === "websocket" ||
          (!E.startsWith("admin/") &&
            E !== "login" &&
            E !== "bot" &&
            f.method === "POST");
        const W = E === "sub" || E.startsWith("sub/");
        if (V || W) {
          let X = config_JSON && config_JSON.paused === true;
          if (!X) {
            try {
              const Z = await getConfigRaw(g);
              if (Z && /"paused"\s*:\s*true/.test(Z)) {
                X = true;
              }
            } catch (a0) {}
          }
          if (X) {
            return new Response("Service paused", {
              status: 503,
              headers: {
                "Content-Type": "text/plain;charset=utf-8",
                "Cache-Control": "no-store",
              },
            });
          }
          const Y = Number(
            (networkSettings && networkSettings.monthlyCapGB) ||
              g.MONTHLY_CAP_GB ||
              g.MONTHLY_CAP ||
              0,
          );
          if (Y > 0 && (await monthlyUsedBytes(g)) >= Y * 1073741824) {
            return new Response("Monthly data cap reached", {
              status: 503,
              headers: {
                "Content-Type": "text/plain;charset=utf-8",
                "Cache-Control": "no-store",
              },
            });
          }
        }
      }
      if (E === "version" && p.searchParams.get("uuid") === B) {
        return new Response(
          JSON.stringify({
            Version: Number(String(Version).replace(/\D+/g, "")),
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          },
        );
      } else if (x && s === "websocket") {
        await fetchProxyParams(p, B, g);
        log("[WebSocket] matchedRequest: " + p.pathname + p.search);
        {
          const a1 = backendModeConfig(g);
          if (a1.on && !isBackendExcludedPath(E, p.pathname)) {
            if (connRejectReason) {
              return new Response("Forbidden (" + connRejectReason + ")", {
                status: 403,
              });
            }
            return await forwardWsToBackend(f, p, g, h, a1.url, connUserId);
          }
        }
        return await handleWsRequest(f, B, p, g, h);
      } else if (
        x &&
        !E.startsWith("admin/") &&
        E !== "login" &&
        E !== "bot" &&
        f.method === "POST"
      ) {
        if (
          E === "dns-query" ||
          p.pathname === "/dns-query" ||
          E === "doh" ||
          p.pathname === "/doh"
        ) {
          return handleDoHRequest(f);
        }
        await fetchProxyParams(p, B, g);
        {
          const a4 = backendModeConfig(g);
          if (a4.on && !isBackendExcludedPath(E, p.pathname)) {
            if (connRejectReason) {
              return new Response("Forbidden (" + connRejectReason + ")", {
                status: 403,
              });
            }
            return await forwardHttpToBackend(f, p, g, a4.url);
          }
        }
        const a2 = f.headers.get("Referer") || "";
        const a3 = a2.includes("x_padding", 14) || a2.includes("x_padding=");
        if (!a3 && t.startsWith("application/grpc")) {
          log("[gRPC] matchedRequest: " + p.pathname + p.search);
          return await handleGrpcRequest(f, B, g, h);
        }
        log("[XHTTP] matchedRequest: " + p.pathname + p.search);
        return await handleXhttpRequest(f, B, g, h);
      } else {
        if (p.protocol === "http:") {
          return Response.redirect(
            p.href.replace("http://" + p.hostname, "https://" + p.hostname),
            301,
          );
        }
        if (
          E === "dns-query" ||
          p.pathname === "/dns-query" ||
          E === "doh" ||
          p.pathname === "/doh"
        ) {
          return handleDoHRequest(f);
        }
        if (E === "backend-test") {
          return await backendDiagnostic(g, p);
        }
        if (E === "warp" || E.startsWith("warp/")) {
          return handleWarpRequest(f);
        }
        if (E === "yns-block") {
          return novaBlockPage(f);
        }
        if (E === "install" || E.startsWith("install/")) {
          return await handleInstall(f, g, p, x, z, q);
        }
        if (
          panelHasAssets(g) &&
          /\.\w{2,5}$/.test(p.pathname) &&
          s !== "websocket"
        ) {
          const a5 = await panelFetch(g, p.pathname).catch(() => null);
          if (a5 && a5.ok) {
            return a5;
          }
        }
        if (!x) {
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/install",
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          });
        }
        if (g.KV && typeof g.KV.get === "function") {
          const a6 = p.pathname.slice(1);
          if (
            a6 === z &&
            z !== "doNotChangeDefaultKey，changeByAddingKeyVariable"
          ) {
            const a7 = new URLSearchParams(p.search);
            a7.set("token", await MD5MD5(D + B));
            return new Response("redirecting...", {
              status: 302,
              headers: {
                Location: "/sub?" + a7.toString(),
              },
            });
          } else if (E === "login") {
            const a8 = f.headers.get("Cookie") || "";
            const a9 = a8
              .split(";")
              .find((aa) => aa.trim().startsWith("auth="))
              ?.split("=")[1];
            if (await verifySessionToken(a9, q, z, x)) {
              return new Response("redirecting...", {
                status: 302,
                headers: {
                  Location: "/admin",
                },
              });
            }
            if (f.method === "POST") {
              const aa =
                f.headers.get("cf-connecting-ip") ||
                f.headers.get("x-real-ip") ||
                "unknown";
              const ab = loginRateCheck(aa);
              if (!ab.allowed) {
                return new Response(
                  JSON.stringify({
                    error: "rate_limited",
                  }),
                  {
                    status: 429,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                      "Retry-After": String(ab.retryAfter),
                      "Cache-Control": "no-store",
                    },
                  },
                );
              }
              const ac = await f.text();
              const ad = new URLSearchParams(ac);
              const ae = ad.get("password");
              const af = (ag) =>
                String(ag == null ? "" : ag)
                  .trim()
                  .replace(
                    /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,
                    "",
                  );
              if (
                timingSafeStrEqual(af(ae), af(x)) ||
                (w && timingSafeStrEqual(af(ae), af(w)))
              ) {
                let ag = null;
                try {
                  if (g.KV && typeof g.KV.get === "function") {
                    ag = JSON.parse(
                      (await g.KV.get("admin_2fa.json")) || "null",
                    );
                  }
                } catch (ai) {}
                if (ag && ag.enabled && ag.secret) {
                  const aj = (ad.get("code") || ad.get("otp") || "").trim();
                  if (!aj) {
                    return new Response(
                      JSON.stringify({
                        need2fa: true,
                      }),
                      {
                        status: 200,
                        headers: {
                          "Content-Type": "application/json;charset=utf-8",
                        },
                      },
                    );
                  }
                  if (!(await totpVerify(ag.secret, aj))) {
                    loginRecordFailure(aa);
                    return new Response(
                      JSON.stringify({
                        need2fa: true,
                        error: "bad_code",
                      }),
                      {
                        status: 401,
                        headers: {
                          "Content-Type": "application/json;charset=utf-8",
                        },
                      },
                    );
                  }
                }
                const ah = new Response(
                  JSON.stringify({
                    success: true,
                  }),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
                loginRecordSuccess(aa);
                ah.headers.set(
                  "Set-Cookie",
                  "auth=" +
                    (await makeSessionToken(q, z, x)) +
                    "; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax",
                );
                return ah;
              } else {
                loginRecordFailure(aa);
              }
            }
            return await panelHtml(g, "/login");
          } else if (E === "setwebhook") {
            if (!(await isAuthed(f, q, z, x))) {
              return new Response("redirecting...", {
                status: 302,
                headers: {
                  Location: "/login",
                },
              });
            }
            const ak = await g.KV.get("tg.json");
            if (!ak) {
              return new Response("Bot not configured", {
                status: 400,
              });
            }
            const al = JSON.parse(ak);
            if (!al.BotToken) {
              return new Response("BotToken not found", {
                status: 400,
              });
            }
            const am = p.protocol + "//" + p.host + "/bot";
            const an =
              "https://api.telegram.org/bot" +
              al.BotToken +
              "/setWebhook?url=" +
              encodeURIComponent(am) +
              "&drop_pending_updates=true";
            const ao = await fetch(an);
            h.waitUntil(tgSetMyCommands(al.BotToken));
            const ap = await ao.json();
            return new Response(JSON.stringify(ap, null, 2), {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            });
          } else if (E === "bot") {
            if (f.method === "POST") {
              return await handleTelegramWebhook(f, g, B, D);
            }
            return new Response("Bot webhook active", {
              status: 200,
            });
          } else if (E === "admin" || E.startsWith("admin/")) {
            const aq = f.headers.get("Cookie") || "";
            const ar = aq
              .split(";")
              .find((au) => au.trim().startsWith("auth="))
              ?.split("=")[1];
            if (!ar || !(await verifySessionToken(ar, q, z, x))) {
              return new Response("redirecting...", {
                status: 302,
                headers: {
                  Location: "/login",
                },
              });
            }
            h.waitUntil(flushUsage(g));
            if (Date.now() - lastCentralSync > 600000) {
              lastCentralSync = Date.now();
              h.waitUntil(centralHeartbeat(g));
              h.waitUntil(refreshAnnouncements(g));
            }
            if (E === "admin/whoami") {
              const au = f.cf || {};
              return new Response(
                JSON.stringify({
                  asn: au.asn || 0,
                  isp: au.asOrganization || "",
                  country: au.country || "",
                  city: au.city || "",
                  carrier: identifyCarrier(f),
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            } else if (E === "admin/security/status") {
              let av = null;
              try {
                av = JSON.parse((await g.KV.get("admin_2fa.json")) || "null");
              } catch (ax) {}
              const aw = await g.KV.get("admin_pass");
              return new Response(
                JSON.stringify({
                  twofa: !!av && !!av.enabled,
                  passwordSource: aw ? "kv" : "env",
                  envRecovery: !!w,
                  kvSet: !!aw,
                  uuidPinned: !!(await g.KV.get("worker_uuid")),
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            } else if (E === "admin/security/change-password") {
              if (f.method !== "POST") {
                return new Response("Method Not Allowed", {
                  status: 405,
                });
              }
              let ay = {};
              try {
                ay = await f.json();
              } catch (aD) {}
              const az = (ay.current || "").toString().replace(/[\r\n]/g, "");
              const aA = (ay.new || "").toString().replace(/[\r\n]/g, "");
              const aB =
                timingSafeStrEqual(
                  az,
                  String(x || "").replace(/[\r\n]/g, ""),
                ) ||
                (w && timingSafeStrEqual(az, String(w).replace(/[\r\n]/g, "")));
              if (!aB) {
                return new Response(
                  JSON.stringify({
                    error: "wrong_current",
                  }),
                  {
                    status: 403,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              if (aA.length < 6) {
                return new Response(
                  JSON.stringify({
                    error: "too_short",
                  }),
                  {
                    status: 400,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              try {
                if (!g.UUID && !g.uuid) {
                  const aE = await g.KV.get("worker_uuid");
                  if (!aE) {
                    await g.KV.put("worker_uuid", B);
                    cachedWorkerUUID = B;
                    cachedWorkerUUIDAt = Date.now();
                  }
                }
              } catch (aF) {}
              await g.KV.put("admin_pass", aA);
              cachedAdminPass = aA;
              cachedAdminPassAt = Date.now();
              const aC = new Response(
                JSON.stringify({
                  success: true,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                },
              );
              aC.headers.set(
                "Set-Cookie",
                "auth=" +
                  (await makeSessionToken(q, z, aA)) +
                  "; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax",
              );
              return aC;
            } else if (E === "admin/security/reveal") {
              let aG = "none";
              try {
                aG = w ? "env" : (await g.KV.get("admin_pass")) ? "kv" : "none";
              } catch (aH) {
                aG = w ? "env" : "none";
              }
              return new Response(
                JSON.stringify({
                  password: x || "",
                  source: aG,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            } else if (E === "admin/security/2fa-setup") {
              const aI = randomBase32(32);
              const aJ = encodeURIComponent("YNS (" + p.host + ")");
              const aK =
                "otpauth://totp/" +
                aJ +
                "?secret=" +
                aI +
                "&issuer=" +
                encodeURIComponent("YNS") +
                "&algorithm=SHA1&digits=6&period=30";
              return new Response(
                JSON.stringify({
                  secret: aI,
                  otpauth: aK,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            } else if (E === "admin/security/2fa-enable") {
              if (f.method !== "POST") {
                return new Response("Method Not Allowed", {
                  status: 405,
                });
              }
              let aL = {};
              try {
                aL = await f.json();
              } catch (aO) {}
              const aM = (aL.secret || "").toString().trim();
              const aN = (aL.code || "").toString().trim();
              if (!aM) {
                return new Response(
                  JSON.stringify({
                    error: "no_secret",
                  }),
                  {
                    status: 400,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              if (!(await totpVerify(aM, aN))) {
                return new Response(
                  JSON.stringify({
                    error: "bad_code",
                  }),
                  {
                    status: 400,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              await g.KV.put(
                "admin_2fa.json",
                JSON.stringify({
                  enabled: true,
                  secret: aM,
                  addedAt: Date.now(),
                }),
              );
              return new Response(
                JSON.stringify({
                  success: true,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                },
              );
            } else if (E === "admin/security/2fa-disable") {
              if (f.method !== "POST") {
                return new Response("Method Not Allowed", {
                  status: 405,
                });
              }
              let aP = {};
              try {
                aP = await f.json();
              } catch (aS) {}
              const aQ = (aP.code || "").toString().trim();
              let aR = null;
              try {
                aR = JSON.parse((await g.KV.get("admin_2fa.json")) || "null");
              } catch (aT) {}
              if (
                aR &&
                aR.enabled &&
                aR.secret &&
                !(await totpVerify(aR.secret, aQ))
              ) {
                return new Response(
                  JSON.stringify({
                    error: "bad_code",
                  }),
                  {
                    status: 400,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              await g.KV.delete("admin_2fa.json");
              return new Response(
                JSON.stringify({
                  success: true,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                },
              );
            } else if (E === "admin/log.json") {
              const aU = JSON.stringify(await logReadAll(g));
              return new Response(aU, {
                status: 200,
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                },
              });
            } else if (a6 === "admin/getCloudflareUsage") {
              try {
                const aV = await getCloudflareUsage(
                  p.searchParams.get("Email"),
                  p.searchParams.get("GlobalAPIKey"),
                  p.searchParams.get("AccountID"),
                  p.searchParams.get("APIToken"),
                );
                return new Response(JSON.stringify(aV, null, 2), {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
              } catch (aW) {
                const aX = {
                  msg: "queryRequestCountFailed，failReason：" + aW.message,
                  error: aW.message,
                };
                return new Response(JSON.stringify(aX, null, 2), {
                  status: 500,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                });
              }
            } else if (a6 === "admin/getADDAPI") {
              if (p.searchParams.get("url")) {
                const aY = p.searchParams.get("url");
                try {
                  new URL(aY);
                  const aZ = await requestBestApi(
                    [aY],
                    p.searchParams.get("port") || "443",
                  );
                  let b0 = aZ[0].length > 0 ? aZ[0] : aZ[1];
                  b0 = b0.map((b1) =>
                    b1.replace(
                      /#(.+)$/,
                      (b2, b3) => "#" + decodeURIComponent(b3),
                    ),
                  );
                  return new Response(
                    JSON.stringify(
                      {
                        success: true,
                        data: b0,
                      },
                      null,
                      2,
                    ),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                } catch (b1) {
                  const b2 = {
                    msg: "verifyBestApiFail，failReason：" + b1.message,
                    error: b1.message,
                  };
                  return new Response(JSON.stringify(b2, null, 2), {
                    status: 500,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  });
                }
              }
              return new Response(
                JSON.stringify(
                  {
                    success: false,
                    data: [],
                  },
                  null,
                  2,
                ),
                {
                  status: 403,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                },
              );
            } else if (E === "admin/check") {
              const b3 =
                ["socks5", "http", "https", "turn", "sstp"].find((b7) =>
                  p.searchParams.has(b7),
                ) || null;
              if (!b3) {
                return new Response(
                  JSON.stringify({
                    error: "missingProxyParam",
                  }),
                  {
                    status: 400,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              const b4 = p.searchParams.get(b3);
              const b5 = Date.now();
              let b6;
              try {
                parsedSocks5Address = await getSocks5Account(
                  b4,
                  getProxyDefaultPort(b3),
                );
                const {
                  username: b7,
                  password: b8,
                  hostname: b9,
                  port: ba,
                } = parsedSocks5Address;
                const bb =
                  b7 && b8
                    ? b7 + ":" + b8 + "@" + b9 + ":" + ba
                    : b9 + ":" + ba;
                try {
                  const bc = "cloudflare.com";
                  const bd = 443;
                  const be = new TextEncoder();
                  const bf = new TextDecoder();
                  const bg = createRequestTcpConnector(f);
                  let bh = null;
                  let bi = null;
                  try {
                    bh =
                      b3 === "socks5"
                        ? await socks5Connect(bc, bd, new Uint8Array(0), bg)
                        : b3 === "turn"
                          ? await turnConnect(parsedSocks5Address, bc, bd, bg)
                          : b3 === "sstp"
                            ? await sstpConnect(parsedSocks5Address, bc, bd, bg)
                            : b3 === "https" && isIPHostname(b9)
                              ? await httpsConnect(
                                  bc,
                                  bd,
                                  new Uint8Array(0),
                                  bg,
                                )
                              : await httpConnect(
                                  bc,
                                  bd,
                                  new Uint8Array(0),
                                  b3 === "https",
                                  bg,
                                );
                    if (!bh) {
                      throw new Error("cannotConnectToProxy");
                    }
                    bi = new TlsClient(bh, {
                      serverName: bc,
                      insecure: true,
                    });
                    await bi.handshake();
                    await bi.write(
                      be.encode(
                        "GET /cdn-cgi/trace HTTP/1.1\r\nHost: " +
                          bc +
                          "\r\nUser-Agent: Mozilla/5.0\r\nConnection: close\r\n\r\n",
                      ),
                    );
                    let bj = new Uint8Array(0);
                    let bk = -1;
                    let bl = null;
                    let bm = false;
                    const bn = 65536;
                    while (bj.length < bn) {
                      const br = await bi.read();
                      if (!br) {
                        break;
                      }
                      if (br.byteLength === 0) {
                        continue;
                      }
                      bj = concatByteData(bj, br);
                      if (bk === -1) {
                        const bs = bj.findIndex(
                          (bt, bu) =>
                            bu < bj.length - 3 &&
                            bj[bu] === 13 &&
                            bj[bu + 1] === 10 &&
                            bj[bu + 2] === 13 &&
                            bj[bu + 3] === 10,
                        );
                        if (bs !== -1) {
                          bk = bs + 4;
                          const bt = bf.decode(bj.slice(0, bk));
                          const bu = bt.split("\r\n")[0] || "";
                          const bv = bu.match(/HTTP\/\d\.\d\s+(\d+)/);
                          const bw = bv ? parseInt(bv[1], 10) : NaN;
                          if (!Number.isFinite(bw) || bw < 200 || bw >= 300) {
                            throw new Error(
                              "proxyProbeRequestFail: " +
                                (bu || "invalidResponse"),
                            );
                          }
                          const bx = bt.match(/\r\nContent-Length:\s*(\d+)/i);
                          if (bx) {
                            bl = parseInt(bx[1], 10);
                          }
                          bm = /\r\nTransfer-Encoding:\s*chunked/i.test(bt);
                        }
                      }
                      if (bk !== -1 && bl !== null && bj.length >= bk + bl) {
                        break;
                      }
                      if (
                        bk !== -1 &&
                        bm &&
                        bf.decode(bj).includes("\r\n0\r\n\r\n")
                      ) {
                        break;
                      }
                    }
                    if (bk === -1) {
                      throw new Error("proxyProbeResponseTooLongOrInvalid");
                    }
                    const bo = bf.decode(bj);
                    const bp = bo.match(/(?:^|\n)ip=(.*)/)?.[1];
                    const bq = bo.match(/(?:^|\n)loc=(.*)/)?.[1];
                    if (!bp || !bq) {
                      throw new Error("proxyProbeResponseInvalid");
                    }
                    b6 = {
                      success: true,
                      proxy: b3 + "://" + bb,
                      ip: bp,
                      loc: bq,
                      responseTime: Date.now() - b5,
                    };
                  } finally {
                    try {
                      if (bi) {
                        bi.close();
                      } else {
                        await bh?.close?.();
                      }
                    } catch (by) {}
                  }
                } catch (bz) {
                  b6 = {
                    success: false,
                    error: bz.message,
                    proxy: b3 + "://" + bb,
                    responseTime: Date.now() - b5,
                  };
                }
              } catch (bA) {
                b6 = {
                  success: false,
                  error: bA.message,
                  proxy: b3 + "://" + b4,
                  responseTime: Date.now() - b5,
                };
              }
              return new Response(JSON.stringify(b6, null, 2), {
                status: 200,
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                },
              });
            } else if (E === "admin/announce") {
              const bB = JSON.parse(
                (await g.KV.get("domain-health.json")) || "null",
              );
              const bC = await announceSubLinks(g, {
                baseUrl: p.protocol + "//" + p.host,
                health: bB,
              });
              return new Response(JSON.stringify(bC, null, 2), {
                status: bC.skipped ? 400 : 200,
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                },
              });
            } else if (E === "admin/publish-mirror") {
              const bD = await publishSubMirror(g, p.protocol + "//" + p.host);
              const bE =
                !bD.skipped &&
                Array.isArray(bD.results) &&
                bD.results.every((bF) => bF.ok);
              return new Response(JSON.stringify(bD, null, 2), {
                status: bD.skipped ? 400 : bE ? 200 : 502,
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                },
              });
            } else if (E === "admin/warp.json") {
              let bF = null;
              try {
                bF = JSON.parse((await g.KV.get("warp.json")) || "null");
              } catch (bG) {}
              if (f.method === "POST") {
                let bH = {};
                try {
                  bH = await f.json();
                } catch (bI) {}
                try {
                  if (bH.fromCentral) {
                    if (!bF || !bF.id) {
                      bF = await warpRegisterAccount();
                    }
                    const { api: bJ } = await getCentralApi(g);
                    if (!bJ) {
                      throw new Error("Central API not set in Settings");
                    }
                    let bK = [];
                    try {
                      const bN = await fetch(bJ + "/api/warp", {
                        headers: {
                          "User-Agent": "YNSProxy",
                        },
                      });
                      const bO = await bN.json();
                      bK = Array.isArray(bO.keys) ? bO.keys : [];
                    } catch (bP) {}
                    if (!bK.length) {
                      throw new Error("No WARP+ keys in the central pool");
                    }
                    let bL = false;
                    let bM = "";
                    for (const bQ of bK) {
                      try {
                        await warpApplyLicense(bF, String(bQ).trim());
                        bL = true;
                        break;
                      } catch (bR) {
                        bM = bR && bR.message ? bR.message : String(bR);
                      }
                    }
                    if (!bL) {
                      throw new Error("All central keys failed (" + bM + ")");
                    }
                  } else if (bH.license) {
                    if (!bF || !bF.id) {
                      bF = await warpRegisterAccount();
                    }
                    await warpApplyLicense(bF, String(bH.license).trim());
                  } else {
                    bF = await warpRegisterAccount();
                    if (bH.wow) {
                      const bS = await warpRegisterAccount();
                      bS.registered = true;
                      bF.wow = bS;
                    }
                  }
                  bF.registered = true;
                  await g.KV.put("warp.json", JSON.stringify(bF));
                  h.waitUntil(
                    requestLogRecord(
                      g,
                      f,
                      F,
                      bH.license ? "WARP_License" : "Register_WARP",
                      config_JSON,
                    ),
                  );
                  return new Response(
                    JSON.stringify(
                      warpPublicView(
                        bF,
                        networkSettings && networkSettings.warpEndpoint,
                      ),
                    ),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                } catch (bT) {
                  return new Response(
                    JSON.stringify({
                      registered: !!bF && !!bF.registered,
                      error: bT && bT.message ? bT.message : String(bT),
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              }
              return new Response(
                JSON.stringify(
                  warpPublicView(
                    bF,
                    networkSettings && networkSettings.warpEndpoint,
                  ),
                ),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                },
              );
            } else if (E === "admin/domains") {
              const bU = await getPoolHosts(g);
              const bV = p.searchParams.has("check")
                ? await checkDomainHealth(g, bU, p.host)
                : JSON.parse((await g.KV.get("domain-health.json")) || "null");
              return new Response(
                JSON.stringify(
                  {
                    hosts: bU,
                    health: bV,
                  },
                  null,
                  2,
                ),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                },
              );
            } else if (E === "admin/announcement") {
              if (p.searchParams.has("refresh")) {
                await refreshAnnouncements(g);
              }
              return new Response(
                (await g.KV.get("announcement.json")) || "null",
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                },
              );
            } else if (E === "admin/central/stats") {
              const { api: bW, token: bX } = await getCentralApi(g);
              if (!bW) {
                return new Response(
                  JSON.stringify({
                    configured: false,
                  }),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              try {
                const bY = await fetch(bW + "/stats", {
                  headers: bX
                    ? {
                        Authorization: "Bearer " + bX,
                      }
                    : {},
                });
                const bZ = await bY.json().catch(() => ({}));
                return new Response(
                  JSON.stringify({
                    configured: true,
                    ...bZ,
                  }),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              } catch (c0) {
                return new Response(
                  JSON.stringify({
                    configured: true,
                    error: c0.message,
                  }),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
            } else if (E === "admin/central/announcement") {
              const { api: c1, token: c2 } = await getCentralApi(g);
              if (!c1) {
                return new Response(
                  JSON.stringify({
                    ok: false,
                    error: "centralApiNotSet",
                  }),
                  {
                    status: 400,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              try {
                const c3 = await fetch(c1 + "/admin/announcement", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(c2
                      ? {
                          Authorization: "Bearer " + c2,
                        }
                      : {}),
                  },
                  body: await f.text(),
                });
                h.waitUntil(refreshAnnouncements(g));
                return new Response(await c3.text(), {
                  status: c3.status,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                });
              } catch (c4) {
                return new Response(
                  JSON.stringify({
                    ok: false,
                    error: c4.message,
                  }),
                  {
                    status: 502,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
            } else if (E === "admin/update-check.json") {
              const c5 = String(Version).replace(/^[vV]/, "");
              const c6 = await fetchNovaVersion();
              const c7 = c6
                ? String(c6.version || "").replace(/^[vV]/, "")
                : "";
              const c8 = c6 ? c6.notes || "" : "";
              const c9 = c6 ? c6.worker_url || "" : "";
              const ca = !!c7 && versionGreater(c7, c5);
              let cb = false;
              try {
                const cc = JSON.parse((await g.KV.get("cf.json")) || "null");
                cb = !!cc && !!cc.APIToken;
              } catch (ce) {}
              return new Response(
                JSON.stringify({
                  current: c5,
                  latest: c7,
                  updateAvailable: ca,
                  notes: c8,
                  worker_url: c9,
                  reachable: !!c6,
                  hasCfToken: cb,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            } else if (E === "admin/self-update.json") {
              if (f.method !== "POST") {
                return new Response(
                  JSON.stringify({
                    error: "method_not_allowed",
                  }),
                  {
                    status: 405,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              const cg = (cq, cs) =>
                new Response(
                  JSON.stringify(
                    Object.assign(
                      {
                        error: cq,
                      },
                      cs || {},
                    ),
                  ),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                      "Cache-Control": "no-store",
                    },
                  },
                );
              let ch = {};
              try {
                ch = await f.json();
              } catch (cq) {}
              let ci = String(ch.token || "").trim();
              if (!ci) {
                try {
                  const cs = JSON.parse((await g.KV.get("cf.json")) || "null");
                  if (cs && cs.APIToken) {
                    ci = String(cs.APIToken).trim();
                    if (!ch.accountId && cs.AccountID) {
                      ch.accountId = cs.AccountID;
                    }
                  }
                } catch (ct) {}
              }
              if (!ci) {
                return cg("no_token");
              }
              let ck;
              try {
                ck = await cfVerifyToken(ci);
              } catch (cu) {
                ck = {
                  ok: false,
                };
              }
              if (!ck || !ck.ok) {
                return cg("token_invalid");
              }
              let cl = String(ch.accountId || "").trim();
              if (!cl) {
                let cv = [];
                try {
                  cv = await cfListAccounts(ci);
                } catch (cw) {}
                if (!cv.length) {
                  return cg("no_accounts");
                }
                if (cv.length === 1) {
                  cl = cv[0].id;
                } else {
                  return cg("multiple_accounts", {
                    accounts: cv,
                  });
                }
              }
              let cm = String(ch.scriptName || "").trim();
              if (!cm) {
                const cx =
                  /^([a-z0-9][a-z0-9-]*)\.[a-z0-9-]+\.workers\.dev$/i.exec(
                    p.host,
                  );
                if (cx) {
                  cm = cx[1];
                } else {
                  return cg("need_script_name");
                }
              }
              try {
                const cy = await fetch(
                  CF_API +
                    "/accounts/" +
                    cl +
                    "/workers/scripts/" +
                    cm +
                    "/settings",
                  {
                    headers: cfHeaders(ci),
                  },
                );
                const cz = await cfJson(cy);
                if (!cz || !cz.success) {
                  return cg("cannot_read_bindings");
                }
              } catch (cA) {
                return cg("cannot_read_bindings");
              }
              let cn = NOVA_WORKER_SRC_FALLBACK;
              let co = "";
              {
                const cB = await fetchNovaVersion();
                if (cB) {
                  if (cB.worker_url) {
                    cn = cB.worker_url;
                  }
                  co = String(cB.version || "").replace(/^[vV]/, "");
                }
              }
              let cp = "";
              try {
                const cC = await fetch(cn, {
                  headers: {
                    "User-Agent": "YNSProxy",
                  },
                });
                if (!cC.ok) {
                  throw new Error("HTTP " + cC.status);
                }
                cp = await cC.text();
              } catch (cD) {
                return cg("fetch_worker_failed", {
                  detail: (cD && cD.message) || String(cD),
                });
              }
              if (
                cp.length < 1000 ||
                !/export\s+default|addEventListener\s*\(/.test(cp)
              ) {
                return cg("bad_worker_source");
              }
              try {
                const cE = new FormData();
                cE.append(
                  "metadata",
                  new Blob(
                    [
                      JSON.stringify({
                        main_module: "worker.js",
                      }),
                    ],
                    {
                      type: "application/json",
                    },
                  ),
                );
                cE.append(
                  "worker.js",
                  new Blob([cp], {
                    type: "application/javascript+module",
                  }),
                  "worker.js",
                );
                const cF = await fetch(
                  CF_API +
                    "/accounts/" +
                    cl +
                    "/workers/scripts/" +
                    cm +
                    "/content",
                  {
                    method: "PUT",
                    headers: cfHeaders(ci),
                    body: cE,
                  },
                );
                const cG = await cfJson(cF);
                if (!cG || !cG.success) {
                  const cH =
                    (cG && cG.errors && cG.errors[0] && cG.errors[0].message) ||
                    "HTTP " + cF.status;
                  return cg("upload_failed", {
                    detail: cH,
                  });
                }
              } catch (cI) {
                return cg("upload_failed", {
                  detail: (cI && cI.message) || String(cI),
                });
              }
              h.waitUntil(
                requestLogRecord(g, f, F, "Self_Update", config_JSON),
              );
              return new Response(
                JSON.stringify({
                  success: true,
                  version: co || undefined,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            } else if (E === "admin/cf-usage-setup") {
              if (f.method !== "POST") {
                return new Response(
                  JSON.stringify({
                    error: "method_not_allowed",
                  }),
                  {
                    status: 405,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
              const cJ = (cP, cQ) =>
                new Response(
                  JSON.stringify(
                    Object.assign(
                      {
                        error: cP,
                      },
                      cQ || {},
                    ),
                  ),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                      "Cache-Control": "no-store",
                    },
                  },
                );
              let cK = {};
              try {
                cK = await f.json();
              } catch (cP) {}
              const cL = String(cK.token || "").trim();
              if (!cL) {
                return cJ("no_token");
              }
              let cM;
              try {
                cM = await cfVerifyToken(cL);
              } catch (cQ) {
                cM = {
                  ok: false,
                };
              }
              if (!cM || !cM.ok) {
                return cJ("token_invalid");
              }
              let cN = String(cK.accountId || "").trim();
              if (!cN) {
                let cR = [];
                try {
                  cR = await cfListAccounts(cL);
                } catch (cS) {}
                if (!cR.length) {
                  return cJ("no_accounts");
                }
                if (cR.length === 1) {
                  cN = cR[0].id;
                } else {
                  return cJ("multiple_accounts", {
                    accounts: cR,
                  });
                }
              }
              const cO = await getCloudflareUsage(null, null, cN, cL);
              if (!cO || !cO.success) {
                return cJ("usage_failed", {
                  detail: (cO && cO.error) || "",
                });
              }
              try {
                await g.KV.put(
                  "cf.json",
                  JSON.stringify(
                    {
                      Email: null,
                      GlobalAPIKey: null,
                      AccountID: cN,
                      APIToken: cL,
                      UsageAPI: null,
                    },
                    null,
                    2,
                  ),
                );
              } catch (cT) {}
              cachedCfUsage = cO;
              cachedCfUsageAt = Date.now();
              return new Response(
                JSON.stringify({
                  success: true,
                  accountId: cN,
                  usage: cO,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            }
            try {
              config_JSON = await readConfigJson(g, D, B, q);
            } catch (cU) {
              console.error("adminReadConfigError: " + cU.message);
              const cV = new Date().toISOString();
              config_JSON = {
                TIME: cV,
                HOST: D,
                HOSTS: [D],
                UUID: B,
                PATH: "/",
                protocolType: "vless",
                transportProtocol: "ws",
                gRPCmode: "gun",
                skipCertVerify: false,
                enable0RTT: false,
                tlsFragment: null,
                randomPath: false,
                Fingerprint: "chrome",
                optimizedSubGeneration: {
                  local: true,
                  localIPPool: {
                    randomIP: true,
                    randomCount: 16,
                    specifiedPorts: -1,
                  },
                  SUB: null,
                  SUBNAME: "YNS",
                  SUBUpdateTime: 3,
                  TOKEN: await MD5MD5(D + B),
                },
                CF: {
                  Email: null,
                  GlobalAPIKey: null,
                  AccountID: null,
                  APIToken: null,
                  UsageAPI: null,
                  Usage: {
                    success: false,
                    pages: 0,
                    workers: 0,
                    total: 0,
                    max: 100000,
                  },
                },
                TG: {
                  enabled: false,
                  BotToken: null,
                  ChatID: null,
                },
                loadTime: "0ms",
              };
            }
            if (E === "admin/init") {
              try {
                config_JSON = await readConfigJson(g, D, B, q, true);
                h.waitUntil(
                  requestLogRecord(g, f, F, "Init_Config", config_JSON),
                );
                config_JSON.init = "configResetAsDefaultValue";
                return new Response(JSON.stringify(config_JSON, null, 2), {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                });
              } catch (cW) {
                const cX = {
                  msg: "configResetFail，failReason：" + cW.message,
                  error: cW.message,
                };
                return new Response(JSON.stringify(cX, null, 2), {
                  status: 500,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                });
              }
            } else if (f.method === "POST") {
              if (E === "admin/config.json") {
                try {
                  const cY = await f.json();
                  if (!cY.UUID || !cY.HOST) {
                    return new Response(
                      JSON.stringify({
                        error: "configIncomplete",
                      }),
                      {
                        status: 400,
                        headers: {
                          "Content-Type": "application/json;charset=utf-8",
                        },
                      },
                    );
                  }
                  await putConfig(g, JSON.stringify(cY, null, 2));
                  h.waitUntil(
                    requestLogRecord(g, f, F, "Save_Config", config_JSON),
                  );
                  return new Response(
                    JSON.stringify({
                      success: true,
                      message: "configSave",
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                } catch (cZ) {
                  console.error("saveConfigFail:", cZ);
                  return new Response(
                    JSON.stringify({
                      error: "saveConfigFail: " + cZ.message,
                    }),
                    {
                      status: 500,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              } else if (E === "admin/cf.json") {
                try {
                  const d0 = await f.json();
                  const d1 = {
                    Email: null,
                    GlobalAPIKey: null,
                    AccountID: null,
                    APIToken: null,
                    UsageAPI: null,
                  };
                  if (!d0.init || d0.init !== true) {
                    if (d0.Email && d0.GlobalAPIKey) {
                      d1.Email = d0.Email;
                      d1.GlobalAPIKey = d0.GlobalAPIKey;
                    } else if (d0.AccountID && d0.APIToken) {
                      d1.AccountID = d0.AccountID;
                      d1.APIToken = d0.APIToken;
                    } else if (d0.UsageAPI) {
                      d1.UsageAPI = d0.UsageAPI;
                    } else {
                      return new Response(
                        JSON.stringify({
                          error: "configIncomplete",
                        }),
                        {
                          status: 400,
                          headers: {
                            "Content-Type": "application/json;charset=utf-8",
                          },
                        },
                      );
                    }
                  }
                  await g.KV.put("cf.json", JSON.stringify(d1, null, 2));
                  h.waitUntil(
                    requestLogRecord(g, f, F, "Save_Config", config_JSON),
                  );
                  return new Response(
                    JSON.stringify({
                      success: true,
                      message: "configSave",
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                } catch (d2) {
                  console.error("saveConfigFail:", d2);
                  return new Response(
                    JSON.stringify({
                      error: "saveConfigFail: " + d2.message,
                    }),
                    {
                      status: 500,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              } else if (E === "admin/tg.json") {
                try {
                  const d3 = await f.json();
                  let d4 = null;
                  let d5 = null;
                  if (d3.init && d3.init === true) {
                    const d6 = {
                      BotToken: null,
                      ChatID: null,
                    };
                    await g.KV.put("tg.json", JSON.stringify(d6, null, 2));
                  } else {
                    if (!d3.BotToken || !d3.ChatID) {
                      return new Response(
                        JSON.stringify({
                          error: "configIncomplete",
                        }),
                        {
                          status: 400,
                          headers: {
                            "Content-Type": "application/json;charset=utf-8",
                          },
                        },
                      );
                    }
                    await g.KV.put("tg.json", JSON.stringify(d3, null, 2));
                    try {
                      const d7 = p.protocol + "//" + p.host + "/bot";
                      const d8 = await fetch(
                        "https://api.telegram.org/bot" +
                          d3.BotToken +
                          "/setWebhook?url=" +
                          encodeURIComponent(d7) +
                          "&drop_pending_updates=true",
                      );
                      const d9 = await d8.json().catch(() => ({}));
                      h.waitUntil(tgSetMyCommands(d3.BotToken));
                      d4 = !!d9.ok;
                      if (!d9.ok) {
                        d5 = d9.description || "setWebhook failed";
                      }
                    } catch (da) {
                      d4 = false;
                      d5 = da.message;
                    }
                  }
                  h.waitUntil(
                    requestLogRecord(g, f, F, "Save_Config", config_JSON),
                  );
                  return new Response(
                    JSON.stringify({
                      success: true,
                      message: "configSave",
                      webhookSet: d4,
                      webhookError: d5,
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                } catch (db) {
                  console.error("saveConfigFail:", db);
                  return new Response(
                    JSON.stringify({
                      error: "saveConfigFail: " + db.message,
                    }),
                    {
                      status: 500,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              } else if (E === "admin/users.json") {
                try {
                  const dc = JSON.parse(
                    (await g.KV.get("network-settings.json")) || "{}",
                  );
                  if (f.method === "POST") {
                    const dk = await f.json();
                    dc.multiUser = !!dk.multiUser;
                    dc.users = Array.isArray(dk.users) ? dk.users : [];
                    {
                      const dl = {};
                      for (const dn of dc.users) {
                        if (dn && dn.username) {
                          dl[String(dn.username).toLowerCase()] = 1;
                        }
                      }
                      const dm = () =>
                        typeof crypto !== "undefined" && crypto.randomUUID
                          ? crypto.randomUUID().replace(/-/g, "")
                          : Math.random().toString(16).slice(2) +
                            Math.random().toString(16).slice(2);
                      for (let dp = 0; dp < dc.users.length; dp++) {
                        const dq = dc.users[dp];
                        if (!dq) {
                          continue;
                        }
                        if (!dq.key) {
                          dq.key = dm().slice(0, 12);
                        }
                        if (!dq.username) {
                          let dr =
                            String(dq.name || "user" + (dp + 1))
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, "")
                              .slice(0, 24) || "user" + (dp + 1);
                          let ds = dr;
                          let dt = 2;
                          while (dl[ds]) {
                            ds = dr + dt;
                            dt++;
                          }
                          dl[ds] = 1;
                          dq.username = ds;
                        }
                      }
                    }
                    await g.KV.put(
                      "network-settings.json",
                      JSON.stringify(dc, null, 2),
                    );
                    try {
                      await g.KV.delete("user-alerts.json");
                    } catch (du) {}
                    savedUsersAuth = {
                      multiUser: dc.multiUser,
                      users: dc.users,
                    };
                    savedUsersAuthAt = Date.now();
                    h.waitUntil(
                      requestLogRecord(g, f, F, "Save_Users", config_JSON),
                    );
                    return new Response(
                      JSON.stringify({
                        success: true,
                        count: dc.users.length,
                        multiUser: dc.multiUser,
                      }),
                      {
                        status: 200,
                        headers: {
                          "Content-Type": "application/json;charset=utf-8",
                          "Cache-Control": "no-store",
                        },
                      },
                    );
                  }
                  let dd = !!dc.multiUser;
                  let de = Array.isArray(dc.users) ? dc.users : [];
                  if (
                    savedUsersAuth &&
                    Date.now() - savedUsersAuthAt < 120000
                  ) {
                    dd = !!savedUsersAuth.multiUser;
                    de = savedUsersAuth.users;
                  }
                  const df = {};
                  const dg = {};
                  const dh = {};
                  const di = getDateKey(new Date());
                  let dj = false;
                  for (const dv of de) {
                    if (!dv || !dv.id) {
                      continue;
                    }
                    try {
                      const dw = await usageGet(g, "uusage:" + dv.id);
                      df[dv.id] = (dw && dw.total) || 0;
                      dg[dv.id] = {
                        up: (dw && dw.up) || 0,
                        down: (dw && dw.down) || 0,
                      };
                    } catch (dx) {
                      df[dv.id] = 0;
                      dg[dv.id] = {
                        up: 0,
                        down: 0,
                      };
                    }
                    try {
                      const dy = await usageGet(
                        g,
                        "uusage-d:" + dv.id + ":" + di,
                      );
                      dh[dv.id] = (dy && dy.total) || 0;
                    } catch (dz) {
                      dh[dv.id] = 0;
                    }
                    if (dv.enabled !== false) {
                      let dA = null;
                      if (dv.quotaBytes && df[dv.id] >= dv.quotaBytes) {
                        dA = "quota";
                      } else if (
                        dv.dailyQuotaBytes &&
                        dh[dv.id] >= dv.dailyQuotaBytes
                      ) {
                        dA = "daily-quota";
                      } else if (dv.expiry) {
                        const dB = Date.parse(dv.expiry);
                        if (!isNaN(dB) && Date.now() > dB) {
                          dA = "expired";
                        }
                      }
                      if (dA) {
                        dv.enabled = false;
                        dv.disabledReason = dA;
                        dv.disabledAt = Date.now();
                        dv.autoDisabled = true;
                        dj = true;
                      }
                    }
                  }
                  if (dj) {
                    try {
                      dc.users = de;
                      await g.KV.put(
                        "network-settings.json",
                        JSON.stringify(dc, null, 2),
                      );
                      cachedNetworkSettings = null;
                      savedUsersAuth = {
                        multiUser: dd,
                        users: de,
                      };
                      savedUsersAuthAt = Date.now();
                    } catch (dC) {}
                  }
                  return new Response(
                    JSON.stringify({
                      multiUser: dd,
                      users: de,
                      usage: df,
                      usageIO: dg,
                      usageDay: dh,
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "Cache-Control": "no-store",
                      },
                    },
                  );
                } catch (dD) {
                  return new Response(
                    JSON.stringify({
                      error: String((dD && dD.message) || dD),
                    }),
                    {
                      status: 500,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              } else if (E === "admin/user-reset") {
                try {
                  if (f.method !== "POST") {
                    return new Response("Method Not Allowed", {
                      status: 405,
                    });
                  }
                  const dE = await f.json().catch(() => ({}));
                  const dF = dE && dE.id;
                  if (!dF) {
                    return new Response(
                      JSON.stringify({
                        error: "missing id",
                      }),
                      {
                        status: 400,
                        headers: {
                          "Content-Type": "application/json;charset=utf-8",
                        },
                      },
                    );
                  }
                  await usageReset(g, "uusage:" + dF);
                  const dG = new Date();
                  for (let dI = 0; dI < 40; dI++) {
                    const dJ = new Date(dG);
                    dJ.setDate(dJ.getDate() - dI);
                    await usageReset(
                      g,
                      "uusage-d:" + dF + ":" + getDateKey(dJ),
                    );
                  }
                  if (userUsageCache[dF] != null) {
                    userUsageCache[dF] = 0;
                  }
                  if (userDayUsageCache[dF] != null) {
                    userDayUsageCache[dF] = 0;
                  }
                  const dH = JSON.parse(
                    (await g.KV.get("network-settings.json")) || "{}",
                  );
                  if (Array.isArray(dH.users)) {
                    const dK = dH.users.find((dL) => dL && dL.id === dF);
                    if (dK) {
                      dK.enabled = true;
                      delete dK.disabledReason;
                      delete dK.disabledAt;
                      delete dK.autoDisabled;
                    }
                    await g.KV.put(
                      "network-settings.json",
                      JSON.stringify(dH, null, 2),
                    );
                    cachedNetworkSettings = null;
                    savedUsersAuth = null;
                  }
                  h.waitUntil(
                    requestLogRecord(g, f, F, "User_Reset", config_JSON),
                  );
                  return new Response(
                    JSON.stringify({
                      success: true,
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "Cache-Control": "no-store",
                      },
                    },
                  );
                } catch (dL) {
                  return new Response(
                    JSON.stringify({
                      error: String((dL && dL.message) || dL),
                    }),
                    {
                      status: 500,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              } else if (E === "admin/network-settings.json") {
                try {
                  const dM = await f.json();
                  const dN = {
                    enableRouting:
                      typeof dM.enableRouting === "boolean"
                        ? dM.enableRouting
                        : true,
                    enableGeoIP:
                      typeof dM.enableGeoIP === "boolean"
                        ? dM.enableGeoIP
                        : true,
                    enableGeoSite:
                      typeof dM.enableGeoSite === "boolean"
                        ? dM.enableGeoSite
                        : true,
                    enableAdBlock:
                      typeof dM.enableAdBlock === "boolean"
                        ? dM.enableAdBlock
                        : true,
                    enablePornBlock:
                      typeof dM.enablePornBlock === "boolean"
                        ? dM.enablePornBlock
                        : false,
                    enableMalwareBlock:
                      typeof dM.enableMalwareBlock === "boolean"
                        ? dM.enableMalwareBlock
                        : true,
                    enablePhishingBlock:
                      typeof dM.enablePhishingBlock === "boolean"
                        ? dM.enablePhishingBlock
                        : true,
                    monthlyCapGB:
                      typeof dM.monthlyCapGB === "number" &&
                      isFinite(dM.monthlyCapGB) &&
                      dM.monthlyCapGB >= 0
                        ? dM.monthlyCapGB
                        : 0,
                    speedLimitKBps:
                      typeof dM.speedLimitKBps === "number" &&
                      isFinite(dM.speedLimitKBps) &&
                      dM.speedLimitKBps >= 0
                        ? dM.speedLimitKBps
                        : 0,
                    blockQUIC:
                      typeof dM.blockQUIC === "boolean" ? dM.blockQUIC : false,
                    bypassChina:
                      typeof dM.bypassChina === "boolean"
                        ? dM.bypassChina
                        : false,
                    bypassRussia:
                      typeof dM.bypassRussia === "boolean"
                        ? dM.bypassRussia
                        : false,
                    bypassSanctions:
                      typeof dM.bypassSanctions === "boolean"
                        ? dM.bypassSanctions
                        : false,
                    backendMode:
                      typeof dM.backendMode === "boolean"
                        ? dM.backendMode
                        : false,
                    backendUrl:
                      typeof dM.backendUrl === "string" &&
                      /^https?:\/\//i.test(dM.backendUrl.trim())
                        ? dM.backendUrl.trim().slice(0, 300)
                        : "",
                    enableDomesticBypass:
                      typeof dM.enableDomesticBypass === "boolean"
                        ? dM.enableDomesticBypass
                        : true,
                    enableDoH:
                      typeof dM.enableDoH === "boolean" ? dM.enableDoH : true,
                    dohProvider: [
                      "cloudflare",
                      "google",
                      "quad9",
                      "adguard",
                    ].includes(dM.dohProvider)
                      ? dM.dohProvider
                      : "cloudflare",
                    enableLocalDNS:
                      typeof dM.enableLocalDNS === "boolean"
                        ? dM.enableLocalDNS
                        : false,
                    localDNSIP: dM.localDNSIP || "8.8.8.8",
                    localDNSPort: dM.localDNSPort || "53",
                    enableAntiSanctionDNS:
                      typeof dM.enableAntiSanctionDNS === "boolean"
                        ? dM.enableAntiSanctionDNS
                        : false,
                    antiSanctionDNSProvider: [
                      "cloudflare",
                      "google",
                      "quad9",
                      "adguard",
                      "alidns",
                      "shekan",
                      "custom",
                    ].includes(dM.antiSanctionDNSProvider)
                      ? dM.antiSanctionDNSProvider
                      : "cloudflare",
                    antiSanctionCustomDNS: dM.antiSanctionCustomDNS || "",
                    enableFakeDNS:
                      typeof dM.enableFakeDNS === "boolean"
                        ? dM.enableFakeDNS
                        : false,
                    fakeDNSIP: dM.fakeDNSIP || "198.51.100.1",
                    enableIPv6:
                      typeof dM.enableIPv6 === "boolean" ? dM.enableIPv6 : true,
                    allowLAN:
                      typeof dM.allowLAN === "boolean" ? dM.allowLAN : false,
                    logLevel: ["debug", "info", "warn", "error"].includes(
                      dM.logLevel,
                    )
                      ? dM.logLevel
                      : "error",
                    enableWarp:
                      typeof dM.enableWarp === "boolean"
                        ? dM.enableWarp
                        : false,
                    warpMode: ["warp", "chain", "wow"].includes(dM.warpMode)
                      ? dM.warpMode
                      : "warp",
                    warpEndpoint: dM.warpEndpoint || "",
                    warpAmnezia:
                      typeof dM.warpAmnezia === "boolean"
                        ? dM.warpAmnezia
                        : false,
                    customRules:
                      typeof dM.customRules === "string" ? dM.customRules : "",
                    bypassCountries: Array.isArray(dM.bypassCountries)
                      ? [
                          ...new Set(
                            dM.bypassCountries
                              .filter((dO) => /^[a-z]{2}$/i.test(dO))
                              .map((dO) => dO.toLowerCase()),
                          ),
                        ].slice(0, 20)
                      : [],
                    blockCategories: Array.isArray(dM.blockCategories)
                      ? dM.blockCategories.filter((dO) =>
                          [
                            "quic",
                            "malware",
                            "phishing",
                            "cryptominers",
                          ].includes(dO),
                        )
                      : [],
                    warpNoise:
                      dM.warpNoise && typeof dM.warpNoise === "object"
                        ? {
                            mode: ["", "quic", "random"].includes(
                              dM.warpNoise.mode,
                            )
                              ? dM.warpNoise.mode
                              : "",
                            count: String(dM.warpNoise.count || "").slice(
                              0,
                              12,
                            ),
                            size: String(dM.warpNoise.size || "").slice(0, 12),
                            delay: String(dM.warpNoise.delay || "").slice(
                              0,
                              12,
                            ),
                          }
                        : {
                            mode: "",
                            count: "",
                            size: "",
                            delay: "",
                          },
                  };
                  try {
                    const dO = JSON.parse(
                      (await g.KV.get("network-settings.json")) || "{}",
                    );
                    dN.multiUser =
                      typeof dM.multiUser === "boolean"
                        ? dM.multiUser
                        : dO.multiUser || false;
                    dN.users = Array.isArray(dM.users)
                      ? dM.users
                      : dO.users || [];
                  } catch (dP) {
                    dN.multiUser = !!dM.multiUser;
                    dN.users = Array.isArray(dM.users) ? dM.users : [];
                  }
                  await g.KV.put(
                    "network-settings.json",
                    JSON.stringify(dN, null, 2),
                  );
                  cachedNetworkSettings = null;
                  h.waitUntil(
                    requestLogRecord(
                      g,
                      f,
                      F,
                      "Save_Network_Settings",
                      config_JSON,
                    ),
                  );
                  return new Response(
                    JSON.stringify({
                      success: true,
                      message: "تنظیمات شبکه با موفقیت ذخیره شد",
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                } catch (dQ) {
                  console.error("saveNetworkSettingsFail:", dQ);
                  return new Response(
                    JSON.stringify({
                      error: "saveNetworkSettingsFail: " + dQ.message,
                    }),
                    {
                      status: 500,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              } else if (a6 === "admin/ADD.txt") {
                try {
                  const dR = await f.text();
                  await g.KV.put("ADD.txt", dR);
                  h.waitUntil(
                    requestLogRecord(g, f, F, "Save_Custom_IPs", config_JSON),
                  );
                  return new Response(
                    JSON.stringify({
                      success: true,
                      message: "customIpSaved",
                    }),
                    {
                      status: 200,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                } catch (dS) {
                  console.error("saveCustomIpFailed:", dS);
                  return new Response(
                    JSON.stringify({
                      error: "saveCustomIpFailed: " + dS.message,
                    }),
                    {
                      status: 500,
                      headers: {
                        "Content-Type": "application/json;charset=utf-8",
                      },
                    },
                  );
                }
              } else {
                return new Response(
                  JSON.stringify({
                    error: "unsupportedPostPath",
                  }),
                  {
                    status: 404,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
            } else if (E === "admin/config.json") {
              return new Response(JSON.stringify(config_JSON, null, 2), {
                status: 200,
                headers: {
                  "Content-Type": "application/json",
                },
              });
            } else if (E === "admin/network-settings.json") {
              try {
                const dT = await g.KV.get("network-settings.json");
                const dU = {
                  enableRouting: true,
                  enableGeoIP: true,
                  enableGeoSite: true,
                  enableAdBlock: true,
                  enablePornBlock: false,
                  enableDomesticBypass: true,
                  enableDoH: true,
                  dohProvider: "cloudflare",
                  enableLocalDNS: false,
                  localDNSIP: "8.8.8.8",
                  localDNSPort: "53",
                  enableAntiSanctionDNS: false,
                  antiSanctionDNSProvider: "cloudflare",
                  antiSanctionCustomDNS: "",
                  enableFakeDNS: false,
                  fakeDNSIP: "198.51.100.1",
                  enableIPv6: true,
                  allowLAN: false,
                  logLevel: "error",
                  enableWarp: false,
                  warpMode: "warp",
                  warpEndpoint: "",
                  warpAmnezia: false,
                  customRules: "",
                  bypassCountries: [],
                  blockCategories: [],
                  warpNoise: {
                    mode: "",
                    count: "",
                    size: "",
                    delay: "",
                  },
                };
                const dV = dT ? JSON.parse(dT) : dU;
                return new Response(JSON.stringify(dV, null, 2), {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                  },
                });
              } catch (dW) {
                return new Response(
                  JSON.stringify({
                    error: dW.message,
                  }),
                  {
                    status: 500,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
            } else if (E === "admin/users.json") {
              try {
                const dX = JSON.parse(
                  (await g.KV.get("network-settings.json")) || "{}",
                );
                let dY = !!dX.multiUser;
                let dZ = Array.isArray(dX.users) ? dX.users : [];
                if (savedUsersAuth && Date.now() - savedUsersAuthAt < 120000) {
                  dY = !!savedUsersAuth.multiUser;
                  dZ = savedUsersAuth.users;
                }
                const e0 = {};
                await Promise.all(
                  dZ.map(async (e1) => {
                    if (!e1 || !e1.id) {
                      return;
                    }
                    try {
                      const e2 = await usageGet(g, "uusage:" + e1.id);
                      e0[e1.id] = (e2 && e2.total) || 0;
                    } catch (e3) {
                      e0[e1.id] = 0;
                    }
                  }),
                );
                return new Response(
                  JSON.stringify({
                    multiUser: dY,
                    users: dZ,
                    usage: e0,
                  }),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                      "Cache-Control": "no-store",
                    },
                  },
                );
              } catch (e1) {
                return new Response(
                  JSON.stringify({
                    multiUser: false,
                    users: [],
                    usage: {},
                  }),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                      "Cache-Control": "no-store",
                    },
                  },
                );
              }
            } else if (a6 === "admin/ADD.txt") {
              let e2 = (await g.KV.get("ADD.txt")) || "null";
              if (e2 == "null") {
                e2 = (
                  await generateRandomIp(
                    f,
                    config_JSON.optimizedSubGeneration.localIPPool.randomCount,
                    config_JSON.optimizedSubGeneration.localIPPool
                      .specifiedPorts,
                  )
                )[1];
              }
              return new Response(e2, {
                status: 200,
                headers: {
                  "Content-Type": "text/plain;charset=utf-8",
                  asn: f.cf.asn,
                },
              });
            } else if (E === "admin/cf.json") {
              return new Response(JSON.stringify(f.cf, null, 2), {
                status: 200,
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                },
              });
            } else if (E === "admin/system.json") {
              const e3 = !!g.KV && typeof g.KV.get === "function";
              let e4 = false;
              if (e3) {
                try {
                  await getConfigRaw(g);
                  e4 = true;
                } catch (e8) {}
              }
              let e5 = {
                up: 0,
                down: 0,
                total: 0,
              };
              if (e3) {
                try {
                  const e9 = await usageGet(
                    g,
                    "usage:" + getDateKey(new Date()),
                  );
                  if (e9) {
                    e5 = {
                      up: e9.up || 0,
                      down: e9.down || 0,
                      total: e9.total || 0,
                    };
                  }
                } catch (ea) {}
              }
              const e6 = f.cf;
              let e7 = null;
              if (g.DB && typeof g.DB.prepare === "function") {
                try {
                  const eb = await g.DB.prepare("SELECT 1").all();
                  if (eb && eb.meta && typeof eb.meta.size_after === "number") {
                    e7 = eb.meta.size_after;
                  }
                } catch (ec) {}
              }
              return new Response(
                JSON.stringify({
                  ip: F,
                  d1SizeBytes: e7,
                  colo: e6?.colo,
                  country: e6?.country,
                  city: e6?.city,
                  region: e6?.region,
                  regionCode: e6?.regionCode,
                  latitude: e6?.latitude,
                  longitude: e6?.longitude,
                  timezone: e6?.timezone,
                  asn: e6?.asn,
                  asOrganization: e6?.asOrganization,
                  userAgent: q,
                  version: Version,
                  instanceId: (await MD5MD5(p.host)).slice(0, 8),
                  kvConnected: e3,
                  kvOk: e4,
                  host: p.host,
                  protocol: p.protocol,
                  todayUsage: e5,
                  workerStartTime: globalThis.__workerStart || null,
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Cache-Control": "no-store",
                  },
                },
              );
            } else if (E === "admin/usage-data") {
              try {
                const ed = new Date();
                const ee = 16;
                const ef = [];
                for (let en = 0; en < ee; en++) {
                  const eo = new Date(ed);
                  eo.setDate(eo.getDate() - en);
                  ef.push(
                    "usage:" +
                      eo.getFullYear() +
                      "-" +
                      String(eo.getMonth() + 1).padStart(2, "0") +
                      "-" +
                      String(eo.getDate()).padStart(2, "0"),
                  );
                }
                const eg = await Promise.all(
                  ef.map((ep) => usageGet(g, ep).catch(() => null)),
                );
                const eh = [];
                for (let ep = 0; ep < ef.length; ep++) {
                  if (eg[ep]) {
                    try {
                      eh.push({
                        date: ef[ep].slice(6),
                        ...eg[ep],
                      });
                    } catch (eq) {}
                  }
                }
                const ei = {};
                for (const er of eh) {
                  const es = er.date.slice(0, 7);
                  if (!ei[es]) {
                    ei[es] = {
                      up: 0,
                      down: 0,
                      total: 0,
                    };
                  }
                  ei[es].up += er.up || 0;
                  ei[es].down += er.down || 0;
                  ei[es].total += er.total || 0;
                }
                const ej = Object.entries(ei).map(([et, eu]) => ({
                  month: et,
                  ...eu,
                }));
                const ek = {};
                for (const et of eh) {
                  const eu = et.date.slice(0, 4);
                  if (!ek[eu]) {
                    ek[eu] = {
                      up: 0,
                      down: 0,
                      total: 0,
                    };
                  }
                  ek[eu].up += et.up || 0;
                  ek[eu].down += et.down || 0;
                  ek[eu].total += et.total || 0;
                }
                const el = Object.entries(ek).map(([ev, ew]) => ({
                  year: ev,
                  ...ew,
                }));
                return new Response(
                  JSON.stringify({
                    daily: eh,
                    monthly: ej,
                    yearly: el,
                  }),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                      "Cache-Control": "no-store",
                    },
                  },
                );
              } catch (ev) {
                return new Response(
                  JSON.stringify({
                    error: ev.message,
                  }),
                  {
                    status: 500,
                    headers: {
                      "Content-Type": "application/json;charset=utf-8",
                    },
                  },
                );
              }
            } else if (E === "admin/sub-content") {
              const ew = await MD5MD5(D + B);
              const ey = p.protocol + "//" + p.host + "/sub?token=" + ew;
              const ez = await fetch(ey).catch(() => null);
              if (!ez) {
                return new Response("Sub content unavailable", {
                  status: 502,
                });
              }
              const eA = await ez.text();
              return new Response(eA, {
                status: 200,
                headers: {
                  "Content-Type": "text/plain;charset=utf-8",
                  "Cache-Control": "no-store",
                },
              });
            } else if (a6 === "admin/bestip") {
              return await bestIP(f, g);
            }
            h.waitUntil(requestLogRecord(g, f, F, "Admin_Login", config_JSON));
            const as = E.startsWith("admin/") ? E.slice(6).split("/")[0] : "";
            const at = as ? "/admin/" : "/admin" + p.search;
            return await panelHtml(g, at, {
              spaPage: as,
            }).catch(
              () =>
                new Response("Admin panel unavailable", {
                  status: 502,
                }),
            );
          } else if (E === "logout" || uuidRegex.test(E)) {
            const eB = new Response("redirecting...", {
              status: 302,
              headers: {
                Location: "/login",
              },
            });
            eB.headers.set("Set-Cookie", "auth=; Path=/; Max-Age=0; HttpOnly");
            return eB;
          } else if (E === "sub") {
            const eC = await MD5MD5(D + B);
            const eD =
              ["1", "true"].includes(g.BEST_SUB) &&
              p.searchParams.get("host") === "example.com" &&
              p.searchParams.get("uuid") ===
                "00000000-0000-4000-8000-000000000000" &&
              q.toLowerCase().includes("YNSProxy");
            const eE = p.searchParams.get("token");
            const eF = p.searchParams.get("sub");
            const eG = p.searchParams.get("key");
            let eH = "";
            let eHUsername = "";
            const eI =
              savedUsersAuth &&
              Date.now() - savedUsersAuthAt < 120000 &&
              Array.isArray(savedUsersAuth.users)
                ? savedUsersAuth.users
                : networkSettings && Array.isArray(networkSettings.users)
                  ? networkSettings.users
                  : null;
            if (eI && (eE || (eF && eG))) {
              const eP = eI.filter((eR) => eR && eR.key && eG === eR.key);
              const eQ = eE
                ? eI.find((eR) => eR && eR.token === eE)
                : eP.length === 1
                  ? eP[0]
                  : eP.find(
                      (eR) =>
                        String(eR.username || "").toLowerCase() ===
                        String(eF).toLowerCase(),
                    ) || eP[0];
              if (eQ) {
                if (eQ.enabled === false) {
                  return new Response("Account disabled", {
                    status: 403,
                  });
                }
                if (eQ.expiry) {
                  const eR = Date.parse(eQ.expiry);
                  if (!isNaN(eR) && Date.now() > eR) {
                    return new Response("Account expired", {
                      status: 403,
                    });
                  }
                }
                if (eQ.quotaBytes) {
                  try {
                    const eS = await usageGet(g, "uusage:" + eQ.id);
                    if (eS && eS.total >= eQ.quotaBytes) {
                      return new Response("Quota exceeded", {
                        status: 403,
                      });
                    }
                  } catch (eT) {}
                }
                eH = eQ.tag;
                eHUsername = eQ.username || eQ.id || "";
              }
            }
            const eJ = eE === eC || eH !== "";
            const eK = Math.floor(Date.now() / 86400000);
            const eL = base64SecretEncode(eC, B);
            const [eM, eN] = await Promise.all([
              MD5MD5(eL + eK),
              MD5MD5(eL + (eK - 1)),
            ]);
            const eO = eE === eM || eE === eN;
            if (eJ || eO || eD) {
              config_JSON = await readConfigJson(g, D, B, q);
              if (eD) {
                h.waitUntil(
                  requestLogRecord(g, f, F, "Get_Best_SUB", config_JSON, false),
                );
              } else {
                h.waitUntil(requestLogRecord(g, f, F, "Get_SUB", config_JSON));
              }
              h.waitUntil(flushUsage(g));
              const eU = q.toLowerCase();
              const eV = {
                "content-type": "text/plain; charset=utf-8",
                "Profile-Update-Interval":
                  config_JSON.optimizedSubGeneration.SUBUpdateTime,
                "Profile-web-page-url": p.protocol + "//" + p.host + "/admin",
                "Cache-Control": "no-store",
              };
              try {
                const f0 = eH;
                let f1 = 0;
                let f2 = 0;
                let f3 = 1099511627776000;
                let f4 = 4102329600;
                const f5 =
                  f0 && networkSettings && Array.isArray(networkSettings.users)
                    ? networkSettings.users.find((f6) => f6 && f6.tag === f0)
                    : null;
                if (f5) {
                  const f6 = (await usageGet(g, "uusage:" + f5.id)) || {};
                  f1 = f6.up || 0;
                  f2 = f6.down || 0;
                  if (f5.quotaBytes) {
                    f3 = f5.quotaBytes;
                  }
                  if (f5.expiry) {
                    const f7 = Date.parse(f5.expiry);
                    if (!isNaN(f7)) {
                      f4 = Math.floor(f7 / 1000);
                    }
                  }
                } else {
                  const f8 = (await usageGet(
                    g,
                    "usage-m:" + getMonthKey(new Date()),
                  )) || {
                    up: 0,
                    down: 0,
                  };
                  f1 = f8.up || 0;
                  f2 = f8.down || 0;
                }
                eV["Subscription-Userinfo"] =
                  "upload=" +
                  f1 +
                  "; download=" +
                  f2 +
                  "; total=" +
                  f3 +
                  "; expire=" +
                  f4;
              } catch (f9) {}
              const eW =
                p.searchParams.has("b64") ||
                p.searchParams.has("base64") ||
                f.headers.get("subconverter-request") ||
                f.headers.get("subconverter-version") ||
                eU.includes("subconverter") ||
                eU.includes("CF-Workers-SUB".toLowerCase()) ||
                eD;
              const eX = eW
                ? "mixed"
                : p.searchParams.has("target")
                  ? p.searchParams.get("target")
                  : p.searchParams.has("clash") ||
                      eU.includes("clash") ||
                      eU.includes("meta") ||
                      eU.includes("mihomo")
                    ? "clash"
                    : p.searchParams.has("sb") ||
                        p.searchParams.has("singbox") ||
                        eU.includes("singbox") ||
                        eU.includes("sing-box")
                      ? "singbox"
                      : p.searchParams.has("surge") || eU.includes("surge")
                        ? "surge&ver=4"
                        : p.searchParams.has("quanx") ||
                            eU.includes("quantumult")
                          ? "quanx"
                          : p.searchParams.has("loon") || eU.includes("loon")
                            ? "loon"
                            : "mixed";
              if (!eU.includes("mozilla")) {
                eV["Content-Disposition"] =
                  "attachment; filename*=utf-8''" +
                  encodeURIComponent(
                    config_JSON.optimizedSubGeneration.SUBNAME,
                  );
              }
              const eY =
                (p.searchParams.has("surge") || eU.includes("surge")) &&
                config_JSON.protocolType !== "ss"
                  ? "trojan"
                  : config_JSON.protocolType;
              let eZ = "";
              if (
                (f.headers.get("Accept") || "")
                  .toLowerCase()
                  .includes("text/html") &&
                !p.searchParams.has("raw")
              ) {
                const fa = await serveUserHub();
                if (fa) {
                  return fa;
                }
              }
              if (eX === "mixed") {
                const fb =
                  config_JSON.tlsFragment == "Shadowrocket"
                    ? "&fragment=" +
                      encodeURIComponent("1,40-60,30-50,tlshello")
                    : config_JSON.tlsFragment == "Happ"
                      ? "&fragment=" + encodeURIComponent("3,1,tlshello")
                      : "";
                let fc = [];
                let fe = "";
                let ff = [];
                const fg = p.searchParams.get("sub") || "";
                const fh = fg.includes(".");
                if (!fh && config_JSON.optimizedSubGeneration.local) {
                  let fq = config_JSON.POOL_API
                    ? await getSmartCleanIPs(
                        f,
                        config_JSON.POOL_API,
                        config_JSON.optimizedSubGeneration.localIPPool
                          .randomCount,
                      )
                    : null;
                  if (!fq || !fq.length) {
                    fq = config_JSON.optimizedSubGeneration.localIPPool.randomIP
                      ? (
                          await generateRandomIp(
                            f,
                            config_JSON.optimizedSubGeneration.localIPPool
                              .randomCount,
                            config_JSON.optimizedSubGeneration.localIPPool
                              .specifiedPorts,
                          )
                        )[0]
                      : (await g.KV.get("ADD.txt"))
                        ? await sortIntoArray(await g.KV.get("ADD.txt"))
                        : (
                            await generateRandomIp(
                              f,
                              config_JSON.optimizedSubGeneration.localIPPool
                                .randomCount,
                              config_JSON.optimizedSubGeneration.localIPPool
                                .specifiedPorts,
                            )
                          )[0];
                  }
                  const fr = [];
                  const fs = [];
                  const ft = [];
                  for (const fx of fq) {
                    if (fx.toLowerCase().startsWith("sub://")) {
                      fr.push(fx);
                    } else {
                      const fy = fx.indexOf("#");
                      const fz = fy > -1 ? fx.slice(0, fy) : fx;
                      const fA = fy > -1 ? fx.slice(fy) : "";
                      const fB = fx.match(/sub\s*=\s*([^\s&#]+)/i);
                      if (fB && fB[1].trim().includes(".")) {
                        const fC = fx.toLowerCase().includes("proxyip=true");
                        if (fC) {
                          fr.push(
                            "sub://" +
                              fB[1].trim() +
                              "?proxyip=true" +
                              (fx.includes("#") ? "#" + fx.split("#")[1] : ""),
                          );
                        } else {
                          fr.push(
                            "sub://" +
                              fB[1].trim() +
                              (fx.includes("#") ? "#" + fx.split("#")[1] : ""),
                          );
                        }
                      } else if (fz.toLowerCase().startsWith("https://")) {
                        fr.push(fx);
                      } else if (fz.toLowerCase().includes("://")) {
                        if (fx.includes("#")) {
                          const fD = fx.split("#");
                          ft.push(
                            fD[0] +
                              "#" +
                              encodeURIComponent(decodeURIComponent(fD[1])),
                          );
                        } else {
                          ft.push(fx);
                        }
                      } else if (fz.includes("*")) {
                        fs.push(replaceStarWithRandom(fz) + fA);
                      } else {
                        fs.push(fx);
                      }
                    }
                  }
                  const fu = await requestBestApi(fr, "443");
                  const fv = [...new Set(ft.concat(fu[1]))];
                  fe = fv.length > 0 ? fv.join("\n") + "\n" : "";
                  const fw = fu[0];
                  ff = fu[3] || [];
                  fc = [...new Set(fs.concat(fw))];
                } else {
                  let fE =
                    (fh ? fg : "") || config_JSON.optimizedSubGeneration.SUB;
                  const [fF, fG] = await getBestSubGeneratorData(fE);
                  fc = fc.concat(fF);
                  fe += fG;
                }
                if (networkSettings && networkSettings.enableWarp) {
                  try {
                    const fH = await buildRegisteredWarpNode(g);
                    if (fH) {
                      fe = fH + "\n" + fe;
                    }
                  } catch (fI) {}
                }
                const fi = config_JSON.ECH
                  ? "&ech=" +
                    encodeURIComponent(
                      (config_JSON.ECHConfig.SNI
                        ? config_JSON.ECHConfig.SNI + "+"
                        : "") + config_JSON.ECHConfig.DNS,
                    )
                  : "";
                const fj = eU.includes("loon") || eU.includes("surge");
                const {
                  type: fk,
                  pathFieldName: fl,
                  domainFieldName: fm,
                } = getTransportProtocolConfig(config_JSON);
                const fn = eHUsername
                  ? "YNS | " + eHUsername
                  : eH
                    ? "YNS | " + eH
                    : "YNS";
                fc = [D + ":443#" + fn, ...fc];
                const fo = String(config_JSON.chainProxy || "").trim();
                let fp = fo
                  ? fo
                      .split(/[\n,]+/)
                      .map((fJ) => fJ.trim())
                      .filter((fJ) =>
                        /^(socks5|http|https|turn|sstp):\/\//i.test(fJ),
                      )
                  : [];
                {
                  const fJ = config_JSON.socks5RotateEvery;
                  if (fp.length > 1 && (fJ === "daily" || fJ === "weekly")) {
                    const fK = Math.max(
                      1,
                      Math.min(
                        fp.length,
                        Number(config_JSON.socks5RotateCount) || 3,
                      ),
                    );
                    if (fK < fp.length) {
                      const fL = fJ === "weekly" ? 7 : 1;
                      const fM = Math.floor(Date.now() / 86400000 / fL);
                      const fN = ((fM % fp.length) + fp.length) % fp.length;
                      fp = Array.from(
                        {
                          length: fK,
                        },
                        (fO, fP) => fp[(fN + fP) % fp.length],
                      );
                    }
                  }
                }
                eZ =
                  fe +
                  fc
                    .map((fO, fP) => {
                      const fQ = fO.match(NODE_ADDR_REGEX);
                      let fR;
                      let fS = "443";
                      let fT;
                      if (fQ) {
                        fR = fQ[1];
                        fS = fQ[2] ? fQ[2] : "443";
                        fT = fQ[3]
                          ? (fQ[3].startsWith("YNS")
                            ? fQ[3]
                            : "YNS | " + fQ[3])
                          : "YNS | " + fR;
                      } else {
                        console.warn(
                          "[subContent] invalidIpFormatIgnored: " + fO,
                        );
                        return null;
                      }
                      let fU = config_JSON.fullNodePath;
                      const fV = fT.match(
                        /\$(socks5|http|https|turn|sstp):\/\/([^#\s]+)/i,
                      );
                      if (fV) {
                        try {
                          const fW = fV[1].toLowerCase();
                          const fX = fV[2];
                          const fY = {
                            type: fW,
                            ...getSocks5Account(fX, getProxyDefaultPort(fW)),
                          };
                          fU =
                            "/video/" +
                            (base64SecretEncode(JSON.stringify(fY), B) +
                              (config_JSON.enable0RTT ? "?ed=2560" : ""));
                          fT = fT.replace(fV[0], "").trim() || fR;
                        } catch (fZ) {
                          console.warn(
                            "[subContent] chainProxyParseFailed，ignoredDirective: " +
                              fV[0] +
                              " (" +
                              (fZ && fZ.message ? fZ.message : fZ) +
                              ")",
                          );
                        }
                      } else if (fp.length) {
                        const g0 = fp[fP % fp.length];
                        try {
                          const g1 =
                            /^(socks5|http|https|turn|sstp):\/\/(.+)$/i.exec(
                              g0,
                            );
                          const g2 = g1[1].toLowerCase();
                          const g3 = {
                            type: g2,
                            ...getSocks5Account(
                              g1[2].split("/")[0],
                              getProxyDefaultPort(g2),
                            ),
                          };
                          fU =
                            "/video/" +
                            (base64SecretEncode(JSON.stringify(g3), B) +
                              (config_JSON.enable0RTT ? "?ed=2560" : ""));
                          if (fp.length > 1) {
                            fT = fT + " ·S" + ((fP % fp.length) + 1);
                          }
                        } catch (g4) {
                          console.warn(
                            "[subContent] global chainProxy parse failed: " +
                              (g4 && g4.message ? g4.message : g4),
                          );
                        }
                      } else if (ff.length > 0) {
                        const g5 = ff.find((g6) => g6.includes(fR));
                        if (g5) {
                          fU =
                            (config_JSON.PATH + "/proxyip=" + g5).replace(
                              /\/\//g,
                              "/",
                            ) + (config_JSON.enable0RTT ? "?ed=2560" : "");
                        }
                      }
                      if (eH) {
                        fU += (fU.includes("?") ? "&" : "?") + "u=" + eH;
                      }
                      if (fj) {
                        fU = fU.replace(/,/g, "%2C");
                      }
                      if (eY === "ss" && !eD) {
                        if (!config_JSON.SS.TLS) {
                          const g6 = [443, 2053, 2083, 2087, 2096, 8443];
                          const g7 = [80, 2052, 2082, 2086, 2095, 8080];
                          fS = String(g7[g6.indexOf(Number(fS))] ?? fS);
                        }
                        fU = (
                          fU.includes("?")
                            ? fU.replace(
                                "?",
                                "?enc=" + config_JSON.SS.cipherMethod + "&",
                              )
                            : fU + "?enc=" + config_JSON.SS.cipherMethod
                        ).replace(/([=,])/g, "\\$1");
                        if (!eW) {
                          fU = fU + ";mux=0";
                        }
                        return (
                          eY +
                          "://" +
                          btoa(
                            config_JSON.SS.cipherMethod +
                              ":00000000-0000-4000-8000-000000000000",
                          ) +
                          "@" +
                          fR +
                          ":" +
                          fS +
                          "?plugin=v2" +
                          (encodeURIComponent(
                            "ray-plugin;mode=websocket;host=example.com;path=" +
                              (config_JSON.randomPath ? randomPath(fU) : fU) +
                              (config_JSON.SS.TLS ? ";tls" : ""),
                          ) +
                            fi +
                            fb) +
                          "#" +
                          encodeURIComponent(fT)
                        );
                      } else {
                        const g8 = getTransportPathParamValue(
                          config_JSON,
                          fU,
                          eD,
                        );
                        if (config_JSON.enableTLS === false) {
                          const g9 = [443, 2053, 2083, 2087, 2096, 8443];
                          const ga = [80, 2052, 2082, 2086, 2095, 8080];
                          const gb = String(ga[g9.indexOf(Number(fS))] ?? fS);
                          return (
                            eY +
                            "://00000000-0000-4000-8000-000000000000@" +
                            fR +
                            ":" +
                            gb +
                            "?security=none&type=" +
                            fk +
                            "&" +
                            fm +
                            "=example.com&" +
                            fl +
                            "=" +
                            encodeURIComponent(g8) +
                            "&encryption=none#" +
                            encodeURIComponent(fT)
                          );
                        }
                        return (
                          eY +
                          "://00000000-0000-4000-8000-000000000000@" +
                          fR +
                          ":" +
                          fS +
                          "?security=tls&type=" +
                          (fk + fi) +
                          "&" +
                          fm +
                          "=example.com&fp=" +
                          config_JSON.Fingerprint +
                          "&sni=example.com&" +
                          fl +
                          "=" +
                          (encodeURIComponent(g8) + fb) +
                          "&encryption=none" +
                          (config_JSON.skipCertVerify
                            ? "&insecure=1&allowInsecure=1"
                            : "") +
                          "#" +
                          encodeURIComponent(fT)
                        );
                      }
                    })
                    .filter((fO) => fO !== null)
                    .join("\n");
              } else {
                const fO =
                  (/(novaproxy|yns)/i.test(
                    config_JSON.subConverterConfig.SUBAPI || "",
                  ) || !config_JSON.subConverterConfig.SUBAPI
                    ? "https://SUBAPI.cmliussss.net"
                    : config_JSON.subConverterConfig.SUBAPI) +
                  "/sub?target=" +
                  eX +
                  "&url=" +
                  encodeURIComponent(
                    p.protocol +
                      "//" +
                      p.host +
                      "/sub?target=mixed&token=" +
                      eM +
                      "&asOrg=" +
                      identifyCarrier(f) +
                      (p.searchParams.has("sub") &&
                      p.searchParams.get("sub") != ""
                        ? "&sub=" + p.searchParams.get("sub")
                        : ""),
                  ) +
                  "&config=" +
                  encodeURIComponent(config_JSON.subConverterConfig.SUBCONFIG) +
                  "&emoji=" +
                  config_JSON.subConverterConfig.SUBEMOJI +
                  "&scv=" +
                  config_JSON.skipCertVerify;
                try {
                  const fP = await fetch(fO, {
                    headers: {
                      "User-Agent":
                        "Subconverter for " +
                        eX +
                        " YNSProxy",
                    },
                  });
                  if (fP.ok) {
                    eZ = await fP.text();
                    if (p.searchParams.has("surge") || eU.includes("surge")) {
                      eZ = SurgesubConfigFileHotpatch(
                        eZ,
                        p.protocol +
                          "//" +
                          p.host +
                          "/sub?token=" +
                          eC +
                          "&surge",
                        config_JSON,
                      );
                    }
                  } else {
                    return new Response(
                      "subConvertBackendException：" + fP.statusText,
                      {
                        status: fP.status,
                      },
                    );
                  }
                } catch (fQ) {
                  return new Response(
                    "subConvertBackendException：" + fQ.message,
                    {
                      status: 403,
                    },
                  );
                }
              }
              if (!eU.includes("subconverter") && eJ) {
                let fR = config_JSON.HOSTS;
                try {
                  const fV = JSON.parse(
                    (await g.KV.get("domain-health.json")) || "null",
                  );
                  if (fV && Array.isArray(fV.domains)) {
                    const fW = new Set(
                      fV.domains
                        .filter((fY) => fY && fY.ok === false)
                        .map((fY) => fY.host),
                    );
                    const fX = config_JSON.HOSTS.filter((fY) => !fW.has(fY));
                    if (fX.length) {
                      fR = fX;
                    }
                  }
                } catch (fY) {}
                const fS = [...fR].sort(() => Math.random() - 0.5);
                let fT = 0;
                let fU = null;
                eZ = eZ
                  .replace(
                    /00000000-0000-4000-8000-000000000000/g,
                    config_JSON.UUID,
                  )
                  .replace(
                    /MDAwMDAwMDAtMDAwMC00MDAwLTgwMDAtMDAwMDAwMDAwMDAw/g,
                    btoa(config_JSON.UUID),
                  )
                  .replace(/example\.com/g, () => {
                    if (fT % 2 === 0) {
                      const fZ = fS[Math.floor(fT / 2) % fS.length];
                      fU = replaceStarWithRandom(fZ);
                    }
                    fT++;
                    return fU;
                  });
              }
              if (
                eX === "mixed" &&
                (!eU.includes("mozilla") ||
                  p.searchParams.has("b64") ||
                  p.searchParams.has("base64"))
              ) {
                eZ = btoa(eZ);
              }
              if (eX === "singbox") {
                eZ = await SingboxsubConfigFileHotpatch(
                  eZ,
                  config_JSON,
                  networkSettings,
                );
                eV["content-type"] = "application/json; charset=utf-8";
              } else if (eX === "clash") {
                eZ = ClashsubConfigFileHotpatch(
                  eZ,
                  config_JSON,
                  networkSettings,
                );
                eV["content-type"] = "application/x-yaml; charset=utf-8";
              }
              return new Response(eZ, {
                status: 200,
                headers: eV,
              });
            }
          } else if (E === "locations") {
            const fZ = f.headers.get("Cookie") || "";
            const g0 = fZ
              .split(";")
              .find((g1) => g1.trim().startsWith("auth="))
              ?.split("=")[1];
            if (g0 && (await verifySessionToken(g0, q, z, x))) {
              return fetch(
                new Request("https://speed.cloudflare.com/locations", {
                  headers: {
                    Referer: "https://speed.cloudflare.com/",
                  },
                }),
              );
            }
          } else if (E === "robots.txt") {
            return new Response("User-agent: *\nDisallow: /", {
              status: 200,
              headers: {
                "Content-Type": "text/plain; charset=UTF-8",
              },
            });
          }
        } else if (!A) {
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/install",
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          });
        }
      }
      if (/\.\w{2,4}$/.test(p.pathname)) {
        const g1 = await panelFetch(g, p.pathname).catch(() => {});
        if (g1 && g1.ok) {
          return g1;
        }
      }
      let G = g.URL || "nginx";
      if (G && G !== "nginx" && G !== "1101") {
        G = G.trim().replace(/\/$/, "");
        if (!G.match(/^https?:\/\//i)) {
          G = "https://" + G;
        }
        if (G.toLowerCase().startsWith("http://")) {
          G = "https://" + G.substring(7);
        }
        try {
          const g2 = new URL(G);
          G = g2.protocol + "//" + g2.host;
        } catch (g3) {
          G = "nginx";
        }
      }
      if (G === "1101") {
        return new Response(await html1101(p.host, F), {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
          },
        });
      }
      if (G === "nginx") {
        return new Response(await nginx(), {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
          },
        });
      }
      try {
        const g4 = new URL(G);
        const g5 = new Headers(f.headers);
        g5.set("Host", g4.host);
        g5.set("Referer", g4.origin);
        g5.set("Origin", g4.origin);
        if (!g5.has("User-Agent") && q && q !== "null") {
          g5.set("User-Agent", q);
        }
        const g6 = await fetch(g4.origin + p.pathname + p.search, {
          method: f.method,
          headers: g5,
          body: f.body,
          cf: f.cf,
        });
        const g7 = g6.headers.get("content-type") || "";
        if (/text|javascript|json|xml/.test(g7)) {
          const g8 = (await g6.text()).replaceAll(g4.host, p.host);
          return new Response(g8, {
            status: g6.status,
            headers: {
              ...Object.fromEntries(g6.headers),
              "Cache-Control": "no-store",
            },
          });
        }
        return g6;
      } catch (g9) {}
      return new Response(await nginx(), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
        },
      });
    } catch (ga) {
      try {
        console.error(
          "YNS fatal:",
          (ga && (ga.stack || ga.message)) || String(ga),
        );
      } catch (gb) {}
      try {
        if (g && g.KV && typeof g.KV.put === "function") {
          const gc = JSON.stringify({
            t: new Date().toISOString(),
            path: (() => {
              try {
                return new URL(f.url).pathname + new URL(f.url).search;
              } catch (gd) {
                return "?";
              }
            })(),
            method: f && f.method,
            ua: (f && f.headers && f.headers.get("User-Agent")) || "",
            version: Version,
            error: (ga && (ga.stack || ga.message)) || String(ga),
          });
          if (h && typeof h.waitUntil === "function") {
            h.waitUntil(g.KV.put("last_error.json", gc));
          } else {
            await g.KV.put("last_error.json", gc);
          }
        }
      } catch (gd) {}
      try {
        if (g && (g.DEBUG === "1" || g.DEBUG === "true")) {
          const ge = (ga && (ga.stack || ga.message)) || String(ga);
          return new Response("YNS DEBUG — uncaught exception:\n\n" + ge, {
            status: 500,
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
              "Cache-Control": "no-store",
            },
          });
        }
      } catch (gf) {}
      try {
        return new Response(await nginx(), {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
          },
        });
      } catch (gg) {
        return new Response("", {
          status: 200,
        });
      }
    }
  },
  async scheduled(c, f, g) {
    if (!f || !["1", "true"].includes(String(f.ENABLE_CRON || ""))) {
      return;
    }
    wrapKVWithD1(f);
    if (
      !_kvMigratedFlag &&
      f.__realKV &&
      g &&
      typeof g.waitUntil === "function"
    ) {
      g.waitUntil(migrateKvToD1(f));
    }
    g.waitUntil(
      runScheduledMaintenance(f)
        .then((h) => {
          if (h && h.mirror && !h.mirror.skipped) {
            console.log(
              "scheduledMaintenance:",
              JSON.stringify(h.mirror.results),
            );
          }
        })
        .catch((h) =>
          console.error(
            "runScheduledMaintenance(scheduled) error:",
            h && h.message,
          ),
        ),
    );
  },
};
export default novaWorker;
async function handleXhttpRequest(c, f, g, h) {
  if (connRejectReason) {
    return new Response("Forbidden (" + connRejectReason + ")", {
      status: 403,
    });
  }
  if (!c.body) {
    return new Response("Bad Request", {
      status: 400,
    });
  }
  const i = c.body.getReader();
  const j = await readXhttpFirstPacket(i, f);
  if (!j) {
    try {
      i.releaseLock();
    } catch (s) {}
    return new Response("Invalid request", {
      status: 400,
    });
  }
  if (isBlockedSite(j.hostname)) {
    try {
      i.releaseLock();
    } catch (t) {}
    if (
      networkSettings &&
      networkSettings.enablePornBlock &&
      isAdultDomain(j.hostname)
    ) {
      return novaBlockPage(c);
    } else {
      return new Response("Forbidden", {
        status: 403,
      });
    }
  }
  if (j.isUDP && j.protocol !== "trojan" && j.port !== 53) {
    try {
      i.releaseLock();
    } catch (u) {}
    return new Response("UDP is not supported", {
      status: 400,
    });
  }
  const k = {
    socket: null,
    connectingPromise: null,
    retryConnect: null,
  };
  let l = null;
  let m = null;
  const n = {
    up: 0,
    down: 0,
  };
  const o = new Headers({
    "Content-Type": "application/octet-stream",
    "X-Accel-Buffering": "no",
    "Cache-Control": "no-store",
  });
  const p = () => {
    if (m) {
      try {
        m.releaseLock();
      } catch (v) {}
      m = null;
    }
    l = null;
  };
  const q = () => {
    const v = k.socket;
    if (!v) {
      return null;
    }
    if (v !== l) {
      p();
      l = v;
      m = v.writable.getWriter();
    }
    return m;
  };
  let r = null;
  return new Response(
    new ReadableStream({
      async start(v) {
        let w = false;
        let x = j.respHeader;
        const y = {
          cache: new Uint8Array(0),
        };
        const z = {
          readyState: WebSocket.OPEN,
          send(C) {
            if (w) {
              return;
            }
            try {
              const D =
                C instanceof Uint8Array
                  ? C
                  : C instanceof ArrayBuffer
                    ? new Uint8Array(C)
                    : ArrayBuffer.isView(C)
                      ? new Uint8Array(C.buffer, C.byteOffset, C.byteLength)
                      : new Uint8Array(C);
              v.enqueue(D);
              n.down += D.byteLength;
            } catch (E) {
              w = true;
              this.readyState = WebSocket.CLOSED;
            }
          },
          close() {
            if (w) {
              return;
            }
            w = true;
            this.readyState = WebSocket.CLOSED;
            try {
              v.close();
            } catch (C) {}
          },
        };
        const A = (r = createUpstreamWriteQueue({
          getWriter: q,
          releaseWriter: p,
          retryConnection: async () => {
            if (typeof k.retryConnect !== "function") {
              throw new Error("retry unavailable");
            }
            await k.retryConnect();
          },
          closeConnection: () => {
            try {
              k.socket?.close();
            } catch (C) {}
            closeSocketQuietly(z);
          },
          name: "XHTTPupstream",
        }));
        const B = async (C, D = true) => {
          return A.writeAndWait(C, D);
        };
        try {
          if (j.isUDP) {
            if (j.rawData?.byteLength) {
              if (j.protocol === "trojan") {
                await forwardTrojanUdpData(j.rawData, z, y, c);
              } else {
                await forwardataudp(j.rawData, z, x, c);
              }
              x = null;
            }
          } else {
            if (j.rawData?.byteLength) {
              n.up += j.rawData.byteLength;
            }
            await forwardataTCP(
              j.hostname,
              j.port,
              j.rawData,
              z,
              j.respHeader,
              k,
              f,
              c,
              n,
            );
          }
          while (true) {
            const { done: C, value: D } = await i.read();
            if (C) {
              break;
            }
            if (!D || D.byteLength === 0) {
              continue;
            }
            if (D.byteLength) {
              n.up += D.byteLength;
            }
            if (j.isUDP) {
              if (j.protocol === "trojan") {
                await forwardTrojanUdpData(D, z, y, c);
              } else {
                await forwardataudp(D, z, x, c);
              }
              x = null;
            } else if (!(await B(D))) {
              throw new Error("Remote socket is not ready");
            }
          }
          if (!j.isUDP) {
            await A.waitEmpty();
            const E = q();
            if (E) {
              try {
                await E.close();
              } catch (F) {}
            }
          }
        } catch (G) {
          log("[XHTTPforward] handleFail: " + (G?.message || G));
          closeSocketQuietly(z);
        } finally {
          A.clear();
          p();
          try {
            i.releaseLock();
          } catch (H) {}
          recordUsage(g, n.up, n.down, h);
        }
      },
    }),
    {
      status: 200,
      headers: o,
    },
  );
}
function validDataLength(c) {
  if (!c) {
    return 0;
  }
  if (typeof c.byteLength === "number") {
    return c.byteLength;
  }
  if (typeof c.length === "number") {
    return c.length;
  }
  return 0;
}
async function readXhttpFirstPacket(c, f) {
  const g = VLESStextDecode;
  const h = (o) => {
    const p = o.byteLength;
    if (p < 18) {
      return {
        status: "need_more",
      };
    }
    if (!UUIDbyteMatch(o, 1, f)) {
      return {
        status: "invalid",
      };
    }
    const q = o[17];
    const r = 18 + q;
    if (p < r + 1) {
      return {
        status: "need_more",
      };
    }
    const s = o[r];
    if (s !== 1 && s !== 2) {
      return {
        status: "invalid",
      };
    }
    const t = r + 1;
    if (p < t + 3) {
      return {
        status: "need_more",
      };
    }
    const u = (o[t] << 8) | o[t + 1];
    const v = o[t + 2];
    const w = t + 3;
    let x = -1;
    let y = "";
    if (v === 1) {
      if (p < w + 4) {
        return {
          status: "need_more",
        };
      }
      y = o[w] + "." + o[w + 1] + "." + o[w + 2] + "." + o[w + 3];
      x = w + 4;
    } else if (v === 2) {
      if (p < w + 1) {
        return {
          status: "need_more",
        };
      }
      const z = o[w];
      if (p < w + 1 + z) {
        return {
          status: "need_more",
        };
      }
      y = g.decode(o.subarray(w + 1, w + 1 + z));
      x = w + 1 + z;
    } else if (v === 3) {
      if (p < w + 16) {
        return {
          status: "need_more",
        };
      }
      const A = [];
      for (let B = 0; B < 8; B++) {
        const C = w + B * 2;
        A.push(((o[C] << 8) | o[C + 1]).toString(16));
      }
      y = A.join(":");
      x = w + 16;
    } else {
      return {
        status: "invalid",
      };
    }
    if (!y) {
      return {
        status: "invalid",
      };
    }
    return {
      status: "ok",
      result: {
        protocol: "vless",
        hostname: y,
        port: u,
        isUDP: s === 2,
        rawData: o.subarray(x),
        respHeader: new Uint8Array([o[0], 0]),
      },
    };
  };
  const i = (o) => {
    const p = sha224(f);
    const q = new TextEncoder().encode(p);
    const r = o.byteLength;
    if (r < 58) {
      return {
        status: "need_more",
      };
    }
    if (o[56] !== 13 || o[57] !== 10) {
      return {
        status: "invalid",
      };
    }
    for (let A = 0; A < 56; A++) {
      if (o[A] !== q[A]) {
        return {
          status: "invalid",
        };
      }
    }
    const s = 58;
    if (r < s + 2) {
      return {
        status: "need_more",
      };
    }
    const t = o[s];
    if (t !== 1 && t !== 3) {
      return {
        status: "invalid",
      };
    }
    const u = t === 3;
    const v = o[s + 1];
    let w = s + 2;
    let x = "";
    if (v === 1) {
      if (r < w + 4) {
        return {
          status: "need_more",
        };
      }
      x = o[w] + "." + o[w + 1] + "." + o[w + 2] + "." + o[w + 3];
      w += 4;
    } else if (v === 3) {
      if (r < w + 1) {
        return {
          status: "need_more",
        };
      }
      const B = o[w];
      if (r < w + 1 + B) {
        return {
          status: "need_more",
        };
      }
      x = g.decode(o.subarray(w + 1, w + 1 + B));
      w += 1 + B;
    } else if (v === 4) {
      if (r < w + 16) {
        return {
          status: "need_more",
        };
      }
      const C = [];
      for (let D = 0; D < 8; D++) {
        const E = w + D * 2;
        C.push(((o[E] << 8) | o[E + 1]).toString(16));
      }
      x = C.join(":");
      w += 16;
    } else {
      return {
        status: "invalid",
      };
    }
    if (!x) {
      return {
        status: "invalid",
      };
    }
    if (r < w + 4) {
      return {
        status: "need_more",
      };
    }
    const y = (o[w] << 8) | o[w + 1];
    if (o[w + 2] !== 13 || o[w + 3] !== 10) {
      return {
        status: "invalid",
      };
    }
    const z = w + 4;
    return {
      status: "ok",
      result: {
        protocol: "trojan",
        hostname: x,
        port: y,
        isUDP: u,
        rawData: o.subarray(z),
        respHeader: null,
      },
    };
  };
  let j = new Uint8Array(1024);
  let k = 0;
  while (true) {
    const { value: o, done: p } = await c.read();
    if (p) {
      if (k === 0) {
        return null;
      }
      break;
    }
    const q = o instanceof Uint8Array ? o : new Uint8Array(o);
    if (k + q.byteLength > j.byteLength) {
      const u = new Uint8Array(Math.max(j.byteLength * 2, k + q.byteLength));
      u.set(j.subarray(0, k));
      j = u;
    }
    j.set(q, k);
    k += q.byteLength;
    const r = j.subarray(0, k);
    const s = i(r);
    if (s.status === "ok") {
      return {
        ...s.result,
        reader: c,
      };
    }
    const t = h(r);
    if (t.status === "ok") {
      return {
        ...t.result,
        reader: c,
      };
    }
    if (s.status === "invalid" && t.status === "invalid") {
      return null;
    }
  }
  const l = j.subarray(0, k);
  const m = i(l);
  if (m.status === "ok") {
    return {
      ...m.result,
      reader: c,
    };
  }
  const n = h(l);
  if (n.status === "ok") {
    return {
      ...n.result,
      reader: c,
    };
  }
  return null;
}
async function handleGrpcRequest(c, f, g, h) {
  if (!c.body) {
    return new Response("Bad Request", {
      status: 400,
    });
  }
  const i = c.body.getReader();
  const j = {
    socket: null,
    connectingPromise: null,
    retryConnect: null,
  };
  const k = {
    up: 0,
    down: 0,
  };
  let l = false;
  const m = {
    cache: new Uint8Array(0),
  };
  let n = null;
  let o = null;
  let p = null;
  let q = null;
  const r = new Headers({
    "Content-Type": "application/grpc",
    "grpc-status": "0",
    "X-Accel-Buffering": "no",
    "Cache-Control": "no-store",
  });
  const s = downstreamGrainChunkBytes;
  const t = Math.max(downstreamGrainSilentMs, 1);
  return new Response(
    new ReadableStream({
      async start(u) {
        let v = false;
        let w = [];
        let x = 0;
        let y = null;
        let z = false;
        const A = {
          readyState: WebSocket.OPEN,
          send(H) {
            if (v) {
              return;
            }
            const I = H instanceof Uint8Array ? H : new Uint8Array(H);
            k.down += I.byteLength;
            const J = [];
            let K = I.byteLength >>> 0;
            while (K > 127) {
              J.push((K & 127) | 128);
              K >>>= 7;
            }
            J.push(K);
            const L = new Uint8Array(J);
            const M = 1 + L.length + I.byteLength;
            const N = new Uint8Array(5 + M);
            N[0] = 0;
            N[1] = (M >>> 24) & 255;
            N[2] = (M >>> 16) & 255;
            N[3] = (M >>> 8) & 255;
            N[4] = M & 255;
            N[5] = 10;
            N.set(L, 6);
            N.set(I, 6 + L.length);
            w.push(N);
            x += N.byteLength;
            C();
          },
          close() {
            if (this.readyState === WebSocket.CLOSED) {
              return;
            }
            B(true);
            v = true;
            this.readyState = WebSocket.CLOSED;
            try {
              u.close();
            } catch (H) {}
          },
        };
        const B = (H = false) => {
          z = false;
          if (y) {
            clearTimeout(y);
            y = null;
          }
          if ((!H && v) || x === 0) {
            return;
          }
          const I = new Uint8Array(x);
          let J = 0;
          for (const K of w) {
            I.set(K, J);
            J += K.byteLength;
          }
          w = [];
          x = 0;
          try {
            u.enqueue(I);
          } catch (L) {
            v = true;
            A.readyState = WebSocket.CLOSED;
          }
        };
        const C = () => {
          if (x >= s) {
            B();
            return;
          }
          if (z || y) {
            return;
          }
          z = true;
          queueMicrotask(() => {
            z = false;
            if (v || x === 0 || y) {
              return;
            }
            y = setTimeout(B, t);
          });
        };
        const D = () => {
          if (v) {
            return;
          }
          q?.clear();
          B(true);
          v = true;
          A.readyState = WebSocket.CLOSED;
          if (y) {
            clearTimeout(y);
          }
          if (p) {
            try {
              p.releaseLock();
            } catch (H) {}
            p = null;
          }
          o = null;
          try {
            i.releaseLock();
          } catch (I) {}
          try {
            j.socket?.close();
          } catch (J) {}
          try {
            u.close();
          } catch (K) {}
        };
        const E = () => {
          if (p) {
            try {
              p.releaseLock();
            } catch (H) {}
            p = null;
          }
          o = null;
        };
        const F = (q = createUpstreamWriteQueue({
          getWriter: () => {
            const H = j.socket;
            if (!H) {
              return null;
            }
            if (H !== o) {
              E();
              o = H;
              p = H.writable.getWriter();
            }
            return p;
          },
          releaseWriter: E,
          retryConnection: async () => {
            if (typeof j.retryConnect !== "function") {
              throw new Error("retry unavailable");
            }
            await j.retryConnect();
          },
          closeConnection: D,
          name: "gRPCupstream",
        }));
        const G = async (H, I = true) => {
          return F.writeAndWait(H, I);
        };
        try {
          let H = new Uint8Array(0);
          while (true) {
            const { done: I, value: J } = await i.read();
            if (I) {
              break;
            }
            if (!J || J.byteLength === 0) {
              continue;
            }
            const K = J instanceof Uint8Array ? J : new Uint8Array(J);
            const L = new Uint8Array(H.length + K.length);
            L.set(H, 0);
            L.set(K, H.length);
            H = L;
            while (H.byteLength >= 5) {
              const M =
                ((H[1] << 24) >>> 0) | (H[2] << 16) | (H[3] << 8) | H[4];
              const N = 5 + M;
              if (H.byteLength < N) {
                break;
              }
              const O = H.subarray(5, N);
              H = H.slice(N);
              if (!O.byteLength) {
                continue;
              }
              let P = O;
              if (P.byteLength >= 2 && P[0] === 10) {
                let Q = 0;
                let R = 1;
                let S = false;
                while (R < P.length) {
                  const T = P[R++];
                  if ((T & 128) === 0) {
                    S = true;
                    break;
                  }
                  Q += 7;
                  if (Q > 35) {
                    break;
                  }
                }
                if (S) {
                  P = P.subarray(R);
                }
              }
              if (!P.byteLength) {
                continue;
              }
              if (l) {
                if (n) {
                  await forwardTrojanUdpData(P, A, m, c);
                } else {
                  await forwardataudp(P, A, null, c);
                }
                continue;
              }
              if (j.socket) {
                k.up += P.byteLength;
                if (!(await G(P))) {
                  throw new Error("Remote socket is not ready");
                }
              } else {
                const U = dataToUint8Array(P);
                if (n === null) {
                  n = isTrojanFirstPacket(U, f);
                }
                if (n) {
                  const V = parseTrojanRequest(U, f);
                  if (V?.hasError) {
                    throw new Error(V.message || "Invalid trojan request");
                  }
                  const {
                    port: W,
                    hostname: X,
                    rawClientData: Y,
                    isUDP: Z,
                  } = V;
                  log(
                    "[gRPC] trojanFirstPacket: " +
                      X +
                      ":" +
                      W +
                      " | UDP: " +
                      (Z ? "is" : ""),
                  );
                  if (isBlockedSite(X)) {
                    throw new Error("Speedtest site is blocked");
                  }
                  if (Z) {
                    l = true;
                    if (validDataLength(Y) > 0) {
                      k.up += validDataLength(Y);
                      await forwardTrojanUdpData(Y, A, m, c);
                    }
                  } else {
                    k.up += validDataLength(Y);
                    await forwardataTCP(X, W, Y, A, null, j, f, c, k);
                  }
                } else {
                  n = false;
                  const a0 = parseVlessRequest(U, f);
                  if (a0?.hasError) {
                    throw new Error(a0.message || "Invalid vless request");
                  }
                  const {
                    port: a1,
                    hostname: a2,
                    version: a3,
                    isUDP: a4,
                    rawClientData: a5,
                  } = a0;
                  log(
                    "[gRPC] vlessFirstPacket: " +
                      a2 +
                      ":" +
                      a1 +
                      " | UDP: " +
                      (a4 ? "is" : ""),
                  );
                  if (isBlockedSite(a2)) {
                    throw new Error("Speedtest site is blocked");
                  }
                  if (a4) {
                    if (a1 !== 53) {
                      throw new Error("UDP is not supported");
                    }
                    l = true;
                  }
                  const a6 = new Uint8Array([a3, 0]);
                  A.send(a6);
                  const a7 = a5;
                  if (l) {
                    if (n) {
                      await forwardTrojanUdpData(a7, A, m, c);
                    } else {
                      await forwardataudp(a7, A, null, c);
                    }
                  } else {
                    k.up += validDataLength(a7);
                    await forwardataTCP(a2, a1, a7, A, null, j, f, c, k);
                  }
                }
              }
            }
            B();
          }
          await F.waitEmpty();
        } catch (a8) {
          log("[gRPCforward] handleFail: " + (a8?.message || a8));
        } finally {
          F.clear();
          E();
          D();
          recordUsage(g, k.up, k.down, h);
        }
      },
      cancel() {
        q?.clear();
        try {
          j.socket?.close();
        } catch (u) {}
        try {
          i.releaseLock();
        } catch (v) {}
      },
    }),
    {
      status: 200,
      headers: r,
    },
  );
}
function isValidWsEarlyData(c, f) {
  if (!c?.byteLength) {
    return false;
  }
  if (c.byteLength >= 18 && UUIDbyteMatch(c, 1, f)) {
    return true;
  }
  if (c.byteLength < 58 || c[56] !== 13 || c[57] !== 10) {
    return false;
  }
  const g = sha224(f);
  for (let h = 0; h < 56; h++) {
    if (c[h] !== g.charCodeAt(h)) {
      return false;
    }
  }
  return true;
}
function decodeWsEarlyData(c, f) {
  if (!c) {
    return null;
  }
  if (c.length > WSearlyDataMaxHeaderLength) {
    throw new Error("early data is too large");
  }
  let g;
  const h = Uint8Array;
  if (typeof h.fromBase64 === "function") {
    try {
      g = h.fromBase64(c, {
        alphabet: "base64url",
      });
    } catch (j) {}
  }
  if (!g) {
    let k = c.replace(/-/g, "+").replace(/_/g, "/");
    const l = k.length % 4;
    if (l) {
      k += "=".repeat(4 - l);
    }
    let m;
    try {
      m = atob(k);
    } catch (n) {
      return null;
    }
    g = new Uint8Array(m.length);
    for (let o = 0; o < m.length; o++) {
      g[o] = m.charCodeAt(o);
    }
  }
  if (g.byteLength > WSearlyDataMaxBytes) {
    throw new Error("early data is too large");
  }
  if (isValidWsEarlyData(g, f)) {
    return g;
  } else {
    return null;
  }
}
async function backendDiagnostic(c, f) {
  const g = {
    ok: false,
    steps: [],
  };
  const i = backendModeConfig(c);
  g.backendMode = i.on;
  g.backendUrl = i.url || "(none)";
  if (!i.on) {
    g.steps.push(
      "Backend mode is OFF (or no valid URL saved). Enable it and Save in Network & IPs.",
    );
    return new Response(JSON.stringify(g, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
  let j = "";
  try {
    const l = new URL(i.url);
    if (l.pathname === "/" || !l.pathname) {
      l.pathname = "/ynsvpn";
    }
    j = l.toString();
  } catch (m) {
    g.steps.push("Backend URL is not a valid URL: " + (m && m.message));
    return new Response(JSON.stringify(g, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  }
  g.targetTried = j;
  const k = Date.now();
  try {
    const n = new Headers();
    n.set("Upgrade", "websocket");
    n.set("Connection", "Upgrade");
    n.set("Sec-WebSocket-Version", "13");
    n.set("Sec-WebSocket-Key", "dGhlIHNhbXBsZSBub25jZQ==");
    const o = await fetch(j, {
      method: "GET",
      headers: n,
      redirect: "manual",
    });
    g.elapsedMs = Date.now() - k;
    g.upstreamStatus = o.status;
    g.gotWebSocket = !!o.webSocket;
    if (o.status === 101 && o.webSocket) {
      g.ok = true;
      g.steps.push(
        "SUCCESS: YNS reached your backend and it upgraded to WebSocket (101). The relay path works. If a client still fails, the issue is client-side (UUID/path/TLS in the link), not the backend.",
      );
      try {
        o.webSocket.accept();
        o.webSocket.close(1000, "diag");
      } catch (p) {}
    } else if (o.status === 101 && !o.webSocket) {
      g.steps.push(
        "Backend returned 101 but the Worker runtime did not expose a WebSocket. This usually means the outbound fetch to a plain http:// IP:port did not establish a real WS through Cloudflare. Fix: put the backend behind TLS (https) on a Cloudflare-friendly port, or use a hostname with a cert.",
      );
    } else {
      let q = "";
      try {
        q = (await o.text()).slice(0, 300);
      } catch (s) {}
      g.upstreamBody = q || "(empty)";
      g.serverHeader = o.headers.get("server") || "";
      if (o.status === 403) {
        let t = false;
        try {
          const u = new URL(j).hostname;
          t = /^\d{1,3}(\.\d{1,3}){3}$/.test(u) || u.includes(":");
        } catch (v) {}
        if (t && g.elapsedMs != null && g.elapsedMs < 50) {
          g.steps.push(
            "403 in " +
              g.elapsedMs +
              "ms to a RAW IP — this is Cloudflare's SSRF sandbox blocking the Worker from fetching a bare IP address. The request never left Cloudflare. FIX: in Cloudflare DNS add an A record (e.g. vps.yourdomain.com -> your VPS IP) set to DNS-ONLY (GRAY cloud, not orange), then change the Backend URL to use that domain instead of the IP. No VPS change needed. This is NOT a firewall/port/UUID/Xray problem.",
          );
          g.fix =
            "Use a gray-cloud (DNS-only) domain in the Backend URL instead of the raw IP.";
        } else {
          g.steps.push(
            "Backend returned 403. Check the path matches Xray wsSettings.path and the Host. If the Backend URL uses a raw IP, switch to a gray-cloud (DNS-only) domain — Cloudflare blocks Workers from fetching bare IPs (SSRF policy).",
          );
        }
      } else {
        g.steps.push(
          "Backend did NOT upgrade. Status " +
            o.status +
            ". Check the path matches Xray wsSettings.path, and that the port is open to the internet.",
        );
      }
    }
  } catch (w) {
    g.elapsedMs = Date.now() - k;
    g.error = w && w.message ? w.message : String(w);
    g.steps.push(
      "YNS could NOT reach the backend at all (fetch threw). Most likely: Cloudflare Workers cannot open an outbound connection to a raw http:// IP on a non-standard port. Fix: front your backend with TLS on 443/8443 (https) via a domain, OR keep it http but on a port Cloudflare allows. See notes below.",
    );
    g.note =
      "Cloudflare Workers can only make outbound connections to a limited set of ports for plain fetch. Ports like 10000 over http may be blocked from the Worker even when open to the public internet. Putting Xray behind TLS on 443/2053/2083/2087/2096/8443 via a (sub)domain is the reliable fix.";
  }
  return new Response(JSON.stringify(g, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
function backendModeConfig(c) {
  const f = networkSettings || {};
  const g =
    (f.backendUrl && String(f.backendUrl).trim()) ||
    (c && c.BACKEND_URL && String(c.BACKEND_URL).trim()) ||
    "";
  const h =
    (f.backendMode === true ||
      (c && (c.ENABLE_BACKEND === "true" || c.ENABLE_BACKEND === true))) &&
    /^https?:\/\//i.test(g);
  return {
    on: h,
    url: g,
  };
}
function isBackendExcludedPath(c, f) {
  const g = (c || "").toLowerCase();
  const h = (f || "").toLowerCase();
  if (g === "dns-query" || g === "doh" || h === "/dns-query" || h === "/doh") {
    return true;
  }
  if (
    g === "login" ||
    g === "bot" ||
    g === "setwebhook" ||
    g === "version" ||
    g === "yns-block" ||
    g === "locations" ||
    g === "robots.txt"
  ) {
    return true;
  }
  if (
    g === "sub" ||
    g.startsWith("sub/") ||
    g === "warp" ||
    g.startsWith("warp/") ||
    g === "install" ||
    g.startsWith("install/")
  ) {
    return true;
  }
  if (g === "admin" || g.startsWith("admin/")) {
    return true;
  }
  return false;
}
function backendTargetUrl(c, f) {
  let g;
  try {
    g = new URL(c);
  } catch (i) {
    return null;
  }
  const h = f && f.pathname ? f.pathname : "";
  if (h && h !== "/") {
    g.pathname = h;
  }
  g.search = (f && f.search) || "";
  return g.toString();
}
async function forwardWsToBackend(c, f, g, h, i, j) {
  const k = backendTargetUrl(i, f);
  if (!k) {
    return new Response("Bad backend URL", {
      status: 500,
    });
  }
  const l = new WebSocketPair();
  const m = l[0];
  const n = l[1];
  try {
    n.accept();
  } catch (w) {}
  const o = new Headers(c.headers);
  o.delete("Host");
  o.delete("Sec-WebSocket-Extensions");
  o.set("Connection", "Upgrade");
  o.set("Upgrade", "websocket");
  let p;
  try {
    p = await fetch(k, {
      method: "GET",
      headers: o,
      redirect: "manual",
    });
  } catch (x) {
    try {
      n.close(1011, "backend unreachable");
    } catch (y) {}
    try {
      m.close(1011, "backend unreachable");
    } catch (z) {}
    return new Response("Backend unreachable: " + ((x && x.message) || x), {
      status: 502,
    });
  }
  if (p.status !== 101 || !p.webSocket) {
    try {
      await p.body?.cancel();
    } catch (A) {}
    try {
      n.close(1011, "no upgrade");
    } catch (B) {}
    try {
      m.close(1011, "no upgrade");
    } catch (C) {}
    return new Response("Backend did not upgrade (status " + p.status + ")", {
      status: 502,
    });
  }
  const q = p.webSocket;
  try {
    q.accept();
  } catch (D) {}
  let r = false;
  const s = {
    up: 0,
    down: 0,
  };
  const t = (E) => {
    try {
      if (E && E.byteLength != null) {
        return E.byteLength;
      } else if (E && E.size != null) {
        return E.size;
      } else {
        return (E && E.length) || 0;
      }
    } catch (F) {
      return 0;
    }
  };
  const u = (E, F) => {
    if (r) {
      return;
    }
    r = true;
    try {
      n.close(E || 1000, F || "done");
    } catch (G) {}
    try {
      q.close(E || 1000, F || "done");
    } catch (H) {}
    try {
      recordUsage(g, s.up, s.down, h);
    } catch (I) {}
    if (j) {
      try {
        recordUserUsage(g, j, s.up, s.down, h);
      } catch (J) {}
    }
  };
  const v = (E, F, G) => {
    if (r) {
      return;
    }
    if (F instanceof Blob) {
      F.arrayBuffer()
        .then((H) => {
          if (r) {
            return;
          }
          try {
            E.send(H);
            if (G) {
              s.up += t(H);
            } else {
              s.down += t(H);
            }
          } catch (I) {
            u(1011, "relay");
          }
        })
        .catch(() => u(1011, "relay"));
      return;
    }
    if (E.readyState !== 1) {
      return;
    }
    try {
      E.send(F);
      if (G) {
        s.up += t(F);
      } else {
        s.down += t(F);
      }
    } catch (H) {
      u(1011, "relay");
    }
  };
  n.addEventListener("message", (E) => v(q, E.data, true));
  q.addEventListener("message", (E) => v(n, E.data, false));
  n.addEventListener("close", (E) => u(E.code, E.reason || "client closed"));
  q.addEventListener("close", (E) => u(E.code, E.reason || "backend closed"));
  n.addEventListener("error", () => u(1011, "client error"));
  q.addEventListener("error", () => u(1011, "backend error"));
  return new Response(null, {
    status: 101,
    webSocket: m,
  });
}
async function forwardHttpToBackend(c, f, g, h) {
  const i = backendTargetUrl(h, f);
  if (!i) {
    return new Response("Bad backend URL", {
      status: 500,
    });
  }
  const j = new Headers();
  for (const [l, m] of c.headers) {
    const n = l.toLowerCase();
    if (n === "host" || n.startsWith("cf-") || n === "x-forwarded-for") {
      continue;
    }
    j.set(l, m);
  }
  try {
    return await fetch(i, {
      method: c.method,
      headers: j,
      body: c.body,
      redirect: "manual",
    });
  } catch (o) {
    return new Response("Backend unreachable: " + ((o && o.message) || o), {
      status: 502,
    });
  }
}
async function handleWsRequest(c, f, g, h, i) {
  if (connRejectReason) {
    return new Response("Forbidden (" + connRejectReason + ")", {
      status: 403,
    });
  }
  const j = connUserId;
  const k = new WebSocketPair();
  const [l, m] = Object.values(k);
  try {
    m.accept({
      allowHalfOpen: true,
    });
  } catch (R) {
    m.accept();
  }
  m.binaryType = "arraybuffer";
  let n = {
    socket: null,
    connectingPromise: null,
    retryConnect: null,
  };
  const o = {
    up: 0,
    down: 0,
  };
  let p = false;
  let q = null;
  const r = {
    cache: new Uint8Array(0),
  };
  const s = c.headers.get("sec-websocket-protocol") || "";
  const t = !!g.searchParams.get("enc");
  let u = null;
  let v = Promise.resolve();
  let w = false;
  let x = false;
  let y = false;
  let z = 0;
  let A = 0;
  let B = null;
  let C = null;
  let D = null;
  let E = null;
  let F = null;
  const G = () => {
    if (D) {
      try {
        D.releaseLock();
      } catch (S) {}
      D = null;
    }
    C = null;
  };
  const H = (u = createUpstreamWriteQueue({
    getWriter: () => {
      const S = n.socket;
      if (!S) {
        return null;
      }
      if (S !== C) {
        G();
        C = S;
        D = S.writable.getWriter();
      }
      return D;
    },
    releaseWriter: G,
    retryConnection: async () => {
      if (typeof n.retryConnect !== "function") {
        throw new Error("retry unavailable");
      }
      await n.retryConnect();
    },
    closeConnection: () => {
      try {
        n.socket?.close();
      } catch (S) {}
      closeSocketQuietly(m);
    },
    name: "WSupstream",
  }));
  const I = async (S, T = true) => {
    return H.writeAndWait(S, T);
  };
  const J = async () => {
    if (E) {
      return E;
    }
    if (!F) {
      F = (async () => {
        const S = (g.searchParams.get("enc") || "").toLowerCase();
        const T =
          SSsupportEncryptionConfig[S] ||
          SSsupportEncryptionConfig["aes-128-gcm"];
        const U = [
          T,
          ...Object.values(SSsupportEncryptionConfig).filter(
            (a6) => a6.method !== T.method,
          ),
        ];
        const V = new Map();
        const W = (a6) => {
          if (!V.has(a6.method)) {
            V.set(a6.method, SSderiveMasterKey(f, a6.keyLen));
          }
          return V.get(a6.method);
        };
        const X = {
          buffer: new Uint8Array(0),
          hasSalt: false,
          waitPayloadLength: null,
          decryptKey: null,
          nonceCounter: new Uint8Array(SSNoncelength),
          encryptionConfig: null,
        };
        const Y = async () => {
          const a6 = 2 + SSAEADtagLength;
          const a7 = Math.max(...U.map((ab) => ab.saltLen));
          const a8 = 16;
          const a9 = Math.min(
            a8,
            Math.max(
              0,
              X.buffer.byteLength -
                (a6 + Math.min(...U.map((ab) => ab.saltLen))),
            ),
          );
          for (let ab = 0; ab <= a9; ab++) {
            for (const ac of U) {
              const ad = ab + ac.saltLen + a6;
              if (X.buffer.byteLength < ad) {
                continue;
              }
              const ae = X.buffer.subarray(ab, ab + ac.saltLen);
              const af = X.buffer.subarray(ab + ac.saltLen, ad);
              const ag = await W(ac);
              const ah = await SSderiveSessionKey(ac, ag, ae, ["decrypt"]);
              const ai = new Uint8Array(SSNoncelength);
              try {
                const aj = await SSAEADdecrypt(ah, ai, af);
                if (aj.byteLength !== 2) {
                  continue;
                }
                const ak = (aj[0] << 8) | aj[1];
                if (ak < 0 || ak > ac.maxChunk) {
                  continue;
                }
                if (ab > 0) {
                  log(
                    "[SSinbound] detectedLeadingNoise " + ab + "B，autoAligned",
                  );
                }
                if (ac.method !== T.method) {
                  log(
                    "[SSinbound] URL enc=" +
                      (S || T.method) +
                      " vsActual " +
                      ac.method +
                      " inconsistent，autoSwitched",
                  );
                }
                X.buffer = X.buffer.subarray(ad);
                X.decryptKey = ah;
                X.nonceCounter = ai;
                X.waitPayloadLength = ak;
                X.encryptionConfig = ac;
                X.hasSalt = true;
                return true;
              } catch (al) {}
            }
          }
          const aa = a7 + a6 + a8;
          if (X.buffer.byteLength >= aa) {
            throw new Error(
              "SS handshake decrypt failed (enc=" +
                (S || "auto") +
                ", candidates=" +
                U.map((am) => am.method).join("/") +
                ")",
            );
          }
          return false;
        };
        const Z = {
          async input(a6) {
            const a7 = dataToUint8Array(a6);
            if (a7.byteLength > 0) {
              X.buffer = concatByteData(X.buffer, a7);
            }
            if (!X.hasSalt) {
              const a9 = await Y();
              if (!a9) {
                return [];
              }
            }
            const a8 = [];
            while (true) {
              if (X.waitPayloadLength === null) {
                const ad = 2 + SSAEADtagLength;
                if (X.buffer.byteLength < ad) {
                  break;
                }
                const ae = X.buffer.subarray(0, ad);
                X.buffer = X.buffer.subarray(ad);
                const af = await SSAEADdecrypt(
                  X.decryptKey,
                  X.nonceCounter,
                  ae,
                );
                if (af.byteLength !== 2) {
                  throw new Error("SS length decrypt failed");
                }
                const ag = (af[0] << 8) | af[1];
                if (ag < 0 || ag > X.encryptionConfig.maxChunk) {
                  throw new Error("SS payload length invalid: " + ag);
                }
                X.waitPayloadLength = ag;
              }
              const aa = X.waitPayloadLength + SSAEADtagLength;
              if (X.buffer.byteLength < aa) {
                break;
              }
              const ab = X.buffer.subarray(0, aa);
              X.buffer = X.buffer.subarray(aa);
              const ac = await SSAEADdecrypt(X.decryptKey, X.nonceCounter, ab);
              a8.push(ac);
              X.waitPayloadLength = null;
            }
            return a8;
          },
        };
        let a0 = null;
        const a1 = 32768;
        const a2 = async () => {
          if (a0) {
            return a0;
          }
          if (!X.encryptionConfig) {
            throw new Error("SS cipher is not negotiated");
          }
          const a6 = X.encryptionConfig;
          const a7 = await SSderiveMasterKey(f, a6.keyLen);
          const a8 = crypto.getRandomValues(new Uint8Array(a6.saltLen));
          const a9 = await SSderiveSessionKey(a6, a7, a8, ["encrypt"]);
          const aa = new Uint8Array(SSNoncelength);
          let ab = false;
          a0 = {
            async encryptAndSend(ac, ad) {
              const ae = dataToUint8Array(ac);
              if (!ab) {
                await ad(a8);
                ab = true;
              }
              if (ae.byteLength === 0) {
                return;
              }
              let af = 0;
              while (af < ae.byteLength) {
                const ag = Math.min(af + a6.maxChunk, ae.byteLength);
                const ah = ae.subarray(af, ag);
                const ai = new Uint8Array(2);
                ai[0] = (ah.byteLength >>> 8) & 255;
                ai[1] = ah.byteLength & 255;
                const aj = await SSAEADencryption(a9, aa, ai);
                const ak = await SSAEADencryption(a9, aa, ah);
                const al = new Uint8Array(aj.byteLength + ak.byteLength);
                al.set(aj, 0);
                al.set(ak, aj.byteLength);
                await ad(al);
                af = ag;
              }
            },
          };
          return a0;
        };
        let a3 = Promise.resolve();
        const a4 = (a6) => {
          a3 = a3
            .then(async () => {
              if (m.readyState !== WebSocket.OPEN) {
                return;
              }
              const a7 = await a2();
              await a7.encryptAndSend(a6, async (a8) => {
                if (a8.byteLength > 0 && m.readyState === WebSocket.OPEN) {
                  await WebSocketsendAndWait(m, a8.buffer);
                }
              });
            })
            .catch((a7) => {
              log("[SSsend] encryptionFail: " + (a7?.message || a7));
              closeSocketQuietly(m);
            });
          return a3;
        };
        const a5 = {
          get readyState() {
            return m.readyState;
          },
          send(a6) {
            const a7 = dataToUint8Array(a6);
            o.down += a7.byteLength;
            if (a7.byteLength <= a1) {
              return a4(a7);
            }
            for (let a8 = 0; a8 < a7.byteLength; a8 += a1) {
              a4(a7.subarray(a8, Math.min(a8 + a1, a7.byteLength)));
            }
            return a3;
          },
          close() {
            closeSocketQuietly(m);
          },
        };
        E = {
          inboundDecryptor: Z,
          replyChunkSocket: a5,
          firstPacketEstablished: false,
          targetHost: "",
          targetPort: 0,
        };
        return E;
      })().finally(() => {
        F = null;
      });
    }
    return F;
  };
  const K = async (S) => {
    const T = await J();
    let U = null;
    try {
      U = await T.inboundDecryptor.input(S);
    } catch (V) {
      const W = V?.message || "" + V;
      if (
        W.includes("Decryption failed") ||
        W.includes("SS handshake decrypt failed") ||
        W.includes("SS length decrypt failed")
      ) {
        log("[SSinbound] decryptFail，connectionClose: " + W);
        closeSocketQuietly(m);
        return;
      }
      throw V;
    }
    for (const X of U) {
      let Y = false;
      try {
        Y = await I(X, false);
      } catch (a5) {
        if (a5?.isQueueOverflow) {
          throw a5;
        }
        Y = false;
      }
      if (Y) {
        continue;
      }
      if (T.firstPacketEstablished && T.targetHost && T.targetPort > 0) {
        o.up += validDataLength(X);
        await forwardataTCP(
          T.targetHost,
          T.targetPort,
          X,
          T.replyChunkSocket,
          null,
          n,
          f,
          c,
          o,
        );
        continue;
      }
      const Z = dataToUint8Array(X);
      if (Z.byteLength < 3) {
        throw new Error("invalid ss data");
      }
      const a0 = Z[0];
      let a1 = 1;
      let a2 = "";
      if (a0 === 1) {
        if (Z.byteLength < a1 + 4 + 2) {
          throw new Error("invalid ss ipv4 length");
        }
        a2 = Z[a1] + "." + Z[a1 + 1] + "." + Z[a1 + 2] + "." + Z[a1 + 3];
        a1 += 4;
      } else if (a0 === 3) {
        if (Z.byteLength < a1 + 1) {
          throw new Error("invalid ss domain length");
        }
        const a6 = Z[a1];
        a1 += 1;
        if (Z.byteLength < a1 + a6 + 2) {
          throw new Error("invalid ss domain data");
        }
        a2 = SStextDecode.decode(Z.subarray(a1, a1 + a6));
        a1 += a6;
      } else if (a0 === 4) {
        if (Z.byteLength < a1 + 16 + 2) {
          throw new Error("invalid ss ipv6 length");
        }
        const a7 = [];
        const a8 = new DataView(Z.buffer, Z.byteOffset + a1, 16);
        for (let a9 = 0; a9 < 8; a9++) {
          a7.push(a8.getUint16(a9 * 2).toString(16));
        }
        a2 = a7.join(":");
        a1 += 16;
      } else {
        throw new Error("invalid ss addressType: " + a0);
      }
      if (!a2) {
        throw new Error("invalid ss address: " + a0);
      }
      const a3 = (Z[a1] << 8) | Z[a1 + 1];
      a1 += 2;
      const a4 = Z.subarray(a1);
      if (isBlockedSite(a2)) {
        throw new Error("Speedtest site is blocked");
      }
      T.firstPacketEstablished = true;
      T.targetHost = a2;
      T.targetPort = a3;
      o.up += validDataLength(a4);
      await forwardataTCP(a2, a3, a4, T.replyChunkSocket, null, n, f, c, o);
    }
  };
  const L = async (S) => {
    let T = null;
    if (p) {
      if (q) {
        return await forwardTrojanUdpData(S, m, r, c);
      }
      return await forwardataudp(S, m, null, c);
    }
    if (B === "ss") {
      await K(S);
      return;
    }
    if (await I(S)) {
      o.up += validDataLength(S);
      return;
    }
    if (B === null) {
      if (g.searchParams.get("enc")) {
        B = "ss";
      } else {
        T = T || dataToUint8Array(S);
        const U = T;
        B = isTrojanFirstPacket(U, f) ? "trojan" : "vless";
      }
      q = B === "trojan";
      log(
        "[WSforward] protocolType: " +
          B +
          " | from: " +
          g.host +
          " | UA: " +
          (c.headers.get("user-agent") || "unknown"),
      );
    }
    if (B === "ss") {
      await K(S);
      return;
    }
    if (await I(S)) {
      o.up += validDataLength(S);
      return;
    }
    if (B === "trojan") {
      const V = parseTrojanRequest(S, f);
      if (V?.hasError) {
        throw new Error(V.message || "Invalid trojan request");
      }
      const { port: W, hostname: X, rawClientData: Y, isUDP: Z } = V;
      if (isBlockedSite(X)) {
        throw new Error("Speedtest site is blocked");
      }
      if (Z) {
        p = true;
        if (validDataLength(Y) > 0) {
          o.up += validDataLength(Y);
          return forwardTrojanUdpData(Y, m, r, c);
        }
        return;
      }
      o.up += validDataLength(Y);
      await forwardataTCP(X, W, Y, m, null, n, f, c, o);
    } else {
      q = false;
      T = T || dataToUint8Array(S);
      const a0 = T;
      const a1 = parseVlessRequest(a0, f);
      if (a1?.hasError) {
        throw new Error(a1.message || "Invalid vless request");
      }
      const {
        port: a2,
        hostname: a3,
        version: a4,
        isUDP: a5,
        rawClientData: a6,
      } = a1;
      if (isBlockedSite(a3)) {
        throw new Error("Speedtest site is blocked");
      }
      if (a5) {
        if (a2 === 53) {
          p = true;
        } else {
          throw new Error("UDP is not supported");
        }
      }
      const a7 = new Uint8Array([a4, 0]);
      const a8 = a6;
      if (p) {
        if (q) {
          o.up += validDataLength(a8);
          return forwardTrojanUdpData(a8, m, r, c);
        }
        o.up += validDataLength(a8);
        return forwardataudp(a8, m, a7, c);
      }
      o.up += validDataLength(a8);
      await forwardataTCP(a3, a2, a8, m, a7, n, f, c, o);
    }
  };
  const M = (S) => {
    if (x) {
      return;
    }
    x = true;
    w = true;
    z = 0;
    A = 0;
    const T = S?.message || "" + S;
    if (
      T.includes("Network connection lost") ||
      T.includes("ReadableStream is closed")
    ) {
      log("[WSforward] connectionEnd: " + T);
    } else {
      log("[WSforward] handleFail: " + T);
    }
    H.clear();
    G();
    closeSocketQuietly(m);
  };
  const N = (S) => {
    v = v.then(S).catch(M);
    return v;
  };
  const O = (S) => {
    if (w || x) {
      return;
    }
    const T = Math.max(0, validDataLength(S));
    const U = z + T;
    const V = A + 1;
    if (U > upstreamQueueMaxBytes || V > upstreamQueueMaxItems) {
      M(new Error("[WSexplicitTransport] queueOverflow: " + U + "B/" + V));
      return;
    }
    z = U;
    A = V;
    N(async () => {
      z = Math.max(0, z - T);
      A = Math.max(0, A - 1);
      if (x) {
        return;
      }
      await L(S);
    });
  };
  const P = () => {
    if (y) {
      return;
    }
    y = true;
    w = true;
    N(async () => {
      if (x) {
        return;
      }
      await H.waitEmpty();
      G();
    });
  };
  m.addEventListener("message", (S) => {
    O(S.data);
  });
  const Q = () => {
    recordUsage(h, o.up, o.down, i);
    if (j) {
      recordUserUsage(h, j, o.up, o.down, i);
    }
  };
  m.addEventListener("close", () => {
    closeSocketQuietly(m);
    P();
    Q();
  });
  m.addEventListener("error", (S) => {
    M(S);
    Q();
  });
  if (!t && s) {
    try {
      const S = decodeWsEarlyData(s, f);
      if (S?.byteLength) {
        O(S.buffer);
      }
    } catch (T) {
      M(T);
    }
  }
  return new Response(null, {
    status: 101,
    webSocket: l,
    headers: {
      "Sec-WebSocket-Extensions": "",
    },
  });
}
function isTrojanFirstPacket(c, f) {
  if (!c || c.byteLength < 58 || c[56] !== 13 || c[57] !== 10) {
    return false;
  }
  const g = sha224(f);
  for (let h = 0; h < 56; h++) {
    if (c[h] !== g.charCodeAt(h)) {
      return false;
    }
  }
  return true;
}
const trojanTextDecoder = new TextDecoder();
function parseTrojanRequest(c, f) {
  const g = dataToUint8Array(c);
  const h = sha224(f);
  if (g.byteLength < 58) {
    return {
      hasError: true,
      message: "invalid data",
    };
  }
  let j = 56;
  if (g[j] !== 13 || g[j + 1] !== 10) {
    return {
      hasError: true,
      message: "invalid header format",
    };
  }
  for (let t = 0; t < j; t++) {
    if (g[t] !== h.charCodeAt(t)) {
      return {
        hasError: true,
        message: "invalid password",
      };
    }
  }
  const k = j + 2;
  if (g.byteLength < k + 6) {
    return {
      hasError: true,
      message: "invalid S5 request data",
    };
  }
  const l = g[k];
  if (l !== 1 && l !== 3) {
    return {
      hasError: true,
      message: "unsupported command, only TCP/UDP is allowed",
    };
  }
  const m = l === 3;
  const n = g[k + 1];
  let o = 0;
  let p = k + 2;
  let q = "";
  switch (n) {
    case 1:
      o = 4;
      if (g.byteLength < p + o + 4) {
        return {
          hasError: true,
          message: "invalid S5 request data",
        };
      }
      q = g[p] + "." + g[p + 1] + "." + g[p + 2] + "." + g[p + 3];
      break;
    case 3:
      if (g.byteLength < p + 1) {
        return {
          hasError: true,
          message: "invalid S5 request data",
        };
      }
      o = g[p];
      p += 1;
      if (g.byteLength < p + o + 4) {
        return {
          hasError: true,
          message: "invalid S5 request data",
        };
      }
      q = trojanTextDecoder.decode(g.subarray(p, p + o));
      break;
    case 4:
      o = 16;
      if (g.byteLength < p + o + 4) {
        return {
          hasError: true,
          message: "invalid S5 request data",
        };
      }
      const u = [];
      for (let v = 0; v < 8; v++) {
        const w = p + v * 2;
        u.push(((g[w] << 8) | g[w + 1]).toString(16));
      }
      q = u.join(":");
      break;
    default:
      return {
        hasError: true,
        message: "invalid addressType is " + n,
      };
  }
  if (!q) {
    return {
      hasError: true,
      message: "address is empty, addressType is " + n,
    };
  }
  const r = p + o;
  if (g.byteLength < r + 4) {
    return {
      hasError: true,
      message: "invalid S5 request data",
    };
  }
  const s = (g[r] << 8) | g[r + 1];
  return {
    hasError: false,
    addressType: n,
    port: s,
    hostname: q,
    isUDP: m,
    rawClientData: g.subarray(r + 4),
  };
}
const UUIDbytesCache = new Map();
const VLESStextDecode = new TextDecoder();
function readHexNibble(c) {
  if (c >= 48 && c <= 57) {
    return c - 48;
  }
  c |= 32;
  if (c >= 97 && c <= 102) {
    return c - 87;
  }
  return -1;
}
function getUuidBytes(c) {
  const f = String(c || "");
  let g = UUIDbytesCache.get(f);
  if (g) {
    return g;
  }
  const h = f.replace(/-/g, "");
  if (h.length !== 32) {
    return null;
  }
  const j = new Uint8Array(16);
  for (let k = 0; k < 16; k++) {
    const l = readHexNibble(h.charCodeAt(k * 2));
    const m = readHexNibble(h.charCodeAt(k * 2 + 1));
    if (l < 0 || m < 0) {
      return null;
    }
    j[k] = (l << 4) | m;
  }
  if (UUIDbytesCache.size >= 32) {
    UUIDbytesCache.clear();
  }
  UUIDbytesCache.set(f, j);
  return j;
}
function UUIDbyteMatch(c, f, g) {
  const h = getUuidBytes(g);
  if (!h || c.byteLength < f + 16) {
    return false;
  }
  for (let j = 0; j < 16; j++) {
    if (c[f + j] !== h[j]) {
      return false;
    }
  }
  return true;
}
function parseVlessRequest(c, f) {
  const g = dataToUint8Array(c);
  const h = g.byteLength;
  if (h < 24) {
    return {
      hasError: true,
      message: "Invalid data",
    };
  }
  const j = g[0];
  if (!UUIDbyteMatch(g, 1, f)) {
    return {
      hasError: true,
      message: "Invalid uuid",
    };
  }
  const k = g[17];
  const l = 18 + k;
  if (h < l + 4) {
    return {
      hasError: true,
      message: "Invalid data",
    };
  }
  const m = g[l];
  let n = false;
  if (m === 1) {
  } else if (m === 2) {
    n = true;
  } else {
    return {
      hasError: true,
      message: "Invalid command",
    };
  }
  const o = l + 1;
  const p = (g[o] << 8) | g[o + 1];
  let q = o + 3;
  let r = 0;
  let s = "";
  const t = g[o + 2];
  switch (t) {
    case 1:
      r = 4;
      if (h < q + r) {
        return {
          hasError: true,
          message: "Invalid IPv4 address length",
        };
      }
      s = g[q] + "." + g[q + 1] + "." + g[q + 2] + "." + g[q + 3];
      break;
    case 2:
      if (h < q + 1) {
        return {
          hasError: true,
          message: "Invalid domain length",
        };
      }
      r = g[q];
      q += 1;
      if (h < q + r) {
        return {
          hasError: true,
          message: "Invalid domain data",
        };
      }
      s = VLESStextDecode.decode(g.subarray(q, q + r));
      break;
    case 3:
      r = 16;
      if (h < q + r) {
        return {
          hasError: true,
          message: "Invalid IPv6 address length",
        };
      }
      const v = [];
      for (let w = 0; w < 8; w++) {
        const x = q + w * 2;
        v.push(((g[x] << 8) | g[x + 1]).toString(16));
      }
      s = v.join(":");
      break;
    default:
      return {
        hasError: true,
        message: "Invalid address type: " + t,
      };
  }
  if (!s) {
    return {
      hasError: true,
      message: "Invalid address: " + t,
    };
  }
  const u = q + r;
  return {
    hasError: false,
    addressType: t,
    port: p,
    hostname: s,
    isUDP: n,
    rawClientData: g.subarray(u),
    version: j,
  };
}
const SSsupportEncryptionConfig = {
  "aes-128-gcm": {
    method: "aes-128-gcm",
    keyLen: 16,
    saltLen: 16,
    maxChunk: 16383,
    aesLength: 128,
  },
  "aes-256-gcm": {
    method: "aes-256-gcm",
    keyLen: 32,
    saltLen: 32,
    maxChunk: 16383,
    aesLength: 256,
  },
};
const SSAEADtagLength = 16;
const SSNoncelength = 12;
const SSsubkeyInfo = new TextEncoder().encode("ss-subkey");
const SStextEncoder = new TextEncoder();
const SStextDecode = new TextDecoder();
const SSmasterKeyCache = new Map();
function dataToUint8Array(c) {
  if (c instanceof Uint8Array) {
    return c;
  }
  if (c instanceof ArrayBuffer) {
    return new Uint8Array(c);
  }
  if (ArrayBuffer.isView(c)) {
    return new Uint8Array(c.buffer, c.byteOffset, c.byteLength);
  }
  return new Uint8Array(c || 0);
}
function concatByteData(...f) {
  if (!f || f.length === 0) {
    return new Uint8Array(0);
  }
  const g = f.map(dataToUint8Array);
  const h = g.reduce((k, l) => k + l.byteLength, 0);
  const i = new Uint8Array(h);
  let j = 0;
  for (const k of g) {
    i.set(k, j);
    j += k.byteLength;
  }
  return i;
}
async function forwardTrojanUdpData(c, f, g, h) {
  const i = dataToUint8Array(c);
  const j = g?.cache instanceof Uint8Array ? g.cache : new Uint8Array(0);
  const k = j.byteLength ? concatByteData(j, i) : i;
  let l = 0;
  while (l < k.byteLength) {
    const m = l;
    const n = k[l];
    let o = l + 1;
    let p = 0;
    if (n === 1) {
      p = 4;
    } else if (n === 4) {
      p = 16;
    } else if (n === 3) {
      if (k.byteLength < o + 1) {
        break;
      }
      p = 1 + k[o];
    } else {
      throw new Error("invalid trojan udp addressType: " + n);
    }
    const q = o + p;
    if (k.byteLength < q + 6) {
      break;
    }
    const r = (k[q] << 8) | k[q + 1];
    const s = (k[q + 2] << 8) | k[q + 3];
    if (k[q + 4] !== 13 || k[q + 5] !== 10) {
      throw new Error("invalid trojan udp delimiter");
    }
    const t = q + 6;
    const u = t + s;
    if (k.byteLength < u) {
      break;
    }
    const v = k.slice(m, q + 2);
    const w = k.slice(t, u);
    l = u;
    if (r !== 53) {
      throw new Error("UDP is not supported");
    }
    if (!w.byteLength) {
      continue;
    }
    let x = w;
    if (w.byteLength < 2 || ((w[0] << 8) | w[1]) !== w.byteLength - 2) {
      x = new Uint8Array(w.byteLength + 2);
      x[0] = (w.byteLength >>> 8) & 255;
      x[1] = w.byteLength & 255;
      x.set(w, 2);
    }
    const y = {
      cache: new Uint8Array(0),
    };
    await forwardataudp(x, f, null, h, (z) => {
      const A = dataToUint8Array(z);
      const B = y.cache.byteLength ? concatByteData(y.cache, A) : A;
      const C = [];
      let D = 0;
      while (D + 2 <= B.byteLength) {
        const E = (B[D] << 8) | B[D + 1];
        const F = D + 2;
        const G = F + E;
        if (G > B.byteLength) {
          break;
        }
        const H = B.slice(F, G);
        const I = new Uint8Array(v.byteLength + 4 + H.byteLength);
        I.set(v, 0);
        I[v.byteLength] = (H.byteLength >>> 8) & 255;
        I[v.byteLength + 1] = H.byteLength & 255;
        I[v.byteLength + 2] = 13;
        I[v.byteLength + 3] = 10;
        I.set(H, v.byteLength + 4);
        C.push(I);
        D = G;
      }
      y.cache = B.slice(D);
      if (C.length) {
        return C;
      } else {
        return new Uint8Array(0);
      }
    });
  }
  if (g) {
    g.cache = k.slice(l);
  }
}
function SSincrementNonceCounter(c) {
  for (let f = 0; f < c.length; f++) {
    c[f] = (c[f] + 1) & 255;
    if (c[f] !== 0) {
      return;
    }
  }
}
async function SSderiveMasterKey(c, f) {
  const g = f + ":" + c;
  if (SSmasterKeyCache.has(g)) {
    return SSmasterKeyCache.get(g);
  }
  const h = (async () => {
    const i = SStextEncoder.encode(c || "");
    let j = new Uint8Array(0);
    let k = new Uint8Array(0);
    while (k.byteLength < f) {
      const l = new Uint8Array(j.byteLength + i.byteLength);
      l.set(j, 0);
      l.set(i, j.byteLength);
      j = new Uint8Array(await crypto.subtle.digest("MD5", l));
      k = concatByteData(k, j);
    }
    return k.slice(0, f);
  })();
  SSmasterKeyCache.set(g, h);
  try {
    return await h;
  } catch (i) {
    SSmasterKeyCache.delete(g);
    throw i;
  }
}
async function SSderiveSessionKey(c, f, g, h) {
  const i = {
    name: "HMAC",
    hash: "SHA-1",
  };
  const j = await crypto.subtle.importKey("raw", g, i, false, ["sign"]);
  const k = new Uint8Array(await crypto.subtle.sign("HMAC", j, f));
  const l = await crypto.subtle.importKey("raw", k, i, false, ["sign"]);
  const m = new Uint8Array(c.keyLen);
  let n = new Uint8Array(0);
  let o = 0;
  let p = 1;
  while (o < c.keyLen) {
    const q = concatByteData(n, SSsubkeyInfo, new Uint8Array([p]));
    n = new Uint8Array(await crypto.subtle.sign("HMAC", l, q));
    const r = Math.min(n.byteLength, c.keyLen - o);
    m.set(n.subarray(0, r), o);
    o += r;
    p += 1;
  }
  return crypto.subtle.importKey(
    "raw",
    m,
    {
      name: "AES-GCM",
      length: c.aesLength,
    },
    false,
    h,
  );
}
async function SSAEADencryption(c, f, g) {
  const h = f.slice();
  const i = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: h,
      tagLength: 128,
    },
    c,
    g,
  );
  SSincrementNonceCounter(f);
  return new Uint8Array(i);
}
async function SSAEADdecrypt(c, f, g) {
  const h = f.slice();
  const i = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: h,
      tagLength: 128,
    },
    c,
    g,
  );
  SSincrementNonceCounter(f);
  return new Uint8Array(i);
}
function isIPv4Addr(c) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(c);
}
async function resolveAviaDoH(c) {
  try {
    const f = await fetch(
      "https://cloudflare-dns.com/dns-query?name=" +
        encodeURIComponent(c) +
        "&type=A",
      {
        headers: {
          accept: "application/dns-json",
        },
      },
    );
    const g = await f.json();
    const h = (g.Answer || []).filter((i) => i.type === 1).map((i) => i.data);
    if (h.length) {
      return h[Math.floor(Math.random() * h.length)];
    } else {
      return null;
    }
  } catch (i) {
    return null;
  }
}
function makeNat64Address(c, f) {
  const g = String(c)
    .trim()
    .replace(/[\[\]]/g, "")
    .replace(/:+$/, "");
  const h = f.split(".").map((j) => parseInt(j, 10));
  if (h.length !== 4 || h.some((j) => isNaN(j) || j < 0 || j > 255)) {
    return null;
  }
  const i =
    (((h[0] << 8) | h[1]) >>> 0).toString(16).padStart(4, "0") +
    ":" +
    (((h[2] << 8) | h[3]) >>> 0).toString(16).padStart(4, "0");
  return "[" + g + "::" + i + "]";
}
async function getNat64Prefixes() {
  const c = (nat64Config || "").trim();
  if (!c) {
    return [];
  }
  if (/^https?:\/\//i.test(c)) {
    if (
      cachedNat64Prefixes &&
      cachedNat64Src === c &&
      Date.now() - cachedNat64At < 3600000
    ) {
      return cachedNat64Prefixes;
    }
    try {
      const f = await fetch(c, {
        headers: {
          "User-Agent": "YNSProxy",
        },
      });
      const g = await f.text();
      let h = (g.match(/\[([0-9a-fA-F:]+::)\]/g) || []).map((i) =>
        i.replace(/[\[\]]/g, ""),
      );
      if (!h.length) {
        h = g
          .split(/[\n,]+/)
          .map((i) => i.replace(/[\[\]]/g, "").trim())
          .filter((i) => i.includes("::"));
      }
      cachedNat64Prefixes = [...new Set(h)];
      cachedNat64At = Date.now();
      cachedNat64Src = c;
      return cachedNat64Prefixes;
    } catch (i) {
      return cachedNat64Prefixes || [];
    }
  }
  return [
    ...new Set(
      c
        .split(/[\n,]+/)
        .map((j) => j.replace(/[\[\]]/g, "").trim())
        .filter(Boolean),
    ),
  ];
}
async function forwardataTCP(c, f, g, h, i, j, k, l = null, m = null) {
  if (m && m.userId == null && connUserId) {
    m.userId = connUserId;
  }
  log(
    "[TCPforward] target: " +
      c +
      ":" +
      f +
      " | proxyIP: " +
      proxyIP +
      " | proxyFallback: " +
      (enableProxyFallback ? "is" : "") +
      " | proxyType: " +
      (enableSocks5Proxy || "proxyip") +
      " | globalScope: " +
      (enableSocks5GlobalProxy ? "is" : ""),
  );
  const n = 5000;
  let o = false;
  const p = createRequestTcpConnector(l);
  async function q(x, y = n) {
    await Promise.race([
      x.opened,
      new Promise((z, A) =>
        setTimeout(() => A(new Error("connectionTimeout")), y),
      ),
    ]);
  }
  async function r(x, y) {
    const z = p({
      hostname: x,
      port: y,
    });
    try {
      await q(z);
      return z;
    } catch (A) {
      try {
        z?.close?.();
      } catch (B) {}
      throw A;
    }
  }
  async function s(x, y) {
    if (validDataLength(y) <= 0) {
      return;
    }
    const z = x.writable.getWriter();
    try {
      await z.write(dataToUint8Array(y));
    } finally {
      try {
        z.releaseLock();
      } catch (A) {}
    }
  }
  async function t(x) {
    const y = await getNat64Prefixes();
    if (!y.length) {
      return null;
    }
    const z = isIPv4Addr(c) ? c : await resolveAviaDoH(c);
    if (!z) {
      return null;
    }
    for (const A of y.slice(0, 4)) {
      const B = makeNat64Address(A, z);
      if (!B) {
        continue;
      }
      try {
        const C = await r(B, f);
        await s(C, x);
        log("[NAT64] connected via " + B + ":" + f);
        return C;
      } catch (D) {
        log("[NAT64] failed " + B + ": " + (D.message || D));
      }
    }
    return null;
  }
  async function u(x) {
    if (x.length === 1) {
      const A = x[0];
      return {
        socket: await r(A.hostname, A.port),
        candidate: A,
      };
    }
    const y = x.map((B) =>
      r(B.hostname, B.port).then((C) => ({
        socket: C,
        candidate: B,
      })),
    );
    let z = null;
    try {
      z = await Promise.any(y);
      return z;
    } finally {
      if (z) {
        for (const B of y) {
          B.then(({ socket: C }) => {
            if (C !== z.socket) {
              try {
                C?.close?.();
              } catch (D) {}
            }
          }).catch(() => {});
        }
      }
    }
  }
  async function v(x, y, z = null, A = null, B = true) {
    if (A && A.length > 0) {
      for (let C = 0; C < A.length; C += TCPconcurrentDialCount) {
        const D = [];
        for (let G = 0; G < TCPconcurrentDialCount && C + G < A.length; G++) {
          const H = (cachedProxyArrayIndex + C + G) % A.length;
          const [I, J] = A[H];
          D.push({
            hostname: I,
            port: J,
            index: H,
          });
        }
        let E = null;
        let F = null;
        try {
          log(
            "[proxyConnection] concurrentAttempts " +
              D.length +
              " : " +
              D.map((L) => L.hostname + ":" + L.port).join(", "),
          );
          const K = await u(D);
          E = K.socket;
          F = K.candidate;
          await s(E, z);
          log(
            "[proxyConnection] successConnectionTo: " +
              F.hostname +
              ":" +
              F.port +
              " (index: " +
              F.index +
              ")",
          );
          cachedProxyArrayIndex = F.index;
          return E;
        } catch (L) {
          try {
            E?.close?.();
          } catch (M) {}
          log("[proxyConnection] batchConnectFailed: " + (L.message || L));
        }
      }
    }
    if (B) {
      const N = Array.from(
        {
          length: TCPconcurrentDialCount,
        },
        (P, Q) => ({
          hostname: x,
          port: y,
          attempt: Q,
        }),
      );
      log(
        "[TCPdirectConnect] concurrentAttempts " +
          N.length +
          " : " +
          x +
          ":" +
          y,
      );
      let O = null;
      try {
        const P = await u(N);
        O = P.socket;
        await s(O, z);
        return O;
      } catch (Q) {
        try {
          O?.close?.();
        } catch (R) {}
        throw Q;
      }
    } else {
      closeSocketQuietly(h);
      throw new Error(
        "[proxyConnection] allProxyConnectFailed，andNoProxyFallback，connectionTerminated。",
      );
    }
  }
  async function w(x = true) {
    if (j.connectingPromise) {
      await j.connectingPromise;
      return;
    }
    const y = x && !o && validDataLength(g) > 0;
    const z = y ? g : null;
    const A = (async () => {
      let B;
      if (enableSocks5Proxy === "socks5") {
        log("[SOCKS5proxy] proxyTo: " + c + ":" + f);
        B = await socks5Connect(c, f, z, p);
      } else if (enableSocks5Proxy === "http") {
        log("[HTTPproxy] proxyTo: " + c + ":" + f);
        B = await httpConnect(c, f, z, false, p);
      } else if (enableSocks5Proxy === "https") {
        log("[HTTPSproxy] proxyTo: " + c + ":" + f);
        B = isIPHostname(parsedSocks5Address.hostname)
          ? await httpsConnect(c, f, z, p)
          : await httpConnect(c, f, z, true, p);
      } else if (enableSocks5Proxy === "turn") {
        log("[TURNproxy] proxyTo: " + c + ":" + f);
        B = await turnConnect(parsedSocks5Address, c, f, p);
        if (validDataLength(z) > 0) {
          const C = B.writable.getWriter();
          try {
            await C.write(dataToUint8Array(z));
          } finally {
            try {
              C.releaseLock();
            } catch (D) {}
          }
        }
      } else if (enableSocks5Proxy === "sstp") {
        log("[SSTPproxy] proxyTo: " + c + ":" + f);
        B = await sstpConnect(parsedSocks5Address, c, f, p);
        if (validDataLength(z) > 0) {
          const E = B.writable.getWriter();
          try {
            await E.write(dataToUint8Array(z));
          } finally {
            try {
              E.releaseLock();
            } catch (F) {}
          }
        }
      } else {
        log("[proxyConnection] proxyTo: " + c + ":" + f);
        const G = await parseAddressPort(proxyIP, c, k);
        try {
          B = await v("PROXYIP.tp1.090227.xyz", 1, z, G, enableProxyFallback);
        } catch (H) {
          const I = nat64Config ? await t(z) : null;
          if (!I) {
            throw H;
          }
          B = I;
        }
      }
      if (y) {
        o = true;
      }
      j.socket = B;
      B.closed.catch(() => {}).finally(() => closeSocketQuietly(h));
      connectStreams(B, h, i, null, m);
    })();
    j.connectingPromise = A;
    try {
      await A;
    } finally {
      if (j.connectingPromise === A) {
        j.connectingPromise = null;
      }
    }
  }
  j.retryConnect = async () => w(!o);
  if (
    enableSocks5Proxy &&
    (enableSocks5GlobalProxy || hostMatchesProxyList(c))
  ) {
    log("[TCPforward] enable SOCKS5/HTTP/HTTPS/TURN/SSTP globalProxy");
    try {
      await w();
    } catch (x) {
      log(
        "[TCPforward] SOCKS5/HTTP/HTTPS/TURN/SSTP proxyConnectionFail: " +
          x.message,
      );
      throw x;
    }
  } else {
    try {
      log("[TCPforward] attemptDirectTo: " + c + ":" + f);
      const y = await v(c, f, g);
      j.socket = y;
      connectStreams(
        y,
        h,
        i,
        async () => {
          if (j.socket !== y) {
            return;
          }
          await w();
        },
        m,
      );
    } catch (z) {
      log("[TCPforward] directConnect " + c + ":" + f + " fail: " + z.message);
      await w();
    }
  }
}
async function forwardataudp(c, f, g, h, i = null) {
  const j = dataToUint8Array(c);
  const k = j.byteLength;
  log("[UDPforward] received DNS request: " + k + "B -> 8.8.4.4:53");
  try {
    const l = createRequestTcpConnector(h);
    const m = l({
      hostname: "8.8.4.4",
      port: 53,
    });
    let n = g;
    const o = m.writable.getWriter();
    await o.write(j);
    log("[UDPforward] DNS requestWriteUpstream: " + k + "B");
    o.releaseLock();
    await m.readable.pipeTo(
      new WritableStream({
        async write(p) {
          const q = dataToUint8Array(p);
          log("[UDPforward] received DNS response: " + q.byteLength + "B");
          const r = i ? await i(q) : q;
          const s = Array.isArray(r) ? r : [r];
          if (!s.length) {
            return;
          }
          if (f.readyState !== WebSocket.OPEN) {
            return;
          }
          for (const t of s) {
            const u = dataToUint8Array(t);
            if (!u.byteLength) {
              continue;
            }
            if (n) {
              const v = new Uint8Array(n.length + u.byteLength);
              v.set(n, 0);
              v.set(u, n.length);
              await WebSocketsendAndWait(f, v.buffer);
              n = null;
            } else {
              await WebSocketsendAndWait(f, u);
            }
          }
        },
      }),
    );
  } catch (p) {
    log("[UDPforward] DNS forwardFail: " + (p?.message || p));
  }
}
function closeSocketQuietly(c) {
  try {
    if (c.readyState === WebSocket.OPEN || c.readyState === WebSocket.CLOSING) {
      c.close();
    }
  } catch (f) {}
}
function formatIdentifier(c, f = 0) {
  const g = [...c.slice(f, f + 16)]
    .map((h) => h.toString(16).padStart(2, "0"))
    .join("");
  return (
    g.substring(0, 8) +
    "-" +
    g.substring(8, 12) +
    "-" +
    g.substring(12, 16) +
    "-" +
    g.substring(16, 20) +
    "-" +
    g.substring(20)
  );
}
async function WebSocketsendAndWait(c, f) {
  const g = c.send(f);
  if (g && typeof g.then === "function") {
    await g;
  }
}
function resolveSpeedLimitKBps() {
  const c = Number(connSpeedLimitKBps);
  if (isFinite(c) && c > 0) {
    return c;
  }
  const f = networkSettings && Number(networkSettings.speedLimitKBps);
  if (isFinite(f) && f > 0) {
    return f;
  } else {
    return 0;
  }
}
function createRateLimiter(c) {
  const f = typeof c === "number" && c > 0 ? c * 1024 : 0;
  if (!f) {
    return {
      enabled: false,
      take() {
        return Promise.resolve();
      },
    };
  }
  const g = Math.max(f, 65536);
  let h = g;
  let i = Date.now();
  const j = () => {
    const k = Date.now();
    h = Math.min(g, h + ((k - i) / 1000) * f);
    i = k;
  };
  return {
    enabled: true,
    async take(k) {
      k = Math.max(0, k | 0);
      while (true) {
        j();
        if (h >= k || k >= g) {
          h -= Math.min(k, h);
          return;
        }
        const l = Math.min(1000, Math.max(1, Math.ceil(((k - h) / f) * 1000)));
        await new Promise((m) => setTimeout(m, l));
      }
    },
  };
}
const speedBuckets = new Map();
function getSpeedLimiter(c) {
  const f = resolveSpeedLimitKBps();
  if (!(f > 0)) {
    return {
      enabled: false,
      take() {
        return Promise.resolve();
      },
    };
  }
  const g = connUserId ? "u:" + connUserId : "ip:" + (connClientIp || "global");
  const h = g + ":" + c;
  let i = speedBuckets.get(h);
  if (!i || i.kbps !== f) {
    i = {
      limiter: createRateLimiter(f),
      kbps: f,
      at: Date.now(),
    };
    speedBuckets.set(h, i);
  } else {
    i.at = Date.now();
  }
  if (speedBuckets.size > 1024) {
    const j = Date.now() - 300000;
    for (const [l, m] of speedBuckets) {
      if (m.at < j) {
        speedBuckets.delete(l);
      }
    }
  }
  return i.limiter;
}
function createUpstreamWriteQueue({
  getWriter: c,
  releaseWriter: f,
  retryConnection: g,
  closeConnection: h,
  name = "upstreamQueue",
}) {
  let i = [];
  let j = 0;
  let k = 0;
  let l = false;
  let m = false;
  let n = null;
  let o = [];
  let p = null;
  const q = (z, A = null) => {
    if (!z) {
      return;
    }
    for (const B of z) {
      if (A) {
        B.reject(A);
      } else {
        B.resolve();
      }
    }
  };
  const r = (z) => {
    for (let A = j; A < i.length; A++) {
      const B = i[A];
      if (B?.completions) {
        q(B.completions, z);
      }
    }
  };
  const s = () => {
    if (j > 32 && j * 2 >= i.length) {
      i = i.slice(j);
      j = 0;
    }
  };
  const t = () => {
    if (k || l || !o.length) {
      return;
    }
    const z = o;
    o = [];
    for (const A of z) {
      A();
    }
  };
  const u = (z = null) => {
    const A = z || (m ? new Error(name + ": queue closed") : null);
    if (A) {
      r(A);
      q(p, A);
      p = null;
    }
    i = [];
    j = 0;
    k = 0;
    t();
  };
  const v = () => {
    if (j >= i.length) {
      return null;
    }
    const z = i[j];
    i[j++] = undefined;
    k -= z.chunk.byteLength;
    s();
    return z;
  };
  const w = () => {
    const z = v();
    if (!z) {
      return null;
    }
    if (j >= i.length || z.chunk.byteLength >= upstreamBatchTargetBytes) {
      return z;
    }
    let A = z.chunk.byteLength;
    let B = j;
    let C = z.allowRetry;
    let D = z.completions || null;
    while (B < i.length) {
      const G = i[B];
      const H = A + G.chunk.byteLength;
      if (H > upstreamBatchTargetBytes) {
        break;
      }
      A = H;
      C = C && G.allowRetry;
      if (G.completions) {
        D = D ? D.concat(G.completions) : G.completions;
      }
      B++;
    }
    if (B === j) {
      return z;
    }
    const E = (n ||= new Uint8Array(upstreamBatchTargetBytes));
    E.set(z.chunk);
    let F = z.chunk.byteLength;
    while (j < B) {
      const I = i[j];
      i[j++] = undefined;
      k -= I.chunk.byteLength;
      E.set(I.chunk, F);
      F += I.chunk.byteLength;
    }
    s();
    return {
      chunk: E.subarray(0, A),
      allowRetry: C,
      completions: D,
    };
  };
  const x = async () => {
    if (l || m) {
      return;
    }
    l = true;
    try {
      while (true) {
        if (m) {
          break;
        }
        const z = w();
        if (!z) {
          break;
        }
        let A = c();
        if (!A) {
          throw new Error(name + ": remote writer unavailable");
        }
        const B = z.completions || null;
        p = B;
        try {
          try {
            await A.write(z.chunk);
          } catch (C) {
            f?.();
            if (!z.allowRetry || typeof g !== "function") {
              throw C;
            }
            await g();
            A = c();
            if (!A) {
              throw C;
            }
            await A.write(z.chunk);
          }
          q(B);
        } catch (D) {
          q(B, D);
          throw D;
        } finally {
          if (p === B) {
            p = null;
          }
        }
      }
    } catch (E) {
      m = true;
      u(E);
      log("[" + name + "] writeFail: " + (E?.message || E));
      try {
        h?.(E);
      } catch (F) {}
    } finally {
      l = false;
      if (!m && j < i.length) {
        queueMicrotask(x);
      } else {
        t();
      }
    }
  };
  const y = (z, A = true, B = false) => {
    if (m) {
      return false;
    }
    if (!c()) {
      return false;
    }
    const C = dataToUint8Array(z);
    if (!C.byteLength) {
      return true;
    }
    const D = k + C.byteLength;
    const E = i.length - j + 1;
    if (D > upstreamQueueMaxBytes || E > upstreamQueueMaxItems) {
      m = true;
      const H = Object.assign(
        new Error(name + ": upload queue overflow (" + D + "B/" + E + ")"),
        {
          isQueueOverflow: true,
        },
      );
      u(H);
      log("[" + name + "] queueLimitExceeded，closeConnection");
      try {
        h?.(H);
      } catch (I) {}
      throw H;
    }
    let F = null;
    let G = null;
    if (B) {
      G = [];
      F = new Promise((J, K) =>
        G.push({
          resolve: J,
          reject: K,
        }),
      );
    }
    i.push({
      chunk: C,
      allowRetry: A,
      completions: G,
    });
    k = D;
    if (!l) {
      queueMicrotask(x);
    }
    if (B) {
      return F.then(() => true);
    } else {
      return true;
    }
  };
  return {
    write(z, A = true) {
      return y(z, A, false);
    },
    writeAndWait(z, A = true) {
      return y(z, A, true);
    },
    async waitEmpty() {
      if (!k && !l) {
        return;
      }
      await new Promise((z) => o.push(z));
    },
    clear() {
      m = true;
      u();
    },
  };
}
function createDownstreamGrainSender(c, f = null) {
  const g = downstreamGrainChunkBytes;
  const h = downstreamGrainTailThreshold;
  const i = Math.max(4096, h << 3);
  const j = getSpeedLimiter("down");
  let k = f;
  let l = new Uint8Array(g);
  let m = 0;
  let n = null;
  let o = false;
  let p = 0;
  let q = 0;
  let r = 0;
  let s = null;
  const t = async (x) => {
    if (c.readyState !== WebSocket.OPEN) {
      throw new Error("ws.readyState is not open");
    }
    if (j.enabled) {
      await j.take(x.byteLength);
    }
    await WebSocketsendAndWait(c, x);
  };
  const u = (x) => {
    if (!k) {
      return x;
    }
    const y = new Uint8Array(k.length + x.byteLength);
    y.set(k, 0);
    y.set(x, k.length);
    k = null;
    return y;
  };
  const v = async () => {
    while (s) {
      await s;
    }
    if (n) {
      clearTimeout(n);
    }
    n = null;
    o = false;
    if (!m) {
      return;
    }
    const x = l.subarray(0, m).slice();
    l = new Uint8Array(g);
    m = 0;
    r = 0;
    s = t(x).finally(() => {
      s = null;
    });
    return s;
  };
  const w = () => {
    if (n || o) {
      return;
    }
    o = true;
    q = p;
    queueMicrotask(() => {
      o = false;
      if (!m || n) {
        return;
      }
      if (g - m < h) {
        v().catch(() => closeSocketQuietly(c));
        return;
      }
      n = setTimeout(
        () => {
          n = null;
          if (!m) {
            return;
          }
          if (g - m < h) {
            v().catch(() => closeSocketQuietly(c));
            return;
          }
          if (r < 2 && (p !== q || m < i)) {
            r++;
            q = p;
            w();
            return;
          }
          v().catch(() => closeSocketQuietly(c));
        },
        Math.max(downstreamGrainSilentMs, 1),
      );
    });
  };
  return {
    async directSend(x) {
      let y = dataToUint8Array(x);
      if (!y.byteLength) {
        return;
      }
      y = u(y);
      await t(y);
    },
    async send(x) {
      let y = dataToUint8Array(x);
      if (!y.byteLength) {
        return;
      }
      y = u(y);
      let z = 0;
      const A = y.byteLength;
      while (z < A) {
        if (!m && A - z >= g) {
          const C = Math.min(g, A - z);
          const D = z || C !== A ? y.subarray(z, z + C) : y;
          await t(D);
          z += C;
          continue;
        }
        const B = Math.min(g - m, A - z);
        l.set(y.subarray(z, z + B), m);
        m += B;
        z += B;
        p++;
        if (m === g || g - m < h) {
          await v();
        } else {
          w();
        }
      }
    },
    flush: v,
  };
}
async function connectStreams(c, f, g, h, i = null) {
  let j = g;
  let k = false;
  let l;
  let m = false;
  const n = 65536;
  const o = createDownstreamGrainSender(f, j);
  j = null;
  try {
    l = c.readable.getReader({
      mode: "byob",
    });
    m = true;
  } catch (p) {
    l = c.readable.getReader();
  }
  try {
    if (!m) {
      while (true) {
        const { done: q, value: r } = await l.read();
        if (q) {
          break;
        }
        if (!r || r.byteLength === 0) {
          continue;
        }
        k = true;
        if (i) {
          i.down += r.byteLength;
          if (i.userId && isUserQuotaExceededNow(i.userId, i.up + i.down)) {
            throw new Error("quota exceeded");
          }
        }
        await o.send(r);
      }
    } else {
      let s = new ArrayBuffer(n);
      while (true) {
        const { done: t, value: u } = await l.read(new Uint8Array(s, 0, n));
        if (t) {
          break;
        }
        if (!u || u.byteLength === 0) {
          continue;
        }
        k = true;
        if (i) {
          i.down += u.byteLength;
          if (i.userId && isUserQuotaExceededNow(i.userId, i.up + i.down)) {
            throw new Error("quota exceeded");
          }
        }
        if (u.byteLength >= downstreamGrainChunkBytes) {
          await o.flush();
          await o.directSend(u);
          s = new ArrayBuffer(n);
        } else {
          await o.send(u);
          s = u.buffer.byteLength >= n ? u.buffer : new ArrayBuffer(n);
        }
      }
    }
    await o.flush();
  } catch (v) {
    closeSocketQuietly(f);
  } finally {
    try {
      l.cancel();
    } catch (w) {}
    try {
      l.releaseLock();
    } catch (x) {}
  }
  if (!k && h) {
    await h();
  }
}
function isBlockedSite(c) {
  if (isSpeedTestSite(c)) {
    return true;
  }
  if (networkSettings && networkSettings.enablePornBlock) {
    return isAdultDomain(c);
  }
  return false;
}
const SPEEDTEST_DOMAIN = "speed.cloudflare.com";
function isSpeedTestSite(c) {
  return c === SPEEDTEST_DOMAIN || c.endsWith("." + SPEEDTEST_DOMAIN);
}
const IRANIAN_DOMAINS = [
  "ir",
  "ac.ir",
  "co.ir",
  "gov.ir",
  "net.ir",
  "org.ir",
  "sch.ir",
  "app.ir",
  "blog.ir",
  "biz.ir",
  "info.ir",
  "name.ir",
  "web.ir",
  "tk",
  "dl.ir",
  "shatel.ir",
  "mci.ir",
  "irancell.ir",
  "rightel.ir",
  "hamrah.ir",
  "mtnirancell.ir",
  "iranproud.ir",
  "ninisite.ir",
  "divar.ir",
  "sheypoor.ir",
  "torob.ir",
  "digikala.com",
  "digistyle.com",
  "esam.ir",
  "bamilo.com",
  "shaparak.ir",
  "samanecorp.ir",
  "tejaratbank.ir",
  "mellatbank.ir",
  "parsianbank.ir",
  "enbank.ir",
  "bmi.ir",
  "bankmaskan.ir",
  "banksepah.ir",
  "bankeghtesadnovin.ir",
  "ap.ir",
  "mbt.ir",
  "tamin.ir",
  "sso.ir",
  "mfa.ir",
  "president.ir",
  "leader.ir",
  "isna.ir",
  "irna.ir",
  "farsnews.ir",
  "tasnimnews.ir",
  "varzesh3.com",
  "telewebion.ir",
  "iranseda.ir",
  "irib.ir",
  "irinn.ir",
  "jamejamonline.ir",
  "khabaronline.ir",
  "aftabnews.ir",
  "parsine.ir",
  "fararu.ir",
  "roozonline.ir",
  "ensafnews.ir",
  "asriran.ir",
  "tabnak.ir",
  "rajanews.ir",
  "boursenews.ir",
  "isahigh.ir",
  "payvand.ir",
  "irantv.ir",
  "iitv.ir",
  "saham.ir",
  "tse.ir",
  "tsetmc.com",
  "irbr.ir",
  "iran-fava.ir",
  "my.ir",
  "iran.ir",
  "post.ir",
  "mostaghel.ir",
  "dolat.ir",
  "khodro.ir",
  "ikco.ir",
  "saipa.ir",
  "bahman.ir",
  "mapnagroup.com",
  "mrud.ir",
  "iranshahr.ir",
  "isfahan.ir",
  "tehran.ir",
  "mashhad.ir",
  "qom.ir",
  "shiraz.ir",
  "tabriz.ir",
  "karaj.ir",
  "ahvaz.ir",
  "rasht.ir",
  "zanjan.ir",
  "ardabil.ir",
  "kerman.ir",
  "yazd.ir",
  "hamedan.ir",
  "sari.ir",
  "bojnord.ir",
  "birjand.ir",
  "kish.ir",
  "qeshm.ir",
  "arak.ir",
  "orumiyeh.ir",
  "ilam.ir",
  "bushehr.ir",
  "shahrekord.ir",
  "gorgan.ir",
  "sanandaj.ir",
  "kermanshah.ir",
  "khorramabad.ir",
  "arak.ir",
  "sabzevar.ir",
  "neyshabur.ir",
  "kashan.ir",
  "golestan.ir",
  "hormozgan.ir",
  "chaharmahal.ir",
  "sistan.ir",
  "baluchestan.ir",
  "qazvin.ir",
  "semnan.ir",
  "yazd.ir",
  "zanjan.ir",
  "markazi.ir",
  "mazandaran.ir",
  "gilan.ir",
  "kordestan.ir",
  "kermanshah.ir",
  "fars.ir",
  "kerman.ir",
  "sistan.ir",
  "baluchestan.ir",
  "khuzestan.ir",
  "ilam.ir",
  "bushehr.ir",
  "lorestan.ir",
  "hamadan.ir",
  "kurdistan.ir",
  "westazarbaijan.ir",
  "eastazarbaijan.ir",
  "ardabil.ir",
  "zanjan.ir",
  "qazvin.ir",
  "alborz.ir",
  "tehran.ir",
  "semnan.ir",
  "mazandaran.ir",
  "golestan.ir",
  "nkhz.ir",
  "shargh.ir",
  "irvana.ir",
  "iust.ac.ir",
  "aut.ac.ir",
  "sharif.ir",
  "ut.ac.ir",
  "sbu.ac.ir",
  "kntu.ac.ir",
  "modares.ir",
  "znu.ac.ir",
  "tabrizu.ac.ir",
  "umz.ac.ir",
  "guilan.ac.ir",
  "sku.ac.ir",
  "kashanu.ac.ir",
  "sutech.ac.ir",
  "yazd.ac.ir",
  "shirazu.ac.ir",
  "yazduni.ac.ir",
  "alzahra.ac.ir",
  "mazust.ac.ir",
  "nit.ac.ir",
  "iut.ac.ir",
  "cu.ac.ir",
  "pnu.ac.ir",
  "qom.ac.ir",
  "khu.ac.ir",
  "rose.ir",
  "isac.ir",
  "itc.ir",
];
function isIranianDomain(c) {
  if (!c) {
    return false;
  }
  const f = c.toLowerCase();
  for (const g of IRANIAN_DOMAINS) {
    if (f === g || f.endsWith("." + g)) {
      return true;
    }
  }
  return false;
}
const ADULT_DOMAINS = [
  "pornhub.com",
  "www.pornhub.com",
  "xvideos.com",
  "www.xvideos.com",
  "xnxx.com",
  "www.xnxx.com",
  "xhamster.com",
  "www.xhamster.com",
  "redtube.com",
  "www.redtube.com",
  "youporn.com",
  "www.youporn.com",
  "porn.com",
  "www.porn.com",
  "tube8.com",
  "www.tube8.com",
  "xvideos3.com",
  "eporner.com",
  "www.eporner.com",
  "hclips.com",
  "www.hclips.com",
  "hqporner.com",
  "www.hqporner.com",
  "pornhd.com",
  "www.pornhd.com",
  "porn300.com",
  "www.porn300.com",
  "porntrex.com",
  "www.porntrex.com",
  "spankbang.com",
  "www.spankbang.com",
  "txxx.com",
  "www.txxx.com",
  "vjav.com",
  "www.vjav.com",
  "xvideos2.com",
  "xvideos3.com",
  "adult-empire.com",
  "www.adult-empire.com",
  "adulttime.com",
  "www.adulttime.com",
  "alphaporno.com",
  "www.alphaporno.com",
  "analytics.porn",
  "animeidhentai.com",
  "anyporn.com",
  "anysex.com",
  "www.anysex.com",
  "beeg.com",
  "www.beeg.com",
  "bellesa.co",
  "www.bellesa.co",
  "bigassporn.org",
  "bigtits.com",
  "www.bigtits.com",
  "bravotube.net",
  "www.bravotube.net",
  "bustyplatinum.com",
  "cam4.com",
  "www.cam4.com",
  "cambay.tv",
  "www.cambay.tv",
  "chaturbate.com",
  "www.chaturbate.com",
  "clips4sale.com",
  "www.clips4sale.com",
  "cock.xxx",
  "daporno.com",
  "desiporn.tv",
  "www.desiporn.tv",
  "deviporn.com",
  "www.deviporn.com",
  "dirtyship.com",
  "www.dirtyship.com",
  "ebony.com",
  "www.ebony.com",
  "efukt.com",
  "www.efukt.com",
  "egotastic.com",
  "www.egotastic.com",
  "empflix.com",
  "www.empflix.com",
  "erome.com",
  "www.erome.com",
  "eroprofile.com",
  "www.eroprofile.com",
  "esporn.com",
  "www.esporn.com",
  "ex-gf.me",
  "www.ex-gf.me",
  "extremetube.com",
  "www.extremetube.com",
  "fap.com",
  "www.fap.com",
  "fapdu.com",
  "www.fapdu.com",
  "faphouse.com",
  "www.faphouse.com",
  "femjoy.com",
  "www.femjoy.com",
  "fetlife.com",
  "www.fetlife.com",
  "filthygirls.com",
  "www.filthygirls.com",
  "flix.com",
  "www.flix.com",
  "freeones.com",
  "www.freeones.com",
  "freeporn.com",
  "www.freeporn.com",
  "fux.com",
  "www.fux.com",
  "gayboystube.com",
  "www.gayboystube.com",
  "gaymaletube.com",
  "www.gaymaletube.com",
  "ghettotube.com",
  "www.ghettotube.com",
  "girlsway.com",
  "www.girlsway.com",
  "gofap.net",
  "www.gofap.net",
  "hentai2read.com",
  "hentaigasm.com",
  "www.hentaigasm.com",
  "hentaihaven.com",
  "www.hentaihaven.com",
  "hotmovies.com",
  "www.hotmovies.com",
  "hqbabes.com",
  "www.hqbabes.com",
  "hqseek.com",
  "www.hqseek.com",
  "iafd.com",
  "www.iafd.com",
  "imagefap.com",
  "www.imagefap.com",
  "incestflix.com",
  "indexxx.com",
  "www.indexxx.com",
  "jacquieetmichel.tv",
  "www.jacquieetmichel.tv",
  "japaneseporn.tv",
  "www.japaneseporn.tv",
  "jerkoffto.com",
  "www.jerkoffto.com",
  "jizzhut.com",
  "www.jizzhut.com",
  "joymii.com",
  "www.joymii.com",
  "keezmovies.com",
  "www.keezmovies.com",
  "lesbianporn.com",
  "www.lesbianporn.com",
  "lustery.com",
  "www.lustery.com",
  "madthumbs.com",
  "www.madthumbs.com",
  "mofos.com",
  "www.mofos.com",
  "motherless.com",
  "www.motherless.com",
  "mrporngeek.com",
  "www.mrporngeek.com",
  "mydirtyhobby.com",
  "www.mydirtyhobby.com",
  "myduckisdead.org",
  "nastyporn.com",
  "www.nastyporn.com",
  "naughtyamerica.com",
  "www.naughtyamerica.com",
  "nuvid.com",
  "www.nuvid.com",
  "onlyfans.com",
  "www.onlyfans.com",
  "palcomp3.com.br",
  "www.palcomp3.com.br",
  "pandamovies.pw",
  "perfectgirls.com",
  "www.perfectgirls.com",
  "pinklabel.tv",
  "www.pinklabel.tv",
  "playboy.com",
  "www.playboy.com",
  "pornbox.com",
  "www.pornbox.com",
  "pornburst.xxx",
  "porndoe.com",
  "www.porndoe.com",
  "pornfidelity.com",
  "www.pornfidelity.com",
  "porngem.com",
  "www.porngem.com",
  "pornhubpremium.com",
  "www.pornhubpremium.com",
  "pornmd.com",
  "www.pornmd.com",
  "pornone.com",
  "www.pornone.com",
  "pornoroulette.net",
  "www.pornoroulette.net",
  "pornoxo.com",
  "www.pornoxo.com",
  "porntop.com",
  "www.porntop.com",
  "pornvisit.com",
  "www.pornvisit.com",
  "pornwhite.com",
  "www.pornwhite.com",
  "porzo.com",
  "www.porzo.com",
  "propertysex.com",
  "www.propertysex.com",
  "rapexxx.com",
  "www.rapexxx.com",
  "ratexxx.net",
  "www.ratexxx.net",
  "realitykings.com",
  "www.realitykings.com",
  "redtube.com.br",
  "www.redtube.com.br",
  "rockettube.com",
  "www.rockettube.com",
  "rulertube.com",
  "www.rulertube.com",
  "sausage.com",
  "www.sausage.com",
  "sextube.com",
  "www.sextube.com",
  "sexu.com",
  "www.sexu.com",
  "shemale.com",
  "www.shemale.com",
  "sinparty.com",
  "www.sinparty.com",
  "sleazyneasy.com",
  "www.sleazyneasy.com",
  "slutload.com",
  "www.slutload.com",
  "smartporn.com",
  "www.smartporn.com",
  "smut.com",
  "www.smut.com",
  "sologirls.xxx",
  "spankwire.com",
  "www.spankwire.com",
  "stripchat.com",
  "www.stripchat.com",
  "sunporno.com",
  "www.sunporno.com",
  "teensloveporn.com",
  "www.teensloveporn.com",
  "teentube.com",
  "www.teentube.com",
  "thatpervert.com",
  "www.thatpervert.com",
  "theperfreview.com",
  "www.theperfreview.com",
  "thumbzilla.com",
  "www.thumbzilla.com",
  "tiava.com",
  "www.tiava.com",
  "tnaflix.com",
  "www.tnaflix.com",
  "tube.xxx",
  "tubegalore.com",
  "www.tubegalore.com",
  "tubeporn.com",
  "www.tubeporn.com",
  "tubepornclassic.com",
  "www.tubepornclassic.com",
  "tubestack.com",
  "www.tubestack.com",
  "twistys.com",
  "www.twistys.com",
  "upornia.com",
  "www.upornia.com",
  "videosz.com",
  "www.videosz.com",
  "vintageporn.net",
  "www.vintageporn.net",
  "voyeurhit.com",
  "www.voyeurhit.com",
  "watchmygf.com",
  "www.watchmygf.com",
  "wetpussy.com",
  "www.wetpussy.com",
  "whalebone.vip",
  "xhamsterlive.com",
  "www.xhamsterlive.com",
  "xnxx.app",
  "www.xnxx.app",
  "xnxx.tv",
  "www.xnxx.tv",
  "xossip.com",
  "www.xossip.com",
  "xporn.net",
  "www.xporn.net",
  "xpornz.com",
  "www.xpornz.com",
  "xtube.com",
  "www.xtube.com",
  "xvideo.com",
  "www.xvideo.com",
  "xvideos-br.com",
  "xvideos.es",
  "www.xvideos.es",
  "xvideos.fr",
  "www.xvideos.fr",
  "xvideos.it",
  "www.xvideos.it",
  "xvideos.jp",
  "www.xvideos.jp",
  "xvideos.ru",
  "www.xvideos.ru",
  "xvideos.tv",
  "www.xvideos.tv",
  "youjizz.com",
  "www.youjizz.com",
  "youpornbook.com",
  "www.youpornbook.com",
  "yourlust.com",
  "www.yourlust.com",
  "zbporn.com",
  "www.zbporn.com",
  "zporn.com",
  "www.zporn.com",
];
function isAdultDomain(c) {
  if (!c) {
    return false;
  }
  const f = c.toLowerCase();
  for (const g of ADULT_DOMAINS) {
    if (f === g || f.endsWith("." + g)) {
      return true;
    }
  }
  return false;
}
function novaBlockPage(c) {
  const f = new URL(c.url);
  const g = f.host;
  const h =
    '<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مسدود شده - YNS</title><style>@import url("https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800;900&display=swap");*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Vazirmatn",sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:48px 40px;max-width:480px;width:100%;text-align:center;position:relative;overflow:hidden}.card::before{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:conic-gradient(from 0deg,transparent,rgba(239,68,68,0.1),transparent,rgba(239,68,68,0.05),transparent);animation:spin 6s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.content{position:relative;z-index:1}.icon{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#dc2626);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;color:#fff;box-shadow:0 8px 32px rgba(239,68,68,0.3)}.shield{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6d28d9);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;color:#fff;box-shadow:0 8px 32px rgba(139,92,246,0.3)}h1{color:#fff;font-size:24px;font-weight:900;margin-bottom:8px;letter-spacing:-0.5px}h1 span{background:linear-gradient(135deg,#8b5cf6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}p{color:rgba(255,255,255,0.6);font-size:14px;line-height:1.8;margin:12px 0}.badge{display:inline-block;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:16px}.domain{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 16px;margin:16px 0;direction:ltr;font-family:monospace;font-size:13px;color:rgba(255,255,255,0.8);word-break:break-all}.btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .2s;margin-top:8px;text-decoration:none}.btn:hover{background:rgba(255,255,255,0.15);transform:translateY(-1px)}</style></head><body><div class="card"><div class="content"><div class="icon">&#128274;</div><h1>دسترسی <span>مسدود</span></h1><div class="badge">&#9888; محتوای بزرگسالان</div><p>این وب‌سایت به دلیل حاوی محتوای بزرگسالان توسط <strong>YNS</strong> مسدود شده است.</p><div class="domain">' +
    g +
    "</div><p>لطفاً با مدیر سامانه تماس بگیرید.</p></div></div></body></html>";
  return new Response(h, {
    status: 403,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
async function handleDoHRequest(c) {
  const f = new URL(c.url);
  if (c.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  if (!["GET", "POST"].includes(c.method)) {
    return new Response("Method not allowed. Use GET or POST.", {
      status: 405,
    });
  }
  if (
    c.method === "GET" &&
    !f.searchParams.has("dns") &&
    !f.searchParams.has("name")
  ) {
    const j = f.protocol + "//" + f.host + f.pathname;
    const k =
      '<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DoH Proxy - YNS</title><style>:root{--primary:#0ea5e9;--bg:#f8fafc;--card:#fff;--text:#1e293b;--border:#e2e8f0}body{font-family:Vazirmatn,sans-serif;background:var(--bg);color:var(--text);margin:0;padding:20px;display:flex;justify-content:center;align-items:center;min-height:100vh}.card{background:var(--card);border-radius:16px;padding:32px;max-width:560px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08);border:1px solid var(--border);text-align:center}.badge{display:inline-block;background:linear-gradient(135deg,#0ea5e9,#667eea);color:#fff;padding:6px 16px;border-radius:20px;font-weight:700;font-size:14px;margin-bottom:16px}h2{margin:0 0 8px;font-size:22px;font-weight:800;background:linear-gradient(135deg,#0ea5e9,#667eea);-webkit-background-clip:text;-webkit-text-fill-color:transparent}p{color:#64748b;font-size:14px;line-height:1.7;margin:8px 0}.url-box{background:#f0f9ff;border:2px solid #0ea5e9;border-radius:12px;padding:14px 18px;margin:16px 0;direction:ltr;text-align:left;font-family:monospace;font-size:15px;font-weight:700;color:#0369a1;word-break:break-all;cursor:pointer;transition:all .2s}.url-box:hover{background:#e0f2fe}.btn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0ea5e9,#667eea);color:#fff;border:none;border-radius:10px;padding:10px 24px;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .2s;margin-top:8px;text-decoration:none}.btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(14,165,233,.3)}.features{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px;text-align:right}.feature{background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:12px;font-weight:500;color:#475569;display:flex;align-items:center;gap:6px}.feature i{color:#10b981}.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:8px 20px;border-radius:10px;font-size:13px;font-weight:600;opacity:0;transition:opacity .3s;pointer-events:none}.toast.show{opacity:1}</style></head><body><div class="card"><div class="badge">&#128736; DoH Proxy</div><h2>DNS over HTTPS</h2><p>از این سرور به عنوان DNS رمزگذاری شده استفاده کنید</p><div class="url-box" id="dohUrl" onclick="copyUrl()">' +
      j +
      '</div><button class="btn" onclick="copyUrl()">&#128203; کپی کردن آدرس DoH</button><div class="features"><div class="feature"><span>&#9989;</span> بدون Log</div><div class="feature"><span>&#9989;</span> پرسرعت</div><div class="feature"><span>&#9989;</span> امن</div><div class="feature"><span>&#9989;</span> رایگان</div></div></div><div class="toast" id="toast">کپی شد!</div><script>function copyUrl(){var t=document.getElementById("dohUrl");navigator.clipboard.writeText(t.innerText).then(function(){var e=document.getElementById("toast");e.classList.add("show"),setTimeout(function(){e.classList.remove("show")},2e3)})}</script></body></html>';
    return new Response(k, {
      status: 200,
      headers: {
        "Content-Type": "text/html;charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
  if (c.method === "GET" && f.searchParams.has("name")) {
    const l = [
      "https://dns.google/resolve",
      "https://dns.quad9.net:5053/dns-query",
      "https://cloudflare-dns.com/dns-query",
    ];
    for (const m of l) {
      try {
        const n = await fetch(m + f.search, {
          headers: {
            Accept: "application/dns-json",
            "User-Agent": "DoH-Proxy/1.0",
          },
          redirect: "follow",
        });
        if (!n.ok) {
          continue;
        }
        const o = await n.text();
        return new Response(o, {
          status: 200,
          headers: {
            "Content-Type": "application/dns-json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=60",
          },
        });
      } catch (p) {}
    }
    return new Response(
      JSON.stringify({
        Status: 2,
        error: "DoH JSON upstream unavailable",
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/dns-json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
  const g = [
    {
      name: "Google",
      url: "https://dns.google/dns-query",
    },
    {
      name: "Quad9",
      url: "https://dns.quad9.net/dns-query",
    },
    {
      name: "OpenDNS",
      url: "https://doh.opendns.com/dns-query",
    },
    {
      name: "AdGuard",
      url: "https://dns.adguard.com/dns-query",
    },
    {
      name: "Mullvad",
      url: "https://adblock.dns.mullvad.net/dns-query",
    },
    {
      name: "NextDNS",
      url: "https://dns.nextdns.io/dns-query",
    },
    {
      name: "Cloudflare",
      url: "https://cloudflare-dns.com/dns-query",
    },
  ];
  const h =
    c.method === "POST" ? await c.arrayBuffer().catch(() => null) : null;
  let i = "";
  for (const q of g) {
    try {
      const s = new Headers();
      s.set("User-Agent", "Mozilla/5.0");
      s.set("Accept", "application/dns-message");
      if (c.method === "POST") {
        s.set("Content-Type", "application/dns-message");
      }
      const t = new Request(q.url + f.search, {
        method: c.method,
        headers: s,
        body: h,
        redirect: "follow",
      });
      const u = await fetch(t);
      if (!u.ok) {
        i = q.name + " HTTP " + u.status;
        continue;
      }
      const v = await u.arrayBuffer();
      if (!v || v.byteLength === 0) {
        i = q.name + " empty body";
        continue;
      }
      const w = new Headers();
      w.set("Content-Type", "application/dns-message");
      w.set("Access-Control-Allow-Origin", "*");
      w.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      w.set("Access-Control-Allow-Headers", "Content-Type, Accept");
      w.set("Cache-Control", "public, max-age=120");
      return new Response(v, {
        status: 200,
        headers: w,
      });
    } catch (x) {
      i = q.name + ": " + (x && x.message ? x.message : String(x));
    }
  }
  return new Response("DoH proxy error: all upstreams failed (" + i + ")", {
    status: 502,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
function getDateKey(c) {
  const f = c || new Date();
  return (
    f.getFullYear() +
    "-" +
    String(f.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(f.getDate()).padStart(2, "0")
  );
}
function getMonthKey(c) {
  const f = c || new Date();
  return f.getFullYear() + "-" + String(f.getMonth() + 1).padStart(2, "0");
}
let _monthUsedCache = -1;
let _monthUsedAt = 0;
async function monthlyUsedBytes(f) {
  if (_monthUsedCache >= 0 && Date.now() - _monthUsedAt < 60000) {
    return _monthUsedCache;
  }
  try {
    const g = await usageGet(f, "usage-m:" + getMonthKey(new Date()));
    _monthUsedCache = (g && g.total) || 0;
  } catch (h) {
    if (_monthUsedCache < 0) {
      _monthUsedCache = 0;
    }
  }
  _monthUsedAt = Date.now();
  return _monthUsedCache;
}
let connUserId = null;
let connRejectReason = null;
let connClientIp = "";
let connSpeedLimitKBps = 0;
let userUsageCache = {};
let userUsageCacheAt = 0;
let userDayUsageCache = {};
let userDayUsageCacheDay = "";
async function refreshUserUsageIfStale(c) {
  if (Date.now() - userUsageCacheAt < 60000) {
    return;
  }
  userUsageCacheAt = Date.now();
  const f = getDateKey(new Date());
  if (userDayUsageCacheDay !== f) {
    userDayUsageCache = {};
    userDayUsageCacheDay = f;
  }
  try {
    const g =
      networkSettings && Array.isArray(networkSettings.users)
        ? networkSettings.users
        : [];
    const h = {};
    const i = getDateKey(new Date());
    const j = {};
    await Promise.all(
      g.map(async (k) => {
        if (!k || !k.id) {
          return;
        }
        try {
          const l = await usageGet(c, "uusage:" + k.id);
          h[k.id] = (l && l.total) || 0;
        } catch (m) {
          h[k.id] = userUsageCache[k.id] || 0;
        }
        try {
          const n = await usageGet(c, "uusage-d:" + k.id + ":" + i);
          j[k.id] = (n && n.total) || 0;
        } catch (o) {
          j[k.id] = userDayUsageCache[k.id] || 0;
        }
      }),
    );
    userUsageCache = h;
    userDayUsageCache = j;
    userDayUsageCacheDay = i;
  } catch (k) {}
}
function resolveConnUser(c) {
  connUserId = null;
  connRejectReason = null;
  connSpeedLimitKBps = 0;
  if (!networkSettings || !Array.isArray(networkSettings.users)) {
    return;
  }
  const f = c.searchParams.get("u");
  if (!f) {
    return;
  }
  const g = networkSettings.users.find((h) => h && h.tag === f);
  if (!g) {
    connRejectReason = "no-user";
    return;
  }
  if (g.enabled === false) {
    connRejectReason = "disabled";
    return;
  }
  if (g.expiry) {
    const h = Date.parse(g.expiry);
    if (!isNaN(h) && Date.now() > h) {
      connRejectReason = "expired";
      return;
    }
  }
  if (g.quotaBytes) {
    const i = userUsageCache[g.id] || 0;
    if (i >= g.quotaBytes) {
      connRejectReason = "quota";
      return;
    }
  }
  if (g.dailyQuotaBytes) {
    const j = userDayUsageCache[g.id] || 0;
    if (j >= g.dailyQuotaBytes) {
      connRejectReason = "daily-quota";
      return;
    }
  }
  connSpeedLimitKBps =
    typeof g.speedLimitKBps === "number" &&
    isFinite(g.speedLimitKBps) &&
    g.speedLimitKBps > 0
      ? g.speedLimitKBps
      : 0;
  connUserId = g.id;
}
function getConnUserById(c) {
  if (c && networkSettings && Array.isArray(networkSettings.users)) {
    return networkSettings.users.find((f) => f && f.id === c);
  } else {
    return null;
  }
}
function isUserQuotaExceededNow(c, f = 0) {
  const g = getConnUserById(c);
  if (!g) {
    return false;
  }
  const h = Math.max(0, f || 0);
  const i = (userUsageCache[c] || 0) + h;
  const j = (userDayUsageCache[c] || 0) + h;
  return (
    (!!g.quotaBytes && !!(i >= g.quotaBytes)) ||
    (!!g.dailyQuotaBytes && !!(j >= g.dailyQuotaBytes))
  );
}
let _d1Ready = false;
let _logIns = 0;
function hasD1(c) {
  return !!c && !!c.DB && typeof c.DB.prepare === "function";
}
async function d1Init(c) {
  if (_d1Ready || !hasD1(c)) {
    return _d1Ready;
  }
  try {
    await c.DB.batch([
      c.DB.prepare(
        "CREATE TABLE IF NOT EXISTS usage (k TEXT PRIMARY KEY, up INTEGER DEFAULT 0, down INTEGER DEFAULT 0, total INTEGER DEFAULT 0)",
      ),
      c.DB.prepare(
        "CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, TYPE TEXT, IP TEXT, ASN TEXT, CC TEXT, URL TEXT, UA TEXT, TIME INTEGER)",
      ),
      c.DB.prepare(
        "CREATE TABLE IF NOT EXISTS kvstore (k TEXT PRIMARY KEY, v TEXT, updated INTEGER)",
      ),
    ]);
    _d1Ready = true;
  } catch (f) {
    console.error("d1Init: " + ((f && f.message) || f));
  }
  return _d1Ready;
}
function wrapKVWithD1(c) {
  if (
    c &&
    (!c.DB || typeof c.DB.prepare !== "function") &&
    c.D1 &&
    typeof c.D1.prepare === "function"
  ) {
    c.DB = c.D1;
  }
  if (!c || c.__kvWrapped || !hasD1(c)) {
    return;
  }
  const f = c.KV && typeof c.KV.get === "function" ? c.KV : null;
  c.__realKV = f;
  c.__hasRealKV = !!f;
  c.KV = {
    __real: f,
    get: async (g, h) => {
      if (h && f) {
        return f.get(g, h);
      }
      try {
        if (await d1Init(c)) {
          const i = await c.DB.prepare("SELECT v FROM kvstore WHERE k=?")
            .bind(g)
            .first();
          if (i && i.v != null) {
            return i.v;
          }
          if (f && !_kvMigratedFlag) {
            const j = await f.get(g);
            if (j != null) {
              try {
                await c.DB.prepare(
                  "INSERT INTO kvstore (k,v,updated) VALUES (?,?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v, updated=excluded.updated",
                )
                  .bind(g, j, Date.now())
                  .run();
              } catch (l) {}
            }
            return j;
          }
          return null;
        }
      } catch (m) {}
      if (f) {
        return f.get(g, h);
      } else {
        return null;
      }
    },
    put: async (g, h, i) => {
      try {
        if (typeof h === "string" && (await d1Init(c))) {
          await c.DB.prepare(
            "INSERT INTO kvstore (k,v,updated) VALUES (?,?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v, updated=excluded.updated",
          )
            .bind(g, h, Date.now())
            .run();
        }
      } catch (j) {}
      if (f && (c.NOVA_KV_MIRROR === "1" || c.NOVA_KV_MIRROR === "true" || c.YNS_KV_MIRROR === "1" || c.YNS_KV_MIRROR === "true")) {
        try {
          f.put(g, h, i).catch(() => {});
        } catch (l) {}
      }
    },
    delete: async (g) => {
      try {
        if (await d1Init(c)) {
          await c.DB.prepare("DELETE FROM kvstore WHERE k=?").bind(g).run();
        }
      } catch (h) {}
      if (f && (c.NOVA_KV_MIRROR === "1" || c.NOVA_KV_MIRROR === "true" || c.YNS_KV_MIRROR === "1" || c.YNS_KV_MIRROR === "true")) {
        try {
          f.delete(g).catch(() => {});
        } catch (i) {}
      }
    },
    list: async (g) => {
      g = g || {};
      try {
        if (await d1Init(c)) {
          const h = await c.DB.prepare(
            "SELECT k FROM kvstore WHERE k LIKE ? ORDER BY k",
          )
            .bind((g.prefix || "") + "%")
            .all();
          return {
            keys: (h.results || []).map((i) => ({
              name: i.k,
            })),
            list_complete: true,
            cursor: null,
          };
        }
      } catch (i) {}
      if (f) {
        return f.list(g);
      } else {
        return {
          keys: [],
          list_complete: true,
          cursor: null,
        };
      }
    },
  };
  c.__kvWrapped = true;
}
async function migrateKvToD1(c) {
  try {
    if (!hasD1(c) || !c.__realKV) {
      return;
    }
    if (!(await d1Init(c))) {
      return;
    }
    const f = await c.DB.prepare("SELECT v FROM kvstore WHERE k=?")
      .bind("__kv_migrated")
      .first();
    if (f && f.v) {
      _kvMigratedFlag = true;
      return;
    }
    let g;
    let h = 0;
    do {
      const i = await c.__realKV.list({
        cursor: g,
      });
      for (const j of i.keys || []) {
        try {
          const k = await c.__realKV.get(j.name);
          if (k != null) {
            await c.DB.prepare(
              "INSERT INTO kvstore (k,v,updated) VALUES (?,?,?) ON CONFLICT(k) DO NOTHING",
            )
              .bind(j.name, k, Date.now())
              .run();
            h++;
          }
        } catch (l) {}
      }
      g = i.list_complete ? null : i.cursor;
    } while (g);
    await c.DB.prepare(
      "INSERT INTO kvstore (k,v,updated) VALUES (?,?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v, updated=excluded.updated",
    )
      .bind("__kv_migrated", String(Date.now()), Date.now())
      .run();
    _kvMigratedFlag = true;
    console.log("migrateKvToD1: copied " + h + " keys");
  } catch (m) {
    console.error("migrateKvToD1: " + ((m && m.message) || m));
  }
}
async function usageGet(c, f) {
  if (hasD1(c) && (await d1Init(c))) {
    try {
      const g = await c.DB.prepare("SELECT up,down,total FROM usage WHERE k=?")
        .bind(f)
        .first();
      if (g) {
        return {
          up: g.up || 0,
          down: g.down || 0,
          total: g.total || 0,
        };
      } else {
        return null;
      }
    } catch (h) {
      console.error("usageGet: " + h);
    }
  }
  try {
    return JSON.parse((await c.KV.get(f)) || "null");
  } catch (i) {
    return null;
  }
}
async function usageAdd(c, f, g, h) {
  g = g || 0;
  h = h || 0;
  if (hasD1(c) && (await d1Init(c))) {
    try {
      const j = await c.DB.prepare(
        "INSERT INTO usage (k,up,down,total) VALUES (?,?,?,?) ON CONFLICT(k) DO UPDATE SET up=up+?, down=down+?, total=total+? RETURNING total",
      )
        .bind(f, g, h, g + h, g, h, g + h)
        .first();
      return (j && j.total) || 0;
    } catch (l) {
      console.error("usageAdd: " + l);
    }
  }
  let i;
  try {
    i = JSON.parse((await c.KV.get(f)) || "null");
  } catch (m) {
    i = null;
  }
  if (!i || typeof i !== "object") {
    i = {
      up: 0,
      down: 0,
      total: 0,
    };
  }
  i.up = (i.up || 0) + g;
  i.down = (i.down || 0) + h;
  i.total = (i.total || 0) + g + h;
  await c.KV.put(f, JSON.stringify(i));
  return i.total;
}
async function usageReset(c, f) {
  if (hasD1(c) && (await d1Init(c))) {
    try {
      await c.DB.prepare(
        "INSERT INTO usage (k,up,down,total) VALUES (?,?,?,?) ON CONFLICT(k) DO UPDATE SET up=0, down=0, total=0",
      )
        .bind(f, 0, 0, 0)
        .run();
      return true;
    } catch (g) {
      console.error("usageReset: " + g);
    }
  }
  try {
    await c.KV.put(
      f,
      JSON.stringify({
        up: 0,
        down: 0,
        total: 0,
      }),
    );
  } catch (h) {}
  return true;
}
async function usageListMonths(f) {
  if (hasD1(f) && (await d1Init(f))) {
    try {
      const i = await f.DB.prepare(
        "SELECT k,up,down,total FROM usage WHERE k LIKE 'usage-m:%'",
      ).all();
      return (i.results || []).map((j) => ({
        name: j.k,
        up: j.up || 0,
        down: j.down || 0,
        total: j.total || 0,
      }));
    } catch (j) {
      console.error("usageListMonths: " + j);
    }
  }
  const g = [];
  let h;
  do {
    const k = await f.KV.list({
      prefix: "usage-m:",
      cursor: h,
    });
    for (const m of k.keys) {
      try {
        const n = JSON.parse((await f.KV.get(m.name)) || "null");
        if (n) {
          g.push({
            name: m.name,
            up: n.up || 0,
            down: n.down || 0,
            total: n.total || 0,
          });
        }
      } catch (o) {}
    }
    h = k.list_complete ? null : k.cursor;
  } while (h);
  return g;
}
async function logReadAll(c) {
  if (hasD1(c) && (await d1Init(c))) {
    try {
      const f = await c.DB.prepare(
        "SELECT TYPE,IP,ASN,CC,URL,UA,TIME FROM logs ORDER BY id DESC LIMIT 2000",
      ).all();
      return f.results || [];
    } catch (g) {
      console.error("logReadAll: " + g);
    }
  }
  try {
    return JSON.parse((await c.KV.get("log.json")) || "[]");
  } catch (h) {
    return [];
  }
}
async function logWriteD1(c, f, g, h, i, j) {
  if (!hasD1(c) || !(await d1Init(c))) {
    return false;
  }
  try {
    if (h !== "Get_SUB") {
      const k = j.getTime() - 1800000;
      const l = await c.DB.prepare(
        "SELECT 1 FROM logs WHERE TYPE!='Get_SUB' AND IP=? AND URL=? AND UA=? AND TIME>=? LIMIT 1",
      )
        .bind(f, g.url, i.UA, k)
        .first();
      if (l) {
        return true;
      }
    }
    await c.DB.prepare(
      "INSERT INTO logs (TYPE,IP,ASN,CC,URL,UA,TIME) VALUES (?,?,?,?,?,?,?)",
    )
      .bind(i.TYPE, i.IP, i.ASN, i.CC, i.URL, i.UA, i.TIME)
      .run();
    _logIns = (_logIns + 1) % 200;
    if (_logIns === 0) {
      try {
        await c.DB.prepare(
          "DELETE FROM logs WHERE id <= (SELECT MAX(id)-5000 FROM logs)",
        ).run();
      } catch (m) {}
    }
    return true;
  } catch (n) {
    console.error("logWriteD1: " + n);
    return false;
  }
}
let _uusagePending = {};
let _uusageLastFlush = 0;
let _uusageFlushing = false;
const USAGE_FLUSH_MS = 300000;
const USAGE_FLUSH_BYTES = 209715200;
async function flushUserUsage(c) {
  if (_uusageFlushing) {
    return;
  }
  _uusageFlushing = true;
  try {
    const f = _uusagePending;
    _uusagePending = {};
    for (const g of Object.keys(f)) {
      const h = f[g].up;
      const i = f[g].down;
      if (h + i <= 0) {
        continue;
      }
      try {
        userUsageCache[g] = await usageAdd(c, "uusage:" + g, h, i);
        const j = getDateKey(new Date());
        const k = await usageAdd(c, "uusage-d:" + g + ":" + j, h, i);
        if (userDayUsageCacheDay !== j) {
          userDayUsageCache = {};
          userDayUsageCacheDay = j;
        }
        userDayUsageCache[g] =
          (k && k.total) || (userDayUsageCache[g] || 0) + h + i;
      } catch (l) {
        if (!_uusagePending[g]) {
          _uusagePending[g] = {
            up: 0,
            down: 0,
          };
        }
        _uusagePending[g].up += h;
        _uusagePending[g].down += i;
      }
    }
  } finally {
    _uusageFlushing = false;
  }
}
function recordUserUsage(c, f, g, h, i) {
  if (!f) {
    return;
  }
  if (!_uusagePending[f]) {
    _uusagePending[f] = {
      up: 0,
      down: 0,
    };
  }
  _uusagePending[f].up += g || 0;
  _uusagePending[f].down += h || 0;
  userUsageCache[f] = (userUsageCache[f] || 0) + (g || 0) + (h || 0);
  {
    const k = getDateKey(new Date());
    if (userDayUsageCacheDay !== k) {
      userDayUsageCache = {};
      userDayUsageCacheDay = k;
    }
    userDayUsageCache[f] = (userDayUsageCache[f] || 0) + (g || 0) + (h || 0);
  }
  const j = Date.now();
  if (j - _uusageLastFlush < USAGE_FLUSH_MS) {
    return;
  }
  _uusageLastFlush = j;
  if (i && i.waitUntil) {
    i.waitUntil(flushUserUsage(c));
  } else {
    flushUserUsage(c).catch(() => {});
  }
}
let usagePending = {
  up: 0,
  down: 0,
};
let usageLastFlush = 0;
let usageFlushing = false;
async function flushUsage(c) {
  if (usageFlushing) {
    return;
  }
  const f = usagePending.up;
  const g = usagePending.down;
  if (f + g <= 0) {
    return;
  }
  usageFlushing = true;
  usagePending = {
    up: 0,
    down: 0,
  };
  try {
    const h = new Date();
    await usageAdd(c, "usage:" + getDateKey(h), f, g);
    await usageAdd(c, "usage-m:" + getMonthKey(h), f, g);
  } catch (i) {
    usagePending.up += f;
    usagePending.down += g;
    console.error("flushUsage failed: " + (i.message || i));
  } finally {
    usageFlushing = false;
  }
}
function recordUsage(c, f, g, h) {
  usagePending.up += f || 0;
  usagePending.down += g || 0;
  const i = usagePending.up + usagePending.down;
  if (i <= 0) {
    return;
  }
  const j = Date.now();
  if (j - usageLastFlush < USAGE_FLUSH_MS && i < USAGE_FLUSH_BYTES) {
    return;
  }
  usageLastFlush = j;
  if (h && h.waitUntil) {
    h.waitUntil(flushUsage(c));
  } else {
    flushUsage(c).catch(() => {});
  }
}
async function bestIP(c, f, g = "ADD.txt") {
  const h = new URL(c.url);
  if (
    c.method === "GET" &&
    !h.searchParams.get("loadIPs") &&
    !h.searchParams.get("edit")
  ) {
    const m = await panelFetch(f, "/admin/bestip.html");
    const n = await m.text();
    return new Response(n, {
      status: m.status,
      headers: {
        "Content-Type": "text/html;charset=utf-8",
      },
    });
  }
  async function i(o = "official", p = "443") {
    try {
      let q;
      if (o && o.startsWith("country:")) {
        const x = o
          .slice(8)
          .toUpperCase()
          .replace(/[^A-Z]/g, "")
          .slice(0, 2);
        const y = await fetch(
          "https://raw.githubusercontent.com/NiREvil/vless/main/sub/country_proxies/" +
            x +
            ".txt",
        );
        const z = y.ok ? await y.text() : "";
        const A = [];
        for (const C of z.split("\n")) {
          const D = C.trim().split(/[\s,]+/);
          const E = (D[0] || "").trim();
          if (/^\d{1,3}(\.\d{1,3}){3}$/.test(E)) {
            A.push(E + ":" + (D[1] && /^\d+$/.test(D[1]) ? D[1] : p));
          }
        }
        const B = [...new Set(A)];
        if (B.length > 512) {
          return B.sort(() => 0.5 - Math.random()).slice(0, 512);
        } else {
          return B;
        }
      } else if (o === "as13335") {
        q = await fetch(
          "https://raw.githubusercontent.com/ipverse/asn-ip/master/as/13335/ipv4-aggregated.txt",
        );
      } else if (o === "as209242") {
        q = await fetch(
          "https://raw.githubusercontent.com/ipverse/asn-ip/master/as/209242/ipv4-aggregated.txt",
        );
      } else if (o === "as24429") {
        q = await fetch(
          "https://raw.githubusercontent.com/ipverse/asn-ip/master/as/24429/ipv4-aggregated.txt",
        );
      } else if (o === "as35916") {
        q = await fetch(
          "https://raw.githubusercontent.com/ipverse/asn-ip/master/as/35916/ipv4-aggregated.txt",
        );
      } else if (o === "as199524") {
        q = await fetch(
          "https://raw.githubusercontent.com/ipverse/asn-ip/master/as/199524/ipv4-aggregated.txt",
        );
      } else if (o === "cm") {
        q = await fetch(
          "https://raw.githubusercontent.com/cmliu/cmliu/main/CF-CIDR.txt",
        );
      } else if (o === "proxyip") {
        q = await fetch(
          "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/baipiao.txt",
        );
        const F = q.ok ? await q.text() : "";
        const G = F.split("\n")
          .map((I) => I.trim())
          .filter((I) => I && !I.startsWith("#"));
        const H = [];
        for (const I of G) {
          const J = j(I, p);
          if (J) {
            H.push(J);
          }
        }
        if (H.length > 512) {
          const K = [...H].sort(() => 0.5 - Math.random());
          return K.slice(0, 512);
        } else {
          return H;
        }
      } else if (o === "dominos") {
        q = await fetch(
          "https://raw.githubusercontent.com/Blacknuno/Nova-Proxy/refs/heads/main/dominos.text",
        );
        const L = q.ok ? await q.text() : "";
        const M = L.split("\n")
          .map((P) => P.trim())
          .filter((P) => P && !P.startsWith("#"));
        const N = [];
        const O = M.slice(0, 40);
        for (let P = 0; P < O.length; P += 10) {
          const Q = await Promise.all(
            O.slice(P, P + 10).map(async (R) => {
              try {
                const S = await fetch(
                  "https://cloudflare-dns.com/dns-query?name=" + R + "&type=A",
                  {
                    headers: {
                      Accept: "application/dns-json",
                    },
                  },
                );
                if (S.ok) {
                  const T = await S.json();
                  if (T.Answer) {
                    return T.Answer.filter((U) => U.type === 1).map(
                      (U) => U.data + ":" + p,
                    );
                  }
                }
              } catch (U) {}
              return [];
            }),
          );
          for (const R of Q) {
            for (const S of R) {
              N.push(S);
            }
          }
        }
        if (N.length > 512) {
          return N.slice(0, 512);
        }
        return N;
      } else if (o === "irdominos") {
        q = await fetch(
          "https://raw.githubusercontent.com/Blacknuno/Nova-Proxy/refs/heads/main/IRdominos.text",
        );
        const T = q.ok ? await q.text() : "";
        const U = T.split("\n")
          .map((X) => X.trim())
          .filter((X) => X && !X.startsWith("#"));
        const V = [];
        const W = U.slice(0, 40);
        for (let X = 0; X < W.length; X += 10) {
          const Y = await Promise.all(
            W.slice(X, X + 10).map(async (Z) => {
              try {
                const a0 = await fetch(
                  "https://cloudflare-dns.com/dns-query?name=" + Z + "&type=A",
                  {
                    headers: {
                      Accept: "application/dns-json",
                    },
                  },
                );
                if (a0.ok) {
                  const a1 = await a0.json();
                  if (a1.Answer) {
                    return a1.Answer.filter((a2) => a2.type === 1).map(
                      (a2) => a2.data + ":" + p,
                    );
                  }
                }
              } catch (a2) {}
              return [];
            }),
          );
          for (const Z of Y) {
            for (const a0 of Z) {
              V.push(a0);
            }
          }
        }
        if (V.length > 512) {
          return V.slice(0, 512);
        }
        return V;
      } else {
        q = await fetch("https://www.cloudflare.com/ips-v4/");
      }
      const s = q.ok
        ? await q.text()
        : "173.245.48.0/20\n103.21.244.0/22\n103.22.200.0/22\n103.31.4.0/22\n141.101.64.0/18\n108.162.192.0/18\n190.93.240.0/20\n188.114.96.0/20\n197.234.240.0/22\n198.41.128.0/17\n162.158.0.0/15\n104.16.0.0/13\n104.24.0.0/14\n172.64.0.0/13\n131.0.72.0/22";
      const t = s.split("\n").filter((a1) => a1.trim() && !a1.startsWith("#"));
      const u = new Set();
      const v = 512;
      let w = 1;
      while (u.size < v) {
        for (const a1 of t) {
          if (u.size >= v) {
            break;
          }
          const a2 = l(a1.trim(), w);
          a2.forEach((a3) => u.add(a3));
        }
        w++;
        if (w > 100) {
          break;
        }
      }
      return Array.from(u).slice(0, v);
    } catch (a3) {
      return [];
    }
  }
  function j(o, p) {
    try {
      o = o.trim();
      if (!o) {
        return null;
      }
      let q = "";
      let r = "";
      let s = "";
      if (o.includes("#")) {
        const u = o.split("#");
        const v = u[0].trim();
        s = u[1].trim();
        if (v.includes(":")) {
          const w = v.split(":");
          if (w.length === 2) {
            q = w[0].trim();
            r = w[1].trim();
          } else {
            return null;
          }
        } else {
          q = v;
          r = "443";
        }
      } else if (o.includes(":")) {
        const x = o.split(":");
        if (x.length === 2) {
          q = x[0].trim();
          r = x[1].trim();
        } else {
          return null;
        }
      } else {
        q = o;
        r = "443";
      }
      if (!k(q)) {
        return null;
      }
      const t = parseInt(r);
      if (isNaN(t) || t < 1 || t > 65535) {
        return null;
      }
      if (r !== p) {
        return null;
      }
      if (s) {
        return q + ":" + r + "#" + s;
      } else {
        return q + ":" + r;
      }
    } catch (y) {
      return null;
    }
  }
  function k(o) {
    const p = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const q = o.match(p);
    if (!q) {
      return false;
    }
    for (let r = 1; r <= 4; r++) {
      const s = parseInt(q[r]);
      if (s < 0 || s > 255) {
        return false;
      }
    }
    return true;
  }
  function l(o, p = 1) {
    const [q, r] = o.split("/");
    const s = parseInt(r);
    const t = (D) => {
      return D.split(".").reduce((E, F) => (E << 8) + parseInt(F), 0) >>> 0;
    };
    const u = (D) => {
      return [
        (D >>> 24) & 255,
        (D >>> 16) & 255,
        (D >>> 8) & 255,
        D & 255,
      ].join(".");
    };
    const v = t(q);
    const w = 32 - s;
    const x = Math.pow(2, w);
    const y = x - 2;
    const z = Math.min(p, y);
    const A = new Set();
    if (y <= 0) {
      return [];
    }
    let B = 0;
    const C = z * 10;
    while (A.size < z && B < C) {
      const D = Math.floor(Math.random() * y) + 1;
      const E = u(v + D);
      A.add(E);
      B++;
    }
    return Array.from(A);
  }
  if (c.method === "POST") {
    if (!f.KV) {
      return new Response("KV namespace not connected", {
        status: 400,
      });
    }
    try {
      const o = c.headers.get("Content-Type");
      if (o && o.includes("application/json")) {
        const p = await c.json();
        const q = h.searchParams.get("action") || "save";
        if (!p.ips || !Array.isArray(p.ips)) {
          return new Response(
            JSON.stringify({
              error: "Invalid IP list",
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        }
        if (q === "append") {
          const r = (await f.KV.get(g)) || "";
          const s = p.ips.join("\n");
          const t = r
            ? r
                .split("\n")
                .map((B) => B.trim())
                .filter((B) => B)
            : [];
          const u = s
            .split("\n")
            .map((B) => B.trim())
            .filter((B) => B);
          const v = [...t, ...u];
          const w = [...new Set(v)];
          const x = w.join("\n");
          if (x.length > 25165824) {
            return new Response(
              JSON.stringify({
                error: "Combined content exceeds KV limit (24MB)",
              }),
              {
                status: 400,
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
          }
          await f.KV.put(g, x);
          const y = w.length - t.length;
          const z = u.length - y;
          let A = y + " IPs added (total: " + w.length + ")";
          if (z > 0) {
            A += ", " + z + " duplicates removed";
          }
          return new Response(
            JSON.stringify({
              success: true,
              message: A,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        } else {
          const B = p.ips.join("\n");
          if (B.length > 25165824) {
            return new Response(
              JSON.stringify({
                error: "Content exceeds KV limit (24MB)",
              }),
              {
                status: 400,
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
          }
          await f.KV.put(g, B);
          return new Response(
            JSON.stringify({
              success: true,
              message: p.ips.length + " IPs saved",
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        }
      } else {
        const C = await c.text();
        await f.KV.put(g, C);
        return new Response("Saved successfully");
      }
    } catch (D) {
      return new Response(
        JSON.stringify({
          error: D.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }
  if (h.searchParams.get("loadIPs")) {
    const E = h.searchParams.get("loadIPs");
    const F = h.searchParams.get("port") || "443";
    const G = await i(E, F);
    return new Response(
      JSON.stringify({
        ips: G,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
  return new Response("Not Found", {
    status: 404,
  });
}
async function socks5Connect(c, f, g, h) {
  const {
    username: i,
    password: j,
    hostname: k,
    port: l,
  } = parsedSocks5Address;
  const m = h({
    hostname: k,
    port: l,
  });
  const n = m.writable.getWriter();
  const o = m.readable.getReader();
  try {
    const p = i && j ? new Uint8Array([5, 2, 0, 2]) : new Uint8Array([5, 1, 0]);
    await n.write(p);
    let q = await o.read();
    if (q.done || q.value.byteLength < 2) {
      throw new Error("S5 method selection failed");
    }
    const r = new Uint8Array(q.value)[1];
    if (r === 2) {
      if (!i || !j) {
        throw new Error("S5 requires authentication");
      }
      const u = new TextEncoder().encode(i);
      const v = new TextEncoder().encode(j);
      const w = new Uint8Array([1, u.length, ...u, v.length, ...v]);
      await n.write(w);
      q = await o.read();
      if (q.done || new Uint8Array(q.value)[1] !== 0) {
        throw new Error("S5 authentication failed");
      }
    } else if (r !== 0) {
      throw new Error("S5 unsupported auth method: " + r);
    }
    const s = new TextEncoder().encode(c);
    const t = new Uint8Array([5, 1, 0, 3, s.length, ...s, f >> 8, f & 255]);
    await n.write(t);
    q = await o.read();
    if (q.done || new Uint8Array(q.value)[1] !== 0) {
      throw new Error("S5 connection failed");
    }
    if (validDataLength(g) > 0) {
      await n.write(g);
    }
    n.releaseLock();
    o.releaseLock();
    return m;
  } catch (x) {
    try {
      n.releaseLock();
    } catch (y) {}
    try {
      o.releaseLock();
    } catch (z) {}
    try {
      m.close();
    } catch (A) {}
    throw x;
  }
}
async function httpConnect(c, f, g, h = false, i) {
  const {
    username: j,
    password: k,
    hostname: l,
    port: m,
  } = parsedSocks5Address;
  const n = h
    ? i(
        {
          hostname: l,
          port: m,
        },
        {
          secureTransport: "on",
          allowHalfOpen: false,
        },
      )
    : i({
        hostname: l,
        port: m,
      });
  const o = n.writable.getWriter();
  const p = n.readable.getReader();
  const q = new TextEncoder();
  const r = new TextDecoder();
  try {
    if (h) {
      await n.opened;
    }
    const s =
      j && k ? "Proxy-Authorization: Basic " + btoa(j + ":" + k) + "\r\n" : "";
    const t =
      "CONNECT " +
      c +
      ":" +
      f +
      " HTTP/1.1\r\nHost: " +
      c +
      ":" +
      f +
      "\r\n" +
      s +
      "User-Agent: Mozilla/5.0\r\nConnection: keep-alive\r\n\r\n";
    await o.write(q.encode(t));
    o.releaseLock();
    let u = new Uint8Array(0);
    let v = -1;
    let w = 0;
    while (v === -1 && w < 8192) {
      const { done: z, value: A } = await p.read();
      if (z || !A) {
        throw new Error(
          (h ? "HTTPS" : "HTTP") +
            " proxyReturn CONNECT responseBeforeCloseConnection",
        );
      }
      u = new Uint8Array([...u, ...A]);
      w = u.length;
      const B = u.findIndex(
        (C, D) =>
          D < u.length - 3 &&
          u[D] === 13 &&
          u[D + 1] === 10 &&
          u[D + 2] === 13 &&
          u[D + 3] === 10,
      );
      if (B !== -1) {
        v = B + 4;
      }
    }
    if (v === -1) {
      throw new Error("proxy CONNECT responseHeadersTooLongOrInvalid");
    }
    const x = r
      .decode(u.slice(0, v))
      .split("\r\n")[0]
      .match(/HTTP\/\d\.\d\s+(\d+)/);
    const y = x ? parseInt(x[1], 10) : NaN;
    if (!Number.isFinite(y) || y < 200 || y >= 300) {
      throw new Error("Connection failed: HTTP " + y);
    }
    p.releaseLock();
    if (validDataLength(g) > 0) {
      const C = n.writable.getWriter();
      await C.write(g);
      C.releaseLock();
    }
    if (w > v) {
      const { readable: D, writable: E } = new TransformStream();
      const F = E.getWriter();
      await F.write(u.subarray(v, w));
      F.releaseLock();
      n.readable.pipeTo(E).catch(() => {});
      return {
        readable: D,
        writable: n.writable,
        closed: n.closed,
        close: () => n.close(),
      };
    }
    return n;
  } catch (G) {
    try {
      o.releaseLock();
    } catch (H) {}
    try {
      p.releaseLock();
    } catch (I) {}
    try {
      n.close();
    } catch (J) {}
    throw G;
  }
}
async function httpsConnect(c, f, g, h) {
  const {
    username: i,
    password: j,
    hostname: k,
    port: l,
  } = parsedSocks5Address;
  const m = new TextEncoder();
  const n = new TextDecoder();
  let o = null;
  const p = isIPHostname(k) ? "" : stripIPv6Brackets(k);
  const q = async (r = false) => {
    const s = h({
      hostname: k,
      port: l,
    });
    try {
      await s.opened;
      const t = new TlsClient(s, {
        serverName: p,
        insecure: true,
        allowChacha: r,
      });
      await t.handshake();
      log(
        "[HTTPSproxy] TLSversion: " +
          (t.isTls13 ? "1.3" : "1.2") +
          " | Cipher: 0x" +
          t.cipherSuite.toString(16) +
          (t.cipherConfig?.chacha ? " (ChaCha20)" : " (AES-GCM)"),
      );
      return t;
    } catch (u) {
      try {
        s.close();
      } catch (v) {}
      throw u;
    }
  };
  try {
    try {
      o = await q(false);
    } catch (H) {
      if (
        !/cipher|handshake|TLS Alert|ServerHello|Finished|Unsupported|Missing TLS/i.test(
          H?.message || "" + (H || ""),
        )
      ) {
        throw H;
      }
      log(
        "[HTTPSproxy] AES-GCM TLS handshakeFailed，fallback ChaCha20 compatMode: " +
          (H?.message || H),
      );
      o = await q(true);
    }
    const r =
      i && j ? "Proxy-Authorization: Basic " + btoa(i + ":" + j) + "\r\n" : "";
    const s =
      "CONNECT " +
      c +
      ":" +
      f +
      " HTTP/1.1\r\nHost: " +
      c +
      ":" +
      f +
      "\r\n" +
      r +
      "User-Agent: Mozilla/5.0\r\nConnection: keep-alive\r\n\r\n";
    await o.write(m.encode(s));
    let t = new Uint8Array(0);
    let u = -1;
    let v = 0;
    while (u === -1 && v < 8192) {
      const I = await o.read();
      if (!I) {
        throw new Error(
          "HTTPS proxyReturn CONNECT responseBeforeCloseConnection",
        );
      }
      t = concatByteData(t, I);
      v = t.length;
      const J = t.findIndex(
        (K, L) =>
          L < t.length - 3 &&
          t[L] === 13 &&
          t[L + 1] === 10 &&
          t[L + 2] === 13 &&
          t[L + 3] === 10,
      );
      if (J !== -1) {
        u = J + 4;
      }
    }
    if (u === -1) {
      throw new Error("HTTPS proxy CONNECT responseHeadersTooLongOrInvalid");
    }
    const w = n
      .decode(t.slice(0, u))
      .split("\r\n")[0]
      .match(/HTTP\/\d\.\d\s+(\d+)/);
    const x = w ? parseInt(w[1], 10) : NaN;
    if (!Number.isFinite(x) || x < 200 || x >= 300) {
      throw new Error("Connection failed: HTTP " + x);
    }
    if (validDataLength(g) > 0) {
      await o.write(dataToUint8Array(g));
    }
    const y = v > u ? t.subarray(u, v) : null;
    let z = false;
    let A;
    let B;
    const C = (K, L) => {
      if (!z) {
        z = true;
        K(L);
      }
    };
    const D = new Promise((K, L) => {
      A = K;
      B = L;
    });
    const E = () => {
      try {
        o.close();
      } catch (K) {}
      C(A);
    };
    const F = new ReadableStream({
      async start(K) {
        try {
          if (validDataLength(y) > 0) {
            K.enqueue(y);
          }
          while (true) {
            const L = await o.read();
            if (!L) {
              break;
            }
            if (L.byteLength > 0) {
              K.enqueue(L);
            }
          }
          try {
            K.close();
          } catch (M) {}
          C(A);
        } catch (N) {
          try {
            K.error(N);
          } catch (O) {}
          C(B, N);
        }
      },
      cancel() {
        E();
      },
    });
    const G = new WritableStream({
      async write(K) {
        await o.write(dataToUint8Array(K));
      },
      close: E,
      abort(K) {
        E();
        if (K) {
          C(B, K);
        }
      },
    });
    return {
      readable: F,
      writable: G,
      closed: D,
      close: E,
    };
  } catch (K) {
    try {
      o?.close();
    } catch (L) {}
    throw K;
  }
}
function createRequestTcpConnector(c) {
  const f = c;
  const g = f?.fetcher;
  if (g && typeof g.connect === "function") {
    return (h, i) => (i === undefined ? g.connect(h) : g.connect(h, i));
  }
  if (typeof cfSocketConnect === "function") {
    return (h, i) =>
      i === undefined ? cfSocketConnect(h) : cfSocketConnect(h, i);
  }
  throw new Error(
    "No TCP connect API available (request.fetcher.connect / cloudflare:sockets)",
  );
}
const TLS_VERSION_10 = 769;
const TLS_VERSION_12 = 771;
const TLS_VERSION_13 = 772;
const CONTENT_TYPE_CHANGE_CIPHER_SPEC = 20;
const CONTENT_TYPE_ALERT = 21;
const CONTENT_TYPE_HANDSHAKE = 22;
const CONTENT_TYPE_APPLICATION_DATA = 23;
const HANDSHAKE_TYPE_CLIENT_HELLO = 1;
const HANDSHAKE_TYPE_SERVER_HELLO = 2;
const HANDSHAKE_TYPE_NEW_SESSION_TICKET = 4;
const HANDSHAKE_TYPE_ENCRYPTED_EXTENSIONS = 8;
const HANDSHAKE_TYPE_CERTIFICATE = 11;
const HANDSHAKE_TYPE_SERVER_KEY_EXCHANGE = 12;
const HANDSHAKE_TYPE_CERTIFICATE_REQUEST = 13;
const HANDSHAKE_TYPE_SERVER_HELLO_DONE = 14;
const HANDSHAKE_TYPE_CERTIFICATE_VERIFY = 15;
const HANDSHAKE_TYPE_CLIENT_KEY_EXCHANGE = 16;
const HANDSHAKE_TYPE_FINISHED = 20;
const HANDSHAKE_TYPE_KEY_UPDATE = 24;
const EXT_SERVER_NAME = 0;
const EXT_SUPPORTED_GROUPS = 10;
const EXT_EC_POINT_FORMATS = 11;
const EXT_SIGNATURE_ALGORITHMS = 13;
const EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION = 16;
const EXT_SUPPORTED_VERSIONS = 43;
const EXT_PSK_KEY_EXCHANGE_MODES = 45;
const EXT_KEY_SHARE = 51;
const ALERT_CLOSE_NOTIFY = 0;
const ALERT_LEVEL_WARNING = 1;
const ALERT_UNRECOGNIZED_NAME = 112;
const shouldIgnoreTlsAlert = (c) =>
  c?.[0] === ALERT_LEVEL_WARNING && c?.[1] === ALERT_UNRECOGNIZED_NAME;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const EMPTY_BYTES = new Uint8Array(0);
const CIPHER_SUITES_BY_ID = new Map([
  [
    4865,
    {
      id: 4865,
      keyLen: 16,
      ivLen: 12,
      hash: "SHA-256",
      tls13: true,
    },
  ],
  [
    4866,
    {
      id: 4866,
      keyLen: 32,
      ivLen: 12,
      hash: "SHA-384",
      tls13: true,
    },
  ],
  [
    4867,
    {
      id: 4867,
      keyLen: 32,
      ivLen: 12,
      hash: "SHA-256",
      tls13: true,
      chacha: true,
    },
  ],
  [
    49199,
    {
      id: 49199,
      keyLen: 16,
      ivLen: 4,
      hash: "SHA-256",
      kex: "ECDHE",
    },
  ],
  [
    49200,
    {
      id: 49200,
      keyLen: 32,
      ivLen: 4,
      hash: "SHA-384",
      kex: "ECDHE",
    },
  ],
  [
    52392,
    {
      id: 52392,
      keyLen: 32,
      ivLen: 12,
      hash: "SHA-256",
      kex: "ECDHE",
      chacha: true,
    },
  ],
  [
    49195,
    {
      id: 49195,
      keyLen: 16,
      ivLen: 4,
      hash: "SHA-256",
      kex: "ECDHE",
    },
  ],
  [
    49196,
    {
      id: 49196,
      keyLen: 32,
      ivLen: 4,
      hash: "SHA-384",
      kex: "ECDHE",
    },
  ],
  [
    52393,
    {
      id: 52393,
      keyLen: 32,
      ivLen: 12,
      hash: "SHA-256",
      kex: "ECDHE",
      chacha: true,
    },
  ],
]);
const GROUPS_BY_ID = new Map([
  [29, "X25519"],
  [23, "P-256"],
]);
const SUPPORTED_SIGNATURE_ALGORITHMS = [
  2052, 2053, 2054, 1025, 1281, 1537, 1027, 1283, 1539,
];
const tlsBytes = (...c) => {
  const f = (g) =>
    g.flatMap((h) =>
      h instanceof Uint8Array
        ? [...h]
        : Array.isArray(h)
          ? f(h)
          : typeof h == "number"
            ? [h]
            : [],
    );
  return new Uint8Array(f(c));
};
const uint16be = (c) => [(c >> 8) & 255, c & 255];
const readUint16 = (c, f) => (c[f] << 8) | c[f + 1];
const readUint24 = (c, f) => (c[f] << 16) | (c[f + 1] << 8) | c[f + 2];
const concatBytes = (...c) => {
  const f = c.filter((j) => j && j.length > 0);
  const g = f.reduce((j, k) => j + k.length, 0);
  const h = new Uint8Array(g);
  let i = 0;
  for (const j of f) {
    h.set(j, i);
    i += j.length;
  }
  return h;
};
const randomBytes = (c) => crypto.getRandomValues(new Uint8Array(c));
const constantTimeEqual = (c, f) => {
  if (!c || !f || c.length !== f.length) {
    return false;
  }
  let g = 0;
  for (let h = 0; h < c.length; h++) {
    g |= c[h] ^ f[h];
  }
  return g === 0;
};
const hashByteLength = (c) =>
  c === "SHA-512" ? 64 : c === "SHA-384" ? 48 : 32;
async function hmac(c, f, g) {
  const h = await crypto.subtle.importKey(
    "raw",
    f,
    {
      name: "HMAC",
      hash: c,
    },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", h, g));
}
async function digestBytes(c, f) {
  return new Uint8Array(await crypto.subtle.digest(c, f));
}
async function tls12Prf(c, f, g, h, i = "SHA-256") {
  const j = concatBytes(textEncoder.encode(f), g);
  let k = new Uint8Array(0);
  let l = j;
  while (k.length < h) {
    l = await hmac(i, c, l);
    const m = await hmac(i, c, concatBytes(l, j));
    k = concatBytes(k, m);
  }
  return k.slice(0, h);
}
async function hkdfExtract(c, f, g) {
  if (!f || !f.length) {
    f = new Uint8Array(hashByteLength(c));
  }
  return hmac(c, f, g);
}
async function hkdfExpandLabel(c, f, g, h, i) {
  const j = textEncoder.encode("tls13 " + g);
  return (async function (k, l, m, n) {
    const o = hashByteLength(k);
    const p = Math.ceil(n / o);
    let q = new Uint8Array(0);
    let r = new Uint8Array(0);
    for (let s = 1; s <= p; s++) {
      r = await hmac(k, l, concatBytes(r, m, [s]));
      q = concatBytes(q, r);
    }
    return q.slice(0, n);
  })(c, f, tlsBytes(uint16be(i), j.length, j, h.length, h), i);
}
async function generateKeyShare(c = "P-256") {
  const f =
    c === "X25519"
      ? {
          name: "X25519",
        }
      : {
          name: "ECDH",
          namedCurve: c,
        };
  const g = await crypto.subtle.generateKey(f, true, ["deriveBits"]);
  const h = await crypto.subtle.exportKey("raw", g.publicKey);
  return {
    keyPair: g,
    publicKeyRaw: new Uint8Array(h),
  };
}
async function deriveSharedSecret(c, f, g = "P-256") {
  const h =
    g === "X25519"
      ? {
          name: "X25519",
        }
      : {
          name: "ECDH",
          namedCurve: g,
        };
  const i = await crypto.subtle.importKey("raw", f, h, false, []);
  const j = g === "P-384" ? 384 : g === "P-521" ? 528 : 256;
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: h.name,
        public: i,
      },
      c,
      j,
    ),
  );
}
async function importAesGcmKey(c, f) {
  return crypto.subtle.importKey(
    "raw",
    c,
    {
      name: "AES-GCM",
    },
    false,
    f,
  );
}
async function aesGcmEncryptWithKey(c, f, g, h) {
  return new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: f,
        additionalData: h,
        tagLength: 128,
      },
      c,
      g,
    ),
  );
}
async function aesGcmDecryptWithKey(c, f, g, h) {
  return new Uint8Array(
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: f,
        additionalData: h,
        tagLength: 128,
      },
      c,
      g,
    ),
  );
}
function rotateLeft32(c, f) {
  return ((c << f) | (c >>> (32 - f))) >>> 0;
}
function chachaQuarterRound(c, f, g, h, i) {
  c[f] = (c[f] + c[g]) >>> 0;
  c[i] = rotateLeft32(c[i] ^ c[f], 16);
  c[h] = (c[h] + c[i]) >>> 0;
  c[g] = rotateLeft32(c[g] ^ c[h], 12);
  c[f] = (c[f] + c[g]) >>> 0;
  c[i] = rotateLeft32(c[i] ^ c[f], 8);
  c[h] = (c[h] + c[i]) >>> 0;
  c[g] = rotateLeft32(c[g] ^ c[h], 7);
}
function chacha20Block(c, f, g) {
  const h = new Uint32Array(16);
  h[0] = 1634760805;
  h[1] = 857760878;
  h[2] = 2036477234;
  h[3] = 1797285236;
  const i = new DataView(c.buffer, c.byteOffset, c.byteLength);
  for (let l = 0; l < 8; l++) {
    h[4 + l] = i.getUint32(l * 4, true);
  }
  h[12] = f;
  const j = new DataView(g.buffer, g.byteOffset, g.byteLength);
  h[13] = j.getUint32(0, true);
  h[14] = j.getUint32(4, true);
  h[15] = j.getUint32(8, true);
  const k = new Uint32Array(h);
  for (let m = 0; m < 10; m++) {
    chachaQuarterRound(k, 0, 4, 8, 12);
    chachaQuarterRound(k, 1, 5, 9, 13);
    chachaQuarterRound(k, 2, 6, 10, 14);
    chachaQuarterRound(k, 3, 7, 11, 15);
    chachaQuarterRound(k, 0, 5, 10, 15);
    chachaQuarterRound(k, 1, 6, 11, 12);
    chachaQuarterRound(k, 2, 7, 8, 13);
    chachaQuarterRound(k, 3, 4, 9, 14);
  }
  for (let n = 0; n < 16; n++) {
    k[n] = (k[n] + h[n]) >>> 0;
  }
  return new Uint8Array(k.buffer.slice(0));
}
function chacha20Xor(c, f, g) {
  const h = new Uint8Array(g.length);
  let i = 1;
  for (let j = 0; j < g.length; j += 64) {
    const k = chacha20Block(c, i++, f);
    const l = Math.min(64, g.length - j);
    for (let m = 0; m < l; m++) {
      h[j + m] = g[j + m] ^ k[m];
    }
  }
  return h;
}
function poly1305Mac(c, f) {
  const g = (function (m) {
    const n = new Uint8Array(m);
    n[3] &= 15;
    n[7] &= 15;
    n[11] &= 15;
    n[15] &= 15;
    n[4] &= 252;
    n[8] &= 252;
    n[12] &= 252;
    return n;
  })(c.slice(0, 16));
  const h = c.slice(16, 32);
  let i = [0x0n, 0x0n, 0x0n, 0x0n, 0x0n];
  const j = [
    0x3ffffffn & BigInt(g[0] | (g[1] << 8) | (g[2] << 16) | (g[3] << 24)),
    0x3ffffffn &
      BigInt((g[3] >> 2) | (g[4] << 6) | (g[5] << 14) | (g[6] << 22)),
    0x3ffffffn &
      BigInt((g[6] >> 4) | (g[7] << 4) | (g[8] << 12) | (g[9] << 20)),
    0x3ffffffn &
      BigInt((g[9] >> 6) | (g[10] << 2) | (g[11] << 10) | (g[12] << 18)),
    0x3ffffffn & BigInt(g[13] | (g[14] << 8) | (g[15] << 16)),
  ];
  for (let m = 0; m < f.length; m += 16) {
    const n = f.slice(m, m + 16);
    const o = new Uint8Array(17);
    o.set(n);
    o[n.length] = 1;
    i[0] += BigInt(o[0] | (o[1] << 8) | (o[2] << 16) | ((o[3] & 3) << 24));
    i[1] += BigInt(
      (o[3] >> 2) | (o[4] << 6) | (o[5] << 14) | ((o[6] & 15) << 22),
    );
    i[2] += BigInt(
      (o[6] >> 4) | (o[7] << 4) | (o[8] << 12) | ((o[9] & 63) << 20),
    );
    i[3] += BigInt((o[9] >> 6) | (o[10] << 2) | (o[11] << 10) | (o[12] << 18));
    i[4] += BigInt(o[13] | (o[14] << 8) | (o[15] << 16) | (o[16] << 24));
    const p = [0x0n, 0x0n, 0x0n, 0x0n, 0x0n];
    for (let r = 0; r < 5; r++) {
      for (let s = 0; s < 5; s++) {
        const t = r + s;
        if (t < 5) {
          p[t] += i[r] * j[s];
        } else {
          p[t - 5] += i[r] * j[s] * 0x5n;
        }
      }
    }
    let q = 0x0n;
    for (let u = 0; u < 5; u++) {
      p[u] += q;
      i[u] = 0x3ffffffn & p[u];
      q = p[u] >> 0x1an;
    }
    i[0] += 0x5n * q;
    q = i[0] >> 0x1an;
    i[0] &= 0x3ffffffn;
    i[1] += q;
  }
  let k =
    i[0] |
    (i[1] << 0x1an) |
    (i[2] << 0x34n) |
    (i[3] << 0x4en) |
    (i[4] << 0x68n);
  k =
    (k + h.reduce((v, w, x) => v + (BigInt(w) << BigInt(x * 8)), 0x0n)) &
    ((0x1n << 0x80n) - 0x1n);
  const l = new Uint8Array(16);
  for (let v = 0; v < 16; v++) {
    l[v] = Number((k >> BigInt(v * 8)) & 0xffn);
  }
  return l;
}
function chacha20Poly1305Encrypt(c, f, g, h) {
  const i = chacha20Block(c, 0, f).slice(0, 32);
  const j = chacha20Xor(c, f, g);
  const k = (16 - (h.length % 16)) % 16;
  const l = (16 - (j.length % 16)) % 16;
  const m = new Uint8Array(h.length + k + j.length + l + 16);
  m.set(h, 0);
  m.set(j, h.length + k);
  const n = new DataView(m.buffer, h.length + k + j.length + l);
  n.setBigUint64(0, BigInt(h.length), true);
  n.setBigUint64(8, BigInt(j.length), true);
  const o = poly1305Mac(i, m);
  return concatBytes(j, o);
}
function chacha20Poly1305Decrypt(c, f, g, h) {
  if (g.length < 16) {
    throw new Error("Ciphertext too short");
  }
  const i = g.slice(-16);
  const j = g.slice(0, -16);
  const k = chacha20Block(c, 0, f).slice(0, 32);
  const l = (16 - (h.length % 16)) % 16;
  const m = (16 - (j.length % 16)) % 16;
  const n = new Uint8Array(h.length + l + j.length + m + 16);
  n.set(h, 0);
  n.set(j, h.length + l);
  const o = new DataView(n.buffer, h.length + l + j.length + m);
  o.setBigUint64(0, BigInt(h.length), true);
  o.setBigUint64(8, BigInt(j.length), true);
  const p = poly1305Mac(k, n);
  let q = 0;
  for (let r = 0; r < 16; r++) {
    q |= i[r] ^ p[r];
  }
  if (q !== 0) {
    throw new Error("ChaCha20-Poly1305 authentication failed");
  }
  return chacha20Xor(c, f, j);
}
const TLS_MAX_PLAINTEXT_FRAGMENT = 16384;
function buildTlsRecord(c, f, g = TLS_VERSION_12) {
  const h = dataToUint8Array(f);
  const i = new Uint8Array(5 + h.byteLength);
  i[0] = c;
  i[1] = (g >> 8) & 255;
  i[2] = g & 255;
  i[3] = (h.byteLength >> 8) & 255;
  i[4] = h.byteLength & 255;
  i.set(h, 5);
  return i;
}
function buildHandshakeMessage(c, f) {
  return tlsBytes(
    c,
    ((g) => [(g >> 16) & 255, (g >> 8) & 255, g & 255])(f.length),
    f,
  );
}
class TlsRecordParser {
  constructor() {
    this.buffer = new Uint8Array(0);
  }
  feed(c) {
    const f = dataToUint8Array(c);
    this.buffer = this.buffer.length ? concatBytes(this.buffer, f) : f;
  }
  next() {
    if (this.buffer.length < 5) {
      return null;
    }
    const c = this.buffer[0];
    const f = readUint16(this.buffer, 1);
    const g = readUint16(this.buffer, 3);
    if (this.buffer.length < 5 + g) {
      return null;
    }
    const h = this.buffer.subarray(5, 5 + g);
    this.buffer = this.buffer.subarray(5 + g);
    return {
      type: c,
      version: f,
      length: g,
      fragment: h,
    };
  }
}
class TlsHandshakeParser {
  constructor() {
    this.buffer = new Uint8Array(0);
  }
  feed(c) {
    const f = dataToUint8Array(c);
    this.buffer = this.buffer.length ? concatBytes(this.buffer, f) : f;
  }
  next() {
    if (this.buffer.length < 4) {
      return null;
    }
    const c = this.buffer[0];
    const f = readUint24(this.buffer, 1);
    if (this.buffer.length < 4 + f) {
      return null;
    }
    const g = this.buffer.subarray(4, 4 + f);
    const h = this.buffer.subarray(0, 4 + f);
    this.buffer = this.buffer.subarray(4 + f);
    return {
      type: c,
      length: f,
      body: g,
      raw: h,
    };
  }
}
function parseServerHello(c) {
  let f = 0;
  const g = readUint16(c, f);
  f += 2;
  const h = c.slice(f, f + 32);
  f += 32;
  const i = c[f++];
  const j = c.slice(f, f + i);
  f += i;
  const k = readUint16(c, f);
  f += 2;
  const l = c[f++];
  let m = g;
  let n = null;
  let o = null;
  if (f < c.length) {
    const q = readUint16(c, f);
    f += 2;
    const r = f + q;
    while (f + 4 <= r) {
      const s = readUint16(c, f);
      f += 2;
      const t = readUint16(c, f);
      f += 2;
      const u = c.slice(f, f + t);
      f += t;
      if (s === EXT_SUPPORTED_VERSIONS && t >= 2) {
        m = readUint16(u, 0);
      } else if (s === EXT_KEY_SHARE && t >= 4) {
        const v = readUint16(u, 0);
        const w = readUint16(u, 2);
        n = {
          group: v,
          key: u.slice(4, 4 + w),
        };
      } else if (s === EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION && t >= 3) {
        o = textDecoder.decode(u.slice(3, 3 + u[2]));
      }
    }
  }
  const p = new Uint8Array([
    207, 33, 173, 116, 229, 154, 97, 17, 190, 29, 140, 2, 30, 101, 184, 145,
    194, 162, 17, 22, 122, 187, 140, 94, 7, 158, 9, 226, 200, 168, 51, 156,
  ]);
  return {
    version: g,
    serverRandom: h,
    sessionId: j,
    cipherSuite: k,
    compression: l,
    selectedVersion: m,
    keyShare: n,
    alpn: o,
    isHRR: constantTimeEqual(h, p),
    isTls13: m === TLS_VERSION_13,
  };
}
function parseServerKeyExchange(c) {
  let f = 1;
  const g = readUint16(c, f);
  f += 2;
  const h = c[f++];
  return {
    namedCurve: g,
    serverPublicKey: c.slice(f, f + h),
  };
}
function extractLeafCertificate(c, f = 0) {
  let g = 0;
  if (f) {
    const j = c[g++];
    g += j;
  }
  if (g + 3 > c.length) {
    return null;
  }
  const h = readUint24(c, g);
  g += 3;
  if (!h || g + 3 > c.length) {
    return null;
  }
  const i = readUint24(c, g);
  g += 3;
  if (i) {
    return c.slice(g, g + i);
  } else {
    return null;
  }
}
function parseEncryptedExtensions(c) {
  const f = {
    alpn: null,
  };
  let g = 2;
  const h = 2 + readUint16(c, 0);
  while (g + 4 <= h) {
    const i = readUint16(c, g);
    g += 2;
    const j = readUint16(c, g);
    g += 2;
    if (i === EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION && j >= 3) {
      const k = c[g + 2];
      if (k > 0 && g + 3 + k <= g + j) {
        f.alpn = textDecoder.decode(c.slice(g + 3, g + 3 + k));
      }
    }
    g += j;
  }
  return f;
}
function buildClientHello(
  c,
  f,
  g,
  { tls13: h = true, tls12: i = true, alpn = null, chacha = true } = {},
) {
  const j = [];
  if (h) {
    j.push(4865, 4866, ...(chacha ? [4867] : []));
  }
  if (i) {
    j.push(49199, 49200, 49195, 49196, ...(chacha ? [52392, 52393] : []));
  }
  const k = tlsBytes(...j.flatMap(uint16be));
  const l = [tlsBytes(255, 1, 0, 1, 0)];
  if (f) {
    const p = textEncoder.encode(f);
    const q = tlsBytes(0, uint16be(p.length), p);
    l.push(
      tlsBytes(
        uint16be(EXT_SERVER_NAME),
        uint16be(q.length + 2),
        uint16be(q.length),
        q,
      ),
    );
  }
  l.push(tlsBytes(uint16be(EXT_EC_POINT_FORMATS), 0, 2, 1, 0));
  l.push(tlsBytes(uint16be(EXT_SUPPORTED_GROUPS), 0, 6, 0, 4, 0, 29, 0, 23));
  const m = tlsBytes(...SUPPORTED_SIGNATURE_ALGORITHMS.flatMap(uint16be));
  l.push(
    tlsBytes(
      uint16be(EXT_SIGNATURE_ALGORITHMS),
      uint16be(m.length + 2),
      uint16be(m.length),
      m,
    ),
  );
  const n = Array.isArray(alpn) ? alpn.filter(Boolean) : alpn ? [alpn] : [];
  if (n.length) {
    const r = concatBytes(
      ...n.map((s) => {
        const t = textEncoder.encode(s);
        return tlsBytes(t.length, t);
      }),
    );
    l.push(
      tlsBytes(
        uint16be(EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION),
        uint16be(r.length + 2),
        uint16be(r.length),
        r,
      ),
    );
  }
  if (h && g) {
    let s;
    l.push(
      i
        ? tlsBytes(uint16be(EXT_SUPPORTED_VERSIONS), 0, 5, 4, 3, 4, 3, 3)
        : tlsBytes(uint16be(EXT_SUPPORTED_VERSIONS), 0, 3, 2, 3, 4),
    );
    l.push(tlsBytes(uint16be(EXT_PSK_KEY_EXCHANGE_MODES), 0, 2, 1, 1));
    if (g?.x25519 && g?.p256) {
      s = concatBytes(
        tlsBytes(0, 29, uint16be(g.x25519.length), g.x25519),
        tlsBytes(0, 23, uint16be(g.p256.length), g.p256),
      );
    } else if (g?.x25519) {
      s = tlsBytes(0, 29, uint16be(g.x25519.length), g.x25519);
    } else if (g?.p256) {
      s = tlsBytes(0, 23, uint16be(g.p256.length), g.p256);
    } else {
      if (!(g instanceof Uint8Array)) {
        throw new Error("Invalid keyShares");
      }
      s = tlsBytes(0, 23, uint16be(g.length), g);
    }
    l.push(
      tlsBytes(
        uint16be(EXT_KEY_SHARE),
        uint16be(s.length + 2),
        uint16be(s.length),
        s,
      ),
    );
  }
  const o = concatBytes(...l);
  return buildHandshakeMessage(
    HANDSHAKE_TYPE_CLIENT_HELLO,
    tlsBytes(
      uint16be(TLS_VERSION_12),
      c,
      0,
      uint16be(k.length),
      k,
      1,
      0,
      uint16be(o.length),
      o,
    ),
  );
}
const uint64be = (c) => {
  const f = new Uint8Array(8);
  new DataView(f.buffer).setBigUint64(0, c, false);
  return f;
};
const xorSequenceIntoIv = (c, f) => {
  const g = c.slice();
  const h = uint64be(f);
  for (let i = 0; i < 8; i++) {
    g[g.length - 8 + i] ^= h[i];
  }
  return g;
};
const deriveTrafficKeys = (c, f, g, h) =>
  Promise.all([
    hkdfExpandLabel(c, f, "key", EMPTY_BYTES, g),
    hkdfExpandLabel(c, f, "iv", EMPTY_BYTES, h),
  ]);
class TlsClient {
  constructor(c, f = {}) {
    this.socket = c;
    this.serverName = f.serverName || "";
    this.supportTls13 = f.tls13 !== false;
    this.supportTls12 = f.tls12 !== false;
    if (!this.supportTls13 && !this.supportTls12) {
      throw new Error("At least one TLS version must be enabled");
    }
    this.alpnProtocols = Array.isArray(f.alpn)
      ? f.alpn
      : f.alpn
        ? [f.alpn]
        : null;
    this.allowChacha = f.allowChacha !== false;
    this.timeout = f.timeout ?? 30000;
    this.clientRandom = randomBytes(32);
    this.serverRandom = null;
    this.handshakeChunks = [];
    this.handshakeComplete = false;
    this.negotiatedAlpn = null;
    this.cipherSuite = null;
    this.cipherConfig = null;
    this.isTls13 = false;
    this.masterSecret = null;
    this.handshakeSecret = null;
    this.clientWriteKey = null;
    this.serverWriteKey = null;
    this.clientWriteIv = null;
    this.serverWriteIv = null;
    this.clientHandshakeKey = null;
    this.serverHandshakeKey = null;
    this.clientHandshakeIv = null;
    this.serverHandshakeIv = null;
    this.clientAppKey = null;
    this.serverAppKey = null;
    this.clientAppIv = null;
    this.serverAppIv = null;
    this.clientWriteCryptoKey = null;
    this.serverWriteCryptoKey = null;
    this.clientHandshakeCryptoKey = null;
    this.serverHandshakeCryptoKey = null;
    this.clientAppCryptoKey = null;
    this.serverAppCryptoKey = null;
    this.clientSeqNum = 0x0n;
    this.serverSeqNum = 0x0n;
    this.recordParser = new TlsRecordParser();
    this.handshakeParser = new TlsHandshakeParser();
    this.keyPairs = new Map();
    this.ecdhKeyPair = null;
    this.sawCert = false;
  }
  recordHandshake(c) {
    this.handshakeChunks.push(c);
  }
  transcript() {
    if (this.handshakeChunks.length === 1) {
      return this.handshakeChunks[0];
    } else {
      return concatBytes(...this.handshakeChunks);
    }
  }
  getCipherConfig(c) {
    return CIPHER_SUITES_BY_ID.get(c) || null;
  }
  async readChunk(c) {
    if (this.timeout) {
      return Promise.race([
        c.read(),
        new Promise((f, g) =>
          setTimeout(() => g(new Error("TLS read timeout")), this.timeout),
        ),
      ]);
    } else {
      return c.read();
    }
  }
  async readRecordsUntil(c, f, g) {
    while (true) {
      let h;
      while ((h = this.recordParser.next())) {
        if (await f(h)) {
          return;
        }
      }
      const { value: i, done: j } = await this.readChunk(c);
      if (j) {
        throw new Error(g);
      }
      this.recordParser.feed(i);
    }
  }
  async readHandshakeUntil(c, f, g) {
    for (let h; (h = this.handshakeParser.next());) {
      if (await f(h)) {
        return;
      }
    }
    return this.readRecordsUntil(
      c,
      async (i) => {
        if (i.type === CONTENT_TYPE_ALERT) {
          if (shouldIgnoreTlsAlert(i.fragment)) {
            return;
          }
          throw new Error("TLS Alert: " + i.fragment[1]);
        }
        if (i.type === CONTENT_TYPE_HANDSHAKE) {
          this.handshakeParser.feed(i.fragment);
          for (let j; (j = this.handshakeParser.next());) {
            if (await f(j)) {
              return 1;
            }
          }
        }
      },
      g,
    );
  }
  async acceptCertificate(c) {
    if (!c?.length) {
      throw new Error("Empty certificate");
    }
    this.sawCert = true;
  }
  async handshake() {
    const [c, f] = await Promise.all([
      generateKeyShare("P-256"),
      generateKeyShare("X25519"),
    ]);
    this.keyPairs = new Map([
      [23, c],
      [29, f],
    ]);
    this.ecdhKeyPair = c.keyPair;
    const g = this.socket.readable.getReader();
    const h = this.socket.writable.getWriter();
    try {
      const i = buildClientHello(
        this.clientRandom,
        this.serverName,
        {
          x25519: f.publicKeyRaw,
          p256: c.publicKeyRaw,
        },
        {
          tls13: this.supportTls13,
          tls12: this.supportTls12,
          alpn: this.alpnProtocols,
          chacha: this.allowChacha,
        },
      );
      this.recordHandshake(i);
      await h.write(buildTlsRecord(CONTENT_TYPE_HANDSHAKE, i, TLS_VERSION_10));
      const j = await this.receiveServerHello(g);
      if (j.isHRR) {
        throw new Error("HelloRetryRequest is not supported by TLSClientMini");
      }
      if (j.keyShare?.group && this.keyPairs.has(j.keyShare.group)) {
        const k = this.keyPairs.get(j.keyShare.group);
        this.ecdhKeyPair = k.keyPair;
      }
      if (j.isTls13) {
        await this.handshakeTls13(g, h, j);
      } else {
        await this.handshakeTls12(g, h);
      }
      this.handshakeComplete = true;
    } finally {
      g.releaseLock();
      h.releaseLock();
    }
  }
  async receiveServerHello(c) {
    while (true) {
      const { value: f, done: g } = await this.readChunk(c);
      if (g) {
        throw new Error("Connection closed waiting for ServerHello");
      }
      let h;
      for (this.recordParser.feed(f); (h = this.recordParser.next());) {
        if (h.type === CONTENT_TYPE_ALERT) {
          if (shouldIgnoreTlsAlert(h.fragment)) {
            continue;
          }
          throw new Error(
            "TLS Alert: level=" + h.fragment[0] + ", desc=" + h.fragment[1],
          );
        }
        if (h.type !== CONTENT_TYPE_HANDSHAKE) {
          continue;
        }
        let i;
        for (
          this.handshakeParser.feed(h.fragment);
          (i = this.handshakeParser.next());
        ) {
          if (i.type !== HANDSHAKE_TYPE_SERVER_HELLO) {
            continue;
          }
          this.recordHandshake(i.raw);
          const j = parseServerHello(i.body);
          this.serverRandom = j.serverRandom;
          this.cipherSuite = j.cipherSuite;
          this.cipherConfig = this.getCipherConfig(j.cipherSuite);
          this.isTls13 = j.isTls13;
          this.negotiatedAlpn = j.alpn || null;
          if (!this.cipherConfig) {
            throw new Error(
              "Unsupported cipher suite: 0x" + j.cipherSuite.toString(16),
            );
          }
          return j;
        }
      }
    }
  }
  async handshakeTls12(c, f) {
    let g = null;
    let h = false;
    await this.readHandshakeUntil(
      c,
      async (u) => {
        switch (u.type) {
          case HANDSHAKE_TYPE_CERTIFICATE: {
            this.recordHandshake(u.raw);
            const v = extractLeafCertificate(u.body, 1);
            if (!v) {
              throw new Error("Missing TLS 1.2 certificate");
            }
            await this.acceptCertificate(v);
            break;
          }
          case HANDSHAKE_TYPE_SERVER_KEY_EXCHANGE:
            this.recordHandshake(u.raw);
            g = parseServerKeyExchange(u.body);
            break;
          case HANDSHAKE_TYPE_SERVER_HELLO_DONE:
            this.recordHandshake(u.raw);
            h = true;
            return 1;
          case HANDSHAKE_TYPE_CERTIFICATE_REQUEST:
            throw new Error("Client certificate is not supported");
          default:
            this.recordHandshake(u.raw);
        }
      },
      "Connection closed during TLS 1.2 handshake",
    );
    if (!this.sawCert) {
      throw new Error("Missing TLS 1.2 leaf certificate");
    }
    const i = g;
    if (!i) {
      throw new Error("Missing TLS 1.2 ServerKeyExchange");
    }
    const j = GROUPS_BY_ID.get(i.namedCurve);
    if (!j) {
      throw new Error(
        "Unsupported named curve: 0x" + i.namedCurve.toString(16),
      );
    }
    const k = this.keyPairs.get(i.namedCurve);
    if (!k) {
      throw new Error(
        "Missing key pair for curve: 0x" + i.namedCurve.toString(16),
      );
    }
    const l = await deriveSharedSecret(
      k.keyPair.privateKey,
      i.serverPublicKey,
      j,
    );
    const m = buildHandshakeMessage(
      HANDSHAKE_TYPE_CLIENT_KEY_EXCHANGE,
      tlsBytes(k.publicKeyRaw.length, k.publicKeyRaw),
    );
    this.recordHandshake(m);
    const n = this.cipherConfig.hash;
    this.masterSecret = await tls12Prf(
      l,
      "master secret",
      concatBytes(this.clientRandom, this.serverRandom),
      48,
      n,
    );
    const o = this.cipherConfig.keyLen;
    const p = this.cipherConfig.ivLen;
    const q = await tls12Prf(
      this.masterSecret,
      "key expansion",
      concatBytes(this.serverRandom, this.clientRandom),
      o * 2 + p * 2,
      n,
    );
    this.clientWriteKey = q.slice(0, o);
    this.serverWriteKey = q.slice(o, o * 2);
    this.clientWriteIv = q.slice(o * 2, o * 2 + p);
    this.serverWriteIv = q.slice(o * 2 + p, o * 2 + p * 2);
    if (!this.cipherConfig.chacha) {
      [this.clientWriteCryptoKey, this.serverWriteCryptoKey] =
        await Promise.all([
          importAesGcmKey(this.clientWriteKey, ["encrypt"]),
          importAesGcmKey(this.serverWriteKey, ["decrypt"]),
        ]);
    }
    await f.write(buildTlsRecord(CONTENT_TYPE_HANDSHAKE, m));
    await f.write(buildTlsRecord(CONTENT_TYPE_CHANGE_CIPHER_SPEC, tlsBytes(1)));
    const r = await tls12Prf(
      this.masterSecret,
      "client finished",
      await digestBytes(n, this.transcript()),
      12,
      n,
    );
    const s = buildHandshakeMessage(HANDSHAKE_TYPE_FINISHED, r);
    this.recordHandshake(s);
    await f.write(
      buildTlsRecord(
        CONTENT_TYPE_HANDSHAKE,
        await this.encryptTls12(s, CONTENT_TYPE_HANDSHAKE),
      ),
    );
    let t = false;
    await this.readRecordsUntil(
      c,
      async (u) => {
        if (u.type === CONTENT_TYPE_ALERT) {
          if (shouldIgnoreTlsAlert(u.fragment)) {
            return;
          }
          throw new Error("TLS Alert: " + u.fragment[1]);
        }
        if (u.type === CONTENT_TYPE_CHANGE_CIPHER_SPEC) {
          t = true;
          return;
        }
        if (u.type !== CONTENT_TYPE_HANDSHAKE || !t) {
          return;
        }
        const v = await this.decryptTls12(u.fragment, CONTENT_TYPE_HANDSHAKE);
        if (v[0] !== HANDSHAKE_TYPE_FINISHED) {
          return;
        }
        const w = readUint24(v, 1);
        const x = v.slice(4, 4 + w);
        const y = await tls12Prf(
          this.masterSecret,
          "server finished",
          await digestBytes(n, this.transcript()),
          12,
          n,
        );
        if (!constantTimeEqual(x, y)) {
          throw new Error("TLS 1.2 server Finished verify failed");
        }
        return 1;
      },
      "Connection closed waiting for TLS 1.2 Finished",
    );
  }
  async handshakeTls13(c, f, g) {
    const h = GROUPS_BY_ID.get(g.keyShare?.group);
    if (!h || !g.keyShare?.key?.length) {
      throw new Error("Missing TLS 1.3 key_share");
    }
    const i = this.cipherConfig.hash;
    const j = hashByteLength(i);
    const k = this.cipherConfig.keyLen;
    const l = this.cipherConfig.ivLen;
    const m = await deriveSharedSecret(
      this.ecdhKeyPair.privateKey,
      g.keyShare.key,
      h,
    );
    const n = await hkdfExtract(i, null, new Uint8Array(j));
    const o = await hkdfExpandLabel(
      i,
      n,
      "derived",
      await digestBytes(i, EMPTY_BYTES),
      j,
    );
    this.handshakeSecret = await hkdfExtract(i, o, m);
    const p = await digestBytes(i, this.transcript());
    const q = await hkdfExpandLabel(
      i,
      this.handshakeSecret,
      "c hs traffic",
      p,
      j,
    );
    const r = await hkdfExpandLabel(
      i,
      this.handshakeSecret,
      "s hs traffic",
      p,
      j,
    );
    [this.clientHandshakeKey, this.clientHandshakeIv] = await deriveTrafficKeys(
      i,
      q,
      k,
      l,
    );
    [this.serverHandshakeKey, this.serverHandshakeIv] = await deriveTrafficKeys(
      i,
      r,
      k,
      l,
    );
    if (!this.cipherConfig.chacha) {
      [this.clientHandshakeCryptoKey, this.serverHandshakeCryptoKey] =
        await Promise.all([
          importAesGcmKey(this.clientHandshakeKey, ["encrypt"]),
          importAesGcmKey(this.serverHandshakeKey, ["decrypt"]),
        ]);
    }
    const s = await hkdfExpandLabel(i, r, "finished", EMPTY_BYTES, j);
    let t = false;
    const u = async (D) => {
      switch (D.type) {
        case HANDSHAKE_TYPE_ENCRYPTED_EXTENSIONS: {
          const E = parseEncryptedExtensions(D.body);
          if (E.alpn) {
            this.negotiatedAlpn = E.alpn;
          }
          this.recordHandshake(D.raw);
          break;
        }
        case HANDSHAKE_TYPE_CERTIFICATE: {
          const F = extractLeafCertificate(D.body);
          if (!F) {
            throw new Error("Missing TLS 1.3 certificate");
          }
          await this.acceptCertificate(F);
          this.recordHandshake(D.raw);
          break;
        }
        case HANDSHAKE_TYPE_CERTIFICATE_REQUEST:
          throw new Error("Client certificate is not supported");
        case HANDSHAKE_TYPE_CERTIFICATE_VERIFY:
          this.recordHandshake(D.raw);
          break;
        case HANDSHAKE_TYPE_FINISHED: {
          const G = await hmac(i, s, await digestBytes(i, this.transcript()));
          if (!constantTimeEqual(G, D.body)) {
            throw new Error("TLS 1.3 server Finished verify failed");
          }
          this.recordHandshake(D.raw);
          t = true;
          break;
        }
        default:
          this.recordHandshake(D.raw);
      }
    };
    await this.readRecordsUntil(
      c,
      async (D) => {
        if (
          D.type === CONTENT_TYPE_CHANGE_CIPHER_SPEC ||
          D.type === CONTENT_TYPE_HANDSHAKE
        ) {
          return;
        }
        if (D.type === CONTENT_TYPE_ALERT) {
          if (shouldIgnoreTlsAlert(D.fragment)) {
            return;
          }
          throw new Error("TLS Alert: " + D.fragment[1]);
        }
        if (D.type !== CONTENT_TYPE_APPLICATION_DATA) {
          return;
        }
        const E = await this.decryptTls13Handshake(D.fragment);
        const F = E[E.length - 1];
        const G = E.slice(0, -1);
        if (F === CONTENT_TYPE_HANDSHAKE) {
          this.handshakeParser.feed(G);
          for (let H; (H = this.handshakeParser.next());) {
            await u(H);
            if (t) {
              return 1;
            }
          }
        }
      },
      "Connection closed during TLS 1.3 handshake",
    );
    const v = await digestBytes(i, this.transcript());
    const w = await hkdfExpandLabel(
      i,
      this.handshakeSecret,
      "derived",
      await digestBytes(i, EMPTY_BYTES),
      j,
    );
    const x = await hkdfExtract(i, w, new Uint8Array(j));
    const y = await hkdfExpandLabel(i, x, "c ap traffic", v, j);
    const z = await hkdfExpandLabel(i, x, "s ap traffic", v, j);
    [this.clientAppKey, this.clientAppIv] = await deriveTrafficKeys(i, y, k, l);
    [this.serverAppKey, this.serverAppIv] = await deriveTrafficKeys(i, z, k, l);
    if (!this.cipherConfig.chacha) {
      [this.clientAppCryptoKey, this.serverAppCryptoKey] = await Promise.all([
        importAesGcmKey(this.clientAppKey, ["encrypt"]),
        importAesGcmKey(this.serverAppKey, ["decrypt"]),
      ]);
    }
    const A = await hkdfExpandLabel(i, q, "finished", EMPTY_BYTES, j);
    const B = await hmac(i, A, await digestBytes(i, this.transcript()));
    const C = buildHandshakeMessage(HANDSHAKE_TYPE_FINISHED, B);
    this.recordHandshake(C);
    await f.write(
      buildTlsRecord(
        CONTENT_TYPE_APPLICATION_DATA,
        await this.encryptTls13Handshake(
          concatBytes(C, [CONTENT_TYPE_HANDSHAKE]),
        ),
      ),
    );
    this.clientSeqNum = 0x0n;
    this.serverSeqNum = 0x0n;
  }
  async encryptTls12(c, f) {
    const g = this.clientSeqNum++;
    const h = uint64be(g);
    const i = concatBytes(h, [f], uint16be(TLS_VERSION_12), uint16be(c.length));
    if (this.cipherConfig.chacha) {
      const k = xorSequenceIntoIv(this.clientWriteIv, g);
      return chacha20Poly1305Encrypt(this.clientWriteKey, k, c, i);
    }
    const j = randomBytes(8);
    if (!this.clientWriteCryptoKey) {
      this.clientWriteCryptoKey = await importAesGcmKey(this.clientWriteKey, [
        "encrypt",
      ]);
    }
    return concatBytes(
      j,
      await aesGcmEncryptWithKey(
        this.clientWriteCryptoKey,
        concatBytes(this.clientWriteIv, j),
        c,
        i,
      ),
    );
  }
  async decryptTls12(c, f) {
    const g = this.serverSeqNum++;
    const h = uint64be(g);
    if (this.cipherConfig.chacha) {
      const k = xorSequenceIntoIv(this.serverWriteIv, g);
      return chacha20Poly1305Decrypt(
        this.serverWriteKey,
        k,
        c,
        concatBytes(h, [f], uint16be(TLS_VERSION_12), uint16be(c.length - 16)),
      );
    }
    const i = c.subarray(0, 8);
    const j = c.subarray(8);
    if (!this.serverWriteCryptoKey) {
      this.serverWriteCryptoKey = await importAesGcmKey(this.serverWriteKey, [
        "decrypt",
      ]);
    }
    return aesGcmDecryptWithKey(
      this.serverWriteCryptoKey,
      concatBytes(this.serverWriteIv, i),
      j,
      concatBytes(h, [f], uint16be(TLS_VERSION_12), uint16be(j.length - 16)),
    );
  }
  async encryptTls13Handshake(c) {
    const f = xorSequenceIntoIv(this.clientHandshakeIv, this.clientSeqNum++);
    const g = tlsBytes(
      CONTENT_TYPE_APPLICATION_DATA,
      3,
      3,
      uint16be(c.length + 16),
    );
    if (this.cipherConfig.chacha) {
      return chacha20Poly1305Encrypt(this.clientHandshakeKey, f, c, g);
    }
    if (!this.clientHandshakeCryptoKey) {
      this.clientHandshakeCryptoKey = await importAesGcmKey(
        this.clientHandshakeKey,
        ["encrypt"],
      );
    }
    return aesGcmEncryptWithKey(this.clientHandshakeCryptoKey, f, c, g);
  }
  async decryptTls13Handshake(c) {
    const f = xorSequenceIntoIv(this.serverHandshakeIv, this.serverSeqNum++);
    const g = tlsBytes(CONTENT_TYPE_APPLICATION_DATA, 3, 3, uint16be(c.length));
    const h = this.cipherConfig.chacha
      ? await chacha20Poly1305Decrypt(this.serverHandshakeKey, f, c, g)
      : await aesGcmDecryptWithKey(
          (this.serverHandshakeCryptoKey ||= await importAesGcmKey(
            this.serverHandshakeKey,
            ["decrypt"],
          )),
          f,
          c,
          g,
        );
    let i = h.length - 1;
    while (i >= 0 && !h[i]) {
      i--;
    }
    if (i < 0) {
      return EMPTY_BYTES;
    } else {
      return h.slice(0, i + 1);
    }
  }
  async encryptTls13(c) {
    const f = concatBytes(c, [CONTENT_TYPE_APPLICATION_DATA]);
    const g = xorSequenceIntoIv(this.clientAppIv, this.clientSeqNum++);
    const h = tlsBytes(
      CONTENT_TYPE_APPLICATION_DATA,
      3,
      3,
      uint16be(f.length + 16),
    );
    if (this.cipherConfig.chacha) {
      return chacha20Poly1305Encrypt(this.clientAppKey, g, f, h);
    }
    if (!this.clientAppCryptoKey) {
      this.clientAppCryptoKey = await importAesGcmKey(this.clientAppKey, [
        "encrypt",
      ]);
    }
    return aesGcmEncryptWithKey(this.clientAppCryptoKey, g, f, h);
  }
  async decryptTls13(c) {
    const f = xorSequenceIntoIv(this.serverAppIv, this.serverSeqNum++);
    const g = tlsBytes(CONTENT_TYPE_APPLICATION_DATA, 3, 3, uint16be(c.length));
    const h = this.cipherConfig.chacha
      ? await chacha20Poly1305Decrypt(this.serverAppKey, f, c, g)
      : await aesGcmDecryptWithKey(
          (this.serverAppCryptoKey ||= await importAesGcmKey(
            this.serverAppKey,
            ["decrypt"],
          )),
          f,
          c,
          g,
        );
    let i = h.length - 1;
    while (i >= 0 && !h[i]) {
      i--;
    }
    if (i < 0) {
      return {
        data: EMPTY_BYTES,
        type: 0,
      };
    }
    return {
      data: h.slice(0, i),
      type: h[i],
    };
  }
  async write(c) {
    if (!this.handshakeComplete) {
      throw new Error("Handshake not complete");
    }
    const f = dataToUint8Array(c);
    if (!f.byteLength) {
      return;
    }
    const g = this.socket.writable.getWriter();
    try {
      const h = [];
      for (let i = 0; i < f.byteLength; i += TLS_MAX_PLAINTEXT_FRAGMENT) {
        const j = f.subarray(
          i,
          Math.min(i + TLS_MAX_PLAINTEXT_FRAGMENT, f.byteLength),
        );
        const k = this.isTls13
          ? await this.encryptTls13(j)
          : await this.encryptTls12(j, CONTENT_TYPE_APPLICATION_DATA);
        h.push(buildTlsRecord(CONTENT_TYPE_APPLICATION_DATA, k));
      }
      await g.write(h.length === 1 ? h[0] : concatBytes(...h));
    } finally {
      g.releaseLock();
    }
  }
  async read() {
    while (true) {
      let c;
      while ((c = this.recordParser.next())) {
        if (c.type === CONTENT_TYPE_ALERT) {
          if (c.fragment[1] === ALERT_CLOSE_NOTIFY) {
            return null;
          }
          throw new Error("TLS Alert: " + c.fragment[1]);
        }
        if (c.type !== CONTENT_TYPE_APPLICATION_DATA) {
          continue;
        }
        if (!this.isTls13) {
          return this.decryptTls12(c.fragment, CONTENT_TYPE_APPLICATION_DATA);
        }
        const { data: g, type: h } = await this.decryptTls13(c.fragment);
        if (h === CONTENT_TYPE_APPLICATION_DATA) {
          return g;
        }
        if (h === CONTENT_TYPE_ALERT) {
          if (g[1] === ALERT_CLOSE_NOTIFY) {
            return null;
          }
          throw new Error("TLS Alert: " + g[1]);
        }
        if (h !== CONTENT_TYPE_HANDSHAKE) {
          continue;
        }
        let i;
        for (this.handshakeParser.feed(g); (i = this.handshakeParser.next());) {
          if (
            i.type !== HANDSHAKE_TYPE_NEW_SESSION_TICKET &&
            i.type === HANDSHAKE_TYPE_KEY_UPDATE
          ) {
            throw new Error(
              "TLS 1.3 KeyUpdate is not supported by TLSClientMini",
            );
          }
        }
      }
      const f = this.socket.readable.getReader();
      try {
        const { value: j, done: k } = await this.readChunk(f);
        if (k) {
          return null;
        }
        this.recordParser.feed(j);
      } finally {
        f.releaseLock();
      }
    }
  }
  close() {
    this.socket.close();
  }
}
function stripIPv6Brackets(c = "") {
  const f = String(c || "").trim();
  if (f.startsWith("[") && f.endsWith("]")) {
    return f.slice(1, -1);
  } else {
    return f;
  }
}
function isIPHostname(c = "") {
  const f = stripIPv6Brackets(c);
  const g = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
  if (g.test(f)) {
    return true;
  }
  if (!f.includes(":")) {
    return false;
  }
  try {
    new URL("http://[" + f + "]/");
    return true;
  } catch (h) {
    return false;
  }
}
const CONNECT_TIMEOUT_MS = 9999;
const TURN_STUN_MAGIC_COOKIE = new Uint8Array([33, 18, 164, 66]);
const TURN_STUN_TYPE = {
  ALLOCATE_REQUEST: 3,
  ALLOCATE_SUCCESS: 259,
  ALLOCATE_ERROR: 275,
  CREATE_PERMISSION_REQUEST: 8,
  CREATE_PERMISSION_SUCCESS: 264,
  CONNECT_REQUEST: 10,
  CONNECT_SUCCESS: 266,
  CONNECTION_BIND_REQUEST: 11,
  CONNECTION_BIND_SUCCESS: 267,
};
const TURN_STUN_ATTR = {
  USERNAME: 6,
  MESSAGE_INTEGRITY: 8,
  ERROR_CODE: 9,
  XOR_PEER_ADDRESS: 18,
  REALM: 20,
  NONCE: 21,
  REQUESTED_TRANSPORT: 25,
  CONNECTION_ID: 42,
};
async function withTimeout(c, f, g) {
  let h;
  try {
    return await Promise.race([
      c,
      new Promise((i, j) => {
        h = setTimeout(() => j(new Error(g)), f);
      }),
    ]);
  } finally {
    clearTimeout(h);
  }
}
function isIPv4(c) {
  const f = String(c || "").split(".");
  return (
    f.length === 4 &&
    f.every((g) => /^\d{1,3}$/.test(g) && Number(g) >= 0 && Number(g) <= 255)
  );
}
function turnStunPadding(c) {
  return -c & 3;
}
function createTurnStunAttribute(c, f) {
  const g = dataToUint8Array(f);
  const h = new Uint8Array(4 + g.byteLength + turnStunPadding(g.byteLength));
  const i = new DataView(h.buffer);
  i.setUint16(0, c);
  i.setUint16(2, g.byteLength);
  h.set(g, 4);
  return h;
}
function createTurnStunMessage(c, f, g) {
  const h = concatByteData(...g);
  const i = new Uint8Array(20);
  const j = new DataView(i.buffer);
  j.setUint16(0, c);
  j.setUint16(2, h.byteLength);
  i.set(TURN_STUN_MAGIC_COOKIE, 4);
  i.set(f, 8);
  return concatByteData(i, h);
}
function parseTurnErrorCode(c) {
  if (c?.byteLength >= 4) {
    return (c[2] & 7) * 100 + c[3];
  } else {
    return 0;
  }
}
function randomTurnTransactionId() {
  return crypto.getRandomValues(new Uint8Array(12));
}
async function addTurnMessageIntegrity(c, f) {
  const g = new Uint8Array(c);
  const h = new DataView(g.buffer);
  h.setUint16(2, h.getUint16(2) + 24);
  const i = await crypto.subtle.importKey(
    "raw",
    f,
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"],
  );
  const j = await crypto.subtle.sign("HMAC", i, g);
  return concatByteData(
    g,
    createTurnStunAttribute(
      TURN_STUN_ATTR.MESSAGE_INTEGRITY,
      new Uint8Array(j),
    ),
  );
}
async function readTurnStunMessage(c, f = null, g = "TURN response timed out") {
  let h = validDataLength(f) ? dataToUint8Array(f) : new Uint8Array(0);
  const i = async () => {
    const { done: n, value: o } = await withTimeout(
      c.read(),
      CONNECT_TIMEOUT_MS,
      g,
    );
    if (n) {
      throw new Error("TURN server closed connection");
    }
    if (o?.byteLength) {
      h = concatByteData(h, o);
    }
  };
  while (h.byteLength < 20) {
    await i();
  }
  const j = 20 + ((h[2] << 8) | h[3]);
  if (j > 65555) {
    throw new Error("TURN response is too large");
  }
  while (h.byteLength < j) {
    await i();
  }
  const k = h.subarray(0, j);
  if (TURN_STUN_MAGIC_COOKIE.some((n, o) => k[4 + o] !== n)) {
    throw new Error("Invalid TURN/STUN response");
  }
  const l = new DataView(k.buffer, k.byteOffset, k.byteLength);
  const m = {};
  for (let n = 20; n + 4 <= j;) {
    const o = l.getUint16(n);
    const p = l.getUint16(n + 2);
    if (n + 4 + p > k.byteLength) {
      break;
    }
    m[o] = k.slice(n + 4, n + 4 + p);
    n += 4 + p + turnStunPadding(p);
  }
  return {
    message: {
      type: l.getUint16(0),
      attributes: m,
    },
    extraData: h.byteLength > j ? h.subarray(j) : null,
  };
}
async function writeTurnBytes(c, f, g) {
  await withTimeout(c.write(f), CONNECT_TIMEOUT_MS, g);
}
async function turnConnect(c, f, g, h) {
  c = {
    ...c,
    username: c.username ?? null,
    password: c.password ?? null,
  };
  const i = stripIPv6Brackets(f);
  let j = isIPv4(i) ? i : null;
  if (!j) {
    const u = await DoHquery(i, "A");
    const v = u.find((w) => w.type === 1 && isIPv4(w.data))?.data;
    j = typeof v === "string" ? v : null;
  }
  if (!j) {
    throw new Error(
      "Could not resolve " + f + " to an IPv4 address for TURN CONNECT",
    );
  }
  const k = stripIPv6Brackets(c.hostname);
  let l = null;
  let m = null;
  let n = null;
  let o = null;
  let p = null;
  let q = null;
  let r = false;
  const s = () => {
    try {
      l?.close?.();
    } catch (w) {}
    try {
      m?.close?.();
    } catch (x) {}
  };
  const t = () => {
    if (r) {
      return;
    }
    r = true;
    try {
      q?.releaseLock?.();
    } catch (w) {}
  };
  try {
    l = h({
      hostname: k,
      port: c.port,
    });
    await withTimeout(
      l.opened,
      CONNECT_TIMEOUT_MS,
      "TURN server connection timed out",
    );
    n = l.writable.getWriter();
    o = l.readable.getReader();
    const w = new Uint8Array(8);
    w[1] = 1;
    new DataView(w.buffer).setUint16(2, g ^ 8466);
    j.split(".").forEach((H, I) => {
      w[4 + I] = Number(H) ^ TURN_STUN_MAGIC_COOKIE[I];
    });
    const x = createTurnStunAttribute(TURN_STUN_ATTR.XOR_PEER_ADDRESS, w);
    const y = new Uint8Array([6, 0, 0, 0]);
    await writeTurnBytes(
      n,
      createTurnStunMessage(
        TURN_STUN_TYPE.ALLOCATE_REQUEST,
        randomTurnTransactionId(),
        [createTurnStunAttribute(TURN_STUN_ATTR.REQUESTED_TRANSPORT, y)],
      ),
      "TURN Allocate request timed out",
    );
    let z = await readTurnStunMessage(
      o,
      null,
      "TURN Allocate response timed out",
    );
    let A = z.message;
    let B = z.extraData;
    let C = null;
    let D = [];
    const E = (H) => (C ? addTurnMessageIntegrity(H, C) : Promise.resolve(H));
    if (
      A.type === TURN_STUN_TYPE.ALLOCATE_ERROR &&
      c.username !== null &&
      c.password !== null &&
      parseTurnErrorCode(A.attributes[TURN_STUN_ATTR.ERROR_CODE]) === 401
    ) {
      const H = A.attributes[TURN_STUN_ATTR.REALM];
      const I = A.attributes[TURN_STUN_ATTR.NONCE];
      if (!H || !I?.byteLength) {
        throw new Error(
          "TURN authentication challenge is missing realm or nonce",
        );
      }
      const J = textDecoder.decode(H);
      C = new Uint8Array(
        await crypto.subtle.digest(
          "MD5",
          textEncoder.encode(c.username + ":" + J + ":" + c.password),
        ),
      );
      D = [
        createTurnStunAttribute(
          TURN_STUN_ATTR.USERNAME,
          textEncoder.encode(c.username),
        ),
        createTurnStunAttribute(TURN_STUN_ATTR.REALM, textEncoder.encode(J)),
        createTurnStunAttribute(TURN_STUN_ATTR.NONCE, I),
      ];
      const K = await addTurnMessageIntegrity(
        createTurnStunMessage(
          TURN_STUN_TYPE.ALLOCATE_REQUEST,
          randomTurnTransactionId(),
          [
            createTurnStunAttribute(TURN_STUN_ATTR.REQUESTED_TRANSPORT, y),
            ...D,
          ],
        ),
        C,
      );
      const L = await Promise.all([
        E(
          createTurnStunMessage(
            TURN_STUN_TYPE.CREATE_PERMISSION_REQUEST,
            randomTurnTransactionId(),
            [x, ...D],
          ),
        ),
        E(
          createTurnStunMessage(
            TURN_STUN_TYPE.CONNECT_REQUEST,
            randomTurnTransactionId(),
            [x, ...D],
          ),
        ),
      ]);
      await writeTurnBytes(
        n,
        concatByteData(K, ...L),
        "TURN authenticated Allocate request timed out",
      );
      z = await readTurnStunMessage(
        o,
        B,
        "TURN authenticated Allocate response timed out",
      );
      A = z.message;
      B = z.extraData;
    } else if (A.type === TURN_STUN_TYPE.ALLOCATE_SUCCESS) {
      const M = await Promise.all([
        E(
          createTurnStunMessage(
            TURN_STUN_TYPE.CREATE_PERMISSION_REQUEST,
            randomTurnTransactionId(),
            [x, ...D],
          ),
        ),
        E(
          createTurnStunMessage(
            TURN_STUN_TYPE.CONNECT_REQUEST,
            randomTurnTransactionId(),
            [x, ...D],
          ),
        ),
      ]);
      if (M.length) {
        await writeTurnBytes(
          n,
          concatByteData(...M),
          "TURN pipelined request timed out",
        );
      }
    }
    if (A.type !== TURN_STUN_TYPE.ALLOCATE_SUCCESS) {
      const N = parseTurnErrorCode(A.attributes[TURN_STUN_ATTR.ERROR_CODE]);
      throw new Error(
        N ? "TURN Allocate failed with " + N : "TURN Allocate failed",
      );
    }
    m = h({
      hostname: k,
      port: c.port,
    });
    z = await readTurnStunMessage(
      o,
      B,
      "TURN CreatePermission response timed out",
    );
    A = z.message;
    B = z.extraData;
    if (A.type !== TURN_STUN_TYPE.CREATE_PERMISSION_SUCCESS) {
      throw new Error("TURN CreatePermission failed");
    }
    z = await readTurnStunMessage(o, B, "TURN CONNECT response timed out");
    A = z.message;
    B = z.extraData;
    if (
      A.type !== TURN_STUN_TYPE.CONNECT_SUCCESS ||
      !A.attributes[TURN_STUN_ATTR.CONNECTION_ID]
    ) {
      throw new Error("TURN CONNECT failed");
    }
    await withTimeout(
      m.opened,
      CONNECT_TIMEOUT_MS,
      "TURN data connection timed out",
    );
    p = m.writable.getWriter();
    q = m.readable.getReader();
    await writeTurnBytes(
      p,
      await E(
        createTurnStunMessage(
          TURN_STUN_TYPE.CONNECTION_BIND_REQUEST,
          randomTurnTransactionId(),
          [
            createTurnStunAttribute(
              TURN_STUN_ATTR.CONNECTION_ID,
              A.attributes[TURN_STUN_ATTR.CONNECTION_ID],
            ),
            ...D,
          ],
        ),
      ),
      "TURN ConnectionBind request timed out",
    );
    z = await readTurnStunMessage(
      q,
      null,
      "TURN ConnectionBind response timed out",
    );
    A = z.message;
    const F = z.extraData;
    if (A.type !== TURN_STUN_TYPE.CONNECTION_BIND_SUCCESS) {
      throw new Error("TURN ConnectionBind failed");
    }
    n.releaseLock();
    n = null;
    o.releaseLock();
    o = null;
    p.releaseLock();
    p = null;
    const G = new ReadableStream({
      start(O) {
        if (F?.byteLength) {
          O.enqueue(F);
        }
      },
      pull(O) {
        return q.read().then(({ done: P, value: Q }) => {
          if (P) {
            t();
            O.close();
          } else if (Q?.byteLength) {
            O.enqueue(new Uint8Array(Q));
          }
        });
      },
      cancel() {
        try {
          q?.cancel?.();
        } catch (O) {}
        t();
        s();
      },
    });
    return {
      readable: G,
      writable: m.writable,
      closed: m.closed,
      close: s,
    };
  } catch (O) {
    try {
      n?.releaseLock?.();
    } catch (P) {}
    try {
      o?.releaseLock?.();
    } catch (Q) {}
    try {
      p?.releaseLock?.();
    } catch (R) {}
    t();
    s();
    throw O;
  }
}
const SSTP_TCP_MSS = 1400;
const SSTP_EMPTY_BYTES = new Uint8Array(0);
function readSstpUint16(c, f = 0) {
  return (c[f] << 8) | c[f + 1];
}
function readSstpUint32(c, f = 0) {
  return ((c[f] << 24) | (c[f + 1] << 16) | (c[f + 2] << 8) | c[f + 3]) >>> 0;
}
function randomSstpUint16() {
  return readSstpUint16(crypto.getRandomValues(new Uint8Array(2)));
}
function internetChecksum(c, f, g) {
  let h = 0;
  for (let i = f; i < f + g - 1; i += 2) {
    h += readSstpUint16(c, i);
  }
  if (g & 1) {
    h += c[f + g - 1] << 8;
  }
  while (h >> 16) {
    h = (h & 65535) + (h >> 16);
  }
  return ~h & 65535;
}
async function sstpConnect(c, f, g, h) {
  c = {
    ...c,
    username: c.username ?? null,
    password: c.password ?? null,
  };
  let i = SSTP_EMPTY_BYTES;
  let j = 1;
  let k = null;
  let l = null;
  let m = null;
  let n = false;
  let o;
  let p;
  const q = new Promise((B, C) => {
    o = B;
    p = C;
  });
  const r = (B, C) => {
    if (n) {
      return;
    }
    n = true;
    B(C);
  };
  const s = () => {
    try {
      l?.cancel?.().catch?.(() => {});
    } catch (B) {}
    try {
      l?.releaseLock?.();
    } catch (C) {}
    try {
      m?.close?.().catch?.(() => {});
    } catch (D) {}
    try {
      m?.releaseLock?.();
    } catch (E) {}
    try {
      k?.close?.();
    } catch (F) {}
    r(o);
  };
  const t = async () => {
    const { value: B, done: C } = await l.read();
    if (C || !B) {
      throw new Error("SSTP socket closed");
    }
    return dataToUint8Array(B);
  };
  const u = async (B) => {
    while (i.byteLength < B) {
      const D = await t();
      i = i.byteLength ? concatByteData(i, D) : D;
    }
    const C = i.subarray(0, B);
    i = i.subarray(B);
    return C;
  };
  const v = async () => {
    while (true) {
      const B = i.indexOf(10);
      if (B >= 0) {
        const D = textDecoder.decode(i.subarray(0, B));
        i = i.subarray(B + 1);
        return D.replace(/\r$/, "");
      }
      const C = await t();
      i = i.byteLength ? concatByteData(i, C) : C;
    }
  };
  const w = async (B = CONNECT_TIMEOUT_MS) => {
    const C = await withTimeout(u(4), B, "SSTP read timeout");
    const D = readSstpUint16(C, 2) & 4095;
    if (D < 4) {
      throw new Error("Invalid SSTP packet length");
    }
    return {
      isControl: (C[1] & 1) !== 0,
      body:
        D > 4
          ? await withTimeout(u(D - 4), B, "SSTP packet body read timeout")
          : SSTP_EMPTY_BYTES,
    };
  };
  const x = (B) => {
    const C = 6 + B.byteLength;
    const D = new Uint8Array(C);
    D.set([16, 0, ((C >> 8) & 15) | 128, C & 255, 255, 3]);
    D.set(B, 6);
    return D;
  };
  const y = (B, C, D, E = []) => {
    const F = E.reduce((I, J) => I + 2 + J.data.byteLength, 0);
    const G = new Uint8Array(6 + F);
    const H = new DataView(G.buffer);
    H.setUint16(0, B);
    G[2] = C;
    G[3] = D;
    H.setUint16(4, 4 + F);
    E.reduce((I, J) => {
      G[I] = J.type;
      G[I + 1] = 2 + J.data.byteLength;
      G.set(J.data, I + 2);
      return I + 2 + J.data.byteLength;
    }, 6);
    return G;
  };
  const z = (B) => {
    const C = B.byteLength >= 2 && B[0] === 255 && B[1] === 3 ? 2 : 0;
    if (B.byteLength - C < 4) {
      return null;
    }
    const D = readSstpUint16(B, C);
    if (D === 33) {
      return {
        protocol: D,
        ipPacket: B.subarray(C + 2),
      };
    }
    if (B.byteLength - C < 6) {
      return null;
    }
    return {
      protocol: D,
      code: B[C + 2],
      id: B[C + 3],
      payload: B.subarray(C + 6),
      rawPacket: B.subarray(C),
    };
  };
  const A = (B) => {
    const C = [];
    for (let D = 0; D + 2 <= B.byteLength;) {
      const E = B[D];
      const F = B[D + 1];
      if (F < 2 || D + F > B.byteLength) {
        break;
      }
      C.push({
        type: E,
        data: B.subarray(D + 2, D + F),
      });
      D += F;
    }
    return C;
  };
  try {
    const B = stripIPv6Brackets(c.hostname);
    const C = c.port;
    k = h(
      {
        hostname: B,
        port: C,
      },
      {
        secureTransport: "on",
        allowHalfOpen: false,
      },
    );
    await withTimeout(
      k.opened,
      CONNECT_TIMEOUT_MS,
      "SSTP server connection timed out",
    );
    l = k.readable.getReader();
    m = k.writable.getWriter();
    const D = B.includes(":") ? "[" + B + "]" : B;
    const E = textEncoder.encode(
      "SSTP_DUPLEX_POST /sra_{BA195980-CD49-458b-9E23-C84EE0ADCD75}/ HTTP/1.1\r\n" +
        ("Host: " + (Number(C) === 443 ? D : D + ":" + C) + "\r\n") +
        "Content-Length: 18446744073709551615\r\n" +
        ("SSTPCORRELATIONID: {" + crypto.randomUUID() + "}\r\n\r\n"),
    );
    const F = new Uint8Array(2);
    new DataView(F.buffer).setUint16(0, 1);
    const G = new Uint8Array(2);
    new DataView(G.buffer).setUint16(0, 1500);
    const H = new Uint8Array(12 + F.byteLength);
    const I = new DataView(H.buffer);
    H[0] = 16;
    H[1] = 1;
    I.setUint16(2, H.byteLength | 32768);
    I.setUint16(4, 1);
    I.setUint16(6, 1);
    H[9] = 1;
    I.setUint16(10, 4 + F.byteLength);
    H.set(F, 12);
    await withTimeout(
      m.write(
        concatByteData(
          E,
          H,
          x(
            y(49185, 1, j++, [
              {
                type: 1,
                data: G,
              },
            ]),
          ),
        ),
      ),
      CONNECT_TIMEOUT_MS,
      "SSTP HTTP handshake request timed out",
    );
    const J = await withTimeout(
      v(),
      CONNECT_TIMEOUT_MS,
      "SSTP HTTP handshake timed out",
    );
    while (true) {
      const a9 = await withTimeout(
        v(),
        CONNECT_TIMEOUT_MS,
        "SSTP HTTP header read timed out",
      );
      if (a9 === "") {
        break;
      }
    }
    if (!/HTTP\/\d(?:\.\d)?\s+2\d\d/i.test(J)) {
      throw new Error("SSTP HTTP handshake failed: " + (J || "invalid status"));
    }
    let K = false;
    let L = false;
    let M = false;
    let N = false;
    let O = false;
    let P = false;
    let Q = false;
    let R = null;
    const S = async () => {
      if (!K || !L || !M || N) {
        return;
      }
      if (c.username === null || c.password === null) {
        throw new Error("SSTP server requires PAP authentication");
      }
      const aa = textEncoder.encode(c.username);
      const ab = textEncoder.encode(c.password);
      if (aa.byteLength > 255 || ab.byteLength > 255) {
        throw new Error("SSTP username/password is too long");
      }
      const ac = 6 + aa.byteLength + ab.byteLength;
      const ad = new Uint8Array(2 + ac);
      const ae = new DataView(ad.buffer);
      ae.setUint16(0, 49187);
      ad[2] = 1;
      ad[3] = j++;
      ae.setUint16(4, ac);
      ad[6] = aa.byteLength;
      ad.set(aa, 7);
      ad[7 + aa.byteLength] = ab.byteLength;
      ad.set(ab, 8 + aa.byteLength);
      await withTimeout(
        m.write(x(ad)),
        CONNECT_TIMEOUT_MS,
        "SSTP PAP authentication request timed out",
      );
      N = true;
    };
    const T = async () => {
      if (!K || !L || P || (M && !O)) {
        return;
      }
      await withTimeout(
        m.write(
          x(
            y(32801, 1, j++, [
              {
                type: 3,
                data: new Uint8Array(4),
              },
            ]),
          ),
        ),
        CONNECT_TIMEOUT_MS,
        "SSTP IPCP request timed out",
      );
      P = true;
    };
    for (let aa = 0; aa < 50 && !Q; aa++) {
      const ab = await w(CONNECT_TIMEOUT_MS);
      if (ab.isControl) {
        continue;
      }
      const ac = z(ab.body);
      if (!ac) {
        continue;
      }
      if (ac.protocol === 49185) {
        if (ac.code === 1) {
          const ad = A(ac.payload).find((af) => af.type === 3);
          if (ad?.data?.byteLength >= 2) {
            const af = readSstpUint16(ad.data);
            if (af !== 49187) {
              throw new Error(
                "SSTP unsupported PPP authentication protocol: 0x" +
                  af.toString(16),
              );
            }
            M = true;
          }
          const ae = new Uint8Array(ac.rawPacket);
          ae[2] = 2;
          await withTimeout(
            m.write(x(ae)),
            CONNECT_TIMEOUT_MS,
            "SSTP LCP Configure-Ack timed out",
          );
          L = true;
          await S();
          await T();
        } else if (ac.code === 2) {
          K = true;
          await S();
          await T();
        }
        continue;
      }
      if (ac.protocol === 49187) {
        if (ac.code === 2) {
          O = true;
          await T();
        } else if (ac.code === 3) {
          throw new Error("SSTP PAP authentication failed");
        }
        continue;
      }
      if (ac.protocol === 32801) {
        if (ac.code === 1) {
          const ag = new Uint8Array(ac.rawPacket);
          ag[2] = 2;
          await withTimeout(
            m.write(x(ag)),
            CONNECT_TIMEOUT_MS,
            "SSTP IPCP Configure-Ack timed out",
          );
          await T();
        } else if (ac.code === 3) {
          const ah = A(ac.payload).find((ai) => ai.type === 3);
          if (ah?.data?.byteLength === 4) {
            R = [...ah.data].join(".");
            await withTimeout(
              m.write(
                x(
                  y(32801, 1, j++, [
                    {
                      type: 3,
                      data: ah.data,
                    },
                  ]),
                ),
              ),
              CONNECT_TIMEOUT_MS,
              "SSTP IPCP address request timed out",
            );
            P = true;
          }
        } else if (ac.code === 2) {
          const ai = A(ac.payload).find((aj) => aj.type === 3);
          if (ai?.data?.byteLength === 4) {
            R = [...ai.data].join(".");
          }
          Q = true;
        }
      }
    }
    if (!R) {
      throw new Error("SSTP did not assign an IPv4 address");
    }
    const U = stripIPv6Brackets(f);
    let V = isIPv4(U) ? U : null;
    if (!V) {
      const aj = await DoHquery(U, "A");
      const ak = aj.find((al) => al.type === 1 && isIPv4(al.data))?.data;
      V = typeof ak === "string" ? ak : null;
    }
    if (!V) {
      throw new Error(
        "Could not resolve " + f + " to an IPv4 address for SSTP",
      );
    }
    const W = 10000 + (randomSstpUint16() % 50000);
    const X = new Uint8Array(
      String(R || "")
        .split(".")
        .map(Number),
    );
    const Y = new Uint8Array(
      String(V || "")
        .split(".")
        .map(Number),
    );
    let Z = readSstpUint32(crypto.getRandomValues(new Uint8Array(4)));
    let a0 = 0;
    const a1 = new Uint8Array(20);
    a1.set([69, 0, 0, 0, 0, 0, 64, 0, 64, 6]);
    a1.set(X, 12);
    a1.set(Y, 16);
    const a2 = new Uint8Array(1432);
    a2.set(X);
    a2.set(Y, 4);
    a2[9] = 6;
    const a3 = (al, am = SSTP_EMPTY_BYTES) => {
      const an = dataToUint8Array(am);
      const ao = an.byteLength;
      const ap = 20 + ao;
      const aq = 20 + ap;
      const ar = 8 + aq;
      const as = new Uint8Array(ar);
      const at = new DataView(as.buffer);
      as.set([16, 0, ((ar >> 8) & 15) | 128, ar & 255, 255, 3, 0, 33]);
      as.set(a1, 8);
      at.setUint16(10, aq);
      at.setUint16(12, randomSstpUint16());
      at.setUint16(18, internetChecksum(as, 8, 20));
      at.setUint16(28, W);
      at.setUint16(30, g);
      at.setUint32(32, Z);
      at.setUint32(36, a0);
      as[40] = 80;
      as[41] = al;
      at.setUint16(42, 65535);
      if (ao) {
        as.set(an, 48);
      }
      a2[10] = ap >> 8;
      a2[11] = ap & 255;
      a2.set(as.subarray(28, 28 + ap), 12);
      at.setUint16(44, internetChecksum(a2, 0, 12 + ap));
      return as;
    };
    const a4 = (al) => {
      if (al.byteLength < 40 || al[9] !== 6) {
        return null;
      }
      const am = (al[0] & 15) * 4;
      if (al.byteLength < am + 20) {
        return null;
      }
      if (readSstpUint16(al, am) !== g) {
        return null;
      }
      if (readSstpUint16(al, am + 2) !== W) {
        return null;
      }
      return {
        flags: al[am + 13],
        sequence: readSstpUint32(al, am + 4),
        payloadOffset: am + ((al[am + 12] >> 4) & 15) * 4,
      };
    };
    await withTimeout(
      m.write(a3(2)),
      CONNECT_TIMEOUT_MS,
      "SSTP TCP SYN write timed out",
    );
    Z = (Z + 1) >>> 0;
    let a5 = false;
    for (let al = 0; al < 30; al++) {
      const am = await w(CONNECT_TIMEOUT_MS);
      if (am.isControl) {
        continue;
      }
      const an = z(am.body);
      if (!an || an.protocol !== 33) {
        continue;
      }
      const ao = a4(an.ipPacket);
      if (!ao || (ao.flags & 18) !== 18) {
        continue;
      }
      a0 = (ao.sequence + 1) >>> 0;
      await withTimeout(
        m.write(a3(16)),
        CONNECT_TIMEOUT_MS,
        "SSTP TCP ACK write timed out",
      );
      a5 = true;
      break;
    }
    if (!a5) {
      throw new Error("TCP handshake through SSTP timed out");
    }
    let a6 = null;
    const a7 = new ReadableStream({
      start(ap) {
        a6 = ap;
      },
      cancel() {
        s();
      },
    });
    (async () => {
      try {
        let ap = [];
        let aq = 0;
        const ar = () => {
          if (!aq) {
            return;
          }
          if (!a6) {
            throw new Error("SSTP readable stream is not ready");
          }
          a6.enqueue(ap.length === 1 ? ap[0] : concatByteData(...ap));
          ap = [];
          aq = 0;
          m.write(a3(16)).catch(() => {});
        };
        while (true) {
          const as = await w(60000);
          if (as.isControl) {
            continue;
          }
          const at = z(as.body);
          if (!at || at.protocol !== 33) {
            continue;
          }
          const au = a4(at.ipPacket);
          if (!au) {
            continue;
          }
          if (au.payloadOffset < at.ipPacket.byteLength) {
            const av = at.ipPacket.subarray(au.payloadOffset);
            if (av.byteLength) {
              a0 = (au.sequence + av.byteLength) >>> 0;
              ap.push(new Uint8Array(av));
              aq += av.byteLength;
            }
          }
          if (au.flags & 1) {
            ar();
            a0 = (a0 + 1) >>> 0;
            m.write(a3(17)).catch(() => {});
            const aw = a6;
            if (aw) {
              try {
                aw.close();
              } catch (ax) {}
            }
            s();
            return;
          }
          if (i.byteLength < 4 || aq >= 32768) {
            ar();
          }
        }
      } catch (ay) {
        const az = a6;
        if (az) {
          try {
            az.error(ay);
          } catch (aA) {}
        }
        r(p, ay);
        try {
          k?.close?.();
        } catch (aB) {}
      }
    })();
    const a8 = new WritableStream({
      async write(ap) {
        const aq = dataToUint8Array(ap);
        if (!aq.byteLength) {
          return;
        }
        if (aq.byteLength <= SSTP_TCP_MSS) {
          await m.write(a3(24, aq));
          Z = (Z + aq.byteLength) >>> 0;
          return;
        }
        const ar = [];
        for (let as = 0; as < aq.byteLength; as += SSTP_TCP_MSS) {
          const at = aq.subarray(
            as,
            Math.min(as + SSTP_TCP_MSS, aq.byteLength),
          );
          ar.push(a3(24, at));
          Z = (Z + at.byteLength) >>> 0;
        }
        await m.write(concatByteData(...ar));
      },
      close() {
        return m.write(a3(17)).catch(() => {});
      },
      abort(ap) {
        s();
        if (ap) {
          r(p, ap);
        }
      },
    });
    return {
      readable: a7,
      writable: a8,
      closed: q,
      close: s,
    };
  } catch (ap) {
    s();
    throw ap;
  }
}
function base64SecretEncode(c, f) {
  const g = new TextEncoder();
  const h = g.encode(c);
  const j = g.encode(f);
  const k = new Uint8Array(h.length);
  for (let m = 0; m < h.length; m++) {
    k[m] = h[m] ^ j[m % j.length];
  }
  let l = "";
  for (let n = 0; n < k.length; n++) {
    l += String.fromCharCode(k[n]);
  }
  return btoa(l);
}
function base64SecretDecode(c, f) {
  const g = atob(c);
  const h = new Uint8Array(g.length);
  for (let n = 0; n < g.length; n++) {
    h[n] = g.charCodeAt(n);
  }
  const j = new TextEncoder();
  const k = j.encode(f);
  const l = new Uint8Array(h.length);
  for (let o = 0; o < h.length; o++) {
    l[o] = h[o] ^ k[o % k.length];
  }
  const m = new TextDecoder();
  return m.decode(l);
}
function getTransportProtocolConfig(c = {}) {
  const f = c.transportProtocol === "grpc";
  return {
    type: f
      ? c.gRPCmode === "multi"
        ? "grpc&mode=multi"
        : "grpc&mode=gun"
      : c.transportProtocol === "xhttp"
        ? "xhttp&mode=stream-one"
        : "ws",
    pathFieldName: f ? "serviceName" : "path",
    domainFieldName: f ? "authority" : "host",
  };
}
function getTransportPathParamValue(c = {}, f = "/", g = false) {
  const h = g ? "/" : c.randomPath ? randomPath(f) : f;
  if (c.transportProtocol !== "grpc") {
    return h;
  }
  return h.split("?")[0] || "/";
}
function log(...c) {
  if (debugLogPrint) {
    console.log(...c);
  }
}
function ClashsubConfigFileHotpatch(c, f = {}, g = null) {
  const h = f?.UUID || null;
  const j = Boolean(f?.ECH);
  const k = Array.isArray(f?.HOSTS) ? [...f.HOSTS] : [];
  const l = f?.ECHConfig?.SNI || null;
  const m = f?.ECHConfig?.DNS;
  const n = Boolean(h && j);
  const o =
    typeof f?.gRPCUserAgent === "string" && f.gRPCUserAgent.trim()
      ? f.gRPCUserAgent.trim()
      : null;
  const p = false;
  const q = o ? JSON.stringify(o) : null;
  const r = g || {};
  let s = c.replace(/mode:\s*Rule\b/g, "mode: rule");
  if (r.enableIPv6 === false) {
    s = s
      .replace(/^ipv6:\s*true\b/im, "ipv6: false")
      .replace(/^ipv6:\s*false\b/im, "ipv6: false");
  }
  if (!/^ipv6:/im.test(s)) {
    s = "ipv6: " + (r.enableIPv6 !== false) + "\n" + s;
  }
  if (r.logLevel && !/^log-level:/im.test(s)) {
    s = "log-level: " + r.logLevel + "\n" + s;
  }
  if (r.allowLAN) {
    s = s.replace(
      /^bind-address:\s*"?(127\.0\.0\.1)"?/im,
      'bind-address: "0.0.0.0"',
    );
  }
  if (r.enableDomesticBypass) {
    const F = "# IRANIAN DIRECT RULES";
    if (!s.includes(F)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" + F + "\n$1  - DOMAIN-SUFFIX,ir,DIRECT\n$1  - GEOIP,ir,DIRECT",
      );
    }
  }
  if (r.enablePornBlock) {
    const G = "# ADULT BLOCK RULES";
    if (!s.includes(G)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" +
          G +
          "\n$1  - DOMAIN-SUFFIX,pornhub.com,REJECT\n$1  - DOMAIN-SUFFIX,xvideos.com,REJECT\n$1  - DOMAIN-SUFFIX,xnxx.com,REJECT\n$1  - DOMAIN-SUFFIX,xhamster.com,REJECT\n$1  - DOMAIN-SUFFIX,redtube.com,REJECT\n$1  - DOMAIN-SUFFIX,youporn.com,REJECT",
      );
    }
  }
  if (r.enableMalwareBlock) {
    const H = "# MALWARE BLOCK RULES";
    if (!s.includes(H)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" +
          H +
          "\n$1  - GEOSITE,category-malware,REJECT\n$1  - GEOSITE,malware,REJECT",
      );
    }
  }
  if (r.enablePhishingBlock) {
    const I = "# PHISHING BLOCK RULES";
    if (!s.includes(I)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" +
          I +
          "\n$1  - GEOSITE,category-phishing,REJECT\n$1  - GEOSITE,phishing,REJECT",
      );
    }
  }
  if (r.blockQUIC) {
    const J = "# QUIC BLOCK RULES";
    if (!s.includes(J)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" + J + '\n$1  - "DST-PORT,443,REJECT,udp"',
      );
    }
  }
  if (r.bypassChina) {
    const K = "# CHINA DIRECT RULES";
    if (!s.includes(K)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" + K + "\n$1  - GEOSITE,cn,DIRECT\n$1  - GEOIP,CN,DIRECT",
      );
    }
  }
  if (r.bypassRussia) {
    const L = "# RUSSIA DIRECT RULES";
    if (!s.includes(L)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" + L + "\n$1  - GEOSITE,ru,DIRECT\n$1  - GEOIP,RU,DIRECT",
      );
    }
  }
  if (r.bypassSanctions) {
    const M = "# SANCTION BYPASS RULES";
    if (!s.includes(M)) {
      s = s.replace(
        /^(\s*)rules:\s*$/m,
        "$&\n" +
          M +
          "\n$1  - GEOSITE,category-sanctioned,DIRECT\n$1  - DOMAIN-SUFFIX,intel.com,DIRECT\n$1  - DOMAIN-SUFFIX,oracle.com,DIRECT\n$1  - DOMAIN-SUFFIX,docker.com,DIRECT\n$1  - DOMAIN-SUFFIX,android.com,DIRECT",
      );
    }
  }
  const t =
    "dns:\n  enable: true\n  default-nameserver:\n    - 223.5.5.5\n    - 119.29.29.29\n    - 114.114.114.114\n  use-hosts: true\n  nameserver:\n    - https://sm2.doh.pub/dns-query\n    - https://dns.alidns.com/dns-query\n  fallback:\n    - 8.8.4.4\n    - 208.67.220.220\n  fallback-filter:\n    geoip: true\n    geoip-code: CN\n    ipcidr:\n      - 240.0.0.0/4\n      - 127.0.0.1/32\n      - 0.0.0.0/32\n    domain:\n      - '+.google.com'\n      - '+.facebook.com'\n      - '+.youtube.com'\n";
  const u = (N) =>
    N.replace(/grpc-opts:\s*\{([\s\S]*?)\}/i, (O, P) => {
      if (/grpc-user-agent\s*:/i.test(P)) {
        return O;
      }
      let Q = P.trim();
      if (Q.endsWith(",")) {
        Q = Q.slice(0, -1).trim();
      }
      const R = Q ? Q + ", grpc-user-agent: " + q : "grpc-user-agent: " + q;
      return "grpc-opts: {" + R + "}";
    });
  const v = (N) =>
    /(?:^|[,{])\s*network:\s*(?:"grpc"|'grpc'|grpc)(?=\s*(?:[,}\n#]|$))/im.test(
      N,
    );
  const w = (N) => N.match(/type:\s*(\w+)/)?.[1] || "vless";
  const x = (N, O) => {
    const P = w(N) === "trojan" ? "password" : "uuid";
    const Q = new RegExp(P + ":\\s*" + (O ? "([^,}\\n]+)" : "([^\\n]+)"));
    return N.match(Q)?.[1]?.trim() || null;
  };
  const y = (N, O) => {
    if (/^\s{2}nameserver-policy:\s*(?:\n|$)/m.test(N)) {
      return N.replace(/^(\s{2}nameserver-policy:\s*\n)/m, "$1" + O + "\n");
    }
    const P = N.split("\n");
    let Q = -1;
    let R = false;
    for (let T = 0; T < P.length; T++) {
      const U = P[T];
      if (/^dns:\s*$/.test(U)) {
        R = true;
        continue;
      }
      if (R && /^[a-zA-Z]/.test(U)) {
        Q = T;
        break;
      }
    }
    const S = "  nameserver-policy:\n" + O;
    if (Q !== -1) {
      P.splice(Q, 0, S);
    } else {
      P.push(S);
    }
    return P.join("\n");
  };
  const z = (N) => {
    if (!v(N) || /grpc-user-agent\s*:/i.test(N)) {
      return N;
    }
    if (/grpc-opts:\s*\{/i.test(N)) {
      return u(N);
    }
    return N.replace(
      /\}(\s*)$/,
      ", grpc-opts: {grpc-user-agent: " + q + "}}$1",
    );
  };
  const A = (N, O) => {
    const P = " ".repeat(O);
    let Q = -1;
    for (let V = 0; V < N.length; V++) {
      const W = N[V];
      if (!W.trim()) {
        continue;
      }
      const X = W.search(/\S/);
      if (X !== O) {
        continue;
      }
      if (
        /^\s*grpc-opts:\s*(?:#.*)?$/.test(W) ||
        /^\s*grpc-opts:\s*\{.*\}\s*(?:#.*)?$/.test(W)
      ) {
        Q = V;
        break;
      }
    }
    if (Q === -1) {
      let Y = -1;
      for (let Z = N.length - 1; Z >= 0; Z--) {
        if (N[Z].trim()) {
          Y = Z;
          break;
        }
      }
      if (Y >= 0) {
        N.splice(Y + 1, 0, P + "grpc-opts:", P + "  grpc-user-agent: " + q);
      }
      return N;
    }
    const R = N[Q];
    if (/^\s*grpc-opts:\s*\{.*\}\s*(?:#.*)?$/.test(R)) {
      if (!/grpc-user-agent\s*:/i.test(R)) {
        N[Q] = u(R);
      }
      return N;
    }
    let S = N.length;
    let T = O + 2;
    let U = false;
    for (let a0 = Q + 1; a0 < N.length; a0++) {
      const a1 = N[a0];
      const a2 = a1.trim();
      if (!a2) {
        continue;
      }
      const a3 = a1.search(/\S/);
      if (a3 <= O) {
        S = a0;
        break;
      }
      if (a3 > O && T === O + 2) {
        T = a3;
      }
      if (/^grpc-user-agent\s*:/.test(a2)) {
        U = true;
        break;
      }
    }
    if (!U) {
      N.splice(S, 0, " ".repeat(T) + "grpc-user-agent: " + q);
    }
    return N;
  };
  const B = (N, O) => {
    let P = -1;
    for (let S = N.length - 1; S >= 0; S--) {
      if (N[S].trim()) {
        P = S;
        break;
      }
    }
    if (P < 0) {
      return N;
    }
    const Q = " ".repeat(O);
    const R = [Q + "ech-opts:", Q + "  enable: true"];
    N.splice(P + 1, 0, ...R);
    return N;
  };
  if (!/^dns:/m.test(s)) {
    s = t + s;
  }
  if (l && !k.includes(l)) {
    k.push(l);
  }
  if (j && k.length > 0) {
    const N = k.map((O) => '    "' + O + '": ' + (m ? m : "")).join("\n");
    s = y(s, N);
  }
  if (!n && !p) {
    return s;
  }
  const C = s.split("\n");
  const D = [];
  let E = 0;
  while (E < C.length) {
    const O = C[E];
    const P = O.trim();
    if (P.startsWith("- {")) {
      let Q = O;
      let R = (O.match(/\{/g) || []).length - (O.match(/\}/g) || []).length;
      while (R > 0 && E + 1 < C.length) {
        E++;
        Q += "\n" + C[E];
        R +=
          (C[E].match(/\{/g) || []).length - (C[E].match(/\}/g) || []).length;
      }
      if (p) {
        Q = z(Q);
      }
      if (n && x(Q, true) === h.trim()) {
        Q = Q.replace(/\}(\s*)$/, ", ech-opts: {enable: true}}$1");
      }
      D.push(Q);
      E++;
    } else if (P.startsWith("- name:")) {
      let S = [O];
      let T = O.search(/\S/);
      let U = T + 2;
      E++;
      while (E < C.length) {
        const W = C[E];
        const X = W.trim();
        if (!X) {
          S.push(W);
          E++;
          break;
        }
        const Y = W.search(/\S/);
        if (Y <= T && X.startsWith("- ")) {
          break;
        }
        if (Y < T && X) {
          break;
        }
        S.push(W);
        E++;
      }
      let V = S.join("\n");
      if (p && v(V)) {
        S = A(S, U);
        V = S.join("\n");
      }
      if (n && x(V, false) === h.trim()) {
        S = B(S, U);
      }
      D.push(...S);
    } else {
      D.push(O);
      E++;
    }
  }
  return D.join("\n");
}
async function SingboxsubConfigFileHotpatch(c, f = {}, g = null) {
  const h = f?.UUID || null;
  const i = f?.Fingerprint || "chrome";
  const j = Boolean(f?.ECH);
  const k = f?.ECHConfig?.SNI || "cloudflare-ech.com";
  const l = c
    .replace(/1\.1\.1\.1/g, "8.8.8.8")
    .replace(/1\.0\.0\.1/g, "8.8.4.4");
  try {
    const m = JSON.parse(l);
    const n = (v) =>
      v === undefined || v === null ? [] : Array.isArray(v) ? v : [v];
    const o = () =>
      (m.route = m.route && typeof m.route === "object" ? m.route : {});
    const p = (v) =>
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      typeof v.server === "string"
        ? v.server
        : null;
    const q = (v, w) => {
      if (!w || typeof w !== "string") {
        return null;
      }
      const x = o();
      const y = v + "-" + w;
      const z = Array.isArray(x.rule_set) ? x.rule_set : n(x.rule_set);
      if (!z.some((A) => A?.tag === y)) {
        const A = v === "geoip" ? x.geoip : x.geosite;
        z.push({
          tag: y,
          type: "remote",
          format: "binary",
          url:
            "https://raw.githubusercontent.com/SagerNet/sing-" +
            v +
            "/rule-set/" +
            y +
            ".srs",
          ...(A?.download_detour
            ? {
                download_detour: A.download_detour,
              }
            : {}),
        });
        m.experimental =
          m.experimental && typeof m.experimental === "object"
            ? m.experimental
            : {};
        m.experimental.cache_file =
          m.experimental.cache_file &&
          typeof m.experimental.cache_file === "object"
            ? m.experimental.cache_file
            : {};
        m.experimental.cache_file.enabled ??= true;
      }
      x.rule_set = z;
      return y;
    };
    const r = (v) => {
      if (!v || typeof v !== "object" || Array.isArray(v)) {
        return v;
      }
      if (v.type === "logical" && Array.isArray(v.rules)) {
        v.rules = v.rules.map(r);
        return v;
      }
      const w = [];
      for (const x of n(v.geoip)) {
        if (typeof x !== "string") {
          continue;
        }
        if (x.toLowerCase() === "private") {
          v.ip_is_private = true;
        } else {
          w.push(q("geoip", x));
        }
      }
      for (const y of n(v.source_geoip)) {
        if (typeof y !== "string") {
          continue;
        }
        w.push(q("geoip", y));
        v.rule_set_ip_cidr_match_source = true;
      }
      for (const z of n(v.geosite)) {
        if (typeof z === "string") {
          w.push(q("geosite", z));
        }
      }
      if (w.length) {
        v.rule_set = [...new Set([...n(v.rule_set), ...w].filter(Boolean))];
      }
      delete v.geoip;
      delete v.source_geoip;
      delete v.geosite;
      return v;
    };
    const s = (v, w) => {
      v = r(v);
      if (!v || typeof v !== "object" || Array.isArray(v)) {
        return v;
      }
      if (v.type === "logical" && Array.isArray(v.rules)) {
        v.rules = v.rules.map((y) => s(y, w));
        return v;
      }
      const x = p(v);
      if (x && w.has(x)) {
        for (const y of [
          "server",
          "strategy",
          "disable_cache",
          "rewrite_ttl",
          "client_subnet",
          "timeout",
        ]) {
          delete v[y];
        }
        v.action = "predefined";
        v.rcode = w.get(x);
      } else if (x && !v.action) {
        v.action = "route";
      }
      return v;
    };
    if (Array.isArray(m.inbounds)) {
      for (const v of m.inbounds) {
        if (!v || typeof v !== "object" || v.type !== "tun") {
          continue;
        }
        for (const w of [
          {
            targetKey: "address",
            sourceKeys: ["inet4_address", "inet6_address"],
          },
          {
            targetKey: "route_address",
            sourceKeys: ["inet4_route_address", "inet6_route_address"],
          },
          {
            targetKey: "route_exclude_address",
            sourceKeys: [
              "inet4_route_exclude_address",
              "inet6_route_exclude_address",
            ],
          },
        ]) {
          const x = n(v[w.targetKey]);
          for (const y of w.sourceKeys) {
            x.push(...n(v[y]));
          }
          if (x.length) {
            v[w.targetKey] = [...new Set(x)];
          }
          for (const z of w.sourceKeys) {
            delete v[z];
          }
        }
        if (v.tag) {
          const A = [];
          if (v.domain_strategy) {
            A.push({
              inbound: v.tag,
              action: "resolve",
              strategy: v.domain_strategy,
            });
          }
          if (v.sniff) {
            const B = {
              inbound: v.tag,
              action: "sniff",
            };
            if (v.sniff_timeout) {
              B.timeout = v.sniff_timeout;
            }
            A.push(B);
          }
          if (A.length) {
            const C = o();
            C.rules = [...A, ...n(C.rules)];
          }
        }
        delete v.sniff;
        delete v.sniff_timeout;
        delete v.domain_strategy;
      }
    }
    if (
      m?.route &&
      typeof m.route === "object" &&
      Array.isArray(m.route.rules)
    ) {
      const D = (E) => {
        E = r(E);
        if (E?.type === "logical" && Array.isArray(E.rules)) {
          E.rules = E.rules.map(D);
        } else if (
          E &&
          typeof E === "object" &&
          !Array.isArray(E) &&
          E.outbound &&
          !E.action
        ) {
          E.action = "route";
        }
        return E;
      };
      m.route.rules = m.route.rules.map(D);
    }
    const t = m?.dns;
    if (t && typeof t === "object") {
      const E = t.fakeip && typeof t.fakeip === "object" ? t.fakeip : null;
      const F = new Map();
      const G = {
        "tcp:": "tcp",
        "udp:": "udp",
        "tls:": "tls",
        "quic:": "quic",
        "https:": "https",
        "h3:": "h3",
      };
      const H = {
        success: "NOERROR",
        format_error: "FORMERR",
        server_failure: "SERVFAIL",
        name_error: "NXDOMAIN",
        not_implemented: "NOTIMP",
        refused: "REFUSED",
      };
      let I = false;
      if (Array.isArray(t.servers)) {
        const J = [];
        for (const K of t.servers) {
          if (!K || typeof K !== "object" || Array.isArray(K)) {
            J.push(K);
            continue;
          }
          const L = {
            ...K,
          };
          let M = null;
          let N = "";
          let O = typeof L.address === "string" ? L.address.trim() : "";
          if (O) {
            const P = O.toLowerCase();
            if (P === "fakeip") {
              M = {
                type: "fakeip",
              };
            } else if (P === "local") {
              M = {
                type: "local",
              };
            } else if (P.startsWith("rcode://")) {
              M = {
                type: "rcode",
              };
              N = O.slice("rcode://".length).toLowerCase();
            } else if (P.startsWith("dhcp://")) {
              const Q = O.slice("dhcp://".length);
              M =
                Q && Q.toLowerCase() !== "auto"
                  ? {
                      type: "dhcp",
                      interface: Q,
                    }
                  : {
                      type: "dhcp",
                    };
            } else {
              try {
                const R = new URL(O);
                const S = G[R.protocol.toLowerCase()];
                if (S) {
                  const T =
                    R.hostname?.startsWith("[") && R.hostname.endsWith("]")
                      ? R.hostname.slice(1, -1)
                      : R.hostname;
                  M = {
                    type: S,
                    server: T || R.host || O,
                    ...(R.port
                      ? {
                          server_port: Number(R.port),
                        }
                      : {}),
                    ...((S === "https" || S === "h3") &&
                    R.pathname &&
                    R.pathname !== "/dns-query"
                      ? {
                          path: R.pathname,
                        }
                      : {}),
                  };
                }
              } catch (U) {}
              if (!M) {
                M = {
                  type: "udp",
                  server: O,
                };
              }
            }
          }
          if (M?.type === "rcode") {
            const V = H[N] || "NOERROR";
            if (typeof L.tag === "string" && L.tag) {
              F.set(L.tag, V);
              F.set(
                L.tag.startsWith("dns_") ? L.tag.slice(4) : "dns_" + L.tag,
                V,
              );
            }
            continue;
          }
          if (M) {
            delete L.address;
            Object.assign(L, M);
          }
          if (
            L.address_resolver !== undefined &&
            L.domain_resolver === undefined
          ) {
            L.domain_resolver = L.address_resolver;
          }
          if (
            L.address_strategy !== undefined &&
            L.domain_strategy === undefined
          ) {
            L.domain_strategy = L.address_strategy;
          }
          delete L.address_resolver;
          delete L.address_strategy;
          if (L.detour === "DIRECT") {
            delete L.detour;
          }
          if (L.type === "fakeip") {
            I = true;
            if (E) {
              for (const W of ["inet4_range", "inet6_range"]) {
                if (E[W] !== undefined && L[W] === undefined) {
                  L[W] = E[W];
                }
              }
            }
          }
          J.push(L);
        }
        t.servers = J;
      }
      if (E && !I && E.enabled !== false) {
        const X = {
          type: "fakeip",
          tag: "fakeip",
        };
        for (const Y of Array.isArray(t.rules) ? t.rules : []) {
          const Z = p(Y);
          if (Z && Z.toLowerCase().includes("fakeip")) {
            X.tag = Z;
            break;
          }
        }
        for (const a0 of ["inet4_range", "inet6_range"]) {
          if (E[a0] !== undefined) {
            X[a0] = E[a0];
          }
        }
        if (Array.isArray(t.servers)) {
          t.servers.push(X);
        } else {
          t.servers = [X];
        }
      }
      if (Array.isArray(t.rules)) {
        const a1 = [];
        for (const a2 of t.rules) {
          const a3 = p(a2);
          const a4 = n(a2?.outbound);
          const a5 = new Set([
            "outbound",
            "server",
            "action",
            "strategy",
            "disable_cache",
            "rewrite_ttl",
            "client_subnet",
            "timeout",
          ]);
          const a6 =
            a2 &&
            typeof a2 === "object" &&
            !Array.isArray(a2) &&
            a2.type !== "logical" &&
            a3 &&
            a4.includes("any") &&
            Object.keys(a2).every((a7) => a5.has(a7));
          if (a6) {
            const a7 = o();
            if (a7.default_domain_resolver === undefined) {
              const a8 = {
                server: a3,
              };
              for (const a9 of [
                "strategy",
                "disable_cache",
                "rewrite_ttl",
                "client_subnet",
                "timeout",
              ]) {
                if (a2[a9] !== undefined) {
                  a8[a9] = a2[a9];
                }
              }
              a7.default_domain_resolver =
                Object.keys(a8).length === 1 ? a8.server : a8;
            }
            continue;
          }
          a1.push(s(a2, F));
        }
        t.rules = a1;
      }
      delete t.fakeip;
      delete t.independent_cache;
    }
    if (m?.route && typeof m.route === "object") {
      delete m.route.geoip;
      delete m.route.geosite;
    }
    if (m?.ntp?.detour === "DIRECT") {
      delete m.ntp.detour;
    }
    if (Array.isArray(m.outbounds)) {
      const aa = new Set(m.outbounds.map((ac) => ac?.tag).filter(Boolean));
      const ab = (ac) =>
        ac === "REJECT" ||
        (ac &&
          typeof ac === "object" &&
          (Array.isArray(ac) ? ac.some(ab) : Object.values(ac).some(ab)));
      if (
        !aa.has("REJECT") &&
        ab({
          outbounds: m.outbounds,
          route: m.route,
        })
      ) {
        m.outbounds.push({
          type: "block",
          tag: "REJECT",
        });
      }
    }
    const u = g || {};
    if (u.enableIPv6 === false && m.inbounds) {
      m.inbounds.forEach((ac) => {
        if (ac && typeof ac === "object" && ac.type === "tun") {
          delete ac.inet6_address;
          delete ac.inet6_route_address;
        }
      });
    }
    if (u.enableDomesticBypass && m.route) {
      if (!Array.isArray(m.route.rules)) {
        m.route.rules = [];
      }
      const ac = m.route.rules.some(
        (ad) =>
          ad &&
          ad.outbound === "direct" &&
          Array.isArray(ad.domain_suffix) &&
          ad.domain_suffix.includes(".ir"),
      );
      if (!ac) {
        m.route.rules.unshift({
          outbound: "direct",
          domain_suffix: [".ir"],
        });
      }
    }
    if (u.enablePornBlock && m.route) {
      const ad = m.route.rules.some(
        (ae) =>
          ae.outbound === "block" &&
          JSON.stringify(ae).toLowerCase().includes("porn"),
      );
      if (!ad) {
        m.route.rules.unshift({
          outbound: "block",
          rule_set: ["geosite-porn"],
        });
      }
    }
    if (u.enablePornBlock) {
      const ae = m.outbounds && m.outbounds.some((af) => af.tag === "REJECT");
      if (!ae) {
        if (!m.outbounds) {
          m.outbounds = [];
        }
        m.outbounds.push({
          type: "block",
          tag: "REJECT",
        });
      }
    }
    if (m.route) {
      if (!Array.isArray(m.route.rules)) {
        m.route.rules = [];
      }
      if (!Array.isArray(m.route.rule_set)) {
        m.route.rule_set = [];
      }
      const af = (ai, aj) => {
        const ak = ai + "-" + aj;
        if (!m.route.rule_set.some((al) => al && al.tag === ak)) {
          m.route.rule_set.push({
            tag: ak,
            type: "remote",
            format: "binary",
            url:
              "https://raw.githubusercontent.com/SagerNet/sing-" +
              ai +
              "/rule-set/" +
              ak +
              ".srs",
          });
          m.experimental =
            m.experimental && typeof m.experimental === "object"
              ? m.experimental
              : {};
          m.experimental.cache_file =
            m.experimental.cache_file &&
            typeof m.experimental.cache_file === "object"
              ? m.experimental.cache_file
              : {};
          m.experimental.cache_file.enabled = true;
        }
        return ak;
      };
      const ag = () => {
        if (!m.outbounds) {
          m.outbounds = [];
        }
        if (!m.outbounds.some((ai) => ai && ai.tag === "REJECT")) {
          m.outbounds.push({
            type: "block",
            tag: "REJECT",
          });
        }
      };
      const ah = (ai) => m.route.rules.some(ai);
      if (
        u.enableMalwareBlock &&
        !ah(
          (ai) =>
            ai.outbound === "block" && JSON.stringify(ai).includes("malware"),
        )
      ) {
        ag();
        m.route.rules.unshift({
          outbound: "block",
          rule_set: [af("geosite", "category-malware")],
        });
      }
      if (
        u.enablePhishingBlock &&
        !ah(
          (ai) =>
            ai.outbound === "block" && JSON.stringify(ai).includes("phishing"),
        )
      ) {
        ag();
        m.route.rules.unshift({
          outbound: "block",
          rule_set: [af("geosite", "category-phishing")],
        });
      }
      if (
        u.blockQUIC &&
        !ah(
          (ai) =>
            ai.outbound === "block" &&
            ai.network === "udp" &&
            Array.isArray(ai.port) &&
            ai.port.includes(443),
        )
      ) {
        ag();
        m.route.rules.unshift({
          outbound: "block",
          network: "udp",
          port: [443],
        });
      }
      if (
        u.bypassChina &&
        !ah(
          (ai) =>
            ai.outbound === "direct" && JSON.stringify(ai).includes("-cn"),
        )
      ) {
        m.route.rules.unshift({
          outbound: "direct",
          rule_set: [af("geoip", "cn"), af("geosite", "cn")],
          type: "logical",
          mode: "or",
          rules: [
            {
              rule_set: [af("geoip", "cn")],
            },
            {
              rule_set: [af("geosite", "cn")],
            },
          ],
        });
      }
      if (
        u.bypassRussia &&
        !ah(
          (ai) =>
            ai.outbound === "direct" && JSON.stringify(ai).includes("-ru"),
        )
      ) {
        m.route.rules.unshift({
          outbound: "direct",
          rule_set: [af("geoip", "ru"), af("geosite", "ru")],
          type: "logical",
          mode: "or",
          rules: [
            {
              rule_set: [af("geoip", "ru")],
            },
            {
              rule_set: [af("geosite", "ru")],
            },
          ],
        });
      }
      if (
        u.bypassSanctions &&
        !ah(
          (ai) =>
            ai.outbound === "direct" &&
            JSON.stringify(ai).includes("sanctioned"),
        )
      ) {
        m.route.rules.unshift({
          outbound: "direct",
          rule_set: [af("geosite", "category-sanctioned-ir")],
        });
      }
    }
    if (h) {
      m.outbounds?.forEach((ai) => {
        if ((ai.uuid && ai.uuid === h) || (ai.password && ai.password === h)) {
          if (!ai.tls) {
            ai.tls = {
              enabled: true,
            };
          }
          if (i) {
            ai.tls.utls = {
              enabled: true,
              fingerprint: i,
            };
          }
          if (j) {
            ai.tls.ech = {
              enabled: true,
              query_server_name: k,
            };
          }
        }
      });
    }
    return JSON.stringify(m, null, 2);
  } catch (ai) {
    console.error("SingboxhotpatchExecutionFailed:", ai);
    return JSON.stringify(JSON.parse(l), null, 2);
  }
}
function SurgesubConfigFileHotpatch(c, f, g) {
  const h = c.includes("\r\n") ? c.split("\r\n") : c.split("\n");
  const i = g.randomPath ? randomPath(g.fullNodePath) : g.fullNodePath;
  let j = "";
  for (let k of h) {
    if (
      k.includes("= trojan,") &&
      !k.includes("ws=true") &&
      !k.includes("ws-path=")
    ) {
      const l = k.split("sni=")[1].split(",")[0];
      const m = "sni=" + l + ", skip-cert-verify=" + g.skipCertVerify;
      const n =
        "sni=" +
        l +
        ", skip-cert-verify=" +
        g.skipCertVerify +
        ", ws=true, ws-path=" +
        i.replace(/,/g, "%2C") +
        ', ws-headers=Host:"' +
        l +
        '"';
      j +=
        k.replace(new RegExp(m, "g"), n).replace("[", "").replace("]", "") +
        "\n";
    } else {
      j += k + "\n";
    }
  }
  j =
    "#!MANAGED-CONFIG " +
    f +
    " interval=" +
    g.optimizedSubGeneration.SUBUpdateTime * 60 * 60 +
    " strict=false" +
    j.substring(j.indexOf("\n"));
  return j;
}
function formatBytes(c) {
  c = Number(c) || 0;
  const f = ["B", "KB", "MB", "GB", "TB"];
  let g = 0;
  while (c >= 1024 && g < f.length - 1) {
    c /= 1024;
    g++;
  }
  return c.toFixed(g === 0 ? 0 : 2) + " " + f[g];
}
function tehranYMD(c) {
  const f = new Date(c);
  const g = 210;
  const h = new Date(f.getTime() + g * 60000);
  const i = h.getUTCFullYear();
  const j = String(h.getUTCMonth() + 1).padStart(2, "0");
  const k = String(h.getUTCDate()).padStart(2, "0");
  return {
    year: i,
    month: j,
    day: k,
  };
}
async function readUsageStats(c) {
  const f = new Date();
  const g = () => ({
    up: 0,
    down: 0,
    total: 0,
  });
  const h = (await usageGet(c, "usage:" + getDateKey(f))) || g();
  const i = (await usageGet(c, "usage-m:" + getMonthKey(f))) || g();
  const j = g();
  const k = g();
  try {
    const l = "usage-m:" + tehranYMD(f).year + "-";
    const m = await usageListMonths(c);
    for (const n of m) {
      k.up += n.up || 0;
      k.down += n.down || 0;
      k.total += n.total || 0;
      if (n.name.startsWith(l)) {
        j.up += n.up || 0;
        j.down += n.down || 0;
        j.total += n.total || 0;
      }
    }
  } catch (o) {}
  return {
    today: h,
    month: i,
    year: j,
    all: k,
  };
}
async function getPoolHosts(c) {
  try {
    const f =
      c.KV && typeof c.KV.get === "function" ? await getConfigRaw(c) : null;
    const g = f ? JSON.parse(f) : null;
    if (g && Array.isArray(g.HOSTS) && g.HOSTS.length) {
      return [...new Set(g.HOSTS.filter(Boolean))];
    }
    if (g && g.HOST) {
      return [g.HOST];
    }
  } catch (h) {}
  return [];
}
async function resolvePrimaryBaseUrl(c) {
  const f = await getPoolHosts(c);
  const g = f.find((i) => i && !i.includes("*"));
  if (g) {
    return "https://" + g.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  } else {
    return null;
  }
}
async function checkDomainHealth(c, f, g) {
  const h = (m) =>
    String(m || "")
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0];
  const i = h(g);
  const j = (f || []).filter((m) => m && !m.includes("*"));
  const k = [];
  await Promise.all(
    j.map(async (m) => {
      if (i && h(m) === i) {
        k.push({
          host: m,
          ok: true,
          status: 200,
          reason: "live (this worker)",
          checkedAt: Date.now(),
        });
        return;
      }
      let n = false;
      let o = 0;
      let p = "";
      try {
        const q = {
          headers: {
            "User-Agent": "YNSHealth/1.0",
          },
        };
        if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
          q.signal = AbortSignal.timeout(8000);
        }
        const s = await fetch(
          "https://" + m.replace(/^https?:\/\//, "") + "/sub/base64.txt",
          q,
        );
        o = s.status;
        n = s.ok;
        if (n) {
          const u = await s.text();
          n = !!u && u.length > 8;
          if (!n) {
            p = "empty or invalid sub response";
          }
        } else {
          let v = "";
          try {
            v = (await s.text())
              .replace(/<[^>]+>/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 80);
          } catch (w) {}
          p = "HTTP " + o + (v ? ": " + v : "");
        }
      } catch (x) {
        o = -1;
        p = (x && x.message ? x.message : String(x)).slice(0, 120);
      }
      k.push({
        host: m,
        ok: n,
        status: o,
        reason: p,
        checkedAt: Date.now(),
      });
    }),
  );
  const l = {
    checkedAt: Date.now(),
    domains: k,
  };
  try {
    await c.KV.put("domain-health.json", JSON.stringify(l));
  } catch (m) {}
  return l;
}
async function runScheduledMaintenance(c) {
  const f = await getPoolHosts(c);
  const g = await resolvePrimaryBaseUrl(c);
  const h = await checkDomainHealth(
    c,
    f,
    String(g || "")
      .replace(/^https?:\/\//, "")
      .split("/")[0],
  );
  try {
    await buildFallbackNodes(c);
  } catch (j) {
    console.error("buildFallbackNodes error:", j && j.message);
  }
  const i = await publishSubMirror(c, g);
  try {
    await centralHeartbeat(c);
  } catch (k) {}
  try {
    await refreshAnnouncements(c);
  } catch (l) {}
  return {
    health: h,
    mirror: i,
  };
}
async function announceSubLinks(c, f = {}) {
  try {
    const g =
      c.KV && typeof c.KV.get === "function" ? await c.KV.get("tg.json") : null;
    if (!g) {
      return {
        skipped: true,
        reason: "Telegram not configured",
      };
    }
    const h = JSON.parse(g);
    const i = String(c.ANNOUNCE_CHAT || h.ChatID || "").trim();
    if (!h.BotToken || !i) {
      return {
        skipped: true,
        reason: "BotToken/ChatID missing",
      };
    }
    const j =
      f.baseUrl ||
      (c.KV
        ? "https://" +
          (JSON.parse((await getConfigRaw(c)) || "{}").HOST || "unknown")
        : null);
    const k = ["<b>🔥 لینک‌های اشتراک YNS / YNS subscription links</b>", ""];
    if (j) {
      k.push(
        "<b>⚡️ لینک مستقیم (بهینه per-ISP) / Live (per-ISP optimized)</b>",
      );
      k.push("<code>" + j + "/sub/mihomo.yaml</code>");
      k.push("<code>" + j + "/sub/base64.txt</code>");
      k.push("");
    }
    if (
      f.health &&
      Array.isArray(f.health.domains) &&
      f.health.domains.length
    ) {
      const l = f.health.domains.filter((m) => m.ok).length;
      k.push(
        "<b>🌐 دامنه‌ها / Domains:</b> " +
          l +
          "/" +
          f.health.domains.length +
          " ✅",
      );
      k.push("");
    }
    k.push(
      "<i>محتوای همه لینک‌ها یکی است؛ اگر یکی فیلتر شد، لینک گیت‌هاب همیشه کار می‌کند.</i>",
    );
    k.push(
      "<i>All links share the same content. If one gets filtered, the GitHub link still works.</i>",
    );
    await sendBotMessage(h.BotToken, i, k.join("\n"));
    return {
      skipped: false,
      chatId: i,
    };
  } catch (m) {
    return {
      skipped: true,
      reason: m && m.message ? m.message : String(m),
    };
  }
}
async function requestLogRecord(c, f, g, h = "Get_SUB", i, j = true) {
  try {
    const k = new Date();
    const l = {
      TYPE: h,
      IP: g,
      ASN: "AS" + (f.cf.asn || "0") + " " + (f.cf.asOrganization || "Unknown"),
      CC: (f.cf.country || "N/A") + " " + (f.cf.city || "N/A"),
      URL: f.url,
      UA: f.headers.get("User-Agent") || "Unknown",
      TIME: k.getTime(),
    };
    if (i.TG.enabled) {
      try {
        const p = await c.KV.get("tg.json");
        const q = JSON.parse(p);
        if (q?.BotToken && q?.ChatID) {
          const r = new Date(l.TIME);
          const s =
            r.toLocaleDateString("fa-IR", {
              timeZone: "Asia/Tehran",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) +
            " " +
            r.toLocaleTimeString("fa-IR", {
              timeZone: "Asia/Tehran",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
          const t = new URL(l.URL);
          const u = {
            Get_SUB: "دریافت اشتراک",
            Get_Best_SUB: "اشتراک بهینه",
            Init_Config: "بازنشانی تنظیمات",
            Save_Config: "ذخیره تنظیمات",
            Save_Custom_IPs: "ذخیره IP های سفارشی",
            Admin_Login: "ورود به پنل",
          };
          const v = l.CC.replace("N/A", "نامشخص");
          const w =
            "<b>#" +
            i.optimizedSubGeneration.SUBNAME +
            " اطلاع‌رسانی</b>\n\n" +
            ("📌 <b>نوع:</b> " + (u[l.TYPE] || l.TYPE) + "\n") +
            ("🌐 <b>IP:</b> <code>" + l.IP + "</code>\n") +
            ("📍 <b>موقعیت:</b> " + v + "\n") +
            ("🏢 <b>ASN:</b> " + l.ASN + "\n") +
            ("🔗 <b>دامنه:</b> <code>" + t.host + "</code>\n") +
            ("🔍 <b>مسیر:</b> <code>" + (t.pathname + t.search) + "</code>\n") +
            ("🤖 <b>مرورگر:</b> <code>" + l.UA + "</code>\n") +
            ("📅 <b>زمان:</b> " + s + "\n") +
            ("" +
              (i.CF.Usage.success
                ? "📊 <b>مصرف:</b> " +
                  i.CF.Usage.total +
                  "/" +
                  i.CF.Usage.max +
                  " <b>" +
                  ((i.CF.Usage.total / i.CF.Usage.max) * 100).toFixed(2) +
                  "%</b>\n"
                : ""));
          await fetch(
            "https://api.telegram.org/bot" +
              q.BotToken +
              "/sendMessage?chat_id=" +
              q.ChatID +
              "&parse_mode=HTML&text=" +
              encodeURIComponent(w),
            {
              method: "GET",
              headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": l.UA || "Unknown",
              },
            },
          );
        }
      } catch (x) {
        console.error("readTg.jsonerrorOccurred: " + x.message);
      }
    }
    j = ["1", "true"].includes(c.OFF_LOG) ? false : j;
    if (!j) {
      return;
    }
    if (await logWriteD1(c, g, f, h, l, k)) {
      return;
    }
    let m = [];
    const n = await c.KV.get("log.json");
    const o = 4;
    if (n) {
      try {
        m = JSON.parse(n);
        if (!Array.isArray(m)) {
          m = [l];
        } else if (h !== "Get_SUB") {
          const y = k.getTime() - 1800000;
          if (
            m.some(
              (z) =>
                z.TYPE !== "Get_SUB" &&
                z.IP === g &&
                z.URL === f.url &&
                z.UA === (f.headers.get("User-Agent") || "Unknown") &&
                z.TIME >= y,
            )
          ) {
            return;
          }
          m.push(l);
          while (
            JSON.stringify(m, null, 2).length > o * 1024 * 1024 &&
            m.length > 0
          ) {
            m.shift();
          }
        } else {
          m.push(l);
          while (
            JSON.stringify(m, null, 2).length > o * 1024 * 1024 &&
            m.length > 0
          ) {
            m.shift();
          }
        }
      } catch (z) {
        m = [l];
      }
    } else {
      m = [l];
    }
    await c.KV.put("log.json", JSON.stringify(m, null, 2));
  } catch (A) {
    console.error("logRecordFailed: " + A.message);
  }
}
function maskSensitiveInfo(c, f = 3, g = 2) {
  if (!c || typeof c !== "string") {
    return c;
  }
  if (c.length <= f + g) {
    return c;
  }
  const h = c.slice(0, f);
  const i = c.slice(-g);
  const j = c.length - f - g;
  return "" + h + "*".repeat(j) + i;
}
async function MD5MD5(c) {
  if (_md5md5Cache.has(c)) {
    return _md5md5Cache.get(c);
  }
  const f = new TextEncoder();
  const g = await crypto.subtle.digest("MD5", f.encode(c));
  const h = Array.from(new Uint8Array(g));
  const i = h.map((n) => n.toString(16).padStart(2, "0")).join("");
  const j = await crypto.subtle.digest("MD5", f.encode(i.slice(7, 27)));
  const k = Array.from(new Uint8Array(j));
  const l = k.map((n) => n.toString(16).padStart(2, "0")).join("");
  const m = l.toLowerCase();
  if (_md5md5Cache.size > 500) {
    _md5md5Cache.clear();
  }
  _md5md5Cache.set(c, m);
  return m;
}
function randomPath(c = "/") {
  const f = [
    "about",
    "account",
    "acg",
    "act",
    "activity",
    "ad",
    "ads",
    "ajax",
    "album",
    "albums",
    "anime",
    "api",
    "app",
    "apps",
    "archive",
    "archives",
    "article",
    "articles",
    "ask",
    "auth",
    "avatar",
    "bbs",
    "bd",
    "blog",
    "blogs",
    "book",
    "books",
    "bt",
    "buy",
    "cart",
    "category",
    "categories",
    "cb",
    "channel",
    "channels",
    "chat",
    "china",
    "city",
    "class",
    "classify",
    "clip",
    "clips",
    "club",
    "cn",
    "code",
    "collect",
    "collection",
    "comic",
    "comics",
    "community",
    "company",
    "config",
    "contact",
    "content",
    "course",
    "courses",
    "cp",
    "data",
    "detail",
    "details",
    "dh",
    "directory",
    "discount",
    "discuss",
    "dl",
    "dload",
    "doc",
    "docs",
    "document",
    "documents",
    "doujin",
    "download",
    "downloads",
    "drama",
    "edu",
    "en",
    "ep",
    "episode",
    "episodes",
    "event",
    "events",
    "f",
    "faq",
    "favorite",
    "favourites",
    "favs",
    "feedback",
    "file",
    "files",
    "film",
    "films",
    "forum",
    "forums",
    "friend",
    "friends",
    "game",
    "games",
    "gif",
    "go",
    "go.html",
    "go.php",
    "group",
    "groups",
    "help",
    "home",
    "hot",
    "htm",
    "html",
    "image",
    "images",
    "img",
    "index",
    "info",
    "intro",
    "item",
    "items",
    "ja",
    "jp",
    "jump",
    "jump.html",
    "jump.php",
    "jumping",
    "knowledge",
    "lang",
    "lesson",
    "lessons",
    "lib",
    "library",
    "link",
    "links",
    "list",
    "live",
    "lives",
    "m",
    "mag",
    "magnet",
    "mall",
    "manhua",
    "map",
    "member",
    "members",
    "message",
    "messages",
    "mobile",
    "movie",
    "movies",
    "music",
    "my",
    "new",
    "news",
    "note",
    "novel",
    "novels",
    "online",
    "order",
    "out",
    "out.html",
    "out.php",
    "outbound",
    "p",
    "page",
    "pages",
    "pay",
    "payment",
    "pdf",
    "photo",
    "photos",
    "pic",
    "pics",
    "picture",
    "pictures",
    "play",
    "player",
    "playlist",
    "post",
    "posts",
    "product",
    "products",
    "program",
    "programs",
    "project",
    "qa",
    "question",
    "rank",
    "ranking",
    "read",
    "readme",
    "redirect",
    "redirect.html",
    "redirect.php",
    "reg",
    "register",
    "res",
    "resource",
    "retrieve",
    "sale",
    "search",
    "season",
    "seasons",
    "section",
    "seller",
    "series",
    "service",
    "services",
    "setting",
    "settings",
    "share",
    "shop",
    "show",
    "shows",
    "site",
    "soft",
    "sort",
    "source",
    "special",
    "star",
    "stars",
    "static",
    "stock",
    "store",
    "stream",
    "streaming",
    "streams",
    "student",
    "study",
    "tag",
    "tags",
    "task",
    "teacher",
    "team",
    "tech",
    "temp",
    "test",
    "thread",
    "tool",
    "tools",
    "topic",
    "topics",
    "torrent",
    "trade",
    "travel",
    "tv",
    "txt",
    "type",
    "u",
    "upload",
    "uploads",
    "url",
    "urls",
    "user",
    "users",
    "v",
    "version",
    "videos",
    "view",
    "vip",
    "vod",
    "watch",
    "web",
    "wenku",
    "wiki",
    "work",
    "www",
    "zh",
    "zh-cn",
    "zh-tw",
    "zip",
  ];
  const g = Math.floor(Math.random() * 3 + 1);
  const h = Array.from(
    {
      length: g,
    },
    () => f[Math.floor(Math.random() * f.length)],
  ).join("/");
  if (c === "/") {
    return "/" + h;
  } else {
    return "/" + (h + c.replace("/?", "?"));
  }
}
function replaceStarWithRandom(c) {
  if (typeof c !== "string" || !c.includes("*")) {
    return c;
  }
  const f = "abcdefghijklmnopqrstuvwxyz0123456789";
  return c.replace(/\*/g, () => {
    let g = "";
    for (let h = 0; h < Math.floor(Math.random() * 14) + 3; h++) {
      g += f[Math.floor(Math.random() * f.length)];
    }
    return g;
  });
}
async function DoHquery(c, f, g = "https://cloudflare-dns.com/dns-query") {
  const h = performance.now();
  log("[DoHquery] startQuery " + c + " " + f + " via " + g);
  try {
    const k = {
      A: 1,
      NS: 2,
      CNAME: 5,
      MX: 15,
      TXT: 16,
      AAAA: 28,
      SRV: 33,
      HTTPS: 65,
    };
    const l = k[f.toUpperCase()] || 1;
    const m = (z) => {
      const A = z.endsWith(".") ? z.slice(0, -1).split(".") : z.split(".");
      const B = [];
      for (const F of A) {
        const G = new TextEncoder().encode(F);
        B.push(new Uint8Array([G.length]), G);
      }
      B.push(new Uint8Array([0]));
      const C = B.reduce((H, I) => H + I.length, 0);
      const D = new Uint8Array(C);
      let E = 0;
      for (const H of B) {
        D.set(H, E);
        E += H.length;
      }
      return D;
    };
    const n = m(c);
    const o = new Uint8Array(12 + n.length + 4);
    const p = new DataView(o.buffer);
    p.setUint16(0, crypto.getRandomValues(new Uint16Array(1))[0]);
    p.setUint16(2, 256);
    p.setUint16(4, 1);
    o.set(n, 12);
    p.setUint16(12 + n.length, l);
    p.setUint16(12 + n.length + 2, 1);
    log(
      "[DoHquery] sendQueryMessage " +
        c +
        " via " +
        g +
        " (type=" +
        l +
        ", " +
        o.length +
        "bytes)",
    );
    const q = await fetch(g, {
      method: "POST",
      headers: {
        "Content-Type": "application/dns-message",
        Accept: "application/dns-message",
      },
      body: o,
    });
    if (!q.ok) {
      console.warn(
        "[DoHquery] requestFail " +
          c +
          " " +
          f +
          " via " +
          g +
          " responseCode:" +
          q.status,
      );
      return [];
    }
    const r = new Uint8Array(await q.arrayBuffer());
    const s = new DataView(r.buffer);
    const t = s.getUint16(4);
    const u = s.getUint16(6);
    log(
      "[DoHquery] receivedResponse " +
        c +
        " " +
        f +
        " via " +
        g +
        " (" +
        r.length +
        "bytes, " +
        u +
        "answers)",
    );
    const v = (z) => {
      const A = [];
      let B = z;
      let C = false;
      let D = -1;
      let E = 128;
      while (B < r.length && E-- > 0) {
        const F = r[B];
        if (F === 0) {
          if (!C) {
            D = B + 1;
          }
          break;
        }
        if ((F & 192) === 192) {
          if (!C) {
            D = B + 2;
          }
          B = ((F & 63) << 8) | r[B + 1];
          C = true;
          continue;
        }
        A.push(new TextDecoder().decode(r.slice(B + 1, B + 1 + F)));
        B += F + 1;
      }
      if (D === -1) {
        D = B + 1;
      }
      return [A.join("."), D];
    };
    let w = 12;
    for (let z = 0; z < t; z++) {
      const [, A] = v(w);
      w = A + 4;
    }
    const x = [];
    for (let B = 0; B < u && w < r.length; B++) {
      const [C, D] = v(w);
      w = D;
      const E = s.getUint16(w);
      w += 2;
      w += 2;
      const F = s.getUint32(w);
      w += 4;
      const G = s.getUint16(w);
      w += 2;
      const H = r.slice(w, w + G);
      w += G;
      let I;
      if (E === 1 && G === 4) {
        I = H[0] + "." + H[1] + "." + H[2] + "." + H[3];
      } else if (E === 28 && G === 16) {
        const J = [];
        for (let K = 0; K < 16; K += 2) {
          J.push(((H[K] << 8) | H[K + 1]).toString(16));
        }
        I = J.join(":");
      } else if (E === 16) {
        let L = 0;
        const M = [];
        while (L < G) {
          const N = H[L++];
          M.push(new TextDecoder().decode(H.slice(L, L + N)));
          L += N;
        }
        I = M.join("");
      } else if (E === 5) {
        const [O] = v(w - G);
        I = O;
      } else {
        I = Array.from(H)
          .map((P) => P.toString(16).padStart(2, "0"))
          .join("");
      }
      x.push({
        name: C,
        type: E,
        TTL: F,
        data: I,
        rdata: H,
      });
    }
    const y = (performance.now() - h).toFixed(2);
    log(
      "[DoHquery] queryDone " +
        c +
        " " +
        f +
        " via " +
        g +
        " " +
        y +
        "ms total" +
        x.length +
        "results" +
        (x.length > 0
          ? "\n" +
            x
              .map(
                (P, Q) =>
                  "  " +
                  (Q + 1) +
                  ". " +
                  P.name +
                  " type=" +
                  P.type +
                  " TTL=" +
                  P.TTL +
                  " data=" +
                  P.data,
              )
              .join("\n")
          : ""),
    );
    return x;
  } catch (P) {
    const Q = (performance.now() - h).toFixed(2);
    console.error(
      "[DoHquery] queryFail " + c + " " + f + " via " + g + " " + Q + "ms:",
      P,
    );
    return [];
  }
}
async function readConfigJson(c, f, g, h = "Mozilla/5.0", i = false) {
  const j = "PROXYIP";
  const k = f;
  const l = "https://dns.alidns.com/dns-query";
  const m = "cloudflare-ech.com";
  const n = "{{IP:PORT}}";
  const o = performance.now();
  const p = {
    TIME: new Date().toISOString(),
    HOST: k,
    HOSTS: [f],
    UUID: g,
    PATH: "/",
    protocolType: "vless",
    transportProtocol: "ws",
    gRPCmode: "gun",
    gRPCUserAgent: h,
    skipCertVerify: false,
    enable0RTT: false,
    tlsFragment: null,
    randomPath: false,
    ECH: false,
    ECHConfig: {
      DNS: l,
      SNI: m,
    },
    SS: {
      cipherMethod: "aes-128-gcm",
      TLS: true,
    },
    Fingerprint: "chrome",
    optimizedSubGeneration: {
      local: true,
      localIPPool: {
        randomIP: true,
        randomCount: 16,
        specifiedPorts: -1,
      },
      SUB: null,
      SUBNAME: "YNS",
      SUBUpdateTime: 3,
      TOKEN: await MD5MD5(f + g),
    },
    subConverterConfig: {
      SUBAPI: "https://SUBAPI.cmliussss.net",
      SUBCONFIG:
        "https://raw.githubusercontent.com/cmliu/ACL4SSR/refs/heads/main/Clash/config/ACL4SSR_Online_Mini_MultiMode_CF.ini",
      SUBEMOJI: false,
    },
    proxy: {
      [j]: "auto",
      SOCKS5: {
        enabled: enableSocks5Proxy,
        globalScope: enableSocks5GlobalProxy,
        accountStr: mySocks5Account,
        whitelist: SOCKS5whitelist,
      },
      pathTemplate: {
        [j]: "proxyip=" + n,
        SOCKS5: {
          globalScope: "socks5://" + n,
          standardScope: "socks5=" + n,
        },
        HTTP: {
          globalScope: "http://" + n,
          standardScope: "http=" + n,
        },
        HTTPS: {
          globalScope: "https://" + n,
          standardScope: "https=" + n,
        },
        TURN: {
          globalScope: "turn://" + n,
          standardScope: "turn=" + n,
        },
        SSTP: {
          globalScope: "sstp://" + n,
          standardScope: "sstp=" + n,
        },
      },
    },
    TG: {
      enabled: false,
      BotToken: null,
      ChatID: null,
    },
    CF: {
      Email: null,
      GlobalAPIKey: null,
      AccountID: null,
      APIToken: null,
      UsageAPI: null,
      Usage: {
        success: false,
        pages: 0,
        workers: 0,
        total: 0,
        max: 100000,
      },
    },
  };
  try {
    let G = await getConfigRaw(c);
    if (!G || i == true) {
      await putConfig(c, JSON.stringify(p, null, 2));
      config_JSON = p;
    } else {
      config_JSON = JSON.parse(G);
      if (
        config_JSON.协议类型 !== undefined &&
        config_JSON.protocolType === undefined
      ) {
        config_JSON.protocolType = config_JSON.协议类型;
      }
      if (
        config_JSON.multiProtocolSub ||
        config_JSON.protocolType === "all" ||
        config_JSON.protocolType === "vmess"
      ) {
        config_JSON.multiProtocolSub = false;
        if (
          config_JSON.protocolType === "all" ||
          config_JSON.protocolType === "vmess" ||
          !config_JSON.protocolType
        ) {
          config_JSON.protocolType = "vless";
        }
      }
      if (
        config_JSON.传输协议 !== undefined &&
        config_JSON.transportProtocol === undefined
      ) {
        config_JSON.transportProtocol = config_JSON.传输协议;
      }
      if (
        config_JSON.跳过证书验证 !== undefined &&
        config_JSON.skipCertVerify === undefined
      ) {
        config_JSON.skipCertVerify = config_JSON.跳过证书验证;
      }
      if (
        config_JSON.启用0RTT !== undefined &&
        config_JSON.enable0RTT === undefined
      ) {
        config_JSON.enable0RTT = config_JSON.启用0RTT;
      }
      if (
        config_JSON.TLS分片 !== undefined &&
        config_JSON.tlsFragment === undefined
      ) {
        config_JSON.tlsFragment = config_JSON.TLS分片;
      }
      if (
        config_JSON.随机路径 !== undefined &&
        config_JSON.randomPath === undefined
      ) {
        config_JSON.randomPath = config_JSON.随机路径;
      }
      if (
        config_JSON.gRPC模式 !== undefined &&
        config_JSON.gRPCmode === undefined
      ) {
        config_JSON.gRPCmode = config_JSON.gRPC模式;
      }
      if (
        config_JSON.完整节点路径 !== undefined &&
        config_JSON.fullNodePath === undefined
      ) {
        config_JSON.fullNodePath = config_JSON.完整节点路径;
      }
      if (
        config_JSON.SS &&
        config_JSON.SS.加密方式 !== undefined &&
        config_JSON.SS.cipherMethod === undefined
      ) {
        config_JSON.SS.cipherMethod = config_JSON.SS.加密方式;
      }
      if (
        config_JSON.优选订阅生成 &&
        config_JSON.optimizedSubGeneration === undefined
      ) {
        config_JSON.optimizedSubGeneration = {
          local:
            config_JSON.优选订阅生成.local !== undefined
              ? config_JSON.优选订阅生成.local
              : true,
          localIPPool: {
            randomIP:
              config_JSON.优选订阅生成.本地IP库?.随机IP !== undefined
                ? config_JSON.优选订阅生成.本地IP库.随机IP
                : true,
            randomCount: config_JSON.优选订阅生成.本地IP库?.随机数量 || 16,
            specifiedPorts: config_JSON.优选订阅生成.本地IP库?.指定端口 || -1,
          },
          SUB: config_JSON.优选订阅生成.SUB || null,
          SUBNAME: config_JSON.优选订阅生成.SUBNAME || "YNS",
          SUBUpdateTime: config_JSON.优选订阅生成.SUBUpdateTime || 3,
          TOKEN: config_JSON.优选订阅生成.TOKEN || (await MD5MD5(f + g)),
        };
      }
      if (
        config_JSON.订阅转换配置 &&
        config_JSON.subConverterConfig === undefined
      ) {
        config_JSON.subConverterConfig = {
          SUBAPI:
            config_JSON.订阅转换配置.SUBAPI || "https://SUBAPI.cmliussss.net",
          SUBCONFIG:
            config_JSON.订阅转换配置.SUBCONFIG ||
            "https://raw.githubusercontent.com/cmliu/ACL4SSR/refs/heads/main/Clash/config/ACL4SSR_Online_Mini_MultiMode_CF.ini",
          SUBEMOJI: config_JSON.订阅转换配置.SUBEMOJI || false,
        };
      }
      if (config_JSON.反代 && config_JSON.proxy === undefined) {
        config_JSON.proxy = {
          [j]: config_JSON.反代[j] || "auto",
          SOCKS5: {
            enabled:
              config_JSON.反代.SOCKS5?.启用 !== undefined
                ? config_JSON.反代.SOCKS5.启用
                : enableSocks5Proxy,
            globalScope:
              config_JSON.反代.SOCKS5?.全局 || enableSocks5GlobalProxy,
            accountStr: config_JSON.反代.SOCKS5?.账号 || mySocks5Account,
            whitelist: config_JSON.反代.SOCKS5?.白名单 || SOCKS5whitelist,
          },
          pathTemplate:
            config_JSON.反代.路径Template || config_JSON.反代.路径模板 || null,
        };
      }
    }
  } catch (H) {
    console.error("readConfigJsonError: " + H.message);
    config_JSON = p;
  }
  if (!config_JSON.gRPCUserAgent) {
    config_JSON.gRPCUserAgent = h;
  }
  config_JSON.HOST = k;
  if (!config_JSON.HOSTS) {
    config_JSON.HOSTS = [f];
  }
  if (c.HOST) {
    config_JSON.HOSTS = (await sortIntoArray(c.HOST)).map(
      (I) =>
        I.toLowerCase()
          .replace(/^https?:\/\//, "")
          .split("/")[0]
          .split(":")[0],
    );
  }
  config_JSON.UUID = g;
  if (!config_JSON.randomPath) {
    config_JSON.randomPath = false;
  }
  if (!config_JSON.enable0RTT) {
    config_JSON.enable0RTT = false;
  }
  if (config_JSON.skipCertVerify === undefined) {
    config_JSON.skipCertVerify = false;
  }
  if (c.PATH) {
    config_JSON.PATH = c.PATH.startsWith("/") ? c.PATH : "/" + c.PATH;
  } else if (!config_JSON.PATH) {
    config_JSON.PATH = "/";
  }
  if (!config_JSON.gRPCmode) {
    config_JSON.gRPCmode = "gun";
  }
  if (!config_JSON.SS) {
    config_JSON.SS = {
      cipherMethod: "aes-128-gcm",
      TLS: false,
    };
  }
  if (!config_JSON.proxy.pathTemplate?.[j]) {
    config_JSON.proxy.pathTemplate = {
      [j]: "proxyip=" + n,
      SOCKS5: {
        globalScope: "socks5://" + n,
        standardScope: "socks5=" + n,
      },
      HTTP: {
        globalScope: "http://" + n,
        standardScope: "http=" + n,
      },
      HTTPS: {
        globalScope: "https://" + n,
        standardScope: "https=" + n,
      },
      TURN: {
        globalScope: "turn://" + n,
        standardScope: "turn=" + n,
      },
      SSTP: {
        globalScope: "sstp://" + n,
        standardScope: "sstp=" + n,
      },
    };
  }
  if (!config_JSON.proxy.pathTemplate.HTTPS) {
    config_JSON.proxy.pathTemplate.HTTPS = {
      globalScope: "https://" + n,
      standardScope: "https=" + n,
    };
  }
  if (!config_JSON.proxy.pathTemplate.TURN) {
    config_JSON.proxy.pathTemplate.TURN = {
      globalScope: "turn://" + n,
      standardScope: "turn=" + n,
    };
  }
  if (!config_JSON.proxy.pathTemplate.SSTP) {
    config_JSON.proxy.pathTemplate.SSTP = {
      globalScope: "sstp://" + n,
      standardScope: "sstp=" + n,
    };
  }
  const q =
    config_JSON.proxy.pathTemplate[
      config_JSON.proxy.SOCKS5.enabled?.toUpperCase()
    ];
  let r = "";
  if (q && config_JSON.proxy.SOCKS5.accountStr) {
    r = (
      config_JSON.proxy.SOCKS5.globalScope ? q.globalScope : q.standardScope
    ).replace(n, config_JSON.proxy.SOCKS5.accountStr);
  } else if (config_JSON.proxy[j] !== "auto") {
    r = config_JSON.proxy.pathTemplate[j].replace(n, config_JSON.proxy[j]);
  }
  let s = "";
  if (r.includes("?")) {
    const [I, J] = r.split("?");
    r = I;
    s = J;
  }
  config_JSON.PATH = config_JSON.PATH.replace(r, "").replace("//", "/");
  const t =
    config_JSON.PATH === "/"
      ? ""
      : config_JSON.PATH.replace(/\/+(?=\?|$)/, "").replace(/\/+$/, "");
  const [u, ...v] = t.split("?");
  const w = v.length ? "?" + v.join("?") : "";
  const x = s ? (w ? w + "&" + s : "?" + s) : w;
  config_JSON.fullNodePath =
    (u || "/") +
    (u && r ? "/" : "") +
    r +
    x +
    (config_JSON.enable0RTT ? (x ? "&" : "?") + "ed=2560" : "");
  if (!config_JSON.tlsFragment && config_JSON.tlsFragment !== null) {
    config_JSON.tlsFragment = null;
  }
  const y =
    config_JSON.tlsFragment == "Shadowrocket"
      ? "&fragment=" + encodeURIComponent("1,40-60,30-50,tlshello")
      : config_JSON.tlsFragment == "Happ"
        ? "&fragment=" + encodeURIComponent("3,1,tlshello")
        : "";
  if (!config_JSON.Fingerprint) {
    config_JSON.Fingerprint = "chrome";
  }
  if (!config_JSON.ECH) {
    config_JSON.ECH = false;
  }
  if (!config_JSON.ECHConfig) {
    config_JSON.ECHConfig = {
      DNS: l,
      SNI: m,
    };
  }
  const z = config_JSON.ECH
    ? "&ech=" +
      encodeURIComponent(
        (config_JSON.ECHConfig.SNI ? config_JSON.ECHConfig.SNI + "+" : "") +
          config_JSON.ECHConfig.DNS,
      )
    : "";
  const {
    type: A,
    pathFieldName: B,
    domainFieldName: C,
  } = getTransportProtocolConfig(config_JSON);
  const D = getTransportPathParamValue(config_JSON, config_JSON.fullNodePath);
  config_JSON.LINK =
    config_JSON.protocolType === "ss"
      ? config_JSON.protocolType +
        "://" +
        btoa(config_JSON.SS.cipherMethod + ":" + g) +
        "@" +
        k +
        ":" +
        (config_JSON.SS.TLS ? "443" : "80") +
        "?plugin=v2" +
        (encodeURIComponent(
          "ray-plugin;mode=websocket;host=" +
            k +
            ";path=" +
            ((config_JSON.fullNodePath.includes("?")
              ? config_JSON.fullNodePath.replace(
                  "?",
                  "?enc=" + config_JSON.SS.cipherMethod + "&",
                )
              : config_JSON.fullNodePath +
                "?enc=" +
                config_JSON.SS.cipherMethod) +
              (config_JSON.SS.TLS ? ";tls" : "")) +
            ";mux=0",
        ) +
          z) +
        "#" +
        encodeURIComponent(config_JSON.optimizedSubGeneration.SUBNAME)
      : config_JSON.enableTLS === false
        ? config_JSON.protocolType +
          "://" +
          g +
          "@" +
          k +
          ":80?security=none&type=" +
          A +
          "&" +
          C +
          "=" +
          k +
          "&" +
          B +
          "=" +
          encodeURIComponent(D) +
          "&encryption=none#" +
          encodeURIComponent(config_JSON.optimizedSubGeneration.SUBNAME)
        : config_JSON.protocolType +
          "://" +
          g +
          "@" +
          k +
          ":443?security=tls&type=" +
          (A + z) +
          "&" +
          C +
          "=" +
          k +
          "&fp=" +
          config_JSON.Fingerprint +
          "&sni=" +
          k +
          "&" +
          B +
          "=" +
          (encodeURIComponent(D) + y) +
          "&encryption=none" +
          (config_JSON.skipCertVerify ? "&insecure=1&allowInsecure=1" : "") +
          "#" +
          encodeURIComponent(config_JSON.optimizedSubGeneration.SUBNAME);
  config_JSON.optimizedSubGeneration.TOKEN = await MD5MD5(f + g);
  const E = {
    BotToken: null,
    ChatID: null,
  };
  config_JSON.TG = {
    enabled: config_JSON.TG.enabled ? config_JSON.TG.enabled : false,
    ...E,
  };
  try {
    const K = await c.KV.get("tg.json");
    if (!K) {
      await c.KV.put("tg.json", JSON.stringify(E, null, 2));
    } else {
      const L = JSON.parse(K);
      config_JSON.TG.ChatID = L.ChatID ? L.ChatID : null;
      config_JSON.TG.BotToken = L.BotToken
        ? maskSensitiveInfo(L.BotToken)
        : null;
    }
  } catch (M) {
    console.error("readTg.jsonerrorOccurred: " + M.message);
  }
  const F = {
    Email: null,
    GlobalAPIKey: null,
    AccountID: null,
    APIToken: null,
    UsageAPI: null,
  };
  config_JSON.CF = {
    ...F,
    Usage: {
      success: false,
      pages: 0,
      workers: 0,
      total: 0,
      max: 100000,
    },
  };
  try {
    const N = await c.KV.get("cf.json");
    if (!N) {
      await c.KV.put("cf.json", JSON.stringify(F, null, 2));
    } else {
      const O = JSON.parse(N);
      if (O.UsageAPI) {
        try {
          const P = new AbortController();
          const Q = setTimeout(() => P.abort(), 10000);
          const R = await fetch(O.UsageAPI, {
            signal: P.signal,
          });
          clearTimeout(Q);
          const S = await R.json();
          config_JSON.CF.Usage = S;
        } catch (T) {
          console.error("request CF_JSON.UsageAPI fail: " + T.message);
        }
      } else {
        config_JSON.CF.Email = O.Email ? O.Email : null;
        config_JSON.CF.GlobalAPIKey = O.GlobalAPIKey
          ? maskSensitiveInfo(O.GlobalAPIKey)
          : null;
        config_JSON.CF.AccountID = O.AccountID
          ? maskSensitiveInfo(O.AccountID)
          : null;
        config_JSON.CF.APIToken = O.APIToken
          ? maskSensitiveInfo(O.APIToken)
          : null;
        config_JSON.CF.UsageAPI = null;
        const U = await getCloudflareUsage(
          O.Email,
          O.GlobalAPIKey,
          O.AccountID,
          O.APIToken,
        );
        config_JSON.CF.Usage = U;
      }
    }
  } catch (V) {
    console.error("readCf.jsonerrorOccurred: " + V.message);
  }
  config_JSON.loadTime = (performance.now() - o).toFixed(2) + "ms";
  return config_JSON;
}
function identifyCarrier(c) {
  const f = c?.cf;
  const g = {
    4134: "ct",
    4809: "ct",
    4811: "ct",
    4812: "ct",
    4815: "ct",
    4837: "cu",
    4814: "cu",
    9929: "cu",
    17623: "cu",
    17816: "cu",
    9808: "cmcc",
    24400: "cmcc",
    56040: "cmcc",
    56041: "cmcc",
    56044: "cmcc",
  };
  const h = [
    {
      code: "ct",
      pattern: /chinanet|chinatelecom|china telecom|cn2|shtel/,
    },
    {
      code: "cmcc",
      pattern: /cmi|cmnet|chinamobile|china mobile|cmcc|mobile communications/,
    },
    {
      code: "cu",
      pattern: /china169|china unicom|chinaunicom|cucc|cncgroup|cuii|netcom/,
    },
  ];
  if (String(f?.country || "").toLowerCase() !== "cn") {
    return "cf";
  }
  const i = String(f?.asOrganization || "").toLowerCase();
  const j = h.find(({ pattern: k }) => k.test(i))?.code;
  return j || g[String(f?.asn || "")] || "cf";
}
const _poolCache = new Map();
function iranCarrierFile(c) {
  const f = (c && c.cf) || {};
  const g = String(f.asOrganization || "").toLowerCase();
  const h = Number(f.asn || 0);
  if (String(f.country || "").toUpperCase() !== "IR") {
    return "all";
  }
  if (h === 44244 || g.includes("irancell") || g.includes("mtn")) {
    return "mtn";
  }
  if (
    h === 197207 ||
    g.includes("mobile communication company of iran") ||
    g.includes("mcci") ||
    g.includes("hamrah")
  ) {
    return "mci";
  }
  if (h === 57218 || g.includes("rightel")) {
    return "rightel";
  }
  if (h === 31549 || g.includes("shatel")) {
    return "shatel";
  }
  return "ir";
}
async function fetchPoolFile(f) {
  const g = _poolCache.get(f);
  if (g && Date.now() - g.at < 1800000) {
    return g.list;
  }
  let h = [];
  try {
    const i = await fetch(f, {
      headers: {
        "User-Agent": "YNSProxy",
      },
      cf: {
        cacheTtl: 1800,
        cacheEverything: true,
      },
    });
    if (i.ok) {
      h = (await sortIntoArray(await i.text()))
        .map((j) => String(j).trim())
        .filter((j) => j && !j.startsWith("#"));
    }
  } catch (j) {}
  _poolCache.set(f, {
    at: Date.now(),
    list: h,
  });
  return h;
}
async function getSmartCleanIPs(c, g, h) {
  const i = String(g || "").replace(/\/+$/, "");
  if (!i) {
    return [];
  }
  const j = iranCarrierFile(c);
  for (const k of [...new Set([j, "ir", "all"])]) {
    const l = await fetchPoolFile(i + "/" + k + ".txt");
    if (l && l.length) {
      const m = l
        .slice()
        .sort(() => 0.5 - Math.random())
        .slice(0, h || 16);
      return m.map((n) =>
        n.includes("#") ? n : n + "#YNS | " + k.toUpperCase(),
      );
    }
  }
  return [];
}
const COLO_COUNTRY = {
  IAD: "US",
  EWR: "US",
  JFK: "US",
  LGA: "US",
  BOS: "US",
  ORD: "US",
  DFW: "US",
  IAH: "US",
  ATL: "US",
  MIA: "US",
  TPA: "US",
  MCO: "US",
  LAX: "US",
  SJC: "US",
  SFO: "US",
  SEA: "US",
  PDX: "US",
  DEN: "US",
  PHX: "US",
  LAS: "US",
  SLC: "US",
  MCI: "US",
  MSP: "US",
  DTW: "US",
  PHL: "US",
  PIT: "US",
  CLT: "US",
  BNA: "US",
  IND: "US",
  CMH: "US",
  STL: "US",
  SAN: "US",
  HNL: "US",
  ABQ: "US",
  OKC: "US",
  BUF: "US",
  RIC: "US",
  ORF: "US",
  YYZ: "CA",
  YUL: "CA",
  YVR: "CA",
  YYC: "CA",
  YWG: "CA",
  YOW: "CA",
  YHZ: "CA",
  MEX: "MX",
  GDL: "MX",
  QRO: "MX",
  MTY: "MX",
  AMS: "NL",
  FRA: "DE",
  DUS: "DE",
  HAM: "DE",
  MUC: "DE",
  STR: "DE",
  TXL: "DE",
  BER: "DE",
  CDG: "FR",
  MRS: "FR",
  LYS: "FR",
  LHR: "GB",
  MAN: "GB",
  LON: "GB",
  EDI: "GB",
  DUB: "IE",
  MAD: "ES",
  BCN: "ES",
  LIS: "PT",
  MXP: "IT",
  FCO: "IT",
  PMO: "IT",
  VIE: "AT",
  ZRH: "CH",
  GVA: "CH",
  BRU: "BE",
  CPH: "DK",
  ARN: "SE",
  GOT: "SE",
  OSL: "NO",
  HEL: "FI",
  WAW: "PL",
  PRG: "CZ",
  BUD: "HU",
  OTP: "RO",
  SOF: "BG",
  ATH: "GR",
  SKG: "GR",
  BEG: "RS",
  ZAG: "HR",
  LJU: "SI",
  BTS: "SK",
  KBP: "UA",
  RIX: "LV",
  TLL: "EE",
  VNO: "LT",
  KEF: "IS",
  LUX: "LU",
  MLA: "MT",
  DXB: "AE",
  AUH: "AE",
  DOH: "QA",
  KWI: "KW",
  BAH: "BH",
  RUH: "SA",
  JED: "SA",
  MCT: "OM",
  AMM: "JO",
  BEY: "LB",
  TLV: "IL",
  BGW: "IQ",
  IST: "TR",
  ADB: "TR",
  GYD: "AZ",
  TBS: "GE",
  EVN: "AM",
  TAS: "UZ",
  ALA: "KZ",
  SIN: "SG",
  HKG: "HK",
  TPE: "TW",
  KHH: "TW",
  NRT: "JP",
  KIX: "JP",
  ITM: "JP",
  ICN: "KR",
  BKK: "TH",
  KUL: "MY",
  CGK: "ID",
  JKT: "ID",
  MNL: "PH",
  HAN: "VN",
  SGN: "VN",
  BOM: "IN",
  DEL: "IN",
  MAA: "IN",
  BLR: "IN",
  HYD: "IN",
  CCU: "IN",
  NAG: "IN",
  CMB: "LK",
  DAC: "BD",
  KTM: "NP",
  ISB: "PK",
  KHI: "PK",
  LHE: "PK",
  JNB: "ZA",
  CPT: "ZA",
  DUR: "ZA",
  NBO: "KE",
  MBA: "KE",
  LOS: "NG",
  CAI: "EG",
  CMN: "MA",
  TUN: "TN",
  ALG: "DZ",
  ACC: "GH",
  DAR: "TZ",
  GRU: "BR",
  GIG: "BR",
  FOR: "BR",
  POA: "BR",
  EZE: "AR",
  SCL: "CL",
  LIM: "PE",
  BOG: "CO",
  UIO: "EC",
  SYD: "AU",
  MEL: "AU",
  PER: "AU",
  BNE: "AU",
  ADL: "AU",
  AKL: "NZ",
};
function flagFromCountry(c) {
  if (typeof c !== "string" || c.length !== 2) {
    return "";
  }
  const f = c.toUpperCase().charCodeAt(0);
  const g = c.toUpperCase().charCodeAt(1);
  if (f < 65 || f > 90 || g < 65 || g > 90) {
    return "";
  }
  try {
    return String.fromCodePoint(127462 + f - 65, 127462 + g - 65);
  } catch (h) {
    return "";
  }
}
function coloFlag(c) {
  try {
    const f = String((c && c.cf && c.cf.colo) || "").toUpperCase();
    const g = f ? flagFromCountry(COLO_COUNTRY[f]) : "";
    if (g) {
      return g + " ";
    } else {
      return "";
    }
  } catch (h) {
    return "";
  }
}
async function generateRandomIp(c, f = 16, g = -1) {
  const h = new URL(c.url);
  const i = String(h.searchParams.get("asOrg") || "").toLowerCase();
  const j = ["ct", "cu", "cmcc", "cf"].includes(i) ? i : identifyCarrier(c);
  const k = {
    cmcc: "CFmobileBest",
    cu: "CFunicomBest",
    ct: "CFtelecomBest",
    cf: "CFofficialBest",
  };
  const l =
    j === "cf"
      ? "https://raw.githubusercontent.com/cmliu/cmliu/main/CF-CIDR.txt"
      : "https://raw.githubusercontent.com/cmliu/cmliu/main/CF-CIDR/" +
        j +
        ".txt";
  const m = k[j] || "CFofficialBest";
  const n = [443, 2053, 2083, 2087, 2096, 8443];
  let o = [];
  {
    const s = _cidrListCache.get(j);
    if (s && Date.now() - s.at < 3600000) {
      o = s.list;
    } else {
      try {
        const t = await fetch(l);
        o = t.ok ? await sortIntoArray(await t.text()) : ["104.16.0.0/13"];
      } catch {
        o = ["104.16.0.0/13"];
      }
      _cidrListCache.set(j, {
        at: Date.now(),
        list: o,
      });
    }
  }
  const p = (u) => {
    const [v, w] = u.split("/");
    const x = parseInt(w);
    const y = 32 - x;
    const z = v
      .split(".")
      .reduce((D, E, F) => D | (parseInt(E) << (24 - F * 8)), 0);
    const A = Math.floor(Math.random() * Math.pow(2, y));
    const B = (-1 << y) >>> 0;
    const C = (((z & B) >>> 0) + A) >>> 0;
    return [(C >>> 24) & 255, (C >>> 16) & 255, (C >>> 8) & 255, C & 255].join(
      ".",
    );
  };
  const q = coloFlag(c);
  const r = Array.from(
    {
      length: f,
    },
    (u, v) => {
      const w = p(o[Math.floor(Math.random() * o.length)]);
      const x = g === -1 ? n[Math.floor(Math.random() * n.length)] : g;
      const y =
        "YNS | " +
        (q ? q : "") +
        Array.from(
          crypto.getRandomValues(new Uint8Array(6)),
          (z) => "abcdefghijklmnopqrstuvwxyz0123456789"[z % 36],
        ).join("");
      return w + ":" + x + "#" + y;
    },
  );
  return [r, r.join("\n")];
}
async function sortIntoArray(c) {
  var f = c.replace(/[	"'\r\n]+/g, ",").replace(/,+/g, ",");
  if (f.charAt(0) == ",") {
    f = f.slice(1);
  }
  if (f.charAt(f.length - 1) == ",") {
    f = f.slice(0, f.length - 1);
  }
  const g = f.split(",");
  return g;
}
async function getBestSubGeneratorData(c) {
  let f = [];
  let g = "";
  let h = c
    .replace(/^sub:\/\//i, "https://")
    .split("#")[0]
    .split("?")[0];
  if (!/^https?:\/\//i.test(h)) {
    h = "https://" + h;
  }
  try {
    const j = new URL(h);
    h = j.origin;
  } catch (k) {
    f.push("127.0.0.1:1234#" + c + "bestSubGeneratorFormatError:" + k.message);
    return [f, g];
  }
  const i =
    h + "/sub?host=example.com&uuid=00000000-0000-4000-8000-000000000000";
  try {
    const l = await fetch(i, {
      headers: {
        "User-Agent": "YNSProxy",
      },
    });
    if (!l.ok) {
      f.push(
        "127.0.0.1:1234#" +
          c +
          "optimizedSubGenerationException:" +
          l.statusText,
      );
      return [f, g];
    }
    const m = atob(await l.text());
    const n = m.includes("\r\n") ? m.split("\r\n") : m.split("\n");
    for (const o of n) {
      if (!o.trim()) {
        continue;
      }
      if (
        o.includes("00000000-0000-4000-8000-000000000000") &&
        o.includes("example.com")
      ) {
        const p = o.match(/:\/\/[^@]+@([^?]+)/);
        if (p) {
          let q = p[1];
          let r = "";
          const s = o.match(/#(.+)$/);
          if (s) {
            r = "#" + decodeURIComponent(s[1]);
          }
          f.push(q + r);
        }
      } else {
        g += o + "\n";
      }
    }
  } catch (t) {
    f.push(
      "127.0.0.1:1234#" + c + "optimizedSubGenerationException:" + t.message,
    );
  }
  return [f, g];
}
async function requestBestApi(c, f = "443", g = 3000) {
  if (!c?.length) {
    return [[], [], [], []];
  }
  const h = new Set();
  const i = new Set();
  let j = "";
  let k = [];
  await Promise.allSettled(
    c.map(async (m) => {
      const n = m.indexOf("#");
      const o = n > -1 ? m.substring(0, n) : m;
      const p = n > -1 ? decodeURIComponent(m.substring(n + 1)) : null;
      const q = m.toLowerCase().includes("proxyip=true");
      if (o.toLowerCase().startsWith("sub://")) {
        try {
          const [r, s] = await getBestSubGeneratorData(o);
          if (p) {
            for (const t of r) {
              const u = t.includes("#")
                ? t + " [" + p + "]"
                : t + "#[" + p + "]";
              h.add(u);
              if (q) {
                i.add(t.split("#")[0]);
              }
            }
          } else {
            for (const v of r) {
              h.add(v);
              if (q) {
                i.add(v.split("#")[0]);
              }
            }
          }
          if (s && typeof s === "string" && p) {
            const w = s.replace(
              /([a-z][a-z0-9+\-.]*:\/\/[^\r\n]*?)(\r?\n|$)/gi,
              (x, y, z) => {
                const A = y.includes("#")
                  ? "" + y + encodeURIComponent(" [" + p + "]")
                  : "" + y + encodeURIComponent("#[" + p + "]");
                return "" + A + z;
              },
            );
            j += w;
          } else if (s && typeof s === "string") {
            j += s;
          }
        } catch (x) {}
        return;
      }
      try {
        const y = new AbortController();
        const z = setTimeout(() => y.abort(), g);
        const A = await fetch(o, {
          signal: y.signal,
        });
        clearTimeout(z);
        let B = "";
        try {
          const I = await A.arrayBuffer();
          const J = (A.headers.get("content-type") || "").toLowerCase();
          const K = J.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || "";
          let L = ["utf-8", "gb2312"];
          if (K.includes("gb") || K.includes("gbk") || K.includes("gb2312")) {
            L = ["gb2312", "utf-8"];
          }
          let M = false;
          for (const N of L) {
            try {
              const O = new TextDecoder(N).decode(I);
              if (O && O.length > 0 && !O.includes("�")) {
                B = O;
                M = true;
                break;
              } else if (O && O.length > 0) {
                continue;
              }
            } catch (P) {
              continue;
            }
          }
          if (!M) {
            B = await A.text();
          }
          if (!B || B.trim().length === 0) {
            return;
          }
        } catch (Q) {
          console.error("Failed to decode response:", Q);
          return;
        }
        let C = B;
        const D = typeof B === "string" ? B.replace(/\s/g, "") : "";
        if (
          D.length > 0 &&
          D.length % 4 === 0 &&
          /^[A-Za-z0-9+/]+={0,2}$/.test(D)
        ) {
          try {
            const R = new Uint8Array(
              atob(D)
                .split("")
                .map((S) => S.charCodeAt(0)),
            );
            C = new TextDecoder("utf-8").decode(R);
          } catch {}
        }
        if (C.split("#")[0].includes("://")) {
          if (p) {
            const S = C.replace(
              /([a-z][a-z0-9+\-.]*:\/\/[^\r\n]*?)(\r?\n|$)/gi,
              (T, U, V) => {
                const W = U.includes("#")
                  ? "" + U + encodeURIComponent(" [" + p + "]")
                  : "" + U + encodeURIComponent("#[" + p + "]");
                return "" + W + V;
              },
            );
            j += S + "\n";
          } else {
            j += C + "\n";
          }
          return;
        }
        const E = B.trim()
          .split("\n")
          .map((T) => T.trim())
          .filter((T) => T);
        const F = E.length > 1 && E[0].includes(",");
        const G = /^[^\[\]]*:[^\[\]]*:[^\[\]]/;
        const H = new URL(o);
        if (!F) {
          E.forEach((T) => {
            const U = T.indexOf("#");
            const [V, W] =
              U > -1 ? [T.substring(0, U), T.substring(U)] : [T, ""];
            let X = false;
            if (V.startsWith("[")) {
              X = /\]:(\d+)$/.test(V);
            } else {
              const a0 = V.lastIndexOf(":");
              X = a0 > -1 && /^\d+$/.test(V.substring(a0 + 1));
            }
            const Y = H.searchParams.get("port") || f;
            const Z = X ? T : V + ":" + Y + W;
            if (p) {
              const a1 = Z.includes("#")
                ? Z + " [" + p + "]"
                : Z + "#[" + p + "]";
              h.add(a1);
            } else {
              h.add(Z);
            }
            if (q) {
              i.add(Z.split("#")[0]);
            }
          });
        } else {
          const T = E[0].split(",").map((V) => V.trim());
          const U = E.slice(1);
          if (
            T.includes("IPaddress") &&
            T.includes("port") &&
            T.includes("dataCenter")
          ) {
            const V = T.indexOf("IPaddress");
            const W = T.indexOf("port");
            const X =
              T.indexOf("country") > -1
                ? T.indexOf("country")
                : T.indexOf("city") > -1
                  ? T.indexOf("city")
                  : T.indexOf("dataCenter");
            const Y = T.indexOf("TLS");
            U.forEach((Z) => {
              const a0 = Z.split(",").map((a3) => a3.trim());
              if (Y !== -1 && a0[Y]?.toLowerCase() !== "true") {
                return;
              }
              const a1 = G.test(a0[V]) ? "[" + a0[V] + "]" : a0[V];
              const a2 = a1 + ":" + a0[W] + "#" + a0[X];
              if (p) {
                const a3 = a2 + " [" + p + "]";
                h.add(a3);
              } else {
                h.add(a2);
              }
              if (q) {
                i.add(a1 + ":" + a0[W]);
              }
            });
          } else if (
            T.some((Z) => Z.includes("IP")) &&
            T.some((Z) => Z.includes("latency")) &&
            T.some((Z) => Z.includes("downloadSpeed"))
          ) {
            const Z = T.findIndex((a3) => a3.includes("IP"));
            const a0 = T.findIndex((a3) => a3.includes("latency"));
            const a1 = T.findIndex((a3) => a3.includes("downloadSpeed"));
            const a2 = H.searchParams.get("port") || f;
            U.forEach((a3) => {
              const a4 = a3.split(",").map((a7) => a7.trim());
              const a5 = G.test(a4[Z]) ? "[" + a4[Z] + "]" : a4[Z];
              const a6 =
                a5 + ":" + a2 + "#CFbest " + a4[a0] + "ms " + a4[a1] + "MB/s";
              if (p) {
                const a7 = a6 + " [" + p + "]";
                h.add(a7);
              } else {
                h.add(a6);
              }
              if (q) {
                i.add(a5 + ":" + a2);
              }
            });
          }
        }
      } catch (a3) {}
    }),
  );
  const l = j.trim()
    ? [...new Set(j.split(/\r?\n/).filter((m) => m.trim() !== ""))]
    : [];
  return [Array.from(h), l, k, Array.from(i)];
}
async function fetchProxyParams(c, f, g) {
  resolveConnUser(c);
  connProxyWhitelist = [];
  const { searchParams: h } = c;
  const i = decodeURIComponent(c.pathname);
  const j = i.toLowerCase();
  const k = i.match(/\/video\/(.+)$/i);
  if (k) {
    try {
      const p = base64SecretDecode(k[1], f);
      const { type: q, ...r } = JSON.parse(p);
      if (!q || !proxyProtocolDefaultPort[String(q).toLowerCase()]) {
        throw new Error("chainProxyTypeInvalid");
      }
      if (!r.hostname || !r.port) {
        throw new Error("chainProxyAddressMissing hostname or port");
      }
      mySocks5Account = "";
      proxyIP = "chainProxy";
      enableProxyFallback = false;
      enableSocks5GlobalProxy = true;
      enableSocks5Proxy = String(q).toLowerCase();
      parsedSocks5Address = {
        username: r.username,
        password: r.password,
        hostname: r.hostname,
        port: Number(r.port),
      };
      if (isNaN(parsedSocks5Address.port)) {
        throw new Error("chainProxyPortInvalid");
      }
      return;
    } catch (s) {
      console.error("parseChainProxyParamFailed:", s.message);
    }
  }
  mySocks5Account =
    h.get("socks5") ||
    h.get("http") ||
    h.get("https") ||
    h.get("turn") ||
    h.get("sstp") ||
    null;
  enableSocks5GlobalProxy = h.has("globalproxy");
  if (h.get("socks5")) {
    enableSocks5Proxy = "socks5";
  } else if (h.get("http")) {
    enableSocks5Proxy = "http";
  } else if (h.get("https")) {
    enableSocks5Proxy = "https";
  } else if (h.get("turn")) {
    enableSocks5Proxy = "turn";
  } else if (h.get("sstp")) {
    enableSocks5Proxy = "sstp";
  }
  const l = (t, u = true) => {
    const v = /^(socks5|http|https|turn|sstp):\/\/(.+)$/i.exec(t || "");
    if (!v) {
      return false;
    }
    enableSocks5Proxy = v[1].toLowerCase();
    mySocks5Account = v[2].split("/")[0];
    if (u) {
      enableSocks5GlobalProxy = true;
    }
    return true;
  };
  const m = (t) => {
    proxyIP = t;
    enableSocks5Proxy = null;
    enableProxyFallback = false;
  };
  const n = (t) => {
    if (!t.includes("://")) {
      const w = t.indexOf("/");
      if (w > 0) {
        return t.slice(0, w);
      } else {
        return t;
      }
    }
    const u = t.split("://");
    if (u.length !== 2) {
      return t;
    }
    const v = u[1].indexOf("/");
    if (v > 0) {
      return u[0] + "://" + u[1].slice(0, v);
    } else {
      return t;
    }
  };
  const o = h.get("proxyip");
  if (o !== null) {
    if (!l(o)) {
      return m(o);
    }
  } else {
    let t = /\/(socks5?|http|https|turn|sstp):\/?\/?([^/?#\s]+)/i.exec(i);
    if (t) {
      const u = t[1].toLowerCase();
      enableSocks5Proxy = u === "sock" || u === "socks" ? "socks5" : u;
      mySocks5Account = t[2].split("/")[0];
      enableSocks5GlobalProxy = true;
    } else if (
      (t = /\/(g?s5|socks5|g?http|g?https|g?turn|g?sstp)=([^/?#\s]+)/i.exec(i))
    ) {
      const v = t[1].toLowerCase();
      mySocks5Account = t[2].split("/")[0];
      enableSocks5Proxy = v.includes("sstp")
        ? "sstp"
        : v.includes("turn")
          ? "turn"
          : v.includes("https")
            ? "https"
            : v.includes("http")
              ? "http"
              : "socks5";
      if (v.startsWith("g")) {
        enableSocks5GlobalProxy = true;
      }
    } else if ((t = /\/(proxyip[.=]|pyip=|ip=)([^?#\s]+)/.exec(j))) {
      const w = n(t[2]);
      if (!l(w)) {
        return m(w);
      }
    }
  }
  if (!mySocks5Account) {
    enableSocks5Proxy = null;
    return;
  }
  try {
    parsedSocks5Address = await getSocks5Account(
      mySocks5Account,
      getProxyDefaultPort(enableSocks5Proxy),
    );
    if (h.get("socks5")) {
      enableSocks5Proxy = "socks5";
    } else if (h.get("http")) {
      enableSocks5Proxy = "http";
    } else if (h.get("https")) {
      enableSocks5Proxy = "https";
    } else if (h.get("turn")) {
      enableSocks5Proxy = "turn";
    } else if (h.get("sstp")) {
      enableSocks5Proxy = "sstp";
    } else {
      enableSocks5Proxy = enableSocks5Proxy || "socks5";
    }
  } catch (x) {
    console.error("parseSOCKS5AddressFail:", x.message);
    enableSocks5Proxy = null;
  }
  if (enableSocks5Proxy && !enableSocks5GlobalProxy && g) {
    try {
      const y = await getConfigRaw(g);
      const z = y ? JSON.parse(y)?.proxy?.SOCKS5?.whitelist : null;
      if (Array.isArray(z)) {
        connProxyWhitelist = z.map((A) => String(A).trim()).filter(Boolean);
      }
    } catch (A) {}
  }
}
const proxyProtocolDefaultPort = {
  socks5: 1080,
  http: 80,
  https: 443,
  turn: 3478,
  sstp: 443,
};
function getProxyDefaultPort(c) {
  return proxyProtocolDefaultPort[String(c || "").toLowerCase()] || 80;
}
const SOCKS5accountBase64Regex =
  /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
const IPv6bracketRegex = /^\[.*\]$/;
function getSocks5Account(c, f = 80) {
  c = String(c || "")
    .trim()
    .replace(/^(socks5|http|https|turn|sstp):\/\//i, "")
    .split("#")[0]
    .trim();
  const g = c.lastIndexOf("@");
  if (g !== -1) {
    let o = c.slice(0, g).replaceAll("%3D", "=");
    if (!o.includes(":") && SOCKS5accountBase64Regex.test(o)) {
      o = atob(o);
    }
    c = o + "@" + c.slice(g + 1);
  }
  const h = c.lastIndexOf("@");
  const i = (h === -1 ? c : c.slice(h + 1)).split("/")[0];
  const j = h === -1 ? "" : c.slice(0, h);
  const [k, l] = j ? j.split(":") : [];
  if (j && !l) {
    throw new Error(
      'invalidOf SOCKS addressFormat：authPartMustBe "username:password" format',
    );
  }
  let m = i;
  let n = f;
  if (i.includes("]:")) {
    const [p, q = ""] = i.split("]:");
    m = p + "]";
    n = Number(q.replace(/[^\d]/g, ""));
  } else if (!i.startsWith("[")) {
    const r = i.split(":");
    if (r.length === 2) {
      m = r[0];
      n = Number(r[1].replace(/[^\d]/g, ""));
    }
  }
  if (isNaN(n)) {
    throw new Error("invalidOf SOCKS addressFormat：portMustBeNumber");
  }
  if (m.includes(":") && !IPv6bracketRegex.test(m)) {
    throw new Error(
      "invalidOf SOCKS addressFormat：IPv6 addressMustBeBracketed，if [2001:db8::1]",
    );
  }
  return {
    username: k,
    password: l,
    hostname: m,
    port: n,
  };
}
async function getCloudflareUsage(c, f, g, h) {
  if (cachedCfUsage && Date.now() - cachedCfUsageAt < 300000) {
    return cachedCfUsage;
  }
  const i = "https://api.cloudflare.com/client/v4";
  const j = (l) => l?.reduce((m, n) => m + (n?.sum?.requests || 0), 0) || 0;
  const k = {
    "Content-Type": "application/json",
  };
  try {
    if (!g && (!c || !f)) {
      return {
        success: false,
        pages: 0,
        workers: 0,
        total: 0,
        max: 100000,
      };
    }
    if (!g) {
      const x = new AbortController();
      const y = setTimeout(() => x.abort(), 8000);
      const z = await fetch(i + "/accounts", {
        method: "GET",
        headers: {
          ...k,
          "X-AUTH-EMAIL": c,
          "X-AUTH-KEY": f,
        },
        signal: x.signal,
      });
      clearTimeout(y);
      if (!z.ok) {
        throw new Error("accountFetchFailed: " + z.status);
      }
      const A = await z.json();
      if (!A?.result?.length) {
        throw new Error("accountNotFound");
      }
      const B = A.result.findIndex((C) =>
        C.name?.toLowerCase().startsWith(c.toLowerCase()),
      );
      g = A.result[B >= 0 ? B : 0]?.id;
    }
    const l = new Date();
    l.setUTCHours(0, 0, 0, 0);
    const m = h
      ? {
          ...k,
          Authorization: "Bearer " + h,
        }
      : {
          ...k,
          "X-AUTH-EMAIL": c,
          "X-AUTH-KEY": f,
        };
    const n = new AbortController();
    const o = setTimeout(() => n.abort(), 10000);
    const p = await fetch(i + "/graphql", {
      method: "POST",
      headers: m,
      signal: n.signal,
      body: JSON.stringify({
        query:
          "query getBillingMetrics($AccountID: String!, $filter: AccountWorkersInvocationsAdaptiveFilter_InputObject) {\n\t\t\t\t\tviewer { accounts(filter: {accountTag: $AccountID}) {\n\t\t\t\t\t\tworkersInvocationsAdaptive(limit: 10000, filter: $filter) { sum { requests } }\n\t\t\t\t\t} }\n\t\t\t\t}",
        variables: {
          AccountID: g,
          filter: {
            datetime_geq: l.toISOString(),
            datetime_leq: new Date().toISOString(),
          },
        },
      }),
    });
    clearTimeout(o);
    if (!p.ok) {
      throw new Error("queryFail: " + p.status);
    }
    const q = await p.json();
    if (q.errors?.length) {
      throw new Error(q.errors[0].message);
    }
    const s = q?.data?.viewer?.accounts?.[0];
    if (!s) {
      throw new Error("accountDataNotFound");
    }
    const t = j(s.pagesFunctionsInvocationsAdaptiveGroups);
    const u = j(s.workersInvocationsAdaptive);
    const v = t + u;
    const w = 100000;
    log(
      "statResult - Pages: " +
        t +
        ", Workers: " +
        u +
        ", grandTotal: " +
        v +
        ", upperLimit: 100000",
    );
    {
      const C = {
        success: true,
        pages: t,
        workers: u,
        total: v,
        max: w,
      };
      cachedCfUsage = C;
      cachedCfUsageAt = Date.now();
      return C;
    }
  } catch (D) {
    console.error("getUsageError:", D.message);
    return {
      success: false,
      pages: 0,
      workers: 0,
      total: 0,
      max: 100000,
      error: (D && D.message) || String(D),
    };
  }
}
function sha224(k) {
  if (_sha224Cache.has(k)) {
    return _sha224Cache.get(k);
  }
  const m = [
    1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
    2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
    1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
    264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
    113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
    1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
    3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
    1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
    2428436474, 2756734187, 3204031479, 3329325298,
  ];
  const n = (y, z) => ((y >>> z) | (y << (32 - z))) >>> 0;
  k = unescape(encodeURIComponent(k));
  const o = k.length * 8;
  k += String.fromCharCode(128);
  while ((k.length * 8) % 512 !== 448) {
    k += String.fromCharCode(0);
  }
  const p = [
    3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025,
    1694076839, 3204075428,
  ];
  const q = Math.floor(o / 4294967296);
  const t = o & -1;
  k += String.fromCharCode(
    (q >>> 24) & 255,
    (q >>> 16) & 255,
    (q >>> 8) & 255,
    q & 255,
    (t >>> 24) & 255,
    (t >>> 16) & 255,
    (t >>> 8) & 255,
    t & 255,
  );
  const u = [];
  for (let y = 0; y < k.length; y += 4) {
    u.push(
      (k.charCodeAt(y) << 24) |
        (k.charCodeAt(y + 1) << 16) |
        (k.charCodeAt(y + 2) << 8) |
        k.charCodeAt(y + 3),
    );
  }
  for (let z = 0; z < u.length; z += 16) {
    const A = new Array(64).fill(0);
    for (let J = 0; J < 16; J++) {
      A[J] = u[z + J];
    }
    for (let L = 16; L < 64; L++) {
      const M = n(A[L - 15], 7) ^ n(A[L - 15], 18) ^ (A[L - 15] >>> 3);
      const N = n(A[L - 2], 17) ^ n(A[L - 2], 19) ^ (A[L - 2] >>> 10);
      A[L] = (A[L - 16] + M + A[L - 7] + N) >>> 0;
    }
    let [B, C, D, E, F, G, H, I] = p;
    for (let O = 0; O < 64; O++) {
      const P = n(F, 6) ^ n(F, 11) ^ n(F, 25);
      const Q = (F & G) ^ (~F & H);
      const R = (I + P + Q + m[O] + A[O]) >>> 0;
      const S = n(B, 2) ^ n(B, 13) ^ n(B, 22);
      const T = (B & C) ^ (B & D) ^ (C & D);
      const U = (S + T) >>> 0;
      I = H;
      H = G;
      G = F;
      F = (E + R) >>> 0;
      E = D;
      D = C;
      C = B;
      B = (R + U) >>> 0;
    }
    for (let V = 0; V < 8; V++) {
      p[V] =
        (p[V] +
          (V === 0
            ? B
            : V === 1
              ? C
              : V === 2
                ? D
                : V === 3
                  ? E
                  : V === 4
                    ? F
                    : V === 5
                      ? G
                      : V === 6
                        ? H
                        : I)) >>>
        0;
    }
  }
  let v = "";
  for (let W = 0; W < 7; W++) {
    for (let X = 24; X >= 0; X -= 8) {
      v += ((p[W] >>> X) & 255).toString(16).padStart(2, "0");
    }
  }
  if (_sha224Cache.size > 64) {
    _sha224Cache.clear();
  }
  _sha224Cache.set(k, v);
  return v;
}
async function parseAddressPort(
  c,
  f = "dash.cloudflare.com",
  g = "00000000-0000-4000-8000-000000000000",
) {
  if (!cachedProxyIP || !cachedProxyResolvedArray || cachedProxyIP !== c) {
    c = c.toLowerCase();
    function i(r) {
      let s = r;
      let t = 443;
      if (r.includes("]:")) {
        const u = r.split("]:");
        s = u[0] + "]";
        t = parseInt(u[1], 10) || t;
      } else if ((r.match(/:/g) || []).length === 1 && !r.startsWith("[")) {
        const v = r.lastIndexOf(":");
        s = r.slice(0, v);
        t = parseInt(r.slice(v + 1), 10) || t;
      }
      return [s, t];
    }
    function h(r) {
      return r
        .flatMap((s) => {
          if (s.startsWith('"') && s.endsWith('"')) {
            s = s.slice(1, -1);
          }
          return s
            .replace(/\\010/g, ",")
            .replace(/\n/g, ",")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        })
        .map((s) => i(s));
    }
    const j = await sortIntoArray(c);
    let k = [];
    const l =
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    const m = /^\[?(?:[a-fA-F0-9]{0,4}:){1,7}[a-fA-F0-9]{0,4}\]?$/;
    for (const r of j) {
      let [s, t] = i(r);
      if (r.includes(".tp")) {
        const B = r.match(/\.tp(\d+)/);
        if (B) {
          t = parseInt(B[1], 10);
        }
      }
      if (l.test(s) || m.test(s)) {
        log("[proxyParse] " + s + " asIPAddress，useDirectly");
        k.push([s, t]);
        continue;
      }
      const [u, v] = await Promise.all([DoHquery(s, "TXT"), DoHquery(s, "A")]);
      const w = u.filter((C) => C.type === 16).map((C) => C.data);
      const x = h(w);
      if (x.length > 0) {
        log(
          "[proxyParse] " + s + " useTXTRecord，total" + x.length + "results",
        );
        k.push(...x);
        continue;
      }
      const y = v.filter((C) => C.type === 1).map((C) => C.data);
      if (y.length > 0) {
        log(
          "[proxyParse] " +
            s +
            " txtRecordNotFound，useARecord，total" +
            y.length +
            "results",
        );
        k.push(...y.map((C) => [C, t]));
        continue;
      }
      const z = await DoHquery(s, "AAAA");
      const A = z.filter((C) => C.type === 28).map((C) => "[" + C.data + "]");
      if (A.length > 0) {
        log(
          "[proxyParse] " +
            s +
            " txtAndARecordNotFound，useAAAARecord，total" +
            A.length +
            "results",
        );
        k.push(...A.map((C) => [C, t]));
      } else {
        log(
          "[proxyParse] " +
            s +
            " txtNotFound、AandAaaaRecord，keepOriginalDomain",
        );
        k.push([s, t]);
      }
    }
    const n = k.sort((C, D) => C[0].localeCompare(D[0]));
    const o = f.includes(".") ? f.split(".").slice(-2).join(".") : f;
    let p = [...(o + g)].reduce((C, D) => C + D.charCodeAt(0), 0);
    log("[proxyParse] randomSeed: " + p + "\ntargetSite: " + o);
    const q = [...n].sort(
      () => (p = (p * 1103515245 + 12345) & 2147483647) / 2147483647 - 0.5,
    );
    cachedProxyResolvedArray = q.slice(0, 8);
    log(
      "[proxyParse] parseDone total: " +
        cachedProxyResolvedArray.length +
        "\n" +
        cachedProxyResolvedArray
          .map(([C, D], E) => E + 1 + ". " + C + ":" + D)
          .join("\n"),
    );
    cachedProxyIP = c;
  } else {
    log(
      "[proxyParse] readCache total: " +
        cachedProxyResolvedArray.length +
        "\n" +
        cachedProxyResolvedArray
          .map(([C, D], E) => E + 1 + ". " + C + ":" + D)
          .join("\n"),
    );
  }
  return cachedProxyResolvedArray;
}
const TG_BACK = {
  inline_keyboard: [
    [
      {
        text: "⬅️ منو",
        callback_data: "m:main",
      },
    ],
  ],
};
async function sendBotMessage(c, f, g, h = "HTML", i = null) {
  const j = String(f == null ? "" : f)
    .split(/[,\n\r]+/)
    .map((m) => m.trim())
    .filter(Boolean);
  if (!j.length) {
    return;
  }
  let k;
  const l = i ? "&reply_markup=" + encodeURIComponent(JSON.stringify(i)) : "";
  for (const m of j) {
    const n =
      "https://api.telegram.org/bot" +
      c +
      "/sendMessage?chat_id=" +
      encodeURIComponent(m) +
      "&parse_mode=" +
      h +
      "&text=" +
      encodeURIComponent(g) +
      l;
    try {
      k = await fetch(n, {
        method: "GET",
      });
    } catch (o) {
      console.error("sendBotMessage error:", o);
    }
  }
  return k;
}
const _cfInstallState = new Map();
function cfInstallGet(c) {
  const f = _cfInstallState.get(String(c));
  if (f && Date.now() - f.at > 600000) {
    _cfInstallState.delete(String(c));
    return null;
  }
  return f;
}
function cfInstallSet(c, f) {
  const g = String(c);
  const h = _cfInstallState.get(g) || {
    at: Date.now(),
  };
  const i = Object.assign(h, f, {
    at: Date.now(),
  });
  _cfInstallState.set(g, i);
  return i;
}
function cfInstallClear(c) {
  _cfInstallState.delete(String(c));
}
const CF_API = "https://api.cloudflare.com/client/v4";
function cfHeaders(c, f) {
  return Object.assign(
    {
      Authorization: "Bearer " + c,
    },
    f || {},
  );
}
async function cfJson(c) {
  let f = null;
  try {
    f = await c.json();
  } catch (g) {}
  return f;
}
function buildWorkerUpload(
  c,
  { d1Id: f, uuid: g, password: h, compatDate: i, compatFlags: j },
) {
  const k = {
    main_module: "worker.js",
    compatibility_date: i || "2024-09-23",
    compatibility_flags: j || ["nodejs_compat"],
    bindings: [
      {
        type: "d1",
        name: "DB",
        id: f,
      },
      {
        type: "secret_text",
        name: "UUID",
        text: g,
      },
      {
        type: "secret_text",
        name: "PASSWORD",
        text: h,
      },
    ],
  };
  const l = new FormData();
  l.append(
    "metadata",
    new Blob([JSON.stringify(k)], {
      type: "application/json",
    }),
  );
  l.append(
    "worker.js",
    new Blob([c], {
      type: "application/javascript+module",
    }),
    "worker.js",
  );
  return l;
}
async function cfVerifyToken(c) {
  const f = await fetch(CF_API + "/user/tokens/verify", {
    headers: cfHeaders(c),
  });
  const g = await cfJson(f);
  return {
    ok: !!g && !!g.success && !!g.result && g.result.status === "active",
    raw: g,
  };
}
async function cfListAccounts(c) {
  const f = await fetch(CF_API + "/accounts", {
    headers: cfHeaders(c),
  });
  const g = await cfJson(f);
  if (!g || !g.success || !Array.isArray(g.result)) {
    return [];
  }
  return g.result.map((h) => ({
    id: h.id,
    name: h.name,
  }));
}
async function cfCreateD1(c, f, g) {
  const h = await fetch(CF_API + "/accounts/" + f + "/d1/database", {
    method: "POST",
    headers: cfHeaders(c, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name: g,
    }),
  });
  const i = await cfJson(h);
  if (i && i.success && i.result && i.result.uuid) {
    return {
      id: i.result.uuid,
      name: g,
    };
  }
  const k = await fetch(
    CF_API + "/accounts/" + f + "/d1/database?per_page=100",
    {
      headers: cfHeaders(c),
    },
  );
  const l = await cfJson(k);
  if (l && l.success && Array.isArray(l.result)) {
    const n = l.result.find((o) => o.name === g);
    if (n && n.uuid) {
      return {
        id: n.uuid,
        name: g,
      };
    }
  }
  const m =
    (i && i.errors && i.errors[0] && i.errors[0].message) || "HTTP " + h.status;
  throw new Error("D1 create failed: " + m);
}
async function cfUploadWorker(c, f, g, h, i) {
  const k = buildWorkerUpload(h, i);
  const l = await fetch(CF_API + "/accounts/" + f + "/workers/scripts/" + g, {
    method: "PUT",
    headers: cfHeaders(c),
    body: k,
  });
  const m = await cfJson(l);
  if (m && m.success) {
    return true;
  }
  const n =
    (m && m.errors && m.errors[0] && m.errors[0].message) || "HTTP " + l.status;
  throw new Error("Worker upload failed: " + n);
}
async function cfEnableWorkersDev(c, f, g) {
  const h = await fetch(
    CF_API + "/accounts/" + f + "/workers/scripts/" + g + "/subdomain",
    {
      method: "POST",
      headers: cfHeaders(c, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        enabled: true,
      }),
    },
  );
  const i = await cfJson(h);
  if (i && i.success) {
    return {
      enabled: true,
      needsDashboard: false,
    };
  }
  return {
    enabled: false,
    needsDashboard: true,
    raw: i,
  };
}
async function cfGetSubdomain(c, f) {
  const g = await fetch(CF_API + "/accounts/" + f + "/workers/subdomain", {
    headers: cfHeaders(c),
  });
  const h = await cfJson(g);
  if (h && h.success && h.result && h.result.subdomain) {
    return h.result.subdomain;
  } else {
    return null;
  }
}
async function cfDeploy(
  {
    token: c,
    accountId: f,
    scriptName: g,
    scriptText: h,
    uuid: i,
    password: j,
    compatDate: k,
    compatFlags: l,
  },
  m,
) {
  const n = [];
  const o = async (p) => {
    try {
      await m(p);
    } catch (q) {}
  };
  try {
    await o("🔑 Verifying token…");
    const p = await cfVerifyToken(c);
    if (!p.ok) {
      return {
        ok: false,
        error: "Token invalid or not active.",
      };
    }
    if (!f) {
      await o("🔎 Finding your account…");
      const u = await cfListAccounts(c);
      if (u.length === 1) {
        f = u[0].id;
        n.push("Account: " + u[0].name);
      } else if (u.length === 0) {
        return {
          ok: false,
          error: "No accounts visible to this token.",
        };
      } else {
        return {
          ok: false,
          error: "multiple_accounts",
          accounts: u,
        };
      }
    }
    await o("🗄 Creating D1 database…");
    const q = await cfCreateD1(c, f, (g + "-db").slice(0, 50));
    n.push("D1: " + q.name);
    await o("⬆️ Uploading worker + binding D1 + setting secrets…");
    await cfUploadWorker(c, f, g, h, {
      d1Id: q.id,
      uuid: i,
      password: j,
      compatDate: k,
      compatFlags: l,
    });
    await o("🌐 Enabling workers.dev route…");
    const r = await cfEnableWorkersDev(c, f, g);
    let s = null;
    const t = await cfGetSubdomain(c, f);
    if (t) {
      s = "https://" + g + "." + t + ".workers.dev";
    }
    if (r.needsDashboard) {
      n.push(
        "⚠️ Could not auto-enable workers.dev. One-time step: in the Cloudflare dashboard → Workers & Pages → your worker → Settings → Domains & Routes, enable the workers.dev route (or add a custom domain).",
      );
    }
    n.push(
      "🇮🇷 For Iran: *.workers.dev is filtered. Add a Custom Domain (Workers → your worker → Settings → Domains & Routes → Add Custom Domain) and use that.",
    );
    return {
      ok: true,
      url: s,
      accountId: f,
      dbId: q.id,
      notes: n,
    };
  } catch (w) {
    return {
      ok: false,
      error: (w && w.message) || String(w),
      notes: n,
    };
  }
}
async function runCfInstall(c, f, g, h, i) {
  const j = cfInstallGet(g);
  if (!j || !j.token) {
    try {
      await sendBotMessage(
        f,
        g,
        "نشست منقضی شد. دوباره از منو «نصب پنل» شروع کنید.",
      );
    } catch (v) {}
    return new Response("OK", {
      status: 200,
    });
  }
  let k = null;
  const l = async (w) => {
    try {
      if (k) {
        await tgApi(f, "editMessageText", {
          chat_id: g,
          message_id: k,
          parse_mode: "HTML",
          text: w,
        });
      } else {
        const x = await tgApi(f, "sendMessage", {
          chat_id: g,
          parse_mode: "HTML",
          text: w,
        });
        const y = await x.json().catch(() => null);
        if (y && y.result) {
          k = y.result.message_id;
        }
      }
    } catch (z) {}
  };
  let m = NOVA_WORKER_SRC_FALLBACK;
  try {
    const w = JSON.parse(await (await fetch(NOVA_VERSION_URL)).text());
    if (w && w.worker_url) {
      m = w.worker_url;
    }
  } catch (x) {}
  await l("📥 دریافت آخرین نسخهٔ ورکر…");
  let n = "";
  try {
    const y = await fetch(m);
    if (!y.ok) {
      throw new Error("HTTP " + y.status);
    }
    n = await y.text();
  } catch (z) {
    await l("❌ دریافت ورکر ناموفق بود: " + ((z && z.message) || z));
    cfInstallClear(g);
    return new Response("OK", {
      status: 200,
    });
  }
  if (!/export\s+default|addEventListener\(/.test(n)) {
    await l("❌ فایل ورکر معتبر نبود.");
    cfInstallClear(g);
    return new Response("OK", {
      status: 200,
    });
  }
  const o =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (A) => {
          const B = (Math.random() * 16) | 0;
          return (A === "x" ? B : (B & 3) | 8).toString(16);
        });
  const p = (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  ).toUpperCase();
  const q = j.scriptName || "yns-panel";
  const s = await cfDeploy(
    {
      token: j.token,
      accountId: j.accountId || null,
      scriptName: q,
      scriptText: n,
      uuid: o,
      password: p,
      compatDate: "2024-09-23",
      compatFlags: ["nodejs_compat"],
    },
    l,
  );
  if (s && s.error === "multiple_accounts") {
    const A = s.accounts.slice(0, 8).map((B) => [
      {
        text: B.name || B.id,
        callback_data: "m:install:acct:" + B.id,
      },
    ]);
    A.push([
      {
        text: "⬅️ لغو",
        callback_data: "m:main",
      },
    ]);
    await tgApi(f, "sendMessage", {
      chat_id: g,
      parse_mode: "HTML",
      text: "چند حساب پیدا شد. کدام‌یک؟",
      reply_markup: {
        inline_keyboard: A,
      },
    });
    return new Response("OK", {
      status: 200,
    });
  }
  cfInstallClear(g);
  if (!s || !s.ok) {
    await l("❌ استقرار ناموفق بود: " + ((s && s.error) || "unknown"));
    return new Response("OK", {
      status: 200,
    });
  }
  const t = (s.notes || []).map((B) => "• " + B).join("\n");
  const u = s.url
    ? "\n\n🔗 آدرس پنل:\n<code>" +
      s.url +
      "</code>\n🔑 رمز ادمین:\n<code>" +
      p +
      "</code>"
    : "";
  await l(
    "✅ <b>نصب کامل شد!</b>" +
      u +
      "\n\n<blockquote>" +
      t +
      "</blockquote>\n\n<i>برای امنیت، توکن Cloudflare را که فرستادید در داشبورد باطل کنید. این توکن ذخیره نشده است.</i>",
  );
  return new Response("OK", {
    status: 200,
  });
}
async function tgSetMyCommands(c) {
  const f = [
    {
      command: "start",
      description: "منو / Menu",
    },
    {
      command: "sub",
      description: "لینک اشتراک",
    },
    {
      command: "status",
      description: "وضعیت و مصرف",
    },
    {
      command: "config",
      description: "خلاصه تنظیمات",
    },
    {
      command: "hosts",
      description: "دامنه‌ها",
    },
    {
      command: "addhost",
      description: "افزودن دامنه",
    },
    {
      command: "delhost",
      description: "حذف دامنه",
    },
    {
      command: "announce",
      description: "ارسال به کانال",
    },
    {
      command: "pause",
      description: "🚨 توقف اضطراری سرویس",
    },
    {
      command: "resume",
      description: "✅ ازسرگیری سرویس",
    },
    {
      command: "install",
      description: "🚀 نصب پنل روی Cloudflare",
    },
    {
      command: "help",
      description: "راهنما",
    },
  ];
  try {
    await fetch("https://api.telegram.org/bot" + c + "/setMyCommands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commands: f,
      }),
    });
  } catch (g) {}
}
async function tgApi(c, f, g) {
  try {
    return await fetch("https://api.telegram.org/bot" + c + "/" + f, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(g),
    });
  } catch (h) {
    console.error("tgApi " + f + ":", h);
  }
}
function tgOn(c) {
  if (c) {
    return "🟢";
  } else {
    return "🔴";
  }
}
function tgSt(c) {
  if (c) {
    return "success";
  } else {
    return "danger";
  }
}
function tgMainMenu(c) {
  return {
    text: "<b>🛰 YNS — کنترل پنل</b>\n\n<blockquote>پنل را از همین‌جا مدیریت کنید: تنظیمات، شبکه/DNS، دامنه‌ها، اشتراک و اعلان‌ها.</blockquote>",
    keyboard: {
      inline_keyboard: [
        [
          {
            text: "📊 وضعیت",
            callback_data: "m:status",
            style: "primary",
          },
          {
            text: "🔗 اشتراک",
            callback_data: "m:sub",
            style: "primary",
          },
        ],
        [
          {
            text: "⚙️ تنظیمات",
            callback_data: "m:settings",
            style: "primary",
          },
          {
            text: "🛡 شبکه و DNS",
            callback_data: "m:net",
            style: "primary",
          },
        ],
        [
          {
            text: "🌐 دامنه‌ها",
            callback_data: "m:hosts",
            style: "primary",
          },
          {
            text: "📣 اعلان‌ها",
            callback_data: "m:notif",
            style: "primary",
          },
        ],
        [
          {
            text: "👥 کاربران",
            callback_data: "m:users",
            style: "primary",
          },
        ],
        [
          {
            text: "🚀 نصب پنل روی Cloudflare",
            callback_data: "m:install",
            style: "success",
          },
        ],
        [
          {
            text: "🚨 توقف اضطراری (Kill switch)",
            callback_data: "m:kill",
            style: "danger",
          },
        ],
        [
          {
            text: "🖥 پنل وب (مینی‌اپ)",
            web_app: {
              url: c,
            },
            style: "success",
          },
        ],
      ],
    },
  };
}
function tgKillMenu(f) {
  f = f || {};
  const g = f.paused === true;
  return {
    text:
      "<b>🚨 توقف اضطراری (Kill switch)</b>\n\n<blockquote>وضعیت: " +
      (g ? "🔴 سرویس متوقف است" : "🟢 سرویس فعال است") +
      "\nوقتی روشن باشد، همهٔ اتصال‌های پراکسی و دریافت اشتراک‌ها رد می‌شوند (۵۰۳). پنل و ربات باز می‌مانند تا بتوانید دوباره خاموشش کنید.</blockquote>",
    keyboard: {
      inline_keyboard: [
        [
          {
            text: g ? "🟢 ازسرگیری سرویس" : "🚨 توقف سرویس",
            callback_data: "m:kill:toggle",
            style: g ? "success" : "danger",
          },
        ],
        [
          {
            text: "⬅️ بازگشت",
            callback_data: "m:main",
            style: "primary",
          },
        ],
      ],
    },
  };
}
function tgSettingsMenu(f) {
  f = f || {};
  const g = f.optimizedSubGeneration || {};
  return {
    text:
      "<b>⚙️ تنظیمات اصلی</b>\n\n<blockquote>پروتکل: <code>" +
      (f.protocolType || "vless") +
      "</code>\nترنسپورت: <code>" +
      (f.transportProtocol || "ws") +
      "</code>\nHost: <code>" +
      (f.HOST || "-") +
      "</code>\nمسیر: <code>" +
      (f.PATH || "/") +
      "</code>\nنام: <code>" +
      (g.SUBNAME || "-") +
      "</code>\nچِین‌پراکسی: <code>" +
      (f.chainProxy ? "روشن" : "خاموش") +
      "</code></blockquote>",
    keyboard: {
      inline_keyboard: [
        [
          {
            text: "پروتکل: " + (f.protocolType || "vless") + " 🔁",
            callback_data: "m:proto",
            style: "primary",
          },
        ],
        [
          {
            text: "ترنسپورت: " + (f.transportProtocol || "ws") + " 🔁",
            callback_data: "m:trans",
            style: "primary",
          },
        ],
        [
          {
            text: "Fragment " + tgOn(f.tlsFragment),
            callback_data: "m:frag",
            style: tgSt(f.tlsFragment),
          },
          {
            text: "0-RTT " + tgOn(f.enable0RTT),
            callback_data: "m:rtt",
            style: tgSt(f.enable0RTT),
          },
        ],
        [
          {
            text: "SkipCert " + tgOn(f.skipCertVerify),
            callback_data: "m:scv",
            style: tgSt(f.skipCertVerify),
          },
          {
            text: "ECH " + tgOn(f.ECH),
            callback_data: "m:ech",
            style: tgSt(f.ECH),
          },
        ],
        [
          {
            text: "پخش پورت " + tgOn(f.portSpread),
            callback_data: "m:portspread",
            style: tgSt(f.portSpread),
          },
          {
            text: "چندحمل‌ونقل " + tgOn(f.multiTransportSub),
            callback_data: "m:multitrans",
            style: tgSt(f.multiTransportSub),
          },
        ],
        [
          {
            text: "✏️ Host",
            callback_data: "m:edit:host",
            style: "primary",
          },
          {
            text: "✏️ مسیر",
            callback_data: "m:edit:path",
            style: "primary",
          },
          {
            text: "✏️ نام",
            callback_data: "m:edit:name",
            style: "primary",
          },
        ],
        [
          {
            text: "✏️ چِین‌پراکسی (Fix-IP)",
            callback_data: "m:edit:chain",
            style: "primary",
          },
        ],
        [
          {
            text: "⬅️ بازگشت",
            callback_data: "m:main",
            style: "primary",
          },
        ],
      ],
    },
  };
}
function tgNetMenu(c) {
  c = c || {};
  const f = (g, h) => (g in c ? c[g] : h);
  return {
    text: "<b>🛡 شبکه و DNS</b>\n\n<blockquote>این تنظیمات در کانفیگ‌های Clash/sing-box اعمال می‌شوند. بعد از تغییر در برنامه دوباره وصل شوید.</blockquote>",
    keyboard: {
      inline_keyboard: [
        [
          {
            text: "مسیریابی " + tgOn(f("enableRouting", true)),
            callback_data: "m:net:enableRouting",
            style: tgSt(f("enableRouting", true)),
          },
          {
            text: "ایران‌مستقیم " + tgOn(f("enableDomesticBypass", true)),
            callback_data: "m:net:enableDomesticBypass",
            style: tgSt(f("enableDomesticBypass", true)),
          },
        ],
        [
          {
            text: "ضدتبلیغ " + tgOn(f("enableAdBlock", true)),
            callback_data: "m:net:enableAdBlock",
            style: tgSt(f("enableAdBlock", true)),
          },
          {
            text: "بزرگسال " + tgOn(f("enablePornBlock", false)),
            callback_data: "m:net:enablePornBlock",
            style: tgSt(f("enablePornBlock", false)),
          },
        ],
        [
          {
            text: "DoH " + tgOn(f("enableDoH", true)),
            callback_data: "m:net:enableDoH",
            style: tgSt(f("enableDoH", true)),
          },
          {
            text: "IPv6 " + tgOn(f("enableIPv6", true)),
            callback_data: "m:net:enableIPv6",
            style: tgSt(f("enableIPv6", true)),
          },
        ],
        [
          {
            text: "⬅️ بازگشت",
            callback_data: "m:main",
            style: "primary",
          },
        ],
      ],
    },
  };
}
function tgHostsMenu(f, g) {
  f = f || {};
  g = g || {};
  const h =
    Array.isArray(f.HOSTS) && f.HOSTS.length ? f.HOSTS : f.HOST ? [f.HOST] : [];
  const i = h.length
    ? h
        .map(
          (k) =>
            (g[k] === false ? "🔴" : g[k] === true ? "🟢" : "⚪️") +
            " <code>" +
            k +
            "</code>",
        )
        .join("\n")
    : "هیچ دامنه‌ای ثبت نشده";
  const j = h.map((k) => [
    {
      text: "🗑 " + k,
      callback_data: "m:del:" + k,
      style: "danger",
    },
  ]);
  j.push([
    {
      text: "➕ افزودن دامنه",
      callback_data: "m:edit:addhost",
      style: "success",
    },
  ]);
  j.push([
    {
      text: "⬅️ بازگشت",
      callback_data: "m:main",
      style: "primary",
    },
  ]);
  return {
    text:
      "<b>🌐 دامنه‌ها</b>\n\n<blockquote>" +
      i +
      "</blockquote>\n<i>🟢 سالم · 🔴 خطا · ⚪️ بررسی‌نشده</i>",
    keyboard: {
      inline_keyboard: j,
    },
  };
}
function tgNotifMenu(f) {
  f = f || {};
  const g = f.TG && f.TG.enabled;
  return {
    text:
      "<b>📣 اعلان‌ها</b>\n\n<blockquote>اعلان فعالیت پنل در تلگرام: " +
      (g ? "🟢 روشن" : "🔴 خاموش") +
      "\n\nمدیریت همیشه فعال است؛ اعلان اختیاری است و فقط در صورت نیاز روشنش کنید.</blockquote>",
    keyboard: {
      inline_keyboard: [
        [
          {
            text: g ? "🔕 خاموش‌کردن اعلان" : "🔔 روشن‌کردن اعلان",
            callback_data: "m:notif:toggle",
            style: tgSt(g),
          },
        ],
        [
          {
            text: "📤 ارسال لینک‌ها به کانال",
            callback_data: "m:announce",
            style: "primary",
          },
        ],
        [
          {
            text: "⬅️ بازگشت",
            callback_data: "m:main",
            style: "primary",
          },
        ],
      ],
    },
  };
}
async function tgHandleMenu(f, g, i, j, k, l, m) {
  const p = m.BotToken;
  const r = String(g.message.chat.id);
  const s = g.message.message_id;
  const t = l.url.split("://")[0];
  const v = (B) =>
    tgApi(p, "editMessageText", {
      chat_id: r,
      message_id: s,
      parse_mode: "HTML",
      text: B.text,
      reply_markup: B.keyboard,
    });
  const w = async () => {
    try {
      return JSON.parse((await getConfigRaw(i)) || "{}");
    } catch (B) {
      return {};
    }
  };
  const x = (B) => putConfig(i, JSON.stringify(B, null, 2));
  const y = async () => {
    try {
      return JSON.parse((await i.KV.get("network-settings.json")) || "{}");
    } catch (B) {
      return {};
    }
  };
  const z = (B) =>
    i.KV.put("network-settings.json", JSON.stringify(B, null, 2));
  const A = async () => {
    const B = {};
    try {
      const C = JSON.parse((await i.KV.get("domain-health.json")) || "null");
      if (C && Array.isArray(C.domains)) {
        for (const D of C.domains) {
          B[D.host] = D.ok;
        }
      }
    } catch (E) {}
    return B;
  };
  if (f === "m:main") {
    return v(tgMainMenu(t + "://" + j + "/admin"));
  }
  if (f === "m:settings") {
    return v(tgSettingsMenu(await w()));
  }
  if (f === "m:net") {
    return v(tgNetMenu(await y()));
  }
  if (f === "m:notif") {
    return v(tgNotifMenu(await w()));
  }
  if (f === "m:hosts") {
    return v(tgHostsMenu(await w(), await A()));
  }
  if (f === "m:mu") {
    let B = {};
    try {
      B = JSON.parse((await i.KV.get("network-settings.json")) || "{}");
    } catch (C) {}
    B.multiUser = !B.multiUser;
    await i.KV.put("network-settings.json", JSON.stringify(B, null, 2));
    cachedNetworkSettings = null;
    f = "m:users";
  }
  if (f === "m:users") {
    let D = {};
    try {
      D = JSON.parse((await i.KV.get("network-settings.json")) || "{}");
    } catch (G) {}
    const E = Array.isArray(D.users) ? D.users : [];
    let F = "<b>👥 کاربران</b>\n\n";
    if (!D.multiUser) {
      F +=
        "<blockquote>حالت چندکاربره خاموش است.\nاز پنل ← کاربران فعالش کنید.</blockquote>";
    } else if (!E.length) {
      F += "<blockquote>هنوز کاربری ثبت نشده.</blockquote>";
    } else {
      for (const H of E) {
        let I = 0;
        try {
          const L = await usageGet(i, "uusage:" + H.id);
          I = (L && L.total) || 0;
        } catch (M) {}
        const J = H.quotaBytes ? " / " + formatBytes(H.quotaBytes) : "";
        const K = H.expiry
          ? "📅 " + String(H.expiry).slice(0, 10)
          : "بدون انقضا";
        F +=
          "<blockquote>" +
          (H.enabled === false ? "🔴" : "🟢") +
          " <b>" +
          (H.name || "-") +
          "</b>\n📦 " +
          formatBytes(I) +
          J +
          "\n" +
          K +
          "</blockquote>";
      }
      F += "\n<i>افزودن/ویرایش کاربران از پنل وب.</i>";
    }
    return v({
      text: F,
      keyboard: {
        inline_keyboard: [
          [
            {
              text: D.multiUser
                ? "🔴 خاموش‌کردن چندکاربره"
                : "🟢 روشن‌کردن چندکاربره",
              callback_data: "m:mu",
              style: tgSt(D.multiUser),
            },
          ],
          [
            {
              text: "⬅️ بازگشت",
              callback_data: "m:main",
              style: "primary",
            },
          ],
        ],
      },
    });
  }
  if (f === "m:proto") {
    const N = await w();
    const O = ["vless", "trojan", "ss"];
    let P = N.protocolType || "vless";
    if (P === "all" || P === "vmess") {
      P = "vless";
    }
    const Q = O[(O.indexOf(P) + 1) % O.length];
    N.multiProtocolSub = false;
    N.protocolType = Q;
    await x(N);
    return v(tgSettingsMenu(N));
  }
  if (f === "m:portspread") {
    const R = await w();
    R.portSpread = !R.portSpread;
    await x(R);
    return v(tgSettingsMenu(R));
  }
  if (f === "m:multitrans") {
    const S = await w();
    S.multiTransportSub = !S.multiTransportSub;
    await x(S);
    return v(tgSettingsMenu(S));
  }
  if (f === "m:trans") {
    const T = await w();
    const U = ["ws", "xhttp"];
    T.transportProtocol =
      U[
        (U.indexOf(T.transportProtocol === "xhttp" ? "xhttp" : "ws") + 1) %
          U.length
      ];
    await x(T);
    return v(tgSettingsMenu(T));
  }
  if (f === "m:frag") {
    const V = await w();
    V.tlsFragment = V.tlsFragment ? null : "Shadowrocket";
    await x(V);
    return v(tgSettingsMenu(V));
  }
  if (f === "m:rtt") {
    const W = await w();
    W.enable0RTT = !W.enable0RTT;
    await x(W);
    return v(tgSettingsMenu(W));
  }
  if (f === "m:scv") {
    const X = await w();
    X.skipCertVerify = !X.skipCertVerify;
    await x(X);
    return v(tgSettingsMenu(X));
  }
  if (f === "m:ech") {
    const Y = await w();
    Y.ECH = !Y.ECH;
    await x(Y);
    return v(tgSettingsMenu(Y));
  }
  if (f === "m:kill") {
    return v(tgKillMenu(await w()));
  }
  if (f === "m:kill:toggle") {
    const Z = await w();
    Z.paused = Z.paused === true ? false : true;
    await x(Z);
    return v(tgKillMenu(Z));
  }
  if (f.indexOf("m:net:") === 0) {
    const a0 = f.slice(6);
    const a1 = await y();
    const a2 = [
      "enableRouting",
      "enableDomesticBypass",
      "enableAdBlock",
      "enableDoH",
      "enableIPv6",
    ];
    const a3 = a0 in a1 ? a1[a0] : a2.indexOf(a0) !== -1;
    a1[a0] = !a3;
    await z(a1);
    return v(tgNetMenu(a1));
  }
  if (f === "m:notif:toggle") {
    const a4 = await w();
    if (!a4.TG) {
      a4.TG = {};
    }
    a4.TG.enabled = !a4.TG.enabled;
    await x(a4);
    return v(tgNotifMenu(a4));
  }
  if (f.indexOf("m:del:") === 0) {
    const a5 = f.slice(6);
    const a6 = await w();
    if (Array.isArray(a6.HOSTS) && a6.HOSTS.length > 1) {
      a6.HOSTS = a6.HOSTS.filter((a7) => a7 !== a5);
      if (a6.HOST === a5) {
        a6.HOST = a6.HOSTS[0];
      }
      await x(a6);
    }
    return v(tgHostsMenu(a6, await A()));
  }
  if (f.indexOf("m:edit:") === 0) {
    const a7 = f.slice(7);
    const a8 = {
      host: "دامنه جدید (host) را در پاسخ بفرستید:",
      path: "مسیر جدید را بفرستید (مثل /api):",
      name: "نام اشتراک را بفرستید:",
      addhost: "دامنه‌ای که می‌خواهید اضافه شود را بفرستید:",
      chain:
        "پراکسی زنجیره‌ای را بفرستید (مثل socks5://user:pass@host:port) — برای حذف یک خط تیره (-) بفرستید:",
    };
    return tgApi(p, "sendMessage", {
      chat_id: r,
      parse_mode: "HTML",
      text:
        "✏️ " +
        (a8[a7] || "مقدار را بفرستید:") +
        "\n<code>[YNS:" +
        a7 +
        "]</code>",
      reply_markup: {
        force_reply: true,
      },
    });
  }
  if (f === "m:install") {
    const a9 =
      "<b>🚀 نصب YNS روی Cloudflare شما</b>\n\n<blockquote>این ابزار یک نسخهٔ کامل از YNS را روی حساب Cloudflare <b>خودتان</b> مستقر می‌کند: ساخت دیتابیس D1، آپلود ورکر، تنظیم UUID و رمز، و فعال‌سازی آدرس workers.dev.\n\n🔒 توکن شما فقط در همین لحظه برای استقرار استفاده می‌شود و <b>هیچ‌جا ذخیره نمی‌شود</b>.\n\nیک <b>API Token</b> با این دسترسی‌ها بسازید (My Profile → API Tokens → Create Token → Custom):\n• Account · Workers Scripts · <b>Edit</b>\n• Account · D1 · <b>Edit</b>\n• Account · Workers Subdomain · <b>Edit</b> (اگر بود)</blockquote>";
    return tgApi(p, "editMessageText", {
      chat_id: r,
      message_id: s,
      parse_mode: "HTML",
      text: a9,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔑 ارسال توکن و شروع",
              callback_data: "m:install:start",
              style: "success",
            },
          ],
          [
            {
              text: "⬅️ بازگشت",
              callback_data: "m:main",
              style: "primary",
            },
          ],
        ],
      },
    });
  }
  if (f === "m:install:start") {
    cfInstallSet(r, {
      step: "token",
    });
    return tgApi(p, "sendMessage", {
      chat_id: r,
      parse_mode: "HTML",
      text: "🔑 توکن Cloudflare API را در پاسخ به همین پیام بفرستید:\n<code>[YNS:cf_token]</code>\n\n<i>پس از استقرار، توکن از حافظه پاک می‌شود. توصیه: بعد از نصب، توکن را در داشبورد Cloudflare باطل کنید.</i>",
      reply_markup: {
        force_reply: true,
      },
    });
  }
  if (f.indexOf("m:install:acct:") === 0) {
    const aa = f.slice("m:install:acct:".length);
    const ab = cfInstallGet(r) || {};
    cfInstallSet(r, {
      accountId: aa,
    });
    if (!ab.token) {
      return tgApi(p, "sendMessage", {
        chat_id: r,
        text: "نشست منقضی شده. دوباره از منو شروع کنید.",
      });
    }
    return runCfInstall(i, p, r, j, l);
  }
}
async function handleTelegramWebhook(c, f, g, i) {
  try {
    const j = await f.KV.get("tg.json");
    if (!j) {
      return new Response("Bot not configured", {
        status: 200,
      });
    }
    const k = JSON.parse(j);
    if (!k.BotToken || !k.ChatID) {
      return new Response("Bot not configured", {
        status: 200,
      });
    }
    const l = await c.json();
    if (l.callback_query) {
      const t = l.callback_query;
      await tgApi(k.BotToken, "answerCallbackQuery", {
        callback_query_id: t.id,
      });
      const w = t.data || "";
      if (t.message && w.indexOf("m:") === 0) {
        const x = {
          "m:status": "/status",
          "m:sub": "/sub",
          "m:announce": "/announce",
          "m:config": "/config",
        };
        if (x[w]) {
          const y = JSON.stringify({
            message: {
              chat: t.message.chat,
              text: x[w],
              from: t.from,
            },
          });
          return await handleTelegramWebhook(
            new Request(c.url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: y,
            }),
            f,
            g,
            i,
          );
        }
        try {
          await tgHandleMenu(w, t, f, i, g, c, k);
        } catch (z) {
          console.error("tgMenu:", z);
        }
        return new Response("OK", {
          status: 200,
        });
      }
      if (t.message && w) {
        const A = JSON.stringify({
          message: {
            chat: t.message.chat,
            text: w,
            from: t.from,
          },
        });
        return await handleTelegramWebhook(
          new Request(c.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: A,
          }),
          f,
          g,
          i,
        );
      }
      return new Response("OK", {
        status: 200,
      });
    }
    if (!l.message || !l.message.text) {
      return new Response("OK", {
        status: 200,
      });
    }
    const m = String(l.message.chat.id);
    if (m !== String(k.ChatID)) {
      try {
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>YNS</b>\n\nChat ID: <code>" +
            m +
            "</code>\n\n🔒 این ربات فقط به مدیر پاسخ می‌دهد. اگر مدیر هستید، این Chat ID را در پنل ← اعلان‌ها وارد و ذخیره کنید.\nThis bot only answers its admin. If that is you, set this Chat ID in Panel → Notifications.",
        );
      } catch (B) {}
      return new Response("Unauthorized", {
        status: 200,
      });
    }
    const n = l.message.text.trim();
    const o = n.split(" ")[0].toLowerCase();
    const p = n.slice(o.length).trim();
    const q = await getConfigRaw(f);
    const r = q ? JSON.parse(q) : {};
    const s = l.message.reply_to_message;
    if (s && s.text) {
      const C = s.text.match(/\[YNS:(\w+)\]/);
      if (C) {
        const D = C[1];
        const E = n;
        if (D === "cf_token") {
          const F = E.trim();
          try {
            await tgApi(k.BotToken, "deleteMessage", {
              chat_id: m,
              message_id: l.message.message_id,
            });
          } catch (G) {}
          cfInstallSet(m, {
            token: F,
            step: "deploy",
          });
          return await runCfInstall(f, k.BotToken, m, i, c);
        }
        if (D === "host") {
          r.HOST = E.trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .split("/")[0]
            .split(":")[0];
          if (!Array.isArray(r.HOSTS)) {
            r.HOSTS = [];
          }
          if (r.HOST && !r.HOSTS.includes(r.HOST)) {
            r.HOSTS.unshift(r.HOST);
          }
        } else if (D === "path") {
          r.PATH = E.startsWith("/") ? E : "/" + E;
        } else if (D === "name") {
          if (!r.optimizedSubGeneration) {
            r.optimizedSubGeneration = {};
          }
          r.optimizedSubGeneration.SUBNAME = E;
        } else if (D === "addhost") {
          const H = E.trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .split("/")[0]
            .split(":")[0];
          if (!Array.isArray(r.HOSTS)) {
            r.HOSTS = [];
          }
          if (H && !r.HOSTS.includes(H)) {
            r.HOSTS.push(H);
          }
        } else if (D === "chain") {
          const I = E.trim();
          r.chainProxy = I === "-" || I === "" ? "" : I;
        }
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "✅ ذخیره شد. در منو /start می‌توانید ادامه دهید.",
        );
        return new Response("OK", {
          status: 200,
        });
      }
    }
    switch (o) {
      case "/start": {
        const J = c.url.split("://")[0];
        const K = J + "://" + i + "/admin";
        const L =
          "<b>🛰 به ربات YNS خوش آمدید</b>\n\n<blockquote>این ربات برای <b>مدیریت کامل پنل</b> از داخل تلگرام است:\nدریافت لینک اشتراک، مشاهده‌ی وضعیت و مصرف، و تغییر تنظیمات (پروتکل، شبکه/DNS، دامنه‌ها، اعلان‌ها) — هر تغییر مستقیم روی پنل اعمال می‌شود.\n\nاز دکمه‌های زیر استفاده کنید 👇</blockquote>";
        const M = {
          inline_keyboard: [
            [
              {
                text: "📊 وضعیت",
                callback_data: "m:status",
                style: "primary",
              },
              {
                text: "🔗 اشتراک",
                callback_data: "m:sub",
                style: "primary",
              },
            ],
            [
              {
                text: "⚙️ تنظیمات",
                callback_data: "m:settings",
                style: "primary",
              },
              {
                text: "🛡 شبکه و DNS",
                callback_data: "m:net",
                style: "primary",
              },
            ],
            [
              {
                text: "🌐 دامنه‌ها",
                callback_data: "m:hosts",
                style: "primary",
              },
              {
                text: "📣 اعلان‌ها",
                callback_data: "m:notif",
                style: "primary",
              },
            ],
            [
              {
                text: "🖥 پنل وب (مینی‌اپ)",
                web_app: {
                  url: K,
                },
                style: "success",
              },
              {
                text: "🌍 وب‌سایت",
                url: "https://t.me/YNS_Proxy",
                style: "primary",
              },
            ],
            [
              {
                text: "👥 گروه YNS",
                url: "https://t.me/YNS_Proxy",
                style: "primary",
              },
            ],
          ],
        };
        const N =
          "https://api.telegram.org/bot" +
          k.BotToken +
          "/sendMessage?chat_id=" +
          m +
          "&parse_mode=HTML&text=" +
          encodeURIComponent(L) +
          "&reply_markup=" +
          encodeURIComponent(JSON.stringify(M));
        try {
          await fetch(N, {
            method: "GET",
          });
        } catch (O) {
          console.error("sendBotMessage error:", O);
        }
        break;
      }
      case "/install": {
        const P =
          "<b>🚀 نصب YNS روی Cloudflare شما</b>\n\n<blockquote>یک نسخهٔ کامل YNS را روی حساب Cloudflare خودتان مستقر می‌کند (D1 + ورکر + رمز + workers.dev).\n🔒 توکن فقط همین لحظه استفاده و هیچ‌جا ذخیره نمی‌شود.\n\nیک API Token بسازید با دسترسی: Workers Scripts·Edit، D1·Edit، Workers Subdomain·Edit.</blockquote>";
        await tgApi(k.BotToken, "sendMessage", {
          chat_id: m,
          parse_mode: "HTML",
          text: P,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🔑 ارسال توکن و شروع",
                  callback_data: "m:install:start",
                },
              ],
              [
                {
                  text: "⬅️ منو",
                  callback_data: "m:main",
                },
              ],
            ],
          },
        });
        break;
      }
      case "/help": {
        const Q =
          "<b>📋 دستورها </b>\n\n<blockquote><code>/start</code> · منوی مدیریت\n<code>/sub</code> · دریافت لینک اشتراک\n<code>/status</code> · وضعیت و مصرف\n<code>/config</code> · خلاصه کانفیگ\n<code>/hosts</code> · دامنه‌ها و سلامت\n<code>/addhost</code> · افزودن دامنه\n<code>/delhost</code> · حذف دامنه\n<code>/announce</code> · ارسال به کانال\n<code>/pause</code> · 🚨 توقف اضطراری سرویس\n<code>/resume</code> · ✅ ازسرگیری سرویس\n<code>/sethost</code> · تغییر host\n<code>/setpath</code> · تغییر مسیر\n<code>/setname</code> · تغییر نام\n<code>/setwebhook</code> · نصب Webhook\n<code>/myid</code> · Chat ID شما</blockquote>\n\n";
        await sendBotMessage(k.BotToken, m, Q, "HTML", TG_BACK);
        break;
      }
      case "/sub": {
        const R = await MD5MD5(i + g);
        const S = c.url.split("://")[0];
        const T = S + "://" + i + "/sub?token=" + R;
        const U =
          "<b>🔗 لینک‌های اشتراک </b>\n\n<blockquote><b>🤖 خودکار (تشخیص خودکار برنامه)</b>\n<code>" +
          T +
          "</code></blockquote>\n\n<blockquote><b>⚡ Clash / Mihomo / Karing</b>\n<code>" +
          T +
          "&clash</code></blockquote>\n\n<blockquote><b>📦 Sing-box</b>\n<code>" +
          T +
          "&sb</code></blockquote>\n\n<blockquote><b>🔡 Base64 (Hiddify / v2rayNG)</b>\n<code>" +
          T +
          "&b64</code></blockquote>\n\n<b>👆 روی هر لینک بزنید تا کپی شود</b>\n";
        await sendBotMessage(k.BotToken, m, U, "HTML", TG_BACK);
        break;
      }
      case "/status": {
        const V = Date.now() - (globalThis.__workerStart || Date.now());
        const W =
          Math.floor(V / 3600000) +
          "h " +
          Math.floor((V % 3600000) / 60000) +
          "m";
        const X = 12;
        let Y =
          "<b>📊 وضعیت سرور </b>\n\n<blockquote>⏱ <b>آپتایم:</b> <code>" +
          W +
          "</code>\n🆔 <b>UUID:</b> <code>" +
          g.slice(0, 8) +
          "...</code>\n🌐 <b>Host:</b> <code>" +
          i +
          "</code>\n📁 <b>مسیر:</b> <code>" +
          (r.PATH || "/") +
          "</code></blockquote>";
        let Z = r.CF?.Usage;
        try {
          const a0 = await f.KV.get("cf.json");
          if (a0) {
            const a1 = JSON.parse(a0);
            if (a1.UsageAPI) {
              const a2 = await fetch(a1.UsageAPI);
              Z = await a2.json();
            } else if (
              (a1.Email && a1.GlobalAPIKey) ||
              (a1.AccountID && a1.APIToken)
            ) {
              Z = await getCloudflareUsage(
                a1.Email,
                a1.GlobalAPIKey,
                a1.AccountID,
                a1.APIToken,
              );
            }
          }
        } catch (a3) {}
        if (Z?.success) {
          const a4 = Z.total / Z.max;
          const a5 = Math.round(a4 * X);
          const a6 = X - a5;
          const a7 = "🟩".repeat(a5) + "⬜".repeat(a6);
          const a8 = (a9) => Number(a9 || 0).toLocaleString("en-US");
          Y +=
            "\n<blockquote><b>📈 مصرف Cloudflare</b>\n" +
            a7 +
            " <b>" +
            (a4 * 100).toFixed(1) +
            "%</b>\n📄 Pages: <code>" +
            a8(Z.pages) +
            "</code>\n⚙️ Workers: <code>" +
            a8(Z.workers) +
            "</code>\n💠 مجموع: <code>" +
            a8(Z.total) +
            " / " +
            a8(Z.max) +
            "</code></blockquote>";
        }
        try {
          const a9 = await readUsageStats(f);
          const aa = (ab) =>
            "↑ <code>" +
            formatBytes(ab.up || 0) +
            "</code>  ↓ <code>" +
            formatBytes(ab.down || 0) +
            "</code>";
          Y +=
            "\n<blockquote><b>📦 حجم مصرفی / Traffic</b>\n📅 امروز: <code>" +
            formatBytes(a9.today.total) +
            "</code>\n     " +
            aa(a9.today) +
            "\n🗓 این ماه: <code>" +
            formatBytes(a9.month.total) +
            "</code>\n📆 امسال: <code>" +
            formatBytes(a9.year.total) +
            "</code>\n♾ کل: <code>" +
            formatBytes(a9.all.total) +
            "</code></blockquote>";
        } catch (ab) {}
        Y += "";
        await sendBotMessage(k.BotToken, m, Y, "HTML", TG_BACK);
        break;
      }
      case "/config": {
        const ac = r.protocolType || "vless";
        const ad = r.transportProtocol || "ws";
        const ae = (ah) => (ah ? "🟢 فعال" : "🔴 غیرفعال");
        const af = r.tlsFragment || "🔴 غیرفعال";
        let ag =
          "<b>⚙️ تنظیمات </b>\n\n<blockquote><b>📡 شبکه</b>\n\n<b>پروتکل:</b> <code>" +
          ac +
          "</code>  |  <b>نقل:</b> <code>" +
          ad +
          "</code>\n<b>Host:</b> <code>" +
          (r.HOST || i) +
          "</code>\n<b>مسیر:</b> <code>" +
          (r.PATH || "/") +
          "</code>\n<b>Fingerprint:</b> <code>" +
          (r.Fingerprint || "chrome") +
          "</code></blockquote>\n\n<blockquote><b>🔐 امنیت</b>\n\n<b>Skip Verify:</b> " +
          ae(r.skipCertVerify) +
          "\n<b>ECH:</b> " +
          ae(r.ECH) +
          "\n<b>0-RTT:</b> " +
          ae(r.enable0RTT) +
          "\n<b>TLS Fragment:</b> " +
          af +
          "</blockquote>\n\n<blockquote><b>🧩 ویژگی‌ها</b>\n\n<b>Dual Protocol:</b> " +
          ae(r.dualProtocol) +
          "\n<b>TG Bot:</b> " +
          ae(r.TG?.enable) +
          "\n<b>نام اشتراک:</b> <code>" +
          (r.optimizedSubGeneration?.SUBNAME || "-") +
          "</code></blockquote>\n\n";
        await sendBotMessage(k.BotToken, m, ag, "HTML", TG_BACK);
        break;
      }
      case "/sethost": {
        if (!p) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>⚠️ خطا </b>\n\n<blockquote>لطفا host را وارد کنید:\n<code>/sethost example.com</code></blockquote>",
          );
          break;
        }
        r.HOST = p
          .trim()
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .split("/")[0]
          .split(":")[0];
        if (!r.HOSTS) {
          r.HOSTS = [];
        }
        if (!r.HOSTS.includes(r.HOST)) {
          r.HOSTS.unshift(r.HOST);
        }
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>✅ موفق </b>\n\n<blockquote>Host به <code>" +
            r.HOST +
            "</code> تغییر یافت</blockquote>",
        );
        break;
      }
      case "/setpath": {
        if (!p) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>⚠️ خطا </b>\n\n<blockquote>لطفا مسیر را وارد کنید:\n<code>/setpath /api</code></blockquote>",
          );
          break;
        }
        r.PATH = p.startsWith("/") ? p : "/" + p;
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>✅ موفق </b>\n\n<blockquote>مسیر به <code>" +
            r.PATH +
            "</code> تغییر یافت</blockquote>",
        );
        break;
      }
      case "/setname": {
        if (!p) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>⚠️ خطا </b>\n\n<blockquote>لطفا نام را وارد کنید:\n<code>/setname MyConfig</code></blockquote>",
          );
          break;
        }
        if (!r.optimizedSubGeneration) {
          r.optimizedSubGeneration = {};
        }
        r.optimizedSubGeneration.SUBNAME = p;
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>✅ موفق </b>\n\n<blockquote>نام اشتراک به <code>" +
            p +
            "</code> تغییر یافت</blockquote>",
        );
        break;
      }
      case "/hosts": {
        const ah = r.HOSTS && r.HOSTS.length ? r.HOSTS : r.HOST ? [r.HOST] : [];
        const ai = {};
        try {
          const ak = JSON.parse(
            (await f.KV.get("domain-health.json")) || "null",
          );
          if (ak && Array.isArray(ak.domains)) {
            for (const al of ak.domains) {
              ai[al.host] = al.ok;
            }
          }
        } catch (am) {}
        const aj = ah.length
          ? ah
              .map(
                (an) =>
                  (ai[an] === false ? "🔴" : ai[an] === true ? "🟢" : "⚪️") +
                  " <code>" +
                  an +
                  "</code>",
              )
              .join("\n")
          : "هیچ دامنه‌ای ثبت نشده";
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>🌐 دامنه‌ها </b>\n\n<blockquote>" +
            aj +
            "</blockquote>\n\n<i>🟢 سالم  🔴 خطا  ⚪️ بررسی‌نشده</i>",
        );
        break;
      }
      case "/addhost": {
        if (!p) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>⚠️ خطا </b>\n\n<blockquote>دامنه را وارد کنید:\n<code>/addhost cdn.example.com</code></blockquote>",
          );
          break;
        }
        const an = p
          .trim()
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .split("/")[0]
          .split(":")[0];
        if (!r.HOSTS) {
          r.HOSTS = [];
        }
        if (r.HOSTS.includes(an)) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>ℹ️ </b>\n\n<blockquote>این دامنه از قبل در استخر است.</blockquote>",
          );
          break;
        }
        r.HOSTS.push(an);
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>✅ موفق </b>\n\n<blockquote>دامنه <code>" +
            an +
            "</code> اضافه شد (مجموع " +
            r.HOSTS.length +
            " دامنه)</blockquote>",
        );
        break;
      }
      case "/delhost": {
        if (!p) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>⚠️ خطا </b>\n\n<blockquote>دامنه را وارد کنید:\n<code>/delhost cdn.example.com</code></blockquote>",
          );
          break;
        }
        const ao = p
          .trim()
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .split("/")[0]
          .split(":")[0];
        if (!r.HOSTS || !r.HOSTS.includes(ao)) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>ℹ️ </b>\n\n<blockquote>این دامنه در استخر نیست.</blockquote>",
          );
          break;
        }
        if (r.HOSTS.length <= 1) {
          await sendBotMessage(
            k.BotToken,
            m,
            "<b>⚠️ </b>\n\n<blockquote>نمی‌توان آخرین دامنه را حذف کرد.</blockquote>",
          );
          break;
        }
        r.HOSTS = r.HOSTS.filter((ap) => ap !== ao);
        if (r.HOST === ao) {
          r.HOST = r.HOSTS[0];
        }
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>✅ موفق </b>\n\n<blockquote>دامنه <code>" +
            ao +
            "</code> حذف شد (مجموع " +
            r.HOSTS.length +
            " دامنه)</blockquote>",
        );
        break;
      }
      case "/announce": {
        const ap = await announceSubLinks(f, {
          baseUrl: "https://" + i,
          health: JSON.parse((await f.KV.get("domain-health.json")) || "null"),
        });
        const aq = ap.skipped
          ? "<b>⚠️ ارسال نشد </b>\n\n<blockquote>" + ap.reason + "</blockquote>"
          : "<b>📣 ارسال شد </b>\n\n<blockquote>لینک‌های اشتراک به کانال ارسال شد.</blockquote>";
        await sendBotMessage(k.BotToken, m, aq);
        break;
      }
      case "/pause": {
        r.paused = true;
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>🚨 سرویس متوقف شد</b>\n\n<blockquote>همهٔ اتصال‌های پراکسی و دریافت اشتراک‌ها رد می‌شوند (۵۰۳). پنل و ربات باز می‌مانند.\nبرای ازسرگیری <code>/resume</code> را بزنید.</blockquote>",
        );
        break;
      }
      case "/resume": {
        r.paused = false;
        await putConfig(f, JSON.stringify(r, null, 2));
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>✅ سرویس از سر گرفته شد</b>\n\n<blockquote>اتصال‌های پراکسی و دریافت اشتراک‌ها دوباره فعال شدند.</blockquote>",
        );
        break;
      }
      case "/myid": {
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>🆔 Chat ID </b>\n\n<blockquote><code>" +
            m +
            "</code></blockquote>",
        );
        break;
      }
      case "/setwebhook": {
        const ar = c.url.split("://")[0] + "://" + c.url.split("/")[2];
        const as =
          "https://api.telegram.org/bot" +
          k.BotToken +
          "/setWebhook?url=" +
          encodeURIComponent(ar + "/bot") +
          "&drop_pending_updates=true";
        const at = await fetch(as);
        await tgSetMyCommands(k.BotToken);
        const au = await at.json();
        const av = au.ok
          ? "<b>✅ Webhook </b>\n\n<blockquote>Webhook با موفقیت نصب شد!\n\n🌐 <code>" +
            ar +
            "/bot</code></blockquote>"
          : "<b>❌ خطا </b>\n\n<blockquote>خطا در نصب Webhook:\n<code>" +
            JSON.stringify(au) +
            "</code></blockquote>";
        await sendBotMessage(k.BotToken, m, av, "HTML", TG_BACK);
        break;
      }
      default: {
        await sendBotMessage(
          k.BotToken,
          m,
          "<b>❌ خطا </b>\n\n<blockquote>دستور ناشناخته.\nبرای راهنما <code>/help</code> را بزنید.</blockquote>",
        );
      }
    }
  } catch (aw) {
    console.error("Telegram webhook error:", aw);
  }
  return new Response("OK", {
    status: 200,
  });
}
const PANEL_PLACEHOLDER = /your-panel\.pages\.dev/i;
function panelHasAssets(c) {
  return !!c && !!c.ASSETS && typeof c.ASSETS.fetch === "function";
}
async function panelFetch(c, f) {
  const g = f.startsWith("/") ? f : "/" + f;
  if (panelHasAssets(c)) {
    let k = g.split("?")[0];
    if (!/\.[a-z0-9]{2,5}$/i.test(k) && !k.endsWith("/")) {
      k += "/";
    }
    try {
      return await c.ASSETS.fetch(new Request("https://assets.local" + k));
    } catch (l) {
      return new Response("", {
        status: 502,
      });
    }
  }
  if (!PagesstaticPages || PANEL_PLACEHOLDER.test(PagesstaticPages)) {
    return new Response("", {
      status: 404,
    });
  }
  const h = PagesstaticPages.replace(/\/+$/, "");
  const i = /raw\.githubusercontent\.com/i.test(h);
  let j = g.split("?")[0];
  if (i && !/\.[a-z0-9]{2,5}$/i.test(j)) {
    j = j.replace(/\/+$/, "") + "/index.html";
  }
  if (!j.startsWith("/")) {
    j = "/" + j;
  }
  try {
    const m = await fetch(h + j, {
      cf: {
        cacheTtl: 300,
        cacheEverything: true,
      },
    });
    if (!i || !m.ok) {
      return m;
    }
    const n = (j.split(".").pop() || "").toLowerCase();
    const o =
      {
        html: "text/html;charset=utf-8",
        js: "text/javascript;charset=utf-8",
        mjs: "text/javascript;charset=utf-8",
        css: "text/css;charset=utf-8",
        svg: "image/svg+xml",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        ico: "image/x-icon",
        json: "application/json;charset=utf-8",
        woff2: "font/woff2",
        woff: "font/woff",
      }[n] || "text/html;charset=utf-8";
    const q = new Headers(m.headers);
    q.set("Content-Type", o);
    q.delete("X-Content-Type-Options");
    q.delete("Content-Security-Policy");
    return new Response(m.body, {
      status: m.status,
      headers: q,
    });
  } catch (s) {
    return new Response("", {
      status: 502,
    });
  }
}
async function panelHtml(c, f, g = {}) {
  const i = panelHasAssets(c);
  let j = null;
  try {
    j = await panelFetch(c, f);
  } catch (m) {
    j = null;
  }
  if (!j || !j.ok) {
    return new Response(panelUnavailableHtml(), {
      status: 200,
      headers: {
        "Content-Type": "text/html;charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
  let k = await j.text();
  if (!i) {
    k = k.replace(/"\.\.\/logo\.png"/g, '"' + PagesstaticPages + 'logo.png"');
    k = k.replace(
      /src=['"]\.\.\/logo\.png['"]/g,
      'src="' + PagesstaticPages + 'logo.png"',
    );
  }
  if (g.spaPage) {
    k = k.replace(
      "</head>",
      '<script>location.hash="page=' + g.spaPage + '";</script></head>',
    );
  }
  const l = new Headers();
  l.set("Content-Type", "text/html;charset=utf-8");
  l.set("Cache-Control", "no-store");
  return new Response(k, {
    status: g.status || j.status,
    headers: l,
  });
}
function panelUnavailableHtml() {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>YNS — setup</title><style>body{font-family:system-ui,Segoe UI,Tahoma,sans-serif;background:#0b0d11;color:#e9edf4;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}.c{max-width:560px;background:#101319;border:1px solid #1c2027;border-radius:16px;padding:28px}h1{font-size:18px;margin:0 0 12px}p{color:#aeb6c4;line-height:1.7;font-size:14px}code{background:#0b0d11;border:1px solid #1c2027;border-radius:5px;padding:1px 6px;color:#22d3ee}</style></head><body><div class="c"><h1>Dashboard not bundled yet</h1><p>The Worker is running, but it can\'t find the dashboard files. This happens when the code was uploaded by hand instead of deployed from the repository.</p><p><b>Fix:</b> deploy with the <b>Deploy to Cloudflare</b> button (or connect the GitHub repo in <code>Workers &amp; Pages → your Worker → Settings → Build</code>). That bundles the dashboard (the <code>ASSETS</code> binding) and creates the <code>KV</code> namespace automatically.</p><p>Already have a separate dashboard site? Set a Worker variable <code>PAGES_URL</code> to its URL.</p></div></body></html>';
}
async function handleInstall(c, f, g, h, i, j) {
  const k = g.pathname
    .slice(1)
    .toLowerCase()
    .replace(/^install\/?/, "");
  const l = !!f.KV && typeof f.KV.get === "function";
  const m = f.__kvWrapped
    ? !!f.__hasRealKV
    : !!f.KV && typeof f.KV.get === "function";
  if (k === "status") {
    const n = !!f.DB && typeof f.DB.prepare === "function";
    let o = "none";
    if (n) {
      try {
        await f.DB.prepare("SELECT 1 AS ok").first();
        o = "ok";
      } catch (q) {
        o = "err:" + ((q && q.message) || String(q));
      }
    }
    const p = n;
    return new Response(
      JSON.stringify({
        kv: m,
        d1: p,
        d1Bound: n,
        d1Probe: o,
        store: p ? "d1" : m ? "kv" : "none",
        admin: !!h,
        configured: !!l && !!h,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  if (k === "set") {
    if (c.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
      });
    }
    if (h) {
      return new Response(
        JSON.stringify({
          error: "already_configured",
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        },
      );
    }
    if (!l) {
      return new Response(
        JSON.stringify({
          error: "no_kv",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        },
      );
    }
    let r = {};
    try {
      r = await c.json();
    } catch (u) {
      try {
        r = Object.fromEntries(new URLSearchParams(await c.text()));
      } catch (v) {}
    }
    const s = (r.password || "").toString().replace(/[\r\n]/g, "");
    if (s.length < 6) {
      return new Response(
        JSON.stringify({
          error: "too_short",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        },
      );
    }
    try {
      await f.KV.put("admin_pass", s);
      cachedAdminPass = s;
      cachedAdminPassAt = Date.now();
    } catch (w) {
      return new Response(
        JSON.stringify({
          error: "kv_write_failed",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        },
      );
    }
    const t = {
      "Content-Type": "application/json;charset=utf-8",
    };
    try {
      t["Set-Cookie"] =
        "auth=" +
        (await makeSessionToken(j || "null", i, s)) +
        "; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax";
    } catch (x) {}
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: t,
      },
    );
  }
  return await panelHtml(f, "/install/");
}
async function nginx() {
  return '\n\t<!DOCTYPE html>\n\t<html>\n\t<head>\n\t<title>Welcome to nginx!</title>\n\t<style>\n\t\tbody {\n\t\t\twidth: 35em;\n\t\t\tmargin: 0 auto;\n\t\t\tfont-family: Tahoma, Verdana, Arial, sans-serif;\n\t\t}\n\t</style>\n\t</head>\n\t<body>\n\t<h1>Welcome to nginx!</h1>\n\t<p>If you see this page, the nginx web server is successfully installed and\n\tworking. Further configuration is required.</p>\n\n\t<p>For online documentation and support please refer to\n\t<a href="http://nginx.org/">nginx.org</a>.<br/>\n\tCommercial support is available at\n\t<a href="http://nginx.com/">nginx.com</a>.</p>\n\n\t<p><em>Thank you for using nginx.</em></p>\n\t</body>\n\t</html>\n\t';
}
async function html1101(c, f) {
  const g = new Date();
  const h =
    g.getFullYear() +
    "-" +
    String(g.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(g.getDate()).padStart(2, "0") +
    " " +
    String(g.getHours()).padStart(2, "0") +
    ":" +
    String(g.getMinutes()).padStart(2, "0") +
    ":" +
    String(g.getSeconds()).padStart(2, "0");
  const i = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((j) => j.toString(16).padStart(2, "0"))
    .join("");
  return (
    '<!DOCTYPE html>\n<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en-US"> <![endif]-->\n<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en-US"> <![endif]-->\n<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en-US"> <![endif]-->\n<!--[if gt IE 8]><!--> <html class="no-js" lang="en-US"> <!--<![endif]-->\n<head>\n<title>Worker threw exception | ' +
    c +
    ' | Cloudflare</title>\n<meta charset="UTF-8" />\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n<meta http-equiv="X-UA-Compatible" content="IE=Edge" />\n<meta name="robots" content="noindex, nofollow" />\n<meta name="viewport" content="width=device-width,initial-scale=1" />\n<link rel="stylesheet" id="cf_styles-css" href="/cdn-cgi/styles/cf.errors.css" />\n<!--[if lt IE 9]><link rel="stylesheet" id=\'cf_styles-ie-css\' href="/cdn-cgi/styles/cf.errors.ie.css" /><![endif]-->\n<style>body{margin:0;padding:0}</style>\n\n\n<!--[if gte IE 10]><!-->\n<script>\n  if (!navigator.cookieEnabled) {\n    window.addEventListener(\'DOMContentLoaded\', function () {\n      var cookieEl = document.getElementById(\'cookie-alert\');\n      cookieEl.style.display = \'block\';\n    })\n  }\n</script>\n<!--<![endif]-->\n\n</head>\n<body>\n    <div id="cf-wrapper">\n        <div class="cf-alert cf-alert-error cf-cookie-error" id="cookie-alert" data-translate="enable_cookies">Please enable cookies.</div>\n        <div id="cf-error-details" class="cf-error-details-wrapper">\n            <div class="cf-wrapper cf-header cf-error-overview">\n                <h1>\n                    <span class="cf-error-type" data-translate="error">Error</span>\n                    <span class="cf-error-code">1101</span>\n                    <small class="heading-ray-id">Ray ID: ' +
    i +
    " &bull; " +
    h +
    ' UTC</small>\n                </h1>\n                <h2 class="cf-subheadline" data-translate="error_desc">Worker threw exception</h2>\n            </div><!-- /.header -->\n\n            <section></section><!-- spacer -->\n\n            <div class="cf-section cf-wrapper">\n                <div class="cf-columns two">\n                    <div class="cf-column">\n                        <h2 data-translate="what_happened">What happened?</h2>\n                            <p>You\'ve requested a page on a website (' +
    c +
    ') that is on the <a href="https://www.cloudflare.com/5xx-error-landing?utm_source=error_100x" target="_blank">Cloudflare</a> network. An unknown error occurred while rendering the page.</p>\n                    </div>\n\n                    <div class="cf-column">\n                        <h2 data-translate="what_can_i_do">What can I do?</h2>\n                            <p><strong>If you are the owner of this website:</strong><br />refer to <a href="https://developers.cloudflare.com/workers/observability/errors/" target="_blank">Workers - Errors and Exceptions</a> and check Workers Logs for ' +
    c +
    '.</p>\n                    </div>\n\n                </div>\n            </div><!-- /.section -->\n\n            <div class="cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300">\n    <p class="text-13">\n      <span class="cf-footer-item sm:block sm:mb-1">Cloudflare Ray ID: <strong class="font-semibold"> ' +
    i +
    '</strong></span>\n      <span class="cf-footer-separator sm:hidden">&bull;</span>\n      <span id="cf-footer-item-ip" class="cf-footer-item hidden sm:block sm:mb-1">\n        Your IP:\n        <button type="button" id="cf-footer-ip-reveal" class="cf-footer-ip-reveal-btn">Click to reveal</button>\n        <span class="hidden" id="cf-footer-ip">' +
    f +
    '</span>\n        <span class="cf-footer-separator sm:hidden">&bull;</span>\n      </span>\n      <span class="cf-footer-item sm:block sm:mb-1"><span>Performance &amp; security by</span> <a rel="noopener noreferrer" href="https://www.cloudflare.com/5xx-error-landing" id="brand_link" target="_blank">Cloudflare</a></span>\n\n    </p>\n    <script>(function(){function d(){var b=a.getElementById("cf-footer-item-ip"),c=a.getElementById("cf-footer-ip-reveal");b&&"classList"in b&&(b.classList.remove("hidden"),c.addEventListener("click",function(){c.classList.add("hidden");a.getElementById("cf-footer-ip").classList.remove("hidden")}))}var a=document;document.addEventListener&&a.addEventListener("DOMContentLoaded",d)})();</script>\n  </div><!-- /.error-footer -->\n\n        </div><!-- /#cf-error-details -->\n    </div><!-- /#cf-wrapper -->\n\n     <script>\n    window._cf_translation = {};\n\n\n  </script>\n</body>\n</html>'
  );
}
async function getCentralApi(c) {
  let f = {};
  try {
    const g = await getConfigRaw(c);
    f = g ? JSON.parse(g) : {};
  } catch (h) {}
  return {
    api: String(c.CENTRAL_API || f.centralApi || "")
      .trim()
      .replace(/\/$/, ""),
    token: String(c.CENTRAL_TOKEN || f.centralToken || "").trim(),
    cj: f,
  };
}
async function centralHeartbeat(c) {
  const { api: f, cj: g } = await getCentralApi(c);
  if (!f) {
    return;
  }
  const h = g.HOST || (Array.isArray(g.HOSTS) && g.HOSTS[0]) || "";
  const i = await MD5MD5("yns-instance:" + h);
  let j = null;
  try {
    j = await usageGet(
      c,
      "usage-m:" +
        (new Date().getFullYear() +
          "-" +
          String(new Date().getMonth() + 1).padStart(2, "0")),
    );
  } catch (k) {}
  try {
    await fetch(f + "/heartbeat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "YNSProxy",
      },
      body: JSON.stringify({
        id: i,
        host: h,
        version: Version,
        monthTraffic: j ? j.total : 0,
        ts: Date.now(),
      }),
    });
  } catch (l) {}
}
async function refreshAnnouncements(c) {
  const { api: f } = await getCentralApi(c);
  if (!f) {
    return;
  }
  try {
    const g = await fetch(f + "/announcement", {
      headers: {
        "User-Agent": "YNSProxy",
      },
    });
    if (g.ok) {
      await c.KV.put("announcement.json", await g.text());
    }
  } catch (h) {}
}
const warpKeyPool = [
  {
    pk: "AKs7CKzbDVmfjSgCB4A1JNI5YBMclHYV2OQ7srIijW4=",
    ipv6: "2606:4700:110:876d:4d3c:4206:c90c:6bd0/128",
    reserved: "",
  },
  {
    pk: "ILJiqBa4QguF5YHRiB9Xfq2Ll01qbYe4dUKZLdgNTFs=",
    ipv6: "2606:4700:110:8e7b:3658:cd12:5c4f:d86e/128",
    reserved: "",
  },
  {
    pk: "aJ2wqfkki3um7JnNAH2R6/OnAo2Td+pmxbRReh1v9GE=",
    ipv6: "2606:4700:110:8310:d937:2fb:c312:9498/128",
    reserved: "162,104,222",
  },
  {
    pk: "0EefAfoz3eY1PUwycUO5/Ux0GKnjOq6TJk5NySdOglk=",
    ipv6: "2606:4700:110:8b5b:874a:4dbe:b6d2:d333/128",
    reserved: "185,208,24",
  },
  {
    pk: "gNPBZNJg1mOGJjoTTof9luaQHdZP2oMRU8nXd3xjpX8=",
    ipv6: "2606:4700:110:83b7:3a13:7ef3:96fc:f055/128",
    reserved: "244,132,74",
  },
  {
    pk: "sIVbx/54EJOM0caRr/kksFAkdni+V9VZawSZaha0tms=",
    ipv6: "2606:4700:110:8502:e803:c14e:2858:c0e7/128",
    reserved: "61,142,253",
  },
  {
    pk: "+Cgu25E1zo9PkW5fC299zgbGVGKJamWgF6/iqQdoUW0=",
    ipv6: "2606:4700:110:805e:1441:a533:975b:8a39/128",
    reserved: "153,183,146",
  },
  {
    pk: "GKaNRx+KVRL3F1sguZHO8wh70yUprNsPjmUapCGUsGk=",
    ipv6: "2606:4700:110:88f9:54b8:120e:d01d:c77e/128",
    reserved: "121,102,72",
  },
  {
    pk: "qEqlXOEDcFt803y8Gs/fo8DuZJpZpWV/FSh1oKReFXI=",
    ipv6: "2606:4700:110:890f:f926:98fe:7e61:d0e7/128",
    reserved: "18,15,251",
  },
  {
    pk: "+HfkMSyh7obEkX4J8Qa7Xk77CLVn45AW4CdBbnFNaGc=",
    ipv6: "2606:4700:110:83e8:84f7:8c64:70b4:6709/128",
    reserved: "92,242,140",
  },
  {
    pk: "cA8htoCSuLJbax8I6HewsDTwTbuWt5DjEItcGvLGREw=",
    ipv6: "2606:4700:110:8c0b:359c:ee61:a221:d261/128",
    reserved: "50,15,234",
  },
  {
    pk: "iLHohl4txwAsgUPW1lGsnAeJDFvit6LAdMYTwbNRGUM=",
    ipv6: "2606:4700:110:81a6:2bc6:e542:7f3e:57f1/128",
    reserved: "6,26,27",
  },
  {
    pk: "eMkBv99f6rbTboaKNV4HJhvu/Dn35mub7BrY8xFrCVo=",
    ipv6: "2606:4700:110:8980:cd13:9729:f969:9aab/128",
    reserved: "137,173,229",
  },
  {
    pk: "8NquX1vPe6AHY5qXmShDELMtx4was2awcNqKj2MgRGM=",
    ipv6: "2606:4700:110:82e8:22b6:a7ee:b89c:a5a2/128",
    reserved: "236,186,157",
  },
  {
    pk: "kK/MhN/pbNI05H77pgSsNN6OqM+jPba3Lz9A5Jlg8lw=",
    ipv6: "2606:4700:110:8847:e19b:4828:fe35:d337/128",
    reserved: "139,171,35",
  },
  {
    pk: "6L1n+NV62WEr2o4/pEUopsgB6RzcY86BLIgYwdOTxmc=",
    ipv6: "2606:4700:110:833b:f16c:a4f3:cf60:8fa3/128",
    reserved: "141,213,198",
  },
  {
    pk: "sALjsE4FBGPC/GosnaOhFy/+2cog7roA3jN8yC75F3g=",
    ipv6: "2606:4700:110:8d06:7ef8:cf45:2393:9ac7/128",
    reserved: "66,144,87",
  },
  {
    pk: "iEpioH7klluHVhhhDsz0JodBtjqECXMT7J0LLqHmsEs=",
    ipv6: "2606:4700:110:871a:f575:a463:76a0:1984/128",
    reserved: "65,170,17",
  },
  {
    pk: "IIBhFRq9qkF0nxPXHzzvATyRVcEePvPU5bJOuoC2S0g=",
    ipv6: "2606:4700:110:8ea1:c997:fbfe:f888:3946/128",
    reserved: "18,140,54",
  },
  {
    pk: "gO/NAt7kT3zNWk6OiQ5Ru9A2ksAr96sPxxr68B8TtH0=",
    ipv6: "2606:4700:110:8775:bf6c:a489:d6db:fd76/128",
    reserved: "42,76,32",
  },
];
const warpPublicKey = "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=";
const warpCidrs = [
  "162.159.192.0/24",
  "162.159.193.0/24",
  "162.159.195.0/24",
  "188.114.96.0/24",
  "188.114.97.0/24",
  "188.114.98.0/24",
  "188.114.99.0/24",
];
const warpPorts = [
  854, 859, 864, 878, 880, 890, 891, 894, 903, 908, 928, 934, 939, 942, 943,
  945, 946, 955, 968, 987, 988, 1002, 1010, 1014, 1018, 1070, 1074, 1180, 1387,
  1843, 2371, 2506, 3138, 3476, 3581, 3854, 4177, 4198, 4233, 5279, 5956, 7103,
  7152, 7156, 7281, 7559, 8319, 8742, 8854, 8886, 2408, 500, 4500, 1701,
];
function warpRandomIPv4InCidr(c) {
  const [f, g] = c.split("/");
  const h = parseInt(g, 10);
  const i = f.split(".").reduce((l, m) => (l << 8) + parseInt(m, 10), 0) >>> 0;
  const j = Math.floor(Math.random() * Math.pow(2, 32 - h));
  const k = (i + j) >>> 0;
  return [(k >>> 24) & 255, (k >>> 16) & 255, (k >>> 8) & 255, k & 255].join(
    ".",
  );
}
function warpRandomEndpoints(c) {
  const f = new Set();
  let g = 0;
  while (f.size < c && g++ < c * 6) {
    const h = warpCidrs[Math.floor(Math.random() * warpCidrs.length)];
    const i = warpPorts[Math.floor(Math.random() * warpPorts.length)];
    f.add(warpRandomIPv4InCidr(h) + ":" + i);
  }
  return [...f];
}
function buildWarpWireGuardLink(c, f, g) {
  const h = encodeURIComponent(f.pk);
  const i = encodeURIComponent(warpPublicKey);
  const j = encodeURIComponent("172.16.0.2/32," + f.ipv6);
  const k = encodeURIComponent("YNS-WARP-" + c);
  const l =
    f.reserved && f.reserved.trim()
      ? "&reserved=" + encodeURIComponent(f.reserved)
      : "";
  return (
    "wireguard://" +
    h +
    "@" +
    c +
    "/?publickey=" +
    i +
    l +
    "&address=" +
    j +
    "&mtu=" +
    g +
    "#" +
    k
  );
}
function buildWarpNekoRayLink(c, f, g) {
  const h = c.lastIndexOf(":");
  const i = c.slice(0, h);
  const j = c.slice(h + 1);
  const k = JSON.stringify({
    type: "wireguard",
    tag: "wireguard-out",
    server: i,
    server_port: Number(j),
    system_interface: false,
    interface_name: "warp-wg",
    local_address: ["172.16.0.2/32", f.ipv6],
    private_key: f.pk,
    peer_public_key: warpPublicKey,
    pre_shared_key: "",
    reserved:
      f.reserved && f.reserved.trim()
        ? f.reserved.split(",").map((m) => Number(m.trim()))
        : [],
    mtu: Number(g),
  });
  const l = {
    _v: 0,
    addr: "127.0.0.1",
    cmd: [""],
    core: "internal",
    cs: k,
    mapping_port: 0,
    name: "YNS-WARP-" + c,
    port: 1080,
    socks_port: 0,
  };
  return "nekoray://custom#" + btoa(JSON.stringify(l));
}
async function handleWarpRequest(c) {
  const f = new URL(c.url);
  const g = (f.searchParams.get("target") || "wireguard").toLowerCase();
  const h = Math.min(
    Math.max(parseInt(f.searchParams.get("count") || "50", 10) || 50, 1),
    500,
  );
  const i = Math.min(
    Math.max(parseInt(f.searchParams.get("mtu") || "1280", 10) || 1280, 576),
    1500,
  );
  const j = warpRandomEndpoints(h);
  const k = ["nekoray", "nekobox", "neko"].includes(g);
  const l = j.map((n) => {
    const o = warpKeyPool[Math.floor(Math.random() * warpKeyPool.length)];
    if (k) {
      return buildWarpNekoRayLink(n, o, i);
    } else {
      return buildWarpWireGuardLink(n, o, i);
    }
  });
  const m = btoa(l.join("\n"));
  return new Response(m, {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
const WARP_API = "https://api.cloudflareclient.com/v0a2158";
const WARP_REG_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "okhttp/3.12.1",
  "CF-Client-Version": "a-6.10-2158",
};
async function warpGenKeys() {
  const c = await crypto.subtle.generateKey(
    {
      name: "X25519",
    },
    true,
    ["deriveBits"],
  );
  const f = await crypto.subtle.exportKey("jwk", c.privateKey);
  const g = new Uint8Array(await crypto.subtle.exportKey("raw", c.publicKey));
  const h = (j) => btoa(String.fromCharCode.apply(null, j));
  const i = (j) => {
    j = j.replace(/-/g, "+").replace(/_/g, "/");
    while (j.length % 4) {
      j += "=";
    }
    return j;
  };
  return {
    privateKey: i(f.d),
    publicKey: h(g),
  };
}
function warpDecodeReserved(c) {
  try {
    const f = atob(c);
    return [f.charCodeAt(0), f.charCodeAt(1), f.charCodeAt(2)];
  } catch (g) {
    return [];
  }
}
async function warpRegisterAccount() {
  const c = await warpGenKeys();
  const f = JSON.stringify({
    key: c.publicKey,
    install_id: "",
    fcm_token: "",
    tos: new Date().toISOString(),
    model: "PC",
    type: "Android",
    locale: "en_US",
  });
  let g;
  let h = 0;
  for (let n = 0; n < 4; n++) {
    if (n) {
      await new Promise((o) => setTimeout(o, n * 500 * n));
    }
    g = await fetch(WARP_API + "/reg", {
      method: "POST",
      headers: WARP_REG_HEADERS,
      body: f,
    });
    if (g.ok) {
      break;
    }
    h = g.status;
    if (g.status !== 429 && g.status < 500) {
      break;
    }
  }
  if (!g.ok) {
    if (h === 429) {
      throw new Error(
        "Cloudflare rate-limited WARP registration (HTTP 429) on the Worker IP — wait a minute and retry, or use the central WARP+ pool. This is a registration throttle, not a license problem.",
      );
    }
    throw new Error("registration HTTP " + h);
  }
  const i = await g.json();
  const k = (i.config && i.config.peers && i.config.peers[0]) || {};
  const l =
    (k.endpoint && (k.endpoint.host || k.endpoint.v4)) ||
    "engage.cloudflareclient.com:2408";
  const m =
    (i.config && i.config.interface && i.config.interface.addresses) || {};
  return {
    privateKey: c.privateKey,
    publicKey: c.publicKey,
    id: i.id,
    token: i.token,
    peerPublicKey: k.public_key || "",
    endpoint: l,
    addressV4: m.v4 || "172.16.0.2",
    addressV6: m.v6 || "",
    clientId: (i.config && i.config.client_id) || "",
    reserved: warpDecodeReserved((i.config && i.config.client_id) || ""),
    warpPlus: !!i.account && !!i.account.warp_plus,
    license: (i.account && i.account.license) || null,
  };
}
async function warpApplyLicense(c, f) {
  const h = await fetch(WARP_API + "/reg/" + c.id + "/account", {
    method: "PUT",
    headers: {
      ...WARP_REG_HEADERS,
      Authorization: "Bearer " + c.token,
    },
    body: JSON.stringify({
      license: f,
    }),
  });
  const i = await h.text();
  let k = {};
  try {
    k = JSON.parse(i);
  } catch (m) {}
  if (!h.ok) {
    throw new Error(
      "license rejected (HTTP " +
        h.status +
        (k && k.errors ? ": " + JSON.stringify(k.errors) : "") +
        ")",
    );
  }
  let l = !!k && (!!k.warp_plus || (!!k.account && !!k.account.warp_plus));
  if (!l) {
    try {
      const n = await fetch(WARP_API + "/reg/" + c.id + "/account", {
        headers: {
          ...WARP_REG_HEADERS,
          Authorization: "Bearer " + c.token,
        },
      });
      const o = await n.json().catch(() => ({}));
      l = !!o && (!!o.warp_plus || (!!o.account && !!o.account.warp_plus));
    } catch (p) {}
  }
  if (!l) {
    throw new Error(
      "license not accepted (not WARP+, expired, or already bound to another account)",
    );
  }
  c.warpPlus = true;
  c.license = f;
  return c;
}
function warpValidEndpoint(c) {
  return (
    typeof c === "string" && /^[A-Za-z0-9.\-\[\]:]+:\d{1,5}$/.test(c.trim())
  );
}
const WARP_SUGGESTED_ENDPOINTS = [
  "engage.cloudflareclient.com:2408",
  "162.159.192.1:2408",
  "162.159.193.10:2408",
  "162.159.195.1:2408",
  "188.114.96.1:2408",
  "188.114.97.1:2408",
  "188.114.98.1:2408",
  "188.114.99.1:2408",
  "162.159.192.1:894",
  "188.114.96.1:1701",
  "162.159.195.1:928",
  "188.114.98.1:955",
];
function warpPublicView(c, f) {
  if (!c || !c.registered) {
    return {
      registered: false,
    };
  }
  const g = {
    registered: true,
    endpoint: c.endpoint,
    warpPlus: !!c.warpPlus,
    wow: c.wow
      ? {
          registered: true,
        }
      : undefined,
    suggestedEndpoints: WARP_SUGGESTED_ENDPOINTS,
  };
  if (c.privateKey && c.peerPublicKey) {
    const h = String(
      f && warpValidEndpoint(f)
        ? f.trim()
        : c.endpoint || "engage.cloudflareclient.com:2408",
    );
    const i = h.includes(":") ? h : h + ":2408";
    g.endpoint = i;
    g.endpointOverridden = !!f && !!warpValidEndpoint(f);
    const j = "172.16.0.2/32" + (c.addressV6 ? "," + c.addressV6 + "/128" : "");
    const k =
      Array.isArray(c.reserved) && c.reserved.length
        ? "&reserved=" + encodeURIComponent(c.reserved.join(","))
        : "";
    g.reserved = Array.isArray(c.reserved) ? c.reserved : [];
    g.node =
      "wireguard://" +
      encodeURIComponent(c.privateKey) +
      "@" +
      i +
      "/?publickey=" +
      encodeURIComponent(c.peerPublicKey) +
      k +
      "&address=" +
      encodeURIComponent(j) +
      "&mtu=1280#YNS-WARP";
    g.conf =
      "[Interface]\nPrivateKey = " +
      c.privateKey +
      "\nAddress = " +
      j +
      "\nDNS = 1.1.1.1, 1.0.0.1\nMTU = 1280\n\n[Peer]\nPublicKey = " +
      c.peerPublicKey +
      "\nAllowedIPs = 0.0.0.0/0, ::/0\nEndpoint = " +
      i;
  }
  return g;
}
async function buildRegisteredWarpNode(c) {
  let f;
  try {
    f = JSON.parse((await c.KV.get("warp.json")) || "null");
  } catch (m) {
    return "";
  }
  if (!f || !f.registered || !f.privateKey || !f.peerPublicKey) {
    return "";
  }
  const g =
    networkSettings &&
    networkSettings.warpEndpoint &&
    warpValidEndpoint(networkSettings.warpEndpoint)
      ? networkSettings.warpEndpoint.trim()
      : "";
  const h = String(g || f.endpoint || "engage.cloudflareclient.com:2408");
  const i = encodeURIComponent(f.privateKey);
  const j = encodeURIComponent(f.peerPublicKey);
  const k = encodeURIComponent(
    "172.16.0.2/32" + (f.addressV6 ? "," + f.addressV6 + "/128" : ""),
  );
  const l =
    Array.isArray(f.reserved) && f.reserved.length
      ? "&reserved=" + encodeURIComponent(f.reserved.join(","))
      : "";
  return (
    "wireguard://" +
    i +
    "@" +
    (h.includes(":") ? h : h + ":2408") +
    "/?publickey=" +
    j +
    l +
    "&address=" +
    k +
    "&mtu=1280#YNS-WARP"
  );
}
function timingSafeStrEqual(c, f) {
  if (typeof c !== "string" || typeof f !== "string" || c.length !== f.length) {
    return false;
  }
  let g = 0;
  for (let h = 0; h < c.length; h++) {
    g |= c.charCodeAt(h) ^ f.charCodeAt(h);
  }
  return g === 0;
}
async function makeSessionToken(c, f, g, h = Date.now()) {
  const i = new TextEncoder();
  const j = await hmac(
    "SHA-256",
    i.encode(String(f)),
    i.encode(c + "|" + g + "|" + h),
  );
  const k = Array.from(j, (l) => l.toString(16).padStart(2, "0")).join("");
  return h + "." + k;
}
async function verifySessionToken(c, f, g, h, i = SESSION_MAX_AGE_MS) {
  if (!c || typeof c !== "string") {
    return false;
  }
  const j = c.indexOf(".");
  if (j <= 0) {
    return false;
  }
  const k = Number(c.slice(0, j));
  if (!Number.isFinite(k)) {
    return false;
  }
  const l = Date.now() - k;
  if (l > i || l < -60000) {
    return false;
  }
  const m = await makeSessionToken(f, g, h, k);
  return timingSafeStrEqual(c, m);
}
async function isAuthed(c, f, g, h) {
  const i = c.headers.get("Cookie") || "";
  const j = i
    .split(";")
    .find((k) => k.trim().startsWith("auth="))
    ?.split("=")[1];
  return await verifySessionToken(j, f, g, h);
}
function loginRateCheck(c) {
  const f = Date.now();
  const g = __loginAttempts.get(c);
  if (g && g.blockedUntil && f < g.blockedUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((g.blockedUntil - f) / 1000),
    };
  }
  return {
    allowed: true,
  };
}
function loginRecordFailure(c) {
  const f = Date.now();
  let g = __loginAttempts.get(c);
  if (!g || f - g.windowStart > LOGIN_WINDOW_MS) {
    g = {
      count: 0,
      windowStart: f,
      blockedUntil: 0,
    };
  }
  g.count++;
  if (g.count >= LOGIN_MAX_ATTEMPTS) {
    g.blockedUntil = f + LOGIN_BLOCK_MS;
  }
  __loginAttempts.set(c, g);
  if (__loginAttempts.size > 5000) {
    for (const [h, i] of __loginAttempts) {
      if (!i.blockedUntil || f > i.blockedUntil) {
        __loginAttempts.delete(h);
      }
      if (__loginAttempts.size <= 4000) {
        break;
      }
    }
  }
}
function loginRecordSuccess(c) {
  __loginAttempts.delete(c);
}
function randomBase32(c = 32) {
  const f = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const g = crypto.getRandomValues(new Uint8Array(c));
  let h = "";
  for (const i of g) {
    h += f[i % 32];
  }
  return h;
}
function base32Decode(f) {
  const g = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let h = "";
  const j = [];
  for (const k of String(f)
    .toUpperCase()
    .replace(/=+$/, "")
    .replace(/[^A-Z2-7]/g, "")) {
    h += g.indexOf(k).toString(2).padStart(5, "0");
  }
  for (let l = 0; l + 8 <= h.length; l += 8) {
    j.push(parseInt(h.slice(l, l + 8), 2));
  }
  return new Uint8Array(j);
}
async function totpAt(c, f) {
  const g = base32Decode(c);
  const h = new ArrayBuffer(8);
  const i = new DataView(h);
  i.setUint32(0, Math.floor(f / 4294967296));
  i.setUint32(4, f >>> 0);
  const j = await crypto.subtle.importKey(
    "raw",
    g,
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"],
  );
  const k = new Uint8Array(await crypto.subtle.sign("HMAC", j, h));
  const l = k[k.length - 1] & 15;
  const m =
    ((k[l] & 127) << 24) |
    ((k[l + 1] & 255) << 16) |
    ((k[l + 2] & 255) << 8) |
    (k[l + 3] & 255);
  return (m % 1000000).toString().padStart(6, "0");
}
async function totpVerify(c, f, g = 1) {
  f = String(f || "").trim();
  if (!/^\d{6}$/.test(f) || !c) {
    return false;
  }
  const h = Math.floor(Date.now() / 30000);
  for (let i = -g; i <= g; i++) {
    if ((await totpAt(c, h + i)) === f) {
      return true;
    }
  }
  return false;
}
async function getGitHubMirrorConfig(c) {
  let f = {};
  try {
    const i = c.KV && c.KV.get ? await getConfigRaw(c) : null;
    const j = i ? JSON.parse(i) : null;
    if (j && j.mirror) {
      f = j.mirror;
    }
  } catch (k) {}
  const g = (f.token || c.GH_TOKEN || c.GITHUB_TOKEN || "").trim();
  const h = (f.repo || c.GH_REPO || "")
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/^\/|\/$/g, "");
  return {
    token: g,
    repo: h,
    branch: (f.branch || c.GH_BRANCH || "main").trim(),
    pathPrefix: (f.pathPrefix || c.GH_PATH || "")
      .trim()
      .replace(/^\/|\/$/g, ""),
    enabled: f.enabled !== undefined ? !!f.enabled : !!g && !!h,
  };
}
function utf8ToBase64(c) {
  const f = new TextEncoder().encode(c);
  let g = "";
  const h = 32768;
  for (let j = 0; j < f.length; j += h) {
    g += String.fromCharCode.apply(null, f.subarray(j, j + h));
  }
  return btoa(g);
}
async function githubPutFile(c, f, g, h) {
  const i = f.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  const k = "https://api.github.com/repos/" + c.repo + "/contents/" + i;
  const l = {
    Authorization: "Bearer " + c.token,
    Accept: "application/vnd.github+json",
    "User-Agent": "yns-proxy-worker",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const m = utf8ToBase64(g);
  let n;
  try {
    const q = await fetch(k + "?ref=" + encodeURIComponent(c.branch), {
      headers: l,
    });
    if (q.ok) {
      const r = await q.json();
      n = r.sha;
      if (typeof r.content === "string" && r.content.replace(/\s/g, "") === m) {
        return {
          ok: true,
          status: 200,
          unchanged: true,
        };
      }
    }
  } catch (s) {}
  const o = JSON.stringify({
    message: h,
    content: m,
    branch: c.branch,
    ...(n
      ? {
          sha: n,
        }
      : {}),
  });
  const p = await fetch(k, {
    method: "PUT",
    headers: l,
    body: o,
  });
  return {
    ok: p.ok,
    status: p.status,
  };
}
async function publishSubMirror(c, g) {
  const h = await getGitHubMirrorConfig(c);
  if (!h.token || !h.repo) {
    return {
      skipped: true,
      reason:
        "set the GitHub repo + token in the dashboard (or GH_TOKEN/GH_REPO env)",
    };
  }
  if (!h.enabled) {
    return {
      skipped: true,
      reason: "mirror disabled",
    };
  }
  if (!g) {
    try {
      const o =
        c.KV && typeof c.KV.get === "function" ? await getConfigRaw(c) : null;
      const p = o ? JSON.parse(o) : null;
      const q = p && (p.HOST || (Array.isArray(p.HOSTS) && p.HOSTS[0]));
      if (q) {
        g =
          "https://" +
          String(q)
            .replace(/^https?:\/\//, "")
            .replace(/\/.*$/, "");
      }
    } catch (s) {}
  }
  if (!g) {
    return {
      skipped: true,
      reason: "no host configured (set HOST in the dashboard first)",
    };
  }
  const i = String(g)
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
  let j = c.UUID || c.uuid || null;
  if (!j && c.KV && typeof c.KV.get === "function") {
    try {
      j = await c.KV.get("worker_uuid");
    } catch (t) {}
  }
  if (!j) {
    return {
      skipped: true,
      reason:
        "worker UUID not initialized yet (open the panel once, then retry)",
    };
  }
  const k = await MD5MD5(i + String(j).toLowerCase());
  const l = [
    {
      name: "base64.txt",
      q: "b64",
    },
    {
      name: "mihomo.yaml",
      q: "clash",
    },
    {
      name: "singbox.json",
      q: "singbox",
    },
  ];
  const m = [];
  for (const u of l) {
    try {
      const v = new Request(g + "/sub?token=" + k + "&" + u.q, {
        headers: {
          "User-Agent": "YNSMirror/1.0",
        },
      });
      const w = await novaWorker.fetch(v, c, {
        waitUntil(A) {
          try {
            if (A && A.catch) {
              A.catch(() => {});
            }
          } catch (B) {}
        },
        passThroughOnException() {},
      });
      if (!w.ok) {
        m.push({
          file: u.name,
          ok: false,
          status: w.status,
          error:
            "sub fetch failed (HTTP " +
            w.status +
            "; on workers.dev the Worker cannot fetch its own domain — bind a custom domain)",
        });
        continue;
      }
      const x = await w.text();
      if (!x || x.length < 8 || /Welcome to nginx/i.test(x)) {
        m.push({
          file: u.name,
          ok: false,
          error:
            "sub returned the disguise page (token/host mismatch, or self-fetch blocked on workers.dev)",
        });
        continue;
      }
      const y = (h.pathPrefix ? h.pathPrefix + "/" : "") + u.name;
      const z = await githubPutFile(
        h,
        y,
        x,
        "YNS: update " + u.name + " (" + new Date().toISOString() + ")",
      );
      m.push({
        file: u.name,
        ...z,
      });
    } catch (A) {
      m.push({
        file: u.name,
        ok: false,
        error: A && A.message ? A.message : String(A),
      });
    }
  }
  const n =
    "https://raw.githubusercontent.com/" +
    h.repo +
    "/" +
    h.branch +
    "/" +
    (h.pathPrefix ? h.pathPrefix + "/" : "");
  return {
    skipped: false,
    repo: h.repo,
    branch: h.branch,
    rawLinks: l.map((B) => n + B.name),
    results: m,
  };
}
