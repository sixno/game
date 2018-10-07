jQuery(function($){
	$(document).on('click','.confirm',function(event){
		event.preventDefault();

		url = $(this).attr('href');
		inf = $(this).attr('warn');
		wth = $(this).attr('wth');
		hgt = $(this).attr('hgt');

		confirm_modal(url,inf,false,wth,hgt);
	});

	$(document).on('click','.ajaxtodo',function(event){
		event.preventDefault();

		url = $(this).attr('href');
		inf = $(this).attr('warn');
		wth = $(this).attr('wth');
		hgt = $(this).attr('hgt');

		confirm_modal(url,inf,true,wth,hgt);
	});

	$(document).on('submit','.ajaxtodo',function(event){
		event.preventDefault();

		url = $(this).attr('action');
		dat = $(this).serialize();
		inf = $(this).attr('warn');
		wth = $(this).attr('wth');
		hgt = $(this).attr('hgt');

		confirm_modal(url,inf,dat,wth,hgt);
	});

	$(document).on('click','.ajaxpage',function(event){
		event.preventDefault();

		var url = $(this).attr('href');
		var wth = $(this).attr('wth');
		var hgt = $(this).attr('hgt');

		//require script file: jquery.component.js
		get_data(url,function(obj){
			if(obj.out != -1)
			{
				modal(obj.view,wth,hgt);
			}
			else
			{
				alert_modal(obj.out,-1);
			}
		},function(msg){
			alert_modal(msg,-1);
		});

		// $.get(url,function(data){
		// 	modal(data,wth,hgt);
		// });
	});

	$(document).on('click','.temply',function(event){
		event.preventDefault();

		var tmp = $(this).attr('temp');
		var url = $(this).attr('href') || '';
		var dat = $(this).attr('data');
		var wth = $(this).attr('wth');
		var hgt = $(this).attr('hgt');

		if(url == 'javascript:;') url = '';

		if(url != '')
		{
			get_data(url,function(obj){
				if(obj.out != -1)
				{
					modal(put_template(tmp,obj.data),wth,hgt);
				}
				else
				{
					alert_modal(obj.out,-1);
				}
			},function(msg){
				alert_modal(msg,-1);
			});
		}
		else if(typeof(dat) != 'undefined')
		{
			modal(put_template(tmp,eval('('+dat+')')),wth,hgt);
		}
		else
		{
			modal(put_template(tmp),wth,hgt);
		}
	});

	$(document).on('click','.pickup',function(event){
		event.preventDefault();

		$('.pickup_opt').removeClass('pickup_opt');

		var url = $(this).attr('href');
		var wth = $(this).attr('wth');
		var hgt = $(this).attr('hgt');
		var tar = $(this).attr('target');
		$(tar).addClass('pickup_opt');

		$.get(url,function(data){
			modal(data,wth,hgt);
		});
	});
});

/*构造模态窗口并覆盖底层内容*/
function modal(data,width,height)
{
	//如果发现已经打开的弹窗，关闭之
	if(Boolean($('.modal')))
	{
		$('.overlay-for-modal').remove();
		$('.modal').remove();
	}

	var modal_padding = 0;

	width = width || 320;
	var W_height = $(window).height();
	var W_width = $(window).width();
	var useLeft = (W_width-width-2*modal_padding)/2;

	if(useLeft < 5)
	{
		useLeft = 5;
		width = W_width - 10;
	}

	if(!Boolean(height))
	{
		$('body').append('<div class="overlay-for-modal"></div><div class="modal" style="width:'+width+'px;left:'+useLeft+'px;top:0px;"><div class="modal-head"><div class="modal-close-btn">&times;</div></div><div class="modal-body"><div class="modal-content">'+data+'</div></div></div>');
		height = $('.modal').height();
		if(height+50 > W_height) height = W_height-50;
		var useTop = (W_height-height-2*modal_padding)/2;
		$('.modal').css({'top':useTop+'px','height':height+'px'});
	}
	else
	{
		if(height+50 > W_height) height = W_height-50;
		var useTop = (W_height-height-2*modal_padding)/2;
		$('body').append('<div class="overlay-for-modal"></div><div class="modal" style="width:'+width+'px;height:'+height+'px;left:'+useLeft+'px;top:'+useTop+'px;"><div class="modal-head"><div class="modal-close-btn">&times;</div></div><div class="modal-body"><div class="modal-content">'+data+'</div></div></div>');
	}
	var title = $('.modal-content-title').html();
	if(Boolean(title))
	{
		$('.modal-content-title').remove();
		$('.modal-head').prepend('<div class="modal-title">'+title+'</div>');
	}
	var modal_body_height = height-$('.modal-head').height()-$('.modal-foot').height();
	$('.modal-body').height(modal_body_height);
	var bar = $('.modal-bar').html();
	if(Boolean(bar))
	{
		$('.modal-bar').remove();
		$('.modal').append('<div class="modal-foot">'+bar+'</div>');
		$('.modal').height($('.modal').height()+$('.modal-foot').height());
		$('.modal').css('top',(useTop-$('.modal-foot').height()/2)+'px');
	}
	$('.overlay-for-modal').fadeTo('fast',0.5);
	$(window).resize(function(){
		setTimeout(function(){
			var W_height = $(window).height();
			var W_width = $(window).width();
			height = $('.modal').height();
			if(height+50 > W_height) height = W_height-50;
			var useLeft = (W_width-width-2*modal_padding)/2;
			var useTop = (W_height-height-2*modal_padding)/2;
			$('.modal').css({'left':useLeft+'px','top':useTop+'px','height':height+'px'});
			var modal_body_height = height-$('.modal-head').height()-$('.modal-foot').height();
			$('.modal-body').height(modal_body_height);
		},10);
	});
	$('.modal-close-btn,.overlay-for-modal,.modal-cancel,.modal-close').click(function(event){
		event.preventDefault();
		closemodal();
	});
}
function closemodal()
{
	$('.overlay-for-modal').fadeOut('fast',function(){
		$('.overlay-for-modal').remove();
		$('.modal').remove();
	});
}

