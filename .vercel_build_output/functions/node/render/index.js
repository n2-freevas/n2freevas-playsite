var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData2();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new File(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var import_node_worker_threads, s, S, f, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js"() {
    import_node_worker_threads = require("worker_threads");
    init_install_fetch();
    globalThis.DOMException || (() => {
      const port = new import_node_worker_threads.MessageChannel().port1;
      const ab = new ArrayBuffer(0);
      try {
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        return err.constructor;
      }
    })();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f = 1;
    F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base642 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base642 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base642 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0;
      while (position !== part.size) {
        const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function formDataToBlob(F2, B = Blob$1) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  const { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error2 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers2(headers.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request2(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dataUriToBuffer(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_node_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL, options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s3) => {
        let endedWithEventsCount;
        s3.prependListener("end", () => {
          endedWithEventsCount = s3._eventsCount;
        });
        s3.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s3._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              headers.set("Location", locationURL);
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers2(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve2(fetch2(new Request2(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), reject);
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), reject);
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), reject);
        raw.once("data", (chunk) => {
          body = (chunk[0] & 15) === 8 ? (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflate(), reject) : (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflateRaw(), reject);
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), reject);
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
function installFetch() {
  Object.defineProperties(globalThis, {
    fetch: {
      enumerable: true,
      configurable: true,
      value: fetch2
    },
    Response: {
      enumerable: true,
      configurable: true,
      value: Response2
    },
    Request: {
      enumerable: true,
      configurable: true,
      value: Request2
    },
    Headers: {
      enumerable: true,
      configurable: true,
      value: Headers2
    }
  });
}
var import_node_http, import_node_https, import_node_zlib, import_node_stream, import_node_util, import_node_url, import_net, commonjsGlobal, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _parts, _type, _size, _a, _Blob, Blob, Blob$1, _lastModified, _name, _a2, _File, File, t, i, h, r, m, f2, e, x, _d, _a3, FormData2, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, INTERNALS$2, Body, clone, getNonSpecFormDataBoundary, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers2, redirectStatus, isRedirect, INTERNALS$1, Response2, getSearch, ReferrerPolicy, DEFAULT_REFERRER_POLICY, INTERNALS, isRequest, Request2, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    import_node_http = __toESM(require("http"), 1);
    import_node_https = __toESM(require("https"), 1);
    import_node_zlib = __toESM(require("zlib"), 1);
    import_node_stream = __toESM(require("stream"), 1);
    import_node_util = require("util");
    import_node_url = require("url");
    import_net = require("net");
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop4() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop4;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals && globals.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F2, V, args) {
          if (typeof F2 !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F2, V, args);
        }
        function promiseCall(F2, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F2, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a4) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry21 = this._queue.shift();
              this._queueTotalSize -= entry21.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry21.buffer, entry21.byteOffset, entry21.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a4) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a4;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a4 = stream._writableStreamController._abortController) === null || _a4 === void 0 ? void 0 : _a4.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a4) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop4);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable3 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable3, "readable", "ReadableWritablePair");
          assertReadableStream(readable3, `${context} has member 'readable' that`);
          const writable3 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable3, "writable", "ReadableWritablePair");
          assertWritableStream(writable3, `${context} has member 'writable' that`);
          return { readable: readable3, writable: writable3 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop4);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable3 = stream._writable;
              const state = writable3._state;
              if (state === "erroring") {
                throw writable3._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable3 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable3._state === "errored") {
              throw readable3._storedError;
            }
            ReadableStreamDefaultControllerClose(readable3._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable3._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error2) {
          process2.emitWarning = emitWarning;
          throw error2;
        }
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob2 } = require("buffer");
      if (Blob2 && !Blob2.prototype.stream) {
        Blob2.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = (_a = class {
      constructor(blobParts = [], options = {}) {
        __privateAdd(this, _parts, []);
        __privateAdd(this, _type, "");
        __privateAdd(this, _size, 0);
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder2 = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof _a) {
            part = element;
          } else {
            part = encoder2.encode(element);
          }
          __privateSet(this, _size, __privateGet(this, _size) + (ArrayBuffer.isView(part) ? part.byteLength : part.size));
          __privateGet(this, _parts).push(part);
        }
        const type = options.type === void 0 ? "" : String(options.type);
        __privateSet(this, _type, /^[\x20-\x7E]*$/.test(type) ? type : "");
      }
      get size() {
        return __privateGet(this, _size);
      }
      get type() {
        return __privateGet(this, _type);
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(__privateGet(this, _parts), false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(__privateGet(this, _parts), false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(__privateGet(this, _parts), true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = __privateGet(this, _parts);
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new _a([], { type: String(type).toLowerCase() });
        __privateSet(blob, _size, span);
        __privateSet(blob, _parts, blobParts);
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    }, _parts = new WeakMap(), _type = new WeakMap(), _size = new WeakMap(), _a);
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob = _Blob;
    Blob$1 = Blob;
    _File = (_a2 = class extends Blob$1 {
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        __privateAdd(this, _lastModified, 0);
        __privateAdd(this, _name, "");
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          __privateSet(this, _lastModified, lastModified);
        }
        __privateSet(this, _name, String(fileName));
      }
      get name() {
        return __privateGet(this, _name);
      }
      get lastModified() {
        return __privateGet(this, _lastModified);
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
    }, _lastModified = new WeakMap(), _name = new WeakMap(), _a2);
    File = _File;
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f2 = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData2 = (_a3 = class {
      constructor(...a) {
        __privateAdd(this, _d, []);
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        __privateGet(this, _d).push(f2(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        __privateSet(this, _d, __privateGet(this, _d).filter(([b]) => b !== a));
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = __privateGet(this, _d), l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        __privateGet(this, _d).forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return __privateGet(this, _d).some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f2(...a);
        __privateGet(this, _d).forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        __privateSet(this, _d, b);
      }
      *entries() {
        yield* __privateGet(this, _d);
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    }, _d = new WeakMap(), _a3);
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_node_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_node_stream.default)
          ;
        else if (body instanceof FormData2) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = Buffer.from(String(body));
        }
        let stream = body;
        if (Buffer.isBuffer(body)) {
          stream = import_node_stream.default.Readable.from(body);
        } else if (isBlob(body)) {
          stream = import_node_stream.default.Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_node_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData2();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
        return toFormData2(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_node_stream.PassThrough({ highWaterMark });
        p2 = new import_node_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData2) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof import_node_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key2) => {
          result[key2] = this.getAll(key2);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key2) => {
          const values = this.getAll(key2);
          if (key2 === "host") {
            result[key2] = values[0];
          } else {
            result[key2] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    ReferrerPolicy = /* @__PURE__ */ new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentails.`);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_node_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
  }
});

// .svelte-kit/output/server/chunks/index-2e97bc70.js
function noop2() {
}
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function custom_event(type, detail, bubbles = false) {
  const e2 = document.createEvent("CustomEvent");
  e2.initCustomEvent(type, bubbles, false, detail);
  return e2;
}
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
}
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function each(items, fn) {
  let str = "";
  for (let i2 = 0; i2 < items.length; i2 += 1) {
    str += fn(items[i2], i2);
  }
  return str;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css38) => css38.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape_attribute_value(value.toString())}"`;
  return ` ${name}${assignment}`;
}
var identity, is_client, now, raf, tasks, current_component, escaped, missing_component, on_destroy;
var init_index_2e97bc70 = __esm({
  ".svelte-kit/output/server/chunks/index-2e97bc70.js"() {
    identity = (x2) => x2;
    is_client = typeof window !== "undefined";
    now = is_client ? () => window.performance.now() : () => Date.now();
    raf = is_client ? (cb) => requestAnimationFrame(cb) : noop2;
    tasks = /* @__PURE__ */ new Set();
    Promise.resolve();
    escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/hooks-1c45ba0b.js
var hooks_1c45ba0b_exports = {};
var init_hooks_1c45ba0b = __esm({
  ".svelte-kit/output/server/chunks/hooks-1c45ba0b.js"() {
  }
});

// .svelte-kit/output/server/entries/fallbacks/layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => Layout
});
var Layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/layout.svelte.js"() {
    init_index_2e97bc70();
    Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${slots.default ? slots.default({}) : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  css: () => css,
  entry: () => entry,
  js: () => js,
  module: () => layout_svelte_exports
});
var entry, js, css;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    init_layout_svelte();
    entry = "layout.svelte-cd1fb33f.js";
    js = ["layout.svelte-cd1fb33f.js", "chunks/index-7e81b4c7.js"];
    css = [];
  }
});

// .svelte-kit/output/server/entries/fallbacks/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2,
  load: () => load
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/error.svelte.js"() {
    init_index_2e97bc70();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  css: () => css2,
  entry: () => entry2,
  js: () => js2,
  module: () => error_svelte_exports
});
var entry2, js2, css2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    init_error_svelte();
    entry2 = "error.svelte-f699d84f.js";
    js2 = ["error.svelte-f699d84f.js", "chunks/index-7e81b4c7.js"];
    css2 = [];
  }
});

// .svelte-kit/output/server/chunks/index-96622166.js
function readable2(value, start) {
  return {
    subscribe: writable2(value, start).subscribe
  };
}
function writable2(value, start = noop2) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue2.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue2.length; i2 += 2) {
            subscriber_queue2[i2][0](subscriber_queue2[i2 + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var subscriber_queue2;
var init_index_96622166 = __esm({
  ".svelte-kit/output/server/chunks/index-96622166.js"() {
    init_index_2e97bc70();
    subscriber_queue2 = [];
  }
});

// .svelte-kit/output/server/chunks/MainMenu-48049949.js
var mainmenus;
var init_MainMenu_48049949 = __esm({
  ".svelte-kit/output/server/chunks/MainMenu-48049949.js"() {
    init_index_96622166();
    mainmenus = writable2([
      {
        name: "profile",
        path: "/introduce",
        img: "/img/profile_icon.svg",
        active: true,
        explain: "Taro Nonoyama\u306E<br>\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u8868\u793A\u3057\u307E\u3059\u3002",
        submenu: []
      },
      {
        name: "blog",
        path: "/blog/list",
        img: "/img/blog_icon.svg",
        active: false,
        explain: "\u30D6\u30ED\u30B0\u3092\u8868\u793A\u3057\u307E\u3059<br> (Powered by Notion API)",
        submenu: []
      },
      {
        name: "portfolio",
        path: "/portfolio",
        img: "/img/portfolio_icon.svg",
        active: false,
        explain: "\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u3092\u8868\u793A\u3057\u3001<br>\u30AF\u30EA\u30A8\u30A4\u30C6\u30A3\u30D6\u306E\u30D2\u30F3\u30C8\u3092\u63D0\u793A\u3057\u307E\u3059\u3002",
        submenu: []
      },
      {
        name: "app",
        path: "/app",
        img: "/img/app_icon.svg",
        active: true,
        explain: "\u5236\u4F5C\u3057\u305FWeb\u30A2\u30D7\u30EA\u306E<br>\u4E00\u89A7\u3092\u8868\u793A\u3057\u307E\u3059\u3002",
        submenu: [
          {
            name: "\u3070\u304F\u305C\u3064\u3055\u3042\u3061",
            path: "/app/bakuzetsu-searcher-2nd/home",
            img: "",
            explain: "",
            root: "app > \u3070\u304F\u305C\u3064\u3055\u3042\u3061 > ",
            submenu: []
          }
        ]
      },
      {
        name: "contact",
        path: "/contact",
        img: "/img/contacts_icon.svg",
        active: false,
        explain: "\u9023\u7D61\u5148\u30FBSNS\u30A2\u30AB\u30A6\u30F3\u30C8\u3092<br>\u8868\u793A\u3057\u307E\u3059\u3002",
        submenu: []
      },
      {
        name: "bonus",
        path: "/show",
        img: "/img/app_icon.svg",
        active: true,
        explain: "\u30AA\u30DE\u30B1",
        submenu: []
      }
    ]);
  }
});

// .svelte-kit/output/server/chunks/MediaQuery-021992e5.js
var MediaQuery;
var init_MediaQuery_021992e5 = __esm({
  ".svelte-kit/output/server/chunks/MediaQuery-021992e5.js"() {
    init_index_2e97bc70();
    MediaQuery = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { query } = $$props;
      let matches = false;
      if ($$props.query === void 0 && $$bindings.query && query !== void 0)
        $$bindings.query(query);
      return `${slots.default ? slots.default({ matches }) : ``}`;
    });
  }
});

// .svelte-kit/output/server/chunks/ToastArea-32d9fee1.js
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i2) => {
      return get_interpolator(a[i2], bi);
    });
    return (t2) => arr.map((fn) => fn(t2));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t2) => new Date(a + t2 * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key2) => {
      interpolators[key2] = get_interpolator(a[key2], b[key2]);
    });
    return (t2) => {
      const result = {};
      keys.forEach((key2) => {
        result[key2] = interpolators[key2](t2);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t2) => a + t2 * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults2 = {}) {
  const store = writable2(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults2), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
var defaults, createToast, toast, css$2, ToastItem, css$1, SvelteToast, css3, ToastArea;
var init_ToastArea_32d9fee1 = __esm({
  ".svelte-kit/output/server/chunks/ToastArea-32d9fee1.js"() {
    init_index_2e97bc70();
    init_index_96622166();
    defaults = {
      duration: 4e3,
      initial: 1,
      next: 0,
      pausable: false,
      dismissable: true,
      reversed: false,
      intro: { x: 256 },
      theme: {}
    };
    createToast = () => {
      const { subscribe: subscribe2, update } = writable2([]);
      let count = 0;
      const options = {};
      const _obj = (obj) => obj instanceof Object;
      const push = (msg, opts = {}) => {
        const param = __spreadValues({ target: "default" }, _obj(msg) ? msg : __spreadProps(__spreadValues({}, opts), { msg }));
        const conf = options[param.target] || {};
        const entry21 = __spreadProps(__spreadValues(__spreadValues(__spreadValues({}, defaults), conf), param), {
          theme: __spreadValues(__spreadValues({}, conf.theme), param.theme),
          id: ++count
        });
        update((n) => entry21.reversed ? [...n, entry21] : [entry21, ...n]);
        return count;
      };
      const pop = (id) => {
        update((n) => {
          if (!n.length || id === 0)
            return [];
          if (_obj(id))
            return n.filter((i2) => id(i2));
          const target = id || Math.max(...n.map((i2) => i2.id));
          return n.filter((i2) => i2.id !== target);
        });
      };
      const set = (id, opts = {}) => {
        const param = _obj(id) ? __spreadValues({}, id) : __spreadProps(__spreadValues({}, opts), { id });
        update((n) => {
          const idx = n.findIndex((i2) => i2.id === param.id);
          if (idx > -1) {
            n[idx] = __spreadValues(__spreadValues({}, n[idx]), param);
          }
          return n;
        });
      };
      const _init = (target = "default", opts = {}) => {
        options[target] = opts;
        return options;
      };
      return { subscribe: subscribe2, push, pop, set, _init };
    };
    toast = createToast();
    css$2 = {
      code: "._toastItem.svelte-j9nwjb{width:var(--toastWidth, 16rem);height:var(--toastHeight, auto);min-height:var(--toastMinHeight, 3.5rem);margin:var(--toastMargin, 0 0 0.5rem 0);padding:var(--toastPadding, 0);background:var(--toastBackground, rgba(66, 66, 66, 0.9));color:var(--toastColor, #fff);box-shadow:var(--toastBoxShadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));border:var(--toastBorder, none);border-radius:var(--toastBorderRadius, 0.125rem);position:relative;display:flex;flex-direction:row;align-items:center;overflow:hidden;will-change:transform, opacity;-webkit-tap-highlight-color:transparent}._toastMsg.svelte-j9nwjb{padding:var(--toastMsgPadding, 0.75rem 0.5rem);flex:1 1 0%}.pe.svelte-j9nwjb,._toastMsg.svelte-j9nwjb a{pointer-events:auto}._toastBtn.svelte-j9nwjb{width:2rem;height:100%;font:1rem sans-serif;display:flex;align-items:center;justify-content:center;cursor:pointer;outline:none}._toastBar.svelte-j9nwjb{top:var(--toastBarTop, auto);right:var(--toastBarRight, auto);bottom:var(--toastBarBottom, 0);left:var(--toastBarLeft, 0);height:var(--toastBarHeight, 6px);width:var(--toastBarWidth, 100%);position:absolute;display:block;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;background:transparent;pointer-events:none}._toastBar.svelte-j9nwjb::-webkit-progress-bar{background:transparent}._toastBar.svelte-j9nwjb::-webkit-progress-value{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}._toastBar.svelte-j9nwjb::-moz-progress-bar{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}",
      map: null
    };
    ToastItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $progress, $$unsubscribe_progress;
      let { item } = $$props;
      const progress = tweened(item.initial, { duration: item.duration, easing: identity });
      $$unsubscribe_progress = subscribe(progress, (value) => $progress = value);
      const close = () => toast.pop(item.id);
      const autoclose = () => {
        if ($progress === 1 || $progress === 0) {
          close();
        }
      };
      let next = item.initial;
      const getProps = () => {
        const { props = {}, sendIdTo } = item.component;
        if (sendIdTo) {
          props[sendIdTo] = item.id;
        }
        return props;
      };
      onDestroy(() => {
        if (typeof item.onpop === "function") {
          item.onpop(item.id);
        }
      });
      if ($$props.item === void 0 && $$bindings.item && item !== void 0)
        $$bindings.item(item);
      $$result.css.add(css$2);
      {
        if (typeof item.progress !== "undefined") {
          item.next = item.progress;
        }
      }
      {
        if (next !== item.next) {
          next = item.next;
          progress.set(next).then(autoclose);
        }
      }
      $$unsubscribe_progress();
      return `<div class="${["_toastItem svelte-j9nwjb", item.pausable ? "pe" : ""].join(" ").trim()}"><div role="${"status"}" class="${["_toastMsg svelte-j9nwjb", item.component ? "pe" : ""].join(" ").trim()}">${item.component ? `${validate_component(item.component.src || missing_component, "svelte:component").$$render($$result, Object.assign(getProps()), {}, {})}` : `<!-- HTML_TAG_START -->${item.msg}<!-- HTML_TAG_END -->`}</div>
  ${item.dismissable ? `<div class="${"_toastBtn pe svelte-j9nwjb"}" role="${"button"}" tabindex="${"-1"}">\u2715</div>` : ``}
  <progress class="${"_toastBar svelte-j9nwjb"}"${add_attribute("value", $progress, 0)}></progress></div>`;
    });
    css$1 = {
      code: "._toastContainer.svelte-7xr3c1{top:var(--toastContainerTop, 1.5rem);right:var(--toastContainerRight, 2rem);bottom:var(--toastContainerBottom, auto);left:var(--toastContainerLeft, auto);position:fixed;margin:0;padding:0;list-style-type:none;pointer-events:none;z-index:9999}",
      map: null
    };
    SvelteToast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $toast, $$unsubscribe_toast;
      $$unsubscribe_toast = subscribe(toast, (value) => $toast = value);
      let { options = {} } = $$props;
      let { target = "default" } = $$props;
      let items;
      const getCss = (theme) => Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, "");
      if ($$props.options === void 0 && $$bindings.options && options !== void 0)
        $$bindings.options(options);
      if ($$props.target === void 0 && $$bindings.target && target !== void 0)
        $$bindings.target(target);
      $$result.css.add(css$1);
      {
        toast._init(target, options);
      }
      items = $toast.filter((i2) => i2.target === target);
      $$unsubscribe_toast();
      return `<ul class="${"_toastContainer svelte-7xr3c1"}">${each(items, (item) => {
        return `<li${add_attribute("style", getCss(item.theme), 0)}>${validate_component(ToastItem, "ToastItem").$$render($$result, { item }, {}, {})}
    </li>`;
      })}</ul>`;
    });
    css3 = {
      code: ".toast_wrap.svelte-dznte4{--toastMsgPadding:10px 20px;font-size:0.85rem}.error_wrap.svelte-dznte4{--toastWidth:100%;--toastMaxWidth:500px;--toastMinHeight:1.5rem}",
      map: null
    };
    ToastArea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css3);
      return `<div class="${"toast_wrap svelte-dznte4"}">${validate_component(SvelteToast, "SvelteToast").$$render($$result, {}, {}, {})}</div>

<div class="${"toast_wrap error_wrap svelte-dznte4"}">${validate_component(SvelteToast, "SvelteToast").$$render($$result, { target: "error" }, {}, {})}
</div>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/__layout-root@default.svelte.js
var layout_root_default_svelte_exports = {};
__export(layout_root_default_svelte_exports, {
  default: () => _layout_root_default
});
var css$22, HeaderMenuBox, css$12, HambergerMenuBox, css4, _layout_root_default;
var init_layout_root_default_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/__layout-root@default.svelte.js"() {
    init_index_2e97bc70();
    init_MainMenu_48049949();
    init_MediaQuery_021992e5();
    init_ToastArea_32d9fee1();
    init_index_96622166();
    css$22 = {
      code: ".menu-box.svelte-fl8s9g.svelte-fl8s9g{position:relative;display:inline-block}.menu-box.svelte-fl8s9g .menu-name.svelte-fl8s9g{border-radius:20px;padding:5px 20px}.menu-box.svelte-fl8s9g .menu-name.svelte-fl8s9g:hover{background:white}.menu-box.svelte-fl8s9g .menu-name:hover p.svelte-fl8s9g{color:black}.menu-box.svelte-fl8s9g .explain-box.svelte-fl8s9g{z-index:100;position:absolute;margin-top:30px;right:0;opacity:0;background:linear-gradient(90deg, rgb(20, 20, 20), rgba(20, 20, 20, 0.5));padding:20px;display:flex;flex-direction:row;align-items:center;transition:0.2s}.menu-box.svelte-fl8s9g .explain-box.open.svelte-fl8s9g{opacity:1}.menu-box.svelte-fl8s9g .explain-box img.svelte-fl8s9g{width:50px}.menu-box.svelte-fl8s9g .explain-box p.svelte-fl8s9g{padding:20px;width:300px;color:white}",
      map: null
    };
    HeaderMenuBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { name } = $$props;
      let { path } = $$props;
      let { img } = $$props;
      let { explain } = $$props;
      if ($$props.name === void 0 && $$bindings.name && name !== void 0)
        $$bindings.name(name);
      if ($$props.path === void 0 && $$bindings.path && path !== void 0)
        $$bindings.path(path);
      if ($$props.img === void 0 && $$bindings.img && img !== void 0)
        $$bindings.img(img);
      if ($$props.explain === void 0 && $$bindings.explain && explain !== void 0)
        $$bindings.explain(explain);
      $$result.css.add(css$22);
      return `<div class="${"menu-box svelte-fl8s9g"}"><div class="${"menu-name svelte-fl8s9g"}"><a${add_attribute("href", path, 0)}><p class="${"svelte-fl8s9g"}">${escape(name)}</p></a></div>
    <div class="${"explain-box " + escape("") + " svelte-fl8s9g"}"><img${add_attribute("src", img, 0)} alt="${""}" class="${"svelte-fl8s9g"}">
        <p class="${"svelte-fl8s9g"}"><!-- HTML_TAG_START -->${explain}<!-- HTML_TAG_END --></p></div>
</div>`;
    });
    css$12 = {
      code: ".menu-box.svelte-13vu3ny.svelte-13vu3ny{padding:15px 10px;display:flex;height:100px;flex-direction:row}.menu-box.svelte-13vu3ny img.icon.svelte-13vu3ny{margin:0 10px;height:50px}.menu-box.svelte-13vu3ny img.arrow.svelte-13vu3ny{transform:rotate(-90deg);height:15px;margin:auto 0}.menu-box.svelte-13vu3ny .text.svelte-13vu3ny{padding:0 5px;width:230px}.menu-box.svelte-13vu3ny .text .name.svelte-13vu3ny{font-size:13px;margin:0 0 5px 0}.menu-box.svelte-13vu3ny .text .explain.svelte-13vu3ny{font-size:10px}",
      map: null
    };
    HambergerMenuBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { name } = $$props;
      let { path } = $$props;
      let { img } = $$props;
      let { explain } = $$props;
      if ($$props.name === void 0 && $$bindings.name && name !== void 0)
        $$bindings.name(name);
      if ($$props.path === void 0 && $$bindings.path && path !== void 0)
        $$bindings.path(path);
      if ($$props.img === void 0 && $$bindings.img && img !== void 0)
        $$bindings.img(img);
      if ($$props.explain === void 0 && $$bindings.explain && explain !== void 0)
        $$bindings.explain(explain);
      $$result.css.add(css$12);
      return `<a${add_attribute("href", path, 0)}><div class="${"menu-box svelte-13vu3ny"}"><img class="${"icon svelte-13vu3ny"}"${add_attribute("src", img, 0)} alt="${""}">
        <div class="${"text svelte-13vu3ny"}"><p class="${"name svelte-13vu3ny"}">${escape(name)}</p>
            <p class="${"explain svelte-13vu3ny"}"><!-- HTML_TAG_START -->${explain}<!-- HTML_TAG_END --></p></div>
        <img class="${"arrow svelte-13vu3ny"}" src="${"/img/arrow-osha.svg"}" alt="${">"}"></div>
</a>`;
    });
    css4 = {
      code: "header.svelte-16nqr66.svelte-16nqr66{background:black;display:flex;justify-content:space-between;align-items:center;height:60px}header.svelte-16nqr66 .n2-logo.svelte-16nqr66{padding:10px}header.svelte-16nqr66 .n2-logo img.svelte-16nqr66{height:30px}header.svelte-16nqr66 .menu-row-list.svelte-16nqr66{margin:0 20px}header.svelte-16nqr66 .hamburger-menu.svelte-16nqr66{position:relative;padding:10px}header.svelte-16nqr66 .hamburger-menu .hamburger-button .bar.svelte-16nqr66{display:block;background-color:#fff;height:4px;width:30px;border-radius:1px}header.svelte-16nqr66 .hamburger-menu .hamburger-button .bar1.svelte-16nqr66{transform:translateY(-6px);transition:transform 0.3s}header.svelte-16nqr66 .hamburger-menu .hamburger-button .bar3.svelte-16nqr66{transform:translateY(6px);transition:transform 0.3s}header.svelte-16nqr66 .hamburger-menu .hamburger-slider.svelte-16nqr66{position:fixed;z-index:100;width:300px;top:100px;right:-320px;background:linear-gradient(90deg, rgb(0, 0, 0), rgba(0, 0, 0, 0.8));transition:0.3s}header.svelte-16nqr66 .hamburger-menu .hamburger-slider.open.svelte-16nqr66{right:0}",
      map: null
    };
    _layout_root_default = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $mainmenus, $$unsubscribe_mainmenus;
      $$unsubscribe_mainmenus = subscribe(mainmenus, (value) => $mainmenus = value);
      $$result.css.add(css4);
      $$unsubscribe_mainmenus();
      return `<header class="${"svelte-16nqr66"}"><div class="${"n2-logo svelte-16nqr66"}"><a href="${"/"}"><img src="${"/img/n2-icon-white.svg"}" alt="${""}" class="${"svelte-16nqr66"}"></a></div>
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `<div class="${"menu-row-list svelte-16nqr66"}">${each($mainmenus, (menu) => {
            return `${validate_component(HeaderMenuBox, "HeaderMenuBox").$$render($$result, {
              name: menu.name,
              path: menu.path,
              img: menu.img,
              explain: menu.explain
            }, {}, {})}`;
          })}</div>` : ``}`;
        }
      })}
    
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `<div class="${"hamburger-menu svelte-16nqr66"}"><span class="${"hamburger-button"}"><span class="${"bar bar1 svelte-16nqr66"}"></span>
                <span class="${"bar bar2 svelte-16nqr66"}"></span>
                <span class="${"bar bar3 svelte-16nqr66"}"></span></span>
            <div class="${"hamburger-slider " + escape("") + " svelte-16nqr66"}">${each($mainmenus, (menu) => {
            return `${validate_component(HambergerMenuBox, "HambergerMenuBox").$$render($$result, {
              name: menu.name,
              path: menu.path,
              img: menu.img,
              explain: menu.explain
            }, {}, {})}`;
          })}</div></div>` : ``}`;
        }
      })}</header>

${slots.default ? slots.default({}) : ``}
${validate_component(ToastArea, "ToastArea").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  css: () => css5,
  entry: () => entry3,
  js: () => js3,
  module: () => layout_root_default_svelte_exports
});
var entry3, js3, css5;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    init_layout_root_default_svelte();
    entry3 = "pages/__layout-root@default.svelte-24e0a9c2.js";
    js3 = ["pages/__layout-root@default.svelte-24e0a9c2.js", "chunks/index-7e81b4c7.js", "chunks/MainMenu-804ce1a3.js", "chunks/index-c0f974cf.js", "chunks/MediaQuery-7add008a.js", "chunks/ToastArea-eba10419.js", "chunks/SvelteToast.svelte_svelte_type_style_lang-960f1691.js"];
    css5 = ["assets/pages/__layout-root@default.svelte-2d087689.css", "assets/ToastArea-00e911a5.css", "assets/SvelteToast.svelte_svelte_type_style_lang-00aa1808.css"];
  }
});

// .svelte-kit/output/server/entries/pages/app@root.svelte.js
var app_root_svelte_exports = {};
__export(app_root_svelte_exports, {
  default: () => App_root
});
var css6, App_root;
var init_app_root_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app@root.svelte.js"() {
    init_index_2e97bc70();
    css6 = {
      code: 'article.svelte-18s83uh.svelte-18s83uh{width:90vw;max-width:350px;margin:0 auto}article.svelte-18s83uh h1.svelte-18s83uh{margin:20px 0 10px 0}#phone-flame.svelte-18s83uh.svelte-18s83uh{padding:10px;border:solid 2px white;background:white;min-height:555px;border-radius:20px;position:relative}#phone-flame.svelte-18s83uh.svelte-18s83uh::before{content:"";position:absolute;background:white;--width:160px;left:calc(50% - var(--width) / 2);right:calc(50% - var(--width) / 2);height:25px;border-radius:0 0 20px 20px/0 0 15px 15px}#phone-flame.svelte-18s83uh.svelte-18s83uh::after{content:"";position:absolute;background:black;top:17px;--width:50px;left:calc(50% - var(--width) / 2);right:calc(50% - var(--width) / 2);height:10px;border-radius:5px}#phone-flame.svelte-18s83uh section.svelte-18s83uh{font-family:"Kosugi Maru", sans-serif;border:solid 2px white;padding:50px 20px 20px 20px;background:linear-gradient(135deg, black, black, rgba(0, 0, 0, 0.85));border-radius:10px;min-height:535px;display:flex;flex-wrap:wrap;grid-template-columns:repeat(auto-fill, 80px);justify-content:space-between}#phone-flame.svelte-18s83uh section .app-icon.svelte-18s83uh{display:flex;flex-direction:column;align-items:center;margin:0 0 45px 0;width:80px;height:80px}#phone-flame.svelte-18s83uh section .app-icon.active.svelte-18s83uh{border:solid 2px white;border-radius:20px}#phone-flame.svelte-18s83uh section .app-icon img.svelte-18s83uh{margin:0 auto;padding:10px;height:75px;cursor:pointer}#phone-flame.svelte-18s83uh section .app-icon .app-name.svelte-18s83uh{margin:10px 0 0 0;font-size:10px;text-align:center}',
      map: null
    };
    App_root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let apps = [
        {
          name: "\u3070\u304F\u305C\u3064\u3055\u3042\u3061",
          icon: "/img/bs2nd/ba_gray.svg",
          href: "/app/bakuzetsu-searcher-2nd/edit",
          description: "\u30B3\u30C8\u30C0\u30DE\u30F3\u3067\u697D\u3057\u3066\u52DD\u3061\u305F\u3044\u4EBA\u306B\u5411\u3051\u305F\u30C4\u30FC\u30EB"
        },
        {
          name: "Web\u30C0\u30E1\u30AB\u30F3",
          icon: "/img/pokeca/icon_white.svg",
          href: "/app/pokemon-card-game-effector/game",
          description: "\u30DD\u30B1\u30AB\u306E\u30C0\u30E1\u30AB\u30F3\u3092Web\u3067\u3084\u3063\u3061\u3083\u3046\u3002"
        },
        {
          name: "TCG\u30B7\u30DF\u30E5",
          icon: "/img/tcg-sim/card_naname.svg",
          href: "/app/tcg-simulator/game",
          description: "\u30C8\u30EC\u30FC\u30C7\u30A3\u30F3\u30B0\u30AB\u30FC\u30C9\u3092\u30A4\u30F3\u30DD\u30FC\u30C8\u3057\u3066\u30D7\u30EC\u30A4"
        },
        {
          name: "DM\u30C0\u30A6\u30F3\u30ED\u30FC\u30C0",
          icon: "/img/tcg-sim/card_naname.svg",
          href: "/app/DM-Downloader/collect",
          description: "\u30AB\u30FC\u30C9\u753B\u50CF\u3092\u53CE\u96C6"
        }
      ];
      $$result.css.add(css6);
      return `<article class="${"svelte-18s83uh"}"><h1 class="${"svelte-18s83uh"}">APP LIST</h1>
    <div id="${"phone-flame"}" class="${"svelte-18s83uh"}"><section class="${"svelte-18s83uh"}">${each(apps, (a) => {
        return `<div class="${"app-icon active svelte-18s83uh"}"><a${add_attribute("href", a.href, 0)}><img${add_attribute("src", a.icon, 0)} alt="${""}" class="${"svelte-18s83uh"}">
                    <div class="${"app-name svelte-18s83uh"}">${escape(a.name)}</div></a>
            </div>`;
      })}
        <div class="${"app-icon svelte-18s83uh"}"></div>
        <div class="${"app-icon svelte-18s83uh"}"></div>
        <div class="${"app-icon svelte-18s83uh"}"></div></section></div>
</article>`;
    });
  }
});

// .svelte-kit/output/server/nodes/13.js
var __exports4 = {};
__export(__exports4, {
  css: () => css7,
  entry: () => entry4,
  js: () => js4,
  module: () => app_root_svelte_exports
});
var entry4, js4, css7;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/13.js"() {
    init_app_root_svelte();
    entry4 = "pages/app@root.svelte-1cd0b096.js";
    js4 = ["pages/app@root.svelte-1cd0b096.js", "chunks/index-7e81b4c7.js"];
    css7 = ["assets/pages/app@root.svelte-a39030f5.css"];
  }
});

// .svelte-kit/output/server/entries/pages/contact@root.svelte.js
var contact_root_svelte_exports = {};
__export(contact_root_svelte_exports, {
  default: () => Contact_root
});
var css8, Contact_root;
var init_contact_root_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/contact@root.svelte.js"() {
    init_index_2e97bc70();
    css8 = {
      code: "article.svelte-11yu7j3{width:90%;max-width:700px;margin:0 auto}",
      map: null
    };
    Contact_root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css8);
      return `<article class="${"svelte-11yu7j3"}">

</article>`;
    });
  }
});

// .svelte-kit/output/server/nodes/16.js
var __exports5 = {};
__export(__exports5, {
  css: () => css9,
  entry: () => entry5,
  js: () => js5,
  module: () => contact_root_svelte_exports
});
var entry5, js5, css9;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/16.js"() {
    init_contact_root_svelte();
    entry5 = "pages/contact@root.svelte-bce1ac95.js";
    js5 = ["pages/contact@root.svelte-bce1ac95.js", "chunks/index-7e81b4c7.js"];
    css9 = ["assets/pages/contact@root.svelte-58dee529.css"];
  }
});

