const $ = id => document.getElementById(id);
let lista = [];

const getPass = () => { try { return sessionStorage.getItem("aazPass") || ""; } catch (e) { return ""; } };
const setPass = v => { try { v ? sessionStorage.setItem("aazPass", v) : sessionStorage.removeItem("aazPass"); } catch (e) {} };

async function cargar() {
  try {
    lista = await DB.todos(getPass());
  } catch (e) {
    setPass("");
    $("pwe").textContent = e.message === "401" ? "Contraseña incorrecta" : "No se pudo conectar";
    return false;
  }
  const personas = lista.reduce((a, r) => a + (r.personas || 0), 0);
  $("c1").textContent = lista.length;
  $("c2").textContent = personas;
  $("c3").textContent = DB.dinero(lista.reduce((a, r) => a + (r.total || 0), 0));
  $("vacio").style.display = lista.length ? "none" : "block";

  const tb = $("tb"); tb.textContent = "";
  lista.forEach((r, i) => {
    const tr = document.createElement("tr");
    [i + 1, r.nombre, r.apellido || "-", r.personas, r.menores || 0, DB.dinero(r.total || 0),
     r.fecha ? new Date(r.fecha).toLocaleString("es-AR") : "-"].forEach(v => {
      const td = document.createElement("td"); td.textContent = v; tr.appendChild(td);
    });
    const td = document.createElement("td");
    const b = document.createElement("button");
    b.className = "x"; b.textContent = "✕";
    b.onclick = async () => {
      if (!confirm("¿Eliminar a " + r.nombre + " " + (r.apellido || "") + "?")) return;
      try { await DB.eliminar(r.id, getPass()); cargar(); } catch (e) { alert("No se pudo eliminar"); }
    };
    td.appendChild(b); tr.appendChild(td); tb.appendChild(tr);
  });
  return true;
}

async function entrar() {
  const ok = await cargar();
  $("login").style.display = ok ? "none" : "block";
  $("panel").style.display = ok ? "block" : "none";
}

$("lf").addEventListener("submit", e => {
  e.preventDefault();
  $("pwe").textContent = "";
  setPass($("pw").value);
  entrar();
});
$("bo").onclick = () => { setPass(""); location.reload(); };
$("br").onclick = cargar;
$("bc").onclick = () => navigator.clipboard.writeText(DB.armarJSON(lista))
  .then(() => { $("bc").textContent = "¡Copiado!"; }, () => prompt("Copiá el JSON:", DB.armarJSON(lista)));
$("bd").onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const personas = lista.reduce((a, r) => a + (r.personas || 0), 0);
  const total = lista.reduce((a, r) => a + (r.total || 0), 0);

  doc.setFontSize(14);
  doc.text("25 Aniversario A.A.Z Aerocontrolados - Inscriptos", 14, 16);
  doc.setFontSize(10);
  doc.text("Inscriptos: " + lista.length + "   |   Personas: " + personas + "   |   Total: " + DB.dinero(total), 14, 23);

  doc.autoTable({
    startY: 28,
    head: [["N°", "Nombre", "Apellido", "Personas", "Menores", "Total", "Fecha"]],
    body: lista.map((r, i) => [
      i + 1, r.nombre, r.apellido || "-", r.personas || 0, r.menores || 0,
      DB.dinero(r.total || 0),
      r.fecha ? new Date(r.fecha).toLocaleString("es-AR") : "-"
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [224, 38, 43] }
  });

  doc.save("inscriptos-aaz.pdf");
};

if (getPass()) entrar();