import fs from "fs";
import path from "path";

const version = ["1.0.0-beta.2", "1.0.0-beta.1"];

const updateSuccess = (filePath) => {
  console.log(`版本号更新成功: ${filePath}`);
};

const updateFail = (filePath, error) => {
  console.error(`版本号更新失败: ${error.message}`);
};

/**
 * 更新 release.yml 文件内容
 * @param {string} filePath 文件路径
 */
function updateReleaseYml(filePath) {
  try {
    let fileContent = fs.readFileSync(filePath, "utf8");

    fileContent = fileContent
      .replace(/^run-name:.*/m, `run-name: \${{ github.actor }} releases: ${version[0]}`)
      .replace(/^\s*tag_name:\s*.*/m, `          tag_name: ${version[0]}`)
      .replace(/^\s*release_name:\s*.*/m, `          release_name: ${version[0]}`);

    fs.writeFileSync(filePath, fileContent, "utf8");

    updateSuccess(filePath);
  } catch (error) {
    updateFail(filePath, error);
  }
}

/**
 * 更新 package.json 文件内容
 * @param {string} filePath 文件路径
 */
function updatePackageJson(filePath) {
  try {
    let fileContent = fs.readFileSync(filePath, "utf8");

    fileContent = fileContent.replace(/"version":\s*".*"/, `"version": "${version[0]}"`);

    fs.writeFileSync(filePath, fileContent, "utf8");

    updateSuccess(filePath);
  } catch (error) {
    updateFail(filePath, error);
  }
}

/**
 * 读取本地 release.yml、package.json 文件，更新版本号
 *
 * yml 文件替换内容：
 * 1. 以 run-name 开头的行替换为 run-name: ${{ github.actor }} releases: version[0]
 * 2. 以 tag_name 开头的行替换为 tag_name: version[0]
 * 3. 以 release_name 开头的行替换为 release_name: version[0]
 *
 * package.json 文件替换内容：
 * 1. 以 "version": " 开头的行替换为 "version": "version[0]"
 */
const versionConfig = () => {
  const releaseYmlPath = path.join(process.cwd(), ".github", "release.yml");
  const packageJsonPath = path.join(process.cwd(), "package.json");

  updateReleaseYml(releaseYmlPath);
  updatePackageJson(packageJsonPath);
};

versionConfig();
