const sizes = {landscape:["4x3", "6x3", "5x4", "6x4", "6x5"],
               portrait:["3x4", "4x4", "4x5", "6x4", "5x6"]};

$(document).ready(function () {
    $('#bg-fade').fadeOut(500);

    // Theme switch
    $('#theme img').click(function (e) { 
        e.preventDefault();
        
        $.each($('#theme img'), function (index, item) { 
             $(item).removeAttr('selected');
        });
        $(this).attr('selected', '');
        changeTheme($(this).data('value'));
    });

    // Submit
    $('#play').click(function (e) { 
        e.preventDefault();
        
        const theme = $('#theme img[selected]').data('value');
        const level = $('input:checked').data('value');
        location.href = `game.html?theme=${theme}&dif=${level}`;
    });
});

function changeTheme(theme) {
    const t = 350;
    $('#bg-fade').fadeIn(t);
    setTimeout(function () {
        $('main').removeAttr('class');
        $('main').addClass(theme.replace(' ', '-'));
        $('body').css('background-image', 
            `url(./assets/themes/${theme.replace(' ', '_')}-bg.webp)`);
    }, t);
    $('#bg-fade').fadeOut(t);
}
