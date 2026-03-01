import Course from "../models/courses.model.js";
import { GoogleGenAI } from "@google/genai";

export const SearchwithAi = async (req, resp) => {
  try {
    const searchQuery = req.query.q || req.body.query;
    console.log("User search query:", searchQuery);

    let courses = [];

    // Helper to search MongoDB
    const findCourses = async (text) => {
      return await Course.find({
        $or: [
          { title: { $regex: text, $options: "i" } },
          { subtitle: { $regex: text, $options: "i" } },
          { description: { $regex: text, $options: "i" } },
          { category: { $regex: text, $options: "i" } },
          { level: { $regex: text, $options: "i" } },
        ],
      });
    };

    // First attempt: direct user query
    if (searchQuery && searchQuery.trim() !== "") {
      courses = await findCourses(searchQuery.trim());
    }

    // If no courses found, fallback to AI-generated keyword
    if (!courses.length) {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      const prompt = `
You are an assistant that helps search for online courses.

Step 1: Try to extract **exactly one keyword** that matches **one of these course categories** exactly (case-insensitive):
- Web Dev
- AI & ML
- DSA
- App Dev
- Database
- Cloud
- Cyber Security
- Blockchain

Step 2: If the user's query does not clearly match any category, then instead provide **the single most relevant keyword** from the query itself, which could help in searching course titles, subtitles, or descriptions.

Rules:
1. Respond with **only one word or phrase** — either a category from the list, or the most relevant keyword.
2. Do not include synonyms, explanations, or extra text.
3. Do not use punctuation or quotes — just the keyword.

User query: "${searchQuery}"
`;

      const aiResponse = await ai.models.generateContent({
        model: "models/gemini-2.5-flash",
        contents: prompt,
      });

      // Extract AI keyword from response
      const keyword = aiResponse?.text
      console.log("AI keyword fallback:", keyword);

      if (keyword) {
        courses = await findCourses(keyword);
      }
    }

    if (!courses.length) {
      return resp
        .status(404)
        .json({ message: "No courses found for your query" });
    }

    resp.status(200).json(courses);
  } catch (error) {
    console.error("Search error:", error);
    resp
      .status(500)
      .json({ message: "Something went wrong while searching courses", error });
  }
};