# fsmlib

A simple library finite state machine for JavaScript or TypeScript.

## Installation

```bash
npm install --save fsmlib
```

## Usage

```js
import { FSM, FSMState } from "fsmlib";

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

const fsm = new FSM()
  .set(stateSolid) // set state
  .set(stateLiquid)
  .set(stateGas)
  .compile(); // get the fsm instance

// run the fsm
fsm
  .init("solid") // set initial state
  .melt() // call the event
  .freeze()
  .melt()
  .vaporize();

// go to the specified state
fsm.goto("liquid");

// get the current state
console.log(fsm.state);
```
