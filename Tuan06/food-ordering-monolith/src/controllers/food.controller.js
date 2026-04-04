const foodService = require("../services/food.service");

async function listFoods(req, res, next) {
  try {
    const foods = await foodService.getFoodList();
    return res.json(foods);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listFoods,
};
