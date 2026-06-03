document.getElementById("formAluno").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const form = document.getElementById("formAluno");
    const formData = new FormData(form);

    const resposta = await fetch("https://cadastro-alunos-m7f5.onrender.com/alunos", {
      method: "POST",
      body: formData
    });

    const data = await resposta.json();

    console.log(data);

    document.getElementById("mensagem").innerText = data.mensagem;

    if (resposta.ok) {
      form.reset();
    }

  } catch (erro) {
    console.log("ERRO NO FETCH:", erro);
    document.getElementById("mensagem").innerText =
      "Erro ao conectar com o servidor";
  }
});