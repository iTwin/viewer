import { bold, cyan, green } from "kleur/colors";
import { exec } from "child_process";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";
import { uiConfigurations } from "./config/ui.mjs";
import { packageJson } from "./config/package.mjs";
import { appConfiguration } from "./config/app.mjs";
import validatePackageName from "validate-npm-package-name";
import deepmerge from "deepmerge";
import prettier from "prettier";
import { fileURLToPath } from "url";

/**
 * Finalize generation and display next steps
 * @param {*} appName
 */
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

/**
 * Install npm packages
 * @param {*} appRoot
 * @param {*} appName
 */
function installDependencies(appRoot, appName) {
  const npmMsg = "Installing dependencies...";
  console.log(npmMsg);
  process.chdir(appRoot);
  exec("npm install", () => {
    finalize(appName);
  });
}

/**
 * Copy the platform's template from the package to the app directory
 * @param {*} appRoot
 * @param {*} generatorRoot
 * @param {*} platform
 */
function copyTemplate(generatorRoot, appRoot, platform) {
  const templateRoot = path.resolve(generatorRoot, "templates", platform);
  fs.copySync(templateRoot, appRoot);
}

/**
 * Write the uiConfig and appConfig for the template to the src/config.ts file
 * @param {*} appRoot
 * @param {*} template
 * @param {*} mergedAppConfig
 */
function writeConfig(generatorRoot, appRoot, template, mergedAppConfig) {
  // src/config.ts
  const configFilePath = path.resolve(appRoot, "src", "config.ts");
  let configFile = fs.readFileSync(configFilePath, "utf8");
  const uiConfig = `export const uiConfig: UiConfiguration = ${JSON.stringify(
    uiConfigurations[template].config
  )}`;
  const appConfig = `export const appConfig: AppConfiguration = ${JSON.stringify(
    mergedAppConfig
  )}`;
  configFile = configFile.replace("// UI CONFIG HERE", uiConfig);
  configFile = configFile.replace("// APP CONFIG HERE", appConfig);
  configFile = prettier.format(configFile, { parser: "typescript" });
  fs.writeFileSync(configFilePath, configFile);
  // copy the remaining config files
  const sharedConfigPath = path.resolve(generatorRoot, "config", "shared");
  fs.copy(sharedConfigPath, appRoot);
}

/**
 * Write extensions for the selected template to src/extensions.ts
 * This file is imported into App.tsx and used to provide extensions to the Viewer
 * @param {*} generatorRoot
 * @param {*} appRoot
 * @param {*} template
 */
function writeExtensions(generatorRoot, appRoot, template) {
  const templateProviderPath = path.resolve(
    generatorRoot,
    "extensions",
    `${template}.ts`
  );
  let extensions = fs.readFileSync(templateProviderPath, "utf8");
  const extensionFilePath = path.resolve(appRoot, "src", "extensions.ts");
  extensions = prettier.format(extensions, { parser: "typescript" });
  fs.writeFileSync(extensionFilePath, extensions);
}

/**
 * Write the preconfigured package.json file
 * @param {*} appRoot
 * @param {*} appName
 * @param {*} templateDependencies
 */
function writePackageJson(appRoot, appName, platform, templateDependencies) {
  const pkgJson = deepmerge(packageJson.common, packageJson[platform]);
  pkgJson.name = appName;
  pkgJson.version = "0.1.0";
  if (templateDependencies) {
    // add template-specific dependencies
    pkgJson.dependencies = {
      ...pkgJson.dependencies,
      ...templateDependencies,
    };
  }
  const packageJsonPath = path.resolve(appRoot, "./package.json");
  const pkgJsonString = prettier.format(JSON.stringify(pkgJson), {
    parser: "json",
  });
  fs.writeFileSync(packageJsonPath, pkgJsonString);
}

async function main() {
  const welcomeMsg = bold(
    cyan("Welcome to the iTwin Viewer Application Generator!")
  );
  console.log(welcomeMsg);

  const templates = [];

  for (const template in uiConfigurations) {
    // create a list of template options to present to the user
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

  // web-specific prompts
  let webOptions;
  if (mainOptions.platform === "web") {
    webOptions = await prompts([
      {
        type: "text",
        name: "iTwinId",
        message: "Enter a default iTwinId",
      },
      {
        type: "text",
        name: "iModelId",
        message:
          "Enter a default iModelId (that is associated with the iTwinId that you entered in the previous step)",
      },
    ]);
  }

  const appConfig = deepmerge(
    appConfiguration.common,
    appConfiguration[mainOptions.platform]
  );

  let mergedAppConfig = {
    ...appConfig,
  };
  if (webOptions?.iTwinId) {
    mergedAppConfig.iTwinId = webOptions?.iTwinId;
  }
  if (webOptions?.iModelId) {
    mergedAppConfig.iModelId = webOptions?.iModelId;
  }
  if (mainOptions.auth === true) {
    // user wishes to enter auth config via the CLI
    const authOptions = await prompts([
      {
        type: "text",
        name: "authority",
        message: "Enter the authority for your Identity Provider",
        initial: mergedAppConfig.auth.authority,
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
        initial: mergedAppConfig.auth.scope,
      },
      {
        type: "text",
        name: "redirectUri",
        message: "Enter your redirect uri",
        initial: mergedAppConfig.auth.redirectUri,
      },
      {
        type: "text",
        name: "postSignoutRedirectUri",
        message: "Enter your post logout redirect uri",
        initial: mergedAppConfig.auth.postSignoutRedirectUri,
      },
    ]);
    mergedAppConfig = {
      ...mergedAppConfig,
      auth: {
        ...mergedAppConfig.auth,
        ...authOptions,
      },
    };
  }

  const startMsg = bold(cyan("Generating your iTwin Viewer application..."));
  console.log(startMsg);

  const applicationRoot = path.resolve(mainOptions.name);
  const generatorRoot = path.dirname(fileURLToPath(import.meta.url));

  copyTemplate(generatorRoot, applicationRoot, mainOptions.platform);
  writeConfig(
    generatorRoot,
    applicationRoot,
    mainOptions.template,
    mergedAppConfig
  );
  writeExtensions(generatorRoot, applicationRoot, mainOptions.template);
  writePackageJson(
    applicationRoot,
    mainOptions.name,
    mainOptions.platform,
    uiConfigurations[mainOptions.template].dependencies
  );
  installDependencies(applicationRoot, mainOptions.name);
}

main();
