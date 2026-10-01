#!/usr/bin/env python3
"""
Alpha Investment Management - Comprehensive Build-Time PDF Generator
Produces authentic, publication-quality A4 vector PDF documents with:
- Embedded TrueType Unicode fonts (DejaVuSans / DejaVuSerif) with native Indian Rupee symbol (₹ U+20B9)
- 20mm margins, running headers with firm name and SEBI RIA INA000017348
- Running footers with dynamic "Page X of N" pagination via NumberedCanvas
- Repeated table headers on page breaks
- Fillable form fields and document checklists
- Complete compliance disclosures and vector QR code
- Built-in validation checking %PDF- header, file size (>5KB), page counts, and pdftotext
- Generates src/data/downloadsManifest.json
"""

import os
import sys
import json
import re
import subprocess
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import StyleSheet1, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing

# Ensure paths
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONFIG_DIR = os.path.join(REPO_ROOT, "src", "data", "downloads")
OUTPUT_DIR = os.path.join(REPO_ROOT, "public", "downloads")
MANIFEST_PATH = os.path.join(REPO_ROOT, "src", "data", "downloadsManifest.json")
RISK_CONFIG_PATH = os.path.join(REPO_ROOT, "src", "constants", "riskProfileConfig.ts")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Register Fonts
DEJAVU_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DEJAVU_SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
DEJAVU_SANS_OBLIQUE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf"
DEJAVU_SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
DEJAVU_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"

for f_path in [DEJAVU_SANS, DEJAVU_SANS_BOLD, DEJAVU_SERIF_BOLD, DEJAVU_SERIF]:
    if not os.path.exists(f_path):
        print(f"FATAL: Required TrueType font not found at {f_path}", file=sys.stderr)
        sys.exit(1)

pdfmetrics.registerFont(TTFont("AIM-Sans", DEJAVU_SANS))
pdfmetrics.registerFont(TTFont("AIM-Sans-Bold", DEJAVU_SANS_BOLD))
if os.path.exists(DEJAVU_SANS_OBLIQUE):
    pdfmetrics.registerFont(TTFont("AIM-Sans-Oblique", DEJAVU_SANS_OBLIQUE))
pdfmetrics.registerFont(TTFont("AIM-Serif-Bold", DEJAVU_SERIF_BOLD))
pdfmetrics.registerFont(TTFont("AIM-Serif", DEJAVU_SERIF))

# Load Firm Configuration
FIRM_CONFIG_PATH = os.path.join(CONFIG_DIR, "firmConfig.json")
if not os.path.exists(FIRM_CONFIG_PATH):
    print("FATAL: firmConfig.json not found in " + CONFIG_DIR, file=sys.stderr)
    sys.exit(1)

with open(FIRM_CONFIG_PATH, "r", encoding="utf-8") as f:
    FIRM = json.load(f)

# Validate mandatory firm fields
MANDATORY_FIRM_FIELDS = [
    "firmName", "sebiRiaNumber", "baslMembershipNumber", "principalOfficer",
    "grievanceOfficer", "registeredOffice", "contactEmail", "contactPhone",
    "grievanceEmail", "feeSchedule", "complaintsHistory", "standardStatutoryDisclosure"
]
for field in MANDATORY_FIRM_FIELDS:
    if field not in FIRM or not FIRM[field]:
        print(f"FATAL: Missing mandatory firm configuration field: '{field}' in firmConfig.json", file=sys.stderr)
        sys.exit(1)

# Palette
C_NAVY = colors.HexColor("#0B1220")
C_GOLD = colors.HexColor("#8A6E3D")
C_GOLD_LIGHT = colors.HexColor("#C9A96E")
C_BG_CREAM = colors.HexColor("#F9F7F3")
C_BORDER = colors.HexColor("#D1D5DB")
C_BORDER_DARK = colors.HexColor("#9CA3AF")
C_MUTED = colors.HexColor("#4B5563")
C_TEXT = colors.HexColor("#111827")
C_WHITE = colors.white

# Numbered Canvas for Two-Pass Running Headers and Footers
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []
        self.doc_title = ""
        self.doc_version = ""
        self.doc_date = ""

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, total_pages):
        page_w, page_h = A4
        m_left = 56.7 # 20mm
        m_right = page_w - 56.7
        usable_w = m_right - m_left

        # Top Running Header (Pages >= 1)
        self.saveState()
        self.setFont("AIM-Sans-Bold", 7.5)
        self.setFillColor(C_NAVY)
        self.drawString(m_left, page_h - 32, "ALPHA INVESTMENT MANAGEMENT · SEBI RIA INA000017348")
        
        self.setFont("AIM-Sans", 7.0)
        self.setFillColor(C_MUTED)
        right_header = f"{self.doc_version} · {self.doc_date}"
        self.drawRightString(m_right, page_h - 32, right_header)

        # Hairline under header
        self.setStrokeColor(C_BORDER)
        self.setLineWidth(0.6)
        self.line(m_left, page_h - 38, m_right, page_h - 38)
        self.restoreState()

        # Bottom Running Footer
        self.saveState()
        self.setStrokeColor(C_BORDER)
        self.setLineWidth(0.6)
        self.line(m_left, 42, m_right, 42)

        self.setFont("AIM-Sans", 7.0)
        self.setFillColor(C_MUTED)
        self.drawString(m_left, 30, "Draft - pending legal and compliance approval · Strict Fiduciary Mandate")

        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(m_right, 30, page_str)
        self.restoreState()


def make_styles():
    styles = StyleSheet1()
    styles.add(ParagraphStyle(
        "DocTitle",
        fontName="AIM-Serif-Bold",
        fontSize=18,
        leading=22,
        textColor=C_NAVY,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        "DocSubtitle",
        fontName="AIM-Sans",
        fontSize=9.5,
        leading=13,
        textColor=C_MUTED,
        spaceAfter=12,
    ))
    styles.add(ParagraphStyle(
        "MetaBanner",
        fontName="AIM-Sans-Bold",
        fontSize=7.5,
        leading=10,
        textColor=C_NAVY,
    ))
    styles.add(ParagraphStyle(
        "Heading1",
        fontName="AIM-Serif-Bold",
        fontSize=12.5,
        leading=16,
        textColor=C_NAVY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    ))
    styles.add(ParagraphStyle(
        "Heading2",
        fontName="AIM-Sans-Bold",
        fontSize=9.5,
        leading=13,
        textColor=C_NAVY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    ))
    styles.add(ParagraphStyle(
        "Body",
        fontName="AIM-Sans",
        fontSize=8.5,
        leading=12,
        textColor=C_TEXT,
        spaceAfter=6,
        alignment=TA_LEFT,
    ))
    styles.add(ParagraphStyle(
        "BodyJustify",
        fontName="AIM-Sans",
        fontSize=8.5,
        leading=12.5,
        textColor=C_TEXT,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
    ))
    styles.add(ParagraphStyle(
        "BulletItem",
        fontName="AIM-Sans",
        fontSize=8.5,
        leading=12,
        textColor=C_TEXT,
        spaceAfter=3,
        leftIndent=14,
    ))
    styles.add(ParagraphStyle(
        "TableCell",
        fontName="AIM-Sans",
        fontSize=8.0,
        leading=10.5,
        textColor=C_TEXT,
    ))
    styles.add(ParagraphStyle(
        "TableCellBold",
        fontName="AIM-Sans-Bold",
        fontSize=8.0,
        leading=10.5,
        textColor=C_NAVY,
    ))
    styles.add(ParagraphStyle(
        "TableHeader",
        fontName="AIM-Sans-Bold",
        fontSize=8.0,
        leading=10.5,
        textColor=C_NAVY,
        alignment=TA_LEFT,
    ))
    styles.add(ParagraphStyle(
        "StatutoryBox",
        fontName="AIM-Sans",
        fontSize=7.2,
        leading=10.0,
        textColor=C_MUTED,
        alignment=TA_JUSTIFY,
    ))
    return styles

STYLES = make_styles()

def get_qr_flowable(url: str, size: float = 48) -> Drawing:
    qr_widget = qr.QrCodeWidget(url)
    b = qr_widget.getBounds()
    w = b[2] - b[0]
    h = b[3] - b[1]
    d = Drawing(size, size, transform=[size / w, 0, 0, size / h, 0, 0])
    d.add(qr_widget)
    return d

def make_closing_block():
    """Generates the universal mandatory closing disclosure and consultation block"""
    elements = []
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=0.8, color=C_GOLD, spaceBefore=4, spaceAfter=8))
    
    # 1. Standard Statutory Disclosure
    p_disc = Paragraph(
        f"<b>STATUTORY REGULATORY DISCLOSURE:</b> {FIRM['standardStatutoryDisclosure']}",
        STYLES["StatutoryBox"]
    )
    elements.append(p_disc)
    elements.append(Spacer(1, 6))

    # 2. Firm Contact & QR Consultation Block
    qr_draw = get_qr_flowable(FIRM["consultationUrl"], size=50)
    
    contact_p = Paragraph(
        f"<b>ALPHA INVESTMENT MANAGEMENT</b> (SEBI RIA Reg: {FIRM['sebiRiaNumber']} · {FIRM['baslMembershipNumber']})<br/>"
        f"<b>Registered Advisory Office:</b> {FIRM['registeredOffice']}<br/>"
        f"<b>Advisory Desk:</b> {FIRM['contactEmail']} · {FIRM['contactPhone']} | <b>Grievance Officer:</b> {FIRM['grievanceOfficer']} ({FIRM['grievanceEmail']})<br/>"
        f"<b>Schedule Fiduciary Consultation:</b> Scan the QR code or visit <font color='#8A6E3D'><u>{FIRM['consultationUrl']}</u></font>",
        STYLES["StatutoryBox"]
    )

    t = Table(
        [[contact_p, qr_draw]],
        colWidths=[415, 65]
    )
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ('BACKGROUND', (0,0), (-1,-1), C_BG_CREAM),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t)
    return elements

