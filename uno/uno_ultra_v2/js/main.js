const pageName = window.location.pathname.split("/").pop()?.toLowerCase() || "index.html";
const runtimeFile = pageName === "original.html" ? "../legacy/original-runtime.html" : "../legacy/index-runtime.html";
const runtimeUrl = new URL(runtimeFile, import.meta.url);

window.__UNO_ULTRA_PORT = {
  source: pageName,
  mode: "shell-iframe-host",
  bridge: "legacy-runtime-frame",
  runtime: runtimeUrl.pathname.split("/").pop(),
};

document.documentElement.dataset.unoUltraBridge = "legacy-runtime-frame";

const app = document.getElementById("app");
if (!app) {
  throw new Error("Missing #app host container");
}

const frame = document.createElement("iframe");
frame.id = "app-frame";
frame.className = "app-frame";
frame.src = runtimeUrl.href;
frame.title = "UNO Ultra Runtime";
frame.loading = "eager";
frame.allow = "autoplay";
frame.referrerPolicy = "no-referrer";

app.replaceChildren(frame);
