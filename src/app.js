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

const Selector = (props) => <div>
    {props.options.map(option =>
        <div style={{display: "inline-block"}} key={props.getId(option)}>
            <button
                style={{
                    padding: ".5em",
                    margin: ".5em",
                    whiteSpace: "nowrap",
                    fontSize: "large"
                }}
                onClick={() => props.onSelect(props.getId(option))}>
                {props.getText(option)}
            </button>
        </div>
    )}
</div>

const OrgSelector = (props) => <Selector
    options={props.orgs}
    getId={org => org.login}
    getText={org => org.login}
    onSelect={props.onOrgSelected}/>

const TeamSelector = (props) => <Selector
    options={props.teams}
    getId={team => team.id}
    getText={team => team.name}
    onSelect={props.onTeamSelected}/>

function flatten(arrayOfArrays) {
    return arrayOfArrays.reduce(
        (acc, cur) => acc.concat(cur),
        []
    )
}

class Ghpr extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgs: [],
            org: null,
            teams: [],
            team: null,
            repos: [],
            pullRequests: [],
            lastUpdated: null
        }
    }

    componentWillMount() {
        fetch(baseUrl + '/user/orgs', options)
            .then(reponse => reponse.json()
                .then(orgs => this.setState(Object.assign({}, this.state, {orgs}))))
    }

    onOrgSelected(login) {
        this.setState(Object.assign({}, this.state, {org: login}))
        fetch(baseUrl + '/orgs/' + login + '/teams', options)
            .then(reponse => reponse.json()
                .then(teams => this.setState(Object.assign({}, this.state, {teams}))))
    }

    onTeamSelected(id) {
        this.setState(Object.assign({}, this.state, {team: id}))

        fetch(baseUrl + '/teams/' + id + '/repos', options)
            .then(reponse => reponse.json()
                .then(repos => {
                    this.setState(Object.assign({}, this.state, {repos}))
                    this.update()
                    this.setupTimer()
                }))

    }

    setupTimer() {
        setInterval(this.update.bind(this), 5 * (60-59) * 1000)
    }

    update() {
        Promise.all(
            this.state.repos.map(repo =>
                fetch(`${baseUrl}/repos/${repo.owner.login}/${repo.name}/pulls`, options)
                    .then(response => response.json())))
            .then(reponses => {
                let pullRequests = flatten(reponses)
                let lastUpdated = new Date()
                this.setState(Object.assign({}, this.state, {pullRequests, lastUpdated}))
            })
    }

    render() {
        return <div>
            { this.state.org === null &&
                <OrgSelector
                    orgs={this.state.orgs}
                    onOrgSelected={this.onOrgSelected.bind(this)}/>
            }
            { this.state.org !== null && this.state.team === null &&
                <TeamSelector
                    teams={this.state.teams}
                    onTeamSelected={this.onTeamSelected.bind(this)}/>
            }
            { this.state.org !== null && this.state.team !== null &&
                this.state.pullRequests.map(pr =>
                    <div>
                        <img src={pr.user.avatar_url} style={{height: "50px", width: "50px"}}/>
                        <a href={pr.html_url} target="_blank">{pr.title}</a>
                    </div>
                )
            }
            {this.state.lastUpdated &&
                <div style={{position: "fixed", bottom: 0, left: "2px", fontSize: "small"}}>
                    Last updated: {this.state.lastUpdated + ""}
                </div>
            }
            <div style={{position: "fixed", bottom: 0, right: "2px", fontSize: "small"}}>
                Made with ❤️ by <a href="https://github.com/jaramir/ghpr">Jaramir</a>
            </div>
        </div>
    }
}

ReactDOM.render(
    <Ghpr />,
    document.getElementById('root')
);