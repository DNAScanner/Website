import * as path from "https://deno.land/std@0.197.0/path/mod.ts";
import chalk from "npm:chalk"

const render = (file: string, variables: Record<string, string>, ignoreNonReplacedVariables?: boolean) => {
	if (ignoreNonReplacedVariables == null) ignoreNonReplacedVariables = false;

	let text;
	try {
		text = Deno.readTextFileSync(path.join(Deno.cwd(), file));
	} catch {
		throw new Error(`Requested file doesnt exist (${file}}`);
	}

	for (const key in variables) {
		const pattern = new RegExp(`{{( +)?${key}( +)?}}`, `gi`);
		text = text.replaceAll(pattern, variables[key]);
	}

	if (!ignoreNonReplacedVariables && text.match(/{{.+}}/gi)) throw new Error(`Non replaced variable found in ${chalk.blue(`file:///${path.join(Deno.cwd(), file)}`)}\n> ${[...new Set(...(text.match(/{{.+}}/gi) || []))]?.join("\n> ")}`);

	return text;
};

export default render;