/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MonoPlatform_1 = __webpack_require__(6);
exports.platform = MonoPlatform_1.monoPlatform;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InternalRegisteredFunction_1 = __webpack_require__(7);
var registeredFunctions = {};
function registerFunction(identifier, implementation) {
    if (InternalRegisteredFunction_1.internalRegisteredFunctions.hasOwnProperty(identifier)) {
        throw new Error("The function identifier '" + identifier + "' is reserved and cannot be registered.");
    }
    if (registeredFunctions.hasOwnProperty(identifier)) {
        throw new Error("A function with the identifier '" + identifier + "' has already been registered.");
    }
    registeredFunctions[identifier] = implementation;
}
exports.registerFunction = registerFunction;
function getRegisteredFunction(identifier) {
    // By prioritising the internal ones, we ensure you can't override them
    var result = InternalRegisteredFunction_1.internalRegisteredFunctions[identifier] || registeredFunctions[identifier];
    if (result) {
        return result;
    }
    else {
        throw new Error("Could not find registered function with name '" + identifier + "'.");
    }
}
exports.getRegisteredFunction = getRegisteredFunction;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getAssemblyNameFromUrl(url) {
    var lastSegment = url.substring(url.lastIndexOf('/') + 1);
    var queryStringStartPos = lastSegment.indexOf('?');
    var filename = queryStringStartPos < 0 ? lastSegment : lastSegment.substring(0, queryStringStartPos);
    return filename.replace(/\.dll$/, '');
}
exports.getAssemblyNameFromUrl = getAssemblyNameFromUrl;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RenderBatch_1 = __webpack_require__(9);
var BrowserRenderer_1 = __webpack_require__(10);
var browserRenderers = {};
function attachComponentToElement(browserRendererId, elementSelector, componentId) {
    var elementSelectorJs = Environment_1.platform.toJavaScriptString(elementSelector);
    var element = document.querySelector(elementSelectorJs);
    if (!element) {
        throw new Error("Could not find any element matching selector '" + elementSelectorJs + "'.");
    }
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        browserRenderer = browserRenderers[browserRendererId] = new BrowserRenderer_1.BrowserRenderer(browserRendererId);
    }
    browserRenderer.attachComponentToElement(componentId, element);
    clearElement(element);
}
exports.attachComponentToElement = attachComponentToElement;
function renderBatch(browserRendererId, batch) {
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        throw new Error("There is no browser renderer with ID " + browserRendererId + ".");
    }
    var updatedComponents = RenderBatch_1.renderBatch.updatedComponents(batch);
    var updatedComponentsLength = RenderBatch_1.arrayRange.count(updatedComponents);
    var updatedComponentsArray = RenderBatch_1.arrayRange.array(updatedComponents);
    var referenceFramesStruct = RenderBatch_1.renderBatch.referenceFrames(batch);
    var referenceFrames = RenderBatch_1.arrayRange.array(referenceFramesStruct);
    for (var i = 0; i < updatedComponentsLength; i++) {
        var diff = Environment_1.platform.getArrayEntryPtr(updatedComponentsArray, i, RenderBatch_1.renderTreeDiffStructLength);
        var componentId = RenderBatch_1.renderTreeDiff.componentId(diff);
        var editsArraySegment = RenderBatch_1.renderTreeDiff.edits(diff);
        var edits = RenderBatch_1.arraySegment.array(editsArraySegment);
        var editsOffset = RenderBatch_1.arraySegment.offset(editsArraySegment);
        var editsLength = RenderBatch_1.arraySegment.count(editsArraySegment);
        browserRenderer.updateComponent(componentId, edits, editsOffset, editsLength, referenceFrames);
    }
    var disposedComponentIds = RenderBatch_1.renderBatch.disposedComponentIds(batch);
    var disposedComponentIdsLength = RenderBatch_1.arrayRange.count(disposedComponentIds);
    var disposedComponentIdsArray = RenderBatch_1.arrayRange.array(disposedComponentIds);
    for (var i = 0; i < disposedComponentIdsLength; i++) {
        var componentIdPtr = Environment_1.platform.getArrayEntryPtr(disposedComponentIdsArray, i, 4);
        var componentId = Environment_1.platform.readInt32Field(componentIdPtr);
        browserRenderer.disposeComponent(componentId);
    }
}
exports.renderBatch = renderBatch;
function clearElement(element) {
    var childNode;
    while (childNode = element.firstChild) {
        element.removeChild(childNode);
    }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var registeredFunctionPrefix = 'Microsoft.AspNetCore.Blazor.Browser.Services.BrowserUriHelper';
var notifyLocationChangedMethod;
var hasRegisteredEventListeners = false;
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getLocationHref", function () { return Environment_1.platform.toDotNetString(location.href); });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getBaseURI", function () { return document.baseURI ? Environment_1.platform.toDotNetString(document.baseURI) : null; });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".enableNavigationInterception", function () {
    if (hasRegisteredEventListeners) {
        return;
    }
    hasRegisteredEventListeners = true;
    document.addEventListener('click', function (event) {
        // Intercept clicks on all <a> elements where the href is within the <base href> URI space
        var anchorTarget = findClosestAncestor(event.target, 'A');
        if (anchorTarget) {
            var href = anchorTarget.getAttribute('href');
            if (isWithinBaseUriSpace(toAbsoluteUri(href))) {
                event.preventDefault();
                performInternalNavigation(href);
            }
        }
    });
    window.addEventListener('popstate', handleInternalNavigation);
});
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".navigateTo", function (uriDotNetString) {
    navigateTo(Environment_1.platform.toJavaScriptString(uriDotNetString));
});
function navigateTo(uri) {
    if (isWithinBaseUriSpace(toAbsoluteUri(uri))) {
        performInternalNavigation(uri);
    }
    else {
        location.href = uri;
    }
}
exports.navigateTo = navigateTo;
function performInternalNavigation(href) {
    history.pushState(null, /* ignored title */ '', href);
    handleInternalNavigation();
}
function handleInternalNavigation() {
    if (!notifyLocationChangedMethod) {
        notifyLocationChangedMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Services', 'BrowserUriHelper', 'NotifyLocationChanged');
    }
    Environment_1.platform.callMethod(notifyLocationChangedMethod, null, [
        Environment_1.platform.toDotNetString(location.href)
    ]);
}
var testAnchor;
function toAbsoluteUri(relativeUri) {
    testAnchor = testAnchor || document.createElement('a');
    testAnchor.href = relativeUri;
    return testAnchor.href;
}
function findClosestAncestor(element, tagName) {
    return !element
        ? null
        : element.tagName === tagName
            ? element
            : findClosestAncestor(element.parentElement, tagName);
}
function isWithinBaseUriSpace(href) {
    var baseUriPrefixWithTrailingSlash = toBaseUriPrefixWithTrailingSlash(document.baseURI); // TODO: Might baseURI really be null?
    return href.startsWith(baseUriPrefixWithTrailingSlash);
}
function toBaseUriPrefixWithTrailingSlash(baseUri) {
    return baseUri.substr(0, baseUri.lastIndexOf('/') + 1);
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var DotNet_1 = __webpack_require__(2);
__webpack_require__(3);
__webpack_require__(13);
__webpack_require__(4);
__webpack_require__(14);
function boot() {
    return __awaiter(this, void 0, void 0, function () {
        var allScriptElems, thisScriptElem, isLinkerEnabled, entryPointDll, entryPointMethod, entryPointAssemblyName, referenceAssembliesCommaSeparated, referenceAssemblies, loadAssemblyUrls, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allScriptElems = document.getElementsByTagName('script');
                    thisScriptElem = (document.currentScript || allScriptElems[allScriptElems.length - 1]);
                    isLinkerEnabled = thisScriptElem.getAttribute('linker-enabled') === 'true';
                    entryPointDll = getRequiredBootScriptAttribute(thisScriptElem, 'main');
                    entryPointMethod = getRequiredBootScriptAttribute(thisScriptElem, 'entrypoint');
                    entryPointAssemblyName = DotNet_1.getAssemblyNameFromUrl(entryPointDll);
                    referenceAssembliesCommaSeparated = thisScriptElem.getAttribute('references') || '';
                    referenceAssemblies = referenceAssembliesCommaSeparated
                        .split(',')
                        .map(function (s) { return s.trim(); })
                        .filter(function (s) { return !!s; });
                    if (!isLinkerEnabled) {
                        console.info('Blazor is running in dev mode without IL stripping. To make the bundle size significantly smaller, publish the application or see https://go.microsoft.com/fwlink/?linkid=870414');
                    }
                    loadAssemblyUrls = [entryPointDll]
                        .concat(referenceAssemblies)
                        .map(function (filename) { return "_framework/_bin/" + filename; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Environment_1.platform.start(loadAssemblyUrls)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    throw new Error("Failed to start platform. Reason: " + ex_1);
                case 4:
                    // Start up the application
                    Environment_1.platform.callEntryPoint(entryPointAssemblyName, entryPointMethod, []);
                    return [2 /*return*/];
            }
        });
    });
}
function getRequiredBootScriptAttribute(elem, attributeName) {
    var result = elem.getAttribute(attributeName);
    if (!result) {
        throw new Error("Missing \"" + attributeName + "\" attribute on Blazor script tag.");
    }
    return result;
}
boot();


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DotNet_1 = __webpack_require__(2);
var RegisteredFunction_1 = __webpack_require__(1);
var assembly_load;
var find_class;
var find_method;
var invoke_method;
var mono_string_get_utf8;
var mono_string;
exports.monoPlatform = {
    start: function start(loadAssemblyUrls) {
        return new Promise(function (resolve, reject) {
            // mono.js assumes the existence of this
            window['Browser'] = {
                init: function () { },
                asyncLoad: asyncLoad
            };
            // Emscripten works by expecting the module config to be a global
            window['Module'] = createEmscriptenModuleInstance(loadAssemblyUrls, resolve, reject);
            addScriptTagsToDocument();
        });
    },
    findMethod: function findMethod(assemblyName, namespace, className, methodName) {
        // TODO: Cache the assembly_load outputs?
        var assemblyHandle = assembly_load(assemblyName);
        if (!assemblyHandle) {
            throw new Error("Could not find assembly \"" + assemblyName + "\"");
        }
        var typeHandle = find_class(assemblyHandle, namespace, className);
        if (!typeHandle) {
            throw new Error("Could not find type \"" + className + "\" in namespace \"" + namespace + "\" in assembly \"" + assemblyName + "\"");
        }
        var methodHandle = find_method(typeHandle, methodName, -1);
        if (!methodHandle) {
            throw new Error("Could not find method \"" + methodName + "\" on type \"" + namespace + "." + className + "\"");
        }
        return methodHandle;
    },
    callEntryPoint: function callEntryPoint(assemblyName, entrypointMethod, args) {
        // Parse the entrypointMethod, which is of the form MyApp.MyNamespace.MyTypeName::MyMethodName
        // Note that we don't support specifying a method overload, so it has to be unique
        var entrypointSegments = entrypointMethod.split('::');
        if (entrypointSegments.length != 2) {
            throw new Error('Malformed entry point method name; could not resolve class name and method name.');
        }
        var typeFullName = entrypointSegments[0];
        var methodName = entrypointSegments[1];
        var lastDot = typeFullName.lastIndexOf('.');
        var namespace = lastDot > -1 ? typeFullName.substring(0, lastDot) : '';
        var typeShortName = lastDot > -1 ? typeFullName.substring(lastDot + 1) : typeFullName;
        var entryPointMethodHandle = exports.monoPlatform.findMethod(assemblyName, namespace, typeShortName, methodName);
        exports.monoPlatform.callMethod(entryPointMethodHandle, null, args);
    },
    callMethod: function callMethod(method, target, args) {
        if (args.length > 4) {
            // Hopefully this restriction can be eased soon, but for now make it clear what's going on
            throw new Error("Currently, MonoPlatform supports passing a maximum of 4 arguments from JS to .NET. You tried to pass " + args.length + ".");
        }
        var stack = Module.stackSave();
        try {
            var argsBuffer = Module.stackAlloc(args.length);
            var exceptionFlagManagedInt = Module.stackAlloc(4);
            for (var i = 0; i < args.length; ++i) {
                Module.setValue(argsBuffer + i * 4, args[i], 'i32');
            }
            Module.setValue(exceptionFlagManagedInt, 0, 'i32');
            var res = invoke_method(method, target, argsBuffer, exceptionFlagManagedInt);
            if (Module.getValue(exceptionFlagManagedInt, 'i32') !== 0) {
                // If the exception flag is set, the returned value is exception.ToString()
                throw new Error(exports.monoPlatform.toJavaScriptString(res));
            }
            return res;
        }
        finally {
            Module.stackRestore(stack);
        }
    },
    toJavaScriptString: function toJavaScriptString(managedString) {
        // Comments from original Mono sample:
        //FIXME this is wastefull, we could remove the temp malloc by going the UTF16 route
        //FIXME this is unsafe, cuz raw objects could be GC'd.
        var utf8 = mono_string_get_utf8(managedString);
        var res = Module.UTF8ToString(utf8);
        Module._free(utf8);
        return res;
    },
    toDotNetString: function toDotNetString(jsString) {
        return mono_string(jsString);
    },
    getArrayLength: function getArrayLength(array) {
        return Module.getValue(getArrayDataPointer(array), 'i32');
    },
    getArrayEntryPtr: function getArrayEntryPtr(array, index, itemSize) {
        // First byte is array length, followed by entries
        var address = getArrayDataPointer(array) + 4 + index * itemSize;
        return address;
    },
    getObjectFieldsBaseAddress: function getObjectFieldsBaseAddress(referenceTypedObject) {
        // The first two int32 values are internal Mono data
        return (referenceTypedObject + 8);
    },
    readInt32Field: function readHeapInt32(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readObjectField: function readHeapObject(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readStringField: function readHeapObject(baseAddress, fieldOffset) {
        var fieldValue = Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
        return fieldValue === 0 ? null : exports.monoPlatform.toJavaScriptString(fieldValue);
    },
    readStructField: function readStructField(baseAddress, fieldOffset) {
        return (baseAddress + (fieldOffset || 0));
    },
};
// Bypass normal type checking to add this extra function. It's only intended to be called from
// the JS code in Mono's driver.c. It's never intended to be called from TypeScript.
exports.monoPlatform.monoGetRegisteredFunction = RegisteredFunction_1.getRegisteredFunction;
function addScriptTagsToDocument() {
    // Load either the wasm or asm.js version of the Mono runtime
    var browserSupportsNativeWebAssembly = typeof WebAssembly !== 'undefined' && WebAssembly.validate;
    var monoRuntimeUrlBase = '_framework/' + (browserSupportsNativeWebAssembly ? 'wasm' : 'asmjs');
    var monoRuntimeScriptUrl = monoRuntimeUrlBase + "/mono.js";
    if (!browserSupportsNativeWebAssembly) {
        // In the asmjs case, the initial memory structure is in a separate file we need to download
        var meminitXHR = Module['memoryInitializerRequest'] = new XMLHttpRequest();
        meminitXHR.open('GET', monoRuntimeUrlBase + "/mono.js.mem");
        meminitXHR.responseType = 'arraybuffer';
        meminitXHR.send(null);
    }
    document.write("<script defer src=\"" + monoRuntimeScriptUrl + "\"></script>");
}
function createEmscriptenModuleInstance(loadAssemblyUrls, onReady, onError) {
    var module = {};
    var wasmBinaryFile = '_framework/wasm/mono.wasm';
    var asmjsCodeFile = '_framework/asmjs/mono.asm.js';
    module.print = function (line) { return console.log("WASM: " + line); };
    module.printErr = function (line) { return console.error("WASM: " + line); };
    module.preRun = [];
    module.postRun = [];
    module.preloadPlugins = [];
    module.locateFile = function (fileName) {
        switch (fileName) {
            case 'mono.wasm': return wasmBinaryFile;
            case 'mono.asm.js': return asmjsCodeFile;
            default: return fileName;
        }
    };
    module.preRun.push(function () {
        // By now, emscripten should be initialised enough that we can capture these methods for later use
        assembly_load = Module.cwrap('mono_wasm_assembly_load', 'number', ['string']);
        find_class = Module.cwrap('mono_wasm_assembly_find_class', 'number', ['number', 'string', 'string']);
        find_method = Module.cwrap('mono_wasm_assembly_find_method', 'number', ['number', 'string', 'number']);
        invoke_method = Module.cwrap('mono_wasm_invoke_method', 'number', ['number', 'number', 'number']);
        mono_string_get_utf8 = Module.cwrap('mono_wasm_string_get_utf8', 'number', ['number']);
        mono_string = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']);
        Module.FS_createPath('/', 'appBinDir', true, true);
        loadAssemblyUrls.forEach(function (url) {
            return FS.createPreloadedFile('appBinDir', DotNet_1.getAssemblyNameFromUrl(url) + ".dll", url, true, false, undefined, onError);
        });
    });
    module.postRun.push(function () {
        var load_runtime = Module.cwrap('mono_wasm_load_runtime', null, ['string']);
        load_runtime('appBinDir');
        onReady();
    });
    return module;
}
function asyncLoad(url, onload, onerror) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', url, /* async: */ true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
        if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
            var asm = new Uint8Array(xhr.response);
            onload(asm);
        }
        else {
            onerror(xhr);
        }
    };
    xhr.onerror = onerror;
    xhr.send(null);
}
function getArrayDataPointer(array) {
    return array + 12; // First byte from here is length, then following bytes are entries
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InvokeWithJsonMarshalling_1 = __webpack_require__(8);
var Renderer_1 = __webpack_require__(3);
/**
 * The definitive list of internal functions invokable from .NET code.
 * These function names are treated as 'reserved' and cannot be passed to registerFunction.
 */
exports.internalRegisteredFunctions = {
    attachComponentToElement: Renderer_1.attachComponentToElement,
    invokeWithJsonMarshalling: InvokeWithJsonMarshalling_1.invokeWithJsonMarshalling,
    renderBatch: Renderer_1.renderBatch,
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
function invokeWithJsonMarshalling(identifier) {
    var argsJson = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argsJson[_i - 1] = arguments[_i];
    }
    var identifierJsString = Environment_1.platform.toJavaScriptString(identifier);
    var funcInstance = RegisteredFunction_1.getRegisteredFunction(identifierJsString);
    var args = argsJson.map(function (json) { return JSON.parse(Environment_1.platform.toJavaScriptString(json)); });
    var result = funcInstance.apply(null, args);
    if (result !== null && result !== undefined) {
        var resultJson = JSON.stringify(result);
        return Environment_1.platform.toDotNetString(resultJson);
    }
    else {
        return null;
    }
}
exports.invokeWithJsonMarshalling = invokeWithJsonMarshalling;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
// Keep in sync with the structs in .NET code
exports.renderBatch = {
    updatedComponents: function (obj) { return Environment_1.platform.readStructField(obj, 0); },
    referenceFrames: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength); },
    disposedComponentIds: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength + arrayRangeStructLength); },
};
var arrayRangeStructLength = 8;
exports.arrayRange = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
};
var arraySegmentStructLength = 12;
exports.arraySegment = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    offset: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 8); },
};
exports.renderTreeDiffStructLength = 4 + arraySegmentStructLength;
exports.renderTreeDiff = {
    componentId: function (obj) { return Environment_1.platform.readInt32Field(obj, 0); },
    edits: function (obj) { return Environment_1.platform.readStructField(obj, 4); },
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RenderTreeEdit_1 = __webpack_require__(11);
var RenderTreeFrame_1 = __webpack_require__(12);
var Environment_1 = __webpack_require__(0);
var selectValuePropname = '_blazorSelectValue';
var raiseEventMethod;
var renderComponentMethod;
var BrowserRenderer = /** @class */ (function () {
    function BrowserRenderer(browserRendererId) {
        this.browserRendererId = browserRendererId;
        this.childComponentLocations = {};
    }
    BrowserRenderer.prototype.attachComponentToElement = function (componentId, element) {
        this.childComponentLocations[componentId] = element;
    };
    BrowserRenderer.prototype.updateComponent = function (componentId, edits, editsOffset, editsLength, referenceFrames) {
        var element = this.childComponentLocations[componentId];
        if (!element) {
            throw new Error("No element is currently associated with component " + componentId);
        }
        this.applyEdits(componentId, element, 0, edits, editsOffset, editsLength, referenceFrames);
    };
    BrowserRenderer.prototype.disposeComponent = function (componentId) {
        delete this.childComponentLocations[componentId];
    };
    BrowserRenderer.prototype.applyEdits = function (componentId, parent, childIndex, edits, editsOffset, editsLength, referenceFrames) {
        var currentDepth = 0;
        var childIndexAtCurrentDepth = childIndex;
        var maxEditIndexExcl = editsOffset + editsLength;
        for (var editIndex = editsOffset; editIndex < maxEditIndexExcl; editIndex++) {
            var edit = RenderTreeEdit_1.getRenderTreeEditPtr(edits, editIndex);
            var editType = RenderTreeEdit_1.renderTreeEdit.type(edit);
            switch (editType) {
                case RenderTreeEdit_1.EditType.prependFrame: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    this.insertFrame(componentId, parent, childIndexAtCurrentDepth + siblingIndex, referenceFrames, frame, frameIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.removeFrame: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    removeNodeFromDOM(parent, childIndexAtCurrentDepth + siblingIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.setAttribute: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var element = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    this.applyAttribute(componentId, element, frame);
                    break;
                }
                case RenderTreeEdit_1.EditType.removeAttribute: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    removeAttributeFromDOM(parent, childIndexAtCurrentDepth + siblingIndex, RenderTreeEdit_1.renderTreeEdit.removedAttributeName(edit));
                    break;
                }
                case RenderTreeEdit_1.EditType.updateText: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var domTextNode = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    domTextNode.textContent = RenderTreeFrame_1.renderTreeFrame.textContent(frame);
                    break;
                }
                case RenderTreeEdit_1.EditType.stepIn: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    parent = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    currentDepth++;
                    childIndexAtCurrentDepth = 0;
                    break;
                }
                case RenderTreeEdit_1.EditType.stepOut: {
                    parent = parent.parentElement;
                    currentDepth--;
                    childIndexAtCurrentDepth = currentDepth === 0 ? childIndex : 0; // The childIndex is only ever nonzero at zero depth
                    break;
                }
                default: {
                    var unknownType = editType; // Compile-time verification that the switch was exhaustive
                    throw new Error("Unknown edit type: " + unknownType);
                }
            }
        }
    };
    BrowserRenderer.prototype.insertFrame = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var frameType = RenderTreeFrame_1.renderTreeFrame.frameType(frame);
        switch (frameType) {
            case RenderTreeFrame_1.FrameType.element:
                this.insertElement(componentId, parent, childIndex, frames, frame, frameIndex);
                return 1;
            case RenderTreeFrame_1.FrameType.text:
                this.insertText(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.attribute:
                throw new Error('Attribute frames should only be present as leading children of element frames.');
            case RenderTreeFrame_1.FrameType.component:
                this.insertComponent(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.region:
                return this.insertFrameRange(componentId, parent, childIndex, frames, frameIndex + 1, frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame));
            default:
                var unknownType = frameType; // Compile-time verification that the switch was exhaustive
                throw new Error("Unknown frame type: " + unknownType);
        }
    };
    BrowserRenderer.prototype.insertElement = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var tagName = RenderTreeFrame_1.renderTreeFrame.elementName(frame);
        var newDomElement = document.createElement(tagName);
        insertNodeIntoDOM(newDomElement, parent, childIndex);
        // Apply attributes
        var descendantsEndIndexExcl = frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame);
        for (var descendantIndex = frameIndex + 1; descendantIndex < descendantsEndIndexExcl; descendantIndex++) {
            var descendantFrame = RenderTreeFrame_1.getTreeFramePtr(frames, descendantIndex);
            if (RenderTreeFrame_1.renderTreeFrame.frameType(descendantFrame) === RenderTreeFrame_1.FrameType.attribute) {
                this.applyAttribute(componentId, newDomElement, descendantFrame);
            }
            else {
                // As soon as we see a non-attribute child, all the subsequent child frames are
                // not attributes, so bail out and insert the remnants recursively
                this.insertFrameRange(componentId, newDomElement, 0, frames, descendantIndex, descendantsEndIndexExcl);
                break;
            }
        }
    };
    BrowserRenderer.prototype.insertComponent = function (parent, childIndex, frame) {
        // Currently, to support O(1) lookups from render tree frames to DOM nodes, we rely on
        // each child component existing as a single top-level element in the DOM. To guarantee
        // that, we wrap child components in these 'blazor-component' wrappers.
        // To improve on this in the future:
        // - If we can statically detect that a given component always produces a single top-level
        //   element anyway, then don't wrap it in a further nonstandard element
        // - If we really want to support child components producing multiple top-level frames and
        //   not being wrapped in a container at all, then every time a component is refreshed in
        //   the DOM, we could update an array on the parent element that specifies how many DOM
        //   nodes correspond to each of its render tree frames. Then when that parent wants to
        //   locate the first DOM node for a render tree frame, it can sum all the frame counts for
        //   all the preceding render trees frames. It's O(N), but where N is the number of siblings
        //   (counting child components as a single item), so N will rarely if ever be large.
        //   We could even keep track of whether all the child components happen to have exactly 1
        //   top level frames, and in that case, there's no need to sum as we can do direct lookups.
        var containerElement = document.createElement('blazor-component');
        insertNodeIntoDOM(containerElement, parent, childIndex);
        // All we have to do is associate the child component ID with its location. We don't actually
        // do any rendering here, because the diff for the child will appear later in the render batch.
        var childComponentId = RenderTreeFrame_1.renderTreeFrame.componentId(frame);
        this.attachComponentToElement(childComponentId, containerElement);
    };
    BrowserRenderer.prototype.insertText = function (parent, childIndex, textFrame) {
        var textContent = RenderTreeFrame_1.renderTreeFrame.textContent(textFrame);
        var newDomTextNode = document.createTextNode(textContent);
        insertNodeIntoDOM(newDomTextNode, parent, childIndex);
    };
    BrowserRenderer.prototype.applyAttribute = function (componentId, toDomElement, attributeFrame) {
        var attributeName = RenderTreeFrame_1.renderTreeFrame.attributeName(attributeFrame);
        var browserRendererId = this.browserRendererId;
        var eventHandlerId = RenderTreeFrame_1.renderTreeFrame.attributeEventHandlerId(attributeFrame);
        if (attributeName === 'value') {
            if (this.tryApplyValueProperty(toDomElement, RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame))) {
                return; // If this DOM element type has special 'value' handling, don't also write it as an attribute
            }
        }
        // TODO: Instead of applying separate event listeners to each DOM element, use event delegation
        // and remove all the _blazor*Listener hacks
        switch (attributeName) {
            case 'onclick': {
                toDomElement.removeEventListener('click', toDomElement['_blazorClickListener']);
                var listener = function (evt) { return raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'mouse', { Type: 'click' }); };
                toDomElement['_blazorClickListener'] = listener;
                toDomElement.addEventListener('click', listener);
                break;
            }
            case 'onchange': {
                toDomElement.removeEventListener('change', toDomElement['_blazorChangeListener']);
                var targetIsCheckbox_1 = isCheckbox(toDomElement);
                var listener = function (evt) {
                    var newValue = targetIsCheckbox_1 ? evt.target.checked : evt.target.value;
                    raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'change', { Type: 'change', Value: newValue });
                };
                toDomElement['_blazorChangeListener'] = listener;
                toDomElement.addEventListener('change', listener);
                break;
            }
            case 'onkeypress': {
                toDomElement.removeEventListener('keypress', toDomElement['_blazorKeypressListener']);
                var listener = function (evt) {
                    // This does not account for special keys nor cross-browser differences. So far it's
                    // just to establish that we can pass parameters when raising events.
                    // We use C#-style PascalCase on the eventInfo to simplify deserialization, but this could
                    // change if we introduced a richer JSON library on the .NET side.
                    raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'keyboard', { Type: evt.type, Key: evt.key });
                };
                toDomElement['_blazorKeypressListener'] = listener;
                toDomElement.addEventListener('keypress', listener);
                break;
            }
            default:
                // Treat as a regular string-valued attribute
                toDomElement.setAttribute(attributeName, RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame));
                break;
        }
    };
    BrowserRenderer.prototype.tryApplyValueProperty = function (element, value) {
        // Certain elements have built-in behaviour for their 'value' property
        switch (element.tagName) {
            case 'INPUT':
            case 'SELECT':
                if (isCheckbox(element)) {
                    element.checked = value === 'True';
                }
                else {
                    element.value = value;
                    if (element.tagName === 'SELECT') {
                        // <select> is special, in that anything we write to .value will be lost if there
                        // isn't yet a matching <option>. To maintain the expected behavior no matter the
                        // element insertion/update order, preserve the desired value separately so
                        // we can recover it when inserting any matching <option>.
                        element[selectValuePropname] = value;
                    }
                }
                return true;
            case 'OPTION':
                element.setAttribute('value', value);
                // See above for why we have this special handling for <select>/<option>
                var parentElement = element.parentElement;
                if (parentElement && (selectValuePropname in parentElement) && parentElement[selectValuePropname] === value) {
                    this.tryApplyValueProperty(parentElement, value);
                    delete parentElement[selectValuePropname];
                }
                return true;
            default:
                return false;
        }
    };
    BrowserRenderer.prototype.insertFrameRange = function (componentId, parent, childIndex, frames, startIndex, endIndexExcl) {
        var origChildIndex = childIndex;
        for (var index = startIndex; index < endIndexExcl; index++) {
            var frame = RenderTreeFrame_1.getTreeFramePtr(frames, index);
            var numChildrenInserted = this.insertFrame(componentId, parent, childIndex, frames, frame, index);
            childIndex += numChildrenInserted;
            // Skip over any descendants, since they are already dealt with recursively
            var subtreeLength = RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame);
            if (subtreeLength > 1) {
                index += subtreeLength - 1;
            }
        }
        return (childIndex - origChildIndex); // Total number of children inserted
    };
    return BrowserRenderer;
}());
exports.BrowserRenderer = BrowserRenderer;
function isCheckbox(element) {
    return element.tagName === 'INPUT' && element.getAttribute('type') === 'checkbox';
}
function insertNodeIntoDOM(node, parent, childIndex) {
    if (childIndex >= parent.childNodes.length) {
        parent.appendChild(node);
    }
    else {
        parent.insertBefore(node, parent.childNodes[childIndex]);
    }
}
function removeNodeFromDOM(parent, childIndex) {
    parent.removeChild(parent.childNodes[childIndex]);
}
function removeAttributeFromDOM(parent, childIndex, attributeName) {
    var element = parent.childNodes[childIndex];
    element.removeAttribute(attributeName);
}
function raiseEvent(event, browserRendererId, componentId, eventHandlerId, eventInfoType, eventInfo) {
    event.preventDefault();
    if (!raiseEventMethod) {
        raiseEventMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Rendering', 'BrowserRendererEventDispatcher', 'DispatchEvent');
    }
    var eventDescriptor = {
        BrowserRendererId: browserRendererId,
        ComponentId: componentId,
        EventHandlerId: eventHandlerId,
        EventArgsType: eventInfoType
    };
    Environment_1.platform.callMethod(raiseEventMethod, null, [
        Environment_1.platform.toDotNetString(JSON.stringify(eventDescriptor)),
        Environment_1.platform.toDotNetString(JSON.stringify(eventInfo))
    ]);
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeEditStructLength = 16;
function getRenderTreeEditPtr(renderTreeEdits, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEdits, index, renderTreeEditStructLength);
}
exports.getRenderTreeEditPtr = getRenderTreeEditPtr;
exports.renderTreeEdit = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeEdit.cs
    type: function (edit) { return Environment_1.platform.readInt32Field(edit, 0); },
    siblingIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 4); },
    newTreeIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 8); },
    removedAttributeName: function (edit) { return Environment_1.platform.readStringField(edit, 12); },
};
var EditType;
(function (EditType) {
    EditType[EditType["prependFrame"] = 1] = "prependFrame";
    EditType[EditType["removeFrame"] = 2] = "removeFrame";
    EditType[EditType["setAttribute"] = 3] = "setAttribute";
    EditType[EditType["removeAttribute"] = 4] = "removeAttribute";
    EditType[EditType["updateText"] = 5] = "updateText";
    EditType[EditType["stepIn"] = 6] = "stepIn";
    EditType[EditType["stepOut"] = 7] = "stepOut";
})(EditType = exports.EditType || (exports.EditType = {}));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeFrameStructLength = 28;
// To minimise GC pressure, instead of instantiating a JS object to represent each tree frame,
// we work in terms of pointers to the structs on the .NET heap, and use static functions that
// know how to read property values from those structs.
function getTreeFramePtr(renderTreeEntries, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEntries, index, renderTreeFrameStructLength);
}
exports.getTreeFramePtr = getTreeFramePtr;
exports.renderTreeFrame = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeFrame.cs
    frameType: function (frame) { return Environment_1.platform.readInt32Field(frame, 4); },
    subtreeLength: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
    componentId: function (frame) { return Environment_1.platform.readInt32Field(frame, 12); },
    elementName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    textContent: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeValue: function (frame) { return Environment_1.platform.readStringField(frame, 24); },
    attributeEventHandlerId: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
};
var FrameType;
(function (FrameType) {
    // The values must be kept in sync with the .NET equivalent in RenderTreeFrameType.cs
    FrameType[FrameType["element"] = 1] = "element";
    FrameType[FrameType["text"] = 2] = "text";
    FrameType[FrameType["attribute"] = 3] = "attribute";
    FrameType[FrameType["component"] = 4] = "component";
    FrameType[FrameType["region"] = 5] = "region";
})(FrameType = exports.FrameType || (exports.FrameType = {}));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var httpClientAssembly = 'Microsoft.AspNetCore.Blazor.Browser';
var httpClientNamespace = httpClientAssembly + ".Http";
var httpClientTypeName = 'BrowserHttpMessageHandler';
var httpClientFullTypeName = httpClientNamespace + "." + httpClientTypeName;
var receiveResponseMethod;
RegisteredFunction_1.registerFunction(httpClientFullTypeName + ".Send", function (id, method, requestUri, body, headersJson) {
    sendAsync(id, method, requestUri, body, headersJson);
});
function sendAsync(id, method, requestUri, body, headersJson) {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseText, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(requestUri, {
                            method: method,
                            body: body || undefined,
                            headers: headersJson ? JSON.parse(headersJson) : undefined
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    responseText = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    dispatchErrorResponse(id, ex_1.toString());
                    return [2 /*return*/];
                case 4:
                    dispatchSuccessResponse(id, response, responseText);
                    return [2 /*return*/];
            }
        });
    });
}
function dispatchSuccessResponse(id, response, responseText) {
    var responseDescriptor = {
        StatusCode: response.status,
        Headers: []
    };
    response.headers.forEach(function (value, name) {
        responseDescriptor.Headers.push([name, value]);
    });
    dispatchResponse(id, Environment_1.platform.toDotNetString(JSON.stringify(responseDescriptor)), Environment_1.platform.toDotNetString(responseText), // TODO: Consider how to handle non-string responses
    /* errorMessage */ null);
}
function dispatchErrorResponse(id, errorMessage) {
    dispatchResponse(id, 
    /* responseDescriptor */ null, 
    /* responseText */ null, Environment_1.platform.toDotNetString(errorMessage));
}
function dispatchResponse(id, responseDescriptor, responseText, errorMessage) {
    if (!receiveResponseMethod) {
        receiveResponseMethod = Environment_1.platform.findMethod(httpClientAssembly, httpClientNamespace, httpClientTypeName, 'ReceiveResponse');
    }
    Environment_1.platform.callMethod(receiveResponseMethod, null, [
        Environment_1.platform.toDotNetString(id.toString()),
        responseDescriptor,
        responseText,
        errorMessage,
    ]);
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
var UriHelper_1 = __webpack_require__(4);
if (typeof window !== 'undefined') {
    // When the library is loaded in a browser via a <script> element, make the
    // following APIs available in global scope for invocation from JS
    window['Blazor'] = {
        platform: Environment_1.platform,
        registerFunction: RegisteredFunction_1.registerFunction,
        navigateTo: UriHelper_1.navigateTo,
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWZjYWVmNzA4OThmNzhmZWVhZTYiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Vudmlyb25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUGxhdGZvcm0vRG90TmV0LnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NlcnZpY2VzL1VyaUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQm9vdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUGxhdGZvcm0vTW9uby9Nb25vUGxhdGZvcm0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ludGVyb3AvSW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ludGVyb3AvSW52b2tlV2l0aEpzb25NYXJzaGFsbGluZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL1JlbmRlckJhdGNoLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvQnJvd3NlclJlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUVkaXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9SZW5kZXJUcmVlRnJhbWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NlcnZpY2VzL0h0dHAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dsb2JhbEV4cG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QztBQUNKLENBQUM7QUFFRCwrQkFBK0IsRUFBVSxFQUFFLFlBQW9CO0lBQzdELGdCQUFnQixDQUNkLEVBQUU7SUFDRix3QkFBd0IsQ0FBQyxJQUFJO0lBQzdCLGtCQUFrQixDQUFDLElBQUksRUFDdkIsc0JBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQ3RDLENBQUM7QUFDSixDQUFDO0FBRUQsMEJBQTBCLEVBQVUsRUFBRSxrQkFBd0MsRUFBRSxZQUFrQyxFQUFFLFlBQWtDO0lBQ3BKLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQzNCLHFCQUFxQixHQUFHLHNCQUFRLENBQUMsVUFBVSxDQUN6QyxrQkFBa0IsRUFDbEIsbUJBQW1CLEVBQ25CLGtCQUFrQixFQUNsQixpQkFBaUIsQ0FDbEIsQ0FBQztJQUNKLENBQUM7SUFFRCxzQkFBUSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUU7UUFDL0Msc0JBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLGtCQUFrQjtRQUNsQixZQUFZO1FBQ1osWUFBWTtLQUNiLENBQUMsQ0FBQztBQUNMLENBQUM7Ozs7Ozs7Ozs7QUN6RUQsMkNBQXdDO0FBQ3hDLGtEQUFnRTtBQUNoRSx5Q0FBa0Q7QUFFbEQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsQywyRUFBMkU7SUFDM0Usa0VBQWtFO0lBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRztRQUNqQixRQUFRO1FBQ1IsZ0JBQWdCO1FBQ2hCLFVBQVU7S0FDWCxDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJibGF6b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1ZmNhZWY3MDg5OGY3OGZlZWFlNiIsIi8vIEV4cG9zZSBhbiBleHBvcnQgY2FsbGVkICdwbGF0Zm9ybScgb2YgdGhlIGludGVyZmFjZSB0eXBlICdQbGF0Zm9ybScsXHJcbi8vIHNvIHRoYXQgY29uc3VtZXJzIGNhbiBiZSBhZ25vc3RpYyBhYm91dCB3aGljaCBpbXBsZW1lbnRhdGlvbiB0aGV5IHVzZS5cclxuLy8gQmFzaWMgYWx0ZXJuYXRpdmUgdG8gaGF2aW5nIGFuIGFjdHVhbCBESSBjb250YWluZXIuXHJcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IG1vbm9QbGF0Zm9ybSB9IGZyb20gJy4vUGxhdGZvcm0vTW9uby9Nb25vUGxhdGZvcm0nO1xyXG5leHBvcnQgY29uc3QgcGxhdGZvcm06IFBsYXRmb3JtID0gbW9ub1BsYXRmb3JtO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvRW52aXJvbm1lbnQudHMiLCJpbXBvcnQgeyBpbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbnMgfSBmcm9tICcuL0ludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IHJlZ2lzdGVyZWRGdW5jdGlvbnM6IHsgW2lkZW50aWZpZXI6IHN0cmluZ106IEZ1bmN0aW9uIHwgdW5kZWZpbmVkIH0gPSB7fTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckZ1bmN0aW9uKGlkZW50aWZpZXI6IHN0cmluZywgaW1wbGVtZW50YXRpb246IEZ1bmN0aW9uKSB7XHJcbiAgaWYgKGludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9ucy5oYXNPd25Qcm9wZXJ0eShpZGVudGlmaWVyKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gaWRlbnRpZmllciAnJHtpZGVudGlmaWVyfScgaXMgcmVzZXJ2ZWQgYW5kIGNhbm5vdCBiZSByZWdpc3RlcmVkLmApO1xyXG4gIH1cclxuXHJcbiAgaWYgKHJlZ2lzdGVyZWRGdW5jdGlvbnMuaGFzT3duUHJvcGVydHkoaWRlbnRpZmllcikpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQSBmdW5jdGlvbiB3aXRoIHRoZSBpZGVudGlmaWVyICcke2lkZW50aWZpZXJ9JyBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuYCk7XHJcbiAgfVxyXG5cclxuICByZWdpc3RlcmVkRnVuY3Rpb25zW2lkZW50aWZpZXJdID0gaW1wbGVtZW50YXRpb247XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWdpc3RlcmVkRnVuY3Rpb24oaWRlbnRpZmllcjogc3RyaW5nKTogRnVuY3Rpb24ge1xyXG4gIC8vIEJ5IHByaW9yaXRpc2luZyB0aGUgaW50ZXJuYWwgb25lcywgd2UgZW5zdXJlIHlvdSBjYW4ndCBvdmVycmlkZSB0aGVtXHJcbiAgY29uc3QgcmVzdWx0ID0gaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zW2lkZW50aWZpZXJdIHx8IHJlZ2lzdGVyZWRGdW5jdGlvbnNbaWRlbnRpZmllcl07XHJcbiAgaWYgKHJlc3VsdCkge1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCByZWdpc3RlcmVkIGZ1bmN0aW9uIHdpdGggbmFtZSAnJHtpZGVudGlmaWVyfScuYCk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbi50cyIsImV4cG9ydCBmdW5jdGlvbiBnZXRBc3NlbWJseU5hbWVGcm9tVXJsKHVybDogc3RyaW5nKSB7XHJcbiAgY29uc3QgbGFzdFNlZ21lbnQgPSB1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZignLycpICsgMSk7XHJcbiAgY29uc3QgcXVlcnlTdHJpbmdTdGFydFBvcyA9IGxhc3RTZWdtZW50LmluZGV4T2YoJz8nKTtcclxuICBjb25zdCBmaWxlbmFtZSA9IHF1ZXJ5U3RyaW5nU3RhcnRQb3MgPCAwID8gbGFzdFNlZ21lbnQgOiBsYXN0U2VnbWVudC5zdWJzdHJpbmcoMCwgcXVlcnlTdHJpbmdTdGFydFBvcyk7XHJcbiAgcmV0dXJuIGZpbGVuYW1lLnJlcGxhY2UoL1xcLmRsbCQvLCAnJyk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1BsYXRmb3JtL0RvdE5ldC50cyIsImltcG9ydCB7IFN5c3RlbV9PYmplY3QsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlLCBQb2ludGVyIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgcmVuZGVyQmF0Y2ggYXMgcmVuZGVyQmF0Y2hTdHJ1Y3QsIGFycmF5UmFuZ2UsIGFycmF5U2VnbWVudCwgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGgsIHJlbmRlclRyZWVEaWZmLCBSZW5kZXJCYXRjaFBvaW50ZXIsIFJlbmRlclRyZWVEaWZmUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyQmF0Y2gnO1xyXG5pbXBvcnQgeyBCcm93c2VyUmVuZGVyZXIgfSBmcm9tICcuL0Jyb3dzZXJSZW5kZXJlcic7XHJcblxyXG50eXBlIEJyb3dzZXJSZW5kZXJlclJlZ2lzdHJ5ID0geyBbYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcl06IEJyb3dzZXJSZW5kZXJlciB9O1xyXG5jb25zdCBicm93c2VyUmVuZGVyZXJzOiBCcm93c2VyUmVuZGVyZXJSZWdpc3RyeSA9IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudChicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyLCBlbGVtZW50U2VsZWN0b3I6IFN5c3RlbV9TdHJpbmcsIGNvbXBvbmVudElkOiBudW1iZXIpIHtcclxuICBjb25zdCBlbGVtZW50U2VsZWN0b3JKcyA9IHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhlbGVtZW50U2VsZWN0b3IpO1xyXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnRTZWxlY3RvckpzKTtcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYW55IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IgJyR7ZWxlbWVudFNlbGVjdG9ySnN9Jy5gKTtcclxuICB9XHJcblxyXG4gIGxldCBicm93c2VyUmVuZGVyZXIgPSBicm93c2VyUmVuZGVyZXJzW2Jyb3dzZXJSZW5kZXJlcklkXTtcclxuICBpZiAoIWJyb3dzZXJSZW5kZXJlcikge1xyXG4gICAgYnJvd3NlclJlbmRlcmVyID0gYnJvd3NlclJlbmRlcmVyc1ticm93c2VyUmVuZGVyZXJJZF0gPSBuZXcgQnJvd3NlclJlbmRlcmVyKGJyb3dzZXJSZW5kZXJlcklkKTtcclxuICB9XHJcbiAgYnJvd3NlclJlbmRlcmVyLmF0dGFjaENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZCwgZWxlbWVudCk7XHJcbiAgY2xlYXJFbGVtZW50KGVsZW1lbnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQmF0Y2goYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgYmF0Y2g6IFJlbmRlckJhdGNoUG9pbnRlcikge1xyXG4gIGNvbnN0IGJyb3dzZXJSZW5kZXJlciA9IGJyb3dzZXJSZW5kZXJlcnNbYnJvd3NlclJlbmRlcmVySWRdO1xyXG4gIGlmICghYnJvd3NlclJlbmRlcmVyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIGJyb3dzZXIgcmVuZGVyZXIgd2l0aCBJRCAke2Jyb3dzZXJSZW5kZXJlcklkfS5gKTtcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHMgPSByZW5kZXJCYXRjaFN0cnVjdC51cGRhdGVkQ29tcG9uZW50cyhiYXRjaCk7XHJcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHNMZW5ndGggPSBhcnJheVJhbmdlLmNvdW50KHVwZGF0ZWRDb21wb25lbnRzKTtcclxuICBjb25zdCB1cGRhdGVkQ29tcG9uZW50c0FycmF5ID0gYXJyYXlSYW5nZS5hcnJheSh1cGRhdGVkQ29tcG9uZW50cyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlRnJhbWVzU3RydWN0ID0gcmVuZGVyQmF0Y2hTdHJ1Y3QucmVmZXJlbmNlRnJhbWVzKGJhdGNoKTtcclxuICBjb25zdCByZWZlcmVuY2VGcmFtZXMgPSBhcnJheVJhbmdlLmFycmF5KHJlZmVyZW5jZUZyYW1lc1N0cnVjdCk7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlZENvbXBvbmVudHNMZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgZGlmZiA9IHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIodXBkYXRlZENvbXBvbmVudHNBcnJheSwgaSwgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGgpO1xyXG4gICAgY29uc3QgY29tcG9uZW50SWQgPSByZW5kZXJUcmVlRGlmZi5jb21wb25lbnRJZChkaWZmKTtcclxuXHJcbiAgICBjb25zdCBlZGl0c0FycmF5U2VnbWVudCA9IHJlbmRlclRyZWVEaWZmLmVkaXRzKGRpZmYpO1xyXG4gICAgY29uc3QgZWRpdHMgPSBhcnJheVNlZ21lbnQuYXJyYXkoZWRpdHNBcnJheVNlZ21lbnQpO1xyXG4gICAgY29uc3QgZWRpdHNPZmZzZXQgPSBhcnJheVNlZ21lbnQub2Zmc2V0KGVkaXRzQXJyYXlTZWdtZW50KTtcclxuICAgIGNvbnN0IGVkaXRzTGVuZ3RoID0gYXJyYXlTZWdtZW50LmNvdW50KGVkaXRzQXJyYXlTZWdtZW50KTtcclxuXHJcbiAgICBicm93c2VyUmVuZGVyZXIudXBkYXRlQ29tcG9uZW50KGNvbXBvbmVudElkLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHMgPSByZW5kZXJCYXRjaFN0cnVjdC5kaXNwb3NlZENvbXBvbmVudElkcyhiYXRjaCk7XHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHNMZW5ndGggPSBhcnJheVJhbmdlLmNvdW50KGRpc3Bvc2VkQ29tcG9uZW50SWRzKTtcclxuICBjb25zdCBkaXNwb3NlZENvbXBvbmVudElkc0FycmF5ID0gYXJyYXlSYW5nZS5hcnJheShkaXNwb3NlZENvbXBvbmVudElkcyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwb3NlZENvbXBvbmVudElkc0xlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZFB0ciA9IHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIoZGlzcG9zZWRDb21wb25lbnRJZHNBcnJheSwgaSwgNCk7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGNvbXBvbmVudElkUHRyKTtcclxuICAgIGJyb3dzZXJSZW5kZXJlci5kaXNwb3NlQ29tcG9uZW50KGNvbXBvbmVudElkKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyRWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgbGV0IGNoaWxkTm9kZTogTm9kZSB8IG51bGw7XHJcbiAgd2hpbGUgKGNoaWxkTm9kZSA9IGVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL1JlbmRlcmVyLnRzIiwiaW1wb3J0IHsgcmVnaXN0ZXJGdW5jdGlvbiB9IGZyb20gJy4uL0ludGVyb3AvUmVnaXN0ZXJlZEZ1bmN0aW9uJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IE1ldGhvZEhhbmRsZSwgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuY29uc3QgcmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4ID0gJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLlNlcnZpY2VzLkJyb3dzZXJVcmlIZWxwZXInO1xyXG5sZXQgbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kOiBNZXRob2RIYW5kbGU7XHJcbmxldCBoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5nZXRMb2NhdGlvbkhyZWZgLFxyXG4gICgpID0+IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGxvY2F0aW9uLmhyZWYpKTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5nZXRCYXNlVVJJYCxcclxuICAoKSA9PiBkb2N1bWVudC5iYXNlVVJJID8gcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoZG9jdW1lbnQuYmFzZVVSSSkgOiBudWxsKTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5lbmFibGVOYXZpZ2F0aW9uSW50ZXJjZXB0aW9uYCwgKCkgPT4ge1xyXG4gIGlmIChoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaGFzUmVnaXN0ZXJlZEV2ZW50TGlzdGVuZXJzID0gdHJ1ZTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAvLyBJbnRlcmNlcHQgY2xpY2tzIG9uIGFsbCA8YT4gZWxlbWVudHMgd2hlcmUgdGhlIGhyZWYgaXMgd2l0aGluIHRoZSA8YmFzZSBocmVmPiBVUkkgc3BhY2VcclxuICAgIGNvbnN0IGFuY2hvclRhcmdldCA9IGZpbmRDbG9zZXN0QW5jZXN0b3IoZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQgfCBudWxsLCAnQScpO1xyXG4gICAgaWYgKGFuY2hvclRhcmdldCkge1xyXG4gICAgICBjb25zdCBocmVmID0gYW5jaG9yVGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgICBpZiAoaXNXaXRoaW5CYXNlVXJpU3BhY2UodG9BYnNvbHV0ZVVyaShocmVmKSkpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHBlcmZvcm1JbnRlcm5hbE5hdmlnYXRpb24oaHJlZik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlSW50ZXJuYWxOYXZpZ2F0aW9uKTtcclxufSk7XHJcblxyXG5yZWdpc3RlckZ1bmN0aW9uKGAke3JlZ2lzdGVyZWRGdW5jdGlvblByZWZpeH0ubmF2aWdhdGVUb2AsICh1cmlEb3ROZXRTdHJpbmc6IFN5c3RlbV9TdHJpbmcpID0+IHtcclxuICBuYXZpZ2F0ZVRvKHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyh1cmlEb3ROZXRTdHJpbmcpKTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGVUbyh1cmk6IHN0cmluZykge1xyXG4gIGlmIChpc1dpdGhpbkJhc2VVcmlTcGFjZSh0b0Fic29sdXRlVXJpKHVyaSkpKSB7XHJcbiAgICBwZXJmb3JtSW50ZXJuYWxOYXZpZ2F0aW9uKHVyaSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxvY2F0aW9uLmhyZWYgPSB1cmk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwZXJmb3JtSW50ZXJuYWxOYXZpZ2F0aW9uKGhyZWY6IHN0cmluZykge1xyXG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIC8qIGlnbm9yZWQgdGl0bGUgKi8gJycsIGhyZWYpO1xyXG4gIGhhbmRsZUludGVybmFsTmF2aWdhdGlvbigpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVJbnRlcm5hbE5hdmlnYXRpb24oKSB7XHJcbiAgaWYgKCFub3RpZnlMb2NhdGlvbkNoYW5nZWRNZXRob2QpIHtcclxuICAgIG5vdGlmeUxvY2F0aW9uQ2hhbmdlZE1ldGhvZCA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3NlcicsXHJcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5TZXJ2aWNlcycsXHJcbiAgICAgICdCcm93c2VyVXJpSGVscGVyJyxcclxuICAgICAgJ05vdGlmeUxvY2F0aW9uQ2hhbmdlZCdcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwbGF0Zm9ybS5jYWxsTWV0aG9kKG5vdGlmeUxvY2F0aW9uQ2hhbmdlZE1ldGhvZCwgbnVsbCwgW1xyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcobG9jYXRpb24uaHJlZilcclxuICBdKTtcclxufVxyXG5cclxubGV0IHRlc3RBbmNob3I6IEhUTUxBbmNob3JFbGVtZW50O1xyXG5mdW5jdGlvbiB0b0Fic29sdXRlVXJpKHJlbGF0aXZlVXJpOiBzdHJpbmcpIHtcclxuICB0ZXN0QW5jaG9yID0gdGVzdEFuY2hvciB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgdGVzdEFuY2hvci5ocmVmID0gcmVsYXRpdmVVcmk7XHJcbiAgcmV0dXJuIHRlc3RBbmNob3IuaHJlZjtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZENsb3Nlc3RBbmNlc3RvcihlbGVtZW50OiBFbGVtZW50IHwgbnVsbCwgdGFnTmFtZTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuICFlbGVtZW50XHJcbiAgICA/IG51bGxcclxuICAgIDogZWxlbWVudC50YWdOYW1lID09PSB0YWdOYW1lXHJcbiAgICAgID8gZWxlbWVudFxyXG4gICAgICA6IGZpbmRDbG9zZXN0QW5jZXN0b3IoZWxlbWVudC5wYXJlbnRFbGVtZW50LCB0YWdOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1dpdGhpbkJhc2VVcmlTcGFjZShocmVmOiBzdHJpbmcpIHtcclxuICBjb25zdCBiYXNlVXJpUHJlZml4V2l0aFRyYWlsaW5nU2xhc2ggPSB0b0Jhc2VVcmlQcmVmaXhXaXRoVHJhaWxpbmdTbGFzaChkb2N1bWVudC5iYXNlVVJJISk7IC8vIFRPRE86IE1pZ2h0IGJhc2VVUkkgcmVhbGx5IGJlIG51bGw/XHJcbiAgcmV0dXJuIGhyZWYuc3RhcnRzV2l0aChiYXNlVXJpUHJlZml4V2l0aFRyYWlsaW5nU2xhc2gpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0Jhc2VVcmlQcmVmaXhXaXRoVHJhaWxpbmdTbGFzaChiYXNlVXJpOiBzdHJpbmcpIHtcclxuICByZXR1cm4gYmFzZVVyaS5zdWJzdHIoMCwgYmFzZVVyaS5sYXN0SW5kZXhPZignLycpICsgMSk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1NlcnZpY2VzL1VyaUhlbHBlci50cyIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IGdldEFzc2VtYmx5TmFtZUZyb21VcmwgfSBmcm9tICcuL1BsYXRmb3JtL0RvdE5ldCc7XHJcbmltcG9ydCAnLi9SZW5kZXJpbmcvUmVuZGVyZXInO1xyXG5pbXBvcnQgJy4vU2VydmljZXMvSHR0cCc7XHJcbmltcG9ydCAnLi9TZXJ2aWNlcy9VcmlIZWxwZXInO1xyXG5pbXBvcnQgJy4vR2xvYmFsRXhwb3J0cyc7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBib290KCkge1xyXG4gIC8vIFJlYWQgc3RhcnR1cCBjb25maWcgZnJvbSB0aGUgPHNjcmlwdD4gZWxlbWVudCB0aGF0J3MgaW1wb3J0aW5nIHRoaXMgZmlsZVxyXG4gIGNvbnN0IGFsbFNjcmlwdEVsZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xyXG4gIGNvbnN0IHRoaXNTY3JpcHRFbGVtID0gKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQgfHwgYWxsU2NyaXB0RWxlbXNbYWxsU2NyaXB0RWxlbXMubGVuZ3RoIC0gMV0pIGFzIEhUTUxTY3JpcHRFbGVtZW50O1xyXG4gIGNvbnN0IGlzTGlua2VyRW5hYmxlZCA9IHRoaXNTY3JpcHRFbGVtLmdldEF0dHJpYnV0ZSgnbGlua2VyLWVuYWJsZWQnKSA9PT0gJ3RydWUnO1xyXG4gIGNvbnN0IGVudHJ5UG9pbnREbGwgPSBnZXRSZXF1aXJlZEJvb3RTY3JpcHRBdHRyaWJ1dGUodGhpc1NjcmlwdEVsZW0sICdtYWluJyk7XHJcbiAgY29uc3QgZW50cnlQb2ludE1ldGhvZCA9IGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZSh0aGlzU2NyaXB0RWxlbSwgJ2VudHJ5cG9pbnQnKTtcclxuICBjb25zdCBlbnRyeVBvaW50QXNzZW1ibHlOYW1lID0gZ2V0QXNzZW1ibHlOYW1lRnJvbVVybChlbnRyeVBvaW50RGxsKTtcclxuICBjb25zdCByZWZlcmVuY2VBc3NlbWJsaWVzQ29tbWFTZXBhcmF0ZWQgPSB0aGlzU2NyaXB0RWxlbS5nZXRBdHRyaWJ1dGUoJ3JlZmVyZW5jZXMnKSB8fCAnJztcclxuICBjb25zdCByZWZlcmVuY2VBc3NlbWJsaWVzID0gcmVmZXJlbmNlQXNzZW1ibGllc0NvbW1hU2VwYXJhdGVkXHJcbiAgICAuc3BsaXQoJywnKVxyXG4gICAgLm1hcChzID0+IHMudHJpbSgpKVxyXG4gICAgLmZpbHRlcihzID0+ICEhcyk7XHJcblxyXG4gIGlmICghaXNMaW5rZXJFbmFibGVkKSB7XHJcbiAgICBjb25zb2xlLmluZm8oJ0JsYXpvciBpcyBydW5uaW5nIGluIGRldiBtb2RlIHdpdGhvdXQgSUwgc3RyaXBwaW5nLiBUbyBtYWtlIHRoZSBidW5kbGUgc2l6ZSBzaWduaWZpY2FudGx5IHNtYWxsZXIsIHB1Ymxpc2ggdGhlIGFwcGxpY2F0aW9uIG9yIHNlZSBodHRwczovL2dvLm1pY3Jvc29mdC5jb20vZndsaW5rLz9saW5raWQ9ODcwNDE0Jyk7XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgdGhlIFVSTHMgb2YgdGhlIGFzc2VtYmxpZXMgd2Ugd2FudCB0byBsb2FkXHJcbiAgY29uc3QgbG9hZEFzc2VtYmx5VXJscyA9IFtlbnRyeVBvaW50RGxsXVxyXG4gICAgLmNvbmNhdChyZWZlcmVuY2VBc3NlbWJsaWVzKVxyXG4gICAgLm1hcChmaWxlbmFtZSA9PiBgX2ZyYW1ld29yay9fYmluLyR7ZmlsZW5hbWV9YCk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBwbGF0Zm9ybS5zdGFydChsb2FkQXNzZW1ibHlVcmxzKTtcclxuICB9IGNhdGNoIChleCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gc3RhcnQgcGxhdGZvcm0uIFJlYXNvbjogJHtleH1gKTtcclxuICB9XHJcblxyXG4gIC8vIFN0YXJ0IHVwIHRoZSBhcHBsaWNhdGlvblxyXG4gIHBsYXRmb3JtLmNhbGxFbnRyeVBvaW50KGVudHJ5UG9pbnRBc3NlbWJseU5hbWUsIGVudHJ5UG9pbnRNZXRob2QsIFtdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmVxdWlyZWRCb290U2NyaXB0QXR0cmlidXRlKGVsZW06IEhUTUxTY3JpcHRFbGVtZW50LCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IHJlc3VsdCA9IGVsZW0uZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xyXG4gIGlmICghcmVzdWx0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgXCIke2F0dHJpYnV0ZU5hbWV9XCIgYXR0cmlidXRlIG9uIEJsYXpvciBzY3JpcHQgdGFnLmApO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5ib290KCk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Cb290LnRzIiwiaW1wb3J0IHsgTWV0aG9kSGFuZGxlLCBTeXN0ZW1fT2JqZWN0LCBTeXN0ZW1fU3RyaW5nLCBTeXN0ZW1fQXJyYXksIFBvaW50ZXIsIFBsYXRmb3JtIH0gZnJvbSAnLi4vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBnZXRBc3NlbWJseU5hbWVGcm9tVXJsIH0gZnJvbSAnLi4vRG90TmV0JztcclxuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vSW50ZXJvcC9SZWdpc3RlcmVkRnVuY3Rpb24nO1xyXG5cclxubGV0IGFzc2VtYmx5X2xvYWQ6IChhc3NlbWJseU5hbWU6IHN0cmluZykgPT4gbnVtYmVyO1xyXG5sZXQgZmluZF9jbGFzczogKGFzc2VtYmx5SGFuZGxlOiBudW1iZXIsIG5hbWVzcGFjZTogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZykgPT4gbnVtYmVyO1xyXG5sZXQgZmluZF9tZXRob2Q6ICh0eXBlSGFuZGxlOiBudW1iZXIsIG1ldGhvZE5hbWU6IHN0cmluZywgdW5rbm93bkFyZzogbnVtYmVyKSA9PiBNZXRob2RIYW5kbGU7XHJcbmxldCBpbnZva2VfbWV0aG9kOiAobWV0aG9kOiBNZXRob2RIYW5kbGUsIHRhcmdldDogU3lzdGVtX09iamVjdCwgYXJnc0FycmF5UHRyOiBudW1iZXIsIGV4Y2VwdGlvbkZsYWdJbnRQdHI6IG51bWJlcikgPT4gU3lzdGVtX09iamVjdDtcclxubGV0IG1vbm9fc3RyaW5nX2dldF91dGY4OiAobWFuYWdlZFN0cmluZzogU3lzdGVtX1N0cmluZykgPT4gTW9uby5VdGY4UHRyO1xyXG5sZXQgbW9ub19zdHJpbmc6IChqc1N0cmluZzogc3RyaW5nKSA9PiBTeXN0ZW1fU3RyaW5nO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1vbm9QbGF0Zm9ybTogUGxhdGZvcm0gPSB7XHJcbiAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KGxvYWRBc3NlbWJseVVybHM6IHN0cmluZ1tdKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAvLyBtb25vLmpzIGFzc3VtZXMgdGhlIGV4aXN0ZW5jZSBvZiB0aGlzXHJcbiAgICAgIHdpbmRvd1snQnJvd3NlciddID0ge1xyXG4gICAgICAgIGluaXQ6ICgpID0+IHsgfSxcclxuICAgICAgICBhc3luY0xvYWQ6IGFzeW5jTG9hZFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gRW1zY3JpcHRlbiB3b3JrcyBieSBleHBlY3RpbmcgdGhlIG1vZHVsZSBjb25maWcgdG8gYmUgYSBnbG9iYWxcclxuICAgICAgd2luZG93WydNb2R1bGUnXSA9IGNyZWF0ZUVtc2NyaXB0ZW5Nb2R1bGVJbnN0YW5jZShsb2FkQXNzZW1ibHlVcmxzLCByZXNvbHZlLCByZWplY3QpO1xyXG5cclxuICAgICAgYWRkU2NyaXB0VGFnc1RvRG9jdW1lbnQoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGZpbmRNZXRob2Q6IGZ1bmN0aW9uIGZpbmRNZXRob2QoYXNzZW1ibHlOYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZywgbWV0aG9kTmFtZTogc3RyaW5nKTogTWV0aG9kSGFuZGxlIHtcclxuICAgIC8vIFRPRE86IENhY2hlIHRoZSBhc3NlbWJseV9sb2FkIG91dHB1dHM/XHJcbiAgICBjb25zdCBhc3NlbWJseUhhbmRsZSA9IGFzc2VtYmx5X2xvYWQoYXNzZW1ibHlOYW1lKTtcclxuICAgIGlmICghYXNzZW1ibHlIYW5kbGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhc3NlbWJseSBcIiR7YXNzZW1ibHlOYW1lfVwiYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHlwZUhhbmRsZSA9IGZpbmRfY2xhc3MoYXNzZW1ibHlIYW5kbGUsIG5hbWVzcGFjZSwgY2xhc3NOYW1lKTtcclxuICAgIGlmICghdHlwZUhhbmRsZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHR5cGUgXCIke2NsYXNzTmFtZX1cIiBpbiBuYW1lc3BhY2UgXCIke25hbWVzcGFjZX1cIiBpbiBhc3NlbWJseSBcIiR7YXNzZW1ibHlOYW1lfVwiYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWV0aG9kSGFuZGxlID0gZmluZF9tZXRob2QodHlwZUhhbmRsZSwgbWV0aG9kTmFtZSwgLTEpO1xyXG4gICAgaWYgKCFtZXRob2RIYW5kbGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBtZXRob2QgXCIke21ldGhvZE5hbWV9XCIgb24gdHlwZSBcIiR7bmFtZXNwYWNlfS4ke2NsYXNzTmFtZX1cImApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtZXRob2RIYW5kbGU7XHJcbiAgfSxcclxuXHJcbiAgY2FsbEVudHJ5UG9pbnQ6IGZ1bmN0aW9uIGNhbGxFbnRyeVBvaW50KGFzc2VtYmx5TmFtZTogc3RyaW5nLCBlbnRyeXBvaW50TWV0aG9kOiBzdHJpbmcsIGFyZ3M6IFN5c3RlbV9PYmplY3RbXSk6IHZvaWQge1xyXG4gICAgLy8gUGFyc2UgdGhlIGVudHJ5cG9pbnRNZXRob2QsIHdoaWNoIGlzIG9mIHRoZSBmb3JtIE15QXBwLk15TmFtZXNwYWNlLk15VHlwZU5hbWU6Ok15TWV0aG9kTmFtZVxyXG4gICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IHN1cHBvcnQgc3BlY2lmeWluZyBhIG1ldGhvZCBvdmVybG9hZCwgc28gaXQgaGFzIHRvIGJlIHVuaXF1ZVxyXG4gICAgY29uc3QgZW50cnlwb2ludFNlZ21lbnRzID0gZW50cnlwb2ludE1ldGhvZC5zcGxpdCgnOjonKTtcclxuICAgIGlmIChlbnRyeXBvaW50U2VnbWVudHMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYWxmb3JtZWQgZW50cnkgcG9pbnQgbWV0aG9kIG5hbWU7IGNvdWxkIG5vdCByZXNvbHZlIGNsYXNzIG5hbWUgYW5kIG1ldGhvZCBuYW1lLicpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHlwZUZ1bGxOYW1lID0gZW50cnlwb2ludFNlZ21lbnRzWzBdO1xyXG4gICAgY29uc3QgbWV0aG9kTmFtZSA9IGVudHJ5cG9pbnRTZWdtZW50c1sxXTtcclxuICAgIGNvbnN0IGxhc3REb3QgPSB0eXBlRnVsbE5hbWUubGFzdEluZGV4T2YoJy4nKTtcclxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IGxhc3REb3QgPiAtMSA/IHR5cGVGdWxsTmFtZS5zdWJzdHJpbmcoMCwgbGFzdERvdCkgOiAnJztcclxuICAgIGNvbnN0IHR5cGVTaG9ydE5hbWUgPSBsYXN0RG90ID4gLTEgPyB0eXBlRnVsbE5hbWUuc3Vic3RyaW5nKGxhc3REb3QgKyAxKSA6IHR5cGVGdWxsTmFtZTtcclxuXHJcbiAgICBjb25zdCBlbnRyeVBvaW50TWV0aG9kSGFuZGxlID0gbW9ub1BsYXRmb3JtLmZpbmRNZXRob2QoYXNzZW1ibHlOYW1lLCBuYW1lc3BhY2UsIHR5cGVTaG9ydE5hbWUsIG1ldGhvZE5hbWUpO1xyXG4gICAgbW9ub1BsYXRmb3JtLmNhbGxNZXRob2QoZW50cnlQb2ludE1ldGhvZEhhbmRsZSwgbnVsbCwgYXJncyk7XHJcbiAgfSxcclxuXHJcbiAgY2FsbE1ldGhvZDogZnVuY3Rpb24gY2FsbE1ldGhvZChtZXRob2Q6IE1ldGhvZEhhbmRsZSwgdGFyZ2V0OiBTeXN0ZW1fT2JqZWN0LCBhcmdzOiBTeXN0ZW1fT2JqZWN0W10pOiBTeXN0ZW1fT2JqZWN0IHtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA+IDQpIHtcclxuICAgICAgLy8gSG9wZWZ1bGx5IHRoaXMgcmVzdHJpY3Rpb24gY2FuIGJlIGVhc2VkIHNvb24sIGJ1dCBmb3Igbm93IG1ha2UgaXQgY2xlYXIgd2hhdCdzIGdvaW5nIG9uXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ3VycmVudGx5LCBNb25vUGxhdGZvcm0gc3VwcG9ydHMgcGFzc2luZyBhIG1heGltdW0gb2YgNCBhcmd1bWVudHMgZnJvbSBKUyB0byAuTkVULiBZb3UgdHJpZWQgdG8gcGFzcyAke2FyZ3MubGVuZ3RofS5gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGFjayA9IE1vZHVsZS5zdGFja1NhdmUoKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBhcmdzQnVmZmVyID0gTW9kdWxlLnN0YWNrQWxsb2MoYXJncy5sZW5ndGgpO1xyXG4gICAgICBjb25zdCBleGNlcHRpb25GbGFnTWFuYWdlZEludCA9IE1vZHVsZS5zdGFja0FsbG9jKDQpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBNb2R1bGUuc2V0VmFsdWUoYXJnc0J1ZmZlciArIGkgKiA0LCBhcmdzW2ldLCAnaTMyJyk7XHJcbiAgICAgIH1cclxuICAgICAgTW9kdWxlLnNldFZhbHVlKGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50LCAwLCAnaTMyJyk7XHJcblxyXG4gICAgICBjb25zdCByZXMgPSBpbnZva2VfbWV0aG9kKG1ldGhvZCwgdGFyZ2V0LCBhcmdzQnVmZmVyLCBleGNlcHRpb25GbGFnTWFuYWdlZEludCk7XHJcblxyXG4gICAgICBpZiAoTW9kdWxlLmdldFZhbHVlKGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50LCAnaTMyJykgIT09IDApIHtcclxuICAgICAgICAvLyBJZiB0aGUgZXhjZXB0aW9uIGZsYWcgaXMgc2V0LCB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZXhjZXB0aW9uLlRvU3RyaW5nKClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobW9ub1BsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyg8U3lzdGVtX1N0cmluZz5yZXMpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIE1vZHVsZS5zdGFja1Jlc3RvcmUoc3RhY2spO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvSmF2YVNjcmlwdFN0cmluZzogZnVuY3Rpb24gdG9KYXZhU2NyaXB0U3RyaW5nKG1hbmFnZWRTdHJpbmc6IFN5c3RlbV9TdHJpbmcpIHtcclxuICAgIC8vIENvbW1lbnRzIGZyb20gb3JpZ2luYWwgTW9ubyBzYW1wbGU6XHJcbiAgICAvL0ZJWE1FIHRoaXMgaXMgd2FzdGVmdWxsLCB3ZSBjb3VsZCByZW1vdmUgdGhlIHRlbXAgbWFsbG9jIGJ5IGdvaW5nIHRoZSBVVEYxNiByb3V0ZVxyXG4gICAgLy9GSVhNRSB0aGlzIGlzIHVuc2FmZSwgY3V6IHJhdyBvYmplY3RzIGNvdWxkIGJlIEdDJ2QuXHJcblxyXG4gICAgY29uc3QgdXRmOCA9IG1vbm9fc3RyaW5nX2dldF91dGY4KG1hbmFnZWRTdHJpbmcpO1xyXG4gICAgY29uc3QgcmVzID0gTW9kdWxlLlVURjhUb1N0cmluZyh1dGY4KTtcclxuICAgIE1vZHVsZS5fZnJlZSh1dGY4IGFzIGFueSk7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH0sXHJcblxyXG4gIHRvRG90TmV0U3RyaW5nOiBmdW5jdGlvbiB0b0RvdE5ldFN0cmluZyhqc1N0cmluZzogc3RyaW5nKTogU3lzdGVtX1N0cmluZyB7XHJcbiAgICByZXR1cm4gbW9ub19zdHJpbmcoanNTdHJpbmcpO1xyXG4gIH0sXHJcblxyXG4gIGdldEFycmF5TGVuZ3RoOiBmdW5jdGlvbiBnZXRBcnJheUxlbmd0aChhcnJheTogU3lzdGVtX0FycmF5PGFueT4pOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZShnZXRBcnJheURhdGFQb2ludGVyKGFycmF5KSwgJ2kzMicpO1xyXG4gIH0sXHJcblxyXG4gIGdldEFycmF5RW50cnlQdHI6IGZ1bmN0aW9uIGdldEFycmF5RW50cnlQdHI8VFB0ciBleHRlbmRzIFBvaW50ZXI+KGFycmF5OiBTeXN0ZW1fQXJyYXk8VFB0cj4sIGluZGV4OiBudW1iZXIsIGl0ZW1TaXplOiBudW1iZXIpOiBUUHRyIHtcclxuICAgIC8vIEZpcnN0IGJ5dGUgaXMgYXJyYXkgbGVuZ3RoLCBmb2xsb3dlZCBieSBlbnRyaWVzXHJcbiAgICBjb25zdCBhZGRyZXNzID0gZ2V0QXJyYXlEYXRhUG9pbnRlcihhcnJheSkgKyA0ICsgaW5kZXggKiBpdGVtU2l6ZTtcclxuICAgIHJldHVybiBhZGRyZXNzIGFzIGFueSBhcyBUUHRyO1xyXG4gIH0sXHJcblxyXG4gIGdldE9iamVjdEZpZWxkc0Jhc2VBZGRyZXNzOiBmdW5jdGlvbiBnZXRPYmplY3RGaWVsZHNCYXNlQWRkcmVzcyhyZWZlcmVuY2VUeXBlZE9iamVjdDogU3lzdGVtX09iamVjdCk6IFBvaW50ZXIge1xyXG4gICAgLy8gVGhlIGZpcnN0IHR3byBpbnQzMiB2YWx1ZXMgYXJlIGludGVybmFsIE1vbm8gZGF0YVxyXG4gICAgcmV0dXJuIChyZWZlcmVuY2VUeXBlZE9iamVjdCBhcyBhbnkgYXMgbnVtYmVyICsgOCkgYXMgYW55IGFzIFBvaW50ZXI7XHJcbiAgfSxcclxuXHJcbiAgcmVhZEludDMyRmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwSW50MzIoYmFzZUFkZHJlc3M6IFBvaW50ZXIsIGZpZWxkT2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNb2R1bGUuZ2V0VmFsdWUoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApLCAnaTMyJyk7XHJcbiAgfSxcclxuXHJcbiAgcmVhZE9iamVjdEZpZWxkOiBmdW5jdGlvbiByZWFkSGVhcE9iamVjdDxUIGV4dGVuZHMgU3lzdGVtX09iamVjdD4oYmFzZUFkZHJlc3M6IFBvaW50ZXIsIGZpZWxkT2Zmc2V0PzogbnVtYmVyKTogVCB7XHJcbiAgICByZXR1cm4gTW9kdWxlLmdldFZhbHVlKChiYXNlQWRkcmVzcyBhcyBhbnkgYXMgbnVtYmVyKSArIChmaWVsZE9mZnNldCB8fCAwKSwgJ2kzMicpIGFzIGFueSBhcyBUO1xyXG4gIH0sXHJcblxyXG4gIHJlYWRTdHJpbmdGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBPYmplY3QoYmFzZUFkZHJlc3M6IFBvaW50ZXIsIGZpZWxkT2Zmc2V0PzogbnVtYmVyKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICBjb25zdCBmaWVsZFZhbHVlID0gTW9kdWxlLmdldFZhbHVlKChiYXNlQWRkcmVzcyBhcyBhbnkgYXMgbnVtYmVyKSArIChmaWVsZE9mZnNldCB8fCAwKSwgJ2kzMicpO1xyXG4gICAgcmV0dXJuIGZpZWxkVmFsdWUgPT09IDAgPyBudWxsIDogbW9ub1BsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhmaWVsZFZhbHVlIGFzIGFueSBhcyBTeXN0ZW1fU3RyaW5nKTtcclxuICB9LFxyXG5cclxuICByZWFkU3RydWN0RmllbGQ6IGZ1bmN0aW9uIHJlYWRTdHJ1Y3RGaWVsZDxUIGV4dGVuZHMgUG9pbnRlcj4oYmFzZUFkZHJlc3M6IFBvaW50ZXIsIGZpZWxkT2Zmc2V0PzogbnVtYmVyKTogVCB7XHJcbiAgICByZXR1cm4gKChiYXNlQWRkcmVzcyBhcyBhbnkgYXMgbnVtYmVyKSArIChmaWVsZE9mZnNldCB8fCAwKSkgYXMgYW55IGFzIFQ7XHJcbiAgfSxcclxufTtcclxuXHJcbi8vIEJ5cGFzcyBub3JtYWwgdHlwZSBjaGVja2luZyB0byBhZGQgdGhpcyBleHRyYSBmdW5jdGlvbi4gSXQncyBvbmx5IGludGVuZGVkIHRvIGJlIGNhbGxlZCBmcm9tXHJcbi8vIHRoZSBKUyBjb2RlIGluIE1vbm8ncyBkcml2ZXIuYy4gSXQncyBuZXZlciBpbnRlbmRlZCB0byBiZSBjYWxsZWQgZnJvbSBUeXBlU2NyaXB0LlxyXG4obW9ub1BsYXRmb3JtIGFzIGFueSkubW9ub0dldFJlZ2lzdGVyZWRGdW5jdGlvbiA9IGdldFJlZ2lzdGVyZWRGdW5jdGlvbjtcclxuXHJcbmZ1bmN0aW9uIGFkZFNjcmlwdFRhZ3NUb0RvY3VtZW50KCkge1xyXG4gIC8vIExvYWQgZWl0aGVyIHRoZSB3YXNtIG9yIGFzbS5qcyB2ZXJzaW9uIG9mIHRoZSBNb25vIHJ1bnRpbWVcclxuICBjb25zdCBicm93c2VyU3VwcG9ydHNOYXRpdmVXZWJBc3NlbWJseSA9IHR5cGVvZiBXZWJBc3NlbWJseSAhPT0gJ3VuZGVmaW5lZCcgJiYgV2ViQXNzZW1ibHkudmFsaWRhdGU7XHJcbiAgY29uc3QgbW9ub1J1bnRpbWVVcmxCYXNlID0gJ19mcmFtZXdvcmsvJyArIChicm93c2VyU3VwcG9ydHNOYXRpdmVXZWJBc3NlbWJseSA/ICd3YXNtJyA6ICdhc21qcycpO1xyXG4gIGNvbnN0IG1vbm9SdW50aW1lU2NyaXB0VXJsID0gYCR7bW9ub1J1bnRpbWVVcmxCYXNlfS9tb25vLmpzYDtcclxuXHJcbiAgaWYgKCFicm93c2VyU3VwcG9ydHNOYXRpdmVXZWJBc3NlbWJseSkge1xyXG4gICAgLy8gSW4gdGhlIGFzbWpzIGNhc2UsIHRoZSBpbml0aWFsIG1lbW9yeSBzdHJ1Y3R1cmUgaXMgaW4gYSBzZXBhcmF0ZSBmaWxlIHdlIG5lZWQgdG8gZG93bmxvYWRcclxuICAgIGNvbnN0IG1lbWluaXRYSFIgPSBNb2R1bGVbJ21lbW9yeUluaXRpYWxpemVyUmVxdWVzdCddID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICBtZW1pbml0WEhSLm9wZW4oJ0dFVCcsIGAke21vbm9SdW50aW1lVXJsQmFzZX0vbW9uby5qcy5tZW1gKTtcclxuICAgIG1lbWluaXRYSFIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICAgIG1lbWluaXRYSFIuc2VuZChudWxsKTtcclxuICB9XHJcblxyXG4gIGRvY3VtZW50LndyaXRlKGA8c2NyaXB0IGRlZmVyIHNyYz1cIiR7bW9ub1J1bnRpbWVTY3JpcHRVcmx9XCI+PC9zY3JpcHQ+YCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVtc2NyaXB0ZW5Nb2R1bGVJbnN0YW5jZShsb2FkQXNzZW1ibHlVcmxzOiBzdHJpbmdbXSwgb25SZWFkeTogKCkgPT4gdm9pZCwgb25FcnJvcjogKHJlYXNvbj86IGFueSkgPT4gdm9pZCkge1xyXG4gIGNvbnN0IG1vZHVsZSA9IHt9IGFzIHR5cGVvZiBNb2R1bGU7XHJcbiAgY29uc3Qgd2FzbUJpbmFyeUZpbGUgPSAnX2ZyYW1ld29yay93YXNtL21vbm8ud2FzbSc7XHJcbiAgY29uc3QgYXNtanNDb2RlRmlsZSA9ICdfZnJhbWV3b3JrL2FzbWpzL21vbm8uYXNtLmpzJztcclxuXHJcbiAgbW9kdWxlLnByaW50ID0gbGluZSA9PiBjb25zb2xlLmxvZyhgV0FTTTogJHtsaW5lfWApO1xyXG4gIG1vZHVsZS5wcmludEVyciA9IGxpbmUgPT4gY29uc29sZS5lcnJvcihgV0FTTTogJHtsaW5lfWApO1xyXG4gIG1vZHVsZS5wcmVSdW4gPSBbXTtcclxuICBtb2R1bGUucG9zdFJ1biA9IFtdO1xyXG4gIG1vZHVsZS5wcmVsb2FkUGx1Z2lucyA9IFtdO1xyXG5cclxuICBtb2R1bGUubG9jYXRlRmlsZSA9IGZpbGVOYW1lID0+IHtcclxuICAgIHN3aXRjaCAoZmlsZU5hbWUpIHtcclxuICAgICAgY2FzZSAnbW9uby53YXNtJzogcmV0dXJuIHdhc21CaW5hcnlGaWxlO1xyXG4gICAgICBjYXNlICdtb25vLmFzbS5qcyc6IHJldHVybiBhc21qc0NvZGVGaWxlO1xyXG4gICAgICBkZWZhdWx0OiByZXR1cm4gZmlsZU5hbWU7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbW9kdWxlLnByZVJ1bi5wdXNoKCgpID0+IHtcclxuICAgIC8vIEJ5IG5vdywgZW1zY3JpcHRlbiBzaG91bGQgYmUgaW5pdGlhbGlzZWQgZW5vdWdoIHRoYXQgd2UgY2FuIGNhcHR1cmUgdGhlc2UgbWV0aG9kcyBmb3IgbGF0ZXIgdXNlXHJcbiAgICBhc3NlbWJseV9sb2FkID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fYXNzZW1ibHlfbG9hZCcsICdudW1iZXInLCBbJ3N0cmluZyddKTtcclxuICAgIGZpbmRfY2xhc3MgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9hc3NlbWJseV9maW5kX2NsYXNzJywgJ251bWJlcicsIFsnbnVtYmVyJywgJ3N0cmluZycsICdzdHJpbmcnXSk7XHJcbiAgICBmaW5kX21ldGhvZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2ZpbmRfbWV0aG9kJywgJ251bWJlcicsIFsnbnVtYmVyJywgJ3N0cmluZycsICdudW1iZXInXSk7XHJcbiAgICBpbnZva2VfbWV0aG9kID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21faW52b2tlX21ldGhvZCcsICdudW1iZXInLCBbJ251bWJlcicsICdudW1iZXInLCAnbnVtYmVyJ10pO1xyXG4gICAgbW9ub19zdHJpbmdfZ2V0X3V0ZjggPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9zdHJpbmdfZ2V0X3V0ZjgnLCAnbnVtYmVyJywgWydudW1iZXInXSk7XHJcbiAgICBtb25vX3N0cmluZyA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX3N0cmluZ19mcm9tX2pzJywgJ251bWJlcicsIFsnc3RyaW5nJ10pO1xyXG5cclxuICAgIE1vZHVsZS5GU19jcmVhdGVQYXRoKCcvJywgJ2FwcEJpbkRpcicsIHRydWUsIHRydWUpO1xyXG4gICAgbG9hZEFzc2VtYmx5VXJscy5mb3JFYWNoKHVybCA9PlxyXG4gICAgICBGUy5jcmVhdGVQcmVsb2FkZWRGaWxlKCdhcHBCaW5EaXInLCBgJHtnZXRBc3NlbWJseU5hbWVGcm9tVXJsKHVybCl9LmRsbGAsIHVybCwgdHJ1ZSwgZmFsc2UsIHVuZGVmaW5lZCwgb25FcnJvcikpO1xyXG4gIH0pO1xyXG5cclxuICBtb2R1bGUucG9zdFJ1bi5wdXNoKCgpID0+IHtcclxuICAgIGNvbnN0IGxvYWRfcnVudGltZSA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2xvYWRfcnVudGltZScsIG51bGwsIFsnc3RyaW5nJ10pO1xyXG4gICAgbG9hZF9ydW50aW1lKCdhcHBCaW5EaXInKTtcclxuICAgIG9uUmVhZHkoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIG1vZHVsZTtcclxufVxyXG5cclxuZnVuY3Rpb24gYXN5bmNMb2FkKHVybCwgb25sb2FkLCBvbmVycm9yKSB7XHJcbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuICB4aHIub3BlbignR0VUJywgdXJsLCAvKiBhc3luYzogKi8gdHJ1ZSk7XHJcbiAgeGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIHhocl9vbmxvYWQoKSB7XHJcbiAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDAgfHwgeGhyLnN0YXR1cyA9PSAwICYmIHhoci5yZXNwb25zZSkge1xyXG4gICAgICB2YXIgYXNtID0gbmV3IFVpbnQ4QXJyYXkoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgb25sb2FkKGFzbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvbmVycm9yKHhocik7XHJcbiAgICB9XHJcbiAgfTtcclxuICB4aHIub25lcnJvciA9IG9uZXJyb3I7XHJcbiAgeGhyLnNlbmQobnVsbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFycmF5RGF0YVBvaW50ZXI8VD4oYXJyYXk6IFN5c3RlbV9BcnJheTxUPik6IG51bWJlciB7XHJcbiAgcmV0dXJuIDxudW1iZXI+PGFueT5hcnJheSArIDEyOyAvLyBGaXJzdCBieXRlIGZyb20gaGVyZSBpcyBsZW5ndGgsIHRoZW4gZm9sbG93aW5nIGJ5dGVzIGFyZSBlbnRyaWVzXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1BsYXRmb3JtL01vbm8vTW9ub1BsYXRmb3JtLnRzIiwiaW1wb3J0IHsgaW52b2tlV2l0aEpzb25NYXJzaGFsbGluZyB9IGZyb20gJy4vSW52b2tlV2l0aEpzb25NYXJzaGFsbGluZyc7XHJcbmltcG9ydCB7IGF0dGFjaENvbXBvbmVudFRvRWxlbWVudCwgcmVuZGVyQmF0Y2ggfSBmcm9tICcuLi9SZW5kZXJpbmcvUmVuZGVyZXInO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBkZWZpbml0aXZlIGxpc3Qgb2YgaW50ZXJuYWwgZnVuY3Rpb25zIGludm9rYWJsZSBmcm9tIC5ORVQgY29kZS5cclxuICogVGhlc2UgZnVuY3Rpb24gbmFtZXMgYXJlIHRyZWF0ZWQgYXMgJ3Jlc2VydmVkJyBhbmQgY2Fubm90IGJlIHBhc3NlZCB0byByZWdpc3RlckZ1bmN0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9ucyA9IHtcclxuICBhdHRhY2hDb21wb25lbnRUb0VsZW1lbnQsXHJcbiAgaW52b2tlV2l0aEpzb25NYXJzaGFsbGluZyxcclxuICByZW5kZXJCYXRjaCxcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0ludGVyb3AvSW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb24udHMiLCJpbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uIH0gZnJvbSAnLi9SZWdpc3RlcmVkRnVuY3Rpb24nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVdpdGhKc29uTWFyc2hhbGxpbmcoaWRlbnRpZmllcjogU3lzdGVtX1N0cmluZywgLi4uYXJnc0pzb246IFN5c3RlbV9TdHJpbmdbXSkge1xyXG4gIGNvbnN0IGlkZW50aWZpZXJKc1N0cmluZyA9IHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhpZGVudGlmaWVyKTtcclxuICBjb25zdCBmdW5jSW5zdGFuY2UgPSBnZXRSZWdpc3RlcmVkRnVuY3Rpb24oaWRlbnRpZmllckpzU3RyaW5nKTtcclxuICBjb25zdCBhcmdzID0gYXJnc0pzb24ubWFwKGpzb24gPT4gSlNPTi5wYXJzZShwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoanNvbikpKTtcclxuICBjb25zdCByZXN1bHQgPSBmdW5jSW5zdGFuY2UuYXBwbHkobnVsbCwgYXJncyk7XHJcbiAgaWYgKHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc3QgcmVzdWx0SnNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XHJcbiAgICByZXR1cm4gcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcocmVzdWx0SnNvbik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nLnRzIiwiaW1wb3J0IHsgUG9pbnRlciwgU3lzdGVtX0FycmF5IH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyVHJlZUZyYW1lJztcclxuaW1wb3J0IHsgUmVuZGVyVHJlZUVkaXRQb2ludGVyIH0gZnJvbSAnLi9SZW5kZXJUcmVlRWRpdCc7XHJcblxyXG4vLyBLZWVwIGluIHN5bmMgd2l0aCB0aGUgc3RydWN0cyBpbiAuTkVUIGNvZGVcclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJCYXRjaCA9IHtcclxuICB1cGRhdGVkQ29tcG9uZW50czogKG9iajogUmVuZGVyQmF0Y2hQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlSYW5nZVBvaW50ZXI8UmVuZGVyVHJlZURpZmZQb2ludGVyPj4ob2JqLCAwKSxcclxuICByZWZlcmVuY2VGcmFtZXM6IChvYmo6IFJlbmRlckJhdGNoUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPEFycmF5UmFuZ2VQb2ludGVyPFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+PihvYmosIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGgpLFxyXG4gIGRpc3Bvc2VkQ29tcG9uZW50SWRzOiAob2JqOiBSZW5kZXJCYXRjaFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJ1Y3RGaWVsZDxBcnJheVJhbmdlUG9pbnRlcjxudW1iZXI+PihvYmosIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGggKyBhcnJheVJhbmdlU3RydWN0TGVuZ3RoKSxcclxufTtcclxuXHJcbmNvbnN0IGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGggPSA4O1xyXG5leHBvcnQgY29uc3QgYXJyYXlSYW5nZSA9IHtcclxuICBhcnJheTogPFQ+KG9iajogQXJyYXlSYW5nZVBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRPYmplY3RGaWVsZDxTeXN0ZW1fQXJyYXk8VD4+KG9iaiwgMCksXHJcbiAgY291bnQ6IDxUPihvYmo6IEFycmF5UmFuZ2VQb2ludGVyPFQ+KSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChvYmosIDQpLFxyXG59O1xyXG5cclxuY29uc3QgYXJyYXlTZWdtZW50U3RydWN0TGVuZ3RoID0gMTI7XHJcbmV4cG9ydCBjb25zdCBhcnJheVNlZ21lbnQgPSB7XHJcbiAgYXJyYXk6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRPYmplY3RGaWVsZDxTeXN0ZW1fQXJyYXk8VD4+KG9iaiwgMCksXHJcbiAgb2Zmc2V0OiA8VD4ob2JqOiBBcnJheVNlZ21lbnRQb2ludGVyPFQ+KSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChvYmosIDQpLFxyXG4gIGNvdW50OiA8VD4ob2JqOiBBcnJheVNlZ21lbnRQb2ludGVyPFQ+KSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChvYmosIDgpLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlclRyZWVEaWZmU3RydWN0TGVuZ3RoID0gNCArIGFycmF5U2VnbWVudFN0cnVjdExlbmd0aDtcclxuZXhwb3J0IGNvbnN0IHJlbmRlclRyZWVEaWZmID0ge1xyXG4gIGNvbXBvbmVudElkOiAob2JqOiBSZW5kZXJUcmVlRGlmZlBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgMCksXHJcbiAgZWRpdHM6IChvYmo6IFJlbmRlclRyZWVEaWZmUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPEFycmF5U2VnbWVudFBvaW50ZXI8UmVuZGVyVHJlZUVkaXRQb2ludGVyPj4ob2JqLCA0KSwgIFxyXG59O1xyXG5cclxuLy8gTm9taW5hbCB0eXBlcyB0byBlbnN1cmUgb25seSB2YWxpZCBwb2ludGVycyBhcmUgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbnMgYWJvdmUuXHJcbi8vIEF0IHJ1bnRpbWUgdGhlIHZhbHVlcyBhcmUganVzdCBudW1iZXJzLlxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlckJhdGNoUG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJCYXRjaFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlSYW5nZVBvaW50ZXI8VD4gZXh0ZW5kcyBQb2ludGVyIHsgQXJyYXlSYW5nZVBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlTZWdtZW50UG9pbnRlcjxUPiBleHRlbmRzIFBvaW50ZXIgeyBBcnJheVNlZ21lbnRQb2ludGVyX19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVEaWZmUG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJUcmVlRGlmZlBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvUmVuZGVyQmF0Y2gudHMiLCJpbXBvcnQgeyBTeXN0ZW1fQXJyYXksIE1ldGhvZEhhbmRsZSB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgZ2V0UmVuZGVyVHJlZUVkaXRQdHIsIHJlbmRlclRyZWVFZGl0LCBSZW5kZXJUcmVlRWRpdFBvaW50ZXIsIEVkaXRUeXBlIH0gZnJvbSAnLi9SZW5kZXJUcmVlRWRpdCc7XHJcbmltcG9ydCB7IGdldFRyZWVGcmFtZVB0ciwgcmVuZGVyVHJlZUZyYW1lLCBGcmFtZVR5cGUsIFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgfSBmcm9tICcuL1JlbmRlclRyZWVGcmFtZSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5jb25zdCBzZWxlY3RWYWx1ZVByb3BuYW1lID0gJ19ibGF6b3JTZWxlY3RWYWx1ZSc7XHJcbmxldCByYWlzZUV2ZW50TWV0aG9kOiBNZXRob2RIYW5kbGU7XHJcbmxldCByZW5kZXJDb21wb25lbnRNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcm93c2VyUmVuZGVyZXIge1xyXG4gIHByaXZhdGUgY2hpbGRDb21wb25lbnRMb2NhdGlvbnM6IHsgW2NvbXBvbmVudElkOiBudW1iZXJdOiBFbGVtZW50IH0gPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXR0YWNoQ29tcG9uZW50VG9FbGVtZW50KGNvbXBvbmVudElkOiBudW1iZXIsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICAgIHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdID0gZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1cGRhdGVDb21wb25lbnQoY29tcG9uZW50SWQ6IG51bWJlciwgZWRpdHM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+LCBlZGl0c09mZnNldDogbnVtYmVyLCBlZGl0c0xlbmd0aDogbnVtYmVyLCByZWZlcmVuY2VGcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdO1xyXG4gICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZWxlbWVudCBpcyBjdXJyZW50bHkgYXNzb2NpYXRlZCB3aXRoIGNvbXBvbmVudCAke2NvbXBvbmVudElkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwbHlFZGl0cyhjb21wb25lbnRJZCwgZWxlbWVudCwgMCwgZWRpdHMsIGVkaXRzT2Zmc2V0LCBlZGl0c0xlbmd0aCwgcmVmZXJlbmNlRnJhbWVzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkaXNwb3NlQ29tcG9uZW50KGNvbXBvbmVudElkOiBudW1iZXIpIHtcclxuICAgIGRlbGV0ZSB0aGlzLmNoaWxkQ29tcG9uZW50TG9jYXRpb25zW2NvbXBvbmVudElkXTtcclxuICB9XHJcblxyXG4gIGFwcGx5RWRpdHMoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGVkaXRzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUVkaXRQb2ludGVyPiwgZWRpdHNPZmZzZXQ6IG51bWJlciwgZWRpdHNMZW5ndGg6IG51bWJlciwgcmVmZXJlbmNlRnJhbWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4pIHtcclxuICAgIGxldCBjdXJyZW50RGVwdGggPSAwO1xyXG4gICAgbGV0IGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCA9IGNoaWxkSW5kZXg7XHJcbiAgICBjb25zdCBtYXhFZGl0SW5kZXhFeGNsID0gZWRpdHNPZmZzZXQgKyBlZGl0c0xlbmd0aDtcclxuICAgIGZvciAobGV0IGVkaXRJbmRleCA9IGVkaXRzT2Zmc2V0OyBlZGl0SW5kZXggPCBtYXhFZGl0SW5kZXhFeGNsOyBlZGl0SW5kZXgrKykge1xyXG4gICAgICBjb25zdCBlZGl0ID0gZ2V0UmVuZGVyVHJlZUVkaXRQdHIoZWRpdHMsIGVkaXRJbmRleCk7XHJcbiAgICAgIGNvbnN0IGVkaXRUeXBlID0gcmVuZGVyVHJlZUVkaXQudHlwZShlZGl0KTtcclxuICAgICAgc3dpdGNoIChlZGl0VHlwZSkge1xyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUucHJlcGVuZEZyYW1lOiB7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZUluZGV4ID0gcmVuZGVyVHJlZUVkaXQubmV3VHJlZUluZGV4KGVkaXQpO1xyXG4gICAgICAgICAgY29uc3QgZnJhbWUgPSBnZXRUcmVlRnJhbWVQdHIocmVmZXJlbmNlRnJhbWVzLCBmcmFtZUluZGV4KTtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIHRoaXMuaW5zZXJ0RnJhbWUoY29tcG9uZW50SWQsIHBhcmVudCwgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4LCByZWZlcmVuY2VGcmFtZXMsIGZyYW1lLCBmcmFtZUluZGV4KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnJlbW92ZUZyYW1lOiB7XHJcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSByZW5kZXJUcmVlRWRpdC5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICByZW1vdmVOb2RlRnJvbURPTShwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5zZXRBdHRyaWJ1dGU6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleF0gYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICB0aGlzLmFwcGx5QXR0cmlidXRlKGNvbXBvbmVudElkLCBlbGVtZW50LCBmcmFtZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5yZW1vdmVBdHRyaWJ1dGU6IHtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIHJlbW92ZUF0dHJpYnV0ZUZyb21ET00ocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgsIHJlbmRlclRyZWVFZGl0LnJlbW92ZWRBdHRyaWJ1dGVOYW1lKGVkaXQpISk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS51cGRhdGVUZXh0OiB7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZUluZGV4ID0gcmVuZGVyVHJlZUVkaXQubmV3VHJlZUluZGV4KGVkaXQpO1xyXG4gICAgICAgICAgY29uc3QgZnJhbWUgPSBnZXRUcmVlRnJhbWVQdHIocmVmZXJlbmNlRnJhbWVzLCBmcmFtZUluZGV4KTtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGRvbVRleHROb2RlID0gcGFyZW50LmNoaWxkTm9kZXNbY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4XSBhcyBUZXh0O1xyXG4gICAgICAgICAgZG9tVGV4dE5vZGUudGV4dENvbnRlbnQgPSByZW5kZXJUcmVlRnJhbWUudGV4dENvbnRlbnQoZnJhbWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUuc3RlcEluOiB7XHJcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSByZW5kZXJUcmVlRWRpdC5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuY2hpbGROb2Rlc1tjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXhdIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgY3VycmVudERlcHRoKys7XHJcbiAgICAgICAgICBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggPSAwO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUuc3RlcE91dDoge1xyXG4gICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQhO1xyXG4gICAgICAgICAgY3VycmVudERlcHRoLS07XHJcbiAgICAgICAgICBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggPSBjdXJyZW50RGVwdGggPT09IDAgPyBjaGlsZEluZGV4IDogMDsgLy8gVGhlIGNoaWxkSW5kZXggaXMgb25seSBldmVyIG5vbnplcm8gYXQgemVybyBkZXB0aFxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgIGNvbnN0IHVua25vd25UeXBlOiBuZXZlciA9IGVkaXRUeXBlOyAvLyBDb21waWxlLXRpbWUgdmVyaWZpY2F0aW9uIHRoYXQgdGhlIHN3aXRjaCB3YXMgZXhoYXVzdGl2ZVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGVkaXQgdHlwZTogJHt1bmtub3duVHlwZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluc2VydEZyYW1lKGNvbXBvbmVudElkOiBudW1iZXIsIHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPiwgZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIsIGZyYW1lSW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBmcmFtZVR5cGUgPSByZW5kZXJUcmVlRnJhbWUuZnJhbWVUeXBlKGZyYW1lKTtcclxuICAgIHN3aXRjaCAoZnJhbWVUeXBlKSB7XHJcbiAgICAgIGNhc2UgRnJhbWVUeXBlLmVsZW1lbnQ6XHJcbiAgICAgICAgdGhpcy5pbnNlcnRFbGVtZW50KGNvbXBvbmVudElkLCBwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lcywgZnJhbWUsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS50ZXh0OlxyXG4gICAgICAgIHRoaXMuaW5zZXJ0VGV4dChwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lKTtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuYXR0cmlidXRlOlxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQXR0cmlidXRlIGZyYW1lcyBzaG91bGQgb25seSBiZSBwcmVzZW50IGFzIGxlYWRpbmcgY2hpbGRyZW4gb2YgZWxlbWVudCBmcmFtZXMuJyk7XHJcbiAgICAgIGNhc2UgRnJhbWVUeXBlLmNvbXBvbmVudDpcclxuICAgICAgICB0aGlzLmluc2VydENvbXBvbmVudChwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lKTtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUucmVnaW9uOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydEZyYW1lUmFuZ2UoY29tcG9uZW50SWQsIHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWVzLCBmcmFtZUluZGV4ICsgMSwgZnJhbWVJbmRleCArIHJlbmRlclRyZWVGcmFtZS5zdWJ0cmVlTGVuZ3RoKGZyYW1lKSk7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgY29uc3QgdW5rbm93blR5cGU6IG5ldmVyID0gZnJhbWVUeXBlOyAvLyBDb21waWxlLXRpbWUgdmVyaWZpY2F0aW9uIHRoYXQgdGhlIHN3aXRjaCB3YXMgZXhoYXVzdGl2ZVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBmcmFtZSB0eXBlOiAke3Vua25vd25UeXBlfWApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5zZXJ0RWxlbWVudChjb21wb25lbnRJZDogbnVtYmVyLCBwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZnJhbWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4sIGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyLCBmcmFtZUluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHRhZ05hbWUgPSByZW5kZXJUcmVlRnJhbWUuZWxlbWVudE5hbWUoZnJhbWUpITtcclxuICAgIGNvbnN0IG5ld0RvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xyXG4gICAgaW5zZXJ0Tm9kZUludG9ET00obmV3RG9tRWxlbWVudCwgcGFyZW50LCBjaGlsZEluZGV4KTtcclxuXHJcbiAgICAvLyBBcHBseSBhdHRyaWJ1dGVzXHJcbiAgICBjb25zdCBkZXNjZW5kYW50c0VuZEluZGV4RXhjbCA9IGZyYW1lSW5kZXggKyByZW5kZXJUcmVlRnJhbWUuc3VidHJlZUxlbmd0aChmcmFtZSk7XHJcbiAgICBmb3IgKGxldCBkZXNjZW5kYW50SW5kZXggPSBmcmFtZUluZGV4ICsgMTsgZGVzY2VuZGFudEluZGV4IDwgZGVzY2VuZGFudHNFbmRJbmRleEV4Y2w7IGRlc2NlbmRhbnRJbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IGRlc2NlbmRhbnRGcmFtZSA9IGdldFRyZWVGcmFtZVB0cihmcmFtZXMsIGRlc2NlbmRhbnRJbmRleCk7XHJcbiAgICAgIGlmIChyZW5kZXJUcmVlRnJhbWUuZnJhbWVUeXBlKGRlc2NlbmRhbnRGcmFtZSkgPT09IEZyYW1lVHlwZS5hdHRyaWJ1dGUpIHtcclxuICAgICAgICB0aGlzLmFwcGx5QXR0cmlidXRlKGNvbXBvbmVudElkLCBuZXdEb21FbGVtZW50LCBkZXNjZW5kYW50RnJhbWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEFzIHNvb24gYXMgd2Ugc2VlIGEgbm9uLWF0dHJpYnV0ZSBjaGlsZCwgYWxsIHRoZSBzdWJzZXF1ZW50IGNoaWxkIGZyYW1lcyBhcmVcclxuICAgICAgICAvLyBub3QgYXR0cmlidXRlcywgc28gYmFpbCBvdXQgYW5kIGluc2VydCB0aGUgcmVtbmFudHMgcmVjdXJzaXZlbHlcclxuICAgICAgICB0aGlzLmluc2VydEZyYW1lUmFuZ2UoY29tcG9uZW50SWQsIG5ld0RvbUVsZW1lbnQsIDAsIGZyYW1lcywgZGVzY2VuZGFudEluZGV4LCBkZXNjZW5kYW50c0VuZEluZGV4RXhjbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluc2VydENvbXBvbmVudChwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpIHtcclxuICAgIC8vIEN1cnJlbnRseSwgdG8gc3VwcG9ydCBPKDEpIGxvb2t1cHMgZnJvbSByZW5kZXIgdHJlZSBmcmFtZXMgdG8gRE9NIG5vZGVzLCB3ZSByZWx5IG9uXHJcbiAgICAvLyBlYWNoIGNoaWxkIGNvbXBvbmVudCBleGlzdGluZyBhcyBhIHNpbmdsZSB0b3AtbGV2ZWwgZWxlbWVudCBpbiB0aGUgRE9NLiBUbyBndWFyYW50ZWVcclxuICAgIC8vIHRoYXQsIHdlIHdyYXAgY2hpbGQgY29tcG9uZW50cyBpbiB0aGVzZSAnYmxhem9yLWNvbXBvbmVudCcgd3JhcHBlcnMuXHJcbiAgICAvLyBUbyBpbXByb3ZlIG9uIHRoaXMgaW4gdGhlIGZ1dHVyZTpcclxuICAgIC8vIC0gSWYgd2UgY2FuIHN0YXRpY2FsbHkgZGV0ZWN0IHRoYXQgYSBnaXZlbiBjb21wb25lbnQgYWx3YXlzIHByb2R1Y2VzIGEgc2luZ2xlIHRvcC1sZXZlbFxyXG4gICAgLy8gICBlbGVtZW50IGFueXdheSwgdGhlbiBkb24ndCB3cmFwIGl0IGluIGEgZnVydGhlciBub25zdGFuZGFyZCBlbGVtZW50XHJcbiAgICAvLyAtIElmIHdlIHJlYWxseSB3YW50IHRvIHN1cHBvcnQgY2hpbGQgY29tcG9uZW50cyBwcm9kdWNpbmcgbXVsdGlwbGUgdG9wLWxldmVsIGZyYW1lcyBhbmRcclxuICAgIC8vICAgbm90IGJlaW5nIHdyYXBwZWQgaW4gYSBjb250YWluZXIgYXQgYWxsLCB0aGVuIGV2ZXJ5IHRpbWUgYSBjb21wb25lbnQgaXMgcmVmcmVzaGVkIGluXHJcbiAgICAvLyAgIHRoZSBET00sIHdlIGNvdWxkIHVwZGF0ZSBhbiBhcnJheSBvbiB0aGUgcGFyZW50IGVsZW1lbnQgdGhhdCBzcGVjaWZpZXMgaG93IG1hbnkgRE9NXHJcbiAgICAvLyAgIG5vZGVzIGNvcnJlc3BvbmQgdG8gZWFjaCBvZiBpdHMgcmVuZGVyIHRyZWUgZnJhbWVzLiBUaGVuIHdoZW4gdGhhdCBwYXJlbnQgd2FudHMgdG9cclxuICAgIC8vICAgbG9jYXRlIHRoZSBmaXJzdCBET00gbm9kZSBmb3IgYSByZW5kZXIgdHJlZSBmcmFtZSwgaXQgY2FuIHN1bSBhbGwgdGhlIGZyYW1lIGNvdW50cyBmb3JcclxuICAgIC8vICAgYWxsIHRoZSBwcmVjZWRpbmcgcmVuZGVyIHRyZWVzIGZyYW1lcy4gSXQncyBPKE4pLCBidXQgd2hlcmUgTiBpcyB0aGUgbnVtYmVyIG9mIHNpYmxpbmdzXHJcbiAgICAvLyAgIChjb3VudGluZyBjaGlsZCBjb21wb25lbnRzIGFzIGEgc2luZ2xlIGl0ZW0pLCBzbyBOIHdpbGwgcmFyZWx5IGlmIGV2ZXIgYmUgbGFyZ2UuXHJcbiAgICAvLyAgIFdlIGNvdWxkIGV2ZW4ga2VlcCB0cmFjayBvZiB3aGV0aGVyIGFsbCB0aGUgY2hpbGQgY29tcG9uZW50cyBoYXBwZW4gdG8gaGF2ZSBleGFjdGx5IDFcclxuICAgIC8vICAgdG9wIGxldmVsIGZyYW1lcywgYW5kIGluIHRoYXQgY2FzZSwgdGhlcmUncyBubyBuZWVkIHRvIHN1bSBhcyB3ZSBjYW4gZG8gZGlyZWN0IGxvb2t1cHMuXHJcbiAgICBjb25zdCBjb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYmxhem9yLWNvbXBvbmVudCcpO1xyXG4gICAgaW5zZXJ0Tm9kZUludG9ET00oY29udGFpbmVyRWxlbWVudCwgcGFyZW50LCBjaGlsZEluZGV4KTtcclxuXHJcbiAgICAvLyBBbGwgd2UgaGF2ZSB0byBkbyBpcyBhc3NvY2lhdGUgdGhlIGNoaWxkIGNvbXBvbmVudCBJRCB3aXRoIGl0cyBsb2NhdGlvbi4gV2UgZG9uJ3QgYWN0dWFsbHlcclxuICAgIC8vIGRvIGFueSByZW5kZXJpbmcgaGVyZSwgYmVjYXVzZSB0aGUgZGlmZiBmb3IgdGhlIGNoaWxkIHdpbGwgYXBwZWFyIGxhdGVyIGluIHRoZSByZW5kZXIgYmF0Y2guXHJcbiAgICBjb25zdCBjaGlsZENvbXBvbmVudElkID0gcmVuZGVyVHJlZUZyYW1lLmNvbXBvbmVudElkKGZyYW1lKTtcclxuICAgIHRoaXMuYXR0YWNoQ29tcG9uZW50VG9FbGVtZW50KGNoaWxkQ29tcG9uZW50SWQsIGNvbnRhaW5lckVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0VGV4dChwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgdGV4dEZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSB7XHJcbiAgICBjb25zdCB0ZXh0Q29udGVudCA9IHJlbmRlclRyZWVGcmFtZS50ZXh0Q29udGVudCh0ZXh0RnJhbWUpITtcclxuICAgIGNvbnN0IG5ld0RvbVRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dENvbnRlbnQpO1xyXG4gICAgaW5zZXJ0Tm9kZUludG9ET00obmV3RG9tVGV4dE5vZGUsIHBhcmVudCwgY2hpbGRJbmRleCk7XHJcbiAgfVxyXG5cclxuICBhcHBseUF0dHJpYnV0ZShjb21wb25lbnRJZDogbnVtYmVyLCB0b0RvbUVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJpYnV0ZUZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSB7XHJcbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gcmVuZGVyVHJlZUZyYW1lLmF0dHJpYnV0ZU5hbWUoYXR0cmlidXRlRnJhbWUpITtcclxuICAgIGNvbnN0IGJyb3dzZXJSZW5kZXJlcklkID0gdGhpcy5icm93c2VyUmVuZGVyZXJJZDtcclxuICAgIGNvbnN0IGV2ZW50SGFuZGxlcklkID0gcmVuZGVyVHJlZUZyYW1lLmF0dHJpYnV0ZUV2ZW50SGFuZGxlcklkKGF0dHJpYnV0ZUZyYW1lKTtcclxuXHJcbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ3ZhbHVlJykge1xyXG4gICAgICBpZiAodGhpcy50cnlBcHBseVZhbHVlUHJvcGVydHkodG9Eb21FbGVtZW50LCByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlVmFsdWUoYXR0cmlidXRlRnJhbWUpKSkge1xyXG4gICAgICAgIHJldHVybjsgLy8gSWYgdGhpcyBET00gZWxlbWVudCB0eXBlIGhhcyBzcGVjaWFsICd2YWx1ZScgaGFuZGxpbmcsIGRvbid0IGFsc28gd3JpdGUgaXQgYXMgYW4gYXR0cmlidXRlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBJbnN0ZWFkIG9mIGFwcGx5aW5nIHNlcGFyYXRlIGV2ZW50IGxpc3RlbmVycyB0byBlYWNoIERPTSBlbGVtZW50LCB1c2UgZXZlbnQgZGVsZWdhdGlvblxyXG4gICAgLy8gYW5kIHJlbW92ZSBhbGwgdGhlIF9ibGF6b3IqTGlzdGVuZXIgaGFja3NcclxuICAgIHN3aXRjaCAoYXR0cmlidXRlTmFtZSkge1xyXG4gICAgICBjYXNlICdvbmNsaWNrJzoge1xyXG4gICAgICAgIHRvRG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvRG9tRWxlbWVudFsnX2JsYXpvckNsaWNrTGlzdGVuZXInXSk7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBldnQgPT4gcmFpc2VFdmVudChldnQsIGJyb3dzZXJSZW5kZXJlcklkLCBjb21wb25lbnRJZCwgZXZlbnRIYW5kbGVySWQsICdtb3VzZScsIHsgVHlwZTogJ2NsaWNrJyB9KTtcclxuICAgICAgICB0b0RvbUVsZW1lbnRbJ19ibGF6b3JDbGlja0xpc3RlbmVyJ10gPSBsaXN0ZW5lcjtcclxuICAgICAgICB0b0RvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnb25jaGFuZ2UnOiB7XHJcbiAgICAgICAgdG9Eb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRvRG9tRWxlbWVudFsnX2JsYXpvckNoYW5nZUxpc3RlbmVyJ10pO1xyXG4gICAgICAgIGNvbnN0IHRhcmdldElzQ2hlY2tib3ggPSBpc0NoZWNrYm94KHRvRG9tRWxlbWVudCk7XHJcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBldnQgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB0YXJnZXRJc0NoZWNrYm94ID8gZXZ0LnRhcmdldC5jaGVja2VkIDogZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgIHJhaXNlRXZlbnQoZXZ0LCBicm93c2VyUmVuZGVyZXJJZCwgY29tcG9uZW50SWQsIGV2ZW50SGFuZGxlcklkLCAnY2hhbmdlJywgeyBUeXBlOiAnY2hhbmdlJywgVmFsdWU6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdG9Eb21FbGVtZW50WydfYmxhem9yQ2hhbmdlTGlzdGVuZXInXSA9IGxpc3RlbmVyO1xyXG4gICAgICAgIHRvRG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnb25rZXlwcmVzcyc6IHtcclxuICAgICAgICB0b0RvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0b0RvbUVsZW1lbnRbJ19ibGF6b3JLZXlwcmVzc0xpc3RlbmVyJ10pO1xyXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gZXZ0ID0+IHtcclxuICAgICAgICAgIC8vIFRoaXMgZG9lcyBub3QgYWNjb3VudCBmb3Igc3BlY2lhbCBrZXlzIG5vciBjcm9zcy1icm93c2VyIGRpZmZlcmVuY2VzLiBTbyBmYXIgaXQnc1xyXG4gICAgICAgICAgLy8ganVzdCB0byBlc3RhYmxpc2ggdGhhdCB3ZSBjYW4gcGFzcyBwYXJhbWV0ZXJzIHdoZW4gcmFpc2luZyBldmVudHMuXHJcbiAgICAgICAgICAvLyBXZSB1c2UgQyMtc3R5bGUgUGFzY2FsQ2FzZSBvbiB0aGUgZXZlbnRJbmZvIHRvIHNpbXBsaWZ5IGRlc2VyaWFsaXphdGlvbiwgYnV0IHRoaXMgY291bGRcclxuICAgICAgICAgIC8vIGNoYW5nZSBpZiB3ZSBpbnRyb2R1Y2VkIGEgcmljaGVyIEpTT04gbGlicmFyeSBvbiB0aGUgLk5FVCBzaWRlLlxyXG4gICAgICAgICAgcmFpc2VFdmVudChldnQsIGJyb3dzZXJSZW5kZXJlcklkLCBjb21wb25lbnRJZCwgZXZlbnRIYW5kbGVySWQsICdrZXlib2FyZCcsIHsgVHlwZTogZXZ0LnR5cGUsIEtleTogKGV2dCBhcyBhbnkpLmtleSB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRvRG9tRWxlbWVudFsnX2JsYXpvcktleXByZXNzTGlzdGVuZXInXSA9IGxpc3RlbmVyO1xyXG4gICAgICAgIHRvRG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGxpc3RlbmVyKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vIFRyZWF0IGFzIGEgcmVndWxhciBzdHJpbmctdmFsdWVkIGF0dHJpYnV0ZVxyXG4gICAgICAgIHRvRG9tRWxlbWVudC5zZXRBdHRyaWJ1dGUoXHJcbiAgICAgICAgICBhdHRyaWJ1dGVOYW1lLFxyXG4gICAgICAgICAgcmVuZGVyVHJlZUZyYW1lLmF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZUZyYW1lKSFcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdHJ5QXBwbHlWYWx1ZVByb3BlcnR5KGVsZW1lbnQ6IEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcgfCBudWxsKSB7XHJcbiAgICAvLyBDZXJ0YWluIGVsZW1lbnRzIGhhdmUgYnVpbHQtaW4gYmVoYXZpb3VyIGZvciB0aGVpciAndmFsdWUnIHByb3BlcnR5XHJcbiAgICBzd2l0Y2ggKGVsZW1lbnQudGFnTmFtZSkge1xyXG4gICAgICBjYXNlICdJTlBVVCc6XHJcbiAgICAgIGNhc2UgJ1NFTEVDVCc6XHJcbiAgICAgICAgaWYgKGlzQ2hlY2tib3goZWxlbWVudCkpIHtcclxuICAgICAgICAgIChlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSB2YWx1ZSA9PT0gJ1RydWUnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAoZWxlbWVudCBhcyBhbnkpLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ1NFTEVDVCcpIHtcclxuICAgICAgICAgICAgLy8gPHNlbGVjdD4gaXMgc3BlY2lhbCwgaW4gdGhhdCBhbnl0aGluZyB3ZSB3cml0ZSB0byAudmFsdWUgd2lsbCBiZSBsb3N0IGlmIHRoZXJlXHJcbiAgICAgICAgICAgIC8vIGlzbid0IHlldCBhIG1hdGNoaW5nIDxvcHRpb24+LiBUbyBtYWludGFpbiB0aGUgZXhwZWN0ZWQgYmVoYXZpb3Igbm8gbWF0dGVyIHRoZVxyXG4gICAgICAgICAgICAvLyBlbGVtZW50IGluc2VydGlvbi91cGRhdGUgb3JkZXIsIHByZXNlcnZlIHRoZSBkZXNpcmVkIHZhbHVlIHNlcGFyYXRlbHkgc29cclxuICAgICAgICAgICAgLy8gd2UgY2FuIHJlY292ZXIgaXQgd2hlbiBpbnNlcnRpbmcgYW55IG1hdGNoaW5nIDxvcHRpb24+LlxyXG4gICAgICAgICAgICBlbGVtZW50W3NlbGVjdFZhbHVlUHJvcG5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICBjYXNlICdPUFRJT04nOlxyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlISk7XHJcbiAgICAgICAgLy8gU2VlIGFib3ZlIGZvciB3aHkgd2UgaGF2ZSB0aGlzIHNwZWNpYWwgaGFuZGxpbmcgZm9yIDxzZWxlY3Q+LzxvcHRpb24+XHJcbiAgICAgICAgY29uc3QgcGFyZW50RWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICBpZiAocGFyZW50RWxlbWVudCAmJiAoc2VsZWN0VmFsdWVQcm9wbmFtZSBpbiBwYXJlbnRFbGVtZW50KSAmJiBwYXJlbnRFbGVtZW50W3NlbGVjdFZhbHVlUHJvcG5hbWVdID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgdGhpcy50cnlBcHBseVZhbHVlUHJvcGVydHkocGFyZW50RWxlbWVudCwgdmFsdWUpO1xyXG4gICAgICAgICAgZGVsZXRlIHBhcmVudEVsZW1lbnRbc2VsZWN0VmFsdWVQcm9wbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluc2VydEZyYW1lUmFuZ2UoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+LCBzdGFydEluZGV4OiBudW1iZXIsIGVuZEluZGV4RXhjbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG9yaWdDaGlsZEluZGV4ID0gY2hpbGRJbmRleDtcclxuICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleDsgaW5kZXggPCBlbmRJbmRleEV4Y2w7IGluZGV4KyspIHtcclxuICAgICAgY29uc3QgZnJhbWUgPSBnZXRUcmVlRnJhbWVQdHIoZnJhbWVzLCBpbmRleCk7XHJcbiAgICAgIGNvbnN0IG51bUNoaWxkcmVuSW5zZXJ0ZWQgPSB0aGlzLmluc2VydEZyYW1lKGNvbXBvbmVudElkLCBwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lcywgZnJhbWUsIGluZGV4KTtcclxuICAgICAgY2hpbGRJbmRleCArPSBudW1DaGlsZHJlbkluc2VydGVkO1xyXG5cclxuICAgICAgLy8gU2tpcCBvdmVyIGFueSBkZXNjZW5kYW50cywgc2luY2UgdGhleSBhcmUgYWxyZWFkeSBkZWFsdCB3aXRoIHJlY3Vyc2l2ZWx5XHJcbiAgICAgIGNvbnN0IHN1YnRyZWVMZW5ndGggPSByZW5kZXJUcmVlRnJhbWUuc3VidHJlZUxlbmd0aChmcmFtZSk7XHJcbiAgICAgIGlmIChzdWJ0cmVlTGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGluZGV4ICs9IHN1YnRyZWVMZW5ndGggLSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChjaGlsZEluZGV4IC0gb3JpZ0NoaWxkSW5kZXgpOyAvLyBUb3RhbCBudW1iZXIgb2YgY2hpbGRyZW4gaW5zZXJ0ZWRcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQ2hlY2tib3goZWxlbWVudDogRWxlbWVudCkge1xyXG4gIHJldHVybiBlbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94JztcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0Tm9kZUludG9ET00obm9kZTogTm9kZSwgcGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIpIHtcclxuICBpZiAoY2hpbGRJbmRleCA+PSBwYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnQuY2hpbGROb2Rlc1tjaGlsZEluZGV4XSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVOb2RlRnJvbURPTShwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlcikge1xyXG4gIHBhcmVudC5yZW1vdmVDaGlsZChwYXJlbnQuY2hpbGROb2Rlc1tjaGlsZEluZGV4XSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUF0dHJpYnV0ZUZyb21ET00ocGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZykge1xyXG4gIGNvbnN0IGVsZW1lbnQgPSBwYXJlbnQuY2hpbGROb2Rlc1tjaGlsZEluZGV4XSBhcyBFbGVtZW50O1xyXG4gIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByYWlzZUV2ZW50KGV2ZW50OiBFdmVudCwgYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgY29tcG9uZW50SWQ6IG51bWJlciwgZXZlbnRIYW5kbGVySWQ6IG51bWJlciwgZXZlbnRJbmZvVHlwZTogRXZlbnRJbmZvVHlwZSwgZXZlbnRJbmZvOiBhbnkpIHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBpZiAoIXJhaXNlRXZlbnRNZXRob2QpIHtcclxuICAgIHJhaXNlRXZlbnRNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxyXG4gICAgICAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXInLCAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXIuUmVuZGVyaW5nJywgJ0Jyb3dzZXJSZW5kZXJlckV2ZW50RGlzcGF0Y2hlcicsICdEaXNwYXRjaEV2ZW50J1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGV2ZW50RGVzY3JpcHRvciA9IHtcclxuICAgIEJyb3dzZXJSZW5kZXJlcklkOiBicm93c2VyUmVuZGVyZXJJZCxcclxuICAgIENvbXBvbmVudElkOiBjb21wb25lbnRJZCxcclxuICAgIEV2ZW50SGFuZGxlcklkOiBldmVudEhhbmRsZXJJZCxcclxuICAgIEV2ZW50QXJnc1R5cGU6IGV2ZW50SW5mb1R5cGVcclxuICB9O1xyXG5cclxuICBwbGF0Zm9ybS5jYWxsTWV0aG9kKHJhaXNlRXZlbnRNZXRob2QsIG51bGwsIFtcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKEpTT04uc3RyaW5naWZ5KGV2ZW50RGVzY3JpcHRvcikpLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSlcclxuICBdKTtcclxufVxyXG5cclxudHlwZSBFdmVudEluZm9UeXBlID0gJ21vdXNlJyB8ICdrZXlib2FyZCcgfCAnY2hhbmdlJztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9Ccm93c2VyUmVuZGVyZXIudHMiLCJpbXBvcnQgeyBTeXN0ZW1fQXJyYXksIFBvaW50ZXIgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5jb25zdCByZW5kZXJUcmVlRWRpdFN0cnVjdExlbmd0aCA9IDE2O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlbmRlclRyZWVFZGl0UHRyKHJlbmRlclRyZWVFZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcclxuICByZXR1cm4gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cihyZW5kZXJUcmVlRWRpdHMsIGluZGV4LCByZW5kZXJUcmVlRWRpdFN0cnVjdExlbmd0aCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJUcmVlRWRpdCA9IHtcclxuICAvLyBUaGUgcHJvcGVydGllcyBhbmQgbWVtb3J5IGxheW91dCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gUmVuZGVyVHJlZUVkaXQuY3NcclxuICB0eXBlOiAoZWRpdDogUmVuZGVyVHJlZUVkaXRQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0LCAwKSBhcyBFZGl0VHlwZSxcclxuICBzaWJsaW5nSW5kZXg6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGVkaXQsIDQpLFxyXG4gIG5ld1RyZWVJbmRleDogKGVkaXQ6IFJlbmRlclRyZWVFZGl0UG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZWRpdCwgOCksXHJcbiAgcmVtb3ZlZEF0dHJpYnV0ZU5hbWU6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChlZGl0LCAxMiksXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBFZGl0VHlwZSB7XHJcbiAgcHJlcGVuZEZyYW1lID0gMSxcclxuICByZW1vdmVGcmFtZSA9IDIsXHJcbiAgc2V0QXR0cmlidXRlID0gMyxcclxuICByZW1vdmVBdHRyaWJ1dGUgPSA0LFxyXG4gIHVwZGF0ZVRleHQgPSA1LFxyXG4gIHN0ZXBJbiA9IDYsXHJcbiAgc3RlcE91dCA9IDcsXHJcbn1cclxuXHJcbi8vIE5vbWluYWwgdHlwZSB0byBlbnN1cmUgb25seSB2YWxpZCBwb2ludGVycyBhcmUgcGFzc2VkIHRvIHRoZSByZW5kZXJUcmVlRWRpdCBmdW5jdGlvbnMuXHJcbi8vIEF0IHJ1bnRpbWUgdGhlIHZhbHVlcyBhcmUganVzdCBudW1iZXJzLlxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVFZGl0UG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJUcmVlRWRpdFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUVkaXQudHMiLCJpbXBvcnQgeyBTeXN0ZW1fU3RyaW5nLCBTeXN0ZW1fQXJyYXksIFBvaW50ZXIgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5jb25zdCByZW5kZXJUcmVlRnJhbWVTdHJ1Y3RMZW5ndGggPSAyODtcclxuXHJcbi8vIFRvIG1pbmltaXNlIEdDIHByZXNzdXJlLCBpbnN0ZWFkIG9mIGluc3RhbnRpYXRpbmcgYSBKUyBvYmplY3QgdG8gcmVwcmVzZW50IGVhY2ggdHJlZSBmcmFtZSxcclxuLy8gd2Ugd29yayBpbiB0ZXJtcyBvZiBwb2ludGVycyB0byB0aGUgc3RydWN0cyBvbiB0aGUgLk5FVCBoZWFwLCBhbmQgdXNlIHN0YXRpYyBmdW5jdGlvbnMgdGhhdFxyXG4vLyBrbm93IGhvdyB0byByZWFkIHByb3BlcnR5IHZhbHVlcyBmcm9tIHRob3NlIHN0cnVjdHMuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJlZUZyYW1lUHRyKHJlbmRlclRyZWVFbnRyaWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcclxuICByZXR1cm4gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cihyZW5kZXJUcmVlRW50cmllcywgaW5kZXgsIHJlbmRlclRyZWVGcmFtZVN0cnVjdExlbmd0aCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJUcmVlRnJhbWUgPSB7XHJcbiAgLy8gVGhlIHByb3BlcnRpZXMgYW5kIG1lbW9yeSBsYXlvdXQgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgLk5FVCBlcXVpdmFsZW50IGluIFJlbmRlclRyZWVGcmFtZS5jc1xyXG4gIGZyYW1lVHlwZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgNCkgYXMgRnJhbWVUeXBlLFxyXG4gIHN1YnRyZWVMZW5ndGg6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZnJhbWUsIDgpIGFzIEZyYW1lVHlwZSxcclxuICBjb21wb25lbnRJZDogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgMTIpLFxyXG4gIGVsZW1lbnROYW1lOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSwgMTYpLFxyXG4gIHRleHRDb250ZW50OiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSwgMTYpLFxyXG4gIGF0dHJpYnV0ZU5hbWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAxNiksXHJcbiAgYXR0cmlidXRlVmFsdWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAyNCksXHJcbiAgYXR0cmlidXRlRXZlbnRIYW5kbGVySWQ6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZnJhbWUsIDgpLFxyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gRnJhbWVUeXBlIHtcclxuICAvLyBUaGUgdmFsdWVzIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBSZW5kZXJUcmVlRnJhbWVUeXBlLmNzXHJcbiAgZWxlbWVudCA9IDEsXHJcbiAgdGV4dCA9IDIsXHJcbiAgYXR0cmlidXRlID0gMyxcclxuICBjb21wb25lbnQgPSA0LFxyXG4gIHJlZ2lvbiA9IDUsXHJcbn1cclxuXHJcbi8vIE5vbWluYWwgdHlwZSB0byBlbnN1cmUgb25seSB2YWxpZCBwb2ludGVycyBhcmUgcGFzc2VkIHRvIHRoZSByZW5kZXJUcmVlRnJhbWUgZnVuY3Rpb25zLlxyXG4vLyBBdCBydW50aW1lIHRoZSB2YWx1ZXMgYXJlIGp1c3QgbnVtYmVycy5cclxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJUcmVlRnJhbWVQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlclRyZWVGcmFtZVBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUZyYW1lLnRzIiwiaW1wb3J0IHsgcmVnaXN0ZXJGdW5jdGlvbiB9IGZyb20gJy4uL0ludGVyb3AvUmVnaXN0ZXJlZEZ1bmN0aW9uJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IE1ldGhvZEhhbmRsZSwgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuY29uc3QgaHR0cENsaWVudEFzc2VtYmx5ID0gJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJztcclxuY29uc3QgaHR0cENsaWVudE5hbWVzcGFjZSA9IGAke2h0dHBDbGllbnRBc3NlbWJseX0uSHR0cGA7XHJcbmNvbnN0IGh0dHBDbGllbnRUeXBlTmFtZSA9ICdCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyJztcclxuY29uc3QgaHR0cENsaWVudEZ1bGxUeXBlTmFtZSA9IGAke2h0dHBDbGllbnROYW1lc3BhY2V9LiR7aHR0cENsaWVudFR5cGVOYW1lfWA7XHJcbmxldCByZWNlaXZlUmVzcG9uc2VNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7aHR0cENsaWVudEZ1bGxUeXBlTmFtZX0uU2VuZGAsIChpZDogbnVtYmVyLCBtZXRob2Q6IHN0cmluZywgcmVxdWVzdFVyaTogc3RyaW5nLCBib2R5OiBzdHJpbmcgfCBudWxsLCBoZWFkZXJzSnNvbjogc3RyaW5nIHwgbnVsbCkgPT4ge1xyXG4gIHNlbmRBc3luYyhpZCwgbWV0aG9kLCByZXF1ZXN0VXJpLCBib2R5LCBoZWFkZXJzSnNvbik7XHJcbn0pO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2VuZEFzeW5jKGlkOiBudW1iZXIsIG1ldGhvZDogc3RyaW5nLCByZXF1ZXN0VXJpOiBzdHJpbmcsIGJvZHk6IHN0cmluZyB8IG51bGwsIGhlYWRlcnNKc29uOiBzdHJpbmcgfCBudWxsKSB7XHJcbiAgbGV0IHJlc3BvbnNlOiBSZXNwb25zZTtcclxuICBsZXQgcmVzcG9uc2VUZXh0OiBzdHJpbmc7XHJcbiAgdHJ5IHtcclxuICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdFVyaSwge1xyXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgYm9keTogYm9keSB8fCB1bmRlZmluZWQsXHJcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnNKc29uID8gKEpTT04ucGFyc2UoaGVhZGVyc0pzb24pIGFzIHN0cmluZ1tdW10pIDogdW5kZWZpbmVkXHJcbiAgICB9KTtcclxuICAgIHJlc3BvbnNlVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICB9IGNhdGNoIChleCkge1xyXG4gICAgZGlzcGF0Y2hFcnJvclJlc3BvbnNlKGlkLCBleC50b1N0cmluZygpKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGRpc3BhdGNoU3VjY2Vzc1Jlc3BvbnNlKGlkLCByZXNwb25zZSwgcmVzcG9uc2VUZXh0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2hTdWNjZXNzUmVzcG9uc2UoaWQ6IG51bWJlciwgcmVzcG9uc2U6IFJlc3BvbnNlLCByZXNwb25zZVRleHQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHJlc3BvbnNlRGVzY3JpcHRvcjogUmVzcG9uc2VEZXNjcmlwdG9yID0ge1xyXG4gICAgU3RhdHVzQ29kZTogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgSGVhZGVyczogW11cclxuICB9O1xyXG4gIHJlc3BvbnNlLmhlYWRlcnMuZm9yRWFjaCgodmFsdWUsIG5hbWUpID0+IHtcclxuICAgIHJlc3BvbnNlRGVzY3JpcHRvci5IZWFkZXJzLnB1c2goW25hbWUsIHZhbHVlXSk7XHJcbiAgfSk7XHJcblxyXG4gIGRpc3BhdGNoUmVzcG9uc2UoXHJcbiAgICBpZCxcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlRGVzY3JpcHRvcikpLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcocmVzcG9uc2VUZXh0KSwgLy8gVE9ETzogQ29uc2lkZXIgaG93IHRvIGhhbmRsZSBub24tc3RyaW5nIHJlc3BvbnNlc1xyXG4gICAgLyogZXJyb3JNZXNzYWdlICovIG51bGxcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaEVycm9yUmVzcG9uc2UoaWQ6IG51bWJlciwgZXJyb3JNZXNzYWdlOiBzdHJpbmcpIHtcclxuICBkaXNwYXRjaFJlc3BvbnNlKFxyXG4gICAgaWQsXHJcbiAgICAvKiByZXNwb25zZURlc2NyaXB0b3IgKi8gbnVsbCxcclxuICAgIC8qIHJlc3BvbnNlVGV4dCAqLyBudWxsLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoZXJyb3JNZXNzYWdlKVxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoUmVzcG9uc2UoaWQ6IG51bWJlciwgcmVzcG9uc2VEZXNjcmlwdG9yOiBTeXN0ZW1fU3RyaW5nIHwgbnVsbCwgcmVzcG9uc2VUZXh0OiBTeXN0ZW1fU3RyaW5nIHwgbnVsbCwgZXJyb3JNZXNzYWdlOiBTeXN0ZW1fU3RyaW5nIHwgbnVsbCkge1xyXG4gIGlmICghcmVjZWl2ZVJlc3BvbnNlTWV0aG9kKSB7XHJcbiAgICByZWNlaXZlUmVzcG9uc2VNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxyXG4gICAgICBodHRwQ2xpZW50QXNzZW1ibHksXHJcbiAgICAgIGh0dHBDbGllbnROYW1lc3BhY2UsXHJcbiAgICAgIGh0dHBDbGllbnRUeXBlTmFtZSxcclxuICAgICAgJ1JlY2VpdmVSZXNwb25zZSdcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwbGF0Zm9ybS5jYWxsTWV0aG9kKHJlY2VpdmVSZXNwb25zZU1ldGhvZCwgbnVsbCwgW1xyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoaWQudG9TdHJpbmcoKSksXHJcbiAgICByZXNwb25zZURlc2NyaXB0b3IsXHJcbiAgICByZXNwb25zZVRleHQsXHJcbiAgICBlcnJvck1lc3NhZ2UsXHJcbiAgXSk7XHJcbn1cclxuXHJcbi8vIEtlZXAgdGhpcyBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBIdHRwQ2xpZW50LmNzXHJcbmludGVyZmFjZSBSZXNwb25zZURlc2NyaXB0b3Ige1xyXG4gIC8vIFdlIGRvbid0IGhhdmUgQm9keVRleHQgaW4gaGVyZSBiZWNhdXNlIGlmIHdlIGRpZCwgdGhlbiBpbiB0aGUgSlNPTi1yZXNwb25zZSBjYXNlICh3aGljaFxyXG4gIC8vIGlzIHRoZSBtb3N0IGNvbW1vbiBjYXNlKSwgd2UnZCBiZSBkb3VibGUtZW5jb2RpbmcgaXQsIHNpbmNlIHRoZSBlbnRpcmUgUmVzcG9uc2VEZXNjcmlwdG9yXHJcbiAgLy8gYWxzbyBnZXRzIEpTT04gZW5jb2RlZC4gSXQgd291bGQgd29yayBidXQgaXMgdHdpY2UgdGhlIGFtb3VudCBvZiBzdHJpbmcgcHJvY2Vzc2luZy5cclxuICBTdGF0dXNDb2RlOiBudW1iZXI7XHJcbiAgSGVhZGVyczogc3RyaW5nW11bXTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2VydmljZXMvSHR0cC50cyIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi9FbnZpcm9ubWVudCdcclxuaW1wb3J0IHsgcmVnaXN0ZXJGdW5jdGlvbiB9IGZyb20gJy4vSW50ZXJvcC9SZWdpc3RlcmVkRnVuY3Rpb24nO1xyXG5pbXBvcnQgeyBuYXZpZ2F0ZVRvIH0gZnJvbSAnLi9TZXJ2aWNlcy9VcmlIZWxwZXInO1xyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgLy8gV2hlbiB0aGUgbGlicmFyeSBpcyBsb2FkZWQgaW4gYSBicm93c2VyIHZpYSBhIDxzY3JpcHQ+IGVsZW1lbnQsIG1ha2UgdGhlXHJcbiAgLy8gZm9sbG93aW5nIEFQSXMgYXZhaWxhYmxlIGluIGdsb2JhbCBzY29wZSBmb3IgaW52b2NhdGlvbiBmcm9tIEpTXHJcbiAgd2luZG93WydCbGF6b3InXSA9IHtcclxuICAgIHBsYXRmb3JtLFxyXG4gICAgcmVnaXN0ZXJGdW5jdGlvbixcclxuICAgIG5hdmlnYXRlVG8sXHJcbiAgfTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR2xvYmFsRXhwb3J0cy50cyJdLCJzb3VyY2VSb290IjoiIn0=