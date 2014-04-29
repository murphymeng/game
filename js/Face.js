var Face = Class.extend({
    init: function(config) {
        var me = this;
        $.extend(me, config);
        me.leftHp = me.HP;
        me.hpLine = $('#' + me.id + " .hp_line");
        me.hpValue = $('#' + me.id + " .hp_line .hp-value");
        me.hpValue.html(me.HP);
    }
});