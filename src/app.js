import React from 'react'
import ReactDOM from 'react-dom'

const accessToken = document.location.search.substr(1)
const baseUrl = 'https://api.github.com'
const options = {
    headers: {
        'Authorization': 'token ' + accessToken,
        'Accept': 'application/vnd.github.v3+json'
    }
}

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
        return <div style={{flex: "1", display: "flex", flexDirection: "row"}}>
            {this.state.orgs.map(org =>
                <div key={org.login}>
                    <button onClick={() => console.log(`selected org ${org.login}`)}>{org.login}</button>
                </div>
            )}
        </div>
    }
}

ReactDOM.render(
    <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
        <OrgSelector accessToken={accessToken} />
        <div style={{textAlign: "center"}}>Made with ❤️ by <a href="https://github.com/jaramir/ghpr">Jaramir</a></div>
    </div>,
    document.getElementById('root')
);