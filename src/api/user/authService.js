const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./user");
const env = require("../../.env");
const errorHandler = require("../common/errorHandler");

User.methods(["get", "post", "put", "delete"]);
User.updateOptions({ new: true, runValidators: true });
User.after("put", errorHandler);

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*\d).{1,20})/; ///((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors.errors, error => errors.push(error.message));
  return res.status(400).json({ errors });
};

const login = (req, res, next) => {
  const email = req.body.email || "";
  const password = req.body.password || "";

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ ...user }, env.authSecret, {
        expiresIn: "1 day"
      });
      const { name, email, perfil } = user;
      res.json({ name, email, token, perfil });
    } else {
      return res.status(400).send({
        errors: [`Usuario/Contrasena Ivalidos`]
      });
    }
  });
};

const validateToken = (req, res, next) => {
  const token = req.body.token || "";

  jwt.verify(token, env.authSecret, function(err, decoded) {
    return res.status(200).send({ valid: !err });
  });
};

const signup = (req, res, next) => {
  const name = req.body.name || "";
  const email = req.body.email || "";
  const password = req.body.password || "";
  const confirmPassword = req.body.confirm_password || "";
  const perfil = req.body.perfil || "USUARIO";

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ["El email informado es invalido"] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [
        `La contrasena debe contener numeros, simbolos, letras mayusculas y minusculas`
      ]
    });
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ["Contrasenas diferentes"] });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user) {
      return res.status(400).send({ errors: ["Usuario existente"] });
    } else {
      const newUser = new User({ name, email, password: passwordHash, perfil });
      newUser.save(err => {
        if (err) {
          return sendErrorsFromDB(res, err);
        } else {
          login(req, res, next);
        }
      });
    }
  });
};

const altera = (req, res, next) => {
  const _id = req.body._id || "No asignado";
  const name = req.body.name || "No asignado";
  const email = req.body.email || "No asignado";
  const password = req.body.password || "No asignado";
  const confirmPassword = req.body.confirm_password || "No asignado";
  const perfil = req.body.perfil || "No asignado";

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ["El email informado es invalido"] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [
        `La contrasena debe contener numeros, simbolos, letras mayusculas y minusculas`
      ]
    });
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ["Contrasenas diferentes"] });
  }
  User.updateOne(
    { _id },
    { name, password: passwordHash, perfil },
    (error, value) => {
      if (error) {
        res.status(500).json({ errors: [error] });
      } else {
        return res.status(200).send("Alterado con exito!");
      }
    }
  );
};

module.exports = { login, signup, validateToken, altera };
