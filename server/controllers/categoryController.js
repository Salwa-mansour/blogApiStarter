const db = require("../data/categoryData");
const catchAsyncError = require("../utility/catchAsyncError");


exports.createCategory = async (req, res, next) => {
  
 const {categoryName,categoryDesc}=req.body;

 const category = await db.createCategory({categoryName,categoryDesc});
 return res.status(201).json({
    message:`category ${category?.name} created`

 })
}
exports.getCategories = catchAsyncError(async (req, res, next) => {
    const categories = await db.getAllCategories();

    // If you ever want to trigger an error manually:
    if (!categories) {
        const error = new Error("Database connection failed");
        error.statusCode = 500;
        return next(error);
    }

    res.status(200).json(categories);
});
exports.getCateogry = catchAsyncError(async (req, res, next) => {
    const categoryId = parseInt(req.params.id);
    const category = await db.getCategoryById(categoryId);  
    if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json(category);
});
exports.updateCategory = catchAsyncError(async (req, res, next) => {
    const categoryId = parseInt(req.params.id);
    const newData = req.body;

    const updatedCategory = await db.updateCategory(categoryId, newData);

    if (!updatedCategory) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        return next(error);
    }

    res.status(200).json(updatedCategory);
});