import React, { useEffect, useState } from "react";
import axios from "axios";

const MaterialsTab = ({ courseId }) => {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/materials/${courseId}`, {
          headers: { Authorization: token },
        });
        setMaterials(res.data);
      } catch (err) {
        setError("Failed to fetch materials.");
        console.error(err);
      }
    };

    fetchMaterials();
  }, [courseId]);

  const handleDownload = async (materialId, fileName) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/materials/download/${materialId}`, {
        headers: { Authorization: token },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download material.");
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Course Materials</h3>
      {error && <p className="text-red-500">{error}</p>}
      {materials.length === 0 ? (
        <p className="text-gray-500">No materials uploaded.</p>
      ) : (
        <ul className="space-y-3">
          {materials.map((mat) => (
            <li
              key={mat.id}
              className="flex justify-between items-center p-3 bg-white shadow rounded"
            >
              <span>{mat.fileName}</span>
              <button
                className="bg-purple-600 text-white px-4 py-1 rounded"
                onClick={() => handleDownload(mat.id, mat.fileName)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaterialsTab;
