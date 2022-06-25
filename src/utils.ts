import { window, ExtensionContext } from 'vscode';
const changeLog = require('../changelog.json');

/**
 * 检测版本更新
 * @function
 */

export const checkVersionUpdate = (context: ExtensionContext) => {
  const { packageJSON } = context.extension;
  const { globalState } = context;
  const CACHE_KEY = `${packageJSON.name}-${packageJSON.version}`;
  const version = globalState.get(CACHE_KEY);
  const extensionVersion = packageJSON.version;

  const contentText = `
  ${packageJSON.displayName}更新:\r${changeLog[packageJSON.version].description}\r
  `;
  if (version !== extensionVersion) {
    globalState.update(CACHE_KEY, extensionVersion);
    window.showInformationMessage(contentText, { modal: true });
  }
};
