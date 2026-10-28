"use strict";

const filterBar = document.querySelector(".filter-bar");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projects = [...document.querySelectorAll(".project")];
const count = document.querySelector(".filter-count");
const printButton = document.querySelector(".print-button");
let selectedFilter = "all";
let printState = null;

function filterProjects(category) {
  selectedFilter = category;
  for (const button of filterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === category));
  }
  for (const project of projects) {
    project.hidden = category !== "all" && project.dataset.category !== category;
  }
  const visibleCount = projects.filter((project) => !project.hidden).length;
  count.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
}

filterBar.hidden = false;
printButton.hidden = false;
for (const button of filterButtons) {
  button.addEventListener("click", () => filterProjects(button.dataset.filter));
}

function revealLinkedProject() {
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target || !target.classList.contains("project")) return;
  filterProjects("all");
  target.querySelector("details").open = true;
  target.scrollIntoView({ behavior: "instant", block: "start" });
}

window.addEventListener("hashchange", revealLinkedProject);
revealLinkedProject();

window.addEventListener("beforeprint", () => {
  if (printState) return;
  printState = {
    filter: selectedFilter,
    details: [...document.querySelectorAll("details")].map((item) => [item, item.open]),
  };
  filterProjects("all");
  for (const [item] of printState.details) item.open = true;
});

window.addEventListener("afterprint", () => {
  if (!printState) return;
  for (const [item, open] of printState.details) item.open = open;
  filterProjects(printState.filter);
  printState = null;
});

printButton.addEventListener("click", () => window.print());
