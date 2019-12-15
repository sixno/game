reactboot('chess',function(){
	class Grid extends React.Component {
		constructor(props) {
			super(props);

			this.state = {
				board: props.board || []
			};

			this.last_i = -1;
			this.last_j = -1;
			this.last_c = 0;

			this.winner = 0;

			this.chess_board = {};
			this.white_board = {};
			this.black_board = {};
			this.white_alive = []; // 白优先活子
			this.black_alive = []; // 黑优先活子
			this.white_three = []; // 白活三两端
			this.black_three = []; // 黑活三两端
			this.white_ready = []; // 白活四一步
			this.black_ready = []; // 黑活四一步
			this.white_final = []; // 白成五一步
			this.black_final = []; // 黑成五一步

			this.calculateScore()
		}

		render() {
			return evalJSX(`
				<div className="chessboard">{this.handleGrid(this.state.board)}<div style={{clear: 'both'}}></div></div>
			`,{this: this});
		}

		handleGrid(board) {
			var that = this;

			return board.map((v0,i) => {
				return v0.map((v,j) => {
					var img_name = 'cc.gif';

					if(i == 0)
					{
						img_name = 'tt.gif';
					}

					if(i == 14)
					{
						img_name = 'bb.gif';
					}

					if(j == 0)
					{
						img_name = 'll.gif';
					}

					if(j == 14)
					{
						img_name = 'rr.gif';
					}

					if(i == 0 && j == 0)
					{
						img_name = 'lt.gif';
					}

					if(i == 0 && j == 14)
					{
						img_name = 'rt.gif';
					}

					if(i == 14 && j == 0)
					{
						img_name = 'lb.gif';
					}

					if(i == 14 && j == 14)
					{
						img_name = 'rb.gif';
					}

					if(i == 3 && j == 3)
					{
						img_name = 'cc.png';
					}

					if(i == 7 && j == 7)
					{
						img_name = 'cc.png';
					}

					if(i == 11 && j == 11)
					{
						img_name = 'cc.png';
					}

					if(i == 3 && j == 11)
					{
						img_name = 'cc.png';
					}

					if(i == 11 && j == 3)
					{
						img_name = 'cc.png';
					}

					return evalJSX(`
						<div className={"chessgrid " + (v.check ? 'check' : '')} onClick={() => {this.handleClick(i,j,1)}}>
							<div className="chessgrid-content">
								<img src={'style/app/img/' + img_name}>
								<Chess color={v.color}/>
							</div>
						</div>
					`,{this: that,i: i,j: j,v: v,img_name: img_name});
				});
			});
		}

		handleClick(i, j, color) {
			if(this.winner)
			{
				alert((this.winner == 1 ? '黑' : '白') + '棋赢了！重玩请刷新页面:)');

				return false;
			}

			if(this.last_c == color) return false;

			var board = this.state.board;

			if(board[i][j].color > 0)
			{
				alert('当前节点已落子');

				return false;
			}

			if(this.last_i != -1 && this.last_j != -1)
			{
				board[this.last_i][this.last_j].check = 0;
			}

			board[i][j].check = 1;
			board[i][j].color = color;

			this.last_i = i;
			this.last_j = j;

			this.setState({board: board});

			this.last_c = color;

			if(this.isWin(color,i,j))
			{
				setTimeout(() => {
					alert((this.winner == 1 ? '黑' : '白') + '棋赢了！重玩请刷新页面:)');
				},100);

				return false;
			}

			this.calculateScore(color,i,j);

			this.aiClick();
		}

		aiClick() {
			var guide = this.boardGuide(2);

			if(guide)
			{
				var node = guide.split(',');

				this.handleClick(Number(node[0]),Number(node[1]),2);
			}
		}

		inArray(search,array) {
			for(var i in array)
			{
				if(array[i] == search)
				{
					return true;
				}
			}

			return false;
		}

		booleanScore(g1,g2,c1,c2) {
			var tmp = 0;

			if(g1 > g2)
			{
				tmp = g1;

				g1 = g2;
				g2 = tmp;
			}

			if(c2 === undefined)
			{
				return this.inArray(g1+','+g2,c1);
			}
			else
			{
				return this.inArray(g1,c1) && this.inArray(g2,c2);
			}
		}

		calculateScore(color,ix,iy) {
			if(typeof(color) == 'undefined')
			{
				for(var gy = 0;gy < 15;gy++)
				{
					for(var gx = 0;gx < 15;gx++)
					{
						if(gx == 0 || gx == 14 || gy == 0 || gy == 14)
						{
							if(this.inArray(gx+','+gy,['0,0','0,14','14,14','14,0']))
							{
								this.white_board[gx+','+gy] = 0;
								this.black_board[gx+','+gy] = 0;
							}
							else if(this.inArray(gx+','+gy,['0,1','1,0','13,0','14,1','14,13','13,14','1,14','0,13']))
							{
								this.white_board[gx+','+gy] = 3;
								this.black_board[gx+','+gy] = 3;
							}
							else
							{
								this.white_board[gx+','+gy] = 9;
								this.black_board[gx+','+gy] = 9;
							}
						}
						else if(gx == 1 || gx == 13 || gy == 1 || gy == 13)
						{
							if(this.inArray(gx+','+gy,['1,1','1,13','13,13','13,1']))
							{
								this.white_board[gx+','+gy] = 9;
								this.black_board[gx+','+gy] = 9;
							}
							else
							{
								this.white_board[gx+','+gy] = 18;
								this.black_board[gx+','+gy] = 18;
							}
						}
						else
						{
							if(gx >= 5 && gx <= 9 && gy >= 5 && gy <= 9)
							{
								this.white_board[gx+','+gy] = 37;
								this.black_board[gx+','+gy] = 37;
							}
							else
							{
								this.white_board[gx+','+gy] = 36;
								this.black_board[gx+','+gy] = 36;
							}
						}
					}
				}
			}
			else
			{
				this.chess_board[ix+','+iy] = color;
				this.white_board[ix+','+iy] = 0;
				this.black_board[ix+','+iy] = 0;

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

				if(ix - 1 >= 0) dx_min = -1;
				if(ix - 2 >= 0) dx_min = -2;
				if(ix - 3 >= 0) dx_min = -3;
				if(ix - 4 >= 0) dx_min = -4;
				if(ix + 1 < 15) dx_max =  1;
				if(ix + 2 < 15) dx_max =  2;
				if(ix + 3 < 15) dx_max =  3;
				if(ix + 4 < 15) dx_max =  4;
				if(iy - 1 >= 0) dy_min = -1;
				if(iy - 2 >= 0) dy_min = -2;
				if(iy - 3 >= 0) dy_min = -3;
				if(iy - 4 >= 0) dy_min = -4;
				if(iy + 1 < 15) dy_max =  1;
				if(iy + 2 < 15) dy_max =  2;
				if(iy + 3 < 15) dy_max =  3;
				if(iy + 4 < 15) dy_max =  4;

				for(var gy = iy + dy_min;gy <= iy + dy_max;gy++)
				{
					for(var gx = ix + dx_min;gx <= ix + dx_max;gx++)
					{
						if(gx == ix && gy == iy) continue;

						if(Math.abs(gx - ix) == 2 && Math.abs(gy - iy) == 1) continue;
						if(Math.abs(gy - iy) == 2 && Math.abs(gx - ix) == 1) continue;

						if(typeof(this.chess_board[gx+','+gy]) != 'undefined') continue;

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

						if(typeof(this.chess_board[gx+','+(gy-1)]) == 'undefined')
						{
							if(gy-1 >= 0)
							{
								if(typeof(this.chess_board[gx+','+(gy-2)]) == 'undefined')
								{
									if(gy-2 >= 0)
									{
										white_1212 = gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 1 ? -3 : 3;
										black_1212 = gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 2 ? -3 : 3;
									}
									else
									{
										white_1212 = 1;
										black_1212 = 1;
									}
								}
								else
								{
									if(this.chess_board[gx+','+(gy-2)] == 2)
									{
										white_1212 = gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 1 ? -4 : 4;
										black_1212 = 1;
									}
									else
									{
										black_1212 = gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 2 ? -4 : 4;
										white_1212 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[gx+','+(gy-1)] == 2)
							{
								if(gy-2 < 0 || this.chess_board[gx+','+(gy-2)] == 1)
								{
									white_1212 = 2;
								}
								else
								{
									if(typeof(this.chess_board[gx+','+(gy-2)]) == 'undefined')
									{
										if(gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 1)
										{
											white_1212 = -5;
										}
										else
										{
											white_1212 = 5;
										}
									}
									else
									{
										if(gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 1)
										{
											white_1212 = -6;
										}
										else if(typeof(this.chess_board[gx+','+(gy-3)]) ==  'undefined')
										{
											white_1212 = 6;
										}
										else if(this.chess_board[gx+','+(gy-4)] == 2)
										{
											white_1212 = 7;
										}
										else
										{
											white_1212 = -7;
										}
									}
								}
							}
							else
							{
								if(gy-2 < 0 || this.chess_board[gx+','+(gy-2)] == 2)
								{
									black_1212 = 2;
								}
								else
								{
									if(typeof(this.chess_board[gx+','+(gy-2)]) == 'undefined')
									{
										if(gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 2)
										{
											black_1212 = -5;
										}
										else
										{
											black_1212 = 5;
										}
									}
									else
									{
										if(gy-3 < 0 || this.chess_board[gx+','+(gy-3)] == 2)
										{
											black_1212 = -6;
										}
										else if(typeof(this.chess_board[gx+','+(gy-3)]) ==  'undefined')
										{
											black_1212 = 6;
										}
										else if(this.chess_board[gx+','+(gy-4)] == 1)
										{
											black_1212 = 7;
										}
										else
										{
											black_1212 = -7;
										}
									}
								}
							}
						}

						// 1203

						if(typeof(this.chess_board[(gx+1)+','+(gy-1)]) == 'undefined')
						{
							if(gx+1 < 15 && gy-1 >= 0)
							{
								if(typeof(this.chess_board[(gx+2)+','+(gy-2)]) == 'undefined')
								{
									if(gx+2 < 15 && gy-2 >= 0)
									{
										white_1203 = gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 1 ? -3 : 3;
										black_1203 = gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 2 ? -3 : 3;
									}
									else
									{
										white_1203 = 1;
										black_1203 = 1;
									}
								}
								else
								{
									if(this.chess_board[(gx+2)+','+(gy-2)] == 2)
									{
										white_1203 = gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 1 ? -4 : 4;
										black_1203 = 1;
									}
									else
									{
										black_1203 = gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 2 ? -4 : 4;
										white_1203 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[(gx+1)+','+(gy-1)] == 2)
							{
								if(gx+2 > 14 || gy-2 < 0 || this.chess_board[(gx+2)+','+(gy-2)] == 1)
								{
									white_1203 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx+2)+','+(gy-2)]) == 'undefined')
									{
										if(gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 1)
										{
											white_1203 = -5;
										}
										else
										{
											white_1203 = 5;
										}
									}
									else
									{
										if(gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 1)
										{
											white_1203 = -6;
										}
										else if(typeof(this.chess_board[(gx+3)+','+(gy-3)]) ==  'undefined')
										{
											white_1203 = 6;
										}
										else if(this.chess_board[(gx+3)+','+(gy-4)] == 2)
										{
											white_1203 = 7;
										}
										else
										{
											white_1203 = -7;
										}
									}
								}
							}
							else
							{
								if(gx+2 > 14 || gy-2 < 0 || this.chess_board[(gx+2)+','+(gy-2)] == 2)
								{
									black_1203 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx+2)+','+(gy-2)]) == 'undefined')
									{
										if(gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 2)
										{
											black_1203 = -5;
										}
										else
										{
											black_1203 = 5;
										}
									}
									else
									{
										if(gx+3 > 14 || gy-3 < 0 || this.chess_board[(gx+3)+','+(gy-3)] == 2)
										{
											black_1203 = -6;
										}
										else if(typeof(this.chess_board[(gx+3)+','+(gy-3)]) ==  'undefined')
										{
											black_1203 = 6;
										}
										else if(this.chess_board[(gx+4)+','+(gy-4)] == 1)
										{
											black_1203 = 7;
										}
										else
										{
											black_1203 = -7;
										}
									}
								}
							}
						}

						// 0303

						if(typeof(this.chess_board[(gx+1)+','+gy]) == 'undefined')
						{
							if(gx+1 < 15)
							{
								if(typeof(this.chess_board[(gx+2)+','+gy]) == 'undefined')
								{
									if(gx+2 < 15)
									{
										white_0303 = gx+3 > 14 || this.chess_board[(gx+3)+','+gy] == 1 ? -3 : 3;
										black_0303 = gx+3 > 14 || this.chess_board[(gx+3)+','+gy] == 2 ? -3 : 3;
									}
									else
									{
										white_0303 = 1;
										black_0303 = 1;
									}
								}
								else
								{
									if(this.chess_board[(gx+2)+','+gy] == 2)
									{
										white_0303 = gy+3 > 14 || this.chess_board[(gx+3)+','+gy] == 1 ? -4 : 4;
										black_0303 = 1;
									}
									else
									{
										black_0303 = gx+3 > 14 || this.chess_board[(gx+3)+','+gy] == 2 ? -4 : 4;
										white_0303 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[(gx+1)+','+gy] == 2)
							{
								if(gx+2 > 14 || this.chess_board[(gx+2)+','+gy] == 1)
								{
									white_0303 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx+2)+','+gy]) == 'undefined')
									{
										if(gx+3 > 14 || this.chess_board[(gx+3)+','+gy] == 1)
										{
											white_0303 = -5;
										}
										else
										{
											white_0303 = 5;
										}
									}
									else
									{
										if(gx+3 > 14 || this.chess_board[(gx+3)+','+gy] == 1)
										{
											white_0303 = -6;
										}
										else if(typeof(this.chess_board[(gx+3)+','+gy]) ==  'undefined')
										{
											white_0303 = 6;
										}
										else if(this.chess_board[(gx+4)+','+gy] == 2)
										{
											white_0303 = 7;
										}
										else
										{
											white_0303 = -7;
										}
									}
								}
							}
							else
							{
								if(gx+2 > 14 || this.chess_board[(gx+2)+','+gy] == 2)
								{
									black_0303 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx+2)+','+gy]) == 'undefined')
									{
										if(gx+3 > 14 || this.chess_board[(gx+3)+','+gy] == 2)
										{
											black_0303 = -5;
										}
										else
										{
											black_0303 = 5;
										}
									}
									else
									{
										if(gx+3 > 14 || this.chess_board[(gx+3)+','+gy] == 2)
										{
											black_0303 = -6;
										}
										else if(typeof(this.chess_board[(gx+3)+','+gy]) ==  'undefined')
										{
											black_0303 = 6;
										}
										else if(this.chess_board[(gx+4)+','+gy] == 1)
										{
											black_0303 = 7;
										}
										else
										{
											black_0303 = -7;
										}
									}
								}
							}
						}

						// 0306

						if(typeof(this.chess_board[(gx+1)+','+(gy+1)]) == 'undefined')
						{
							if(gx+1 < 15 && gy+1 < 15)
							{
								if(typeof(this.chess_board[(gx+2)+','+(gy+2)]) == 'undefined')
								{
									if(gx+2 < 15 && gy+2 < 15)
									{
										white_0306 = gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 1 ? -3 : 3;
										black_0306 = gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 2 ? -3 : 3;
									}
									else
									{
										white_0306 = 1;
										black_0306 = 1;
									}
								}
								else
								{
									if(this.chess_board[(gx+2)+','+(gy+2)] == 2)
									{
										white_0306 = gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 1 ? -4 : 4;
										black_0306 = 1;
									}
									else
									{
										black_0306 = gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 2 ? -4 : 4;
										white_0306 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[(gx+1)+','+(gy+1)] == 2)
							{
								if(gx+2 > 14 || gy+2 > 14 || this.chess_board[(gx+2)+','+(gy+2)] == 1)
								{
									white_0306 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx+2)+','+(gy+2)]) == 'undefined')
									{
										if(gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 1)
										{
											white_0306 = -5;
										}
										else
										{
											white_0306 = 5;
										}
									}
									else
									{
										if(gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 1)
										{
											white_0306 = -6;
										}
										else if(typeof(this.chess_board[(gx+3)+','+(gy+3)]) ==  'undefined')
										{
											white_0306 = 6;
										}
										else if(this.chess_board[(gx+3)+','+(gy+4)] == 2)
										{
											white_0306 = 7;
										}
										else
										{
											white_0306 = -7;
										}
									}
								}
							}
							else
							{
								if(gx+2 > 14 || gy+2 > 14 || this.chess_board[(gx+2)+','+(gy+2)] == 2)
								{
									black_0306 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx+2)+','+(gy+2)]) == 'undefined')
									{
										if(gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 2)
										{
											black_0306 = -5;
										}
										else
										{
											black_0306 = 5;
										}
									}
									else
									{
										if(gx+3 > 14 || gy+3 > 14 || this.chess_board[(gx+3)+','+(gy+3)] == 2)
										{
											black_0306 = -6;
										}
										else if(typeof(this.chess_board[(gx+3)+','+(gy+3)]) ==  'undefined')
										{
											black_0306 = 6;
										}
										else if(this.chess_board[(gx+4)+','+(gy+4)] == 1)
										{
											black_0306 = 7;
										}
										else
										{
											black_0306 = -7;
										}
									}
								}
							}
						}

						// 0606

						if(typeof(this.chess_board[gx+','+(gy+1)]) == 'undefined')
						{
							if(gy+1 < 15)
							{
								if(typeof(this.chess_board[gx+','+(gy+2)]) == 'undefined')
								{
									if(gy+2 < 15)
									{
										white_0606 = gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 1 ? -3 : 3;
										black_0606 = gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 2 ? -3 : 3;
									}
									else
									{
										white_0606 = 1;
										black_0606 = 1;
									}
								}
								else
								{
									if(this.chess_board[gx+','+(gy+2)] == 2)
									{
										white_0606 = gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 1 ? -4 : 4;
										black_0606 = 1;
									}
									else
									{
										black_0606 = gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 2 ? -4 : 4;
										white_0606 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[gx+','+(gy+1)] == 2)
							{
								if(gy+2 > 14 || this.chess_board[gx+','+(gy+2)] == 1)
								{
									white_0606 = 2;
								}
								else
								{
									if(typeof(this.chess_board[gx+','+(gy+2)]) == 'undefined')
									{
										if(gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 1)
										{
											white_0606 = -5;
										}
										else
										{
											white_0606 = 5;
										}
									}
									else
									{
										if(gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 1)
										{
											white_0606 = -6;
										}
										else if(typeof(this.chess_board[gx+','+(gy+3)]) ==  'undefined')
										{
											white_0606 = 6;
										}
										else if(this.chess_board[gx+','+(gy+4)] == 2)
										{
											white_0606 = 7;
										}
										else
										{
											white_0606 = -7;
										}
									}
								}
							}
							else
							{
								if(gy+2 > 14 || this.chess_board[gx+','+(gy+2)] == 2)
								{
									black_0606 = 2;
								}
								else
								{
									if(typeof(this.chess_board[gx+','+(gy+2)]) == 'undefined')
									{
										if(gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 2)
										{
											black_0606 = -5;
										}
										else
										{
											black_0606 = 5;
										}
									}
									else
									{
										if(gy+3 > 14 || this.chess_board[gx+','+(gy+3)] == 2)
										{
											black_0606 = -6;
										}
										else if(typeof(this.chess_board[gx+','+(gy+3)]) ==  'undefined')
										{
											black_0606 = 6;
										}
										else if(this.chess_board[gx+','+(gy+4)] == 1)
										{
											black_0606 = 7;
										}
										else
										{
											black_0606 = -7;
										}
									}
								}
							}
						}

						// 0609

						if(typeof(this.chess_board[(gx-1)+','+(gy+1)]) == 'undefined')
						{
							if(gx-1 >= 0 && gy+1 < 15)
							{
								if(typeof(this.chess_board[(gx-2)+','+(gy+2)]) == 'undefined')
								{
									if(gx-2 >= 0 && gy+2 < 15)
									{
										white_0609 = gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 1 ? -3 : 3;
										black_0609 = gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 2 ? -3 : 3;
									}
									else
									{
										white_0609 = 1;
										black_0609 = 1;
									}
								}
								else
								{
									if(this.chess_board[(gx-2)+','+(gy+2)] == 2)
									{
										white_0609 = gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 1 ? -4 : 4;
										black_0609 = 1;
									}
									else
									{
										black_0609 = gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 2 ? -4 : 4;
										white_0609 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[(gx-1)+','+(gy+1)] == 2)
							{
								if(gx-2 < 0 || gy+2 > 14 || this.chess_board[(gx-2)+','+(gy+2)] == 1)
								{
									white_0609 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx-2)+','+(gy+2)]) == 'undefined')
									{
										if(gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 1)
										{
											white_0609 = -5;
										}
										else
										{
											white_0609 = 5;
										}
									}
									else
									{
										if(gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 1)
										{
											white_0609 = -6;
										}
										else if(typeof(this.chess_board[(gx-3)+','+(gy+3)]) ==  'undefined')
										{
											white_0609 = 6;
										}
										else if(this.chess_board[(gx-3)+','+(gy+4)] == 2)
										{
											white_0609 = 7;
										}
										else
										{
											white_0609 = -7;
										}
									}
								}
							}
							else
							{
								if(gx-2 < 0 || gy+2 > 14 || this.chess_board[(gx-2)+','+(gy+2)] == 2)
								{
									black_0609 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx-2)+','+(gy+2)]) == 'undefined')
									{
										if(gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 2)
										{
											black_0609 = -5;
										}
										else
										{
											black_0609 = 5;
										}
									}
									else
									{
										if(gx-3 < 0 || gy+3 > 14 || this.chess_board[(gx-3)+','+(gy+3)] == 2)
										{
											black_0609 = -6;
										}
										else if(typeof(this.chess_board[(gx-3)+','+(gy+3)]) ==  'undefined')
										{
											black_0609 = 6;
										}
										else if(this.chess_board[(gx-4)+','+(gy+4)] == 1)
										{
											black_0609 = 7;
										}
										else
										{
											black_0609 = -7;
										}
									}
								}
							}
						}

						// 0909

						if(typeof(this.chess_board[(gx-1)+','+gy]) == 'undefined')
						{
							if(gx-1 >= 0)
							{
								if(typeof(this.chess_board[(gx-2)+','+gy]) == 'undefined')
								{
									if(gx-2 >= 0)
									{
										white_0909 = gx-3 < 0 || this.chess_board[(gx-3)+','+gy] == 1 ? -3 : 3;
										black_0909 = gx-3 < 0 || this.chess_board[(gx-3)+','+gy] == 2 ? -3 : 3;
									}
									else
									{
										white_0909 = 1;
										black_0909 = 1;
									}
								}
								else
								{
									if(this.chess_board[(gx-2)+','+gy] == 2)
									{
										white_0909 = gy-3 < 0 || this.chess_board[(gx-3)+','+gy] == 1 ? -4 : 4;
										black_0909 = 1;
									}
									else
									{
										black_0909 = gx-3 < 0 || this.chess_board[(gx-3)+','+gy] == 2 ? -4 : 4;
										white_0909 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[(gx-1)+','+gy] == 2)
							{
								if(gx-2 < 0 || this.chess_board[(gx-2)+','+gy] == 1)
								{
									white_0909 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx-2)+','+gy]) == 'undefined')
									{
										if(gx-3 < 0 || this.chess_board[(gx-3)+','+gy] == 1)
										{
											white_0909 = -5;
										}
										else
										{
											white_0909 = 5;
										}
									}
									else
									{
										if(gx-3 < 0 || this.chess_board[(gx-3)+','+gy] == 1)
										{
											white_0909 = -6;
										}
										else if(typeof(this.chess_board[(gx-3)+','+gy]) ==  'undefined')
										{
											white_0909 = 6;
										}
										else if(this.chess_board[(gx-4)+','+gy] == 2)
										{
											white_0909 = 7;
										}
										else
										{
											white_0909 = -7;
										}
									}
								}
							}
							else
							{
								if(gx-2 < 0 || this.chess_board[(gx-2)+','+gy] == 2)
								{
									black_0909 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx-2)+','+gy]) == 'undefined')
									{
										if(gx-3 < 0 || this.chess_board[(gx-3)+','+gy] == 2)
										{
											black_0909 = -5;
										}
										else
										{
											black_0909 = 5;
										}
									}
									else
									{
										if(gx-3 < 0 || this.chess_board[(gx-3)+','+gy] == 2)
										{
											black_0909 = -6;
										}
										else if(typeof(this.chess_board[(gx-3)+','+gy]) ==  'undefined')
										{
											black_0909 = 6;
										}
										else if(this.chess_board[(gx-4)+','+gy] == 1)
										{
											black_0909 = 7;
										}
										else
										{
											black_0909 = -7;
										}
									}
								}
							}
						}

						// 0912

						if(typeof(this.chess_board[(gx-1)+','+(gy-1)]) == 'undefined')
						{
							if(gx-1 >= 0 && gy-1 >= 0)
							{
								if(typeof(this.chess_board[(gx-2)+','+(gy-2)]) == 'undefined')
								{
									if(gx-2 >= 0 && gy-2 >= 0)
									{
										white_0912 = gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 1 ? -3 : 3;
										black_0912 = gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 2 ? -3 : 3;
									}
									else
									{
										white_0912 = 1;
										black_0912 = 1;
									}
								}
								else
								{
									if(this.chess_board[(gx-2)+','+(gy-2)] == 2)
									{
										white_0912 = gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 1 ? -4 : 4;
										black_0912 = 1;
									}
									else
									{
										black_0912 = gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 2 ? -4 : 4;
										white_0912 = 1;
									}
								}
							}
						}
						else
						{
							if(this.chess_board[(gx-1)+','+(gy-1)] == 2)
							{
								if(gx-2 < 0 || gy-2 < 0 || this.chess_board[(gx-2)+','+(gy-2)] == 1)
								{
									white_0912 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx-2)+','+(gy-2)]) == 'undefined')
									{
										if(gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 1)
										{
											white_0912 = -5;
										}
										else
										{
											white_0912 = 5;
										}
									}
									else
									{
										if(gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 1)
										{
											white_0912 = -6;
										}
										else if(typeof(this.chess_board[(gx-3)+','+(gy-3)]) ==  'undefined')
										{
											white_0912 = 6;
										}
										else if(this.chess_board[(gx-3)+','+(gy-4)] == 2)
										{
											white_0912 = 7;
										}
										else
										{
											white_0912 = -7;
										}
									}
								}
							}
							else
							{
								if(gx-2 < 0 || gy-2 < 0 || this.chess_board[(gx-2)+','+(gy-2)] == 2)
								{
									black_0912 = 2;
								}
								else
								{
									if(typeof(this.chess_board[(gx-2)+','+(gy-2)]) == 'undefined')
									{
										if(gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 2)
										{
											black_0912 = -5;
										}
										else
										{
											black_0912 = 5;
										}
									}
									else
									{
										if(gx-3 < 0 || gy-3 < 0 || this.chess_board[(gx-3)+','+(gy-3)] == 2)
										{
											black_0912 = -6;
										}
										else if(typeof(this.chess_board[(gx-3)+','+(gy-3)]) ==  'undefined')
										{
											black_0912 = 6;
										}
										else if(this.chess_board[(gx-4)+','+(gy-4)] == 1)
										{
											black_0912 = 7;
										}
										else
										{
											black_0912 = -7;
										}
									}
								}
							}
						}

						// full 31 situations, but...
						// x   0  // |->|  x   0   0  0
						// _x  1  // |->|  _x  1   1  0
						// +x  2  // |->|  +x  2   1  0
						// __x 3  // |->|  __x 3   2  0
						// _+x 4  // |->|  _+x 4   2  1
						// +_x 5  // |->|  +_x 5   2  1
						// ++x 6  // |->|  ++x 6   2  2
						// ___ 7  // |->|  ___ 7  3:4 0
						// __+ 8  // |->|  __+ 8  3:4 1:2
						// _+_ 9  // |->|  _+_ 9  3:4 1
						// +__ 10 // |->|  +__ 10 3:4 1
						// +_+ 11 // |->|  +_+ 11 3:4 1:2
						// _++ 12 // |->|  _++ 12 3:4 2:3
						// ++_ 13 // |->|  ++_ 13 3:4 2
						// +++ 14 // |->|  +++ 14 3:4 3:4

						// but...
						// x    0
						// _x   1
						// +x   2
						// __  ±3  x -3 | __x       -3 | ___/__+ 3
						// _+  ±4  x -4 | _+x       -4 | _+_/_++ 4
						// +_  ±5  x -5 | +_x       -5 | +__/+_+ 5
						// ++  ±6  x -6 | ++x       -6 | ++_     6
						// +++ ±7  +  7 | +++x/+++_ -7 | ++++    7

						// special points ^-^ 2^
						//  1 or 2 multiply by -6 ~ -3 is 0
						//  x_#+_  1x5=5      x4
						//  __#+_  3x5=15     x4
						//  _+#+_  5x5=25     x8
						//  __#++  3x6=18     x8
						//  x_#+++ 1x7=7  x-7 x16
						//  __#+++ 3x7=21 x-7 x16
						//  +_#+++ 4x7=28 x-7 x16
						//  _+#++  5x6=30 _ 6 x16 final
						//  ++#++  6x6=36     x32 final
						//  x_#+++ 1x7=7  + 7 x32 final
						//  x+#+++ 2x7=14     x32 final
						//  __#+++ 3x7=21 + 7 x32 final
						//  +_#+++ 4x7=28 + 7 x32 final
						//  _+#+++ 5x7=35     x32 final
						//  ++#+++ 6x7=42     x32 final
						// +++#+++ 7x7=49     x32 final

						// for white

						if(this.booleanScore(white_1212,white_0606,[-6,-5,-4,-3],[1,2]))
						{
							white_1212 = 0;
						}
						else if(this.booleanScore(white_1212,white_0606,['1,5','-5,1','3,5','-5,3']))
						{
							white_1212 = Math.abs(white_1212*white_0606)*4;
						}
						else if(this.booleanScore(white_1212,white_0606,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							white_1212 = Math.abs(white_1212*white_0606)*8;
						}
						else if(this.booleanScore(white_1212,white_0606,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							white_1212 = Math.abs(white_1212*white_0606)*16;
						}
						else if(this.booleanScore(white_1212,white_0606,['5,6','-5,6']))
						{
							white_1212 = Math.abs(white_1212*white_0606)*16;
							this.white_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(white_1212,white_0606,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							white_1212 = Math.abs(white_1212*white_0606)*32;
							this.white_final.push(gx+','+gy);
						}
						else
						{
							white_1212 = Math.abs(white_1212);
							white_0606 = Math.abs(white_0606);
							if(this.booleanScore(white_1212,white_0606,['6,6','5,7','6,7','7,7']))
							{
								white_1212 *= white_0606*32;
								this.white_final.push(gx+','+gy);
							}
							else
							{
								white_1212 *= white_0606;
							}
						}

						if(this.booleanScore(white_1203,white_0609,[-6,-5,-4,-3],[1,2]))
						{
							white_1203 = 0;
						}
						else if(this.booleanScore(white_1203,white_0609,['1,5','-5,1','3,5','-5,3']))
						{
							white_1203 = Math.abs(white_1203*white_0609)*4;
						}
						else if(this.booleanScore(white_1203,white_0609,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							white_1203 = Math.abs(white_1203*white_0609)*8;
						}
						else if(this.booleanScore(white_1203,white_0609,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							white_1203 = Math.abs(white_1203*white_0609)*16;
						}
						else if(this.booleanScore(white_1203,white_0609,['5,6','-5,6']))
						{
							white_1203 = Math.abs(white_1203*white_0609)*16;
							this.white_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(white_1203,white_0609,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							white_1203 = Math.abs(white_1203*white_0609)*32;
							this.white_final.push(gx+','+gy);
						}
						else
						{
							white_1203 = Math.abs(white_1203);
							white_0609 = Math.abs(white_0609);
							if(this.booleanScore(white_1203,white_0609,['6,6','5,7','6,7','7,7']))
							{
								white_1203 *= white_0609*32;
								this.white_final.push(gx+','+gy);
							}
							else
							{
								white_1203 *= white_0609;
							}
						}

						if(this.booleanScore(white_0303,white_0909,[-6,-5,-4,-3],[1,2]))
						{
							white_0303 = 0;
						}
						else if(this.booleanScore(white_0303,white_0909,['1,5','-5,1','3,5','-5,3']))
						{
							white_0303 = Math.abs(white_0303*white_0909)*4;
						}
						else if(this.booleanScore(white_0303,white_0909,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							white_0303 = Math.abs(white_0303*white_0909)*8;
						}
						else if(this.booleanScore(white_0303,white_0909,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							white_0303 = Math.abs(white_0303*white_0909)*16;
						}
						else if(this.booleanScore(white_0303,white_0909,['5,6','-5,6']))
						{
							white_0303 = Math.abs(white_0303*white_0909)*16;
							this.white_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(white_0303,white_0909,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							white_0303 = Math.abs(white_0303*white_0909)*32;
							this.white_final.push(gx+','+gy);
						}
						else
						{
							white_0303 = Math.abs(white_0303);
							white_0909 = Math.abs(white_0909);
							if(this.booleanScore(white_0303,white_0909,['6,6','5,7','6,7','7,7']))
							{
								white_0303 *= white_0909*32;
								this.white_final.push(gx+','+gy);
							}
							else
							{
								white_0303 *= white_0909;
							}
						}

						if(this.booleanScore(white_0306,white_0912,[-6,-5,-4,-3],[1,2]))
						{
							white_0306 = 0;
						}
						else if(this.booleanScore(white_0306,white_0912,['1,5','-5,1','3,5','-5,3']))
						{
							white_0306 = Math.abs(white_0306*white_0912)*4;
						}
						else if(this.booleanScore(white_0306,white_0912,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							white_0306 = Math.abs(white_0306*white_0912)*8;
						}
						else if(this.booleanScore(white_0306,white_0912,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							white_0306 = Math.abs(white_0306*white_0912)*16;
						}
						else if(this.booleanScore(white_0306,white_0912,['5,6','-5,6']))
						{
							white_0306 = Math.abs(white_0306*white_0912)*16;
							this.white_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(white_0306,white_0912,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							white_0306 = Math.abs(white_0306*white_0912)*32;
							this.white_final.push(gx+','+gy);
						}
						else
						{
							white_0306 = Math.abs(white_0306);
							white_0912 = Math.abs(white_0912);
							if(this.booleanScore(white_0306,white_0912,['6,6','5,7','6,7','7,7']))
							{
								white_0306 *= white_0912*32;
								this.white_final.push(gx+','+gy);
							}
							else
							{
								white_0306 *= white_0912;
							}
						}

						// for black

						if(this.booleanScore(black_1212,black_0606,[-6,-5,-4,-3],[1,2]))
						{
							black_1212 = 0;
						}
						else if(this.booleanScore(black_1212,black_0606,['1,5','-5,1','3,5','-5,3']))
						{
							black_1212 = Math.abs(black_1212*black_0606)*4;
						}
						else if(this.booleanScore(black_1212,black_0606,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							black_1212 = Math.abs(black_1212*black_0606)*8;
						}
						else if(this.booleanScore(black_1212,black_0606,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							black_1212 = Math.abs(black_1212*black_0606)*16;
						}
						else if(this.booleanScore(black_1212,black_0606,['5,6','-5,6']))
						{
							black_1212 = Math.abs(black_1212*black_0606)*16;
							this.black_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(black_1212,black_0606,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							black_1212 = Math.abs(black_1212*black_0606)*32;
							this.black_final.push(gx+','+gy);
						}
						else
						{
							black_1212 = Math.abs(black_1212);
							black_0606 = Math.abs(black_0606);
							if(this.booleanScore(black_1212,black_0606,['6,6','5,7','6,7','7,7']))
							{
								black_1212 *= black_0606*32;
								this.black_final.push(gx+','+gy);
							}
							else
							{
								black_1212 *= black_0606;
							}
						}

						if(this.booleanScore(black_1203,black_0609,[-6,-5,-4,-3],[1,2]))
						{
							black_1203 = 0;
						}
						else if(this.booleanScore(black_1203,black_0609,['1,5','-5,1','3,5','-5,3']))
						{
							black_1203 = Math.abs(black_1203*black_0609)*4;
						}
						else if(this.booleanScore(black_1203,black_0609,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							black_1203 = Math.abs(black_1203*black_0609)*8;
						}
						else if(this.booleanScore(black_1203,black_0609,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							black_1203 = Math.abs(black_1203*black_0609)*16;
						}
						else if(this.booleanScore(black_1212,black_0606,['5,6','-5,6']))
						{
							black_1203 = Math.abs(black_1203*black_0609)*16;
							this.black_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(black_1203,black_0609,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							black_1203 = Math.abs(black_1203*black_0609)*32;
							this.black_final.push(gx+','+gy);
						}
						else
						{
							black_1203 = Math.abs(black_1203);
							black_0609 = Math.abs(black_0609);
							if(this.booleanScore(black_1203,black_0609,['6,6','5,7','6,7','7,7']))
							{
								black_1203 *= black_0609*32;
								this.black_final.push(gx+','+gy);
							}
							else
							{
								black_1203 *= black_0609;
							}
						}

						if(this.booleanScore(black_0303,black_0909,[-6,-5,-4,-3],[1,2]))
						{
							black_0303 = 0;
						}
						else if(this.booleanScore(black_0303,black_0909,['1,5','-5,1','3,5','-5,3']))
						{
							black_0303 = Math.abs(black_0303*black_0909)*4;
						}
						else if(this.booleanScore(black_0303,black_0909,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							black_0303 = Math.abs(black_0303*black_0909)*8;
						}
						else if(this.booleanScore(black_0303,black_0909,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							black_0303 = Math.abs(black_0303*black_0909)*16;
						}
						else if(this.booleanScore(black_0303,black_0909,['5,6','-5,6']))
						{
							black_1203 = Math.abs(black_1203*black_0609)*16;
							this.black_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(black_0303,black_0909,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							black_0303 = Math.abs(black_0303*black_0909)*32;
							this.black_final.push(gx+','+gy);
						}
						else
						{
							black_0303 = Math.abs(black_0303);
							black_0909 = Math.abs(black_0909);
							if(this.booleanScore(black_0303,black_0909,['6,6','5,7','6,7','7,7']))
							{
								black_0303 *= black_0909*32;
								this.black_final.push(gx+','+gy);
							}
							else
							{
								black_0303 *= black_0909;
							}
						}

						if(this.booleanScore(black_0306,black_0912,[-6,-5,-4,-3],[1,2]))
						{
							black_0306 = 0;
						}
						else if(this.booleanScore(black_0306,black_0912,['1,5','-5,1','3,5','-5,3']))
						{
							black_0306 = Math.abs(black_0306*black_0912)*4;
						}
						else if(this.booleanScore(black_0306,black_0912,['5,5','-5,5','-5,-5','3,6','-3,6']))
						{
							black_0306 = Math.abs(black_0306*black_0912)*8;
						}
						else if(this.booleanScore(black_0306,black_0912,['-7,1','-7,3','-7,4','-6,5','-6,-5']))
						{
							black_0306 = Math.abs(black_0306*black_0912)*16;
						}
						else if(this.booleanScore(black_0303,black_0909,['5,6','-5,6']))
						{
							black_0306 = Math.abs(black_0306*black_0912)*16;
							this.black_ready.push(gx+','+gy);
						}
						else if(this.booleanScore(black_0306,black_0912,['1,7','2,7','-7,2','3,7','4,7','-3,7','-4,7']))
						{
							black_0306 = Math.abs(black_0306*black_0912)*32;
							this.black_final.push(gx+','+gy);
						}
						else
						{
							black_0306 = Math.abs(black_0306);
							black_0912 = Math.abs(black_0912);
							if(this.booleanScore(black_0306,black_0912,['6,6','5,7','6,7','7,7']))
							{
								black_0306 *= black_0912*32;
								this.black_final.push(gx+','+gy);
							}
							else
							{
								black_0306 *= black_0912;
							}
						}

						// console.log(gx+','+gy+':white_1212:'+white_1212);
						// console.log(gx+','+gy+':white_1203:'+white_1203);
						// console.log(gx+','+gy+':white_0303:'+white_0303);
						// console.log(gx+','+gy+':white_0306:'+white_0306);

						// console.log(gx+','+gy+':black_1212:'+black_1212);
						// console.log(gx+','+gy+':black_1203:'+black_1203);
						// console.log(gx+','+gy+':black_0303:'+black_0303);
						// console.log(gx+','+gy+':black_0306:'+black_0306);

						this.white_board[gx+','+gy] = white_1212 + white_1203 + white_0303 + white_0306;
						this.black_board[gx+','+gy] = black_1212 + black_1203 + black_0303 + black_0306;
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
					if(typeof(this.chess_board[(ix+i)+','+iy]) == 'undefined')
					{
						end_0 = (ix+i)+','+iy;

						break;
					}
					else if(this.chess_board[(ix+i)+','+iy] == color)
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
					if(typeof(this.chess_board[(ix+i)+','+iy]) == 'undefined')
					{
						end_1 = (ix+i)+','+iy;

						break;
					}
					else if(this.chess_board[(ix+i)+','+iy] == color)
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
						if(color == 2)
						{
							this.white_alive.push([end_0,end_1]);
						}
						else
						{
							this.black_alive.push([end_0,end_1]);
						}
					}
				}

				if(count == 3)
				{
					if(end_0 != '' && end_1 != '')
					{
						if(color == 2)
						{
							this.white_three.push([end_0,end_1]);
						}
						else
						{
							this.black_three.push([end_0,end_1]);
						}
					}

					if(end_0 != '' && this.chess_board[(Number(end_0.split(',')[0])-1)+','+iy] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}

					if(end_1 != '' && this.chess_board[(Number(end_1.split(',')[0])+1)+','+iy] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				if(count == 4)
				{
					if(end_0 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}

					if(end_1 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				count = 1;
				end_0 = '';
				end_1 = '';

				for(var i = -1;i >= dx_min;i--)
				{
					if(i < dy_min) break;

					if(typeof(this.chess_board[(ix+i)+','+(iy+i)]) == 'undefined')
					{
						end_0 = (ix+i)+','+(iy+i);

						break;
					}
					else if(this.chess_board[(ix+i)+','+(iy+i)] == color)
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

					if(typeof(this.chess_board[(ix+i)+','+(iy+i)]) == 'undefined')
					{
						end_1 = (ix+i)+','+(iy+i);

						break;
					}
					else if(this.chess_board[(ix+i)+','+(iy+i)] == color)
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
						if(color == 2)
						{
							this.white_alive.push([end_0,end_1]);
						}
						else
						{
							this.black_alive.push([end_0,end_1]);
						}
					}
				}

				if(count == 3)
				{
					if(end_0 != '' && end_1 != '')
					{
						if(color == 2)
						{
							this.white_three.push([end_0,end_1]);
						}
						else
						{
							this.black_three.push([end_0,end_1]);
						}
					}

					if(end_0 != '' && this.chess_board[(Number(end_0.split(',')[0])-1)+','+(Number(end_0.split(',')[1])-1)] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}

					if(end_1 != '' && this.chess_board[(Number(end_1.split(',')[0])+1)+','+(Number(end_1.split(',')[1])+1)] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				if(count == 4)
				{
					if(end_0 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}

					if(end_1 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				count = 1;
				end_0 = '';
				end_1 = '';

				for(var i = -1;i >= dy_min;i--)
				{
					if(typeof(this.chess_board[ix+','+(iy+i)]) == 'undefined')
					{
						end_0 = ix+','+(iy+i);

						break;
					}
					else if(this.chess_board[ix+','+(iy+i)] == color)
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
					if(typeof(this.chess_board[ix+','+(iy+i)]) == 'undefined')
					{
						end_1 = ix+','+(iy+i);

						break;
					}
					else if(this.chess_board[ix+','+(iy+i)] == color)
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
						if(color == 2)
						{
							this.white_alive.push([end_0,end_1]);
						}
						else
						{
							this.black_alive.push([end_0,end_1]);
						}
					}
				}

				if(count == 3)
				{
					if(end_0 != '' && end_1 != '')
					{
						if(color == 2)
						{
							this.white_three.push([end_0,end_1]);
						}
						else
						{
							this.black_three.push([end_0,end_1]);
						}
					}
					
					if(end_0 != '' && this.chess_board[ix+','+(Number(end_0.split(',')[1])-1)] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}
					
					if(end_1 != '' && this.chess_board[ix+','+(Number(end_1.split(',')[1])+1)] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				if(count == 4)
				{
					if(end_0 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}

					if(end_1 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				count = 1;
				end_0 = '';
				end_1 = '';

				for(var i = -1;i >= dx_min;i--)
				{
					if(-i > dy_max) break;

					if(typeof(this.chess_board[(ix+i)+','+(iy-i)]) == 'undefined')
					{
						end_0 = (ix+i)+','+(iy-i);

						break;
					}
					else if(this.chess_board[(ix+i)+','+(iy-i)] == color)
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

					if(typeof(this.chess_board[(ix+i)+','+(iy-i)]) == 'undefined')
					{
						end_1 = (ix+i)+','+(iy-i);

						break;
					}
					else if(this.chess_board[(ix+i)+','+(iy-i)] == color)
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
						if(color == 2)
						{
							this.white_alive.push([end_0,end_1]);
						}
						else
						{
							this.black_alive.push([end_0,end_1]);
						}
					}
				}

				if(count == 3)
				{
					if(end_0 != '' && end_1 != '')
					{
						if(color == 2)
						{
							this.white_three.push([end_0,end_1]);
						}
						else
						{
							this.black_three.push([end_0,end_1]);
						}
					}

					if(end_0 != '' && this.chess_board[(Number(end_0.split(',')[0])-1)+','+(Number(end_0.split(',')[1])+1)] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}

					if(end_1 != '' && this.chess_board[(Number(end_1.split(',')[0])+1)+','+(Number(end_1.split(',')[1])-1)] == color)
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				if(count == 4)
				{
					if(end_0 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_0);
						}
						else
						{
							this.black_final.push(end_0);
						}
					}

					if(end_1 != '')
					{
						if(color == 2)
						{
							this.white_final.push(end_1);
						}
						else
						{
							this.black_final.push(end_1);
						}
					}
				}

				return true;
			}
		}

		boardGuide(color) {
			var white_high_score = 0;
			var white_high_place = Array();

			var black_high_score = 0;
			var black_high_place = Array();

			var point_pre = Array();
			var point_use = Array();

			if(color == 2)
			{
				if(this.white_final.length > 0)
				{
					for(var k in this.white_final)
					{
						if(typeof(this.chess_board[this.white_final[k]]) != 'undefined') continue;

						return this.white_final[k];
					}
				}

				if(this.black_final.length > 0)
				{
					for(var k in this.black_final)
					{
						if(typeof(this.chess_board[this.black_final[k]]) != 'undefined') continue;

						return this.black_final[k];
					}
				}

				if(this.white_ready.length > 0)
				{
					for(var k in this.white_ready)
					{
						if(typeof(this.chess_board[this.white_ready[k]]) != 'undefined') continue;

						return this.white_ready[k];
					}
				}

				if(this.black_ready.length > 0)
				{
					for(var k in this.black_ready)
					{
						if(typeof(this.chess_board[this.black_ready[k]]) != 'undefined') continue;

						return this.black_ready[k];
					}
				}

				if(this.white_three.length > 0)
				{
					for(var k in this.white_three)
					{
						if(typeof(this.chess_board[this.white_three[k][0]]) != 'undefined' || typeof(this.chess_board[this.white_three[k][1]]) != 'undefined') continue;

						if(this.white_board[this.white_three[k][0]] > this.white_board[this.white_three[k][1]])
						{
							return this.white_three[k][0];
						}
						else
						{
							return this.white_three[k][1];
						}
					}
				}

				if(this.black_three.length > 0)
				{
					for(var k in this.black_three)
					{
						if(typeof(this.chess_board[this.black_three[k][0]]) != 'undefined' || typeof(this.chess_board[this.black_three[k][1]]) != 'undefined') continue;

						if(this.black_board[this.black_three[k][0]] > this.black_board[this.black_three[k][1]])
						{
							return this.black_three[k][0];
						}
						else
						{
							return this.black_three[k][1];
						}
					}
				}

				if(this.white_alive.length > 0)
				{
					point_pre = Array();

					for(var k in this.white_alive)
					{
						if(typeof(this.chess_board[this.white_alive[k][0]]) != 'undefined' || typeof(this.chess_board[this.white_alive[k][1]]) != 'undefined') continue;

						point_pre.push(this.white_alive[k][0]);
						point_pre.push(this.white_alive[k][1]);
					}

					if(point_pre.length > 0)
					{
						point_use = Array();

						for(var k in point_pre)
						{
							if(this.white_board[point_pre[k]] > white_high_score)
							{
								white_high_score = this.white_board[point_pre[k]];

								point_use = Array();
								point_use.push(point_pre[k]);
							}
							else if(this.white_board[point_pre[k]] == white_high_score)
							{
								point_use.push(point_pre[k]);
							}
						}

						if(point_use.length > 0)
						{
							if(point_use.length == 1)
							{
								return point_use[0];
							}
							else
							{
								for(var k in point_use)
								{
									if(this.black_board[point_use[k]] > black_high_score)
									{
										black_high_score = this.black_board[point_use[k]];

										black_high_place = Array();
										black_high_place.push(point_use[k]);
									}
									else if(this.black_board[point_use[k]] == black_high_score)
									{
										black_high_place.push(point_use[k]);
									}
								}

								return black_high_place[Math.floor(Math.random()*black_high_place.length)];
							}
						}
					}
				}
			}
			else
			{
				if(this.black_final.length > 0)
				{
					for(var k in this.black_final)
					{
						if(typeof(this.chess_board[this.black_final[k]]) != 'undefined') continue;

						return this.black_final[k];
					}
				}

				if(this.white_final.length > 0)
				{
					for(var k in this.white_final)
					{
						if(typeof(this.chess_board[this.white_final[k]]) != 'undefined') continue;

						return this.white_final[k];
					}
				}

				if(this.black_ready.length > 0)
				{
					for(var k in this.black_ready)
					{
						if(typeof(this.chess_board[this.black_ready[k]]) != 'undefined') continue;

						return this.black_ready[k];
					}
				}

				if(this.white_ready.length > 0)
				{
					for(var k in this.white_ready)
					{
						if(typeof(this.chess_board[this.white_ready[k]]) != 'undefined') continue;

						return this.white_ready[k];
					}
				}

				if(this.black_three.length > 0)
				{
					for(var k in this.black_three)
					{
						if(typeof(this.chess_board[this.black_three[k][0]]) != 'undefined' || typeof(this.chess_board[this.black_three[k][1]]) != 'undefined') continue;

						if(this.black_board[this.black_three[k][0]] > this.black_board[this.black_three[k][1]])
						{
							return this.black_three[k][0];
						}
						else
						{
							return this.black_three[k][1];
						}
					}
				}

				if(this.white_three.length > 0)
				{
					for(var k in this.white_three)
					{
						if(typeof(this.chess_board[this.white_three[k][0]]) != 'undefined' || typeof(this.chess_board[this.white_three[k][1]]) != 'undefined') continue;

						if(this.white_board[this.white_three[k][0]] > this.white_board[this.white_three[k][1]])
						{
							return this.white_three[k][0];
						}
						else
						{
							return this.white_three[k][1];
						}
					}
				}

				if(this.black_alive.length > 0)
				{
					point_pre = Array();

					for(var k in this.black_alive)
					{
						if(typeof(this.chess_board[this.black_alive[k][0]]) != 'undefined' || typeof(this.chess_board[this.black_alive[k][1]]) != 'undefined') continue;

						point_pre.push(this.black_alive[k][0]);
						point_pre.push(this.black_alive[k][1]);
					}

					if(point_pre.length > 0)
					{
						point_use = Array();

						for(var k in point_pre)
						{
							if(this.black_board[point_pre[k]] > black_high_score)
							{
								black_high_score = this.black_board[point_pre[k]];

								point_use = Array();
								point_use.push(point_pre[k]);
							}
							else if(this.black_board[point_pre[k]] == black_high_score)
							{
								point_use.push(point_pre[k]);
							}
						}

						if(point_use.length > 0)
						{
							if(point_use.length == 1)
							{
								return point_use[0];
							}
							else
							{
								for(var k in point_use)
								{
									if(this.white_board[point_use[k]] > white_high_score)
									{
										white_high_score = this.white_board[point_use[k]];

										white_high_place = Array();
										white_high_place.push(point_use[k]);
									}
									else if(this.white_board[point_use[k]] == white_high_score)
									{
										white_high_place.push(point_use[k]);
									}
								}

								return white_high_place[Math.floor(Math.random()*white_high_place.length)];
							}
						}
					}
				}
			}

			for(var xy in this.white_board)
			{
				if(this.white_board[xy] > white_high_score)
				{
					white_high_score = this.white_board[xy];

					white_high_place = Array();
					white_high_place.push(xy);
				}
				else if(this.white_board[xy] == white_high_score)
				{
					white_high_place.push(xy);
				}
			}

			for(var xy in this.black_board)
			{
				if(this.black_board[xy] > black_high_score)
				{
					black_high_score = this.black_board[xy];

					black_high_place = Array();
					black_high_place.push(xy);
				}
				else if(this.black_board[xy] == black_high_score)
				{
					black_high_place.push(xy);
				}
			}

			// console.log('white:'+white_high_score);console.log(white_high_place);
			// console.log('black:'+black_high_score);console.log(black_high_place);

			if(color == 2)
			{
				if(black_high_score > white_high_score)
				{
					if(black_high_place.length == 1)
					{
						return black_high_place[0];
					}
					else
					{
						point_use = Array();

						white_high_score = 0;

						for(var k in black_high_place)
						{
							if(this.white_board[black_high_place[k]] > white_high_score)
							{
								white_high_score = this.white_board[black_high_place[k]];

								point_use = Array();
								point_use.push(black_high_place[k]);
							}
							else if(this.white_board[black_high_place[k]] == white_high_score)
							{
								point_use.push(black_high_place[k]);
							}
						}

						return point_use[Math.floor(Math.random()*point_use.length)];
					}
				}
				else
				{
					if(white_high_place.length == 1)
					{
						return white_high_place[0];
					}
					else
					{
						point_use = Array();

						black_high_score = 0;

						for(var k in white_high_place)
						{
							if(this.black_board[white_high_place[k]] > black_high_score)
							{
								black_high_score = this.black_board[white_high_place[k]];

								point_use = Array();
								point_use.push(white_high_place[k]);
							}
							else if(this.black_board[white_high_place[k]] == black_high_score)
							{
								point_use.push(white_high_place[k]);
							}
						}

						return point_use[Math.floor(Math.random()*point_use.length)];
					}
				}
			}
			else
			{
				if(white_high_score > black_high_score)
				{
					if(white_high_place.length == 1)
					{
						return white_high_place[0];
					}
					else
					{
						point_use = Array();

						black_high_score = 0;

						for(var k in white_high_place)
						{
							if(this.black_board[white_high_place[k]] > black_high_score)
							{
								black_high_score = this.black_board[white_high_place[k]];

								point_use = Array();
								point_use.push(white_high_place[k]);
							}
							else if(this.black_board[white_high_place[k]] == black_high_score)
							{
								point_use.push(white_high_place[k]);
							}
						}

						return point_use[Math.floor(Math.random()*point_use.length)];
					}
				}
				else
				{
					if(black_high_place.length == 1)
					{
						return black_high_place[0];
					}
					else
					{
						point_use = Array();

						white_high_score = 0;

						for(var k in black_high_place)
						{
							if(this.white_board[black_high_place[k]] > white_high_score)
							{
								white_high_score = this.white_board[black_high_place[k]];

								point_use = Array();
								point_use.push(black_high_place[k]);
							}
							else if(this.white_board[black_high_place[k]] == white_high_score)
							{
								point_use.push(black_high_place[k]);
							}
						}

						return point_use[Math.floor(Math.random()*point_use.length)];
					}
				}
			}
		}

		isWin(color,x,y) {
			var chess_board = this.state.board,x2,y2,x3,y3,x4,y4;

			for(var o_x = -1;o_x <= 1;o_x++)
			{
				for(var o_y = -1;o_y <= 1;o_y++)
				{
					if(o_x == 0 && o_y == 0) continue;

					x2 = x + o_x;
					y2 = y + o_y;

					if(x2 < 0 || x2 > 14 || y2 < 0 || y2 > 14) continue;

					if(typeof(chess_board[x2][y2]) != 'undefined')
					{
						if(chess_board[x2][y2].color == color)
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
									else if(typeof(chess_board[x3][y3]) != 'undefined')
									{
										if(chess_board[x3][y3].color == color)
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
									else if(typeof(chess_board[x4][y4]) != 'undefined')
									{
										if(chess_board[x4][y4].color == color)
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
								this.winner = color;

								this.last_c = 0;

								return color;
							}
						}
					}
				}
			}

			return 0;
		}
	}
});