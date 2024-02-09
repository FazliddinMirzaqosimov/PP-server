const Purchase = require("../models/purchaseModel");

exports.getCurrentPlanExpireDate = async (userId) => {
  let expirationDate = null,
    planPurchase = null;

  const latestPurchase = await Purchase.findOne({
    userId,
    amount: { $lt: 0 },
  })
    .sort({ createdAt: -1 })
    .populate("planId");

  if (latestPurchase) {
    const latestPlanDuration =
      latestPurchase.planId.duration * 24 * 60 * 60 * 1000;
    const latestPlanStartDate = latestPurchase.createdAt.getTime();
    const currentTime = new Date().getTime();
    const expiresIn = new Date(latestPlanStartDate + latestPlanDuration);

    if (expiresIn.getTime() > currentTime) {
      expirationDate = expiresIn;
      planPurchase = latestPurchase;
    }
  }

  return { expirationDate, planPurchase };
};
