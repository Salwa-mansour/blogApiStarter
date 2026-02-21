const db = require("../data/commentsData");

async function createComment(req,res) {
   
    const newComment={
       
        content:req.body.content,
        postId:parseInt(req.params.postId),
        userId:parseInt(req.user.userId),
       
    }
 
    const comment = await db.createComment(newComment);
    return res.status(201).json({
        message:"Comment created !",
        comment
        
    });
}
async function getPostComments(req,res){
    const postId = parseInt(req.params.postId);
    const comments = await db.getPostComments(postId);  
    return res.status(200).json({
        message:"Comments retrieved successfully !",
        comments
    });
}
async function commentData(req,res){
    const commentId = parseInt(req.params.id);
    const comment = await db.getCommentById(commentId);
    return res.status(200).json({
        message:"Comment retrieved successfully !",
        comment
    });
}
async function updatecomment(req,res){
    const commentId = parseInt(req.params.id);
    const updatedData = {   
        content: req.body.content
    };
    const updatedComment = await db.updateComment(commentId, updatedData);
    return res.status(200).json({
        message:"Comment updated successfully !",
        comment: updatedComment
    });
}
async function deletecomment(req,res){
    const commentId = parseInt(req.params.id);
    const deletedComment = await db.deleteComment(commentId);
    return res.status(200).json({
        message:"Comment deleted successfully !",
        comment: deletedComment
    });
}
module.exports = {
    createComment,
    getPostComments,
    commentData,
    updatecomment,
    deletecomment
}