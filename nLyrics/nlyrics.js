(async function() {
        while (!Spicetify.React || !Spicetify.ReactDOM) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        var nlyrics = (() => {
  // src/app.tsx
  async function main() {
    while (!(Spicetify == null ? void 0 : Spicetify.showNotification) || !document.querySelector(".main-nowPlayingWidget-nowPlaying")) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const HOST = (await Spicetify.CosmosAsync.get("https://dnascanner.de/nLyrics/url.json")).url;
    Spicetify.Player.addEventListener("onplaypause", (event) => {
      var _a;
      const currentTime = (event == null ? void 0 : event.data.positionAsOfTimestamp) || 0;
      const minutes = Math.floor(currentTime / 6e4).toString().padStart(2, "0");
      const seconds = Math.floor(currentTime % 6e4 / 1e3).toString().padStart(2, "0");
      const milliseconds = (Math.floor(currentTime % 1e3 * 10) / 10 - 10).toString().padStart(3, "0").slice(0, 2);
      const timeString = `${minutes}:${seconds}.${milliseconds}`;
      Spicetify.showNotification(`Paused @ ${timeString}`);
      if (editingTextArea && !Spicetify.Player.isPlaying()) {
        let roundedMilliseconds = Math.floor(parseInt(milliseconds) / 10) * 10 - 75;
        let roundedSeconds = parseInt(seconds);
        let roundedMinutes = parseInt(minutes);
        if (roundedMilliseconds >= 100) {
          roundedSeconds++;
          roundedMilliseconds = 0;
          if (roundedSeconds >= 60) {
            roundedMinutes++;
            roundedSeconds = 0;
          }
        } else if (roundedMilliseconds < 0) {
          roundedSeconds--;
          roundedMilliseconds = 90;
          if (roundedSeconds < 0) {
            roundedMinutes--;
            roundedSeconds = 59;
          }
        }
        const timeStringRounded = `${roundedMinutes}:${roundedSeconds.toString().padStart(2, "0")}.${roundedMilliseconds.toString().padStart(2, "0")}`.padStart(8, "0");
        const currentLine = ((_a = editingTextArea.value.substring(0, editingTextArea.selectionStart).match(/\n/g)) == null ? void 0 : _a.length) + 1 || 1;
        const lines = editingTextArea.value.split("\n");
        lines[currentLine - 1] = `[${timeStringRounded}] ` + lines[currentLine - 1].replace(/\[(\d{2}):(\d{2}).(\d{2})\]/, "").trim();
        editingTextArea.value = lines.join("\n");
      }
    });
    let lyricsContainer;
    let lyricsCurrentLine;
    let lyricsNextLine;
    let lyricsNextNextLine;
    setInterval(async () => {
      var _a;
      const button = Array.from(document.querySelector(".main-nowPlayingWidget-nowPlaying").getElementsByTagName("button")).filter((element) => element.classList.contains("main-addButton-button"))[0];
      if (button)
        button.remove();
      editingTextArea = document.querySelector(".lyrics-textarea") || null;
      if (!document.querySelector(".lyrics-container")) {
        lyricsContainer = document.createElement("div");
        lyricsContainer.classList.add("lyrics-container");
        (_a = document.querySelector(".main-nowPlayingWidget-nowPlaying")) == null ? void 0 : _a.appendChild(lyricsContainer);
        lyricsContainer.addEventListener("click", addLyrics);
        lyricsCurrentLine = document.createElement("p");
        lyricsCurrentLine.classList.add("lyrics-current-line");
        lyricsContainer.appendChild(lyricsCurrentLine);
        lyricsNextLine = document.createElement("p");
        lyricsNextLine.classList.add("lyrics-next-line");
        lyricsContainer.appendChild(lyricsNextLine);
        lyricsNextNextLine = document.createElement("p");
        lyricsNextNextLine.classList.add("lyrics-next-next-line");
        lyricsContainer.appendChild(lyricsNextNextLine);
        await updateLines(Spicetify.Player.data.item || {});
      }
    }, 1e3);
    let editingTextArea;
    const addLyrics = async () => {
      const overlay = document.createElement("div");
      overlay.classList.add("lyrics-overlay");
      document.body.appendChild(overlay);
      const editingInterface = document.createElement("div");
      editingInterface.classList.add("lyrics-interface");
      overlay.appendChild(editingInterface);
      const textarea = document.createElement("textarea");
      textarea.classList.add("lyrics-textarea");
      editingInterface.appendChild(textarea);
      editingTextArea = textarea;
      const submitButton = document.createElement("button");
      submitButton.classList.add("lyrics-submit-button");
      submitButton.innerText = "Submit";
      editingInterface.appendChild(submitButton);
      overlay.addEventListener("click", () => overlay.remove());
      editingInterface.addEventListener("click", (event) => event.stopPropagation());
      textarea.addEventListener("change", () => {
        var _a, _b, _c, _d, _e, _f;
        const lines = textarea.value.split("\n");
        const newLines = [];
        for (const line of lines) {
          const data = { timestamp: { minutes: 0, seconds: 0, milliseconds: 0 }, words: "" };
          data.timestamp.minutes = parseInt(((_a = line.split("[")[1]) == null ? void 0 : _a.split(":")[0]) || "0") || 0;
          data.timestamp.seconds = parseInt(((_c = (_b = line.split("[")[1]) == null ? void 0 : _b.split(":")[1]) == null ? void 0 : _c.split(".")[0]) || "0") || 0;
          data.timestamp.milliseconds = parseInt(((_f = (_e = (_d = line.split("[")[1]) == null ? void 0 : _d.split(":")[1]) == null ? void 0 : _e.split(".")[1]) == null ? void 0 : _f.split("]")[0]) || "0") || 0;
          data.words = line.replace(/\[(\d{2}):(\d{2}).(\d{2})\]/, "").trim();
          data.words = data.words.replace(/\s+/g, " ");
          newLines.push(`[${data.timestamp.minutes.toString().padStart(2, "0")}:${data.timestamp.seconds.toString().padStart(2, "0")}.${data.timestamp.milliseconds.toString().padStart(2, "0")}] ${data.words}`);
        }
        textarea.value = newLines.join("\n");
      });
      submitButton.addEventListener("click", async () => {
        await Spicetify.CosmosAsync.post(HOST + `/editlyrics/${(Spicetify.Player.data.item.artists || [])[0].name}/${Spicetify.Player.data.item.name}`, {
          lrc: textarea.value
        });
        overlay.remove();
        Spicetify.showNotification("Thanks for your contribution!");
        await updateLines(Spicetify.Player.data.item);
      });
    };
    let currentLines = [];
    const updateLines = async (item) => {
      if (!item.name)
        return;
      lyricsCurrentLine.innerText = "";
      lyricsNextLine.innerText = "Retrieving lyrics...";
      lyricsNextNextLine.innerText = "";
      let lines = [];
      try {
        lines = (await Spicetify.CosmosAsync.get(HOST + `/lyrics/${(item.artists || [])[0].name}/${item.name}`)).lines;
      } catch (e) {
        null;
      }
      if (lines.length === 0) {
        try {
          const spotifyLyrics = await Spicetify.CosmosAsync.get("wg://color-lyrics/v2/track/" + item.uri.split(":")[2] + "?format=json");
          if (spotifyLyrics.lyrics.syncType === "LINE_SYNCED")
            lines = spotifyLyrics.lyrics.lines;
          else {
            lyricsCurrentLine.innerText = "";
            lyricsNextLine.innerText = "Lyrics not synced";
            lyricsNextNextLine.innerText = "";
          }
        } catch (e) {
          null;
        }
      }
      if (lines.length === 0) {
        lyricsCurrentLine.innerText = "";
        lyricsNextLine.innerText = "Lyrics not found";
        lyricsNextNextLine.innerText = "";
        return;
      }
      console.log(lines);
      for (const line of lines) {
        line.startTimeMs = parseInt(line.startTimeMs);
        line.endTimeMs = parseInt(line.endTimeMs);
        if (line.endTimeMs !== 0)
          continue;
        const nextLine = lines[lines.indexOf(line) + 1];
        line.endTimeMs = nextLine ? Number(nextLine.startTimeMs) - 1 : item.duration;
      }
      lyricsCurrentLine.innerText = "";
      lyricsNextLine.innerText = "Lyrics found";
      lyricsNextNextLine.innerText = "";
      currentLines = lines;
    };
    Spicetify.Player.addEventListener("songchange", async (event) => {
      currentLines.length = 0;
      if (event == null ? void 0 : event.data.item)
        await updateLines(event == null ? void 0 : event.data.item);
    });
    let latestLineUpdate = 0;
    Spicetify.Player.addEventListener("onprogress", (event) => {
      var _a, _b, _c, _d, _e, _f;
      if (Date.now() - latestLineUpdate < 50 || currentLines.length === 0)
        return;
      latestLineUpdate = Date.now();
      const currentTime = (event == null ? void 0 : event.data) || 0;
      let currentLineIndex = currentLines == null ? void 0 : currentLines.findIndex((line) => {
        const startTimeMs = parseInt(line.startTimeMs);
        const endTimeMs = parseInt(line.endTimeMs);
        return startTimeMs <= currentTime && endTimeMs >= currentTime;
      });
      if (currentLineIndex === -1 && currentLines[0].startTimeMs >= currentTime)
        currentLineIndex = 0;
      if (currentLineIndex === -1)
        return;
      if ((lyricsCurrentLine == null ? void 0 : lyricsCurrentLine.innerText) !== ((_a = currentLines[currentLineIndex]) == null ? void 0 : _a.words))
        lyricsCurrentLine.innerText = ((_b = currentLines[currentLineIndex]) == null ? void 0 : _b.words) || "";
      if ((lyricsNextLine == null ? void 0 : lyricsNextLine.innerText) !== ((_c = currentLines[currentLineIndex + 1]) == null ? void 0 : _c.words))
        lyricsNextLine.innerText = ((_d = currentLines[currentLineIndex + 1]) == null ? void 0 : _d.words) || "";
      if ((lyricsNextNextLine == null ? void 0 : lyricsNextNextLine.innerText) !== ((_e = currentLines[currentLineIndex + 2]) == null ? void 0 : _e.words))
        lyricsNextNextLine.innerText = ((_f = currentLines[currentLineIndex + 2]) == null ? void 0 : _f.words) || "";
    });
  }
  var app_default = main;

  // node_modules/spicetify-creator/dist/temp/index.jsx
  (async () => {
    await app_default();
  })();
})();
(async () => {
    if (!document.getElementById(`nlyrics`)) {
      var el = document.createElement('style');
      el.id = `nlyrics`;
      el.textContent = (String.raw`
  @import "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap";

/* C:/Users/liam/AppData/Local/Temp/tmp-10392-XsSuelw85UAC/18be2da9f440/app.css */
html {
  overflow-y: hidden;
}
.main-nowPlayingBar-left {
  width: 75%;
}
.main-nowPlayingBar-left > .main-nowPlayingWidget-nowPlayingBar {
  width: 100%;
  display: flex;
  justify-content: left;
}
.main-nowPlayingBar-center {
  width: -moz-fit-content;
  width: fit-content;
}
.main-nowPlayingBar-right {
  width: 20%;
}
.playback-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0 !important;
  width: 100%;
}
.lyrics-container {
  text-align: center;
  margin: 0 auto;
}
.lyrics-container > svg {
  margin-top: -2%;
}
.lyrics-container > p {
  font-weight: 400;
  font-size: 14px;
}
.lyrics-container > .lyrics-current-line {
  font-weight: 600;
  font-size: 18;
}
.Root__now-playing-bar {
  padding-top: 0.25rem;
  padding-bottom: 0.4rem;
}
.main-nowPlayingWidget-trackInfo.main-trackInfo-container {
  max-width: 35%;
}
.lyrics-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.lyrics-overlay > .lyrics-interface {
  width: 60%;
  height: 70%;
  background-color: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  border-radius: 1.25rem;
  background-color: var(--spice-custom-main-secondary);
}
.lyrics-overlay > .lyrics-interface > .lyrics-textarea {
  font-family: "Ubuntu", sans-serif;
  width: 100%;
  height: 90%;
  padding: 10px;
  resize: none;
  background-color: var(--spice-custom-highlight);
  color: white;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-size: 1rem;
}
.lyrics-overlay > .lyrics-interface > .lyrics-submit-button {
  display: block;
  width: 100%;
  margin-top: 10px;
  background-color: var(--spice-button);
  cursor: pointer;
  color: white;
  padding: 10px;
  border-radius: 1rem;
  border: none;
}

      `).trim();
      document.head.appendChild(el);
    }
  })()
      })();