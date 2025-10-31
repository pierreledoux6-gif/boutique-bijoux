const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint produits: lit data/products.json
app.get('/api/produits', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'products.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Impossible de lire les produits' });
    res.json(JSON.parse(data));
  });
});

// Endpoint commande: reçoit la commande et l'enregistre (simulé)
app.post('/api/commande', (req, res) => {
  const commande = req.body;
  if (!commande || !commande.items || commande.items.length === 0) {
    return res.status(400).json({ error: 'Panier vide' });
  }
  const ordersPath = path.join(__dirname, 'data', 'orders.json');
  const orders = fs.existsSync(ordersPath) ? JSON.parse(fs.readFileSync(ordersPath, 'utf8')) : [];
  const saved = {
    id: orders.length + 1,
    date: new Date().toISOString(),
    ...commande
  };
  orders.push(saved);
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), 'utf8');
  res.json({ success: true, orderId: saved.id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé: http://localhost:${PORT}`));
