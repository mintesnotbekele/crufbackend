const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://crudtest-d21c0-default-rtdb.firebaseio.com"
});

const express = require("express");
const app = express();
const cors = require("cors");
const { QuerySnapshot } = require("firebase-admin/firestore");
app.use(cors({origin: true}));
const db = admin.firestore();

// Routes

app.get("/hello", (req, res) =>{
  return res.status(200).send("hello world");
});


// Create
app.post("/api/employees", (req, res) =>{
    
    (async () => {
      try
      {
          await db.collection(`employees`).doc('/'+ req.body.id+ '/')
          .create({
              name: req.body.name,
              description: req.body.description,
              age: req.body.age,
          })
          return res.status(200).send();
      }
      catch(error)
      {
          console.log(error);
          return res.status(500).send();
      }
    })();
  });


// Edit

// Update

// Get
app.get("/api/employees/:id", (req, res) =>{
    
    (async () => {
      try
      {
        const document = db.collection('employees').doc(req.body.id);
        let employee = await document.get();
        let response = employee.data();

        return res.status(200).send(response);
      
      }
      catch(error)
      {
          console.log(error);
          return res.status(500).send();
      }
    })();
  });

  // Read All
  app.get("/api/employees", (req, res) =>{
    
    (async () => {
      try
      {
        const Query = db.collection('employees');
        let response = [];
        await Query.get().then(QuerySnapshot=>{
            let docs= QuerySnapshot.docs;

            for(let doc of docs)
            {
                const selecteItem = {
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    age: doc.data().age
                }
                response.push(selecteItem);
            }
            return response;
        }) 

        return res.status(200).send(response);
      }
      catch(error)
      {
          console.log(error);
          return res.status(500).send();
      }
    })();
  });

//update

app.put("/api/employees/:id", (req, res) =>{
    
    (async () => {
      try
      {
        const document = db.collection('employees').doc("req.params.id");
        await document.update({
            name: req.body.name,
            description: req.body.description,
            age: req.body.age
        });

        return res.status(200).send();
      
      }
      catch(error)
      {
          console.log(error);
          return res.status(500).send();
      }
    })();
  });

// Delete Employee
app.put("/api/delete/:id", (req, res) =>{
    
    (async () => {
      try
      {
        const document = db.collection('employees').doc(req.params.id);
        await document.delete();
        return res.status(200).send();
      
      }
      catch(error)
      {
          console.log(error);
          return res.status(500).send();
      }
    })();
  });


// export api to firebase cloud

exports.app = functions.https.onRequest(app);
