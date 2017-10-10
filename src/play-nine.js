import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

var possibleCombinationSum = function (arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
        arr.pop();
        return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount; i++) {
        var combinationSum = 0;
        for (var j = 0; j < listSize; j++) {
            if (i & (1 << j)) { combinationSum += arr[j]; }
        }
        if (n === combinationSum) { return true; }
    }
    return false;
};

const Stars = (props) => {
    let stars = [];
    for (let i = 0; i < props.numberOfStars; i++) {
        stars.push(<i key={i} className="fa fa-star"></i>)
    }
    return (
        <div className="col-5">
            {stars}
        </div>
    );
}

const Button = (props) => {
    let button;
    switch (props.answerIsCorrect) {
        case true:
            button =
                <button className="btn btn-success"
                    disabled={props.doneStatus !== 0}>
                    <i className="fa fa-check"></i>
                </button>
            break;
        case false:
            button =
                <button className="btn btn-danger"
                    disabled={props.doneStatus !== 0}>
                    <i className="fa fa-times"></i>
                </button >
            break;
        default:
            button =
                <button className="btn" disabled={props.doneStatus !== 0 || props.selectedNumbers.length === 0}
                    onClick={props.onAnswerChecked} >
                    =
                </button>
    }
    return (
        <div className="col-2 text-center">
            {button}
            <br /><br />
            <button className="btn btn-warning btn-sm"
                onClick={props.redraw}
                disabled={props.doneStatus !== 0 || props.redraws === 0}>
                <i className="fa fa-refresh"></i> {props.redraws}
            </button>
        </div>
    );
}

const Answer = (props) => {
    return (
        <div className="col-5">
            {props.selectedNumbers.map((number, i) =>
                <span key={i} onClick={() => props.onNumberClicked(number)}>
                    {number}
                </span>
            )}
        </div>
    );
}

const Numbers = (props) => {
    const getClassName = (number) => {
        if (props.usedNumbers.indexOf(number) >= 0) {
            return "used";
        }
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return "selected";
        }
    }
    return (
        <div className="card text-center">
            <div>
                {Numbers.list.map((number, i) =>
                    <span key={i} className={getClassName(number)}
                        onClick={() => props.onNumberClicked(number)}>
                        {number}
                    </span>
                )}
            </div>
        </div>
    );
}

const DoneFrame = (props) => {
    let text = '', className = '';
    switch (props.doneStatus) {
        case 1:
            text = 'Done. Nice!';
            className = 'text-success';
            break;
        case 2:
            text = 'Game Over!!!';
            className = 'text-danger';
            break;
        case 3:
            text = 'Time\'s Up!!!';
            className = 'text-danger';
            break;
        default:
    }
    return (
        <div className="text-center">
            <h2 className={className}>{text}</h2>
            <button className="btn btn-secondary"
                onClick={props.resetGame}>
                Play Again
            </button>
        </div>
    );
}

const Timer = (props) => {
    return (
        <h3>
            {props.timeRemaining} seconds left
        </h3>
    );
}

Numbers.list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Game extends React.Component {
    static getRandomNumber = () => 1 + Math.floor(Math.random() * 9);
    static getInitialState = () => ({
        selectedNumbers: [],
        usedNumbers: [],
        numberOfStars: Game.getRandomNumber(),
        answerIsCorrect: null,
        redraws: 5,
        doneStatus: 0,   //0-in progress, 1-success, 2-game over, 3-times up
        timeRemaining: 30,
        timerId: null,
    });

    initializeTimer = () => {
        var intervalId = setInterval(this.updateTimer, 1000);
        this.setState({ timerId: intervalId });
    };
    state = Game.getInitialState();

    componentDidMount = () => {
        this.setState(Game.getInitialState());
        this.initializeTimer();
    }

    selectNumber = (clickedNumber) => {
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) return;
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    }

    unSelectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
        }));
    }

    checkAnswer = () => {
        if (this.state.numberOfStars ===
            this.state.selectedNumbers.reduce((acc, n) => acc + n, 0)) {
            this.acceptAnswer();
        } else {
            this.setState(prevState => ({
                answerIsCorrect: false
            }));
        }
    }

    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            answerIsCorrect: null,
            numberOfStars: Game.getRandomNumber()
        }), this.updateDoneStatus);
    }

    redraw = () => {
        if (this.state.redraws !== 0) {
            this.setState(prevState => ({
                selectedNumbers: [],
                answerIsCorrect: null,
                numberOfStars: Game.getRandomNumber(),
                redraws: prevState.redraws - 1
            }), this.updateDoneStatus);
        }
    }

    hasPossibleSolutions = ({ numberOfStars, usedNumbers }) => {
        const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(number =>
            usedNumbers.indexOf(number) === -1
        );

        return possibleCombinationSum(possibleNumbers, numberOfStars);
    }

    updateDoneStatus = () => {
        this.setState(prevState => {
            if (prevState.usedNumbers.length === 9) {
                clearTimeout(this.state.timerId);
                return { doneStatus: 1 }
            }

            if (prevState.redraws === 0 && !this.hasPossibleSolutions(prevState)) {
                clearTimeout(this.state.timerId);
                return { doneStatus: 2 }
            }
        });
    }

    resetGame = () => {
        this.setState(Game.getInitialState());
        this.initializeTimer();
    }

    updateTimer = () => {
        let doneStatus = 0;
        let newTimeRemaining = this.state.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
            clearTimeout(this.state.timerId);
            doneStatus = 3;
        }

        this.setState({
            doneStatus: doneStatus,
            timeRemaining: newTimeRemaining
        });
    }

    render() {
        const {
            selectedNumbers,
            usedNumbers,
            numberOfStars,
            answerIsCorrect,
            redraws,
            doneStatus,
            timeRemaining } = this.state;
        return (
            <div className="container">
                <h3>Play Nine</h3>
                <hr />
                <Timer timeRemaining={timeRemaining} />
                <div className="row">
                    <Stars numberOfStars={numberOfStars} />
                    <Button selectedNumbers={selectedNumbers}
                        answerIsCorrect={answerIsCorrect}
                        onAnswerChecked={this.checkAnswer}
                        redraw={this.redraw}
                        redraws={redraws}
                        doneStatus={doneStatus} />
                    <Answer selectedNumbers={selectedNumbers}
                        onNumberClicked={this.unSelectNumber} />
                </div>
                <br />
                {doneStatus ?
                    <DoneFrame doneStatus={doneStatus}
                        resetGame={this.resetGame} /> :
                    <Numbers selectedNumbers={selectedNumbers}
                        usedNumbers={usedNumbers}
                        onNumberClicked={this.selectNumber} />
                }
            </div>
        );
    }
}

class PlayNineApp extends React.Component {
    render() {
        return (
            <div>
                <Game />
            </div>
        );
    }
}

export default PlayNineApp;