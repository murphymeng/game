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
        'hp': 30
    }),
    face2 =new Face({
        'id': 'face2',
        'hp': 30
    }),
    player1 = new Player({
        'cards': cards1,
        'actCount': 5,
        'isP1': true,
        'face': face1
    }),
    player2 = new Player({
        'cards': cards2,
        'actCount': 115,
        'isP1': false,
        'face': face2
    }),
    currentPlayer;
player1.createPaiku('paiku1');
player2.createPaiku('paiku2');

$(document).ready(function() {
    
    board.init();
    player1.startRound();
    $('#endRoundButton').click(function() {
        $('#endRoundButton').attr({disabled: true});
        player1.startRound();
    });
});