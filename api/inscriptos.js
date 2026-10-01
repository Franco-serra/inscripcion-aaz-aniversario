const cmd = require("./_redis");

module.exports = async (req, res) => {
  const P = process.env.ADMIN_PASS;
  if (!P || req.headers["x-admin-pass"] !== P) return res.status(401).json({ error: "no autorizado" });

  try {
    if (req.method === "DELETE") {
      await cmd(["HDEL", "inscripciones", String(req.query.id || "")]);
      return res.status(200).json({ ok: true });
    }
    if (req.method === "GET") {
      const out = await cmd(["HGETALL", "inscripciones"]);
      const arr = out.result || [];
      const lista = [];
      for (let i = 1; i < arr.length; i += 2) {
        try { lista.push(JSON.parse(arr[i])); } catch (e) {}
      }
      lista.sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
      return res.status(200).json({ contador: lista.length, inscriptos: lista });
    }
    res.status(405).json({ error: "metodo" });
  } catch (e) {
    res.status(500).json({ error: "error de base" });
  }
};