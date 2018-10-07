var _svg = null;
var _sto = null;

var cell_select   = null;
var cell_selected = null;

jQuery(function($){
	load_board();
});

function in_array(search,array)
{
	for(var i in array)
	{
		if(array[i] == search)
		{
			return true;
		}
	}

	return false;
}

function load_board()
{
	_svg = document.getElementById('board').getSVGDocument();

	if(_svg == null)
	{
		_sto = setTimeout('load_board()',100);
	}
	else
	{
		clearTimeout(_sto);

		if(!_svg.rootElement)
		{
			alert('Sorry, your browser is so terrible, please use chrome and do not use it again.（推荐使用谷歌浏览器）');

			return false;
		}

		init_board();
	}
}

function init_board()
{
	var cell = null;
	var _img = '';

	cell_select = _svg.createElementNS('http://www.w3.org/2000/svg','image');

	cell_select.href.baseVal = '_now.gif';
	cell_select.setAttribute('style','width:60px;height:60px;');

	cell_select.addEventListener('mouseleave',function(){
		_svg.rootElement.removeChild(cell_select);

		cell_select_onboard = false;
	});

	cell_select.addEventListener('click',function(){
		play_chess($(this).attr('x'),$(this).attr('y'));
	});

	cell_selected = _svg.createElementNS('http://www.w3.org/2000/svg','image');

	cell_selected.href.baseVal = '_red.gif';
	cell_selected.setAttribute('style','width:60px;height:60px;');

	for(var iy = 0;iy < 15;iy++)
	{
		for(var ix = 0;ix < 15;ix++)
		{
			_img = 'cc.gif';

			switch(ix+','+iy)
			{
				case '0,0':   _img = 'lt.gif'; break;
				case '0,14':  _img = 'lb.gif'; break;
				case '14,0':  _img = 'rt.gif'; break;
				case '14,14': _img = 'rb.gif'; break;
				
				case '3,3':
				case '3,11':
				case '7,7':
				case '11,3':
				case '11,11': _img = 'cc.png'; break;
				
				default:
					if(ix == 0)  _img = 'll.gif';
					if(ix == 14) _img = 'rr.gif';
					if(iy == 0)  _img = 'tt.gif';
					if(iy == 14) _img = 'bb.gif';
					break;
			}

			cell = _svg.createElementNS('http://www.w3.org/2000/svg','image');

			cell.href.baseVal = _img;
			cell.setAttribute('x',ix*60);
			cell.setAttribute('y',iy*60);
			cell.setAttribute('style','width:60px;height:60px;');

			cell.addEventListener('mouseenter',function(){
				load_cell_select($(this).attr('x'),$(this).attr('y'));
			});

			_svg.rootElement.appendChild(cell);
		}
	}
};

function load_chess(color,ix,iy,is)
{
	if(typeof(is) == 'undefined') is = true;

	var chess = _svg.createElementNS('http://www.w3.org/2000/svg','image');

	chess.href.baseVal = '_chess_'+color+'.png';

	if(is)
	{
		var x = ix * 60;
		var y = iy * 60;
	}
	else
	{
		var x = ix;
		var y = iy;
	}

	chess.setAttribute('x',x);
	chess.setAttribute('y',y);
	chess.setAttribute('style','width:60px;height:60px;');

	_svg.rootElement.appendChild(chess);

	load_cell_selected(x,y);
}

var cell_select_onboard = false;

function load_cell_select(x,y)
{
	cell_select.setAttribute('x',x);
	cell_select.setAttribute('y',y);

	if(!cell_select_onboard)
	{
		cell_select_onboard = true;

		_svg.rootElement.appendChild(cell_select);
	}
}

var cell_selected_onboard = false;

function load_cell_selected(x,y)
{
	cell_selected.setAttribute('x',x);
	cell_selected.setAttribute('y',y);

	if(cell_select_onboard)
	{
		_svg.rootElement.removeChild(cell_select);

		cell_select_onboard = false;
	}

	if(!cell_selected_onboard)
	{
		cell_selected_onboard = true;

		_svg.rootElement.appendChild(cell_selected);
	}
}

var chess_close = false;
var chess_color = '';

function play_chess(x,y)
{
	if(chess_color == '') chess_color = 'black';

	if(chess_close)
	{
		if(chess_close == 'black')
		{
			alert('黑棋赢了！');
		}
		else
		{
			alert('白棋赢了！');
		}

		return false;
	}

	load_chess(chess_color,x,y,false);

	board_grade(chess_color,x/60,y/60);

	if(is_win(chess_color,x/60,y/60))
	{
		setTimeout(function(){
			if(chess_color == 'black')
			{
				alert('黑棋赢了！');
			}
			else
			{
				alert('白棋赢了！');
			}
		},100);
	}
	else
	{
		if(chess_color == 'black')
		{
			// chess_color = 'white';
			ai_play('white');
		}
		else
		{
			// chess_color = 'black';
			ai_play('black');
		}
	}

	return true;
}

function ai_play(color)
{
	if(chess_color == '')
	{
		chess_color = color == 'black' ? 'white' : 'black';
	}

	if(chess_close)
	{
		if(chess_close == 'black')
		{
			alert('黑棋赢了！');
		}
		else
		{
			alert('白棋赢了！');
		}

		return false;
	}

	var xy = board_guide(color);

	xy = xy.split(',');

	load_chess(color,Number(xy[0]),Number(xy[1]));

	board_grade(color,Number(xy[0]),Number(xy[1]));

	if(is_win(color,Number(xy[0]),Number(xy[1])))
	{
		setTimeout(function(){
			if(color == 'black')
			{
				alert('黑棋赢了！');
			}
			else
			{
				alert('白棋赢了！');
			}
		},100);
	}

	return true;
}

var chess_board = {};
var white_board = {};
var black_board = {};
var white_three = []; // 白活三两端
var black_three = []; // 黑活三两端
var white_final = []; // 白成五一步
var black_final = []; // 黑成五一步
var white_alive = []; // 白优先活子
var black_alive = []; // 黑优先活子

