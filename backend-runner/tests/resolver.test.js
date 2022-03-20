const prepare = require("mocha-prepare");
const assert = require("assert");
const mongoUnit = require("mongo-unit");
const testData = require("./testData.json");

let resolver;
mongoUnit.start({ dbName: "fuschia", port: 4455 }).then(() => {
  process.env.MONGO_DB_URL = mongoUnit.getUrl();
  process.env.PROJECT_ID = "mongoTesting";
  run();
});

after(async () => {
  await mongoUnit.dropDb();
  await mongoUnit.stop();
});
before(async () => {
  await mongoUnit.initDb(testData);
});
let testResolver;
describe("resolver", () => {
  it("should connect to database", async () => {
    const { resolvers } = await (schema =
      require("../src/schema.builder").publish(testData.fuschia[0].projects));
    global.filterParser = require("../src/filter.builder")(resolvers);
    const { resolver } = require("../src/resolver");
    testResolver = resolver;
  });
  it("should insert an item", async () => {
    const newUser = await testResolver.genericCreateResolver(
      "622e0cdd4418968a4d86bada",
      "Users",
      null,
      { Email: "steven@pragmaflow.com", Password: "1" },
      null,
      {}
    );
    assert.strictEqual(
      newUser.Email,
      "steven@pragmaflow.com",
      "Emails are not equal"
    );
  });
  it("should insert a second item", async () => {
    const newUser = await testResolver.genericCreateResolver(
      "622e0cdd4418968a4d86bada",
      "Users",
      null,
      { Email: "mike@pragmaflow.com", Password: "1" },
      null,
      {}
    );
    assert.strictEqual(
      newUser.Email,
      "mike@pragmaflow.com",
      "Emails are not equal"
    );
  });
  it("should get all users", async () => {
    const list = await testResolver.genericListQueryResolver(
      "622e0cdd4418968a4d86bada",
      "Users",
      null,
      { filter: {} },
      null,
      {}
    );
    assert.equal(list.items.length, 2);
  });
  it("should get filtered user", async () => {
    const list = await testResolver.genericListQueryResolver(
      "622e0cdd4418968a4d86bada",
      "Users",
      null,
      { filter: { Email: { ne: "steven@pragmaflow.com" } } },
      null,
      {}
    );
    assert.equal(list.items.length, 1);
  });
});
