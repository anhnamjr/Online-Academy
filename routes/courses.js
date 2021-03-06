const express = require("express")
const {updateCourse} = require("../services/course-service");
const {getAllRootCategory} = require("../services/root-category-service");
const {isOwn} = require("../services/bought-service");
const {getTopBuyCourseByCategoryId} = require("../services/course-service");
const {getAllCategories} = require("../services/category-service");
const {getCourse} = require("../services/course-service");
const router = express.Router()

router.get('/:id', async (req, res) => {
    getCourse({id: req.params.id}).then(async course => {
        course.courseId = req.params.id
        updateCourse(course.id, {
            view_number: Number(course.view_number) + 1
        })
        res.render("user/course",{
            user: req.user ? req.user : undefined,
            isLog: req.user ? true : false,
            payload: course,
            rootCategories: await getAllRootCategory(),
            categories: await getAllCategories(),
            topBuyCourses: await getTopBuyCourseByCategoryId(course.Category.id),
            isOwn: req.user ? await isOwn(req.user.role_id, req.params.id) : false
        })
    })
})

module.exports = router
