const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

/**
 * ⚠️ INTENCIONALMENTE VULNERABLE (solo laboratorio)
 * - Secret débil y fijo (para demostrar cracking)
 * - El rol viaja en el payload y el backend confía en él
 * - No hay verificación de rol contra BD en cada request
 *
 * Objetivo del taller:
 * 1) Login como user -> obtener JWT (cookie)
 * 2) Decodificar (jwt.io / CyberChef)
 * 3) Crackear el secret (hashcat + wordlist)
 * 4) Cambiar role -> admin
 * 5) Re-firmar el JWT y acceder a /admin
 */
const JWT_SECRET = "supersecret";  // débil a propósito
const JWT_ALG = "HS256";
const COOKIE_NAME = "auth";

const USERS = [
  { username: "alice", password: "password123", role: "user" },
  { username: "bob", password: "password123", role: "user" },
  { username: "admin", password: "admin123", role: "admin" }
];

function signToken(user) {
  const payload = {
    sub: user.username,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALG,
    expiresIn: "1h",
    issuer: "jwt-lab"
  });
}

function verifyToken(req) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return { ok: false, reason: "No token" };

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALG] });
    return { ok: true, decoded };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

function requireAuth(req, res, next) {
  const v = verifyToken(req);
  if (!v.ok) return res.redirect("/login");
  req.user = v.decoded;
  next();
}

function requireAdmin(req, res, next) {
  const v = verifyToken(req);
  if (!v.ok) return res.status(401).send("Unauthorized (no/invalid token)");

  // ⚠️ VULNERABILIDAD: confía en role del token
  if (v.decoded.role !== "admin") return res.status(403).send("Forbidden (admin only)");

  req.user = v.decoded;
  next();
}

function sendView(res, name) {
  return res.sendFile(path.join(__dirname, "views", name));
}

app.get("/", (req, res) => {
  const v = verifyToken(req);
  if (!v.ok) return sendView(res, "home.html");

  return res.send(`
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>JWT Lab</title>
        <link rel="stylesheet" href="/public/style.css">
      </head>
      <body>
        <div class="card">
          <h1>Home</h1>
          <p>Sesión activa como: <b>${v.decoded.sub}</b> (role: <b>${v.decoded.role}</b>)</p>
          <p class="links">
            <a href="/me">/me</a>
            <a href="/admin">/admin</a>
            <a href="/debug/token">/debug/token</a>
            <a href="/logout">logout</a>
          </p>
          <p class="hint">Tip: el JWT está en la cookie <code>${COOKIE_NAME}</code>.</p>
        </div>
      </body>
    </html>
  `);
});

app.get("/login", (req, res) => sendView(res, "login.html"));

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).send("Login incorrecto. Prueba: alice/password123 o admin/admin123");

  const token = signToken(user);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "Lax"
  });

  return res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.redirect("/");
});

app.get("/me", requireAuth, (req, res) => {
  res.json({
    message: "JWT decodificado (desde el servidor)",
    decoded: req.user
  });
});

app.get("/admin", requireAdmin, (req, res) => {
  return sendView(res, "admin.html");
});

app.get("/debug/token", (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(404).send("No hay token. Haz login primero.");
  res.type("text/plain").send(token);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`JWT lab running on http://localhost:${PORT}`);
});
