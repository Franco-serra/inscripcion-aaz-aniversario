const cmd = require("./_redis");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "metodo" });
  const b = req.body || {};
  const nombre = String(b.nombre || "").trim().slice(0, 60);
  const apellido = String(b.apellido || "").trim().slice(0, 60);
  if (!nombre || !apellido) return res.status(400).json({ error: "faltan datos" });

  const clamp = v => Math.min(Math.max(parseInt(v) || 0, 0), 20);
  const mayores = clamp(b.acompanantes), menores = clamp(b.menores);
  const id = "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // El total se calcula acá, no se confía en el del navegador
  const rec = {
    id, nombre, apellido,
    acompanantes: mayores, menores,
    personas: 1 + mayores + menores,
    total: 20000 * (1 + mayores) + 10000 * menores,
    fecha: new Date().toISOString()
  };
  try {
    await cmd(["HSET", "inscripciones", id, JSON.stringify(rec)]);
    res.status(200).json(rec);
  } catch (e) {
    res.status(500).json({ error: "no se pudo guardar" });
  }
};