// .svelte-kit/output/server/entries/pages/index@root.svelte.js
var index_root_svelte_exports = {};
__export(index_root_svelte_exports, {
  default: () => Index_root
});
var css$23, HomeButton, css$13, N2Clock, css10, Index_root;
var init_index_root_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/index@root.svelte.js"() {
    init_index_2e97bc70();
    init_MainMenu_48049949();
    init_MediaQuery_021992e5();
    init_index_96622166();
    css$23 = {
      code: ".homebutton-box.svelte-1mc03rw.svelte-1mc03rw{position:relative;width:100px;height:100px;background:white;border-radius:15px;margin:15px;transition:0.5s}.homebutton-box.focus.svelte-1mc03rw.svelte-1mc03rw{border-radius:0px}.homebutton-box.disactive.svelte-1mc03rw.svelte-1mc03rw{background:rgba(255, 255, 255, 0.3)}.homebutton-box.disactive.svelte-1mc03rw img.svelte-1mc03rw,.homebutton-box.disactive.svelte-1mc03rw h1.svelte-1mc03rw{opacity:0.3}.homebutton-box.svelte-1mc03rw .icons.svelte-1mc03rw{position:absolute;display:flex;flex-direction:column;justify-content:space-around;--topval:10px;top:var(--topval);left:var(--topval);width:calc(100% - var(--topval) * 2);height:calc(100% - var(--topval) * 2)}.homebutton-box.svelte-1mc03rw .icons img.svelte-1mc03rw{height:60%;margin:0 auto}.homebutton-box.svelte-1mc03rw .icons h1.svelte-1mc03rw{text-align:center;font-size:14px;color:white}.homebutton-box.svelte-1mc03rw .homebutton_background.svelte-1mc03rw{position:absolute;--positioning:5px;top:var(--positioning);left:var(--positioning);width:calc(100% - var(--positioning) * 2);height:calc(100% - var(--positioning) * 2);background:black;border-radius:25px;transition:0.5s}.homebutton-box.svelte-1mc03rw .homebutton_background.focus.svelte-1mc03rw{transform:rotate(45deg);background:red;border-radius:0px}.homebutton-box.svelte-1mc03rw .hover_area.svelte-1mc03rw{position:absolute;top:0;left:0;width:100%;height:100%}.homebutton-box.svelte-1mc03rw p.svelte-1mc03rw{position:absolute;top:35px;left:-5px;font-weight:bold;opacity:1;width:120px;z-index:100;color:white}",
      map: null
    };
    HomeButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { model } = $$props;
      if ($$props.model === void 0 && $$bindings.model && model !== void 0)
        $$bindings.model(model);
      $$result.css.add(css$23);
      return `<div class="${"homebutton-box " + escape("") + " " + escape(model.active ? "" : "disactive") + " svelte-1mc03rw"}"><a${add_attribute("href", model.active ? model.path : "", 0)}><div class="${"homebutton_background " + escape("") + " svelte-1mc03rw"}"></div>
        <div class="${"icons svelte-1mc03rw"}"><img${add_attribute("src", model.img, 0)} alt="${escape(model.explain) + "\u30DC\u30BF\u30F3"}" class="${"svelte-1mc03rw"}">
            <h1 class="${"svelte-1mc03rw"}">${escape(model.name)}</h1></div>
        <div class="${"hover_area svelte-1mc03rw"}"></div></a>
    ${!model.active ? `<p class="${"svelte-1mc03rw"}">comming soon</p>` : ``}
</div>`;
    });
    css$13 = {
      code: "#bg_clock.svelte-gfjuk8.svelte-gfjuk8{position:absolute;overflow:hidden;height:100%;width:100%;top:0;left:0;z-index:-1}#bg_clock.svelte-gfjuk8 #clockbody.svelte-gfjuk8{position:absolute;top:40vh;left:25vw;width:120vw;height:120vw;-webkit-animation:svelte-gfjuk8-clockrotate 60s cubic-bezier(1, 0, 0.95, 0.38) infinite;animation:svelte-gfjuk8-clockrotate 60s cubic-bezier(1, 0, 0.95, 0.38) infinite;transition:1s}@keyframes svelte-gfjuk8-clockslide{0%{left:25vw;transform:rotate(0deg)}100%{left:-200%;transform:rotate(-270deg)}}@-webkit-keyframes svelte-gfjuk8-clockslide{0%{left:25vw;-webkit-transform:rotate(0deg)}100%{left:-200%;-webkit-transform:rotate(-270deg)}}#bg_clock.svelte-gfjuk8 #clockbody img.svelte-gfjuk8{width:100%}@keyframes svelte-gfjuk8-clockrotate{0%{transform:rotate(0deg)}2%{transform:rotate(7deg)}4%{transform:rotate(14deg)}6%{transform:rotate(21deg)}8%{transform:rotate(28deg)}10%{transform:rotate(36deg)}12%{transform:rotate(43deg)}14%{transform:rotate(50deg)}16%{transform:rotate(57deg)}18%{transform:rotate(64deg)}20%{transform:rotate(72deg)}22%{transform:rotate(79deg)}24%{transform:rotate(86deg)}26%{transform:rotate(93deg)}28%{transform:rotate(100deg)}30%{transform:rotate(108deg)}32%{transform:rotate(115deg)}34%{transform:rotate(122deg)}36%{transform:rotate(129deg)}38%{transform:rotate(136deg)}40%{transform:rotate(144deg)}42%{transform:rotate(151deg)}44%{transform:rotate(158deg)}46%{transform:rotate(165deg)}48%{transform:rotate(172deg)}50%{transform:rotate(180deg)}52%{transform:rotate(187deg)}54%{transform:rotate(194deg)}56%{transform:rotate(201deg)}58%{transform:rotate(208deg)}60%{transform:rotate(216deg)}62%{transform:rotate(223deg)}64%{transform:rotate(230deg)}66%{transform:rotate(237deg)}68%{transform:rotate(244deg)}70%{transform:rotate(252deg)}72%{transform:rotate(259deg)}74%{transform:rotate(266deg)}76%{transform:rotate(273deg)}78%{transform:rotate(280deg)}80%{transform:rotate(288deg)}82%{transform:rotate(295deg)}84%{transform:rotate(302deg)}86%{transform:rotate(309deg)}88%{transform:rotate(316deg)}90%{transform:rotate(324deg)}92%{transform:rotate(331deg)}94%{transform:rotate(338deg)}96%{transform:rotate(345deg)}98%{transform:rotate(352deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes svelte-gfjuk8-clockrotate{0%{-webkit-transform:rotate(0deg)}2%{-webkit-transform:rotate(7deg)}4%{-webkit-transform:rotate(14deg)}6%{-webkit-transform:rotate(21deg)}8%{-webkit-transform:rotate(28deg)}10%{-webkit-transform:rotate(36deg)}12%{-webkit-transform:rotate(43deg)}14%{-webkit-transform:rotate(50deg)}16%{-webkit-transform:rotate(57deg)}18%{-webkit-transform:rotate(64deg)}20%{-webkit-transform:rotate(72deg)}22%{-webkit-transform:rotate(79deg)}24%{-webkit-transform:rotate(86deg)}26%{-webkit-transform:rotate(93deg)}28%{-webkit-transform:rotate(100deg)}30%{-webkit-transform:rotate(108deg)}32%{-webkit-transform:rotate(115deg)}34%{-webkit-transform:rotate(122deg)}36%{-webkit-transform:rotate(129deg)}38%{-webkit-transform:rotate(136deg)}40%{-webkit-transform:rotate(144deg)}42%{-webkit-transform:rotate(151deg)}44%{-webkit-transform:rotate(158deg)}46%{-webkit-transform:rotate(165deg)}48%{-webkit-transform:rotate(172deg)}50%{-webkit-transform:rotate(180deg)}52%{-webkit-transform:rotate(187deg)}54%{-webkit-transform:rotate(194deg)}56%{-webkit-transform:rotate(201deg)}58%{-webkit-transform:rotate(208deg)}60%{-webkit-transform:rotate(216deg)}62%{-webkit-transform:rotate(223deg)}64%{-webkit-transform:rotate(230deg)}66%{-webkit-transform:rotate(237deg)}68%{-webkit-transform:rotate(244deg)}70%{-webkit-transform:rotate(252deg)}72%{-webkit-transform:rotate(259deg)}74%{-webkit-transform:rotate(266deg)}76%{-webkit-transform:rotate(273deg)}78%{-webkit-transform:rotate(280deg)}80%{-webkit-transform:rotate(288deg)}82%{-webkit-transform:rotate(295deg)}84%{-webkit-transform:rotate(302deg)}86%{-webkit-transform:rotate(309deg)}88%{-webkit-transform:rotate(316deg)}90%{-webkit-transform:rotate(324deg)}92%{-webkit-transform:rotate(331deg)}94%{-webkit-transform:rotate(338deg)}96%{-webkit-transform:rotate(345deg)}98%{-webkit-transform:rotate(352deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes svelte-gfjuk8-clockspin{0%{transform:rotate(0deg)}100%{transform:rotate(720deg)}}@-webkit-keyframes svelte-gfjuk8-clockspin{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(720deg)}}#bg_clock.svelte-gfjuk8 #clockbody img.time.svelte-gfjuk8{position:absolute;width:10%;animation:svelte-gfjuk8-wheelrotate 10s linear infinite;-webkit-animation:svelte-gfjuk8-wheelrotate 10s linear infinite}#bg_clock.svelte-gfjuk8 #clockbody img#insidewheel.svelte-gfjuk8{position:absolute;width:25%;animation:svelte-gfjuk8-wheelrotate 10s linear infinite reverse;-webkit-animation:svelte-gfjuk8-wheelrotate 10s linear infinite reverse;top:37.5%;left:37.5%}.time-3.svelte-gfjuk8.svelte-gfjuk8{top:45%;left:63.5%}.time-2.svelte-gfjuk8.svelte-gfjuk8{top:35.75%;left:61.021%}.time-1.svelte-gfjuk8.svelte-gfjuk8{top:28.979%;left:54.25%}.time-12.svelte-gfjuk8.svelte-gfjuk8{top:26.5%;left:45%}.time-11.svelte-gfjuk8.svelte-gfjuk8{top:28.979%;left:35.75%}.time-10.svelte-gfjuk8.svelte-gfjuk8{top:35.75%;left:28.979%}.time-9.svelte-gfjuk8.svelte-gfjuk8{top:45%;left:26.5%}.time-8.svelte-gfjuk8.svelte-gfjuk8{top:54.25%;left:28.979%}.time-7.svelte-gfjuk8.svelte-gfjuk8{top:61.021%;left:35.75%}.time-6.svelte-gfjuk8.svelte-gfjuk8{top:63.5%;left:45%}.time-5.svelte-gfjuk8.svelte-gfjuk8{top:61.021%;left:54.25%}.time-4.svelte-gfjuk8.svelte-gfjuk8{top:54.25%;left:61.021%}#bg_clock.svelte-gfjuk8 #clockbody img.time-2.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-4.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-6.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-8.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-10.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-12.svelte-gfjuk8{animation-direction:reverse;-webkit-animation-direction:reverse}@keyframes svelte-gfjuk8-wheelrotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes svelte-gfjuk8-wheelrotate{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@media screen and (min-width: 600px){}@media screen and (min-width: 700px){#bg_clock.svelte-gfjuk8 #clockbody.svelte-gfjuk8{top:35vh;left:50vw;height:850px;width:850px}#bg_clock.svelte-gfjuk8 #clockbody img.svelte-gfjuk8{width:850px}#bg_clock.svelte-gfjuk8 img.time.svelte-gfjuk8{width:85px}}",
      map: null
    };
    N2Clock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$13);
      return `<div id="${"bg_clock"}" class="${"svelte-gfjuk8"}"><div id="${"clockbody"}" class="${"svelte-gfjuk8"}">
        <img class="${"time time-1 svelte-gfjuk8"}" src="${"/img/n2_clock/time-1.svg"}" alt="${""}">\u3000
        <img class="${"time time-2 svelte-gfjuk8"}" src="${"/img/n2_clock/time-2.svg"}" alt="${""}">
        <img class="${"time time-3 svelte-gfjuk8"}" src="${"/img/n2_clock/time-3.svg"}" alt="${""}">
        <img class="${"time time-4 svelte-gfjuk8"}" src="${"/img/n2_clock/time-4.svg"}" alt="${""}">
        <img class="${"time time-5 svelte-gfjuk8"}" src="${"/img/n2_clock/time-5.svg"}" alt="${""}">
        <img class="${"time time-6 svelte-gfjuk8"}" src="${"/img/n2_clock/time-6.svg"}" alt="${""}">
        <img class="${"time time-7 svelte-gfjuk8"}" src="${"/img/n2_clock/time-7.svg"}" alt="${""}">
        <img class="${"time time-8 svelte-gfjuk8"}" src="${"/img/n2_clock/time-8.svg"}" alt="${""}">
        <img class="${"time time-9 svelte-gfjuk8"}" src="${"/img/n2_clock/time-9.svg"}" alt="${""}">
        <img class="${"time time-10 svelte-gfjuk8"}" src="${"/img/n2_clock/time-10.svg"}" alt="${""}">
        <img class="${"time time-11 svelte-gfjuk8"}" src="${"/img/n2_clock/time-11.svg"}" alt="${""}">
        <img class="${"time time-12 svelte-gfjuk8"}" src="${"/img/n2_clock/time-12.svg"}" alt="${""}">
        <img id="${"insidewheel"}" src="${"/img/n2_clock/clock_insidewheel.svg"}" alt="${""}" class="${"svelte-gfjuk8"}">
        <img src="${"/img/n2_clock/clock_body.svg"}" alt="${""}" class="${"svelte-gfjuk8"}"></div>    
</div>`;
    });
    css10 = {
      code: "#menu_box.svelte-9tmjw9{max-height:700px;max-width:500px;margin:0 auto}.icon_box.svelte-9tmjw9{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around;border:solid 1px white;max-width:400px;padding:20px 10px;margin:100px 30px}",
      map: null
    };
    Index_root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $mainmenus, $$unsubscribe_mainmenus;
      $$unsubscribe_mainmenus = subscribe(mainmenus, (value) => $mainmenus = value);
      let mainmenu_array = $mainmenus;
      $$result.css.add(css10);
      $$unsubscribe_mainmenus();
      return `<div id="${"menu_box"}" class="${"svelte-9tmjw9"}">${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `<div class="${"icon_box svelte-9tmjw9"}">${each(mainmenu_array, (menu) => {
            return `${validate_component(HomeButton, "HomeButton").$$render($$result, { model: menu }, {}, {})}`;
          })}</div>` : ``}`;
        }
      })}
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `<div class="${"icon_box svelte-9tmjw9"}">${each(mainmenu_array, (menu) => {
            return `${validate_component(HomeButton, "HomeButton").$$render($$result, { model: menu }, {}, {})}`;
          })}</div>` : ``}`;
        }
      })}
    ${validate_component(N2Clock, "N2Clock").$$render($$result, {}, {}, {})}</div>

${slots.default ? slots.default({}) : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/17.js
var __exports6 = {};
__export(__exports6, {
  css: () => css11,
  entry: () => entry6,
  js: () => js6,
  module: () => index_root_svelte_exports
});
var entry6, js6, css11;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/17.js"() {
    init_index_root_svelte();
    entry6 = "pages/index@root.svelte-d51e67c8.js";
    js6 = ["pages/index@root.svelte-d51e67c8.js", "chunks/index-7e81b4c7.js", "chunks/MainMenu-804ce1a3.js", "chunks/index-c0f974cf.js", "chunks/MediaQuery-7add008a.js"];
    css11 = ["assets/pages/index@root.svelte-218c4e0b.css"];
  }
});

// .svelte-kit/output/server/entries/pages/introduce/index.svelte.js
var index_svelte_exports = {};
__export(index_svelte_exports, {
  default: () => Introduce
});
var css12, myname, mySex, myBloodType, Introduce;
var init_index_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/introduce/index.svelte.js"() {
    init_index_2e97bc70();
    css12 = {
      code: "#introduce-box.svelte-muuo5r.svelte-muuo5r{position:relative;width:80%;max-width:700px;margin:30px auto 0 auto;height:700px}#introduce-box.svelte-muuo5r #introduce-text.svelte-muuo5r{padding:30px}#introduce-box.svelte-muuo5r #introduce-text div.svelte-muuo5r{margin:5px}#introduce-box.svelte-muuo5r #introduce-text h1.svelte-muuo5r{margin:10px 0}#introduce-box.svelte-muuo5r #introduce-text .job.svelte-muuo5r{margin:10px 5px;font-size:16px}#introduce-box.svelte-muuo5r #introduce-text .birthday .birthday-count.svelte-muuo5r{display:inline;font-size:13px}#introduce-box.svelte-muuo5r .image.svelte-muuo5r{z-index:-1;position:absolute;filter:blur(2px);background-image:var(--url);background-position:center;width:100%;height:100%}",
      map: null
    };
    myname = "Making";
    mySex = "Male";
    myBloodType = "A Rh+";
    Introduce = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let myAgeYear = 0;
      let myAgeDay = 0;
      let myAgeHour = 0;
      let myAgeMinutes = 0;
      let myAgeSecond = 0;
      const myJob = ["Engineer", "Designer", "Artist"];
      const backgroundIllust = [
        "https://lh3.googleusercontent.com/bcvBUbA1fI0nUqannPAJxes6L1JmFm4VdhfjCwq6fkvqgoBHlGoVJhMk-L20s5zscQZe8FO9d3x4u757Gk35od1rhy8wbOlOEHDt0GULdy7Af2oI_TMadzt4mohs-okGaJoaYaxq27I9HXPCNyoO_cv5nSEM2WlUNF_KKNMW-Hv-0RJkpREnBwzn-HPzuP9lXk5VVIhIcNEwspqsh4n_byo-SlBOOnDX6YDSI_iPzQOftJTfIoZupSXt7yT0eTX4X3G4iU7l0oJd72Mm72_4xAgAw9Ogoyy2wOx_f9TY3hLZWqO1n94DOM0GxWtE-YbfX_LxLRbAzbIUk4IGhl0eNUNfY-w-zg6DjNe0EgQ0MlgBbQH7GDUa-0va2ppQwNTdU_nJIlBBlFa5MCEaBrc3WJZuN1uC7Od7bgY2w3l9_zTajyvYMDRK40k0jlJjqUov2v5QmbAOwVap49VF1bNQrqZsKN-KaCuVeBZHOsA33U28f7qE5Pw2V1g0nUvcYGjBgSyIjX0d-4abQnpNO_AAP5mKUhiMHPAxc1SJne8b_AQMPQNk0qAdO_-I68Eb1nN2LdKyk2Ca4YWqGb2OTQyyewAaxnYhPY9tTXCMxU18r2NVuJWDmrzXaNab3s_rjdMwn1zW5sxrJEpqFu2Av7wPWQ5PRbbPBZVVid_jh8slBbZLULwQ7qLRbn3L-opMCJzUq748fEL2GXe1wWK1G87Fw_I=s700-no"
      ];
      $$result.css.add(css12);
      return `<section id="${"introduce-box"}" class="${"svelte-muuo5r"}"><div class="${"image svelte-muuo5r"}" style="${"--url:url(" + escape(backgroundIllust[0]) + ")"}"></div>
    <div id="${"introduce-text"}" class="${"svelte-muuo5r"}"><h1 class="${"svelte-muuo5r"}"><!-- HTML_TAG_START -->${myname}<!-- HTML_TAG_END --></h1>
        <div class="${"job svelte-muuo5r"}">${escape(myJob.join(", "))}</div>
        <div class="${"birthday svelte-muuo5r"}">${escape(`Age ${myAgeYear}`)}
            <div class="${"birthday-count svelte-muuo5r"}">${escape(`( ${myAgeDay}d ${myAgeHour}h ${myAgeMinutes}m ${myAgeSecond}s )`)}</div></div>
        <div class="${"svelte-muuo5r"}">${escape(mySex)}</div>
        <div class="${"svelte-muuo5r"}">${escape(myBloodType)}</div></div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/nodes/18.js
var __exports7 = {};
__export(__exports7, {
  css: () => css13,
  entry: () => entry7,
  js: () => js7,
  module: () => index_svelte_exports
});
var entry7, js7, css13;
var init__7 = __esm({
  ".svelte-kit/output/server/nodes/18.js"() {
    init_index_svelte();
    entry7 = "pages/introduce/index.svelte-8d83ec0f.js";
    js7 = ["pages/introduce/index.svelte-8d83ec0f.js", "chunks/index-7e81b4c7.js"];
    css13 = ["assets/pages/introduce/index.svelte-627fe975.css"];
  }
});

// .svelte-kit/output/server/chunks/bs2ndLoader-cf0653eb.js
var css14, Bs2ndLoader;
var init_bs2ndLoader_cf0653eb = __esm({
  ".svelte-kit/output/server/chunks/bs2ndLoader-cf0653eb.js"() {
    init_index_2e97bc70();
    css14 = {
      code: ".loader.svelte-v9q609.svelte-v9q609{width:100%;height:100%}.loader.svelte-v9q609 .kotodama-box.svelte-v9q609{--size:30px;display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap;align-items:center;max-width:150px;height:100%;margin:0 auto}.loader.svelte-v9q609 .kotodama-box .kotodama.svelte-v9q609{position:relative;width:var(--size);height:var(--size);margin:3px}.loader.svelte-v9q609 .kotodama-box .kotodama img.svelte-v9q609{position:absolute;bottom:0;left:0;width:var(--size);height:var(--size);animation:svelte-v9q609-popinkotodama linear 1.3s var(--delay) infinite}@keyframes svelte-v9q609-popinkotodama{0%{bottom:0}20%{bottom:var(--size)}40%{bottom:0;height:var(--size)}43%{bottom:0;height:calc(var(--size) / 3)}46%{bottom:0;height:var(--size)}}",
      map: null
    };
    Bs2ndLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { popindelay = 0.15 } = $$props;
      if ($$props.popindelay === void 0 && $$bindings.popindelay && popindelay !== void 0)
        $$bindings.popindelay(popindelay);
      $$result.css.add(css14);
      return `<div class="${"loader svelte-v9q609"}"><div class="${"kotodama-box svelte-v9q609"}"><div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay}s`) + ";"}" src="${"/img/bs2nd/ba_gray.png"}" alt="${"\u3070"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 2}s`) + ";"}" src="${"/img/bs2nd/ku_gray.png"}" alt="${"\u304F"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 3}s`) + ";"}" src="${"/img/bs2nd/ze_gray.png"}" alt="${"\u305C"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 4}s`) + ";"}" src="${"/img/bs2nd/tsu_gray.png"}" alt="${"\u3064"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 5}s`) + ";"}" src="${"/img/bs2nd/sa_gray.png"}" alt="${"\u3055"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 6}s`) + ";"}" src="${"/img/bs2nd/a_gray.png"}" alt="${"\u3042"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 7}s`) + ";"}" src="${"/img/bs2nd/chi_gray.png"}" alt="${"\u3061"}" class="${"svelte-v9q609"}"></div></div>
</div>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/show/index.svelte.js
var index_svelte_exports2 = {};
__export(index_svelte_exports2, {
  default: () => Show
});
var css$5, PendulumLoader, css$4, RectWaveLoader, css$3, RoundFloweringLoader, css$24, Show_item, css$14, DotStringLoader, css15, Show;
var init_index_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/show/index.svelte.js"() {
    init_index_2e97bc70();
    init_bs2ndLoader_cf0653eb();
    init_MediaQuery_021992e5();
    css$5 = {
      code: ".loader.svelte-w1xkbb.svelte-w1xkbb{position:relative;width:100%;height:var(--loader-height)}.loader.svelte-w1xkbb .fulcrum.svelte-w1xkbb{position:absolute;left:50%;height:100%}.loader.svelte-w1xkbb .fulcrum .wire.svelte-w1xkbb{position:absolute;height:var(--wire_length_px);border:solid 1px var(--color);transform-origin:top}.loader.svelte-w1xkbb .fulcrum .wire.animate.svelte-w1xkbb{-webkit-animation:svelte-w1xkbb-penduluming ease-in-out var(--periodic_time_sec) infinite;animation:svelte-w1xkbb-penduluming ease-in-out var(--periodic_time_sec) infinite}.loader.svelte-w1xkbb .fulcrum .wire .weight.svelte-w1xkbb{position:absolute;bottom:calc(-1 * var(--weight_size_px) / 2);left:calc(-1 * var(--weight_size_px) / 2);width:var(--weight_size_px);height:var(--weight_size_px);border-radius:calc(var(--weight_size_px) / 2);background:var(--color)}@keyframes svelte-w1xkbb-penduluming{0%{transform:rotate(30deg)}50%{transform:rotate(-30deg)}100%{transform:rotate(30deg)}}",
      map: null
    };
    PendulumLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { numof_pendulum = 16 } = $$props;
      let { initial_length = 25 } = $$props;
      let { increase_length = 12 } = $$props;
      let { initial_size = 10 } = $$props;
      let { increase_size = 0 } = $$props;
      let { initial_frequency = 30 } = $$props;
      let { decrease_frequency = 1 } = $$props;
      let { color = "white" } = $$props;
      let { is_animate = true } = $$props;
      let pendulums_args = [];
      for (let i2 = 0; i2 < numof_pendulum; i2++) {
        let wire_length = initial_length + i2 * increase_length;
        let periodic_time = 60 / (initial_frequency - decrease_frequency * i2);
        pendulums_args.push({
          wire_length: `${wire_length.toString()}px`,
          weight_size: `${(initial_size + i2 * increase_size).toString()}px`,
          periodic_time: `${periodic_time.toString()}s`
        });
      }
      if ($$props.numof_pendulum === void 0 && $$bindings.numof_pendulum && numof_pendulum !== void 0)
        $$bindings.numof_pendulum(numof_pendulum);
      if ($$props.initial_length === void 0 && $$bindings.initial_length && initial_length !== void 0)
        $$bindings.initial_length(initial_length);
      if ($$props.increase_length === void 0 && $$bindings.increase_length && increase_length !== void 0)
        $$bindings.increase_length(increase_length);
      if ($$props.initial_size === void 0 && $$bindings.initial_size && initial_size !== void 0)
        $$bindings.initial_size(initial_size);
      if ($$props.increase_size === void 0 && $$bindings.increase_size && increase_size !== void 0)
        $$bindings.increase_size(increase_size);
      if ($$props.initial_frequency === void 0 && $$bindings.initial_frequency && initial_frequency !== void 0)
        $$bindings.initial_frequency(initial_frequency);
      if ($$props.decrease_frequency === void 0 && $$bindings.decrease_frequency && decrease_frequency !== void 0)
        $$bindings.decrease_frequency(decrease_frequency);
      if ($$props.color === void 0 && $$bindings.color && color !== void 0)
        $$bindings.color(color);
      if ($$props.is_animate === void 0 && $$bindings.is_animate && is_animate !== void 0)
        $$bindings.is_animate(is_animate);
      $$result.css.add(css$5);
      return `<div class="${"loader svelte-w1xkbb"}" style="${"--loader-height: " + escape(`${initial_length + increase_length * numof_pendulum + initial_size}px`) + ";"}"><div class="${"fulcrum svelte-w1xkbb"}">${each(pendulums_args, (args) => {
        return `
            <div class="${"wire " + escape(is_animate ? "animate" : "") + " svelte-w1xkbb"}" style="${"--wire_length_px: " + escape(args.wire_length) + "; --periodic_time_sec: " + escape(args.periodic_time) + "; --color: " + escape(color) + ";"}"><div class="${"weight svelte-w1xkbb"}" style="${"--weight_size_px: " + escape(args.weight_size) + ";"}"></div>
            </div>`;
      })}</div>
</div>`;
    });
    css$4 = {
      code: ".loader.svelte-1prbtiu.svelte-1prbtiu{position:relative;width:100%;height:var(--loader-height)}.loader.svelte-1prbtiu .fulcrum.svelte-1prbtiu{position:absolute;width:100%;height:100%;left:0}.loader.svelte-1prbtiu .fulcrum .rect.svelte-1prbtiu{position:absolute;bottom:0;left:calc(50% + var(--interval));width:var(--width);height:0;border:solid 1px var(--color)}.loader.svelte-1prbtiu .fulcrum .rect.animate.svelte-1prbtiu{-webkit-animation:svelte-1prbtiu-rect_growth ease-in-out 3s var(--growth_delay) infinite;animation:svelte-1prbtiu-rect_growth ease-in-out 3s var(--growth_delay) infinite}@keyframes svelte-1prbtiu-rect_growth{0%{height:0}20%{height:var(--max_height)}40%{height:0}100%{height:0}}",
      map: null
    };
    RectWaveLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { numof_rectangle = 20 } = $$props;
      let { base_rect_width = 15 } = $$props;
      let { blur_range_rect_width = 10 } = $$props;
      let { formation_interval = 10 } = $$props;
      let { growth_delay_sec = 0.25 } = $$props;
      let { max_height = 150 } = $$props;
      let { color = "white" } = $$props;
      let { is_animate = true } = $$props;
      let rectangle_args = [];
      for (let i2 = 0; i2 < numof_rectangle; i2++) {
        rectangle_args.push({
          rect_width: `${Math.floor(Math.random() * blur_range_rect_width + base_rect_width - blur_range_rect_width / 2)}px`,
          interval_position: `${formation_interval * (numof_rectangle / 2 - i2)}px`,
          growth_delay: `${growth_delay_sec * i2}s`
        });
      }
      if ($$props.numof_rectangle === void 0 && $$bindings.numof_rectangle && numof_rectangle !== void 0)
        $$bindings.numof_rectangle(numof_rectangle);
      if ($$props.base_rect_width === void 0 && $$bindings.base_rect_width && base_rect_width !== void 0)
        $$bindings.base_rect_width(base_rect_width);
      if ($$props.blur_range_rect_width === void 0 && $$bindings.blur_range_rect_width && blur_range_rect_width !== void 0)
        $$bindings.blur_range_rect_width(blur_range_rect_width);
      if ($$props.formation_interval === void 0 && $$bindings.formation_interval && formation_interval !== void 0)
        $$bindings.formation_interval(formation_interval);
      if ($$props.growth_delay_sec === void 0 && $$bindings.growth_delay_sec && growth_delay_sec !== void 0)
        $$bindings.growth_delay_sec(growth_delay_sec);
      if ($$props.max_height === void 0 && $$bindings.max_height && max_height !== void 0)
        $$bindings.max_height(max_height);
      if ($$props.color === void 0 && $$bindings.color && color !== void 0)
        $$bindings.color(color);
      if ($$props.is_animate === void 0 && $$bindings.is_animate && is_animate !== void 0)
        $$bindings.is_animate(is_animate);
      $$result.css.add(css$4);
      return `<div class="${"loader svelte-1prbtiu"}" style="${"--loader-height: " + escape(`${77 + max_height}px`) + ";"}"><div class="${"fulcrum " + escape(is_animate ? "animate" : "") + " svelte-1prbtiu"}" style="${"--base_width:" + escape(`${base_rect_width}px`) + "; --max_height:" + escape(`${max_height}px`) + ";"}">${each(rectangle_args, (args) => {
        return `<div class="${"rect " + escape(is_animate ? "animate" : "") + " svelte-1prbtiu"}" style="${"--width:" + escape(args.rect_width) + "; --color: " + escape(color) + "; --interval: " + escape(args.interval_position) + "; --growth_delay: " + escape(args.growth_delay)}"></div>`;
      })}</div>
</div>`;
    });
    css$3 = {
      code: ".loader.svelte-8rpapr.svelte-8rpapr{position:relative;width:100%;height:var(--loader_height)}.loader.svelte-8rpapr .fulcrum.svelte-8rpapr{position:absolute;width:100%;height:100%}.loader.svelte-8rpapr .fulcrum .petals.svelte-8rpapr{position:absolute;top:calc(50% - var(--size) / 2);left:calc(50% - var(--size) / 2);width:var(--size);height:var(--size);transform:rotate(0);transform-origin:50% 50%}.loader.svelte-8rpapr .fulcrum .petals.animate.svelte-8rpapr{animation:svelte-8rpapr-cycle linear var(--speed) infinite}@keyframes svelte-8rpapr-cycle{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.loader.svelte-8rpapr .fulcrum .petal.svelte-8rpapr{position:absolute;top:0;transform:rotate(var(--angle));width:var(--size);height:var(--size);border-radius:calc(var(--size) / 2);border:solid 1px var(--color)}.loader.svelte-8rpapr .fulcrum .petal.animate.svelte-8rpapr{animation:svelte-8rpapr-flowering ease-in-out 2s var(--delay) infinite}@keyframes svelte-8rpapr-flowering{0%{transform:translate(0, 0)}40%{transform:translate(var(--move_x), var(--move_y))}80%{transform:translate(0, 0)}100%{transform:translate(0, 0)}}",
      map: null
    };
    RoundFloweringLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { color = "white" } = $$props;
      let { is_animate = true } = $$props;
      let { numof_small_round = 7 } = $$props;
      let { numof_large_round = 5 } = $$props;
      let { small_round_size = 80 } = $$props;
      let { large_round_size = 120 } = $$props;
      let { small_petal_stroke = 30 } = $$props;
      let { large_petal_stroke = 50 } = $$props;
      let { small_stroke_delay = 0 } = $$props;
      let { large_stroke_delay = 0.4 } = $$props;
      let { small_round_spin_speed = "5s" } = $$props;
      let { large_round_spin_speed = "2s" } = $$props;
      let small_flowering_args = [];
      let large_flowering_args = [];
      for (let i2 = 0; i2 < numof_small_round; i2++) {
        let radius = 2 * Math.PI / numof_small_round * i2;
        small_flowering_args.push({
          flower_petal_x: `${Math.sin(radius) * small_petal_stroke}px`,
          flower_petal_y: `${Math.cos(radius) * small_petal_stroke}px`
        });
      }
      for (let i2 = 0; i2 < numof_large_round; i2++) {
        let radius = 2 * Math.PI / numof_large_round * i2;
        large_flowering_args.push({
          flower_petal_x: `${Math.sin(radius) * large_petal_stroke}px`,
          flower_petal_y: `${Math.cos(radius) * large_petal_stroke}px`
        });
      }
      if ($$props.color === void 0 && $$bindings.color && color !== void 0)
        $$bindings.color(color);
      if ($$props.is_animate === void 0 && $$bindings.is_animate && is_animate !== void 0)
        $$bindings.is_animate(is_animate);
      if ($$props.numof_small_round === void 0 && $$bindings.numof_small_round && numof_small_round !== void 0)
        $$bindings.numof_small_round(numof_small_round);
      if ($$props.numof_large_round === void 0 && $$bindings.numof_large_round && numof_large_round !== void 0)
        $$bindings.numof_large_round(numof_large_round);
      if ($$props.small_round_size === void 0 && $$bindings.small_round_size && small_round_size !== void 0)
        $$bindings.small_round_size(small_round_size);
      if ($$props.large_round_size === void 0 && $$bindings.large_round_size && large_round_size !== void 0)
        $$bindings.large_round_size(large_round_size);
      if ($$props.small_petal_stroke === void 0 && $$bindings.small_petal_stroke && small_petal_stroke !== void 0)
        $$bindings.small_petal_stroke(small_petal_stroke);
      if ($$props.large_petal_stroke === void 0 && $$bindings.large_petal_stroke && large_petal_stroke !== void 0)
        $$bindings.large_petal_stroke(large_petal_stroke);
      if ($$props.small_stroke_delay === void 0 && $$bindings.small_stroke_delay && small_stroke_delay !== void 0)
        $$bindings.small_stroke_delay(small_stroke_delay);
      if ($$props.large_stroke_delay === void 0 && $$bindings.large_stroke_delay && large_stroke_delay !== void 0)
        $$bindings.large_stroke_delay(large_stroke_delay);
      if ($$props.small_round_spin_speed === void 0 && $$bindings.small_round_spin_speed && small_round_spin_speed !== void 0)
        $$bindings.small_round_spin_speed(small_round_spin_speed);
      if ($$props.large_round_spin_speed === void 0 && $$bindings.large_round_spin_speed && large_round_spin_speed !== void 0)
        $$bindings.large_round_spin_speed(large_round_spin_speed);
      $$result.css.add(css$3);
      return `<div class="${"loader svelte-8rpapr"}" style="${"--loader_height:" + escape(`${large_petal_stroke * 2 + large_round_size}px`) + "; --color:" + escape(color) + ";"}"><div class="${"fulcrum svelte-8rpapr"}"><div class="${"petals " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${small_round_size}px`) + "; --speed:" + escape(small_round_spin_speed)}">${each(small_flowering_args, (arg) => {
        return `<div class="${"petal " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${small_round_size}px`) + "; --move_x:" + escape(arg.flower_petal_x) + "; --move_y:" + escape(arg.flower_petal_y) + "; --delay:" + escape(`${small_stroke_delay}s`)}"></div>`;
      })}</div>
        <div class="${"petals " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${large_round_size}px`) + "; --speed:" + escape(large_round_spin_speed)}">${each(large_flowering_args, (arg) => {
        return `<div class="${"petal " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${large_round_size}px`) + "; --move_x: " + escape(arg.flower_petal_x) + "; --move_y: " + escape(arg.flower_petal_y) + "; --delay:" + escape(`${large_stroke_delay}s`)}"></div>`;
      })}</div></div>
