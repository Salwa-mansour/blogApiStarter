const db = require("../data/categoryData");


exports.createCategory = async (req, res, next) => {
 const {categoryName,categoryDesc}=req.body;
 const category = await db.createCategory({categoryName,categoryDesc});
 return res.status(201).json({
    message:`category ${category.name} created`

 })
}
exports.getCategories=async(req,res,next)=>{
    const categories = await db.getAllCategories()
    if(!categories){
        return res.status(200).json({
            message:"no categories yet"
        })
    }
    return res.status(200).json({
        message:"all categories list",
        categories
    })
}
