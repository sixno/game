client = new tcpcall({akey:'10002357',ukey:'',sign:'4b7562719c00ba09b2521e68f1781440'});

client.on('info',function(data){
	switch(data.code)
	{
		case 'auth':
			// client.send({type: 'join',room: '123'});
			client.send({to: 'kefu',type: 'text',wrap: '你好'});
			break;

		case 'come':
			break;
	}

	if(typeof(data.wrap.client_num) != 'undefined')
	{
		$('.current_online_num').html(data.wrap.client_num);
	}

	// console.log(data);
});

client.on('text',function(data){
	// console.log(data);
});

client.connect();