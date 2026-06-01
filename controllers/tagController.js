//CREATE CURD APIS 

const Tag = require("../models/tagModel");

// CREATE TAG
const createTag = async (req, res) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ALL TAGS
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET TAG BY ID
const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        res.json(tag);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE TAG
const deleteTag = async (req, res) => {
    try {
        await Tag.findByIdAndDelete(req.params.id);
        res.json({ message: "Tag deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    deleteTag
};