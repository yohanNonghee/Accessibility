"use strict";

const resultsContainer = document.querySelector("#movie-results");
const resultsCount = document.querySelector("#results-count");
const emptyResults = document.querySelector("#empty-results");
const searchInput = document.querySelector("#movie-search");
const savedContainer = document.querySelector("#saved-results");
const savedEmpty = document.querySelector("#saved-empty");
const savedCount = document.querySelector("#saved-count");
const savedHeadingCount = document.querySelector("#saved-heading-count");
const storageNotice = document.querySelector("#storage-notice");
const watchlistStatus = document.querySelector("#watchlist-status");
const dialog = document.querySelector("#movie-dialog");
const dialogClose = document.querySelector("#dialog-close");
const dialogTitle = document.querySelector("#dialog-title");
const dialogMeta = document.querySelector("#dialog-meta");
const dialogDirector = document.querySelector("#dialog-director");
const dialogDescription = document.querySelector("#dialog-description");
const dialogPoster = document.querySelector("#dialog-poster");
const dialogSave = document.querySelector("#dialog-save");
const signupForm = document.querySelector("#signup-form");
const formMessage = document.querySelector("#form-message");

let movies = [];
let savedIds = loadSavedIds();
let activeMovie = null;
let dialogOpener = null;

function loadSavedIds() {
  try {
    const stored = JSON.parse(localStorage.getItem("reel-good-saved") || "[]");
    return Array.isArray(stored) ? stored.filter((id) => Number.isInteger(id)) : [];
  } catch (error) {
    storageNotice.hidden = false;
    storageNotice.textContent = "Your browser could not load your saved movies. You can still save films during this visit.";
    return [];
  }
}

function saveSavedIds() {
  try {
    localStorage.setItem("reel-good-saved", JSON.stringify(savedIds));
    storageNotice.hidden = true;
    storageNotice.textContent = "";
    return true;
  } catch (error) {
    storageNotice.hidden = false;
    storageNotice.textContent = "Your browser could not store your watchlist. Saved films will be available until you leave this page.";
    return false;
  }
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[character]);
}

function posterSource(movie) {
  const palettes = [
    ["#172c34", "#e98759", "#f4d7a1"],
    ["#183e53", "#8ba6a2", "#e8d2a7"],
    ["#292c3d", "#b74738", "#f0c17d"],
    ["#2f4035", "#d78055", "#eee1c3"],
    ["#174b54", "#d8a150", "#f5e1b5"],
    ["#101b25", "#b72e32", "#d9d7bd"],
    ["#583f2a", "#b57b42", "#f0d093"],
    ["#4c2b43", "#df7653", "#f2cb7d"]
  ];
  const [background, accent, light] = palettes[(movie.id - 1) % palettes.length];
  const title = escapeXml(movie.title.toUpperCase());
  const genre = escapeXml(movie.genre.toUpperCase());
  const titleSize = movie.title.length > 17 ? 27 : 34;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560"><rect width="420" height="560" fill="${background}"/><circle cx="335" cy="106" r="95" fill="${accent}" opacity=".72"/><circle cx="335" cy="106" r="61" fill="${light}" opacity=".34"/><path d="M0 400 150 245l103 103 83-88 84 78v222H0z" fill="${accent}" opacity=".62"/><path d="M0 464 110 350l92 92 94-112 124 117v113H0z" fill="${background}" opacity=".72"/><path d="M35 42h350M35 518h350" stroke="${light}" stroke-opacity=".65"/><text x="35" y="77" fill="${light}" font-family="Arial,sans-serif" font-size="13" letter-spacing="4">${genre}</text><text x="35" y="444" fill="${light}" font-family="Georgia,serif" font-size="${titleSize}" font-weight="bold">${title}</text><text x="35" y="490" fill="${light}" font-family="Arial,sans-serif" font-size="16" letter-spacing="3">${movie.year} · REEL GOOD</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makePoster(movie, className = "") {
  const image = document.createElement("img");
  image.src = posterSource(movie);
  image.alt = `Poster for the movie ${movie.title}`;
  if (className) image.className = className;
  return image;
}

