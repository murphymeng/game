Card = Class.extend({

    init: function(config) {
        var me = this,
            el;
        $.extend(me, config);
        me.handlers = {};
        me.status = 0; // 0: 回合开始 1: 已经移动过  2：已经攻击过
        me.img = new Image();
        me.img.src = config.img;
        me.img.width = cw;
        me.img.height = cw;

        el = document.createElement('div');
        el.id = 'div-' + me.id;
        $('body').append(el);
        me.div = $('#' + el.id);
        me.div.hide();

        me.div.click(function() {
            if (!me.selected) {
                me.div.css({'background':'green'});
                me.selected = true;

                if (me.onBoard) {
                    me.highLightMovableCells();
                }

                //me.selectedCard = card;
            } else {
                me.div.css({'background':'transparent'});
                me.selected = false;
                //me.selectedCard = null;
            }
        });
        me.div.append(me.img);

        me.on('startAttack', function() {
            this.doAttackEffect();
        });

        me.on('attackEffectDone', function() {
            var me = this;
            if (board.cellObj[me.x + '' + (me.y + 1)].card) {
                me.attackCard(board.getCellByPos(me.x, me.y + 1).card);
            } else {
                if (me.player === player1) {
                    me.attackFace(player2.face);
                } else {
                    me.attackFace(player1.face);
                }
            }
        });

        me.on('attackDone', function() {
            this.player.autoAttack();
        });
    },

    highLightMovableCells: function() {
        var me = this,
            cells = me.getMovableCells();

        cells.forEach(function(cell) {
            cell.setColor('green');
        });

    },

    getMovableCells: function() {
        var me = this,
            cells = [];
        if (me.player === player2) {
            for (var x = 0; x < board.column; x++) {
                for (var y = board.row / 2; y < board.row - 1; y++) {
                    if (!board.cellObj[x + '' + y].card &&
                        (Math.abs(x - me.x) + Math.abs(y - me.y) <= me.md) &&
                        y <= me.y) {
                        cells.push(board.cellObj[x + '' + y]);
                    }
                }
            }
        }
        return cells;
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
    },

    belongTo: function() {
        if (this.player) {
            if (this.player.isP1) {
                return 'p1';
            } else {
                return 'p2';
            }
        }
    },

    shangzhen: function(x) {
        var
            me = this,
            top,
            animateTop,
            ay; // ay 代表可上阵的Y坐标，默认为本方最贴近中线的y坐标
        
    
        if (me.player.isP1) {
            for (ay = board.row / 2 - 1; ay >= 0; ay--) {
                if (!board.cellObj[x + "" + ay].card) {
                    break;
                }

                if (ay === -1) return false;
            }
        } else {
            for (ay = board.row / 2; ay < board.row; ay++) {
                if (!board.cellObj[x + "" + ay].card) {
                    break;
                }

                if (ay === board.row) return false;
            }
        }
        
        me.x = x;
        me.y = ay;

        me.selected = false;
        //me.paiku.selectedCard = null;
        board.cellObj[x + "" + ay].card = me;
        me.paiku.cards.splice(me, 1);
        board.cards.push(me);
        me.onBoard = true;
        me.paiku = null;

        board.div.append(me.div);
        me.div.css({'background':'transparent'});
        if (me.player.isP1) {
            top = 0;
            animateTop = "+=" + ay * cw;

        } else {
            top = (board.row -1) * cw;
            animateTop = "-=" + (board.row - 1 - ay) * cw;
        }
        me.div.css({left: x * cw, top: top})
            .animate({top: animateTop}, function() {
                if (me.player === player1) {
                    me.player.autoDispatch();
                }
            });
    },

    reduceHp: function() {
        var me = this;
    },

    attackFace: function(face) {
        var me = this;
        face.leftHp -= me.at;
        face.hpLine.animate({width: "-=" + 400 / face.hp * me.at}, function() {
            me.status = 2;
            me.fireEvent('attackDone');
        });
    },

    doAttackEffect: function(callback) {
        var me = this;
        if (me.player === player1) {
            me.div.animate({top: "+=20"}, 'fast')
                .animate({top: "-=20"}, 'fast', function() {
                    me.fireEvent('attackEffectDone');
                });
        } else {
            me.div.animate({top: "-=20"}, 'fast')
                .animate({top: "+=20"}, 'fast', function() {
                    me.fireEvent('attackEffectDone');
                });
        }
    },

    attack: function() {
        var me = this;
        if (me.type === 'B') {
            if (me.y !== board.row/2 -1) {
                return;
            }
            this.fireEvent('startAttack');

        }
        
    },

    attack1: function() {
        var me = this;

        me.doAttackEffect();
        me.doAttack();

        // for (var x = 0; x < board.column; x++) {
        //     for (var y = row/2; y < row; y++) {
        //         if (Math.abs(me.x - x) + Math.abs(me.y - y) <= me.ad) {
        //             if (board.getCellByPos(x, y).card) {
        //                 board.getCellByPos(x, y).card.reduceHp(card.at);
        //                 return;
        //             }
        //         }
        //     }
        // }
    }
});