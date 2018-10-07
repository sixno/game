function function_exists(funcName)
{
	try
	{
		if(typeof(eval(funcName)) == "function")
		{
			return true;
		}
	}
	catch(e)
	{
		 return false;
	}
}

function time()
{
	return (Date.parse(new Date()) / 1000);
}

function date(format,time)
{
	var format = format || "yyyy-MM-dd hh:mm:ss";
	var time = time || "";

	if(time == "")
	{
		var date = new Date();
	}
	else
	{
		var date = new Date(time * 1000);
	}

	var o = {
		"M+" : date.getMonth()+1, //month
		"d+" : date.getDate(), //day
		"h+" : date.getHours(), //hour
		"m+" : date.getMinutes(), //minute
		"s+" : date.getSeconds(), //second
		"q+" : Math.floor((date.getMonth()+3)/3), //quarter
		"S" : date.getMilliseconds() //millisecond
	}

	if(/(y+)/.test(format))
	{
		format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	}

	for(var k in o)
	{
		if(new RegExp("("+ k +")").test(format))
		{
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}

	return format;
}

function redirect(url)
{
	if(/MSIE (\d+\.\d+);/.test(navigator.userAgent) || /MSIE(\d+\.\d+);/.test(navigator.userAgent))
	{
		var referLink = document.createElement("a");
		referLink.href = url;
		document.body.appendChild(referLink);
		setTimeout(function(){referLink.click()},1000);
	}
	else
	{
		window.location.href = url;
	}
}

function set_cookie(name,value,time,path)
{
	var cookie_str = name + "=" + encodeURIComponent(value) + ";";

	time = time || 0;
	if(time > 0)
	{
		var exp = new Date();
		exp.setTime(exp.getTime() + time*1);

		cookie_str += "expires=" + exp.toGMTString() + ";";
	}

	path = path || "/";
	cookie_str += "path="+path+";";

	document.cookie = cookie_str;
}

function cookie(name)
{
	var arrstr = document.cookie.split("; ");

	for(var i = 0;i < arrstr.length;i++)
	{
		var temp = arrstr[i].split("=");

		if(temp[0] == name)
		{
			return decodeURIComponent(temp[1]);
		}
	}

	return "";
}

function unset_cookie(name,path)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = cookie(name);
	if(cval != null)
	{
		path = path || "/";

		document.cookie = name+"="+cval+";expires="+exp.toGMTString()+";path="+path+";";
	}
}

function str2obj(str)
{
	var json = eval("(" + str + ")");

	return json;
} 

function obj2str(obj)
{
	var S = [];

	for(var i in obj)
	{
		obj[i] = typeof obj[i] == 'string'?'"'+obj[i]+'"':(typeof obj[i] == 'object'?json2str(obj[i]):obj[i]);
		S.push(i+':'+obj[i]);
	}

	return '{'+S.join(',')+'}';
}

function objforce(obj_str)
{
	if(typeof(obj_str) == 'object')
	{
		return obj_str;
	}
	else
	{
		return eval('('+obj_str+')');
	}
}

function str_rand(len)
{
	len = len || 6;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';//oOLl9gqVvUuI1
	var maxPos = chars.length;
	var pwd = '';
	for(i = 0; i < len; i++)
	{
		pwd += chars.charAt(Math.floor(Math.random()*maxPos));
	}
	return pwd;
}

function rand_str(string,delimiter)
{
	var string = string || '';
	var delimiter = delimiter || '|';

	var array = string.split(delimiter);
	var arlen = array.length;

	return array[Math.floor(Math.random()*arlen)];
}

function djs(url,callback)
{
	if(typeof(url) == 'function')
	{
		callback = url;
		url = appini;
	}
	else
	{
		url = url || appini;
	}

	if(!Boolean(url)) return false;

	url = (url.indexOf('?') > 0) ? (url + '&time=' + time()) : (url + '?time=' + time());

	var head = document.getElementsByTagName('head')[0];
	var scrp = document.createElement('script');

	scrp.setAttribute('type','text/javascript');
	scrp.setAttribute('src',url);
	head.appendChild(scrp);

	if(typeof(callback) == 'function')
	{
		scrp.onload = scrp.onreadystatechange = function()
		{
			if(!this.readyState || this.readyState == 'loaded' || this.readyState=='complete')
			{
				callback();
			}
		}
	}
	else
	{
		return scrp;
	}

	return true;
}