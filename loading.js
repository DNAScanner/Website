const style = document.createElement("style");
style.innerHTML = `
  loading > * {animation: loading 1.5s infinite}
  loading > span:nth-child(2) {animation-delay: 0.2s}
  loading > span:nth-child(3) {animation-delay: 0.4s}
  @keyframes loading {
    0% {opacity: 1}
    50% {opacity: 0}
    100% {opacity: 1}
  }
`;
document.head.appendChild(style);

function addDotsToLoadingElements() {
	const loadingElements = Array.from(document.getElementsByTagName("loading"));
	loadingElements.forEach((element) => {
		for (let i = 0; i < 3; i++) {
			const newSpan = document.createElement("span");
			newSpan.innerText = ".";
			element.appendChild(newSpan);
		}
	});
}

addDotsToLoadingElements();

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.type === "childList") {
			const newElements = Array.from(mutation.addedNodes).filter((node) => node.tagName === "LOADING");
			newElements.forEach((element) => {
				addDotsToLoadingElements();
			});
		}
	}
});

observer.observe(document.body, {childList: true, subtree: true});