// 两重九宫格打分法，反映的是活路棋子的能量密度，即周边十六点空间分布特征

function board_grade(color,ix,iy)
{
	if(typeof(color) == 'undefined')
	{
		for(var gy = 0;gy < 15;gy++)
		{
			for(var gx = 0;gx < 15;gx++)
			{
				if(gx == 7 && gy == 7)
				{
					white_board[gx+','+gy] = 13;
					black_board[gx+','+gy] = 13;
				}
				else if(gx > 1 && gx < 13 && gy > 1 && gy < 13)
				{
					white_board[gx+','+gy] = 8;
					black_board[gx+','+gy] = 8;
				}
				else if(gx < 2 && gy > 1 && gy < 13)
				{
					white_board[gx+','+gy] = 5;
					black_board[gx+','+gy] = 5;
				}
				else if(gx > 12 && gy > 1 && gy < 13)
				{
					white_board[gx+','+gy] = 5;
					black_board[gx+','+gy] = 5;
				}
				else if(gy < 2 && gx > 1 && gx < 13)
				{
					white_board[gx+','+gy] = 5;
					black_board[gx+','+gy] = 5;
				}
				else if(gy > 12 && gx > 1 && gx < 13)
				{
					white_board[gx+','+gy] = 5;
					black_board[gx+','+gy] = 5;
				}
				else
				{
					white_board[gx+','+gy] = 3;
					black_board[gx+','+gy] = 3;
				}
			}
		}
	}
	else
	{
		chess_board[ix+','+iy] = color;
		white_board[ix+','+iy] = 0;
		black_board[ix+','+iy] = 0;

		var dx_min = 0;
		var dx_max = 0;
		var dy_min = 0;
		var dy_max = 0;

		var white_1212 = 0;
		var white_1203 = 0;
		var white_0303 = 0;
		var white_0306 = 0;
		var white_0606 = 0;
		var white_0609 = 0;
		var white_0909 = 0;
		var white_0912 = 0;

		var black_1212 = 0;
		var black_1203 = 0;
		var black_0303 = 0;
		var black_0306 = 0;
		var black_0606 = 0;
		var black_0609 = 0;
		var black_0909 = 0;
		var black_0912 = 0;

		var fuck_jssss = '';

		if(ix - 1 >= 0) dx_min = -1;
		if(ix - 2 >= 0) dx_min = -2;
		if(ix + 1 < 15) dx_max = 1;
		if(ix + 2 < 15) dx_max = 2;
		if(iy - 1 >= 0) dy_min = -1;
		if(iy - 2 >= 0) dy_min = -2;
		if(iy + 1 < 15) dy_max = 1;
		if(iy + 2 < 15) dy_max = 2;

		for(var gy = iy + dy_min;gy <= iy + dy_max;gy++)
		{
			for(var gx = ix + dx_min;gx <= ix + dx_max;gx++)
			{
				if(gx == ix && gy == iy) continue;

				if(Math.abs(gx - ix) == 2 && Math.abs(gy - iy) == 1) continue;
				if(Math.abs(gy - iy) == 2 && Math.abs(gx - ix) == 1) continue;

				if(typeof(chess_board[gx+','+gy]) != 'undefined') continue;

				white_1212 = 0;
				white_1203 = 0;
				white_0303 = 0;
				white_0306 = 0;
				white_0606 = 0;
				white_0609 = 0;
				white_0909 = 0;
				white_0912 = 0;

				black_1212 = 0;
				black_1203 = 0;
				black_0303 = 0;
				black_0306 = 0;
				black_0606 = 0;
				black_0609 = 0;
				black_0909 = 0;
				black_0912 = 0;

				// 1212

				if(typeof(chess_board[gx+','+(gy-1)]) == 'undefined')
				{
					if(gy-1 >= 0)
					{
						if(typeof(chess_board[gx+','+(gy-2)]) == 'undefined')
						{
							if(gy-2 >= 0)
							{
								white_1212 = 2;
								black_1212 = 2;
							}
							else
							{
								white_1212 = 1;
								black_1212 = 1;
							}
						}
						else
						{
							if(chess_board[gx+','+(gy-2)] == 'white')
							{
								white_1212 = 3;
							}
							else
							{
								black_1212 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[gx+','+(gy-1)] == 'white')
					{
						white_1212 = 4;
					}
					else
					{
						black_1212 = 4;
					}

					if(typeof(chess_board[gx+','+(gy-2)]) != 'undefined')
					{
						if(chess_board[gx+','+(gy-2)] == 'white')
						{
							white_1212 = white_1212 == 4 ? 5 : 1;
						}
						else
						{
							black_1212 = black_1212 == 4 ? 5 : 1;
						}

						if(white_1212 == 5)
						{
							if(gy-3 >= 0)
							{
								if(typeof(chess_board[gx+','+(gy-3)]) == 'undefined')
								{
									white_1212 = 6;
								}
								else if(chess_board[gx+','+(gy-3)] == 'white')
								{
									white_1212 = 7;
								}
							}
						}

						if(black_1212 == 5)
						{
							if(gy-3 >= 0)
							{
								if(typeof(chess_board[gx+','+(gy-3)]) == 'undefined')
								{
									black_1212 = 6;
								}
								else if(chess_board[gx+','+(gy-3)] == 'black')
								{
									black_1212 = 7;
								}
							}
						}
					}
				}

				// 1203

				if(typeof(chess_board[(gx+1)+','+(gy-1)]) == 'undefined')
				{
					if(gx+1 < 15 && gy-1 >= 0)
					{
						if(typeof(chess_board[(gx+2)+','+(gy-2)]) == 'undefined')
						{
							if(gx+2 < 15 && gy-2 >= 0)
							{
								white_1203 = 2;
								black_1203 = 2;
							}
							else
							{
								white_1203 = 1;
								black_1203 = 1;
							}
						}
						else
						{
							if(chess_board[(gx+2)+','+(gy-2)] == 'white')
							{
								white_1203 = 3;
							}
							else
							{
								black_1203 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[(gx+1)+','+(gy-1)] == 'white')
					{
						white_1203 = 4;
					}
					else
					{
						black_1203 = 4;
					}

					if(typeof(chess_board[(gx+2)+','+(gy-2)]) != 'undefined')
					{
						if(chess_board[(gx+2)+','+(gy-2)] == 'white')
						{
							white_1203 = white_1203 == 4 ? 5 : 1;
						}
						else
						{
							black_1203 = black_1203 == 4 ? 5 : 1;
						}

						if(white_1203 == 5)
						{
							if(gx+3 < 15 && gy-3 >= 0)
							{
								if(typeof(chess_board[(gx+3)+','+(gy-3)]) == 'undefined')
								{
									white_1203 = 6;
								}
								else if(chess_board[(gx+3)+','+(gy-3)] == 'white')
								{
									white_1203 = 7;
								}
							}
						}

						if(black_1203 == 5)
						{
							if(gx+3 < 15 && gy-3 >= 0)
							{
								if(typeof(chess_board[(gx+3)+','+(gy-3)]) == 'undefined')
								{
									black_1203 = 6;
								}
								else if(chess_board[(gx+3)+','+(gy-3)] == 'black')
								{
									black_1203 = 7;
								}
							}
						}
					}
				}

				// 0303

				if(typeof(chess_board[(gx+1)+','+gy]) == 'undefined')
				{
					if(gx+1 < 15)
					{
						if(typeof(chess_board[(gx+2)+','+gy]) == 'undefined')
						{
							if(gx+2 < 15)
							{
								white_0303 = 2;
								black_0303 = 2;
							}
							else
							{
								white_0303 = 1;
								black_0303 = 1;
							}
						}
						else
						{
							if(chess_board[(gx+2)+','+gy] == 'white')
							{
								white_0303 = 3;
							}
							else
							{
								black_0303 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[(gx+1)+','+gy] == 'white')
					{
						white_0303 = 4;
					}
					else
					{
						black_0303 = 4;
					}

					if(typeof(chess_board[(gx+2)+','+gy]) != 'undefined')
					{
						if(chess_board[(gx+2)+','+gy] == 'white')
						{
							white_0303 = white_0303 == 4 ? 5 : 1;
						}
						else
						{
							black_0303 = black_0303 == 4 ? 5 : 1;
						}

						if(white_0303 == 5)
						{
							if(gx+3 < 15)
							{
								if(typeof(chess_board[(gx+3)+','+gy]) == 'undefined')
								{
									white_0303 = 6;
								}
								else if(chess_board[(gx+3)+','+gy] == 'white')
								{
									white_0303 = 7;
								}
							}
						}

						if(black_0303 == 5)
						{
							if(gx+3 < 15)
							{
								if(typeof(chess_board[(gx+3)+','+gy]) == 'undefined')
								{
									black_0303 = 6;
								}
								else if(chess_board[(gx+3)+','+gy] == 'black')
								{
									black_0303 = 7;
								}
							}
						}
					}
				}

				// 0306

				if(typeof(chess_board[(gx+1)+','+(gy+1)]) == 'undefined')
				{
					if(gx+1 < 15 && gy+1 < 15)
					{
						if(typeof(chess_board[(gx+2)+','+(gy+2)]) == 'undefined')
						{
							if(gx+2 < 15 && gy+2 < 15)
							{
								white_0306 = 2;
								black_0306 = 2;
							}
							else
							{
								white_0306 = 1;
								black_0306 = 1;
							}
						}
						else
						{
							if(chess_board[(gx+2)+','+(gy+2)] == 'white')
							{
								white_0306 = 3;
							}
							else
							{
								black_0306 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[(gx+1)+','+(gy+1)] == 'white')
					{
						white_0306 = 4;
					}
					else
					{
						black_0306 = 4;
					}

					if(typeof(chess_board[(gx+2)+','+(gy+2)]) != 'undefined')
					{
						if(chess_board[(gx+2)+','+(gy+2)] == 'white')
						{
							white_0306 = white_0306 == 4 ? 5 : 1;
						}
						else
						{
							black_0306 = black_0306 == 4 ? 5 : 1;
						}

						if(white_0306 == 5)
						{
							if(gx+3 < 15 && gy+3 < 15)
							{
								if(typeof(chess_board[(gx+3)+','+(gy+3)]) == 'undefined')
								{
									white_0306 = 6;
								}
								else if(chess_board[(gx+3)+','+(gy+3)] == 'white')
								{
									white_0306 = 7;
								}
							}
						}

						if(black_0306 == 5)
						{
							if(gx+3 < 15 && gy+3 < 15)
							{
								if(typeof(chess_board[(gx+3)+','+(gy+3)]) == 'undefined')
								{
									black_0306 = 6;
								}
								else if(chess_board[(gx+3)+','+(gy+3)] == 'black')
								{
									black_0306 = 7;
								}
							}
						}
					}
				}

				// 0606

				if(typeof(chess_board[gx+','+(gy+1)]) == 'undefined')
				{
					if(gy+1 < 15)
					{
						if(typeof(chess_board[gx+','+(gy+2)]) == 'undefined')
						{
							if(gy+2 < 15)
							{
								white_0606 = 2;
								black_0606 = 2;
							}
							else
							{
								white_0606 = 1;
								black_0606 = 1;
							}
						}
						else
						{
							if(chess_board[gx+','+(gy+2)] == 'white')
							{
								white_0606 = 3;
							}
							else
							{
								black_0606 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[gx+','+(gy+1)] == 'white')
					{
						white_0606 = 4;
					}
					else
					{
						black_0606 = 4;
					}

					if(typeof(chess_board[gx+','+(gy+2)]) != 'undefined')
					{
						if(chess_board[gx+','+(gy+2)] == 'white')
						{
							white_0606 = white_0606 == 4 ? 5 : 1;
						}
						else
						{
							black_0606 = black_0606 == 4 ? 5 : 1;
						}

						if(white_0606 == 5)
						{
							if(gy+3 < 15)
							{
								if(typeof(chess_board[gx+','+(gy+3)]) == 'undefined')
								{
									white_0606 = 6;
								}
								else if(chess_board[gx+','+(gy+3)] == 'white')
								{
									white_0606 = 7;
								}
							}
						}

						if(black_0606 == 5)
						{
							if(gy+3 < 15)
							{
								if(typeof(chess_board[gx+','+(gy+3)]) == 'undefined')
								{
									black_0606 = 6;
								}
								else if(chess_board[gx+','+(gy+3)] == 'black')
								{
									black_0606 = 7;
								}
							}
						}
					}
				}

				// 0609

				if(typeof(chess_board[(gx-1)+','+(gy+1)]) == 'undefined')
				{
					if(gx-1 >= 0 && gy+1 < 15)
					{
						if(typeof(chess_board[(gx-2)+','+(gy+2)]) == 'undefined')
						{
							if(gx-2 >= 0 && gy+2 < 15)
							{
								white_0609 = 2;
								black_0609 = 2;
							}
							else
							{
								white_0609 = 1;
								black_0609 = 1;
							}
						}
						else
						{
							if(chess_board[(gx-2)+','+(gy+2)] == 'white')
							{
								white_0609 = 3;
							}
							else
							{
								black_0609 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[(gx-1)+','+(gy+1)] == 'white')
					{
						white_0609 = 4;
					}
					else
					{
						black_0609 = 4;
					}

					if(typeof(chess_board[(gx-2)+','+(gy+2)]) != 'undefined')
					{
						if(chess_board[(gx-2)+','+(gy+2)] == 'white')
						{
							white_0609 = white_0609 == 4 ? 5 : 1;
						}
						else
						{
							black_0609 = black_0609 == 4 ? 5 : 1;
						}

						if(white_0609 == 5)
						{
							if(gx-3 >= 0 && gy+3 < 15)
							{
								if(typeof(chess_board[(gx-3)+','+(gy+3)]) == 'undefined')
								{
									white_0609 = 6;
								}
								else if(chess_board[(gx-3)+','+(gy+3)] == 'white')
								{
									white_0609 = 7;
								}
							}
						}

						if(black_0609 == 5)
						{
							if(gx-3 >= 0 && gy+3 < 15)
							{
								if(typeof(chess_board[(gx-3)+','+(gy+3)]) == 'undefined')
								{
									black_0609 = 6;
								}
								else if(chess_board[(gx-3)+','+(gy+3)] == 'black')
								{
									black_0609 = 7;
								}
							}
						}
					}
				}

				// 0909

				if(typeof(chess_board[(gx-1)+','+gy]) == 'undefined')
				{
					if(gx-1 >= 0)
					{
						if(typeof(chess_board[(gx-2)+','+gy]) == 'undefined')
						{
							if(gx-2 >= 0)
							{
								white_0909 = 2;
								black_0909 = 2;
							}
							else
							{
								white_0909 = 1;
								black_0909 = 1;
							}
						}
						else
						{
							if(chess_board[(gx-2)+','+gy] == 'white')
							{
								white_0909 = 3;
							}
							else
							{
								black_0909 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[(gx-1)+','+gy] == 'white')
					{
						white_0909 = 4;
					}
					else
					{
						black_0909 = 4;
					}

					if(typeof(chess_board[(gx-2)+','+gy]) != 'undefined')
					{
						if(chess_board[(gx-2)+','+gy] == 'white')
						{
							white_0909 = white_0909 == 4 ? 5 : 1;
						}
						else
						{
							black_0909 = black_0909 == 4 ? 5 : 1;
						}

						if(white_0909 == 5)
						{
							if(gx-3 >= 0)
							{
								if(typeof(chess_board[(gx-3)+','+gy]) == 'undefined')
								{
									white_0909 = 6;
								}
								else if(chess_board[(gx-3)+','+gy] == 'white')
								{
									white_0909 = 7;
								}
							}
						}

						if(black_0909 == 5)
						{
							if(gx-3 >= 0)
							{
								if(typeof(chess_board[(gx-3)+','+gy]) == 'undefined')
								{
									black_0909 = 6;
								}
								else if(chess_board[(gx-3)+','+gy] == 'black')
								{
									black_0909 = 7;
								}
							}
						}
					}
				}

				// 0912

				if(typeof(chess_board[(gx-1)+','+(gy-1)]) == 'undefined')
				{
					if(gx-1 >= 0 && gy-1 >= 0)
					{
						if(typeof(chess_board[(gx-2)+','+(gy-2)]) == 'undefined')
						{
							if(gx-2 >= 0 && gy-2 >= 0)
							{
								white_0912 = 2;
								black_0912 = 2;
							}
							else
							{
								white_0912 = 1;
								black_0912 = 1;
							}
						}
						else
						{
							if(chess_board[(gx-2)+','+(gy-2)] == 'white')
							{
								white_0912 = 3;
							}
							else
							{
								black_0912 = 3;
							}
						}
					}
				}
				else
				{
					if(chess_board[(gx-1)+','+(gy-1)] == 'white')
					{
						white_0912 = 4;
					}
					else
					{
						black_0912 = 4;
					}

					if(typeof(chess_board[(gx-2)+','+(gy-2)]) != 'undefined')
					{
						if(chess_board[(gx-2)+','+(gy-2)] == 'white')
						{
							white_0912 = white_0912 == 4 ? 5 : 1;
						}
						else
						{
							black_0912 = black_0912 == 4 ? 5 : 1;
						}

						if(white_0912 == 5)
						{
							if(gx-3 >= 0 && gy-3 >= 0)
							{
								if(typeof(chess_board[(gx-3)+','+(gy-3)]) == 'undefined')
								{
									white_0912 = 6;
								}
								else if(chess_board[(gx-3)+','+(gy-3)] == 'white')
								{
									white_0912 = 7;
								}
							}
						}

						if(black_0912 == 5)
						{
							if(gx-3 >= 0 && gy-3 >= 0)
							{
								if(typeof(chess_board[(gx-3)+','+(gy-3)]) == 'undefined')
								{
									black_0912 = 6;
								}
								else if(chess_board[(gx-3)+','+(gy-3)] == 'black')
								{
									black_0912 = 7;
								}
							}
						}
					}
				}

				// summary

				// console.log(gx+','+gy+':summary:white_1212:'+white_1212);
				// console.log(gx+','+gy+':summary:white_1203:'+white_1203);
				// console.log(gx+','+gy+':summary:white_0303:'+white_0303);
				// console.log(gx+','+gy+':summary:white_0306:'+white_0306);
				// console.log(gx+','+gy+':summary:white_0606:'+white_0606);
				// console.log(gx+','+gy+':summary:white_0609:'+white_0609);
				// console.log(gx+','+gy+':summary:white_0909:'+white_0909);
				// console.log(gx+','+gy+':summary:white_0912:'+white_0912);

				// console.log(gx+','+gy+':summary:black_1212:'+black_1212);
				// console.log(gx+','+gy+':summary:black_1203:'+black_1203);
				// console.log(gx+','+gy+':summary:black_0303:'+black_0303);
				// console.log(gx+','+gy+':summary:black_0306:'+black_0306);
				// console.log(gx+','+gy+':summary:black_0606:'+black_0606);
				// console.log(gx+','+gy+':summary:black_0609:'+black_0609);
				// console.log(gx+','+gy+':summary:black_0909:'+black_0909);
				// console.log(gx+','+gy+':summary:black_0912:'+black_0912);

				// normal

				// white_1212 *= white_0606;
				// white_1203 *= white_0609;
				// white_0303 *= white_0909;
				// white_0306 *= white_0912;

				// black_1212 *= black_0606;
				// black_1203 *= black_0609;
				// black_0303 *= black_0909;
				// black_0306 *= black_0912;

				// hard mode ^-^

				// ?@+#++& 1x6=6    x2
				// ?@&#++& 1x6=6    x2
				// ?&&#++& 2x6=12   x4
				// ?&+#+&? 4x4=16   x4
				// ?&+#++x 4x5=20 ? x2
				// ?&+#++& 4x6=24 * final
				// x++#++x 5x5=25 * final
				// x++#++& 5x6=30 * final
				// &++#++& 6x6=36 * final
				// &++#+++ 6x7=42 * final
				// ?@+#+++ 1x7=7  * final
				// ?&+#+++ 4x7=28 * final
				// +++#+++ 7x7=49 * final

				// console.log('switch:white:'+gx+','+gy+':1212-0606:'+(white_1212+white_0606)+','+(white_1212*white_0606));
				// console.log('switch:white:'+gx+','+gy+':1212-0606:'+(white_1203+white_0609)+','+(white_1203*white_0609));
				// console.log('switch:white:'+gx+','+gy+':1212-0606:'+(white_0303+white_0909)+','+(white_0303*white_0909));
				// console.log('switch:white:'+gx+','+gy+':1212-0606:'+(white_0306+white_0912)+','+(white_0306*white_0912));

				// console.log('switch:black:'+gx+','+gy+':1212-0606:'+(black_1212+black_0606)+','+(black_1212*black_0606));
				// console.log('switch:black:'+gx+','+gy+':1212-0606:'+(black_1203+black_0609)+','+(black_1203*black_0609));
				// console.log('switch:black:'+gx+','+gy+':1212-0606:'+(black_0303+black_0909)+','+(black_0303*black_0909));
				// console.log('switch:black:'+gx+','+gy+':1212-0606:'+(black_0306+black_0912)+','+(black_0306*black_0912));

				// 不知道为什么switch处理非常有问题，fuck

				// switch((white_1212+white_0606)+','+(white_1212*white_0606))
				// {
				// 	case '7,6': case '9,20':  white_1212 *= white_0606*2; break;
				// 	case '8,12': case '8,16': white_1212 *= white_0606*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': white_1212 *= white_0606*8; white_final.push(gx+','+gy); break;
				// 	default: white_1212 *= white_0606; break;
				// }
				// switch((white_1203+white_0609)+','+(white_1203+white_0609))
				// {
				// 	case '7,6': case '9,20':  white_1203 *= white_0609*2; break;
				// 	case '8,12': case '8,16': white_1203 *= white_0609*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': white_1203 *= white_0609*8; white_final.push(gx+','+gy); break;
				// 	default: white_1203 *= white_0609; break;
				// }
				// switch((white_0303+white_0909)+','+(white_0303+white_0909))
				// {
				// 	case '7,6': case '9,20':  white_0303 *= white_0909*2; break;
				// 	case '8,12': case '8,16': white_0303 *= white_0909*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': white_0303 *= white_0909*8; white_final.push(gx+','+gy); break;
				// 	default: white_0303 *= white_0909; break;
				// }
				// switch((white_0306+white_0912)+','+(white_0306+white_0912))
				// {
				// 	case '7,6': case '9,20':  white_0306 *= white_0912*2; break;
				// 	case '8,12': case '8,16': white_0306 *= white_0912*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': white_0306 *= white_0912*8; white_final.push(gx+','+gy); break;
				// 	default: white_0306 *= white_0912; break;
				// }

				// switch((black_1212+black_0606)+','+(black_1212*black_0606))
				// {
				// 	case '7,6': case '9,20':  black_1212 *= black_0606*2; break;
				// 	case '8,12': case '8,16': black_1212 *= black_0606*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': black_1212 *= black_0606*8; black_final.push(gx+','+gy); break;
				// 	default: black_1212 *= black_0606; break;
				// }
				// switch((black_1203+black_0609)+','+(black_1203+black_0609))
				// {
				// 	case '7,6': case '9,20':  black_1203 *= black_0609*2; break;
				// 	case '8,12': case '8,16': black_1203 *= black_0609*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': black_1203 *= black_0609*8; black_final.push(gx+','+gy); break;
				// 	default: black_1203 *= black_0609; break;
				// }
				// switch((black_0303+black_0909)+','+(black_0303+black_0909))
				// {
				// 	case '7,6': case '9,20':  black_0303 *= black_0909*2; break;
				// 	case '8,12': case '8,16': black_0303 *= black_0909*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': black_0303 *= black_0909*8; black_final.push(gx+','+gy); break;
				// 	default: black_0303 *= black_0909; break;
				// }
				// switch((black_0306+black_0912)+','+(black_0306+black_0912))
				// {
				// 	case '7,6': case '9,20':  black_0306 *= black_0912*2; break;
				// 	case '8,12': case '8,16': black_0306 *= black_0912*4; break;
				// 	case '10,24': case '10,25': case '11,30': case '12,36': case '13,42': case '8,7': case '11,28': case '14,49': black_0306 *= black_0912*8; black_final.push(gx+','+gy); break;
				// 	default: black_0306 *= black_0912; break;
				// }

				fuck_jssss = (white_1212+white_0606)+','+(white_1212*white_0606);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					white_1212 *= white_0606*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					white_1212 *= white_0606*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					white_1212 *= white_0606*8;
					white_final.push(gx+','+gy);
				}
				else
				{
					white_1212 *= white_0606;
				}
				fuck_jssss = (white_1203+white_0609)+','+(white_1203*white_0609);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					white_1203 *= white_0609*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					white_1203 *= white_0609*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					white_1203 *= white_0609*8;
					white_final.push(gx+','+gy);
				}
				else
				{
					white_1203 *= white_0609;
				}
				fuck_jssss = (white_0303+white_0909)+','+(white_0303*white_0909);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					white_0303 *= white_0909*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					white_0303 *= white_0909*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					white_0303 *= white_0909*8;
					white_final.push(gx+','+gy);
				}
				else
				{
					white_0303 *= white_0909;
				}
				fuck_jssss = (white_0306+white_0912)+','+(white_0306*white_0912);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					white_0306 *= white_0912*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					white_0306 *= white_0912*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					white_0306 *= white_0912*8;
					white_final.push(gx+','+gy);
				}
				else
				{
					white_0306 *= white_0912;
				}

				fuck_jssss = (black_1212+black_0606)+','+(black_1212*black_0606);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					black_1212 *= black_0606*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					black_1212 *= black_0606*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					black_1212 *= black_0606*8;
					black_final.push(gx+','+gy);
				}
				else
				{
					black_1212 *= black_0606;
				}
				fuck_jssss = (black_1203+black_0609)+','+(black_1203*black_0609);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					black_1203 *= black_0609*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					black_1203 *= black_0609*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					black_1203 *= black_0609*8;
					black_final.push(gx+','+gy);
				}
				else
				{
					black_1203 *= black_0609;
				}
				fuck_jssss = (black_0303+black_0909)+','+(black_0303*black_0909);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					black_0303 *= black_0909*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					black_0303 *= black_0909*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					black_0303 *= black_0909*8;
					black_final.push(gx+','+gy);
				}
				else
				{
					black_0303 *= black_0909;
				}
				fuck_jssss = (black_0306+black_0912)+','+(black_0306*black_0912);
				if(in_array(fuck_jssss,['7,6','9,20']))
				{
					black_0306 *= black_0912*2;
				}
				else if(in_array(fuck_jssss,['8,12','8,16']))
				{
					black_0306 *= black_0912*4;
				}
				else if(in_array(fuck_jssss,['10,24','10,25','11,30','12,36','13,42','8,7','11,28','14,49']))
				{
					black_0306 *= black_0912*8;
					black_final.push(gx+','+gy);
				}
				else
				{
					black_0306 *= black_0912;
				}

				// console.log(gx+','+gy+':white_1212:'+white_1212);
				// console.log(gx+','+gy+':white_1203:'+white_1203);
				// console.log(gx+','+gy+':white_0303:'+white_0303);
				// console.log(gx+','+gy+':white_0306:'+white_0306);

				// console.log(gx+','+gy+':black_1212:'+black_1212);
				// console.log(gx+','+gy+':black_1203:'+black_1203);
				// console.log(gx+','+gy+':black_0303:'+black_0303);
				// console.log(gx+','+gy+':black_0306:'+black_0306);

				white_board[gx+','+gy] = white_1212 + white_1203 + white_0303 + white_0306;
				black_board[gx+','+gy] = black_1212 + black_1203 + black_0303 + black_0306;
			}
		}

		// 存储活三冲四以及中成信息，必杀技
		// 以及优先活子情况

		var count = 1;
		var end_0 = '';
		var end_1 = '';

		for(var i = dx_min;i >= -4;i--)
		{
			if(ix+i < 0) break;

			dx_min = i;
		}

		for(var i = dx_max;i <= 4;i++)
		{
			if(ix+i > 14) break;

			dx_max = i;
		}

		for(var i = dy_min;i >= -4;i--)
		{
			if(iy+i < 0) break;

			dy_min = i;
		}

		for(var i = dy_max;i <= 4;i++)
		{
			if(iy+i > 14) break;

			dy_max = i;
		}

		count = 1;
		end_0 = '';
		end_1 = '';

		for(var i = -1;i >= dx_min;i--)
		{
			if(typeof(chess_board[(ix+i)+','+iy]) == 'undefined')
			{
				end_0 = (ix+i)+','+iy;

				break;
			}
			else if(chess_board[(ix+i)+','+iy] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		for(var i = 1;i <= dx_max;i++)
		{
			if(typeof(chess_board[(ix+i)+','+iy]) == 'undefined')
			{
				end_1 = (ix+i)+','+iy;

				break;
			}
			else if(chess_board[(ix+i)+','+iy] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		if(count == 2)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_alive.push([end_0,end_1]);
				}
				else
				{
					black_alive.push([end_0,end_1]);
				}
			}
		}

		if(count == 3)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_three.push([end_0,end_1]);
				}
				else
				{
					black_three.push([end_0,end_1]);
				}
			}

			if(end_0 != '' && chess_board[(Number(end_0.split(',')[0])-1)+','+iy] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}

			if(end_1 != '' && chess_board[(Number(end_1.split(',')[0])+1)+','+iy] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		if(count == 4)
		{
			if(end_0 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}

			if(end_1 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		count = 1;
		end_0 = '';
		end_1 = '';

		for(var i = -1;i >= dx_min;i--)
		{
			if(i < dy_min) break;

			if(typeof(chess_board[(ix+i)+','+(iy+i)]) == 'undefined')
			{
				end_0 = (ix+i)+','+(iy+i);

				break;
			}
			else if(chess_board[(ix+i)+','+(iy+i)] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		for(var i = 1;i <= dx_max;i++)
		{
			if(i > dy_max) break;

			if(typeof(chess_board[(ix+i)+','+(iy+i)]) == 'undefined')
			{
				end_1 = (ix+i)+','+(iy+i);

				break;
			}
			else if(chess_board[(ix+i)+','+(iy+i)] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		if(count == 2)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_alive.push([end_0,end_1]);
				}
				else
				{
					black_alive.push([end_0,end_1]);
				}
			}
		}

		if(count == 3)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_three.push([end_0,end_1]);
				}
				else
				{
					black_three.push([end_0,end_1]);
				}
			}

			if(end_0 != '' && chess_board[(Number(end_0.split(',')[0])-1)+','+(Number(end_0.split(',')[1])-1)] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}

			if(end_1 != '' && chess_board[(Number(end_1.split(',')[0])+1)+','+(Number(end_1.split(',')[1])+1)] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		if(count == 4)
		{
			if(end_0 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}

			if(end_1 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		count = 1;
		end_0 = '';
		end_1 = '';

		for(var i = -1;i >= dy_min;i--)
		{
			if(typeof(chess_board[ix+','+(iy+i)]) == 'undefined')
			{
				end_0 = ix+','+(iy+i);

				break;
			}
			else if(chess_board[ix+','+(iy+i)] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		for(var i = 1;i <= dy_max;i++)
		{
			if(typeof(chess_board[ix+','+(iy+i)]) == 'undefined')
			{
				end_1 = ix+','+(iy+i);

				break;
			}
			else if(chess_board[ix+','+(iy+i)] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		if(count == 2)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_alive.push([end_0,end_1]);
				}
				else
				{
					black_alive.push([end_0,end_1]);
				}
			}
		}

		if(count == 3)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_three.push([end_0,end_1]);
				}
				else
				{
					black_three.push([end_0,end_1]);
				}
			}
			
			if(end_0 != '' && chess_board[ix+','+(Number(end_0.split(',')[1])-1)] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}
			
			if(end_1 != '' && chess_board[ix+','+(Number(end_1.split(',')[1])+1)] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		if(count == 4)
		{
			if(end_0 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}

			if(end_1 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		count = 1;
		end_0 = '';
		end_1 = '';

		for(var i = -1;i >= dx_min;i--)
		{
			if(-i > dy_max) break;

			if(typeof(chess_board[(ix+i)+','+(iy-i)]) == 'undefined')
			{
				end_0 = (ix+i)+','+(iy-i);

				break;
			}
			else if(chess_board[(ix+i)+','+(iy-i)] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		for(var i = 1;i <= dx_max;i++)
		{
			if(-i < dy_min) break;

			if(typeof(chess_board[(ix+i)+','+(iy-i)]) == 'undefined')
			{
				end_1 = (ix+i)+','+(iy-i);

				break;
			}
			else if(chess_board[(ix+i)+','+(iy-i)] == color)
			{
				count++;
			}
			else
			{
				break;
			}
		}

		if(count == 2)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_alive.push([end_0,end_1]);
				}
				else
				{
					black_alive.push([end_0,end_1]);
				}
			}
		}

		if(count == 3)
		{
			if(end_0 != '' && end_1 != '')
			{
				if(color == 'white')
				{
					white_three.push([end_0,end_1]);
				}
				else
				{
					black_three.push([end_0,end_1]);
				}
			}

			if(end_0 != '' && chess_board[(Number(end_0.split(',')[0])-1)+','+(Number(end_0.split(',')[1])+1)] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}

			if(end_1 != '' && chess_board[(Number(end_1.split(',')[0])+1)+','+(Number(end_1.split(',')[1])-1)] == color)
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		if(count == 4)
		{
			if(end_0 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_0);
				}
				else
				{
					black_final.push(end_0);
				}
			}

			if(end_1 != '')
			{
				if(color == 'white')
				{
					white_final.push(end_1);
				}
				else
				{
					black_final.push(end_1);
				}
			}
		}

		return true;
	}
}

board_grade();

function board_guide(color)
{
	var white_high_score = 0;
	var white_high_place = Array();
	var black_high_score = 0;
	var black_high_place = Array();

	// console.log('white_final',white_final);
	// console.log('white_three',white_three);
	// console.log('black_final',black_final);
	// console.log('black_three',black_three);

	if(color == 'white')
	{
		if(white_final.length > 0)
		{
			for(var k in white_final)
			{
				if(typeof(chess_board[white_final[k]]) != 'undefined') continue;

				return white_final[k];
			}
		}

		if(black_final != '')
		{
			for(var k in black_final)
			{
				if(typeof(chess_board[black_final[k]]) != 'undefined') continue;

				return black_final[k];
			}
		}

		if(white_three.length > 0)
		{
			for(var k in white_three)
			{
				if(typeof(chess_board[white_three[k][0]]) != 'undefined' || typeof(chess_board[white_three[k][1]]) != 'undefined') continue;

				if(white_board[white_three[k][0]] > white_board[white_three[k][1]])
				{
					return white_three[k][0];
				}
				else
				{
					return white_three[k][1];
				}
			}
		}

		if(black_three.length > 0)
		{
			for(var k in black_three)
			{
				if(typeof(chess_board[black_three[k][0]]) != 'undefined' || typeof(chess_board[black_three[k][1]]) != 'undefined') continue;

				if(black_board[black_three[k][0]] > black_board[black_three[k][1]])
				{
					return black_three[k][0];
				}
				else
				{
					return black_three[k][1];
				}
			}
		}

		if(white_alive.length > 0)
		{
			for(var k in white_alive)
			{
				if(typeof(chess_board[white_alive[k][0]]) != 'undefined' || typeof(chess_board[white_alive[k][1]]) != 'undefined') continue;

				if(white_board[white_alive[k][0]] > white_board[white_alive[k][1]])
				{
					return white_alive[k][0];
				}
				else
				{
					return white_alive[k][1];
				}
			}
		}
	}
	else
	{
		if(black_final.length > 0)
		{
			for(var k in black_final)
			{
				if(typeof(chess_board[black_final[k]]) != 'undefined') continue;

				return black_final[k];
			}
		}

		if(white_final != '')
		{
			for(var k in white_final)
			{
				if(typeof(chess_board[white_final[k]]) != 'undefined') continue;

				return white_final[k];
			}
		}

		if(black_three.length > 0)
		{
			for(var k in black_three)
			{
				if(typeof(chess_board[black_three[k][0]]) != 'undefined' || typeof(chess_board[black_three[k][1]]) != 'undefined') continue;

				if(black_board[black_three[k][0]] > black_board[black_three[k][1]])
				{
					return black_three[k][0];
				}
				else
				{
					return black_three[k][1];
				}
			}
		}

		if(white_three.length > 0)
		{
			for(var k in white_three)
			{
				if(typeof(chess_board[white_three[k][0]]) != 'undefined' || typeof(chess_board[white_three[k][1]]) != 'undefined') continue;

				if(white_board[white_three[k][0]] > white_board[white_three[k][1]])
				{
					return white_three[k][0];
				}
				else
				{
					return white_three[k][1];
				}
			}
		}

		if(black_alive.length > 0)
		{
			for(var k in black_alive)
			{
				if(typeof(chess_board[black_alive[k][0]]) != 'undefined' || typeof(chess_board[black_alive[k][1]]) != 'undefined') continue;

				if(black_board[black_alive[k][0]] > black_board[black_alive[k][1]])
				{
					return black_alive[k][0];
				}
				else
				{
					return black_alive[k][1];
				}
			}
		}
	}

	for(var xy in white_board)
	{
		if(white_board[xy] > white_high_score)
		{
			white_high_score = white_board[xy];

			white_high_place = Array();
			white_high_place.push(xy);
		}
		else if(white_board[xy] == white_high_score)
		{
			white_high_place.push(xy);
		}
	}

	for(var xy in black_board)
	{
		if(black_board[xy] > black_high_score)
		{
			black_high_score = black_board[xy];

			black_high_place = Array();
			black_high_place.push(xy);
		}
		else if(black_board[xy] == black_high_score)
		{
			black_high_place.push(xy);
		}
	}

	// console.log('white:'+white_high_score);console.log(white_high_place);
	// console.log('black:'+black_high_score);console.log(black_high_place);

	if(color == 'white')
	{
		if(black_high_score > white_high_score)
		{
			return black_high_place[Math.floor(Math.random()*black_high_place.length)];
		}
		else
		{
			return white_high_place[Math.floor(Math.random()*white_high_place.length)];
		}
	}
	else
	{
		if(white_high_score > black_high_score)
		{
			return white_high_place[Math.floor(Math.random()*white_high_place.length)];
		}
		else
		{
			return black_high_place[Math.floor(Math.random()*black_high_place.length)];
		}
	}
}

function is_win(color,x,y)
{
	for(var o_x = -1;o_x <= 1;o_x++)
	{
		for(var o_y = -1;o_y <= 1;o_y++)
		{
			if(o_x == 0 && o_y == 0) continue;

			x2 = x + o_x;
			y2 = y + o_y;

			if(x2 < 0 || x2 > 14 || y2 < 0 || y2 > 14) continue;

			if(typeof(chess_board[x2+','+y2]) != 'undefined')
			{
				if(chess_board[x2+','+y2] == color)
				{
					var num = 1;
					var lll = 1;
					var rrr = 1;

					for(var l = 1;l <= 5;l++)
					{
						if(lll == 1)
						{
							x3 = x + l * o_x;
							y3 = y + l * o_y;

							if(x3 < 0 || x3 > 14 || y3 < 0 || y3 > 14)
							{
								lll = 0;
							}
							else if(typeof(chess_board[x3+','+y3]) != 'undefined')
							{
								if(chess_board[x3+','+y3] == color)
								{
									num++;
								}
								else
								{
									lll = 0;
								}
							}
							else
							{
								lll = 0;
							}
						}

						if(rrr == 1)
						{
							x4 = x - l * o_x;
							y4 = y - l * o_y;

							if(x4 < 0 || x4 > 14 || y4 < 0 || y4 > 14)
							{
								rrr = 0;
							}
							else if(typeof(chess_board[x4+','+y4]) != 'undefined')
							{
								if(chess_board[x4+','+y4] == color)
								{
									num++;
								}
								else
								{
									rrr = 0;
								}
							}
							else
							{
								rrr = 0;
							}
						}

						if(lll == 0 && rrr == 0) break;
					}

					if(num >= 5)
					{
						chess_close = color;

						return chess_close;
					}
				}
			}
		}
	}

	return chess_close;
}