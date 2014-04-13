var Player = Class.extend({

    // 事件处理器
    handlers: {},

    on: function(eventType, handler) {
        var me = this;
        if (!(eventType in me.handlers)) {
            me.handlers[eventType] = [];
        }

        me.handlers[eventType].push(handler);
        return me;
    },

    init: function(config) {
        var me = this;
        me.handlers = {};
        $.extend(me, config);
        if (me.cards) {
            $.each(me.cards, function(idx, card) {
                card.player = me;
            });
        }

        me.on('autoShangzhen', function(card) {
            var cards = me.getBoardCards();
            $.each(cards, function(idx, card) {

            });
            
        });
    },

    fireEvent: function(eventType) {
        var handlerArgs = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < this.handlers[eventType].length; i++) {
            this.handlers[eventType][i].apply(this, handlerArgs);
        }
        return this;
    },

    resetMoveCount: function() {
        this.leftMoveCount = this.moveCount;
    },

    startRound: function() {
        var me = this;
        if (me.isP1) {
            me.autoDispatch();
            me.attack();
        }
    },

    autoDispatch: function() {
        var me = this,
            paikuCards = me.paiku.cards,
            tmpArray = [],
            delay;

        $.each(paikuCards, function(idx, card) {
            tmpArray.push(card);
        });

        if (me.leftMoveCount === 0 || paikuCards.length === 0) {
            me.autoAttack();
            return;
        }

        for (var i = 0; i< tmpArray.length; i++) {
            if (me.leftMoveCount > 0 && paikuCards.length > 0) {
                tmpArray[i].shangzhen(tmpArray[i].x);
                me.leftMoveCount--;
                break;
            }
        }
    },

    autoAttack: function() {
        var me = this,
            cards = me.getBoardCards(),
            attackDone = true;

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].status !== 2) {
                cards[i].attack();
                attackDone = false;
                break;
            }
        }

        if (attackDone === true) {
            me.submitRound();
        }
    },

    submitRound: function() {
        if (this === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    },

    createPaiku: function(paikuId) {
        if (this.cards) {
            this.paiku = new Paiku(this.cards, paikuId);
        }
    },


    getBoardCards: function() {
        var me = this,
            cards = [];

        $.each(board.cards, function(idx, card) {
            if (card.player === me) {
                cards.push(card);
            }
        });

        return cards;
    }
});