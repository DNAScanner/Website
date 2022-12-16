//Get objects
const socialsTemplate = document.querySelector("[socialsTemplate]");
const socialsContainer = document.querySelector("[socialsContainer]");

let socials = [];

//Get the socials.json file
fetch("../assets/json/socials.json")
	.then((res) => res.json())
	.then((data) => {
		if (location.search.includes("run=")) {
			let run = location.search.split("run=")[1].split("&")[0];
			console.log(run);
			data.forEach((social) => {
				if (social.id == run) {
					open(social.link, "_self");
					console.log("Opened " + social.link);
				}
			})
		}

		socials = data.map((social) => {
			const socialsCard = socialsTemplate.content.cloneNode(true).children[0];

			const socialsTitle = socialsCard.querySelector("[socialsTitle]");
			const socialsLink = socialsCard
			const socialsLinkDisplay = socialsCard.querySelector("[socialsLinkDisplay]");
			const socialsIcon = socialsCard.querySelector("[socialsIcon]");

			socialsTitle.textContent = social.title;
			socialsLink.setAttribute("href", `${location.href}?run=${social.id}`);
			socialsLinkDisplay.textContent = social.link.substring(0, 30);
			socialsIcon.setAttribute("src", "../assets/icons/" + social.icon);

			socialsContainer.appendChild(socialsCard);

			//If the user right clicks, copy the url
			socialsCard.addEventListener("contextmenu", (event) => {
				event.preventDefault();
				setTimeout(async () => {
					// Request permission to access the clipboard
					await navigator.permissions.query({ name: "clipboard-write" }).then(async (result) => {
						if (result.state == "granted" || result.state == "prompt") {
							// Copy the text to the clipboard
							await navigator.clipboard.writeText(`${location.href}?run=${social.id}`)
						}
					});
					
					alert("Copied short link to your clipboard!");
				}, 200)
			})

			return {
				title: social.title,
				link: social.link,
				linkDisplay: social.linkDisplay,
				icon: social.icon,
				element: socialsCard,
			};
		});
	});