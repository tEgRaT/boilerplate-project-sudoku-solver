'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

	let solver = new SudokuSolver();

	app.route('/api/check')
		.post((req, res) => {
			const { puzzle, coordinate, value } = req.body;

			if (puzzle === '' || coordinate === '' || value === '') {
				return res.json({ error: 'Required field(s) missing' });
			}

			if (!/^[1-9]{1}$/.test(value.trim())) {
				return res.json({ error: 'Invalid value' });
			}

			if (!/^[a-i]{1}[1-9]{1}$/i.test(coordinate.trim())) {
				return res.json({ error: 'Invalid coordinate' });
			}

			const checkRowResult =  solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value);
			const checkColResult =  solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value);
			const checkRegionResult =  solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value);

			if (!checkRowResult.valid || !checkColResult.valid || !checkRegionResult.valid) {
				let conflict = [];

				if (checkRowResult.hasOwnProperty('conflict')) {
					conflict.push(checkRowResult.conflict);
				}

				if (checkColResult.hasOwnProperty('conflict')) {
					conflict.push(checkColResult.conflict);
				}

				if (checkRegionResult.hasOwnProperty('conflict')) {
					conflict.push(checkRegionResult.conflict);
				}

				return res.json({ valid: false, conflict });
			}
			return res.json({ valid: true });
		});

	app.route('/api/solve')
		.post((req, res) => {
			const puzzleString = req.body.puzzle;

			res.json(solver.solve(puzzleString));
		});
};
