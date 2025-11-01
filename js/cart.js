const CART_KEY = "ma-boutique-cart";
function getCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||{items:[]}}catch{return {items:[]}} }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartUI(); }
function updateCartUI(){ const c=getCart(); document.getElementById("cart-count").textContent = c.items.reduce((s,i)=>s+i.qty,0); document.getElementById("cart-total").textContent = c.items.reduce((s,i)=>s+i.qty*i.prix,0).toFixed(2); }
window.cartAdd = async function(id){ try{ const res = await fetch("/api/produits"); const products = await res.json(); const p = products.find(x=>x.id===id); if(!p) return; const cart=getCart(); const ex = cart.items.find(i=>i.id===id); if(ex) ex.qty+=1; else cart.items.push({id:p.id,nom:p.nom,prix:p.prix,qty:1}); saveCart(cart);}catch(e){console.error(e)} }
document.getElementById("btn-cart").addEventListener("click", ()=>{ const c = document.getElementById("cart"); c.style.display = c.style.display === "none" ? "block" : "none";});
document.getElementById("checkout").addEventListener("click", async ()=>{
  const cart = getCart();
  if(!cart.items.length){ alert("Panier vide"); return; }
  try{
    const res = await fetch("/api/commande", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ items: cart.items, total: cart.items.reduce((s,i)=>s+i.qty*i.prix,0) }) });
    const data = await res.json();
    if(data.success){ alert("Commande enregistrée id:"+data.orderId); localStorage.removeItem(CART_KEY); updateCartUI(); }
  }catch(e){ alert("Erreur"); console.error(e); }
});
document.addEventListener("DOMContentLoaded", updateCartUI);
