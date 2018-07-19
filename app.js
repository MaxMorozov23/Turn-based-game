new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        gameIsRunning: false,
        turns: [],
        turn: 5
    },
    methods: {
        startGame: function () {
            this.gameIsRunning = true;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.turns = [];
            this.turn = 5;
        },
        attack: function () {
            var damage = this.calculateDamage(3, 10);
            this.monsterHealth -= damage;
            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits Monster for ' + damage
            });
            if (this.checkWin()) {
                return;
            }
            this.monsterAttacks();
            this.turnLeft();
        },
        specialAttack: function () {
            if (this.turn === 0) {
              var damage = this.calculateDamage(10, 20);
              this.monsterHealth -= damage;
              this.turns.unshift({
                  isPlayer: true,
                  text: 'Player hits Monster hard for ' + damage
              });
              if (this.checkWin()) {
                  return;
              }
              this.monsterAttacks();
            } else {
              this.turns.unshift({
                  isPlayer: true,
                  text: 'Super attack charges. There are ' + this.turn + ' turns left'
              });
            }
        },
        heal: function () {
            if (this.playerHealth <= 90) {
                this.playerHealth += 10;
            } else {
                this.playerHealth = 100;
            }
            this.turns.unshift({
                isPlayer: true,
                text: 'Player heals for 10'
            });
            this.monsterAttacks();
            this.turnLeft();
        },
        giveUp: function () {
            this.gameIsRunning = false;
            this.turn = 5;
        },
        monsterAttacks: function() {
            var damage = this.calculateDamage(5, 12);
            this.playerHealth -= damage;
            this.checkWin();
            this.turns.unshift({
                isPlayer: false,
                text: 'Monster hits Player for ' + damage
            });
        },
        calculateDamage: function(min, max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        checkWin: function() {
            if (this.monsterHealth <= 0) {
                if (confirm('You won! New Game?')) {
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true;
            } else if (this.playerHealth <= 0) {
                if (confirm('You lost! New Game?')) {
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true;
            }
            return false;
        },
        turnLeft: function() {
          if (this.turn >= 1) {
            this.turn--;
          }
        }
    }
});
