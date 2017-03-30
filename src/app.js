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


$(() => {
  $.ajax(base_url + '/user/orgs')
    .done(data => {
      data.forEach(org => {
        var el = $('<div></div>')
        el.text(org.login)
        el.data('id', org.login)
        $('.orgs').append(el)
      })
    })
});

$('.orgs').on('click', e => {
    var el = $(e.target)
    var id = el.data('id')

    $.ajax(base_url + '/orgs/' + id + '/teams')
      .done(data => {
        $('.orgs').empty()

        data.forEach(team => {
          var el = $('<div></div>')
          el.text(team.name)
          el.data('id', team.id)
          $('.teams').append(el)
        })
      })
});

$('.teams').on('click', e => {
    var el = $(e.target)
    var id = el.data('id')

    $.ajax(base_url + '/teams/' + id + '/repos')
      .done(data => {
        $('.teams').empty()

        setup_timer(data)
      })
});

function setup_timer (repos) {
  setInterval(update, 5 * 60 * 1000, repos)
  update(repos)
}

function update (repos) {
  console.log('updating..')
  $('.pull-requests').empty()

  repos.forEach(repo => {
    fetch_pull_requests(repo.owner.login, repo.name)
  })
}

function fetch_pull_requests (owner, repo) {
  $.ajax(base_url + '/repos/' + owner + '/' + repo + '/pulls')
    .done(data => {
      data.forEach(pull => {
        var avatar = $('<img />')
        avatar.attr('src', pull.user.avatar_url)

        var link = $('<a />')
        link.attr('href', pull.html_url)
        link.attr('target', '_blank')
        link.text(pull.title)

        var el = $('<div />')
        el.append(avatar)
        el.append(link)
        $('.pull-requests').append(el)
      })
    })
}
