const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.deepEqual(solver.validate('\\.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate(`..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.`), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '7').valid);
  });

  test('Logic handles an invalid row placement', () => {
    assert.deepEqual(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'B', '5', '8'), { valid: false, conflict: ['row'] });
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '7').valid);
  });

  test('Logic handles an invalid column placement', () => {
    assert.deepEqual(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '6'), { "valid": false, "conflict": [ "column" ] })
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '7').valid);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.deepEqual(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '2'), { valid: false, conflict: ['region'] });
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.isTrue(solver.salGood('135762984946381257728459613694517832812936745357824196473298561581673429269145378'));
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.isFalse(solver.salGood('535762984946381257728459613694517832812936745357824196473298561581673429269145378'));
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.strictEqual(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.').solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });
});
