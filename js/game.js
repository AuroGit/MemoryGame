var canClick = true;
var t = 750;
var clicks = 0;
var startTime;

const url = location.search;
const paramsURL = new URLSearchParams(url);
const gameOptions = {theme:paramsURL.get("theme"), size:paramsURL.get("dif")};

$(document).ready(function () {
    $('body').css('background-image', `url('../assets/themes/${gameOptions.theme}-bg.webp')`);
    $('.endgame').addClass(gameOptions.theme);
    tableBuild(gameOptions.theme, gameOptions.size);
});

function newCard(theme, src) {
    const fragment = $(document.createDocumentFragment());
    const innerHtml = `<img src="./assets/themes/${theme}.png" data-id="back" style="--r: 0deg">
        <img src="./assets/themes/${theme}/${src}" data-id="front" style="--r: 180deg">`
    const card = $('<div class="card">' + innerHtml + '</div>');
    fragment.append(card);
    return fragment;
}

function tableBuild(theme, size) {
    const cardAmount = size.split("x")[0] * size.split("x")[1];
    $('.table.grid').addClass(`grid-${size}`);

    $.getJSON("./js/themes.json", function(data) {
        data[theme.replace("_", " ")].sort((a,b) => 0.5 - Math.random());
        const pairs = cardAmount / 2 > 10 ? Math.floor(cardAmount / 4)
            : cardAmount / 2;
        let deck = [];
        while (deck.length < cardAmount / 2) {
            deck.push(data[theme.replace("_", " ")][(deck.length % pairs)]);
        }
        deck.push(...deck);
        deck.sort((a,b) => 0.5 - Math.random());
        deck.forEach(elem => {
            $('.table').append(newCard(theme, elem));
        })
        // Ids
        $.each($('.card'), function (index, item) { 
            $(item).attr('id', index + 1);
        });
        // Click event
        $('.card').click(function (e) {
            e.preventDefault();

            if (canClick) {
                // Click CoolDown
                canClick = false;
                setTimeout(function () { canClick = true; }, t);

                // Pair
                if (!$(this).attr('data-matched')) {
                    turnCard(this);
                    var turnedUp = [...$('.card[data-turned-up]')];
                }
        
                // Pairing
                if (turnedUp.length == 2) {
                    if ($(turnedUp[0]).find('img:last')[0].src === $(turnedUp[1]).find('img:last')[0].src) {
                        $.each(turnedUp, function(index, item) {
                            $(item).removeAttr('data-turned-up');
                            $(item).attr('data-matched', '');
                            $(item).off('click');
                        });

                        // GameOver
                        if ([...$('.card[data-matched]')].length === [...$('.card')].length) {
                            setTimeout(function() {
                                const endTime = parseInt((new Date().getTime() - startTime) / 1000);
                                const playTime = endTime >= 600 ? "Has tardao la vida xD"
                                    : `${endTime > 60 ? parseInt(endTime / 60) : '0'}:${endTime % 60}`;
                                $('.endgame li:first span').text(playTime);
                                $('.endgame li:last span').text(clicks);
                                $('.endgame-screen').removeAttr('style');
                            }, t);
                        }
                    } else {
                        setTimeout(function() {
                            $.each(turnedUp, function(index, item) { turnCard(item); });
                        }, t);
                    }
                    clicks += 2;
                }
            }
        });
    });

    startTime = new Date().getTime();
}

function turnCard(card) {
    $.each($(`.card:nth-child(${card.id}) img`), function (index, item) { 
        const str = $(item).attr('style');
        const r = (parseInt(str.replace(/\D/g, "")) + 180) % 360;
        $(item).attr('style', `--r: ${r}deg`);
    });
    card.toggleAttribute("data-turned-up");
}

$('#back').click(function () { location.href = "/index.html"; });
$('#replay').click(function () { location.reload() });