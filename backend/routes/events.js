const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

// ----------------------------- MongoDB ----------------------------------
const { MongoClient, ObjectId } = require("mongodb");
const url = "mongodb+srv://admin:admin@cluster0.2ztwl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
// ------------------------------------------------------------------------

//Static for now but will be connected to a mongo DB after
router.get('/', async function(req, res, next) {
    
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("jbtv");
    // Use the collection "people"
    const col = db.collection("eventList");
    // Find all events later than today and keep only next 2
    const response = await (await col.find({"date": {"$gte": new Date()} }).toArray()).sort((a,b)=>a.date.getTime() - b.date.getTime()).slice(0,3);
    //Get only the date as YYYY-MM-DD
    response.forEach(e => e.date = e.date.toLocaleDateString("fr-FR",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    //Close connection
    await client.close();

    res.status(200).send(response);
});

//Static for now but will be connected to a mongo DB after
router.get('/all', async function(req, res, next) {
    
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("jbtv");
    // Use the collection "people"
    const col = db.collection("eventList");
    // Find all events later than today
    const response = await col.find().toArray();
    //Get only the date as YYYY-MM-DD
    response.forEach(e => e.date = e.date.toLocaleDateString("fr-FR",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    //Close connection
    await client.close();

    res.status(200).send(response);
});

// UPDATE event by id
//To delete send
//   /id?json=JSON.stringify(json object)
router.post('/:id', async function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    console.log(req.query.id);

    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("jbtv");
    const col = db.collection("eventList");
    const result = await col.updateOne({_id: ObjectId(req.params.id)}, {$set: JSON.parse(req.query.json)});
    console.log(result);

    // Return message
    res.json({
      message: `Just updated ${req.query.id} with ${req.query.json}`
  });
});

// UPDATE event by any field !!! ATTENTION TO REDONDENCIES
//To update send
//   /JSON.stringify(json object)?to=JSON.stringify(json object)
router.post('/any/:from', async function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("jbtv");
    const col = db.collection("eventList");

    //const tst = {event : "NEW"};
    //console.log(tst);
    //console.log(JSON.stringify(tst));
    //console.log(req.query.json);
    //console.log(JSON.parse(req.query.json));
    
    const result = await col.updateOne(JSON.parse(req.params.from), {$set: JSON.parse(req.query.to)});
    console.log(result);

    // Return message
    res.json({
      message: `Just updated with ${req.query.to}`
  });
});

// ADD event 
//To add send
//   /?event=...&date=...(ISOFormat date)&name=... etc
router.put('/', async function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    console.log(req.query.id);

    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("jbtv");
    const col = db.collection("eventList");
    const result = await col.insertOne(
        {
            event: req.query.event,
            date: new Date(req.query.date),
            position:
            {
                name: req.query.name,
                coord: 
                {
                    lat: req.query.lat,
                    lng: req.query.lng
                }    
            },
            couvreurs: req.query.couvreurs
        });
    console.log(result);

    // Return message
    res.json({
      message: `Just added ${req.query.name}`
  });
});

//To delete send
//   /?json=JSON.stringify(json object)
router.delete('/', async function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    console.log(req.query.id);

    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("jbtv");
    const col = db.collection("eventList");
    const result = await col.deleteOne(JSON.parse(req.query.json));
    console.log(result);

    // Return message
    res.json({
      message: `Just deleted ${req.query.json}`
  });
});

/*
async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db("jbtv");
        // Use the collection "people"
        const col = db.collection("eventList");
        // Find one document
        return await col.find().toArray();
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);
*/

module.exports = router;