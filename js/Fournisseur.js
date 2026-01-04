document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "fournisseurs_db";

  const defaultFournisseurs = [
    { idFournisseur: "01000001", nom: "Fournisseur 1", ville: "Casablanca", email: "contact@atlas.ma" },
    { idFournisseur: "01000002", nom: "Fournisseur 2", ville: "Rabat", email: "contact@rabatdist.ma" },
    { idFournisseur: "01000003", nom: "Fournisseur 3", ville: "Marrakesh", email: "info@marrakeshpartners.ma" }
  ];

  // Elements
  const tableBody = document.getElementById("fournisseursBody");
  const openAddBtn = document.getElementById("openAddBtn");
  const form = document.getElementById("form");
  const closeFormBackdrop = document.getElementById("closeFormBackdrop");
  const addForm = document.getElementById("addForm");
  const formTitle = document.getElementById("formTitle");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const countLabel = document.getElementById("countLabel");
  const searchInput = document.getElementById("searchInput");

  // DB
  let fournisseurs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (fournisseurs.length === 0) {
    defaultFournisseurs.forEach(function (f) {
      fournisseurs.push(f);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fournisseurs)); // [web:116]
  }

  // edit mode
  let editIdFournisseur = null;

  function closeForm() {
    form.classList.remove("open");
    addForm.reset();
    addForm.elements["idFournisseur"].disabled = false;
    editIdFournisseur = null;
    formTitle.textContent = "Ajouter un fournisseur";
  }

  cancelFormBtn.addEventListener("click", closeForm);
  closeFormBackdrop.addEventListener("click", closeForm);

  function renderTable(list) {
    tableBody.innerHTML = "";

    list.forEach(function (fournisseur) {
      const row = tableBody.insertRow();

      row.insertCell().textContent = fournisseur.idFournisseur;
      row.insertCell().textContent = fournisseur.nom;
      row.insertCell().textContent = fournisseur.ville;

      const emailCell = row.insertCell();
      emailCell.innerHTML =
        '<a class="link" href="mailto:' + fournisseur.email + '">' + fournisseur.email + "</a>";

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
        editIdFournisseur = fournisseur.idFournisseur;
        formTitle.textContent = "Modifier le fournisseur";

        addForm.elements["idFournisseur"].value = fournisseur.idFournisseur;
        addForm.elements["nom"].value = fournisseur.nom;
        addForm.elements["ville"].value = fournisseur.ville;
        addForm.elements["email"].value = fournisseur.email;

        addForm.elements["idFournisseur"].disabled = true;
        form.classList.add("open");
      });

      delBtn.addEventListener("click", function () {
        fournisseurs = fournisseurs.filter(function (f) {
          return f.idFournisseur !== fournisseur.idFournisseur;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(fournisseurs)); // [web:116]

        searchInput.value = "";
        renderTable(fournisseurs);
      });
    });

    countLabel.textContent =
      list.length + (list.length === 1 ? " fournisseur" : " fournisseurs");
  }

  renderTable(fournisseurs);

  openAddBtn.addEventListener("click", function () {
    editIdFournisseur = null;
    formTitle.textContent = "Ajouter un fournisseur";
    addForm.reset();
    addForm.elements["idFournisseur"].disabled = false;
    form.classList.add("open");
  });

  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nom = addForm.elements["nom"].value.trim();
    const ville = addForm.elements["ville"].value.trim();
    const email = addForm.elements["email"].value.trim();

    const idFournisseur = (editIdFournisseur === null)
      ? addForm.elements["idFournisseur"].value.trim()
      : editIdFournisseur;

    if (!idFournisseur || !nom) return alert("Veuillez saisir l'idFournisseur et le nom.");

    if (editIdFournisseur === null) {
      const exists = fournisseurs.some(function (f) { return f.idFournisseur === idFournisseur; });
      if (exists) return alert("Cet idFournisseur existe déjà.");

      fournisseurs.push({ idFournisseur: idFournisseur, nom: nom, ville: ville, email: email });
    } else {
      fournisseurs = fournisseurs.map(function (f) {
        if (f.idFournisseur !== editIdFournisseur) return f;
        return { idFournisseur: editIdFournisseur, nom: nom, ville: ville, email: email };
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(fournisseurs)); // [web:116]

    closeForm();

    searchInput.value = "";
    renderTable(fournisseurs);
  });

  // Search by name (nom)
  searchInput.addEventListener("input", function () {
    const q = searchInput.value.toLowerCase().trim();

    if (q === "") {
      renderTable(fournisseurs);
    } else {
      renderTable(fournisseurs.filter(function (f) {
        return f.nom.toLowerCase().includes(q);
      }));
    }
  });
});
