const express = require("express")
const passport = require("passport");
const router = express.Router()
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const {updateAdministrator} = require("../services/admin-service");
const {updateInstructor} = require("../services/instructor-service");
const {updateUser} = require("../services/user-service");
const urlencodedParser = bodyParser.urlencoded({extended: false})

router.post('/update', urlencodedParser, passport.authenticate('jwt', {session: false}) , (req, res) => {
    const user_inf = req.user
    const user_id = user_inf.id
    const passHashed = bcrypt.hashSync(req.body.password, 10)
    updateUser(user_id, {
        user_name: req.body.name,
        user_password: passHashed,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        birthday: req.body.birthday,
        avatar_url: req.body.avatar,
        user_address: req.body.address,
        updated_at: new Date()
    }).then(() => {
        console.log(user_inf)
        if (user_inf.Instructor){
            updateInstructor(user_inf.Instructor.id, {
                job_title: req.body.job_title,
                short_description: req.body.short_description,
                full_description: req.body.full_description,
            })
        }
        res.json({'msg': 'Update info success'})
    }).catch(() => {
        res.status(400)
    })
})

module.exports = router