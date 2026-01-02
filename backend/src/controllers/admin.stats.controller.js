import db from "../config/db.js";

export async function getStats(req, res) {
  try {
    const [[coops]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role='COOP' AND is_approved=1"
    );
    const [[pendingCoops]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role='COOP' AND is_approved=0"
    );
    const [[stands]] = await db.query("SELECT COUNT(*) AS total FROM stands WHERE is_approved=1");
    const [[pendingStands]] = await db.query("SELECT COUNT(*) AS total FROM stands WHERE is_approved=0");
    const [[products]] = await db.query("SELECT COUNT(*) AS total FROM products");
    const [[requests]] = await db.query("SELECT COUNT(*) AS total FROM requests");
    const [[newRequests]] = await db.query("SELECT COUNT(*) AS total FROM requests WHERE status='NEW'");

    return res.json({
      coops: coops.total,
      pendingCoops: pendingCoops.total,
      stands: stands.total,
      pendingStands: pendingStands.total,
      products: products.total,
      requests: requests.total,
      newRequests: newRequests.total,
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    return res.status(500).json({ message: "Erreur stats", error: err.message });
  }
}

export async function deleteStand(req, res) {
  try {
    const { id } = req.params;

    // delete products of stand first (if foreign keys exist)
    await db.query("DELETE FROM products WHERE stand_id=?", [id]);
    await db.query("DELETE FROM requests WHERE stand_id=?", [id]);

    const [r] = await db.query("DELETE FROM stands WHERE id=?", [id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: "Stand not found" });

    return res.json({ message: "Stand supprimé ✅" });
  } catch (err) {
    console.error("DELETE STAND ERROR:", err);
    return res.status(500).json({ message: "Erreur suppression", error: err.message });
  }
}
