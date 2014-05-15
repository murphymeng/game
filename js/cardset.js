$(document).ready(function() {
    $('.like').click(function() {
        $.ajax({
          url: './like',
          type: 'POST',
          dataType: "json",
          data: {
            uid: uid,
            cid: $(this).attr('id')
          }
        })
        .done(function(data) {
            var pic = $('img#' + data);
            if (pic.attr('src') === 'res/like.png') {
                pic.attr('src', 'res/unlike.png')
            } else {
                pic.attr('src', 'res/like.png')
            }
        });
        
    });
});