const{response} = require("express");
const Category = require("../models/category");

exports.createCategory = async (req, res) =>{
    try{
        const {name, description} = req.body;

        // validation
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // create entry in DB
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);
        
        // return response
        return res.status(200).json({
            success:true,
            message:"category created successfully",
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};


// Get all Category

exports.showAllcategories = async (req, res) =>{
    try{
        const allCategory = await Category.find({}, {name:true, description:true});
        res.status(200).json({
            success:true,
            message:"All category returned successfully",
            allCategory,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

// CategoryPageDetails

exports.categoryPageDetails = async (req, res) =>{
    try{
          //get category Id
          const {categoryId} = req.body;

          // get courses for specified category
          const selectedCategory = await Category.findById(categoryId)
                                         .populate("courses")
                                         .exec();
          //validation
          if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found",
            });
          }
          //get courses for different categories
            const differentCategories = await Category.find({
                                         _id: {$ne: categoryId},       
                                    })
                                    .populate("courses")
                                    .exec();
          //get top 10 selling courses

          //return response
          return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategories,
            },
            
          });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

// Delete Category (Admin only)

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Validation
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Delete category
        await Category.findByIdAndDelete(categoryId);

        // Return response
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
