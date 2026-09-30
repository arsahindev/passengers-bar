from pathlib import Path
import json
import sys
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
locale = sys.argv[1] if len(sys.argv) > 1 else 'en'
if locale not in ('en', 'sr'):
 raise SystemExit('Usage: python3 scripts/build-menu.py [en|sr]')
D = json.loads((ROOT / f'src/content/menu/{locale}.json').read_text())
LABELS = {
 'All prices in Serbian dinars (RSD).': 'Sve cene su u dinarima (RSD).',
 'Small plates. Good company.': 'Mali zalogaji. Dobro društvo.',
 'Good mornings.': 'Dobro jutro.',
 'Burgers & wraps.': 'Burgeri i tortilje.',
 'Stay for lunch.': 'Ostanite na ručku.',
 'Pasta, salads & something sweet.': 'Paste, salate i nešto slatko.',
 'A glass of something good.': 'Čaša dobrog raspoloženja.',
 'Breakfast · Prices in RSD. Dual prices are shown as listed in the original menu.': 'Doručak · Cene u RSD. Dvojne cene su prenete iz izvornog menija.',
 'Wine · Prices in RSD. Bottle 0.75 L / glass 0.125 L, unless otherwise indicated.': 'Vina · Cene u RSD. Boca 0,75 L / čaša 0,125 L, osim gde je drugačije navedeno.',
 'Starters': 'Predjela', 'To share & more': 'Za deljenje i još ponešto',
 'Breakfast': 'Doručak', 'Burgers': 'Burgeri', 'Wraps': 'Tortilje',
 'Main courses': 'Glavna jela', 'Pasta': 'Paste', 'Salads': 'Obrok salate',
 'Desserts': 'Nešto slatko', 'Extras': 'Prilozi', 'House wine': 'Vino kuće',
 'White wine': 'Belo vino', 'Rosé': 'Roze', 'Red wine': 'Crveno vino',
 'Sparkling wine': 'Penušavo', 'BREAKFAST OFFER': 'AKCIJA ZA DORUČAK',
 'BURGER OFFER': 'AKCIJA ZA BURGERE',
 'Add coffee and freshly squeezed mixed juice to any breakfast for 250 RSD.': 'Uz bilo koji doručak i doplatu od 250 RSD stižu kafa i ceđeni miks.',
 'Order four burgers and get the fifth free.': 'Naručite četiri burgera, peti mi častimo.',
 'Planning a celebration? Contact passengers.bar@gmail.com or find us at @passengers_bar. Phone: 060 646 4109.': 'Želite da organizujete proslavu kod nas? Pišite na passengers.bar@gmail.com ili nas pronađite na @passengers_bar. Telefon: 060 646 4109.',
}
def t(text):
 return LABELS.get(text, text) if locale == 'sr' else text

fonts=Path('/System/Library/Fonts/Supplemental')
for name,file in [('Body','Arial.ttf'),('Bold','Arial Bold.ttf'),('Display','Georgia.ttf')]:
 pdfmetrics.registerFont(TTFont(name,str(fonts/file)))
W,H=A4
cream=HexColor('#f7f4ee'); burg=HexColor('#53272e'); ink=HexColor('#2f2e28'); muted=HexColor('#666454'); gold=HexColor('#aa7e35')
styles={k:ParagraphStyle(k,fontName=f,fontSize=z,leading=l,textColor=col) for k,f,z,l,col in [('name','Bold',10,13,ink),('body','Body',9,12,muted),('small','Body',8,11,muted)]}
out=ROOT / f'public/menus/passengers-menu-{locale}.pdf'
c=canvas.Canvas(str(out),pagesize=A4)
c.setTitle('Passengers Bar | ' + ('Meni i vinska karta' if locale == 'sr' else 'Food & Wine | English menu'));c.setAuthor('Passengers Bar');c.setSubject('Passengers Bar - ' + locale)
def para(text,x,y,w,style='body'):
 p=Paragraph(escape(t(text)),styles[style]);pw,ph=p.wrap(w,1000);p.drawOn(c,x,y-ph);return y-ph

