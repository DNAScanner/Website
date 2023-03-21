let sections = document.getElementById("content").children;
let autoScrollHappened = true;
let lastTimeScrolled = Date.now();
let lastScrollHeight = 0;
let autoScrollOn = true;

document.addEventListener("scroll", () => {
	lastTimeScrolled = Date.now();
	autoScrollHappened = false;
});

function update() {
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
		// Create a red line, thats in the center of the screen
		for (let element of document.getElementsByClassName("temp")) {
			element.remove();
		}

		let temp = document.createElement("div");
		temp.style.position = "absolute";
		temp.style.top = scrollHeight + "px";
		temp.style.left = "0px";
		temp.style.width = "100%";
		temp.style.height = "2px";
		temp.style.backgroundColor = "red";
		temp.classList.add("temp");
		document.body.appendChild(temp);

		let topSection = null;
		let bottomSection = null;

		// Find the top and bottom sections visible in the viewport
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

		// If top and bottom sections visible in the viewport are not the same, scroll to the top of the closest section
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
			}

			autoScrollHappened = true;
			lastScrollHeight = scrollHeight;
		}
	}

	requestAnimationFrame(update);
}

update();

for (let section of document.getElementById("content").children) {
	// Create an <a> element
	let link = document.createElement("a");
	link.href = `#${section.id}`;
	link.innerText = section.id.charAt(0).toUpperCase() + section.id.slice(1);

	document.getElementById("navigation-container").appendChild(link);
}

const socials = [
	{
		title: "Discord",
		link: "https://discord.com/users/538033136685285396",
		icon: "discord",
		id: "discord",
	},

	{
		title: "OhHellNaw",
		link: "https://discord.gg/9Gfy9pTBWr",
		icon: "ohhellnaw",
		id: "ohhellnaw",
	},

	{
		title: "GitHub",
		link: "https://github.com/DNAScanner",
		icon: "github",
		id: "github",
	},

	{
		title: "Spotify",
		link: "https://open.spotify.com/user/9tcgf7pzh5l7x996g42l7xtrp",
		icon: "spotify",
		id: "spotify",
	},

	{
		title: "Steam",
		link: "https://steamcommunity.com/profiles/76561198019506098",
		icon: "steam",
		id: "steam",
	},

	{
		title: "Twitter",
		link: "https://twitter.com/@dnascanner",
		icon: "twitter",
		id: "twitter",
	},

	{
		title: "Reddit",
		link: "https://www.reddit.com/user/DNAScannerMC",
		icon: "reddit",
		id: "reddit",
	},

	{
		title: "Twitch",
		link: "https://www.twitch.tv/dnascanner",
		icon: "twitch",
		id: "twitch",
	},

	{
		title: "YouTube",
		link: "https://youtube.dnascanner.de/",
		icon: "youtube",
		id: "youtube",
	},
];

for (let social of socials) {
	// First, create a container for the card
	let container = document.createElement("a");
	container.classList.add("socials-card-container");
	container.href = social.link;
	container.target = "_blank";
	container.rel = "noopener noreferrer";

	// Then, create an element for the icon
	let icon = document.createElement("img");
	icon.classList.add("socials-card-icon");
	icon.src = `./platforms/${social.icon}.svg`;
	icon.alt = social.title + " icon";

	// Then, create an element for the title
	let title = document.createElement("h1");
	title.classList.add("socials-card-title");
	title.innerText = social.title;

	// Then, create an element for the link
	let link = document.createElement("h1");
	link.classList.add("socials-card-link");
	link.innerText = social.link;

	// Append the components
	container.appendChild(icon);
	container.appendChild(title);
	container.appendChild(link);

	// And append the card to the socials container
	document.getElementById("cards").appendChild(container);
}
