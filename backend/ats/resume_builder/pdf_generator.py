from io import BytesIO
import json
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib import colors

def add_heading(story, text, template_type, heading_style, doc_width):
    if template_type == "classic":
        t = Table([[Paragraph(text.upper(), heading_style)]], colWidths=[doc_width])
        t.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 1, colors.black),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t)
        story.append(Spacer(1, 8))
    elif template_type == "modern":
        t = Table([[Paragraph(text.upper(), heading_style)]], colWidths=[doc_width])
        t.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 2, colors.HexColor('#3498db')),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t)
        story.append(Spacer(1, 8))
    else: # Minimalist
        story.append(Paragraph(text.upper(), heading_style))
        story.append(Spacer(1, 4))

def generate_pdf(data: dict):
    buffer = BytesIO()
    template_type = data.get("template", "classic").lower()

    # Determine Margins
    left_m = 40
    right_m = 40
    top_m = 40
    bottom_m = 40

    if template_type == "minimalist":
        left_m = 50
        right_m = 50
        top_m = 50

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=right_m,
        leftMargin=left_m,
        topMargin=top_m,
        bottomMargin=bottom_m,
    )
    doc_width = doc.width

    styles = getSampleStyleSheet()

    # Styles Definitions
    if template_type == "modern":
        name_style = ParagraphStyle('ModName', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=28, textColor=colors.HexColor('#2c3e50'), spaceAfter=4)
        contact_style = ParagraphStyle('ModContact', parent=styles['Normal'], fontName='Helvetica', fontSize=10, textColor=colors.HexColor('#7f8c8d'), spaceAfter=20)
        heading_style = ParagraphStyle('ModHeading', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, textColor=colors.HexColor('#2980b9'), spaceAfter=0)
        body_style = ParagraphStyle('ModBody', parent=styles['Normal'], fontName='Helvetica', fontSize=10.5, leading=15, textColor=colors.HexColor('#34495e'))
        bullet_style = ParagraphStyle('ModBullet', parent=body_style, leftIndent=12, firstLineIndent=-12)
    elif template_type == "minimalist":
        name_style = ParagraphStyle('MinName', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=24, alignment=TA_CENTER, spaceAfter=8)
        contact_style = ParagraphStyle('MinContact', parent=styles['Normal'], fontName='Helvetica', fontSize=9, textColor=colors.HexColor('#555555'), alignment=TA_CENTER, spaceAfter=24)
        heading_style = ParagraphStyle('MinHeading', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, textColor=colors.HexColor('#999999'), spaceAfter=0)
        body_style = ParagraphStyle('MinBody', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=16, textColor=colors.HexColor('#333333'))
        bullet_style = ParagraphStyle('MinBullet', parent=body_style, leftIndent=15, firstLineIndent=-10)
    else: # Classic Default
        name_style = ParagraphStyle('ClassicName', parent=styles['Normal'], fontName='Times-Bold', fontSize=26, alignment=TA_CENTER, spaceAfter=8)
        contact_style = ParagraphStyle('ClassicContact', parent=styles['Normal'], fontName='Times-Roman', fontSize=11, alignment=TA_CENTER, spaceAfter=20)
        heading_style = ParagraphStyle('ClassicHeading', parent=styles['Normal'], fontName='Times-Bold', fontSize=13, spaceAfter=0)
        body_style = ParagraphStyle('ClassicBody', parent=styles['Normal'], fontName='Times-Roman', fontSize=11, leading=16)
        bullet_style = ParagraphStyle('ClassicBullet', parent=body_style, leftIndent=15, firstLineIndent=-12)

    story = []

    # 1. Header (Name and Contact)
    raw_name = data.get("name", "Name Not Provided")
    name_text = raw_name.upper() if template_type in ["classic", "minimalist"] else raw_name.title()
    story.append(Paragraph(name_text, name_style))

    email = data.get("email", "")
    phone = data.get("phone", "")
    contact_parts = []
    if email: contact_parts.append(email)
    if phone: contact_parts.append(phone)
    
    if contact_parts:
        sep = " | " if template_type in ["classic", "minimalist"] else "  •  "
        contact_text = sep.join(contact_parts)
        story.append(Paragraph(contact_text, contact_style))

    # 2. Skills
    skills = data.get("skills", "")
    if skills:
        add_heading(story, "Skills", template_type, heading_style, doc_width)
        story.append(Paragraph(skills.replace('\n', '<br/>'), body_style))
        story.append(Spacer(1, 16))

    # 3. Experience
    experience_list = data.get("experience", [])
    if isinstance(experience_list, str):
        try:
            experience_list = json.loads(experience_list)
        except:
            experience_list = []

    if experience_list:
        add_heading(story, "Experience", template_type, heading_style, doc_width)
        for exp in experience_list:
            role = exp.get("role", "")
            company = exp.get("company", "")
            start = exp.get("startDate", "")
            end = exp.get("endDate", "")
            desc = exp.get("description", "")

            # Formulate Title vs Company
            if template_type == "classic":
                 role_company = f"<b>{role}</b>" if role else ""
                 if role and company: role_company += f", <i>{company}</i>"
                 elif company: role_company += f"<i>{company}</i>"
            elif template_type == "modern":
                 role_company = f"<b>{role}</b>" if role else ""
                 if role and company: role_company += f" | {company}"
                 elif company: role_company += f"<b>{company}</b>"
            else: # minimalist
                 role_company = f"<b>{role}</b>" if role else ""
                 if role and company: role_company += f"<br/>{company}"
                 elif company: role_company = f"{company}"

            # Dates
            date_text = f"{start} - {end}" if (start and end) else (start or end)

            # Table for laying out Title (Left) and Date (Right)
            if role_company or date_text:
                if date_text:
                    row_data = [[Paragraph(role_company, body_style), Paragraph(f"<para align=right>{date_text}</para>", body_style)]]
                    t = Table(row_data, colWidths=[doc_width * 0.7, doc_width * 0.3])
                    t.setStyle(TableStyle([
                        ('LEFTPADDING', (0,0), (-1,-1), 0),
                        ('RIGHTPADDING', (0,0), (-1,-1), 0),
                        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                        ('TOPPADDING', (0,0), (-1,-1), 0),
                        ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ]))
                    story.append(t)
                else:
                    story.append(Paragraph(role_company, body_style))
                    story.append(Spacer(1, 2))

            if desc:
                for line in desc.split("\n"):
                    if line.strip():
                        story.append(Paragraph(f"&bull; {line.strip()}", bullet_style))
            story.append(Spacer(1, 10))

    # 4. Education
    education_list = data.get("education", [])
    if isinstance(education_list, str):
         try:
             education_list = json.loads(education_list)
         except:
             education_list = []

    if education_list:
        add_heading(story, "Education", template_type, heading_style, doc_width)
        for edu in education_list:
            degree = edu.get("degree", "")
            inst = edu.get("institution", "")
            start = edu.get("startDate", "")
            end = edu.get("endDate", "")

            if template_type == "classic":
                 role_company = f"<b>{degree}</b>" if degree else ""
                 if degree and inst: role_company += f", <i>{inst}</i>"
                 elif inst: role_company += f"<i>{inst}</i>"
            elif template_type == "modern":
                 role_company = f"<b>{degree}</b>" if degree else ""
                 if degree and inst: role_company += f" | {inst}"
                 elif inst: role_company += f"<b>{inst}</b>"
            else: # minimalist
                 role_company = f"<b>{degree}</b>" if degree else ""
                 if degree and inst: role_company += f"<br/>{inst}"
                 elif inst: role_company = f"{inst}"

            date_text = f"{start} - {end}" if (start and end) else (start or end)

            if role_company or date_text:
                if date_text:
                    row_data = [[Paragraph(role_company, body_style), Paragraph(f"<para align=right>{date_text}</para>", body_style)]]
                    t = Table(row_data, colWidths=[doc_width * 0.7, doc_width * 0.3])
                    t.setStyle(TableStyle([
                        ('LEFTPADDING', (0,0), (-1,-1), 0),
                        ('RIGHTPADDING', (0,0), (-1,-1), 0),
                        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
                        ('TOPPADDING', (0,0), (-1,-1), 0),
                        ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ]))
                    story.append(t)
                else:
                    story.append(Paragraph(role_company, body_style))
            story.append(Spacer(1, 8))

    doc.build(story)
    buffer.seek(0)
    return buffer
