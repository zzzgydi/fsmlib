/**
 * example 1
 */

const { FSM, FSMState } = require("../dist/fsm.js");

const stateSolid = new FSMState("solid")
  .event("melt", "liquid")
  .enter(() => console.log("[solid enter]"))
  .leave(() => console.log("[solid leave]"));

const stateLiquid = new FSMState("liquid")
  .event("freeze", "solid")
  .event("vaporize", "gas")
  .enter(() => console.log("[liquid enter]"))
  .leave(() => console.log("[liquid leave]"));

const stateGas = new FSMState("gas")
  .event("condense", "liquid")
  .enter(() => console.log("[gas enter]"))
  .leave(() => console.log("[gas leave]"));

const fsm = new FSM().set(stateSolid).set(stateLiquid).set(stateGas).compile();

fsm.init("solid").melt().freeze().melt().vaporize();
console.log("Current State:", fsm.state);

fsm.goto("liquid");
console.log("Current State:", fsm.state);

fsm.vaporize().condense();
console.log("Current State:", fsm.state);
