let sections = document.getElementById("content").children;
let spoilers = document.getElementsByClassName("spoiler");
let autoScrollHappened = true;
let lastTimeScrolled = Date.now();
let lastScrollHeight = 0;
let autoScrollOn = !("ontouchstart" in window || navigator.maxTouchPoints);

document.addEventListener("scroll", () => {
	lastTimeScrolled = Date.now();
	autoScrollHappened = false;
});

function update() {
	autoScrollOn = !("ontouchstart" in window || navigator.maxTouchPoints);
	let scrollHeight = window.scrollY + window.innerHeight * 0.5;

	if (location.hash) {
		let section = document.getElementById(location.hash.slice(1));

		if (section) {
			let sectionTop = section.offsetTop;
			location.hash = "";

			window.scrollTo({
				top: sectionTop,
			});
		}
	}

	let timeSinceLastScroll = Date.now() - lastTimeScrolled;

	if (timeSinceLastScroll > 500 && !autoScrollHappened && autoScrollOn) {
		let topSection = null;
		let bottomSection = null;

		for (let section of sections) {
			let rect = section.getBoundingClientRect();

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

			for (let section of [topSection, bottomSection]) {
				let sectionTop = section.offsetTop;
				let sectionBottom = sectionTop + section.offsetHeight - 1;
				let distance = Math.min(Math.abs(scrollHeight - sectionTop), Math.abs(scrollHeight - sectionBottom));

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
				for (let navigation of document.getElementById("navigation-container").children) if (/* Has class "current" */ navigation.classList.contains("current")) navigation.classList.remove("current");

				document.getElementById(`navigation-${closestSection.id}`).classList.add("current");
				console.log(closestSection);
			}

			autoScrollHappened = true;
			lastScrollHeight = scrollHeight;
		}
	}

	requestAnimationFrame(update);
}

update();

for (let spoiler of spoilers) {
	spoiler.addEventListener("click", () => {
		spoiler.classList.add("spoiler-shown");
	});
}

for (let section of document.getElementById("content").children) {
	let link = document.createElement("a");
	link.href = `#${section.id}`;
	link.id = `navigation-${section.id}`;
	link.innerText = section.getAttribute("data-name") || section.id.charAt(0).toUpperCase() + section.id.slice(1);
	if (section === document.getElementById("content").children[0] && autoScrollOn) link.classList.add("current");

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
} catch (error) {
	null;
}

const socials = await (await fetch("./socials.json")).json();

for (let social of socials) {
	let container = document.createElement("a");
	container.classList.add("socials-card-container");
	container.href = social.link;
	container.target = "_blank";
	container.rel = "noopener noreferrer";

	let icon = document.createElement("img");
	icon.classList.add("socials-card-icon");
	icon.src = `./platforms/${social.icon}.svg`;
	icon.alt = social.title + " icon";

	let title = document.createElement("h1");
	title.classList.add("socials-card-title");
	title.innerText = social.title;

	let link = document.createElement("h1");
	link.classList.add("socials-card-link");
	link.innerText = social.link;

	container.appendChild(icon);
	container.appendChild(title);
	container.appendChild(link);

	document.getElementById("cards").appendChild(container);
}
