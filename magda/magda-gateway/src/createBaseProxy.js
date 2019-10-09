"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpProxy = require("http-proxy");
function createBaseProxy() {
    const proxy = httpProxy.createProxyServer({
        prependUrl: false
    });
    proxy.on("error", function (err, req, res) {
        res.writeHead(500, {
            "Content-Type": "text/plain"
        });
        console.error(err);
        res.end("Something went wrong.");
    });
    proxy.on("proxyRes", function (proxyRes, req, res) {
        // Add a default cache time of 60 seconds on GETs so the CDN can cache in times of high load.
        if (req.method === "GET" &&
            !proxyRes.headers["Cache-Control"] &&
            !proxyRes.headers["cache-control"]) {
            proxyRes.headers["Cache-Control"] = "public, max-age=60";
        }
        /**
         * Remove security sensitive headers
         * `server` header is from scala APIs
         * Proxied content has to be filtered from here
         * while other content (produced locally by gateway) has been
         * taken care of by `app.disable("x-powered-by");` in index.js
         */
        Object.keys(proxyRes.headers).forEach(headerKey => {
            const headerKeyLowerCase = headerKey.toLowerCase();
            if (headerKeyLowerCase === "x-powered-by" ||
                headerKeyLowerCase === "server") {
                proxyRes.headers[headerKey] = undefined;
            }
        });
    });
    return proxy;
}
exports.default = createBaseProxy;
//# sourceMappingURL=createBaseProxy.js.map