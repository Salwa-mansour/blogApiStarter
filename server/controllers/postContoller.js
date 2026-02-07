const db = require("../data/accountData");

async function  getMyPosts(req,res){

    return res.status(200).json({
      message: "all your posts",
      
    });
}

async function createPost(req,res) {
    return res.status(201).json({
        message:"post created !"
    });
}
module.exports={
    getMyPosts,
    createPost
}