var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

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
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2 = true) {
  for (let part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        let end = part.byteOffset + part.byteLength;
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
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    length += isBlob(value) ? value.size : Buffer.byteLength(String(value));
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = import_stream.default.Readable.from(body.stream());
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
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
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
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
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
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
    const request_ = send(options2);
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
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
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
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
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
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), reject);
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
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), reject);
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), reject);
        raw.once("data", (chunk) => {
          body = (chunk[0] & 15) === 8 ? (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), reject) : (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), reject);
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), reject);
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
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
var import_http, import_https, import_zlib, import_stream, import_util, import_crypto, import_url, commonjsGlobal, src, dataUriToBuffer$1, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _Blob, Blob2, Blob$1, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, carriage, dashes, carriageLength, getFooter, getBoundary, INTERNALS$2, Body, clone, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    import_http = __toModule(require("http"));
    import_https = __toModule(require("https"));
    import_zlib = __toModule(require("zlib"));
    import_stream = __toModule(require("stream"));
    import_util = __toModule(require("util"));
    import_crypto = __toModule(require("crypto"));
    import_url = __toModule(require("url"));
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    src = dataUriToBuffer;
    dataUriToBuffer$1 = src;
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop2() {
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
        function typeIsObject(x) {
          return typeof x === "object" && x !== null || typeof x === "function";
        }
        const rethrowAssertionErrorRejection = noop2;
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
        function reflectCall(F, V, args) {
          if (typeof F !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F, V, args);
        }
        function promiseCall(F, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F, V, args));
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
            let i = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i !== elements.length || node._next !== void 0) {
              if (i === elements.length) {
                node = node._next;
                elements = node._elements;
                i = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i]);
              ++i;
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
        const NumberIsFinite = Number.isFinite || function(x) {
          return typeof x === "number" && isFinite(x);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x) {
          return typeof x === "object" || typeof x === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x, context) {
          if (typeof x !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x) {
          return typeof x === "object" && x !== null || typeof x === "function";
        }
        function assertObject(x, context) {
          if (!isObject(x)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x, position, context) {
          if (x === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x, field, context) {
          if (x === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x) {
          return x === 0 ? 0 : x;
        }
        function integerPart(x) {
          return censorNegativeZero(MathTrunc(x));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x = Number(value);
          x = censorNegativeZero(x);
          if (!NumberIsFinite(x)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x = integerPart(x);
          if (x < lowerBound || x > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x) || x === 0) {
            return 0;
          }
          return x;
        }
        function assertReadableStream(x, context) {
          if (!IsReadableStream(x)) {
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
              _errorSteps: (e) => rejectPromise(e)
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
        function IsReadableStreamDefaultReader(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_readRequests")) {
            return false;
          }
          return x instanceof ReadableStreamDefaultReader;
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
        function IsReadableStreamAsyncIterator(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x) {
          return x !== x;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src2, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src2, srcOffset, n), destOffset);
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
          error(e = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e);
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
              const entry = this._queue.shift();
              this._queueTotalSize -= entry.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
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
        function IsReadableByteStreamController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledReadableByteStream")) {
            return false;
          }
          return x instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x instanceof ReadableStreamBYOBRequest;
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
          }, (e) => {
            ReadableByteStreamControllerError(controller, e);
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
              const e = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e);
              readIntoRequest._errorSteps(e);
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
              const e = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e);
              throw e;
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
        function ReadableByteStreamControllerError(controller, e) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e);
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
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, view.byteLength);
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
          }, (r) => {
            ReadableByteStreamControllerError(controller, r);
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
              _errorSteps: (e) => rejectPromise(e)
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
        function IsReadableStreamBYOBReader(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_readIntoRequests")) {
            return false;
          }
          return x instanceof ReadableStreamBYOBReader;
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
        function assertWritableStream(x, context) {
          if (!IsWritableStream(x)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a) {
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
        function IsWritableStream(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_writableStreamController")) {
            return false;
          }
          return x instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
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
        function IsWritableStreamDefaultWriter(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_ownerWritableStream")) {
            return false;
          }
          return x instanceof WritableStreamDefaultWriter;
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
          error(e = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e);
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
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledWritableStream")) {
            return false;
          }
          return x instanceof WritableStreamDefaultController;
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
          }, (r) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r);
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
          } catch (_a) {
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
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
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
          error(e = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e);
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
        function IsReadableStreamDefaultController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledReadableStream")) {
            return false;
          }
          return x instanceof ReadableStreamDefaultController;
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
          }, (e) => {
            ReadableStreamDefaultControllerError(controller, e);
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
        function ReadableStreamDefaultControllerError(controller, e) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e);
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
          }, (r) => {
            ReadableStreamDefaultControllerError(controller, r);
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
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  reading = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
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
          uponRejection(reader._closedPromise, (r) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
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
            uponRejection(thisReader._closedPromise, (r) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r);
              ReadableByteStreamControllerError(branch2._readableStreamController, r);
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
                  reading = false;
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
                  reading = false;
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
        function convertReaderOptions(options2, context) {
          assertDictionary(options2, context);
          const mode = options2 === null || options2 === void 0 ? void 0 : options2.mode;
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
        function convertIteratorOptions(options2, context) {
          assertDictionary(options2, context);
          const preventCancel = options2 === null || options2 === void 0 ? void 0 : options2.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options2, context) {
          assertDictionary(options2, context);
          const preventAbort = options2 === null || options2 === void 0 ? void 0 : options2.preventAbort;
          const preventCancel = options2 === null || options2 === void 0 ? void 0 : options2.preventCancel;
          const preventClose = options2 === null || options2 === void 0 ? void 0 : options2.preventClose;
          const signal = options2 === null || options2 === void 0 ? void 0 : options2.signal;
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
          const readable2 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable2, "readable", "ReadableWritablePair");
          assertReadableStream(readable2, `${context} has member 'readable' that`);
          const writable2 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable2, "writable", "ReadableWritablePair");
          assertWritableStream(writable2, `${context} has member 'writable' that`);
          return { readable: readable2, writable: writable2 };
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
            const options2 = convertReaderOptions(rawOptions, "First parameter");
            if (options2.mode === void 0) {
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
            const options2 = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options2.preventClose, options2.preventAbort, options2.preventCancel, options2.signal);
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
            let options2;
            try {
              options2 = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e) {
              return promiseRejectedWith(e);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options2.preventClose, options2.preventAbort, options2.preventCancel, options2.signal);
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
            const options2 = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options2.preventCancel);
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
        function IsReadableStream(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_readableStreamController")) {
            return false;
          }
          return x instanceof ReadableStream2;
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
          return transformPromiseWith(sourceCancelPromise, noop2);
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
        function ReadableStreamError(stream, e) {
          stream._state = "errored";
          stream._storedError = e;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e);
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
          constructor(options2) {
            assertRequiredArgument(options2, 1, "ByteLengthQueuingStrategy");
            options2 = convertQueuingStrategyInit(options2, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options2.highWaterMark;
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
        function IsByteLengthQueuingStrategy(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options2) {
            assertRequiredArgument(options2, 1, "CountQueuingStrategy");
            options2 = convertQueuingStrategyInit(options2, "First parameter");
            this._countQueuingStrategyHighWaterMark = options2.highWaterMark;
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
        function IsCountQueuingStrategy(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x instanceof CountQueuingStrategy;
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
        function IsTransformStream(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_transformStreamController")) {
            return false;
          }
          return x instanceof TransformStream;
        }
        function TransformStreamError(stream, e) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e);
          TransformStreamErrorWritableAndUnblockWrite(stream, e);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e);
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
        function IsTransformStreamDefaultController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledTransformStream")) {
            return false;
          }
          return x instanceof TransformStreamDefaultController;
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
          } catch (e) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e) {
          TransformStreamError(controller._controlledTransformStream, e);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r) => {
            TransformStreamError(controller._controlledTransformStream, r);
            throw r;
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
              const writable2 = stream._writable;
              const state = writable2._state;
              if (state === "erroring") {
                throw writable2._storedError;
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
          const readable2 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable2._state === "errored") {
              throw readable2._storedError;
            }
            ReadableStreamDefaultControllerClose(readable2._readableStreamController);
          }, (r) => {
            TransformStreamError(stream, r);
            throw readable2._storedError;
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
        Object.assign(globalThis, require("stream/web"));
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
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
    _Blob = class Blob {
      #parts = [];
      #type = "";
      #size = 0;
      constructor(blobParts = [], options2 = {}) {
        let size = 0;
        const parts = blobParts.map((element) => {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = new TextEncoder().encode(element);
          }
          size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          return part;
        });
        const type = options2.type === void 0 ? "" : String(options2.type);
        this.#type = /[^\u0020-\u007E]/.test(type) ? "" : type;
        this.#size = size;
        this.#parts = parts;
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (let part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
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
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    Blob$1 = Blob2;
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
      return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    carriage = "\r\n";
    dashes = "-".repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
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
        else if (import_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_stream.default)
          ;
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = import_stream.default.Readable.from(formDataIterator(body, boundary));
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
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
      let { body } = instance;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_stream.PassThrough({ highWaterMark });
        p2 = new import_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
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
      if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof import_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request;
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
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        import_stream.default.Readable.from(body.stream()).pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
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
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status != null ? options2.status : 200;
        const headers = new Headers(options2.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options2.url,
          status,
          statusText: options2.statusText || "",
          headers,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark
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
        return new Response(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response.prototype, {
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
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
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
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_url.format)(this[INTERNALS].parsedURL);
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
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers(request[INTERNALS].headers);
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
      const requestOptions = {
        path: parsedURL.pathname + search,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
  }
});

// node_modules/@sveltejs/adapter-vercel/files/shims.js
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-vercel/files/shims.js"() {
    init_install_fetch();
  }
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  "node_modules/axios/lib/helpers/bind.js"(exports, module2) {
    init_shims();
    "use strict";
    module2.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };
  }
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS({
  "node_modules/axios/lib/utils.js"(exports, module2) {
    init_shims();
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
    function isFormData2(val) {
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
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === "function") {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
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
      isFormData: isFormData2,
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
    init_shims();
    "use strict";
    var utils = require_utils();
    function encode(val) {
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
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === "undefined") {
            return;
          }
          if (utils.isArray(val)) {
            key = key + "[]";
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + "=" + encode(v));
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
    init_shims();
    "use strict";
    var utils = require_utils();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options2) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options2 ? options2.synchronous : false,
        runWhen: options2 ? options2.runWhen : null
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };
    module2.exports = InterceptorManager;
  }
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  "node_modules/axios/lib/helpers/normalizeHeaderName.js"(exports, module2) {
    init_shims();
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
    init_shims();
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
    init_shims();
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
    init_shims();
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
    init_shims();
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
        read: function read(name) {
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
        read: function read() {
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
    init_shims();
    "use strict";
    module2.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  "node_modules/axios/lib/helpers/combineURLs.js"(exports, module2) {
    init_shims();
    "use strict";
    module2.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
  }
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  "node_modules/axios/lib/core/buildFullPath.js"(exports, module2) {
    init_shims();
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
    init_shims();
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
      var key;
      var val;
      var i;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split("\n"), function parser(line) {
        i = line.indexOf(":");
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
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
    init_shims();
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
    init_shims();
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
    init_shims();
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
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
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
    init_shims();
    var s2 = 1e3;
    var m = s2 * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options2) {
      options2 = options2 || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options2.long ? fmtLong(val) : fmtShort(val);
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
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s2;
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
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s2) {
        return Math.round(ms / s2) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s2) {
        return plural(ms, msAbs, s2, "second");
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
    init_shims();
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash2 = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash2 = (hash2 << 5) - hash2 + namespace.charCodeAt(i);
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
          let index2 = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format2) => {
            if (match === "%%") {
              return "%";
            }
            index2++;
            const formatter = createDebug.formatters[format2];
            if (typeof formatter === "function") {
              const val = args[index2];
              match = formatter.call(self2, val);
              args.splice(index2, 1);
              index2--;
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
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
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
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
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
    init_shims();
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
      let index2 = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index2++;
        if (match === "%c") {
          lastC = index2;
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
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error2) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
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
    init_shims();
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
    init_shims();
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
    init_shims();
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
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
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
        const colorCode = "[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} [0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "[0m");
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
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
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
    init_shims();
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
    init_shims();
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
    init_shims();
    var url = require("url");
    var URL2 = url.URL;
    var http2 = require("http");
    var https2 = require("https");
    var Writable = require("stream").Writable;
    var assert = require("assert");
    var debug = require_debug();
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = Object.create(null);
    events.forEach(function(event) {
      eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "");
    var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
    var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
    var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    function RedirectableRequest(options2, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options2);
      this._options = options2;
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
    RedirectableRequest.prototype._sanitizeOptions = function(options2) {
      if (!options2.headers) {
        options2.headers = {};
      }
      if (options2.host) {
        if (!options2.hostname) {
          options2.hostname = options2.host;
        }
        delete options2.host;
      }
      if (!options2.pathname && options2.path) {
        var searchPos = options2.path.indexOf("?");
        if (searchPos < 0) {
          options2.pathname = options2.path;
        } else {
          options2.pathname = options2.path.substring(0, searchPos);
          options2.search = options2.path.substring(searchPos);
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
        var scheme = protocol.substr(0, protocol.length - 1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
      this._currentUrl = url.format(this._options);
      request._redirectable = this;
      for (var e = 0; e < events.length; e++) {
        request.on(events[e], eventHandlers[events[e]]);
      }
      if (this._isRedirect) {
        var i = 0;
        var self2 = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error2) {
          if (request === self2._currentRequest) {
            if (error2) {
              self2.emit("error", error2);
            } else if (i < buffers.length) {
              var buffer = buffers[i++];
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
      Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports2[scheme] = Object.create(nativeProtocol);
        function request(input, options2, callback) {
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
            callback = options2;
            options2 = input;
            input = { protocol };
          }
          if (typeof options2 === "function") {
            callback = options2;
            options2 = null;
          }
          options2 = Object.assign({
            maxRedirects: exports2.maxRedirects,
            maxBodyLength: exports2.maxBodyLength
          }, input, options2);
          options2.nativeProtocols = nativeProtocols;
          assert.equal(options2.protocol, protocol, "protocol mismatch");
          debug("options", options2);
          return new RedirectableRequest(options2, callback);
        }
        function get(input, options2, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options2, callback);
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
    function noop2() {
    }
    function urlToOptions(urlObject) {
      var options2 = {
        protocol: urlObject.protocol,
        hostname: urlObject.hostname.startsWith("[") ? urlObject.hostname.slice(1, -1) : urlObject.hostname,
        hash: urlObject.hash,
        search: urlObject.search,
        pathname: urlObject.pathname,
        path: urlObject.pathname + urlObject.search,
        href: urlObject.href
      };
      if (urlObject.port !== "") {
        options2.port = Number(urlObject.port);
      }
      return options2;
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
      for (var e = 0; e < events.length; e++) {
        request.removeListener(events[e], eventHandlers[events[e]]);
      }
      request.on("error", noop2);
      request.abort();
    }
    module2.exports = wrap({ http: http2, https: https2 });
    module2.exports.wrap = wrap;
  }
});

// node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  "node_modules/axios/lib/env/data.js"(exports, module2) {
    init_shims();
    module2.exports = {
      "version": "0.23.0"
    };
  }
});

// node_modules/axios/lib/adapters/http.js
var require_http = __commonJS({
  "node_modules/axios/lib/adapters/http.js"(exports, module2) {
    init_shims();
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
    function setProxy(options2, proxy, location) {
      options2.hostname = proxy.host;
      options2.host = proxy.host;
      options2.port = proxy.port;
      options2.path = location;
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ":" + proxy.auth.password, "utf8").toString("base64");
        options2.headers["Proxy-Authorization"] = "Basic " + base64;
      }
      options2.beforeRedirect = function beforeRedirect(redirection) {
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
        var options2 = {
          path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ""),
          method: config.method.toUpperCase(),
          headers,
          agent,
          agents: { http: config.httpAgent, https: config.httpsAgent },
          auth
        };
        if (config.socketPath) {
          options2.socketPath = config.socketPath;
        } else {
          options2.hostname = parsed.hostname;
          options2.port = parsed.port;
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
              var noProxy = noProxyEnv.split(",").map(function trim(s2) {
                return s2.trim();
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
          options2.headers.host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
          setProxy(options2, proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options2.path);
        }
        var transport;
        var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
        if (config.transport) {
          transport = config.transport;
        } else if (config.maxRedirects === 0) {
          transport = isHttpsProxy ? https2 : http2;
        } else {
          if (config.maxRedirects) {
            options2.maxRedirects = config.maxRedirects;
          }
          transport = isHttpsProxy ? httpsFollow : httpFollow;
        }
        if (config.maxBodyLength > -1) {
          options2.maxBodyLength = config.maxBodyLength;
        }
        if (config.insecureHTTPParser) {
          options2.insecureHTTPParser = config.insecureHTTPParser;
        }
        var req = transport.request(options2, function handleResponse(res) {
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
    init_shims();
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
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
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
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw enhanceError(e, this, "E_JSON_PARSE");
              }
              throw e;
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
    init_shims();
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
    init_shims();
    "use strict";
    module2.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  "node_modules/axios/lib/core/dispatchRequest.js"(exports, module2) {
    init_shims();
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
    init_shims();
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
    init_shims();
    "use strict";
    var VERSION = require_data().version;
    var validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
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
    function assertOptions(options2, schema, allowUnknown) {
      if (typeof options2 !== "object") {
        throw new TypeError("options must be an object");
      }
      var keys = Object.keys(options2);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options2[opt];
          var result = value === void 0 || validator(value, opt, options2);
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
    init_shims();
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
    init_shims();
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
        var i;
        var l = token._listeners.length;
        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
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
      var index2 = this._listeners.indexOf(listener);
      if (index2 !== -1) {
        this._listeners.splice(index2, 1);
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
    init_shims();
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
    init_shims();
    "use strict";
    module2.exports = function isAxiosError(payload) {
      return typeof payload === "object" && payload.isAxiosError === true;
    };
  }
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  "node_modules/axios/lib/axios.js"(exports, module2) {
    init_shims();
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
    init_shims();
    module2.exports = require_axios();
  }
});

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});
init_shims();

// node_modules/@sveltejs/kit/dist/node.js
init_shims();
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
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

// .svelte-kit/output/server/app.js
init_shims();
var import_axios = __toModule(require_axios2());
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
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
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
  var counts = new Map();
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
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
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
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
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
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
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
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
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
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
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
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
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
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
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
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var escape_json_string_in_html_dict = {
  '"': '\\"',
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
function escape_json_string_in_html(str) {
  return escape$1(str, escape_json_string_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
}
var escape_html_attr_dict = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function escape_html_attr(str) {
  return '"' + escape$1(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
}
function escape$1(str, dict, unicode_encoder) {
  let result = "";
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char in dict) {
      result += dict[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += unicode_encoder(code);
      }
    } else {
      result += char;
    }
  }
  return result;
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${page2 && page2.path ? try_serialize(page2.path, (error3) => {
      throw new Error(`Failed to serialize page.path: ${error3.message}`);
    }) : null},
						query: new URLSearchParams(${page2 && page2.query ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && page2.params ? try_serialize(page2.params, (error3) => {
      throw new Error(`Failed to serialize page.params: ${error3.message}`);
    }) : null}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url=${escape_html_attr(url)}`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
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
    serialized = try_serialize({ ...error2, name, message, stack });
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
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const prefix = options2.paths.assets || options2.paths.base;
        const filename = (resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, _receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":"${escape_json_string_in_html(body)}"}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      stuff: { ...stuff }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
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
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let stuff = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = {
            ...stuff,
            ...loaded.loaded.stuff
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
var identity = (x) => x;
function assign(tar, src2) {
  for (const k in src2)
    tar[k] = src2[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
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
var is_client = typeof window !== "undefined";
var now = is_client ? () => window.performance.now() : () => Date.now();
var raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
var tasks = new Set();
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
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
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
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
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
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
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
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$z = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: null
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$z);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<link rel="stylesheet" href="/style/reset.css" />\n		<link rel="preconnect" href="https://fonts.googleapis.com">\n		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n		<link href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap" rel="stylesheet">\n    	<link rel="stylesheet" href="/style/common.css" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6151369636468422" crossorigin="anonymous"><\/script>\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-aaef2536.js",
      css: [assets + "/_app/assets/start-61d1577b.css", assets + "/_app/assets/vendor-42482fb6.css"],
      js: [assets + "/_app/start-aaef2536.js", assets + "/_app/chunks/vendor-081b076b.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 3988, "type": "image/png" }, { "file": "img/.DS_Store", "size": 6148, "type": null }, { "file": "img/add_people.svg", "size": 598, "type": "image/svg+xml" }, { "file": "img/app_icon.svg", "size": 3723, "type": "image/svg+xml" }, { "file": "img/arrow-circle-left-solid.svg", "size": 473, "type": "image/svg+xml" }, { "file": "img/arrow-osha.svg", "size": 762, "type": "image/svg+xml" }, { "file": "img/arrow_simple_bottom.svg", "size": 196, "type": "image/svg+xml" }, { "file": "img/arrow_simple_right.svg", "size": 270, "type": "image/svg+xml" }, { "file": "img/blog_icon.svg", "size": 1515, "type": "image/svg+xml" }, { "file": "img/bs2nd/a_gray.png", "size": 8451, "type": "image/png" }, { "file": "img/bs2nd/a_gray_fill.svg", "size": 1441, "type": "image/svg+xml" }, { "file": "img/bs2nd/ba_gray.png", "size": 8664, "type": "image/png" }, { "file": "img/bs2nd/ba_gray.svg", "size": 1441, "type": "image/svg+xml" }, { "file": "img/bs2nd/bakuzetsu-searchico-effect.png", "size": 462751, "type": "image/png" }, { "file": "img/bs2nd/bakuzetsu-searchico.png", "size": 368914, "type": "image/png" }, { "file": "img/bs2nd/biribiri.svg", "size": 242, "type": "image/svg+xml" }, { "file": "img/bs2nd/change.svg", "size": 582, "type": "image/svg+xml" }, { "file": "img/bs2nd/chi_gray.png", "size": 8409, "type": "image/png" }, { "file": "img/bs2nd/copy.svg", "size": 476, "type": "image/svg+xml" }, { "file": "img/bs2nd/e_gray_fill.svg", "size": 1230, "type": "image/svg+xml" }, { "file": "img/bs2nd/heal.svg", "size": 1055, "type": "image/svg+xml" }, { "file": "img/bs2nd/ku_gray.png", "size": 7616, "type": "image/png" }, { "file": "img/bs2nd/needle.svg", "size": 698, "type": "image/svg+xml" }, { "file": "img/bs2nd/sa_gray.png", "size": 8547, "type": "image/png" }, { "file": "img/bs2nd/shield.svg", "size": 691, "type": "image/svg+xml" }, { "file": "img/bs2nd/tsu_gray.png", "size": 7736, "type": "image/png" }, { "file": "img/bs2nd/wall.svg", "size": 523, "type": "image/svg+xml" }, { "file": "img/bs2nd/week.svg", "size": 503, "type": "image/svg+xml" }, { "file": "img/bs2nd/ze_gray.png", "size": 8329, "type": "image/png" }, { "file": "img/contacts_icon.svg", "size": 1409, "type": "image/svg+xml" }, { "file": "img/n2-icon-white.svg", "size": 210, "type": "image/svg+xml" }, { "file": "img/n2_clock/.DS_Store", "size": 6148, "type": null }, { "file": "img/n2_clock/clock_body.svg", "size": 18468, "type": "image/svg+xml" }, { "file": "img/n2_clock/clock_insidewheel.svg", "size": 1595, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-1.svg", "size": 633, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-10.svg", "size": 1790, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-10_white.svg", "size": 1790, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-11.svg", "size": 1058, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-12.svg", "size": 2716, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-2.svg", "size": 680, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-3.svg", "size": 702, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-4.svg", "size": 742, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-5.svg", "size": 1267, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-6.svg", "size": 719, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-7.svg", "size": 753, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-8.svg", "size": 798, "type": "image/svg+xml" }, { "file": "img/n2_clock/time-9.svg", "size": 1019, "type": "image/svg+xml" }, { "file": "img/portfolio_icon.svg", "size": 1100, "type": "image/svg+xml" }, { "file": "img/profile_icon.svg", "size": 1200, "type": "image/svg+xml" }, { "file": "img/tcg-sim/card.svg", "size": 622, "type": "image/svg+xml" }, { "file": "img/tcg-sim/card_naname.svg", "size": 703, "type": "image/svg+xml" }, { "file": "img/tcg-sim/dmbd13-002a.jpeg", "size": 152764, "type": "image/jpeg" }, { "file": "img/tcg-sim/dmbd16-011-[4].jpeg", "size": 177245, "type": "image/jpeg" }, { "file": "img/tcg-sim/dmex17-003-[4].jpeg", "size": 213712, "type": "image/jpeg" }, { "file": "img/tcg-sim/dmr21-l02-[4].jpeg", "size": 159352, "type": "image/jpeg" }, { "file": "img/tcg-sim/ellipse.svg", "size": 329, "type": "image/svg+xml" }, { "file": "img/tcg-sim/require_device.svg", "size": 941, "type": "image/svg+xml" }, { "file": "img/trash.svg", "size": 732, "type": "image/svg+xml" }, { "file": "style/common.css", "size": 690, "type": "text/css" }, { "file": "style/reset.css", "size": 1257, "type": "text/css" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/introduce\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/introduce/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/contact\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/contact.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/list\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/list.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/page\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/page.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/show\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/show/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/app\/bakuzetsu-searcher-2nd\/analyze\/?$/,
      params: empty,
      a: ["src/routes/app/bakuzetsu-searcher-2nd/__layout.reset.svelte", "src/routes/app/bakuzetsu-searcher-2nd/analyze.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/app\/bakuzetsu-searcher-2nd\/edit\/?$/,
      params: empty,
      a: ["src/routes/app/bakuzetsu-searcher-2nd/__layout.reset.svelte", "src/routes/app/bakuzetsu-searcher-2nd/edit.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/app\/bakuzetsu-searcher-2nd\/post\/?$/,
      params: empty,
      a: ["src/routes/app/bakuzetsu-searcher-2nd/__layout.reset.svelte", "src/routes/app/bakuzetsu-searcher-2nd/post.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/app\/DM-Downloader\/collect\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/app/DM-Downloader/collect.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/app\/tcg-simulator\/game\/?$/,
      params: empty,
      a: ["src/routes/app/tcg-simulator/__layout.reset.svelte", "src/routes/app/tcg-simulator/game.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/app\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/app.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/introduce/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/contact.svelte": () => Promise.resolve().then(function() {
    return contact;
  }),
  "src/routes/blog/list.svelte": () => Promise.resolve().then(function() {
    return list;
  }),
  "src/routes/blog/page.svelte": () => Promise.resolve().then(function() {
    return page;
  }),
  "src/routes/show/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/app/bakuzetsu-searcher-2nd/__layout.reset.svelte": () => Promise.resolve().then(function() {
    return __layout_reset$1;
  }),
  "src/routes/app/bakuzetsu-searcher-2nd/analyze.svelte": () => Promise.resolve().then(function() {
    return analyze;
  }),
  "src/routes/app/bakuzetsu-searcher-2nd/edit.svelte": () => Promise.resolve().then(function() {
    return edit;
  }),
  "src/routes/app/bakuzetsu-searcher-2nd/post.svelte": () => Promise.resolve().then(function() {
    return post;
  }),
  "src/routes/app/DM-Downloader/collect.svelte": () => Promise.resolve().then(function() {
    return collect;
  }),
  "src/routes/app/tcg-simulator/__layout.reset.svelte": () => Promise.resolve().then(function() {
    return __layout_reset;
  }),
  "src/routes/app/tcg-simulator/game.svelte": () => Promise.resolve().then(function() {
    return game;
  }),
  "src/routes/app.svelte": () => Promise.resolve().then(function() {
    return app;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-60babef2.js", "css": ["assets/pages/__layout.svelte-c6104550.css", "assets/vendor-42482fb6.css", "assets/ToastArea-00e911a5.css"], "js": ["pages/__layout.svelte-60babef2.js", "chunks/vendor-081b076b.js", "chunks/MainMenu-618d49d0.js", "chunks/ToastArea-c267bbc2.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-5e9574d9.js", "css": ["assets/vendor-42482fb6.css"], "js": ["error.svelte-5e9574d9.js", "chunks/vendor-081b076b.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-913e38bc.js", "css": ["assets/pages/index.svelte-7ded9e66.css", "assets/vendor-42482fb6.css"], "js": ["pages/index.svelte-913e38bc.js", "chunks/vendor-081b076b.js", "chunks/MainMenu-618d49d0.js"], "styles": [] }, "src/routes/introduce/index.svelte": { "entry": "pages/introduce/index.svelte-3f695cdc.js", "css": ["assets/pages/introduce/index.svelte-627fe975.css", "assets/vendor-42482fb6.css"], "js": ["pages/introduce/index.svelte-3f695cdc.js", "chunks/vendor-081b076b.js"], "styles": [] }, "src/routes/contact.svelte": { "entry": "pages/contact.svelte-dc59d1ec.js", "css": ["assets/pages/contact.svelte-297997af.css", "assets/vendor-42482fb6.css"], "js": ["pages/contact.svelte-dc59d1ec.js", "chunks/vendor-081b076b.js"], "styles": [] }, "src/routes/blog/list.svelte": { "entry": "pages/blog/list.svelte-e72fc64a.js", "css": ["assets/pages/blog/list.svelte-44f394b5.css", "assets/vendor-42482fb6.css"], "js": ["pages/blog/list.svelte-e72fc64a.js", "chunks/vendor-081b076b.js", "chunks/blogApi-42a86245.js", "chunks/api-b360e1be.js"], "styles": [] }, "src/routes/blog/page.svelte": { "entry": "pages/blog/page.svelte-0d2a5ea6.js", "css": ["assets/vendor-42482fb6.css"], "js": ["pages/blog/page.svelte-0d2a5ea6.js", "chunks/vendor-081b076b.js", "chunks/blogApi-42a86245.js", "chunks/api-b360e1be.js"], "styles": [] }, "src/routes/show/index.svelte": { "entry": "pages/show/index.svelte-3aedd2ab.js", "css": ["assets/pages/show/index.svelte-e2989a52.css", "assets/vendor-42482fb6.css", "assets/bs2ndLoader-8a29ed63.css"], "js": ["pages/show/index.svelte-3aedd2ab.js", "chunks/vendor-081b076b.js", "chunks/bs2ndLoader-145c5527.js"], "styles": [] }, "src/routes/app/bakuzetsu-searcher-2nd/__layout.reset.svelte": { "entry": "pages/app/bakuzetsu-searcher-2nd/__layout.reset.svelte-625cbf85.js", "css": ["assets/pages/app/bakuzetsu-searcher-2nd/__layout.reset.svelte-d62b57c2.css", "assets/vendor-42482fb6.css", "assets/ToastArea-00e911a5.css"], "js": ["pages/app/bakuzetsu-searcher-2nd/__layout.reset.svelte-625cbf85.js", "chunks/vendor-081b076b.js", "chunks/ToastArea-c267bbc2.js"], "styles": [] }, "src/routes/app/bakuzetsu-searcher-2nd/analyze.svelte": { "entry": "pages/app/bakuzetsu-searcher-2nd/analyze.svelte-ae28f433.js", "css": ["assets/pages/app/bakuzetsu-searcher-2nd/analyze.svelte-29b42ed3.css", "assets/vendor-42482fb6.css", "assets/bs2ndLoader-8a29ed63.css"], "js": ["pages/app/bakuzetsu-searcher-2nd/analyze.svelte-ae28f433.js", "chunks/vendor-081b076b.js", "chunks/summon-4c60e270.js", "chunks/api-b360e1be.js", "chunks/bs2ndLoader-145c5527.js"], "styles": [] }, "src/routes/app/bakuzetsu-searcher-2nd/edit.svelte": { "entry": "pages/app/bakuzetsu-searcher-2nd/edit.svelte-98ba1c89.js", "css": ["assets/pages/app/bakuzetsu-searcher-2nd/edit.svelte-0fbbe2cb.css", "assets/vendor-42482fb6.css", "assets/bs2ndLoader-8a29ed63.css"], "js": ["pages/app/bakuzetsu-searcher-2nd/edit.svelte-98ba1c89.js", "chunks/vendor-081b076b.js", "chunks/summon-4c60e270.js", "chunks/api-b360e1be.js", "chunks/bs2ndLoader-145c5527.js"], "styles": [] }, "src/routes/app/bakuzetsu-searcher-2nd/post.svelte": { "entry": "pages/app/bakuzetsu-searcher-2nd/post.svelte-6e92172f.js", "css": ["assets/vendor-42482fb6.css"], "js": ["pages/app/bakuzetsu-searcher-2nd/post.svelte-6e92172f.js", "chunks/vendor-081b076b.js"], "styles": [] }, "src/routes/app/DM-Downloader/collect.svelte": { "entry": "pages/app/DM-Downloader/collect.svelte-185f3a18.js", "css": ["assets/vendor-42482fb6.css"], "js": ["pages/app/DM-Downloader/collect.svelte-185f3a18.js", "chunks/vendor-081b076b.js", "chunks/api-b360e1be.js"], "styles": [] }, "src/routes/app/tcg-simulator/__layout.reset.svelte": { "entry": "pages/app/tcg-simulator/__layout.reset.svelte-e9f4ea9c.js", "css": ["assets/pages/app/tcg-simulator/__layout.reset.svelte-b45a6d21.css", "assets/vendor-42482fb6.css", "assets/ToastArea-00e911a5.css"], "js": ["pages/app/tcg-simulator/__layout.reset.svelte-e9f4ea9c.js", "chunks/vendor-081b076b.js", "chunks/ToastArea-c267bbc2.js", "chunks/TCGsimStore-efdd8d9c.js"], "styles": [] }, "src/routes/app/tcg-simulator/game.svelte": { "entry": "pages/app/tcg-simulator/game.svelte-47dcba06.js", "css": ["assets/pages/app/tcg-simulator/game.svelte-6890c9bd.css", "assets/vendor-42482fb6.css"], "js": ["pages/app/tcg-simulator/game.svelte-47dcba06.js", "chunks/vendor-081b076b.js", "chunks/TCGsimStore-efdd8d9c.js"], "styles": [] }, "src/routes/app.svelte": { "entry": "pages/app.svelte-e4bbc89c.js", "css": ["assets/pages/app.svelte-f9f78e1b.css", "assets/vendor-42482fb6.css"], "js": ["pages/app.svelte-e4bbc89c.js", "chunks/vendor-081b076b.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
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
var mainmenus = writable([
  {
    name: "profile",
    path: "/introduce",
    img: "/img/profile_icon.svg",
    explain: "Taro Nonoyama\u306E<br>\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u8868\u793A\u3057\u307E\u3059\u3002",
    submenu: []
  },
  {
    name: "blog",
    path: "/blog/list",
    img: "/img/blog_icon.svg",
    explain: "\u30D6\u30ED\u30B0\u3092\u8868\u793A\u3057\u307E\u3059<br> (Powered by Notion API)",
    submenu: []
  },
  {
    name: "portfolio",
    path: "/portfolio",
    img: "/img/portfolio_icon.svg",
    explain: "\u30DD\u30FC\u30C8\u30D5\u30A9\u30EA\u30AA\u3092\u8868\u793A\u3057\u3001<br>\u30AF\u30EA\u30A8\u30A4\u30C6\u30A3\u30D6\u306E\u30D2\u30F3\u30C8\u3092\u63D0\u793A\u3057\u307E\u3059\u3002",
    submenu: []
  },
  {
    name: "app",
    path: "/app",
    img: "/img/app_icon.svg",
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
    explain: "\u9023\u7D61\u5148\u30FBSNS\u30A2\u30AB\u30A6\u30F3\u30C8\u3092<br>\u8868\u793A\u3057\u307E\u3059\u3002",
    submenu: []
  },
  {
    name: "bonus",
    path: "/show",
    img: "/img/app_icon.svg",
    explain: "\u30AA\u30DE\u30B1",
    submenu: []
  }
]);
var MediaQuery = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { query } = $$props;
  let matches = false;
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  return `${slots.default ? slots.default({ matches }) : ``}`;
});
var css$y = {
  code: ".menu-box.svelte-8jba9e.svelte-8jba9e{position:relative;display:inline-block}.menu-box.svelte-8jba9e .menu-name.svelte-8jba9e{border-radius:20px;padding:5px 20px}.menu-box.svelte-8jba9e .menu-name.svelte-8jba9e:hover{background:white}.menu-box.svelte-8jba9e .menu-name:hover p.svelte-8jba9e{color:black}.menu-box.svelte-8jba9e .explain-box.svelte-8jba9e{z-index:100;position:absolute;margin-top:30px;right:0;opacity:0;background:linear-gradient(90deg, #141414, rgba(20, 20, 20, 0.5));padding:20px;display:flex;flex-direction:row;align-items:center;transition:0.2s}.menu-box.svelte-8jba9e .explain-box.open.svelte-8jba9e{opacity:1}.menu-box.svelte-8jba9e .explain-box img.svelte-8jba9e{width:50px}.menu-box.svelte-8jba9e .explain-box p.svelte-8jba9e{padding:20px;width:300px;color:white}",
  map: null
};
var HeaderMenuBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$y);
  return `<div class="${"menu-box svelte-8jba9e"}"><div class="${"menu-name svelte-8jba9e"}"><a${add_attribute("href", path, 0)}><p class="${"svelte-8jba9e"}">${escape(name)}</p></a></div>
    <div class="${"explain-box " + escape("") + " svelte-8jba9e"}"><img${add_attribute("src", img, 0)} alt="${""}" class="${"svelte-8jba9e"}">
        <p class="${"svelte-8jba9e"}"><!-- HTML_TAG_START -->${explain}<!-- HTML_TAG_END --></p></div>
</div>`;
});
var css$x = {
  code: ".menu-box.svelte-13vu3ny.svelte-13vu3ny{padding:15px 10px;display:flex;height:100px;flex-direction:row}.menu-box.svelte-13vu3ny img.icon.svelte-13vu3ny{margin:0 10px;height:50px}.menu-box.svelte-13vu3ny img.arrow.svelte-13vu3ny{transform:rotate(-90deg);height:15px;margin:auto 0}.menu-box.svelte-13vu3ny .text.svelte-13vu3ny{padding:0 5px;width:230px}.menu-box.svelte-13vu3ny .text .name.svelte-13vu3ny{font-size:13px;margin:0 0 5px 0}.menu-box.svelte-13vu3ny .text .explain.svelte-13vu3ny{font-size:10px}",
  map: null
};
var HambergerMenuBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$x);
  return `<a${add_attribute("href", path, 0)}><div class="${"menu-box svelte-13vu3ny"}"><img class="${"icon svelte-13vu3ny"}"${add_attribute("src", img, 0)} alt="${""}">
        <div class="${"text svelte-13vu3ny"}"><p class="${"name svelte-13vu3ny"}">${escape(name)}</p>
            <p class="${"explain svelte-13vu3ny"}"><!-- HTML_TAG_START -->${explain}<!-- HTML_TAG_END --></p></div>
        <img class="${"arrow svelte-13vu3ny"}" src="${"/img/arrow-osha.svg"}" alt="${">"}"></div>
</a>`;
});
var defaults = {
  duration: 4e3,
  initial: 1,
  next: 0,
  pausable: false,
  dismissable: true,
  reversed: false,
  intro: { x: 256 },
  theme: {}
};
var createToast = () => {
  const { subscribe: subscribe2, update } = writable([]);
  let count = 0;
  const options2 = {};
  const _obj = (obj) => obj instanceof Object;
  const push = (msg, opts = {}) => {
    const param = { target: "default", ..._obj(msg) ? msg : { ...opts, msg } };
    const conf = options2[param.target] || {};
    const entry = {
      ...defaults,
      ...conf,
      ...param,
      theme: { ...conf.theme, ...param.theme },
      id: ++count
    };
    update((n) => entry.reversed ? [...n, entry] : [entry, ...n]);
    return count;
  };
  const pop = (id) => {
    update((n) => {
      if (!n.length || id === 0)
        return [];
      if (_obj(id))
        return n.filter((i) => id(i));
      const target = id || Math.max(...n.map((i) => i.id));
      return n.filter((i) => i.id !== target);
    });
  };
  const set = (id, opts = {}) => {
    const param = _obj(id) ? { ...id } : { ...opts, id };
    update((n) => {
      const idx = n.findIndex((i) => i.id === param.id);
      if (idx > -1) {
        n[idx] = { ...n[idx], ...param };
      }
      return n;
    });
  };
  const _init = (target = "default", opts = {}) => {
    options2[target] = opts;
    return options2;
  };
  return { subscribe: subscribe2, push, pop, set, _init };
};
var toast = createToast();
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
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults2 = {}) {
  const store = writable(value);
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
var css$w = {
  code: "._toastItem.svelte-j9nwjb{width:var(--toastWidth, 16rem);height:var(--toastHeight, auto);min-height:var(--toastMinHeight, 3.5rem);margin:var(--toastMargin, 0 0 0.5rem 0);padding:var(--toastPadding, 0);background:var(--toastBackground, rgba(66, 66, 66, 0.9));color:var(--toastColor, #fff);box-shadow:var(--toastBoxShadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));border:var(--toastBorder, none);border-radius:var(--toastBorderRadius, 0.125rem);position:relative;display:flex;flex-direction:row;align-items:center;overflow:hidden;will-change:transform, opacity;-webkit-tap-highlight-color:transparent}._toastMsg.svelte-j9nwjb{padding:var(--toastMsgPadding, 0.75rem 0.5rem);flex:1 1 0%}.pe.svelte-j9nwjb,._toastMsg.svelte-j9nwjb a{pointer-events:auto}._toastBtn.svelte-j9nwjb{width:2rem;height:100%;font:1rem sans-serif;display:flex;align-items:center;justify-content:center;cursor:pointer;outline:none}._toastBar.svelte-j9nwjb{top:var(--toastBarTop, auto);right:var(--toastBarRight, auto);bottom:var(--toastBarBottom, 0);left:var(--toastBarLeft, 0);height:var(--toastBarHeight, 6px);width:var(--toastBarWidth, 100%);position:absolute;display:block;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;background:transparent;pointer-events:none}._toastBar.svelte-j9nwjb::-webkit-progress-bar{background:transparent}._toastBar.svelte-j9nwjb::-webkit-progress-value{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}._toastBar.svelte-j9nwjb::-moz-progress-bar{background:var(--toastProgressBackground, var(--toastBarBackground, rgba(33, 150, 243, 0.75)))}",
  map: null
};
var ToastItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$w);
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
  return `<div class="${["_toastItem svelte-j9nwjb", item.pausable ? "pe" : ""].join(" ").trim()}"><div class="${["_toastMsg svelte-j9nwjb", item.component ? "pe" : ""].join(" ").trim()}">${item.component ? `${validate_component(item.component.src || missing_component, "svelte:component").$$render($$result, Object.assign(getProps()), {}, {})}` : `<!-- HTML_TAG_START -->${item.msg}<!-- HTML_TAG_END -->`}</div>
  ${item.dismissable ? `<div class="${"_toastBtn pe svelte-j9nwjb"}" role="${"button"}" tabindex="${"-1"}">\u2715</div>` : ``}
  <progress class="${"_toastBar svelte-j9nwjb"}"${add_attribute("value", $progress, 0)}></progress></div>`;
});
var css$v = {
  code: "._toastContainer.svelte-7xr3c1{top:var(--toastContainerTop, 1.5rem);right:var(--toastContainerRight, 2rem);bottom:var(--toastContainerBottom, auto);left:var(--toastContainerLeft, auto);position:fixed;margin:0;padding:0;list-style-type:none;pointer-events:none;z-index:9999}",
  map: null
};
var SvelteToast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toast, $$unsubscribe_toast;
  $$unsubscribe_toast = subscribe(toast, (value) => $toast = value);
  let { options: options2 = {} } = $$props;
  let { target = "default" } = $$props;
  let items;
  const getCss = (theme) => Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, "");
  if ($$props.options === void 0 && $$bindings.options && options2 !== void 0)
    $$bindings.options(options2);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  $$result.css.add(css$v);
  {
    toast._init(target, options2);
  }
  items = $toast.filter((i) => i.target === target);
  $$unsubscribe_toast();
  return `<ul class="${"_toastContainer svelte-7xr3c1"}">${each(items, (item) => `<li${add_attribute("style", getCss(item.theme), 0)}>${validate_component(ToastItem, "ToastItem").$$render($$result, { item }, {}, {})}
    </li>`)}</ul>`;
});
var css$u = {
  code: ".toast_wrap.svelte-dznte4{--toastMsgPadding:10px 20px;font-size:0.85rem}.error_wrap.svelte-dznte4{--toastWidth:100%;--toastMaxWidth:500px;--toastMinHeight:1.5rem}",
  map: null
};
var ToastArea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$u);
  return `<div class="${"toast_wrap svelte-dznte4"}">${validate_component(SvelteToast, "SvelteToast").$$render($$result, {}, {}, {})}</div>

<div class="${"toast_wrap error_wrap svelte-dznte4"}">${validate_component(SvelteToast, "SvelteToast").$$render($$result, { target: "error" }, {}, {})}
</div>`;
});
var css$t = {
  code: "header.svelte-1qqhg8r.svelte-1qqhg8r{background:black;display:flex;justify-content:space-between;align-items:center;height:60px}header.svelte-1qqhg8r .n2-logo.svelte-1qqhg8r{padding:10px}header.svelte-1qqhg8r .n2-logo img.svelte-1qqhg8r{height:30px}header.svelte-1qqhg8r .menu-row-list.svelte-1qqhg8r{margin:0 20px}header.svelte-1qqhg8r .hamburger-menu.svelte-1qqhg8r{position:relative;padding:10px}header.svelte-1qqhg8r .hamburger-menu .hamburger-button .bar.svelte-1qqhg8r{display:block;background-color:#fff;height:4px;width:30px;border-radius:1px}header.svelte-1qqhg8r .hamburger-menu .hamburger-button .bar1.svelte-1qqhg8r{transform:translateY(-6px);transition:transform 0.3s}header.svelte-1qqhg8r .hamburger-menu .hamburger-button .bar3.svelte-1qqhg8r{transform:translateY(6px);transition:transform 0.3s}header.svelte-1qqhg8r .hamburger-menu .hamburger-slider.svelte-1qqhg8r{position:fixed;z-index:100;width:300px;top:100px;right:-320px;background:linear-gradient(90deg, black, rgba(0, 0, 0, 0.8));transition:0.3s}header.svelte-1qqhg8r .hamburger-menu .hamburger-slider.open.svelte-1qqhg8r{right:0}",
  map: null
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mainmenus, $$unsubscribe_mainmenus;
  $$unsubscribe_mainmenus = subscribe(mainmenus, (value) => $mainmenus = value);
  $$result.css.add(css$t);
  $$unsubscribe_mainmenus();
  return `<header class="${"svelte-1qqhg8r"}"><div class="${"n2-logo svelte-1qqhg8r"}"><a href="${"/"}"><img src="${"/img/n2-icon-white.svg"}" alt="${""}" class="${"svelte-1qqhg8r"}"></a></div>
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"menu-row-list svelte-1qqhg8r"}">${each($mainmenus, (menu) => `${validate_component(HeaderMenuBox, "HeaderMenuBox").$$render($$result, {
      name: menu.name,
      path: menu.path,
      img: menu.img,
      explain: menu.explain
    }, {}, {})}`)}</div>` : ``}`
  })}
    
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"hamburger-menu svelte-1qqhg8r"}"><span class="${"hamburger-button"}"><span class="${"bar bar1 svelte-1qqhg8r"}"></span>
                <span class="${"bar bar2 svelte-1qqhg8r"}"></span>
                <span class="${"bar bar3 svelte-1qqhg8r"}"></span></span>
            <div class="${"hamburger-slider " + escape("") + " svelte-1qqhg8r"}">${each($mainmenus, (menu) => `${validate_component(HambergerMenuBox, "HambergerMenuBox").$$render($$result, {
      name: menu.name,
      path: menu.path,
      img: menu.img,
      explain: menu.explain
    }, {}, {})}`)}</div></div>` : ``}`
  })}</header>

${slots.default ? slots.default({}) : ``}
${validate_component(ToastArea, "ToastArea").$$render($$result, {}, {}, {})}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var css$s = {
  code: ".homebutton-box.svelte-10fykjs.svelte-10fykjs{position:relative;width:100px;height:100px;background:white;border-radius:15px;margin:15px;transition:0.5s}.homebutton-box.focus.svelte-10fykjs.svelte-10fykjs{border-radius:0px}.homebutton-box.svelte-10fykjs .icons.svelte-10fykjs{position:absolute;display:flex;flex-direction:column;justify-content:space-around;--topval:10px;top:var(--topval);left:var(--topval);width:calc(100% - var(--topval) * 2);height:calc(100% - var(--topval) * 2)}.homebutton-box.svelte-10fykjs .icons img.svelte-10fykjs{height:60%;margin:0 auto}.homebutton-box.svelte-10fykjs .icons h1.svelte-10fykjs{text-align:center;font-size:14px;color:white}.homebutton-box.svelte-10fykjs .homebutton_background.svelte-10fykjs{position:absolute;--positioning:5px;top:var(--positioning);left:var(--positioning);width:calc(100% - var(--positioning) * 2);height:calc(100% - var(--positioning) * 2);background:black;border-radius:25px;transition:0.5s}.homebutton-box.svelte-10fykjs .homebutton_background.focus.svelte-10fykjs{transform:rotate(45deg);background:red;border-radius:0px}.homebutton-box.svelte-10fykjs .hover_area.svelte-10fykjs{position:absolute;top:0;left:0;width:100%;height:100%}",
  map: null
};
var HomeButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  let { icon_url } = $$props;
  let { explain } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  if ($$props.icon_url === void 0 && $$bindings.icon_url && icon_url !== void 0)
    $$bindings.icon_url(icon_url);
  if ($$props.explain === void 0 && $$bindings.explain && explain !== void 0)
    $$bindings.explain(explain);
  $$result.css.add(css$s);
  return `<div class="${"homebutton-box " + escape("") + " svelte-10fykjs"}"><a${add_attribute("href", path, 0)}><div class="${"homebutton_background " + escape("") + " svelte-10fykjs"}"></div>
        <div class="${"icons svelte-10fykjs"}"><img${add_attribute("src", icon_url, 0)} alt="${escape(explain) + "\u30DC\u30BF\u30F3"}" class="${"svelte-10fykjs"}">
            <h1 class="${"svelte-10fykjs"}">${escape(explain)}</h1></div>
        <div class="${"hover_area svelte-10fykjs"}"></div></a>
    
</div>`;
});
var css$r = {
  code: "#bg_clock.svelte-gfjuk8.svelte-gfjuk8{position:absolute;overflow:hidden;height:100%;width:100%;top:0;left:0;z-index:-1}#bg_clock.svelte-gfjuk8 #clockbody.svelte-gfjuk8{position:absolute;top:40vh;left:25vw;width:120vw;height:120vw;-webkit-animation:svelte-gfjuk8-clockrotate 60s cubic-bezier(1, 0, 0.95, 0.38) infinite;animation:svelte-gfjuk8-clockrotate 60s cubic-bezier(1, 0, 0.95, 0.38) infinite;transition:1s}@keyframes svelte-gfjuk8-clockslide{0%{left:25vw;transform:rotate(0deg)}100%{left:-200%;transform:rotate(-270deg)}}@-webkit-keyframes svelte-gfjuk8-clockslide{0%{left:25vw;-webkit-transform:rotate(0deg)}100%{left:-200%;-webkit-transform:rotate(-270deg)}}#bg_clock.svelte-gfjuk8 #clockbody img.svelte-gfjuk8{width:100%}@keyframes svelte-gfjuk8-clockrotate{0%{transform:rotate(0deg)}2%{transform:rotate(7deg)}4%{transform:rotate(14deg)}6%{transform:rotate(21deg)}8%{transform:rotate(28deg)}10%{transform:rotate(36deg)}12%{transform:rotate(43deg)}14%{transform:rotate(50deg)}16%{transform:rotate(57deg)}18%{transform:rotate(64deg)}20%{transform:rotate(72deg)}22%{transform:rotate(79deg)}24%{transform:rotate(86deg)}26%{transform:rotate(93deg)}28%{transform:rotate(100deg)}30%{transform:rotate(108deg)}32%{transform:rotate(115deg)}34%{transform:rotate(122deg)}36%{transform:rotate(129deg)}38%{transform:rotate(136deg)}40%{transform:rotate(144deg)}42%{transform:rotate(151deg)}44%{transform:rotate(158deg)}46%{transform:rotate(165deg)}48%{transform:rotate(172deg)}50%{transform:rotate(180deg)}52%{transform:rotate(187deg)}54%{transform:rotate(194deg)}56%{transform:rotate(201deg)}58%{transform:rotate(208deg)}60%{transform:rotate(216deg)}62%{transform:rotate(223deg)}64%{transform:rotate(230deg)}66%{transform:rotate(237deg)}68%{transform:rotate(244deg)}70%{transform:rotate(252deg)}72%{transform:rotate(259deg)}74%{transform:rotate(266deg)}76%{transform:rotate(273deg)}78%{transform:rotate(280deg)}80%{transform:rotate(288deg)}82%{transform:rotate(295deg)}84%{transform:rotate(302deg)}86%{transform:rotate(309deg)}88%{transform:rotate(316deg)}90%{transform:rotate(324deg)}92%{transform:rotate(331deg)}94%{transform:rotate(338deg)}96%{transform:rotate(345deg)}98%{transform:rotate(352deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes svelte-gfjuk8-clockrotate{0%{-webkit-transform:rotate(0deg)}2%{-webkit-transform:rotate(7deg)}4%{-webkit-transform:rotate(14deg)}6%{-webkit-transform:rotate(21deg)}8%{-webkit-transform:rotate(28deg)}10%{-webkit-transform:rotate(36deg)}12%{-webkit-transform:rotate(43deg)}14%{-webkit-transform:rotate(50deg)}16%{-webkit-transform:rotate(57deg)}18%{-webkit-transform:rotate(64deg)}20%{-webkit-transform:rotate(72deg)}22%{-webkit-transform:rotate(79deg)}24%{-webkit-transform:rotate(86deg)}26%{-webkit-transform:rotate(93deg)}28%{-webkit-transform:rotate(100deg)}30%{-webkit-transform:rotate(108deg)}32%{-webkit-transform:rotate(115deg)}34%{-webkit-transform:rotate(122deg)}36%{-webkit-transform:rotate(129deg)}38%{-webkit-transform:rotate(136deg)}40%{-webkit-transform:rotate(144deg)}42%{-webkit-transform:rotate(151deg)}44%{-webkit-transform:rotate(158deg)}46%{-webkit-transform:rotate(165deg)}48%{-webkit-transform:rotate(172deg)}50%{-webkit-transform:rotate(180deg)}52%{-webkit-transform:rotate(187deg)}54%{-webkit-transform:rotate(194deg)}56%{-webkit-transform:rotate(201deg)}58%{-webkit-transform:rotate(208deg)}60%{-webkit-transform:rotate(216deg)}62%{-webkit-transform:rotate(223deg)}64%{-webkit-transform:rotate(230deg)}66%{-webkit-transform:rotate(237deg)}68%{-webkit-transform:rotate(244deg)}70%{-webkit-transform:rotate(252deg)}72%{-webkit-transform:rotate(259deg)}74%{-webkit-transform:rotate(266deg)}76%{-webkit-transform:rotate(273deg)}78%{-webkit-transform:rotate(280deg)}80%{-webkit-transform:rotate(288deg)}82%{-webkit-transform:rotate(295deg)}84%{-webkit-transform:rotate(302deg)}86%{-webkit-transform:rotate(309deg)}88%{-webkit-transform:rotate(316deg)}90%{-webkit-transform:rotate(324deg)}92%{-webkit-transform:rotate(331deg)}94%{-webkit-transform:rotate(338deg)}96%{-webkit-transform:rotate(345deg)}98%{-webkit-transform:rotate(352deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes svelte-gfjuk8-clockspin{0%{transform:rotate(0deg)}100%{transform:rotate(720deg)}}@-webkit-keyframes svelte-gfjuk8-clockspin{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(720deg)}}#bg_clock.svelte-gfjuk8 #clockbody img.time.svelte-gfjuk8{position:absolute;width:10%;animation:svelte-gfjuk8-wheelrotate 10s linear infinite;-webkit-animation:svelte-gfjuk8-wheelrotate 10s linear infinite}#bg_clock.svelte-gfjuk8 #clockbody img#insidewheel.svelte-gfjuk8{position:absolute;width:25%;animation:svelte-gfjuk8-wheelrotate 10s linear infinite reverse;-webkit-animation:svelte-gfjuk8-wheelrotate 10s linear infinite reverse;top:37.5%;left:37.5%}.time-3.svelte-gfjuk8.svelte-gfjuk8{top:45%;left:63.5%}.time-2.svelte-gfjuk8.svelte-gfjuk8{top:35.75%;left:61.021%}.time-1.svelte-gfjuk8.svelte-gfjuk8{top:28.979%;left:54.25%}.time-12.svelte-gfjuk8.svelte-gfjuk8{top:26.5%;left:45%}.time-11.svelte-gfjuk8.svelte-gfjuk8{top:28.979%;left:35.75%}.time-10.svelte-gfjuk8.svelte-gfjuk8{top:35.75%;left:28.979%}.time-9.svelte-gfjuk8.svelte-gfjuk8{top:45%;left:26.5%}.time-8.svelte-gfjuk8.svelte-gfjuk8{top:54.25%;left:28.979%}.time-7.svelte-gfjuk8.svelte-gfjuk8{top:61.021%;left:35.75%}.time-6.svelte-gfjuk8.svelte-gfjuk8{top:63.5%;left:45%}.time-5.svelte-gfjuk8.svelte-gfjuk8{top:61.021%;left:54.25%}.time-4.svelte-gfjuk8.svelte-gfjuk8{top:54.25%;left:61.021%}#bg_clock.svelte-gfjuk8 #clockbody img.time-2.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-4.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-6.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-8.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-10.svelte-gfjuk8,#bg_clock.svelte-gfjuk8 #clockbody img.time-12.svelte-gfjuk8{animation-direction:reverse;-webkit-animation-direction:reverse}@keyframes svelte-gfjuk8-wheelrotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@-webkit-keyframes svelte-gfjuk8-wheelrotate{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@media screen and (min-width: 600px){}@media screen and (min-width: 700px){#bg_clock.svelte-gfjuk8 #clockbody.svelte-gfjuk8{top:35vh;left:50vw;height:850px;width:850px}#bg_clock.svelte-gfjuk8 #clockbody img.svelte-gfjuk8{width:850px}#bg_clock.svelte-gfjuk8 img.time.svelte-gfjuk8{width:85px}}",
  map: null
};
var N2Clock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$r);
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
var css$q = {
  code: "#menu_box.svelte-9tmjw9{max-height:700px;max-width:500px;margin:0 auto}.icon_box.svelte-9tmjw9{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around;border:solid 1px white;max-width:400px;padding:20px 10px;margin:100px 30px}",
  map: null
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mainmenus, $$unsubscribe_mainmenus;
  $$unsubscribe_mainmenus = subscribe(mainmenus, (value) => $mainmenus = value);
  let mainmenu_array = $mainmenus;
  $$result.css.add(css$q);
  $$unsubscribe_mainmenus();
  return `<div id="${"menu_box"}" class="${"svelte-9tmjw9"}">${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"icon_box svelte-9tmjw9"}">${each(mainmenu_array, (menu) => `${validate_component(HomeButton, "HomeButton").$$render($$result, {
      path: menu.path,
      icon_url: menu.img,
      explain: menu.name
    }, {}, {})}`)}</div>` : ``}`
  })}
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"icon_box svelte-9tmjw9"}">${each(mainmenu_array, (menu) => `${validate_component(HomeButton, "HomeButton").$$render($$result, {
      path: menu.path,
      icon_url: menu.img,
      explain: menu.name
    }, {}, {})}`)}</div>` : ``}`
  })}
    ${validate_component(N2Clock, "N2Clock").$$render($$result, {}, {}, {})}</div>

${slots.default ? slots.default({}) : ``}`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var css$p = {
  code: "#introduce-box.svelte-muuo5r.svelte-muuo5r{position:relative;width:80%;max-width:700px;margin:30px auto 0 auto;height:700px}#introduce-box.svelte-muuo5r #introduce-text.svelte-muuo5r{padding:30px}#introduce-box.svelte-muuo5r #introduce-text div.svelte-muuo5r{margin:5px}#introduce-box.svelte-muuo5r #introduce-text h1.svelte-muuo5r{margin:10px 0}#introduce-box.svelte-muuo5r #introduce-text .job.svelte-muuo5r{margin:10px 5px;font-size:16px}#introduce-box.svelte-muuo5r #introduce-text .birthday .birthday-count.svelte-muuo5r{display:inline;font-size:13px}#introduce-box.svelte-muuo5r .image.svelte-muuo5r{z-index:-1;position:absolute;filter:blur(2px);background-image:var(--url);background-position:center;width:100%;height:100%}",
  map: null
};
var myname = 'Taro <span style="color:#ff0000">N</span>onoyama';
var mySex = "Male";
var myBloodType = "A Rh+";
var Introduce = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let myAgeYear = 0;
  let myAgeDay = 0;
  let myAgeHour = 0;
  let myAgeMinutes = 0;
  let myAgeSecond = 0;
  const myJob = ["Engineer", "Designer", "Artist"];
  const backgroundIllust = [
    "https://lh3.googleusercontent.com/bcvBUbA1fI0nUqannPAJxes6L1JmFm4VdhfjCwq6fkvqgoBHlGoVJhMk-L20s5zscQZe8FO9d3x4u757Gk35od1rhy8wbOlOEHDt0GULdy7Af2oI_TMadzt4mohs-okGaJoaYaxq27I9HXPCNyoO_cv5nSEM2WlUNF_KKNMW-Hv-0RJkpREnBwzn-HPzuP9lXk5VVIhIcNEwspqsh4n_byo-SlBOOnDX6YDSI_iPzQOftJTfIoZupSXt7yT0eTX4X3G4iU7l0oJd72Mm72_4xAgAw9Ogoyy2wOx_f9TY3hLZWqO1n94DOM0GxWtE-YbfX_LxLRbAzbIUk4IGhl0eNUNfY-w-zg6DjNe0EgQ0MlgBbQH7GDUa-0va2ppQwNTdU_nJIlBBlFa5MCEaBrc3WJZuN1uC7Od7bgY2w3l9_zTajyvYMDRK40k0jlJjqUov2v5QmbAOwVap49VF1bNQrqZsKN-KaCuVeBZHOsA33U28f7qE5Pw2V1g0nUvcYGjBgSyIjX0d-4abQnpNO_AAP5mKUhiMHPAxc1SJne8b_AQMPQNk0qAdO_-I68Eb1nN2LdKyk2Ca4YWqGb2OTQyyewAaxnYhPY9tTXCMxU18r2NVuJWDmrzXaNab3s_rjdMwn1zW5sxrJEpqFu2Av7wPWQ5PRbbPBZVVid_jh8slBbZLULwQ7qLRbn3L-opMCJzUq748fEL2GXe1wWK1G87Fw_I=s700-no"
  ];
  $$result.css.add(css$p);
  return `<section id="${"introduce-box"}" class="${"svelte-muuo5r"}"><div class="${"image svelte-muuo5r"}" style="${"--url:url(" + escape(backgroundIllust[0]) + ")"}"></div>
    <div id="${"introduce-text"}" class="${"svelte-muuo5r"}"><h1 class="${"svelte-muuo5r"}"><!-- HTML_TAG_START -->${myname}<!-- HTML_TAG_END --></h1>
        <div class="${"job svelte-muuo5r"}">${escape(myJob.join(", "))}</div>
        <div class="${"birthday svelte-muuo5r"}">${escape(`Age ${myAgeYear}`)}
            <div class="${"birthday-count svelte-muuo5r"}">${escape(`( ${myAgeDay}d ${myAgeHour}h ${myAgeMinutes}m ${myAgeSecond}s )`)}</div></div>
        <div class="${"svelte-muuo5r"}">${escape(mySex)}</div>
        <div class="${"svelte-muuo5r"}">${escape(myBloodType)}</div></div>
</section>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Introduce
});
var css$o = {
  code: "article.svelte-11yu7j3{width:90%;max-width:700px;margin:0 auto}",
  map: null
};
var Contact = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$o);
  return `<article class="${"svelte-11yu7j3"}">

</article>`;
});
var contact = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Contact
});
var notion_pages = writable([]);
function switchBaseURL() {
  return "https://n2freevas-api.herokuapp.com/api";
}
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
var css$n = {
  code: ".items.svelte-wqwzll.svelte-wqwzll.svelte-wqwzll{margin:20px 0px;border:solid 1px black;display:flex;flex-direction:row;justify-content:space-between;height:175px}.items.svelte-wqwzll .info_container.svelte-wqwzll.svelte-wqwzll{padding:20px 40px;width:50%;display:flex;flex-direction:column;justify-content:space-between}.items.svelte-wqwzll .info_container.svelte-wqwzll h3.svelte-wqwzll{font-size:25px;color:black}.items.svelte-wqwzll .thumbnail_container.svelte-wqwzll.svelte-wqwzll{overflow:hidden;width:50%;max-width:432px}.items_phone.svelte-wqwzll.svelte-wqwzll.svelte-wqwzll{margin:20px 0px;border:solid 1px black;display:flex;flex-direction:column;justify-content:space-between}.items_phone.svelte-wqwzll .info_container.svelte-wqwzll.svelte-wqwzll{padding:15px 30px}.items_phone.svelte-wqwzll .info_container.svelte-wqwzll h3.svelte-wqwzll{font-size:20px;color:black;margin:10px 0}.items_phone.svelte-wqwzll .thumbnail_container.svelte-wqwzll.svelte-wqwzll{overflow:hidden;width:100%;height:200px}.tag_container.svelte-wqwzll.svelte-wqwzll.svelte-wqwzll{display:flex;flex-direction:row;flex-wrap:wrap}.tag_container.svelte-wqwzll .tag_box.svelte-wqwzll.svelte-wqwzll{margin:5px;padding:5px 10px;border-radius:2px;background:#858585;font-size:13px}.tag_container.svelte-wqwzll .tag_box.default.svelte-wqwzll.svelte-wqwzll{background:black;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.gray.svelte-wqwzll.svelte-wqwzll{background:#525252;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.brown.svelte-wqwzll.svelte-wqwzll{background:#613c1a;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.orange.svelte-wqwzll.svelte-wqwzll{background:#b95a00;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.yellow.svelte-wqwzll.svelte-wqwzll{background:#e4a700;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.green.svelte-wqwzll.svelte-wqwzll{background:#135e00;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.blue.svelte-wqwzll.svelte-wqwzll{background:#000a9b;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.purple.svelte-wqwzll.svelte-wqwzll{background:#3d008d;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.pink.svelte-wqwzll.svelte-wqwzll{background:#a80076;border:solid 1px #444444}.tag_container.svelte-wqwzll .tag_box.red.svelte-wqwzll.svelte-wqwzll{background:#880000;border:solid 1px #880000}",
  map: null
};
var List_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$n);
  return `${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"items_phone svelte-wqwzll"}"><div class="${"info_container svelte-wqwzll"}"><a href="${"/blog/page?page_id=" + escape(id)}"><h3 class="${"svelte-wqwzll"}"><!-- HTML_TAG_START -->${title}<!-- HTML_TAG_END --></h3></a>
        <div class="${"tag_container svelte-wqwzll"}">${each(tags, (tag) => `<div class="${"tag_box " + escape(tag.tag_color) + " svelte-wqwzll"}">${escape(tag.tag_name)}
            </div>`)}</div></div>
    <div class="${"thumbnail_container svelte-wqwzll"}"><a href="${"/blog/page?page_id=" + escape(id)}"><img${add_attribute("src", thumbnail, 0)} alt="${escape(title) + "\u306E\u753B\u50CF"}"></a></div></div>` : ``}`
  })}

${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"items svelte-wqwzll"}"><div class="${"info_container svelte-wqwzll"}"><a href="${"/blog/page?page_id=" + escape(id)}"><h3 class="${"svelte-wqwzll"}"><!-- HTML_TAG_START -->${title}<!-- HTML_TAG_END --></h3></a>
        <div class="${"tag_container svelte-wqwzll"}">${each(tags, (tag) => `<div class="${"tag_box " + escape(tag.tag_color) + " svelte-wqwzll"}">${escape(tag.tag_name)}
            </div>`)}</div></div>
    <div class="${"thumbnail_container svelte-wqwzll"}"><a href="${"/blog/page?page_id=" + escape(id)}"><img${add_attribute("src", thumbnail, 0)} alt="${escape(title) + "\u306E\u753B\u50CF"}"></a></div></div>` : ``}`
  })}`;
});
var css$m = {
  code: "h2.svelte-13h619c{color:black}.background.svelte-13h619c{padding:30px 20px;width:100%;height:100%;background:white}",
  map: null
};
var List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $notion_pages, $$unsubscribe_notion_pages;
  $$unsubscribe_notion_pages = subscribe(notion_pages, (value) => $notion_pages = value);
  $$result.css.add(css$m);
  $$unsubscribe_notion_pages();
  return `<div class="${"background svelte-13h619c"}"><section class="${"title"}"><h2 class="${"svelte-13h619c"}">BLOG LIST</h2></section>
