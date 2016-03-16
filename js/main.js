
var audioP = document.getElementById('lelePlayer');
var MyShazam = {
  Init: function() {
    MyShazam.Get();
    MyShazam.Play();
  },
  Get: function() {
    var $tracklist = $("#tracklist");
    $.ajax({
      type: 'GET',
      url: 'js/shazam.json',
      success: function(resp) {
        resp.forEach(function(value) {
          MyShazam.Append(value, $tracklist);
        });

        MyShazam.Pagination.Init();
      }
    });
  },
  Append: function(data, parent) {
    var tracksTemplate = "" +
      "<li>" +
      "<h3>{{artist}}</h3>" +
      "<p>{{title}}</p>" +
      "<button data-track='{{ artist }} {{ title }}'>Play</button>" +
      "</li>";

    parent.append(Mustache.render(tracksTemplate, data));
  },
  Play: function() {
    $('#tracklist').on('click', 'button', function() {
      var dataTrack = $(this).data('track');
      MyShazam.Spotify.Init(dataTrack);
    });
  },
  Pagination: {
    Init: function() {
      MyShazam.Pagination.Settings();
      MyShazam.Pagination.Nav();
    },
    Settings: function() {
      tracksItem = $('#tracklist li');
      tracksLength = tracksItem.length;
      tracksItemPerPage = 10;
      tracksPageCount = 0;

      MyShazam.Pagination.Start();
    },
    Start: function() {
      if (tracksLength > tracksItemPerPage) {
        tracksItem.hide();
        tracksItem.slice(0, tracksItemPerPage).show();
        tracksPageCount = Math.ceil(tracksLength / tracksItemPerPage);
        currentPage = 1;
      }
      MyShazam.Pagination.Pages();
    },
    Pages: function() {
      $('.tracks_pages').html('<span>' + currentPage + ' of ' + tracksPageCount + '</span>');
    },
    Nav: function() {
      $('.btn-next').click(function() {
        if (currentPage == tracksPageCount) {
          MyShazam.Pagination.Start();
          MyShazam.Pagination.Pages();
        } else {
          var first = tracksItemPerPage * currentPage;
          var last = (tracksItemPerPage * currentPage) + tracksItemPerPage;
          tracksItem.hide();
          tracksItem.slice(first, last).show();
          currentPage++;
          MyShazam.Pagination.Pages();
        }
      });

      $('.btn-prev').click(function() {
        if (currentPage == 1) {
          App.Utils.trackss.End();
          App.Utils.trackss.Pagination();
        } else {
          var last = (tracksItemPerPage * currentPage) - tracksItemPerPage;
          var first = (last - tracksItemPerPage);
          tracksItem.hide();
          tracksItem.slice(first, last).show();
          currentPage--;
          MyShazam.Pagination.Pages();
        }
      });
    }
  },
  Spotify: {
    Init: function(track) {
        if (typeof $('#isplaying').attr('data-playing') !== 'undefined') {
          MyShazam.Spotify.Stop($('#isplaying').data('playing'));
        }
      MyShazam.Spotify.Get(track);

    },
    IsPlaying: function(preview) {
      audioP.src = preview;
      audioP.play();
    },
    Stop: function(track) {
      audioP.pause();
    },
    Get: function(query) {
      $.ajax({
        type: 'GET',
        url: 'https://api.spotify.com/v1/search',
        data: {
          q: query,
          type: "track"
        },
        success: function(resp) {
          var preview = resp.tracks.items[0].preview_url;
          MyShazam.Spotify.IsPlaying(preview);
          $('#isplaying').attr('data-playing', preview);
        }
      });
    }
  }
};

MyShazam.Init();
