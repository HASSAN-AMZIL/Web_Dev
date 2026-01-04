document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "clients_db";

  const defaultClients = [
    { id: "02000240", name: "Youssef", city: "Rabat", email: "Youssef@mail.com", idCommande: 240 },
    { id: "02000241", name: "Hamid", city: "Casablanca", email: "Hamid@mail.com", idCommande: 241 },
    { id: "02000266", name: "Mohammed", city: "Tangier", email: "Mohammed@greencorp.com", idCommande: 266 },
    { id: "02103240", name: "Yassine", city: "Marrakesh", email: "Yassine@mail.com", idCommande: 3240 }
  ];

  // Elements
  const tableBody = document.getElementById("clientsBody");
  const openAddBtn = document.getElementById("openAddBtn");
  const form = document.getElementById("form");
  const closeFormBackdrop = document.getElementById("closeFormBackdrop");
  const addForm = document.getElementById("addForm");
  const formTitle = document.getElementById("formTitle");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const countLabel = document.getElementById("countLabel");
  const searchInput = document.getElementById("searchInput");

  // DB
  let clients = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (clients.length === 0) {
    defaultClients.forEach(function (c) {
      clients.push(c);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients)); // [web:116]
  }

  let editId = null;

  function closeForm() {
    form.classList.remove("open");
    addForm.reset();
    addForm.elements["id"].disabled = false;
    editId = null;
    formTitle.textContent = "Ajouter un client";
  }

  cancelFormBtn.addEventListener("click", closeForm);
  closeFormBackdrop.addEventListener("click", closeForm);

  function renderTable(list) {
    tableBody.innerHTML = "";

    list.forEach(function (client) {
      const row = tableBody.insertRow();

      row.insertCell().textContent = client.id;
      row.insertCell().textContent = client.name;
      row.insertCell().textContent = client.city;

      const emailCell = row.insertCell();
      emailCell.innerHTML =
        '<a class="link" href="mailto:' + client.email + '">' + client.email + "</a>";

      const idCommandeCell = row.insertCell();
      idCommandeCell.innerHTML =
        '<span class="pill">' + (client.idCommande ?? "") + "</span>";

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
        editId = client.id;
        formTitle.textContent = "Modifier le client";

        addForm.elements["id"].value = client.id;
        addForm.elements["name"].value = client.name;
        addForm.elements["city"].value = client.city;
        addForm.elements["email"].value = client.email;
        addForm.elements["idCommande"].value = (client.idCommande ?? "");

        addForm.elements["id"].disabled = true;

        form.classList.add("open");
      });

      delBtn.addEventListener("click", function () {
        clients = clients.filter(function (c) {
          return c.id !== client.id;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients)); // [web:116]

        searchInput.value = "";
        renderTable(clients);
      });
    });

    countLabel.textContent = list.length + (list.length === 1 ? " client" : " clients");
  }

  renderTable(clients);

  openAddBtn.addEventListener("click", function () {
    editId = null;
    formTitle.textContent = "Ajouter un client";
    addForm.reset();
    addForm.elements["id"].disabled = false;
    form.classList.add("open");
  });

  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = addForm.elements["name"].value.trim();
    const city = addForm.elements["city"].value.trim();
    const email = addForm.elements["email"].value.trim();

    // read idCommande as integer
    const idCommandeStr = addForm.elements["idCommande"].value.trim();
    const idCommande = Number(idCommandeStr);

    const id = (editId === null) ? addForm.elements["id"].value.trim() : editId;

    if (!id || !name) return alert("Veuillez saisir l'ID client et le nom.");

    if (!Number.isInteger(idCommande)) return alert("idCommande doit être un nombre entier.");

    if (editId === null) {
      const exists = clients.some(function (c) { return c.id === id; });
      if (exists) return alert("Cet ID client existe déjà.");

      clients.push({ id: id, name: name, city: city, email: email, idCommande: idCommande });
    } else {
      clients = clients.map(function (c) {
        if (c.id !== editId) return c;
        return { id: editId, name: name, city: city, email: email, idCommande: idCommande };
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients)); // [web:116]

    closeForm();

    searchInput.value = "";
    renderTable(clients);
  });

  // Search by name
  searchInput.addEventListener("input", function () {
    const q = searchInput.value.toLowerCase().trim();

    if (q === "") {
      renderTable(clients);
    } else {
      renderTable(clients.filter(function (c) {
        return c.name.toLowerCase().includes(q);
      }));
    }
  });
});
