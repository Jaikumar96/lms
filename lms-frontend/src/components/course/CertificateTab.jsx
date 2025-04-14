import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CertificateTab = ({ courseId }) => {
  const [certificate, setCertificate] = useState(null);
  const [progress, setProgress] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/progress/student/1`, {
          headers: { Authorization: token },
        });
        const match = res.data.find((p) => p.course.id === parseInt(courseId));
        if (match) setProgress(match.percentage);
      } catch (err) {
        console.error("Failed to load progress", err);
      }
    };

    const fetchCertificate = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/courses/${courseId}/certificate`, {
          headers: { Authorization: token },
          responseType: "blob",
        });
        setCertificate(URL.createObjectURL(res.data));
      } catch (err) {
        console.error("Failed to fetch certificate", err);
      }
    };

    fetchProgress();
    if (progress === 100) fetchCertificate();
  }, [courseId, progress]);

  return (
    <div className="text-center mt-6">
      {progress < 100 ? (
        <div className="text-gray-500">
          <img
            src="/certificate-blur.png"
            alt="Blurred certificate"
            className="mx-auto opacity-40 blur-sm max-w-md"
          />
          <p className="mt-4">Complete the course to download your certificate!</p>
        </div>
      ) : (
        <div>
          <iframe
            src={certificate}
            className="w-full max-w-3xl h-96 border rounded-xl mx-auto mb-4"
            title="Certificate Preview"
          />
          <a
            href={certificate}
            download="certificate.pdf"
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            Download Certificate
          </a>
        </div>
      )}
    </div>
  );
};

export default CertificateTab;
