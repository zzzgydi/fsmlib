/**
 * fsmjs
 * Finite State Machine
 */

const invalidEvents = [
  "state",
  "init",
  "can",
  "goto",
  "allStates",
  "allEvents",
];

export class FSMState {
  readonly name: string;
  eventMap: Map<string, string>;
  onenter?: () => void;
  onleave?: () => void;

  constructor(name: string) {
    this.name = name;
    this.eventMap = new Map();
  }

  enter(fn: () => void): FSMState {
    this.onenter = fn;
    return this;
  }

  leave(fn: () => void): FSMState {
    this.onleave = fn;
    return this;
  }

  event(name: string, to: string): FSMState {
    if (invalidEvents.includes(name)) throw new Error("not recommended event");
    this.eventMap.set(name, to);
    return this;
  }

  unenter(): FSMState {
    this.onenter = undefined;
    return this;
  }

  unleave(): FSMState {
    this.onleave = undefined;
    return this;
  }
}

export class FSM {
  stateMap: Map<string, FSMState>;

  constructor() {
    this.stateMap = new Map();
  }

  set(...states: FSMState[]): FSM {
    states.forEach((state) => {
      this.stateMap.set(state.name, state);
    });
    return this;
  }

  compile(): any {
    const { stateMap } = this;
    const allEvents = new Set<string>();
    const allStates = new Set<string>();
    stateMap.forEach((fsmstate) => {
      allStates.add(fsmstate.name);
      fsmstate.eventMap.forEach((to, name) => {
        allEvents.add(name);
        if (!stateMap.has(to)) throw new Error(`invalid state "${to}"`);
      });
    });
    const instance: any = {
      state: null,
      init: function (state: string) {
        if (!stateMap.get(state)) throw new Error("invalid state");
        this.state = state;
        return this;
      },
      can: function (event: string): boolean {
        const curState = stateMap.get(this.state);
        return !!curState?.eventMap.get(event);
      },
      goto: function (state: string): boolean {
        if (!stateMap.get(state)) return false;
        this.state = state;
        return true;
      },
      allStates: () => [...allStates],
      allEvents: () => [...allEvents],
    };
    allEvents.forEach((name) => {
      instance[name] = function () {
        const curState = stateMap.get(this.state);
        if (!curState) throw new Error("invalid state");
        const nextName = curState.eventMap.get(name);
        if (!nextName) throw new Error("invalid event");
        curState.onleave?.();
        this.state = nextName;
        stateMap.get(this.state)!.onenter?.();
        return instance;
      };
    });
    return instance;
  }
}
