import { State } from './State';

export class DFA {
  private states: Map<string, State> = new Map();
  private transitions: Map<string, Map<string, string>> = new Map();
  private readonly alphabet: Set<string>;

  constructor(private initialState: State) {
    this.alphabet = new Set(['a', 'b']);
    this.addState(initialState);
  }

  addState(state: State): void {
    this.states.set(state.name, state);
    this.transitions.set(state.name, new Map());
  }

  addTransition(from: string, symbol: string, to: string): void {
    if (!this.states.has(from) || !this.states.has(to)) {
      throw new Error('Invalid state');
    }
    if (!this.alphabet.has(symbol)) {
      throw new Error('Invalid symbol');
    }
    this.transitions.get(from)?.set(symbol, to);
  }

  process(input: string): boolean {
    let currentState = this.initialState;

    for (const symbol of input) {
      if (!this.alphabet.has(symbol)) {
        return false;
      }

      const nextStateName = this.transitions.get(currentState.name)?.get(symbol);
      if (!nextStateName) {
        return false;
      }

      const nextState = this.states.get(nextStateName);
      if (!nextState) {
        return false;
      }

      currentState = nextState;
    }

    return currentState.isAccepting;
  }
}