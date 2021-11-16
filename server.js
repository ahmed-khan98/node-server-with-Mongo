const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan');

const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.use(morgan('short'))

mongoose.connect('mongodb+srv://ahmedkhan:ahmedmongo@cluster0.kqjqd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
const user = mongoose.model('user',
    {
        name: String,
        email: String,
        address: String,
    });





app.use((req, res, next) => {
    console.log("a request came", req.body);
    next();
})

app.get('/users', (req, res) => {
    user.find({}, (error, users) => {
        if (!error) {
            res.send(users)
        }
        else {
            res.status(500).send("error happen")
        }
    })
})

app.get('/user/:id', (req, res) => {
    user.findOne({ _id: req.params.id }, (error, user) => {
        if (!error) {
            res.send(user)
        }
        else {
            res.status(500).send("error happend")
        }
    })
}
)

app.post('/user', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.address) {
        res.status(400).send("invalid data")
    }
    else {
        const newuser = new user({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address
        });

        newuser.save().then(() => {
            console.log("user created success")
            res.send("user created")
        });
    }
})
app.put('/user/:id', (req, res) => {
    let obj = {}
    if (req.body.name) {
        obj.name = req.body.name
    }
    if (req.body.email) {
        obj.email = req.body.email
    }
    if (req.body.address) {
        obj.address = req.body.address
    }

    user.findByIdAndUpdate(req.params.id, obj, { new: true },
        (error, data) => {
            if (!error) {
                res.send(data)
            }
            else {
                res.status(500).send("error happened")
                console.log(error)
            }
        }
    )
})

app.delete('/user/:id', (req, res) => {
    user.findByIdAndRemove(req.params.id, (error, data) => {
        if (!error) {
            res.send("user deleted")
        }
        else {
            res.status(500).send("error happened")
        }
    })
})



app.listen(port, () => {
    console.log(`http://localhost${port}`)
})