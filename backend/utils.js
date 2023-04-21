"use strict";

const parseState = (state) =>
  state
    .split(";")
    .map((x) => x.split(":"))
    .reduce((data, [key, value]) => {
      data[key] = value;
      return data;
    }, {});

const handleError = (err) => {
  if (err) {
    console.log("ERROR");
    console.log(err);
  }
};

module.exports = {
  parseState,
  handleError,
};
