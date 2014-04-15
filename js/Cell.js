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
            height: cw,
            background: 'transparent'
        });
        me.dom.on('click', function(){
            if(board.selectedCard && me.isMovable()) {
                board.selectedCard.moveTo(me.x, me.y);
            }
        })
        me.card = null;
    },

    isMovable: function() {
        if (this.dom.css('backgroundColor') === 'green') {
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
            background: color
        });
    }
});