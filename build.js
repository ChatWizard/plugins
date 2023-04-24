const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

const rootDir = __dirname;
const pluginsDir = path.resolve(rootDir, "plugins");
const indexPath = path.resolve(rootDir, "index.json");
const builtDir = path.resolve(rootDir, "built");
createDirIfNotExist(builtDir);

function createDirIfNotExist(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function queryIndex() {
  return new Promise((resolve) => {
    https.get("https://chatwizard.github.io/plugins/index.json", (res) => {
      res.on("data", (data) => {
        resolve(JSON.parse(data));
      });
    });
  });
}

async function main() {
  const index = await queryIndex();
  fs.readdir(pluginsDir, (err, pluginDirs) => {
    if (err) throw err;

    for (const pluginDir of pluginDirs) {
      const dir = path.resolve(pluginsDir, pluginDir);
      if (fs.lstatSync(dir).isDirectory()) {
        process.chdir(dir);
        if (fs.existsSync("metadata.json")) {
          const metadata = JSON.parse(fs.readFileSync("metadata.json"));
          const name = metadata.name;
          const builtName = metadata.name.replace(/-/g, "_");
          const version = metadata.version;
          const builtPath = path.resolve(builtDir, `${builtName}.wasm`);

          const existIndex = index.findIndex((plugin) => plugin.name === name);
          if (existIndex !== -1 && index[existIndex].version === version) {
            continue;
          }

          if (fs.existsSync("build.sh")) {
            console.log("Building " + pluginDir);
            execSync(`bash build.sh ${builtPath}`);
          }

          const pluginIndex = {
            ...metadata,
            url: `https://chatwizard.github.io/plugins/plugins/${builtName}.wasm`,
            readme: `https://raw.githubusercontent.com/ChatWizard/plugins/main/plugins/${pluginDir}/README.md`,
            homepage: `https://ChatWizard/plugins/${pluginDir}`,
          };
          if (existIndex === -1) {
            index.push(pluginIndex);
          } else {
            index.splice(existIndex, 1, pluginIndex);
          }
        }
      }
    }
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  });
}

main();
