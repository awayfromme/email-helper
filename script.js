let user = {};

// Salva i dati e aggiorna la lista
function salvaUtente() {
  const nome = document.getElementById("nome").value.trim();
  const cognome = document.getElementById("cognome").value.trim();
  if (!nome || !cognome) return alert("Inserisci entrambi i campi!");

  user = { nome, cognome };
  localStorage.setItem("user", JSON.stringify(user));
  caricaEmail();
}

// Carica email template e personalizza
async function caricaEmail() {
  const res = await fetch('templates/emails.json');
  const templates = await res.json();

  const container = document.getElementById("email-list");
  container.innerHTML = "";
  templates.forEach(template => {
    const body = template.body
      .replace(/{{NOME}}/g, user.nome)
      .replace(/{{COGNOME}}/g, user.cognome);

    const div = document.createElement("div");
    div.className = "email-card";
    div.innerHTML = `
      <h3>${template.title}</h3>
      <pre>${body}</pre>
      <button onclick="copiaTesto(\`${body.replace(/`/g, '\`')}\`)">Copia</button>
    `;
    container.appendChild(div);
  });
}

// Copia il testo negli appunti
function copiaTesto(testo) {
  navigator.clipboard.writeText(testo)
    .then(() => alert("Testo copiato!"))
    .catch(() => alert("Errore nel copiare il testo"));
}

// Recupera dati da localStorage se presenti
window.onload = () => {
  const salvato = localStorage.getItem("user");
  if (salvato) {
    user = JSON.parse(salvato);
    document.getElementById("nome").value = user.nome;
    document.getElementById("cognome").value = user.cognome;
    caricaEmail();
  }
};
