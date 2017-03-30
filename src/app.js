import React from 'react';
import ReactDOM from 'react-dom';

const accessToken = document.location.search.substr(1);
const baseUrl = 'https://api.github.com';
const options = {
    headers: {
        'Authorization': 'token ' + accessToken,
        'Accept': 'application/vnd.github.v3+json'
    }
};

class OrgSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgs: []
        }
    }

    componentWillMount() {
        fetch(baseUrl + '/user/orgs', options)
            .then(reponse => reponse.json()
                .then(orgs => this.setState({
                    orgs
                })))
    }

    render() {
        return <div>
            {this.state.orgs.map(org =>
                <div>{org.login}</div>
            )}
        </div>
    }
}

ReactDOM.render(
    <OrgSelector accessToken={accessToken}/>,
    document.getElementById('root')
);