Card = Class.extend({

    init: function(config) {
        var me = this,
            el;
        $.extend(me, config);
        me.leftHp = me.HP;
        me.handlers = {};
        me.status = 0; // 0: 回合开始 1: 已经移动过  2：已经攻击过
        me.img = new Image();
        me.img.src = 'res/' + config.img;
        

        el = document.createElement('div');
        el.id = 'div-' + me.id;
        $('body').append(el);
        me.div = $('#' + el.id);
        me.div.append(me.img);
        me.div.addClass('card');
        
        $(me.img).addClass('card-normal');
        if (me.class) {
            $(me.img).addClass(me.class);
        }

        me.div.append("<div class='card_hp'>"+ me.HP +"</div>");
        me.div.hide();

        me.div.click(function() {
            if (!me.selected && !board.selectedCard && me.onBoard) { // 在board中选中一张卡牌
                me.div.addClass('selected');
                me.selected = true;

                board.selectedCard = me;
                me.highLightMovableCells(true);
                if (me.getAttackableCells().length > 0) {
                    me.getAttackableCells().forEach(function(cell) {
                        cell.dom.addClass('attackable');
                    });
                }

            } else if (!me.selected && !me.onBoard) { //在牌库中选中一张牌
                if (me.player.paiku.selectedCard) {
                    me.player.paiku.selectedCard.deSelect();
                }
                me.div.addClass('selected');
                me.selected = true;
                me.player.paiku.selectedCard = me;
            } else if(!me.selected && board.selectedCard) { //攻击卡牌
                if (board.cellObj[me.x + '' + me.y].dom.hasClass('attackable')) {
                    board.selectedCard.attack(board.cellObj[me.x + '' + me.y].card);
                    //board.selectedCard.fireEvent('startAttack', board.cellObj[me.x + '' + me.y].card);
                    board.selectedCard.deSelect();
                }
            } else if(me.selected) { // 取消选中
                me.deSelect();
            }
        });

        me.on('attackEffectDone', function(aim) {
            var me = this;

            if (aim instanceof Card) {
                me.attackCard(aim);
            } else if (aim instanceof Face) {
                me.attackFace(aim);
            }

            me.status = 2;
        });

        me.on('attackDone', function() {
            me.status = 2;
            me.div.find('img').css({
                '-webkit-filter': 'grayscale(100%)'
            });
            this.player.autoAttack();
        });
    },


    attack: function(aim) {
        var me = this,
            leftValue,
            topValue,
            topOffset,
            rotateAngle = 0;

        if (!aim) {
            if (me.player === player2) {
                aim = player1.face;
            } else {
                if (me.getAttackableCells().length > 0) {
                    aim = me.getAttackableCells()[0].card;
                } else {
                    aim = player2.face;
                }
            }
        }

        // 弓箭手的攻击动作
        if (me.type === 'G') {

            if (aim instanceof Card) {

                if (aim.div.offset().left - me.div.offset().left > 0) {
                    leftValue = '+=' + Math.abs(aim.div.offset().left - me.div.offset().left);
                } else {
                    leftValue = '-=' + Math.abs(aim.div.offset().left - me.div.offset().left);
                }

                if (aim.div.offset().top - me.div.offset().top > 0) {
                    topValue = '+=' + Math.abs(aim.div.offset().top - me.div.offset().top);
                } else {
                    topValue = '-=' + Math.abs(aim.div.offset().top - me.div.offset().top);
                }

                var num1 = leftValue.substr(0, 1),
                    num2 = topValue.substr(0, 1),
                    bian1 = leftValue.substr(2),
                    bian2 = topValue.substr(2);

                if (parseInt(bian1, 10) === 0) {
                    rotateAngle = 0;
                } else if (num1 === '-' && num2 === '-') {
                    rotateAngle = 270 + Math.abs(bian2 / bian1) * 180 / (Math.PI);
                } else if (num1 === '-' && num2 === '+') {
                    rotateAngle = 270 - Math.abs(bian2 / bian1) * 180 / (Math.PI);
                } else if (num1 === '+' && num2 === '-') {
                    rotateAngle = 90 - Math.abs(bian2 / bian1) * 180 / (Math.PI);
                } else if (num1 === '+' && num2 === '+') {
                    rotateAngle = 90 + Math.abs(bian2 / bian1) * 180 / (Math.PI);
                }

                
            } else if (aim instanceof Face) {
                if (me.player === player1) {
                    topValue = "+=" + (board.div.offset().top + 400 - me.div.offset().top);
                    rotateAngle = 180;
                } else {
                    topValue = "-=" +  (me.div.offset().top - board.div.offset().top);
                    rotateAngle = 0;
                }
                leftValue = "+=0";
            }

            $('#arrow').show().offset({
                    left: me.div.offset().left + 25,
                    top: me.div.offset().top + 25
                })
                .css({
                    '-webkit-transform': 'rotate(' + rotateAngle + 'deg)'
                });

            $('#arrow').animate({
                left: leftValue,
                top: topValue
            }, 'slow', function() {
                $('#arrow').hide();
                me.fireEvent('attackEffectDone', aim);
            });


        } else if(me.type === 'B' || me.type === 'Q') {
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
        }
    },

    deSelect: function() {
        var me = this;
        me.div.removeClass('selected');
        me.selected = false;

        if (me.onBoard) {
            board.selectedCard = null;
            me.highLightMovableCells(false);
            if (me.getAttackableCells() && me.getAttackableCells().length > 0) {
                me.getAttackableCells().forEach(function(cell) {
                    cell.dom.removeClass('attackable');
                });
            }
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
        
        me.div.animate({left: leftMove, top: topMove}, 'fast', function() {
            me.player.reduceActCount();
        });
        
    },

    highLightMovableCells: function(highlight) {
        var me = this,
            cells = me.getMovableCells();

        cells.forEach(function(cell) {
            if (highlight) {
                cell.dom.addClass('movable');
            } else {
                cell.dom.removeClass('movable');
            }
        });

    },

    getAttackableCells: function() {
        var me = this,
            cells = [],
            x,
            y;

        if (me.type === 'B' && me.y > board.row /2) {
            return cells;
        }

        if (me.player === player2) {
            for (x = 0; x < board.column; x++) {
                for (y = 0; y < board.row / 2; y++) {
                    if ( board.cellObj[x + '' + y].card &&
                        (Math.abs(x - me.x) + Math.abs(y - me.y) <= me.AD) ) {
                        cells.push(board.cellObj[x + '' + y]);
                    }
                }
            }
        } else if(me.player === player1) {
            for (x = 0; x < board.column; x++) {
                for (y = board.row / 2; y < board.row; y++) {
                    if ( board.cellObj[x + '' + y].card &&
                        (Math.abs(x - me.x) + Math.abs(y - me.y) <= me.AD) ) {
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
                        (Math.abs(x - me.x) + Math.abs(y - me.y) <= me.MD) &&
                        ( (y < me.y || y === board.row / 2) || y > board.row / 2 && board.cellObj[x + '' + (y - 1)].card && board.cellObj[x + '' + (y - 1)].card !== me)) {

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
        me.div.removeClass('selected');
        if (me.player.isP1) {
            top = 0;
            animateTop = "+=" + ay * cw;

        } else {
            top = (board.row -1) * cw;
            animateTop = "-=" + (board.row - 1 - ay) * cw;
        }
        me.div.css({left: x * cw, top: top})
            .animate({top: animateTop}, function() {
                me.player.reduceActCount();
                if (me.player === player1) {
                    me.player.autoDispatch();
                }
            });
    },

    attackFace: function(face) {
        var me = this;
        face.leftHp -= me.AT;

        face.leftHp = face.leftHp >=0 ? face.leftHp : 0;

        face.hpLine.animate({'width': face.leftHp * 100 / face.HP+'%'}, function() {

            if (face.leftHp === 0) {
                if (me.player === player2) {
                    bootbox.alert("你赢啦！！！");
                } else {
                    bootbox.alert("你跪啦！！！");
                }
                return;
            }
            me.fireEvent('attackDone');
        });

    },

    attackCard: function(card) {
        var me = this;
        if (me.type !== 'G') {
            me.reduceHp(card.AT);
        }
        card.reduceHp(me.AT);
        me.player.reduceActCount();
        me.fireEvent('attackDone');
    },

    reduceHp: function(value) {
        var me = this;
        if (me.leftHp - value > 0) {
            me.div.find('.card_hp').html(me.leftHp - value);
            me.leftHp = me.leftHp - value;
        } else {
            me.leave();
        }
    },

    leave: function() {
        var me = this,
            removeIdx;
        
        board.cards.forEach(function(c, idx) {
            if (c === board.cellObj[me.x + '' + me.y].card) {
                removeIdx = idx;
            }
        });
        board.cellObj[me.x + '' + me.y].card = null;
        board.cards.splice(removeIdx, 1);
        me.div.remove();
    }
});