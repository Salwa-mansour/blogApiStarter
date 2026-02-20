
const db = require("../data/postData");
// const { post } = require("../routes/authRouter");

async function  getMyPosts(req,res){
    console.log(req.user)
     const posts = await db.getUserPosts(req.user.id);
    return res.status(200).json({
      message: "all your posts",
       posts
    });
}
async function postData(req,res){
    const postId = parseInt(req.params.id);
    const post = await db.getPostById(postId);
    if(!post){
        return res.status(404).json({
            message:"post not found"
        });
    }
    return res.status(200).json({
        message:"post data",
        post
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
async function updatePost(req,res) { 
    const postId = parseInt(req.params.id);
    const newData = req.body;
    const newPost = await db.postUpdate(postId,newData);
    return res.status(201).json({
        message:"post Updated",
        post:newPost
    })
}
async function  deletePost(req,res) {
    const postId =parseInt(req.params.id);
    const deletedPost = await db.postDelete(postId);
    return res.status(200).json({
        message:"post deleted"
    })
}
module.exports={
    getMyPosts,
    postData,
    getPosts,
    createPost,
    updatePost,
    deletePost
}