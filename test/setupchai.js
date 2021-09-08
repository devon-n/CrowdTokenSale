"use strict";
var chai = require("chai"); // use chai
const BN = web3.utils.BN; // initialize big number variable
const chaiBN = require("chai-bn")(BN); // not sure
chai.use(chaiBN); // use chais big number

var chaiAsPromised = require("chai-as-promised"); // using chai-as-promised
chai.use(chaiAsPromised); // same ^

module.exports = chai;