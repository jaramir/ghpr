var access_token = document.location.search.substr(1);
$.ajaxSetup({
  accepts: {
    'github': 'application/vnd.github.v3+json'
  },
  headers: {
    'Authorization': 'token ' + access_token
  }
});
var base_url = 'https://api.github.com';

function fetch_orgs () {
  $.ajax(base_url + '/user/orgs')
    .done(function (data) {
      data.forEach(function (org) {
        var el = $("<div></div>")
        el.text(org.login)
        el.data("id", org.login)
        $('.orgs').append(el)
      })
    })
}

function fetch_teams (org) {
  $.ajax(base_url + '/orgs/' + org + '/teams')
    .done(function (data) {
      $('.teams').empty()

      data.forEach(function (team) {
        var el = $("<div></div>")
        el.text(team.name)
        el.data("id", team.id)
        $('.teams').append(el)
      })
    })
}

function fetch_repos (team) {
  $.ajax(base_url + '/teams/' + team + '/repos')
    .done(function (data) {
      $('.pull-requests').empty()

      data.forEach(function (repo) {
        fetch_pull_requests(repo.owner.login, repo.name)
      })
    })
}

function fetch_pull_requests (owner, repo) {
  $.ajax(base_url + '/repos/' + owner + '/' + repo + '/pulls')
    .done(function (data) {
      data.forEach(function (pull) {
        var el = $("<div></div>")
        el.text(pull.title)
        $('.pull-requests').append(el)
      })
    })
}

$('.orgs').on('click', function (e) {
    var el = $(e.target)
    var id = el.data("id")

    fetch_teams(id);
});

$('.teams').on('click', function (e) {
    var el = $(e.target)
    var id = el.data("id")

    fetch_repos(id)
});

$(function() {
  fetch_orgs()
});
