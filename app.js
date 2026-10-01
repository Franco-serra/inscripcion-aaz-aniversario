const $ = id => document.getElementById(id);

function mostrar(texto, error) {
  const m = $("msg");
  m.textContent = texto;
  m.className = "msg" + (error ? " err" : "");
  m.style.display = "block";
}

function leer() {
  return {
    mayores: Math.max(parseInt($("m").value) || 0, 0),
    menores: Math.max(parseInt($("k").value) || 0, 0)
  };
}
function calcular() {
  const { mayores, menores } = leer();
  $("tot").textContent = DB.dinero(DB.total(mayores, menores));
}
$("m").addEventListener("input", calcular);
$("k").addEventListener("input", calcular);

$("lm").addEventListener("change", () => {
  const on = $("lm").checked;
  $("boxMenores").style.display = on ? "block" : "none";
  $("notaMenor").style.display = on ? "inline" : "none";
  $("k").value = on ? 1 : 0;
  calcular();
});

$("f").addEventListener("submit", async e => {
  e.preventDefault();
  const nombre = $("n").value.trim(), apellido = $("a").value.trim();

  const { mayores, menores } = leer();
  const rec = {
    id: "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nombre, apellido,
    acompanantes: mayores, menores,
    personas: 1 + mayores + menores,
    total: DB.total(mayores, menores),
    fecha: new Date().toISOString()
  };
  $("send").disabled = true;
  try {
    await DB.agregar(rec);
    mostrar("¡Listo, " + rec.nombre + " " + rec.apellido + "! Quedaste inscripto/a para el 17 de octubre. Total: " + DB.dinero(rec.total) + ".");
    $("f").reset(); $("lm").dispatchEvent(new Event("change"));
  } catch (err) {
    mostrar("No se pudo guardar. Probá de nuevo.", true);
  } finally {
    $("send").disabled = false;
  }
});