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
  let q = "SELECT * FROM books";

  // Apply sorting if selectedAuthor is provided
  if (req.query.author) {
    q += ` WHERE a_name = '${req.query.author}'`;
  }

  // Apply sorting if selectedLibrary is provided
  if (req.query.library) {
    q += `${req.query.author ? " AND" : " WHERE"} library_id = ${
      req.query.library
    }`;
  }

  q += " ORDER BY a_name, title"; // Sorting by author name and then by title

  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.get("/libraries", (req, res) => {
  const q = "SELECT * FROM libraries";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.get("/libraries/books/:libraryId", (req, res) => {
  const libraryId = req.params.libraryId;
  const q = "SELECT * FROM books WHERE library_id = ?";

  db.query(q, [libraryId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.post("/libraries/add", (req, res) => {
  const q = "INSERT INTO libraries(`l_name`, `l_adress`) VALUES (?, ?)";

  const values = [req.body.l_name, req.body.l_adress];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.get("/authors", (req, res) => {
  const q = "SELECT * FROM authors ";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err); // Use status 500 for internal server errors
    }
    return res.json(data);
  });
});
app.post("/authors/add", (req, res) => {
  const q = "INSERT INTO authors(`a_name`) VALUES (?)";

  const values = [req.body.a_name];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).send(err);
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

app.get("/users/:username", (req, res) => {
  const username = req.params.username;
  const q = "SELECT * FROM users WHERE `username` = ?";

  db.query(q, [username], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (data.length > 0) {
      return res.json(data[0]);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q =
    "UPDATE users SET `fullName`= ?, `university`= ?, `faculty`= ?, `course`= ? WHERE id = ?";

  const values = [
    req.body.fullName,
    req.body.university,
    req.body.faculty,
    req.body.course,
  ];

  db.query(q, [...values, userId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.post("/books/book-now/:id", async (req, res) => {
  const bookId = req.params.id;
  const username = req.body.username;

  const q = "INSERT INTO reservations (username, book_id) VALUES (?, ?)";

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(q, [username, bookId], (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (result.affectedRows > 0) {
      const updateQ = "UPDATE books SET quantity = quantity - 1 WHERE id = ?";
      await new Promise((resolve, reject) => {
        db.query(updateQ, [bookId], (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "Failed to reserve the book. It may already be reserved.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});
app.get("/books/reserved/:username", (req, res) => {
  const username = req.params.username;
  const q =
    "SELECT b.id AS book_id, b.title, b.a_name, r.reservation_date FROM books b JOIN reservations r ON b.id = r.book_id WHERE r.username = ?";

  db.query(q, [username], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.get("/reservations", (req, res) => {
  const q =
    "SELECT r.id, u.fullName, u.university, u.faculty, b.title, b.a_name, r.reservation_date FROM reservations r JOIN users u ON r.username = u.username JOIN books b ON r.book_id = b.id";

  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.post("/books/return/:id", async (req, res) => {
  const bookId = req.params.id;
  const username = req.body.username;

  const deleteQ = "DELETE FROM reservations WHERE username = ? AND book_id = ?";
  const updateQ = "UPDATE books SET quantity = quantity + 1 WHERE id = ?";

  try {
    const deleteResult = await new Promise((resolve, reject) => {
      db.query(deleteQ, [username, bookId], (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (deleteResult.affectedRows > 0) {
      // Book reservation removed, now update book quantity
      await new Promise((resolve, reject) => {
        db.query(updateQ, [bookId], (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "Failed to return the book. It may not be reserved.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.post("/books", (req, res) => {
  const q =
    "INSERT INTO books(`title`, `description`, `cover`, `a_name`, `quantity`, `library_id`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.description,
    req.body.cover,
    req.body.a_name,
    req.body.quantity,
    req.body.library_id,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "SELECT * FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    if (data.length > 0) {
      return res.json(data[0]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title`= ?, `description`= ?, `cover`= ?, `a_name`= ?, `quantity`=? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.description,
    req.body.cover,
    req.body.a_name,
    req.body.quantity,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.json(data);
  });
});

app.post("/users/register", async (req, res) => {
  try {
    const { username, password, fullName, university, faculty, course } =
      req.body;
    const q =
      "INSERT INTO users (`username`, `password`, `status`, `fullName`, `university`, `faculty`, `course`) VALUES (?, ?, ?, ?, ?, ?, ?)";

    const values = [
      username,
      password,
      "user",
      fullName,
      university,
      faculty,
      course,
    ];

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