def build_pdf_document(output_filename: str, title: str, subtitle: str, version: str, effective_date: str, flowables: list):
    pdf_path = os.path.join(OUTPUT_DIR, output_filename)
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=56.7, # 20mm
        rightMargin=56.7,
        topMargin=56.7,
        bottomMargin=56.7,
    )

    # Document Header Title Block
    header_block = [
        Paragraph(title, STYLES["DocTitle"]),
        Paragraph(subtitle, STYLES["DocSubtitle"]),
        Table(
            [[
                Paragraph(f"<b>Document ID:</b> {output_filename}", STYLES["MetaBanner"]),
                Paragraph(f"<b>Version:</b> {version}", STYLES["MetaBanner"]),
                Paragraph(f"<b>Effective Date:</b> {effective_date}", STYLES["MetaBanner"]),
                Paragraph("<b>Status:</b> Draft - Pending Legal Approval", STYLES["MetaBanner"]),
            ]],
            colWidths=[130, 80, 110, 160]
        ),
        Spacer(1, 8),
        HRFlowable(width="100%", thickness=1.0, color=C_NAVY, spaceBefore=2, spaceAfter=10),
    ]

    story = header_block + flowables

    def canvas_factory(*args, **kwargs):
        c = NumberedCanvas(*args, **kwargs)
        c.doc_title = title
        c.doc_version = version
        c.doc_date = effective_date
        return c

    doc.build(story, canvasmaker=canvas_factory)
    return pdf_path

