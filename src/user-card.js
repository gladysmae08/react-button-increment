import React from 'react';

const Card = (props) => {
    return (
        <div style={{ margin: '1em' }}>
            <img width="75" src={props.avatar} alt={props.avatar} />
            <div style={{ display: 'inline-block', marginLeft: 10 }}>
                <div style={{ fontSize: '1.25em', fontWeight: 'bold' }}>{props.name}</div>
                <div>{props.company}</div>
            </div>
        </div>
    );
}

const CardList = (props) => {
    return (
        <div>
            {props.cards.map(card => <Card key={card.name} {...card} />)}
        </div>
    );
}

var axios = require('axios');


class Form extends React.Component {
    state = {
        userName: ''
    }


    onFormSubmit = (event) => {
        event.preventDefault();
        axios.get(`https://api.github.com/users/${this.state.userName}`)
            .then(
            resp => {
                this.props.onSubmit(resp.data);
                this.setState({ userName: '' })
            });
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <input type="text"
                    value={this.state.userName}
                    onChange={(event) => this.setState({ userName: event.target.value })}
                    placeholder="Github username" />
                <button type="submit">Add User</button>
            </form>
        );
    }
}

class GithubApp extends React.Component {
    state = {
        githubUsers: []
    };

    addNewUserCard = (userInfo) => {
        this.setState(prevState => ({
            githubUsers: prevState.githubUsers.concat({ name: userInfo.name, company: userInfo.company, avatar: userInfo.avatar_url })
        }));
    };

    render() {
        return (
            <div>
                <Form onSubmit={this.addNewUserCard} />
                <CardList cards={this.state.githubUsers} />
            </div>
        );
    };
}

export default GithubApp;