<section class="${"blog_list"}">${each($notion_pages, (page2) => `${validate_component(List_item, "ListItem").$$render($$result, {
    id: page2.page_id,
    title: page2.page_title,
    tags: page2.tags,
    thumbnail: page2.thumbnail
  }, {}, {})}`)}</section>

</div>`;
});
var list = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": List
});
var Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let data;
  console.log(data);
  return `<h1>${escape(data)}</h1>
<p>list</p>`;
});
var page = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Page
});
var css$l = {
  code: ".loader.svelte-w1xkbb.svelte-w1xkbb{position:relative;width:100%;height:var(--loader-height)}.loader.svelte-w1xkbb .fulcrum.svelte-w1xkbb{position:absolute;left:50%;height:100%}.loader.svelte-w1xkbb .fulcrum .wire.svelte-w1xkbb{position:absolute;height:var(--wire_length_px);border:solid 1px var(--color);transform-origin:top}.loader.svelte-w1xkbb .fulcrum .wire.animate.svelte-w1xkbb{-webkit-animation:svelte-w1xkbb-penduluming ease-in-out var(--periodic_time_sec) infinite;animation:svelte-w1xkbb-penduluming ease-in-out var(--periodic_time_sec) infinite}.loader.svelte-w1xkbb .fulcrum .wire .weight.svelte-w1xkbb{position:absolute;bottom:calc(-1 * var(--weight_size_px) / 2);left:calc(-1 * var(--weight_size_px) / 2);width:var(--weight_size_px);height:var(--weight_size_px);border-radius:calc(var(--weight_size_px) / 2);background:var(--color)}@keyframes svelte-w1xkbb-penduluming{0%{transform:rotate(30deg)}50%{transform:rotate(-30deg)}100%{transform:rotate(30deg)}}",
  map: null
};
var PendulumLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  for (let i = 0; i < numof_pendulum; i++) {
    let wire_length = initial_length + i * increase_length;
    let periodic_time = 60 / (initial_frequency - decrease_frequency * i);
    pendulums_args.push({
      wire_length: `${wire_length.toString()}px`,
      weight_size: `${(initial_size + i * increase_size).toString()}px`,
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
  $$result.css.add(css$l);
  return `<div class="${"loader svelte-w1xkbb"}" style="${"--loader-height: " + escape(`${initial_length + increase_length * numof_pendulum + initial_size}px`) + ";"}"><div class="${"fulcrum svelte-w1xkbb"}">${each(pendulums_args, (args) => `
            <div class="${"wire " + escape(is_animate ? "animate" : "") + " svelte-w1xkbb"}" style="${"--wire_length_px: " + escape(args.wire_length) + "; --periodic_time_sec: " + escape(args.periodic_time) + "; --color: " + escape(color) + ";"}"><div class="${"weight svelte-w1xkbb"}" style="${"--weight_size_px: " + escape(args.weight_size) + ";"}"></div>
            </div>`)}</div>
