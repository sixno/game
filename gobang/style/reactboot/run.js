evalJSX.globalNs = 'React';

var reactinis = {bootfiles: {},callbacks: {},app_base: 'style/reactboot/class',com_path: 'style/app/com/'};

function reactboot(url, callback){
	if(typeof(url) == 'function')
	{
		callback = url;

		url = [];
	}

	if(url && typeof(url) == 'string')
	{
		url = url.split(',');
	}

	callback = callback.toString();
	callback = callback.substring(callback.indexOf('{')+1,callback.lastIndexOf('}'));

	var win_callback = callback.match(/class (.*?) extends/);;

	var new_callback = new Function(callback + (win_callback ? 'window.' + win_callback[1] + '=' + win_callback[1] + ';' : ''));

	if(url.length > 0)
	{
		var script = null;

		reactinis.callbacks[url.join(',')] = function(){
			new_callback();
		};

		for(var i in url)
		{
			if(typeof(reactinis.bootfiles[url[i]]) == 'undefined')
			{
				script = null;

				reactinis.bootfiles[url[i]] = false;

				script = document.createElement("script");

				script.type = "text/javascript";

				// if(script.readyState)
				// { // IE
				// 	script.onreadystatechange = function(e){
				// 		if(script.readyState == "loaded" || script.readyState == "complete")
				// 		{
				// 			script.onreadystatechange = null;

				// 			var src = e.target.src;

				// 			if(src.indexOf(reactinis.com_path) != -1)
				// 			{
				// 				src = src.substr(src.indexOf(reactinis.com_path) + reactinis.com_path.length);
				// 			}
				// 			else
				// 			{
				// 				src = src.substr(src.indexOf(reactinis.app_base) + reactinis.app_base.length);
				// 			}

				// 			reactboot_fileloaded(src.substr(0, src.length - 3), e.target);
				// 		}
				// 	};
				// }
				// else
				// { // FF, Chrome, Opera, ...
					script.onload = function(e){
						var src = e.target.src;

						if(src.indexOf(reactinis.com_path) != -1)
						{
							src = src.substr(src.indexOf(reactinis.com_path) + reactinis.com_path.length);
						}
						else
						{
							src = src.substr(src.indexOf(reactinis.app_base) + reactinis.app_base.length);
						}

						reactboot_fileloaded(src.substr(0, src.length - 3), e.target);
					};
				// }

				script.src = (url[i].substr(0,1) == '/' ? reactinis.app_base : reactinis.com_path) + url[i] + '.js';

				document.getElementsByTagName("head")[0].appendChild(script);
			}
			else
			{
				reactboot_fileloaded(url[i]);
			}
		}
	}
	else
	{
		new_callback();
	}
}

function reactboot_fileloaded(url, script)
{
	var file = [];
	var call = '';
	var goon = true;

	var callback_keys = Object.keys(reactinis.callbacks);

	reactinis.bootfiles[url] = true;

	if(script) document.getElementsByTagName("head")[0].removeChild(script);

	while(callback_keys.length > 0)
	{
		call = callback_keys.pop();

		file = call.split(',');

		for(var i in file)
		{
			if(!reactinis.bootfiles[file[i]])
			{
				goon = false;

				break;
			}
		}

		if(goon)
		{
			if(reactinis.callbacks[call])
			{
				reactinis.callbacks[call]();

				delete reactinis.callbacks[call];
			}
		}
		else
		{
			break;
		}
	}
}