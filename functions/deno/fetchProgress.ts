import {crayon} from "https://deno.land/x/crayon@3.3.3/mod.ts";

const progressFetch = async (url: string, output: string, refreshRate?: number) => {
	const response = await fetch(url);
	const contentLength = response.headers.get("content-length");
	const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

	let receivedBytes = 0;
	const startTime = Date.now();
	const reader = response.body?.getReader();
	const chunks = [];
	console.log("\n");
	const logInterval = setInterval(() => {
		const consoleWidth = Deno.consoleSize().columns - 25;
		const elapsedTime = (Date.now() - startTime) / 1000;
		const downloadSpeed = receivedBytes / elapsedTime / 1024 / 1024;
		const remainingBytes = totalBytes - receivedBytes;
		const remainingTime = remainingBytes / (downloadSpeed * 1024 * 1024);
		const eta = remainingTime > 0 ? `${remainingTime.toFixed(2)}s` : "N/A";
		const progress = Math.floor((receivedBytes / totalBytes) * (consoleWidth - 30));
		const progressBar = `${crayon.green("=".repeat(progress))}${"-".repeat(consoleWidth - progress)}`;
		const percentage = Math.floor((receivedBytes / totalBytes) * 100);
		const currentTime = `${elapsedTime.toFixed(2)}s`;
		const estimatedTotalTime = `${(elapsedTime + remainingTime).toFixed(2)}s`;
		console.log(`\x1b[2F\x1b[2M[${progressBar}] ${percentage}% (${downloadSpeed.toFixed(2)} Mbps) \n ETA: ${crayon.yellow(eta)}   Elapsed: ${crayon.yellow(currentTime)}   Total Est. Time: ${crayon.yellow(estimatedTotalTime)}`);
	}, refreshRate || 200);
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
		for (const chunk of chunks) {
			fileBytes.set(chunk, offset);
			offset += chunk.length;
		}
		Deno.writeFileSync(output, fileBytes);
	}
};

export default progressFetch;