</div>`;
    });
    css$24 = {
      code: ".loader-animation-box.svelte-yop039{padding:30px 0;border:solid 1px white;min-height:290px;width:100%;height:100%}",
      map: null
    };
    Show_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { name } = $$props;
      let { component } = $$props;
      if ($$props.name === void 0 && $$bindings.name && name !== void 0)
        $$bindings.name(name);
      if ($$props.component === void 0 && $$bindings.component && component !== void 0)
        $$bindings.component(component);
      $$result.css.add(css$24);
      return `<div class="${"loader-animation-box svelte-yop039"}">${validate_component(component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>
<p>${escape(name)}</p>`;
    });
    css$14 = {
      code: ".loader.svelte-1o1dzs3.svelte-1o1dzs3{width:100%;height:100%}.loader.svelte-1o1dzs3 .board.svelte-1o1dzs3{display:flex;flex-direction:row;justify-content:space-around;width:100%;height:100%}.loader.svelte-1o1dzs3 .board .dot_area.svelte-1o1dzs3{padding:5px;flex-basis:var(--dot_area_width);display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.loader.svelte-1o1dzs3 .board .dot_area .dot.svelte-1o1dzs3,.loader.svelte-1o1dzs3 .board .dot_area .blank.svelte-1o1dzs3{flex-basis:32%;width:var(--dot_size);height:var(--dot_size)}.loader.svelte-1o1dzs3 .board .dot_area .dot.svelte-1o1dzs3{background:var(--color)}",
      map: null
    };
    DotStringLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { color = "white" } = $$props;
      let { is_animate = true } = $$props;
      let { dot_size = 10 } = $$props;
      let { input = 1056194 } = $$props;
      let dot_string_dict = {
        0: [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
        1: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        2: [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
        3: [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        4: [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
        5: [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
        6: [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        7: [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        8: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        9: [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1]
      };
      let input_tostr = input.toString();
      let dot_args = [];
      for (let i2 = 0; i2 < input_tostr.length; i2++) {
        dot_args.push({ dots: dot_string_dict[input_tostr[i2]] });
      }
      console.log(dot_args);
      console.log(Math.floor(100 / input_tostr.length));
      if ($$props.color === void 0 && $$bindings.color && color !== void 0)
        $$bindings.color(color);
      if ($$props.is_animate === void 0 && $$bindings.is_animate && is_animate !== void 0)
        $$bindings.is_animate(is_animate);
      if ($$props.dot_size === void 0 && $$bindings.dot_size && dot_size !== void 0)
        $$bindings.dot_size(dot_size);
      if ($$props.input === void 0 && $$bindings.input && input !== void 0)
        $$bindings.input(input);
      $$result.css.add(css$14);
      return `<div class="${"loader svelte-1o1dzs3"}"><div class="${"board svelte-1o1dzs3"}" style="${"--color:" + escape(color) + "; --dot_area_width:" + escape(Math.floor(100 / input_tostr.length)) + "%; --dot_size:" + escape(`${dot_size}px`)}">${each(dot_args, (args) => {
        return `<div class="${"dot_area svelte-1o1dzs3"}">${each(args.dots, (dot) => {
          return `${dot == 0 ? `<div class="${"blank svelte-1o1dzs3"}"></div>` : `<div class="${"dot svelte-1o1dzs3"}"></div>`}`;
        })}
            </div>`;
      })}</div>
</div>`;
    });
    css15 = {
      code: ".show-room.svelte-7jgice.svelte-7jgice{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around}.show-room.svelte-7jgice .show-box.svelte-7jgice{flex-basis:40%}.show-room.svelte-7jgice .show-box-phone.svelte-7jgice{flex-basis:90%}",
      map: null
    };
    Show = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const show_item_args = [
        { name: "bs2nd", component: Bs2ndLoader },
        {
          name: "Pendulum",
          component: PendulumLoader
        },
        {
          name: "Rect Wave",
          component: RectWaveLoader
        },
        {
          name: "Round Flowering",
          component: RoundFloweringLoader
        },
        {
          name: "Dot Strings",
          component: DotStringLoader
        }
      ];
      $$result.css.add(css15);
      return `<section class="${"show-room svelte-7jgice"}">${each(show_item_args, (arg) => {
        return `${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
          default: ({ matches }) => {
            return `${matches ? `<div class="${"show-box-phone svelte-7jgice"}">${validate_component(Show_item, "ShowItem").$$render($$result, { name: arg.name, component: arg.component }, {}, {})}
        </div>` : ``}
    `;
          }
        })}
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
          default: ({ matches }) => {
            return `${matches ? `<div class="${"show-box svelte-7jgice"}">${validate_component(Show_item, "ShowItem").$$render($$result, { name: arg.name, component: arg.component }, {}, {})}
        </div>` : ``}
    `;
          }
        })}`;
      })}
    
</section>`;
    });
  }
});

// .svelte-kit/output/server/nodes/19.js
var __exports8 = {};
__export(__exports8, {
  css: () => css16,
  entry: () => entry8,
  js: () => js8,
  module: () => index_svelte_exports2
});
var entry8, js8, css16;
var init__8 = __esm({
  ".svelte-kit/output/server/nodes/19.js"() {
    init_index_svelte2();
    entry8 = "pages/show/index.svelte-42b79b8b.js";
    js8 = ["pages/show/index.svelte-42b79b8b.js", "chunks/index-7e81b4c7.js", "chunks/bs2ndLoader-e7191b2f.js", "chunks/MediaQuery-7add008a.js"];
    css16 = ["assets/pages/show/index.svelte-e2989a52.css", "assets/bs2ndLoader-8a29ed63.css"];
  }
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  "node_modules/axios/lib/helpers/bind.js"(exports, module2) {
    "use strict";
    module2.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i2 = 0; i2 < args.length; i2++) {
          args[i2] = arguments[i2];
        }
        return fn.apply(thisArg, args);
      };
    };
  }
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS({
  "node_modules/axios/lib/utils.js"(exports, module2) {
    "use strict";
    var bind = require_bind();
    var toString = Object.prototype.toString;
    function isArray(val) {
      return toString.call(val) === "[object Array]";
    }
    function isUndefined(val) {
      return typeof val === "undefined";
    }
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
    }
    function isArrayBuffer(val) {
      return toString.call(val) === "[object ArrayBuffer]";
    }
    function isFormData(val) {
      return typeof FormData !== "undefined" && val instanceof FormData;
    }
    function isArrayBufferView(val) {
      var result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && val.buffer instanceof ArrayBuffer;
      }
      return result;
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function isObject(val) {
      return val !== null && typeof val === "object";
    }
    function isPlainObject(val) {
      if (toString.call(val) !== "[object Object]") {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    function isDate(val) {
      return toString.call(val) === "[object Date]";
    }
    function isFile(val) {
      return toString.call(val) === "[object File]";
    }
    function isBlob2(val) {
      return toString.call(val) === "[object Blob]";
    }
    function isFunction(val) {
      return toString.call(val) === "[object Function]";
    }
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
    }
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
        return false;
      }
      return typeof window !== "undefined" && typeof document !== "undefined";
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (var i2 = 0, l = obj.length; i2 < l; i2++) {
          fn.call(null, obj[i2], i2, obj);
        }
      } else {
        for (var key2 in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key2)) {
            fn.call(null, obj[key2], key2, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key2) {
        if (isPlainObject(result[key2]) && isPlainObject(val)) {
          result[key2] = merge(result[key2], val);
        } else if (isPlainObject(val)) {
          result[key2] = merge({}, val);
        } else if (isArray(val)) {
          result[key2] = val.slice();
        } else {
          result[key2] = val;
        }
      }
      for (var i2 = 0, l = arguments.length; i2 < l; i2++) {
        forEach(arguments[i2], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key2) {
        if (thisArg && typeof val === "function") {
          a[key2] = bind(val, thisArg);
        } else {
          a[key2] = val;
        }
      });
      return a;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    module2.exports = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isObject,
      isPlainObject,
      isUndefined,
      isDate,
      isFile,
      isBlob: isBlob2,
      isFunction,
      isStream,
      isURLSearchParams,
      isStandardBrowserEnv,
      forEach,
      merge,
      extend,
      trim,
      stripBOM
    };
  }
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS({
  "node_modules/axios/lib/helpers/buildURL.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    function encode2(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    module2.exports = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key2) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key2 = key2 + "[]";
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode2(key2) + "=" + encode2(v));
          });
        });
        serializedParams = parts.join("&");
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    };
  }
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS({
  "node_modules/axios/lib/core/InterceptorManager.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h2) {
        if (h2 !== null) {
          fn(h2);
        }
      });
    };
    module2.exports = InterceptorManager;
  }
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }
});

// node_modules/axios/lib/core/enhanceError.js
var require_enhanceError = __commonJS({
  "node_modules/axios/lib/core/enhanceError.js"(exports, module2) {
    "use strict";
    module2.exports = function enhanceError(error2, config, code, request, response) {
      error2.config = config;
      if (code) {
        error2.code = code;
      }
      error2.request = request;
      error2.response = response;
      error2.isAxiosError = true;
      error2.toJSON = function toJSON() {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      };
      return error2;
    };
  }
});

// node_modules/axios/lib/core/createError.js
var require_createError = __commonJS({
  "node_modules/axios/lib/core/createError.js"(exports, module2) {
    "use strict";
    var enhanceError = require_enhanceError();
    module2.exports = function createError(message, config, code, request, response) {
      var error2 = new Error(message);
      return enhanceError(error2, config, code, request, response);
    };
  }
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  "node_modules/axios/lib/core/settle.js"(exports, module2) {
    "use strict";
    var createError = require_createError();
    module2.exports = function settle(resolve2, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve2(response);
      } else {
        reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
      }
    };
  }
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS({
  "node_modules/axios/lib/helpers/cookies.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils.isString(path)) {
            cookie.push("path=" + path);
          }
          if (utils.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read2(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    }() : function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read2() {
          return null;
        },
        remove: function remove() {
        }
      };
    }();
  }
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"(exports, module2) {
    "use strict";
    module2.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports, module2) {
    "use strict";
    module2.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  "node_modules/axios/lib/core/buildFullPath.js"(exports, module2) {
    "use strict";
    var isAbsoluteURL = require_isAbsoluteURL();
    var combineURLs = require_combineURLs();
    module2.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };
  }
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS({
  "node_modules/axios/lib/helpers/parseHeaders.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var ignoreDuplicateOf = [
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ];
    module2.exports = function parseHeaders(headers) {
      var parsed = {};
      var key2;
      var val;
      var i2;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i2 = line.indexOf(":");
        key2 = utils.trim(line.substr(0, i2)).toLowerCase();
        val = utils.trim(line.substr(i2 + 1));
        if (key2) {
          if (parsed[key2] && ignoreDuplicateOf.indexOf(key2) >= 0) {
            return;
          }
          if (key2 === "set-cookie") {
            parsed[key2] = (parsed[key2] ? parsed[key2] : []).concat([val]);
          } else {
            parsed[key2] = parsed[key2] ? parsed[key2] + ", " + val : val;
          }
        }
      });
      return parsed;
    };
  }
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS({
  "node_modules/axios/lib/helpers/isURLSameOrigin.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url) {
        var href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin(requestURL) {
        var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    }();
  }
});

// node_modules/axios/lib/cancel/Cancel.js
var require_Cancel = __commonJS({
  "node_modules/axios/lib/cancel/Cancel.js"(exports, module2) {
    "use strict";
    function Cancel(message) {
      this.message = message;
    }
    Cancel.prototype.toString = function toString() {
      return "Cancel" + (this.message ? ": " + this.message : "");
    };
    Cancel.prototype.__CANCEL__ = true;
    module2.exports = Cancel;
  }
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS({
  "node_modules/axios/lib/adapters/xhr.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var cookies = require_cookies();
    var buildURL = require_buildURL();
    var buildFullPath = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var createError = require_createError();
    var defaults2 = require_defaults();
    var Cancel = require_Cancel();
    module2.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve2, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils.isFormData(requestData)) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(function _resolve(value) {
            resolve2(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(createError("Request aborted", config, "ECONNABORTED", request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(createError("Network Error", config, null, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          var transitional = config.transitional || defaults2.transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(timeoutErrorMessage, config, transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", request));
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key2) {
            if (typeof requestData === "undefined" && key2.toLowerCase() === "content-type") {
              delete requestHeaders[key2];
            } else {
              request.setRequestHeader(key2, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request.addEventListener("progress", config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", config.onUploadProgress);
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || cancel && cancel.type ? new Cancel("canceled") : cancel);
            request.abort();
            request = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        request.send(requestData);
      });
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module2) {
    var s3 = 1e3;
    var m2 = s3 * 60;
    var h2 = m2 * 60;
    var d = h2 * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h2;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m2;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s3;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h2) {
        return Math.round(ms / h2) + "h";
      }
      if (msAbs >= m2) {
        return Math.round(ms / m2) + "m";
      }
      if (msAbs >= s3) {
        return Math.round(ms / s3) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h2) {
        return plural(ms, msAbs, h2, "hour");
      }
      if (msAbs >= m2) {
        return plural(ms, msAbs, m2, "minute");
      }
      if (msAbs >= s3) {
        return plural(ms, msAbs, s3, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key2) => {
        createDebug[key2] = env[key2];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash2 = 0;
        for (let i2 = 0; i2 < namespace.length; i2++) {
          hash2 = (hash2 << 5) - hash2 + namespace.charCodeAt(i2);
          hash2 |= 0;
        }
        return createDebug.colors[Math.abs(hash2) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format2) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format2];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i2;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i2 = 0; i2 < len; i2++) {
          if (!split[i2]) {
            continue;
          }
          namespaces = split[i2].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i2;
        let len;
        for (i2 = 0, len = createDebug.skips.length; i2 < len; i2++) {
          if (createDebug.skips[i2].test(name)) {
            return false;
          }
        }
        for (i2 = 0, len = createDebug.names.length; i2 < len; i2++) {
          if (createDebug.names[i2].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load2;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error2) {
      }
    }
    function load2() {
      let r2;
      try {
        r2 = exports.storage.getItem("debug");
      } catch (error2) {
      }
      if (!r2 && typeof process !== "undefined" && "env" in process) {
        r2 = process.env.DEBUG;
      }
      return r2;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error2) {
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error2) {
        return "[UnexpectedJSONParseError]: " + error2.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports, module2) {
    "use strict";
    module2.exports = (flag, argv) => {
      argv = argv || process.argv;
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const pos = argv.indexOf(prefix + flag);
      const terminatorPos = argv.indexOf("--");
      return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports, module2) {
    "use strict";
    var os = require("os");
    var hasFlag = require_has_flag();
    var env = process.env;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false")) {
      forceColor = false;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = true;
    }
    if ("FORCE_COLOR" in env) {
      forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(stream) {
      if (forceColor === false) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (stream && !stream.isTTY && forceColor !== true) {
        return 0;
      }
      const min = forceColor ? 1 : 0;
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(process.versions.node.split(".")[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      if (env.TERM === "dumb") {
        return min;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: getSupportLevel(process.stdout),
      stderr: getSupportLevel(process.stderr)
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module2) {
    var tty = require("tty");
    var util = require("util");
    exports.init = init2;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load2;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(() => {
    }, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error2) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key2) => {
      return /^debug_/i.test(key2);
    }).reduce((obj, key2) => {
      const prop = key2.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key2];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load2() {
      return process.env.DEBUG;
    }
    function init2(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i2 = 0; i2 < keys.length; i2++) {
        debug.inspectOpts[keys[i2]] = exports.inspectOpts[keys[i2]];
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS({
  "node_modules/follow-redirects/debug.js"(exports, module2) {
    var debug;
    module2.exports = function() {
      if (!debug) {
        try {
          debug = require_src()("follow-redirects");
        } catch (error2) {
        }
        if (typeof debug !== "function") {
          debug = function() {
          };
        }
      }
      debug.apply(null, arguments);
    };
  }
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS({
  "node_modules/follow-redirects/index.js"(exports, module2) {
    var url = require("url");
    var URL2 = url.URL;
    var http2 = require("http");
    var https2 = require("https");
    var Writable = require("stream").Writable;
    var assert = require("assert");
    var debug = require_debug();
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function(event) {
      eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "");
    var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
    var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
    var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on("response", responseCallback);
      }
      var self2 = this;
      this._onNativeResponse = function(response) {
        self2._processResponse(response);
      };
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function() {
      abortRequest(this._currentRequest);
      this.emit("abort");
    };
    RedirectableRequest.prototype.write = function(data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!(typeof data === "string" || typeof data === "object" && "length" in data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function(data, encoding, callback) {
      if (typeof data === "function") {
        callback = data;
        data = encoding = null;
      } else if (typeof encoding === "function") {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self2 = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
          self2._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function(name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };
    RedirectableRequest.prototype.removeHeader = function(name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };
    RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
      var self2 = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }
      function startTimer(socket) {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
        }
        self2._timeout = setTimeout(function() {
          self2.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
          self2._timeout = null;
        }
        if (callback) {
          self2.removeListener("timeout", callback);
        }
        if (!self2.socket) {
          self2._currentRequest.removeListener("socket", startTimer);
        }
      }
      if (callback) {
        this.on("timeout", callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once("socket", startTimer);
      }
      this.on("socket", destroyOnTimeout);
      this.once("response", clearTimer);
      this.once("error", clearTimer);
      return this;
    };
    [
      "flushHeaders",
      "getHeader",
      "setNoDelay",
      "setSocketKeepAlive"
    ].forEach(function(method) {
      RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
      };
    });
    ["aborted", "connection", "socket"].forEach(function(property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
          return this._currentRequest[property];
        }
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function(options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function() {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        this.emit("error", new TypeError("Unsupported protocol " + protocol));
        return;
      }
      if (this._options.agents) {
        var scheme2 = protocol.substr(0, protocol.length - 1);
        this._options.agent = this._options.agents[scheme2];
      }
      var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
      this._currentUrl = url.format(this._options);
      request._redirectable = this;
      for (var e2 = 0; e2 < events.length; e2++) {
        request.on(events[e2], eventHandlers[events[e2]]);
      }
      if (this._isRedirect) {
        var i2 = 0;
        var self2 = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error2) {
          if (request === self2._currentRequest) {
            if (error2) {
              self2.emit("error", error2);
            } else if (i2 < buffers.length) {
              var buffer = buffers[i2++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self2._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function(response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode
        });
      }
      var location = response.headers.location;
      if (location && this._options.followRedirects !== false && statusCode >= 300 && statusCode < 400) {
        abortRequest(this._currentRequest);
        response.destroy();
        if (++this._redirectCount > this._options.maxRedirects) {
          this.emit("error", new TooManyRedirectsError());
          return;
        }
        if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
          this._options.method = "GET";
          this._requestBodyBuffers = [];
          removeMatchingHeaders(/^content-/i, this._options.headers);
        }
        var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) || url.parse(this._currentUrl).hostname;
        var redirectUrl = url.resolve(this._currentUrl, location);
        debug("redirecting to", redirectUrl);
        this._isRedirect = true;
        var redirectUrlParts = url.parse(redirectUrl);
        Object.assign(this._options, redirectUrlParts);
        if (redirectUrlParts.hostname !== previousHostName) {
          removeMatchingHeaders(/^authorization$/i, this._options.headers);
        }
        if (typeof this._options.beforeRedirect === "function") {
          var responseDetails = { headers: response.headers };
          try {
            this._options.beforeRedirect.call(null, this._options, responseDetails);
          } catch (err) {
            this.emit("error", err);
            return;
          }
          this._sanitizeOptions(this._options);
        }
        try {
          this._performRequest();
        } catch (cause) {
          var error2 = new RedirectionError("Redirected request failed: " + cause.message);
          error2.cause = cause;
          this.emit("error", error2);
        }
      } else {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        this._requestBodyBuffers = [];
      }
    };
    function wrap(protocols) {
      var exports2 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function(scheme2) {
        var protocol = scheme2 + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme2];
        var wrappedProtocol = exports2[scheme2] = Object.create(nativeProtocol);
        function request(input, options, callback) {
          if (typeof input === "string") {
            var urlStr = input;
            try {
              input = urlToOptions(new URL2(urlStr));
            } catch (err) {
              input = url.parse(urlStr);
            }
          } else if (URL2 && input instanceof URL2) {
            input = urlToOptions(input);
          } else {
            callback = options;
            options = input;
            input = { protocol };
          }
          if (typeof options === "function") {
            callback = options;
            options = null;
          }
          options = Object.assign({
            maxRedirects: exports2.maxRedirects,
            maxBodyLength: exports2.maxBodyLength
          }, input, options);
          options.nativeProtocols = nativeProtocols;
          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options, callback);
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: { value: request, configurable: true, enumerable: true, writable: true },
          get: { value: get, configurable: true, enumerable: true, writable: true }
        });
      });
      return exports2;
    }
    function noop4() {
    }
    function urlToOptions(urlObject) {
      var options = {
        protocol: urlObject.protocol,
        hostname: urlObject.hostname.startsWith("[") ? urlObject.hostname.slice(1, -1) : urlObject.hostname,
        hash: urlObject.hash,
        search: urlObject.search,
        pathname: urlObject.pathname,
        path: urlObject.pathname + urlObject.search,
        href: urlObject.href
      };
      if (urlObject.port !== "") {
        options.port = Number(urlObject.port);
      }
      return options;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue;
    }
    function createErrorType(code, defaultMessage) {
      function CustomError(message) {
        Error.captureStackTrace(this, this.constructor);
        this.message = message || defaultMessage;
      }
      CustomError.prototype = new Error();
      CustomError.prototype.constructor = CustomError;
      CustomError.prototype.name = "Error [" + code + "]";
      CustomError.prototype.code = code;
      return CustomError;
    }
    function abortRequest(request) {
      for (var e2 = 0; e2 < events.length; e2++) {
        request.removeListener(events[e2], eventHandlers[events[e2]]);
      }
      request.on("error", noop4);
      request.abort();
    }
    module2.exports = wrap({ http: http2, https: https2 });
    module2.exports.wrap = wrap;
  }
});

// node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  "node_modules/axios/lib/env/data.js"(exports, module2) {
    module2.exports = {
      "version": "0.23.0"
    };
  }
});

// node_modules/axios/lib/adapters/http.js
var require_http = __commonJS({
  "node_modules/axios/lib/adapters/http.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var settle = require_settle();
    var buildFullPath = require_buildFullPath();
    var buildURL = require_buildURL();
    var http2 = require("http");
    var https2 = require("https");
    var httpFollow = require_follow_redirects().http;
    var httpsFollow = require_follow_redirects().https;
    var url = require("url");
    var zlib2 = require("zlib");
    var VERSION = require_data().version;
    var createError = require_createError();
    var enhanceError = require_enhanceError();
    var defaults2 = require_defaults();
    var Cancel = require_Cancel();
    var isHttps = /https:?/;
    function setProxy(options, proxy, location) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.port = proxy.port;
      options.path = location;
      if (proxy.auth) {
        var base642 = Buffer.from(proxy.auth.username + ":" + proxy.auth.password, "utf8").toString("base64");
        options.headers["Proxy-Authorization"] = "Basic " + base642;
      }
      options.beforeRedirect = function beforeRedirect(redirection) {
        redirection.headers.host = redirection.host;
        setProxy(redirection, proxy, redirection.href);
      };
    }
    module2.exports = function httpAdapter(config) {
      return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        var resolve2 = function resolve3(value) {
          done();
          resolvePromise(value);
        };
        var reject = function reject2(value) {
          done();
          rejectPromise(value);
        };
        var data = config.data;
        var headers = config.headers;
        var headerNames = {};
        Object.keys(headers).forEach(function storeLowerName(name) {
          headerNames[name.toLowerCase()] = name;
        });
        if ("user-agent" in headerNames) {
          if (!headers[headerNames["user-agent"]]) {
            delete headers[headerNames["user-agent"]];
          }
        } else {
          headers["User-Agent"] = "axios/" + VERSION;
        }
        if (data && !utils.isStream(data)) {
          if (Buffer.isBuffer(data)) {
          } else if (utils.isArrayBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
          } else if (utils.isString(data)) {
            data = Buffer.from(data, "utf-8");
          } else {
            return reject(createError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", config));
          }
          if (!headerNames["content-length"]) {
            headers["Content-Length"] = data.length;
          }
        }
        var auth = void 0;
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password || "";
          auth = username + ":" + password;
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        var parsed = url.parse(fullPath);
        var protocol = parsed.protocol || "http:";
        if (!auth && parsed.auth) {
          var urlAuth = parsed.auth.split(":");
          var urlUsername = urlAuth[0] || "";
          var urlPassword = urlAuth[1] || "";
          auth = urlUsername + ":" + urlPassword;
        }
        if (auth && headerNames.authorization) {
          delete headers[headerNames.authorization];
        }
        var isHttpsRequest = isHttps.test(protocol);
        var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
        var options = {
          path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ""),
          method: config.method.toUpperCase(),
          headers,
          agent,
          agents: { http: config.httpAgent, https: config.httpsAgent },
          auth
        };
        if (config.socketPath) {
          options.socketPath = config.socketPath;
        } else {
          options.hostname = parsed.hostname;
          options.port = parsed.port;
        }
        var proxy = config.proxy;
        if (!proxy && proxy !== false) {
          var proxyEnv = protocol.slice(0, -1) + "_proxy";
          var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
          if (proxyUrl) {
            var parsedProxyUrl = url.parse(proxyUrl);
            var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
            var shouldProxy = true;
            if (noProxyEnv) {
              var noProxy = noProxyEnv.split(",").map(function trim(s3) {
                return s3.trim();
              });
              shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
                if (!proxyElement) {
                  return false;
                }
                if (proxyElement === "*") {
                  return true;
                }
                if (proxyElement[0] === "." && parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                  return true;
                }
                return parsed.hostname === proxyElement;
              });
            }
            if (shouldProxy) {
              proxy = {
                host: parsedProxyUrl.hostname,
                port: parsedProxyUrl.port,
                protocol: parsedProxyUrl.protocol
              };
              if (parsedProxyUrl.auth) {
                var proxyUrlAuth = parsedProxyUrl.auth.split(":");
                proxy.auth = {
                  username: proxyUrlAuth[0],
                  password: proxyUrlAuth[1]
                };
              }
            }
          }
        }
        if (proxy) {
          options.headers.host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
          setProxy(options, proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
        }
        var transport;
        var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
        if (config.transport) {
          transport = config.transport;
        } else if (config.maxRedirects === 0) {
          transport = isHttpsProxy ? https2 : http2;
        } else {
          if (config.maxRedirects) {
            options.maxRedirects = config.maxRedirects;
          }
          transport = isHttpsProxy ? httpsFollow : httpFollow;
        }
        if (config.maxBodyLength > -1) {
          options.maxBodyLength = config.maxBodyLength;
        }
        if (config.insecureHTTPParser) {
          options.insecureHTTPParser = config.insecureHTTPParser;
        }
        var req = transport.request(options, function handleResponse(res) {
          if (req.aborted)
            return;
          var stream = res;
          var lastRequest = res.req || req;
          if (res.statusCode !== 204 && lastRequest.method !== "HEAD" && config.decompress !== false) {
            switch (res.headers["content-encoding"]) {
              case "gzip":
              case "compress":
              case "deflate":
                stream = stream.pipe(zlib2.createUnzip());
                delete res.headers["content-encoding"];
                break;
            }
          }
          var response = {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            config,
            request: lastRequest
          };
          if (config.responseType === "stream") {
            response.data = stream;
            settle(resolve2, reject, response);
          } else {
            var responseBuffer = [];
            var totalResponseBytes = 0;
            stream.on("data", function handleStreamData(chunk) {
              responseBuffer.push(chunk);
              totalResponseBytes += chunk.length;
              if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
                stream.destroy();
                reject(createError("maxContentLength size of " + config.maxContentLength + " exceeded", config, null, lastRequest));
              }
            });
            stream.on("error", function handleStreamError(err) {
              if (req.aborted)
                return;
              reject(enhanceError(err, config, null, lastRequest));
            });
            stream.on("end", function handleStreamEnd() {
              var responseData = Buffer.concat(responseBuffer);
              if (config.responseType !== "arraybuffer") {
                responseData = responseData.toString(config.responseEncoding);
                if (!config.responseEncoding || config.responseEncoding === "utf8") {
                  responseData = utils.stripBOM(responseData);
                }
              }
              response.data = responseData;
              settle(resolve2, reject, response);
            });
          }
        });
        req.on("error", function handleRequestError(err) {
          if (req.aborted && err.code !== "ERR_FR_TOO_MANY_REDIRECTS")
            return;
          reject(enhanceError(err, config, null, req));
        });
        if (config.timeout) {
          var timeout = parseInt(config.timeout, 10);
          if (isNaN(timeout)) {
            reject(createError("error trying to parse `config.timeout` to int", config, "ERR_PARSE_TIMEOUT", req));
            return;
          }
          req.setTimeout(timeout, function handleRequestTimeout() {
            req.abort();
            var transitional = config.transitional || defaults2.transitional;
            reject(createError("timeout of " + timeout + "ms exceeded", config, transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", req));
          });
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function(cancel) {
            if (req.aborted)
              return;
            req.abort();
            reject(!cancel || cancel && cancel.type ? new Cancel("canceled") : cancel);
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        if (utils.isStream(data)) {
          data.on("error", function handleStreamError(err) {
            reject(enhanceError(err, config, null, req));
          }).pipe(req);
        } else {
          req.end(data);
        }
      });
    };
  }
});

// node_modules/axios/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/axios/lib/defaults.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var normalizeHeaderName = require_normalizeHeaderName();
    var enhanceError = require_enhanceError();
    var DEFAULT_CONTENT_TYPE = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
        headers["Content-Type"] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== "undefined") {
        adapter = require_xhr();
      } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
        adapter = require_http();
      }
      return adapter;
    }
    function stringifySafely(rawValue, parser, encoder2) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e2) {
          if (e2.name !== "SyntaxError") {
            throw e2;
          }
        }
      }
      return (encoder2 || JSON.stringify)(rawValue);
    }
    var defaults2 = {
      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      },
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, "Accept");
        normalizeHeaderName(headers, "Content-Type");
        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
          return data.toString();
        }
        if (utils.isObject(data) || headers && headers["Content-Type"] === "application/json") {
          setContentTypeIfUnset(headers, "application/json");
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults2.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
        if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
          try {
            return JSON.parse(data);
          } catch (e2) {
            if (strictJSONParsing) {
              if (e2.name === "SyntaxError") {
                throw enhanceError(e2, this, "E_JSON_PARSE");
              }
              throw e2;
            }
          }
        }
        return data;
      }],
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*"
        }
      }
    };
    utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
      defaults2.headers[method] = {};
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      defaults2.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module2.exports = defaults2;
  }
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS({
  "node_modules/axios/lib/core/transformData.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var defaults2 = require_defaults();
    module2.exports = function transformData(data, headers, fns) {
      var context = this || defaults2;
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });
      return data;
    };
  }
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  "node_modules/axios/lib/cancel/isCancel.js"(exports, module2) {
    "use strict";
    module2.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  "node_modules/axios/lib/core/dispatchRequest.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var transformData = require_transformData();
    var isCancel = require_isCancel();
    var defaults2 = require_defaults();
    var Cancel = require_Cancel();
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new Cancel("canceled");
      }
    }
    module2.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData.call(config, config.data, config.headers, config.transformRequest);
      config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
      utils.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
        delete config.headers[method];
      });
      var adapter = config.adapter || defaults2.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
          }
        }
        return Promise.reject(reason);
      });
    };
  }
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS({
  "node_modules/axios/lib/core/mergeConfig.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        }
      }
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      var mergeMap = {
        "url": valueFromConfig2,
        "method": valueFromConfig2,
        "data": valueFromConfig2,
        "baseURL": defaultToConfig2,
        "transformRequest": defaultToConfig2,
        "transformResponse": defaultToConfig2,
        "paramsSerializer": defaultToConfig2,
        "timeout": defaultToConfig2,
        "timeoutMessage": defaultToConfig2,
        "withCredentials": defaultToConfig2,
        "adapter": defaultToConfig2,
        "responseType": defaultToConfig2,
        "xsrfCookieName": defaultToConfig2,
        "xsrfHeaderName": defaultToConfig2,
        "onUploadProgress": defaultToConfig2,
        "onDownloadProgress": defaultToConfig2,
        "decompress": defaultToConfig2,
        "maxContentLength": defaultToConfig2,
        "maxBodyLength": defaultToConfig2,
        "transport": defaultToConfig2,
        "httpAgent": defaultToConfig2,
        "httpsAgent": defaultToConfig2,
        "cancelToken": defaultToConfig2,
        "socketPath": defaultToConfig2,
        "responseEncoding": defaultToConfig2,
        "validateStatus": mergeDirectKeys
      };
      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    };
  }
});

// node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  "node_modules/axios/lib/helpers/validator.js"(exports, module2) {
    "use strict";
    var VERSION = require_data().version;
    var validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i2) {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings = {};
    validators.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, " has been removed" + (version ? " in " + version : "")));
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new TypeError("options must be an object");
      }
      var keys = Object.keys(options);
      var i2 = keys.length;
      while (i2-- > 0) {
        var opt = keys[i2];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError("option " + opt + " must be " + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error("Unknown option " + opt);
        }
      }
    }
    module2.exports = {
      assertOptions,
      validators
    };
  }
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS({
  "node_modules/axios/lib/core/Axios.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var buildURL = require_buildURL();
    var InterceptorManager = require_InterceptorManager();
    var dispatchRequest = require_dispatchRequest();
    var mergeConfig = require_mergeConfig();
    var validator = require_validator();
    var validators = validator.validators;
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    Axios.prototype.request = function request(config) {
      if (typeof config === "string") {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = "get";
      }
      var transitional = config.transitional;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, void 0];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error2) {
          onRejected(error2);
          break;
        }
      }
      try {
        promise = dispatchRequest(newConfig);
      } catch (error2) {
        return Promise.reject(error2);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
    };
    utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data
        }));
      };
    });
    module2.exports = Axios;
  }
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS({
  "node_modules/axios/lib/cancel/CancelToken.js"(exports, module2) {
    "use strict";
    var Cancel = require_Cancel();
    function CancelToken(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve2) {
        resolvePromise = resolve2;
      });
      var token = this;
      this.promise.then(function(cancel) {
        if (!token._listeners)
          return;
        var i2;
        var l = token._listeners.length;
        for (i2 = 0; i2 < l; i2++) {
          token._listeners[i2](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function(onfulfilled) {
        var _resolve;
        var promise = new Promise(function(resolve2) {
          token.subscribe(resolve2);
          _resolve = resolve2;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new Cancel(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.prototype.subscribe = function subscribe2(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };
    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    };
    module2.exports = CancelToken;
  }
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS({
  "node_modules/axios/lib/helpers/spread.js"(exports, module2) {
    "use strict";
    module2.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }
});

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  "node_modules/axios/lib/helpers/isAxiosError.js"(exports, module2) {
    "use strict";
    module2.exports = function isAxiosError(payload) {
      return typeof payload === "object" && payload.isAxiosError === true;
    };
  }
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  "node_modules/axios/lib/axios.js"(exports, module2) {
    "use strict";
    var utils = require_utils();
    var bind = require_bind();
    var Axios = require_Axios();
    var mergeConfig = require_mergeConfig();
    var defaults2 = require_defaults();
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);
      utils.extend(instance, Axios.prototype, context);
      utils.extend(instance, context);
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios2 = createInstance(defaults2);
    axios2.Axios = Axios;
    axios2.Cancel = require_Cancel();
    axios2.CancelToken = require_CancelToken();
    axios2.isCancel = require_isCancel();
    axios2.VERSION = require_data().version;
    axios2.all = function all(promises) {
      return Promise.all(promises);
    };
    axios2.spread = require_spread();
    axios2.isAxiosError = require_isAxiosError();
    module2.exports = axios2;
    module2.exports.default = axios2;
  }
});

// node_modules/axios/index.js
var require_axios2 = __commonJS({
  "node_modules/axios/index.js"(exports, module2) {
    module2.exports = require_axios();
  }
});

// .svelte-kit/output/server/chunks/api-86cf5a07.js
function switchBaseURL() {
  return "https://n2freevas-api.herokuapp.com/api";
}
var import_axios;
var init_api_86cf5a07 = __esm({
  ".svelte-kit/output/server/chunks/api-86cf5a07.js"() {
    import_axios = __toESM(require_axios2(), 1);
    import_axios.default.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    import_axios.default.create({
      baseURL: switchBaseURL(),
      headers: {
        "authorization": "n2freevas-api-token-Nx2gFhrRaEwEadVxxAadawS",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    import_axios.default.create({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});

// .svelte-kit/output/server/entries/pages/blog/list.svelte.js
var list_svelte_exports = {};
__export(list_svelte_exports, {
  default: () => List
});
var import_axios2, notion_pages, css$15, List_item, css17, List;
var init_list_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/blog/list.svelte.js"() {
    init_index_2e97bc70();
    init_index_96622166();
    init_api_86cf5a07();
    init_MediaQuery_021992e5();
    import_axios2 = __toESM(require_axios2(), 1);
    notion_pages = writable2([]);
    css$15 = {
      code: ".items.svelte-g7z64q.svelte-g7z64q.svelte-g7z64q{margin:20px 0px;border:solid 1px black;display:flex;flex-direction:row;justify-content:space-between;height:175px}.items.svelte-g7z64q .info_container.svelte-g7z64q.svelte-g7z64q{padding:20px 40px;width:50%;display:flex;flex-direction:column;justify-content:space-between}.items.svelte-g7z64q .info_container.svelte-g7z64q h3.svelte-g7z64q{font-size:25px;color:black}.items.svelte-g7z64q .thumbnail_container.svelte-g7z64q.svelte-g7z64q{overflow:hidden;width:50%;max-width:432px}.items_phone.svelte-g7z64q.svelte-g7z64q.svelte-g7z64q{margin:20px 0px;border:solid 1px black;display:flex;flex-direction:column;justify-content:space-between}.items_phone.svelte-g7z64q .info_container.svelte-g7z64q.svelte-g7z64q{padding:15px 30px}.items_phone.svelte-g7z64q .info_container.svelte-g7z64q h3.svelte-g7z64q{font-size:20px;color:black;margin:10px 0}.items_phone.svelte-g7z64q .thumbnail_container.svelte-g7z64q.svelte-g7z64q{overflow:hidden;width:100%;height:200px}.tag_container.svelte-g7z64q.svelte-g7z64q.svelte-g7z64q{display:flex;flex-direction:row;flex-wrap:wrap}.tag_container.svelte-g7z64q .tag_box.svelte-g7z64q.svelte-g7z64q{margin:5px;padding:5px 10px;border-radius:2px;background:rgb(133, 133, 133);font-size:13px}.tag_container.svelte-g7z64q .tag_box.default.svelte-g7z64q.svelte-g7z64q{background:black;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.gray.svelte-g7z64q.svelte-g7z64q{background:#525252;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.brown.svelte-g7z64q.svelte-g7z64q{background:#613c1a;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.orange.svelte-g7z64q.svelte-g7z64q{background:#b95a00;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.yellow.svelte-g7z64q.svelte-g7z64q{background:#e4a700;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.green.svelte-g7z64q.svelte-g7z64q{background:#135e00;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.blue.svelte-g7z64q.svelte-g7z64q{background:#000a9b;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.purple.svelte-g7z64q.svelte-g7z64q{background:#3d008d;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.pink.svelte-g7z64q.svelte-g7z64q{background:#a80076;border:solid 1px #444444}.tag_container.svelte-g7z64q .tag_box.red.svelte-g7z64q.svelte-g7z64q{background:#880000;border:solid 1px #880000}",
      map: null
    };
    List_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { id } = $$props;
      let { tags } = $$props;
      let { title } = $$props;
      let { thumbnail } = $$props;
      if ($$props.id === void 0 && $$bindings.id && id !== void 0)
        $$bindings.id(id);
      if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
        $$bindings.tags(tags);
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      if ($$props.thumbnail === void 0 && $$bindings.thumbnail && thumbnail !== void 0)
        $$bindings.thumbnail(thumbnail);
      $$result.css.add(css$15);
      return `${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `<div class="${"items_phone svelte-g7z64q"}"><div class="${"info_container svelte-g7z64q"}"><a href="${"/blog/page?page_id=" + escape(id)}"><h3 class="${"svelte-g7z64q"}"><!-- HTML_TAG_START -->${title}<!-- HTML_TAG_END --></h3></a>
        <div class="${"tag_container svelte-g7z64q"}">${each(tags, (tag) => {
            return `<div class="${"tag_box " + escape(tag.tag_color) + " svelte-g7z64q"}">${escape(tag.tag_name)}
            </div>`;
          })}</div></div>
    <div class="${"thumbnail_container svelte-g7z64q"}"><a href="${"/blog/page?page_id=" + escape(id)}"><img${add_attribute("src", thumbnail, 0)} alt="${escape(title) + "\u306E\u753B\u50CF"}"></a></div></div>` : ``}`;
        }
      })}

${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `<div class="${"items svelte-g7z64q"}"><div class="${"info_container svelte-g7z64q"}"><a href="${"/blog/page?page_id=" + escape(id)}"><h3 class="${"svelte-g7z64q"}"><!-- HTML_TAG_START -->${title}<!-- HTML_TAG_END --></h3></a>
        <div class="${"tag_container svelte-g7z64q"}">${each(tags, (tag) => {
            return `<div class="${"tag_box " + escape(tag.tag_color) + " svelte-g7z64q"}">${escape(tag.tag_name)}
            </div>`;
          })}</div></div>
    <div class="${"thumbnail_container svelte-g7z64q"}"><a href="${"/blog/page?page_id=" + escape(id)}"><img${add_attribute("src", thumbnail, 0)} alt="${escape(title) + "\u306E\u753B\u50CF"}"></a></div></div>` : ``}`;
        }
      })}`;
    });
    css17 = {
      code: "h2.svelte-13h619c{color:black}.background.svelte-13h619c{padding:30px 20px;width:100%;height:100%;background:white}",
      map: null
    };
    List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $notion_pages, $$unsubscribe_notion_pages;
      $$unsubscribe_notion_pages = subscribe(notion_pages, (value) => $notion_pages = value);
      $$result.css.add(css17);
      $$unsubscribe_notion_pages();
      return `<div class="${"background svelte-13h619c"}"><section class="${"title"}"><h2 class="${"svelte-13h619c"}">BLOG LIST</h2></section>
