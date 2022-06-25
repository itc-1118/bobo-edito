import {
  camelCase,
  paramCase,
  pascalCase,
  snakeCase,
  constantCase,
  headerCase,
} from 'change-case';

type _maps = { name: string; handle: any; description: string };

// 配置可执行命令
export const changeCaseArray: _maps[] = [
  {
    name: 'camelCase',
    handle: camelCase,
    description: '驼峰(小)',
  },
  {
    name: 'pascalCase',
    handle: pascalCase,
    description: '驼峰(大)',
  },
  {
    name: 'snakeCase',
    handle: snakeCase,
    description: '下划线',
  },
  {
    name: 'paramCase',
    handle: paramCase,
    description: '中划线(小)',
  },
  {
    name: 'headerCase',
    handle: headerCase,
    description: '中划线(大)',
  },
  {
    name: 'constantCase',
    handle: constantCase,
    description: '常量',
  },
];
