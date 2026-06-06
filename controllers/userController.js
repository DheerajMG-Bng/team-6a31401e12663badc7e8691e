const User = require('../models/userModel');
const Question = require('../models/questionModel');
const Answer = require('../models/answerModel');

// GET ALL USERS FUNCTION - ONLY FOR ADMIN
const getAllUsers = async (req, res) => {
    try{
        const users = await User.find()
            .select('-password')
            .sort({ created_at : -1 });

        res.status(200).json({
            success : true,
            count : users.length,
            data : users
        });
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        });
    }
};

// GET USER BY ID 
const getUserById = async (req, res) => {
    try {
        // SEARCH THE USER BY ID - EXCLUDE PASSWORD 
        const user = await User.findById(req.params.id)
            .select('-password');

        // VALIDATE USER EXISITS OR NOT
        if(!user) {
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        res.status(200).json({
            success : true,
            data : user
        });
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        });
    }
};

// GET USER STATS FUNCTION 
const getUserStats = async (req, res) => {
    try {
        const userId = req.params.id;

        // CHECK WHETHER USER EXISTS OR NOT
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        // GET QUESTION AND ANSWER COUNT
        const questionCount = await Question.countDocuments({ user_id : userId });
        const answerCount = await Answer.countDocuments({ user_id : userId });
        
        // COUNT TOTAL VOTES BY USER
        const answerStats = await Answer.aggregate([
            { $match : { user_id : userId } },
            { $group : {
                _id : null,
                totalUpvotes : { $sum : '$up_votes' },
                totalDownvotes : { $sum : '$down_votes' }
            }}
        ]);

        const totalUpvotesReceived = answerStats[0]?.totalUpvotes || 0;
        const totalDownvotesReceived = answerStats[0]?.totalDownvotes || 0;
        
        res.status(200).json({
            success : true,
            data : {
                user_id : userId,
                name : user.name,
                email : user.email,
                role : user.role,
                joined_date : user.created_at,
                stats : {
                    questions_asked : questionCount,
                    answers_given : answerCount,
                    upvotes_received : totalUpvotesReceived,
                    downvotes_received : totalDownvotesReceived
                } 
            }
        });
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
};

// UPDATE USER - ONLY USER OR ADMIN 
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        // FIRST FIND USER BY ID 
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }
 
        // CHECK AUTHORIZATION - OWN PROFILE OR ADMIN
        const isOwnProfile = user._id.toString() === req.user_id;
        const isAdmin = req.user_role === 'admin';

        if(!isOwnProfile && !isAdmin) {
            return res.status(403).json({
                success : false,
                message : 'User not authorized to update profile'
            });
        }

        // CHECK NAME IF PROVIDED
        if(name && name.trim()) {
            user.name = name.trim();
        }

        // UPDATE EMAIL - CHECK FOR DUPLICATES
        if(email && email.trim()) {
            const existingUser = await User.findOne({
                email : email.trim().toLowerCase(),
                _id : { $ne : id }
            });

            if(existingUser) {
                return res.status(400).json({
                    success : false,
                    message : 'Email already registered'
                });
            } 
            user.email = email.trim().toLowerCase();
        }

        user.updated_at = Date.now();
        await user.save();

        // RETURN USER WITHOUT PASSWORD
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success : true,
            message : 'User updated successfully',
            data : userResponse
        });
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        });
    }
};

// UPDATE USER ROLE - FOR ADMIN ONLY
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // VALIDATE ROLE 
        const validRoles = ['user', 'admin'];
        if(!role || !validRoles.includes(role)) {
            return res.status(400).json({
                success : false,
                message : `Invalid role. Must be either user or admin`
            });
        }

        // FIND USER BY ID
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        // PREVENT USER TO CHANGE OWN ROLE
        if(user._id.toString() === req.user_id) {
            return res.status(400).json({
                success : false,
                message : 'You cannot change your role'
            });
        }

        // UPDATE ROLE AND SAVE IN DATABASE
        user.role = role;
        user.updated_at = Date.now();
        await user.save();

        res.status(200).json({
            success : true,
            message : `User role updated to ${role}`,
            data : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        });
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        });
    }
};

// DELETE USER FUNCTION
const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;

        // FIRST FIND THE USER BY ID
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({
                success : false,
                message : 'User not found'
            });
        }

        // PREVENT ADMIN FROM DELETING THEMSELVES
        if(user._id.toString() === req.user_id) {
            return res.status(400).json({
                success : false,
                message : 'You cannot delete own your account'
            });
        }

        // DELETE USER 
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success : true,
            message : 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserStats,
    updateUser,
    updateUserRole,
    deleteUser
};