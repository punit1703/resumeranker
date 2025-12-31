from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os
import uuid

def generate_pdf(resume_text):
    file_name = f"resume_{uuid.uuid4().hex}.pdf"
    file_path = os.path.join("media", file_name)

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    x = 50
    y = height - 50

    c.setFont("Helvetica", 11)

    for line in resume_text.split("\n"):
        if y < 50:  # page overflow
            c.showPage()
            c.setFont("Helvetica", 11)
            y = height - 50

        c.drawString(x, y, line)
        y -= 14  # line spacing

    c.save()
    return file_path
