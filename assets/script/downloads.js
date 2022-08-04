//Get objects
const downloadsTemplate = document.querySelector("[downloadsTemplate]");
const downloadsContainer = document.querySelector("[downloadsWrapper]");
const searchInput = document.querySelector("[downloadsSearch]");
const searchElement = document.getElementById("search");

//Create a expandSearch() function that will add or remove the class "show" from the input element with the id "search"
function expandSearch() {
	searchElement.classList.toggle("show");
	if (searchElement.classList.contains("show")) {
		searchElement.focus();
	} else {
		searchElement.blur();
	}
}

//Get the downloads.json file
let downloads = [];
fetch("../assets/json/downloads.json")
	.then((res) => res.json())
	.then((data) => {
		downloads = data.map((download) => {
			const downloadsCard = downloadsTemplate.content.cloneNode(true).children[0];

			const downloadsTitle = downloadsCard.querySelector("[downloadsTitle]");
			const downloadsDownload = downloadsCard.querySelector("[downloadsDownload]");
			const downloadsVideo = downloadsCard.querySelector("[downloadsVideo]");
			const downloadsDescription = downloadsCard.querySelector("[downloadsDescription]");

			downloadsTitle.textContent = download.title + " | ";
			downloadsDownload.setAttribute("href", "../assets/downloads/source/" + download.download);
			downloadsDownload.setAttribute("download", download.downloadAs);
			downloadsVideo.setAttribute("src", "../assets/downloads/video/" + download.video);
			downloadsDescription.textContent = download.description;

			downloadsContainer.appendChild(downloadsCard);

			return {
				title: download.title,
				download: download.download,
				downloadAs: download.downloadAs,
				video: download.video,
				description: download.description,
				element: downloadsCard,
			};
		});
	});

//Translate the search input to lowercase and only display the downloads that match the search input
searchInput.addEventListener("input", (e) => {
	const value = e.target.value.toString().toLowerCase();
	downloads.forEach((download) => {
		const isVisible = download.title.toString().toLowerCase().includes(value) || download.downloadAs.toString().toLowerCase().includes(value);
		download.element.classList.toggle("hide", !isVisible);
	});
});
