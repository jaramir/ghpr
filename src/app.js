import React from 'react'
import ReactDOM from 'react-dom'
import parseLink from 'parse-link-header'
import flatten from 'array-flatten'

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
        }
        this.update = this.update.bind(this)
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
        const newState = Object.assign({}, this.state, {team: id})
        this.setState(newState, this.update)
        this.setupTimer()
    }

    setupTimer() {
        setInterval(this.update.bind(this), 5 * 60 * 1000)
    }

    teamRepos() {
      function fetchPage (url) {
        return fetch(url, options)
          .then(response => {
            const next = parseLink(response.headers.get("Link")).next

            if (next) {
              return Promise.all([response.json(), fetchPage(next.url)])
            } else {
              return response.json()
            }
          })
      }

      return fetchPage(baseUrl + '/teams/' + this.state.team + '/repos?per_page=50')
        .then(response => flatten(response))
    }

    update() {
        this.teamRepos()
            .then(repos =>
                Promise.all(repos
                    .filter(repo => repo.permissions.admin)
                    .map(repo =>
                        fetch(`${baseUrl}/repos/${repo.owner.login}/${repo.name}/pulls`, options)
                            .then(response => response.json())))
                     .then(reponses => {
                        let pullRequests = flatten(reponses)
                       this.setState(Object.assign({}, this.state, {pullRequests}))
                    }))
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
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center",
                        border: "1px solid lightgrey", borderRadius: "4px",
                        margin: ".5em", backgroundColor: "white"}}
                        key={pr.id}>
                        <img src={pr.user.avatar_url} style={{height: "50px", width: "50px", margin: ".5em"}}/>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <a style={{textDecoration: "none", color: "#02779E"}}
                                href={pr.html_url} target="_blank">{pr.title}</a>
                            <span style={{color: "#333", fontSize: "small"}}>{pr.base.repo.full_name}</span>
                            <span style={{color: "#333", fontSize: "small"}}>{pr.created_at}</span>
                        </div>
                    </div>
                )
            }
            { this.state.org !== null && this.state.team !== null &&
              <button style={{margin: "1em", padding: ".5em"}} onClick={this.update}>Update now</button>
            }
        </div>
    }
}

ReactDOM.render(
    <Ghpr />,
    document.getElementById('root')
);
