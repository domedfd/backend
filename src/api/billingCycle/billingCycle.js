const restful = require("node-restful");
const mongoose = restful.mongoose;

const creditSchema = new mongoose.Schema({
  name: { type: String },
  value: {
    type: Number,
    min: 0
    // , require: true
  }
});

const debtSchema = new mongoose.Schema({
  name: { type: String },
  value: {
    type: Number,
    min: 0
    // ,
    // required: [true, "Informe o valor do debito!"]
  },
  status: {
    type: String,
    required: false,
    uppercase: true,
    enum: ["PAGO", "PENDENTE", "AGENDADO"]
  }
});

const billingCycleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  date: { type: String, required: true },
  credits: [creditSchema],
  debts: [debtSchema]
});

module.exports = restful.model("BillingCycle", billingCycleSchema);
