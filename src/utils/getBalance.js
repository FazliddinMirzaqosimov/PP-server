const Purchase = require("../models/purchaseModel");

exports.getUserBalance = async (userId) => {
  const balance = await Purchase.aggregate([
    {
      $match: {
        userId,
      },
    },
    {
      $group: {
        _id: null,
        balance: { $sum: "$amount" },
      },
    },
  ]);

  return balance?.[0]?.balance || 0;
};
