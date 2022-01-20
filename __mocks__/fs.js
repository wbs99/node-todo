const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

let readMocks = {}

fs.setReadFileMock = (path, error, data) => {
  readMocks[path] = [error, data]
}

// fa.readFile('xxx',fn)
// 调用 fs.readFile 没传第三个参数 callback 的情况，那么原来第二个参数 options 其实就对应传入的 fn
fs.readFile = (path, options, callback) => {
  if (callback === undefined) {
    callback = options
  }
  if (path in readMocks) {
    callback(readMocks[path][0], readMocks[path][1])
    // 等价于
    //callback(...readMocks[path])
  } else {
    _fs.readFile(path, options, callback)
  }
}

let writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
  writeMocks[path] = fn
}

fs.writeFile = (path, data, options, callback) => {
  if (path in writeMocks) {
    writeMocks[path](path, data, options, callback)
  } else {
    _fs.writeFile(path, data, options, callback)
  }
}

fs.clearMocks = () => {
  readMocks = {}
  writeMocks = {}
}

module.exports = fs
