import { bold, cyan, green } from "kleur/colors";
import { exec } from "child_process";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import { uiConfigurations } from "./config/ui.mjs";
import { packageJson } from "./config/package.mjs";
import { appConfiguration } from "./config/app.mjs";
import validatePackageName from "validate-npm-package-name";

function finalize(appName) {
  const endMsg = bold(green("Application generation complete!"));
  const nextSteps = "Next Steps:";
  let i = 1;
  const chDir = bold(cyan(`${i++}. cd ${appName}`));
  const startApp = bold(
    cyan(`${i++}. npm start (or yarn start / pnpm start) to start debugging`)
  );
  const editApp = bold(
    cyan(
      `${i++}. open the directory in your editor of choice to edit the application`
    )
  );
  console.log(endMsg);
  console.log(nextSteps);
  console.log(chDir);
  console.log(editApp);
  console.log(startApp);
}

function installDependencies(appRoot, appName) {
  const npmMsg = "Installing dependencies...";
  console.log(npmMsg);
  process.chdir(appRoot);
  exec("npm install", () => {
    finalize(appName);
  });
}

function copyTemplate(appRoot, platform) {
  const generatorRoot = new URL(".", import.meta.url).pathname;
  const templateRoot = path.resolve(generatorRoot, "templates", platform);

  fs.copySync(templateRoot, appRoot);
}

function writeConfig(appRoot, template, mergedAppConfig) {
  const configFilePath = path.resolve(appRoot, "./src/config.ts");
  let configFile = fs.readFileSync(configFilePath, "utf8");
  const uiConfig = `export const uiConfig: UiConfiguration = ${JSON.stringify(
    uiConfigurations[template].config
  )}`;
  const appConfig = `export const appConfig: AppConfiguration = ${JSON.stringify(
    mergedAppConfig
  )}`;
  configFile = configFile.replace("// UI CONFIG HERE", uiConfig);
  configFile = configFile.replace("// APP CONFIG HERE", appConfig);
  fs.writeFileSync(configFilePath, configFile);
}

function writePackageJson(appRoot, appName) {
  packageJson.name = appName;
  packageJson.version = "0.1.0";
  const packageJsonPath = path.resolve(appRoot, "./package.json");
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
}

async function main() {
  const welcomeMsg = bold(
    cyan("Welcome to the iTwin Viewer Application Generator!")
  );
  console.log(welcomeMsg);

  const templates = [];

  for (const template in uiConfigurations) {
    templates.push({
      title: uiConfigurations[template].description,
      value: template,
    });
  }

  const mainOptions = await prompts([
    {
      type: "select",
      name: "platform",
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
      validate: (val) =>
        validatePackageName(val).validForNewPackages
          ? true
          : `${val} is not a valid package name. Please visit https://github.com/npm/validate-npm-package-name#naming-rules for guidelines`,
    },
    {
      type: "select",
      name: "template",
      message: "Which template would you like to start with?",
      choices: templates,
    },
    {
      type: "confirm",
      name: "auth",
      message:
        "Would you like to add your authorization client configuration (you must enter it in the src/config.ts file prior to running your application if you do not)?",
      initial: true,
    },
  ]);

  let mergedAppConfig = appConfiguration;
  if (mainOptions.auth === true) {
    const authOptions = await prompts([
      {
        type: "text",
        name: "authority",
        message: "Enter the authority for your Identity Provider",
        initial: appConfiguration.auth.authority,
      },
      {
        type: "text",
        name: "clientId",
        message: "Enter your client id",
        initial: "",
      },
      {
        type: "text",
        name: "scope",
        message: "Enter your scope list",
        initial: appConfiguration.auth.scope,
      },
      {
        type: "text",
        name: "redirectUri",
        message: "Enter your redirect uri",
        initial: appConfiguration.auth.redirectUri,
      },
      {
        type: "text",
        name: "postSignoutRedirectUri",
        message: "Enter your post logout redirect uri",
        initial: appConfiguration.auth.postSignoutRedirectUri,
      },
    ]);
    // TODO
    mergedAppConfig = {
      auth: {
        ...appConfiguration.auth,
        ...authOptions,
      },
    };
  }

  const startMsg = bold(cyan("Generating your iTwin Viewer application..."));
  console.log(startMsg);

  const applicationRoot = path.resolve(mainOptions.name);

  copyTemplate(applicationRoot, mainOptions.platform);
  writeConfig(applicationRoot, mainOptions.template, mergedAppConfig);
  writePackageJson(applicationRoot, mainOptions.name);
  installDependencies(applicationRoot, mainOptions.name);
}

main();
