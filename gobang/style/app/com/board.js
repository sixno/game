reactboot('grid',function(){
	class Board extends React.Component {
		constructor(props) {
			super(props);

			var board = [];

			for(var i = 0;i < 15;i++)
			{
				if(typeof(board[i]) == 'undefined') board[i] = [];

				for(var j = 0;j < 15;j++)
				{
					board[i][j] = {check: 0,color: 0};
				}
			}

			this.state = {
				board: board
			}
		}

		render() {
			return evalJSX(`
				<div>
					<Grid board={this.state.board}/>
				</div>
			`,{this: this});
		}
	}
});