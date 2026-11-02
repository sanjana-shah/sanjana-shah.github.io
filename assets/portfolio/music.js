(() => {
  const card = document.querySelector(".music-card");
  if (!card) return;

  const endpoint =
    "https://spotify-last-played.netlify.app/.netlify/functions/last-played";
  const record = card.querySelector("[data-music-state]");
  const status = card.querySelector("[data-track-status]");
  const name = card.querySelector("[data-track-name]");
  const artist = card.querySelector("[data-track-artist]");
  const album = card.querySelector("[data-track-album]");
  const image = card.querySelector("[data-track-image]");
  const link = card.querySelector("[data-track-link]");
  let timer;
  let controller;
  let renderedKey = "";
  let hasTrack = false;

  const text = (value) => (typeof value === "string" ? value.trim() : "");
  function httpsURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function setText(node, value) {
    node.textContent = value;
    node.hidden = !value;
  }

  function showArtwork(original) {
    image.hidden = !original;
    if (!original) {
      image.removeAttribute("src");
      return;
    }
    const improved = new URL(original);
    if (improved.hostname === "lastfm-img.freetls.fastly.net") {
      improved.pathname = improved.pathname.replace(
        "/i/u/34s/",
        "/i/u/300x300/",
      );
    }
    let retried = false;
    image.onerror = () => {
      if (!retried && improved.href !== original) {
        retried = true;
        image.src = original;
      } else {
        image.hidden = true;
      }
    };
    image.src = improved.href;
  }

  function showUnavailable(empty = false) {
    if (hasTrack && !empty) {
      // A previously fetched song is still a valid last listen, even offline.
      record.dataset.musicState = "recent";
      status.textContent = "Last played";
      renderedKey = "";
      return;
    }
    hasTrack = false;
    renderedKey = "";
    record.dataset.musicState = empty ? "empty" : "unavailable";
    status.textContent = "Listening lately";
    setText(
      name,
      empty
        ? "Nothing to share just yet."
        : "The latest listen will be back soon.",
    );
    setText(artist, "");
    setText(album, "");
    showArtwork("");
    link.hidden = true;
    link.removeAttribute("href");
  }

  function render(data) {
    const track = data?.track;
    if (!track || !text(track.name)) {
      showUnavailable(true);
      return;
    }
    const current = {
      name: text(track.name),
      artist: text(track.artist),
      album: text(track.album),
      image: httpsURL(track.image),
      url: httpsURL(track.url),
      playing: data.playing === true,
    };
    const key = JSON.stringify(current);
    if (key === renderedKey) return;
    renderedKey = key;
    hasTrack = true;
    record.dataset.musicState = current.playing ? "playing" : "recent";
    status.textContent = current.playing ? "Playing now" : "Last played";
    setText(name, current.name);
    name.title = current.name;
    setText(artist, current.artist);
    artist.title = current.artist;
    setText(album, current.album);
    album.title = current.album;
    showArtwork(current.image);
    link.hidden = !current.url;
    if (current.url) {
      link.href = current.url;
      link.setAttribute(
        "aria-label",
        `Open ${current.name}${current.artist ? ` by ${current.artist}` : ""}`,
      );
    } else {
      link.removeAttribute("href");
    }
  }

  async function refresh() {
    clearTimeout(timer);
    if (document.hidden) return;
    controller?.abort();
    const request = new AbortController();
    controller = request;
    const timeout = setTimeout(() => request.abort(), 8000);
    try {
      const response = await fetch(endpoint, {
        signal: request.signal,
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
      });
      if (!response.ok) throw new Error("Music unavailable");
      render(response.status === 204 ? null : await response.json());
    } catch {
      if (!document.hidden) showUnavailable();
    } finally {
      clearTimeout(timeout);
      if (controller === request) {
        controller = null;
        if (!document.hidden) timer = setTimeout(refresh, 60000);
      }
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(timer);
      controller?.abort();
    } else {
      refresh();
    }
  });
  refresh();
})();
