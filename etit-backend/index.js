const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://ncap789:BrDxHP97NrEbJsQJ@cluster0.8qnwrfw.mongodb.net/?retryWrites=true&w=majority";
const loclURI = "mongodb://localhost:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// mongodb+srv://ncap789:<password>@cluster0.8qnwrfw.mongodb.net/
const client = new MongoClient(uri, {
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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await createDate(client, {
      [Date.now()]: {
        name: "First Date",
      },
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
