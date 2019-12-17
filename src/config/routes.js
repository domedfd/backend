const express = require("express");
const auth = require("./auth");

module.exports = function(server) {
  /*
   * Rotas protegidas por Token JWT
   */
  const protectedApi = express.Router();
  server.use("/api", protectedApi);

  protectedApi.use(auth);

  const BillingCycle = require("../api/billingCycle/billingCycleService");
  BillingCycle.register(protectedApi, "/billingCycles");

  const User = require("../api/user/userService");
  User.register(protectedApi, "/user");

  /*
   * Rotas abertas
   */
  const openApi = express.Router();
  server.use("/oapi", openApi);

  const AuthService = require("../api/user/authService");

  openApi.post("/login", AuthService.login);
  openApi.post("/signup", AuthService.signup);
  openApi.put("/altera", AuthService.altera);
  openApi.post("/validateToken", AuthService.validateToken);
};
