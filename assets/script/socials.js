//Get objects
const socialsTemplate = document.querySelector("[socialsTemplate]");
const socialsContainer = document.querySelector("[socialsContainer]");

let socials = [];

//Get the socials.json file
fetch("../assets/json/socials.json")
	.then((res) => res.json())
	.then((data) => {
		socials = data.map((social) => {
			const socialsCard = socialsTemplate.content.cloneNode(true).children[0];

			const socialsTitle = socialsCard.querySelector("[socialsTitle]");
			const socialsLink = socialsCard
			const socialsLinkDisplay = socialsCard.querySelector("[socialsLinkDisplay]");
			const socialsIcon = socialsCard.querySelector("[socialsIcon]");

			socialsTitle.textContent = social.title;
			socialsLink.setAttribute("href", social.link);
			socialsLinkDisplay.textContent = social.link.substring(0, 30);
			socialsIcon.setAttribute("src", "../assets/icons/" + social.icon);

			socialsContainer.appendChild(socialsCard);

			return {
				title: social.title,
				link: social.link,
				linkDisplay: social.linkDisplay,
				icon: social.icon,
				element: socialsCard,
			};
		});
	});