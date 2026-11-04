import { useState } from 'react';

const KEYS = [
  ['AC', 'fn'],
  ['±', 'fn'],
  ['%', 'fn'],
  ['÷', 'op'],
  ['7', 'num'],
  ['8', 'num'],
  ['9', 'num'],
  ['×', 'op'],
  ['4', 'num'],
  ['5', 'num'],
  ['6', 'num'],
  ['−', 'op'],
  ['1', 'num'],
  ['2', 'num'],
  ['3', 'num'],
  ['+', 'op'],
  ['0', 'num is-zero'],
  ['.', 'num'],
  ['=', 'op is-equals'],
];

const compute = (a, b, operator) => {
  switch (operator) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
};

const format = (value) => {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Math.round(value * 1e9) / 1e9;
  return String(rounded);
};

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [accumulator, setAccumulator] = useState(null);
  const [operator, setOperator] = useState(null);
  const [fresh, setFresh] = useState(true);
  const [tape, setTape] = useState('');

  const inputDigit = (digit) => {
    setDisplay((current) => {
      if (fresh) return digit;
      if (current.replace('-', '').length >= 10) return current;
      return current === '0' ? digit : current + digit;
    });
    setFresh(false);
  };

  const inputDot = () => {
    if (fresh) {
      setDisplay('0.');
      setFresh(false);
      return;
    }
    if (!display.includes('.')) setDisplay((current) => `${current}.`);
  };

  const clear = () => {
    setDisplay('0');
    setAccumulator(null);
    setOperator(null);
    setFresh(true);
    setTape('');
  };

  const pressOperator = (next) => {
    const value = Number(display);
    if (operator && !fresh && accumulator !== null) {
      const result = compute(accumulator, value, operator);
      setAccumulator(result);
      setDisplay(format(result));
    } else {
      setAccumulator(value);
    }
    setOperator(next);
    setFresh(true);
    setTape(`${format(accumulator !== null && !fresh ? compute(accumulator, value, operator) : value)} ${next}`);
  };

  const equals = () => {
    if (operator === null || accumulator === null) return;
    const result = compute(accumulator, Number(display), operator);
    setTape(`${format(accumulator)} ${operator} ${display} =`);
    setDisplay(format(result));
    setAccumulator(null);
    setOperator(null);
    setFresh(true);
  };

  const press = (key) => {
    if (key === 'AC') return clear();
    if (key === '±') return setDisplay((current) => (current.startsWith('-') ? current.slice(1) : `-${current}`));
    if (key === '%') return setDisplay((current) => format(Number(current) / 100));
    if (key === '.') return inputDot();
    if (key === '=') return equals();
    if (['+', '−', '×', '÷'].includes(key)) return pressOperator(key);
    return inputDigit(key);
  };

  return (
    <div className="calculator">
      <div className="calc-display">
        <span className="calc-tape">{tape}</span>
        <span className="calc-value">{display}</span>
      </div>

      <div className="calc-pad">
        {KEYS.map(([label, kind]) => (
          <button
            key={label}
            type="button"
            className={`calc-key is-${kind} ${
              operator === label && ['+', '−', '×', '÷'].includes(label) ? 'is-armed' : ''
            }`}
            onClick={() => press(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
