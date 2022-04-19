//Add lazyload to all videos
document.addEventListener("DOMContentLoaded", function() {
      var lazyVideos = [].slice.call(document.querySelectorAll("video"));
      if ("IntersectionObserver" in window) {
            let lazyVideoObserver = new IntersectionObserver(function(
                  entries,
                  observer
            ) {
                  entries.forEach(function(video) {
                        if (video.isIntersecting) {
                              let source = video.target.getAttribute("data-src");
                              video.target.setAttribute("src", source);
                              video.target.classList.remove("lazy");
                              lazyVideoObserver.unobserve(video.target);
                        }
                  });
            });

            lazyVideos.forEach(function(video) {
                  lazyVideoObserver.observe(video);
            });
      } else {
            lazyVideos.forEach(function(video) {
                  video.setAttribute("src", video.getAttribute("data-src"));
                  video.classList.remove("lazy");
            });
      }
});

//Stream the videos from the server instead of downloading them
function streamVideo(video) {
      var video = document.getElementById(video);
      video.setAttribute("src", video.getAttribute("data-src"));
      video.classList.remove("lazy");
}