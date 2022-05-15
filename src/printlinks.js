/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["w"] }] */
/* global QRCode */
(function iefe(w, d, c, t, a, s) {
    /* inject:js */
    /* endinject */
    w.printlinks = function printlinks(sel) {
        d.querySelectorAll('.tw-linklist,.tw-linkref').forEach((e) => {
            e.remove();
        });
        const links = d.querySelectorAll(sel || 'a[href]:not([href^="javascript:"])');
        if (links.length) {
            const dimension = 36;
            const hrefs = new Map();
            const linklist = d[c]('ol');
            linklist.className = 'tw-linklist';
            links.forEach((l) => {
                const href = String(l.href);
                let sup = hrefs.size + 1;
                if (hrefs.has(href)) {
                    sup = hrefs.get(href);
                } else {
                    hrefs.set(href, sup);
                    const listitem = d[c]('li');
                    const qrcode = d.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    qrcode[s]('width', dimension);
                    qrcode[s]('height', dimension);
                    qrcode[s]('viewBox', `0 0 ${dimension} ${dimension}`);
                    qrcode[s]('aria-hidden', 'true');
                    qrcode[s]('focusable', 'false');
                    qrcode.innerHTML = (new QRCode({
                        content: href,
                        width: dimension,
                        height: dimension,
                        join: true,
                        xmlDeclaration: false,
                        ecl: 'L',
                        container: 'none'
                    })).svg();
                    listitem[a](qrcode);
                    listitem[a](d[t](href));
                    linklist[a](listitem);
                }
                const ref = d[c]('sup');
                ref.className = 'tw-linkref';
                ref[a](d[t](sup));
                l.parentNode.insertBefore(ref, l.nextSibling);
            });
            d.body[a](linklist);
        }
    };
}(window, document, 'createElement', 'createTextNode', 'appendChild', 'setAttribute'));
