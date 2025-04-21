import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 全局忽略文件
  { ignores: ['dist', '.eslintrc.cjs'] },

  // JavaScript/TypeScript 基础规则
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [
      js.configs.recommended, // ESLint 推荐规则
      ...tseslint.configs.recommended, // TypeScript 推荐规则
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser },
    },
    rules: {
      // 基础规则调整
      'no-unused-vars': 'off', // 由 TypeScript 处理
      '@typescript-eslint/no-unused-vars': 'warn', // TypeScript 版未使用变量检查
      '@typescript-eslint/no-explicit-any': 'warn', // 允许 any 但警告
    },
  },

  // React 相关规则
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // 自动包含 rules-of-hooks (error) 和 exhaustive-deps (warn)
      'react-refresh/only-export-components': [
        // React Fast Refresh 规则
        'warn',
        { allowConstantExport: true },
      ],
      // 可选的 React 规则覆盖
      'react-hooks/exhaustive-deps': 'warn', // 调整为 warn（如需禁用可改为 'off'）
    },
  }
);
