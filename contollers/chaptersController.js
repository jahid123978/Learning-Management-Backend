const Chapters = require("../model/chaptersModel");
const mongoose = require("mongoose");
const cloudinary = require("../helper/cloudinary");
const ObjectId = require('mongodb').ObjectId;
const stripe = require('stripe')('sk_test_51HUEyCDOfBXcEuEsTZCdBB0EyPYnqaNdEve90jIbZL5aMuJNfLFFHeMtqend6JfcCFOxKnRvfNh4b9y0EzZsnfNk00YehuaxbT')
// get all chapters
const getChapters = async (req, res) => {
  try {
    const user_id = req.user._id;
    const chapters = await Chapters.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(chapters);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

//get all chapters student
const getChapters_st = async (req, res) => {
  try {
    const chapters = await Chapters.find({});
    res.status(200).json(chapters);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

//get a single chapters
const getchapter = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such id" });
    }

    const chapters = await Chapters.findById(id);

    if (!chapters) {
      return res.status(404).json({ error: "no such workout" });
    }
    res.status(200).json(chapters);
  } catch (err) {
    res.status(400).json(err);
  }
};

//create new chapters
const createChapters = async (req, res) => {
  const {title, price, duration, description, teacher} = req.body;
  console.log("title: ", req.body)
  console.log(req.file);
  try {
    const user_id = req.user._id;
    if (req.file !== undefined) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${title}_Course`,
      });
      const img = result.url;
      const chapters_img = await Chapters.create({ title, price, duration, description, teacher, img, user_id });
      res.status(200).json(chapters_img);
    } else {
      const chapter = await Chapters.create({ title, price, duration, description, teacher, user_id });
      res.status(200).json(chapter);
    }
  } catch (err) {
    console.log("error: ", err);
  }
};

//update a  chapters

const updateChapter = async (req, res) => {
  const { id } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(404).json({ error: "no such id" });
  // }
  
  // console.log("req.body: ", req.body);
  try{
    const existingDocument = await Chapters.findOne({_id: new ObjectId(id) });
  console.log("existingDocument: ", existingDocument);
    if (existingDocument) {
      // Make sure existingDocument is an instance of YourModel
      if (existingDocument instanceof Chapters) {
        // Add the object to the array
        existingDocument.paymentCourse.push(req.body);

        // Save the updated document
        await existingDocument.save();

        return res.status(200).json(existingDocument);
      }

  }} catch(error){
    res.status(400).json(error);
  }
  
  // const chapters = await Chapters.findByIdAndUpdate(
  //   { _id: id },
  //   {
  //     ...req.body,
  //   }
  // );

  // if (!chapters) {
  //   return res.status(404).json({ error: "no such workout" });
  // }

  // res.status(200).json(chapters);


}

//delete a chapters

const deleteChapter = async (req, res) => {
  const { id } = req.params;

  try {
    const public_id = `${req.body.title}_Course`;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such id" });
    }
    const result = await cloudinary.uploader
      .destroy(public_id)
      .then((result) => console.log(result));
    const chapters = await Chapters.findByIdAndDelete({ _id: id });

    console.log(result);
    if (!chapters) {
      return res.status(404).json({ error: "no such workout" });
    }

    res.status(200).json(chapters);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getChapters,
  getChapters_st,
  getchapter,
  createChapters,
  deleteChapter,
  updateChapter
};
