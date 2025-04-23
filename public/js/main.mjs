import { setupUI, setupEventListeners } from "./ui.mjs";

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello");
    setupUI();
    setupEventListeners();
  });