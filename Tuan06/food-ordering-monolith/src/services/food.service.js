const foodModel = require("../models/food.model");

async function getFoodList() {
  return foodModel.listAvailableFoods();
}

module.exports = {
  getFoodList,
};
