(function($){
	$.fn.serializeJson=function(){
		var serializeObj = {};
		var array = this.serializeArray();

		$(array).each(function(){
			var var_name = this.name.replace(/\]/g,'');

			if(var_name.indexOf('[') == -1)
			{
				if(serializeObj[this.name])
				{
					if($.isArray(serializeObj[this.name]))
					{
						serializeObj[this.name].push(this.value);
					}
					else
					{
						serializeObj[this.name] = [serializeObj[this.name],this.value];
					}
				}
				else
				{
					serializeObj[this.name] = this.value;
				}
			}
			else
			{
				var var_name_array = var_name.split('[');
				var pointer = 'serializeObj';

				for(var i in var_name_array)
				{
					if(var_name_array[i] == '') break;

					if(typeof(eval(pointer)) == 'undefined')
					{
						eval(pointer+' = {};');
					}

					pointer = pointer + '[\'' + var_name_array[i] + '\']';
				}

				if(eval(pointer))
				{
					if($.isArray(eval(pointer)))
					{
						eval(pointer+'.push(this.value);');
					}
					else
					{
						eval(pointer+' = ['+pointer+',this.value];');
					}
				}
				else
				{
					eval(pointer+' = this.value;');
				}
			}
		});

		return serializeObj;
	};
})(jQuery);

function get_data(url,callback,error_callback)
{
	$.ajax({'async':false,'type':'GET','url':url,'success':function(obj){
		if(obj != null)
		{
			if(obj.out != -1)
			{
				callback(obj);
			}
			else
			{
				if(typeof(error_callback) != 'undefined')
				{
					error_callback(obj.msg);
				}
				else
				{
					default_ajax_error_callback(obj.msg);
				}
			}
		}
		else
		{
			if(typeof(error_callback) != 'undefined')
			{
				error_callback('无法连接目标地址，请稍后再试！');
			}
			else
			{
				default_ajax_error_callback('无法连接目标地址，请稍后再试！');
			}
		}
	},error:function(){
		if(typeof(error_callback) != 'undefined')
		{
			error_callback('无法连接目标地址，请稍后再试！');
		}
		else
		{
			default_ajax_error_callback('无法连接目标地址，请稍后再试！');
		}
	},dataType:'json'});
}

function post_data(url,data_post,callback,error_callback)
{
	$.ajax({'async':false,'type':'POST','url':url,'data':data_post,'success':function(obj){
		if(obj != null)
		{
			if(obj.out != -1)
			{
				callback(obj);
			}
			else
			{
				if(typeof(error_callback) != 'undefined')
				{
					error_callback(obj.msg);
				}
				else
				{
					default_ajax_error_callback(obj.msg);
				}
			}
		}
		else
		{
			if(typeof(error_callback) != 'undefined')
			{
				error_callback('无法连接目标地址，请稍后再试！');
			}
			else
			{
				default_ajax_error_callback('无法连接目标地址，请稍后再试！');
			}
		}
	},error:function(){
		if(typeof(error_callback) != 'undefined')
		{
			error_callback('无法连接目标地址，请稍后再试！');
		}
		else
		{
			default_ajax_error_callback('无法连接目标地址，请稍后再试！');
		}
	},dataType:'json'});
}

function default_ajax_error_callback(error_msg)
{
	error_msg = (typeof(error_msg) != 'undefined') ? error_msg : '未知错误！';
	alert(error_msg,-1);
}

function alert_after_refresh(msg,type,url)
{
	set_cookie('msg[type]',type);
	set_cookie('msg[content]',msg);

	if(typeof(url) == 'undefined')
	{
		window.location.reload();
	}
	else
	{
		redirect(url);
	}
}

function progress(mod)
{
	if(typeof(mod) == 'undefined') outurn;

	if(mod == 'hide')
	{
		$('.progress-container').remove();
		$('.overlay-for-progress').fadeTo('normal',0);
		$('.overlay-for-progress').remove();
	}
	else
	{
		if($('.overlay-for-progress').size() == 0)
		{
			$('body').append('<div class="overlay-for-progress"></div><div class="progress-container"><div class="progress-bar"><div class="progress-bared"></div></div><div class="progress-text"></div></div>');
			$('.overlay-for-progress').fadeTo('normal',0.5);
		}

		var percent = Number(mod);
		$('.progress-bared').css('left',-(100-percent)+'%');
		$('.progress-text').html(percent+'%');
	}
}

function loading(mod)
{
	if(mod == 'hide')
	{
		$('.progress-loading').remove();
		$('.overlay-for-progress').fadeTo('normal',0);
		$('.overlay-for-progress').remove();
	}
	else
	{
		$('body').append('<div class="overlay-for-progress"></div><div class="progress-loading"></div>');
		$('.overlay-for-progress').fadeTo('normal',0.5);
	}
}