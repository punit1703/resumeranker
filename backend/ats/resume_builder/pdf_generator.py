from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO

def generate_pdf(resume_text: str):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    text = p.beginText(40, 800)
    for line in resume_text.split("\n"):
        text.textLine(line)

    p.drawText(text)
    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer
