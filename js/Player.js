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

        me.leftActCount = me.actCount;

        if (me.isP1) {
            me.actCountEl = $('#actCount1');
        } else {
            me.actCountEl = $('#actCount2');
        }

        me.actCountEl.html(me.leftActCount);

        me.on('autoShangzhen', function(card) {
            var cards = me.getBoardCards();
            $.each(cards, function(idx, card) {

            });
        });

        me.on('autoAttackDone', function() {
            player2.startRound();
        });

        me.on('actCountChange', function() {
            if (me.leftActCount === 0) {
                if (me === player1) {
                    player2.startRound();
                } else {
                    player1.startRound();
                }
            }
        });
    },

    fireEvent: function(eventType) {
        var handlerArgs = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < this.handlers[eventType].length; i++) {
            this.handlers[eventType][i].apply(this, handlerArgs);
        }
        return this;
    },

    reduceActCount: function() {
        var me = this;
        me.leftActCount--;
        me.actCountEl.html(me.leftActCount);
        me.fireEvent('actCountChange');
    },

    resetActCount: function() {
        this.leftActCount = this.actCount;
        this.actCountEl.html(this.actCount);
    },

    startRound: function() {
        var me = this;
        currentPlayer = me;
        // 重置所有卡牌状态
        me.getBoardCards().forEach(function(card) {
            if (card.status === 2) {
                card.div.find('img').css({ '-webkit-filter': 'grayscale(0%)'});
            }
            card.status = 0;
        });
        me.resetActCount();
        if (me.isP1) {
            $('#p1round').show();
            $('#endRoundButton').hide();
            //$('#endRoundButton').attr({disabled: true});
            me.autoDispatch();
        } else {
            $('#p1round').hide();
            $('#endRoundButton').show();
            $('#endRoundButton').attr({disabled: false});
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

        if (me.leftActCount === 0 || paikuCards.length === 0) {
            me.autoAttack();
            return;
        }

        for (var i = 0; i< tmpArray.length; i++) {
            if (me.leftActCount > 0 && paikuCards.length > 0) {
                tmpArray[i].shangzhen(tmpArray[i].x);
                break;
            }
        }
    },

    autoAttack: function() {
        var me = this,
            cards = me.getBoardCards(),
            attackDone = true;

        if (currentPlayer === player2) {
            return;
        }

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].status !== 2) {
                cards[i].attack();
                attackDone = false;
                break;
            }
        }

        if (attackDone === true) {
            me.fireEvent('autoAttackDone');
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