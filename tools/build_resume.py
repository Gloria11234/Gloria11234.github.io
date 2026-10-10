"""Build the one-page resume PDFs from resume.html using headless Chrome.

    py tools/build_resume.py

Outputs
  assets/Gloria-Darnell-Resume.pdf    public copy, linked from the website (no phone number)
  private/Gloria-Darnell-Resume.pdf   copy with phone number, for sending to employers directly

The private copy is built only when private/phone.txt exists. The private/ folder is
git-ignored, so the phone number never reaches the public repository.
"""
import os
import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "resume.html"
PUBLIC_PDF = ROOT / "assets" / "Gloria-Darnell-Resume.pdf"
PRIVATE_DIR = ROOT / "private"
PRIVATE_PDF = PRIVATE_DIR / "Gloria-Darnell-Resume.pdf"
PHONE_FILE = PRIVATE_DIR / "phone.txt"
MARKER = "<!--PHONE:"

PHONE_ROW = """<span class="row phone">
        <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
        <span>{phone}</span>
      </span>"""

CHROME_CANDIDATES = [
    os.environ.get("CHROME_PATH", ""),
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    shutil.which("google-chrome") or "",
    shutil.which("chromium") or "",
]


def find_chrome():
    for c in CHROME_CANDIDATES:
        if c and pathlib.Path(c).exists():
            return c
    sys.exit("Chrome/Edge not found. Set CHROME_PATH to your browser executable.")


def render(chrome, html_path, pdf_path):
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [chrome, "--headless", "--disable-gpu", "--no-pdf-header-footer",
         "--virtual-time-budget=12000", f"--print-to-pdf={pdf_path}", html_path.as_uri()],
        check=True, capture_output=True,
    )


def verify(pdf_path):
    try:
        import pymupdf
    except ImportError:
        print(f"  built {pdf_path.relative_to(ROOT)} (install pymupdf to verify page count)")
        return
    doc = pymupdf.open(pdf_path)
    links = [l["uri"] for p in doc for l in p.get_links() if l.get("uri")]
    flag = "OK" if doc.page_count == 1 else "WARNING: more than one page"
    print(f"  built {pdf_path.relative_to(ROOT)}: {doc.page_count} page(s), {len(links)} links  [{flag}]")


def main():
    chrome = find_chrome()
    html = SRC.read_text(encoding="utf-8")
    if MARKER not in html:
        sys.exit("resume.html is missing the <!--PHONE: ...--> marker")

    render(chrome, SRC, PUBLIC_PDF)
    verify(PUBLIC_PDF)

    if PHONE_FILE.exists():
        phone = PHONE_FILE.read_text(encoding="utf-8").strip()
        start = html.index(MARKER)
        end = html.index("-->", start) + 3
        tmp = ROOT / "resume-private.html"  # same folder so relative CSS paths resolve
        tmp.write_text(html[:start] + PHONE_ROW.format(phone=phone) + html[end:], encoding="utf-8")
        try:
            render(chrome, tmp, PRIVATE_PDF)
        finally:
            tmp.unlink(missing_ok=True)
        verify(PRIVATE_PDF)
    else:
        print("  skipped private copy (no private/phone.txt)")


if __name__ == "__main__":
    main()
