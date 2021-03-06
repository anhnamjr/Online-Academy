const express = require("express")
const jwt = require('jsonwebtoken')
const {decodeToken} = require("../middleware/authentication");
const {verifyStudentOrNormal} = require("../middleware/authentication");
const {getAllRootCategory} = require("../services/root-category-service");
const {getTopEnrollCourse} = require("../services/course-service");
const {searchCourse} = require("../services/course-service");
const {getCoursesByCategoryId} = require("../services/course-service");
const {getNewestCourses} = require("../services/course-service");
const {getHighLightCourses} = require("../services/course-service");
const {getCourseByTopView} = require("../services/course-service");
const {getAllCategories} = require("../services/category-service");
const router = express.Router()

router.get('/',verifyStudentOrNormal, async (req, res) => {
    res.render("user/index", {
        user: req.user ? req.user : undefined,
        categories: await getAllCategories(),
        rootCategories: await getAllRootCategory(),
        topTenViewCourses: await getCourseByTopView(),
        highLightCourses: await getHighLightCourses(),
        topEnroll: await getTopEnrollCourse(),
        topNewCourses: await getNewestCourses(),
    });
})

router.get('/category-courses/:categoryid',verifyStudentOrNormal, (req, res) => {

    const id = req.params.categoryid
    const page = req.query.page ? req.query.page : 1
    const order_price = req.query.order_price
    const order_rating = req.query.order_review
    const response = {
        user: req.user ? req.user : undefined,
    }
    if (req.query.order_review) {
        response.order_by = 'order_review'
        response.sort_by = req.query.order_review
    } else if (req.query.order_price) {
        response.order_by = 'order_price'
        response.sort_by = req.query.order_price
    } else {
        response.order_by = "order_review"
        response.sort_by = "DESC"
    }
    getCoursesByCategoryId(id, page, 5, order_price, order_rating).then((payload) => {
        payload.categoryId = id
        getAllCategories().then(async (cat) => {
            response.categories = cat
            response.payload = payload
            response.rootCategories = await getAllRootCategory(),
            res.render("user/category",
                response)
        })
    });
})

router.get('/search',verifyStudentOrNormal, (req, res) => {
    const query = req.query.query;
    // console.log(query)
    const page = req.query.page ? req.query.page : 1
    const order_price = req.query.order_price ? req.query.order_price : null
    const order_rating = req.query.order_review ? req.query.order_review : null
    const user = req.user ? req.user : undefined
    const response = {
        user: user
    }
    if (req.query.order_review) {
        response.order_by = 'order_review'
        response.sort_by = req.query.order_review
    } else if (req.query.order_price) {
        response.order_by = 'order_price'
        response.sort_by = req.query.order_price
    } else {
        response.order_by = "order_review"
        response.sort_by = "DESC"
    }
    searchCourse(query, page, 5, order_rating, order_price).then(payload => {
        // delete courses.Result
        // console.log(payload)
        payload.query = query
        getAllCategories().then(async ( cat) => {
            response.categories = cat
            response.payload = payload
            response.rootCategories = await getAllRootCategory()
            response.highLightCourses = await getHighLightCourses()
            console.log(response)
            res.render("user/search", response)
        })
    })
})

router.get("/signup",decodeToken, (req, res) => {
    res.render("user/signup")
})

router.get("/login",decodeToken, (req, res) => {
    if (!req.user) {
        res.render("user/login")
        return;
    }
    // console.log(req.previousPage)
    if (req.session.previousPage) {
        res.redirect(req.session.previousPage)
    } else {
        res.redirect("/")
    }
})

router.get("/profile", (req,res) => {
        res.redirect('/student/profile')
})

router.get("/logout",decodeToken, (req, res) => {
    res.clearCookie("token");
    res.redirect("/")
})

module.exports = router