<section class="${"blog_list"}">${each($notion_pages, (page) => {
        return `${validate_component(List_item, "ListItem").$$render($$result, {
          id: page.page_id,
          title: page.page_title,
          tags: page.tags,
          thumbnail: page.thumbnail
        }, {}, {})}`;
      })}</section>

</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/14.js
var __exports9 = {};
__export(__exports9, {
  css: () => css18,
  entry: () => entry9,
  js: () => js9,
  module: () => list_svelte_exports
});
var entry9, js9, css18;
var init__9 = __esm({
  ".svelte-kit/output/server/nodes/14.js"() {
    init_list_svelte();
    entry9 = "pages/blog/list.svelte-3891e1f8.js";
    js9 = ["pages/blog/list.svelte-3891e1f8.js", "chunks/index-7e81b4c7.js", "chunks/index-c0f974cf.js", "chunks/api-e2b0109c.js", "chunks/MediaQuery-7add008a.js"];
    css18 = ["assets/pages/blog/list.svelte-fa9025ee.css"];
  }
});

// .svelte-kit/output/server/entries/pages/blog/page.svelte.js
var page_svelte_exports = {};
__export(page_svelte_exports, {
  default: () => Page
});
var Page;
var init_page_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/blog/page.svelte.js"() {
    init_index_2e97bc70();
    Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let data;
      console.log(data);
      return `<h1>${escape(data)}</h1>
<p>list</p>`;
    });
  }
});

// .svelte-kit/output/server/nodes/15.js
var __exports10 = {};
__export(__exports10, {
  css: () => css19,
  entry: () => entry10,
  js: () => js10,
  module: () => page_svelte_exports
});
var entry10, js10, css19;
var init__10 = __esm({
  ".svelte-kit/output/server/nodes/15.js"() {
    init_page_svelte();
    entry10 = "pages/blog/page.svelte-7f27c59d.js";
    js10 = ["pages/blog/page.svelte-7f27c59d.js", "chunks/index-7e81b4c7.js"];
    css19 = [];
  }
});

// .svelte-kit/output/server/entries/pages/app/DM-Downloader/collect.svelte.js
var collect_svelte_exports = {};
__export(collect_svelte_exports, {
  default: () => Collect
});
var import_axios3, Collect;
var init_collect_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/DM-Downloader/collect.svelte.js"() {
    init_index_2e97bc70();
    init_api_86cf5a07();
    import_axios3 = __toESM(require_axios2(), 1);
    Collect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .svelte-kit/output/server/nodes/6.js
var __exports11 = {};
__export(__exports11, {
  css: () => css20,
  entry: () => entry11,
  js: () => js11,
  module: () => collect_svelte_exports
});
var entry11, js11, css20;
var init__11 = __esm({
  ".svelte-kit/output/server/nodes/6.js"() {
    init_collect_svelte();
    entry11 = "pages/app/DM-Downloader/collect.svelte-7c08b160.js";
    js11 = ["pages/app/DM-Downloader/collect.svelte-7c08b160.js", "chunks/index-7e81b4c7.js", "chunks/api-e2b0109c.js"];
    css20 = [];
  }
});

// .svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/__layout-bs2nd.svelte.js
var layout_bs2nd_svelte_exports = {};
__export(layout_bs2nd_svelte_exports, {
  default: () => _layout_bs2nd
});
var css21, _layout_bs2nd;
var init_layout_bs2nd_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/__layout-bs2nd.svelte.js"() {
    init_index_2e97bc70();
    init_ToastArea_32d9fee1();
    init_index_96622166();
    css21 = {
      code: "header.svelte-yl89mf.svelte-yl89mf.svelte-yl89mf{display:flex;justify-content:space-between;height:40px}header.svelte-yl89mf .n2-logo.svelte-yl89mf.svelte-yl89mf{padding:10px}header.svelte-yl89mf .n2-logo img.svelte-yl89mf.svelte-yl89mf{height:20px}#base.svelte-yl89mf.svelte-yl89mf.svelte-yl89mf{background:black}footer.svelte-yl89mf.svelte-yl89mf.svelte-yl89mf{position:fixed;z-index:50;bottom:0;width:100%;height:75px;box-shadow:0 -1px 2px white;padding:10px;background:black}footer.svelte-yl89mf .footer-icon-box.svelte-yl89mf.svelte-yl89mf{display:flex;justify-content:space-around;max-width:700px;margin:0 auto}footer.svelte-yl89mf .footer-icon-box a.svelte-yl89mf.svelte-yl89mf{display:flex;flex-direction:column;align-items:center;justify-content:space-between;position:relative;width:40px;height:40px;border-radius:27px}footer.svelte-yl89mf .footer-icon-box a.active .footer-icon-bg.svelte-yl89mf.svelte-yl89mf{position:absolute;width:30px;height:30px;border:solid 2px var(--active-yellow);border-radius:15px}footer.svelte-yl89mf .footer-icon-box a.active p.svelte-yl89mf.svelte-yl89mf{color:var(--active-yellow)}footer.svelte-yl89mf .footer-icon-box a.svelte-yl89mf img.svelte-yl89mf{height:25px}footer.svelte-yl89mf .footer-icon-box a p.svelte-yl89mf.svelte-yl89mf{font-size:12px;font-weight:bold}",
      map: null
    };
    _layout_bs2nd = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css21);
      return `${$$result.head += `${$$result.title = `<title>\u3070\u304F\u305C\u3064\u3055\u3042\u3061 | \u30B3\u30C8\u30C0\u30DE\u30F3\u5358\u8A9E \u691C\u7D22 | \u30B3\u30C8\u30C0\u30DE\u30F3\u8F9E\u66F8 \u691C\u7D22</title>`, ""}<meta name="${"google-site-verification"}" content="${"3OjGMRDR5lkfKidGxk6ZUvUpS8GTtV2Hs8mCtnf8m3M"}" data-svelte="svelte-s74sy5">`, ""}

<header class="${"svelte-yl89mf"}"><div class="${"n2-logo svelte-yl89mf"}"><a href="${"/"}" class="${"svelte-yl89mf"}"><img src="${"/img/n2-icon-white.svg"}" alt="${""}" class="${"svelte-yl89mf"}"></a></div></header>
${validate_component(ToastArea, "ToastArea").$$render($$result, {}, {}, {})}
<section id="${"base"}" class="${"svelte-yl89mf"}">${slots.default ? slots.default({}) : ``}</section>

<footer class="${"svelte-yl89mf"}"><div class="${"footer-icon-box svelte-yl89mf"}"><a class="${escape(null_to_empty("")) + " svelte-yl89mf"}" href="${"/app/bakuzetsu-searcher-2nd/edit"}"><div class="${"footer-icon-bg svelte-yl89mf"}"></div>
        <img src="${"/img/bs2nd/e_gray_fill.svg"}" alt="${"EDIT"}" class="${"svelte-yl89mf"}">
        <p class="${"svelte-yl89mf"}">EDIT</p></a>
    <a class="${escape(null_to_empty("")) + " svelte-yl89mf"}" href="${"/app/bakuzetsu-searcher-2nd/analyze"}"><div class="${"footer-icon-bg svelte-yl89mf"}"></div>
        <img src="${"/img/bs2nd/a_gray_fill.svg"}" alt="${"ANALYZE"}" class="${"svelte-yl89mf"}">
        <p class="${"svelte-yl89mf"}">ANALYZE</p></a>
    </div>
</footer>`;
    });
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports12 = {};
__export(__exports12, {
  css: () => css22,
  entry: () => entry12,
  js: () => js12,
  module: () => layout_bs2nd_svelte_exports
});
var entry12, js12, css22;
var init__12 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    init_layout_bs2nd_svelte();
    entry12 = "pages/app/bakuzetsu-searcher-2nd/__layout-bs2nd.svelte-3eba4e7c.js";
    js12 = ["pages/app/bakuzetsu-searcher-2nd/__layout-bs2nd.svelte-3eba4e7c.js", "chunks/index-7e81b4c7.js", "chunks/ToastArea-eba10419.js", "chunks/SvelteToast.svelte_svelte_type_style_lang-960f1691.js", "chunks/index-c0f974cf.js"];
    css22 = ["assets/pages/app/bakuzetsu-searcher-2nd/__layout-bs2nd.svelte-3f0373ed.css", "assets/ToastArea-00e911a5.css", "assets/SvelteToast.svelte_svelte_type_style_lang-00aa1808.css"];
  }
});

