import React, { useState } from 'react';
import { AppFrame } from '../os/AppFrame';

const BUTTONS = [
  ['AC', 'fn'],
  ['⌫', 'fn'],
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
  ['+/−', 'num'],
  ['0', 'num'],
  ['.', 'num'],
  ['=', 'equal'],
];

function evaluate(input) {
  const src = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/%/g, '/100');
  if (!src || !/^[0-9+\-*/().\s]+$/.test(src)) throw new Error('bad expression');
  let index = 0;

  const parseExpression = () => {
    let value = parseTerm();
    while (src[index] === '+' || src[index] === '-') {
      const op = src[index];
      index += 1;
      const right = parseTerm();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  };

  const parseTerm = () => {
    let value = parseFactor();
    while (src[index] === '*' || src[index] === '/') {
      const op = src[index];
      index += 1;
      const right = parseFactor();
      value = op === '*' ? value * right : value / right;
    }
    return value;
  };

  const parseFactor = () => {
    if (src[index] === '-') {
      index += 1;
      return -parseFactor();
    }
    if (src[index] === '+') {
      index += 1;
      return parseFactor();
    }
    if (src[index] === '(') {
      index += 1;
      const value = parseExpression();
      if (src[index] === ')') index += 1;
      return value;
    }
    const start = index;
    while (index < src.length && /[0-9.]/.test(src[index])) index += 1;
    if (start === index) throw new Error('bad expression');
    return Number.parseFloat(src.slice(start, index));
  };

  const result = parseExpression();
  if (index < src.length) throw new Error('bad expression');
  if (!Number.isFinite(result)) throw new Error('not finite');
  return result;
}

const format = (value) => {
  if (value === '') return '0';
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
};

export default function Calculator() {
  const [entry, setEntry] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState(false);

  const press = (label) => {
    setError(false);
    if (label === 'AC') {
      setEntry('');
      setResult('');
      return;
    }
    if (label === '⌫') {
      setEntry((value) => value.slice(0, -1));
      return;
    }
    if (label === '=') {
      try {
        const value = evaluate(entry);
        setResult(format(value));
        setEntry(format(value));
      } catch {
        setResult('Error');
        setError(true);
      }
      return;
    }
    if (label === '+/−') {
      setEntry((value) => (value.startsWith('-') ? value.slice(1) : value ? `-${value}` : '-'));
      return;
    }
    setEntry((value) => `${value}${label}`);
    setResult('');
  };

  return (
    <AppFrame title="Calculator" bodyClassName="calculator-body">
      <div className="calc-display">
        <span className="calc-entry">{entry || '0'}</span>
        <span className={`calc-result ${error ? 'error' : ''}`}>{result}</span>
      </div>
      <div className="calc-grid">
        {BUTTONS.map(([label, kind]) => (
          <button
            type="button"
            key={label}
            className={`calc-key ${kind}`}
            onClick={() => press(label)}
            aria-label={label}
          >
            {label}
          </button>
        ))}
      </div>
    </AppFrame>
  );
}
