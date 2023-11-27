const mongoose = require("mongoose");

const solarDataSchema = new mongoose.Schema({
  Time: { type: String, required: true, unique: true },
  Temp: { type: Number, required: true  },
  Vpv: { type: Number },
  Iac: { type: Number },
  Vac: { type: Number },
  Fac: { type: Number },
  Pac: { type: Number },
  E_Total: { type: Number },
  h_Total: { type: Number },
  Vpv1: { type: Number },
  Vpv2: { type: Number },
  Vpv3: { type: Number },
  Ipv1: { type: Number },
  Ipv2: { type: Number },
  Ipv3: { type: Number },
  Vac1: { type: Number },
  Vac2: { type: Number },
  Vac3: { type: Number },
});

const SolarData = mongoose.model('SolarData', solarDataSchema);

module.exports = { solarDataSchema, SolarData };;
