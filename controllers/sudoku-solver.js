class SudokuSolver {

	validate(puzzleString) {
		if (puzzleString.length !== 81) {
			return { error: 'Expected puzzle to be 81 characters long' };
		}

		if (/^[1-9.]+$/.test(puzzleString)) {
			return true;
		} else {
			return { error: 'Invalid characters in puzzle' };
		}
	}

	checkRowPlacement(puzzleString, row, column, value) {
		const puzzleArray = this.getPuzzleArray(puzzleString);

		if ([
			...puzzleArray[this.getRow(row)][0][this.getRegionRow(row)],
			...puzzleArray[this.getRow(row)][1][this.getRegionRow(row)],
			...puzzleArray[this.getRow(row)][2][this.getRegionRow(row)]
		]
			.filter(char => char !== puzzleArray[this.getRow(row)][this.getCol(column)][this.getRegionRow(row)][this.getRegionCol(column)])
			.includes(value)) {
			return { valid: false, conflict: ['row'] };
		} else {
			return { valid: true };
		}
	}

	checkColPlacement(puzzleString, row, column, value) {
		const puzzleArray = this.getPuzzleArray(puzzleString);

		if ([
			puzzleArray[0][this.getCol(column)][0][this.getRegionCol(column)],
			puzzleArray[0][this.getCol(column)][1][this.getRegionCol(column)],
			puzzleArray[0][this.getCol(column)][2][this.getRegionCol(column)],
			puzzleArray[1][this.getCol(column)][0][this.getRegionCol(column)],
			puzzleArray[1][this.getCol(column)][1][this.getRegionCol(column)],
			puzzleArray[1][this.getCol(column)][2][this.getRegionCol(column)],
			puzzleArray[2][this.getCol(column)][0][this.getRegionCol(column)],
			puzzleArray[2][this.getCol(column)][1][this.getRegionCol(column)],
			puzzleArray[2][this.getCol(column)][2][this.getRegionCol(column)]
		]
		.filter(char => char !== puzzleArray[this.getRow(row)][this.getCol(column)][this.getRegionRow(row)][this.getRegionCol(column)])
		.includes(value)) {
			return { valid: false, conflict: ['column'] };
		} else {
			return { valid: true };
		}
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		const puzzleArray = this.getPuzzleArray(puzzleString);

		if ([
			...puzzleArray[this.getRow(row)][this.getCol(column)][0],
			...puzzleArray[this.getRow(row)][this.getCol(column)][1],
			...puzzleArray[this.getRow(row)][this.getCol(column)][2]
		]
			.filter(char => char !== puzzleArray[this.getRow(row)][this.getCol(column)][this.getRegionRow(row)][this.getRegionCol(column)])
			.includes(value)) {
			return { valid: false, conflict: ['region'] };
		} else {
			return { valid: true };
		}
	}

	solve(puzzleString) {
		if (!/\./g.test(puzzleString)) {
			if (this.salGood(puzzleString)) {
				return { solution: puzzleString };
			} else {
				return { "error": "Puzzle cannot be solved" };
			}
		}

		let tempPuzzleString = puzzleString;

		for (let i = 0; i < 81; i++) {
			if (tempPuzzleString[i] === '.') {
				const { row, col } = this.getCoordinates(i);

				const candidates = this.getCandidates(tempPuzzleString, row, col);

        if (candidates.length === 0) {
          return { "error": "Puzzle cannot be solved" };
        }

				if (candidates.length === 1) {
					tempPuzzleString = tempPuzzleString.substr(0, i) + candidates[0] + tempPuzzleString.substr(i + 1);
				}
			}
		}

		return this.solve(tempPuzzleString);
	}

	getCandidates(puzzleString, row, col) {
		let results = [];

		for (let i = 1; i <= 9; i++) {
			const value = i.toString();

			if (this.checkRowColRegion(puzzleString, row, col, value)) results.push(value);
		}

		return results;
	}

	salGood(puzzleString) {
		for (let i = 0; i < 9; i++) {
			for (let j = 1; j <= 9; j++) {
				if (this.getCandidates(puzzleString, String.fromCharCode(65 + i), j.toString()).length !== 1) {
					return false;
				}
			}
		}

		return true;
	}

	checkRowColRegion(puzzleString, row, col, value) {
		if (
			this.checkRowPlacement(puzzleString, row, col, value).valid &&
			this.checkColPlacement(puzzleString, row, col, value).valid &&
			this.checkRegionPlacement(puzzleString, row, col, value).valid
		) {
			return true;
		}

		return false;
	}

	getCoordinates(index) {
		const row = String.fromCharCode(65 + Math.trunc(index / 9));
		const col = (index % 9 + 1).toString();

		return { row, col };
	}

	getRow(row) {
		return Math.trunc((row.toUpperCase().charCodeAt(0) - 65) / 3);
	}

	getCol(column) {
		return Math.trunc((Number(column) - 1) / 3);
	}

	getRegionRow(row) {
		return (row.toUpperCase().charCodeAt(0) - 65) % 3;
	}

	getRegionCol(column) {
		return (column - 1) % 3;
	}

	getPuzzleArray(puzzleString) {
		const flattenedPuzzleArray = puzzleString.split('');
		const puzzleArray = Array(3).fill(Array(3).fill(Array(3).fill(Array(3).fill('.'))));

		return puzzleArray.map((row, rowIndex) =>
			row.map((col, colIndex) =>
				col.map((regionRow, regionRowIndex) =>
					regionRow.map((regionCol, regionColIndex) =>
						flattenedPuzzleArray[rowIndex * 27 + colIndex * 3 + regionRowIndex * 9 + regionColIndex]))));
	}
}

module.exports = SudokuSolver;
