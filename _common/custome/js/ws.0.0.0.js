// need function time()
// need function djs()
// all above can be found in common.js

var ws = false;

var ws_isok = false;
var ws_acck = '';
var ws_seck = '';
var ws_time = time();
var ws_tmid = false;

window.onload = function()
{
	djs(function(){
		ws_work();
	});
}

function ws_work()
{
	if(typeof(wshost) == 'undefined') return false;

	ws = new WebSocket(wshost);
	ws_isok = false;

	ws.onopen = function(){
		if(ws_tmid != false)
		{
			window.clearInterval(ws_tmid);

			ws_tmid = false;
		}

		var timego = (time() - ws_time) / 3600 / 24;

		if(timego < 7)
		{
			ws.send(JSON.stringify({'type':'visa','acck':ws_acck,'seck':ws_seck}));

			if(timego >= 6)
			{
				ws_time = time();

				djs();
			}
		}
		else
		{
			ws_time = time();

			djs(function(){
				ws.send(JSON.stringify({'type':'visa','acck':ws_acck,'seck':ws_seck}));
			});
		}
	};

	ws.onmessage = function(e){
		console.log('receive: ' + e.data);

		var data = JSON.parse(e.data);

		switch(data['type'])
		{
			case 'ping':
				ws.send(JSON.stringify({'type':'pong'}));

				if(ws_isok == false && typeof(data['time']) == 'string')
				{
					ws_isok = true;

					if(typeof(ws_open) == 'function') ws_open(data['time']);
				}
				break;

			default:
				if(function_exists('ws_callback_'+data['type']))
				{
					eval('ws_callback_'+data['type'])(data);
				}
				break;
		}
	};

	ws.onclose = function(e){
		if(typeof(ws_onclose_callback) != 'function')
		{
			ws_reconnect();
		}
		else
		{
			ws_onclose_callback(e);
		}
	};

	ws.onerror = function(e){
		if(typeof(ws_onerror_callback) != 'function')
		{
			ws_close();
		}
		else
		{
			ws_onerror_callback(e);
		}
	};
}

function ws_send(data,callback,error_callback)
{
	if((ws != false) && ws_isok)
	{
		console.log('send: '+JSON.stringify(data));

		ws.send(JSON.stringify(data));

		if(typeof(callback) == 'function')
		{
			callback(data);
		}
	}
	else
	{
		if(typeof(error_callback) == 'function')
		{
			error_callback(ws,ws_isok);
		}
	}
}

function ws_close()
{
	ws.close();

	ws = false;
	ws_isok = false;
}

function ws_reconnect()
{
	ws = false;
	ws_isok = false;

	if(ws_tmid != false)
	{
		window.clearInterval(ws_tmid);

		ws_tmid = false;
	}

	ws_tmid = window.setInterval(ws_work,3000);
}