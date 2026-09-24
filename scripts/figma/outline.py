import json,sys,re
d=json.load(open(sys.argv[1])); out_dir=sys.argv[2]
def hexc(f):
    c=f['color']; a=f.get('opacity',1)*c.get('a',1)
    s='#%02x%02x%02x'%(round(c['r']*255),round(c['g']*255),round(c['b']*255))
    return s if a>=0.99 else f'{s}/{a:.2f}'
def fills(n):
    return ','.join(hexc(f) for f in n.get('fills',[]) if f.get('type')=='SOLID' and f.get('visible',True)) or ('IMG' if any(f.get('type')=='IMAGE' for f in n.get('fills',[])) else '')
def line(n,depth):
    bb=n.get('absoluteBoundingBox') or {}
    w,h=int(bb.get('width',0)),int(bb.get('height',0))
    t=n['type']; pad=' '*depth
    if t=='TEXT':
        st=n.get('style',{})
        txt=n['characters'].replace('\n',' / ')
        return f"{pad}T «{txt[:160]}» {st.get('fontFamily','')} {int(st.get('fontWeight',0))} {st.get('fontSize','')}/{round(st.get('lineHeightPercentFontSize',0))}% ls{round(st.get('letterSpacing',0),2)} {fills(n)} [{w}x{h}]"
    lay=''
    if n.get('layoutMode') and n['layoutMode']!='NONE':
        lay=f" AL:{n['layoutMode'][0]} gap{n.get('itemSpacing',0)} pad{int(n.get('paddingTop',0))},{int(n.get('paddingRight',0))},{int(n.get('paddingBottom',0))},{int(n.get('paddingLeft',0))}"
    r=f" r{n['cornerRadius']}" if n.get('cornerRadius') else ''
    f=fills(n); f=f' bg{f}' if f else ''
    return f"{pad}{t[:4]} {n['name'][:40]} [{w}x{h}]{lay}{r}{f}"
def walk(n,depth,out,maxd):
    if not n.get('visible',True): return
    out.append(line(n,depth))
    if depth<maxd and n['type'] not in ('VECTOR','BOOLEAN_OPERATION','LINE','ELLIPSE','STAR','REGULAR_POLYGON'):
        for c in n.get('children',[]): walk(c,depth+1,out,maxd)
for k,v in d['nodes'].items():
    n=v['document']; out=[]
    walk(n,0,out,9)
    name=re.sub(r'\W+','-',n['name']).strip('-')
    open(f'{out_dir}/{name}.txt','w').write('\n'.join(out))
    print(name, len(out))
