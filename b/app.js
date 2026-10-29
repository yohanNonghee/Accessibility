"use strict";

const resultsElement = document.querySelector("#movie-results");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#movie-search");
const emptyResults = document.querySelector("#empty-results");
const loadError = document.querySelector("#load-error");
const watchlistElement = document.querySelector("#watchlist-results");
const watchlistEmpty = document.querySelector("#watchlist-empty");
const watchlistCount = document.querySelector("#watchlist-count");
const navCount = document.querySelector("#nav-count");
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
let savedMovieIds = loadSavedMovieIds();
let activeMovie = null;
let dialogOpener = null;

function loadSavedMovieIds() {
  try {
    const stored = JSON.parse(localStorage.getItem("movies-directory-watchlist") || "[]");
    return Array.isArray(stored) ? stored.filter(Number.isInteger) : [];
  } catch (error) {
    watchlistStatus.textContent = "The saved watchlist could not be loaded from this browser.";
    return [];
  }
}

function persistSavedMovieIds() {
  try {
    localStorage.setItem("movies-directory-watchlist", JSON.stringify(savedMovieIds));
    return true;
  } catch (error) {
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560"><rect width="420" height="560" fill="${background}"/><circle cx="335" cy="106" r="95" fill="${accent}" opacity=".72"/><circle cx="335" cy="106" r="61" fill="${light}" opacity=".34"/><path d="M0 400 150 245l103 103 83-88 84 78v222H0z" fill="${accent}" opacity=".62"/><path d="M0 464 110 350l92 92 94-112 124 117v113H0z" fill="${background}" opacity=".72"/><path d="M35 42h350M35 518h350" stroke="${light}" stroke-opacity=".65"/><text x="35" y="77" fill="${light}" font-family="Arial,sans-serif" font-size="13" letter-spacing="4">${genre}</text><text x="35" y="444" fill="${light}" font-family="Georgia,serif" font-size="${titleSize}" font-weight="bold">${title}</text><text x="35" y="490" fill="${light}" font-family="Arial,sans-serif" font-size="16" letter-spacing="3">${movie.year} · MOVIE NIGHT</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createPoster(movie) {
  const image = document.createElement("img");
  image.src = posterSource(movie);
  image.alt = `Poster for the movie ${movie.title}`;
  return image;
}

function createSaveButton(movie) {
  const isSaved = savedMovieIds.includes(movie.id);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `save-button${isSaved ? " is-saved" : ""}`;
  button.dataset.movieId = String(movie.id);
  button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${movie.title}${isSaved ? " from watchlist" : ""}`);
  button.setAttribute("aria-pressed", String(isSaved));
  button.innerHTML = `<span class="saved-icon" aria-hidden="true">${isSaved ? "✓" : "♡"}</span><span class="save-text">${isSaved ? "Saved" : "Save"}</span>`;
  button.addEventListener("click", () => toggleSaved(movie.id));
  return button;
}

function openDialog(movie, opener) {
  activeMovie = movie;
  dialogOpener = opener;
  dialogTitle.textContent = movie.title;
  dialogMeta.textContent = `${movie.genre} · ${movie.year}`;
  dialogDirector.textContent = `Directed by ${movie.director}`;
  dialogDescription.textContent = movie.description;
  dialogPoster.replaceChildren(createPoster(movie));
  updateDialogSave();
  dialog.showModal();
  dialogTitle.focus();
}

function updateDialogSave() {
  if (!activeMovie) return;
  const isSaved = savedMovieIds.includes(activeMovie.id);
  dialogSave.textContent = `${isSaved ? "✓ Remove" : "♡ Save"} ${activeMovie.title}${isSaved ? " from watchlist" : ""}`;
  dialogSave.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${activeMovie.title}${isSaved ? " from watchlist" : ""}`);
  dialogSave.setAttribute("aria-pressed", String(isSaved));
  dialogSave.classList.toggle("is-saved", isSaved);
}

function renderMovies() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matches = movies.filter((movie) =>
    [movie.title, movie.genre, String(movie.year), movie.director]
      .some((value) => value.toLocaleLowerCase().includes(query))
  );
  resultsElement.replaceChildren();
  resultsCount.textContent = `${matches.length} ${matches.length === 1 ? "movie" : "movies"} found`;
  emptyResults.hidden = matches.length > 0;

  for (const movie of matches) {
    const card = document.createElement("article");
    card.className = "movie-card";

    const posterButton = document.createElement("button");
    posterButton.type = "button";
    posterButton.className = "poster-button";
    posterButton.setAttribute("aria-label", `View details for ${movie.title}`);
    posterButton.append(createPoster(movie));
    posterButton.addEventListener("click", () => openDialog(movie, posterButton));

    const heading = document.createElement("h3");
    heading.textContent = movie.title;
    const meta = document.createElement("p");
    meta.className = "movie-meta";
    meta.textContent = `${movie.genre} · ${movie.year}`;

    const actions = document.createElement("div");
    actions.className = "movie-actions";
    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "details-button";
    detailsButton.textContent = "View details";
    detailsButton.setAttribute("aria-label", `View details for ${movie.title}`);
    detailsButton.addEventListener("click", () => openDialog(movie, detailsButton));
    actions.append(detailsButton, createSaveButton(movie));
    card.append(posterButton, heading, meta, actions);
    resultsElement.append(card);
  }
}

