// jshint esversion:6
// jshint esversion:8
import express from 'express'
import bodyParser from 'body-parser'
import request from 'request'
import https from 'https'
import mailchimp from '@mailchimp/mailchimp_marketing'
import dotenv from 'dotenv'
import path from 'path'

const app = express()
const __dirname = path.resolve()
dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER_KEY,
  })

  const run = async () => {
    const response = await mailchimp.lists
      .batchListMembers('5319835474', {
        members: [
          {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            },
          },
        ],
      })
      .then((response) => {
        if (response) {
          if (response.errors.length !== 0) {
            res.sendFile(__dirname + '/failure.html')
          } else {
            res.sendFile(__dirname + '/success.html')
          }
          console.log(
            `Successfully added contact as an audience member. 
            The contact's id is ${
              response.new_members.length > 0
                ? response.new_members[0].id
                : 'already registered'
            }.`
          )
        }
      })
      .catch((err) => {
        console.log(err)
        res.sendFile(__dirname + '/failure.html')
      })
  }
  run()
})
app.listen(process.env.PORT || 3000, (req, res) => {
  console.log('server running:3000')
})
