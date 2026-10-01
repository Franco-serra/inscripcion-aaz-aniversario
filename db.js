// Capa de datos. Lee inscriptos.json (archivo) + inscripciones guardadas en este navegador.
// Si más adelante tenés un backend, solo hay que cambiar estas funciones.
const DB = {
  PRECIO: 20000,
    PRECIO_MENOR: 10000,
    total(mayores, menores) { return this.PRECIO * (1 + mayores) + this.PRECIO_MENOR * menores; },
  KEY: "aaz25_inscripciones",

  async archivo() {
    try {
      const r = await fetch("inscriptos.json", { cache: "no-store" });
      const j = await r.json();
      return (j.inscriptos || []).map(x => ({ ...x, _archivo: true }));
    } catch (e) { return []; }
  },
  local() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || "[]"); } catch (e) { return []; }
  },
  guardarLocal(lista) {
    try { localStorage.setItem(this.KEY, JSON.stringify(lista)); } catch (e) {}
  },
  async todos() {
    const a = await this.archivo(), l = this.local();
    const ids = new Set(a.map(x => x.id));
    return a.concat(l.filter(x => !ids.has(x.id)))
            .sort((x, y) => (x.fecha || "") < (y.fecha || "") ? -1 : 1);
  },
  async agregar(rec) {
    const l = this.local(); l.push(rec); this.guardarLocal(l);
  },
  eliminar(id) {
    this.guardarLocal(this.local().filter(x => x.id !== id));
  },
  armarJSON(lista) {
    const limpio = lista.map(({ _archivo, ...r }) => r);
    return JSON.stringify({
      evento: "25 Aniversario A.A.Z Aerocontrolados", fecha: "2026-10-17",
      valor: this.PRECIO, contador: limpio.length, inscriptos: limpio
    }, null, 2);
  },
  dinero(n) { return "$" + n.toLocaleString("es-AR"); }
};