// .svelte-kit/output/server/chunks/InfiniteScroll-eaf736c0.js
function getDeck() {
  if (typeof localStorage !== "undefined") {
    console.log("localStorage find");
    let st = localStorage.getItem("n2freevas-bs2nd-localstorage-decks");
    if (st) {
      storedDecks = JSON.parse(st);
    } else {
      console.log("localStorage not fount");
    }
  } else {
    console.log("localstorage undef");
  }
}
var DEFAULT_LIMIT, deckStore, filterConditionStore, kanaStore, elemStore, tribeStore, gimmickStore, isDeckFullStore, unitListStore, isSettingFilterCondition, isBottomOfScroll, isListLoading, storedDecks, decks, adventStore, adventTargetStore, adventBanmenStore, adventFilterConditionStore, adventElemStore, mojiLengthConfigStore, ElemEngDict, TribeEngDict, GimmickEngDict, AdventNumDict, InfiniteScroll;
var init_InfiniteScroll_eaf736c0 = __esm({
  ".svelte-kit/output/server/chunks/InfiniteScroll-eaf736c0.js"() {
    init_index_96622166();
    init_index_2e97bc70();
    DEFAULT_LIMIT = 48;
    deckStore = writable2(new Array(12));
    filterConditionStore = writable2({
      offset: 0,
      limit: DEFAULT_LIMIT,
      word: [],
      elem: [],
      tribe: [],
      gimmick: []
    });
    kanaStore = writable2([
      { id: 1, kanas: ["\u3042", "\u3041"], active: false },
      { id: 2, kanas: ["\u3044", "\u3043"], active: false },
      { id: 3, kanas: ["\u3046", "\u3045"], active: false },
      { id: 4, kanas: ["\u3048", "\u3047"], active: false },
      { id: 5, kanas: ["\u304A", "\u3049"], active: false },
      { id: 6, kanas: ["\u304B", "\u304C"], active: false },
      { id: 7, kanas: ["\u304D", "\u304E"], active: false },
      { id: 8, kanas: ["\u304F", "\u3050"], active: false },
      { id: 9, kanas: ["\u3051", "\u3052"], active: false },
      { id: 10, kanas: ["\u3053", "\u3054"], active: false },
      { id: 11, kanas: ["\u3055", "\u3056"], active: false },
      { id: 12, kanas: ["\u3057", "\u3058"], active: false },
      { id: 13, kanas: ["\u3059", "\u305A"], active: false },
      { id: 14, kanas: ["\u305B", "\u305C"], active: false },
      { id: 15, kanas: ["\u305D", "\u305E"], active: false },
      { id: 16, kanas: ["\u305F", "\u3060"], active: false },
      { id: 17, kanas: ["\u3061", "\u3062"], active: false },
      { id: 18, kanas: ["\u3064", "\u3065"], active: false },
      { id: 19, kanas: ["\u3066", "\u3067"], active: false },
      { id: 20, kanas: ["\u3068", "\u3069"], active: false },
      { id: 21, kanas: ["\u306A"], active: false },
      { id: 22, kanas: ["\u306B"], active: false },
      { id: 23, kanas: ["\u306C"], active: false },
      { id: 24, kanas: ["\u306D"], active: false },
      { id: 25, kanas: ["\u306E"], active: false },
      { id: 26, kanas: ["\u306F", "\u3070", "\u3071"], active: false },
      { id: 27, kanas: ["\u3072", "\u3073", "\u3074"], active: false },
      { id: 28, kanas: ["\u3075", "\u3076", "\u3077"], active: false },
      { id: 29, kanas: ["\u3078", "\u3079", "\u307A"], active: false },
      { id: 30, kanas: ["\u307B", "\u307C", "\u307D"], active: false },
      { id: 31, kanas: ["\u307E"], active: false },
      { id: 32, kanas: ["\u307F"], active: false },
      { id: 33, kanas: ["\u3080"], active: false },
      { id: 34, kanas: ["\u3081"], active: false },
      { id: 35, kanas: ["\u3082"], active: false },
      { id: 36, kanas: ["\u3084", "\u3083"], active: false },
      { id: 37, kanas: [""], active: false },
      { id: 38, kanas: ["\u3086", "\u3085"], active: false },
      { id: 39, kanas: [""], active: false },
      { id: 40, kanas: ["\u3088", "\u3087"], active: false },
      { id: 41, kanas: ["\u3089"], active: false },
      { id: 42, kanas: ["\u308A"], active: false },
      { id: 43, kanas: ["\u308B"], active: false },
      { id: 44, kanas: ["\u308C"], active: false },
      { id: 45, kanas: ["\u308D"], active: false },
      { id: 46, kanas: ["\u308F"], active: false },
      { id: 47, kanas: [""], active: false },
      { id: 48, kanas: ["\u3092"], active: false },
      { id: 49, kanas: [""], active: false },
      { id: 50, kanas: ["\u3093"], active: false }
    ]);
    elemStore = writable2([
      { id: 1, elem: "\u706B", active: false },
      { id: 2, elem: "\u6C34", active: false },
      { id: 3, elem: "\u6728", active: false },
      { id: 4, elem: "\u5149", active: false },
      { id: 5, elem: "\u95C7", active: false },
      { id: 6, elem: "\u51A5", active: false },
      { id: 7, elem: "\u5929", active: false }
    ]);
    tribeStore = writable2([
      { id: 1, tribe: "\u795E", active: false },
      { id: 2, tribe: "\u9B54", active: false },
      { id: 3, tribe: "\u82F1", active: false },
      { id: 4, tribe: "\u9F8D", active: false },
      { id: 5, tribe: "\u7363", active: false },
      { id: 6, tribe: "\u970A", active: false },
      { id: 7, tribe: "\u7269", active: false }
    ]);
    gimmickStore = writable2([
      { id: 1, gimmick: "\u30B7\u30FC\u30EB\u30C9\u30D6\u30EC\u30A4\u30AB\u30FC", active: false },
      { id: 2, gimmick: "\u30C8\u30B2\u30AC\u30FC\u30C9", active: false },
      { id: 3, gimmick: "\u30C1\u30A7\u30F3\u30B8\u30AC\u30FC\u30C9", active: false },
      { id: 4, gimmick: "\u5F31\u4F53\u30AC\u30FC\u30C9", active: false },
      { id: 5, gimmick: "\u30A6\u30A9\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC", active: false },
      { id: 6, gimmick: "\u30D3\u30EA\u30D3\u30EA\u30AC\u30FC\u30C9", active: false },
      { id: 7, gimmick: "\u30D2\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC", active: false },
      { id: 8, gimmick: "\u30B3\u30D4\u30FC\u30AC\u30FC\u30C9", active: false }
    ]);
    isDeckFullStore = writable2(false);
    unitListStore = writable2([]);
    isSettingFilterCondition = writable2(false);
    isBottomOfScroll = writable2(false);
    isListLoading = writable2(false);
    storedDecks = [
      { deckid: 1, deckname: "", list: [] },
      { deckid: 2, deckname: "", list: [] },
      { deckid: 3, deckname: "", list: [] },
      { deckid: 4, deckname: "", list: [] },
      { deckid: 5, deckname: "", list: [] }
    ];
    getDeck();
    decks = writable2(storedDecks);
    adventStore = writable2([]);
    adventTargetStore = writable2(void 0);
    adventBanmenStore = writable2([]);
    adventFilterConditionStore = writable2({
      offset: 0,
      limit: DEFAULT_LIMIT,
      elem: []
    });
    adventElemStore = writable2([
      { id: 1, elem: "\u706B", active: false },
      { id: 2, elem: "\u6C34", active: false },
      { id: 3, elem: "\u6728", active: false },
      { id: 4, elem: "\u5149", active: false },
      { id: 5, elem: "\u95C7", active: false },
      { id: 6, elem: "\u51A5", active: false },
      { id: 7, elem: "\u5929", active: false }
    ]);
    mojiLengthConfigStore = writable2([
      { length: 4, active: false },
      { length: 5, active: true },
      { length: 6, active: true },
      { length: 7, active: false }
    ]);
    ElemEngDict = {
      "\u706B": "fire",
      "\u6C34": "water",
      "\u6728": "wood",
      "\u5149": "light",
      "\u95C7": "dark",
      "\u51A5": "hell",
      "\u5929": "heaven"
    };
    TribeEngDict = {
      "\u795E": "god",
      "\u9B54": "evil",
      "\u82F1": "hero",
      "\u9F8D": "dragon",
      "\u7363": "beast",
      "\u970A": "ghost",
      "\u7269": "object"
    };
    GimmickEngDict = {
      "\u30B7\u30FC\u30EB\u30C9\u30D6\u30EC\u30A4\u30AB\u30FC": "shield",
      "\u30C8\u30B2\u30AC\u30FC\u30C9": "needle",
      "\u30C1\u30A7\u30F3\u30B8\u30AC\u30FC\u30C9": "change",
      "\u5F31\u4F53\u30AC\u30FC\u30C9": "week",
      "\u30A6\u30A9\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC": "wall",
      "\u30D3\u30EA\u30D3\u30EA\u30AC\u30FC\u30C9": "biribiri",
      "\u30D2\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC": "heal",
      "\u30B3\u30D4\u30FC\u30AC\u30FC\u30C9": "copy"
    };
    AdventNumDict = {
      0: "-",
      1: "\u521D\u30FB\u4E2D\u7D1A",
      2: "\u4E2D\u30FB\u4E0A\u7D1A",
      3: "\u8D85\u7D1A",
      4: "\u9B54\u7D1A",
      5: "\u7834\u6EC5\u7D1A"
    };
    InfiniteScroll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { threshold = 0 } = $$props;
      let { horizontal = false } = $$props;
      let { hasMore = true } = $$props;
      createEventDispatcher();
      let component;
      onDestroy(() => {
      });
      if ($$props.threshold === void 0 && $$bindings.threshold && threshold !== void 0)
        $$bindings.threshold(threshold);
      if ($$props.horizontal === void 0 && $$bindings.horizontal && horizontal !== void 0)
        $$bindings.horizontal(horizontal);
      if ($$props.hasMore === void 0 && $$bindings.hasMore && hasMore !== void 0)
        $$bindings.hasMore(hasMore);
      return `<div style="${"width:0px"}"${add_attribute("this", component, 0)}></div>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/analyze@bs2nd.svelte.js
var analyze_bs2nd_svelte_exports = {};
__export(analyze_bs2nd_svelte_exports, {
  default: () => Analyze_bs2nd
});
var import_axios4, css$16, Advent, css23, Analyze_bs2nd;
var init_analyze_bs2nd_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/analyze@bs2nd.svelte.js"() {
    init_index_2e97bc70();
    init_api_86cf5a07();
    init_InfiniteScroll_eaf736c0();
    import_axios4 = __toESM(require_axios2(), 1);
    init_index_96622166();
    css$16 = {
      code: '.advent.svelte-12z7jfs.svelte-12z7jfs{font-family:"Kosugi Maru", sans-serif;width:71px;margin:10px}.advent.svelte-12z7jfs .smart-info-box.svelte-12z7jfs{display:flex;flex-direction:row;justify-content:space-around}.advent.svelte-12z7jfs .smart-info-box img.svelte-12z7jfs{width:60px;height:50px}.advent.svelte-12z7jfs .smart-info-box img.disable.svelte-12z7jfs{filter:grayscale(85%)}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box.svelte-12z7jfs{position:relative}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box.svelte-12z7jfs{height:100%;display:flex;flex-direction:column-reverse}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.svelte-12z7jfs{width:11px;height:11px;border-radius:6px;margin:0 0 2px 0;border:solid 2px}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.fire.svelte-12z7jfs{background-color:rgb(219, 70, 70);border-color:rgb(255, 145, 0)}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.water.svelte-12z7jfs{background-color:rgb(41, 126, 255);border-color:rgb(167, 215, 255)}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.wood.svelte-12z7jfs{background-color:rgb(105, 172, 105);border-color:rgb(175, 216, 171)}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.light.svelte-12z7jfs{background-color:rgb(255, 210, 62);border-color:rgb(255, 240, 158)}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.dark.svelte-12z7jfs{background-color:rgb(146, 85, 165);border-color:rgb(208, 172, 255)}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.hell.svelte-12z7jfs{background-color:rgb(49, 31, 4);border-color:rgb(214, 166, 9)}.advent.svelte-12z7jfs .smart-info-box .elems-tribe-box .elems-box .elem.heaven.svelte-12z7jfs{background-color:rgb(250, 243, 248);border-color:rgb(255, 175, 248)}.advent.scaleup.svelte-12z7jfs.svelte-12z7jfs{width:120px}.advent.scaleup.svelte-12z7jfs img.svelte-12z7jfs{width:120px;height:100px}.advent.svelte-12z7jfs .name.svelte-12z7jfs{text-align:center;line-height:10px;font-size:10px;width:100%;margin:3px 0 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.advent.svelte-12z7jfs .name.disable.svelte-12z7jfs{color:gray}',
      map: null
    };
    Advent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      createEventDispatcher();
      let { advent } = $$props;
      let { full = false } = $$props;
      if ($$props.advent === void 0 && $$bindings.advent && advent !== void 0)
        $$bindings.advent(advent);
      if ($$props.full === void 0 && $$bindings.full && full !== void 0)
        $$bindings.full(full);
      $$result.css.add(css$16);
      return `<div class="${"advent " + escape(!full ? "scaleup" : "") + " svelte-12z7jfs"}"><div class="${"smart-info-box svelte-12z7jfs"}"><img class="${escape(null_to_empty(advent.disable ? "disable" : "")) + " svelte-12z7jfs"}"${add_attribute("src", advent.figure, 0)}${add_attribute("alt", advent.name, 0)}>
        ${full ? `<div class="${"elems-tribe-box svelte-12z7jfs"}"><div class="${"elems-box svelte-12z7jfs"}">${advent.elem.includes("\u706B") ? `<div class="${"elem fire svelte-12z7jfs"}"></div>` : ``}
                ${advent.elem.includes("\u6C34") ? `<div class="${"elem water svelte-12z7jfs"}"></div>` : ``}
                ${advent.elem.includes("\u6728") ? `<div class="${"elem wood svelte-12z7jfs"}"></div>` : ``}
                ${advent.elem.includes("\u5149") ? `<div class="${"elem light svelte-12z7jfs"}"></div>` : ``}
                ${advent.elem.includes("\u95C7") ? `<div class="${"elem dark svelte-12z7jfs"}"></div>` : ``}
                ${advent.elem.includes("\u51A5") ? `<div class="${"elem hell svelte-12z7jfs"}"></div>` : ``}
                ${advent.elem.includes("\u5929") ? `<div class="${"elem heaven svelte-12z7jfs"}"></div>` : ``}</div></div>` : ``}</div>
    ${full ? `<p class="${"name " + escape(advent.disable ? "disable" : "") + " svelte-12z7jfs"}">${escape(advent.name)}</p>` : ``}
    
</div>`;
    });
    css23 = {
      code: "button.svelte-4h12hp.svelte-4h12hp{font-size:14px;width:70px;color:white;border:solid 2px white;border-radius:5px}article.svelte-4h12hp.svelte-4h12hp{height:calc(100vh - 150px);overflow-y:scroll}article.svelte-4h12hp section.svelte-4h12hp{margin:0 auto;width:90vw;max-width:700px}article.svelte-4h12hp #elem-filter-box.svelte-4h12hp{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:right}article.svelte-4h12hp #elem-filter-box .elem.svelte-4h12hp{width:25px;font-size:12px;font-weight:900;text-align:center;margin:5px;border-radius:5px;border:solid 2px rgb(146, 146, 146);padding:3px}article.svelte-4h12hp #elem-filter-box .elem div.svelte-4h12hp{width:25px;height:25px;margin:0 auto;border-radius:12px}article.svelte-4h12hp #elem-filter-box .elem.active.fire.svelte-4h12hp{border-color:rgb(255, 0, 0);color:rgb(255, 0, 0);text-shadow:2px 1px 0px rgb(255, 115, 0)}article.svelte-4h12hp #elem-filter-box .elem.active.water.svelte-4h12hp{border-color:rgb(44, 128, 255);color:rgb(44, 128, 255);text-shadow:2px 1px 0px rgb(162, 191, 255)}article.svelte-4h12hp #elem-filter-box .elem.active.wood.svelte-4h12hp{border-color:rgb(53, 175, 0);color:rgb(53, 175, 0);text-shadow:2px 1px 0px rgb(46, 115, 0)}article.svelte-4h12hp #elem-filter-box .elem.active.light.svelte-4h12hp{border-color:rgb(255, 244, 195);color:rgb(255, 232, 131);text-shadow:2px 1px 0px rgb(255, 196, 0)}article.svelte-4h12hp #elem-filter-box .elem.active.dark.svelte-4h12hp{border-color:rgb(200, 62, 255);color:rgb(200, 62, 255);text-shadow:2px 1px 0px rgb(219, 129, 255)}article.svelte-4h12hp #elem-filter-box .elem.active.hell.svelte-4h12hp{border-color:rgb(255, 196, 0);color:rgb(61, 45, 0);text-shadow:2px 1px 0px rgb(255, 196, 0)}article.svelte-4h12hp #elem-filter-box .elem.active.heaven.svelte-4h12hp{border-color:rgb(255, 180, 245);color:rgb(241, 218, 222);text-shadow:2px 1px 0px rgb(255, 95, 234)}article.svelte-4h12hp #elem-filter-box button.svelte-4h12hp{--green:#6fffcf;color:var(--green);border:solid 2px var(--green);margin:0 0 0 15px}article.svelte-4h12hp #advent-list-box.svelte-4h12hp{width:90vw}article.svelte-4h12hp #advent-list-box p.svelte-4h12hp{font-size:11px}article.svelte-4h12hp #advent-list-box #advent-list.svelte-4h12hp{max-width:700px;margin:0 auto 10px auto;height:170px;display:flex;flex-direction:column;justify-content:start;flex-wrap:wrap;overflow-x:scroll}article.svelte-4h12hp #advent-detail-box.svelte-4h12hp{margin:30px auto;width:90vw}article.svelte-4h12hp #advent-detail-box #advent-overview.svelte-4h12hp{display:flex}article.svelte-4h12hp #advent-detail-box #advent-overview #advent-overview-text.svelte-4h12hp{display:flex;flex-direction:column;justify-content:center}article.svelte-4h12hp #advent-detail-box #advent-overview #advent-overview-text h5.svelte-4h12hp{margin:5px 0}article.svelte-4h12hp #advent-detail-box #banmen-list.svelte-4h12hp{margin:10px 0 400px 0}article.svelte-4h12hp #advent-detail-box #banmen-list #banmen-moj-length-config-box.svelte-4h12hp{margin:10px 0 20px 0;max-width:350px;display:flex;justify-content:space-between}article.svelte-4h12hp #advent-detail-box #banmen-list #banmen-moj-length-config-box button.active.svelte-4h12hp{color:var(--active-yellow);border-color:var(--active-yellow)}article.svelte-4h12hp #advent-detail-box #banmen-list .banmen.svelte-4h12hp{display:flex;justify-content:space-between;align-items:center;font-size:20px;font-weight:bold;letter-spacing:3px;border-bottom:solid 1px white;padding:0 0 5px 0;margin:0 0 15px 0}article.svelte-4h12hp #advent-detail-box #banmen-list .banmen img.svelte-4h12hp{width:8px;height:15px;margin:0 20px 0 0;transition:0.5s}article.svelte-4h12hp #advent-detail-box #banmen-list .banmen.active.svelte-4h12hp{color:var(--active-yellow)}article.svelte-4h12hp #advent-detail-box #banmen-list .banmen.active img.svelte-4h12hp{transform:rotate(90deg)}article.svelte-4h12hp #advent-detail-box #answers-box.svelte-4h12hp{position:fixed;padding:15px 15px 60px 15px;z-index:100;bottom:-520px;left:0;width:100vw;height:480px;background:linear-gradient(225deg, black, rgba(0, 0, 0, 0.8));border-top:solid 2px white;transition:0.3s}article.svelte-4h12hp #advent-detail-box #answers-box.active.svelte-4h12hp{bottom:0}article.svelte-4h12hp #advent-detail-box #answers-box .answer-count.svelte-4h12hp{max-width:650px;margin:0 auto 20px auto}article.svelte-4h12hp #advent-detail-box #answers-box #answer-box-close-button.svelte-4h12hp{position:absolute;top:-30px;right:50px;width:80px;height:30px;border:solid 1px white;border-bottom:solid 2px black;border-radius:7px 7px 0 0;background:black}article.svelte-4h12hp #advent-detail-box #answers-box #answer-box-close-button-tap-area.svelte-4h12hp{position:absolute;top:-30px;right:50px;width:80px;height:100px;padding:15px 30px}article.svelte-4h12hp #advent-detail-box #answers-box #answers-list.svelte-4h12hp{width:90vw;max-width:650px;margin:0 auto;color:white;height:100%;overflow-y:scroll;display:flex;justify-content:left;flex-wrap:wrap}article.svelte-4h12hp #advent-detail-box #answers-box #answers-list .ans-box.svelte-4h12hp{width:160px;padding:0 0 0 15px;border-left:solid 3px white;margin:10px 0}article.svelte-4h12hp #advent-detail-box #answers-box #answers-list .ans-box .answer-word.svelte-4h12hp{font-size:18px}article.svelte-4h12hp #advent-detail-box #answers-box #answers-list .ans-box .answer-nessesary.svelte-4h12hp{font-size:12px}",
      map: null
    };
    Analyze_bs2nd = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $adventBanmenStore, $$unsubscribe_adventBanmenStore;
      let $mojiLengthConfigStore, $$unsubscribe_mojiLengthConfigStore;
      let $adventTargetStore, $$unsubscribe_adventTargetStore;
      let $adventStore, $$unsubscribe_adventStore;
      let $$unsubscribe_adventFilterConditionStore;
      let $adventElemStore, $$unsubscribe_adventElemStore;
      let $$unsubscribe_deckStore;
      $$unsubscribe_adventBanmenStore = subscribe(adventBanmenStore, (value) => $adventBanmenStore = value);
      $$unsubscribe_mojiLengthConfigStore = subscribe(mojiLengthConfigStore, (value) => $mojiLengthConfigStore = value);
      $$unsubscribe_adventTargetStore = subscribe(adventTargetStore, (value) => $adventTargetStore = value);
      $$unsubscribe_adventStore = subscribe(adventStore, (value) => $adventStore = value);
      $$unsubscribe_adventFilterConditionStore = subscribe(adventFilterConditionStore, (value) => value);
      $$unsubscribe_adventElemStore = subscribe(adventElemStore, (value) => $adventElemStore = value);
      $$unsubscribe_deckStore = subscribe(deckStore, (value) => value);
      let answerCount = 0;
      let answerList = [];
      $$result.css.add(css23);
      $$unsubscribe_adventBanmenStore();
      $$unsubscribe_mojiLengthConfigStore();
      $$unsubscribe_adventTargetStore();
      $$unsubscribe_adventStore();
      $$unsubscribe_adventFilterConditionStore();
      $$unsubscribe_adventElemStore();
      $$unsubscribe_deckStore();
      return `<article class="${"com_scroll-y svelte-4h12hp"}"><section id="${"advent-list-box"}" class="${"svelte-4h12hp"}"><p class="${"svelte-4h12hp"}">\u653B\u7565\u3059\u308B\u964D\u81E8\u3092\u9078\u629E</p>
        <div id="${"advent-list"}" class="${"com_scroll-x svelte-4h12hp"}">${`${each($adventStore, (as) => {
        return `${validate_component(Advent, "Advent").$$render($$result, { advent: as, full: true }, {}, {})}
                ${validate_component(InfiniteScroll, "InfiniteScroll").$$render($$result, { threshold: 100 }, {}, {})}`;
      })}`}</div></section>
    <section id="${"elem-filter-box"}" class="${"svelte-4h12hp"}">${each($adventElemStore, (es, i2) => {
        return `<div class="${"elem " + escape(ElemEngDict[es.elem]) + " " + escape(es.active ? "active" : "") + " svelte-4h12hp"}">${escape(es.elem)}</div>`;
      })}
        <button class="${"svelte-4h12hp"}">\u7D5E\u8FBC</button></section>
    <section id="${"advent-detail-box"}" class="${"svelte-4h12hp"}">${`<div id="${"advent-overview"}" class="${"svelte-4h12hp"}">${$adventTargetStore ? `${validate_component(Advent, "Advent").$$render($$result, { advent: $adventTargetStore }, {}, {})}
                <div id="${"advent-overview-text"}" class="${"svelte-4h12hp"}"><h3>${escape($adventTargetStore.name)}</h3>
                    <h5 class="${"svelte-4h12hp"}">${escape(AdventNumDict[$adventTargetStore.level])}</h5>
                    <h5 class="${"svelte-4h12hp"}">\u53CE\u9332\u76E4\u9762\u6570 : ${escape($adventBanmenStore.length)}</h5></div>` : ``}</div>
            <div id="${"banmen-list"}" class="${"svelte-4h12hp"}">${$adventBanmenStore.length != 0 ? `<div id="${"banmen-moj-length-config-box"}" class="${"svelte-4h12hp"}">${each($mojiLengthConfigStore, (mlcs) => {
        return `<button class="${escape(null_to_empty(mlcs.active ? "active" : "")) + " svelte-4h12hp"}">${escape(mlcs.length)}\u6587\u5B57
                        </button>`;
      })}</div>` : ``}
                ${each($adventBanmenStore, (abs) => {
        return `<div class="${"banmen " + escape(abs.active ? "active" : "") + " svelte-4h12hp"}">${escape(abs.banmen.banmen.replace(/\./g, "\u25EF"))}
                        <img src="${"/img/arrow_simple_right.svg"}" alt="${">"}" class="${"svelte-4h12hp"}">
                    </div>`;
      })}</div>
            <div id="${"answers-box"}" class="${escape(null_to_empty("")) + " svelte-4h12hp"}"><div id="${"answer-box-close-button"}" class="${"svelte-4h12hp"}"></div>
                <div id="${"answer-box-close-button-tap-area"}" class="${"svelte-4h12hp"}"><img src="${"/img/arrow_simple_bottom.svg"}" alt="${"\u2B07\uFE0E"}" class="${"svelte-4h12hp"}"></div>
                <div class="${"answer-count svelte-4h12hp"}">\u30D2\u30C3\u30C8\u6570 : ${escape(answerCount)}</div>
                <div id="${"answers-list"}" class="${"com_scroll-y svelte-4h12hp"}">${`${each(answerList, (al) => {
        return `<div class="${"ans-box svelte-4h12hp"}"><div class="${"answer-word svelte-4h12hp"}">${escape(al.word)}</div>
                                <div class="${"answer-nessesary svelte-4h12hp"}">${escape(al.necessary)}</div>
                            </div>`;
      })}`}</div></div>`}</section>


</article>`;
    });
  }
});

// .svelte-kit/output/server/nodes/7.js
var __exports13 = {};
__export(__exports13, {
  css: () => css24,
  entry: () => entry13,
  js: () => js13,
  module: () => analyze_bs2nd_svelte_exports
});
var entry13, js13, css24;
var init__13 = __esm({
  ".svelte-kit/output/server/nodes/7.js"() {
    init_analyze_bs2nd_svelte();
    entry13 = "pages/app/bakuzetsu-searcher-2nd/analyze@bs2nd.svelte-b320702c.js";
    js13 = ["pages/app/bakuzetsu-searcher-2nd/analyze@bs2nd.svelte-b320702c.js", "chunks/index-7e81b4c7.js", "chunks/summon-9a72bcab.js", "chunks/api-e2b0109c.js", "chunks/index-c0f974cf.js", "chunks/SvelteToast.svelte_svelte_type_style_lang-960f1691.js", "chunks/bs2ndLoader-e7191b2f.js"];
    css24 = ["assets/pages/app/bakuzetsu-searcher-2nd/analyze@bs2nd.svelte-628f48fe.css", "assets/SvelteToast.svelte_svelte_type_style_lang-00aa1808.css", "assets/bs2ndLoader-8a29ed63.css"];
  }
});

// .svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/edit@bs2nd.svelte.js
var edit_bs2nd_svelte_exports = {};
__export(edit_bs2nd_svelte_exports, {
  default: () => Edit_bs2nd
});
var import_axios5, css$52, Kotodaman, css$42, Specify, css$32, Kana, css$25, Main, css$17, Storage, css25, Edit_bs2nd;
var init_edit_bs2nd_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/edit@bs2nd.svelte.js"() {
    init_index_2e97bc70();
    init_api_86cf5a07();
    init_MediaQuery_021992e5();
    init_InfiniteScroll_eaf736c0();
    init_bs2ndLoader_cf0653eb();
    import_axios5 = __toESM(require_axios2(), 1);
    init_index_96622166();
    css$52 = {
      code: '.kotodaman.svelte-1ii2yan.svelte-1ii2yan{font-family:"Kosugi Maru", sans-serif;width:71px;margin:10px}.kotodaman.no-margin.svelte-1ii2yan.svelte-1ii2yan{display:flex;justify-content:center;align-items:center;width:70px;height:70px;margin:0px}.kotodaman.svelte-1ii2yan .smart-info-box.svelte-1ii2yan{display:flex;flex-direction:row;justify-content:space-around}.kotodaman.svelte-1ii2yan .smart-info-box img.svelte-1ii2yan{width:60px;height:50px}.kotodaman.svelte-1ii2yan .smart-info-box img.disable.svelte-1ii2yan{filter:grayscale(85%)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box.svelte-1ii2yan{position:relative}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .tribe-box.svelte-1ii2yan{position:absolute;top:2px;left:-10px;width:19px;height:17px;background-color:rgb(255, 215, 38);box-shadow:1px 2px 1px white;border-radius:1px 8px}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .tribe-box.disable.svelte-1ii2yan{color:rgb(182, 182, 182);background-color:rgb(136, 126, 67)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .tribe-box p.svelte-1ii2yan{font-size:14px;line-height:17px;text-align:center;text-shadow:1px 1px 2px black}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box.svelte-1ii2yan{height:100%;display:flex;flex-direction:column-reverse}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.svelte-1ii2yan{width:11px;height:11px;border-radius:6px;margin:0 0 2px 0;border:solid 2px}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.fire.svelte-1ii2yan{background-color:rgb(219, 70, 70);border-color:rgb(255, 145, 0)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.water.svelte-1ii2yan{background-color:rgb(41, 126, 255);border-color:rgb(167, 215, 255)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.wood.svelte-1ii2yan{background-color:rgb(105, 172, 105);border-color:rgb(175, 216, 171)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.light.svelte-1ii2yan{background-color:rgb(255, 210, 62);border-color:rgb(255, 240, 158)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.dark.svelte-1ii2yan{background-color:rgb(146, 85, 165);border-color:rgb(208, 172, 255)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.hell.svelte-1ii2yan{background-color:rgb(49, 31, 4);border-color:rgb(214, 166, 9)}.kotodaman.svelte-1ii2yan .smart-info-box .elems-tribe-box .elems-box .elem.heaven.svelte-1ii2yan{background-color:rgb(250, 243, 248);border-color:rgb(255, 175, 248)}.kotodaman.svelte-1ii2yan .name.svelte-1ii2yan{text-align:center;line-height:10px;font-size:10px;width:100%;margin:3px 0 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kotodaman.svelte-1ii2yan .name.disable.svelte-1ii2yan{color:gray}',
      map: null
    };
    Kotodaman = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_isDeckFullStore;
      $$unsubscribe_isDeckFullStore = subscribe(isDeckFullStore, (value) => value);
      createEventDispatcher();
      let { kotodaman } = $$props;
      let { full = false } = $$props;
      if ($$props.kotodaman === void 0 && $$bindings.kotodaman && kotodaman !== void 0)
        $$bindings.kotodaman(kotodaman);
      if ($$props.full === void 0 && $$bindings.full && full !== void 0)
        $$bindings.full(full);
      $$result.css.add(css$52);
      $$unsubscribe_isDeckFullStore();
      return `<div class="${"kotodaman " + escape(!full ? "no-margin" : "") + " svelte-1ii2yan"}"><div class="${"smart-info-box svelte-1ii2yan"}"><img class="${escape(null_to_empty(kotodaman.disable ? "disable" : "")) + " svelte-1ii2yan"}"${add_attribute("src", kotodaman.figure, 0)}${add_attribute("alt", kotodaman.name, 0)}>
        ${full ? `<div class="${"elems-tribe-box svelte-1ii2yan"}"><div class="${"tribe-box " + escape(kotodaman.disable ? "disable" : "") + " svelte-1ii2yan"}"><p class="${"svelte-1ii2yan"}">${escape(kotodaman.tribe[0])}</p></div>
            
            <div class="${"elems-box svelte-1ii2yan"}">${kotodaman.elem.includes("\u706B") ? `<div class="${"elem fire svelte-1ii2yan"}"></div>` : ``}
                ${kotodaman.elem.includes("\u6C34") ? `<div class="${"elem water svelte-1ii2yan"}"></div>` : ``}
                ${kotodaman.elem.includes("\u6728") ? `<div class="${"elem wood svelte-1ii2yan"}"></div>` : ``}
                ${kotodaman.elem.includes("\u5149") ? `<div class="${"elem light svelte-1ii2yan"}"></div>` : ``}
                ${kotodaman.elem.includes("\u95C7") ? `<div class="${"elem dark svelte-1ii2yan"}"></div>` : ``}
                ${kotodaman.elem.includes("\u51A5") ? `<div class="${"elem hell svelte-1ii2yan"}"></div>` : ``}
                ${kotodaman.elem.includes("\u5929") ? `<div class="${"elem heaven svelte-1ii2yan"}"></div>` : ``}</div></div>` : ``}</div>
    ${full ? `<p class="${"name " + escape(kotodaman.disable ? "disable" : "") + " svelte-1ii2yan"}">${escape(kotodaman.name)}</p>` : ``}
    
</div>`;
    });
    css$42 = {
      code: '#specify-filter-box.svelte-1iaypzj.svelte-1iaypzj{width:100%;display:flex;flex-direction:column;justify-content:space-evenly;font-family:"Kosugi Maru", sans-serif}h3.svelte-1iaypzj.svelte-1iaypzj{margin:10px 0 0 0}#elem-box.svelte-1iaypzj.svelte-1iaypzj,#tribe-box.svelte-1iaypzj.svelte-1iaypzj,#gimmick-box.svelte-1iaypzj.svelte-1iaypzj{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;margin:0 0 10px 0}.elem.svelte-1iaypzj.svelte-1iaypzj{width:50px;font-size:18px;font-weight:900;text-align:center;margin:5px;border-radius:5px;border:solid 2px white;padding:3px}.elem.active.fire.svelte-1iaypzj.svelte-1iaypzj{border-color:rgb(255, 0, 0);color:rgb(255, 0, 0);text-shadow:2px 1px 0px rgb(255, 115, 0)}.elem.active.water.svelte-1iaypzj.svelte-1iaypzj{border-color:rgb(44, 128, 255);color:rgb(44, 128, 255);text-shadow:2px 1px 0px rgb(162, 191, 255)}.elem.active.wood.svelte-1iaypzj.svelte-1iaypzj{border-color:rgb(53, 175, 0);color:rgb(53, 175, 0);text-shadow:2px 1px 0px rgb(46, 115, 0)}.elem.active.light.svelte-1iaypzj.svelte-1iaypzj{border-color:rgb(255, 244, 195);color:rgb(255, 232, 131);text-shadow:2px 1px 0px rgb(255, 196, 0)}.elem.active.dark.svelte-1iaypzj.svelte-1iaypzj{border-color:rgb(200, 62, 255);color:rgb(200, 62, 255);text-shadow:2px 1px 0px rgb(219, 129, 255)}.elem.active.hell.svelte-1iaypzj.svelte-1iaypzj{border-color:rgb(255, 196, 0);color:rgb(61, 45, 0);text-shadow:2px 1px 0px rgb(255, 196, 0)}.elem.active.heaven.svelte-1iaypzj.svelte-1iaypzj{border-color:rgb(255, 180, 245);color:rgb(241, 218, 222);text-shadow:2px 1px 0px rgb(255, 95, 234)}.elem.long.svelte-1iaypzj.svelte-1iaypzj{width:70px}.tribe.svelte-1iaypzj.svelte-1iaypzj{width:50px;height:35px;margin:5px;border-radius:5px;text-align:center;justify-content:space-around;line-height:30px;border:solid 2px white}.tribe.blank.svelte-1iaypzj.svelte-1iaypzj{border:none}.tribe.active.svelte-1iaypzj.svelte-1iaypzj{border:solid 2px var(--active-yellow);color:var(--active-yellow)}.gimmick.svelte-1iaypzj.svelte-1iaypzj{width:50px;height:40px;margin:5px;justify-content:space-around;border-radius:5px;border:solid 2px white;padding:3px}.gimmick.active.svelte-1iaypzj.svelte-1iaypzj{border:solid 2px var(--active-yellow)}.gimmick.svelte-1iaypzj img.svelte-1iaypzj{margin:0 auto;height:30px}.elem.svelte-1iaypzj.svelte-1iaypzj,.tribe.svelte-1iaypzj.svelte-1iaypzj,.gimmick.svelte-1iaypzj.svelte-1iaypzj{cursor:pointer}',
      map: null
    };
    Specify = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $gimmickStore, $$unsubscribe_gimmickStore;
      let $tribeStore, $$unsubscribe_tribeStore;
      let $elemStore, $$unsubscribe_elemStore;
      $$unsubscribe_gimmickStore = subscribe(gimmickStore, (value) => $gimmickStore = value);
      $$unsubscribe_tribeStore = subscribe(tribeStore, (value) => $tribeStore = value);
      $$unsubscribe_elemStore = subscribe(elemStore, (value) => $elemStore = value);
      $$result.css.add(css$42);
      $$unsubscribe_gimmickStore();
      $$unsubscribe_tribeStore();
      $$unsubscribe_elemStore();
      return `<article id="${"specify-filter-box"}" class="${"svelte-1iaypzj"}"><h3 class="${"svelte-1iaypzj"}">\u5C5E\u6027</h3>
    <section id="${"elem-box"}" class="${"svelte-1iaypzj"}">${each($elemStore, (es, i2) => {
        return `<div class="${"elem " + escape(ElemEngDict[es.elem]) + " " + escape(i2 < 3 ? "long" : "") + " " + escape(es.active ? "active" : "") + " svelte-1iaypzj"}">${escape(es.elem)}</div>`;
      })}</section>
    <h3 class="${"svelte-1iaypzj"}">\u7A2E\u65CF</h3>
    <section id="${"tribe-box"}" class="${"svelte-1iaypzj"}">${each($tribeStore, (ts) => {
        return `<div class="${"tribe " + escape(TribeEngDict[ts.tribe]) + " " + escape(ts.active ? "active" : "") + " svelte-1iaypzj"}">${escape(ts.tribe)}</div>`;
      })}
        <div class="${"tribe blank svelte-1iaypzj"}"></div></section>
    <h3 class="${"svelte-1iaypzj"}">\u30AE\u30DF\u30C3\u30AF</h3>
    <section id="${"gimmick-box"}" class="${"svelte-1iaypzj"}">${each($gimmickStore, (gs) => {
        return `<div class="${"gimmick " + escape(gs.active ? "active" : "") + " svelte-1iaypzj"}"><img${add_attribute("src", `/img/bs2nd/${GimmickEngDict[gs.gimmick]}.svg`, 0)}${add_attribute("alt", gs.gimmick, 0)} class="${"svelte-1iaypzj"}"></div>`;
      })}</section>
</article>`;
    });
    css$32 = {
      code: '#kana-filter-box.svelte-1dnb1gp.svelte-1dnb1gp{width:100%;font-family:"Kosugi Maru", sans-serif}#kana-filter-box.svelte-1dnb1gp p.svelte-1dnb1gp{margin:10px 0 0 0;font-size:10px}#kana-box.svelte-1dnb1gp.svelte-1dnb1gp{display:flex;justify-content:space-around;flex-wrap:wrap;--kana-box-size:38px}#kana-box.svelte-1dnb1gp .kana.svelte-1dnb1gp{cursor:pointer;border:solid 1px white;border-radius:3px;width:var(--kana-box-size);height:var(--kana-box-size);margin:2px 5px;line-height:var(--kana-box-size);text-align:center}#kana-box.svelte-1dnb1gp .kana.active.svelte-1dnb1gp{border-color:var(--active-yellow);color:var(--active-yellow)}#kana-box.svelte-1dnb1gp .kana-blank.svelte-1dnb1gp{width:var(--kana-box-size);height:var(--kana-box-size);margin:2px}',
      map: null
    };
    Kana = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $kanaStore, $$unsubscribe_kanaStore;
      $$unsubscribe_kanaStore = subscribe(kanaStore, (value) => $kanaStore = value);
      $$result.css.add(css$32);
      $$unsubscribe_kanaStore();
      return `<article id="${"kana-filter-box"}" class="${"svelte-1dnb1gp"}"><section id="${"kana-box"}" class="${"svelte-1dnb1gp"}">${each($kanaStore, (k) => {
        return `${k.kanas[0] != "" ? `<div class="${"kana " + escape(k.active ? "active" : "") + " svelte-1dnb1gp"}">${escape(k.kanas[0])}
                </div>` : `<div class="${"kana-blank svelte-1dnb1gp"}"></div>`}`;
      })}</section>
    <p class="${"svelte-1dnb1gp"}">* \u6FC1\u97F3\u3084\u4FC3\u97F3\u306A\u3069\u306F\u3001\u5168\u3066\u305D\u306E\u76F4\u97F3\u306B\u542B\u307E\u308C\u307E\u3059\u3002</p>
</article>`;
    });
    css$25 = {
      code: "#bs2nd-edit-filter-panel.svelte-lv4ubr.svelte-lv4ubr.svelte-lv4ubr{padding:5px;width:100%;height:100%;position:relative}#bs2nd-edit-filter-panel.svelte-lv4ubr .tabbox.svelte-lv4ubr.svelte-lv4ubr{margin-bottom:10px;padding:10px;border:1px solid #dee2e6;border-radius:0 0 0.5rem 0.5rem;border-top:0}#bs2nd-edit-filter-panel.svelte-lv4ubr ul.svelte-lv4ubr.svelte-lv4ubr{display:flex;flex-wrap:wrap;padding-left:0;margin:0 0;list-style:none;border-bottom:1px solid #dee2e6}#bs2nd-edit-filter-panel.svelte-lv4ubr li.svelte-lv4ubr.svelte-lv4ubr{width:50%;text-align:center;margin-bottom:-1px}#bs2nd-edit-filter-panel.svelte-lv4ubr span.svelte-lv4ubr.svelte-lv4ubr{border:1px solid transparent;border-top-left-radius:0.25rem;border-top-right-radius:0.25rem;display:block;padding:0.5rem 1rem;cursor:pointer;transition:0.3s}#bs2nd-edit-filter-panel.svelte-lv4ubr span.svelte-lv4ubr.svelte-lv4ubr:hover{border-color:#e9ecef #e9ecef #dee2e6}#bs2nd-edit-filter-panel.svelte-lv4ubr li.active.svelte-lv4ubr>span.svelte-lv4ubr{border-color:#dee2e6 #dee2e6 #fff}#bs2nd-edit-filter-panel.svelte-lv4ubr #filter-execute-box.svelte-lv4ubr.svelte-lv4ubr{position:absolute;bottom:25px;width:100%;text-align:center}#bs2nd-edit-filter-panel.svelte-lv4ubr #filter-execute-box button.svelte-lv4ubr.svelte-lv4ubr{margin:0 10px;border:solid 1px white;border-radius:5px;color:white;width:110px;height:35px}",
      map: null
    };
    Main = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_gimmickStore;
      let $$unsubscribe_tribeStore;
      let $$unsubscribe_elemStore;
      let $$unsubscribe_kanaStore;
      let $$unsubscribe_isSettingFilterCondition;
      let $$unsubscribe_isListLoading;
      let $$unsubscribe_filterConditionStore;
      let $$unsubscribe_unitListStore;
      let $$unsubscribe_deckStore;
      let $$unsubscribe_isBottomOfScroll;
      $$unsubscribe_gimmickStore = subscribe(gimmickStore, (value) => value);
      $$unsubscribe_tribeStore = subscribe(tribeStore, (value) => value);
      $$unsubscribe_elemStore = subscribe(elemStore, (value) => value);
      $$unsubscribe_kanaStore = subscribe(kanaStore, (value) => value);
      $$unsubscribe_isSettingFilterCondition = subscribe(isSettingFilterCondition, (value) => value);
      $$unsubscribe_isListLoading = subscribe(isListLoading, (value) => value);
      $$unsubscribe_filterConditionStore = subscribe(filterConditionStore, (value) => value);
      $$unsubscribe_unitListStore = subscribe(unitListStore, (value) => value);
      $$unsubscribe_deckStore = subscribe(deckStore, (value) => value);
      $$unsubscribe_isBottomOfScroll = subscribe(isBottomOfScroll, (value) => value);
      createEventDispatcher();
      let tabs = [
        {
          label: "\u7A2E\u5225",
          value: 1,
          component: Specify
        },
        { label: "50\u97F3", value: 2, component: Kana }
      ];
      let activeTabs = 1;
      $$result.css.add(css$25);
      $$unsubscribe_gimmickStore();
      $$unsubscribe_tribeStore();
      $$unsubscribe_elemStore();
      $$unsubscribe_kanaStore();
      $$unsubscribe_isSettingFilterCondition();
      $$unsubscribe_isListLoading();
      $$unsubscribe_filterConditionStore();
      $$unsubscribe_unitListStore();
      $$unsubscribe_deckStore();
      $$unsubscribe_isBottomOfScroll();
      return `<article id="${"bs2nd-edit-filter-panel"}" class="${"svelte-lv4ubr"}"><ul class="${"svelte-lv4ubr"}">${each(tabs, (t2) => {
        return `<li class="${escape(null_to_empty(activeTabs === t2.value ? "active" : "")) + " svelte-lv4ubr"}"><span class="${"svelte-lv4ubr"}">${escape(t2.label)}</span>
            </li>`;
      })}</ul>
    ${each(tabs, (t2) => {
        return `${activeTabs == t2.value ? `<div class="${"tabbox svelte-lv4ubr"}">${validate_component(t2.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}
        </div>` : ``}`;
      })}
    <section id="${"filter-execute-box"}" class="${"svelte-lv4ubr"}"><button id="${"search-button"}" class="${"svelte-lv4ubr"}">\u691C\u7D22</button>
        <button id="${"reset-button"}" class="${"svelte-lv4ubr"}">\u30EA\u30BB\u30C3\u30C8</button></section>
</article>`;
    });
    css$17 = {
      code: '#deck-list-panel.svelte-zpytjz.svelte-zpytjz{font-family:"Kosugi Maru", sans-serif;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between}#deck-list-panel.svelte-zpytjz .deck-box.svelte-zpytjz{width:100%;height:100px;position:relative}#deck-list-panel.svelte-zpytjz .deck-box .deck-name.svelte-zpytjz{position:absolute;color:white;background:none;border:none;z-index:15;width:150px;font-size:15px;top:20px;left:10px}#deck-list-panel.svelte-zpytjz .deck-box .deck-name.svelte-zpytjz:focus{outline:none;border:solid 1px var(--active-yellow);border-radius:5px}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail.svelte-zpytjz{position:absolute;top:10px;right:0;width:70%;height:80px}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail .deck-img.svelte-zpytjz{position:absolute;width:100%;height:inherit;background-image:var(--url);background-size:cover;background-position:50% 30%;background-repeat:no-repeat;background-blend-mode:screen}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail .deck-img-blank.svelte-zpytjz{position:absolute;right:40px;top:20px;width:auto;height:40px;background-image:var(--url-blank)}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail .deck-img-filter.svelte-zpytjz{position:absolute;width:100%;height:100%;background:linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0))}#deck-list-panel.svelte-zpytjz .deck-box .deck-list.svelte-zpytjz{position:absolute;z-index:10;left:10px;bottom:0px;width:180px;display:flex;flex-direction:row;flex-wrap:wrap-reverse}#deck-list-panel.svelte-zpytjz .deck-box .deck-list img.svelte-zpytjz{width:25px;margin:0 3px 0 0}#deck-list-panel.svelte-zpytjz .deck-box .deck-delete-button.svelte-zpytjz{position:absolute;bottom:0;right:10px}#deck-list-panel.svelte-zpytjz .deck-box .deck-delete-button img.svelte-zpytjz{width:30px}',
      map: null
    };
    Storage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_unitListStore;
      let $$unsubscribe_deckStore;
      let $decks, $$unsubscribe_decks;
      let $$unsubscribe_isDeckFullStore;
      $$unsubscribe_unitListStore = subscribe(unitListStore, (value) => value);
      $$unsubscribe_deckStore = subscribe(deckStore, (value) => value);
      $$unsubscribe_decks = subscribe(decks, (value) => $decks = value);
      $$unsubscribe_isDeckFullStore = subscribe(isDeckFullStore, (value) => value);
      createEventDispatcher();
      console.log($decks);
      $$result.css.add(css$17);
      $$unsubscribe_unitListStore();
      $$unsubscribe_deckStore();
      $$unsubscribe_decks();
      $$unsubscribe_isDeckFullStore();
      return `<section id="${"deck-list-panel"}" class="${"svelte-zpytjz"}">${each($decks, (d) => {
        return `${d.list.length != 0 ? `<div class="${"deck-box svelte-zpytjz"}"><input placeholder="${"deck name"}" class="${"deck-name svelte-zpytjz"}"${add_attribute("value", d.deckname, 0)}>
            <div class="${"deck-thumbnail svelte-zpytjz"}"><div class="${"deck-img svelte-zpytjz"}" style="${"--url:url(" + escape(d.list[0].figure) + ")"}"></div>
                <div class="${"deck-img-filter svelte-zpytjz"}"></div></div>
            <div class="${"deck-list svelte-zpytjz"}">${each(d.list, (dl, i2) => {
          return `${i2 != 0 ? `<img${add_attribute("src", dl.figure, 0)} alt="${""}" class="${"svelte-zpytjz"}">` : ``}`;
        })}</div>
            <div class="${"deck-delete-button svelte-zpytjz"}"><img src="${"/img/trash.svg"}" alt="${"\u524A\u9664"}" class="${"svelte-zpytjz"}"></div>
        </div>` : `<div class="${"deck-box svelte-zpytjz"}"><input style="${"color:gray;"}" class="${"deck-name svelte-zpytjz"}"${add_attribute("value", "Empty", 0)} ${"disabled"}>
            <div class="${"deck-thumbnail svelte-zpytjz"}"><img class="${"deck-img-blank svelte-zpytjz"}" src="${"/img/add_people.svg"}" alt="${"add deck"}"></div>
        </div>`}`;
      })}
</section>`;
    });
    css25 = {
      code: "#bs2nd-screen.svelte-haop3e.svelte-haop3e{margin:0 auto;height:calc(100vh - 120px);overflow:hidden;display:flex;flex-direction:row;justify-content:space-evenly}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels.svelte-haop3e{max-width:90vw;height:100%;display:flex;flex-direction:column;justify-content:space-around}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels #bs2nd-deck-edit.svelte-haop3e{margin:10px auto 10px auto}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels #bs2nd-deck-edit #bs2nd-deck-edit-panel.svelte-haop3e{height:225px;width:300px;margin:0 0 5px 0;background:white;border-radius:20px;display:flex;flex-direction:row;justify-content:space-evenly;flex-wrap:wrap}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels #bs2nd-deck-edit #bs2nd-deck-edit-panel .unit-in-deck-blank-slot.svelte-haop3e{width:50px;height:50px;border-radius:25px;margin:10px;background-color:rgb(51, 51, 51)}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels #bs2nd-deck-edit button.svelte-haop3e{width:100px;margin:0 0 0 15px;border:solid 1px white;border-radius:10px;color:white;font-size:12px}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels #bs2nd-show-units-panel.svelte-haop3e{flex-grow:2;overflow-y:scroll;display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap;margin:10px 0 15px 0;width:100%;max-width:400px;border:solid 2px white;border-radius:20px;padding:25px 0 200px 0}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels #bs2nd-show-units-panel.svelte-haop3e::-webkit-scrollbar{width:5px}#bs2nd-screen.svelte-haop3e #bs2nd-edit-panels #bs2nd-show-units-panel.svelte-haop3e::-webkit-scrollbar-thumb{border-radius:2px}#bs2nd-screen.svelte-haop3e .panel-box h2.svelte-haop3e{margin:0 0 5px 0}#bs2nd-screen.svelte-haop3e .panel-box p.svelte-haop3e{margin:0 0 25px 0;font-size:12px}#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-slider.svelte-haop3e{position:fixed;top:50px;right:-250px;border:solid 2px white;border-radius:20px 0 0 20px}#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-panel.svelte-haop3e{border:solid 2px white;border-radius:10px}#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-slider.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-panel.svelte-haop3e{width:250px;height:550px;background:linear-gradient(90deg, black, rgba(0, 0, 0, 0.7));transition:0.3s;padding:5px 0 5px 5px}#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-slider.open.svelte-haop3e{right:-3px}#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-slider #bs2nd-deck-select-slider-button.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-panel #bs2nd-deck-select-slider-button.svelte-haop3e{position:absolute;border-top:solid 2px white;border-left:solid 2px white;border-bottom:solid 2px white;border-right:solid 4px black;background-color:black;border-radius:15px 0 0 15px;top:200px;left:-59px;width:60px;height:60px}#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-slider #bs2nd-deck-select-slider-button img.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-panel #bs2nd-deck-select-slider-button img.svelte-haop3e{width:40px;margin:8px auto;transition:0.5s 0.3s}#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-slider #bs2nd-deck-select-slider-button img.open.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-deck-select-panel #bs2nd-deck-select-slider-button img.open.svelte-haop3e{transform:rotate(180deg)}#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-slider.svelte-haop3e{position:fixed;bottom:80px;right:-300px;width:300px;height:600px;border:solid 2px white;border-radius:15px 0 0 15px}#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-panel.svelte-haop3e{width:300px;height:600px;border:solid 2px white;border-radius:10px}#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-slider.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-panel.svelte-haop3e{background:linear-gradient(45deg, black, rgba(0, 0, 0, 0.7));transition:0.3s;padding:5px}#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-slider.open.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-panel.open.svelte-haop3e{right:0}#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-slider #bs2nd-units-filter-slider-button.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-panel #bs2nd-units-filter-slider-button.svelte-haop3e{position:absolute;border-top:solid 2px white;border-left:solid 2px white;border-bottom:solid 2px white;border-right:solid 4px black;background-color:black;border-radius:15px 0 0 15px;bottom:10px;left:-59px;width:60px;height:60px}#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-slider #bs2nd-units-filter-slider-button img.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-panel #bs2nd-units-filter-slider-button img.svelte-haop3e{width:40px;margin:8px auto;transition:0.5s 0.3s}#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-slider #bs2nd-units-filter-slider-button img.open.svelte-haop3e,#bs2nd-screen.svelte-haop3e #bs2nd-units-filter-panel #bs2nd-units-filter-slider-button img.open.svelte-haop3e{transform:rotate(180deg)}",
      map: null
    };
    Edit_bs2nd = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_isDeckFullStore;
      let $deckStore, $$unsubscribe_deckStore;
      let $unitListStore, $$unsubscribe_unitListStore;
      let $isListLoading, $$unsubscribe_isListLoading;
      let $$unsubscribe_isBottomOfScroll;
      let $$unsubscribe_filterConditionStore;
      $$unsubscribe_isDeckFullStore = subscribe(isDeckFullStore, (value) => value);
      $$unsubscribe_deckStore = subscribe(deckStore, (value) => $deckStore = value);
      $$unsubscribe_unitListStore = subscribe(unitListStore, (value) => $unitListStore = value);
      $$unsubscribe_isListLoading = subscribe(isListLoading, (value) => $isListLoading = value);
      $$unsubscribe_isBottomOfScroll = subscribe(isBottomOfScroll, (value) => value);
      $$unsubscribe_filterConditionStore = subscribe(filterConditionStore, (value) => value);
      $$result.css.add(css25);
      $$unsubscribe_isDeckFullStore();
      $$unsubscribe_deckStore();
      $$unsubscribe_unitListStore();
      $$unsubscribe_isListLoading();
      $$unsubscribe_isBottomOfScroll();
      $$unsubscribe_filterConditionStore();
      return `<article id="${"bs2nd-screen"}" class="${"svelte-haop3e"}">${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `
        <section class="${"panel-box"}"><h2 class="${"svelte-haop3e"}">\u7D5E\u308A\u8FBC\u307F</h2>
            <p class="${"svelte-haop3e"}">\u672C\u5BB6\u30B2\u30FC\u30E0\u3068\u307B\u307C\u540C\u3058\u8981\u9818\u3067\u3001<br>\u30AD\u30E3\u30E9\u306E\u7D5E\u308A\u8FBC\u307F\u691C\u7D22\u304C\u3067\u304D\u307E\u3059\u3002</p>
            <section id="${"bs2nd-units-filter-panel"}" class="${escape(null_to_empty("")) + " svelte-haop3e"}">${validate_component(Main, "EditCompMain").$$render($$result, {}, {}, {})}
                <div id="${"bs2nd-units-filter-slider-button"}" class="${"svelte-haop3e"}"><img class="${escape(null_to_empty("")) + " svelte-haop3e"}" src="${"/img/arrow-circle-left-solid.svg"}" alt="${"\u21E6"}"></div></section></section>
        
    ` : ``}`;
        }
      })}
    <section id="${"bs2nd-edit-panels"}" class="${"svelte-haop3e"}"><section id="${"bs2nd-deck-edit"}" class="${"svelte-haop3e"}"><section id="${"bs2nd-deck-edit-panel"}" class="${"svelte-haop3e"}">${each($deckStore, (unit) => {
        return `${unit == void 0 ? `<div class="${"unit-in-deck-blank-slot svelte-haop3e"}"></div>` : `${validate_component(Kotodaman, "Kotodaman").$$render($$result, { kotodaman: unit }, {}, {})}`}`;
      })}</section>
            <button class="${"svelte-haop3e"}">\u30EA\u30BB\u30C3\u30C8</button></section>
        <section id="${"bs2nd-show-units-panel"}" class="${"svelte-haop3e"}">${each($unitListStore, (unit) => {
        return `${validate_component(Kotodaman, "Kotodaman").$$render($$result, { kotodaman: unit, full: true }, {}, {})}`;
      })}
            ${$isListLoading ? `<div style="${"margin-top:80px"}">${validate_component(Bs2ndLoader, "Bs2ndLoader").$$render($$result, {}, {}, {})}</div>` : ``}
            ${``}
            ${validate_component(InfiniteScroll, "InfiniteScroll").$$render($$result, { threshold: 100 }, {}, {})}</section></section>
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `
    <section id="${"bs2nd-deck-select-slider"}" class="${escape(null_to_empty("")) + " svelte-haop3e"}">${validate_component(Storage, "Storage").$$render($$result, {}, {}, {})}
        <div id="${"bs2nd-deck-select-slider-button"}" class="${"svelte-haop3e"}"><img class="${escape(null_to_empty("")) + " svelte-haop3e"}" src="${"/img/arrow-circle-left-solid.svg"}" alt="${"\u21E6"}"></div></section>
    <section id="${"bs2nd-units-filter-slider"}" class="${escape(null_to_empty("")) + " svelte-haop3e"}">${validate_component(Main, "EditCompMain").$$render($$result, {}, {}, {})}
        <div id="${"bs2nd-units-filter-slider-button"}" class="${"svelte-haop3e"}"><img class="${escape(null_to_empty("")) + " svelte-haop3e"}" src="${"/img/arrow-circle-left-solid.svg"}" alt="${"\u21E6"}"></div></section>
    ` : ``}`;
        }
      })}

    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
        default: ({ matches }) => {
          return `${matches ? `
    <section class="${"panel-box"}"><h2 class="${"svelte-haop3e"}">\u30C7\u30C3\u30AD\u30B9\u30C8\u30EC\u30FC\u30B8</h2>
        <p class="${"svelte-haop3e"}">\u7DE8\u6210\u3057\u305F\u30C7\u30C3\u30AD\u3092\u4FDD\u5B58\u3067\u304D\u307E\u3059\u3002<br>\u30C7\u30C3\u30AD\u306F\u3001\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306E<br>\u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306B\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002</p>
        <section id="${"bs2nd-deck-select-panel"}" class="${"svelte-haop3e"}">${validate_component(Storage, "Storage").$$render($$result, {}, {}, {})}</section></section>
    ` : ``}`;
        }
      })}
