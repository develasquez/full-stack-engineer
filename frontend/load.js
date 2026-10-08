import { initializeApp } from "./main.js";

async function loadComponent(url, elementId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) element.innerHTML = html;
    const cssUrl = url.replace(".html", ".css");
    loadCSS(cssUrl);
  } catch (error) {
    if (!error.message.includes('404')) console.error(`Component load error for ${url}:`, error);
  }
}

function loadCSS(url) {
  if (document.querySelector(`link[href="${url}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

async function main() {
  await Promise.all([
    loadComponent("/components/header/header.html", "header-container"),
    loadComponent("/components/chaos-panel/chaos-panel.html", "chaos-container"),
    loadComponent("/components/catalog/catalog.html", "catalog-container"),
  ]);
  setTimeout(initializeApp, 0);
}

main();