</div>`;
});
var css$k = {
  code: ".loader.svelte-1prbtiu.svelte-1prbtiu{position:relative;width:100%;height:var(--loader-height)}.loader.svelte-1prbtiu .fulcrum.svelte-1prbtiu{position:absolute;width:100%;height:100%;left:0}.loader.svelte-1prbtiu .fulcrum .rect.svelte-1prbtiu{position:absolute;bottom:0;left:calc(50% + var(--interval));width:var(--width);height:0;border:solid 1px var(--color)}.loader.svelte-1prbtiu .fulcrum .rect.animate.svelte-1prbtiu{-webkit-animation:svelte-1prbtiu-rect_growth ease-in-out 3s var(--growth_delay) infinite;animation:svelte-1prbtiu-rect_growth ease-in-out 3s var(--growth_delay) infinite}@keyframes svelte-1prbtiu-rect_growth{0%{height:0}20%{height:var(--max_height)}40%{height:0}100%{height:0}}",
  map: null
};
var RectWaveLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { numof_rectangle = 20 } = $$props;
  let { base_rect_width = 15 } = $$props;
  let { blur_range_rect_width = 10 } = $$props;
  let { formation_interval = 10 } = $$props;
  let { growth_delay_sec = 0.25 } = $$props;
  let { max_height = 150 } = $$props;
  let { color = "white" } = $$props;
  let { is_animate = true } = $$props;
  let rectangle_args = [];
  for (let i = 0; i < numof_rectangle; i++) {
    rectangle_args.push({
      rect_width: `${Math.floor(Math.random() * blur_range_rect_width + base_rect_width - blur_range_rect_width / 2)}px`,
      interval_position: `${formation_interval * (numof_rectangle / 2 - i)}px`,
      growth_delay: `${growth_delay_sec * i}s`
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
  $$result.css.add(css$k);
  return `<div class="${"loader svelte-1prbtiu"}" style="${"--loader-height: " + escape(`${77 + max_height}px`) + ";"}"><div class="${"fulcrum " + escape(is_animate ? "animate" : "") + " svelte-1prbtiu"}" style="${"--base_width:" + escape(`${base_rect_width}px`) + "; --max_height:" + escape(`${max_height}px`) + ";"}">${each(rectangle_args, (args) => `<div class="${"rect " + escape(is_animate ? "animate" : "") + " svelte-1prbtiu"}" style="${"--width:" + escape(args.rect_width) + "; --color: " + escape(color) + "; --interval: " + escape(args.interval_position) + "; --growth_delay: " + escape(args.growth_delay)}"></div>`)}</div>
