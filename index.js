const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const port = 3000;

// Set up default mongoose connection
const url = "mongodb+srv://altaras_server:9Uqym1iwAI1NmQNy@cluster0.lppy8eb.mongodb.net/test";
const client = new MongoClient(url);

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

const dbName = "Clinic";
let db;
client
  .connect()
  .then(async () => {
    db = client.db(dbName);
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log(err);
    console.log("Unable to connect to Mongodb");
  });

//List of Patients
app.get("/Patients/", (req, res) => {
  db.collection("Patients")
    .find({})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log("err");
      return res.json({ msg: "There was an error processing your query" });
    });
});

app.post("/Patients", (req, res) => {
  const Name = req.body.Name;
  const age = req.body.age;
  const diagnosis = req.body.diagnosis;
  const nationality = req.body.nationality;
  const region = req.body.region;
  db.collection("Patients")
   .insert({Name, age , diagnosis, nationality, region})
   .then((records) => {
      return res.json(records);
  })
   .catch((err) => {
      console.log(err); 
      return res.json({ msg: "There was an error processing your query" });
  })
}); 

app.put("/Patients/:Name", (req, res) => {
  const name = req.params.Name;
  db.collection("Patients")
   .updateOne({Name: String(Name)},{$set:req.body})
   .then((records) => {
      return res.json(records);
   })
   .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
     })
});

app.get("/Patients/:Name", (req, res) => {
  const name = req.params.Name;
  db.collection("Patients")
    .find({Name: String(Name)})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
});

//List of Meds
app.get("/Medication/:_id", (req, res) => {
  const id = req.params._id;
  db.collection("Medication")
    .find({_id: ObjectId(id)})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
}); 

  //Create prescriptions
  app.post("/Prescriptions", (req, res) => {
    console.log(req.body);
    const {Name,medication,date} = req.body;
    db.collection("Prescriptions")
      .insertOne({Name,medication,date})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Delete a patient
  app.delete("/Patients/:_id", (req, res) => {
    const name = req.params._id
      db.collection("Patients")
     .deleteOne({_id})
     .then((records) => {
        return res.json(records);
     })
     .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
       })
  });

  //Delete a prescription
  app.delete("/Prescription/:name/:medication", (req, res) => {
    const id = req.params._id;
    db.collection("Prescription")
      .deleteOne(
        {
          _id: ObjectId(_id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Add a medication to the prescription
  app.put("/Prescriptions/:name/:medication", (req, res) => {
    const name = req.params.Name;
    const date = req.params.date;
    const medications = req.body.medications;
    db.collection("prescriptions")
      .updateOne({name: String(name),date: String(date)},{$addToSet:{medications}})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Remove a medication from a prescription
  app.put("/medications/:name/:date", (req, res) => {
    const name = req.params.name;
    const date = req.params.date;
    const medications = req.body.medication;
    db.collection("Medication")
     .updateOne({name: String(name),date: String(date)},{$pull:{medication}})
     .then((records) => {
        return res.json(records);
     })
     .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
       })
  });

  //Update patient
  app.put("/Patients/:Name", (req, res) => {
    const Name = req.params.Name;
    db.collection("Patients")
      .updateOne(
        {
          Name: Name
        },
        {
          $set:req.body
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});