</article>`;
    });
  }
});

// .svelte-kit/output/server/nodes/8.js
var __exports14 = {};
__export(__exports14, {
  css: () => css26,
  entry: () => entry14,
  js: () => js14,
  module: () => edit_bs2nd_svelte_exports
});
var entry14, js14, css26;
var init__14 = __esm({
  ".svelte-kit/output/server/nodes/8.js"() {
    init_edit_bs2nd_svelte();
    entry14 = "pages/app/bakuzetsu-searcher-2nd/edit@bs2nd.svelte-0a86deca.js";
    js14 = ["pages/app/bakuzetsu-searcher-2nd/edit@bs2nd.svelte-0a86deca.js", "chunks/index-7e81b4c7.js", "chunks/summon-9a72bcab.js", "chunks/api-e2b0109c.js", "chunks/index-c0f974cf.js", "chunks/SvelteToast.svelte_svelte_type_style_lang-960f1691.js", "chunks/MediaQuery-7add008a.js", "chunks/bs2ndLoader-e7191b2f.js"];
    css26 = ["assets/pages/app/bakuzetsu-searcher-2nd/edit@bs2nd.svelte-df52c3c1.css", "assets/SvelteToast.svelte_svelte_type_style_lang-00aa1808.css", "assets/bs2ndLoader-8a29ed63.css"];
  }
});

// .svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/post@bs2nd.svelte.js
var post_bs2nd_svelte_exports = {};
__export(post_bs2nd_svelte_exports, {
  default: () => Post_bs2nd
});
var Post_bs2nd;
var init_post_bs2nd_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/bakuzetsu-searcher-2nd/post@bs2nd.svelte.js"() {
    init_index_2e97bc70();
    Post_bs2nd = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .svelte-kit/output/server/nodes/9.js
var __exports15 = {};
__export(__exports15, {
  css: () => css27,
  entry: () => entry15,
  js: () => js15,
  module: () => post_bs2nd_svelte_exports
});
var entry15, js15, css27;
var init__15 = __esm({
  ".svelte-kit/output/server/nodes/9.js"() {
    init_post_bs2nd_svelte();
    entry15 = "pages/app/bakuzetsu-searcher-2nd/post@bs2nd.svelte-92259ba7.js";
    js15 = ["pages/app/bakuzetsu-searcher-2nd/post@bs2nd.svelte-92259ba7.js", "chunks/index-7e81b4c7.js"];
    css27 = [];
  }
});

// .svelte-kit/output/server/entries/pages/app/pokemon-card-game-effector/__layout-pokeca.svelte.js
var layout_pokeca_svelte_exports = {};
__export(layout_pokeca_svelte_exports, {
  default: () => _layout_pokeca
});
var css28, _layout_pokeca;
var init_layout_pokeca_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/pokemon-card-game-effector/__layout-pokeca.svelte.js"() {
    init_index_2e97bc70();
    css28 = {
      code: "header.svelte-8xc0wm.svelte-8xc0wm{position:fixed;width:60%;max-width:500px;right:50px;padding:20px;z-index:100}header.svelte-8xc0wm .n2-logo.svelte-8xc0wm{display:flex;background:linear-gradient(135deg, rgb(0, 0, 0), rgba(0, 0, 0, 0.2));padding:20px}header.svelte-8xc0wm .n2-logo img.svelte-8xc0wm{width:40px}header.svelte-8xc0wm .n2-logo h1.svelte-8xc0wm{font-size:14px;margin:0 20px}article.svelte-8xc0wm.svelte-8xc0wm{position:relative;height:100vh;overflow:hidden}",
      map: null
    };
    _layout_pokeca = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css28);
      return `<header class="${"svelte-8xc0wm"}"><div class="${"n2-logo svelte-8xc0wm"}"><a href="${"/"}"><img src="${"/img/n2-icon-white.svg"}" alt="${""}" class="${"svelte-8xc0wm"}"></a>
        <h1 class="${"svelte-8xc0wm"}">Pokemon Card Game<br>Damage Counter Web Effector</h1></div></header>

<article class="${"svelte-8xc0wm"}">${slots.default ? slots.default({}) : ``}
</article>`;
    });
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports16 = {};
__export(__exports16, {
  css: () => css29,
  entry: () => entry16,
  js: () => js16,
  module: () => layout_pokeca_svelte_exports
});
var entry16, js16, css29;
var init__16 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    init_layout_pokeca_svelte();
    entry16 = "pages/app/pokemon-card-game-effector/__layout-pokeca.svelte-a511ce2c.js";
    js16 = ["pages/app/pokemon-card-game-effector/__layout-pokeca.svelte-a511ce2c.js", "chunks/index-7e81b4c7.js"];
    css29 = ["assets/pages/app/pokemon-card-game-effector/__layout-pokeca.svelte-0a8911ca.css"];
  }
});

// .svelte-kit/output/server/entries/pages/app/pokemon-card-game-effector/game@pokeca.svelte.js
var game_pokeca_svelte_exports = {};
__export(game_pokeca_svelte_exports, {
  default: () => Game_pokeca
});
var css$53, init_size, init_font_size, DamageKanComponent, css$43, PoisonKanComponent, css$33, BurnKanComponent, css$26, dx, dy, StorageComponent, css$18, CoinComponent, css30, Game_pokeca;
var init_game_pokeca_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/pokemon-card-game-effector/game@pokeca.svelte.js"() {
    init_index_2e97bc70();
    css$53 = {
      code: ".damage_kan.svelte-1ir98wy.svelte-1ir98wy{position:absolute;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:var(--id);top:var(--x);left:var(--y);width:var(--size);height:var(--size);border-radius:calc(var(--size) / 2);background:linear-gradient(45deg, rgb(0, 0, 0), rgba(0, 0, 0, 0.4));transform-origin:50%, 50%;transform:scale(var(--scale))}.damage_kan.svelte-1ir98wy img.svelte-1ir98wy{z-index:1;position:absolute;width:100%}.damage_kan.svelte-1ir98wy .damege_kan_mask.svelte-1ir98wy{z-index:2;position:absolute;width:100%;height:100%;border-radius:calc(var(--size) / 2);background-color:var(--color);opacity:0.8}.damage_kan.svelte-1ir98wy .effect-1.svelte-1ir98wy,.damage_kan.svelte-1ir98wy .effect-2.svelte-1ir98wy{position:absolute;width:var(--size);height:var(--size);border-radius:calc(var(--size) / 2);border-style:solid;border-width:3px;opacity:0;transform:scale(1)}.damage_kan.svelte-1ir98wy .effect-1.svelte-1ir98wy{z-index:3;border-color:#ffd000}.damage_kan.svelte-1ir98wy .effect-1.action-1.svelte-1ir98wy{animation:svelte-1ir98wy-damekanEffect 0.3s ease-out}.damage_kan.svelte-1ir98wy .effect-2.svelte-1ir98wy{z-index:4;border-color:#fe5420}.damage_kan.svelte-1ir98wy .effect-2.action-2.svelte-1ir98wy{animation:svelte-1ir98wy-damekanEffect 0.3s ease-out}@keyframes svelte-1ir98wy-damekanEffect{0%{transform:scale(1);border-width:5px;opacity:1}50%{transform:scale(1.2);border-width:5px;opacity:1}100%{transform:scale(1.2);border-width:0px;opacity:0}}.damage_kan.svelte-1ir98wy p.svelte-1ir98wy{z-index:5;user-select:none;color:white;font-size:var(--font_size);font-weight:bold;text-shadow:3px 3px 2px black}",
      map: null
    };
    init_size = 100;
    init_font_size = 40;
    DamageKanComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { model = { id: 1, x: 0, y: 0, counter: 0 } } = $$props;
      const init_color = [255, 200, 0];
      let size = init_size;
      let font_size = init_font_size;
      let scale = 1;
      let color = init_color;
      if ($$props.model === void 0 && $$bindings.model && model !== void 0)
        $$bindings.model(model);
      $$result.css.add(css$53);
      {
        {
          color[1] = 200 - model.counter / 2;
          scale = 1 + model.counter / 1e3;
        }
      }
      return `

<div class="${"damage_kan svelte-1ir98wy"}" style="${"--id:" + escape(model.id) + ";--x:" + escape(model.x) + "px; --y:" + escape(model.y) + "px; --size:" + escape(size) + "px; --scale:" + escape(scale) + ";"}"><img src="${"/img/pokeca/icon_white.svg"}" alt="${""}" class="${"svelte-1ir98wy"}">
    <div class="${"damege_kan_mask svelte-1ir98wy"}" style="${"--color:rgb(" + escape(color[0]) + "," + escape(color[1]) + "," + escape(color[2]) + ")"}"></div>
    <div class="${"effect-1 " + escape("") + " svelte-1ir98wy"}"></div>
    <div class="${"effect-2 " + escape("") + " svelte-1ir98wy"}"></div>
    <p style="${"--font_size:" + escape(font_size) + "px"}" class="${"svelte-1ir98wy"}">${escape(model.counter)}</p>
</div>`;
    });
    css$43 = {
      code: ".poison_marker.svelte-7gru3j{position:absolute;z-index:var(--id);top:var(--x);left:var(--y);display:flex;align-items:center;padding:5px;width:70px;height:70px;border-radius:35px;background:linear-gradient(45deg, #b051b7, #ff0088);border:solid 2px rgb(106, 0, 56);transform-origin:50%, 50%;transform:scale(1)}.poison_marker.mouse_up_action.svelte-7gru3j{animation:svelte-7gru3j-iconInPlay 1s ease-in-out}@keyframes svelte-7gru3j-iconInPlay{0%{transform:scale(1) rotateY(0)}80%{transform:scale(2) rotateY(1080deg)}100%{transform:scale(1) rotateY(1080deg)}}",
      map: null
    };
    PoisonKanComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { model = { id: 1, x: 0, y: 0, damage: 10 } } = $$props;
      if ($$props.model === void 0 && $$bindings.model && model !== void 0)
        $$bindings.model(model);
      $$result.css.add(css$43);
      return `

<div class="${"poison_marker " + escape("") + " svelte-7gru3j"}" style="${"--id:" + escape(model.id) + ";--x:" + escape(model.x) + "px; --y:" + escape(model.y) + "px;"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 522 416"}"><path d="${"M295.3 5.1 339.6 45c13.6 12.2 5.8 20.9 2 25l-8.9 10a170.9 170.9 0 0 1 33 71.8c1.8-1.2 3.5-2.4 5.3-3.4l-4.3-8.5c-1.3-2.6-5.1-10 .7-13l22.8-11.7c7-3.5 10.5 3.2 12.2 6.5l7 13.8a94.2 94.2 0 0 1 57.8 12.4l9.7-10.7c2-2.2 7.8-8.7 12.7-4.3l19 17.1c5.9 5.3.6 11-2 14l-9.9 11a94 94 0 0 1 13.9 79.7l2.8 1.3c2.6 1.2 10.3 4.6 7.7 10.6L510.7 290c-3.2 7.1-10.2 4-13.6 2.5l-5.2-2.3a94.4 94.4 0 0 1-53.7 32l-8.3 14.3-.4-.3-7.6 13.1a43 43 0 1 1-78.9 24.8 29 29 0 0 1-1-.3L299.3 359v-.1l-38-13.1-1.4-.5c-19 7.8-39.6 12.5-61.2 13.5l-1.2 18c-.3 4.3-1.2 17.2-10.8 16.5l-21.3-1.5-1.8-.1-14.6-1c-11.6-.8-10.8-12.4-10.4-18.1l1.5-20.5c-31.8-9-60-26.3-81.8-49.3L46.4 312c-3.5 2.7-13.6 10.7-19.6 3.1l-12.5-16-1.7-2.2-9-11.6c-7.2-9.1 2-16.3 6.5-19.8l15.3-12A169.8 169.8 0 0 1 41.8 87.3L25.3 66c-2.7-3.5-10.6-13.6 1.3-23 6.6-5 15.8-12.3 25.1-19.5l1.5-1.2.7-.6 1.7-1.3 18-14C87.9-5 95 4.3 98.5 8.7l14.8 19A183 183 0 0 1 258 24l14.6-16.1c3-3.3 11.6-12.9 22.8-2.8Zm44.5 275.2-.6.9a177.4 177.4 0 0 1-47 46.7l20.6 7.1v.1l38 13.1a43 43 0 0 1 56-12.8l6.3-10.9.4.3.6-1a94.4 94.4 0 0 1-74.3-43.5Zm-64.1-97.5c-3-6-10.5-8.5-16.6-5.5l-69 34.4-68.2-34.4a12.3 12.3 0 1 0-11 22.1l52 26.1-52 26a12.4 12.4 0 0 0 11 22.2l68.3-34.4 69 34.4a12.3 12.3 0 1 0 11-22.1l-52-26.1 52-26c6-3.1 8.5-10.5 5.5-16.7ZM189.8 77c-30.4 0-55.8 22-55.8 49.3a48.7 48.7 0 0 0 24.8 41v8.4c0 6.8 5.9 12.3 12.4 12.3h37.6c6.8 0 12.4-5.5 12.4-12.3v-8.4a48 48 0 0 0 24.8-41c0-27.2-25-49.3-56.2-49.3Zm-21.3 43c7.3 0 12.5 5.6 12.5 12.5 0 7-5.2 12.5-12.5 12.5-6.6 0-12.5-5.6-12.5-12.5 0-7 6-12.5 12.5-12.5Zm44 0a12.5 12.5 0 1 1 0 25 12.5 12.5 0 0 1 0-25Z"}" fill="${"#000"}" fill-rule="${"evenodd"}"></path></svg>
</div>`;
    });
    css$33 = {
      code: ".burn_marker.svelte-4lckll{position:absolute;z-index:var(--id);top:var(--x);left:var(--y);display:flex;justify-content:center;width:70px;height:70px;border-radius:35px;background:linear-gradient(45deg, #fc0000, #ff991d);border:solid 2px rgb(255, 238, 124);transform-origin:50%, 50%;transform:scale(1)}.burn_marker.mouse_up_action.svelte-4lckll{animation:svelte-4lckll-iconInPlay 1s ease-in-out}svg.svelte-4lckll{position:absolute;top:-5px;width:90%;height:90%;margin-bottom:20px}@keyframes svelte-4lckll-iconInPlay{0%{transform:scale(1) rotateX(0)}80%{transform:scale(2) rotateX(1080deg)}100%{transform:scale(1) rotateX(1080deg)}}",
      map: null
    };
    BurnKanComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { model = { id: 1, x: 0, y: 0, damage: 10 } } = $$props;
      if ($$props.model === void 0 && $$bindings.model && model !== void 0)
        $$bindings.model(model);
      $$result.css.add(css$33);
      return `

<div class="${"burn_marker " + escape("") + " svelte-4lckll"}" style="${"--id:" + escape(model.id) + ";--x:" + escape(model.x) + "px; --y:" + escape(model.y) + "px;"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 358 391"}" class="${"svelte-4lckll"}"><path d="${"M170.5 319.9V391a172 172 0 0 1-53.4-9.7c-2.5-18.3-4-34-4.8-47.4 6-2.2 10.6-7.3 12-13.6l.2-.4h46Zm10.4 0h45.6c1.4 6.6 6.3 12 12.6 14.1-.8 13.3-2.3 29-4.7 47.2-16 5.7-34.1 9.2-53.5 9.8v-71.1Zm157.9-83c0 7-.3 15-1 22.5l.3.3.3.4.7.8 1 1.3c2.2 2.5 4.4 5.2 6.2 8.2 7.5 12.4 7.7 34 7.7 40.6l4-8.1v43.4c0 15.2-11.7 34.7-25.8 34.7-14 0-25.2-19.5-25.2-34.7a327 327 0 0 1 4.2-35c0-6.1 1-17.7 11.8-31.5 3.6-4.6 7-12.7 10.2-22.3l.2-.7-.2-1-.4-2.3-.2-1.1-.2-.3c-5-8.5-7.3-20.1.1-42.7 17.5-53 15.4-11.5 6.3 27.6Zm-319.9-1c-8.9-38.8-10.7-79 6.6-26.5 7.4 22.6 5.2 34.2 0 42.7v.3l-.3 1-.4 2.3-.2 1.1.2.7A78.5 78.5 0 0 0 35 279.8a49.8 49.8 0 0 1 11.8 31.4 327 327 0 0 1 4.2 35c0 15.3-11.1 34.8-25.2 34.8S0 361.5 0 346.3v-43.4l4 8.1c0-6.6.2-28.2 7.7-40.6 1.8-3 4-5.7 6.2-8.2l1-1.3.7-.8.3-.4.3-.3-.1-1.3c-.6-7.1-1-14.7-.9-21.1Zm90.2 18c-3 16.4-5 30.8-6.2 43.1a19.1 19.1 0 0 0-.2 37.8c1 12.3 3 26.7 6.2 43.3C77.6 364.6 57 341.8 57 316c0-25.7 20.4-48.4 51.5-62l.6-.2Zm133.2.1c31.2 13.5 51.7 36.2 51.7 62 0 25.7-20.4 48.4-51.5 61.9 3.1-16.5 5.2-30.9 6.2-43.2a19.1 19.1 0 0 0-.2-37.6 512.8 512.8 0 0 0-6.1-42.8v-.3Zm94.3 14.9c-.3 2-.6 4-1 5.7-2.2 9.8-6.8 9.8-12 20.3a88.8 88.8 0 0 0-7.5 21.1l6.8 13.6 9.6-26.7 11.8 25.6c2.6-3.4 4-8 4.2-13.2v-.7c0-3.1-.4-23.6-6-32.6-2-3-3.9-7.4-5.6-12.3l-.2-.7v-.1Zm-315.2 0v.1l-.3.7c-1.7 5-3.7 9.2-5.6 12.3-5.6 9-6 29.5-6 32.6v.7c.1 5.2 1.6 9.8 4.2 13.2l11.8-25.6 9.6 26.7L42 316c-.7-4.8-4-13.8-7.5-21-5.2-10.6-9.8-10.6-12-20.4l-1-5.6v-.1Zm207-219c-31.8 29-45 42.5-50 50a27 27 0 0 0 .3 11.9l.7.1 1.4.3c23.2 5 44.3 10.8 41.9 25.6 4.7 4.1 6.2 9.7 2.3 17.4l-3.2 6.7-.4 1c11-.6 34-7.3 75-22.3 23.6-8.6-49.5 74-105.9 94l4 7.3h.6l29.9-23.8v29.7c3.2.9 6.2 1.9 9.2 3 2.3 18.2 4 33.9 4.7 47a19.1 19.1 0 0 0-12.3 13.8v.3h-45.7V252h-10.4v60h-46c-1.4-6.5-6-11.8-12-14a748 748 0 0 1 4.7-47.4c2.9-1 5.8-2 8.8-2.8v-14.2c-30.1-8.8-46.8-27.6-47-52.3-.2-23.2 40.7-68 30.7-40.7-12 32.3 31.6 21.8 44.1 7.3 10-11.6 15.7-19.3 18.9-24.7l.1-.3c-18.4-3.7-33.8-8.3-31.6-19.6l.1-.6c-11-4-17.9-9.5-15.5-18.2 8.4-31 231.6-151.3 102.7-34.5Zm105.7 204.7-.4 1.2-.3 1c.8 3.8 1.7 7.4 2.8 10.8l.3.9.1.4.1-.7 1-7.7v-1.1l-.5-.8-2.4-3-.6-.8-.1-.2Zm-310.2 0-.1.2-.6.8-2.4 3-.6.8.1 1.1 1 7.7v.7l.2-.4.3-1c1-3.3 2-7 2.8-10.7l-.2-.5-.1-.5-.4-1.2Zm309.5-28.2c-2.3 7.7-2.2 17-.8 26l.9 1.3.4.7.2.2.1-.4c1.5-5 3-10.3 4.2-15.6l.4-1.6v-.4c-.1-13.8-1.8-22.3-5.4-10.2Zm-308.8 0c-3.6-12-5.3-3.6-5.4 10.2v.4l.4 1.6c1.3 5.3 2.7 10.6 4.2 15.6l.1.4.2-.2.4-.7 1-1.3v-.8a60.6 60.6 0 0 0-.9-25.2Zm126.6 11.8 4.7 3.8 1.8-3.3-6.5-.5ZM184 125.1l.3.6c3 8 3.5 18-8.6 37.5-7.5 12-56.8 46.1-49.7 19.2 6-22.7-20.3-10.4-20.2 9 .1 15 8 27.2 20.2 35.6V218l23.5 18.8a83 83 0 0 0 8.4 1.5l17.3-31.4 14.2 25.6c35.3-18.3 80.4-69 67.3-62.4-42.4 21.5-41.4 7.2-35.3-7.4-11.3.6-10.1-5.2-3.4-14.9 2.6-3.6 4-6.9 4.6-9.8v-.3c-6.7-6-20-9-34-11.8l-1.3-.3-1.4-.3-.7-.1-1.2-.2Zm-7.8-13.8v.2c.4 2.3 0 5.4-3.4 11.4l11 2.1h.2c-1.6-4.1-3.8-7.9-5.1-12.4l-.2-.8-1.8-.4-.7-.1Zm-34.8-8.8v.2l.7.3c8.3 3 19 5.2 29.7 7.4l3.4.7 1 .2v-.1l-.4-1.7-.1-.4c-.6-2.1-.7-4.2 2.4-9l.3-.3c1.8-9.6 8.5-23 25.4-44.4 76.5-96.2-55 19.7-62.4 47.1Z"}" fill="${"#000"}" fill-rule="${"evenodd"}"></path></svg>
</div>`;
    });
    css$26 = {
      code: ".storage-box.svelte-4zrbs2{position:absolute;right:var(--dx);top:var(--dy);width:120px;height:500px;background:linear-gradient(\n            127deg,\n            rgb(0, 0, 0),\n            rgb(26, 32, 53)\n        );box-shadow:5px 10px 2px rgba(255,255,255,0.3);border-radius:5px;display:flex;flex-direction:column;align-items:center;justify-content:center}button.svelte-4zrbs2{position:absolute;right:10px;bottom:10px;background:white;--size:40px;width:var(--size);height:var(--size);border-radius:calc( var(--size) / 2)}",
      map: null
    };
    dx = 40;
    dy = 250;
    StorageComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const initPositionPoisonKan = { id: 100, x: 180, y: 25, damage: 10 };
      const initPositionBurnKan = { id: 100, x: 280, y: 25, damage: 10 };
      let damageKanArray = [];
      let poisonKan = Object.assign({}, initPositionPoisonKan);
      let burnKan = Object.assign({}, initPositionBurnKan);
      $$result.css.add(css$26);
      return `<div class="${"storage-box svelte-4zrbs2"}" style="${"--dx:" + escape(dx) + "px;--dy:" + escape(dy) + "px;"}">${each(damageKanArray, (item) => {
        return `${validate_component(DamageKanComponent, "DamageKanComponent").$$render($$result, { model: item }, {}, {})}`;
      })}
    ${validate_component(PoisonKanComponent, "PoisonKanComponent").$$render($$result, { model: poisonKan }, {}, {})}
    ${validate_component(BurnKanComponent, "BurnKanComponent").$$render($$result, { model: burnKan }, {}, {})}
<button class="${"svelte-4zrbs2"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 501 503"}"><path d="${"m300.2 272.2 36.2 60.2a43 43 0 0 0 47.8 18.9l84.1-24v110c0 14.6-9.9 27.2-24 30.8l-134.6 33.6a41.3 41.3 0 0 1-20.4 0l-134.6-33.6a31.7 31.7 0 0 1-24-30.7V327.3l84.1 24a43 43 0 0 0 47.8-18.9l36.2-60.2h1.4ZM138.4 209l161.1 19.5-54.9 91.6a20.7 20.7 0 0 1-23.8 10l-107.5-30.8a21 21 0 0 1-13-29.7l27.4-54.9c2-4 6.3-6.3 10.7-5.7Zm333 5.7 27.4 55c5.8 11.7-.4 26-13.1 29.6l-107.5 30.8c-9.1 2.5-19-1.3-23.8-10l-54.9-91.6 161.1-19.5c4.4-.6 8.7 1.7 10.7 5.7ZM181.5 1.5c58.8 9.2 109 42.5 150.7 100.1l21-5.4-6-35L369.4 92l3.8-1-9-31.4 23.1 27.7 33.2-8.6c22.1-6-66.4 126.3-83.1 130.1-16.7 4-182-60.6-156.8-67.5l32.2-8.6-2.2-30.6 14.3 27.5 6.7-1.8-5.7-33 20.5 29.1 12.5-3.2C239.3 82.3 201.8 59.9 146 53.5c-63-7.3-111.3 14.2-145 64.5l-1 1.5 1.6-2.6C57.7 30 117.6-8.4 181.7 1.5ZM269 164l3.3 18.4 38.1 15v-4.8L269 164Zm101-21-19 40v8l19-27.5V143Z"}" fill="${"#000"}" fill-rule="${"nonzero"}"></path></svg></button>
</div>`;
    });
    css$18 = {
      code: '@charset "UTF-8";.coin.svelte-5wjeil.svelte-5wjeil{position:absolute;width:70px;position:relative;cursor:pointer}.coin.svelte-5wjeil.svelte-5wjeil::before{content:"";display:block;padding-top:142.5%}.coin.svelte-5wjeil svg.svelte-5wjeil{width:100%}.coin.svelte-5wjeil .back.svelte-5wjeil,.coin.svelte-5wjeil .front.svelte-5wjeil{transition:all 1s;position:absolute;top:0;left:0;height:100%;width:100%;backface-visibility:hidden;animation-fill-mode:forwards;--duration:1.0s;--timing:ease-in-out}.coin.svelte-5wjeil .back.svelte-5wjeil{transform:rotateX(-180deg)}.coin.flip.svelte-5wjeil .front.svelte-5wjeil{transform:rotateX(-180deg)}.coin.flip.svelte-5wjeil .back.svelte-5wjeil{transform:rotateX(0)}.coin.openFrontFlip.svelte-5wjeil .front.svelte-5wjeil{animation:svelte-5wjeil-parabolicMovement var(--duration) var(--timing), svelte-5wjeil-frontOpenFrontFlip var(--duration) linear forwards}.coin.openFrontFlip.svelte-5wjeil .back.svelte-5wjeil{animation:svelte-5wjeil-parabolicMovement var(--duration) var(--timing), svelte-5wjeil-backOpenFrontFlip var(--duration) linear forwards}.coin.openBackFlip.svelte-5wjeil .front.svelte-5wjeil{animation:svelte-5wjeil-parabolicMovement var(--duration) var(--timing), svelte-5wjeil-frontOpenBackFlip var(--duration) linear forwards}.coin.openBackFlip.svelte-5wjeil .back.svelte-5wjeil{animation:svelte-5wjeil-parabolicMovement var(--duration) var(--timing), svelte-5wjeil-backOpenBackFlip var(--duration) linear forwards}@keyframes svelte-5wjeil-frontOpenFrontFlip{0%{transform:rotateX(0deg)}100%{transform:rotateX(2160deg)}}@keyframes svelte-5wjeil-backOpenFrontFlip{0%{transform:rotateX(-180deg)}100%{transform:rotateX(1980deg)}}@keyframes svelte-5wjeil-frontOpenBackFlip{0%{transform:rotateX(0deg)}100%{transform:rotateX(1980deg)}}@keyframes svelte-5wjeil-backOpenBackFlip{0%{transform:rotateX(-180deg)}100%{transform:rotateX(1800deg)}}@keyframes svelte-5wjeil-parabolicMovement{0%{top:0;transform:rotateZ(0)}50%{top:-120px}100%{top:0;transform:rotateZ(720deg)}}',
      map: null
    };
    CoinComponent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$18);
      return `<div class="${"coin " + escape("") + " " + escape("") + " " + escape("") + " svelte-5wjeil"}"><div class="${"front svelte-5wjeil"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 284 284"}" class="${"svelte-5wjeil"}"><g fill="${"none"}" fill-rule="${"evenodd"}"><circle fill="${"#000"}" cx="${"142"}" cy="${"142"}" r="${"142"}"></circle><circle fill="${"#F2EE9D"}" cx="${"142.5"}" cy="${"142.5"}" r="${"131.5"}"></circle><path d="${"M92.2 21C114 29.8 125 36 125 39.4c0 1.8-6.3 5.5-13 9.3l-1.3.7c-7.2 4-14.3 8.2-14.3 10 0 2 7.4 6.4 14.7 10.7l.9.5c6.7 4 13 8 13 10.1 0 3.3-71.6 71.5-71.6 104 0 12 14.7 39.2 44.2 81.3A130.5 130.5 0 0 1 34.9 64.5c2-2.7 3-6.4 3.9-10.1l.4-1.5c1-4.5 2.2-8.8 5-11.5 5.2-4.9 17-3.4 23-7.4 7.6-5 15.8-9.4 24.5-12.8Z"}" fill="${"#C0A06E"}"></path><path d="${"M192.8 21C171 29.8 160 36 160 39.4c0 1.8 6.3 5.5 13 9.3l1.3.7c7.2 4 14.3 8.2 14.3 10 0 2-7.4 6.4-14.7 10.7l-.9.5c-6.7 4-13 8-13 10.1 0 3.3 71.6 71.5 71.6 104 0 12-14.7 39.2-44.2 81.3a130.5 130.5 0 0 0 62.7-201.5c-2-2.7-3-6.4-3.9-10.1l-.4-1.5c-1-4.5-2.2-8.8-5-11.5-5.2-4.9-17-3.4-23-7.4-7.6-5-15.8-9.4-24.5-12.8Z"}" fill="${"#6B6B6B"}"></path><g transform="${"translate(54 106)"}"><circle fill="${"#000"}" cx="${"27.5"}" cy="${"27.5"}" r="${"27.5"}"></circle><circle fill="${"#FFF"}" cx="${"27.7"}" cy="${"27.3"}" r="${"10.5"}"></circle></g><g transform="${"translate(175 106)"}"><circle fill="${"#000"}" cx="${"27.5"}" cy="${"27.5"}" r="${"27.5"}"></circle><circle fill="${"#FFF"}" cx="${"27.7"}" cy="${"27.3"}" r="${"10.5"}"></circle></g><circle fill="${"#E9ACB5"}" cx="${"49"}" cy="${"174"}" r="${"24"}"></circle><circle fill="${"#E9ACB5"}" cx="${"233"}" cy="${"180"}" r="${"24"}"></circle><ellipse fill="${"#000"}" cx="${"142.5"}" cy="${"170.5"}" rx="${"7.5"}" ry="${"3.5"}"></ellipse></g></svg></div>
    <div class="${"back svelte-5wjeil"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 284 284"}" class="${"svelte-5wjeil"}"><g fill="${"none"}" fill-rule="${"evenodd"}"><circle fill="${"#000"}" cx="${"142"}" cy="${"142"}" r="${"142"}"></circle><circle fill="${"#805593"}" cx="${"142.5"}" cy="${"142.5"}" r="${"131.5"}"></circle><path d="${"M92.2 21C114 29.8 125 36 125 39.4c0 1.8-6.3 5.5-13 9.3l-1.3.7c-7.2 4-14.3 8.2-14.3 10 0 2 7.4 6.4 14.7 10.7l.9.5c6.7 4 13 8 13 10.1 0 3.3-71.6 71.5-71.6 104 0 12 14.7 39.2 44.2 81.3A130.5 130.5 0 0 1 34.9 64.5c2-2.7 3-6.4 3.9-10.1l.4-1.5c1-4.5 2.2-8.8 5-11.5 5.2-4.9 17-3.4 23-7.4 7.6-5 15.8-9.4 24.5-12.8ZM192.8 21C171 29.8 160 36 160 39.4c0 1.8 6.3 5.5 13 9.3l1.3.7c7.2 4 14.3 8.2 14.3 10 0 2-7.4 6.4-14.7 10.7l-.9.5c-6.7 4-13 8-13 10.1 0 3.3 71.6 71.5 71.6 104 0 12-14.7 39.2-44.2 81.3a130.5 130.5 0 0 0 62.7-201.5c-2-2.7-3-6.4-3.9-10.1l-.4-1.5c-1-4.5-2.2-8.8-5-11.5-5.2-4.9-17-3.4-23-7.4-7.6-5-15.8-9.4-24.5-12.8Z"}" fill="${"#6B6B6B"}"></path><circle fill="${"#E9ACB5"}" cx="${"49"}" cy="${"174"}" r="${"24"}"></circle><circle fill="${"#E9ACB5"}" cx="${"233"}" cy="${"174"}" r="${"24"}"></circle><ellipse fill="${"#000"}" cx="${"142.5"}" cy="${"170.5"}" rx="${"7.5"}" ry="${"3.5"}"></ellipse><path d="${"M41.7 94.7a257.3 257.3 0 0 0 34.8 23.6c9.5 5.1 25 12.4 46.5 21.7-24.7 16.9-44 21.4-58 13.5-14-7.9-21.7-27.5-23.3-58.8Z"}" fill="${"#000"}"></path><path d="${"M47.6 102c11.4 8.9 21.2 15.5 29.2 19.8 8 4.3 21 10.4 39.1 18.2-20.8 14.3-37 18.1-48.8 11.5C55.4 145 49 128.4 47.6 102Z"}" fill="${"#C52621"}"></path><g><path d="${"M243 94.7a257.3 257.3 0 0 1-34.7 23.6c-9.6 5.1-25 12.4-46.5 21.7 24.7 16.9 44 21.4 58 13.5 14-7.9 21.7-27.5 23.3-58.8Z"}" fill="${"#000"}"></path><path d="${"M237.2 102c-11.5 8.9-21.2 15.5-29.2 19.8-8 4.3-21 10.4-39.1 18.2 20.7 14.3 37 18.1 48.8 11.5 11.7-6.6 18.2-23.1 19.5-49.6Z"}" fill="${"#C52621"}"></path></g></g></svg></div>
</div>`;
    });
    css30 = {
      code: "section.svelte-36c78a.svelte-36c78a{position:absolute;width:100vw;height:100vh}#video-layor.svelte-36c78a.svelte-36c78a{display:flex;justify-content:center;overflow:hidden}#video-layor.svelte-36c78a video.svelte-36c78a{position:absolute;top:0;bottom:0;height:95%;margin:auto 0}#effect-layor.svelte-36c78a.svelte-36c78a{right:0;width:0px;height:100vh}#coin-layor.svelte-36c78a.svelte-36c78a{position:fixed;width:0;height:0;bottom:120px;left:40px}",
      map: null
    };
    Game_pokeca = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css30);
      return `<section id="${"video-layor"}" class="${"svelte-36c78a"}"><video id="${"web-video"}" class="${"svelte-36c78a"}"><track kind="${"captions"}"></video></section>

