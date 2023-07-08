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
const loading = Array.from(document.getElementsByTagName("loading"));

for (const element of loading) {
	for (let i = 0; i < 3; i++) {
		const newSpan = document.createElement("span");
		newSpan.innerText = ".";
		element.appendChild(newSpan);
	}
}