const db = require('../db.js')
const fs = require('fs')
jest.mock('fs')

describe('db', () => {
  afterEach(() => {
    fs.clearMocks()
  })
  it('can read', async () => {
    const data = [
      { title: '星期一', done: true },
      { title: '星期二', done: false },
    ]
    fs.setReadFileMock('/xxx', null, JSON.stringify(data))
    const list = await db.read('/xxx')
    expect(list).toStrictEqual(data)
  })

  it('can write', async () => {
    let fakeFile
    fs.setWriteFileMock('/zzz', (path, data, callback) => {
      fakeFile = data
      callback(null)
    })
    const list = [
      { title: '星期一', done: true },
      { title: '星期二', done: false },
    ]
    await db.write(list, '/zzz')
    expect(fakeFile).toBe(JSON.stringify(list))
  })
})
