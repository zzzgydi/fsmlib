import { FSM, FSMState } from "../src/fsm";

test("Test fsm", () => {
  const stateSolid = new FSMState("solid").event("melt", "liquid");

  const stateLiquid = new FSMState("liquid")
    .event("freeze", "solid")
    .event("vaporize", "gas");

  const stateGas = new FSMState("gas").event("condense", "liquid");

  const fsm = new FSM()
    .set(stateSolid)
    .set(stateLiquid)
    .set(stateGas)
    .compile();

  fsm.init("solid").melt().freeze().melt().vaporize();
  fsm.goto("gas");
  fsm.condense().freeze();
});
