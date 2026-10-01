const $ = id => document.getElementById(id);

function mostrar(texto, error) {
  const m = $("msg");
  m.textContent = texto;
  m.className = "msg" + (error ? " err" : "");
  m.style.display = "block";
}
function calcular() {
  const p = Math.max(parseInt($("p").value) || 0, 0);
  $("tot").textContent = DB.dinero(p * DB.PRECIO);
}
$("p").addEventListener("input", calcular);

$("f").addEventListener("submit", async e => {
  e.preventDefault();
  const nombre = $("n").value.trim(), apellido = $("a").value.trim();
  const clave = (nombre + " " + apellido).toLowerCase().replace(/\s+/g, " ");
  const existentes = await DB.todos();
  if (existentes.some(r => ((r.nombre || "") + " " + (r.apellido || "")).toLowerCase().replace(/\s+/g, " ") === clave)) {
    mostrar("Ya hay una inscripción a nombre de " + nombre + " " + apellido + ".", true); return;
  }

  const personas = Math.max(1, parseInt($("p").value) || 1);
  const rec = {
    id: "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nombre, apellido,
    personas, total: personas * DB.PRECIO, fecha: new Date().toISOString()
  };
  try {
    await DB.agregar(rec);
    mostrar("¡Listo, " + rec.nombre + " " + rec.apellido + "! Quedaste inscripto/a para el 17 de octubre. Total: " + DB.dinero(rec.total) + ".");
    $("f").reset(); $("p").value = 1; calcular();
  } catch (err) { mostrar("No se pudo guardar. Probá de nuevo.", true); }
});
