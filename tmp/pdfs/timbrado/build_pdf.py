from pathlib import Path
from io import BytesIO

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


SOURCE = Path(r"C:\Users\lguar\AppData\Local\Temp\browser-use\exports\ACTO - Timbrado Técnico_MODELO BASE-2-edc50768-73fa-428f-a067-35432b53fa0c.pdf")
OUTPUT = Path(r"C:\Users\lguar\projetos\Inema\output\pdf\Pendencias-de-Validacao-INEMA-25-09-2026.pdf")


pdfmetrics.registerFont(TTFont("Arial", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", r"C:\Windows\Fonts\arialbd.ttf"))


BLUE = colors.HexColor("#245A86")
LIGHT_BLUE = colors.HexColor("#EEF3F8")
GRID = colors.HexColor("#D9D9D9")
TEXT = colors.HexColor("#202124")
MUTED = colors.HexColor("#5F6368")
RED = colors.HexColor("#A61B1B")
AMBER = colors.HexColor("#8A5A00")
GREEN = colors.HexColor("#216E39")


def p(text, style):
    return Paragraph(text, style)


def draw_flowable(flowable, canv, x, top_y, width, height):
    w, h = flowable.wrap(width, height)
    flowable.drawOn(canv, x, top_y - h)
    return h


def build_overlay(width, height):
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))

    # Limpa somente o texto de exemplo do modelo, preservando logotipo e rodape.
    c.setFillColor(colors.white)
    c.rect(130, 65, width - 130, 672, fill=1, stroke=0)

    title = ParagraphStyle(
        "title", fontName="Arial-Bold", fontSize=15, leading=17,
        textColor=TEXT, spaceAfter=0,
    )
    subtitle = ParagraphStyle(
        "subtitle", fontName="Arial", fontSize=7.8, leading=9.5,
        textColor=MUTED,
    )
    section = ParagraphStyle(
        "section", fontName="Arial-Bold", fontSize=9.2, leading=11,
        textColor=TEXT,
    )
    body = ParagraphStyle(
        "body", fontName="Arial", fontSize=7.15, leading=8.7,
        textColor=TEXT,
    )
    metric_value = ParagraphStyle(
        "metric_value", fontName="Arial-Bold", fontSize=10.5, leading=11.5,
        alignment=TA_CENTER, textColor=BLUE,
    )
    metric_label = ParagraphStyle(
        "metric_label", fontName="Arial", fontSize=5.9, leading=7,
        alignment=TA_CENTER, textColor=MUTED,
    )
    th = ParagraphStyle(
        "th", fontName="Arial-Bold", fontSize=6.4, leading=7.4,
        alignment=TA_LEFT, textColor=colors.white,
    )
    cell = ParagraphStyle(
        "cell", fontName="Arial", fontSize=6.15, leading=7.2,
        textColor=TEXT,
    )
    cell_bold = ParagraphStyle(
        "cell_bold", fontName="Arial-Bold", fontSize=6.15, leading=7.2,
        textColor=TEXT,
    )
    status_red = ParagraphStyle(
        "status_red", fontName="Arial-Bold", fontSize=6.05, leading=7,
        alignment=TA_CENTER, textColor=RED,
    )
    status_amber = ParagraphStyle(
        "status_amber", fontName="Arial-Bold", fontSize=6.05, leading=7,
        alignment=TA_CENTER, textColor=AMBER,
    )
    status_green = ParagraphStyle(
        "status_green", fontName="Arial-Bold", fontSize=6.05, leading=7,
        alignment=TA_CENTER, textColor=GREEN,
    )
    source_style = ParagraphStyle(
        "source", fontName="Arial", fontSize=5.8, leading=7,
        alignment=TA_RIGHT, textColor=MUTED,
    )

    x = 142
    content_w = width - x - 30
    y = 725

    y -= draw_flowable(p("Pendências de Validação - Retorno do INEMA", title), c, x, y, content_w, 40)
    y -= 3
    y -= draw_flowable(
        p("Situação das validações do projeto SEIA em 25 de setembro de 2026, ordenadas pelo tempo de espera.", subtitle),
        c, x, y, content_w, 24,
    )
    y -= 8

    metrics = [
        ("9 de 11", "itens aguardando o INEMA", BLUE),
        ("6 de 9", "sem qualquer retorno", RED),
        ("43 dias", "maior espera - CERH", RED),
        ("22 dias", "espera média", BLUE),
    ]
    metric_data = []
    for value, label, color in metrics:
        value_style = metric_value.clone(f"mv-{value}")
        value_style.textColor = color
        metric_data.append(p(f"{value}<br/><font size='5.9' color='#5F6368'>{label}</font>", value_style))
    mt = Table([metric_data], colWidths=[content_w / 4] * 4, rowHeights=[31])
    mt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BLUE),
        ("BOX", (0, 0), (-1, -1), 0.45, GRID),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, GRID),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    mt.wrap(content_w, 31)
    mt.drawOn(c, x, y - 31)
    y -= 39

    summary = (
        "<b>6 dos 9 itens pendentes</b> seguem sem manifestação do INEMA, mesmo após cobranças por e-mail e WhatsApp e reuniões desmarcadas pela própria área. "
        "Os outros 3 estão em ciclo ativo de ajuste: CERH, Regulação e Gestão de Unidades de Conservação."
    )
    y -= draw_flowable(p(summary, body), c, x, y, content_w, 40)
    y -= 8
    y -= draw_flowable(p("Pendentes do mais antigo para o mais recente", section), c, x, y, content_w, 20)
    y -= 4

    rows = [
        ("CERH", "Documentação para validação", "Em definição", status_amber, "13/08 - 43 dias. Mais de 10 reuniões sem decisão. Novo retorno em 30/09."),
        ("Gestão de Fauna", "Documentos funcionais com protótipos", "Sem retorno", status_red, "28/08 - 28 dias. E-mail e 2 cobranças via WhatsApp sem resposta. Reunião em 29/09."),
        ("Licenciamento DAE", "Boletos de licenciamento", "Sem retorno", status_red, "30/08 - 26 dias. Três reagendamentos cancelados. Realinhamento em 25/09 sem fechamento."),
        ("Regulação", "Atos e atividades inexigíveis", "Em ajuste", status_amber, "04/09 - 21 dias. Retorno em 22/09 solicitou alterações; documento em ajuste para reenvio."),
        ("Integrações", "Liberação das APIs do SEIA", "Sem retorno", status_red, "04/09 - 21 dias. Cobrança semanal; somente a API do GOV.BR foi liberada."),
        ("ETL", "Regras para migração", "Sem retorno", status_red, "08/09 - 17 dias. DBA da ACTO aguarda regras do INEMA, sem previsão."),
        ("Unidades de Conservação", "Especificações funcionais", "Em ajuste", status_amber, "10/09 - 15 dias. Ajustes solicitados em 22/09; retorno esperado até 28/09."),
        ("Fiscalização", "DOR008 RFA e DOR009 RAE", "Sem retorno", status_red, "10/09 - 15 dias."),
        ("Fiscalização", "DOR010 - Cadastro de comunicado", "Sem retorno", status_red, "15/09 - 10 dias."),
    ]
    data = [[p("Módulo", th), p("Documento", th), p("Situação", th), p("Histórico", th)]]
    for module, document, status, status_style, history in rows:
        data.append([p(module, cell_bold), p(document, cell), p(status, status_style), p(history, cell)])

    table = Table(data, colWidths=[77, 98, 61, content_w - 236], repeatRows=1)
    table_style = [
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("BOX", (0, 0), (-1, -1), 0.45, GRID),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, GRID),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
    ]
    for i in range(2, len(data), 2):
        table_style.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#F7F9FB")))
    table.setStyle(TableStyle(table_style))
    tw, table_h = table.wrap(content_w, y - 130)
    table.drawOn(c, x, y - table_h)
    y -= table_h + 9

    y -= draw_flowable(p("Validados na última semana", section), c, x, y, content_w, 20)
    y -= 4
    validated = [
        [p("Módulo", th), p("Documento", th), p("Resultado", th), p("Datas", th)],
        [p("Licenciamento DQC", cell_bold), p("Documento AAC DQC", cell), p("Validado", status_green), p("Envio em 09/09; validado em 24/09.", cell)],
        [p("Licenciamento LAC", cell_bold), p("LAC posto de combustível", cell), p("Validado", status_green), p("Envio em 04/09; validado em 25/09.", cell)],
    ]
    vt = Table(validated, colWidths=[95, 125, 65, content_w - 285])
    vt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("BACKGROUND", (0, 2), (-1, 2), colors.HexColor("#F7F9FB")),
        ("BOX", (0, 0), (-1, -1), 0.45, GRID),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, GRID),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2),
    ]))
    _, vh = vt.wrap(content_w, 80)
    vt.drawOn(c, x, y - vh)
    y -= vh + 7
    draw_flowable(p("Fonte: planilha Controle de Validações - INEMA", source_style), c, x, y, content_w, 15)

    # Reforca discretamente o grafismo inferior ocultado ao limpar o texto de exemplo.
    c.setStrokeColor(colors.HexColor("#E6E0FF"))
    c.setLineWidth(0.8)
    c.line(130, 65, 163, 120)
    c.line(163, 120, 245, 120)
    c.line(245, 120, 278, 65)

    c.save()
    buf.seek(0)
    return buf


def main():
    reader = PdfReader(str(SOURCE))
    page = reader.pages[0]
    width = float(page.mediabox.width)
    height = float(page.mediabox.height)
    overlay = PdfReader(build_overlay(width, height)).pages[0]
    page.merge_page(overlay)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    writer = PdfWriter()
    writer.add_page(page)
    writer.add_metadata({
        "/Title": "Pendências de Validação - Retorno do INEMA",
        "/Author": "ACTO",
        "/Subject": "Situação das validações do projeto SEIA em 25 de setembro de 2026",
    })
    with OUTPUT.open("wb") as stream:
        writer.write(stream)
    print(OUTPUT)


if __name__ == "__main__":
    main()
