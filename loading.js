"use strict";
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
    for (const element of loadingElements) {
        while (element.childElementCount < 3) {
            const newSpan = document.createElement("span");
            newSpan.innerText = ".";
            element.appendChild(newSpan);
        }
    }
}
addDotsToLoadingElements();
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === "childList")
            addDotsToLoadingElements();
    }
});
observer.observe(document.body, { childList: true, subtree: true });
//# sourceMappingURL=loading.js.map