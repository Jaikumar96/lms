// src/components/instructor/QuizzesTab.jsx
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
    setQuestions([...questions, {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: ""
    }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleCreateQuiz = async () => {
    if (!courseId || !title || questions.length === 0) return alert("Fill all quiz fields");
    try {
      await axios.post(
        `http://localhost:8080/api/quizzes?courseId=${courseId}`,
        { title, questions },
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
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Quizzes</h2>

      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button onClick={fetchQuizzes} className="bg-purple-600 text-white px-4 py-2 rounded mb-4">Fetch Quizzes</button>

      {quizzes.length > 0 && (
        <ul className="mb-6">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="p-2 border rounded bg-white mb-2">
              {quiz.title}
            </li>
          ))}
        </ul>
      )}

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Create New Quiz</h3>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        {questions.map((q, idx) => (
          <div key={idx} className="bg-white p-3 rounded shadow mb-3">
            <input
              type="text"
              placeholder="Question"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
              className="border p-2 w-full mb-2"
            />
            {["A", "B", "C", "D"].map((opt) => (
              <input
                key={opt}
                type="text"
                placeholder={`Option ${opt}`}
                value={q[`option${opt}`]}
                onChange={(e) => handleQuestionChange(idx, `option${opt}`, e.target.value)}
                className="border p-2 w-full mb-1"
              />
            ))}
            <input
              type="text"
              placeholder="Correct Answer (A/B/C/D)"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        ))}

        <div className="flex gap-3">
          <button onClick={handleAddQuestion} className="bg-gray-700 text-white px-4 py-2 rounded">
            Add Question
          </button>
          <button onClick={handleCreateQuiz} className="bg-purple-600 text-white px-4 py-2 rounded">
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizzesTab;
