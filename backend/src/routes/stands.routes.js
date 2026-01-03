import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadStandCover } from "../controllers/stands.upload.controller.js";

import { getAllStands, getMyStands, createStand, getStandDetails } from "../controllers/stands.controller.js";
router.get("/", (req, res) => {
  res.json({ ok: true, route: "stands root ✅" });
});


router.get("/", getAllStands);

// auth routes before param
router.get("/me/list", authMiddleware, getMyStands);
router.post("/", authMiddleware, createStand);

router.get("/:id", getStandDetails);
router.post("/:standId/cover", authMiddleware, upload.single("cover"), uploadStandCover);
// UPDATE STAND (coop owner)
router.put("/:id", authMiddleware, async (req, res) => {
    const standId = Number(req.params.id);
    const { stand_name, description, category, address } = req.body;

    try {
        // تأكد أن stand ديال هاد coop
        const [rows] = await db.query(
            "SELECT * FROM stands WHERE id=? AND user_id=?",
            [standId, req.user.id]
        );
        if (rows.length === 0)
            return res.status(403).json({ message: "Stand غير تابع لك" });

        await db.query(
            "UPDATE stands SET stand_name=?, description=?, category=?, address=? WHERE id=?",
            [stand_name, description, category, address, standId]
        );

        res.json({ message: "✅ Stand updated" });
    } catch (err) {
        res.status(500).json({ message: "Erreur update stand" });
    }
});

// DELETE STAND (coop owner) + cascade delete products + requests
router.delete("/:id", authMiddleware, async (req, res) => {
    const standId = Number(req.params.id);

    try {
        const [rows] = await db.query(
            "SELECT * FROM stands WHERE id=? AND user_id=?",
            [standId, req.user.id]
        );
        if (rows.length === 0)
            return res.status(403).json({ message: "Stand غير تابع لك" });

        // delete requests for this stand
        await db.query("DELETE FROM requests WHERE stand_id=?", [standId]);

        // delete products
        await db.query("DELETE FROM products WHERE stand_id=?", [standId]);

        // delete stand
        await db.query("DELETE FROM stands WHERE id=?", [standId]);

        res.json({ message: "✅ Stand deleted" });
    } catch (err) {
        res.status(500).json({ message: "Erreur delete stand" });
    }
});


export default router;
