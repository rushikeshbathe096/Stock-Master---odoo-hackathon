const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function upsertQuant(productId, warehouseId, locationId, delta, tx) {
  const client = tx || prisma;

  // Find existing quant
  const where = { productId, warehouseId, locationId };
  let quant = await client.stockQuant.findUnique({ where });

  if (!quant) {
    quant = await client.stockQuant.create({
      data: {
        productId,
        warehouseId,
        locationId,
        quantity: delta.toString(),
      },
    });
  } else {
    const newQty = (Number(quant.quantity) || 0) + Number(delta);
    if (newQty < 0) throw new Error("Insufficient stock for productId=" + productId);
    quant = await client.stockQuant.update({ where, data: { quantity: newQty.toString() } });
  }

  return quant;
}

async function createStockMove({ productId, quantity, uom, fromWarehouseId, toWarehouseId, fromLocationId, toLocationId, reason, createdById, documentType, documentId }, tx) {
  const client = tx || prisma;
  const move = await client.stockMove.create({
    data: {
      productId,
      quantity: quantity.toString(),
      uom,
      fromWarehouseId: fromWarehouseId || null,
      toWarehouseId: toWarehouseId || null,
      fromLocationId: fromLocationId || null,
      toLocationId: toLocationId || null,
      reason,
      reference: documentId ? `${documentType?.toUpperCase?.() || ''}#${documentId}` : null,
      documentType: documentType || null,
      documentId: documentId || null,
      createdById: createdById || null,
      status: "done",
    },
  });
  return move;
}

// Apply a receipt: increment quant in warehouse/location and create moves
async function applyReceipt({ receiptId, lines, createdById }) {
  return prisma.$transaction(async (tx) => {
    const receipt = await tx.receipt.findUnique({ where: { id: receiptId } });
    if (!receipt) throw new Error("Receipt not found");
    if (receipt.status === "done") throw new Error("Receipt already done");
    for (const line of lines) {
      const { productId, quantity, uom, locationId, warehouseId } = line;
      // Increase quant
      await upsertQuant(productId, warehouseId, locationId || null, Number(quantity), tx);

      // Create stock move (incoming)
      await createStockMove({ productId, quantity, uom, toWarehouseId: warehouseId, toLocationId: locationId, reason: `Receipt #${receiptId}`, createdById, documentType: 'receipt', documentId: receiptId }, tx);
    }
    // mark receipt as done
    await tx.receipt.update({ where: { id: receiptId }, data: { status: "done" } });
  });
}

// Apply a delivery: decrement quant and create moves
async function applyDelivery({ deliveryId, lines, createdById }) {
  return prisma.$transaction(async (tx) => {
    const delivery = await tx.delivery.findUnique({ where: { id: deliveryId } });
    if (!delivery) throw new Error("Delivery not found");
    if (delivery.status === "done") throw new Error("Delivery already done");
    for (const line of lines) {
      const { productId, quantity, uom, locationId, warehouseId } = line;
      // Decrease quant
      await upsertQuant(productId, warehouseId, locationId || null, -Number(quantity), tx);

      // Create stock move (outgoing)
      await createStockMove({ productId, quantity: -Number(quantity), uom, fromWarehouseId: warehouseId, fromLocationId: locationId, reason: `Delivery #${deliveryId}`, createdById, documentType: 'delivery', documentId: deliveryId }, tx);
    }
    await tx.delivery.update({ where: { id: deliveryId }, data: { status: "done" } });
  });
}

// Apply transfer: move stock from one warehouse to another
async function applyTransfer({ transferId, lines, fromWarehouseId, toWarehouseId, createdById }) {
  return prisma.$transaction(async (tx) => {
    const transfer = await tx.transfer.findUnique({ where: { id: transferId } });
    if (!transfer) throw new Error("Transfer not found");
    if (transfer.status === "done") throw new Error("Transfer already done");
    for (const line of lines) {
      const { productId, quantity, uom, fromLocationId, toLocationId } = line;
      // decrement from
      await upsertQuant(productId, fromWarehouseId, fromLocationId || null, -Number(quantity), tx);
      // increment to
      await upsertQuant(productId, toWarehouseId, toLocationId || null, Number(quantity), tx);

      await createStockMove({ productId, quantity, uom, fromWarehouseId, toWarehouseId, fromLocationId, toLocationId, reason: `Transfer #${transferId}`, createdById, documentType: 'transfer', documentId: transferId }, tx);
    }
    await tx.transfer.update({ where: { id: transferId }, data: { status: "done" } });
  });
}

// Apply adjustment: add signed delta
async function applyAdjustment({ adjustmentId, lines, createdById }) {
  return prisma.$transaction(async (tx) => {
    const adjustment = await tx.adjustment.findUnique({ where: { id: adjustmentId } });
    if (!adjustment) throw new Error("Adjustment not found");
    if (adjustment.status === "done") throw new Error("Adjustment already done");
    for (const line of lines) {
      const { productId, quantity, uom, locationId, warehouseId } = line;
      await upsertQuant(productId, warehouseId, locationId || null, Number(quantity), tx);
      await createStockMove({ productId, quantity, uom, toWarehouseId: warehouseId, toLocationId: locationId, reason: `Adjustment #${adjustmentId}`, createdById, documentType: 'adjustment', documentId: adjustmentId }, tx);
    }
    await tx.adjustment.update({ where: { id: adjustmentId }, data: { status: "done" } });
  });
}

async function getStockQuant({ productId, warehouseId, locationId }) {
  const where = {};
  if (productId) where.productId = Number(productId);
  if (warehouseId) where.warehouseId = Number(warehouseId);
  if (locationId) where.locationId = locationId === null ? null : Number(locationId);
  return prisma.stockQuant.findMany({ where });
}

module.exports = {
  upsertQuant,
  createStockMove,
  applyReceipt,
  applyDelivery,
  applyTransfer,
  applyAdjustment,
  getStockQuant,
};
