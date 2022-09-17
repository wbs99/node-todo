#!/usr/bin/env node

const program = require("commander")
const api = require("./index.js")
const pkg = require("./package.json")

program.version(pkg.version) // node cli.js --version 即可读取到版本

program
  .command("add")
  .description("add a task ")
  .action((...args) => {
    const words = args.slice(0, -1).join("")
    api.add(words).then(
      () => {
        console.log("添加成功")
      },
      () => {
        console.log("添加失败")
      }
    )
  })

program
  .command("clear")
  .description("clear all tasks ")
  .action(() => {
    api.clear().then(
      () => {
        console.log("清除成功")
      },
      () => {
        console.log("清除失败")
      }
    )
  })

program.parse(process.argv)
// 通过 process.argv 的长度来判断命令行中传了几个参数
// node cli.js    process.argv.length = 2
// node cli.js aaa    process.argv.length = 3
// node cli.js aaa bbb    process.argv.length = 4
if (process.argv.length === 2) {
  api.showAll()
}
