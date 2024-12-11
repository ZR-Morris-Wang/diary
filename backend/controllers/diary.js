import DiaryModel from "../models/diaryModel.js";

// Get all diaries
export const getDiaries = async (req, res) => {
  console.log(req.query.req);
  try {
    // Find all diaries
    const diaries = await DiaryModel.find(
      req.query.req,
    ); /* The last step is to make sure req is a object with current key value pair */
    // Return diaries
    return res.status(200).json(diaries);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};
// Create a diary
export const createDiary = async (req, res) => {
  console.log(req.body);
  const { date, content, tag, mood } = req.body;

  // Check content and tag
  if (!content || !tag || !mood) {
    return res
      .status(400)
      .json({ message: "Content, tag, and mood are required!" });
  }

  // Create a new diary
  try {
    const newDiary = await DiaryModel.create({
      date: date,
      content: content,
      tag: tag,
      mood: mood,
    });
    return res.status(201).json(newDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a diary
export const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { content, tag, mood } = req.body;

  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }

    // Update the diary
    if (content !== undefined) existedDiary.content = content;
    if (tag !== undefined) existedDiary.tag = tag;
    if (mood !== undefined) existedDiary.mood = mood;

    // Save the updated diary
    await existedDiary.save();

    // Rename _id to id
    existedDiary.id = existedDiary._id;
    delete existedDiary._id;

    return res.status(200).json(existedDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a diary
export const deleteDiary = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }
    // Delete the diary
    await DiaryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Diary deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
