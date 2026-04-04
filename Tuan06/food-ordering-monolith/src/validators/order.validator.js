const { z } = require("zod");

const orderItemSchema = z.object({
  foodId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

module.exports = {
  createOrderSchema,
};
