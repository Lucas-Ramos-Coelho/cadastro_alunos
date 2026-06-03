const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + path.extname(file.originalname);
    cb(null, nomeArquivo);
  },
});

const upload = multer({ storage });

const db = mysql.createConnection({
  host: "20.63.24.14",
  user: "azureuser",
  password: "Azureuser123",
  database: "db_lucas",
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar no banco:", err);
    return;
  }

  console.log("Conectado ao MySQL Azure!");
});

app.post("/alunos", upload.single("foto"), async (req, res) => {
  try {
    const {
      nome_completo,
      usuario_acesso,
      senha,
      email_aluno,
      observacao,
    } = req.body;

    if (
      !nome_completo ||
      !usuario_acesso ||
      !senha ||
      !email_aluno
    ) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios.",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const foto = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO alunos
      (
        nome_completo,
        usuario_acesso,
        senha_hash,
        email_aluno,
        observacao,
        foto
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        nome_completo,
        usuario_acesso,
        senhaHash,
        email_aluno,
        observacao,
        foto,
      ],
      (erro) => {
        if (erro) {
          console.log(erro);

          return res.status(500).json({
            mensagem: "Erro ao cadastrar aluno.",
          });
        }

        res.json({
          mensagem: "Aluno cadastrado com sucesso!",
        });
      }
    );
  } catch (erro) {
    console.log(erro);

    res.status(500).json({
      mensagem: "Erro interno.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});