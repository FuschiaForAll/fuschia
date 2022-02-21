const prepare = require('mocha-prepare')
const mongoUnit = require('mongo-unit')
const testData = require('./testData.json')

let resolver
mongoUnit.start({ dbName: "fuschia" }).then(
  () => {
    process.env.MONGO_DB_URL = mongoUnit.getUrl()
    process.env.PROJECT_ID = "mongoTesting"
    run()
  }
)

after(async () => {
  await mongoUnit.stop()
})

describe('resolver', () => {
  before(() => {
    resolver = require('../src/resolver')
  })
  beforeEach(() => mongoUnit.initDb(testData))
  afterEach(() => mongoUnit.dropDb())
  it('should get all users', async () => {
    const list = await resolver.genericListQueryResolver("620ea47c7e41372547be8470", "Users", null, { filter: {} }, null, info)
    expect(list.length).toBe(1)
  })
})