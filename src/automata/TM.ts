import { State } from './State';

export class TM {
  private states: Map<string, State> = new Map();
  private transitions: Map<string, Map<string, [string, string, 'L' | 'R']>> = new Map();
  private tape: Map<number, string> = new Map();
  private head: number = 0;
  private readonly alphabet: Set<string>;
  private readonly tapeAlphabet: Set<string>;
  private readonly blank: string = '_';

  constructor(private initialState: State) {
    this.alphabet = new Set(['a', 'b']);
    this.tapeAlphabet = new Set(['a', 'b', 'X', 'Y', '_', '$']);
    this.addState(initialState);
  }

  addState(state: State): void {
    this.states.set(state.name, state);
    this.transitions.set(state.name, new Map());
  }

  addTransition(
    from: string,
    readSymbol: string,
    to: string,
    writeSymbol: string,
    move: 'L' | 'R'
  ): void {
    if (!this.states.has(from) || !this.states.has(to)) {
      throw new Error('Invalid state');
    }
    if (!this.tapeAlphabet.has(readSymbol) || !this.tapeAlphabet.has(writeSymbol)) {
      throw new Error('Invalid symbol');
    }

    this.transitions.get(from)?.set(readSymbol, [to, writeSymbol, move]);
  }

  private initTape(input: string): void {
    this.tape.clear();
    this.head = 0;
    this.tape.set(-1, '$');
    
    for (let i = 0; i < input.length; i++) {
      if (!this.alphabet.has(input[i])) {
        throw new Error('Invalid input symbol');
      }
      this.tape.set(i, input[i]);
    }
  }

  process(input: string): boolean {
    try {
      this.initTape(input);
      let currentState = this.initialState;
      let steps = 0;
      const maxSteps = 1000;

      while (!currentState.isAccepting && !currentState.isRejecting && steps < maxSteps) {
        const symbol = this.tape.get(this.head) || this.blank;
        const transition = this.transitions.get(currentState.name)?.get(symbol);

        if (!transition) {
          return false;
        }

        const [nextStateName, writeSymbol, move] = transition;
        if (writeSymbol !== this.blank) {
          this.tape.set(this.head, writeSymbol);
        } else {
          this.tape.delete(this.head);
        }

        this.head += move === 'R' ? 1 : -1;
        const nextState = this.states.get(nextStateName);
        if (!nextState) {
          return false;
        }
        currentState = nextState;
        steps++;
      }

      return currentState.isAccepting;
    } catch (error) {
      console.error('TM processing error:', error);
      return false;
    }
  }
}