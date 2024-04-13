const sections = document.getElementById("content").children;
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

	if (!keyInputs.toLowerCase().endsWith("rawr")) return;

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
				} else {
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
	if (section.getAttribute("data-hide") == "true") continue;

	const link = document.createElement("a");
	link.href = `#${section.id}`;
	link.id = `navigation-${section.id}`;
	link.innerText = section.getAttribute("data-name") || section.id.charAt(0).toUpperCase() + section.id.slice(1);

	document.getElementById("navigation-container").appendChild(link);
}

try {
	fetch("https://dnascanner.duckdns.org/tictactoe/").then((response) => {
		if (response.status === 200) {
			document.getElementById("navigation-tictactoe").style.display = "block";
			document.getElementById("tictactoe").style.display = "block";
			document.getElementById("home-tictactoe-mention").style.display = "block";
		}
	});
} catch (_error) {
	null;
}

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

	document.getElementById("cards").appendChild(container);
}

if (!showNotFound) document.getElementById("not-found").classList.add("hidden");
else {
	while (showNotFound) await new Promise((resolve) => setTimeout(resolve, 100));
	document.getElementById("not-found").classList.add("hidden");
}
