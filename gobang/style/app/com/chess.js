reactboot(function(){
	class Chess extends React.Component {
		constructor(props) {
			super(props);
		}

		render() {
			return evalJSX(`
				{this.props.color == 1 ? (<img src="style/app/img/_chess_black.png"/>) : (this.props.color == 2 ? (<img src="style/app/img/_chess_white.png"/>) : '')}
			`,{this: this});
		}
	}
});