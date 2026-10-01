/**
 * Lightweight, pure TypeScript PDF 1.4 Vector Generator
 * Supports vector paths, fills, strokes, standard Type 1 fonts (Times-Roman, Helvetica, Courier)
 * with WinAnsiEncoding, vector Indian Rupee symbol, and vector QR codes.
 */

export type PdfFont = "Helvetica" | "Helvetica-Bold" | "Times-Roman" | "Times-Bold" | "Courier";
export type RgbColor = [number, number, number];

export const PDF_COLORS = {
  white: [1, 1, 1] as RgbColor,
  cream: [0.961, 0.945, 0.910] as RgbColor, // #F5F1E8
  creamAlt: [0.984, 0.976, 0.961] as RgbColor, // #FBF9F5
  navy: [0.043, 0.071, 0.125] as RgbColor, // #0B1220
  navyMuted: [0.15, 0.20, 0.30] as RgbColor,
  gold: [0.788, 0.663, 0.431] as RgbColor, // #C9A96E
  goldSoft: [0.918, 0.875, 0.780] as RgbColor, // #EADFC7
  border: [0.898, 0.875, 0.827] as RgbColor, // #E5DFD3
  muted: [0.290, 0.333, 0.408] as RgbColor, // #4A5568
  lightGray: [0.65, 0.68, 0.72] as RgbColor,
};

export class PdfEngine {
  readonly pageWidth = 595.28; // A4 pt width
  readonly pageHeight = 841.89; // A4 pt height
  private pages: string[] = [];
  private currentPageContent: string[] = [];

  constructor() {
    this.addPage();
  }

  addPage(): void {
    if (this.currentPageContent.length > 0) {
      this.pages.push(this.currentPageContent.join("\n"));
      this.currentPageContent = [];
    }
  }

