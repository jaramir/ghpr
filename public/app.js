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

$('.orgs').on('click', function (e) {
    var el = $(e.target)
    var id = el.data("id")

    $.ajax(base_url + '/orgs/' + id + '/teams')
      .done(function (data) {
        $('.teams').empty()

        data.forEach(function (team) {
          var el = $("<div></div>")
          el.text(team.name)
          el.data("id", team.id)
          $('.teams').append(el)
        })
      })
});

$('.teams').on('click', function (e) {
    var el = $(e.target)
    var id = el.data("id")

    $.ajax(base_url + '/teams/' + id + '/repos')
      .done(function (data) {
        $('.repos').empty()

        data.forEach(function (repo) {
          var el = $("<div></div>")
          el.text(repo.name)
          $('.repos').append(el)
        })
      })
});

$(function() {
  $.ajax(base_url + '/user/orgs')
    .done(function (data) {
      data.forEach(function (org) {
        var el = $("<div></div>")
        el.text(org.login)
        el.data("id", org.login)
        $('.orgs').append(el)
      })
    })
});
