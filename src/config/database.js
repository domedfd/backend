const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const url = process.env.MONGOLAB_URI
  ? process.env.MONGOLAB_URI
  : "mongodb://localhost/mymoney";

module.exports = mongoose.connect(url, {
  useNewUrlParser: true
});

mongoose.Error.messages.general.required = "O atributo '{PATH}' e obrigatorio.";
mongoose.Error.messages.Number.min =
  "O '{VALUE}' informado e menor que o limite minimo de '{MIN}'.";
mongoose.Error.messages.Number.max =
  "O '{VALUE}' informado e maior que o limite minimo de '{MAX}'.";
mongoose.Error.messages.String.enum =
  "'{VALUE}' nao e valido para o atributo '{PATH}'.";
