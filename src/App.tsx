import React, { useState } from 'react';
import { AutomataFactory } from './automata/AutomataFactory';
import { AutomataType } from './automata/AutomataType';

function App() {
  const [input, setInput] = useState('');
  const [automataType, setAutomataType] = useState<AutomataType>(AutomataType.DFA);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{input: string, accepted: boolean}>>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    
    const automata = AutomataFactory.createL1Automata(automataType);
    const isAccepted = automata.process(input);
    
    setResult(isAccepted ? 'Accepted' : 'Rejected');
    setHistory(prev => [...prev, { input, accepted: isAccepted }]);
    setInput('');

    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Automata Simulator
          </h1>
          <div className="text-center text-gray-600">
            <p className="font-medium">L₁ = [b*[a+b]+]+</p>
            <div className="mt-4 space-y-1">
              <p className="text-sm">Author: Badri Kommuri</p>
              <p className="text-sm">Professor: Dr. Minhua Huang</p>
              <p className="text-sm">Texas A&M University-Corpus Christi</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Select Automata Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.values(AutomataType).map((type) => (
                <button
                  key={type}
                  onClick={() => setAutomataType(type)}
                  className={`p-4 rounded-xl shadow-lg transform transition-all duration-200 hover:-translate-y-1 ${
                    automataType === type
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Enter Input String
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toLowerCase().replace(/[^ab]/g, ''))}
                className="flex-1 p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Use only 'a' and 'b'"
                required
              />
              <button
                type="submit"
                disabled={isAnimating}
                className={`px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  isAnimating ? 'animate-pulse' : ''
                }`}
              >
                Test String
              </button>
            </div>
          </form>

          {result && (
            <div className={`p-6 rounded-xl mb-8 transform transition-all duration-300 ${
              isAnimating ? 'scale-105' : 'scale-100'
            } ${
              result === 'Accepted' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
            }`}>
              <p className="text-xl font-bold text-center">Result: {result}</p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Test History</h2>
            <div className="overflow-hidden rounded-xl shadow-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Input String
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.input || '(empty string)'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          entry.accepted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.accepted ? '✓ Accepted' : '✗ Rejected'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;