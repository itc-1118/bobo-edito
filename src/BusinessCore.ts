import { window, QuickPickItem, QuickPickOptions, workspace } from 'vscode';
import translatePlatforms, { EengineType } from './translate-engine/translate';
import { changeCaseArray } from './config';

interface IDataSetWorks {
  engine: EengineType;
  srcText: string;
  result: string;
}

// 缓存翻译后的结果集合，防止多次触发请求
const translateCacheWords: IDataSetWorks[] = [];

/**
 * 替换选中的内容
 * @param textContent [string] 选中的文本
 */
const vscodeSelected = async (textContent: string): Promise<string | undefined> => {
  const items: QuickPickItem[] = changeCaseArray.map((item) => ({
    label: item.handle(textContent),
    description: item.description,
  }));
  const opts: QuickPickOptions = {
    matchOnDescription: true,
    placeHolder: 'choose replace 选择替换',
  };
  const selected = await window.showQuickPick(items, opts);
  if (!selected) return;

  return selected.label;
};

/**
 * 翻译文本内容
 * @param srcText [string] 选中的文本
 */
const getTranslateResult = async (srcText: string) => {
  const engine: EengineType = workspace.getConfiguration('iEdito').translationEngine;
  const cache = translateCacheWords.find(
    (item) => item.engine === engine && item.srcText === srcText,
  );
  if (cache) {
    return Promise.resolve(cache.result);
  }
  const translate = translatePlatforms[engine] || translatePlatforms.google;
  // 正则判断英文
  if (/^[a-zA-Z\d\s\/\-\._]+$/.test(srcText)) {
    return srcText;
  }
  try {
    window.showQuickPick([{ label: '翻译中，请稍后...' }]);
    const res = await translate(srcText, 'en');
    const result = res.text;
    if (result) {
      translateCacheWords.push({ engine, srcText, result });
    }
    return result;
  } catch (error) {
    window.showInformationMessage(`${engine}翻译异常,请检查网络连接... ${JSON.stringify(error)}`);
    return null;
  }
};

class BusinessCore {
  public async exec(): Promise<void> {
    const vscodeEditor = window.activeTextEditor;
    if (!vscodeEditor) return;

    for (const selection of vscodeEditor.selections) {
      const selectedText = vscodeEditor.document.getText(selection);
      const transSelectedText = await getTranslateResult(selectedText);
      if (!transSelectedText) return;

      const userSelectedText = await vscodeSelected(transSelectedText);
      if (!userSelectedText) return;

      vscodeEditor.edit((builder) => builder.replace(selection, userSelectedText));
    }
  }

  public async typeTranslation(type: string): Promise<void> {
    const changeCase = changeCaseArray.find((item) => item.name === type);
    if (!changeCase) return;

    const vscodeEditor = window.activeTextEditor;
    if (!vscodeEditor) return;

    for (const selection of vscodeEditor.selections) {
      const selectedText = vscodeEditor.document.getText(selection);
      const transSelectedText = await getTranslateResult(selectedText);
      if (!transSelectedText) return;

      vscodeEditor.edit((builder) =>
        builder.replace(selection, changeCase.handle(transSelectedText)),
      );
    }
  }
}

const BCore = new BusinessCore();

export default BCore;
