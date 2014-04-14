var cards1Config = [{
    id: 1,
    name: 'zhaoyun',
    type: 'B',
    img: 'res/zhaoyun.png',
    md: 1, // 移动距离
    at: 3,
    ad: 1,
    hp: 10
}, {
    id: 2,
    name: 'daqiao',
    type: 'B',
    img: 'res/daqiao.png',
    md: 1, // 移动距离
    at: 3,
    ad: 1,
    hp: 10
}];

var cards2Config = [{
    id: 3,
    name: 'zhaoyun',
    type: 'B',
    img: 'res/zhaoyun.png',
    md: 1, // 移动距离
    at: 3,
    ad: 1,
    hp: 10
}, {
    id: 4,
    name: 'daqiao',
    type: 'B',
    img: 'res/daqiao.png',
    md: 1, // 移动距离
    at: 3,
    ad: 1,
    hp: 10
}];

var Fight = Class.extend({
    init: function() {
        var me = this;
    },

    setPlayer: function(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    },

    begin: function() {

    }
});



var cw = 80,
    cards1 = [],
    cards2 = [];

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

        for (var i = 0; i < me.column; i++) {
            for (var j = 0; j < me.row; j++) {
                me.cellObj[i + "" + j] = new Cell(i, j);
            }
        }

        me.div.click(function(e) {
            var me = board;
            if (me.isInBoard(e.offsetX, e.offsetY)) {
                var cell = me.getCellByPos(e.offsetX, e.offsetY),
                    x = Math.floor(e.offsetX / me.cw),
                    y = Math.floor(e.offsetY / me.cw);

                if (!cell.card && currentPlayer.paiku.getSelectedCard()) {
                    currentPlayer.paiku.getSelectedCard().shangzhen(x);
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

var
    face1 = new Face({
        'id': 'face1',
        'hp': 40
    }),
    face2 =new Face({
        'id': 'face2',
        'hp': 40
    }),
    player1 = new Player({
        'cards': cards1,
        'moveCount': 2,
        'isP1': true,
        'face': face1
    }),
    player2 = new Player({
        'cards': cards2,
        'moveCount': 2,
        'isP1': false,
        'face': face2
    });



player1.createPaiku('paiku1');
player2.createPaiku('paiku2');

$(document).ready(function() {

    board.init();

    currentPlayer = player1;
    currentPlayer.resetMoveCount();
    currentPlayer.autoDispatch();
    //currentPlayer.autoAttack();
});