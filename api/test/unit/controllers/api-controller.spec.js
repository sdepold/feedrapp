const { readFile } = require("node:fs/promises");
const sinon = require("sinon");
const expect = require("chai").expect;
const request = require("request");
const {
  handleFeedRequest,
} = require("../../../src/controllers/api-controller");
const { readdirSync } = require("node:fs");

describe("API Controller", () => {
  afterEach(() => {
    if (request.get.restore) {
      request.get.restore();
    }
  });

  describe("handleFeedRequest", () => {
    describe("captured requests", () => {
      getCaptures().forEach((file) => {
        it(`can replay parsing of captured requests (${file})`, async () => {
          const [req, res] = await prepareCall(file);
          await handleFeedRequest(req, res);
          expectToReturn(res, file);
        });
      });

      describe("q query param", () => {
        it("returns an error if no q param is defined", async () => {
          const req = { query: {} }; // no q param
          const res = { set: sinon.spy(), json: sinon.spy() };

          await mockFeedContent("random-order.xml");
          await handleFeedRequest(req, res);

          const response = getResponse(res);

          expect(response.responseStatus).to.eql(400);
          expect(response.responseDetails.message).to.eql("No q param found!");
        });
      });

      describe("ordering", () => {
        async function expectOrder(query, mapFun, expectedOrder) {
          const req = { query: { q: "order test", ...query } };
          const res = { set: sinon.spy(), json: sinon.spy() };

          await mockFeedContent("random-order.xml");
          await handleFeedRequest(req, res);

          const response = getResponse(res);
          const order = response.responseData.feed.entries.map(mapFun);

          expect(order).to.deep.equal(expectedOrder);
        }

        it("does not sort the entries by default", () =>
          expectOrder(
            { num: 15 },
            (entry) => entry.publishedDate.toISOString(),
            [
              "2016-08-21T04:00:03.000Z",
              "2015-08-20T04:00:23.000Z",
              "2015-08-18T04:00:32.000Z",
              "2012-08-17T04:00:00.000Z",
              "2015-08-16T17:20:07.000Z",
              "2018-08-13T18:14:56.000Z",
            ]
          ));

        it("allows sorting date fields", () =>
          expectOrder(
            { num: 15, order: "publishedDate" },
            (entry) => entry.publishedDate.toISOString(),
            [
              "2012-08-17T04:00:00.000Z",
              "2015-08-16T17:20:07.000Z",
              "2015-08-18T04:00:32.000Z",
              "2015-08-20T04:00:23.000Z",
              "2016-08-21T04:00:03.000Z",
              "2018-08-13T18:14:56.000Z",
            ]
          ));

        it("allows defining an order field", () =>
          expectOrder({ num: 15, order: "title" }, (entry) => entry.title, [
            "Baby 2.0 schläft im eigenen Zimmer! Manchmal",
            "Eingewöhnung im Kindergarten – Woche 1",
            "Ich, die meckernde Schwiegermutter",
            "Kaufempfehlung: Sehr gerne, Mama, du Arschbombe",
            "Weniger Lego, mehr Oma und Erdbeerland – 26",
            "Zelten mit Kleinkind – ein Abenteuer!",
          ]));

        it("allows reverse ordering", () =>
          expectOrder({ num: 15, order: "-title" }, (entry) => entry.title, [
            "Zelten mit Kleinkind – ein Abenteuer!",
            "Weniger Lego, mehr Oma und Erdbeerland – 26",
            "Kaufempfehlung: Sehr gerne, Mama, du Arschbombe",
            "Ich, die meckernde Schwiegermutter",
            "Eingewöhnung im Kindergarten – Woche 1",
            "Baby 2.0 schläft im eigenen Zimmer! Manchmal",
          ]));
      });

      it("can handle invisible characters", async () => {
        const req = { query: { q: "test", num: 3 } };
        const res = { set: sinon.spy(), json: sinon.spy() };

        await mockFeedContent("invisible-characters.xml");
        await handleFeedRequest(req, res);

        const response = getResponse(res);
        const entry = response.responseData.feed.entries[0];

        expect(entry.content).to.contain("Libraries</strong>The Penn");
      });
    });
  });
});

async function prepareCall(file) {
  const numOption = file.match(/num(\d)*/);
  const extraParams = numOption ? { num: numOption[1] } : {};
  const sourceFile = file.replace("json", "xml");
  const req = { query: { q: file, ...extraParams } };
  const res = {
    send: sinon.spy(),
    set: sinon.spy(),
    json: sinon.spy(),
  };

  await mockFeedContent(sourceFile);

  return [req, res];
}

async function mockFeedContent(sourceFile) {
  const feedContent = await readFile(
    `${__dirname}/fixtures/source/${sourceFile}`
  );
  sinon.stub(request, "get", (_, cb) => {
    cb(null, null, feedContent);
  });
}

function getCaptures() {
  return readdirSync(`${__dirname}/fixtures/parsed`)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => f.includes(process.env.FIXTURE || ""));
}

function getResponse(res) {
  return res.json.getCalls()[0].args[0];
}

function expectToReturn(res, snapshotName) {
  const actual = getResponse(res);
  const expected = require(`./fixtures/parsed/${snapshotName}`);
  //   console.log(JSON.stringify(actual));

  if (expected.responseData.feed) {
    expected.responseData.feed.feedUrl = snapshotName;
    expected.responseData.feed.entries = expected.responseData.feed.entries.map(
      (entry) => ({
        enclosure: undefined,
        thumbnail: undefined,
        ...entry,
        publishedDate: entry.publishedDate
          ? new Date(entry.publishedDate)
          : undefined,
      })
    );
  }

  expect(actual).to.deep.equal(expected);
}
