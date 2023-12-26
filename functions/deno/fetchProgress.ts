import {crayon} from "https://deno.land/x/crayon@3.3.3/mod.ts";

const progressFetch = async (url: string, output: string) => {
	const response = await fetch(url);
	const contentLength = response.headers.get("content-length");
	const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

	let receivedBytes = 0;
	const startTime = Date.now();
	const reader = response.body?.getReader();
	const chunks = [];
	console.log();
	const logInterval = setInterval(() => {
		const elapsedTime = (Date.now() - startTime) / 1000;
		const downloadSpeed = receivedBytes / elapsedTime / 1024 / 1024;
		const remainingBytes = totalBytes - receivedBytes;
		const remainingTime = remainingBytes / (downloadSpeed * 1024 * 1024);
		const eta = remainingTime > 0 ? `${remainingTime.toFixed(2)}s` : "N/A";
		const progress = Math.floor((receivedBytes / totalBytes) * 50);
		const progressBar = `${crayon.green("=".repeat(progress))}${"-".repeat(50 - progress)}`;
		const percentage = Math.floor((receivedBytes / totalBytes) * 100);
		const currentTime = elapsedTime.toFixed(2);
		const estimatedTotalTime = (elapsedTime + remainingTime).toFixed(2);
		console.log(`\x1b[1F[${progressBar}] ${percentage}%   (${downloadSpeed.toFixed(2)} Mbps)   ETA: ${eta}   Time: ${currentTime}s   Total Estimated Time: ${estimatedTotalTime}s`);
	}, 200);
	if (reader) {
		while (true) {
			const {done, value} = await reader.read();
			if (done) {
				clearInterval(logInterval);
				break;
			}
			chunks.push(value);
			receivedBytes += value.length;
		}
		const fileBytes = new Uint8Array(receivedBytes);
		let offset = 0;
		for (let chunk of chunks) {
			fileBytes.set(chunk, offset);
			offset += chunk.length;
		}
		Deno.writeFileSync(output, fileBytes);
	}
};

export default progressFetch;
