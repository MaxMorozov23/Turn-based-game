new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        playerHealthStay: 0,
        playerHealthPercent: 100,
        monsterHealthPercent: 100,
        monsterHealth: 100,
        monsterHealthStay: 0,
        playerMinDamage: 3,
        playerMaxDamage: 10,
        playerSpecialMinDamage: 10,
        playerSpecialMaxDamage: 20,
        monsterMinDamage: 5,
        monsterMaxDamage: 12,
        gameIsRunning: false,
        turns: [],
        turn: 5,
        currentTurn: 0,
        level: 1,
        enlarger: 0,
        healCount: 10
    },
    methods: {
        startGame: function () {
            this.gameIsRunning = true;
            this.monsterHealthPercent = 100;
            this.playerHealthPercent = 100;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.monsterHealthStay = this.monsterHealth;
            this.playerHealthStay = this.playerHealth;
            this.healCount = 10;
            this.turns = [];
            this.turn = 5;     
            this.level = 1;
        },
        nextLevel: function () {
            this.gameIsRunning = true;
            this.monsterHealthPercent = 100;
            this.playerHealthPercent = 100;
            this.playerHealth = 100;
            this.monsterHealth = 100 + this.enlarger;
            this.monsterHealthStay = this.monsterHealth;
            this.playerHealthStay = this.playerHealth;
            this.turns = [];
            this.turn = 5;
        },
        attack: function () {
            var damage = this.calculateDamage(this.playerMinDamage, this.playerMaxDamage);
            this.monsterHealth -= damage;
            this.monsterHealthPercent = (100 * this.monsterHealth) / this.monsterHealthStay;
            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits Monster for ' + damage,
                id: this.currentTurn + 1
            });
            this.currentTurn++;
            if (this.checkWin()) {
                return;
            }

            this.monsterAttacks();
            this.turnLeft();
        },
        specialAttack: function () {
            if (this.turn === 0) {
            var damage = this.calculateDamage(this.playerSpecialMinDamage, this.playerSpecialMaxDamage);
            this.monsterHealth -= damage;
            this.monsterHealthPercent = (100 * this.monsterHealth) / this.monsterHealthStay;
            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits Monster hard for ' + damage,
                id: this.currentTurn + 1
            });
            this.turn = 5;
            this.currentTurn++;
            if (this.checkWin()) {
                return;
            }
            this.monsterAttacks();
        } else {
            this.turns.unshift({
                isPlayer: true,
                text: 'Super attack charges. There are ' + this.turn + ' turns left',
                id: this.currentTurn + 1
            });
          }
        },
        heal: function () {
            if (this.playerHealth != 100) {
                if (this.playerHealth <= 90) {
                    this.playerHealth += this.healCount;
                } else {
                    this.playerHealth = 100;
                }
                this.turns.unshift({
                    isPlayer: true,
                    text: 'Player heals for ' + this.healCount,
                    id: this.currentTurn + 1
                });
                this.currentTurn++;
                this.monsterAttacks();
                this.turnLeft();
            } else {
                this.turns.unshift({
                    isPlayer: false,
                    text: 'You have full health',
                    id: this.currentTurn + 1
                });
            }            
        },
        giveUp: function () {
            this.gameIsRunning = false;
            this.turn = 5;
        },
        monsterAttacks: function() {
            
            var damage = this.calculateDamage(this.monsterMinDamage, this.monsterMaxDamage);
            this.playerHealth -= damage;
            this.checkWin();
            this.playerHealthPercent = (100 * this.playerHealth) / this.playerHealthStay;
            
            this.turns.unshift({
                isPlayer: false,
                text: 'Monster hits Player for ' + damage,
                id: this.currentTurn + 1
            });
            this.currentTurn++;
        },
        calculateDamage: function(min, max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        checkWin: function() {
            if (this.monsterHealth <= 0) {
                if (confirm('Next level?')) {
                    this.level++;
                    this.enlarger += 50;
                    this.playerMinDamage++;
                    this.playerMaxDamage++;
                    this.playerSpecialMinDamage++;
                    this.playerSpecialMaxDamage++;
                    this.monsterMinDamage++;
                    this.monsterMaxDamage++;
                    this.healCount++;
                    this.nextLevel();          
                } else {
                    this.gameIsRunning = false;
                }
                return true;

            } else if (this.playerHealth <= 0) {
                if (confirm('You lost! New Game?' + "\r\n" + 'Your level: ' + this.level)) {  
                                     setTimeout(() => {
                                        this.startGame();   
                                     }, 1);      // without doesn't work       
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