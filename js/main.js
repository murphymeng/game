var cards1Config = [{
    id: 1,
    name: 'zhaoyun',
    img: 'res/zhaoyun.png'
}, {
    id: 2,
    name: 'daqiao',
    img: 'res/daqiao.png'
}];

var cards2Config = [{
    id: 3,
    name: 'zhaoyun',
    img: 'res/zhaoyun.png'
}, {
    id: 4,
    name: 'daqiao',
    img: 'res/daqiao.png'
}];

var Fight = Class.extend({
    init: function() {
        var me = this;
    },

    setPlayer: function(play1, play2) {
        this.play1 = play1;
        this.play2 = play2;
    },

    begin: function() {

    }
});

var Player = Class.extend({
    init: function(config) {
        $.extend(this, config);
    },

    startRound: function() {
        var me = this;
        if (me.isP1) {
            me.autoDispatch();
            me.attack();
        }
    },

    autoDispatch: function() {
        var me = this;
    },

    createPaiku: function(paikuId) {
        if (this.cards) {
            this.paiku = new Paiku(this.cards, paikuId);
        }
    }
});

var cw = 80,
    cards1 = [],
    cards2 = [];



function Card(config) {
    var me = this;
    me.id = config.id;
    me.name = config.name;
    me.img = new Image();
    me.img.src = config.img;
    me.img.width = cw;
    me.img.height = cw;

    me.shangzhen = function(x, y) {

        // ay 代表可上阵的Y坐标，默认为本方最贴近中线的y坐标
        for (var ay = board.row / 2; ay < board.row; ay++) {
            if (!board.cellObj[x + "" + ay].card) {
                break;
            }

            if (ay === board.row) return false;
        }
        
        board.div.append(me.div);
        me.div.css({left: x * cw, top: y * cw});
        me.div.animate({top: "-=" + (board.row - 1 - ay) * cw});
        me.div.css({'background':'transparent'});
        me.selected = false;
        me.paiku.selectedCard = null;
        board.cellObj[x + "" + ay].card = me;
        me.paiku.cards.splice(me, 1);
        board.cards.push(me);
    };
}

function Cell(x, y) {
    var me = this;
    me.x = x;
    me.y = y;
    me.card = null;

    // 是否为出兵点
    me.isChuBingDian = function(x, y) {
        if ( y === board.column ) {
            return true;
        } else {
            return false;
        }
    };
}



var Paiku = Class.extend({
    cw: 80, // 单元格宽度
    row: 5,
    column: 2,
    init: function(cards, id) {
        var me = this;
        me.cards = cards;
        me.el = $("#" + id);
        me.left = me.el.position().left;
        me.top = me.el.position().top;


        $.each(cards, function(idx, card) {
            card.paiku = me;
            var div = document.createElement('div');
            div.id = 'div-' + card.id;
            me.el.append(div);
            var d = $('#' + div.id);
            card.div = d;
            d.click(function(dd){
                if (!card.selected) {
                    d.css({'background':'red'});
                    card.selected = true;
                    paiku1.selectedCard = card;
                } else {
                    d.css({'background':'transparent'});
                    card.selected = false;
                    paiku1.selectedCard = null;
                }
                
            });
            d.append(card.img);
            d.css({width: cw, height: cw, position: 'absolute', left: idx * cw});
        });
    }
});

var board = {
    row: 6,
    column: 5,
    cw: 80,
    cellObj: {},
    cards: [],
    init: function() {
        var me = this;
        me.div = $('#board');
        me.left = me.div.position().left;
        me.top  = me.div.position().top;
        me.right = me.left + me.column * cw;
        me.bottom = me.top + cw * me.row;

        for (var i = 0; i < me.row; i++) {
            for (var j = 0; j < me.column; j++) {
                me.cellObj[i + "" + j] = new Cell(i, j);
            }
        }

        me.div.click(function(e) {
            var me = board;
            if (me.isInBoard(e.offsetX, e.offsetY)) {
                var cell = me.getCellByPos(e.offsetX, e.offsetY),
                    x = Math.floor(e.offsetX / me.cw),
                    y = Math.floor(e.offsetY / me.cw);

                if (!cell.card && cell.card.selectedCard && cell.isChuBingDian(x, y)) {
                    var card = cell.card.selectedCard;
                    card.shangzhen(x, y);
                }
            }
            
        });
    },

    isInBoard: function(left, top) {
        var me = this;
        if ( left > me.left && left < me.right && top > me.top && top < me.bottom ) {
            return true;
        } else {
            return false;
        }
    },

    getCellByPos: function(left, top) {
        var me = this;
        if (me.isInBoard(left, top)) {
            return me.cellObj[Math.floor(top / me.cw) + "" + Math.floor(left / me.cw)];
        } else {
            return null;
        }
    },

    /**
     * 获取坐标
     * @param  {number} left 
     * @param  {number} top
     */
    getCoordinate: function(left, top) {

    }
};


$.each(cards1Config, function(idx, cardConfig) {
    cards1.push(new Card(cardConfig));
});

$.each(cards2Config, function(idx, cardConfig) {
    cards2.push(new Card(cardConfig));
});

$(document).ready(function() {
    var
        play1 = new Player({
            'cards': cards1
        }),
        play2 = new Player({
            'cards': cards2
        });

    play1.createPaiku('paiku1');
    play2.createPaiku('paiku2');

    board.init();
});