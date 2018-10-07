// need jQuery

jQuery(function($){
	$(document).on('submit','.ws_form',function(event){
		event.preventDefault();

		var nonempty       = $(this).attr('nonempty');
		var callback       = $(this).attr('callback');
		var error_callback = $(this).attr('error_callback');
		var send_data      = $(this).serializeJson();

		if(typeof(nonempty) != 'undefined')
		{
			nonempty = nonempty.split(',');

			for(var i in nonempty)
			{
				if(typeof(send_data[nonempty[i]]) == 'undefined' || send_data[nonempty[i]] == '')
				{
					label = $(this).find('[name='+nonempty[i]+']').eq(0).attr('label') || '发送内容';

					alert(label + '不能为空！',-1);

					return false;
				}
			}
		}

		ws_send(send_data,function(data){
			if(typeof(eval(callback)) == 'function')
			{
				eval(callback)(data);
			}
		},function(ws,ws_isok){
			if(typeof(eval(error_callback)) == 'function')
			{
				eval(error_callback)(ws,ws_isok);
			}
			else
			{
				alert('连接已断开！',-1);
			}
		});
	});
})