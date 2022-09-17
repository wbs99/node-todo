const homedir = require("os").homedir()
const home = process.env.HOME || homedir // 获取 home 变量或是目录
const p = require("path")
const fs = require("fs")
const dbPath = p.join(home, ".todo")

//  fs.readFile 是异步，通过 Promise 返回读取到的 list 数据
const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(dbPath, { flag: "a+" }, (error, data) => {
        if (error) return reject(error)
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (error2) {
          list = []
        }
        resolve(list)
      })
    })
  },
  write(list) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(dbPath, string + "\n", error => {
        if (error) return reject(error)
        resolve()
      })
    })
  },
}

module.exports = db
