
const db = require("../data/postData");

async function  getMyPosts(req,res){

    return res.status(200).json({
      message: "all your posts",
      
    });
}

async function createPost(req,res) {
   
    const newPost={
        title:req.body.title,
        content:req.body.content,
        isPublished:req.body.isPublished,
        userId:req.user.userId,
        categoryId:parseInt(req.body.categoryId) 
    }
 
    const post = await db.createPost(newPost);
    return res.status(201).json({
        message:"post created !",
        post
        
    });
}
async function getPosts(req,res){
    const posts = await db.getAllposts();
    return res.status(200).json({
        message:"all posts",
        posts       
    });
}
module.exports={
    getPosts,
    createPost
}