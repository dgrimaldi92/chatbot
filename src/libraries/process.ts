// import { spawn } from "node:child_process";

//  pythonRunning() {
//   const command = "uv";
//   const args = ["run", "--with", "diffusers", "torch", "scripts/example.py"];

//   const ls = spawn(command, args);
//   ls.stdout.on("data", (data) => {
//     console.log(`stdout: ${data}`);
//   });

//   ls.stderr.on("data", (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   ls.on("close", (code) => {
//     console.log(`child process exited with code ${code}`);
//   });

//   return {
//     run: () => {
//       ls.stdout.on("data", (data) => {
//         console.log(`stdout: ${data}`);
//       });
//     },

//     error: () => {
//       ls.stderr.on("data", (data) => {
//         console.error(`stderr: ${data}`);
//       });
//     },
//     close: () => {
//       ls.on("close", (code) => {
//         console.log(`child process exited with code ${code}`);
//       });
//     },
//   };
// }

import { exec, spawn } from "node:child_process";
import { serverLogger } from "./logger";

function runCommand(command: string, args: string[]) {
	return new Promise<void>((resolve, reject) => {
		const proc = spawn(command, args, { stdio: "inherit" });

		proc.stdout?.on("data", (data) => console.log(data));

		proc.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${command} exited with code ${code}`));
			}
		});
	});
}
function bashCommand(command: string) {
	return new Promise<void>((resolve, reject) => {
		const proc = exec(command);

		proc.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`${command} exited with code ${code}`));
			}
		});
	});
}

export async function runPythonScript() {
	try {
		// Step 1: Add dependencies to the script
		await runCommand("uv", [
			"add",
			"--script",
			"scripts/example.py",
			"torch",
			"transformers",
			"diffusers",
			"accelerate",
			"huggingface_hub",
			"protobuf",
			"transformers[sentencepiece]",
		]);

		// Step 2: Run the script
		await runCommand("uv", ["run", "scripts/example.py"]);

		serverLogger.info("✅ UV script executed successfully");
	} catch (err) {
		serverLogger.error("❌ Error:", (err as Error).message);
	}
}

export async function runPythonCrawler() {
	try {
		await runCommand("uv", [
			"add",
			"--script",
			"scripts/crawler.py",
			"crawl4ai",
			"asyncio",
			"orjson",
		]);

		await runCommand("uv", ["run", "scripts/crawler.py"]);
		serverLogger.info("✅ UV script executed successfully");
	} catch (err) {
		serverLogger.error("❌ Error:", (err as Error).message);
	}
}

export async function disableModel(model: string) {
	try {
		const command = `ollama stop ${model}`;
		await bashCommand(command);
	} catch (error) {
		serverLogger.error("❌ Error:", (error as Error).message);
	}
}
