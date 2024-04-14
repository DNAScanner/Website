const sections = document.getElementById("content")?.children;
const spoilers = document.getElementsByClassName("spoiler");
let showNotFound = location.hash === "#not-found";
let autoScrollHappened = true;
let lastTimeScrolled = Date.now();
let lastScrollHeight = 0;
let autoScrollOn = !("ontouchstart" in window);
document.addEventListener("scroll", () => {
    lastTimeScrolled = Date.now();
    autoScrollHappened = false;
});
let keyInputs = "";
document.addEventListener("keydown", (event) => {
    keyInputs += event.key;
    if (!keyInputs.toLowerCase().endsWith("rawr"))
        return;
    autoScrollOn = false;
    document.body.classList.add("rotate");
});
const update = () => {
    const scrollHeight = window.scrollY + window.innerHeight * 0.5;
    if (location.hash) {
        const section = document.getElementById(location.hash.slice(1));
        if (section) {
            const sectionTop = section.offsetTop;
            location.hash = "";
            window.scrollTo({
                top: sectionTop,
            });
        }
    }
    const timeSinceLastScroll = Date.now() - lastTimeScrolled;
    if (timeSinceLastScroll > 500 && !autoScrollHappened && autoScrollOn) {
        let topSection = null;
        let bottomSection = null;
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (!topSection || rect.top > topSection.getBoundingClientRect().top) {
                    topSection = section;
                }
                if (!bottomSection || rect.bottom < bottomSection.getBoundingClientRect().bottom) {
                    bottomSection = section;
                }
            }
        }
        if (topSection && bottomSection && topSection !== bottomSection) {
            let closestSection;
            let closestDistance = Infinity;
            for (const section of [topSection, bottomSection]) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight - 1;
                const distance = Math.min(Math.abs(scrollHeight - sectionTop), Math.abs(scrollHeight - sectionBottom));
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = section;
                }
            }
            if (closestSection) {
                if (Math.abs(closestSection.offsetTop - scrollHeight) > Math.abs(closestSection.offsetTop + closestSection.offsetHeight - 1 - scrollHeight)) {
                    window.scrollTo({
                        top: closestSection.offsetTop + closestSection.offsetHeight - window.innerHeight,
                    });
                }
                else {
                    window.scrollTo({
                        top: closestSection.offsetTop,
                    });
                }
            }
            autoScrollHappened = true;
            lastScrollHeight = scrollHeight;
        }
    }
    requestAnimationFrame(update);
};
update();
for (const spoiler of spoilers) {
    spoiler.addEventListener("click", () => {
        spoiler.classList.add("spoiler-shown");
    });
}
for (const section of document.getElementById("content").children) {
    if (section.getAttribute("data-hide") == "true")
        continue;
    const link = document.createElement("a");
    link.href = `#${section.id}`;
    link.id = `navigation-${section.id}`;
    link.innerText = section.getAttribute("data-name") || section.id.charAt(0).toUpperCase() + section.id.slice(1);
    document.getElementById("navigation-container")?.appendChild(link);
}
try {
    fetch("https://dnascanner.duckdns.org/tictactoe/").then((response) => {
        if (response.status === 200) {
            document.getElementById("navigation-tictactoe").style.display = "block";
            document.getElementById("tictactoe").style.display = "block";
            document.getElementById("home-tictactoe-mention").style.display = "block";
        }
    });
}
catch (_error) {
    null;
}
(async () => {
    const socials = await (await fetch("./socials.json")).json();
    for (const social of socials) {
        const container = document.createElement("a");
        container.classList.add("socials-card-container");
        social.highlight && container.classList.add("highlight");
        container.href = social.link;
        container.target = "_blank";
        container.rel = "noopener noreferrer";
        const icon = document.createElement("img");
        icon.classList.add("socials-card-icon");
        icon.src = `./platforms/${social.icon}.svg`;
        icon.alt = social.title + " icon";
        const title = document.createElement("h1");
        title.classList.add("socials-card-title");
        title.innerText = social.title;
        const link = document.createElement("h1");
        link.classList.add("socials-card-link");
        link.innerText = social.link;
        container.appendChild(icon);
        container.appendChild(title);
        container.appendChild(link);
        document.getElementById("cards")?.appendChild(container);
    }
    if (!showNotFound)
        document.getElementById("not-found")?.classList.add("hidden");
    else {
        while (showNotFound)
            await new Promise((resolve) => setTimeout(resolve, 100));
        document.getElementById("not-found")?.classList.add("hidden");
    }
})();
(async () => {
    const pins = await (await fetch("https://gh-pins.dnascanner.de/raw/dnascanner", { cache: "force-cache" })).json();
    let widestChild = 0;
    for (const pin of pins) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("pin-wrapper");
        const title = document.createElement("span");
        title.classList.add("pin-title");
        title.textContent = pin.name;
        wrapper.appendChild(title);
        const canvas = document.createElement("canvas");
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        wrapper.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        if (!ctx)
            continue;
        let start = 0;
        for (const lang of pin.languages) {
            const end = start + lang.part * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, 256, start, end);
            ctx.fillStyle = lang.color;
            ctx.fill();
            start = end;
        }
        const legend = document.createElement("div");
        legend.classList.add("lang-wrapper");
        wrapper.appendChild(legend);
        for (const lang of pin.languages) {
            const entry = document.createElement("div");
            entry.classList.add("lang-entry");
            legend.appendChild(entry);
            const color = document.createElement("div");
            color.classList.add("lang-color");
            color.style.backgroundColor = lang.color;
            entry.appendChild(color);
            const name = document.createElement("span");
            name.classList.add("lang-name");
            name.textContent = lang.name;
            entry.appendChild(name);
            const part = document.createElement("span");
            part.classList.add("lang-part");
            part.textContent = String(Math.floor(lang.part * 1000) / 10) + "%";
            entry.appendChild(part);
        }
        document.querySelector("#projects").appendChild(wrapper);
        if (widestChild < wrapper.getBoundingClientRect().width + 10)
            widestChild = wrapper.getBoundingClientRect().width + 10;
    }
    setTimeout(() => {
        for (const pin of Array.from(document.querySelectorAll(".pin-wrapper")))
            pin.style.width = widestChild + "px";
    }, 100);
})();
export {};
