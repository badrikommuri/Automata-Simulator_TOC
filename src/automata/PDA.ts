import { State } from './State';

export class PDA {
  private states: Map<string, State> = new Map();
  private transitions: Map<string, Map<string, Map<string, Array<[string, string[]]>>>> = new Map();
  private stack: string[] = ['$'];
  private readonly alphabet: Set<string>;
  private readonly stackAlphabet: Set<string>;

  constructor(private initialState: State) {
    this.alphabet = new Set(['a', 'b']);
    this.stackAlphabet = new Set(['$', 'A', 'B', '#']);
    this.addState(initialState);
  }

  addState(state: State): void {
    this.states.set(state.name, state);
    this.transitions.set(state.name, new Map());
  }

  addTransition(
    from: string,
    inputSymbol: string,
    stackTop: string,
    to: string,
    pushSymbols: string[]
  ): void {
    if (!this.states.has(from) || !this.states.has(to)) {
      throw new Error('Invalid state');
    }
    if (!this.alphabet.has(inputSymbol) && inputSymbol !== 'ε') {
      throw new Error('Invalid input symbol');
    }

    if (!this.transitions.get(from)?.has(inputSymbol)) {
      this.transitions.get(from)?.set(inputSymbol, new Map());
    }
    if (!this.transitions.get(from)?.get(inputSymbol)?.has(stackTop)) {
      this.transitions.get(from)?.get(inputSymbol)?.set(stackTop, []);
    }
    this.transitions.get(from)?.get(inputSymbol)?.get(stackTop)?.push([to, pushSymbols]);
  }

  process(input: string): boolean {
    this.stack = ['$'];
    let currentStates = new Set([this.initialState.name]);
    
    for (let i = 0; i <= input.length; i++) {
      const symbol = i < input.length ? input[i] : 'ε';
      if (i < input.length && !this.alphabet.has(symbol)) {
        return false;
      }

      const nextStates = new Set<string>();
      
      for (const state of currentStates) {
        const transitions = this.transitions.get(state)?.get(symbol);
        if (!transitions) continue;

        for (const [stackSymbol, moves] of transitions) {
          if (this.stack[this.stack.length - 1] === stackSymbol) {
            for (const [nextState, pushSymbols] of moves) {
              this.stack.pop();
              this.stack.push(...pushSymbols);
              nextStates.add(nextState);
            }
          }
        }
      }

      if (nextStates.size === 0) {
        return false;
      }

      currentStates = nextStates;
    }

    return Array.from(currentStates).some(state => this.states.get(state)?.isAccepting);
  }
}