</div>`;
});
var css$j = {
  code: ".loader.svelte-8rpapr.svelte-8rpapr{position:relative;width:100%;height:var(--loader_height)}.loader.svelte-8rpapr .fulcrum.svelte-8rpapr{position:absolute;width:100%;height:100%}.loader.svelte-8rpapr .fulcrum .petals.svelte-8rpapr{position:absolute;top:calc(50% - var(--size) / 2);left:calc(50% - var(--size) / 2);width:var(--size);height:var(--size);transform:rotate(0);transform-origin:50% 50%}.loader.svelte-8rpapr .fulcrum .petals.animate.svelte-8rpapr{animation:svelte-8rpapr-cycle linear var(--speed) infinite}@keyframes svelte-8rpapr-cycle{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.loader.svelte-8rpapr .fulcrum .petal.svelte-8rpapr{position:absolute;top:0;transform:rotate(var(--angle));width:var(--size);height:var(--size);border-radius:calc(var(--size) / 2);border:solid 1px var(--color)}.loader.svelte-8rpapr .fulcrum .petal.animate.svelte-8rpapr{animation:svelte-8rpapr-flowering ease-in-out 2s var(--delay) infinite}@keyframes svelte-8rpapr-flowering{0%{transform:translate(0, 0)}40%{transform:translate(var(--move_x), var(--move_y))}80%{transform:translate(0, 0)}100%{transform:translate(0, 0)}}",
  map: null
};
var RoundFloweringLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  for (let i = 0; i < numof_small_round; i++) {
    let radius = 2 * Math.PI / numof_small_round * i;
    small_flowering_args.push({
      flower_petal_x: `${Math.sin(radius) * small_petal_stroke}px`,
      flower_petal_y: `${Math.cos(radius) * small_petal_stroke}px`
    });
  }
  for (let i = 0; i < numof_large_round; i++) {
    let radius = 2 * Math.PI / numof_large_round * i;
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
  $$result.css.add(css$j);
  return `<div class="${"loader svelte-8rpapr"}" style="${"--loader_height:" + escape(`${large_petal_stroke * 2 + large_round_size}px`) + "; --color:" + escape(color) + ";"}"><div class="${"fulcrum svelte-8rpapr"}"><div class="${"petals " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${small_round_size}px`) + "; --speed:" + escape(small_round_spin_speed)}">${each(small_flowering_args, (arg) => `<div class="${"petal " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${small_round_size}px`) + "; --move_x:" + escape(arg.flower_petal_x) + "; --move_y:" + escape(arg.flower_petal_y) + "; --delay:" + escape(`${small_stroke_delay}s`)}"></div>`)}</div>
        <div class="${"petals " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${large_round_size}px`) + "; --speed:" + escape(large_round_spin_speed)}">${each(large_flowering_args, (arg) => `<div class="${"petal " + escape(is_animate ? "animate" : "") + " svelte-8rpapr"}" style="${"--size:" + escape(`${large_round_size}px`) + "; --move_x: " + escape(arg.flower_petal_x) + "; --move_y: " + escape(arg.flower_petal_y) + "; --delay:" + escape(`${large_stroke_delay}s`)}"></div>`)}</div></div>
