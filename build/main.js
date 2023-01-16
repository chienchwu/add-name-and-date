(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/@create-figma-plugin/utilities/lib/string/format-message.js
  function formatSuccessMessage(message) {
    return `${CHECK} ${SPACE} ${message}`;
  }
  function formatWarningMessage(message) {
    return `${WARNING} ${SPACE} ${message}`;
  }
  var CHECK, WARNING, SPACE;
  var init_format_message = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/string/format-message.js"() {
      CHECK = "\u2714";
      WARNING = "\u26A0";
      SPACE = "\xA0";
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/index.js
  var init_lib = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
      init_format_message();
    }
  });

  // src/add-name-and-date.ts
  var add_name_and_date_exports = {};
  __export(add_name_and_date_exports, {
    default: () => main
  });
  async function main() {
    var _a;
    let name = (_a = figma.currentUser) == null ? void 0 : _a.name;
    if (name) {
      name = name.split(" ")[0].trim();
      name = name.split("-")[0].trim();
    } else {
      name = "";
    }
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1e3);
    let dateStr = date.toISOString().split("T")[0];
    const signature = `- ${name} ${dateStr}`;
    let num = 0;
    async function addSignature(node) {
      if (node.type === "TEXT") {
        if (typeof node.fontName != "symbol") {
          await figma.loadFontAsync({ family: node.fontName.family, style: node.fontName.style });
          node.insertCharacters(node.characters.length, `
${signature}`);
          num++;
        } else if (typeof node.fontName === "symbol") {
          let segments = node.getStyledTextSegments(["fontName"]);
          for (let segment of segments) {
            await figma.loadFontAsync({ family: segment.fontName.family, style: segment.fontName.style });
          }
          node.insertCharacters(node.characters.length, `
${signature}`, "BEFORE");
          num++;
        }
      } else if (["FRAME", "GROUP", "SECTION"].includes(node.type)) {
        node.name = `${node.name.trim()} ${signature}`;
        num++;
      }
    }
    let nodes = figma.currentPage.selection;
    if (nodes.length > 0) {
      for (let node of nodes) {
        await addSignature(node);
      }
      figma.closePlugin(formatSuccessMessage(`${num} items have your signature.`));
    } else {
      figma.closePlugin(formatWarningMessage(`Select at least one text or region layer to add your name.`));
    }
  }
  var init_add_name_and_date = __esm({
    "src/add-name-and-date.ts"() {
      "use strict";
      init_lib();
    }
  });

  // <stdin>
  var modules = { "src/add-name-and-date.ts--default": (init_add_name_and_date(), __toCommonJS(add_name_and_date_exports))["default"] };
  var commandId = true ? "src/add-name-and-date.ts--default" : figma.command;
  modules[commandId]();
})();
