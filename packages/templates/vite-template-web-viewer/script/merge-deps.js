const fs = require("fs");
const path = require("path");

const packageJsonPath = path.resolve(process.cwd(), "package.json");
const templateJsonPath = path.resolve(process.cwd(), "template.json");

function mergeDependenciesOnce() {
  if (!fs.existsSync(templateJsonPath)) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const templateJson = JSON.parse(fs.readFileSync(templateJsonPath, "utf-8"));

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  // Check if merge needed for dependencies
  const depsToAdd = Object.entries(templateJson.dependencies || {}).filter(
    ([dep]) => !(dep in packageJson.dependencies)
  );
  // Check if merge needed for devDependencies
  const devDepsToAdd = Object.entries(templateJson.devDependencies || {}).filter(
    ([dep]) => !(dep in packageJson.devDependencies)
  );

  if (depsToAdd.length === 0 && devDepsToAdd.length === 0) {
    return;
  }

  // Merge dependencies
  depsToAdd.forEach(([dep, version]) => {
    packageJson.dependencies[dep] = version;
  });

  // Merge devDependencies
  devDepsToAdd.forEach(([dep, version]) => {
    packageJson.devDependencies[dep] = version;
  });

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  //Delete template.json after first merge
  fs.unlinkSync(templateJsonPath);
}

mergeDependenciesOnce();
