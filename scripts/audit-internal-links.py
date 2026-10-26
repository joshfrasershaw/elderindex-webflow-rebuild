#!/usr/bin/env python3
"""Audit rendered links by placement. Run npm run build first; no network requests."""
import argparse
from collections import Counter, defaultdict, deque
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.links, self.active = [], [], None
        self.metadata = {'title':'','description':'','canonical':'','h1':[], 'h2':[]}
        self.heading = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'meta' and attrs.get('name') == 'description': self.metadata['description'] = attrs.get('content','')
        if tag == 'link' and attrs.get('rel') == 'canonical': self.metadata['canonical'] = attrs.get('href','')
        if tag in ['h1','h2']: self.heading = [tag, []]
        if tag == 'a':
            tags = {t for t,_ in self.stack}
            classes = {c for _,a in self.stack for c in a.get('class','').split()}
            own_classes = attrs.get('class','').split()
            if 'header' in tags: placement = 'header'
            elif 'footer' in tags: placement = 'footer'
            elif 'breadcrumbs' in classes: placement = 'breadcrumb'
            elif 'article-contents' in classes: placement = 'contents'
            elif 'related-links' in classes or 'aside' in tags: placement = 'related'
            elif 'guide-next-step' in classes or 'pill' in own_classes or 'hero-text-cta' in own_classes: placement = 'cta'
            elif classes.intersection({'service-copy-block','guide-block','narrative-grid','split-pitch'}) and tags.intersection({'p','li'}): placement = 'contextual'
            else: placement = 'body'
            self.active = {'href':attrs.get('href',''),'placement':placement,'text':[]}
        if tag not in VOID: self.stack.append((tag,attrs))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag,attrs)
        if tag not in VOID: self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == 'a' and self.active:
            self.active['anchor'] = ' '.join(''.join(self.active.pop('text')).split())
            self.links.append(self.active); self.active = None
        if self.heading and tag == self.heading[0]:
            self.metadata[tag].append(' '.join(''.join(self.heading[1]).split())); self.heading = None
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0] == tag:
                del self.stack[i:]; break

    def handle_data(self, text):
        if self.active: self.active['text'].append(text)
        if self.heading: self.heading[1].append(text)
        if any(t == 'title' for t,_ in self.stack): self.metadata['title'] += text


def audit():
    generated = ROOT/'dist'
    files = sorted(generated.rglob('index.html'))
    if not files: raise SystemExit('No generated pages: run npm run build first.')
    parsed = {}
    for file in files:
        relative = file.parent.relative_to(generated).as_posix()
        route = '/' if relative == '.' else '/'+relative+'/'
        parser = PageParser(); parser.feed(file.read_text()); parsed[route] = parser
    routes = set(parsed)
    links, broken = [], []
    for source,parser in parsed.items():
        origin = urlsplit(parser.metadata['canonical']).netloc
        for link in parser.links:
            resolved = urlsplit(urljoin(parser.metadata['canonical'],link['href']))
            if resolved.scheme not in {'http','https'} or resolved.netloc != origin: continue
            target = resolved.path or '/'
            record = {'source':source, 'target':target, 'anchor':link['anchor'], 'placement':link['placement'], 'fragment':resolved.fragment}
            if target not in routes: broken.append(record)
            else: links.append(record)
    utility_pages = []
    not_found = generated/'404.html'
    if not_found.exists():
        utility = PageParser(); utility.feed(not_found.read_text())
        base = parsed['/'].metadata['canonical']
        home_link = False
        for link in utility.links:
            target = urlsplit(urljoin(base,link['href']))
            if target.netloc != urlsplit(base).netloc: continue
            if target.path == '/': home_link = True
            if target.path not in routes: broken.append({'source':'/404.html','target':target.path,'anchor':link['anchor'],'placement':link['placement'],'fragment':target.fragment})
        utility_pages.append({'path':'/404.html','title':utility.metadata['title'],'h1':utility.metadata['h1'],'has_homepage_return':home_link})
    inbound = {}
    for target in sorted(routes):
        incoming = [x for x in links if x['target'] == target and x['source'] != target]
        by_placement = {kind:sorted({x['source'] for x in incoming if x['placement'] == kind}) for kind in ['contextual','cta','body','related','header','footer','breadcrumb']}
        inbound[target] = {'all_referring_pages':len({x['source'] for x in incoming}), 'main_referring_pages':len({x['source'] for x in incoming if x['placement'] not in {'header','footer','breadcrumb','contents'}}), 'contextual_referring_pages':len(by_placement['contextual']), 'contextual_links':sum(x['placement']=='contextual' for x in incoming), 'sources_by_placement':by_placement}
    graph = defaultdict(set)
    for x in links: graph[x['source']].add(x['target'])
    reachable, queue = set(), deque(['/'])
    while queue:
        source = queue.popleft()
        if source in reachable: continue
        reachable.add(source);queue.extend(graph[source]-reachable)
    repetition = Counter((x['source'],x['target']) for x in links if x['placement']=='contextual')
    return {'page_count':len(routes),'utility_pages':utility_pages,'broken_links':broken,'orphan_pages':[p for p in sorted(routes) if p!='/' and inbound[p]['all_referring_pages']==0],'unreachable_from_home':sorted(routes-reachable),'pages_without_main_inbound':[p for p in sorted(routes) if p!='/' and inbound[p]['main_referring_pages']==0],'inbound':inbound,'repeated_contextual_pairs':[{'source':s,'target':t,'count':n} for (s,t),n in sorted(repetition.items()) if n>1],'metadata':{p:parsed[p].metadata for p in sorted(routes)},'links':links}

def compare(current, baseline):
    fields = ('source','target','anchor','placement','fragment')
    def counts(report):
        return Counter(tuple(link.get(field,'') for field in fields) for link in report['links'])
    def rows(counter):
        return [dict(zip(fields,key),count=count) for key,count in sorted(counter.items())]
    old, new = counts(baseline), counts(current)
    added = rows(new-old)
    return {
        'pages_added':sorted(set(current['metadata'])-set(baseline['metadata'])),
        'pages_removed':sorted(set(baseline['metadata'])-set(current['metadata'])),
        'metadata_changed':[p for p in sorted(set(current['metadata'])&set(baseline['metadata'])) if current['metadata'][p] != baseline['metadata'][p]],
        'links_removed':rows(old-new),
        'links_added':added,
        'contextual_links_added':sum(row['count'] for row in added if row['placement']=='contextual')
    }

if __name__ == '__main__':
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--output',type=Path)
    args.add_argument('--compare',type=Path,help='Compare with an earlier JSON audit; changes are reported for review, not automatically rejected.')
    options = args.parse_args(); result = audit()
    if options.compare: result['comparison'] = compare(result,json.loads(options.compare.read_text()))
    output = json.dumps(result,indent=2,ensure_ascii=False)+'\n'
    if options.output: options.output.write_text(output)
    else: print(output,end='')
    if result['broken_links'] or result['orphan_pages'] or result['unreachable_from_home']: raise SystemExit(1)
