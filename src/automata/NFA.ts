import { State } from './State';

export class NFA {
  private states: Map<string, State> = new Map();
  private transitions: Map<string, Map<string, Set<string>>> = new Map();
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

    if (!this.transitions.get(from)?.has(symbol)) {
      this.transitions.get(from)?.set(symbol, new Set());
    }
    this.transitions.get(from)?.get(symbol)?.add(to);
  }

  private getNextStates(state: string, symbol: string): Set<string> {
    return this.transitions.get(state)?.get(symbol) || new Set();
  }

  process(input: string): boolean {
    let currentStates = new Set([this.initialState.name]);

    for (const symbol of input) {
      if (!this.alphabet.has(symbol)) {
        return false;
      }

      const nextStates = new Set<string>();
      for (const state of currentStates) {
        const possibleStates = this.getNextStates(state, symbol);
        possibleStates.forEach(s => nextStates.add(s));
      }

      if (nextStates.size === 0) {
        return false;
      }

      currentStates = nextStates;
    }

    return Array.from(currentStates).some(stateName => 
      this.states.get(stateName)?.isAccepting
    );
  }
}