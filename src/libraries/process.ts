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

import { spawn } from "node:child_process";

function runCommand(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn(command, args, { stdio: "inherit" });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

export default async function runPythonScript() {
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

    console.log("✅ UV script executed successfully");
  } catch (err) {
    console.error("❌ Error:", (err as Error).message);
  }
}