  private emit(cmd: string): void {
    this.currentPageContent.push(cmd);
  }

  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: { fill?: RgbColor; stroke?: RgbColor; lineWidth?: number }
  ): void {
    this.emit("q");
    if (options?.lineWidth) {
      this.emit(`${options.lineWidth.toFixed(2)} w`);
    }
    if (options?.fill) {
      const [r, g, b] = options.fill;
      this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    }
    if (options?.stroke) {
      const [r, g, b] = options.stroke;
      this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    }

    this.emit(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`);

    if (options?.fill && options?.stroke) {
      this.emit("B");
    } else if (options?.fill) {
      this.emit("f");
    } else if (options?.stroke) {
      this.emit("S");
    }
    this.emit("Q");
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: { color?: RgbColor; lineWidth?: number; dash?: number[] }
  ): void {
    this.emit("q");
    const [r, g, b] = options?.color || PDF_COLORS.border;
    const lw = options?.lineWidth ?? 1;
    this.emit(`${lw.toFixed(2)} w`);
    this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    if (options?.dash) {
      this.emit(`[${options.dash.join(" ")}] 0 d`);
    }
    this.emit(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
    this.emit("Q");
  }

  polygon(
    points: { x: number; y: number }[],
    options?: { fill?: RgbColor; stroke?: RgbColor; lineWidth?: number; close?: boolean }
  ): void {
    if (points.length < 2) return;
    this.emit("q");
    if (options?.lineWidth) {
      this.emit(`${options.lineWidth.toFixed(2)} w`);
    }
    if (options?.fill) {
      const [r, g, b] = options.fill;
      this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    }
    if (options?.stroke) {
      const [r, g, b] = options.stroke;
      this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    }

    this.emit(`${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} m`);
    for (let i = 1; i < points.length; i++) {
      this.emit(`${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} l`);
    }
    if (options?.close !== false) {
      this.emit("h");
    }

    if (options?.fill && options?.stroke) {
      this.emit("B");
    } else if (options?.fill) {
      this.emit("f");
    } else if (options?.stroke) {
      this.emit("S");
    }
    this.emit("Q");
  }

  circle(
    cx: number,
    cy: number,
    r: number,
    options?: { fill?: RgbColor; stroke?: RgbColor; lineWidth?: number }
  ): void {
    const k = 0.552284749831 * r;
    this.emit("q");
    if (options?.lineWidth) {
      this.emit(`${options.lineWidth.toFixed(2)} w`);
    }
    if (options?.fill) {
      const [cr, cg, cb] = options.fill;
      this.emit(`${cr.toFixed(3)} ${cg.toFixed(3)} ${cb.toFixed(3)} rg`);
    }
    if (options?.stroke) {
      const [cr, cg, cb] = options.stroke;
      this.emit(`${cr.toFixed(3)} ${cg.toFixed(3)} ${cb.toFixed(3)} RG`);
    }
    this.emit(`${(cx + r).toFixed(2)} ${cy.toFixed(2)} m`);
    this.emit(`${(cx + r).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx + k).toFixed(2)} ${(cy + r).toFixed(2)} ${cx.toFixed(2)} ${(cy + r).toFixed(2)} c`);
    this.emit(`${(cx - k).toFixed(2)} ${(cy + r).toFixed(2)} ${(cx - r).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx - r).toFixed(2)} ${cy.toFixed(2)} c`);
    this.emit(`${(cx - r).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx - k).toFixed(2)} ${(cy - r).toFixed(2)} ${cx.toFixed(2)} ${(cy - r).toFixed(2)} c`);
    this.emit(`${(cx + k).toFixed(2)} ${(cy - r).toFixed(2)} ${(cx + r).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx + r).toFixed(2)} ${cy.toFixed(2)} c`);
    if (options?.fill && options?.stroke) {
      this.emit("B");
    } else if (options?.fill) {
      this.emit("f");
    } else if (options?.stroke) {
      this.emit("S");
    }
    this.emit("Q");
  }

  private escapeString(str: string): string {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/·/g, "\\267") // middle dot
      .replace(/—/g, "\\227") // em dash
      .replace(/–/g, "\\226") // en dash
      .replace(/’/g, "\\222") // curly apostrophe
      .replace(/‘/g, "\\221")
      .replace(/”/g, "\\224")
      .replace(/“/g, "\\223");
  }

  private getFontId(font: PdfFont): string {
    switch (font) {
      case "Helvetica":
        return "/F1";
      case "Helvetica-Bold":
        return "/F2";
      case "Times-Roman":
        return "/F3";
      case "Times-Bold":
        return "/F4";
      case "Courier":
        return "/F5";
    }
  }

  approxTextWidth(text: string, font: PdfFont, size: number): number {
    const factor = font.startsWith("Times") ? 0.50 : font.startsWith("Courier") ? 0.60 : 0.54;
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "₹") {
        width += size * 0.70;
      } else {
        width += size * factor;
      }
    }
    return width;
  }

  text(
    str: string,
    x: number,
    y: number,
    options?: { font?: PdfFont; size?: number; color?: RgbColor; align?: "left" | "center" | "right" }
  ): void {
    const font = options?.font || "Helvetica";
    const size = options?.size || 10;
    const color = options?.color || PDF_COLORS.navy;
    const align = options?.align || "left";

    // If string contains Rupee symbol, render inline with vector glyph
    if (str.includes("₹")) {
      const totalW = this.approxTextWidth(str, font, size);
      let posX = x;
      if (align === "center") {
        posX = x - totalW / 2;
      } else if (align === "right") {
        posX = x - totalW;
      }

      const parts = str.split("₹");
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) {
          const rw = this.rupeeSymbol(posX, y, size, color);
          posX += rw;
        }
        const segment = parts[i];
        if (segment.length > 0) {
          this.text(segment, posX, y, { font, size, color, align: "left" });
          posX += this.approxTextWidth(segment, font, size);
        }
      }
      return;
    }

    let posX = x;
    if (align === "center") {
      const w = this.approxTextWidth(str, font, size);
      posX = x - w / 2;
    } else if (align === "right") {
      const w = this.approxTextWidth(str, font, size);
      posX = x - w;
    }

    const escaped = this.escapeString(str);
    const fontId = this.getFontId(font);
    const [r, g, b] = color;

    this.emit("BT");
    this.emit(`${fontId} ${size.toFixed(2)} Tf`);
    this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    this.emit(`${posX.toFixed(2)} ${y.toFixed(2)} Td`);
    this.emit(`(${escaped}) Tj`);
    this.emit("ET");
  }

  /**
   * Helper to render multiline wrapped paragraph text cleanly without clipping
   */
  textWrapped(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    options?: { font?: PdfFont; size?: number; color?: RgbColor }
  ): number {
    const font = options?.font || "Helvetica";
    const size = options?.size || 7;
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (const word of words) {
      const testLine = line.length === 0 ? word : `${line} ${word}`;
      const testWidth = this.approxTextWidth(testLine, font, size);
      if (testWidth > maxWidth && line.length > 0) {
        this.text(line, x, currentY, options);
        line = word;
        currentY -= lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      this.text(line, x, currentY, options);
      currentY -= lineHeight;
    }
    return y - currentY;
  }

  /**
   * Draws vector Indian Rupee symbol glyph at (x, y) with top-aligned proportions
   */
  rupeeSymbol(x: number, y: number, size: number, color: RgbColor = PDF_COLORS.navy): number {
    const w = size * 0.56;
    const h = size * 0.74;
    const [r, g, b] = color;
    const lw = Math.max(0.7, size * 0.08);

    this.emit("q");
    this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    this.emit(`${lw.toFixed(2)} w`);
    this.emit("1 J 1 j"); // Round cap and join

    // 1. Top bar
    const yTop = y + h;
    this.emit(`${x.toFixed(2)} ${yTop.toFixed(2)} m ${(x + w).toFixed(2)} ${yTop.toFixed(2)} l S`);

    // 2. Second bar
    const yMid = y + h * 0.68;
    this.emit(`${x.toFixed(2)} ${yMid.toFixed(2)} m ${(x + w * 0.85).toFixed(2)} ${yMid.toFixed(2)} l S`);

    // 3. Vertical stem & upper curved loop
    const stemX = x + w * 0.22;
    const loopYBottom = y + h * 0.36;
    const loopRight = x + w * 0.90;

    // Stem down to loop bottom
    this.emit(`${stemX.toFixed(2)} ${yTop.toFixed(2)} m ${stemX.toFixed(2)} ${loopYBottom.toFixed(2)} l`);
    // Curve out and back to stem
    this.emit(
      `${loopRight.toFixed(2)} ${(yTop - h * 0.05).toFixed(2)} ` +
      `${loopRight.toFixed(2)} ${(loopYBottom + h * 0.05).toFixed(2)} ` +
      `${stemX.toFixed(2)} ${loopYBottom.toFixed(2)} c S`
    );

    // 4. Downward diagonal leg
    const legStartX = stemX + w * 0.15;
    const legEndX = x + w * 0.88;
    const legEndY = y;
    this.emit(`${legStartX.toFixed(2)} ${loopYBottom.toFixed(2)} m ${legEndX.toFixed(2)} ${legEndY.toFixed(2)} l S`);

    this.emit("Q");

    return w + size * 0.15; // Return width occupied plus kerning gap
  }

  /**
   * Draws amount with vector Rupee symbol followed by formatted numerals
   */
  amountWithRupee(
    amountFormatted: string,
    x: number,
    y: number,
    options?: { font?: PdfFont; size?: number; color?: RgbColor; align?: "left" | "center" | "right" }
  ): void {
    const cleanNum = amountFormatted.startsWith("₹") ? amountFormatted.substring(1) : amountFormatted;
    this.text(`₹${cleanNum}`, x, y, options);
  }

  /**
   * Draws vector QR code from 2D boolean matrix
   */
  qrCode(matrix: boolean[][], x: number, y: number, size: number, color: RgbColor = PDF_COLORS.navy): void {
    const modules = matrix.length;
    const moduleSize = size / modules;
    const [r, g, b] = color;

    this.emit("q");
    this.emit(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (matrix[row][col]) {
          const mx = x + col * moduleSize;
          const my = y + (modules - 1 - row) * moduleSize;
          this.emit(`${mx.toFixed(2)} ${my.toFixed(2)} ${moduleSize.toFixed(2)} ${moduleSize.toFixed(2)} re`);
        }
      }
    }
    this.emit("f");
    this.emit("Q");
  }

  /**
   * Compiles and outputs binary PDF 1.4 Uint8Array
   */
  build(): Uint8Array {
    // Finish active page
    if (this.currentPageContent.length > 0) {
      this.pages.push(this.currentPageContent.join("\n"));
      this.currentPageContent = [];
    }

    const pageCount = this.pages.length;
    const objects: { id: number; data: string }[] = [];
    let nextId = 1;

    // 1: Catalog
    const catalogId = nextId++;
    // 2: Pages
    const pagesId = nextId++;

    // Font IDs
    const fontF1Id = nextId++; // Helvetica
    const fontF2Id = nextId++; // Helvetica-Bold
    const fontF3Id = nextId++; // Times-Roman
    const fontF4Id = nextId++; // Times-Bold
    const fontF5Id = nextId++; // Courier

    const pageIds: number[] = [];
    const contentIds: number[] = [];

    for (let i = 0; i < pageCount; i++) {
      pageIds.push(nextId++);
      contentIds.push(nextId++);
    }

    // Define Font Objects
    const makeFontObj = (id: number, baseFont: string) => ({
      id,
      data: `<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /${baseFont}\n  /Encoding /WinAnsiEncoding\n>>`,
    });

    objects.push(makeFontObj(fontF1Id, "Helvetica"));
    objects.push(makeFontObj(fontF2Id, "Helvetica-Bold"));
    objects.push(makeFontObj(fontF3Id, "Times-Roman"));
    objects.push(makeFontObj(fontF4Id, "Times-Bold"));
    objects.push(makeFontObj(fontF5Id, "Courier"));

    // Define Page and Content Objects
    for (let i = 0; i < pageCount; i++) {
      const pId = pageIds[i];
      const cId = contentIds[i];
      const content = this.pages[i];
      const streamBytes = new TextEncoder().encode(content);

      objects.push({
        id: pId,
        data: `<<\n  /Type /Page\n  /Parent ${pagesId} 0 R\n  /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}]\n  /Resources <<\n    /Font <<\n      /F1 ${fontF1Id} 0 R\n      /F2 ${fontF2Id} 0 R\n      /F3 ${fontF3Id} 0 R\n      /F4 ${fontF4Id} 0 R\n      /F5 ${fontF5Id} 0 R\n    >>\n  >>\n  /Contents ${cId} 0 R\n>>`,
      });

      objects.push({
        id: cId,
        data: `<< /Length ${streamBytes.length} >>\nstream\n${content}\nendstream`,
      });
    }

    // Catalog & Pages
    objects.unshift({
      id: pagesId,
      data: `<<\n  /Type /Pages\n  /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}]\n  /Count ${pageCount}\n>>`,
    });

    objects.unshift({
      id: catalogId,
      data: `<<\n  /Type /Catalog\n  /Pages ${pagesId} 0 R\n>>`,
    });

    // Sort objects by id
    objects.sort((a, b) => a.id - b.id);

    // Build PDF Byte Stream and XREF
    let pdfStr = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const offsets: number[] = [0];

    for (const obj of objects) {
      offsets[obj.id] = new TextEncoder().encode(pdfStr).length;
      pdfStr += `${obj.id} 0 obj\n${obj.data}\nendobj\n`;
    }

    const xrefOffset = new TextEncoder().encode(pdfStr).length;
    pdfStr += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

    for (let i = 1; i <= objects.length; i++) {
      const off = offsets[i] || 0;
      pdfStr += `${off.toString().padStart(10, "0")} 00000 n \n`;
    }

    pdfStr += `trailer\n<<\n  /Size ${objects.length + 1}\n  /Root ${catalogId} 0 R\n>>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    return new TextEncoder().encode(pdfStr);
  }
}
