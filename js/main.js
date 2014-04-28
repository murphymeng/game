var cw = 80,
    cards1 = [],
    cards2 = [],
    cards1Config = [],
    cards2Config = [],
    face1 = new Face({
        'id': 'face1',
        'HP': 30
    }),
    face2 =new Face({
        'id': 'face2',
        'HP': 30
    }),
    player1 = new Player({
        'id': 'player1',
        'actCount': 5,
        'isP1': true,
        'face': face1
    }),
    player2 = new Player({
        'id': 'player2',
        'actCount': 115,
        'isP1': false,
        'face': face2
    }),
    currentPlayer;

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

function getCard(cardId) {
    var returnCard = null;
    cards1.forEach(function(card) {
        if (card.id === cardId) {
            returnCard = card;
            return;
        }
    });

    cards2.forEach(function(card) {
        if (card.id === cardId) {
            returnCard = card;
            return;
        }
    });
    return returnCard;
}

socket.on('shangzhen', function (data) {
    var card = getCard(data.cardId);
    if (card.uid === player1Id) {
        card.shangzhen(data.x);
    }
});

Event = Class.extend({

    // 事件处理器
    handlers: {},

    init: function() {
        var me = this;

        me.on('cardsLoaded', function() {
            if (cards1Config.length > 0 && cards2Config.length > 0) {

                $.each(cards1Config, function(idx, cardConfig) {
                    cardConfig.id = player1Id + '-' + cardConfig.id;
                    cardConfig.uid = player1Id;
                    cards1.push(new Card(cardConfig));
                });

                $.each(cards2Config, function(idx, cardConfig) {
                    cardConfig.id = player2Id + '-' + cardConfig.id;
                    cardConfig.uid = player2Id;
                    cards2.push(new Card(cardConfig));
                });

                player1.setCards(cards1);
                player2.setCards(cards2);

                player1.createPaiku('paiku1');
                player2.createPaiku('paiku2');

                board.init();
                if (player1Id === firstPlayId) {
                    player1.startRound();
                } else {
                    player2.startRound();
                }
                $('#endRoundButton').click(function() {
                    $('#endRoundButton').attr({disabled: true});
                    player1.startRound();
                });
            }
        })
    },

    on: function(eventType, handler) {
        var me = this;
        if (!(eventType in me.handlers)) {
            me.handlers[eventType] = [];
        }

        me.handlers[eventType].push(handler);
        return me;
    },

    fireEvent: function(eventType) {
        var handlerArgs = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < this.handlers[eventType].length; i++) {
            this.handlers[eventType][i].apply(this, handlerArgs);
        }
        return this;
    }
})

globalEvent = new Event();

var socket = io.connect('http://localhost:8888');
socket.on('say', function (data) {
    console.log(data);
});

$(document).ready(function() {
    $.ajax({
      url: './cards',
      dataType: "json",
      data: {
        uid: player1Id
      }
    })
    .done(function(data) {
      cards1Config = data;
      globalEvent.fireEvent('cardsLoaded');
    });
    $.ajax({
      url: './cards',
      dataType: "json",
      data: {
        uid: player2Id
      }
    })
    .done(function(data) {
      cards2Config = data;
      globalEvent.fireEvent('cardsLoaded');
    })
    
});