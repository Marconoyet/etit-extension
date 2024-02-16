const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://ncap789:BrDxHP97NrEbJsQJ@cluster0.8qnwrfw.mongodb.net/?retryWrites=true&w=majority";
const loclURI = "mongodb://localhost:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// mongodb+srv://ncap789:<password>@cluster0.8qnwrfw.mongodb.net/
const client = new MongoClient(loclURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function createDate(client, newObj) {
  const result = await client.db("tatb3").collection("dates").insertOne(newObj);
  console.log(`New date is added with the following id: ${result.insertedId}`);
}

async function searchDate(client, date) {
  const result = await client
    .db("tatb3")
    .collection("dates")
    .findOne({ date: date });
  if (result) {
    console.log(`Found a lisiting in the collection with the date ${date}`);
    console.log(result);
  } else {
    console.log(`No lisiting fouj nd with this date ${date}`);
  }
}

async function updateDate(client, date, updatedListing) {
  const result = await client
    .db("tatb3")
    .collection("dates")
    .updateOne({ date: date }, { $set: updatedListing });
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function deleteDate(client, date) {
  const result = await client
    .db("tatb3")
    .collection("dates")
    .deleteOne({ date: date });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await createDate(client, {
      date: Date.now(),
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