</div>`;
});
var css$i = {
  code: ".loader.svelte-v9q609.svelte-v9q609{width:100%;height:100%}.loader.svelte-v9q609 .kotodama-box.svelte-v9q609{--size:30px;display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap;align-items:center;max-width:150px;height:100%;margin:0 auto}.loader.svelte-v9q609 .kotodama-box .kotodama.svelte-v9q609{position:relative;width:var(--size);height:var(--size);margin:3px}.loader.svelte-v9q609 .kotodama-box .kotodama img.svelte-v9q609{position:absolute;bottom:0;left:0;width:var(--size);height:var(--size);animation:svelte-v9q609-popinkotodama linear 1.3s var(--delay) infinite}@keyframes svelte-v9q609-popinkotodama{0%{bottom:0}20%{bottom:var(--size)}40%{bottom:0;height:var(--size)}43%{bottom:0;height:calc(var(--size) / 3)}46%{bottom:0;height:var(--size)}}",
  map: null
};
var Bs2ndLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { popindelay = 0.15 } = $$props;
  if ($$props.popindelay === void 0 && $$bindings.popindelay && popindelay !== void 0)
    $$bindings.popindelay(popindelay);
  $$result.css.add(css$i);
  return `<div class="${"loader svelte-v9q609"}"><div class="${"kotodama-box svelte-v9q609"}"><div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay}s`) + ";"}" src="${"/img/bs2nd/ba_gray.png"}" alt="${"\u3070"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 2}s`) + ";"}" src="${"/img/bs2nd/ku_gray.png"}" alt="${"\u304F"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 3}s`) + ";"}" src="${"/img/bs2nd/ze_gray.png"}" alt="${"\u305C"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 4}s`) + ";"}" src="${"/img/bs2nd/tsu_gray.png"}" alt="${"\u3064"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 5}s`) + ";"}" src="${"/img/bs2nd/sa_gray.png"}" alt="${"\u3055"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 6}s`) + ";"}" src="${"/img/bs2nd/a_gray.png"}" alt="${"\u3042"}" class="${"svelte-v9q609"}"></div>
        <div class="${"kotodama svelte-v9q609"}"><img style="${"--delay:" + escape(`${popindelay * 7}s`) + ";"}" src="${"/img/bs2nd/chi_gray.png"}" alt="${"\u3061"}" class="${"svelte-v9q609"}"></div></div>
