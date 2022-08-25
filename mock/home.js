/*
 * @Author: Jin Haocong
 * @Date: 2022-08-25 16:39:00
 * @LastEditTime: 2022-08-25 17:07:02
 */
const data = require('./data.json')
module.exports = [
  {
    url: '/home/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data
      }
    }
  }
]