def page(title,num,sub='All prices in Serbian dinars (RSD).'):
 c.setFillColor(cream);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(burg);c.rect(0,H-12,W,12,fill=1,stroke=0)
 c.setFont('Bold',11);c.drawString(40,H-47,'PASSENGERS');c.setFont('Body',8);c.drawRightString(W-40,H-47,'BAR · DORĆOL')
 title=t(title)
 size=min(31,31*(W-80)/max(1,pdfmetrics.stringWidth(title,'Display',31)))
 c.setFont('Display',size);c.drawString(40,H-96,title)
 para(sub,40,H-114,W-80,'small')
 c.setStrokeColor(gold);c.setLineWidth(.6);c.line(40,H-145,W-40,H-145)
 c.setStrokeColor(HexColor('#d7ccbe'));c.line(40,43,W-40,43)
 c.setFillColor(muted);c.setFont('Body',8);c.drawString(40,29,'SIMINA 5 · ' + ('BEOGRAD' if locale == 'sr' else 'BELGRADE'));c.drawRightString(W-40,29,('MENI NA SRPSKOM' if locale == 'sr' else 'ENGLISH MENU') + f'  /  {num:02}')
 return H-167

def section(name,items,x,y,w=241):
 c.setFont('Bold',10);c.setFillColor(burg);c.drawString(x,y,t(name).upper());y-=17
 for title,price,desc in items:
  # Each price gets its own line: long names never collide with prices.
  y=para(title,x,y,w,'name');
  if desc:y=para(desc,x,y-3,w)
  c.setFont('Bold',9);c.setFillColor(burg);c.drawString(x,y-13,price);y-=27
 assert y>=60,(name,y)
 return y-14

y=page('Small plates. Good company.',1)
section('Starters',D['Starters'][:7],40,y)
yr=section('To share & more',D['Starters'][7:],314,y)
para('BREAKFAST OFFER',314,yr,241,'name');yr=para('Add coffee and freshly squeezed mixed juice to any breakfast for 250 RSD.',314,yr-21,241)
para('BURGER OFFER',314,yr-27,241,'name');yr=para('Order four burgers and get the fifth free.',314,yr-48,241)
para('Planning a celebration? Contact passengers.bar@gmail.com or find us at @passengers_bar. Phone: 060 646 4109.',314,yr-25,241)
c.showPage()
y=page('Good mornings.',2,'Breakfast · Prices in RSD. Dual prices are shown as listed in the original menu.')
section('Breakfast',D['Breakfast'][:8],40,y)
section('Breakfast',D['Breakfast'][8:],314,y)
c.showPage()
y=page('Burgers & wraps.',3)
section('Burgers',D['Burgers'],40,y)
yr=section('Wraps',D['Wraps'],314,y)
para('Order four burgers and get the fifth free.',314,yr,241,'name')
c.showPage()
y=page('Stay for lunch.',4)
section('Main courses',D['Main courses'][:6],40,y)
yr=section('Main courses',D['Main courses'][6:],314,y)
c.showPage()
y=page('Pasta, salads & something sweet.',5)
yl=section('Pasta',D['Pasta'],40,y)
section('Salads',D['Salads'],40,yl)
yr=section('Desserts',D['Desserts'],314,y)
section('Extras',D['Extras'],314,yr)
c.showPage()
y=page('A glass of something good.',6,'Wine · Prices in RSD. Bottle 0.75 L / glass 0.125 L, unless otherwise indicated.')
yl=section('House wine',D['House wine'],40,y)
section('White wine',D['White wine'],40,yl)
yr=section('Rosé',D['Rosé'],314,y)
yr=section('Red wine',D['Red wine'],314,yr)
section('Sparkling wine',D['Sparkling wine'],314,yr)
c.save()
print(out, 'items:',sum(map(len,D.values())))
