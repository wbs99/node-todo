const db = require("./db.js")
const inquirer = require("inquirer")

// 添加
module.exports.add = async title => {
  const list = await db.read()
  list.push({ title, done: false })
  await db.write(list)
}

// 清空 TODO
module.exports.clear = async title => {
  await db.write([])
}

// 标记为已完成
const markHasDone = (list, index) => {
  list[index].done = true
  db.write(list)
}

// 标记为未完成
const markUnDone = (list, index) => {
  list[index].done = true
  db.write(list)
}

// 更新 TODO 标题
const updateTitle = (list, index) => {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "请输入新的标题",
      default: list[index].title,
    })
    .then(answer => {
      list[index].title = answer.title
      db.write(list)
    })
}

// 删除 TODO
const remove = (list, index) => {
  list.splice(index, 1)
  db.write(list)
}

const askForAction = (list, index) => {
  const actions = { markHasDone, markUnDone, updateTitle, remove }
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "请选择操作",
        choices: [
          { name: "退出", value: "quit" },
          { name: "已完成", value: "markHasDone" },
          { name: "未完成", value: "markUnDone" },
          { name: "修改任务名", value: "updateTitle" },
          { name: "删除", value: "remove" },
        ],
      },
    ])
    .then(answer2 => {
      const action = actions[answer2.action]
      action && action(list, index)
    })
}

const askForCreateTask = list => {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "请输入新的标题",
    })
    .then(answer => {
      list.push({ title: answer.title, done: false })
      db.write(list)
    })
}

const printfTasks = list => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "请选择你想操作的任务",
        choices: [
          { name: "退出", value: "-1" },
          ...list.map((task, index) => {
            return {
              name: `${task.done ? "[√]" : "[X]"}  ${index + 1} - ${
                task.title
              }`,
              value: index.toString(),
            }
          }),
          { name: "+ 创建任务", value: "-2" },
        ],
      },
    ])
    .then(answer => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    })
}

module.exports.showAll = async () => {
  const list = await db.read()
  printfTasks(list)
}