# ==============================================================================
# DOCUMENT 1: Client KYC & Fiduciary Mandate Registration Form
# ==============================================================================
def generate_kyc_document():
    cfg_path = os.path.join(CONFIG_DIR, "kyc-onboarding.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    story = []
    
    story.append(Paragraph("<b>1. CLIENT IDENTIFICATION & DEMOGRAPHIC PARTICULARS</b>", STYLES["Heading1"]))
    story.append(Paragraph("In accordance with SEBI KYC Master Circular and PML Rules, please fill in all particulars in BLOCK LETTERS.", STYLES["Body"]))
    
    fields_1 = [
        [Paragraph("<b>Full Legal Name:</b>", STYLES["TableCellBold"]), Paragraph("____________________________________________________________", STYLES["TableCell"])],
        [Paragraph("<b>Father's / Spouse's Name:</b>", STYLES["TableCellBold"]), Paragraph("____________________________________________________________", STYLES["TableCell"])],
        [Paragraph("<b>Permanent Account Number (PAN):</b>", STYLES["TableCellBold"]), Paragraph("[___] [___] [___] [___] [___] [___] [___] [___] [___] [___]  (10 Digits)", STYLES["TableCell"])],
        [Paragraph("<b>Central KYC (CKYC) Number:</b>", STYLES["TableCellBold"]), Paragraph("[___][___][___][___][___][___][___][___][___][___][___][___][___][___]  (14 Digits)", STYLES["TableCell"])],
        [Paragraph("<b>Date of Birth (DD/MM/YYYY):</b>", STYLES["TableCellBold"]), Paragraph("[___] / [___] / [______]      <b>Gender:</b>  [  ] Male   [  ] Female   [  ] Other", STYLES["TableCell"])],
        [Paragraph("<b>Occupation / Profession:</b>", STYLES["TableCellBold"]), Paragraph("[  ] Salaried   [  ] Business / Promoter   [  ] Professional   [  ] Retired   [  ] Other", STYLES["TableCell"])],
        [Paragraph("<b>Gross Annual Income Bracket:</b>", STYLES["TableCellBold"]), Paragraph("[  ] Below ₹25 Lakhs   [  ] ₹25L–₹1 Cr   [  ] ₹1 Cr–₹5 Cr   [  ] ₹5 Cr+", STYLES["TableCell"])],
        [Paragraph("<b>Politically Exposed Person (PEP):</b>", STYLES["TableCellBold"]), Paragraph("[  ] Yes, PEP   [  ] Related to PEP   [  ] Neither PEP nor related", STYLES["TableCell"])],
    ]
    t1 = Table(fields_1, colWidths=[170, 310])
    t1.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (0,-1), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>2. RESIDENTIAL ADDRESS & COMMUNICATION DETAILS</b>", STYLES["Heading1"]))
    fields_2 = [
        [Paragraph("<b>Permanent Address:</b>", STYLES["TableCellBold"]), Paragraph("____________________________________________________________<br/>City: ____________________  State: ________________  PIN: [______]", STYLES["TableCell"])],
        [Paragraph("<b>Correspondence Address:</b>", STYLES["TableCellBold"]), Paragraph("[  ] Same as permanent address<br/>____________________________________________________________", STYLES["TableCell"])],
        [Paragraph("<b>Primary Mobile Number:</b>", STYLES["TableCellBold"]), Paragraph("+91 - [___][___][___][___][___][___][___][___][___][___]  (Verified via OTP)", STYLES["TableCell"])],
        [Paragraph("<b>Primary Email Address:</b>", STYLES["TableCellBold"]), Paragraph("____________________________________________________________", STYLES["TableCell"])],
        [Paragraph("<b>Tax Residency Mandate:</b>", STYLES["TableCellBold"]), Paragraph("[  ] Resident Indian   [  ] Non-Resident Indian (NRI)   [  ] FATCA / CRS Applicable", STYLES["TableCell"])],
    ]
    t2 = Table(fields_2, colWidths=[170, 310])
    t2.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (0,-1), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t2)

    story.append(PageBreak())

    story.append(Paragraph("<b>3. BANK ACCOUNT DETAILS FOR ADVISORY FEE PAYMENT</b>", STYLES["Heading1"]))
    story.append(Paragraph("<b>Fiduciary Safeguard Notice:</b> The bank account below is verified solely for advisory invoice debits or e-mandates. Alpha Investment Management maintains strictly non-custodial operations and will NEVER request, receive, or pool client investment capital.", STYLES["Body"]))
    
    fields_3 = [
        [Paragraph("<b>Bank Name & Branch:</b>", STYLES["TableCellBold"]), Paragraph("____________________________________________________________", STYLES["TableCell"])],
        [Paragraph("<b>Bank Account Number:</b>", STYLES["TableCellBold"]), Paragraph("____________________________________  (Attach cancelled cheque)", STYLES["TableCell"])],
        [Paragraph("<b>IFSC Code (11 Digits):</b>", STYLES["TableCellBold"]), Paragraph("[___][___][___][___][___][___][___][___][___][___][___]", STYLES["TableCell"])],
        [Paragraph("<b>Account Type:</b>", STYLES["TableCellBold"]), Paragraph("[  ] Resident Savings   [  ] Current   [  ] NRE   [  ] NRO", STYLES["TableCell"])],
    ]
    t3 = Table(fields_3, colWidths=[170, 310])
    t3.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (0,-1), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t3)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>4. NOMINEE DESIGNATION (OPTIONAL BUT RECOMMENDED)</b>", STYLES["Heading1"]))
    fields_4 = [
        [Paragraph("<b>Nominee Full Legal Name:</b>", STYLES["TableCellBold"]), Paragraph("____________________________________________________________", STYLES["TableCell"])],
        [Paragraph("<b>Relationship to Client:</b>", STYLES["TableCellBold"]), Paragraph("_________________________  <b>Date of Birth:</b> [___]/[___]/[______]", STYLES["TableCell"])],
        [Paragraph("<b>Guardian (if Nominee is Minor):</b>", STYLES["TableCellBold"]), Paragraph("Name: ________________________________  PAN: _______________", STYLES["TableCell"])],
    ]
    t4 = Table(fields_4, colWidths=[170, 310])
    t4.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (0,-1), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t4)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>5. MANDATORY FIDUCIARY ONBOARDING DECLARATION</b>", STYLES["Heading1"]))
    dec_text = (
        "1. <b>Non-Custodial Mandate:</b> I/We explicitly acknowledge that Alpha Investment Management operates strictly as a fee-only SEBI Registered Investment Adviser (INA000017348). The adviser shall not hold custody of my funds or securities at any time.<br/>"
        "2. <b>Zero Power-of-Attorney:</b> No power-of-attorney (PoA) is granted to the adviser to execute transactions without my explicit prior consent.<br/>"
        "3. <b>Suitability & Risk Profiling:</b> I/We agree to provide accurate financial information to facilitate rigorous suitability assessments under Regulation 16 of the SEBI (Investment Advisers) Regulations, 2013.<br/>"
        "4. <b>0% Commission Covenant:</b> I/We understand that Alpha Investment Management earns zero distribution commissions, kickbacks, or brokerage incentives, and recommends only direct mutual funds and direct securities."
    )
    story.append(Paragraph(dec_text, STYLES["BodyJustify"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>6. VERIFICATION CHECKLIST (MANDATORY ATTACHMENTS)</b>", STYLES["Heading1"]))
    checklist_data = [
        [Paragraph("<b>[  ]</b>", STYLES["TableCellBold"]), Paragraph("Self-attested copy of PAN Card (Mandatory for all Indian securities accounts)", STYLES["TableCell"])],
        [Paragraph("<b>[  ]</b>", STYLES["TableCellBold"]), Paragraph("Proof of Identity & Address (Aadhaar / Passport / Voter ID / Driving Licence)", STYLES["TableCell"])],
        [Paragraph("<b>[  ]</b>", STYLES["TableCellBold"]), Paragraph("Cancelled Cheque leaf showing client name, account number & IFSC code", STYLES["TableCell"])],
        [Paragraph("<b>[  ]</b>", STYLES["TableCellBold"]), Paragraph("Completed 10-point SEBI RIA Risk Profiling & Suitability Questionnaire", STYLES["TableCell"])],
        [Paragraph("<b>[  ]</b>", STYLES["TableCellBold"]), Paragraph("Countersigned Investment Advisory Agreement & Standard Fee Schedule", STYLES["TableCell"])],
    ]
    tc = Table(checklist_data, colWidths=[30, 450])
    tc.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(tc)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>7. CLIENT CONSENT & SIGNATURES</b>", STYLES["Heading1"]))
    sig_data = [
        [
            Paragraph("<b>Client Signature:</b><br/><br/><br/>________________________________________<br/><b>Name:</b> ______________________________<br/><b>Date:</b> ____ / ____ / 20____<br/><b>Place:</b> ______________________________", STYLES["TableCell"]),
            Paragraph("<b>Adviser Verification & Acceptance:</b><br/><br/><br/>________________________________________<br/><b>Authorised Signatory:</b> Nageshwar Prasad<br/><b>SEBI RIA:</b> INA000017348 · BASL-1982<br/><b>Date:</b> ____ / ____ / 20____", STYLES["TableCell"])
        ]
    ]
    tsig = Table(sig_data, colWidths=[240, 240])
    tsig.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('BACKGROUND', (0,0), (-1,-1), C_BG_CREAM),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(tsig)

    story.extend(make_closing_block())

    build_pdf_document(
        output_filename=meta["cleanFileName"],
        title=meta["title"],
        subtitle=meta["subtitle"],
        version=meta["version"],
        effective_date=meta["effectiveDate"],
        flowables=story
    )

# ==============================================================================
# DOCUMENT 2: Risk Profiling & Suitability Assessment Questionnaire
# ==============================================================================
def parse_risk_config():
    """Extracts questions and archetypes from riskProfileConfig.ts"""
    with open(RISK_CONFIG_PATH, "r", encoding="utf-8") as f:
        code = f.read()

    # Extract Questions
    q_matches = re.findall(
        r'id:\s*\"(q\d+)\".*?number:\s*(\d+).*?category:\s*\"([^\"]+)\".*?title:\s*\"([^\"]+)\".*?explanation:\s*\"([^\"]+)\".*?whyItMatters:\s*\"([^\"]+)\".*?options:\s*(\[.*?\])\s*\},',
        code, re.DOTALL
    )
    questions = []
    for qm in q_matches:
        qid, qnum, qcat, qtitle, qexpl, qwhy, opt_raw = qm
        opts = []
        for om in re.finditer(r'id:\s*\"([^\"]+)\",\s*text:\s*\"([^\"]+)\",\s*subtext:\s*\"([^\"]+)\",\s*weight:\s*(\d+)', opt_raw):
            opts.append({
                "id": om.group(1),
                "text": om.group(2),
                "subtext": om.group(3),
                "weight": int(om.group(4))
            })
        questions.append({
            "id": qid, "number": int(qnum), "category": qcat, "title": qtitle,
            "explanation": qexpl, "whyItMatters": qwhy, "options": opts
        })

    # Extract Archetypes
    arch_matches = re.finditer(
        r'id:\s*\"([^\"]+)\",\s*name:\s*\"([^\"]+)\",\s*tagline:\s*\"([^\"]+)\",\s*description:\s*\"([^\"]+)\",\s*minScore:\s*(\d+),\s*maxScore:\s*(\d+).*?equity:\s*(\d+),\s*debt:\s*(\d+),\s*gold:\s*(\d+),\s*cash:\s*(\d+).*?volatilityBand:\s*\"([^\"]+)\",\s*benchmark:\s*\"([^\"]+)\"',
        code, re.DOTALL
    )
    archetypes = []
    for am in arch_matches:
        archetypes.append({
            "id": am.group(1), "name": am.group(2), "tagline": am.group(3),
            "description": am.group(4), "minScore": int(am.group(5)), "maxScore": int(am.group(6)),
            "equity": int(am.group(7)), "debt": int(am.group(8)), "gold": int(am.group(9)), "cash": int(am.group(10)),
            "volatility": am.group(11), "benchmark": am.group(12)
        })

    return questions, archetypes

def generate_risk_profiling_document():
    cfg_path = os.path.join(CONFIG_DIR, "risk-profiling.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    questions, archetypes = parse_risk_config()
    story = []

    story.append(Paragraph("<b>1. REGULATORY SUITABILITY FRAMEWORK & MANDATORY CAVEAT</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "Under Regulation 16 and 17 of the SEBI (Investment Advisers) Regulations, 2013, every registered adviser is legally mandated to evaluate client risk profile, capacity for loss, investment horizon, and financial situation before recommending any securities portfolio. "
        "This questionnaire constitutes the mathematical foundation for determining your client archetype and volatility tolerance.",
        STYLES["BodyJustify"]
    ))
    story.append(Paragraph(
        f"<b>STATUTORY CAVEAT:</b> <font color='#8A6E3D'><i>\"{meta['statutoryCaveat']}\"</i></font>",
        STYLES["Body"]
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>2. THE 10 INSTITUTIONAL SUITABILITY QUESTIONS</b>", STYLES["Heading1"]))
    
    for idx, q in enumerate(questions):
        q_elements = []
        q_elements.append(Paragraph(f"<b>Question {q['number']}: {q['title']}</b> ({q['category']})", STYLES["Heading2"]))
        q_elements.append(Paragraph(f"<i>Objective:</i> {q['explanation']}", STYLES["Body"]))
        
        opt_rows = [
            [Paragraph("<b>Select</b>", STYLES["TableHeader"]), Paragraph("<b>Option Description</b>", STYLES["TableHeader"]), Paragraph("<b>Score Weight</b>", STYLES["TableHeader"])]
        ]
        for opt in q["options"]:
            opt_rows.append([
                Paragraph("[  ]", STYLES["TableCellBold"]),
                Paragraph(f"<b>{opt['text']}</b><br/><font color='#4B5563'>{opt['subtext']}</font>", STYLES["TableCell"]),
                Paragraph(f"{opt['weight']} pt{'s' if opt['weight']>1 else ''}", STYLES["TableCellBold"])
            ])
        t_opt = Table(opt_rows, colWidths=[40, 375, 65])
        t_opt.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
            ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
            ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        q_elements.append(t_opt)
        q_elements.append(Spacer(1, 6))
        story.append(KeepTogether(q_elements))
        if idx == 3 or idx == 7:
            story.append(PageBreak())

    story.append(PageBreak())
    story.append(Paragraph("<b>3. SCORING MATRIX & MATHEMATICAL ARCHETYPE MAPPING</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "<b>Mathematical Formula:</b> Raw Score = Sum of weights across 10 questions (Range: 10 to 40). "
        "Normalized Suitability Score = ((Raw Score - 10) / 30) × 100 (Range: 0 to 100).",
        STYLES["Body"]
    ))

    arch_rows = [
        [
            Paragraph("<b>Investor Archetype</b>", STYLES["TableHeader"]),
            Paragraph("<b>Score Range</b>", STYLES["TableHeader"]),
            Paragraph("<b>Strategic Target Allocation</b>", STYLES["TableHeader"]),
            Paragraph("<b>Max Historical Drawdown</b>", STYLES["TableHeader"]),
            Paragraph("<b>Official Benchmark</b>", STYLES["TableHeader"]),
        ]
    ]
    for a in archetypes:
        arch_rows.append([
            Paragraph(f"<b>{a['name']}</b><br/><font color='#4B5563'>{a['tagline']}</font>", STYLES["TableCell"]),
            Paragraph(f"{a['minScore']} – {a['maxScore']} / 100", STYLES["TableCellBold"]),
            Paragraph(f"Equity: <b>{a['equity']}%</b><br/>Debt: <b>{a['debt']}%</b><br/>Gold: <b>{a['gold']}%</b> · Cash: <b>{a['cash']}%</b>", STYLES["TableCell"]),
            Paragraph(a["volatility"], STYLES["TableCell"]),
            Paragraph(a["benchmark"], STYLES["TableCell"]),
        ])
    t_arch = Table(arch_rows, colWidths=[120, 75, 120, 85, 80], repeatRows=1)
    t_arch.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_arch)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>4. FIDUCIARY SUITABILITY OVERRIDE PROTOCOL & PORTFOLIO DECLARATION</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "<b>Non-Negotiable Time-Horizon Guard:</b> In strict observance of SEBI fiduciary duties, if a client selects Option 1 in Question 1 (Horizon under 12 months), their maximum equity exposure is automatically restricted to 15% (Conservative Fiduciary), regardless of how high their raw score is. Capital required within 1 year cannot be exposed to short-term market drawdowns.",
        STYLES["BodyJustify"]
    ))
    story.append(Paragraph(
        "<b>Declared Investable Surplus Bracket:</b> Indicative liquid portfolio earmarked for advisory mandate: "
        "<br/>[  ] ₹50,00,000 to ₹1,00,00,000      [  ] ₹1,00,00,000 to ₹5,00,00,000      [  ] ₹5,00,00,000+",
        STYLES["Body"]
    ))

    story.extend(make_closing_block())

    build_pdf_document(
        output_filename=meta["cleanFileName"],
        title=meta["title"],
        subtitle=meta["subtitle"],
        version=meta["version"],
        effective_date=meta["effectiveDate"],
        flowables=story
    )

# ==============================================================================
# DOCUMENT 3: Investment Advisory Agreement & Standard Fee Schedule
# ==============================================================================
def generate_agreement_document():
    cfg_path = os.path.join(CONFIG_DIR, "fee-agreement.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    story = []
    story.append(Paragraph("<b>STANDARD INVESTMENT ADVISORY AGREEMENT</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        f"This Investment Advisory Agreement is entered into on this _____ day of ____________, 20____ by and between:<br/>"
        f"<b>ALPHA INVESTMENT MANAGEMENT</b> (SEBI Registered Investment Adviser Registration No. INA000017348, BASL Membership No. 1982), having its registered office at {FIRM['registeredOffice']} (hereinafter referred to as the <b>\"Investment Adviser\"</b>, which expression shall include its successors and permitted assigns); and<br/>"
        f"<b>CLIENT:</b> __________________________________________________________________ (PAN: ____________________), residing at __________________________________________________________________ (hereinafter referred to as the <b>\"Client\"</b>).",
        STYLES["BodyJustify"]
    ))
    story.append(Spacer(1, 6))

    clauses = [
        ("1. APPOINTMENT & SCOPE OF FIDUCIARY SERVICES",
         "The Client hereby retains the Investment Adviser to provide non-discretionary, fee-only investment advisory services in accordance with Regulation 16 and 17 of the SEBI (Investment Advisers) Regulations, 2013. The scope of services encompasses comprehensive financial goal mapping, asset allocation, investment policy statement (IPS) formulation, and periodic rebalancing recommendations across direct equities, sovereign bonds, debt securities, and direct mutual funds."),
        ("2. STRICT NON-CUSTODIAL COVENANT (ZERO CUSTODY OF CLIENT FUNDS)",
         "In strict compliance with Regulation 19(1)(e) of the SEBI (Investment Advisers) Regulations, 2013, the Investment Adviser covenants that it shall NOT hold, accept, or maintain custody of client funds or securities under any circumstances. All client investments shall be executed directly in the Client's own demat, depository, or mutual fund folios. The Adviser shall not obtain power-of-attorney (PoA) to transact on behalf of the Client."),
        ("3. 0% COMMISSION COVENANT & CONFLICT OF INTEREST DISCLOSURE",
         "The Investment Adviser explicitly declares that it operates strictly on a fee-only basis and does not receive any distribution commission, trail kickbacks, brokerage incentives, or third-party consideration from any asset management company, broker, or financial institution. Recommendations are formulated solely in the fiduciary interest of the Client using direct plan mutual funds and direct securities."),
        ("4. STANDARD FEE SCHEDULE & BILLING TERMS",
         "Advisory fees shall be charged strictly within the statutory limits stipulated under Regulation 15A of the SEBI (Investment Advisers) Regulations, 2013 and SEBI Circular SEBI/HO/IMD/DF1/CIR/P/2020/182. The Client may elect either Fixed Fee Mode or Percentage of AUA Mode as set out in the schedule below:"),
    ]

    for title, body in clauses:
        story.append(Paragraph(f"<b>{title}</b>", STYLES["Heading2"]))
        story.append(Paragraph(body, STYLES["BodyJustify"]))

    # Fee Schedule Table from firmConfig
    fixed_fees = FIRM["feeSchedule"]["fixedFeeOptions"]
    fee_rows = [
        [Paragraph("<b>Advisory Service Tier</b>", STYLES["TableHeader"]), Paragraph("<b>Scope & Deliverables</b>", STYLES["TableHeader"]), Paragraph("<b>Statutory Fee (INR)</b>", STYLES["TableHeader"]), Paragraph("<b>Billing Cycle</b>", STYLES["TableHeader"])]
    ]
    for ff in fixed_fees:
        fee_rows.append([
            Paragraph(f"<b>{ff['service']}</b>", STYLES["TableCellBold"]),
            Paragraph(ff["scope"], STYLES["TableCell"]),
            Paragraph(f"₹{ff['feeInr']:,}", STYLES["TableCellBold"]),
            Paragraph(ff["billingCycle"], STYLES["TableCell"]),
        ])
    for af in FIRM["feeSchedule"]["auaFeeOptions"]:
        fee_rows.append([
            Paragraph(f"<b>{af['tier']}</b>", STYLES["TableCellBold"]),
            Paragraph(af["basis"], STYLES["TableCell"]),
            Paragraph(f"{af['ratePercent']:.2f}% p.a.", STYLES["TableCellBold"]),
            Paragraph("Quarterly in arrears", STYLES["TableCell"]),
        ])
    t_fee = Table(fee_rows, colWidths=[130, 190, 80, 80], repeatRows=1)
    t_fee.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_fee)
    story.append(Paragraph(f"<i>Statutory Ceiling Note: {FIRM['feeSchedule']['statutoryCeilingNote']}</i>", STYLES["StatutoryBox"]))

    story.append(PageBreak())

    more_clauses = [
        ("5. CLIENT OBLIGATIONS & DISCLOSURE OF MATERIAL INFORMATION",
         "The Client undertakes to provide complete, truthful, and updated information regarding financial status, risk capacity, tax liabilities, and investment horizons. Any material change in circumstances must be communicated to the Adviser within 15 working days."),
        ("6. SUITABILITY REVIEWS & AUDIT CYCLES",
         "The Investment Adviser shall review the Client's risk profile and portfolio allocation at least once annually in accordance with Regulation 16(5), or upon significant macro market disruptions, ensuring adherence to the agreed Investment Policy Statement."),
        ("7. TERMINATION & PRO-RATA REFUND OF UNEXPIRED FEES",
         "Either party may terminate this Agreement by giving thirty (30) calendar days' written notice to the other party. In the event of early termination, any unexpired advisory fees collected in advance shall be refunded to the Client on a pro-rata basis within 15 business days, without deduction of any exit penalties, pursuant to Regulation 15A."),
        ("8. INVESTOR GRIEVANCE ESCALATION & SCORES 2.0 REDRESSAL",
         "In case of any dispute or grievance, the Client shall first address the Grievance Officer Advocate Rajat Diwan. If unresolved within 21 calendar days, the dispute may be escalated to SEBI SCORES 2.0 portal (scores.sebi.gov.in) or the SMART ODR platform (smartodr.in)."),
        ("9. GOVERNING LAW & JURISDICTION",
         "This Agreement shall be governed by, and construed in accordance with, the laws of the Republic of India. The courts located in Pune, Maharashtra shall have exclusive jurisdiction over all legal proceedings arising out of this Agreement."),
        ("10. VERIFIED REGULATORY CITATIONS TABLE FOR COMPLIANCE",
         "All provisions of this Agreement derive statutory authority from the SEBI (Investment Advisers) Regulations, 2013 (verified via sebi.gov.in):"),
    ]
    for title, body in more_clauses:
        story.append(Paragraph(f"<b>{title}</b>", STYLES["Heading2"]))
        story.append(Paragraph(body, STYLES["BodyJustify"]))

    cit_rows = [
        [Paragraph("<b>Statutory Regulation</b>", STYLES["TableHeader"]), Paragraph("<b>Mandate & Compliance Scope</b>", STYLES["TableHeader"]), Paragraph("<b>Official Reference</b>", STYLES["TableHeader"])],
        [Paragraph("Regulation 15A", STYLES["TableCellBold"]), Paragraph("Statutory Fee ceilings (₹1.25L fixed fee or 2.5% AUA cap)", STYLES["TableCell"]), Paragraph("SEBI/HO/IMD/DF1/CIR/P/2020/182", STYLES["TableCell"])],
        [Paragraph("Regulation 16", STYLES["TableCellBold"]), Paragraph("Mandatory Risk Profiling & Client Suitability diagnostics", STYLES["TableCell"]), Paragraph("SEBI (IA) Regulations, 2013", STYLES["TableCell"])],
        [Paragraph("Regulation 19(1)(d)", STYLES["TableCellBold"]), Paragraph("Fiduciary standard: Client interest supersedes adviser interest", STYLES["TableCell"]), Paragraph("Schedule III Code of Conduct", STYLES["TableCell"])],
        [Paragraph("Regulation 19(1)(e)", STYLES["TableCellBold"]), Paragraph("Prohibition on holding custody of client securities or funds", STYLES["TableCell"]), Paragraph("SEBI Master Circular 2024", STYLES["TableCell"])],
        [Paragraph("Regulation 22", STYLES["TableCellBold"]), Paragraph("Maintenance of client interaction records for minimum 5 years", STYLES["TableCell"]), Paragraph("Statutory Audit Inspection", STYLES["TableCell"])],
    ]
    t_cit = Table(cit_rows, colWidths=[110, 240, 130], repeatRows=1)
    t_cit.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_cit)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>11. SIGNATURES & COUNTERSIGNATURE OF PARTIES</b>", STYLES["Heading1"]))
    sig_data = [
        [
            Paragraph("<b>FOR AND ON BEHALF OF CLIENT:</b><br/><br/><br/>________________________________________<br/><b>Signature:</b> ___________________________<br/><b>Name:</b> ______________________________<br/><b>Date:</b> ____ / ____ / 20____", STYLES["TableCell"]),
            Paragraph("<b>FOR ALPHA INVESTMENT MANAGEMENT:</b><br/><br/><br/>________________________________________<br/><b>Principal Officer:</b> Nageshwar Prasad<br/><b>SEBI RIA:</b> INA000017348 · BASL-1982<br/><b>Date:</b> ____ / ____ / 20____", STYLES["TableCell"])
        ]
    ]
    tsig = Table(sig_data, colWidths=[240, 240])
    tsig.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('BACKGROUND', (0,0), (-1,-1), C_BG_CREAM),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(tsig)

    story.extend(make_closing_block())

    build_pdf_document(
        output_filename=meta["cleanFileName"],
        title=meta["title"],
        subtitle=meta["subtitle"],
        version=meta["version"],
        effective_date=meta["effectiveDate"],
        flowables=story
    )

# ==============================================================================
# DOCUMENT 4: Investor Grievance Redressal Protocol & SCORES Matrix
# ==============================================================================
def generate_grievance_document():
    cfg_path = os.path.join(CONFIG_DIR, "scores-grievance.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    story = []
    story.append(Paragraph("<b>1. COMMITMENT TO TRANSPARENT DISPUTE RESOLUTION</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        f"Alpha Investment Management is committed to upholding the highest standards of fiduciary governance. In compliance with Regulation 21 of the SEBI (Investment Advisers) Regulations, 2013 and SEBI Master Circular SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/145, we establish a structured, four-tier dispute resolution protocol for all advisory clients (Verified as on {meta['asOnDate']}).",
        STYLES["BodyJustify"]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>2. STEP-BY-STEP 4-TIER ESCALATION ARCHITECTURE</b>", STYLES["Heading1"]))

    tiers = [
        ("TIER 1: ADVISORY COMMITTEE DESK (INITIAL RESOLUTION)",
         "<b>Contact:</b> Advisory Committee, Alpha Investment Management<br/>"
         f"<b>Email:</b> {FIRM['contactEmail']} | <b>Helpline:</b> {FIRM['contactPhone']}<br/>"
         f"<b>Physical Address:</b> {FIRM['registeredOffice']}<br/>"
         "<b>Statutory Timeline:</b> Resolution within <b>7 working days</b> of complaint lodgment.<br/>"
         "<b>Process:</b> Client submits grievance in writing detailing folio/mandate number. The advisory desk investigates transactional audit logs, IPS parameters, and client instructions to issue a formal written reply."),
        ("TIER 2: DESIGNATED COMPLIANCE & GRIEVANCE OFFICER",
         f"<b>Designated Officer:</b> {FIRM['grievanceOfficer']}, Advocate<br/>"
         f"<b>Direct Grievance Email:</b> {FIRM['grievanceEmail']}<br/>"
         f"<b>Physical Office:</b> 1st Floor, Mahalungekar Complex, Chakan-Talegaon Highway, Pune, Maharashtra 410501<br/>"
         "<b>Statutory Timeline:</b> Formal redressal within <b>15 calendar days</b>.<br/>"
         "<b>Process:</b> If Tier 1 resolution is unsatisfactory or unreceived within 7 days, the grievance automatically elevates to Advocate Rajat Diwan, who operates with statutory independence from advisory revenue."),
        ("TIER 3: SEBI SCORES 2.0 PORTAL (REGULATORY ESCALATION)",
         "<b>Portal Web Link:</b> https://scores.sebi.gov.in (SCORES 2.0 System)<br/>"
         "<b>App:</b> SEBI SCORES Mobile App (Available on iOS and Android)<br/>"
         "<b>Statutory Escalation Timeline:</b> Automatic escalation if unresolved within <b>21 calendar days</b>.<br/>"
         "<b>Circular Reference:</b> SEBI Master Circular SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/145 (As on September 2026).<br/>"
         "<b>Procedure:</b> Client files complaint online quoting RIA Registration INA000017348 and BASL-1982. SEBI forwards the complaint through the automated two-tier workflow with strict regulatory monitoring."),
        ("TIER 4: SMART ODR MECHANISM (ONLINE DISPUTE RESOLUTION)",
         "<b>Portal Web Link:</b> https://smartodr.in (Securities Market Approach for Resolution Through ODR)<br/>"
         "<b>Administering Bodies:</b> Empaneled ODR Institutions under SEBI Circular SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131.<br/>"
         "<b>Procedure:</b> If Tier 3 redressal is unaccepted, the dispute may be submitted to independent conciliation (21 days) and subsequent online arbitration pursuant to the Arbitration and Conciliation Act, 1996.<br/>"
         "<b>Legally Binding Award:</b> Arbitral awards rendered through SMART ODR carry the force of a civil decree.")
    ]

    for title, desc in tiers:
        story.append(Paragraph(f"<b>{title}</b>", STYLES["Heading2"]))
        story.append(Paragraph(desc, STYLES["Body"]))
        story.append(Spacer(1, 4))

    story.append(PageBreak())
    story.append(Paragraph(f"<b>3. SUMMARY ESCALATION MATRIX (VERIFIED AS ON {meta['asOnDate'].upper()})</b>", STYLES["Heading1"]))
    
    mat_rows = [
        [Paragraph("<b>Escalation Tier</b>", STYLES["TableHeader"]), Paragraph("<b>Designated Authority</b>", STYLES["TableHeader"]), Paragraph("<b>Contact Coordinates</b>", STYLES["TableHeader"]), Paragraph("<b>Max Turnaround</b>", STYLES["TableHeader"])],
        [Paragraph("Tier 1: Advisory Desk", STYLES["TableCellBold"]), Paragraph("Advisory Desk Lead", STYLES["TableCell"]), Paragraph(f"{FIRM['contactEmail']}<br/>{FIRM['contactPhone']}", STYLES["TableCell"]), Paragraph("7 Working Days", STYLES["TableCellBold"])],
        [Paragraph("Tier 2: Grievance Officer", STYLES["TableCellBold"]), Paragraph(FIRM["grievanceOfficer"], STYLES["TableCell"]), Paragraph(f"{FIRM['grievanceEmail']}<br/>Office: Chakan, Pune", STYLES["TableCell"]), Paragraph("15 Calendar Days", STYLES["TableCellBold"])],
        [Paragraph("Tier 3: SEBI SCORES 2.0", STYLES["TableCellBold"]), Paragraph("Securities & Exchange Board of India", STYLES["TableCell"]), Paragraph("scores.sebi.gov.in<br/>SEBI Toll-Free: 1800 22 7575", STYLES["TableCell"]), Paragraph("21 Calendar Days", STYLES["TableCellBold"])],
        [Paragraph("Tier 4: SMART ODR", STYLES["TableCellBold"]), Paragraph("Independent ODR Arbitrators", STYLES["TableCell"]), Paragraph("smartodr.in<br/>Empaneled MII Institutions", STYLES["TableCell"]), Paragraph("21 Days Conciliation / 30 Days Arbitration", STYLES["TableCellBold"])],
    ]
    t_mat = Table(mat_rows, colWidths=[105, 115, 150, 110], repeatRows=1)
    t_mat.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_mat)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>4. STATUTORY RIGHTS OF CLIENTS DURING DISPUTE PROCEEDINGS</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "1. <b>Zero Fee Retaliation:</b> Filing a grievance shall not prejudice the Client's portfolio advisory status, nor will it incur administrative retaliatory charges (₹0 filing fees on SEBI SCORES 2.0).<br/>"
        "2. <b>Right to Unexpired Fee Refund:</b> Initiation of formal dispute proceedings does not extinguish the Client's statutory right to terminate the advisory mandate and receive a pro-rata fee refund under Regulation 15A.<br/>"
        "3. <b>Record Preservation:</b> All correspondence, trade notes, and risk assessment records relevant to the disputed matter are preserved for minimum 5 years pursuant to Regulation 22.",
        STYLES["BodyJustify"]
    ))

    story.extend(make_closing_block())

    build_pdf_document(
        output_filename=meta["cleanFileName"],
        title=meta["title"],
        subtitle=meta["subtitle"],
        version=meta["version"],
        effective_date=meta["effectiveDate"],
        flowables=story
    )

# ==============================================================================
# DOCUMENT 5: Annual Regulatory Disclosure Document (INA000017348)
# ==============================================================================
def generate_disclosure_document():
    cfg_path = os.path.join(CONFIG_DIR, "annual-disclosure.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    story = []
    story.append(Paragraph("<b>1. STATUTORY REGISTRATION & ENTITY IDENTIFIERS</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        f"This Annual Regulatory Disclosure Document is published pursuant to Regulation 18 of the SEBI (Investment Advisers) Regulations, 2013 and BASL Circular BASL/2021-22/08 for {meta['auditFinancialYear']} (Updated September 2026).",
        STYLES["BodyJustify"]
    ))

    reg_rows = [
        [Paragraph("<b>Regulatory Attribute</b>", STYLES["TableHeader"]), Paragraph("<b>Official Statutory Particulars</b>", STYLES["TableHeader"])],
        [Paragraph("Full Legal Entity Name", STYLES["TableCellBold"]), Paragraph(FIRM["firmName"], STYLES["TableCell"])],
        [Paragraph("SEBI Registration Number", STYLES["TableCellBold"]), Paragraph(f"<b>{FIRM['sebiRiaNumber']}</b> (Investment Adviser)", STYLES["TableCell"])],
        [Paragraph("BASL Membership Identifier", STYLES["TableCellBold"]), Paragraph(f"<b>{FIRM['baslMembershipNumber']}</b> (BSE Administration & Supervision Ltd)", STYLES["TableCell"])],
        [Paragraph("Registration Validity", STYLES["TableCellBold"]), Paragraph(FIRM["validity"], STYLES["TableCell"])],
        [Paragraph("Principal Officer & CIO", STYLES["TableCellBold"]), Paragraph(f"{FIRM['principalOfficer']} (NISM-Series-X-A & X-B Certified)", STYLES["TableCell"])],
        [Paragraph("Compliance & Grievance Officer", STYLES["TableCellBold"]), Paragraph(f"{FIRM['grievanceOfficer']} (Advocate, High Court Bar)", STYLES["TableCell"])],
        [Paragraph("Registered & Advisory Office", STYLES["TableCellBold"]), Paragraph(FIRM["registeredOffice"], STYLES["TableCell"])],
    ]
    t_reg = Table(reg_rows, colWidths=[170, 310])
    t_reg.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (0,-1), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_reg)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>2. CORE BUSINESS DESCRIPTION & FEE-ONLY MODEL</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "Alpha Investment Management is an independent fiduciary wealth advisory firm providing quantitative asset allocation, retirement decumulation architecture, and capital gains tax planning for Indian high-net-worth families. "
        "The firm operates exclusively under an <b>advice-only, direct-securities model</b> with zero distributor revenue, zero trailer fees, and zero proprietary execution markups.",
        STYLES["BodyJustify"]
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>3. AUDITED INVESTOR COMPLAINTS DATA (LAST 3 FINANCIAL YEARS)</b>", STYLES["Heading1"]))
    comp_rows = [
        [
            Paragraph("<b>Financial Year</b>", STYLES["TableHeader"]),
            Paragraph("<b>Complaints Received</b>", STYLES["TableHeader"]),
            Paragraph("<b>Complaints Resolved</b>", STYLES["TableHeader"]),
            Paragraph("<b>Complaints Pending</b>", STYLES["TableHeader"]),
            Paragraph("<b>Avg Resolution Days</b>", STYLES["TableHeader"]),
        ]
    ]
    for c in FIRM["complaintsHistory"]:
        comp_rows.append([
            Paragraph(f"<b>{c['financialYear']}</b>", STYLES["TableCellBold"]),
            Paragraph(str(c["received"]), STYLES["TableCell"]),
            Paragraph(str(c["resolved"]), STYLES["TableCell"]),
            Paragraph(str(c["pending"]), STYLES["TableCell"]),
            Paragraph(f"{c['avgResolutionDays']} days", STYLES["TableCell"]),
        ])
    comp_rows.append([
        Paragraph("<b>Current FY (As on Sept 2026)</b>", STYLES["TableCellBold"]),
        Paragraph("0", STYLES["TableCellBold"]),
        Paragraph("0", STYLES["TableCellBold"]),
        Paragraph("0", STYLES["TableCellBold"]),
        Paragraph("0 days", STYLES["TableCellBold"]),
    ])
    t_comp = Table(comp_rows, colWidths=[120, 90, 90, 90, 90], repeatRows=1)
    t_comp.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_comp)

    story.append(PageBreak())
    story.append(Paragraph("<b>4. DISCIPLINARY HISTORY & STATUTORY AUDIT DECLARATION</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        f"<b>Disciplinary History:</b> {FIRM['disciplinaryHistory']}.<br/>"
        "No inquiry, inspection, adjudication proceedings, or penalty has ever been levied on Alpha Investment Management or its Principal Officer by SEBI, the Reserve Bank of India, or BASL.<br/>"
        "<b>Annual Compliance Audit:</b> Pursuant to Regulation 19(3) of the SEBI (Investment Advisers) Regulations, 2013, the annual compliance audit of the firm's advisory operations has been duly completed by an independent practicing Chartered Accountant.",
        STYLES["BodyJustify"]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>5. AFFILIATIONS & CAPITAL ADEQUACY DISCLOSURES</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        f"<b>Affiliations:</b> {FIRM['affiliations']}<br/>"
        "<b>Capital Adequacy:</b> In compliance with Regulation 8, the firm maintains unencumbered tangible net worth well exceeding the statutory requirement of ₹50,00,000 (Rupees Fifty Lakhs) with nil debt borrowings.<br/>"
        "<b>Proprietary Trading:</b> Neither the Investment Adviser nor its directors/officers engage in proprietary market-making, algorithmic high-frequency trading, or stockbroking.<br/>"
        "<b>Holding Disclosure:</b> When recommending individual securities, personal investments of the advisory team in the same securities are governed by strict pre-clearance rules and disclosure covenants in compliance with Regulation 19.",
        STYLES["BodyJustify"]
    ))

    story.extend(make_closing_block())

    build_pdf_document(
        output_filename=meta["cleanFileName"],
        title=meta["title"],
        subtitle=meta["subtitle"],
        version=meta["version"],
        effective_date=meta["effectiveDate"],
        flowables=story
    )

# ==============================================================================
# DOCUMENT 6: Family Office Tax Harvesting Whitepaper (7-8 Pages)
# ==============================================================================
def generate_tax_whitepaper_document():
    cfg_path = os.path.join(CONFIG_DIR, "tax-whitepaper.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    story = []

    # Section 1: Executive Summary
    story.append(Paragraph("<b>1. EXECUTIVE SUMMARY & POST-FINANCE ACT CAPITAL GAINS ARCHITECTURE</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        f"Following the passage of the Finance (No. 2) Act, 2024, the Indian capital gains tax regime underwent structural rationalization that directly impacts high-net-worth portfolio allocations (Verified as on {meta['asOnDate']} for {meta['assessmentYear']}). "
        "Historically, complex holding periods and indexation benefits created asymmetric tax treatment across mutual funds, direct equities, and real estate. Under the amended provisions, family offices must realign liquidity management, systematic tax-loss harvesting, and capital shielding strategies.",
        STYLES["BodyJustify"]
    ))
    story.append(Paragraph(
        f"<b>CRITICAL STATUTORY CAUTION:</b> <font color='#8A6E3D'><i>\"{meta['taxCaution']}\"</i></font>",
        STYLES["Body"]
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Core Legislative Changes Summary (FY 2026-27):</b>", STYLES["Heading2"]))
    bullet_items_1 = [
        "<b>Section 112A (Long-Term Capital Gains on Listed Equities):</b> Rationalized to flat <b>12.5%</b> (previously 10%) on gains exceeding the enhanced basic exemption threshold of <b>₹1,25,000</b> per financial year.",
        "<b>Section 111A (Short-Term Capital Gains on Listed Equities):</b> Revised to <b>20.0%</b> (previously 15%) for holding periods under 12 months.",
        "<b>Section 50AA (Specified Debt Mutual Funds):</b> Gains from mutual funds investing ≤35% in domestic equities continue to be categorized strictly as short-term capital gains taxed at applicable marginal slab rates, regardless of holding period.",
        "<b>Section 54EC Capital Gains Bonds:</b> ₹50,00,000 (₹50 Lakhs) ceiling retained for shielding long-term capital gains arising from land, buildings, or real property within 6 months of transfer.",
        "<b>Section 54F Residential Reinvestment:</b> Capped at a maximum claim threshold of ₹10,00,00,000 (₹10 Crore) net consideration reinvestment in one residential house in India.",
    ]
    for b in bullet_items_1:
        story.append(Paragraph(f"• {b}", STYLES["BulletItem"]))

    story.append(PageBreak())

    # Section 2: Listed Equity Taxation
    story.append(Paragraph("<b>2. LISTED EQUITY & EQUITY MUTUAL FUND TAX REGIME (SECTION 112A & 111A)</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "For listed securities traded on recognized stock exchanges where Securities Transaction Tax (STT) is paid, holding periods and rates are codified as follows:",
        STYLES["Body"]
    ))

    eq_rows = [
        [Paragraph("<b>Security Type</b>", STYLES["TableHeader"]), Paragraph("<b>Holding Threshold</b>", STYLES["TableHeader"]), Paragraph("<b>Applicable Section</b>", STYLES["TableHeader"]), Paragraph("<b>Tax Rate (FY 2026-27)</b>", STYLES["TableHeader"]), Paragraph("<b>Exemption / Indexation</b>", STYLES["TableHeader"])],
        [Paragraph("Listed Shares / Equity MFs", STYLES["TableCellBold"]), Paragraph("≤ 12 Months (STCG)", STYLES["TableCell"]), Paragraph("Section 111A", STYLES["TableCell"]), Paragraph("<b>20.0%</b> + Surcharge", STYLES["TableCellBold"]), Paragraph("Nil exemption", STYLES["TableCell"])],
        [Paragraph("Listed Shares / Equity MFs", STYLES["TableCellBold"]), Paragraph("> 12 Months (LTCG)", STYLES["TableCell"]), Paragraph("Section 112A", STYLES["TableCell"]), Paragraph("<b>12.5%</b> + Surcharge", STYLES["TableCellBold"]), Paragraph("₹1,25,000 annual exemption; No indexation", STYLES["TableCell"])],
        [Paragraph("Grandfathered Equities", STYLES["TableCellBold"]), Paragraph("Acquired prior to 01-Feb-2018", STYLES["TableCell"]), Paragraph("Section 112A Proviso", STYLES["TableCell"]), Paragraph("<b>12.5%</b> on post-2018 gain", STYLES["TableCellBold"]), Paragraph("Cost stepped up to FMV as on 31-Jan-2018", STYLES["TableCell"])],
    ]
    t_eq = Table(eq_rows, colWidths=[110, 85, 80, 95, 110], repeatRows=1)
    t_eq.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_eq)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>3. SPECIFIED DEBT MUTUAL FUNDS & UNLISTED ASSETS (SECTION 50AA)</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "Under Section 50AA of the Income-tax Act, 1961, any specified mutual fund where not more than 35% of total proceeds are invested in equity shares of domestic companies is treated as short-term capital asset, irrespective of whether the units are held for 1 year, 3 years, or 10 years. "
        "Consequently, gains are aggregated with total income and taxed at the highest individual slab rate (up to 39% inclusive of highest surcharge). Family offices must therefore structure debt exposure through direct sovereign gold bonds (SGBs held to maturity remain exempt under Section 47), target maturity index funds, or sovereign debt directly held in demat.",
        STYLES["BodyJustify"]
    ))

    story.append(PageBreak())

    # Section 4: Systematic Tax-Loss Harvesting Protocol
    story.append(Paragraph("<b>4. INSTITUTIONAL TAX-LOSS HARVESTING PROTOCOL</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "Tax-loss harvesting is the disciplined process of realizing accrued capital losses to offset realized capital gains, thereby reducing net current-year tax liabilities and allowing untaxed capital to continue compounding. "
        "The statutory rules governing loss set-off and carry-forward under Section 70 and Section 71 of the Income-tax Act, 1961 are illustrated below:",
        STYLES["BodyJustify"]
    ))

    loss_rules = [
        [Paragraph("<b>Nature of Capital Loss</b>", STYLES["TableHeader"]), Paragraph("<b>Permissible Set-Off Against (Section 70 & 71)</b>", STYLES["TableHeader"]), Paragraph("<b>Carry-Forward Horizon</b>", STYLES["TableHeader"])],
        [Paragraph("Short-Term Capital Loss (STCL)", STYLES["TableCellBold"]), Paragraph("Can be set off against <b>BOTH</b> Short-Term (STCG) and Long-Term Capital Gains (LTCG) in the same assessment year", STYLES["TableCell"]), Paragraph("8 Assessment Years (provided return filed on time u/s 139(1))", STYLES["TableCellBold"])],
        [Paragraph("Long-Term Capital Loss (LTCL)", STYLES["TableCellBold"]), Paragraph("Can <b>ONLY</b> be set off against Long-Term Capital Gains (LTCG); strictly prohibited from offsetting STCG or business income", STYLES["TableCell"]), Paragraph("8 Assessment Years (provided return filed on time u/s 139(1))", STYLES["TableCellBold"])],
        [Paragraph("Inter-Head Set-Off", STYLES["TableCellBold"]), Paragraph("Capital losses (STCL or LTCL) <b>CANNOT</b> be set off against Salary, House Property, or Business Income", STYLES["TableCell"]), Paragraph("N/A (Strict intra-head ring-fencing)", STYLES["TableCell"])],
    ]
    t_loss = Table(loss_rules, colWidths=[120, 240, 120], repeatRows=1)
    t_loss.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_loss)

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Wash-Sale Mitigation in Indian Markets:</b>", STYLES["Heading2"]))
    story.append(Paragraph(
        "While Indian tax statutes do not contain an express 30-day 'wash-sale rule' akin to the US Internal Revenue Code Section 1091, the General Anti-Avoidance Rule (GAAR) empowers authorities to examine circular transactions lacking commercial substance. "
        "Our institutional protocol avoids immediate re-purchase of identical ISINs. Instead, realized capital is redeployed across economically correlated but distinct vehicles (e.g. harvesting an underperforming banking stock and redeploying into a broad-market Nifty 500 index fund or peer sector compounder).",
        STYLES["BodyJustify"]
    ))

    story.append(PageBreak())

    # Section 5: Real Estate & Capital Reinvestment Reliefs
    story.append(Paragraph("<b>5. CAPITAL ASSET SHIELDING VIA SECTION 54EC & 54F</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "For business promoters and families monetizing ancestral land, commercial real estate, or private enterprise equity, Section 54EC and 54F provide critical statutory shielding avenues:",
        STYLES["Body"]
    ))

    sec_rows = [
        [Paragraph("<b>Statutory Section</b>", STYLES["TableHeader"]), Paragraph("<b>Eligible Transfer Asset</b>", STYLES["TableHeader"]), Paragraph("<b>Reinvestment Asset & Condition</b>", STYLES["TableHeader"]), Paragraph("<b>Statutory Cap (FY 2026-27)</b>", STYLES["TableHeader"])],
        [
            Paragraph("<b>Section 54EC</b>", STYLES["TableCellBold"]),
            Paragraph("Long-term land, buildings, or real property", STYLES["TableCell"]),
            Paragraph("Bonds of REC, PFC, NHAI, or IRFC; must be subscribed within 6 months of transfer; 5-year lock-in", STYLES["TableCell"]),
            Paragraph("<b>₹50,00,000</b> (₹50 Lakhs) per assessee per FY", STYLES["TableCellBold"])
        ],
        [
            Paragraph("<b>Section 54F</b>", STYLES["TableCellBold"]),
            Paragraph("Any long-term capital asset OTHER than a residential house (e.g. unlisted equity, commercial plots)", STYLES["TableCell"]),
            Paragraph("Acquisition of ONE residential house in India within 1 year before or 2 years after transfer (3 years for construction)", STYLES["TableCell"]),
            Paragraph("<b>₹10,00,00,000</b> (₹10 Crore) maximum consideration claim limit", STYLES["TableCellBold"])
        ],
    ]
    t_sec = Table(sec_rows, colWidths=[80, 110, 180, 110], repeatRows=1)
    t_sec.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_sec)

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>6. GRANDFATHERING MECHANICS FOR PRE-2018 ACQUISITIONS</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "Under Section 112A, equity shares acquired on or before January 31, 2018 enjoy statutory grandfathering. The acquisition cost is deemed to be the higher of:<br/>"
        "• <b>Step 1:</b> Actual historical acquisition cost; and<br/>"
        "• <b>Step 2:</b> Lower of (i) Fair Market Value (FMV) on January 31, 2018 (highest traded price on exchange), or (ii) Full value of consideration on sale.<br/>"
        "This formula protects all gains accrued up to January 31, 2018 from any capital gains taxation, ensuring family offices only pay 12.5% on incremental post-2018 appreciation.",
        STYLES["BodyJustify"]
    ))

    story.append(PageBreak())

    # Section 7: Complete Worked Example with Stated Assumptions
    story.append(Paragraph("<b>7. COMPREHENSIVE WORKED EXAMPLE: FIDUCIARY TAX HARVESTING</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "<b>Stated Portfolio Scenario & Assumptions:</b><br/>"
        "• High-Net-Worth Investor: Managing a ₹5,00,00,000 (₹5 Crore) liquid equity portfolio in FY 2026-27.<br/>"
        "• Gross Realized Long-Term Capital Gains: ₹60,00,000 (from large-cap blue-chip equities held > 2 years).<br/>"
        "• Unrealized Paper Losses in Mid-Cap/Small-Cap Cyclicals: ₹20,00,000.<br/>"
        "• Unharvested Short-Term Capital Gains: ₹15,00,000.<br/>"
        "• Taxpayer Surcharge Bracket: Applicable surcharge of 15% plus 4% Health & Education Cess.<br/>"
        "• Section 112A LTCG Statutory Exemption: ₹1,25,000 applied.",
        STYLES["Body"]
    ))

    # Comparative Arithmetic Table
    calc_rows = [
        [Paragraph("<b>Step / Computational Component</b>", STYLES["TableHeader"]), Paragraph("<b>Scenario A: Unmanaged Execution</b>", STYLES["TableHeader"]), Paragraph("<b>Scenario B: Fiduciary Harvesting Protocol</b>", STYLES["TableHeader"])],
        [Paragraph("Gross Realized Long-Term Gains (LTCG)", STYLES["TableCellBold"]), Paragraph("₹60,00,000", STYLES["TableCell"]), Paragraph("₹60,00,000", STYLES["TableCell"])],
        [Paragraph("Gross Realized Short-Term Gains (STCG)", STYLES["TableCellBold"]), Paragraph("₹15,00,000", STYLES["TableCell"]), Paragraph("₹15,00,000", STYLES["TableCell"])],
        [Paragraph("Loss Harvesting Applied (Realized STCL/LTCL)", STYLES["TableCellBold"]), Paragraph("₹0 (Unrealized paper losses retained)", STYLES["TableCellBold"]), Paragraph("<b>-₹20,00,000</b> (Systematic harvest)", STYLES["TableCellBold"])],
        [Paragraph("Net Taxable STCG (u/s 111A)", STYLES["TableCellBold"]), Paragraph("₹15,00,000", STYLES["TableCell"]), Paragraph("₹0 (Offset against harvested loss)", STYLES["TableCellBold"])],
        [Paragraph("Remaining Loss to Offset LTCG", STYLES["TableCellBold"]), Paragraph("₹0", STYLES["TableCell"]), Paragraph("-₹5,00,000 (Residual loss)", STYLES["TableCellBold"])],
        [Paragraph("Net Taxable LTCG after Loss Set-off", STYLES["TableCellBold"]), Paragraph("₹60,00,000", STYLES["TableCell"]), Paragraph("₹55,00,000", STYLES["TableCellBold"])],
        [Paragraph("Less: Section 112A Basic Exemption", STYLES["TableCellBold"]), Paragraph("-₹1,25,000", STYLES["TableCell"]), Paragraph("-₹1,25,000", STYLES["TableCell"])],
        [Paragraph("Net Chargeable LTCG", STYLES["TableCellBold"]), Paragraph("₹58,75,000", STYLES["TableCell"]), Paragraph("₹53,75,000", STYLES["TableCellBold"])],
        [Paragraph("Base Tax on LTCG @ 12.5%", STYLES["TableCellBold"]), Paragraph("₹7,34,375", STYLES["TableCell"]), Paragraph("₹6,71,875", STYLES["TableCellBold"])],
        [Paragraph("Base Tax on STCG @ 20.0%", STYLES["TableCellBold"]), Paragraph("₹3,00,000", STYLES["TableCell"]), Paragraph("₹0", STYLES["TableCellBold"])],
        [Paragraph("Total Base Tax Liability", STYLES["TableCellBold"]), Paragraph("₹10,34,375", STYLES["TableCell"]), Paragraph("₹6,71,875", STYLES["TableCellBold"])],
        [Paragraph("Effective Surcharge (15%) + Cess (4%)", STYLES["TableCellBold"]), Paragraph("₹2,02,738", STYLES["TableCell"]), Paragraph("₹1,31,688", STYLES["TableCellBold"])],
        [Paragraph("<b>TOTAL FINAL TAX OUTFLOW</b>", STYLES["TableCellBold"]), Paragraph("<b>₹12,37,113</b>", STYLES["TableCellBold"]), Paragraph("<b>₹8,03,563</b>", STYLES["TableCellBold"])],
        [Paragraph("<b>NET TAX HARVESTING ALPHA (SAVINGS)</b>", STYLES["TableCellBold"]), Paragraph("<b>₹0 Baseline</b>", STYLES["TableCellBold"]), Paragraph("<b>₹4,33,550 (35.0% Tax Reduction)</b>", STYLES["TableCellBold"])],
    ]
    t_calc = Table(calc_rows, colWidths=[180, 150, 150], repeatRows=1)
    t_calc.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.3, C_BORDER),
        ('BACKGROUND', (0,0), (-1,0), C_BG_CREAM),
        ('BACKGROUND', (0,-2), (-1,-1), colors.HexColor("#FEF3C7")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_calc)

    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Arithmetic Verification:</b> In Scenario B, harvesting ₹20 Lakhs of underperforming holdings eliminated 100% of the ₹15 Lakhs STCG taxed at 20%, saving ₹3,00,000 base tax immediately. The residual ₹5 Lakhs loss offset LTCG at 12.5%, saving ₹62,500. Accounting for 15% surcharge and 4% cess, total cash preserved equals ₹4,33,550, fully deployable into compounding securities.",
        STYLES["BodyJustify"]
    ))

    story.append(PageBreak())

    # Section 8: Private Family Trust Structuring & Section 9: Fiduciary Takeaways
    story.append(Paragraph("<b>8. INTER-GENERATIONAL WEALTH SHIELDING VIA PRIVATE TRUSTS</b>", STYLES["Heading1"]))
    story.append(Paragraph(
        "For multi-generational Indian family offices, holding equities and family promoter stakes through a <b>Private Determinate Trust</b> creates institutional asset protection against probate delays, civil creditor attachments, and potential re-introduction of inheritance levies. "
        "Under Section 161 of the Income-tax Act, 1961, where trust beneficiaries and their respective shares are expressly identifiable in the Trust Deed, the trustee is assessed in a representative capacity at the same rates applicable to individual beneficiaries, avoiding the Maximum Marginal Rate (MMR) that penalizes indeterminate trusts.",
        STYLES["BodyJustify"]
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>9. FIDUCIARY ACTION CHECKLIST FOR FAMILY OFFICES (FY 2026-27)</b>", STYLES["Heading1"]))
    checklist_items = [
        "<b>March Review Cycle:</b> Conduct a systematic pre-fiscal year-end portfolio audit by March 15 to identify unrealized short-term and long-term capital losses before the annual deadline.",
        "<b>Threshold Utilization:</b> Fully exhaust the ₹1,25,000 annual Section 112A LTCG tax-free threshold across each family member's independent PAN file.",
        "<b>No Indiscriminate Re-Entry:</b> When realizing losses, avoid buying back identical stocks on the same trading day; redeploy across peer market compounders to ensure compliance with GAAR covenants.",
        "<b>Real Estate Proceeds Mapping:</b> If monetizing property, ensure Section 54EC bonds (REC/PFC/NHAI) are subscribed within strictly 6 months of execution.",
        "<b>Audit Trail Preservation:</b> Retain contract notes, demat statements, and historical FMV computations for a minimum of 8 assessment years in compliance with Section 149.",
    ]
    for ci in checklist_items:
        story.append(Paragraph(f"✓ {ci}", STYLES["BulletItem"]))

    story.extend(make_closing_block())

    build_pdf_document(
        output_filename=meta["cleanFileName"],
        title=meta["title"],
        subtitle=meta["subtitle"],
        version=meta["version"],
        effective_date=meta["effectiveDate"],
        flowables=story
    )

# ==============================================================================
# POST-BUILD VALIDATION & MANIFEST GENERATOR
# ==============================================================================
def validate_and_generate_manifest():
    print("\n--- RUNNING POST-BUILD VALIDATION & MANIFEST GENERATOR ---")
    manifest = []
    
    docs_to_check = [
        ("kyc-onboarding", "Alpha-Client-KYC-Fiduciary-Mandate-v2025.2.pdf", "kyc-onboarding.json"),
        ("risk-profile-form", "Alpha-SEBI-RIA-Risk-Profiling-Questionnaire-v2025.1.pdf", "risk-profiling.json"),
        ("fee-agreement", "Alpha-Investment-Advisory-Agreement-Fee-Schedule-v2025.3.pdf", "fee-agreement.json"),
        ("scores-grievance", "Alpha-Investor-Grievance-Redressal-Protocol-v2024.4.pdf", "scores-grievance.json"),
        ("mandatory-disclosure", "Alpha-Annual-Regulatory-Disclosure-INA000017348-v2025.1.pdf", "annual-disclosure.json"),
        ("tax-whitepaper", "Alpha-Family-Office-Tax-Harvesting-Whitepaper-v2025.1.pdf", "tax-whitepaper.json"),
    ]

    for doc_id, filename, cfg_name in docs_to_check:
        pdf_path = os.path.join(OUTPUT_DIR, filename)
        cfg_path = os.path.join(CONFIG_DIR, cfg_name)
        
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)

        if not os.path.exists(pdf_path):
            print(f"FATAL BUILD FAILURE: Expected PDF not found on disk: {pdf_path}", file=sys.stderr)
            sys.exit(1)

        file_size = os.path.getsize(pdf_path)
        if file_size < 5120: # < 5KB
            print(f"FATAL BUILD FAILURE: PDF {filename} is smaller than 5KB ({file_size} bytes)", file=sys.stderr)
            sys.exit(1)

        # Check %PDF- header
        with open(pdf_path, "rb") as f:
            first_bytes = f.read(8)
            if not first_bytes.startswith(b"%PDF-"):
                print(f"FATAL BUILD FAILURE: PDF {filename} does not start with %PDF- (Found: {first_bytes})", file=sys.stderr)
                sys.exit(1)

        # Run pdfinfo
        info_out = subprocess.check_output(["pdfinfo", pdf_path]).decode("utf-8")
        page_match = re.search(r"Pages:\s+(\d+)", info_out)
        if not page_match or int(page_match.group(1)) < 1:
            print(f"FATAL BUILD FAILURE: PDF {filename} has 0 pages", file=sys.stderr)
            sys.exit(1)
        pages = int(page_match.group(1))

        if doc_id == "tax-whitepaper" and pages < 6:
            print(f"FATAL BUILD FAILURE: Tax Whitepaper has {pages} pages; required 6 to 10 pages", file=sys.stderr)
            sys.exit(1)

        # Run pdftotext
        txt_out = subprocess.check_output(["pdftotext", pdf_path, "-"]).decode("utf-8")
        if len(txt_out.strip()) == 0:
            print(f"FATAL BUILD FAILURE: PDF {filename} has no extractable text", file=sys.stderr)
            sys.exit(1)

        if "₹" not in txt_out:
            print(f"FATAL BUILD FAILURE: PDF {filename} missing extractable Rupee (₹) symbol", file=sys.stderr)
            sys.exit(1)

        formatted_size = f"{file_size / 1024:.1f} KB" if file_size < 1048576 else f"{file_size / (1024*1024):.1f} MB"

        manifest_item = {
            "id": doc_id,
            "title": cfg["title"],
            "subtitle": cfg.get("subtitle", ""),
            "category": cfg.get("category", "Statutory Compliance"),
            "version": cfg["version"],
            "effectiveDate": cfg["effectiveDate"],
            "reviewStatus": cfg["reviewStatus"],
            "cleanFileName": filename,
            "filePath": f"/downloads/{filename}",
            "fileSizeBytes": file_size,
            "fileSizeFormatted": formatted_size,
            "pageCount": pages,
            "hasExtractableText": True,
            "hasRupeeSymbol": ("₹" in txt_out),
            "firstBytes": first_bytes.decode("ascii", errors="replace")
        }
        manifest.append(manifest_item)
        print(f"✓ Validated {filename}: {pages} pages, {formatted_size}, starts with {first_bytes[:7].decode('ascii')}, Rupee: {manifest_item['hasRupeeSymbol']}")

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nManifest successfully written to {MANIFEST_PATH}")
    return manifest

if __name__ == "__main__":
    print("=== BUILDING REAL STATUTORY & RESEARCH PDF DOCUMENTS ===")
    generate_kyc_document()
    generate_risk_profiling_document()
    generate_agreement_document()
    generate_grievance_document()
    generate_disclosure_document()
    generate_tax_whitepaper_document()
    validate_and_generate_manifest()
    print("=== ALL 6 REAL PDFS SUCCESSFULLY GENERATED & VALIDATED ===")
