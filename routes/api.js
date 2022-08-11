'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

	let solver = new SudokuSolver();

	app.route('/api/check')
		.post((req, res) => {
			const { puzzle, coordinate, value } = req.body;

			if (puzzle === '' || coordinate === '' || value === '' ||
         puzzle === undefined || coordinate === undefined || value === undefined) {
				return res.json({ error: 'Required field(s) missing' });
			}

			if (!/^[1-9]{1}$/.test(value.trim())) {
				return res.json({ error: 'Invalid value' });
			}

      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

			if (!/^[a-i]{1}[1-9]{1}$/i.test(coordinate.trim())) {
				return res.json({ error: 'Invalid coordinate' });
			}

      if (solver.validate(puzzle) !== true) return res.json(solver.validate(puzzle));

			const checkRowResult = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value);
			const checkColResult = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value);
			const checkRegionResult = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value);

			if (!checkRowResult.valid || !checkColResult.valid || !checkRegionResult.valid) {
				let conflict = [];

				if (checkRowResult.hasOwnProperty('conflict')) {
					conflict.push(checkRowResult.conflict[0]);
				}

				if (checkColResult.hasOwnProperty('conflict')) {
					conflict.push(checkColResult.conflict[0]);
				}

				if (checkRegionResult.hasOwnProperty('conflict')) {
					conflict.push(checkRegionResult.conflict[0]);
				}

				return res.json({ valid: false, conflict });
			}
			return res.json({ valid: true });
		});

	app.route('/api/solve')
		.post((req, res) => {
			const puzzleString = req.body.puzzle;

			if (!puzzleString || puzzleString === '') {
        return res.json({ error: 'Required field missing' });
      }

			const validateResult = solver.validate(puzzleString);

			if (validateResult !== true) {
        return res.json(validateResult);
      }

			res.json(solver.solve(puzzleString));
		});
};
