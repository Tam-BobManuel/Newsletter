const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


        // API
const apikey = process.env.apikey;
const fs = require('fs');
const configFile = fs.readFileSync('Api.json');
const config = JSON.parse(configFile);
const apiKey = config.api_key;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/5e3e333420";
    const options = {
        method: "POST",
        auth: `Bearer ${apiKey}`
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (d) => {
            console.log(JSON.parse(d));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000...");
});
