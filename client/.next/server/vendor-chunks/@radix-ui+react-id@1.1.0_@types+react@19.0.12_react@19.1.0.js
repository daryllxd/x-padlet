"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@radix-ui+react-id@1.1.0_@types+react@19.0.12_react@19.1.0";
exports.ids = ["vendor-chunks/@radix-ui+react-id@1.1.0_@types+react@19.0.12_react@19.1.0"];
exports.modules = {

/***/ "(ssr)/../node_modules/.pnpm/@radix-ui+react-id@1.1.0_@types+react@19.0.12_react@19.1.0/node_modules/@radix-ui/react-id/dist/index.mjs":
/*!***************************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@radix-ui+react-id@1.1.0_@types+react@19.0.12_react@19.1.0/node_modules/@radix-ui/react-id/dist/index.mjs ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useId: () => (/* binding */ useId)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/../node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ \"(ssr)/../node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.0_@types+react@19.0.12_react@19.1.0/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs\");\n// packages/react/id/src/id.tsx\n\n\nvar useReactId = /*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))[\"useId\".toString()] || (() => void 0);\nvar count = 0;\nfunction useId(deterministicId) {\n  const [id, setId] = react__WEBPACK_IMPORTED_MODULE_0__.useState(useReactId());\n  (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {\n    if (!deterministicId) setId((reactId) => reactId ?? String(count++));\n  }, [deterministicId]);\n  return deterministicId || (id ? `radix-${id}` : \"\");\n}\n\n//# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0ByYWRpeC11aStyZWFjdC1pZEAxLjEuMF9AdHlwZXMrcmVhY3RAMTkuMC4xMl9yZWFjdEAxOS4xLjAvbm9kZV9tb2R1bGVzL0ByYWRpeC11aS9yZWFjdC1pZC9kaXN0L2luZGV4Lm1qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDK0I7QUFDcUM7QUFDcEUsaUJBQWlCLHlMQUFLO0FBQ3RCO0FBQ0E7QUFDQSxzQkFBc0IsMkNBQWM7QUFDcEMsRUFBRSxrRkFBZTtBQUNqQjtBQUNBLEdBQUc7QUFDSCwyQ0FBMkMsR0FBRztBQUM5QztBQUdFO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXJ5bGwvRG9jdW1lbnRzL3JhaWxzLXByb2plY3RzL3gtcGFkbGV0L25vZGVfbW9kdWxlcy8ucG5wbS9AcmFkaXgtdWkrcmVhY3QtaWRAMS4xLjBfQHR5cGVzK3JlYWN0QDE5LjAuMTJfcmVhY3RAMTkuMS4wL25vZGVfbW9kdWxlcy9AcmFkaXgtdWkvcmVhY3QtaWQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFja2FnZXMvcmVhY3QvaWQvc3JjL2lkLnRzeFxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB1c2VMYXlvdXRFZmZlY3QgfSBmcm9tIFwiQHJhZGl4LXVpL3JlYWN0LXVzZS1sYXlvdXQtZWZmZWN0XCI7XG52YXIgdXNlUmVhY3RJZCA9IFJlYWN0W1widXNlSWRcIi50b1N0cmluZygpXSB8fCAoKCkgPT4gdm9pZCAwKTtcbnZhciBjb3VudCA9IDA7XG5mdW5jdGlvbiB1c2VJZChkZXRlcm1pbmlzdGljSWQpIHtcbiAgY29uc3QgW2lkLCBzZXRJZF0gPSBSZWFjdC51c2VTdGF0ZSh1c2VSZWFjdElkKCkpO1xuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghZGV0ZXJtaW5pc3RpY0lkKSBzZXRJZCgocmVhY3RJZCkgPT4gcmVhY3RJZCA/PyBTdHJpbmcoY291bnQrKykpO1xuICB9LCBbZGV0ZXJtaW5pc3RpY0lkXSk7XG4gIHJldHVybiBkZXRlcm1pbmlzdGljSWQgfHwgKGlkID8gYHJhZGl4LSR7aWR9YCA6IFwiXCIpO1xufVxuZXhwb3J0IHtcbiAgdXNlSWRcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/.pnpm/@radix-ui+react-id@1.1.0_@types+react@19.0.12_react@19.1.0/node_modules/@radix-ui/react-id/dist/index.mjs\n");

/***/ })

};
;