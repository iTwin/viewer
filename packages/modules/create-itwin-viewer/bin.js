import { bold, cyan, gray, green, red } from "kleur/colors";
import { exec, spawn } from "child_process";
import { stdin } from "process";
import prompts from "prompts";

async function main() {
  const welcomeMsg = bold(
    cyan("Welcome to the iTwin Viewer Application Generator!")
  );
  console.log(welcomeMsg);
 
  const options = await prompts([
    {
      type: "select",
      name: "template",
      message: "What type of application are you building?",
      choices: [
        { title: "Web", value: "web" },
        { title: "Desktop", value: "desktop" },
      ],
    },
    {
      type: "text",
      name: "name",
      message: "What is the name of your application?",
    },
  ]);

  const startMsg = bold(cyan("Generating your iTwin Viewer..."));
  console.log(startMsg);
  const cmd = `npx create-react-app ${options.name} --template @itwin/${options.template}-viewer --scripts-version @bentley/react-scripts`;
  // console.log(`Executing "${cmd}"`);
  exec(cmd, (error, stdout, stdin) => {
    // console.log(stdout);
  });
}

main();
