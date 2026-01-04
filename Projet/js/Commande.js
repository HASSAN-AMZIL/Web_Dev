document.addEventListener("DOMContentLoaded", function () {
  // Keys
  const CMD_KEY = "commandes_db";
  const FACT_KEY = "factures_db";


  // Default data
  const defaultCommandes = [
    { idCommande: "20001", idClient: "02000240", date: "2026-01-02", statut: "En cours" },
    { idCommande: "20002", idClient: "02000241", date: "2026-01-03", statut: "Livrée" }
  ];


  const defaultFactures = [
    { idFacture: "F-9001", idCommande: "20001", montant: 1200.50, statut: "Impayée" },
    { idFacture: "F-9002", idCommande: "20002", montant: 499.99, statut: "Payée" }
  ];


  // ---- Elements: Commandes
  const commandesBody = document.getElementById("commandesBody");
  const openAddCommandeBtn = document.getElementById("openAddCommandeBtn");
  const commandeModal = document.getElementById("commandeFormModal");
  const closeCommandeBackdrop = document.getElementById("closeCommandeBackdrop");
  const cancelCommandeBtn = document.getElementById("cancelCommandeBtn");
  const commandeFormTitle = document.getElementById("commandeFormTitle");
  const commandeForm = document.getElementById("commandeForm");
  const countCommandeLabel = document.getElementById("countCommandeLabel");
  const searchCommandeInput = document.getElementById("searchCommandeInput");


  // ---- Elements: Factures
  const facturesBody = document.getElementById("facturesBody");
  const openAddFactureBtn = document.getElementById("openAddFactureBtn");
  const factureModal = document.getElementById("factureFormModal");
  const closeFactureBackdrop = document.getElementById("closeFactureBackdrop");
  const cancelFactureBtn = document.getElementById("cancelFactureBtn");
  const factureFormTitle = document.getElementById("factureFormTitle");
  const factureForm = document.getElementById("factureForm");
  const countFactureLabel = document.getElementById("countFactureLabel");
  const searchFactureInput = document.getElementById("searchFactureInput");


  // ---- Load DBs
  let commandes = JSON.parse(localStorage.getItem(CMD_KEY) || "[]");
  let factures = JSON.parse(localStorage.getItem(FACT_KEY) || "[]");


  if (commandes.length === 0) {
    defaultCommandes.forEach(function (c) { commandes.push(c); });
    localStorage.setItem(CMD_KEY, JSON.stringify(commandes));
  }


  if (factures.length === 0) {
    defaultFactures.forEach(function (f) { factures.push(f); });
    localStorage.setItem(FACT_KEY, JSON.stringify(factures));
  }


  // ---- Edit state
  let editIdCommande = null;
  let editIdFacture = null;


  // ---- Helpers: close modals
  function closeCommandeModal() {
    commandeModal.classList.remove("open");
    commandeForm.reset();
    commandeForm.elements["idCommande"].disabled = false;
    editIdCommande = null;
    commandeFormTitle.textContent = "Ajouter une commande";
  }


  function closeFactureModal() {
    factureModal.classList.remove("open");
    factureForm.reset();
    factureForm.elements["idFacture"].disabled = false;
    editIdFacture = null;
    factureFormTitle.textContent = "Ajouter une facture";
  }


  cancelCommandeBtn.addEventListener("click", closeCommandeModal);
  closeCommandeBackdrop.addEventListener("click", closeCommandeModal);


  cancelFactureBtn.addEventListener("click", closeFactureModal);
  closeFactureBackdrop.addEventListener("click", closeFactureModal);


  // ---- Render: Commandes
  function renderCommandes(list) {
    commandesBody.innerHTML = "";


    list.forEach(function (cmd) {
      const row = commandesBody.insertRow();
      row.insertCell().textContent = cmd.idCommande;
      row.insertCell().textContent = cmd.idClient;
      row.insertCell().textContent = cmd.date;
      row.insertCell().textContent = cmd.statut;


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
        editIdCommande = cmd.idCommande;
        commandeFormTitle.textContent = "Modifier la commande";


        commandeForm.elements["idCommande"].value = cmd.idCommande;
        commandeForm.elements["idClient"].value = cmd.idClient;
        commandeForm.elements["date"].value = cmd.date; // type="date" expects YYYY-MM-DD
        commandeForm.elements["statut"].value = cmd.statut;


        commandeForm.elements["idCommande"].disabled = true;
        commandeModal.classList.add("open");
      });


      delBtn.addEventListener("click", function () {
        commandes = commandes.filter(function (c) { return c.idCommande !== cmd.idCommande; });
        localStorage.setItem(CMD_KEY, JSON.stringify(commandes));


        searchCommandeInput.value = "";
        renderCommandes(commandes);
      });
    });


    countCommandeLabel.textContent =
      list.length + (list.length === 1 ? " commande" : " commandes");
  }


  // ---- Render: Factures
  function renderFactures(list) {
    facturesBody.innerHTML = "";


    list.forEach(function (fac) {
      const row = facturesBody.insertRow();
      row.insertCell().textContent = fac.idFacture;
      row.insertCell().textContent = fac.idCommande;
      row.insertCell().textContent = fac.montant;
      row.insertCell().textContent = fac.statut;


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
        editIdFacture = fac.idFacture;
        factureFormTitle.textContent = "Modifier la facture";


        factureForm.elements["idFacture"].value = fac.idFacture;
        factureForm.elements["idCommande"].value = fac.idCommande;
        factureForm.elements["montant"].value = fac.montant;
        factureForm.elements["statut"].value = fac.statut;


        factureForm.elements["idFacture"].disabled = true;
        factureModal.classList.add("open");
      });


      delBtn.addEventListener("click", function () {
        factures = factures.filter(function (f) { return f.idFacture !== fac.idFacture; });
        localStorage.setItem(FACT_KEY, JSON.stringify(factures));


        searchFactureInput.value = "";
        renderFactures(factures);
      });
    });


    countFactureLabel.textContent =
      list.length + (list.length === 1 ? " facture" : " factures");
  }


  // Initial render
  renderCommandes(commandes);
  renderFactures(factures);


  // ---- Open modals
  openAddCommandeBtn.addEventListener("click", function () {
    editIdCommande = null;
    commandeFormTitle.textContent = "Ajouter une commande";
    commandeForm.reset();
    commandeForm.elements["idCommande"].disabled = false;


    // optional: prefill today's date if you want
    // commandeForm.elements["date"].value = new Date().toISOString().slice(0, 10);


    commandeModal.classList.add("open");
  });


  openAddFactureBtn.addEventListener("click", function () {
    editIdFacture = null;
    factureFormTitle.textContent = "Ajouter une facture";
    factureForm.reset();
    factureForm.elements["idFacture"].disabled = false;
    factureModal.classList.add("open");
  });


  // ---- Submit: Commande
  commandeForm.addEventListener("submit", function (e) {
    e.preventDefault();


    const idClient = commandeForm.elements["idClient"].value.trim();
    const date = commandeForm.elements["date"].value.trim();
    const statut = commandeForm.elements["statut"].value.trim();


    const idCommande = (editIdCommande === null)
      ? commandeForm.elements["idCommande"].value.trim()
      : editIdCommande;


    if (!idCommande || !idClient) return alert("Veuillez saisir idCommande et idClient.");
    if (!date) return alert("Veuillez saisir la date."); // type="date" provides yyyy-mm-dd


    if (editIdCommande === null) {
      const exists = commandes.some(function (c) { return c.idCommande === idCommande; });
      if (exists) return alert("Cet idCommande existe déjà.");


      commandes.push({ idCommande: idCommande, idClient: idClient, date: date, statut: statut });
    } else {
      commandes = commandes.map(function (c) {
        if (c.idCommande !== editIdCommande) return c;
        return { idCommande: editIdCommande, idClient: idClient, date: date, statut: statut };
      });
    }


    localStorage.setItem(CMD_KEY, JSON.stringify(commandes));
    closeCommandeModal();


    searchCommandeInput.value = "";
    renderCommandes(commandes);
  });


  // ---- Submit: Facture
  factureForm.addEventListener("submit", function (e) {
    e.preventDefault();


    const idCommande = factureForm.elements["idCommande"].value.trim();
    const montantStr = factureForm.elements["montant"].value.trim();
    const montant = Number(montantStr);
    const statut = factureForm.elements["statut"].value.trim();


    const idFacture = (editIdFacture === null)
      ? factureForm.elements["idFacture"].value.trim()
      : editIdFacture;


    if (!idFacture || !idCommande) return alert("Veuillez saisir idFacture et idCommande.");
    if (!Number.isFinite(montant)) return alert("Montant invalide."); // input type=number


    if (editIdFacture === null) {
      const exists = factures.some(function (f) { return f.idFacture === idFacture; });
      if (exists) return alert("Cet idFacture existe déjà.");


      factures.push({ idFacture: idFacture, idCommande: idCommande, montant: montant, statut: statut });
    } else {
      factures = factures.map(function (f) {
        if (f.idFacture !== editIdFacture) return f;
        return { idFacture: editIdFacture, idCommande: idCommande, montant: montant, statut: statut };
      });
    }


    localStorage.setItem(FACT_KEY, JSON.stringify(factures));
    closeFactureModal();


    searchFactureInput.value = "";
    renderFactures(factures);
  });


  // ---- Search: Commandes by statut
  searchCommandeInput.addEventListener("input", function () {
    const q = searchCommandeInput.value.toLowerCase().trim();
    if (q === "") return renderCommandes(commandes);


    renderCommandes(commandes.filter(function (c) {
      return (c.statut || "").toLowerCase().includes(q);
    }));
  });


  // ---- Search: Factures by statut
  searchFactureInput.addEventListener("input", function () {
    const q = searchFactureInput.value.toLowerCase().trim();
    if (q === "") return renderFactures(factures);


    renderFactures(factures.filter(function (f) {
      return (f.statut || "").toLowerCase().includes(q);
    }));
  });
});
