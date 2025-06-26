let user = {};
let templates = [];
let currentCategory = null;

function salvaUtente() {
  const nome = document.getElementById("nome").value.trim();
  const cognome = document.getElementById("cognome").value.trim();
  const tono = document.getElementById("tono").value;
  if (!nome || !cognome) return alert("Inserisci entrambi i campi!");

  user = { nome, cognome, tono };
  localStorage.setItem("user", JSON.stringify(user));
  caricaEmail();
}

async function caricaEmail() {
  if (templates.length === 0) {
    const res = await fetch('templates/emails.json');
    templates = await res.json();
  }

  const categories = [...new Set(templates.map(t => t.category))];

  if (!currentCategory || !categories.includes(currentCategory)) {
    currentCategory = categories[0] || null;
  }

  mostraCategorie(categories);
  mostraEmail();
}

function mostraCategorie(categories) {
  const menu = document.getElementById("category-menu");
  menu.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === currentCategory) btn.classList.add("active");
    btn.onclick = () => {
      currentCategory = cat;
      mostraCategorie(categories);
      mostraEmail();
    };
    menu.appendChild(btn);
  });
}

function mostraEmail() {
  const container = document.getElementById("email-list");
  container.innerHTML = "";

  const filtered = templates.filter(t => t.category === currentCategory);
  filtered.forEach(template => {
    // Prendi la lista delle mail per il tono selezionato
    const mailsForTone = template.body[user.tono] || [];

    // Cicla su tutte le mail per il tono
    mailsForTone.forEach(bodyTemplate => {
      const body = bodyTemplate
          .replace(/{{NOME}}/g, user.nome)
          .replace(/{{COGNOME}}/g, user.cognome);

      // Formatto il testo sostituendo ". " con ".<br>"
      const formattedBody = body.replace(/\. /g, ".<br>");

      const div = document.createElement("div");
      div.className = "email-card";
      div.innerHTML = `
        <h3>${template.title}</h3>
      <div style="white-space: pre-wrap; line-height: 1.4;">${formattedBody}</div>
      <button onclick="copiaTesto(this, \`${body.replace(/`/g, '\\`')}\`)">Copia</button>
    <div class="copy-msg" style="color: green; margin-top: 5px; font-weight: bold;"></div>
    `;
      container.appendChild(div);
    });
  });
}


function copiaTesto(button, testo) {
  navigator.clipboard.writeText(testo)
      .then(() => {
        const msgDiv = button.nextElementSibling;
        msgDiv.textContent = "Testo copiato!";
        setTimeout(() => { msgDiv.textContent = ""; }, 3000);
      })
      .catch(() => {
        const msgDiv = button.nextElementSibling;
        msgDiv.textContent = "Errore nel copiare il testo";
        setTimeout(() => { msgDiv.textContent = ""; }, 3000);
      });
}

document.getElementById("tono").addEventListener("change", (e) => {
  user.tono = e.target.value;
  localStorage.setItem("user", JSON.stringify(user));
  mostraEmail();
});

window.onload = () => {
  const salvato = localStorage.getItem("user");
  if (salvato) {
    user = JSON.parse(salvato);
    document.getElementById("nome").value = user.nome;
    document.getElementById("cognome").value = user.cognome;
    document.getElementById("tono").value = user.tono || "formale";
  }
  caricaEmail();
};
