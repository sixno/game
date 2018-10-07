(function(){
	function tcpcall(conf)
	{
		if(typeof(conf) != 'object') conf = {};

		var sock = {};
		var ping = false;
		var auth = false;
		var host = conf.host || 'ws://118.31.4.68:50080';
		var akey = conf.akey || '';
		var ukey = conf.ukey || '';
		var sign = conf.sign || '';
		var secs = conf.secs || 0;
		var func = {};

		var time = function()
		{
			return (Date.parse(new Date()) / 1000) + secs;
		}

		var send = function(data)
		{
			if(sock.readyState == 1)
			{
				sock.send(JSON.stringify(data));
			}
			else
			{
				console.log('WebSocket is not good, then it is going to close.');

				if(ping !== false)
				{
					clearInterval(ping);

					ping = false;
				}
			}
		}; this.send = send;

		var connect = function(){
			sock = new WebSocket(host);

			sock.onopen = function(){
				send({type:'auth',akey:akey,ukey:ukey,sign:sign,time:time()});

				if(ping === false)
				{
					ping = setInterval(function(){
						send({type:'ping'});
					},10000);
				}
			};

			sock.onmessage = function(event){
				var data = JSON.parse(event.data);

				if(typeof(func[data.type]) == 'function')
				{
					func[data.type](data);
				}
				else if(typeof(func[':message']) == 'function')
				{
					func[':message'](data);
				}
			}

			sock.onclose = function(){
				if(auth)
				{
					connect();

					if(typeof(func[':close']) == 'function')
					{
						func[':close'](data);
					}
				}
			}

			sock.onerror = function(event){
				console.log(event);
			}
		}; this.connect = connect;

		var on = function(name,callback)
		{
			func[name] = callback;
		}; this.on = on;

		var off = function()
		{
			auth = false;
			sock.close();
		}; this.off = off;

		return this;
	}

	window.tcpcall = tcpcall;
})();