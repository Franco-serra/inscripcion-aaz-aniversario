const DB = {
  PRECIO: 20000,
  PRECIO_MENOR: 10000,
  total(mayores, menores) { return this.PRECIO * (1 + mayores) + this.PRECIO_MENOR * menores; },

  async agregar(rec) {
    const r = await fetch("/api/inscribir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec)
    });
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  },
  async todos(pass) {
    const r = await fetch("/api/inscriptos", { headers: { "x-admin-pass": pass }, cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).inscriptos;
  },
  async eliminar(id, pass) {
    const r = await fetch("/api/inscriptos?id=" + encodeURIComponent(id), {
      method: "DELETE", headers: { "x-admin-pass": pass }
    });
    if (!r.ok) throw new Error(String(r.status));
  },
  armarJSON(lista) {
    return JSON.stringify({
      evento: "25 Aniversario A.A.Z Aerocontrolados", fecha: "2026-10-17",
      valor: this.PRECIO, contador: lista.length, inscriptos: lista
    }, null, 2);
  },
    armarCSV(lista) {
    const esc = v => {
      let s = String(v == null ? "" : v);
      if (/^[=+\-@]/.test(s)) s = "'" + s; // evita que Excel interprete texto como fórmula
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const cab = ["N°", "Nombre", "Apellido", "Personas", "Menores", "Total", "Fecha"];
    const filas = lista.map((r, i) => [
      i + 1, r.nombre, r.apellido || "", r.personas || 0, r.menores || 0, r.total || 0,
      r.fecha ? new Date(r.fecha).toLocaleString("es-AR") : ""
    ]);
    return "\uFEFF" + [cab].concat(filas).map(f => f.map(esc).join(";")).join("\r\n");
  },
  dinero(n) { return "$" + n.toLocaleString("es-AR"); }
};