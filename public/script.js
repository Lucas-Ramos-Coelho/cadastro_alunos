document.getElementById("formAluno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = document.getElementById("formAluno");
  const formData = new FormData(form);

  const resposta = await fetch("https://cadastro-alunos-m7f5.onrender.com", {
    method: "POST",
    body: formData
  });

  const data = await resposta.json();

  document.getElementById("mensagem").innerText = data.mensagem;

  if (resposta.ok) {
    form.reset();
  }
});