<section id="${"effect-layor"}" class="${"svelte-36c78a"}">${validate_component(StorageComponent, "StorageComponent").$$render($$result, {}, {}, {})}</section>
<section id="${"coin-layor"}" class="${"svelte-36c78a"}">${validate_component(CoinComponent, "CoinComponent").$$render($$result, {}, {}, {})}
</section>`;
    });
  }
});

// .svelte-kit/output/server/nodes/10.js
var __exports17 = {};
__export(__exports17, {
  css: () => css31,
  entry: () => entry17,
  js: () => js17,
  module: () => game_pokeca_svelte_exports
});
var entry17, js17, css31;
var init__17 = __esm({
  ".svelte-kit/output/server/nodes/10.js"() {
    init_game_pokeca_svelte();
    entry17 = "pages/app/pokemon-card-game-effector/game@pokeca.svelte-0db8197e.js";
    js17 = ["pages/app/pokemon-card-game-effector/game@pokeca.svelte-0db8197e.js", "chunks/index-7e81b4c7.js"];
    css31 = ["assets/pages/app/pokemon-card-game-effector/game@pokeca.svelte-bedc7923.css"];
  }
});

// .svelte-kit/output/server/chunks/TCGsimStore-f57989de.js
var cardWidth, modeStore, movingStore, exDeckListStore, deckListStore, handListStore, boardListStore, unshuffleDeckListStore, unshuffleExDeckListStore, boardAreaInfoStore, handAreaInfoStore, deckAreaInfoStore;
var init_TCGsimStore_f57989de = __esm({
  ".svelte-kit/output/server/chunks/TCGsimStore-f57989de.js"() {
    init_index_96622166();
    cardWidth = readable2(90);
    readable2(110);
    modeStore = writable2("dark");
    movingStore = writable2(false);
    exDeckListStore = writable2([]);
    deckListStore = writable2([]);
    handListStore = writable2([]);
    boardListStore = writable2([]);
    unshuffleDeckListStore = writable2([]);
    unshuffleExDeckListStore = writable2([]);
    boardAreaInfoStore = writable2({ top: 0, left: 0, right: 0, bottom: 0 });
    handAreaInfoStore = writable2({ top: 0, left: 0, right: 0, bottom: 0 });
    deckAreaInfoStore = writable2({ top: 0, left: 0, right: 0, bottom: 0 });
  }
});

// .svelte-kit/output/server/entries/pages/app/tcg-simulator/__layout-tcg.svelte.js
var layout_tcg_svelte_exports = {};
__export(layout_tcg_svelte_exports, {
  default: () => _layout_tcg
});
var css32, _layout_tcg;
var init_layout_tcg_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/tcg-simulator/__layout-tcg.svelte.js"() {
    init_index_2e97bc70();
    init_ToastArea_32d9fee1();
    init_TCGsimStore_f57989de();
    init_index_96622166();
    css32 = {
      code: '@charset "UTF-8";:root{--header-height:40px;--cw:90px;--ch:110px}#tcg-all-compnents.svelte-c83jr6.svelte-c83jr6{display:flex;justify-content:space-between;top:0;left:0;right:0;bottom:0;overflow-y:scroll;-ms-overflow-style:none;scrollbar-width:none}#tcg-all-compnents.svelte-c83jr6.svelte-c83jr6::-webkit-scrollbar{display:none}header.svelte-c83jr6.svelte-c83jr6{display:flex;justify-content:space-between;height:var(--header-height)}header.svelte-c83jr6 .n2-logo.svelte-c83jr6{padding:10px}header.svelte-c83jr6 .n2-logo img.svelte-c83jr6{height:20px}header.svelte-c83jr6 .color-config.svelte-c83jr6{margin:0 20px 0 0;display:flex;align-items:center}header.svelte-c83jr6 .color-config button.svelte-c83jr6{width:25px;height:25px;margin:0 7px;border-radius:7px}header.svelte-c83jr6 .color-config .light.svelte-c83jr6{background:white}header.svelte-c83jr6 .color-config .dark.svelte-c83jr6{background:darkblue}#screen.svelte-c83jr6.svelte-c83jr6{display:flex;flex-direction:column;justify-content:center;width:calc(100vw - 70px);height:calc(100vh - 40px)}#screen.svelte-c83jr6 #base.svelte-c83jr6{width:1100px;height:760px;margin:0 auto;-moz-perspective:500;-webkit-perspective:500;-o-perspective:500;-ms-perspective:500;perspective:500}#screen.svelte-c83jr6 #base.light.svelte-c83jr6{background:rgb(255, 255, 255);background:radial-gradient(circle at bottom, rgb(255, 255, 255) 0%, rgb(255, 236, 192) 100%)}#screen.svelte-c83jr6 #base.dark.svelte-c83jr6{background:rgb(36, 24, 110);background:radial-gradient(circle at bottom, rgb(36, 24, 110) 0%, rgb(0, 0, 0) 100%)}footer.svelte-c83jr6.svelte-c83jr6{top:0;bottom:0;right:0;width:70px;display:flex;flex-direction:column;justify-content:space-around}footer.light.svelte-c83jr6.svelte-c83jr6{background:white}footer.dark.svelte-c83jr6.svelte-c83jr6{background:black}footer.svelte-c83jr6 a div.svelte-c83jr6{width:50px;height:50px;background:yellow}',
      map: null
    };
    _layout_tcg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $modeStore, $$unsubscribe_modeStore;
      $$unsubscribe_modeStore = subscribe(modeStore, (value) => $modeStore = value);
      $$result.css.add(css32);
      $$unsubscribe_modeStore();
      return `<header class="${"svelte-c83jr6"}"><div class="${"n2-logo svelte-c83jr6"}"><a href="${"/"}"><img src="${"/img/n2-icon-white.svg"}" alt="${""}" class="${"svelte-c83jr6"}"></a></div>
    <div class="${"color-config svelte-c83jr6"}"><button class="${"light svelte-c83jr6"}"></button>
        <button class="${"dark svelte-c83jr6"}"></button></div></header>
<div id="${"tcg-all-compnents"}" class="${"svelte-c83jr6"}"><article id="${"screen"}" class="${"svelte-c83jr6"}"><section id="${"base"}" class="${escape(null_to_empty($modeStore)) + " svelte-c83jr6"}">${slots.default ? slots.default({}) : ``}</section></article>
    
    <footer class="${escape(null_to_empty($modeStore)) + " svelte-c83jr6"}"><a href="${"/app/tcg-simulator/game"}"><div class="${"svelte-c83jr6"}"></div></a>
        <a href="${"/app/tcg-simulator/edit"}"><div class="${"svelte-c83jr6"}"></div></a></footer></div>
${validate_component(ToastArea, "ToastArea").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports18 = {};
__export(__exports18, {
  css: () => css33,
  entry: () => entry18,
  js: () => js18,
  module: () => layout_tcg_svelte_exports
});
var entry18, js18, css33;
var init__18 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    init_layout_tcg_svelte();
    entry18 = "pages/app/tcg-simulator/__layout-tcg.svelte-3d94c86d.js";
    js18 = ["pages/app/tcg-simulator/__layout-tcg.svelte-3d94c86d.js", "chunks/index-7e81b4c7.js", "chunks/ToastArea-eba10419.js", "chunks/SvelteToast.svelte_svelte_type_style_lang-960f1691.js", "chunks/index-c0f974cf.js", "chunks/TCGsimStore-135f7582.js"];
    css33 = ["assets/pages/app/tcg-simulator/__layout-tcg.svelte-19e6123b.css", "assets/ToastArea-00e911a5.css", "assets/SvelteToast.svelte_svelte_type_style_lang-00aa1808.css"];
  }
});

// .svelte-kit/output/server/entries/pages/app/tcg-simulator/edit@tcg.svelte.js
var edit_tcg_svelte_exports = {};
__export(edit_tcg_svelte_exports, {
  default: () => Edit_tcg
});
var css34, Edit_tcg;
var init_edit_tcg_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/tcg-simulator/edit@tcg.svelte.js"() {
    init_index_2e97bc70();
    init_TCGsimStore_f57989de();
    init_index_96622166();
    css34 = {
      code: ":root{--card-width:85px;--card-margin:5px}img.svelte-ds7p2u{border-radius:10px;width:var(--card-width);margin:var(--card-margin)}#deck.svelte-ds7p2u,#exdeck.svelte-ds7p2u{display:flex;width:calc(var(--card-width) * 10 + var(--card-margin) * 20);margin:0 auto;flex-wrap:wrap}",
      map: null
    };
    Edit_tcg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_exDeckListStore;
      let $$unsubscribe_deckListStore;
      let $unshuffleDeckListStore, $$unsubscribe_unshuffleDeckListStore;
      let $unshuffleExDeckListStore, $$unsubscribe_unshuffleExDeckListStore;
      $$unsubscribe_exDeckListStore = subscribe(exDeckListStore, (value) => value);
      $$unsubscribe_deckListStore = subscribe(deckListStore, (value) => value);
      $$unsubscribe_unshuffleDeckListStore = subscribe(unshuffleDeckListStore, (value) => $unshuffleDeckListStore = value);
      $$unsubscribe_unshuffleExDeckListStore = subscribe(unshuffleExDeckListStore, (value) => $unshuffleExDeckListStore = value);
      $$result.css.add(css34);
      $$unsubscribe_exDeckListStore();
      $$unsubscribe_deckListStore();
      $$unsubscribe_unshuffleDeckListStore();
      $$unsubscribe_unshuffleExDeckListStore();
      return `<input type="${"file"}" webkitdirectory>
<section id="${"deck"}" class="${"svelte-ds7p2u"}">${each($unshuffleDeckListStore, (d) => {
        return `<img${add_attribute("src", d.url, 0)} alt="${""}" class="${"svelte-ds7p2u"}">`;
      })}</section>
<section id="${"exdeck"}" class="${"svelte-ds7p2u"}">${each($unshuffleExDeckListStore, (e2) => {
        return `<img${add_attribute("src", e2.url, 0)} alt="${""}" class="${"svelte-ds7p2u"}">`;
      })}
</section>`;
    });
  }
});

// .svelte-kit/output/server/nodes/11.js
var __exports19 = {};
__export(__exports19, {
  css: () => css35,
  entry: () => entry19,
  js: () => js19,
  module: () => edit_tcg_svelte_exports
});
var entry19, js19, css35;
var init__19 = __esm({
  ".svelte-kit/output/server/nodes/11.js"() {
    init_edit_tcg_svelte();
    entry19 = "pages/app/tcg-simulator/edit@tcg.svelte-58cf6ffe.js";
    js19 = ["pages/app/tcg-simulator/edit@tcg.svelte-58cf6ffe.js", "chunks/index-7e81b4c7.js", "chunks/TCGsimStore-135f7582.js", "chunks/index-c0f974cf.js", "chunks/deck-b8dd20f8.js"];
    css35 = ["assets/pages/app/tcg-simulator/edit@tcg.svelte-ae052115.css", "assets/deck-d908b596.css"];
  }
});

// .svelte-kit/output/server/entries/pages/app/tcg-simulator/game@tcg.svelte.js
var game_tcg_svelte_exports = {};
__export(game_tcg_svelte_exports, {
  default: () => Game_tcg
});
function handLineupGuideFunction(x2) {
  return -1 * Math.sqrt(Math.pow(handLineupGuideRadius, 2) - Math.pow(x2, 2));
}
var css$34, Card, css$27, Deck, css$19, handLineupGuideRadius, Hand, css36, Game_tcg;
var init_game_tcg_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/app/tcg-simulator/game@tcg.svelte.js"() {
    init_index_2e97bc70();
    init_TCGsimStore_f57989de();
    init_index_96622166();
    css$34 = {
      code: ":root{--guide-color:#ffbb00}img.svelte-e02kpp.svelte-e02kpp{-webkit-user-drag:none;border-radius:5px}.card-body.svelte-e02kpp.svelte-e02kpp{position:absolute;z-index:100;left:var(--pos_x);top:var(--pos_y);width:var(--cw);height:var(--ch);cursor:move}.card-body.noBoard.svelte-e02kpp.svelte-e02kpp{transition:0.2s}.card-body.movin.svelte-e02kpp.svelte-e02kpp{transition:none}.card-body.movin.svelte-e02kpp .card-surface.svelte-e02kpp{filter:grayscale(100%) blur(2px)}.card-body.noGuide.svelte-e02kpp .card-surface.svelte-e02kpp{filter:none}.card-body.svelte-e02kpp .card-surface.svelte-e02kpp{position:absolute;transform:rotate(var(--rotate));transition:0.2s;width:100%;height:100%;-moz-perspective:500;-webkit-perspective:500;-o-perspective:500;-ms-perspective:500;perspective:500;transition:0.2s}.card-body.svelte-e02kpp .card-surface .front.svelte-e02kpp,.card-body.svelte-e02kpp .card-surface .back.svelte-e02kpp{transition:0.2s;position:absolute;left:8px;backface-visibility:hidden}.card-body.svelte-e02kpp .card-surface .front img.svelte-e02kpp,.card-body.svelte-e02kpp .card-surface .back img.svelte-e02kpp{width:calc(var(--cw) - 16px);z-index:10000}.card-body.svelte-e02kpp .card-surface .back.svelte-e02kpp{transform:rotateY(-180deg)}.card-body.svelte-e02kpp .card-surface.flippin .front.svelte-e02kpp{transform:rotateY(-180deg)}.card-body.svelte-e02kpp .card-surface.flippin .back.svelte-e02kpp{transform:rotateY(0deg)}.card-body.svelte-e02kpp .card-guide.svelte-e02kpp{position:absolute;--scaleup-width:10px;--scaleup-height:50px;left:calc(-1 * var(--scaleup-width) / 2);top:calc(-1 * var(--scaleup-height) / 2);width:calc(var(--cw) + var(--scaleup-width));height:calc(var(--ch) + var(--scaleup-height));border-radius:10px}.card-body.svelte-e02kpp .card-guide.hover.svelte-e02kpp{border:solid 2px var(--guide-color)}.card-body.svelte-e02kpp .card-guide.hover button.svelte-e02kpp{opacity:0.6;padding:0;position:absolute;--b-width:50%;--b-height:25px;--b-width-long:60px;--b-height-long:70px;--b-bradius:8px;width:var(--b-width);height:var(--b-height);background-color:var(--guide-color)}.card-body.svelte-e02kpp .card-guide.hover button.left-rotate.svelte-e02kpp{top:0;left:0}.card-body.svelte-e02kpp .card-guide.hover button.right-rotate.svelte-e02kpp{top:0;right:0}.card-body.svelte-e02kpp .card-guide.hover button.flip.svelte-e02kpp{bottom:0;left:0;right:0;width:100%;height:var(--b-height)}.card-body.svelte-e02kpp .card-shadow.svelte-e02kpp{position:absolute;--scaleup-width:20px;--scaleup-height:50px;left:calc(-1 * var(--scaleup-width) / 2);top:calc(-1 * var(--scaleup-height) * 2);width:calc(var(--cw) + var(--scaleup-width));height:calc(var(--ch) + var(--scaleup-height))}",
      map: null
    };
    Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_boardListStore;
      let $movingStore, $$unsubscribe_movingStore;
      let $$unsubscribe_deckAreaInfoStore;
      let $$unsubscribe_handAreaInfoStore;
      let $$unsubscribe_boardAreaInfoStore;
      $$unsubscribe_boardListStore = subscribe(boardListStore, (value) => value);
      $$unsubscribe_movingStore = subscribe(movingStore, (value) => $movingStore = value);
      $$unsubscribe_deckAreaInfoStore = subscribe(deckAreaInfoStore, (value) => value);
      $$unsubscribe_handAreaInfoStore = subscribe(handAreaInfoStore, (value) => value);
      $$unsubscribe_boardAreaInfoStore = subscribe(boardAreaInfoStore, (value) => value);
      createEventDispatcher();
      let { id } = $$props;
      let { pos_x } = $$props;
      let { pos_y } = $$props;
      let { onArea = "board" } = $$props;
      let { img_url } = $$props;
      let { sleeve_url } = $$props;
      let { rotate = 0 } = $$props;
      let { noGuide = false } = $$props;
      let { flippin = false } = $$props;
      if ($$props.id === void 0 && $$bindings.id && id !== void 0)
        $$bindings.id(id);
      if ($$props.pos_x === void 0 && $$bindings.pos_x && pos_x !== void 0)
        $$bindings.pos_x(pos_x);
      if ($$props.pos_y === void 0 && $$bindings.pos_y && pos_y !== void 0)
        $$bindings.pos_y(pos_y);
      if ($$props.onArea === void 0 && $$bindings.onArea && onArea !== void 0)
        $$bindings.onArea(onArea);
      if ($$props.img_url === void 0 && $$bindings.img_url && img_url !== void 0)
        $$bindings.img_url(img_url);
      if ($$props.sleeve_url === void 0 && $$bindings.sleeve_url && sleeve_url !== void 0)
        $$bindings.sleeve_url(sleeve_url);
      if ($$props.rotate === void 0 && $$bindings.rotate && rotate !== void 0)
        $$bindings.rotate(rotate);
      if ($$props.noGuide === void 0 && $$bindings.noGuide && noGuide !== void 0)
        $$bindings.noGuide(noGuide);
      if ($$props.flippin === void 0 && $$bindings.flippin && flippin !== void 0)
        $$bindings.flippin(flippin);
      $$result.css.add(css$34);
      $$unsubscribe_boardListStore();
      $$unsubscribe_movingStore();
      $$unsubscribe_deckAreaInfoStore();
      $$unsubscribe_handAreaInfoStore();
      $$unsubscribe_boardAreaInfoStore();
      return `


<section class="${"card-body " + escape("") + " " + escape(noGuide ? "noGuide" : "") + " " + escape(onArea != "board" ? "noBoard" : "") + " svelte-e02kpp"}" style="${"--pos_x:" + escape(pos_x) + "px; --pos_y:" + escape(pos_y) + "px;--img:" + escape(img_url) + "; --rotate:" + escape(rotate) + "deg;"}">${!$movingStore ? `<div class="${"card-guide " + escape("") + " svelte-e02kpp"}">${``}</div>` : ``}
    <div class="${"card-surface " + escape(flippin ? "flippin" : "") + " svelte-e02kpp"}"><div class="${"front svelte-e02kpp"}"><img${add_attribute("src", img_url, 0)} alt="${""}" class="${"svelte-e02kpp"}"></div>
        <div class="${"back svelte-e02kpp"}"><img${add_attribute("src", sleeve_url, 0)} alt="${""}" class="${"svelte-e02kpp"}"></div></div>

    ${``}
    
</section>`;
    });
    css$27 = {
      code: "#deckArea.svelte-1kk6kdi.svelte-1kk6kdi{position:relative}#deckArea.light.svelte-1kk6kdi.svelte-1kk6kdi{--deck-bg-color-top:#0a2ea5;--deck-bg-color-center:#324892;--deck-bg-color-bottom:#130069}#deckArea.dark.svelte-1kk6kdi.svelte-1kk6kdi{--deck-bg-color-top:#0a2ea5;--deck-bg-color-center:#83a0ff;--deck-bg-color-bottom:#130069}#deckPiling.svelte-1kk6kdi.svelte-1kk6kdi{position:relative;width:var(--ch);height:var(--cw)}#deckPiling.svelte-1kk6kdi .deckbottom.svelte-1kk6kdi{position:absolute;--round-len:300px;width:calc(var(--round-len) / 2);height:var(--round-len);top:-90px;left:0;overflow:hidden}#deckPiling.svelte-1kk6kdi .deckbottom .round.svelte-1kk6kdi{position:absolute;right:0;width:var(--round-len);height:var(--round-len);border-radius:200px;overflow:hidden}#deckPiling.svelte-1kk6kdi .deckbottom .round .round-top.svelte-1kk6kdi,#deckPiling.svelte-1kk6kdi .deckbottom .round .round-center.svelte-1kk6kdi,#deckPiling.svelte-1kk6kdi .deckbottom .round .round-bottom.svelte-1kk6kdi{position:absolute;width:var(--round-len);height:calc(var(--round-len) / 3)}#deckPiling.svelte-1kk6kdi .deckbottom .round .round-top.svelte-1kk6kdi{top:0;background:var(--deck-bg-color-top)}#deckPiling.svelte-1kk6kdi .deckbottom .round .round-center.svelte-1kk6kdi{top:50%;transform:translate(0, -50%);background:var(--deck-bg-color-center)}#deckPiling.svelte-1kk6kdi .deckbottom .round .round-bottom.svelte-1kk6kdi{bottom:0;background:var(--deck-bg-color-bottom)}",
      map: null
    };
    Deck = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $deckListStore, $$unsubscribe_deckListStore;
      let $modeStore, $$unsubscribe_modeStore;
      $$unsubscribe_deckListStore = subscribe(deckListStore, (value) => $deckListStore = value);
      $$unsubscribe_modeStore = subscribe(modeStore, (value) => $modeStore = value);
      createEventDispatcher();
      $$result.css.add(css$27);
      $$unsubscribe_deckListStore();
      $$unsubscribe_modeStore();
      return `<section id="${"deckArea"}" class="${escape(null_to_empty($modeStore)) + " svelte-1kk6kdi"}"><section id="${"deckPiling"}" class="${"svelte-1kk6kdi"}"><div class="${"deckbottom svelte-1kk6kdi"}"><div class="${"round svelte-1kk6kdi"}"><div class="${"round-top svelte-1kk6kdi"}"></div>
                <div class="${"round-center svelte-1kk6kdi"}"></div>
                <div class="${"round-bottom svelte-1kk6kdi"}"></div></div></div>
        ${each($deckListStore, (d, i2) => {
        return `${validate_component(Card, "Card").$$render($$result, {
          id: d.id,
          pos_x: d.x + i2 * -0.5 + 25,
          pos_y: d.y + i2 * -0.8 + 10,
          flippin: d.flip,
          onArea: "deck",
          img_url: d.url,
          sleeve_url: d.burl,
          noGuide: true
        }, {}, {})}`;
      })}</section>
</section>`;
    });
    css$19 = {
      code: "#handArea.svelte-11la4tw.svelte-11la4tw{position:absolute;margin:0 auto;width:500px;height:75px;left:calc(50% - 250px);bottom:0}#handArea.light.svelte-11la4tw.svelte-11la4tw{--hand-bg-color:#0a2ea5}#handArea.dark.svelte-11la4tw.svelte-11la4tw{--hand-bg-color:#081081}#handArea.svelte-11la4tw #handArea-bg.svelte-11la4tw{overflow:hidden;width:inherit;height:inherit}#handArea.svelte-11la4tw #handArea-bg #handArea-bg-radius.svelte-11la4tw{position:relative;margin:0 auto;width:inherit;height:500px;border-radius:250px}#handArea.svelte-11la4tw #handArea-bg #handArea-bg-radius.light.svelte-11la4tw{background:yellow}#handArea.svelte-11la4tw #handArea-bg #handArea-bg-radius.dark.svelte-11la4tw{background:var(--hand-bg-color)}",
      map: null
    };
    handLineupGuideRadius = 250;
    Hand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $handListStore, $$unsubscribe_handListStore;
      let $cardWidth, $$unsubscribe_cardWidth;
      let $modeStore, $$unsubscribe_modeStore;
      $$unsubscribe_handListStore = subscribe(handListStore, (value) => $handListStore = value);
      $$unsubscribe_cardWidth = subscribe(cardWidth, (value) => $cardWidth = value);
      $$unsubscribe_modeStore = subscribe(modeStore, (value) => $modeStore = value);
      createEventDispatcher();
      $$result.css.add(css$19);
      {
        {
          let hand = $handListStore;
          const handLen = hand.length;
          let xSpacing = (handLineupGuideRadius * 2 - 150) / handLen;
          let degSpaning = 100 / handLen;
          if (xSpacing > 50) {
            xSpacing = 50;
          }
          if (degSpaning > 20) {
            degSpaning = 20;
          }
          let temp = [];
          for (let i2 = 0; i2 < handLen; i2++) {
            if (hand[i2]) {
              const x2 = xSpacing * (i2 - handLen / 2 + 0.5);
              const y = handLineupGuideFunction(x2);
              const deg = (i2 - Math.floor(handLen / 2)) * degSpaning;
              temp.push({
                id: hand[i2].id,
                url: hand[i2].url,
                burl: hand[i2].burl,
                x: x2 + handLineupGuideRadius - $cardWidth / 2,
                y: y + 150,
                rotate: deg,
                flip: false
              });
            } else {
              temp.push(void 0);
            }
          }
          set_store_value(handListStore, $handListStore = temp, $handListStore);
        }
      }
      $$unsubscribe_handListStore();
      $$unsubscribe_cardWidth();
      $$unsubscribe_modeStore();
      return `<section id="${"handArea"}" class="${escape(null_to_empty($modeStore)) + " svelte-11la4tw"}"><div id="${"handArea-bg"}" class="${"svelte-11la4tw"}"><div id="${"handArea-bg-radius"}" class="${escape(null_to_empty($modeStore)) + " svelte-11la4tw"}"></div></div>
    ${each($handListStore, (h2) => {
        return `${h2 ? `${validate_component(Card, "Card").$$render($$result, {
          id: h2.id,
          pos_x: h2.x,
          pos_y: h2.y,
          rotate: h2.rotate,
          onArea: "hand",
          img_url: h2.url,
          sleeve_url: h2.burl,
          flippin: h2.flip
        }, {}, {})}` : ``}`;
      })}
</section>`;
    });
    css36 = {
      code: "#board.svelte-wvq7x7.svelte-wvq7x7{width:825px;height:550px;z-index:1;margin:0 auto 0 200px;transform:rotateX(10deg);border-radius:30px;position:relative}#board.light.svelte-wvq7x7.svelte-wvq7x7{background:radial-gradient(ellipse, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.2) 100%)}#board.dark.svelte-wvq7x7.svelte-wvq7x7{background:radial-gradient(ellipse, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0.1) 100%)}#myHand.svelte-wvq7x7.svelte-wvq7x7{position:fixed;z-index:0;width:100%;height:75px;bottom:0}#myHand.svelte-wvq7x7 #handArea-main.svelte-wvq7x7{position:absolute;width:500px;height:180px;left:50%;transform:translate(-50%, 0);bottom:0;pointer-events:none}#myDeck.svelte-wvq7x7.svelte-wvq7x7{position:fixed;z-index:0;bottom:130px;left:0px}#myDeck.svelte-wvq7x7 #deckArea-main.svelte-wvq7x7{position:absolute;width:200px;height:300px;top:50%;left:-50%;transform:translate(0, -50%);bottom:0;pointer-events:none}#is-not-PC-alert.svelte-wvq7x7.svelte-wvq7x7{margin:100px 20px;background:black;border:solid 1px white;border-radius:20px;width:70%;max-width:600px}#is-not-PC-alert.svelte-wvq7x7 .clear.svelte-wvq7x7{color:yellow}#is-not-PC-alert.svelte-wvq7x7 .panel.svelte-wvq7x7{padding:20px}#is-not-PC-alert.svelte-wvq7x7 .panel .device-exp.svelte-wvq7x7{color:white;position:relative;max-width:310px;margin:50px auto}#is-not-PC-alert.svelte-wvq7x7 .panel .device-exp .device-figure.svelte-wvq7x7{width:80%;margin:0 auto;font-size:18px}#is-not-PC-alert.svelte-wvq7x7 .panel .device-exp .device-figure span.svelte-wvq7x7{font-size:15px;line-height:18px}#is-not-PC-alert.svelte-wvq7x7 .panel .device-exp .device-figure .width.svelte-wvq7x7{position:absolute;left:50%;top:-30px;transform:translate(-50%, 0)}#is-not-PC-alert.svelte-wvq7x7 .panel .device-exp .device-figure .height.svelte-wvq7x7{position:absolute;top:50%;right:-55px;transform:rotate(90deg)}",
      map: null
    };
    Game_tcg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_deckListStore;
      let $boardListStore, $$unsubscribe_boardListStore;
      let $$unsubscribe_handListStore;
      let $$unsubscribe_cardWidth;
      let $$unsubscribe_deckAreaInfoStore;
      let $$unsubscribe_handAreaInfoStore;
      let $$unsubscribe_boardAreaInfoStore;
      let $modeStore, $$unsubscribe_modeStore;
      $$unsubscribe_deckListStore = subscribe(deckListStore, (value) => value);
      $$unsubscribe_boardListStore = subscribe(boardListStore, (value) => $boardListStore = value);
      $$unsubscribe_handListStore = subscribe(handListStore, (value) => value);
      $$unsubscribe_cardWidth = subscribe(cardWidth, (value) => value);
      $$unsubscribe_deckAreaInfoStore = subscribe(deckAreaInfoStore, (value) => value);
      $$unsubscribe_handAreaInfoStore = subscribe(handAreaInfoStore, (value) => value);
      $$unsubscribe_boardAreaInfoStore = subscribe(boardAreaInfoStore, (value) => value);
      $$unsubscribe_modeStore = subscribe(modeStore, (value) => $modeStore = value);
      $$result.css.add(css36);
      $$unsubscribe_deckListStore();
      $$unsubscribe_boardListStore();
      $$unsubscribe_handListStore();
      $$unsubscribe_cardWidth();
      $$unsubscribe_deckAreaInfoStore();
      $$unsubscribe_handAreaInfoStore();
      $$unsubscribe_boardAreaInfoStore();
      $$unsubscribe_modeStore();
      return `
${`<article id="${"board"}" class="${escape(null_to_empty($modeStore)) + " svelte-wvq7x7"}">${each($boardListStore, (bs) => {
        return `${validate_component(Card, "Card").$$render($$result, {
          id: bs.id,
          pos_x: bs.x,
          pos_y: bs.y,
          flippin: bs.flip,
          onArea: "board",
          img_url: bs.url,
          sleeve_url: bs.burl
        }, {}, {})}`;
      })}</article>
<article id="${"myHand"}" class="${"svelte-wvq7x7"}"><div id="${"handArea-main"}" class="${"svelte-wvq7x7"}"></div>
    ${validate_component(Hand, "Hand").$$render($$result, {}, {}, {})}</article>
<article id="${"myDeck"}" class="${"svelte-wvq7x7"}"><div id="${"deckArea-main"}" class="${"svelte-wvq7x7"}"></div>
    ${validate_component(Deck, "Deck").$$render($$result, {}, {}, {})}</article>`}`;
    });
  }
});

// .svelte-kit/output/server/nodes/12.js
var __exports20 = {};
__export(__exports20, {
  css: () => css37,
  entry: () => entry20,
  js: () => js20,
  module: () => game_tcg_svelte_exports
});
var entry20, js20, css37;
var init__20 = __esm({
  ".svelte-kit/output/server/nodes/12.js"() {
    init_game_tcg_svelte();
    entry20 = "pages/app/tcg-simulator/game@tcg.svelte-9bc4148e.js";
    js20 = ["pages/app/tcg-simulator/game@tcg.svelte-9bc4148e.js", "chunks/index-7e81b4c7.js", "chunks/deck-b8dd20f8.js", "chunks/TCGsimStore-135f7582.js", "chunks/index-c0f974cf.js"];
    css37 = ["assets/pages/app/tcg-simulator/game@tcg.svelte-481aa717.css", "assets/deck-d908b596.css"];
  }
});

// .svelte-kit/vercel-tmp/entry.js
var entry_exports = {};
__export(entry_exports, {
  default: () => entry_default
});
module.exports = __toCommonJS(entry_exports);

// .svelte-kit/vercel-tmp/shims.js
init_install_fetch();
installFetch();

