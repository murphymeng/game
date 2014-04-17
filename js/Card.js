Card = Class.extend({

    init: function(config) {
        var me = this,
            el;
        $.extend(me, config);
        me.leftHp = me.hp;
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
        me.div.append(me.img);
        me.div.append("<div class='card_hp'>"+ me.hp +"</div>")
        me.div.hide();

        me.div.click(function() {
            if (!me.selected && !board.selectedCard && me.onBoard) { // 在board中选中一张卡牌
                me.div.css({'background':'green'});
                me.selected = true;

                board.selectedCard = me;
                me.highLightMovableCells();
                if (me.getAttackableCells().length > 0) {
                    me.getAttackableCells().forEach(function(cell) {
                        cell.dom.css({background: 'red'});
                    });
                }

            } else if (!me.selected && !me.onBoard) {
                if (me.player.paiku.selectedCard) {
                    me.player.paiku.selectedCard.deSelect();
                }
                me.div.css({'background':'green'});
                me.selected = true;
                me.player.paiku.selectedCard = me;
            } else if(!me.selected && board.selectedCard) {
                if (board.cellObj[me.x + '' + me.y].dom.css('backgroundColor') === 'rgb(255, 0, 0)') {
                    board.selectedCard.fireEvent('startAttack', board.cellObj[me.x + '' + me.y].card);
                    board.selectedCard.deSelect();
                }
            } else if(me.selected) { // 取消选中
                if(me.onBoard) {
                   me.deSelect();
                }
            }
        });
        

        me.on('startAttack', function(aim) {
            this.doAttackEffect(aim);
        });

        me.on('attackEffectDone', function(aim) {
            var me = this;

            if (aim instanceof Card) {
                me.attackCard(aim);
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

    deSelect: function() {
        var me = this;
        me.div.css({'background':'transparent'});
        me.selected = false;
        board.selectedCard = null;
        me.highLightMovableCells('transparent');
        if (me.getAttackableCells().length > 0) {
            me.getAttackableCells().forEach(function(cell) {
                cell.dom.css({background: 'transparent'});
            });
        }
    },

    moveTo: function(x, y) {
        var me = this,
            leftMove,
            topMove;

        me.deSelect();
        board.cellObj[me.x + '' + me.y].card = null;
        board.cellObj[x + '' + y].card = me;

        if (x >= me.x) {
            leftMove = "+=" + (x - me.x) * cw;
        } else {
            leftMove = "-=" + (me.x - x) * cw;
        }

        if (y >= me.y) {
            topMove = "+=" + (y - me.y) * cw;
        } else {
            topMove = "-=" + (me.y - y) * cw;
        }

        me.x = x;
        me.y = y;
        
        me.div.animate({left: leftMove, top: topMove}, 'fast');
        
    },

    highLightMovableCells: function(color) {
        var me = this,
            cells = me.getMovableCells();

        cells.forEach(function(cell) {
            cell.setColor(color ? color : 'green');
        });

    },

    getAttackableCells: function() {
        var me = this,
            cells = [];

        if (me.type === 'B' && me.y > board.row /2) {
            return null;
        }

        if (me.player === player2) {
            for (var x = 0; x < board.column; x++) {
                for (var y = 0; y < board.row / 2; y++) {
                    if ( board.cellObj[x + '' + y].card &&
                        (Math.abs(x - me.x) + Math.abs(y - me.y) <= me.ad) ) {
                        cells.push(board.cellObj[x + '' + y]);
                    }
                }
            }
        }
        return cells;
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
        me.paiku.selectedCard = null;
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
            face.hpValue.html(face.hpValue.html() - me.at);
            me.status = 2;
            me.fireEvent('attackDone');
        });
    },

    attackCard: function(card) {
        var me = this;
        me.reduceHp(card.at);
        card.reduceHp(me.at);
    },

    reduceHp: function(value) {
        var me = this;
        if (me.leftHp - value > 0) {
            me.div.find('.card_hp').html(me.leftHp - value);
            me.leftHp = me.leftHp - value;
        } else {
            
        }
        
    },

    doAttackEffect: function(aim) {
        var me = this;
        if (me.player === player1) {
            me.div.animate({top: "+=20"}, 'fast')
                .animate({top: "-=20"}, 'fast', function() {
                    me.fireEvent('attackEffectDone', aim);
                });
        } else {
            me.div.animate({top: "-=20"}, 'fast')
                .animate({top: "+=20"}, 'fast', function() {
                    me.fireEvent('attackEffectDone', aim);
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