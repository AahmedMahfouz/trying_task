const { User} = require('../../model/model_define'); 
const httpStatusText = require('../../helpers/httpstatustext');
const asyncWrapper = require('../../midelware/asyncWrapper');


const getAllUsers = asyncWrapper(async (req, res, next) => {
    const users = await User.findAll(); 
    res.json({ status: httpStatusText.success, data: { users } });
});

module.exports=getAllUsers