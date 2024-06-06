var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const dbConfig = require("./db.config.js");
var mysql = require("mysql");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// connection configurations
var dbConn = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});
// connect to database
dbConn.connect();
// Retrieve all plant_species
app.get("/plant_species", function (request, response) {
  dbConn.query(
    "SELECT * FROM plant_species",
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results,
        message: "plant_species_list.",
      });
    }
  );

  module.exports = app;

  // Dohvat svih biljnih porodica #19
  app.get("/botanical_family", function (request, response) {
    dbConn.query(
      "SELECT * FROM botanical_family",
      function (error, results, fields) {
        if (error) throw error;
        return response.send({
          error: false,
          data: results,
          message: "botanical_family list.",
        });
      }
    );
  });
});
// Retrieve plant_species with id
app.get("/plant_species/:id", function (request, response) {
  let plant_species_id = request.params.id;
  if (!plant_species_id) {
    return response.status(400).send({
      error: true,

      message: "Please provide plant_species_id",
    });
  }
  dbConn.query(
    "SELECT * FROM plant_species where id=?",
    plant_species_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results[0],
        message: "error plant_species list.",
      });
    }
  );
});

//dohvat svih biljnih vrsta za jednu botanicku porodicu #23
app.get("/plant_species_by_bf/:id", function (request, response) {
  let botanical_family_id = request.params.id;
  if (!botanical_family_id) {
    return response
      .status(400)
      .send({ error: true, message: "Please provide botanical_family_id" });
  }
  dbConn.query(
"SELECT p.id,p.croatian_name,p.latin_name FROM plant_species AS p LEFT OUTER JOIN genus AS g ON p.genus_id=g.id LEFT OUTER JOIN botanical_family AS bf ON g.botanical_family_id=bf.id WHERE bf.id=?",

   // "SELECT ps.id, ps.croatian_name, ps.latin_name FROM plant_species ps left OUTER join genus g ON ps.genus_id=g.id left OUTER join botanical_family bf on g.botanical_family_id=bf.id where bf.id=?",
    botanical_family_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results,
        message: "plant_species list.",
      });
    }
  );
});

// set port
app.listen(3000, function () {
  console.log("Node app is running on port 3000");
});
module.exports = app;

// Retrieve botanical_family with id
app.get("/botanical_family/:id", function (request, response) {
  let botanical_family_id = request.params.id;
  if (!botanical_family_id) {
    return response
      .status(400)
      .send({ error: true, message: "Please provide botanical_family_id" });
  }
  dbConn.query(
    "SELECT * FROM botanical_family where id=?",
    botanical_family_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results[0],
        message: "botanical_family list.",
      });
    }
  );
});

// Retrieve all useful_part
app.get("/useful_part", function (request, response) {
  dbConn.query("SELECT * FROM useful_part", function (error, results, fields) {
    if (error) throw error;
    return response.send({
      error: false,
      data: results,
      message: "useful_part list.",
    });
  });
});

/*
// Retrieve useful_part with id
app.get("/useful_part/:id", function (request, response) {
  let useful_part_id = request.params.id;
  if (!useful_part_id) {
    return response
      .status(400)
      .send({ error: true, message: "Please provide useful_part_id" });
  }
  dbConn.query(
    "SELECT * FROM useful_part where id=?",
    useful_part_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results[0],
        message: "useful_part list.",
      });
    }
  );
});*/



// Dohvat biljne porodice za jednu biljnu vrstu #21
app.get("/botanical_family_plant_species/:id", function (request, response) {
  let plant_species_id = request.params.id;
  if (!plant_species_id) {
    return response
      .status(400)
      .send({ error: true, message: "Please provide plant_species_id" });
  }
  dbConn.query(
    "SELECT botanical_family.id, botanical_family.croatian_name, botanical_family.latin_name FROM botanical_family LEFT JOIN genus ON botanical_family.id=genus.botanical_family_id LEFT JOIN plant_species ON genus.id=plant_species.genus_id WHERE plant_species.id=?",
    plant_species_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results[0],
        message: "botanical_family_plant_species",
      });
    }
  );
});

// Dohvat fotografije za određenu biljnu vrstu -> Emina i Ivan
app.get("/image/:id", function (request, response) {
  let get_image_id = request.params.id;
  if (!get_image_id) {
    return response
      .status(400)
      .send({ error: true, message: "Please provide get_image_id" });
  }
  dbConn.query(
    "SELECT i.id, i.image_url FROM image i LEFT JOIN plant_species_image psi ON i.id=psi.image_id LEFT JOIN plant_species ps ON psi.plant_species_id=ps.id WHERE ps.id=? LIMIT 1",
    get_image_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results[0],
        message: "plant_species_image.", 
      });
    }
  );
});


// Dohvat svih uporabnih dijelova za određenu biljnu vrstu ili uporabnog dijela prema id uporabnog dijela, pod pretpostavkom da je id pitanja za prvi slučaj 5, a za drugi 6
app.get("/useful_part/:id/:questionid", function (request, response) {
  let plant_species_id = request.params.id;
  let question_id = request.params.questionid;
  
  ;
  if (!plant_species_id) {
    return response
      .status(400)
      .send({ error: true, message: "Please provide plant_species_id" });
  }
  if(question_id==5){
 dbConn.query(
    "SELECT ps.id, ps.croatian_name, up.croatian_name, up.latin_name FROM useful_part up LEFT OUTER JOIN plant_part pp ON up.id=pp.useful_part_id LEFT OUTER JOIN plant_species ps ON pp.plant_species_id=ps.id WHERE ps.id=?",
    plant_species_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results,
        message: "plant_species_usful_parts.", 
      });
    }
  );

    
  }else if (question_id==6){
     dbConn.query(
    "SELECT * FROM useful_part where id=?",
    plant_species_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results[0],
        message: "useful_part list.",
      });
    }
  );
  }
  

});




