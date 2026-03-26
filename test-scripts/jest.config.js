/**
 * Jest 配置文件 - 密室做题家测试套件
 */

module.exports = {
  // 测试环境
  testEnvironment: 'node',
  
  // 测试文件匹配模式
  testMatch: [
    '**/test-scripts/**/*.test.js',
    '**/test-scripts/**/*.spec.js'
  ],
  
  // 测试文件忽略模式
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test-results/'
  ],
  
  // 覆盖率配置
  collectCoverage: true,
  coverageDirectory: 'test-results/coverage',
  collectCoverageFrom: [
    'backend-server/**/*.js',
    '!backend-server/node_modules/**',
    '!backend-server/**/*.test.js'
  ],
  coverageReporters: [
    'text',
    'html',
    'lcov',
    'clover'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // 测试超时设置
  testTimeout: 10000,
  
  // 并发执行
  maxWorkers: '50%',
  
  // 详细输出
  verbose: true,
  
  // 错误堆栈追踪
  testFailureExitCode: 1,
  
  //  reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: 'true'
    }]
  ],
  
  // 全局设置
  setupFilesAfterEnv: ['./test-scripts/utils/test-helpers.js'],
  
  // 环境变量
  setupFiles: ['dotenv/config']
};
