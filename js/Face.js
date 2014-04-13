var Face = Class.extend({
    init: function(config) {
        var me = this;
        $.extend(me, config);
        me.leftHp = me.hp;
        me.hpLine = $('#' + me.id + " .hp_line");
        me.hpValue = $('#' + me.id + " .hp_line .hp_value");
        me.hpValue.html(me.hp);
    }
});