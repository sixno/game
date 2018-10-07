function biu(text,show,font_size,display_height)
{
	if(typeof(show) == 'undefined') show = 1;

	var speed = 360 / 5000;
	var font_size = font_size || 14;
	var window_width = $(window).width();
	var display_height = display_height || $(window).height() - (font_size + 8);
	var bullet_length = text.length * (font_size + 6) + 6;

	var bullet = $('<div class="bullet">' + text + '</div>');

	bullet.addClass('color_' + Math.ceil(7 * Math.random())).css({'display':(show == 1 ? 'block' : 'none'),'width':bullet_length + 'px','height':(font_size + 6) + 'px','line-height':font_size + 'px','left':window_width + 'px','top': Math.round(display_height * Math.random()) + 'px'});

	bullet.appendTo('body');

	bullet.animate({'left':'-' + bullet_length + 'px'},Math.round((window_width + bullet_length) / speed),function(){
		bullet.remove();
	});
}