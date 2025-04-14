import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizzesTab = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/quizzes/course/${courseId}`, {
          headers: { Authorization: token },
        });
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  const loadFullQuiz = async (quizId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/quizzes/${quizId}`, {
        headers: { Authorization: token },
      });
      setSelectedQuiz(res.data);
      setShowModal(true);
    } catch (err) {
      alert("Could not load quiz. Please try again.");
      console.error("Failed to load full quiz data", err);
    }
  };

  const handleChangeAnswer = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/quizzes/submit`,
        {
          quizId: selectedQuiz.id,
          answers,
        },
        { headers: { Authorization: token } }
      );
      alert(`Quiz submitted! Score: ${res.data}`);
      setScore(res.data);
      setShowModal(false);
    } catch (err) {
      alert("Failed to submit quiz.");
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Quizzes</h3>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes available.</p>
      ) : (
        <ul className="space-y-3">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
              <span>{quiz.title}</span>
              <button
                onClick={() => loadFullQuiz(quiz.id)}
                className="bg-purple-600 text-white px-4 py-1 rounded"
              >
                Take Quiz
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Quiz Modal */}
      {showModal && selectedQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">{selectedQuiz.title}</h3>
            {selectedQuiz.questions.map((q) => (
              <div key={q.id} className="mb-4">
                <p className="font-medium">{q.questionText}</p>
                <div className="mt-2 space-y-1">
                  {["A", "B", "C", "D"].map((opt) => (
                    <label key={opt} className="block">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChangeAnswer(q.id, opt)}
                      />{" "}
                      {q[`option${opt}`]}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-2 bg-purple-700 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {score !== null && (
        <p className="mt-4 text-green-600 font-semibold">Your last score: {score}</p>
      )}
    </div>
  );
};

export default QuizzesTab;
