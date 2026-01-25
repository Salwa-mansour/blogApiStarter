const db = require("../data/accountData");

async function  getMyPosts(req,res){

    return res.status(200).json({
      message: "all your posts",
      
    });
}

module.exports={
    getMyPosts
}