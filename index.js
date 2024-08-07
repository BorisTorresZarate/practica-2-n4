import express from 'express'
import jwt from 'jsonwebtoken'

const app = express();
app.use(express.json());

const secretKey = 'bogui@231297@1997';

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '30m' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'credenciales invalidas' });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'no autorizado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'token invalido o caducado' });
    }
    req.user = decoded;
    next();
  });
}

app.get('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