function createSaveButton(movie, context = "results") {
  const isSaved = savedIds.includes(movie.id);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `save-button${isSaved ? " is-saved" : ""}`;
  button.dataset.saveMovieId = String(movie.id);
  button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${movie.title}${isSaved ? " from watchlist" : ""}`);
  button.setAttribute("aria-pressed", String(isSaved));
  button.innerHTML = `<span aria-hidden="true">${isSaved ? "✓" : "♡"}</span>`;
  button.addEventListener("click", () => toggleSaved(movie.id, context));
  return button;
}

function openDetails(movie, opener) {
  activeMovie = movie;
  dialogOpener = opener;
  dialogTitle.textContent = movie.title;
  dialogMeta.textContent = `${movie.genre} · ${movie.year}`;
  dialogDirector.textContent = `Directed by ${movie.director}`;
  dialogDescription.textContent = movie.description;
  dialogPoster.replaceChildren(makePoster(movie));
  updateDialogSave();
  dialog.showModal();
  dialogTitle.focus();
}

function updateDialogSave() {
  if (!activeMovie) return;
  const isSaved = savedIds.includes(activeMovie.id);
  dialogSave.textContent = `${isSaved ? "✓ Saved" : "♡ Save"} ${activeMovie.title}${isSaved ? " to watchlist" : ""}`;
  dialogSave.setAttribute("aria-pressed", String(isSaved));
  dialogSave.classList.toggle("is-saved", isSaved);
}

function closeDetails() {
  if (dialog.open) dialog.close();
}

function renderMovies() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matches = movies.filter((movie) =>
    [movie.title, movie.genre, movie.director, String(movie.year)]
      .some((value) => value.toLocaleLowerCase().includes(query))
  );
  resultsContainer.replaceChildren();
  resultsCount.textContent = `${matches.length} ${matches.length === 1 ? "film" : "films"} found`;
  emptyResults.hidden = matches.length > 0;

  for (const movie of matches) {
    const card = document.createElement("article");
    card.className = "movie-card";

    const posterButton = document.createElement("button");
    posterButton.type = "button";
    posterButton.className = "poster-button";
    posterButton.setAttribute("aria-label", `View details for ${movie.title}`);
    posterButton.append(makePoster(movie));
    const posterLabel = document.createElement("span");
    posterLabel.className = "poster-label";
    posterLabel.textContent = "View film details";
    posterLabel.setAttribute("aria-hidden", "true");
    posterButton.append(posterLabel);
    posterButton.addEventListener("click", () => openDetails(movie, posterButton));

    const heading = document.createElement("h3");
    heading.textContent = movie.title;
    const meta = document.createElement("p");
    meta.className = "movie-meta";
    meta.textContent = `${movie.genre} · ${movie.year}`;

    const actions = document.createElement("div");
    actions.className = "movie-actions";
    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "details-link";
    detailsButton.textContent = "More about this film →";
    detailsButton.addEventListener("click", () => openDetails(movie, detailsButton));
    actions.append(detailsButton, createSaveButton(movie));
    card.append(posterButton, heading, meta, actions);
    resultsContainer.append(card);
  }
}

function renderSavedMovies() {
  const savedMovies = movies.filter((movie) => savedIds.includes(movie.id));
  savedContainer.replaceChildren();
  savedCount.textContent = String(savedMovies.length);
  savedHeadingCount.textContent = `(${savedMovies.length})`;
  savedEmpty.hidden = savedMovies.length > 0;

  for (const movie of savedMovies) {
    const item = document.createElement("div");
    item.className = "saved-item";
    const title = document.createElement("span");
    title.className = "saved-item-title";
    title.textContent = movie.title;
    item.append(title, createSaveButton(movie, "watchlist"));
    savedContainer.append(item);
  }
}

function refreshSaveButtons() {
  for (const button of document.querySelectorAll("[data-save-movie-id]")) {
    const movieId = Number(button.dataset.saveMovieId);
    const movie = movies.find((item) => item.id === movieId);
    if (!movie) continue;
    const isSaved = savedIds.includes(movieId);
    button.classList.toggle("is-saved", isSaved);
    button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${movie.title}${isSaved ? " from watchlist" : ""}`);
    button.setAttribute("aria-pressed", String(isSaved));
    button.innerHTML = `<span aria-hidden="true">${isSaved ? "✓" : "♡"}</span>`;
  }
}

