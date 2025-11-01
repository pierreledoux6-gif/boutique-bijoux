async function loadProducts(){
  try{
    const res = await fetch("/api/produits");
    const products = await res.json();
    const container = document.getElementById("products");
    if(!products.length) container.innerHTML = "<p>Aucun produit (vérifie data/products.json)</p>";
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h4>${p.nom}</h4><div>${p.prix.toFixed(2)} €</div><button class="add" data-id="${p.id}">Ajouter</button>`;
      container.appendChild(card);
    });
    document.querySelectorAll(".add").forEach(b=>b.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      window.cartAdd(id);
    }));
  }catch(e){
    console.error(e);
  }
}
document.addEventListener("DOMContentLoaded", loadProducts);
