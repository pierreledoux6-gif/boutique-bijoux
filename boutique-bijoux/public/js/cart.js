// Gestion du panier (stocké en localStorage)
// API minimal: add, remove, quantity, display, checkout

const CART_KEY = 'ma-boutique-cart';

function getCart(){
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] };
  } catch(e) {
    return { items: [] };
  }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const cart = getCart();
  const count = cart.items.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').textContent = count;

  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;
  cart.items.forEach(item => {
    total += item.qty * item.prix;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.nom}">
      <div style="flex:1">
        <div style="font-weight:600">${item.nom}</div>
        <div style="font-size:13px;color:#666">${item.prix.toFixed(2)} € × ${item.qty}</div>
      </div>
      <div>
        <button class="btn ghost inc" data-id="${item.id}">+</button>
        <button class="btn ghost dec" data-id="${item.id}">-</button>
      </div>
    `;
    container.appendChild(el);
  });
  document.getElementById('cart-total').textContent = total.toFixed(2);

  // attach inc/dec handlers
  container.querySelectorAll('.inc').forEach(b=>b.addEventListener('click', ()=>changeQty(Number(b.dataset.id), 1)));
  container.querySelectorAll('.dec').forEach(b=>b.addEventListener('click', ()=>changeQty(Number(b.dataset.id), -1)));
}

function changeQty(id, delta){
  const cart = getCart();
  const idx = cart.items.findIndex(i=>i.id===id);
  if(idx===-1) return;
  cart.items[idx].qty += delta;
  if(cart.items[idx].qty <= 0) cart.items.splice(idx,1);
  saveCart(cart);
}

window.cartAdd = async function(id){
  // fetch product to get data
  try{
    const res = await fetch('/api/produits');
    const products = await res.json();
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const cart = getCart();
    const existing = cart.items.find(i=>i.id===id);
    if(existing) existing.qty += 1;
    else cart.items.push({ id: p.id, nom: p.nom, prix: p.prix, image: p.image, qty: 1 });
    saveCart(cart);
    openCart();
  }catch(err){
    console.error('Erreur ajout panier', err);
  }
}

function openCart(){ document.getElementById('cart').classList.add('open'); }
function closeCart(){ document.getElementById('cart').classList.remove('open'); }

// events UI
document.getElementById('btn-cart').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);

document.getElementById('checkout').addEventListener('click', async () => {
  const cart = getCart();
  if(!cart.items.length){ alert('Panier vide'); return; }
  // Simuler envoi de commande
  const payload = { items: cart.items, total: cart.items.reduce((s,i)=>s+i.qty*i.prix,0) };
  try{
    const res = await fetch('/api/commande', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(data.success){
      alert('Commande passée (id: '+data.orderId+')');
      localStorage.removeItem(CART_KEY);
      updateCartUI();
      closeCart();
    } else {
      alert('Erreur lors de la commande');
    }
  }catch(err){
    console.error('Erreur commande', err);
    alert('Impossible de passer la commande (erreur réseau)');
  }
});

// Initial UI update
document.addEventListener('DOMContentLoaded', updateCartUI);
