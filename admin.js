const ADMIN_PASS = "aaz2026"; // ← cambiala
const $ = id => document.getElementById(id);
let lista = [];

async function cargar() {
  lista = await DB.todos();
  const personas = lista.reduce((a, r) => a + (r.personas || 0), 0);
  $("c1").textContent = lista.length;
  $("c2").textContent = personas;
  $("c3").textContent = DB.dinero(personas * DB.PRECIO);
  $("vacio").style.display = lista.length ? "none" : "block";

  const tb = $("tb"); tb.textContent = "";
  lista.forEach((r, i) => {
    const tr = document.createElement("tr");
    [i + 1, r.nombre, r.apellido || "-", r.personas, DB.dinero(r.total || 0),
     r.fecha ? new Date(r.fecha).toLocaleString("es-AR") : "-"].forEach(v => {
      const td = document.createElement("td"); td.textContent = v; tr.appendChild(td);
    });
    const td = document.createElement("td");
    if (!r._archivo) { // solo se pueden borrar las guardadas en este navegador
      const b = document.createElement("button");
      b.className = "x"; b.textContent = "✕";
      b.onclick = () => { if (confirm("¿Eliminar a " + r.nombre + " " + (r.apellido || "") + "?")) { DB.eliminar(r.id); cargar(); } };
      td.appendChild(b);
    }
    tr.appendChild(td); tb.appendChild(tr);
  });
}

function entrar() {
  $("login").style.display = "none";
  $("panel").style.display = "block";
  cargar();
}

$("lf").addEventListener("submit", e => {
  e.preventDefault();
  if ($("pw").value === ADMIN_PASS) {
    try { sessionStorage.setItem("aazAdm", "1"); } catch (x) {}
    entrar();
  } else $("pwe").textContent = "Contraseña incorrecta";
});
$("bo").onclick = () => { try { sessionStorage.removeItem("aazAdm"); } catch (x) {} location.reload(); };
$("br").onclick = cargar;
$("bc").onclick = () => navigator.clipboard.writeText(DB.armarJSON(lista))
  .then(() => { $("bc").textContent = "¡Copiado!"; }, () => prompt("Copiá el JSON:", DB.armarJSON(lista)));
$("bd").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([DB.armarJSON(lista)], { type: "application/json" }));
  a.download = "inscriptos.json"; a.click();
};

try { if (sessionStorage.getItem("aazAdm") === "1") entrar(); } catch (x) {}
