const loading = Array.from(document.getElementsByTagName("loading"));

for (const element of loading) {
	for (let i = 0; i < 3; i++) {
		const newSpan = document.createElement("span");
		newSpan.innerText = ".";
		element.appendChild(newSpan);
	}
}