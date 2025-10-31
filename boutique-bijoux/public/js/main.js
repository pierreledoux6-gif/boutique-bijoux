// Charge et affiche les produits depuis l'API
async function loadProducts(){
  try{
    const res = await fetch('/api/produits');
    const products = await res.json();
    const container = document.getElementById('products');
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.nom}">
        <h4>${p.nom}</h4>
        <p>${p.desc}</p>
        <div class="price">${p.prix.toFixed(2)} €</div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn primary add" data-id="${p.id}">Ajouter</button>
          <button class="btn ghost" data-id="${p.id}">Voir</button>
        </div>
      `;
      container.appendChild(card);
    });

    // attach events add-to-cart
    document.querySelectorAll('.add').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        window.cartAdd(id);
      });
    });
  }catch(err){
    console.error('Erreur chargement produits', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
