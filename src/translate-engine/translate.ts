import { window, workspace } from 'vscode';

const google = require('@asmagin/google-translate-api');
const nodeBaiduTranslate = require('node-baidu-translate');

let baidu: any = null;
export enum EengineType {
  google = 'google',
  baidu = 'baidu',
}
const engineType = {
  google: (src: string, to: string) => {
    return google(src, { to, tld: 'cn' });
  },
  baidu: async (src: string, to: string) => {
    const tokens = workspace.getConfiguration('iEdito').translationBaidu.split(',');
    const [appid, secretKey] = tokens;
    if (!appid || !secretKey) {
      window.showInformationMessage('请设置中配置百度翻译的(appid,secretKey)');
    }
    if (!baidu) {
      baidu = new nodeBaiduTranslate(appid, secretKey);
    }
    const res = await baidu.translate(src, to);
    return { text: res.trans_result[0].dst };
  },
};
export default engineType;
