const makeCell = (value = "") => {
  const cell = {
    value: value,
    isOccupied: false,
    classObject: {
      button: true,
      'is-success': true,
      'is-danger': false,
      'is-info': false,
      'cell': true
    },
  };
  return cell;
};

const XO = new Vue({
  el: "#theGame",
  data: function() {
    const cells = [];
    for (let i = 0; i < 9; i++) {
      cells.push(makeCell(i + 1));
    }
    const rows = [];
    rows.push(cells.slice(0,3));
    rows.push(cells.slice(3,6));
    rows.push(cells.slice(6,9));

    const gameMessages = {
      'move': 'Your move',
      'thinking': 'Your opponent is considering his next move...',
      'won': 'You have won!',
      'lost': 'You have lost',
      'left': 'Your opponent has left the game',
      'disconnect': 'You have been disconnected',
    };
    return {
      rows: rows,
      cells: cells,
      gamerRole: 'X',
      opponentRole: 'O',
      gameMessages: gameMessages,
      gameMessage: gameMessages.move,
    };
  },
  methods: {
    processCellClick(rowIndex, cellIndex) {
      const cell = this.rows[rowIndex][cellIndex];
      if (cell.isOccupied) return;

      cell.isOccupied = true;
      cell.value = this.gamerRole;
      cell.classObject["is-success"] = false;
      if (this.gamerRole === 'X') {
        cell.classObject["is-info"] = true;
      } else {
        cell.classObject['is-danger'] = true;
      }
    }
  },
});