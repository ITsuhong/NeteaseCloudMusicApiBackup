// module/test.js
module.exports = (query, request) => {
  return {
    status: 200,
    body: {
      code: 200,
      data: {
        message: 'This is a custom test endpoint from module',
        query: query, // 你可以看到传入的所有参数
        timestamp: Date.now()
      }
    },
    cookie: []
  }
}