function toggleSaved(movieId, context) {
  const wasSaved = savedIds.includes(movieId);
  savedIds = wasSaved
    ? savedIds.filter((id) => id !== movieId)
    : [...savedIds, movieId];
  saveSavedIds();
  if (context !== "dialog") renderMovies();
  renderSavedMovies();
  refreshSaveButtons();
  updateDialogSave();

  const movie = movies.find((item) => item.id === movieId);
  if (!movie) return;
  watchlistStatus.textContent = `${movie.title} ${wasSaved ? "removed from" : "added to"} your watchlist.`;
  if (context === "watchlist") {
    document.querySelector("#saved-heading").setAttribute("aria-label", `Your watchlist, ${savedMoviesLabel()}`);
  }
}

function savedMoviesLabel() {
  return `${savedIds.length} ${savedIds.length === 1 ? "saved film" : "saved films"}`;
}

async function loadMovies() {
  try {
    const response = await fetch("./movies.json");
    if (!response.ok) throw new Error(`Movie data request failed with status ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length < 8 || data.some((movie) =>
      !Number.isInteger(movie.id) || !movie.title || !movie.genre || !movie.year || !movie.director || !movie.description
    )) {
      throw new Error("The movie dataset is missing required movie information.");
    }
    movies = data;
    renderMovies();
    renderSavedMovies();
  } catch (error) {
    resultsCount.textContent = "Movies could not be loaded.";
    emptyResults.hidden = false;
    emptyResults.textContent = "The movie list could not be loaded. Please serve this folder from a local web server and try again.";
    console.error("Unable to load movies.json:", error);
  }
}

function setFieldError(field, errorElement, message) {
  errorElement.textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function clearFormErrors() {
  for (const [fieldId, errorId] of [
    ["signup-name", "name-error"],
    ["signup-email", "email-error"],
    ["signup-genre", "genre-error"],
    ["signup-consent", "consent-error"]
  ]) {
    setFieldError(document.getElementById(fieldId), document.getElementById(errorId), "");
  }
}

searchInput.addEventListener("input", renderMovies);
dialogClose.addEventListener("click", closeDetails);
dialogSave.addEventListener("click", () => {
  if (activeMovie) toggleSaved(activeMovie.id, "dialog");
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDetails();
});
dialog.addEventListener("close", () => {
  const opener = dialogOpener;
  dialogOpener = null;
  activeMovie = null;
  if (opener?.isConnected) opener.focus();
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFormErrors();
  formMessage.textContent = "";
  formMessage.classList.remove("is-error");

  const name = document.querySelector("#signup-name");
  const email = document.querySelector("#signup-email");
  const genre = document.querySelector("#signup-genre");
  const consent = document.querySelector("#signup-consent");
  let firstInvalidField = null;

  if (!name.value.trim()) {
    setFieldError(name, document.querySelector("#name-error"), "Please enter your name.");
    firstInvalidField ||= name;
  }
  if (!email.value.trim()) {
    setFieldError(email, document.querySelector("#email-error"), "Please enter your email address.");
    firstInvalidField ||= email;
  } else if (!email.validity.valid) {
    setFieldError(email, document.querySelector("#email-error"), "Please enter a valid email address.");
    firstInvalidField ||= email;
  }
  if (!genre.value) {
    setFieldError(genre, document.querySelector("#genre-error"), "Please choose a movie genre.");
    firstInvalidField ||= genre;
  }
  if (!consent.checked) {
    setFieldError(consent, document.querySelector("#consent-error"), "Please give consent to receive the newsletter.");
    firstInvalidField ||= consent;
  }

  if (firstInvalidField) {
    formMessage.textContent = "Please check the highlighted fields.";
    formMessage.classList.add("is-error");
    firstInvalidField.focus();
    return;
  }

  const submittedName = name.value.trim();
  const submittedGenre = genre.value;
  signupForm.reset();
  formMessage.textContent = `Thanks, ${submittedName}! You're on the list for ${submittedGenre} movie picks.`;
});

for (const field of signupForm.querySelectorAll("input, select")) {
  field.addEventListener("input", () => {
    if (formMessage.classList.contains("is-error")) formMessage.textContent = "";
  });
  field.addEventListener("change", () => {
    if (formMessage.classList.contains("is-error")) formMessage.textContent = "";
  });
}

loadMovies();
