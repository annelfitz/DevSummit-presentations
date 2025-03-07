/** Calcite demo application boilerplate functionality - not related to demo content */

const toggleModeEl = document.getElementById("toggle-mode");
const toggleModalEl = document.getElementById("toggle-modal");

const navigationEl = document.getElementById("nav");
const panelEl = document.getElementById("sheet-panel");
const modalEl = document.getElementById("modal");
const sheetEl = document.getElementById("sheet");
const darkModeCss = document.getElementById("jsapi-mode-dark");
const lightModeCss = document.getElementById("jsapi-mode-light");
const arcgisMap = document.querySelector("arcgis-map");

let mode = "light";

toggleModeEl.addEventListener("click", () => handleModeChange());
toggleModalEl.addEventListener("click", () => handleModalChange());
navigationEl.addEventListener("calciteNavigationActionSelect", () => handleSheetOpen());

panelEl.addEventListener("calcitePanelClose", () => handlePanelClose());

function handleModeChange() {
  mode = mode === "dark" ? "light" : "dark";
  const isDarkMode = mode === "dark";
  darkModeCss.disabled = !darkModeCss.disabled;
  lightModeCss.disabled = !lightModeCss.disabled;
  arcgisMap.itemId = isDarkMode ? "d5dda743788a4b0688fe48f43ae7beb9" : "05e015c5f0314db9a487a9b46cb37eca";
  toggleModeEl.icon = isDarkMode ? "moon" : "brightness";
  document.body.className = isDarkMode ? "calcite-mode-dark" : undefined;

  // maps sdk workaround
  const inverseMode = mode === "light" ? "dark" : "light";
  const elements = document.getElementsByClassName(`calcite-mode-${inverseMode}`);
  for (let i = 0; i < elements.length; i++) {
    const node = elements[i];
    node.classList.remove(`calcite-mode-${inverseMode}`);
    node.classList.add(`calcite-mode-${mode}`);
  }
}

function handleModalChange() {
  modalEl.open = !modalEl.open;
}

function handleSheetOpen() {
  sheetEl.open = true;
  panelEl.closed = false;
}

function handlePanelClose() {
  sheetEl.open = false;
}
