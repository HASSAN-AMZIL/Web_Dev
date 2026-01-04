document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "produits_db";

  const defaultProduits = [
    { idProduit: "1001", nom: "Clavier", prix: 199.99, idFournisseur: "01000001" },
    { idProduit: "1002", nom: "Souris", prix: 89.50, idFournisseur: "01000002" },
    { idProduit: "1003", nom: "Écran", prix: 1499.00, idFournisseur: "01000003" }
  ];

  // Elements
  const tableBody = document.getElementById("produitsBody");
  const openAddBtn = document.getElementById("openAddBtn");
  const form = document.getElementById("form");
  const closeFormBackdrop = document.getElementById("closeFormBackdrop");
  const addForm = document.getElementById("addForm");
  const formTitle = document.getElementById("formTitle");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const countLabel = document.getElementById("countLabel");
  const searchInput = document.getElementById("searchInput");

  // DB
  let produits = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (produits.length === 0) {
    defaultProduits.forEach(function (p) {
      produits.push(p);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produits)); // [web:116]
  }

  // edit mode
  let editIdProduit = null;

  function closeForm() {
    form.classList.remove("open");
    addForm.reset();
    addForm.elements["idProduit"].disabled = false;
    editIdProduit = null;
    formTitle.textContent = "Ajouter un produit";
  }

  cancelFormBtn.addEventListener("click", closeForm);
  closeFormBackdrop.addEventListener("click", closeForm);

  function renderTable(list) {
    tableBody.innerHTML = "";

    list.forEach(function (produit) {
      const row = tableBody.insertRow();

      row.insertCell().textContent = produit.idProduit;
      row.insertCell().textContent = produit.nom;

      // prix shown as text (you can format later)
      row.insertCell().textContent = produit.prix;

      row.insertCell().textContent = produit.idFournisseur;

      const actionCell = row.insertCell();
      actionCell.className = "col-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn small";
      editBtn.textContent = "Modifier";
      actionCell.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn danger small";
      delBtn.textContent = "Supprimer";
      actionCell.appendChild(delBtn);

      editBtn.addEventListener("click", function () {
        editIdProduit = produit.idProduit;
        formTitle.textContent = "Modifier le produit";

        addForm.elements["idProduit"].value = produit.idProduit;
        addForm.elements["nom"].value = produit.nom;
        addForm.elements["prix"].value = produit.prix;
        addForm.elements["idFournisseur"].value = produit.idFournisseur;

        addForm.elements["idProduit"].disabled = true;
        form.classList.add("open");
      });

      delBtn.addEventListener("click", function () {
        produits = produits.filter(function (p) {
          return p.idProduit !== produit.idProduit;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(produits)); // [web:116]

        searchInput.value = "";
        renderTable(produits);
      });
    });

    countLabel.textContent =
      list.length + (list.length === 1 ? " produit" : " produits");
  }

  renderTable(produits);

  openAddBtn.addEventListener("click", function () {
    editIdProduit = null;
    formTitle.textContent = "Ajouter un produit";
    addForm.reset();
    addForm.elements["idProduit"].disabled = false;
    form.classList.add("open");
  });

  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nom = addForm.elements["nom"].value.trim();
    const idFournisseur = addForm.elements["idFournisseur"].value.trim();

    const prixStr = addForm.elements["prix"].value.trim();
    const prix = Number(prixStr);

    const idProduit = (editIdProduit === null)
      ? addForm.elements["idProduit"].value.trim()
      : editIdProduit;

    if (!idProduit || !nom) return alert("Veuillez saisir idProduit et le nom.");
    if (!Number.isFinite(prix)) return alert("Prix invalide.");

    if (editIdProduit === null) {
      const exists = produits.some(function (p) { return p.idProduit === idProduit; });
      if (exists) return alert("Cet idProduit existe déjà.");

      produits.push({ idProduit: idProduit, nom: nom, prix: prix, idFournisseur: idFournisseur });
    } else {
      produits = produits.map(function (p) {
        if (p.idProduit !== editIdProduit) return p;
        return { idProduit: editIdProduit, nom: nom, prix: prix, idFournisseur: idFournisseur };
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(produits)); // [web:116]

    closeForm();

    searchInput.value = "";
    renderTable(produits);
  });

  // Search by name (nom)
  searchInput.addEventListener("input", function () {
    const q = searchInput.value.toLowerCase().trim();

    if (q === "") {
      renderTable(produits);
    } else {
      renderTable(produits.filter(function (p) {
        return p.nom.toLowerCase().includes(q);
      }));
    }
  });
});
