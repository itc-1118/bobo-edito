import { ExtensionContext, commands } from 'vscode';
import { changeCaseArray } from './config';
import { checkVersionUpdate } from './utils';
import BCore from './BusinessCore';

/**
 * 钩子：第一次执行命令时，插件会被激活；插件被激活时，这个函数会被调用
 * **必须在入口中实现这个函数**。
 * @function
 * @param context
 */
export function activate(context: ExtensionContext) {
  checkVersionUpdate(context);
  const translation = commands.registerCommand('extension.iEdito', BCore.exec);
  context.subscriptions.push(translation);
  changeCaseArray.forEach((item) => {
    context.subscriptions.push(
      commands.registerCommand(`extension.iEdito.${item.name}`, () =>
        BCore.typeTranslation(item.name),
      ),
    );
  });
}

/**
 * 钩子：清理插件。如果清理过程是异步的，​​deactivate()​​​ 函数必须返回一个 Promise 对象
 * @function
 */
export function deactivate() {}