// node_modules/@sveltejs/kit/dist/node.js
var import_stream = require("stream");
function get_raw_body(req) {
  return new Promise((fulfil, reject) => {
    const h2 = req.headers;
    if (!h2["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h2["content-length"]);
    if (isNaN(length) && h2["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}
async function getRequest(base2, req) {
  let headers = req.headers;
  if (req.httpVersionMajor === 2) {
    headers = Object.assign({}, headers);
    delete headers[":method"];
    delete headers[":path"];
    delete headers[":authority"];
    delete headers[":scheme"];
  }
  return new Request(base2 + req.url, {
    method: req.method,
    headers,
    body: await get_raw_body(req)
  });
}
async function setResponse(res, response) {
  const headers = Object.fromEntries(response.headers);
  if (response.headers.has("set-cookie")) {
    headers["set-cookie"] = response.headers.raw()["set-cookie"];
  }
  res.writeHead(response.status, headers);
  if (response.body instanceof import_stream.Readable) {
    response.body.pipe(res);
  } else {
    if (response.body) {
      res.write(await response.arrayBuffer());
    }
    res.end();
  }
}

// .svelte-kit/output/server/index.js
init_index_2e97bc70();
var __accessCheck2 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet2 = (obj, member, getter) => {
  __accessCheck2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd2 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet2 = (obj, member, value, setter) => {
  __accessCheck2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _use_hashes;
var _dev;
var _script_needs_csp;
var _style_needs_csp;
var _directives;
var _script_src;
var _style_src;
function afterUpdate() {
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  let { props_3 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  if ($$props.props_3 === void 0 && $$bindings.props_3 && props_3 !== void 0)
    $$bindings.props_3(props_3);
  {
    stores.page.set(page);
  }
  return `


${components[1] ? `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => {
      return `${components[2] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
        default: () => {
          return `${components[3] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {
            default: () => {
              return `${validate_component(components[3] || missing_component, "svelte:component").$$render($$result, Object.assign(props_3 || {}), {}, {})}`;
            }
          })}` : `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`}`;
        }
      })}` : `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
    }
  })}` : `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
});
function to_headers(object) {
  const headers = new Headers();
  if (object) {
    for (const key2 in object) {
      const value = object[key2];
      if (!value)
        continue;
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          headers.append(key2, value2);
        });
      } else {
        headers.set(key2, value);
      }
    }
  }
  return headers;
}
function hash(value) {
  let hash2 = 5381;
  let i2 = value.length;
  if (typeof value === "string") {
    while (i2)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
  } else {
    while (i2)
      hash2 = hash2 * 33 ^ value[--i2];
  }
  return (hash2 >>> 0).toString(36);
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key2 in obj) {
    clone2[key2.toLowerCase()] = obj[key2];
  }
  return clone2;
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
  }
  return params;
}
function is_pojo(body) {
  if (typeof body !== "object")
    return false;
  if (body) {
    if (body instanceof Uint8Array)
      return false;
    if (body._readableState && typeof body.pipe === "function")
      return false;
    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
      return false;
  }
  return true;
}
function normalize_request_method(event) {
  const method = event.request.method.toLowerCase();
  return method === "delete" ? "del" : method;
}
function error(body) {
  return new Response(body, {
    status: 500
  });
}
function is_string(s22) {
  return typeof s22 === "string" || s22 instanceof String;
}
var text_types = /* @__PURE__ */ new Set([
  "application/xml",
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data"
]);
function is_text(content_type) {
  if (!content_type)
    return true;
  const type = content_type.split(";")[0].toLowerCase();
  return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
}
async function render_endpoint(event, mod) {
  const method = normalize_request_method(event);
  let handler = mod[method];
  if (!handler && method === "head") {
    handler = mod.get;
  }
  if (!handler) {
    return event.request.headers.get("x-sveltekit-load") ? new Response(void 0, {
      status: 204
    }) : new Response("Method not allowed", {
      status: 405
    });
  }
  const response = await handler(event);
  const preface = `Invalid response from route ${event.url.pathname}`;
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  if (response.fallthrough) {
    throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
  }
  const { status = 200, body = {} } = response;
  const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
  const type = headers.get("content-type");
  if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
    headers.set("content-type", "application/json; charset=utf-8");
    normalized_body = JSON.stringify(body);
  } else {
    normalized_body = body;
  }
  if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
    const cache_control = headers.get("cache-control");
    if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
      headers.set("etag", `"${hash(normalized_body)}"`);
    }
  }
  return new Response(method !== "head" ? normalized_body : void 0, {
    status,
    headers
  });
}
var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key2) {
            return walk(thing[key2]);
          });
      }
    }
  }
  walk(value);
  var names = /* @__PURE__ */ new Map();
  Array.from(counts).filter(function(entry21) {
    return entry21[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry21, i2) {
    names.set(entry21[0], getName(i2));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i2) {
          return i2 in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key2) {
          return safeKey(key2) + ":" + stringify(thing[key2]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i2) {
            statements_1.push(name + "[" + i2 + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a4) {
            var k = _a4[0], v = _a4[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key2) {
            statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars$1[num % chars$1.length] + name;
    num = ~~(num / chars$1.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped2[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
}
function safeProp(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i2 = 0; i2 < str.length; i2 += 1) {
    var char = str.charAt(i2);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped2) {
      result += escaped2[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i2];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop3() {
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop3) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop3) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop3;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
var render_json_payload_script_dict = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var render_json_payload_script_regex = new RegExp(`[${Object.keys(render_json_payload_script_dict).join("")}]`, "g");
function render_json_payload_script(attrs, payload) {
  const safe_payload = JSON.stringify(payload).replace(render_json_payload_script_regex, (match) => render_json_payload_script_dict[match]);
  let safe_attrs = "";
  for (const [key2, value] of Object.entries(attrs)) {
    if (value === void 0)
      continue;
    safe_attrs += ` sveltekit:data-${key2}=${escape_html_attr(value)}`;
  }
  return `<script type="application/json"${safe_attrs}>${safe_payload}<\/script>`;
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var s2 = JSON.stringify;
function create_prerendering_url_proxy(url) {
  return new Proxy(url, {
    get: (target, prop, receiver) => {
      if (prop === "search" || prop === "searchParams") {
        throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
var encoder = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array = encode(data);
  for (let i2 = 0; i2 < array.length; i2 += 16) {
    const w = array.subarray(i2, i2 + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w[i22];
      } else {
        a = w[i22 + 1 & 15];
        b = w[i22 + 14 & 15];
        tmp = w[i22 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i22 & 15] + w[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x2) {
    return (x2 - Math.floor(x2)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a = bytes[i2 + 0];
    const b = bytes[i2 + 1];
    const c = bytes[i2 + 2];
    const d = bytes[i2 + 3];
    bytes[i2 + 0] = d;
    bytes[i2 + 1] = c;
    bytes[i2 + 2] = b;
    bytes[i2 + 3] = a;
  }
}
function encode(str) {
  const encoded = encoder.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i2;
  for (i2 = 2; i2 < l; i2 += 3) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2 | bytes[i2] >> 6];
    result += chars[bytes[i2] & 63];
  }
  if (i2 === l + 1) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4];
    result += "==";
  }
  if (i2 === l) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var csp_ready;
var generate_nonce;
var generate_hash;
if (typeof crypto !== "undefined") {
  const array = new Uint8Array(16);
  generate_nonce = () => {
    crypto.getRandomValues(array);
    return base64(array);
  };
  generate_hash = sha256;
} else {
  const name = "crypto";
  csp_ready = import(name).then((crypto2) => {
    generate_nonce = () => {
      return crypto2.randomBytes(16).toString("base64");
    };
    generate_hash = (input) => {
      return crypto2.createHash("sha256").update(input, "utf-8").digest().toString("base64");
    };
  });
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var Csp = class {
  constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
    __privateAdd2(this, _use_hashes, void 0);
    __privateAdd2(this, _dev, void 0);
    __privateAdd2(this, _script_needs_csp, void 0);
    __privateAdd2(this, _style_needs_csp, void 0);
    __privateAdd2(this, _directives, void 0);
    __privateAdd2(this, _script_src, void 0);
    __privateAdd2(this, _style_src, void 0);
    __privateSet2(this, _use_hashes, mode === "hash" || mode === "auto" && prerender);
    __privateSet2(this, _directives, dev ? __spreadValues({}, directives) : directives);
    __privateSet2(this, _dev, dev);
    const d = __privateGet2(this, _directives);
    if (dev) {
      const effective_style_src2 = d["style-src"] || d["default-src"];
      if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
        d["style-src"] = [...effective_style_src2, "unsafe-inline"];
      }
    }
    __privateSet2(this, _script_src, []);
    __privateSet2(this, _style_src, []);
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    __privateSet2(this, _script_needs_csp, !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0);
    __privateSet2(this, _style_needs_csp, !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0);
    this.script_needs_nonce = __privateGet2(this, _script_needs_csp) && !__privateGet2(this, _use_hashes);
    this.style_needs_nonce = __privateGet2(this, _style_needs_csp) && !__privateGet2(this, _use_hashes);
    if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
      this.nonce = generate_nonce();
    }
  }
  add_script(content) {
    if (__privateGet2(this, _script_needs_csp)) {
      if (__privateGet2(this, _use_hashes)) {
        __privateGet2(this, _script_src).push(`sha256-${generate_hash(content)}`);
      } else if (__privateGet2(this, _script_src).length === 0) {
        __privateGet2(this, _script_src).push(`nonce-${this.nonce}`);
      }
    }
  }
  add_style(content) {
    if (__privateGet2(this, _style_needs_csp)) {
      if (__privateGet2(this, _use_hashes)) {
        __privateGet2(this, _style_src).push(`sha256-${generate_hash(content)}`);
      } else if (__privateGet2(this, _style_src).length === 0) {
        __privateGet2(this, _style_src).push(`nonce-${this.nonce}`);
      }
    }
  }
  get_header(is_meta = false) {
    const header = [];
    const directives = __spreadValues({}, __privateGet2(this, _directives));
    if (__privateGet2(this, _style_src).length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...__privateGet2(this, _style_src)
      ];
    }
    if (__privateGet2(this, _script_src).length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...__privateGet2(this, _script_src)
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = directives[key2];
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
  get_meta() {
    const content = escape_html_attr(this.get_header(true));
    return `<meta http-equiv="content-security-policy" content=${content}>`;
  }
};
_use_hashes = /* @__PURE__ */ new WeakMap();
_dev = /* @__PURE__ */ new WeakMap();
_script_needs_csp = /* @__PURE__ */ new WeakMap();
_style_needs_csp = /* @__PURE__ */ new WeakMap();
_directives = /* @__PURE__ */ new WeakMap();
_script_src = /* @__PURE__ */ new WeakMap();
_style_src = /* @__PURE__ */ new WeakMap();
var updated = __spreadProps(__spreadValues({}, readable(false)), {
  check: () => false
});
async function render_response({
  branch,
  options,
  state,
  $session,
  page_config,
  status,
  error: error2 = null,
  event,
  resolve_opts,
  stuff
}) {
  if (state.prerender) {
    if (options.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options.template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %svelte.nonce%");
    }
  }
  const stylesheets = new Set(options.manifest._.entry.css);
  const modulepreloads = new Set(options.manifest._.entry.js);
  const styles = /* @__PURE__ */ new Map();
  const serialized_data = [];
  let shadow_props;
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options.get_stack(error2);
  }
  if (resolve_opts.ssr) {
    branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => stylesheets.add(url));
      if (node.js)
        node.js.forEach((url) => modulepreloads.add(url));
      if (node.styles)
        Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (props2)
        shadow_props = props2;
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session,
        updated
      },
      page: {
        error: error2,
        params: event.params,
        routeId: event.routeId,
        status,
        stuff,
        url: state.prerender ? create_prerendering_url_proxy(event.url) : event.url
      },
      components: branch.map(({ node }) => node.module.default)
    };
    const print_error = (property, replacement) => {
      Object.defineProperty(props.page, property, {
        get: () => {
          throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
        }
      });
    };
    print_error("origin", "origin");
    print_error("path", "pathname");
    print_error("query", "searchParams");
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      props[`props_${i2}`] = await branch[i2].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let { head, html: body } = rendered;
  const inlined_style = Array.from(styles.values()).join("\n");
  await csp_ready;
  const csp = new Csp(options.csp, {
    dev: options.dev,
    prerender: !!state.prerender,
    needs_nonce: options.template_contains_nonce
  });
  const target = hash(body);
  const init_app = `
		import { start } from ${s2(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-hydrate="${target}"]').parentNode,
			paths: ${s2(options.paths)},
			session: ${try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  })},
			route: ${!!page_config.router},
			spa: ${!resolve_opts.ssr},
			trailing_slash: ${s2(options.trailing_slash)},
			hydrate: ${resolve_opts.ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [
					${(branch || []).map(({ node }) => `import(${s2(options.prefix + node.entry)})`).join(",\n						")}
				],
				params: ${devalue(event.params)},
				routeId: ${s2(event.routeId)}
			}` : "null"}
		});
	`;
  const init_service_worker = `
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('${options.service_worker}');
		}
	`;
  if (options.amp) {
    const styles2 = `${inlined_style}
${rendered.css.code}`;
    head += `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>

		<style amp-custom>${styles2}</style>`;
    if (options.service_worker) {
      head += '<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"><\/script>';
      body += `<amp-install-serviceworker src="${options.service_worker}" layout="nodisplay"></amp-install-serviceworker>`;
    }
  } else {
    if (inlined_style) {
      const attributes = [];
      if (options.dev)
        attributes.push(" data-svelte");
      if (csp.style_needs_nonce)
        attributes.push(` nonce="${csp.nonce}"`);
      csp.add_style(inlined_style);
      head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
    }
    head += Array.from(stylesheets).map((dep) => {
      const attributes = [
        'rel="stylesheet"',
        `href="${options.prefix + dep}"`
      ];
      if (csp.style_needs_nonce) {
        attributes.push(`nonce="${csp.nonce}"`);
      }
      if (styles.has(dep)) {
        attributes.push("disabled", 'media="(max-width: 0)"');
      }
      return `
	<link ${attributes.join(" ")}>`;
    }).join("");
    if (page_config.router || page_config.hydrate) {
      head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
      const attributes = ['type="module"', `data-hydrate="${target}"`];
      csp.add_script(init_app);
      if (csp.script_needs_nonce) {
        attributes.push(`nonce="${csp.nonce}"`);
      }
      body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
      body += serialized_data.map(({ url, body: body2, response }) => render_json_payload_script({ type: "data", url, body: typeof body2 === "string" ? hash(body2) : void 0 }, response)).join("\n	");
      if (shadow_props) {
        body += render_json_payload_script({ type: "props" }, shadow_props);
      }
    }
    if (options.service_worker) {
      csp.add_script(init_service_worker);
      head += `
				<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
    }
  }
  if (state.prerender && !options.amp) {
    const http_equiv = [];
    const csp_headers = csp.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (maxage) {
      http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${maxage}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  }
  const segments = event.url.pathname.slice(options.paths.base.length).split("/").slice(2);
  const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
  const html = await resolve_opts.transformPage({
    html: options.template({ head, body, assets: assets2, nonce: csp.nonce })
  });
  const headers = new Headers({
    "content-type": "text/html",
    etag: `"${hash(html)}"`
  });
  if (maxage) {
    headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${maxage}`);
  }
  if (!options.floc) {
    headers.set("permissions-policy", "interest-cohort=()");
  }
  if (!state.prerender) {
    const csp_header = csp.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
  }
  return new Response(html, {
    status,
    headers
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var absolute = /^([a-z]+:)?\/?\//;
var scheme = /^[a-z]+:/;
function resolve(base2, path) {
  if (scheme.test(path))
    return path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function is_root_relative(path) {
  return path[0] === "/" && path[1] !== "/";
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && /\/[^./]+$/.test(path)) {
    return path + "/";
  }
  return path;
}
async function load_node({
  event,
  options,
  state,
  route,
  node,
  $session,
  stuff,
  is_error,
  is_leaf,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const shadow = is_leaf ? await load_shadow_data(route, event, options, !!state.prerender) : {};
  if (shadow.cookies) {
    set_cookie_headers.push(...shadow.cookies);
  }
  if (shadow.error) {
    loaded = {
      status: shadow.status,
      error: shadow.error
    };
  } else if (shadow.redirect) {
    loaded = {
      status: shadow.status,
      redirect: shadow.redirect
    };
  } else if (module2.load) {
    const load_input = {
      url: state.prerender ? create_prerendering_url_proxy(event.url) : event.url,
      params: event.params,
      props: shadow.body || {},
      routeId: event.routeId,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let requested;
        if (typeof resource === "string") {
          requested = resource;
        } else {
          requested = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        opts.headers = new Headers(opts.headers);
        for (const [key2, value] of event.request.headers) {
          if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
            opts.headers.set(key2, value);
          }
        }
        const resolved = resolve(event.url.pathname, requested.split("?")[0]);
        let response;
        let dependency;
        const prefix = options.paths.assets || options.paths.base;
        const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = options.manifest.assets.has(filename);
        const is_asset_html = options.manifest.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (options.read) {
            const type = is_asset ? options.manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            response = new Response(options.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else {
            response = await fetch(`${event.url.origin}/${file}`, opts);
          }
        } else if (is_root_relative(resolved)) {
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            const authorization = event.request.headers.get("authorization");
            if (cookie) {
              opts.headers.set("cookie", cookie);
            }
            if (authorization && !opts.headers.has("authorization")) {
              opts.headers.set("authorization", authorization);
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          response = await respond(new Request(new URL(requested, event.url).href, opts), options, {
            getClientAddress: state.getClientAddress,
            initiator: route,
            prerender: state.prerender
          });
          if (state.prerender) {
            dependency = { response, body: null };
            state.prerender.dependencies.set(resolved, dependency);
          }
        } else {
          if (resolved.startsWith("//")) {
            requested = event.url.protocol + requested;
          }
          if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            if (cookie)
              opts.headers.set("cookie", cookie);
          }
          const external_request = new Request(requested, opts);
          response = await options.hooks.externalFetch.call(null, external_request);
        }
        const proxy = new Proxy(response, {
          get(response2, key2, _receiver) {
            async function text() {
              const body = await response2.text();
              const headers = {};
              for (const [key3, value] of response2.headers) {
                if (key3 === "set-cookie") {
                  set_cookie_headers = set_cookie_headers.concat(value);
                } else if (key3 !== "etag") {
                  headers[key3] = value;
                }
              }
              if (!opts.body || typeof opts.body === "string") {
                const status_number = Number(response2.status);
                if (isNaN(status_number)) {
                  throw new Error(`response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`);
                }
                fetched.push({
                  url: requested,
                  body: opts.body,
                  response: {
                    status: status_number,
                    statusText: response2.statusText,
                    headers,
                    body
                  }
                });
              }
              if (dependency) {
                dependency.body = body;
              }
              return body;
            }
            if (key2 === "arrayBuffer") {
              return async () => {
                const buffer = await response2.arrayBuffer();
                if (dependency) {
                  dependency.body = new Uint8Array(buffer);
                }
                return buffer;
              };
            }
            if (key2 === "text") {
              return text;
            }
            if (key2 === "json") {
              return async () => {
                return JSON.parse(await text());
              };
            }
            return Reflect.get(response2, key2, response2);
          }
        });
        return proxy;
      },
      stuff: __spreadValues({}, stuff)
    };
    if (options.dev) {
      Object.defineProperty(load_input, "page", {
        get: () => {
          throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
        }
      });
    }
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
    if (!loaded) {
      throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
    }
    if (loaded.fallthrough) {
      throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
    }
  } else if (shadow.body) {
    loaded = {
      props: shadow.body
    };
  } else {
    loaded = {};
  }
  if (shadow.body && state.prerender) {
    const pathname = `${event.url.pathname.replace(/\/$/, "")}/__data.json`;
    const dependency = {
      response: new Response(void 0),
      body: JSON.stringify(shadow.body)
    };
    state.prerender.dependencies.set(pathname, dependency);
  }
  return {
    node,
    props: shadow.body,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
async function load_shadow_data(route, event, options, prerender) {
  if (!route.shadow)
    return {};
  try {
    const mod = await route.shadow();
    if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
      throw new Error("Cannot prerender pages that have endpoints with mutative methods");
    }
    const method = normalize_request_method(event);
    const is_get = method === "head" || method === "get";
    const handler = method === "head" ? mod.head || mod.get : mod[method];
    if (!handler && !is_get) {
      return {
        status: 405,
        error: new Error(`${method} method not allowed`)
      };
    }
    const data = {
      status: 200,
      cookies: [],
      body: {}
    };
    if (!is_get) {
      const result = await handler(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      data.status = status;
      add_cookies(data.cookies, headers);
      if (status >= 300 && status < 400) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = body;
    }
    const get = method === "head" && mod.head || mod.get;
    if (get) {
      const result = await get(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      add_cookies(data.cookies, headers);
      data.status = status;
      if (status >= 400) {
        data.error = new Error("Failed to load data");
        return data;
      }
      if (status >= 300) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = __spreadValues(__spreadValues({}, body), data.body);
    }
    return data;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    return {
      status: 500,
      error: error2
    };
  }
}
function add_cookies(target, headers) {
  const cookies = headers["set-cookie"];
  if (cookies) {
    if (Array.isArray(cookies)) {
      target.push(...cookies);
    } else {
      target.push(cookies);
    }
  }
}
function validate_shadow_output(result) {
  const { status = 200, body = {} } = result;
  let headers = result.headers || {};
  if (headers instanceof Headers) {
    if (headers.has("set-cookie")) {
      throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers");
    }
  } else {
    headers = lowercase_keys(headers);
  }
  if (!is_pojo(body)) {
    throw new Error("Body returned from endpoint request handler must be a plain object");
  }
  return { status, headers, body };
}
async function respond_with_error({
  event,
  options,
  state,
  $session,
  status,
  error: error2,
  resolve_opts
}) {
  try {
    const branch = [];
    let stuff = {};
    if (resolve_opts.ssr) {
      const default_layout = await options.manifest._.nodes[0]();
      const default_error = await options.manifest._.nodes[1]();
      const layout_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_layout,
        $session,
        stuff: {},
        is_error: false,
        is_leaf: false
      });
      const error_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_error,
        $session,
        stuff: layout_loaded ? layout_loaded.stuff : {},
        is_error: true,
        is_leaf: false,
        status,
        error: error2
      });
      branch.push(layout_loaded, error_loaded);
      stuff = error_loaded.stuff;
    }
    return await render_response({
      options,
      state,
      $session,
      page_config: {
        hydrate: options.hydrate,
        router: options.router
      },
      stuff,
      status,
      error: error2,
      branch,
      event,
      resolve_opts
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return new Response(error3.stack, {
      status: 500
    });
  }
}
async function respond$1(opts) {
  const { event, options, state, $session, route, resolve_opts } = opts;
  let nodes;
  if (!resolve_opts.ssr) {
    return await render_response(__spreadProps(__spreadValues({}, opts), {
      branch: [],
      page_config: {
        hydrate: true,
        router: true
      },
      status: 200,
      error: null,
      event,
      stuff: {}
    }));
  }
  try {
    nodes = await Promise.all(route.a.map((n) => n == void 0 ? n : options.manifest._.nodes[n]()));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return await respond_with_error({
      event,
      options,
      state,
      $session,
      status: 500,
      error: error3,
      resolve_opts
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options);
  if (state.prerender) {
    const should_prerender = leaf.prerender ?? state.prerender.default;
    if (!should_prerender) {
      return new Response(void 0, {
        status: 204
      });
    }
  }
  let branch = [];
  let status = 200;
  let error2 = null;
  let set_cookie_headers = [];
  let stuff = {};
  ssr:
    if (resolve_opts.ssr) {
      for (let i2 = 0; i2 < nodes.length; i2 += 1) {
        const node = nodes[i2];
        let loaded;
        if (node) {
          try {
            loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
              node,
              stuff,
              is_error: false,
              is_leaf: i2 === nodes.length - 1
            }));
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies(new Response(void 0, {
                status: loaded.loaded.status,
                headers: {
                  location: loaded.loaded.redirect
                }
              }), set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e2 = coalesce_to_error(err);
            options.handle_error(e2, event);
            status = 500;
            error2 = e2;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i2--) {
              if (route.b[i2]) {
                const index = route.b[i2];
                const error_node = await options.manifest._.nodes[index]();
                let node_loaded;
                let j = i2;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                    node: error_node,
                    stuff: node_loaded.stuff,
                    is_error: true,
                    is_leaf: false,
                    status,
                    error: error2
                  }));
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  stuff = __spreadValues(__spreadValues({}, node_loaded.stuff), error_loaded.stuff);
                  break ssr;
                } catch (err) {
                  const e2 = coalesce_to_error(err);
                  options.handle_error(e2, event);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              event,
              options,
              state,
              $session,
              status,
              error: error2,
              resolve_opts
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = __spreadValues(__spreadValues({}, stuff), loaded.loaded.stuff);
        }
      }
    }
  try {
    return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
      stuff,
      event,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    })), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
      status: 500,
      error: error3
    })), set_cookie_headers);
  }
}
function get_page_config(leaf, options) {
  if ("ssr" in leaf) {
    throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
  }
  return {
    router: "router" in leaf ? !!leaf.router : options.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    set_cookie_headers.forEach((value) => {
      response.headers.append("set-cookie", value);
    });
  }
  return response;
}
async function render_page(event, route, options, state, resolve_opts) {
  if (state.initiator === route) {
    return new Response(`Not found: ${event.url.pathname}`, {
      status: 404
    });
  }
  if (route.shadow) {
    const type = negotiate(event.request.headers.get("accept") || "text/html", [
      "text/html",
      "application/json"
    ]);
    if (type === "application/json") {
      return render_endpoint(event, await route.shadow());
    }
  }
  const $session = await options.hooks.getSession(event);
  return respond$1({
    event,
    options,
    state,
    $session,
    resolve_opts,
    route
  });
}
function negotiate(accept, types2) {
  const parts = accept.split(",").map((str, i2) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      return { type, subtype, q: +q, i: i2 };
    }
    throw new Error(`Invalid Accept header: ${accept}`);
  }).sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types2) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function exec(match, names, types2, matchers) {
  const params = {};
  for (let i2 = 0; i2 < names.length; i2 += 1) {
    const name = names[i2];
    const type = types2[i2];
    const value = match[i2 + 1] || "";
    if (type) {
      const matcher = matchers[type];
      if (!matcher)
        throw new Error(`Missing "${type}" param matcher`);
      if (!matcher(value))
        return;
    }
    params[name] = value;
  }
  return params;
}
var DATA_SUFFIX = "/__data.json";
var default_transform = ({ html }) => html;
async function respond(request, options, state) {
  var _a4, _b, _c;
  let url = new URL(request.url);
  const normalized = normalize_path(url.pathname, options.trailing_slash);
  if (normalized !== url.pathname && !((_a4 = state.prerender) == null ? void 0 : _a4.fallback)) {
    return new Response(void 0, {
      status: 301,
      headers: {
        location: (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
      }
    });
  }
  const { parameter, allowed } = options.method_override;
  const method_override = (_b = url.searchParams.get(parameter)) == null ? void 0 : _b.toUpperCase();
  if (method_override) {
    if (request.method === "POST") {
      if (allowed.includes(method_override)) {
        request = new Proxy(request, {
          get: (target, property, _receiver) => {
            if (property === "method")
              return method_override;
            return Reflect.get(target, property, target);
          }
        });
      } else {
        const verb = allowed.length === 0 ? "enabled" : "allowed";
        const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
        return new Response(body, {
          status: 400
        });
      }
    } else {
      throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
    }
  }
  let decoded = decodeURI(url.pathname);
  let route = null;
  let params = {};
  if (options.paths.base && !((_c = state.prerender) == null ? void 0 : _c.fallback)) {
    if (!decoded.startsWith(options.paths.base)) {
      return new Response(void 0, { status: 404 });
    }
    decoded = decoded.slice(options.paths.base.length) || "/";
  }
  const is_data_request = decoded.endsWith(DATA_SUFFIX);
  if (is_data_request) {
    decoded = decoded.slice(0, -DATA_SUFFIX.length) || "/";
    const normalized2 = normalize_path(url.pathname.slice(0, -DATA_SUFFIX.length), options.trailing_slash);
    url = new URL(url.origin + normalized2 + url.search);
  }
  if (!state.prerender || !state.prerender.fallback) {
    const matchers = await options.manifest._.matchers();
    for (const candidate of options.manifest._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match)
        continue;
      const matched = exec(match, candidate.names, candidate.types, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  const event = {
    get clientAddress() {
      if (!state.getClientAddress) {
        throw new Error(`${"@sveltejs/adapter-vercel"} does not specify getClientAddress. Please raise an issue`);
      }
      Object.defineProperty(event, "clientAddress", {
        value: state.getClientAddress()
      });
      return event.clientAddress;
    },
    locals: {},
    params,
    platform: state.platform,
    request,
    routeId: route && route.id,
    url
  };
  const removed = (property, replacement, suffix = "") => ({
    get: () => {
      throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
    }
  });
  const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
  const body_getter = {
    get: () => {
      throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
    }
  };
  Object.defineProperties(event, {
    method: removed("method", "request.method", details),
    headers: removed("headers", "request.headers", details),
    origin: removed("origin", "url.origin"),
    path: removed("path", "url.pathname"),
    query: removed("query", "url.searchParams"),
    body: body_getter,
    rawBody: body_getter
  });
  let resolve_opts = {
    ssr: true,
    transformPage: default_transform
  };
  try {
    const response = await options.hooks.handle({
      event,
      resolve: async (event2, opts) => {
        if (opts) {
          resolve_opts = {
            ssr: opts.ssr !== false,
            transformPage: opts.transformPage || default_transform
          };
        }
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            event: event2,
            options,
            state,
            $session: await options.hooks.getSession(event2),
            page_config: { router: true, hydrate: true },
            stuff: {},
            status: 200,
            error: null,
            branch: [],
            resolve_opts: __spreadProps(__spreadValues({}, resolve_opts), {
              ssr: false
            })
          });
        }
        if (route) {
          let response2;
          if (is_data_request && route.type === "page" && route.shadow) {
            response2 = await render_endpoint(event2, await route.shadow());
            if (request.headers.has("x-sveltekit-load")) {
              if (response2.status >= 300 && response2.status < 400) {
                const location = response2.headers.get("location");
                if (location) {
                  const headers = new Headers(response2.headers);
                  headers.set("x-sveltekit-location", location);
                  response2 = new Response(void 0, {
                    status: 204,
                    headers
                  });
                }
              }
            }
          } else {
            response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, resolve_opts);
          }
          if (response2) {
            if (response2.status === 200 && response2.headers.has("etag")) {
              let if_none_match_value = request.headers.get("if-none-match");
              if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                if_none_match_value = if_none_match_value.substring(2);
              }
              const etag = response2.headers.get("etag");
              if (if_none_match_value === etag) {
                const headers = new Headers({ etag });
                for (const key2 of [
                  "cache-control",
                  "content-location",
                  "date",
                  "expires",
                  "vary"
                ]) {
                  const value = response2.headers.get(key2);
                  if (value)
                    headers.set(key2, value);
                }
                return new Response(void 0, {
                  status: 304,
                  headers
                });
              }
            }
            return response2;
          }
        }
        if (!state.initiator) {
          const $session = await options.hooks.getSession(event2);
          return await respond_with_error({
            event: event2,
            options,
            state,
            $session,
            status: 404,
            error: new Error(`Not found: ${event2.url.pathname}`),
            resolve_opts
          });
        }
        if (state.prerender) {
          return new Response("not found", { status: 404 });
        }
        return await fetch(request);
      },
      get request() {
        throw new Error("request in handle has been replaced with event" + details);
      }
    });
    if (response && !(response instanceof Response)) {
      throw new Error("handle must return a Response object" + details);
    }
    return response;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    try {
      const $session = await options.hooks.getSession(event);
      return await respond_with_error({
        event,
        options,
        state,
        $session,
        status: 500,
        error: error2,
        resolve_opts
      });
    } catch (e22) {
      const error3 = coalesce_to_error(e22);
      return new Response(options.dev ? error3.stack : error3.message, {
        status: 500
      });
    }
  }
}
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
var template = ({ head, body, assets: assets2, nonce }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<link rel="stylesheet" href="/style/reset.css" />\n		<link rel="preconnect" href="https://fonts.googleapis.com">\n		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n		<link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">\n    	<link rel="stylesheet" href="/style/common.css" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6151369636468422" crossorigin="anonymous"><\/script>\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var read = null;
set_paths({ "base": "", "assets": "" });
var Server = class {
  constructor(manifest2) {
    this.options = {
      amp: false,
      csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
      dev: false,
      floc: false,
      get_stack: (error2) => String(error2),
      handle_error: (error2, event) => {
        this.options.hooks.handleError({
          error: error2,
          event,
          get request() {
            throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
          }
        });
        error2.stack = this.options.get_stack(error2);
      },
      hooks: null,
      hydrate: true,
      manifest: manifest2,
      method_override: { "parameter": "_method", "allowed": [] },
      paths: { base, assets },
      prefix: assets + "/_app/",
      prerender: true,
      read,
      root: Root,
      service_worker: null,
      router: true,
      template,
      template_contains_nonce: false,
      trailing_slash: "never"
    };
  }
  async respond(request, options = {}) {
    if (!(request instanceof Request)) {
      throw new Error("The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
    }
    if (!this.options.hooks) {
      const module2 = await Promise.resolve().then(() => (init_hooks_1c45ba0b(), hooks_1c45ba0b_exports));
      this.options.hooks = {
        getSession: module2.getSession || (() => ({})),
        handle: module2.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
        handleError: module2.handleError || (({ error: error2 }) => console.error(error2.stack)),
        externalFetch: module2.externalFetch || fetch
      };
    }
    return respond(request, this.options, options);
  }
};

// .svelte-kit/vercel-tmp/manifest.js
var manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["favicon.png", "img/.DS_Store", "img/add_people.svg", "img/app_icon.svg", "img/arrow-circle-left-solid.svg", "img/arrow-osha.svg", "img/arrow_simple_bottom.svg", "img/arrow_simple_right.svg", "img/blog_icon.svg", "img/bs2nd/a_gray.png", "img/bs2nd/a_gray_fill.svg", "img/bs2nd/ba_gray.png", "img/bs2nd/ba_gray.svg", "img/bs2nd/bakuzetsu-searchico-effect.png", "img/bs2nd/bakuzetsu-searchico.png", "img/bs2nd/biribiri.svg", "img/bs2nd/change.svg", "img/bs2nd/chi_gray.png", "img/bs2nd/copy.svg", "img/bs2nd/e_gray_fill.svg", "img/bs2nd/heal.svg", "img/bs2nd/ku_gray.png", "img/bs2nd/needle.svg", "img/bs2nd/sa_gray.png", "img/bs2nd/shield.svg", "img/bs2nd/tsu_gray.png", "img/bs2nd/wall.svg", "img/bs2nd/week.svg", "img/bs2nd/ze_gray.png", "img/contacts_icon.svg", "img/n2-icon-white.svg", "img/n2_clock/.DS_Store", "img/n2_clock/clock_body.svg", "img/n2_clock/clock_insidewheel.svg", "img/n2_clock/time-1.svg", "img/n2_clock/time-10.svg", "img/n2_clock/time-10_white.svg", "img/n2_clock/time-11.svg", "img/n2_clock/time-12.svg", "img/n2_clock/time-2.svg", "img/n2_clock/time-3.svg", "img/n2_clock/time-4.svg", "img/n2_clock/time-5.svg", "img/n2_clock/time-6.svg", "img/n2_clock/time-7.svg", "img/n2_clock/time-8.svg", "img/n2_clock/time-9.svg", "img/pokeca/icon_white.svg", "img/portfolio_icon.svg", "img/profile_icon.svg", "img/tcg-sim/card.svg", "img/tcg-sim/card_naname.svg", "img/tcg-sim/dmbd13-002a.jpeg", "img/tcg-sim/dmbd16-011-[4].jpeg", "img/tcg-sim/dmex17-003-[4].jpeg", "img/tcg-sim/dmr21-l02-[4].jpeg", "img/tcg-sim/ellipse.svg", "img/tcg-sim/require_device.svg", "img/trash.svg", "style/common.css", "style/reset.css"]),
  mimeTypes: { ".png": "image/png", ".svg": "image/svg+xml", ".jpeg": "image/jpeg", ".css": "text/css" },
  _: {
    entry: { "file": "start-4affbeea.js", "js": ["start-4affbeea.js", "chunks/index-7e81b4c7.js", "chunks/index-c0f974cf.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => (init__(), __exports)),
      () => Promise.resolve().then(() => (init__2(), __exports2)),
      () => Promise.resolve().then(() => (init__3(), __exports3)),
      () => Promise.resolve().then(() => (init__4(), __exports4)),
      () => Promise.resolve().then(() => (init__5(), __exports5)),
      () => Promise.resolve().then(() => (init__6(), __exports6)),
      () => Promise.resolve().then(() => (init__7(), __exports7)),
      () => Promise.resolve().then(() => (init__8(), __exports8)),
      () => Promise.resolve().then(() => (init__9(), __exports9)),
      () => Promise.resolve().then(() => (init__10(), __exports10)),
      () => Promise.resolve().then(() => (init__11(), __exports11)),
      () => Promise.resolve().then(() => (init__12(), __exports12)),
      () => Promise.resolve().then(() => (init__13(), __exports13)),
      () => Promise.resolve().then(() => (init__14(), __exports14)),
      () => Promise.resolve().then(() => (init__15(), __exports15)),
      () => Promise.resolve().then(() => (init__16(), __exports16)),
      () => Promise.resolve().then(() => (init__17(), __exports17)),
      () => Promise.resolve().then(() => (init__18(), __exports18)),
      () => Promise.resolve().then(() => (init__19(), __exports19)),
      () => Promise.resolve().then(() => (init__20(), __exports20))
    ],
    routes: [
      {
        type: "page",
        id: "app@root",
        pattern: /^\/app\/?$/,
        names: [],
        types: [],
        path: "/app",
        shadow: null,
        a: [0, 2, 3],
        b: [1, 1]
      },
      {
        type: "page",
        id: "contact@root",
        pattern: /^\/contact\/?$/,
        names: [],
        types: [],
        path: "/contact",
        shadow: null,
        a: [0, 2, 4],
        b: [1, 1]
      },
      {
        type: "page",
        id: "@root",
        pattern: /^\/?$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2, 5],
        b: [1, 1]
      },
      {
        type: "page",
        id: "introduce",
        pattern: /^\/introduce\/?$/,
        names: [],
        types: [],
        path: "/introduce",
        shadow: null,
        a: [0, 6],
        b: [1]
      },
      {
        type: "page",
        id: "show",
        pattern: /^\/show\/?$/,
        names: [],
        types: [],
        path: "/show",
        shadow: null,
        a: [0, 7],
        b: [1]
      },
      {
        type: "page",
        id: "blog/list",
        pattern: /^\/blog\/list\/?$/,
        names: [],
        types: [],
        path: "/blog/list",
        shadow: null,
        a: [0, 8],
        b: [1]
      },
      {
        type: "page",
        id: "blog/page",
        pattern: /^\/blog\/page\/?$/,
        names: [],
        types: [],
        path: "/blog/page",
        shadow: null,
        a: [0, 9],
        b: [1]
      },
      {
        type: "page",
        id: "app/DM-Downloader/collect",
        pattern: /^\/app\/DM-Downloader\/collect\/?$/,
        names: [],
        types: [],
        path: "/app/DM-Downloader/collect",
        shadow: null,
        a: [0, 10],
        b: [1]
      },
      {
        type: "page",
        id: "app/bakuzetsu-searcher-2nd/analyze@bs2nd",
        pattern: /^\/app\/bakuzetsu-searcher-2nd\/analyze\/?$/,
        names: [],
        types: [],
        path: "/app/bakuzetsu-searcher-2nd/analyze",
        shadow: null,
        a: [0, 11, 12],
        b: [1]
      },
      {
        type: "page",
        id: "app/bakuzetsu-searcher-2nd/edit@bs2nd",
        pattern: /^\/app\/bakuzetsu-searcher-2nd\/edit\/?$/,
        names: [],
        types: [],
        path: "/app/bakuzetsu-searcher-2nd/edit",
        shadow: null,
        a: [0, 11, 13],
        b: [1]
      },
      {
        type: "page",
        id: "app/bakuzetsu-searcher-2nd/post@bs2nd",
        pattern: /^\/app\/bakuzetsu-searcher-2nd\/post\/?$/,
        names: [],
        types: [],
        path: "/app/bakuzetsu-searcher-2nd/post",
        shadow: null,
        a: [0, 11, 14],
        b: [1]
      },
      {
        type: "page",
        id: "app/pokemon-card-game-effector/game@pokeca",
        pattern: /^\/app\/pokemon-card-game-effector\/game\/?$/,
        names: [],
        types: [],
        path: "/app/pokemon-card-game-effector/game",
        shadow: null,
        a: [0, 15, 16],
        b: [1]
      },
      {
        type: "page",
        id: "app/tcg-simulator/edit@tcg",
        pattern: /^\/app\/tcg-simulator\/edit\/?$/,
        names: [],
        types: [],
        path: "/app/tcg-simulator/edit",
        shadow: null,
        a: [0, 17, 18],
        b: [1]
      },
      {
        type: "page",
        id: "app/tcg-simulator/game@tcg",
        pattern: /^\/app\/tcg-simulator\/game\/?$/,
        names: [],
        types: [],
        path: "/app/tcg-simulator/game",
        shadow: null,
        a: [0, 17, 19],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
};

// .svelte-kit/vercel-tmp/entry.js
var server = new Server(manifest);
var entry_default = async (req, res) => {
  let request;
  try {
    request = await getRequest(`https://${req.headers.host}`, req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  setResponse(res, await server.respond(request, {
    getClientAddress() {
      return request.headers.get("x-forwarded-for");
    }
  }));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
