const db = require("../data/commentData");

async function createComment(req,res) {
   
    const newComment={
       
        content:req.body.content,
        postId:parseInt(req.body.postId),
        userId:parseInt(req.user.userId),
       
    }
 
    const comment = await db.createComment(newComment);
    return res.status(201).json({
        message:"Comment created !",
        comment
        
    });
}

module.exports = {
    createComment
}