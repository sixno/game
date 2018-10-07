if(typeof(dotdir) == 'undefined') dotdir = './_dot_templates/';
var dot_templates = new Array();

if(typeof(time) != 'function')
{
	function time()
	{
		return (Date.parse(new Date()) / 1000);
	}
}

function set_var(var_name,var_value)
{
	var obj = $('#'+var_name);

	if(typeof(obj) != 'undefined')
	{
		switch(obj.tagName)
		{
			case 'img':
				obj.attr('src',var_value);
			break;

			case 'input':
			case 'select':
				obj.val(var_value);
			break;

			case 'textarea':
				obj.text(var_value);
			break;

			default:
				obj.html(var_value);
			break;
		}
	}
	else
	{
		console.log('#'+var_name+' is undefined!');
	}
}

function get_var(var_name)
{
	var obj = $('#'+var_name);

	if(typeof(obj) != 'undefined')
	{
		switch(obj.tagName)
		{
			case 'img':
				obj.attr('src');
			break;

			case 'input':
			case 'select':
				obj.val();
			break;

			case 'textarea':
				obj.text();
			break;

			default:
				obj.html();
			break;
		}
	}
	else
	{
		console.log('#'+var_name+' is undefined!');
	}
}

function get_template(template_name)
{
	if(typeof(dot_templates[template_name]) != 'undefined')
	{
		return dot_templates[template_name];
	}
	else
	{
		$.ajax({async:false,type:"GET",url:dotdir+template_name+'.html?time='+time(),success:function(html){
			dot_templates[template_name] = html;
		},error:function(){
			dot_templates[template_name] = false;
		},dataType:'html'});

		return dot_templates[template_name];
	}
}

function put_template(template_name,template_data,target_dom,insert_mode)
{
	var html = get_template(template_name);

	if(html)
	{
		if(typeof(template_data) == 'object')
		{
			html = doT.template(html)(template_data);
		}
		else if(typeof(template_data) == 'string')
		{
			insert_mode = target_dom;
			target_dom = template_data;
		}

		if(typeof(target_dom) != 'undefined')
		{
			switch(insert_mode)
			{
				case 'prepend':
					$(target_dom).prepend(html);
				break;

				case 'append':
					$(target_dom).append(html);
				break;

				default:
					$(target_dom).html(html);
				break;
			}
		}
		else
		{
			return html;
		}
	}
	else
	{
		console.log('template: '+template_name+' is not found!');
	}
}