/*确认窗口*/
function alert_modal(info,type,callback,width,height)
{
	var icon = '';
	var btn_content = '确定';

	width = width || 320;

	switch(type)
	{
		case 1:
			info = info || '操作成功！';
			icon = ' successful';
			break;

		case -1:
			info = info || '操作失败！';
			icon = ' failed';
			btn_content = '关闭';
			break;

		default:
			type = 0;
			info = info || '操作成功！';
			break;
	}

	var adx_html = '<div class="modal-info-icon'+icon+'"></div>';
	var adx_type = typeof(adx);

	if(adx_type != 'undefined')
	{
		if(adx_type == 'string')
		{
			adx_html = '<img src="'+adx+'">';
		}
		else if(adx_type == 'object')
		{
			if(typeof(adx.length) == 'undefined')
			{
				adx_html = '<a href="'+adx.url+'" target="_blank"><img src="'+adx.img+'"></a>';
			}
			else
			{
				if(typeof(adx_index) == 'undefined')
				{
					adx_index = 0;
				}
				else if(adx_index >= adx.length)
				{
					adx_index = 0;
				}

				if(typeof(adx[adx_index]) == 'object')
				{
					adx_html = '<a href="'+adx[adx_index].url+'" target="_blank"><img src="'+adx[adx_index].img+'"></a>';
				}
				else if(typeof(adx[adx_index]) == 'string')
				{
					adx_html = '<img src="'+adx[adx_index]+'">';
				}

				adx_index++;
			}
		}
	}

	modal('<div class="modal-content-title">提示信息</div><table class="modal-info-layout"><tr><td class="modal-icon-alt">'+adx_html+'</td><td>'+info+'</td></tr></table><div class="modal-bar"><div class="modal-close">'+btn_content+'</div></div>',width,height);

	if(typeof(callback) == 'function')
	{
		$('.modal-close,.modal-close-btn,.overlay-for-modal').click(function(event){
			event.preventDefault();

			callback();
		});
	}
}

function confirm_modal(url,warn,ajax,width,height,callback)
{
	var icon = ' careful';
	url = url || '';
	warn = warn || '您确定继续吗？';
	width = width || 320;

	var adx_html = '<div class="modal-info-icon'+icon+'"></div>';
	var adx_type = typeof(adx);

	if(adx_type != 'undefined')
	{
		if(adx_type == 'string')
		{
			adx_html = '<img src="'+adx+'">';
		}
		else if(adx_type == 'object')
		{
			if(typeof(adx.length) == 'undefined')
			{
				adx_html = '<a href="'+adx.url+'" target="_blank"><img src="'+adx.img+'"></a>';
			}
			else
			{
				if(typeof(adx_index) == 'undefined')
				{
					adx_index = 0;
				}
				else if(adx_index >= adx.length)
				{
					adx_index = 0;
				}

				if(typeof(adx[adx_index]) == 'object')
				{
					adx_html = '<a href="'+adx[adx_index].url+'" target="_blank"><img src="'+adx[adx_index].img+'"></a>';
				}
				else if(typeof(adx[adx_index]) == 'string')
				{
					adx_html = '<img src="'+adx[adx_index]+'">';
				}

				adx_index++;
			}
		}
	}

	modal('<div class="modal-content-title">确认提示</div><table class="modal-info-layout"><tr><td class="modal-icon-alt">'+adx_html+'</td><td>'+warn+'</td></tr></table><div class="modal-bar"><div class="modal-cancel">取消</div><div class="modal-ok">确定</div></div>',width,height);

	$('.modal-ok').click(function(event){
		if(!Boolean(ajax))
		{
			window.location.href = url;
		}
		else
		{
			$('.overlay-for-modal').remove();
			$('.modal').remove();

			var ajax_type = 'GET';
			var data = null;
			if(typeof(ajax) == 'object' || typeof(ajax) == 'string')
			{
				ajax_type = 'POST';
				data = ajax;
			}

			$.ajax({async:false,type:ajax_type,url:url,data:data,success:function(obj){
				alert_modal(obj.msg,obj.out);

				if(typeof(callback) != 'undefined')
				{
					$('.modal-close,.modal-close-btn,.overlay-for-modal').click(function(event){
						event.preventDefault();

						callback(obj.out);
					});
				}
			},
			error:function()
			{
				alert('无法连接目标地址，请稍后再试！',-1);
				// modal('<div class="errorbox"><h3>确认提示</h3><div class="errorbody">连接错误，服务器未返回数据，请稍后再试！</div></div><div class="botbar"><div class="cancel">确定</div></div>',width,height);
			},dataType:'json'});
		}
	});
}

/*原生js函数重写*/
window.alert = function(msg,type,callback)
{
	alert_modal(msg,type,callback);
}

window.confirm = function(url,warn,ajax,width,height)
{
	confirm_modal(url,warn,ajax,width,height);
}