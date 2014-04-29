Cell = Class.extend({
    init: function(x, y) {
        var me = this;
        me.x = x;
        me.y = y;
        var div = document.createElement("div");
        div.id = "cell-" + me.x + me.y;
        div.class = 'cell';
        board.div.append(div);
        me.dom = $('#cell-' + me.x + me.y);
        me.dom.css({
            position: 'absolute',
            left: x * cw,
            top: y * cw,
            width: cw,
            height: cw
        });
        me.dom.on('click', function() {
            if (myself.leftActCount ===0 || currentPlayer !== myself) {
                return;
            }
            if (!me.card && player2.paiku.getSelectedCard() && me.y === board.row - 1) {
                //player2.paiku.getSelectedCard().shangzhen(me.x);
                socket.emit('shangzhen', {cardId: player2.paiku.getSelectedCard().id, x: x});
                return;
            }
            if(board.selectedCard && me.isMovable()) {
                socket.emit('move', {cardId: board.selectedCard.id, x: me.x, y: me.y});
                //board.selectedCard.moveTo(me.x, me.y);
            }
        });
        me.card = null;
    },

    isMovable: function() {
        if (this.dom.hasClass('movable')) {
            return true;
        } else {
            return false;
        }
    },

    isChuBingDian: function(x, y) {
        if ( y === board.column ) {
            return true;
        } else {
            return false;
        }
    },

    setColor: function(color) {
        this.dom.css({
            background: color,
            'opacity':0.5
        });
    }
});