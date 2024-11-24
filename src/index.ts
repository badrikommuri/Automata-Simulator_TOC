import { AutomataFactory } from './automata/AutomataFactory.js';
import { AutomataType } from './automata/AutomataType.js';
import readlineSync from 'readline-sync';

function main() {
  console.log('Automata Simulator');
  console.log('1. DFA');
  console.log('2. NFA');
  
  const choice = readlineSync.question('Select automata type (1-2): ');
  let automataType = AutomataType.DFA;
  
  switch (choice) {
    case '1':
      automataType = AutomataType.DFA;
      break;
    case '2':
      automataType = AutomataType.NFA;
      break;
    default:
      console.log('Invalid choice. Using DFA as default.');
      automataType = AutomataType.DFA;
  }

  const automata = AutomataFactory.createL1Automata(automataType);
  
  while (true) {
    const input = readlineSync.question('Enter a string (or "quit" to exit): ');
    
    if (input.toLowerCase() === 'quit') {
      break;
    }

    const isAccepted = automata.process(input);
    console.log(`String "${input}" is ${isAccepted ? 'accepted' : 'rejected'}`);
  }
}

main();