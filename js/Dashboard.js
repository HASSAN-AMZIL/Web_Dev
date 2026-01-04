document.addEventListener("DOMContentLoaded", function () {
  // localStorage keys used by your app
  const KEYS = {
    clients: "clients_db",
    fournisseurs: "fournisseurs_db",
    produits: "produits_db",
    commandes: "commandes_db",
    factures: "factures_db"
  };

  function readArray(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]"); // [web:153][web:443]
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  const clients = readArray(KEYS.clients);
  const fournisseurs = readArray(KEYS.fournisseurs);
  const produits = readArray(KEYS.produits);
  const commandes = readArray(KEYS.commandes);
  const factures = readArray(KEYS.factures);

  // ---- Numbers (top cards)
  document.getElementById("clientsCount").textContent = String(clients.length);
  document.getElementById("fournisseursCount").textContent = String(fournisseurs.length);
  document.getElementById("produitsCount").textContent = String(produits.length);

  // ---- Commande statuts: "En cours" / "Livrée"
  const nbCmdEnCours = commandes.filter(function (c) { return c.statut === "En cours"; }).length;
  const nbCmdLivree = commandes.filter(function (c) { return c.statut === "Livrée"; }).length;

  // ---- Facture statuts: "Payée" / "Impayée"
  const nbFacPayee = factures.filter(function (f) { return f.statut === "Payée"; }).length;
  const nbFacImpayee = factures.filter(function (f) { return f.statut === "Impayée"; }).length;

  // ---- Total factures (sum montant)
  const totalMontantFactures = factures.reduce(function (acc, f) {
    const m = Number(f.montant);
    return acc + (Number.isFinite(m) ? m : 0);
  }, 0);

  document.getElementById("totalFacturesMontant").textContent = totalMontantFactures.toFixed(2);

  // ---- Objectif (CONFIGURE HERE)
  // Put your real target here (example: 10000).
  const OBJECTIF_MONTANT = 100000;

  const pct = (OBJECTIF_MONTANT > 0)
    ? Math.min(100, (totalMontantFactures / OBJECTIF_MONTANT) * 100)
    : 0;

  document.getElementById("objectifLabel").textContent =
    "Total / Objectif : " + totalMontantFactures.toFixed(2) + " / " + OBJECTIF_MONTANT;

  document.getElementById("objectifPercent").textContent = pct.toFixed(0) + "%";
  document.getElementById("objectifBar").style.width = pct + "%";

  document.getElementById("objectifBottom").textContent =
    "Factures : " + factures.length + " • Commandes : " + commandes.length;

  // ---- Charts (Chart.js)
  // Commande doughnut
  const commandeCanvas = document.getElementById("commandeStatutChart");
  if (commandeCanvas) {
    new Chart(commandeCanvas, { // [web:432]
      type: "doughnut",
      data: {
        labels: ["En cours", "Livrée"],
        datasets: [{
          data: [nbCmdEnCours, nbCmdLivree],
          backgroundColor: ["#f59e0b", "#22c55e"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  // Facture doughnut
  const factureCanvas = document.getElementById("factureStatutChart");
  if (factureCanvas) {
    new Chart(factureCanvas, { // [web:432]
      type: "doughnut",
      data: {
        labels: ["Payée", "Impayée"],
        datasets: [{
          data: [nbFacPayee, nbFacImpayee],
          backgroundColor: ["#22c55e", "#ef4444"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }
});
