let cards = [];
let currentCardId = null;

// DOM elements
const gallerySection = document.querySelector(".cards-gallery");
const descriptionSection = document.querySelector(".cards-description");
const tableBody = document.querySelector("#cardsTable tbody");
const searchInput = document.getElementById("cardSearch");

// Determine base path so it works on GitHub Pages
const repoBase = window.location.pathname.replace(/\/[^/]*$/, "/");

// Load JSON data
fetch(repoBase + "cards.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("JSON fetch failed: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    cards = data;
    renderTable(cards);
    if (cards.length > 0) selectCard(cards[0].id);
  })
  .catch(error => {
    console.error("Error loading cards.json:", error);
    gallerySection.innerHTML = "<p>Error loading card data.</p>";
  });

/* =====================
   RENDER TABLE
===================== */
function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach(card => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${card.nameFirst}</td>
      <td>${card.nameLast}</td>
      <td>${card.sport}</td>
      <td>${card.year}</td>
      <td>${card.brandMain}</td>
      <td>${card.brandSub}</td>
      <td>${card.condition}</td>
    `;
    row.addEventListener("click", () => selectCard(card.id));
    tableBody.appendChild(row);
  });
}

/* =====================
   SELECT CARD
===================== */
function selectCard(cardId) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;

  currentCardId = cardId;

  gallerySection.innerHTML = `
    <img src="${card.image}" alt="${card.nameFirst} ${card.nameLast}" class="card-image">
    <p><strong>${card.nameFirst} ${card.nameLast}</strong> (${card.year})</p>
  `;
  const img = gallerySection.querySelector("img");
  img.style.cursor = "pointer";
  img.onclick = () => window.open(card.image, "_blank");

  descriptionSection.innerHTML = `
    <h3>${card.nameFirst} ${card.nameLast}</h3>
    <p>${card.description}</p>
  `;
  highlightRow(cardId);
}

/* =====================
   HIGHLIGHT ACTIVE ROW
===================== */
function highlightRow(cardId) {
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    const card = cards[index];
    if (card && card.id === cardId) row.classList.add("active-row");
    else row.classList.remove("active-row");
  });
}

/* =====================
   SEARCH
===================== */
searchInput.addEventListener("input", event => {
  const query = event.target.value.toLowerCase();
  const filtered = cards.filter(card =>
    Object.values(card).some(value =>
      String(value).toLowerCase().includes(query)
    )
  );
  renderTable(filtered);
  if (!filtered.find(c => c.id === currentCardId)) {
    gallerySection.innerHTML = `<p>Select a card to view its image.</p>`;
    descriptionSection.innerHTML = `<p>Select a card to view its description.</p>`;
  }
});
