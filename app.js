// jshint esversion:6
// jshint esversion:8
const express =  require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require('@mailchimp/mailchimp_marketing');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res)=> {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;


    mailchimp.setConfig({
      apiKey: "5d43b0711a180a039dca85adc9a98cbb-us2",
      server: "us2",
    });
    
    const run = async () => {
      const response = await mailchimp.lists.batchListMembers("5319835474", {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }],
      }).then((response) => {
          res.sendFile(__dirname + "/success.html");
        console.log(
            `Successfully added contact as an audience member. 
            The contact's id is ${response.id}.`
        );
    }).catch((err) =>{ 
        res.sendFile(__dirname + "/failure.html");
        console.log(err);
    });
    
     
    
    
    
    
    
    
};
run();

});
app.listen(process.env.PORT || 3000, (req, res)=> {
console.log("server running:3000");
});