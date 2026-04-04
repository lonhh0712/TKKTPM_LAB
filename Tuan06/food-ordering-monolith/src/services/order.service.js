const foodModel = require("../models/food.model");
const orderModel = require("../models/order.model");

async function createOrder(userId, payload) {
  const foodIds = payload.items.map((item) => item.foodId);
  const foods = await foodModel.findFoodsByIds(foodIds);

  if (foods.length !== foodIds.length) {
    const err = new Error("One or more food items do not exist");
    err.statusCode = 400;
    throw err;
  }

  const foodMap = new Map(foods.map((f) => [Number(f.id), f]));

  const normalizedItems = payload.items.map((item) => {
    const food = foodMap.get(item.foodId);
    if (!food || !food.is_available) {
      const err = new Error(`Food ${item.foodId} is not available`);
      err.statusCode = 400;
      throw err;
    }

    const unitPrice = Number(food.price);
    const lineTotal = unitPrice * item.quantity;

    return {
      foodId: Number(food.id),
      foodName: food.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    };
  });

  const totalAmount = normalizedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  return orderModel.createOrder({
    userId,
    items: normalizedItems,
    totalAmount,
  });
}

async function getOrderHistory(userId) {
  return orderModel.findOrdersByUser(userId);
}

module.exports = {
  createOrder,
  getOrderHistory,
};
