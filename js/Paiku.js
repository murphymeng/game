Paiku = Class.extend({
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
            card.x = idx;
            me.el.append(card.el);
            me.el.css({width: cw, height: cw, position: 'absolute', left: idx * cw});
        });
    },

    // 获取牌库中被选中的卡牌
    getSelectedCard: function() {
        for(var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].selected === true) {
                return this.cards[i];
            }
        }
        return null;
    }
});