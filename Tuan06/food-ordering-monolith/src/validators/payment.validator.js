const { z } = require("zod");

const payOrderParamsSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});

module.exports = {
  payOrderParamsSchema,
};
