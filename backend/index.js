import express from "express";
import mysql from "mysql2";
import cors from "cors";
import session from "express-session";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "QwzDsSwrtG12W!sSFgXBLO",
  database: "library",
});

// Use express-session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err); // Use status 500 for internal server errors
    }
    return res.json(data);
  });
});

app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q = "DELETE FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `description`, `cover`) VALUES (?)";

  const values = [req.body.title, req.body.description, req.body.cover];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title`= ?, `description`= ?, `cover`= ? WHERE id = ?";

  const values = [req.body.title, req.body.description, req.body.cover];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.post("/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const q =
      "INSERT INTO users (`username`, `password`, `status`) VALUES (?, ?, ?)";

    const values = [username, password, "user"];

    const data = await new Promise((resolve, reject) => {
      db.query(q, values, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.body;
  const q = "SELECT * FROM users WHERE `username` = ? AND `password` = ?";

  db.query(q, [username, password], (err, data) => {
    if (err) return res.status(500).send(err);

    if (data.length > 0) {
      const role = data[0].status; // изменено с "role" на "status"
      req.session.user = { id: data[0].id, role, username }; // добавлено "username"

      return res.json({
        success: true,
        message: "Login successful",
        role,
        username, // добавлено "username"
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

app.post("/users/logout", (req, res) => {
  req.session.destroy(); // Удаление сессии при выходе
  res.clearCookie("token");
  return res.json({ success: true, message: "Logout successful" });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});
