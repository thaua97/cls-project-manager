// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	{
		rules: {
			// Code Quality
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'warn',
			'no-alert': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'prefer-arrow-callback': 'error',
			'no-unused-vars': 'off', // Handled by TypeScript
      
			// Vue Specific
			'vue/multi-word-component-names': 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/require-default-prop': 'error',
			'vue/require-prop-types': 'error',
			'vue/component-name-in-template-casing': ['error', 'PascalCase'],
			'vue/html-self-closing': ['error', {
				html: {
					void: 'always',
					normal: 'always',
					component: 'always'
				}
			}],
			'vue/max-attributes-per-line': ['error', {
				singleline: 3,
				multiline: 1
			}],
			'vue/html-indent': ['error', 'tab'],
			'vue/script-indent': ['error', 'tab', { baseIndent: 0 }],
			'vue/max-len': ['error', { code: 120, tabWidth: 1, ignoreUrls: true, ignoreStrings: true }],
      
			// TypeScript
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
      
			// Code Style
			'indent': ['error', 'tab', { SwitchCase: 0 }],
			'quotes': ['error', 'single', { avoidEscape: true }],
			'semi': ['error', 'never'],
			'comma-dangle': ['error', 'never'],
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'arrow-spacing': 'error',
			'space-before-blocks': 'error',
			'keyword-spacing': 'error',
			'max-len': ['error', { code: 80, tabWidth: 1, ignoreUrls: true, ignoreStrings: true }],
      
			// Best Practices
			'eqeqeq': ['error', 'always'],
			'curly': ['error', 'all'],
			'no-eval': 'error',
			'no-implied-eval': 'error',
			'no-with': 'error',
			'no-loop-func': 'error',
			'no-new-func': 'error'
		}
	}
)
