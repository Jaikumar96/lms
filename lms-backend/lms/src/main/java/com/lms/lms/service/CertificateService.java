package com.lms.lms.service;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.PdfWriter;
import com.lms.lms.model.Course;
import com.lms.lms.model.User;
import org.springframework.stereotype.Service;


import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class CertificateService {

    public ByteArrayInputStream generateCertificate(User student, Course course) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 14);

            document.add(new Paragraph("Certificate of Completion", titleFont));
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("This certifies that", bodyFont));
            document.add(new Paragraph(student.getName(), titleFont));
            document.add(new Paragraph("has successfully completed the course", bodyFont));
            document.add(new Paragraph(course.getTitle(), titleFont));
            document.add(new Paragraph("\nCongratulations!", bodyFont));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