function renderWatchlist() {
  const savedMovies = movies.filter((movie) => savedMovieIds.includes(movie.id));
  watchlistElement.replaceChildren();
  watchlistCount.textContent = `(${savedMovies.length})`;
  navCount.textContent = String(savedMovies.length);
  watchlistEmpty.hidden = savedMovies.length > 0;

  for (const movie of savedMovies) {
    const item = document.createElement("div");
    item.className = "watchlist-item";
    const title = document.createElement("span");
    title.className = "watchlist-title";
    title.textContent = movie.title;
    item.append(title, createSaveButton(movie));
    watchlistElement.append(item);
  }
}

function refreshSaveButtons() {
  for (const button of document.querySelectorAll(".save-button[data-movie-id]")) {
    const movieId = Number(button.dataset.movieId);
    const movie = movies.find((item) => item.id === movieId);
    if (!movie) continue;
    const isSaved = savedMovieIds.includes(movieId);
    button.classList.toggle("is-saved", isSaved);
    button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${movie.title}${isSaved ? " from watchlist" : ""}`);
    button.setAttribute("aria-pressed", String(isSaved));
    button.innerHTML = `<span class="saved-icon" aria-hidden="true">${isSaved ? "✓" : "♡"}</span><span class="save-text">${isSaved ? "Saved" : "Save"}</span>`;
  }
}

function toggleSaved(movieId) {
  const movie = movies.find((item) => item.id === movieId);
  if (!movie) return;
  const wasSaved = savedMovieIds.includes(movieId);
  savedMovieIds = wasSaved
    ? savedMovieIds.filter((id) => id !== movieId)
    : [...savedMovieIds, movieId];
  const persisted = persistSavedMovieIds();
  renderWatchlist();
  refreshSaveButtons();
  updateDialogSave();
  const action = wasSaved ? "removed from" : "added to";
  watchlistStatus.textContent = persisted
    ? `${movie.title} ${action} your watchlist.`
    : `${movie.title} ${action} your watchlist for this visit. Your browser could not save the change.`;
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

async function loadMovies() {
  try {
    const response = await fetch("./movies.json");
    if (!response.ok) throw new Error(`Movie data request returned ${response.status}.`);
    const data = await response.json();
    const validData = Array.isArray(data) && data.length >= 8 && data.every((movie) =>
      Number.isInteger(movie.id) && movie.id > 0 &&
      typeof movie.title === "string" && movie.title.trim() &&
      typeof movie.genre === "string" && movie.genre.trim() &&
      Number.isInteger(movie.year) &&
      typeof movie.director === "string" && movie.director.trim() &&
      typeof movie.description === "string" && movie.description.trim()
    ) && new Set(data.map((movie) => movie.id)).size === data.length;
    if (!validData) throw new Error("Movie data must contain at least eight complete records.");
    movies = data;
    const validIds = new Set(movies.map((movie) => movie.id));
    savedMovieIds = savedMovieIds.filter((id) => validIds.has(id));
    renderMovies();
    renderWatchlist();
  } catch (error) {
    resultsCount.textContent = "Movie results are unavailable.";
    loadError.hidden = false;
    loadError.textContent = "Movies could not be loaded. Open this site through a local web server and try again.";
    console.error("Unable to load movies.json:", error);
  }
}

function setFieldError(field, errorElement, message) {
  errorElement.textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function clearFormErrors() {
  const fields = [
    ["signup-name", "name-error"],
    ["signup-email", "email-error"],
    ["signup-genre", "genre-error"],
    ["signup-consent", "consent-error"]
  ];
  for (const [fieldId, errorId] of fields) {
    setFieldError(document.getElementById(fieldId), document.getElementById(errorId), "");
  }
}

searchInput.addEventListener("input", renderMovies);
dialogClose.addEventListener("click", closeDialog);
dialogSave.addEventListener("click", () => {
  if (activeMovie) toggleSaved(activeMovie.id);
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeDialog();
  }
});
dialog.addEventListener("close", () => {
  const opener = dialogOpener;
  activeMovie = null;
  dialogOpener = null;
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
    setFieldError(consent, document.querySelector("#consent-error"), "Please agree to receive the newsletter.");
    firstInvalidField ||= consent;
  }

  if (firstInvalidField) {
    formMessage.textContent = "Please correct the marked fields.";
    formMessage.classList.add("is-error");
    firstInvalidField.focus();
    return;
  }

  const submittedName = name.value.trim();
  const submittedGenre = genre.value;
  signupForm.reset();
  clearFormErrors();
  formMessage.textContent = `Thanks, ${submittedName}. You are signed up for ${submittedGenre} movie recommendations.`;
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
