import {
  __toESM,
  require_react
} from "./chunk-QSQYAWSL.js";

// node_modules/react-use-localstorage/dist/react-use-localstorage.esm.js
var import_react = __toESM(require_react());
function useLocalStorage(key, initialValue) {
  if (initialValue === void 0) {
    initialValue = "";
  }
  var _useState = (0, import_react.useState)(function() {
    return window.localStorage.getItem(key) || initialValue;
  }), value = _useState[0], setValue = _useState[1];
  var setItem = function setItem2(newValue) {
    setValue(newValue);
    window.localStorage.setItem(key, newValue);
  };
  (0, import_react.useEffect)(function() {
    var newValue = window.localStorage.getItem(key);
    if (value !== newValue) {
      setValue(newValue || initialValue);
    }
  });
  var handleStorage = (0, import_react.useCallback)(function(event) {
    if (event.key === key && event.newValue !== value) {
      setValue(event.newValue || initialValue);
    }
  }, [value]);
  (0, import_react.useEffect)(function() {
    window.addEventListener("storage", handleStorage);
    return function() {
      return window.removeEventListener("storage", handleStorage);
    };
  }, [handleStorage]);
  return [value, setItem];
}
var react_use_localstorage_esm_default = useLocalStorage;
export {
  react_use_localstorage_esm_default as default
};
//# sourceMappingURL=react-use-localstorage.js.map
