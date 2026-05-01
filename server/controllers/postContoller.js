
const db = require("../data/postData");
const catchAsyncError = require("../utility/catchAsyncError");
// const { post } = require("../routes/authRouter");

exports.getMyPosts = catchAsyncError(async (req, res, next) => {
    console.log(req.user)
     const posts = await db.getUserPosts(req.user.id);
    return res.status(200).json({
      message: "all your posts",
       posts
    });
});
exports.postData = catchAsyncError(async (req, res, next) => {
    const postId = parseInt(req.params.id);
    const post = await db.getPostById(postId);
    if(!post){
        return res.status(404).json({
            message:"post not found"
        });
    }
    return res.status(200).json(post);
});
exports.createPost = catchAsyncError(async (req, res, next) => {
    console.log(req.body)
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        isPublished: req.body.isPublished,
        userId: req.user.userId,
        categoryId: parseInt(req.body.categoryId)
    };

    const post = await db.createPost(newPost);
    return res.status(201).json(post);
});

exports.getPosts = catchAsyncError(async (req, res, next) => {
    const posts = await db.getAllposts();
    if(!posts){
        const error = new Error("Database connection failed");
        error.statusCode = 500;
        return next(error);
    }
    return res.status(200).json(posts);
});

exports.updatePost = catchAsyncError(async (req, res, next) => {    
    const postId = parseInt(req.params.id);
    const { title, content, isPublished, categoryId } = req.body;
    // console.log("Updating post with ID:", postId, "New data:", newData);
    const newData = {
        title,
        content,
        isPublished: Boolean(isPublished),
        categoryId: Number(categoryId)
    };
    const newPost = await db.postUpdate(postId,newData);
  //  console.log(newPost)
    return res.status(201).json(newPost )
}
);
exports.deletePost = catchAsyncError(async (req, res, next) => {
    const postId = parseInt(req.params.id);
    const deletedPost = await db.postDelete(postId);
    return res.status(200).json({
        message:"post deleted"
    })
}
);