</div>`;
});
var css$h = {
  code: ".loader-animation-box.svelte-yop039{padding:30px 0;border:solid 1px white;min-height:290px;width:100%;height:100%}",
  map: null
};
var Show_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { component } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  $$result.css.add(css$h);
  return `<div class="${"loader-animation-box svelte-yop039"}">${validate_component(component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>
<p>${escape(name)}</p>`;
});
var css$g = {
  code: ".loader.svelte-1o1dzs3.svelte-1o1dzs3{width:100%;height:100%}.loader.svelte-1o1dzs3 .board.svelte-1o1dzs3{display:flex;flex-direction:row;justify-content:space-around;width:100%;height:100%}.loader.svelte-1o1dzs3 .board .dot_area.svelte-1o1dzs3{padding:5px;flex-basis:var(--dot_area_width);display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.loader.svelte-1o1dzs3 .board .dot_area .dot.svelte-1o1dzs3,.loader.svelte-1o1dzs3 .board .dot_area .blank.svelte-1o1dzs3{flex-basis:32%;width:var(--dot_size);height:var(--dot_size)}.loader.svelte-1o1dzs3 .board .dot_area .dot.svelte-1o1dzs3{background:var(--color)}",
  map: null
};
var DotStringLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  for (let i = 0; i < input_tostr.length; i++) {
    dot_args.push({ dots: dot_string_dict[input_tostr[i]] });
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
  $$result.css.add(css$g);
  return `<div class="${"loader svelte-1o1dzs3"}"><div class="${"board svelte-1o1dzs3"}" style="${"--color:" + escape(color) + "; --dot_area_width:" + escape(Math.floor(100 / input_tostr.length)) + "%; --dot_size:" + escape(`${dot_size}px`)}">${each(dot_args, (args) => `<div class="${"dot_area svelte-1o1dzs3"}">${each(args.dots, (dot) => `${dot == 0 ? `<div class="${"blank svelte-1o1dzs3"}"></div>` : `<div class="${"dot svelte-1o1dzs3"}"></div>`}`)}
            </div>`)}</div>
</div>`;
});
var css$f = {
  code: ".show-room.svelte-7jgice.svelte-7jgice{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around}.show-room.svelte-7jgice .show-box.svelte-7jgice{flex-basis:40%}.show-room.svelte-7jgice .show-box-phone.svelte-7jgice{flex-basis:90%}",
  map: null
};
var Show = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$f);
  return `<section class="${"show-room svelte-7jgice"}">${each(show_item_args, (arg) => `${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"show-box-phone svelte-7jgice"}">${validate_component(Show_item, "ShowItem").$$render($$result, { name: arg.name, component: arg.component }, {}, {})}
        </div>` : ``}
    `
  })}
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
    default: ({ matches }) => `${matches ? `<div class="${"show-box svelte-7jgice"}">${validate_component(Show_item, "ShowItem").$$render($$result, { name: arg.name, component: arg.component }, {}, {})}
        </div>` : ``}
    `
  })}`)}
    
</section>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Show
});
var css$e = {
  code: "header.svelte-yl89mf.svelte-yl89mf.svelte-yl89mf{display:flex;justify-content:space-between;height:40px}header.svelte-yl89mf .n2-logo.svelte-yl89mf.svelte-yl89mf{padding:10px}header.svelte-yl89mf .n2-logo img.svelte-yl89mf.svelte-yl89mf{height:20px}#base.svelte-yl89mf.svelte-yl89mf.svelte-yl89mf{background:black}footer.svelte-yl89mf.svelte-yl89mf.svelte-yl89mf{position:fixed;z-index:50;bottom:0;width:100%;height:75px;box-shadow:0 -1px 2px white;padding:10px;background:black}footer.svelte-yl89mf .footer-icon-box.svelte-yl89mf.svelte-yl89mf{display:flex;justify-content:space-around;max-width:700px;margin:0 auto}footer.svelte-yl89mf .footer-icon-box a.svelte-yl89mf.svelte-yl89mf{display:flex;flex-direction:column;align-items:center;justify-content:space-between;position:relative;width:40px;height:40px;border-radius:27px}footer.svelte-yl89mf .footer-icon-box a.active .footer-icon-bg.svelte-yl89mf.svelte-yl89mf{position:absolute;width:30px;height:30px;border:solid 2px var(--active-yellow);border-radius:15px}footer.svelte-yl89mf .footer-icon-box a.active p.svelte-yl89mf.svelte-yl89mf{color:var(--active-yellow)}footer.svelte-yl89mf .footer-icon-box a.svelte-yl89mf img.svelte-yl89mf{height:25px}footer.svelte-yl89mf .footer-icon-box a p.svelte-yl89mf.svelte-yl89mf{font-size:12px;font-weight:bold}",
  map: null
};
var _layout_reset$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$e);
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
var __layout_reset$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout_reset$1
});
var DEFAULT_LIMIT = 48;
var deckStore = writable(new Array(12));
var filterConditionStore = writable({
  offset: 0,
  limit: DEFAULT_LIMIT,
  word: [],
  elem: [],
  tribe: [],
  gimmick: []
});
var kanaStore = writable([
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
var elemStore = writable([
  { id: 1, elem: "\u706B", active: false },
  { id: 2, elem: "\u6C34", active: false },
  { id: 3, elem: "\u6728", active: false },
  { id: 4, elem: "\u5149", active: false },
  { id: 5, elem: "\u95C7", active: false },
  { id: 6, elem: "\u51A5", active: false },
  { id: 7, elem: "\u5929", active: false }
]);
var tribeStore = writable([
  { id: 1, tribe: "\u795E", active: false },
  { id: 2, tribe: "\u9B54", active: false },
  { id: 3, tribe: "\u82F1", active: false },
  { id: 4, tribe: "\u9F8D", active: false },
  { id: 5, tribe: "\u7363", active: false },
  { id: 6, tribe: "\u970A", active: false },
  { id: 7, tribe: "\u7269", active: false }
]);
var gimmickStore = writable([
  { id: 1, gimmick: "\u30B7\u30FC\u30EB\u30C9\u30D6\u30EC\u30A4\u30AB\u30FC", active: false },
  { id: 2, gimmick: "\u30C8\u30B2\u30AC\u30FC\u30C9", active: false },
  { id: 3, gimmick: "\u30C1\u30A7\u30F3\u30B8\u30AC\u30FC\u30C9", active: false },
  { id: 4, gimmick: "\u5F31\u4F53\u30AC\u30FC\u30C9", active: false },
  { id: 5, gimmick: "\u30A6\u30A9\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC", active: false },
  { id: 6, gimmick: "\u30D3\u30EA\u30D3\u30EA\u30AC\u30FC\u30C9", active: false },
  { id: 7, gimmick: "\u30D2\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC", active: false },
  { id: 8, gimmick: "\u30B3\u30D4\u30FC\u30AC\u30FC\u30C9", active: false }
]);
var isDeckFullStore = writable(false);
var unitListStore = writable([]);
var isSettingFilterCondition = writable(false);
var isBottomOfScroll = writable(false);
var isListLoading = writable(false);
var storedDecks = [
  { deckid: 1, deckname: "", list: [] },
  { deckid: 2, deckname: "", list: [] },
  { deckid: 3, deckname: "", list: [] },
  { deckid: 4, deckname: "", list: [] },
  { deckid: 5, deckname: "", list: [] }
];
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
getDeck();
var decks = writable(storedDecks);
var adventStore = writable([]);
var adventTargetStore = writable(void 0);
var adventBanmenStore = writable([]);
var adventFilterConditionStore = writable({
  offset: 0,
  limit: DEFAULT_LIMIT,
  elem: []
});
var adventElemStore = writable([
  { id: 1, elem: "\u706B", active: false },
  { id: 2, elem: "\u6C34", active: false },
  { id: 3, elem: "\u6728", active: false },
  { id: 4, elem: "\u5149", active: false },
  { id: 5, elem: "\u95C7", active: false },
  { id: 6, elem: "\u51A5", active: false },
  { id: 7, elem: "\u5929", active: false }
]);
var mojiLengthConfigStore = writable([
  { length: 4, active: false },
  { length: 5, active: true },
  { length: 6, active: true },
  { length: 7, active: false }
]);
var ElemEngDict = {
  "\u706B": "fire",
  "\u6C34": "water",
  "\u6728": "wood",
  "\u5149": "light",
  "\u95C7": "dark",
  "\u51A5": "hell",
  "\u5929": "heaven"
};
var TribeEngDict = {
  "\u795E": "god",
  "\u9B54": "evil",
  "\u82F1": "hero",
  "\u9F8D": "dragon",
  "\u7363": "beast",
  "\u970A": "ghost",
  "\u7269": "object"
};
var GimmickEngDict = {
  "\u30B7\u30FC\u30EB\u30C9\u30D6\u30EC\u30A4\u30AB\u30FC": "shield",
  "\u30C8\u30B2\u30AC\u30FC\u30C9": "needle",
  "\u30C1\u30A7\u30F3\u30B8\u30AC\u30FC\u30C9": "change",
  "\u5F31\u4F53\u30AC\u30FC\u30C9": "week",
  "\u30A6\u30A9\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC": "wall",
  "\u30D3\u30EA\u30D3\u30EA\u30AC\u30FC\u30C9": "biribiri",
  "\u30D2\u30FC\u30EB\u30D6\u30EC\u30A4\u30AB\u30FC": "heal",
  "\u30B3\u30D4\u30FC\u30AC\u30FC\u30C9": "copy"
};
var AdventNumDict = {
  0: "-",
  1: "\u521D\u30FB\u4E2D\u7D1A",
  2: "\u4E2D\u30FB\u4E0A\u7D1A",
  3: "\u8D85\u7D1A",
  4: "\u9B54\u7D1A",
  5: "\u7834\u6EC5\u7D1A"
};
var css$d = {
  code: '.advent.svelte-xvmnbq.svelte-xvmnbq{font-family:"Kosugi Maru", sans-serif;width:71px;margin:10px}.advent.svelte-xvmnbq .smart-info-box.svelte-xvmnbq{display:flex;flex-direction:row;justify-content:space-around}.advent.svelte-xvmnbq .smart-info-box img.svelte-xvmnbq{width:60px;height:50px}.advent.svelte-xvmnbq .smart-info-box img.disable.svelte-xvmnbq{filter:grayscale(85%)}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box.svelte-xvmnbq{position:relative}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box.svelte-xvmnbq{height:100%;display:flex;flex-direction:column-reverse}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.svelte-xvmnbq{width:11px;height:11px;border-radius:6px;margin:0 0 2px 0;border:solid 2px}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.fire.svelte-xvmnbq{background-color:#db4646;border-color:#ff9100}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.water.svelte-xvmnbq{background-color:#297eff;border-color:#a7d7ff}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.wood.svelte-xvmnbq{background-color:#69ac69;border-color:#afd8ab}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.light.svelte-xvmnbq{background-color:#ffd23e;border-color:#fff09e}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.dark.svelte-xvmnbq{background-color:#9255a5;border-color:#d0acff}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.hell.svelte-xvmnbq{background-color:#311f04;border-color:#d6a609}.advent.svelte-xvmnbq .smart-info-box .elems-tribe-box .elems-box .elem.heaven.svelte-xvmnbq{background-color:#faf3f8;border-color:#ffaff8}.advent.scaleup.svelte-xvmnbq.svelte-xvmnbq{width:120px}.advent.scaleup.svelte-xvmnbq img.svelte-xvmnbq{width:120px;height:100px}.advent.svelte-xvmnbq .name.svelte-xvmnbq{text-align:center;line-height:10px;font-size:10px;width:100%;margin:3px 0 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.advent.svelte-xvmnbq .name.disable.svelte-xvmnbq{color:gray}',
  map: null
};
var Advent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { advent } = $$props;
  let { full = false } = $$props;
  if ($$props.advent === void 0 && $$bindings.advent && advent !== void 0)
    $$bindings.advent(advent);
  if ($$props.full === void 0 && $$bindings.full && full !== void 0)
    $$bindings.full(full);
  $$result.css.add(css$d);
  return `<div class="${"advent " + escape(!full ? "scaleup" : "") + " svelte-xvmnbq"}"><div class="${"smart-info-box svelte-xvmnbq"}"><img class="${escape(null_to_empty(advent.disable ? "disable" : "")) + " svelte-xvmnbq"}"${add_attribute("src", advent.figure, 0)}${add_attribute("alt", advent.name, 0)}>
        ${full ? `<div class="${"elems-tribe-box svelte-xvmnbq"}"><div class="${"elems-box svelte-xvmnbq"}">${advent.elem.includes("\u706B") ? `<div class="${"elem fire svelte-xvmnbq"}"></div>` : ``}
                ${advent.elem.includes("\u6C34") ? `<div class="${"elem water svelte-xvmnbq"}"></div>` : ``}
                ${advent.elem.includes("\u6728") ? `<div class="${"elem wood svelte-xvmnbq"}"></div>` : ``}
                ${advent.elem.includes("\u5149") ? `<div class="${"elem light svelte-xvmnbq"}"></div>` : ``}
                ${advent.elem.includes("\u95C7") ? `<div class="${"elem dark svelte-xvmnbq"}"></div>` : ``}
                ${advent.elem.includes("\u51A5") ? `<div class="${"elem hell svelte-xvmnbq"}"></div>` : ``}
                ${advent.elem.includes("\u5929") ? `<div class="${"elem heaven svelte-xvmnbq"}"></div>` : ``}</div></div>` : ``}</div>
    ${full ? `<p class="${"name " + escape(advent.disable ? "disable" : "") + " svelte-xvmnbq"}">${escape(advent.name)}</p>` : ``}
    
</div>`;
});
var InfiniteScroll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
var css$c = {
  code: "button.svelte-1r971ov.svelte-1r971ov{font-size:14px;width:70px;color:white;border:solid 2px white;border-radius:5px}article.svelte-1r971ov.svelte-1r971ov{height:calc(100vh - 150px);overflow-y:scroll}article.svelte-1r971ov section.svelte-1r971ov{margin:0 auto;width:90vw;max-width:700px}article.svelte-1r971ov #elem-filter-box.svelte-1r971ov{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:right}article.svelte-1r971ov #elem-filter-box .elem.svelte-1r971ov{width:25px;font-size:12px;font-weight:900;text-align:center;margin:5px;border-radius:5px;border:solid 2px #929292;padding:3px}article.svelte-1r971ov #elem-filter-box .elem div.svelte-1r971ov{width:25px;height:25px;margin:0 auto;border-radius:12px}article.svelte-1r971ov #elem-filter-box .elem.active.fire.svelte-1r971ov{border-color:red;color:red;text-shadow:2px 1px 0px #ff7300}article.svelte-1r971ov #elem-filter-box .elem.active.water.svelte-1r971ov{border-color:#2c80ff;color:#2c80ff;text-shadow:2px 1px 0px #a2bfff}article.svelte-1r971ov #elem-filter-box .elem.active.wood.svelte-1r971ov{border-color:#35af00;color:#35af00;text-shadow:2px 1px 0px #2e7300}article.svelte-1r971ov #elem-filter-box .elem.active.light.svelte-1r971ov{border-color:#fff4c3;color:#ffe883;text-shadow:2px 1px 0px #ffc400}article.svelte-1r971ov #elem-filter-box .elem.active.dark.svelte-1r971ov{border-color:#c83eff;color:#c83eff;text-shadow:2px 1px 0px #db81ff}article.svelte-1r971ov #elem-filter-box .elem.active.hell.svelte-1r971ov{border-color:#ffc400;color:#3d2d00;text-shadow:2px 1px 0px #ffc400}article.svelte-1r971ov #elem-filter-box .elem.active.heaven.svelte-1r971ov{border-color:#ffb4f5;color:#f1dade;text-shadow:2px 1px 0px #ff5fea}article.svelte-1r971ov #elem-filter-box button.svelte-1r971ov{--green:#6fffcf;color:var(--green);border:solid 2px var(--green);margin:0 0 0 15px}article.svelte-1r971ov #advent-list-box.svelte-1r971ov{width:90vw}article.svelte-1r971ov #advent-list-box p.svelte-1r971ov{font-size:11px}article.svelte-1r971ov #advent-list-box #advent-list.svelte-1r971ov{max-width:700px;margin:0 auto 10px auto;height:170px;display:flex;flex-direction:column;justify-content:start;flex-wrap:wrap;overflow-x:scroll}article.svelte-1r971ov #advent-detail-box.svelte-1r971ov{margin:30px auto;width:90vw}article.svelte-1r971ov #advent-detail-box #advent-overview.svelte-1r971ov{display:flex}article.svelte-1r971ov #advent-detail-box #advent-overview #advent-overview-text.svelte-1r971ov{display:flex;flex-direction:column;justify-content:center}article.svelte-1r971ov #advent-detail-box #advent-overview #advent-overview-text h5.svelte-1r971ov{margin:5px 0}article.svelte-1r971ov #advent-detail-box #banmen-list.svelte-1r971ov{margin:10px 0 400px 0}article.svelte-1r971ov #advent-detail-box #banmen-list #banmen-moj-length-config-box.svelte-1r971ov{margin:10px 0 20px 0;max-width:350px;display:flex;justify-content:space-between}article.svelte-1r971ov #advent-detail-box #banmen-list #banmen-moj-length-config-box button.active.svelte-1r971ov{color:var(--active-yellow);border-color:var(--active-yellow)}article.svelte-1r971ov #advent-detail-box #banmen-list .banmen.svelte-1r971ov{display:flex;justify-content:space-between;align-items:center;font-size:20px;font-weight:bold;letter-spacing:3px;border-bottom:solid 1px white;padding:0 0 5px 0;margin:0 0 15px 0}article.svelte-1r971ov #advent-detail-box #banmen-list .banmen img.svelte-1r971ov{width:8px;height:15px;margin:0 20px 0 0;transition:0.5s}article.svelte-1r971ov #advent-detail-box #banmen-list .banmen.active.svelte-1r971ov{color:var(--active-yellow)}article.svelte-1r971ov #advent-detail-box #banmen-list .banmen.active img.svelte-1r971ov{transform:rotate(90deg)}article.svelte-1r971ov #advent-detail-box #answers-box.svelte-1r971ov{position:fixed;padding:15px 15px 60px 15px;z-index:100;bottom:-520px;left:0;width:100vw;height:480px;background:linear-gradient(225deg, black, rgba(0, 0, 0, 0.8));border-top:solid 2px white;transition:0.3s}article.svelte-1r971ov #advent-detail-box #answers-box.active.svelte-1r971ov{bottom:0}article.svelte-1r971ov #advent-detail-box #answers-box .answer-count.svelte-1r971ov{max-width:650px;margin:0 auto 20px auto}article.svelte-1r971ov #advent-detail-box #answers-box #answer-box-close-button.svelte-1r971ov{position:absolute;top:-30px;right:50px;width:80px;height:30px;border:solid 1px white;border-bottom:solid 2px black;border-radius:7px 7px 0 0;background:black}article.svelte-1r971ov #advent-detail-box #answers-box #answer-box-close-button-tap-area.svelte-1r971ov{position:absolute;top:-30px;right:50px;width:80px;height:100px;padding:15px 30px}article.svelte-1r971ov #advent-detail-box #answers-box #answers-list.svelte-1r971ov{width:90vw;max-width:650px;margin:0 auto;color:white;height:100%;overflow-y:scroll;display:flex;justify-content:left;flex-wrap:wrap}article.svelte-1r971ov #advent-detail-box #answers-box #answers-list .ans-box.svelte-1r971ov{width:160px;padding:0 0 0 15px;border-left:solid 3px white;margin:10px 0}article.svelte-1r971ov #advent-detail-box #answers-box #answers-list .ans-box .answer-word.svelte-1r971ov{font-size:18px}article.svelte-1r971ov #advent-detail-box #answers-box #answers-list .ans-box .answer-nessesary.svelte-1r971ov{font-size:12px}",
  map: null
};
var Analyze = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$c);
  $$unsubscribe_adventBanmenStore();
  $$unsubscribe_mojiLengthConfigStore();
  $$unsubscribe_adventTargetStore();
  $$unsubscribe_adventStore();
  $$unsubscribe_adventFilterConditionStore();
  $$unsubscribe_adventElemStore();
  $$unsubscribe_deckStore();
  return `<article class="${"com_scroll-y svelte-1r971ov"}"><section id="${"advent-list-box"}" class="${"svelte-1r971ov"}"><p class="${"svelte-1r971ov"}">\u653B\u7565\u3059\u308B\u964D\u81E8\u3092\u9078\u629E</p>
        <div id="${"advent-list"}" class="${"com_scroll-x svelte-1r971ov"}">${`${each($adventStore, (as) => `${validate_component(Advent, "Advent").$$render($$result, { advent: as, full: true }, {}, {})}
                ${validate_component(InfiniteScroll, "InfiniteScroll").$$render($$result, { threshold: 100 }, {}, {})}`)}`}</div></section>
    <section id="${"elem-filter-box"}" class="${"svelte-1r971ov"}">${each($adventElemStore, (es, i) => `<div class="${"elem " + escape(ElemEngDict[es.elem]) + " " + escape(es.active ? "active" : "") + " svelte-1r971ov"}">${escape(es.elem)}</div>`)}
        <button class="${"svelte-1r971ov"}">\u7D5E\u8FBC</button></section>
    <section id="${"advent-detail-box"}" class="${"svelte-1r971ov"}">${`<div id="${"advent-overview"}" class="${"svelte-1r971ov"}">${$adventTargetStore ? `${validate_component(Advent, "Advent").$$render($$result, { advent: $adventTargetStore }, {}, {})}
                <div id="${"advent-overview-text"}" class="${"svelte-1r971ov"}"><h3>${escape($adventTargetStore.name)}</h3>
                    <h5 class="${"svelte-1r971ov"}">${escape(AdventNumDict[$adventTargetStore.level])}</h5>
                    <h5 class="${"svelte-1r971ov"}">\u53CE\u9332\u76E4\u9762\u6570 : ${escape($adventBanmenStore.length)}</h5></div>` : ``}</div>
            <div id="${"banmen-list"}" class="${"svelte-1r971ov"}">${$adventBanmenStore.length != 0 ? `<div id="${"banmen-moj-length-config-box"}" class="${"svelte-1r971ov"}">${each($mojiLengthConfigStore, (mlcs) => `<button class="${escape(null_to_empty(mlcs.active ? "active" : "")) + " svelte-1r971ov"}">${escape(mlcs.length)}\u6587\u5B57
                        </button>`)}</div>` : ``}
                ${each($adventBanmenStore, (abs) => `<div class="${"banmen " + escape(abs.active ? "active" : "") + " svelte-1r971ov"}">${escape(abs.banmen.banmen.replace(/\./g, "\u25EF"))}
                        <img src="${"/img/arrow_simple_right.svg"}" alt="${">"}" class="${"svelte-1r971ov"}">
                    </div>`)}</div>
            <div id="${"answers-box"}" class="${escape(null_to_empty("")) + " svelte-1r971ov"}"><div id="${"answer-box-close-button"}" class="${"svelte-1r971ov"}"></div>
                <div id="${"answer-box-close-button-tap-area"}" class="${"svelte-1r971ov"}"><img src="${"/img/arrow_simple_bottom.svg"}" alt="${"\u2B07\uFE0E"}" class="${"svelte-1r971ov"}"></div>
                <div class="${"answer-count svelte-1r971ov"}">\u30D2\u30C3\u30C8\u6570 : ${escape(answerCount)}</div>
                <div id="${"answers-list"}" class="${"com_scroll-y svelte-1r971ov"}">${`${each(answerList, (al) => `<div class="${"ans-box svelte-1r971ov"}"><div class="${"answer-word svelte-1r971ov"}">${escape(al.word)}</div>
                                <div class="${"answer-nessesary svelte-1r971ov"}">${escape(al.necessary)}</div>
                            </div>`)}`}</div></div>`}</section>


</article>`;
});
var analyze = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Analyze
});
var css$b = {
  code: '.kotodaman.svelte-1xo4c4s.svelte-1xo4c4s{font-family:"Kosugi Maru", sans-serif;width:71px;margin:10px}.kotodaman.no-margin.svelte-1xo4c4s.svelte-1xo4c4s{display:flex;justify-content:center;align-items:center;width:70px;height:70px;margin:0px}.kotodaman.svelte-1xo4c4s .smart-info-box.svelte-1xo4c4s{display:flex;flex-direction:row;justify-content:space-around}.kotodaman.svelte-1xo4c4s .smart-info-box img.svelte-1xo4c4s{width:60px;height:50px}.kotodaman.svelte-1xo4c4s .smart-info-box img.disable.svelte-1xo4c4s{filter:grayscale(85%)}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box.svelte-1xo4c4s{position:relative}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .tribe-box.svelte-1xo4c4s{position:absolute;top:2px;left:-10px;width:19px;height:17px;background-color:#ffd726;box-shadow:1px 2px 1px white;border-radius:1px 8px}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .tribe-box.disable.svelte-1xo4c4s{color:#b6b6b6;background-color:#887e43}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .tribe-box p.svelte-1xo4c4s{font-size:14px;line-height:17px;text-align:center;text-shadow:1px 1px 2px black}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box.svelte-1xo4c4s{height:100%;display:flex;flex-direction:column-reverse}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.svelte-1xo4c4s{width:11px;height:11px;border-radius:6px;margin:0 0 2px 0;border:solid 2px}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.fire.svelte-1xo4c4s{background-color:#db4646;border-color:#ff9100}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.water.svelte-1xo4c4s{background-color:#297eff;border-color:#a7d7ff}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.wood.svelte-1xo4c4s{background-color:#69ac69;border-color:#afd8ab}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.light.svelte-1xo4c4s{background-color:#ffd23e;border-color:#fff09e}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.dark.svelte-1xo4c4s{background-color:#9255a5;border-color:#d0acff}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.hell.svelte-1xo4c4s{background-color:#311f04;border-color:#d6a609}.kotodaman.svelte-1xo4c4s .smart-info-box .elems-tribe-box .elems-box .elem.heaven.svelte-1xo4c4s{background-color:#faf3f8;border-color:#ffaff8}.kotodaman.svelte-1xo4c4s .name.svelte-1xo4c4s{text-align:center;line-height:10px;font-size:10px;width:100%;margin:3px 0 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kotodaman.svelte-1xo4c4s .name.disable.svelte-1xo4c4s{color:gray}',
  map: null
};
var Kotodaman = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_isDeckFullStore;
  $$unsubscribe_isDeckFullStore = subscribe(isDeckFullStore, (value) => value);
  createEventDispatcher();
  let { kotodaman } = $$props;
  let { full = false } = $$props;
  if ($$props.kotodaman === void 0 && $$bindings.kotodaman && kotodaman !== void 0)
    $$bindings.kotodaman(kotodaman);
  if ($$props.full === void 0 && $$bindings.full && full !== void 0)
    $$bindings.full(full);
  $$result.css.add(css$b);
  $$unsubscribe_isDeckFullStore();
  return `<div class="${"kotodaman " + escape(!full ? "no-margin" : "") + " svelte-1xo4c4s"}"><div class="${"smart-info-box svelte-1xo4c4s"}"><img class="${escape(null_to_empty(kotodaman.disable ? "disable" : "")) + " svelte-1xo4c4s"}"${add_attribute("src", kotodaman.figure, 0)}${add_attribute("alt", kotodaman.name, 0)}>
        ${full ? `<div class="${"elems-tribe-box svelte-1xo4c4s"}"><div class="${"tribe-box " + escape(kotodaman.disable ? "disable" : "") + " svelte-1xo4c4s"}"><p class="${"svelte-1xo4c4s"}">${escape(kotodaman.tribe[0])}</p></div>
            
            <div class="${"elems-box svelte-1xo4c4s"}">${kotodaman.elem.includes("\u706B") ? `<div class="${"elem fire svelte-1xo4c4s"}"></div>` : ``}
                ${kotodaman.elem.includes("\u6C34") ? `<div class="${"elem water svelte-1xo4c4s"}"></div>` : ``}
                ${kotodaman.elem.includes("\u6728") ? `<div class="${"elem wood svelte-1xo4c4s"}"></div>` : ``}
                ${kotodaman.elem.includes("\u5149") ? `<div class="${"elem light svelte-1xo4c4s"}"></div>` : ``}
                ${kotodaman.elem.includes("\u95C7") ? `<div class="${"elem dark svelte-1xo4c4s"}"></div>` : ``}
                ${kotodaman.elem.includes("\u51A5") ? `<div class="${"elem hell svelte-1xo4c4s"}"></div>` : ``}
                ${kotodaman.elem.includes("\u5929") ? `<div class="${"elem heaven svelte-1xo4c4s"}"></div>` : ``}</div></div>` : ``}</div>
    ${full ? `<p class="${"name " + escape(kotodaman.disable ? "disable" : "") + " svelte-1xo4c4s"}">${escape(kotodaman.name)}</p>` : ``}
    
</div>`;
});
var css$a = {
  code: '#specify-filter-box.svelte-z4r2ey.svelte-z4r2ey{width:100%;display:flex;flex-direction:column;justify-content:space-evenly;font-family:"Kosugi Maru", sans-serif}h3.svelte-z4r2ey.svelte-z4r2ey{margin:10px 0 0 0}#elem-box.svelte-z4r2ey.svelte-z4r2ey,#tribe-box.svelte-z4r2ey.svelte-z4r2ey,#gimmick-box.svelte-z4r2ey.svelte-z4r2ey{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;margin:0 0 10px 0}.elem.svelte-z4r2ey.svelte-z4r2ey{width:50px;font-size:18px;font-weight:900;text-align:center;margin:5px;border-radius:5px;border:solid 2px white;padding:3px}.elem.active.fire.svelte-z4r2ey.svelte-z4r2ey{border-color:red;color:red;text-shadow:2px 1px 0px #ff7300}.elem.active.water.svelte-z4r2ey.svelte-z4r2ey{border-color:#2c80ff;color:#2c80ff;text-shadow:2px 1px 0px #a2bfff}.elem.active.wood.svelte-z4r2ey.svelte-z4r2ey{border-color:#35af00;color:#35af00;text-shadow:2px 1px 0px #2e7300}.elem.active.light.svelte-z4r2ey.svelte-z4r2ey{border-color:#fff4c3;color:#ffe883;text-shadow:2px 1px 0px #ffc400}.elem.active.dark.svelte-z4r2ey.svelte-z4r2ey{border-color:#c83eff;color:#c83eff;text-shadow:2px 1px 0px #db81ff}.elem.active.hell.svelte-z4r2ey.svelte-z4r2ey{border-color:#ffc400;color:#3d2d00;text-shadow:2px 1px 0px #ffc400}.elem.active.heaven.svelte-z4r2ey.svelte-z4r2ey{border-color:#ffb4f5;color:#f1dade;text-shadow:2px 1px 0px #ff5fea}.elem.long.svelte-z4r2ey.svelte-z4r2ey{width:70px}.tribe.svelte-z4r2ey.svelte-z4r2ey{width:50px;height:35px;margin:5px;border-radius:5px;text-align:center;justify-content:space-around;line-height:30px;border:solid 2px white}.tribe.blank.svelte-z4r2ey.svelte-z4r2ey{border:none}.tribe.active.svelte-z4r2ey.svelte-z4r2ey{border:solid 2px var(--active-yellow);color:var(--active-yellow)}.gimmick.svelte-z4r2ey.svelte-z4r2ey{width:50px;height:40px;margin:5px;justify-content:space-around;border-radius:5px;border:solid 2px white;padding:3px}.gimmick.active.svelte-z4r2ey.svelte-z4r2ey{border:solid 2px var(--active-yellow)}.gimmick.svelte-z4r2ey img.svelte-z4r2ey{margin:0 auto;height:30px}.elem.svelte-z4r2ey.svelte-z4r2ey,.tribe.svelte-z4r2ey.svelte-z4r2ey,.gimmick.svelte-z4r2ey.svelte-z4r2ey{cursor:pointer}',
  map: null
};
var Specify = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $gimmickStore, $$unsubscribe_gimmickStore;
  let $tribeStore, $$unsubscribe_tribeStore;
  let $elemStore, $$unsubscribe_elemStore;
  $$unsubscribe_gimmickStore = subscribe(gimmickStore, (value) => $gimmickStore = value);
  $$unsubscribe_tribeStore = subscribe(tribeStore, (value) => $tribeStore = value);
  $$unsubscribe_elemStore = subscribe(elemStore, (value) => $elemStore = value);
  $$result.css.add(css$a);
  $$unsubscribe_gimmickStore();
  $$unsubscribe_tribeStore();
  $$unsubscribe_elemStore();
  return `<article id="${"specify-filter-box"}" class="${"svelte-z4r2ey"}"><h3 class="${"svelte-z4r2ey"}">\u5C5E\u6027</h3>
    <section id="${"elem-box"}" class="${"svelte-z4r2ey"}">${each($elemStore, (es, i) => `<div class="${"elem " + escape(ElemEngDict[es.elem]) + " " + escape(i < 3 ? "long" : "") + " " + escape(es.active ? "active" : "") + " svelte-z4r2ey"}">${escape(es.elem)}</div>`)}</section>
    <h3 class="${"svelte-z4r2ey"}">\u7A2E\u65CF</h3>
    <section id="${"tribe-box"}" class="${"svelte-z4r2ey"}">${each($tribeStore, (ts) => `<div class="${"tribe " + escape(TribeEngDict[ts.tribe]) + " " + escape(ts.active ? "active" : "") + " svelte-z4r2ey"}">${escape(ts.tribe)}</div>`)}
        <div class="${"tribe blank svelte-z4r2ey"}"></div></section>
    <h3 class="${"svelte-z4r2ey"}">\u30AE\u30DF\u30C3\u30AF</h3>
    <section id="${"gimmick-box"}" class="${"svelte-z4r2ey"}">${each($gimmickStore, (gs) => `<div class="${"gimmick " + escape(gs.active ? "active" : "") + " svelte-z4r2ey"}"><img${add_attribute("src", `/img/bs2nd/${GimmickEngDict[gs.gimmick]}.svg`, 0)}${add_attribute("alt", gs.gimmick, 0)} class="${"svelte-z4r2ey"}"></div>`)}</section>
</article>`;
});
var css$9 = {
  code: '#kana-filter-box.svelte-1dnb1gp.svelte-1dnb1gp{width:100%;font-family:"Kosugi Maru", sans-serif}#kana-filter-box.svelte-1dnb1gp p.svelte-1dnb1gp{margin:10px 0 0 0;font-size:10px}#kana-box.svelte-1dnb1gp.svelte-1dnb1gp{display:flex;justify-content:space-around;flex-wrap:wrap;--kana-box-size:38px}#kana-box.svelte-1dnb1gp .kana.svelte-1dnb1gp{cursor:pointer;border:solid 1px white;border-radius:3px;width:var(--kana-box-size);height:var(--kana-box-size);margin:2px 5px;line-height:var(--kana-box-size);text-align:center}#kana-box.svelte-1dnb1gp .kana.active.svelte-1dnb1gp{border-color:var(--active-yellow);color:var(--active-yellow)}#kana-box.svelte-1dnb1gp .kana-blank.svelte-1dnb1gp{width:var(--kana-box-size);height:var(--kana-box-size);margin:2px}',
  map: null
};
var Kana = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $kanaStore, $$unsubscribe_kanaStore;
  $$unsubscribe_kanaStore = subscribe(kanaStore, (value) => $kanaStore = value);
  $$result.css.add(css$9);
  $$unsubscribe_kanaStore();
  return `<article id="${"kana-filter-box"}" class="${"svelte-1dnb1gp"}"><section id="${"kana-box"}" class="${"svelte-1dnb1gp"}">${each($kanaStore, (k) => `${k.kanas[0] != "" ? `<div class="${"kana " + escape(k.active ? "active" : "") + " svelte-1dnb1gp"}">${escape(k.kanas[0])}
                </div>` : `<div class="${"kana-blank svelte-1dnb1gp"}"></div>`}`)}</section>
    <p class="${"svelte-1dnb1gp"}">* \u6FC1\u97F3\u3084\u4FC3\u97F3\u306A\u3069\u306F\u3001\u5168\u3066\u305D\u306E\u76F4\u97F3\u306B\u542B\u307E\u308C\u307E\u3059\u3002</p>
</article>`;
});
var css$8 = {
  code: "#bs2nd-edit-filter-panel.svelte-lv4ubr.svelte-lv4ubr.svelte-lv4ubr{padding:5px;width:100%;height:100%;position:relative}#bs2nd-edit-filter-panel.svelte-lv4ubr .tabbox.svelte-lv4ubr.svelte-lv4ubr{margin-bottom:10px;padding:10px;border:1px solid #dee2e6;border-radius:0 0 0.5rem 0.5rem;border-top:0}#bs2nd-edit-filter-panel.svelte-lv4ubr ul.svelte-lv4ubr.svelte-lv4ubr{display:flex;flex-wrap:wrap;padding-left:0;margin:0 0;list-style:none;border-bottom:1px solid #dee2e6}#bs2nd-edit-filter-panel.svelte-lv4ubr li.svelte-lv4ubr.svelte-lv4ubr{width:50%;text-align:center;margin-bottom:-1px}#bs2nd-edit-filter-panel.svelte-lv4ubr span.svelte-lv4ubr.svelte-lv4ubr{border:1px solid transparent;border-top-left-radius:0.25rem;border-top-right-radius:0.25rem;display:block;padding:0.5rem 1rem;cursor:pointer;transition:0.3s}#bs2nd-edit-filter-panel.svelte-lv4ubr span.svelte-lv4ubr.svelte-lv4ubr:hover{border-color:#e9ecef #e9ecef #dee2e6}#bs2nd-edit-filter-panel.svelte-lv4ubr li.active.svelte-lv4ubr>span.svelte-lv4ubr{border-color:#dee2e6 #dee2e6 #fff}#bs2nd-edit-filter-panel.svelte-lv4ubr #filter-execute-box.svelte-lv4ubr.svelte-lv4ubr{position:absolute;bottom:25px;width:100%;text-align:center}#bs2nd-edit-filter-panel.svelte-lv4ubr #filter-execute-box button.svelte-lv4ubr.svelte-lv4ubr{margin:0 10px;border:solid 1px white;border-radius:5px;color:white;width:110px;height:35px}",
  map: null
};
var Main = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$8);
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
  return `<article id="${"bs2nd-edit-filter-panel"}" class="${"svelte-lv4ubr"}"><ul class="${"svelte-lv4ubr"}">${each(tabs, (t) => `<li class="${escape(null_to_empty(activeTabs === t.value ? "active" : "")) + " svelte-lv4ubr"}"><span class="${"svelte-lv4ubr"}">${escape(t.label)}</span>
            </li>`)}</ul>
    ${each(tabs, (t) => `${activeTabs == t.value ? `<div class="${"tabbox svelte-lv4ubr"}">${validate_component(t.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}
        </div>` : ``}`)}
    <section id="${"filter-execute-box"}" class="${"svelte-lv4ubr"}"><button id="${"search-button"}" class="${"svelte-lv4ubr"}">\u691C\u7D22</button>
        <button id="${"reset-button"}" class="${"svelte-lv4ubr"}">\u30EA\u30BB\u30C3\u30C8</button></section>
</article>`;
});
var css$7 = {
  code: '#deck-list-panel.svelte-zpytjz.svelte-zpytjz{font-family:"Kosugi Maru", sans-serif;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between}#deck-list-panel.svelte-zpytjz .deck-box.svelte-zpytjz{width:100%;height:100px;position:relative}#deck-list-panel.svelte-zpytjz .deck-box .deck-name.svelte-zpytjz{position:absolute;color:white;background:none;border:none;z-index:15;width:150px;font-size:15px;top:20px;left:10px}#deck-list-panel.svelte-zpytjz .deck-box .deck-name.svelte-zpytjz:focus{outline:none;border:solid 1px var(--active-yellow);border-radius:5px}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail.svelte-zpytjz{position:absolute;top:10px;right:0;width:70%;height:80px}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail .deck-img.svelte-zpytjz{position:absolute;width:100%;height:inherit;background-image:var(--url);background-size:cover;background-position:50% 30%;background-repeat:no-repeat;background-blend-mode:screen}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail .deck-img-blank.svelte-zpytjz{position:absolute;right:40px;top:20px;width:auto;height:40px;background-image:var(--url-blank)}#deck-list-panel.svelte-zpytjz .deck-box .deck-thumbnail .deck-img-filter.svelte-zpytjz{position:absolute;width:100%;height:100%;background:linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0))}#deck-list-panel.svelte-zpytjz .deck-box .deck-list.svelte-zpytjz{position:absolute;z-index:10;left:10px;bottom:0px;width:180px;display:flex;flex-direction:row;flex-wrap:wrap-reverse}#deck-list-panel.svelte-zpytjz .deck-box .deck-list img.svelte-zpytjz{width:25px;margin:0 3px 0 0}#deck-list-panel.svelte-zpytjz .deck-box .deck-delete-button.svelte-zpytjz{position:absolute;bottom:0;right:10px}#deck-list-panel.svelte-zpytjz .deck-box .deck-delete-button img.svelte-zpytjz{width:30px}',
  map: null
};
var Storage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$7);
  $$unsubscribe_unitListStore();
  $$unsubscribe_deckStore();
  $$unsubscribe_decks();
  $$unsubscribe_isDeckFullStore();
  return `<section id="${"deck-list-panel"}" class="${"svelte-zpytjz"}">${each($decks, (d) => `${d.list.length != 0 ? `<div class="${"deck-box svelte-zpytjz"}"><input placeholder="${"deck name"}" class="${"deck-name svelte-zpytjz"}"${add_attribute("value", d.deckname, 0)}>
            <div class="${"deck-thumbnail svelte-zpytjz"}"><div class="${"deck-img svelte-zpytjz"}" style="${"--url:url(" + escape(d.list[0].figure) + ")"}"></div>
                <div class="${"deck-img-filter svelte-zpytjz"}"></div></div>
            <div class="${"deck-list svelte-zpytjz"}">${each(d.list, (dl, i) => `${i != 0 ? `<img${add_attribute("src", dl.figure, 0)} alt="${""}" class="${"svelte-zpytjz"}">` : ``}`)}</div>
            <div class="${"deck-delete-button svelte-zpytjz"}"><img src="${"/img/trash.svg"}" alt="${"\u524A\u9664"}" class="${"svelte-zpytjz"}"></div>
        </div>` : `<div class="${"deck-box svelte-zpytjz"}"><input style="${"color:gray;"}" class="${"deck-name svelte-zpytjz"}"${add_attribute("value", "Empty", 0)} ${"disabled"}>
            <div class="${"deck-thumbnail svelte-zpytjz"}"><img class="${"deck-img-blank svelte-zpytjz"}" src="${"/img/add_people.svg"}" alt="${"add deck"}"></div>
        </div>`}`)}
</section>`;
});
var css$6 = {
  code: "#bs2nd-screen.svelte-18a0dkd.svelte-18a0dkd{margin:0 auto;height:calc(100vh - 120px);overflow:hidden;display:flex;flex-direction:row;justify-content:space-evenly}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels.svelte-18a0dkd{max-width:90vw;height:100%;display:flex;flex-direction:column;justify-content:space-around}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels #bs2nd-deck-edit.svelte-18a0dkd{margin:10px auto 10px auto}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels #bs2nd-deck-edit #bs2nd-deck-edit-panel.svelte-18a0dkd{height:225px;width:300px;margin:0 0 5px 0;background:white;border-radius:20px;display:flex;flex-direction:row;justify-content:space-evenly;flex-wrap:wrap}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels #bs2nd-deck-edit #bs2nd-deck-edit-panel .unit-in-deck-blank-slot.svelte-18a0dkd{width:50px;height:50px;border-radius:25px;margin:10px;background-color:#333333}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels #bs2nd-deck-edit button.svelte-18a0dkd{width:100px;margin:0 0 0 15px;border:solid 1px white;border-radius:10px;color:white;font-size:12px}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels #bs2nd-show-units-panel.svelte-18a0dkd{flex-grow:2;overflow-y:scroll;display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap;margin:10px 0 15px 0;width:100%;max-width:400px;border:solid 2px white;border-radius:20px;padding:25px 0 200px 0}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels #bs2nd-show-units-panel.svelte-18a0dkd::-webkit-scrollbar{width:5px}#bs2nd-screen.svelte-18a0dkd #bs2nd-edit-panels #bs2nd-show-units-panel.svelte-18a0dkd::-webkit-scrollbar-thumb{border-radius:2px}#bs2nd-screen.svelte-18a0dkd .panel-box h2.svelte-18a0dkd{margin:0 0 5px 0}#bs2nd-screen.svelte-18a0dkd .panel-box p.svelte-18a0dkd{margin:0 0 25px 0;font-size:12px}#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-slider.svelte-18a0dkd{position:fixed;top:50px;right:-250px;border:solid 2px white;border-radius:20px 0 0 20px}#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-panel.svelte-18a0dkd{border:solid 2px white;border-radius:10px}#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-slider.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-panel.svelte-18a0dkd{width:250px;height:550px;background:linear-gradient(90deg, black, rgba(0, 0, 0, 0.7));transition:0.3s;padding:5px 0 5px 5px}#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-slider.open.svelte-18a0dkd{right:-3px}#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-slider #bs2nd-deck-select-slider-button.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-panel #bs2nd-deck-select-slider-button.svelte-18a0dkd{position:absolute;border-top:solid 2px white;border-left:solid 2px white;border-bottom:solid 2px white;border-right:solid 4px black;background-color:black;border-radius:15px 0 0 15px;top:200px;left:-59px;width:60px;height:60px}#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-slider #bs2nd-deck-select-slider-button img.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-panel #bs2nd-deck-select-slider-button img.svelte-18a0dkd{width:40px;margin:8px auto;transition:0.5s 0.3s}#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-slider #bs2nd-deck-select-slider-button img.open.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-deck-select-panel #bs2nd-deck-select-slider-button img.open.svelte-18a0dkd{transform:rotate(180deg)}#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-slider.svelte-18a0dkd{position:fixed;bottom:80px;right:-300px;width:300px;height:600px;border:solid 2px white;border-radius:15px 0 0 15px}#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-panel.svelte-18a0dkd{width:300px;height:600px;border:solid 2px white;border-radius:10px}#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-slider.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-panel.svelte-18a0dkd{background:linear-gradient(45deg, black, rgba(0, 0, 0, 0.7));transition:0.3s;padding:5px}#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-slider.open.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-panel.open.svelte-18a0dkd{right:0}#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-slider #bs2nd-units-filter-slider-button.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-panel #bs2nd-units-filter-slider-button.svelte-18a0dkd{position:absolute;border-top:solid 2px white;border-left:solid 2px white;border-bottom:solid 2px white;border-right:solid 4px black;background-color:black;border-radius:15px 0 0 15px;bottom:10px;left:-59px;width:60px;height:60px}#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-slider #bs2nd-units-filter-slider-button img.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-panel #bs2nd-units-filter-slider-button img.svelte-18a0dkd{width:40px;margin:8px auto;transition:0.5s 0.3s}#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-slider #bs2nd-units-filter-slider-button img.open.svelte-18a0dkd,#bs2nd-screen.svelte-18a0dkd #bs2nd-units-filter-panel #bs2nd-units-filter-slider-button img.open.svelte-18a0dkd{transform:rotate(180deg)}",
  map: null
};
var Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  $$result.css.add(css$6);
  $$unsubscribe_isDeckFullStore();
  $$unsubscribe_deckStore();
  $$unsubscribe_unitListStore();
  $$unsubscribe_isListLoading();
  $$unsubscribe_isBottomOfScroll();
  $$unsubscribe_filterConditionStore();
  return `<article id="${"bs2nd-screen"}" class="${"svelte-18a0dkd"}">${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
    default: ({ matches }) => `${matches ? `
        <section class="${"panel-box"}"><h2 class="${"svelte-18a0dkd"}">\u7D5E\u308A\u8FBC\u307F</h2>
            <p class="${"svelte-18a0dkd"}">\u672C\u5BB6\u30B2\u30FC\u30E0\u3068\u307B\u307C\u540C\u3058\u8981\u9818\u3067\u3001<br>\u30AD\u30E3\u30E9\u306E\u7D5E\u308A\u8FBC\u307F\u691C\u7D22\u304C\u3067\u304D\u307E\u3059\u3002</p>
            <section id="${"bs2nd-units-filter-panel"}" class="${escape(null_to_empty("")) + " svelte-18a0dkd"}">${validate_component(Main, "EditCompMain").$$render($$result, {}, {}, {})}
                <div id="${"bs2nd-units-filter-slider-button"}" class="${"svelte-18a0dkd"}"><img class="${escape(null_to_empty("")) + " svelte-18a0dkd"}" src="${"/img/arrow-circle-left-solid.svg"}" alt="${"\u21E6"}"></div></section></section>
        
    ` : ``}`
  })}
    <section id="${"bs2nd-edit-panels"}" class="${"svelte-18a0dkd"}"><section id="${"bs2nd-deck-edit"}" class="${"svelte-18a0dkd"}"><section id="${"bs2nd-deck-edit-panel"}" class="${"svelte-18a0dkd"}">${each($deckStore, (unit) => `${unit == void 0 ? `<div class="${"unit-in-deck-blank-slot svelte-18a0dkd"}"></div>` : `${validate_component(Kotodaman, "Kotodaman").$$render($$result, { kotodaman: unit }, {}, {})}`}`)}</section>
            <button class="${"svelte-18a0dkd"}">\u30EA\u30BB\u30C3\u30C8</button></section>
        <section id="${"bs2nd-show-units-panel"}" class="${"svelte-18a0dkd"}">${each($unitListStore, (unit) => `${validate_component(Kotodaman, "Kotodaman").$$render($$result, { kotodaman: unit, full: true }, {}, {})}`)}
            ${$isListLoading ? `<div style="${"margin-top:80px"}">${validate_component(Bs2ndLoader, "Bs2ndLoader").$$render($$result, {}, {}, {})}</div>` : ``}
            ${``}
            ${validate_component(InfiniteScroll, "InfiniteScroll").$$render($$result, { threshold: 100 }, {}, {})}</section></section>
    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(max-width: 700px)" }, {}, {
    default: ({ matches }) => `${matches ? `
    <section id="${"bs2nd-deck-select-slider"}" class="${escape(null_to_empty("")) + " svelte-18a0dkd"}">${validate_component(Storage, "Storage").$$render($$result, {}, {}, {})}
        <div id="${"bs2nd-deck-select-slider-button"}" class="${"svelte-18a0dkd"}"><img class="${escape(null_to_empty("")) + " svelte-18a0dkd"}" src="${"/img/arrow-circle-left-solid.svg"}" alt="${"\u21E6"}"></div></section>
    <section id="${"bs2nd-units-filter-slider"}" class="${escape(null_to_empty("")) + " svelte-18a0dkd"}">${validate_component(Main, "EditCompMain").$$render($$result, {}, {}, {})}
        <div id="${"bs2nd-units-filter-slider-button"}" class="${"svelte-18a0dkd"}"><img class="${escape(null_to_empty("")) + " svelte-18a0dkd"}" src="${"/img/arrow-circle-left-solid.svg"}" alt="${"\u21E6"}"></div></section>
    ` : ``}`
  })}

    ${validate_component(MediaQuery, "MediaQuery").$$render($$result, { query: "(min-width: 701px)" }, {}, {
    default: ({ matches }) => `${matches ? `
    <section class="${"panel-box"}"><h2 class="${"svelte-18a0dkd"}">\u30C7\u30C3\u30AD\u30B9\u30C8\u30EC\u30FC\u30B8</h2>
        <p class="${"svelte-18a0dkd"}">\u7DE8\u6210\u3057\u305F\u30C7\u30C3\u30AD\u3092\u4FDD\u5B58\u3067\u304D\u307E\u3059\u3002<br>\u30C7\u30C3\u30AD\u306F\u3001\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306E<br>\u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306B\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002</p>
        <section id="${"bs2nd-deck-select-panel"}" class="${"svelte-18a0dkd"}">${validate_component(Storage, "Storage").$$render($$result, {}, {}, {})}</section></section>
    ` : ``}`
  })}
</article>`;
});
var edit = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Edit
});
var Post = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var post = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Post
});
var Collect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var collect = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Collect
});
var cardWidth = readable(90);
readable(110);
var modeStore = writable("dark");
var deckListStore = writable([]);
var handListStore = writable([]);
var boardListStore = writable([]);
var boardAreaInfoStore = writable({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});
var handAreaInfoStore = writable({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});
var deckAreaInfoStore = writable({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
});
var css$5 = {
  code: '@charset "UTF-8";:root{--header-height:40px;--cw:90px;--ch:110px}#tcg-all-compnents.svelte-no22cg.svelte-no22cg{display:flex;justify-content:space-between;top:0;left:0;right:0;bottom:0;overflow-y:scroll;-ms-overflow-style:none;scrollbar-width:none}#tcg-all-compnents.svelte-no22cg.svelte-no22cg::-webkit-scrollbar{display:none}header.svelte-no22cg.svelte-no22cg{display:flex;justify-content:space-between;height:var(--header-height)}header.svelte-no22cg .n2-logo.svelte-no22cg{padding:10px}header.svelte-no22cg .n2-logo img.svelte-no22cg{height:20px}header.svelte-no22cg .color-config.svelte-no22cg{margin:0 20px 0 0;display:flex;align-items:center}header.svelte-no22cg .color-config button.svelte-no22cg{width:25px;height:25px;margin:0 7px;border-radius:7px}header.svelte-no22cg .color-config .light.svelte-no22cg{background:white}header.svelte-no22cg .color-config .dark.svelte-no22cg{background:darkblue}#screen.svelte-no22cg.svelte-no22cg{display:flex;flex-direction:column;justify-content:center;width:calc(100vw - 70px);height:calc(100vh - 40px)}#screen.svelte-no22cg #base.svelte-no22cg{width:1100px;height:760px;margin:0 auto;-moz-perspective:500;-webkit-perspective:500;-o-perspective:500;-ms-perspective:500;perspective:500}#screen.svelte-no22cg #base.light.svelte-no22cg{background:white;background:radial-gradient(circle at bottom, white 0%, #ffecc0 100%)}#screen.svelte-no22cg #base.dark.svelte-no22cg{background:#24186e;background:radial-gradient(circle at bottom, #24186e 0%, black 100%)}footer.svelte-no22cg.svelte-no22cg{top:0;bottom:0;right:0;width:70px}footer.light.svelte-no22cg.svelte-no22cg{background:white}footer.dark.svelte-no22cg.svelte-no22cg{background:black}',
  map: null
};
var _layout_reset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $modeStore, $$unsubscribe_modeStore;
  $$unsubscribe_modeStore = subscribe(modeStore, (value) => $modeStore = value);
  $$result.css.add(css$5);
  $$unsubscribe_modeStore();
  return `<header class="${"svelte-no22cg"}"><div class="${"n2-logo svelte-no22cg"}"><a href="${"/"}"><img src="${"/img/n2-icon-white.svg"}" alt="${""}" class="${"svelte-no22cg"}"></a></div>
    <div class="${"color-config svelte-no22cg"}"><button class="${"light svelte-no22cg"}"></button>
        <button class="${"dark svelte-no22cg"}"></button></div></header>
<div id="${"tcg-all-compnents"}" class="${"svelte-no22cg"}"><article id="${"screen"}" class="${"svelte-no22cg"}"><section id="${"base"}" class="${escape(null_to_empty($modeStore)) + " svelte-no22cg"}">${slots.default ? slots.default({}) : ``}</section></article>
    
    <footer class="${escape(null_to_empty($modeStore)) + " svelte-no22cg"}"></footer></div>
${validate_component(ToastArea, "ToastArea").$$render($$result, {}, {}, {})}`;
});
var __layout_reset = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout_reset
});
var css$4 = {
  code: ":root{--guide-color:#ffbb00}img.svelte-r9fsf6.svelte-r9fsf6{-webkit-user-drag:none;border-radius:5px}.card-body.svelte-r9fsf6.svelte-r9fsf6{position:absolute;left:var(--pos_x);top:var(--pos_y);width:var(--cw);height:var(--ch);transition:0.2s;cursor:move}.card-body.movin.svelte-r9fsf6.svelte-r9fsf6{transition:none}.card-body.movin.svelte-r9fsf6 .card-surface.svelte-r9fsf6{filter:grayscale(100%) blur(2px)}.card-body.noGuide.svelte-r9fsf6 .card-surface.svelte-r9fsf6{filter:none}.card-body.svelte-r9fsf6 .card-surface.svelte-r9fsf6{position:absolute;transform:rotate(var(--rotate));transition:0.2s;width:100%;height:100%;-moz-perspective:500;-webkit-perspective:500;-o-perspective:500;-ms-perspective:500;perspective:500}.card-body.svelte-r9fsf6 .card-surface .front.svelte-r9fsf6,.card-body.svelte-r9fsf6 .card-surface .back.svelte-r9fsf6{transition:0.2s;position:absolute;left:8px;backface-visibility:hidden}.card-body.svelte-r9fsf6 .card-surface .front img.svelte-r9fsf6,.card-body.svelte-r9fsf6 .card-surface .back img.svelte-r9fsf6{width:calc(var(--cw) - 16px)}.card-body.svelte-r9fsf6 .card-surface .back.svelte-r9fsf6{transform:rotateY(-180deg)}.card-body.svelte-r9fsf6 .card-surface.flippin .front.svelte-r9fsf6{transform:rotateY(-180deg)}.card-body.svelte-r9fsf6 .card-surface.flippin .back.svelte-r9fsf6{transform:rotateY(0deg)}.card-body.svelte-r9fsf6 .card-guide.svelte-r9fsf6{position:absolute;--scaleup-width:10px;--scaleup-height:50px;left:calc(-1 * var(--scaleup-width) / 2);top:calc(-1 * var(--scaleup-height) / 2);width:calc(var(--cw) + var(--scaleup-width));height:calc(var(--ch) + var(--scaleup-height));border-radius:10px}.card-body.svelte-r9fsf6 .card-guide.hover.svelte-r9fsf6{border:solid 2px var(--guide-color)}.card-body.svelte-r9fsf6 .card-guide.hover button.svelte-r9fsf6{opacity:0.6;padding:0;position:absolute;--b-width:50%;--b-height:25px;--b-width-long:60px;--b-height-long:70px;--b-bradius:8px;width:var(--b-width);height:var(--b-height);background-color:var(--guide-color)}.card-body.svelte-r9fsf6 .card-guide.hover button.left-rotate.svelte-r9fsf6{top:0;left:0}.card-body.svelte-r9fsf6 .card-guide.hover button.right-rotate.svelte-r9fsf6{top:0;right:0}.card-body.svelte-r9fsf6 .card-guide.hover button.flip.svelte-r9fsf6{bottom:0;left:0;right:0;width:100%;height:var(--b-height)}.card-body.svelte-r9fsf6 .card-shadow.svelte-r9fsf6{position:absolute;--scaleup-width:20px;--scaleup-height:50px;left:calc(-1 * var(--scaleup-width) / 2);top:calc(-1 * var(--scaleup-height) * 2);width:calc(var(--cw) + var(--scaleup-width));height:calc(var(--ch) + var(--scaleup-height))}",
  map: null
};
var Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_deckAreaInfoStore;
  let $$unsubscribe_handAreaInfoStore;
  let $$unsubscribe_boardAreaInfoStore;
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
  $$result.css.add(css$4);
  $$unsubscribe_deckAreaInfoStore();
  $$unsubscribe_handAreaInfoStore();
  $$unsubscribe_boardAreaInfoStore();
  return `


<section class="${"card-body " + escape("") + " " + escape(noGuide ? "noGuide" : "") + " svelte-r9fsf6"}" style="${"--pos_x:" + escape(pos_x) + "px; --pos_y:" + escape(pos_y) + "px;--img:" + escape(img_url) + "; --rotate:" + escape(rotate) + "deg;"}">
    <div class="${"card-guide " + escape("") + " svelte-r9fsf6"}">${``}</div>
    
    <div class="${"card-surface " + escape(flippin ? "flippin" : "") + " svelte-r9fsf6"}"><div class="${"front svelte-r9fsf6"}"><img${add_attribute("src", img_url, 0)} alt="${""}" class="${"svelte-r9fsf6"}"></div>
        <div class="${"back svelte-r9fsf6"}"><img${add_attribute("src", sleeve_url, 0)} alt="${""}" class="${"svelte-r9fsf6"}"></div></div>

    ${``}
    
</section>`;
});
var css$3 = {
  code: "#handArea.svelte-1x1auw9.svelte-1x1auw9{position:absolute;margin:0 auto;width:500px;height:75px;left:calc(50% - 250px);bottom:0}#handArea.svelte-1x1auw9 #handArea-bg.svelte-1x1auw9{overflow:hidden;width:inherit;height:inherit}#handArea.svelte-1x1auw9 #handArea-bg #handArea-bg-radius.svelte-1x1auw9{position:relative;margin:0 auto;width:inherit;height:500px;border-radius:250px}#handArea.svelte-1x1auw9 #handArea-bg #handArea-bg-radius.light.svelte-1x1auw9{background:yellow}#handArea.svelte-1x1auw9 #handArea-bg #handArea-bg-radius.dark.svelte-1x1auw9{background:purple}",
  map: null
};
var handLineupGuideRadius = 250;
function handLineupGuideFunction(x) {
  return -1 * Math.sqrt(Math.pow(handLineupGuideRadius, 2) - Math.pow(x, 2));
}
var Hand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $handListStore, $$unsubscribe_handListStore;
  let $cardWidth, $$unsubscribe_cardWidth;
  let $modeStore, $$unsubscribe_modeStore;
  $$unsubscribe_handListStore = subscribe(handListStore, (value) => $handListStore = value);
  $$unsubscribe_cardWidth = subscribe(cardWidth, (value) => $cardWidth = value);
  $$unsubscribe_modeStore = subscribe(modeStore, (value) => $modeStore = value);
  createEventDispatcher();
  $$result.css.add(css$3);
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
      for (let i = 0; i < handLen; i++) {
        if (hand[i]) {
          const x = xSpacing * (i - handLen / 2 + 0.5);
          const y = handLineupGuideFunction(x);
          const deg = (i - Math.floor(handLen / 2)) * degSpaning;
          temp.push({
            id: hand[i].id,
            url: hand[i].url,
            burl: hand[i].burl,
            x: x + handLineupGuideRadius - $cardWidth / 2,
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
  return `<section id="${"handArea"}" class="${"svelte-1x1auw9"}"><div id="${"handArea-bg"}" class="${"svelte-1x1auw9"}"><div id="${"handArea-bg-radius"}" class="${escape(null_to_empty($modeStore)) + " svelte-1x1auw9"}"></div></div>
    ${each($handListStore, (h) => `${h ? `${validate_component(Card, "Card").$$render($$result, {
    id: h.id,
    pos_x: h.x,
    pos_y: h.y,
    rotate: h.rotate,
    onArea: "hand",
    img_url: h.url,
    sleeve_url: h.burl,
    flippin: h.flip
  }, {}, {})}` : ``}`)}
</section>`;
});
var css$2 = {
  code: "#deckArea.svelte-xml8qn.svelte-xml8qn{position:relative}#deckUI.svelte-xml8qn.svelte-xml8qn{z-index:20;position:absolute;top:-200px}#deckUI.svelte-xml8qn .deckUI-button.svelte-xml8qn{top:0;left:0;position:absolute;transform:rotate(vaar(--deg))}#deckUI.svelte-xml8qn .deckUI-button img.svelte-xml8qn{width:500px;height:500px}#deckPiling.svelte-xml8qn.svelte-xml8qn{position:relative;width:var(--ch);height:var(--cw)}#deckPiling.svelte-xml8qn .deckbottom.svelte-xml8qn{position:absolute;width:100px;height:200px;top:-40px;left:0;overflow:hidden}#deckPiling.svelte-xml8qn .deckbottom .round.svelte-xml8qn{position:absolute;right:0;width:200px;height:200px;border-radius:100px;background:red}",
  map: null
};
var Deck = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $deckListStore, $$unsubscribe_deckListStore;
  $$unsubscribe_deckListStore = subscribe(deckListStore, (value) => $deckListStore = value);
  createEventDispatcher();
  $$result.css.add(css$2);
  $$unsubscribe_deckListStore();
  return `<section id="${"deckArea"}" class="${"svelte-xml8qn"}"><section id="${"deckUI"}" class="${"svelte-xml8qn"}"><div class="${"deckUI-button svelte-xml8qn"}" style="${"--deg:" + escape(0) + "deg"}"><img src="${"/img/tcg-sim/ellipse.svg"}" alt="${""}" class="${"svelte-xml8qn"}"></div></section>
    <section id="${"deckPiling"}" class="${"svelte-xml8qn"}"><div class="${"deckbottom svelte-xml8qn"}"><div class="${"round svelte-xml8qn"}"></div></div>
        ${each($deckListStore, (d, i) => `${validate_component(Card, "Card").$$render($$result, {
    id: d.id,
    pos_x: d.x + i * -0.5,
    pos_y: d.y + i * -0.8,
    flippin: d.flip,
    onArea: "deck",
    img_url: d.url,
    sleeve_url: d.burl,
    noGuide: true
  }, {}, {})}`)}</section>
</section>`;
});
var css$1 = {
  code: '#board.svelte-10xn2tj.svelte-10xn2tj{width:900px;height:550px;margin:0 auto;transform:rotateX(10deg);border-radius:30px;position:relative}#board.light.svelte-10xn2tj.svelte-10xn2tj{background:radial-gradient(ellipse, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.2) 100%)}#board.dark.svelte-10xn2tj.svelte-10xn2tj{background:radial-gradient(ellipse, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0.1) 100%)}#myHand.svelte-10xn2tj.svelte-10xn2tj{position:fixed;width:100%;height:75px;bottom:0}#myHand.svelte-10xn2tj #handArea-main.svelte-10xn2tj{position:absolute;width:500px;height:180px;left:50%;transform:translate(-50%, 0);bottom:0}#myHand.svelte-10xn2tj #handArea-main.svelte-10xn2tj:hover{border:solid 2px white;border-radius:20px}#myHand.svelte-10xn2tj #handArea-main.svelte-10xn2tj:hover::before{position:absolute;content:"to hand";margin:10px}#myDeck.svelte-10xn2tj.svelte-10xn2tj{position:fixed;bottom:250px;left:0px}#myDeck.svelte-10xn2tj #deckArea-main.svelte-10xn2tj{position:absolute;width:200px;height:400px;top:50%;left:-50%;transform:translate(0, -50%);bottom:0}#myDeck.svelte-10xn2tj #deckArea-main.svelte-10xn2tj:hover::before{border:solid 2px white;border-radius:20px;width:100%;height:100%;position:absolute;content:"";margin:10px}#is-not-PC-alert.svelte-10xn2tj.svelte-10xn2tj{margin:100px 20px;background:black;border:solid 1px white;border-radius:20px;width:70%;max-width:600px}#is-not-PC-alert.svelte-10xn2tj .panel.svelte-10xn2tj{padding:20px}#is-not-PC-alert.svelte-10xn2tj .panel .device-exp.svelte-10xn2tj{color:white;position:relative;max-width:310px;margin:50px auto}#is-not-PC-alert.svelte-10xn2tj .panel .device-exp .device-figure.svelte-10xn2tj{width:80%;margin:0 auto;font-size:18px}#is-not-PC-alert.svelte-10xn2tj .panel .device-exp .device-figure span.svelte-10xn2tj{font-size:15px;line-height:18px}#is-not-PC-alert.svelte-10xn2tj .panel .device-exp .device-figure .width.svelte-10xn2tj{position:absolute;left:50%;top:-30px;transform:translate(-50%, 0)}#is-not-PC-alert.svelte-10xn2tj .panel .device-exp .device-figure .height.svelte-10xn2tj{position:absolute;top:50%;right:-55px;transform:rotate(90deg)}',
  map: null
};
var Game = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $deckListStore, $$unsubscribe_deckListStore;
  let $boardListStore, $$unsubscribe_boardListStore;
  let $handListStore, $$unsubscribe_handListStore;
  let $$unsubscribe_cardWidth;
  let $$unsubscribe_deckAreaInfoStore;
  let $$unsubscribe_handAreaInfoStore;
  let $$unsubscribe_boardAreaInfoStore;
  let $modeStore, $$unsubscribe_modeStore;
  $$unsubscribe_deckListStore = subscribe(deckListStore, (value) => $deckListStore = value);
  $$unsubscribe_boardListStore = subscribe(boardListStore, (value) => $boardListStore = value);
  $$unsubscribe_handListStore = subscribe(handListStore, (value) => $handListStore = value);
  $$unsubscribe_cardWidth = subscribe(cardWidth, (value) => value);
  $$unsubscribe_deckAreaInfoStore = subscribe(deckAreaInfoStore, (value) => value);
  $$unsubscribe_handAreaInfoStore = subscribe(handAreaInfoStore, (value) => value);
  $$unsubscribe_boardAreaInfoStore = subscribe(boardAreaInfoStore, (value) => value);
  $$unsubscribe_modeStore = subscribe(modeStore, (value) => $modeStore = value);
  set_store_value(boardListStore, $boardListStore = [
    {
      id: 1,
      url: "/img/tcg-sim/dmex17-003-[4].jpeg",
      burl: "/img/tcg-sim/dmr21-l02-[4].jpeg",
      x: 100,
      y: 100,
      flip: false,
      rotate: 0
    }
  ], $boardListStore);
  set_store_value(handListStore, $handListStore = [
    {
      id: 400,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      x: 0,
      y: 0,
      burl: "/img/tcg-sim/card.svg",
      rotate: 0,
      flip: false
    },
    {
      id: 401,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      x: 0,
      y: 0,
      burl: "/img/tcg-sim/card.svg",
      rotate: 0,
      flip: false
    }
  ], $handListStore);
  set_store_value(deckListStore, $deckListStore = [
    {
      id: 2,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 3,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 4,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 5,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 6,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 7,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 8,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 9,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 10,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 11,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 12,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 13,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 14,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 15,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 16,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 17,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 18,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 19,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 20,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 21,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 22,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 23,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 24,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 25,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 26,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 27,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 28,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 29,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 30,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 31,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 32,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 33,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 34,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 35,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 36,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 37,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 38,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 39,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    },
    {
      id: 40,
      url: "/img/tcg-sim/dmbd16-011-[4].jpeg",
      burl: "/img/tcg-sim/card.svg",
      rotate: 110,
      x: 0,
      y: 0,
      flip: true
    }
  ], $deckListStore);
  $$result.css.add(css$1);
  $$unsubscribe_deckListStore();
  $$unsubscribe_boardListStore();
  $$unsubscribe_handListStore();
  $$unsubscribe_cardWidth();
  $$unsubscribe_deckAreaInfoStore();
  $$unsubscribe_handAreaInfoStore();
  $$unsubscribe_boardAreaInfoStore();
  $$unsubscribe_modeStore();
  return `
${`<article id="${"board"}" class="${escape(null_to_empty($modeStore)) + " svelte-10xn2tj"}">${each($boardListStore, (bs) => `${validate_component(Card, "Card").$$render($$result, {
    id: bs.id,
    pos_x: bs.x,
    pos_y: bs.y,
    flippin: bs.flip,
    onArea: "board",
    img_url: bs.url,
    sleeve_url: bs.burl
  }, {}, {})}`)}</article>
