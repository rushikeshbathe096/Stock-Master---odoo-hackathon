const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const inventoryService = require("../services/inventoryService");

async function createProduct(req, res) {
  try {
    const { sku, name, description, uom, defaultPrice, categoryId, initialStock, initialWarehouseId, initialLocationId } = req.body;
    if (!sku || !name) return res.status(400).json({ error: "Missing sku or name" });
    if (defaultPrice == null) return res.status(400).json({ error: "Missing defaultPrice" });

    const product = await prisma.product.create({ data: { sku, name, description, uom, defaultPrice, categoryId } });

    // create initial stock quant if provided
    if (initialStock != null && initialWarehouseId) {
      const qty = Number(initialStock);
      if (isNaN(qty) || qty < 0) return res.status(400).json({ error: "Invalid initialStock" });
      await prisma.stockQuant.create({ data: { productId: product.id, warehouseId: Number(initialWarehouseId), locationId: initialLocationId || null, quantity: qty.toString() } });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function listProducts(req, res) {
  try {
    const { q, sku, categoryId } = req.query;
    const where = {};
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
    if (sku) where.sku = sku;
    if (categoryId) where.categoryId = Number(categoryId);

    const products = await prisma.product.findMany({ where });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function createWarehouse(req, res) {
  try {
    const { code, name, address, phone } = req.body;
    if (!code || !name) return res.status(400).json({ error: "Missing code or name" });
    const warehouse = await prisma.warehouse.create({ data: { code, name, address, phone } });
    res.json(warehouse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function listWarehouses(req, res) {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res.json(warehouses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getQuants(req, res) {
  try {
    const { productId, warehouseId, locationId } = req.query;
    const quants = await inventoryService.getStockQuant({ productId, warehouseId, locationId });
    res.json(quants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Create receipt and immediately apply it
async function createReceipt(req, res) {
  try {
    const { receiptNo, reference, warehouseId, partner, lines } = req.body;
    if (!warehouseId) return res.status(400).json({ error: "Missing warehouseId" });
    if (!lines || !Array.isArray(lines) || lines.length === 0) return res.status(400).json({ error: "Missing lines" });
    for (const l of lines) {
      if (!l.productId || l.quantity == null) return res.status(400).json({ error: "Each line requires productId and quantity" });
      const qty = Number(l.quantity);
      if (isNaN(qty) || qty <= 0) return res.status(400).json({ error: "Invalid line quantity" });
    }
    const receipt = await prisma.receipt.create({ data: { receiptNo, reference, warehouseId: Number(warehouseId), partner, status: 'draft', lines: { create: lines.map(l=>({ productId: Number(l.productId), quantity: l.quantity.toString(), uom: l.uom, unitPrice: l.unitPrice ? l.unitPrice.toString() : null })) } }, include: { lines: true } });
    res.json({ ok: true, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Validate (apply) receipt — updates quants and creates stock moves; moves status -> done
async function validateReceipt(req, res) {
  try {
    const { id } = req.params;
    const receipt = await prisma.receipt.findUnique({ where: { id: Number(id) }, include: { lines: true } });
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    if (receipt.status === 'done') return res.status(400).json({ error: "Invalid status transition" });
    if (receipt.status === 'cancelled') return res.status(400).json({ error: "Cannot validate cancelled document" });
    await inventoryService.applyReceipt({ receiptId: receipt.id, lines: receipt.lines, createdById: req.user?.userId });
    const updated = await prisma.receipt.findUnique({ where: { id: receipt.id }, include: { lines: true } });
    res.json({ ok: true, receipt: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Create delivery and apply
async function createDelivery(req, res) {
  try {
    const { deliveryNo, reference, warehouseId, partner, lines } = req.body;
    if (!warehouseId) return res.status(400).json({ error: "Missing warehouseId" });
    if (!lines || !Array.isArray(lines) || lines.length === 0) return res.status(400).json({ error: "Missing lines" });
    for (const l of lines) {
      if (!l.productId || l.quantity == null) return res.status(400).json({ error: "Each line requires productId and quantity" });
      const qty = Number(l.quantity);
      if (isNaN(qty) || qty <= 0) return res.status(400).json({ error: "Invalid line quantity" });
    }
    const delivery = await prisma.delivery.create({ data: { deliveryNo, reference, warehouseId: Number(warehouseId), partner, status: 'draft', lines: { create: lines.map(l=>({ productId: Number(l.productId), quantity: l.quantity.toString(), uom: l.uom, unitPrice: l.unitPrice ? l.unitPrice.toString() : null })) } }, include: { lines: true } });
    res.json({ ok: true, delivery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function validateDelivery(req, res) {
  try {
    const { id } = req.params;
    const delivery = await prisma.delivery.findUnique({ where: { id: Number(id) }, include: { lines: true } });
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    if (delivery.status === 'done') return res.status(400).json({ error: "Invalid status transition" });
    if (delivery.status === 'cancelled') return res.status(400).json({ error: "Cannot validate cancelled document" });
    await inventoryService.applyDelivery({ deliveryId: delivery.id, lines: delivery.lines, createdById: req.user?.userId });
    const updated = await prisma.delivery.findUnique({ where: { id: delivery.id }, include: { lines: true } });
    res.json({ ok: true, delivery: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Create transfer and apply
async function createTransfer(req, res) {
  try {
    const { transferNo, reference, fromWarehouseId, toWarehouseId, lines } = req.body;
    if (!fromWarehouseId || !toWarehouseId) return res.status(400).json({ error: "Missing fromWarehouseId or toWarehouseId" });
    if (!lines || !Array.isArray(lines) || lines.length === 0) return res.status(400).json({ error: "Missing lines" });
    for (const l of lines) {
      if (!l.productId || l.quantity == null) return res.status(400).json({ error: "Each line requires productId and quantity" });
      const qty = Number(l.quantity);
      if (isNaN(qty) || qty <= 0) return res.status(400).json({ error: "Invalid line quantity" });
    }
    const transfer = await prisma.transfer.create({ data: { transferNo, reference, fromWarehouseId: Number(fromWarehouseId), toWarehouseId: Number(toWarehouseId), status: 'draft', lines: { create: lines.map(l=>({ productId: Number(l.productId), quantity: l.quantity.toString(), uom: l.uom, fromLocationId: l.fromLocationId, toLocationId: l.toLocationId })) } }, include: { lines: true } });
    res.json({ ok: true, transfer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function validateTransfer(req, res) {
  try {
    const { id } = req.params;
    const transfer = await prisma.transfer.findUnique({ where: { id: Number(id) }, include: { lines: true } });
    if (!transfer) return res.status(404).json({ error: "Transfer not found" });
    if (transfer.status === 'done') return res.status(400).json({ error: "Invalid status transition" });
    if (transfer.status === 'cancelled') return res.status(400).json({ error: "Cannot validate cancelled document" });
    await inventoryService.applyTransfer({ transferId: transfer.id, lines: transfer.lines, fromWarehouseId: transfer.fromWarehouseId, toWarehouseId: transfer.toWarehouseId, createdById: req.user?.userId });
    const updated = await prisma.transfer.findUnique({ where: { id: transfer.id }, include: { lines: true } });
    res.json({ ok: true, transfer: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Create adjustment and apply
async function createAdjustment(req, res) {
  try {
    const { adjustmentNo, warehouseId, reason, lines } = req.body;
    if (!warehouseId) return res.status(400).json({ error: "Missing warehouseId" });
    if (!lines || !Array.isArray(lines) || lines.length === 0) return res.status(400).json({ error: "Missing lines" });
    for (const l of lines) {
      if (!l.productId || l.quantity == null) return res.status(400).json({ error: "Each line requires productId and quantity" });
      const qty = Number(l.quantity);
      if (isNaN(qty) || qty === 0) return res.status(400).json({ error: "Invalid line quantity" });
    }
    const adjustment = await prisma.adjustment.create({ data: { adjustmentNo, warehouseId: Number(warehouseId), reason, status: 'draft', lines: { create: lines.map(l=>({ productId: Number(l.productId), quantity: l.quantity.toString(), uom: l.uom, note: l.note })) } }, include: { lines: true } });
    res.json({ ok: true, adjustment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function validateAdjustment(req, res) {
  try {
    const { id } = req.params;
    const adjustment = await prisma.adjustment.findUnique({ where: { id: Number(id) }, include: { lines: true } });
    if (!adjustment) return res.status(404).json({ error: "Adjustment not found" });
    if (adjustment.status === 'done') return res.status(400).json({ error: "Invalid status transition" });
    if (adjustment.status === 'cancelled') return res.status(400).json({ error: "Cannot validate cancelled document" });
    await inventoryService.applyAdjustment({ adjustmentId: adjustment.id, lines: adjustment.lines, createdById: req.user?.userId });
    const updated = await prisma.adjustment.findUnique({ where: { id: adjustment.id }, include: { lines: true } });
    res.json({ ok: true, adjustment: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// --- Categories & Reorder Rules ---
async function createCategory(req, res) {
  try {
    const { name, parentId } = req.body;
    if (!name) return res.status(400).json({ error: "Missing name" });
    const cat = await prisma.category.create({ data: { name, parentId } });
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function listCategories(req, res) {
  try {
    const cats = await prisma.category.findMany();
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function createReorderRule(req, res) {
  try {
    const { productId, warehouseId, minQty, maxQty } = req.body;
    if (!productId || !warehouseId || minQty == null) return res.status(400).json({ error: "Missing productId, warehouseId or minQty" });
    const rule = await prisma.reorderRule.create({ data: { productId: Number(productId), warehouseId: Number(warehouseId), minQty: minQty.toString(), maxQty: maxQty ? maxQty.toString() : null } });
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function listReorderRules(req, res) {
  try {
    const rules = await prisma.reorderRule.findMany({ include: { product: true, warehouse: true } });
    res.json(rules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// --- Dashboard & Alerts ---
async function dashboard(req, res) {
  try {
    // total distinct products in stock (any quant with quantity > 0)
    const distinctProducts = await prisma.stockQuant.findMany({ where: { quantity: { gt: "0" } }, distinct: ['productId'], select: { productId: true } });
    const totalProductsInStock = distinctProducts.length;

    // total stock value: sum of latest quants * product price (approximate)
    const latestQuants = await prisma.stockQuant.findMany({ include: { product: { select: { defaultPrice: true } } } });
    let totalStockValue = 0;
    for (const q of latestQuants) {
      const qty = Number(q.quantity || 0);
      const price = q.product?.defaultPrice ? Number(q.product.defaultPrice) : 0;
      totalStockValue += qty * price;
    }

    // pending receipts/deliveries/transfers/adjustments = draft|waiting|ready
    const pendingStatuses = ["draft", "waiting", "ready"];
    const [pendingReceipts, pendingDeliveries, pendingTransfers, pendingAdjustments] = await Promise.all([
      prisma.receipt.count({ where: { status: { in: pendingStatuses } } }),
      prisma.delivery.count({ where: { status: { in: pendingStatuses } } }),
      prisma.transfer.count({ where: { status: { in: pendingStatuses } } }),
      prisma.adjustment.count({ where: { status: { in: pendingStatuses } } }),
    ]);

    // low stock count (rules where latest quant < minQty)
    const rules = await prisma.reorderRule.findMany({ include: { product: true, warehouse: true } });
    let lowStockCount = 0;
    for (const r of rules) {
      const quant = await prisma.stockQuant.findFirst({ where: { productId: r.productId, warehouseId: r.warehouseId }, orderBy: { updatedAt: 'desc' } });
      const qty = quant ? Number(quant.quantity) : 0;
      if (qty < Number(r.minQty)) lowStockCount++;
    }

    res.json({ totalProductsInStock, totalStockValue, lowStockCount, pendingReceipts, pendingDeliveries, pendingTransfers, pendingAdjustments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function lowStockAlerts(req, res) {
  try {
    // Efficient low-stock alerts: return rules where current quant < minQty
    const rules = await prisma.reorderRule.findMany({ include: { product: true, warehouse: true } });
    const alerts = [];
    // batch queries could be optimized further but keep logic simple and safe
    for (const r of rules) {
      const quant = await prisma.stockQuant.findFirst({ where: { productId: r.productId, warehouseId: r.warehouseId }, orderBy: { updatedAt: 'desc' } });
      const qty = quant ? Number(quant.quantity) : 0;
      if (qty < Number(r.minQty)) alerts.push({ rule: r, quantity: qty });
    }
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function moveHistory(req, res) {
  try {
    const { productId, warehouseId, locationId, documentType, status, date_from, date_to, categoryId, sort = 'desc', limit = 100, page = 1 } = req.query;

    // Build where clause incrementally to avoid OR overwrite bugs
    const where = {};
    if (productId) where.productId = Number(productId);
    if (documentType) where.documentType = documentType;
    if (status) where.status = status;
    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) where.createdAt.gte = new Date(date_from);
      if (date_to) where.createdAt.lte = new Date(date_to);
    }

    // For warehouse/location, we want to match either from or to. Build an "OR" array and add if needed.
    const orClauses = [];
    if (warehouseId) {
      const wid = Number(warehouseId);
      orClauses.push({ fromWarehouseId: wid });
      orClauses.push({ toWarehouseId: wid });
    }
    if (locationId) {
      const lid = Number(locationId);
      orClauses.push({ fromLocationId: lid });
      orClauses.push({ toLocationId: lid });
    }
    if (orClauses.length > 0) where.OR = orClauses;

    // Pagination & sorting
    const take = Math.min(1000, Math.max(1, Number(limit)));
    const pageNum = Math.max(1, Number(page));
    const skip = (pageNum - 1) * take;
    const order = sort === 'asc' ? 'asc' : 'desc';

    // If category filter requested, join product and filter by product.categoryId
    const include = { product: { select: { id: true, name: true, sku: true, categoryId: true } }, fromWarehouse: true, toWarehouse: true };

    let finalWhere = where;
    if (categoryId) {
      finalWhere = {
        AND: [
          where,
          { product: { categoryId: Number(categoryId) } }
        ]
      };
    }

    const [moves, total] = await Promise.all([
      prisma.stockMove.findMany({ where: finalWhere, include, orderBy: { createdAt: order }, take, skip }),
      prisma.stockMove.count({ where: finalWhere })
    ]);

    res.json({ data: moves, meta: { page: pageNum, limit: take, total } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createProduct,
  listProducts,
  createWarehouse,
  listWarehouses,
  getQuants,
  createReceipt,
  createDelivery,
  createTransfer,
  createAdjustment,
  validateReceipt,
  validateDelivery,
  validateTransfer,
  validateAdjustment,
  // categories & rules
  createCategory,
  listCategories,
  createReorderRule,
  listReorderRules,
  // dashboard & alerts
  dashboard,
  lowStockAlerts,
  moveHistory,
};
