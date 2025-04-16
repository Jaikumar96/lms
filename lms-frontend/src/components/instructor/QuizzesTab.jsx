import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizzesTab = () => {
  const [courseId, setCourseId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const token = localStorage.getItem("token");

  const fetchQuizzes = async () => {
    if (!courseId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/quizzes/course/${courseId}`, {
        headers: { Authorization: token },
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", ""],
        correctAnswer: ""
      }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updated = [...questions];
    updated[index].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleAddOption = (index) => {
    const updated = [...questions];
    updated[index].options.push("");
    setQuestions(updated);
  };

  const handleCreateQuiz = async () => {
    if (!courseId || !title || questions.length === 0) return alert("Fill all quiz fields");

    try {
      await axios.post(
        `http://localhost:8080/api/instructor/quizzes?courseId=${courseId}`,
        {
          title,
          questions
        },
        { headers: { Authorization: token } }
      );
      alert("Quiz created successfully!");
      setTitle("");
      setQuestions([]);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold text-purple-700">Instructor Quizzes</h2>

      {/* Input Course ID and Fetch */}
      <div>
        <input
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <button
          onClick={fetchQuizzes}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Fetch Quizzes
        </button>
      </div>

      {/* Quiz List */}
      {quizzes.length > 0 && (
        <ul className="bg-white rounded shadow p-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="border-b py-2">{quiz.title}</li>
          ))}
        </ul>
      )}

      {/* Create Quiz */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Create New Quiz</h3>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-3 rounded shadow mb-4">
            <input
              type="text"
              placeholder="Question Text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
              className="w-full border p-2 mb-2"
            />

            {q.options.map((opt, optIdx) => (
              <input
                key={optIdx}
                type="text"
                placeholder={`Option ${optIdx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                className="w-full border p-2 mb-1"
              />
            ))}

            <button
              onClick={() => handleAddOption(idx)}
              className="text-sm text-blue-500 mb-2"
            >
              + Add Option
            </button>

            <input
              type="text"
              placeholder="Correct Answer (Exact Text)"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
              className="w-full border p-2 mt-2"
            />
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={handleAddQuestion}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Add Question
          </button>
          <button
            onClick={handleCreateQuiz}
            className="bg-purple-700 text-white px-4 py-2 rounded"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizzesTab;