<article id="${"myHand"}" class="${"svelte-10xn2tj"}"><div id="${"handArea-main"}" class="${"svelte-10xn2tj"}"></div>
    ${validate_component(Hand, "Hand").$$render($$result, {}, {}, {})}</article>
<article id="${"myDeck"}" class="${"svelte-10xn2tj"}"><div id="${"deckArea-main"}" class="${"svelte-10xn2tj"}"></div>
    ${validate_component(Deck, "Deck").$$render($$result, {}, {}, {})}</article>`}`;
});
var game = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Game
});
var css = {
  code: 'article.svelte-18s83uh.svelte-18s83uh{width:90vw;max-width:350px;margin:0 auto}article.svelte-18s83uh h1.svelte-18s83uh{margin:20px 0 10px 0}#phone-flame.svelte-18s83uh.svelte-18s83uh{padding:10px;border:solid 2px white;background:white;min-height:555px;border-radius:20px;position:relative}#phone-flame.svelte-18s83uh.svelte-18s83uh::before{content:"";position:absolute;background:white;--width:160px;left:calc(50% - var(--width) / 2);right:calc(50% - var(--width) / 2);height:25px;border-radius:0 0 20px 20px/0 0 15px 15px}#phone-flame.svelte-18s83uh.svelte-18s83uh::after{content:"";position:absolute;background:black;top:17px;--width:50px;left:calc(50% - var(--width) / 2);right:calc(50% - var(--width) / 2);height:10px;border-radius:5px}#phone-flame.svelte-18s83uh section.svelte-18s83uh{font-family:"Kosugi Maru", sans-serif;border:solid 2px white;padding:50px 20px 20px 20px;background:linear-gradient(135deg, black, black, rgba(0, 0, 0, 0.85));border-radius:10px;min-height:535px;display:flex;flex-wrap:wrap;grid-template-columns:repeat(auto-fill, 80px);justify-content:space-between}#phone-flame.svelte-18s83uh section .app-icon.svelte-18s83uh{display:flex;flex-direction:column;align-items:center;margin:0 0 45px 0;width:80px;height:80px}#phone-flame.svelte-18s83uh section .app-icon.active.svelte-18s83uh{border:solid 2px white;border-radius:20px}#phone-flame.svelte-18s83uh section .app-icon img.svelte-18s83uh{margin:0 auto;padding:10px;height:75px;cursor:pointer}#phone-flame.svelte-18s83uh section .app-icon .app-name.svelte-18s83uh{margin:10px 0 0 0;font-size:10px;text-align:center}',
  map: null
};
var App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let apps = [
    {
      name: "\u3070\u304F\u305C\u3064\u3055\u3042\u3061",
      icon: "/img/bs2nd/ba_gray.svg",
      href: "/app/bakuzetsu-searcher-2nd/edit",
      description: "\u30B3\u30C8\u30C0\u30DE\u30F3\u3067\u697D\u3057\u3066\u52DD\u3061\u305F\u3044\u4EBA\u306B\u5411\u3051\u305F\u30C4\u30FC\u30EB"
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
  $$result.css.add(css);
  return `<article class="${"svelte-18s83uh"}"><h1 class="${"svelte-18s83uh"}">APP LIST</h1>
    <div id="${"phone-flame"}" class="${"svelte-18s83uh"}"><section class="${"svelte-18s83uh"}">${each(apps, (a) => `<div class="${"app-icon active svelte-18s83uh"}"><a${add_attribute("href", a.href, 0)}><img${add_attribute("src", a.icon, 0)} alt="${""}" class="${"svelte-18s83uh"}">
                    <div class="${"app-name svelte-18s83uh"}">${escape(a.name)}</div></a>
            </div>`)}
        <div class="${"app-icon svelte-18s83uh"}"></div>
        <div class="${"app-icon svelte-18s83uh"}"></div>
        <div class="${"app-icon svelte-18s83uh"}"></div></section></div>
</article>`;
});
var app = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": App
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
