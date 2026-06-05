'use strict';

const { calculateExpression, mapKeyToAction } = require('../calculator/assets/js/script');

// ================================================================
//  Tests for calculateExpression
//  This is the core math engine — pure function, no DOM needed.
// ================================================================

describe('calculateExpression — basic arithmetic', () => {

  it('adds two integers', () => {
    expect(calculateExpression('2+3')).toBe(5);
  });

  it('subtracts two integers', () => {
    expect(calculateExpression('10-4')).toBe(6);
  });

  it('multiplies two integers', () => {
    expect(calculateExpression('6*7')).toBe(42);
  });

  it('divides two integers', () => {
    expect(calculateExpression('20/4')).toBe(5);
  });

  it('handles chained operations correctly', () => {
    expect(calculateExpression('2+3*4')).toBe(14);
  });

  it('handles decimal numbers', () => {
    expect(calculateExpression('1.5+1.5')).toBe(3);
  });

  it('handles large numbers', () => {
    expect(calculateExpression('999999+1')).toBe(1000000);
  });

});

describe('calculateExpression — edge cases and errors', () => {

  it('returns Error for division by zero', () => {
    expect(calculateExpression('5/0')).toBe('Error');
  });

  it('returns Error for an empty string', () => {
    expect(calculateExpression('')).toBe('Error');
  });

  it('returns Error for a null input', () => {
    expect(calculateExpression(null)).toBe('Error');
  });

  it('returns Error for an undefined input', () => {
    expect(calculateExpression(undefined)).toBe('Error');
  });

  it('returns Error for a non-numeric expression', () => {
    expect(calculateExpression('abc')).toBe('Error');
  });

  it('returns Error for expressions with disallowed characters', () => {
    expect(calculateExpression('alert(1)')).toBe('Error');
  });

  it('returns Error for a bare operator', () => {
    expect(calculateExpression('+')).toBe('Error');
  });

});

// ================================================================
//  Tests for mapKeyToAction
//  This is the keyboard support feature — maps key names to actions.
// ================================================================

describe('mapKeyToAction — digit keys', () => {

  it('maps key "0" to append action', () => {
    expect(mapKeyToAction('0')).toEqual({ type: 'append', value: '0' });
  });

  it('maps key "5" to append action', () => {
    expect(mapKeyToAction('5')).toEqual({ type: 'append', value: '5' });
  });

  it('maps key "9" to append action', () => {
    expect(mapKeyToAction('9')).toEqual({ type: 'append', value: '9' });
  });

  it('maps decimal point to append action', () => {
    expect(mapKeyToAction('.')).toEqual({ type: 'append', value: '.' });
  });

});

describe('mapKeyToAction — operator keys', () => {

  it('maps "+" to operator action', () => {
    expect(mapKeyToAction('+')).toEqual({ type: 'operator', value: '+' });
  });

  it('maps "-" to operator action', () => {
    expect(mapKeyToAction('-')).toEqual({ type: 'operator', value: '-' });
  });

  it('maps "*" to operator action', () => {
    expect(mapKeyToAction('*')).toEqual({ type: 'operator', value: '*' });
  });

  it('maps "/" to operator action', () => {
    expect(mapKeyToAction('/')).toEqual({ type: 'operator', value: '/' });
  });

});

describe('mapKeyToAction — control keys', () => {

  it('maps Enter to calculate action', () => {
    expect(mapKeyToAction('Enter')).toEqual({ type: 'calculate' });
  });

  it('maps "=" to calculate action', () => {
    expect(mapKeyToAction('=')).toEqual({ type: 'calculate' });
  });

  it('maps Backspace to backspace action', () => {
    expect(mapKeyToAction('Backspace')).toEqual({ type: 'backspace' });
  });

  it('maps Escape to clear action', () => {
    expect(mapKeyToAction('Escape')).toEqual({ type: 'clear' });
  });

  it('maps Delete to clear action', () => {
    expect(mapKeyToAction('Delete')).toEqual({ type: 'clear' });
  });

});

describe('mapKeyToAction — ignored keys', () => {

  it('returns null for letter keys', () => {
    expect(mapKeyToAction('a')).toBeNull();
  });

  it('returns null for F-keys', () => {
    expect(mapKeyToAction('F5')).toBeNull();
  });

  it('returns null for Tab', () => {
    expect(mapKeyToAction('Tab')).toBeNull();
  });

  it('returns null for Shift', () => {
    expect(mapKeyToAction('Shift')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(mapKeyToAction('')).toBeNull();
  });

});
