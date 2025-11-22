const router = require("express").Router();
const inventory = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { requireAnyRole } = require("../middleware/roleMiddleware");

// Products
// Managers only for create/update
router.post("/products", authMiddleware, requireRole('inventory_manager'), inventory.createProduct);
router.get("/products", authMiddleware, inventory.listProducts);

// Warehouses
router.post("/warehouses", authMiddleware, requireRole('inventory_manager'), inventory.createWarehouse);
router.get("/warehouses", authMiddleware, inventory.listWarehouses);

// Stock quants (readable by staff and managers)
router.get("/quants", authMiddleware, inventory.getQuants);

// Receipts / Deliveries / Transfers / Adjustments
// Creation allowed by staff or managers (draft creation)
router.post("/receipts", authMiddleware, requireAnyRole('inventory_manager', 'warehouse_staff'), inventory.createReceipt);
// Validation (approve/apply) only managers
router.post("/receipts/:id/validate", authMiddleware, requireRole('inventory_manager'), inventory.validateReceipt);

router.post("/deliveries", authMiddleware, requireAnyRole('inventory_manager', 'warehouse_staff'), inventory.createDelivery);
router.post("/deliveries/:id/validate", authMiddleware, requireRole('inventory_manager'), inventory.validateDelivery);

router.post("/transfers", authMiddleware, requireAnyRole('inventory_manager', 'warehouse_staff'), inventory.createTransfer);
router.post("/transfers/:id/validate", authMiddleware, requireRole('inventory_manager'), inventory.validateTransfer);

router.post("/adjustments", authMiddleware, requireAnyRole('inventory_manager', 'warehouse_staff'), inventory.createAdjustment);
router.post("/adjustments/:id/validate", authMiddleware, requireRole('inventory_manager'), inventory.validateAdjustment);

// Categories
router.post("/categories", authMiddleware, requireRole('inventory_manager'), inventory.createCategory);
router.get("/categories", authMiddleware, inventory.listCategories);

// Reorder rules
router.post("/reorder-rules", authMiddleware, requireRole('inventory_manager'), inventory.createReorderRule);
router.get("/reorder-rules", authMiddleware, inventory.listReorderRules);

// Dashboard & alerts (read access for staff/managers)
router.get("/dashboard", authMiddleware, requireAnyRole('inventory_manager', 'warehouse_staff'), inventory.dashboard);
router.get("/alerts/low-stock", authMiddleware, requireAnyRole('inventory_manager', 'warehouse_staff'), inventory.lowStockAlerts);

// Stock move history (read access)
router.get("/moves", authMiddleware, requireAnyRole('inventory_manager', 'warehouse_staff'), inventory.moveHistory);

module.exports = router;
