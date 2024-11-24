import { DFA } from './DFA';
import { NFA } from './NFA';
import { PDA } from './PDA';
import { TM } from './TM';
import { State } from './State';
import { AutomataType } from './AutomataType';

export class AutomataFactory {
  static createL1Automata(type: AutomataType) {
    // L₁ = [b*[a+b]+]+
    switch (type) {
      case AutomataType.DFA:
        return this.createL1DFA();
      case AutomataType.NFA:
        return this.createL1NFA();
      case AutomataType.PDA:
        return this.createL1PDA();
      case AutomataType.TM:
        return this.createL1TM();
      default:
        throw new Error(`Automata type ${type} not implemented`);
    }
  }

  private static createL1DFA(): DFA {
    const q0 = new State('q0', false);
    const q1 = new State('q1', false);
    const q2 = new State('q2', true);

    const dfa = new DFA(q0);
    dfa.addState(q1);
    dfa.addState(q2);

    // b* transitions
    dfa.addTransition('q0', 'b', 'q0');
    
    // [a+b]+ transitions
    dfa.addTransition('q0', 'a', 'q1');
    dfa.addTransition('q1', 'a', 'q1');
    dfa.addTransition('q1', 'b', 'q1');
    
    // Complete group and start new one
    dfa.addTransition('q1', 'a', 'q2');
    dfa.addTransition('q1', 'b', 'q2');
    dfa.addTransition('q2', 'a', 'q1');
    dfa.addTransition('q2', 'b', 'q0');

    return dfa;
  }

  private static createL1NFA(): NFA {
    const q0 = new State('q0', false);
    const q1 = new State('q1', false);
    const q2 = new State('q2', true);

    const nfa = new NFA(q0);
    nfa.addState(q1);
    nfa.addState(q2);

    // b* transitions
    nfa.addTransition('q0', 'b', 'q0');

    // [a+b]+ transitions
    nfa.addTransition('q0', 'a', 'q1');
    nfa.addTransition('q1', 'a', 'q1');
    nfa.addTransition('q1', 'b', 'q1');
    nfa.addTransition('q1', 'a', 'q2');
    nfa.addTransition('q1', 'b', 'q2');
    nfa.addTransition('q2', 'a', 'q1');
    nfa.addTransition('q2', 'b', 'q0');

    return nfa;
  }

  private static createL1PDA(): PDA {
    const q0 = new State('q0', false);
    const q1 = new State('q1', false);
    const q2 = new State('q2', true);

    const pda = new PDA(q0);
    pda.addState(q1);
    pda.addState(q2);

    // Initial marker
    pda.addTransition('q0', 'ε', '$', 'q0', ['$', '#']);

    // b* transitions
    pda.addTransition('q0', 'b', '#', 'q0', ['#']);

    // [a+b]+ transitions
    pda.addTransition('q0', 'a', '#', 'q1', ['A', '#']);
    pda.addTransition('q1', 'a', 'A', 'q1', ['A', 'A']);
    pda.addTransition('q1', 'b', 'A', 'q1', ['B', 'A']);

    // Complete group
    pda.addTransition('q1', 'ε', 'A', 'q2', ['A']);
    pda.addTransition('q1', 'ε', 'B', 'q2', ['B']);

    // Start new group
    pda.addTransition('q2', 'ε', '#', 'q0', ['#']);

    return pda;
  }

  private static createL1TM(): TM {
    const q0 = new State('q0', false);
    const q1 = new State('q1', false);
    const q2 = new State('q2', true);

    const tm = new TM(q0);
    tm.addState(q1);
    tm.addState(q2);

    // Process b* part
    tm.addTransition('q0', 'b', 'q0', 'Y', 'R');
    tm.addTransition('q0', 'a', 'q1', 'X', 'R');

    // Process [a+b]+ part
    tm.addTransition('q1', 'a', 'q1', 'X', 'R');
    tm.addTransition('q1', 'b', 'q1', 'Y', 'R');
    tm.addTransition('q1', '_', 'q2', '_', 'L');

    // Accept state transitions
    tm.addTransition('q2', 'X', 'q2', 'X', 'L');
    tm.addTransition('q2', 'Y', 'q2', 'Y', 'L');
    tm.addTransition('q2', '$', 'q0', '$', 'R');

    return tm;
  }
}