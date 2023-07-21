window.Modernizr = function(e, t, r) {
    function n(e) {
        h.cssText = e
    }
    function i(e, t) {
        return typeof e === t
    }
    var o, a, s = "2.7.1", u = {}, c = !0, l = t.documentElement, f = "modernizr", d = t.createElement(f), h = d.style, p = ({}.toString,
    {}), m = [], g = m.slice, y = {}.hasOwnProperty;
    for (var v in a = i(y, "undefined") || i(y.call, "undefined") ? function(e, t) {
        return t in e && i(e.constructor.prototype[t], "undefined")
    }
    : function(e, t) {
        return y.call(e, t)
    }
    ,
    Function.prototype.bind || (Function.prototype.bind = function b(r) {
        var i = this;
        if ("function" != typeof i)
            throw new TypeError;
        var o = g.call(arguments, 1)
          , a = function() {
            if (this instanceof a) {
                var e = function() {};
                e.prototype = i.prototype;
                var t = new e
                  , n = i.apply(t, o.concat(g.call(arguments)));
                return Object(n) === n ? n : t
            }
            return i.apply(r, o.concat(g.call(arguments)))
        };
        return a
    }
    ),
    p)
        a(p, v) && (o = v.toLowerCase(),
        u[o] = p[v](),
        m.push((u[o] ? "" : "no-") + o));
    return u.addTest = function(e, t) {
        if ("object" == typeof e)
            for (var n in e)
                a(e, n) && u.addTest(n, e[n]);
        else {
            if (e = e.toLowerCase(),
            u[e] !== r)
                return u;
            t = "function" == typeof t ? t() : t,
            void 0 !== c && c && (l.className += " " + (t ? "" : "no-") + e),
            u[e] = t
        }
        return u
    }
    ,
    n(""),
    d = null,
    function(e, a) {
        function n(e, t) {
            var n = e.createElement("p")
              , r = e.getElementsByTagName("head")[0] || e.documentElement;
            return n.innerHTML = "x<style>" + t + "</style>",
            r.insertBefore(n.lastChild, r.firstChild)
        }
        function s() {
            var e = v.elements;
            return "string" == typeof e ? e.split(" ") : e
        }
        function u(e) {
            var t = y[e[m]];
            return t || (t = {},
            g++,
            e[m] = g,
            y[g] = t),
            t
        }
        function r(e, t, n) {
            return t || (t = a),
            l ? t.createElement(e) : (n || (n = u(t)),
            !(r = n.cache[e] ? n.cache[e].cloneNode() : p.test(e) ? (n.cache[e] = n.createElem(e)).cloneNode() : n.createElem(e)).canHaveChildren || h.test(e) || r.tagUrn ? r : n.frag.appendChild(r));
            var r
        }
        function t(e, t) {
            if (e || (e = a),
            l)
                return e.createDocumentFragment();
            for (var n = (t = t || u(e)).frag.cloneNode(), r = 0, i = s(), o = i.length; r < o; r++)
                n.createElement(i[r]);
            return n
        }
        function i(t, n) {
            n.cache || (n.cache = {},
            n.createElem = t.createElement,
            n.createFrag = t.createDocumentFragment,
            n.frag = n.createFrag()),
            t.createElement = function(e) {
                return v.shivMethods ? r(e, t, n) : n.createElem(e)
            }
            ,
            t.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + s().join().replace(/[\w\-]+/g, function(e) {
                return n.createElem(e),
                n.frag.createElement(e),
                'c("' + e + '")'
            }) + ");return n}")(v, n.frag)
        }
        function o(e) {
            e || (e = a);
            var t = u(e);
            return !v.shivCSS || c || t.hasCSS || (t.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),
            l || i(e, t),
            e
        }
        var c, l, f = "3.7.0", d = e.html5 || {}, h = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, p = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, m = "_html5shiv", g = 0, y = {};
        !function() {
            try {
                var e = a.createElement("a");
                e.innerHTML = "<xyz></xyz>",
                c = "hidden"in e,
                l = 1 == e.childNodes.length || function() {
                    a.createElement("a");
                    var e = a.createDocumentFragment();
                    return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
                }()
            } catch (t) {
                l = c = !0
            }
        }();
        var v = {
            elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
            version: f,
            shivCSS: !1 !== d.shivCSS,
            supportsUnknownElements: l,
            shivMethods: !1 !== d.shivMethods,
            type: "default",
            shivDocument: o,
            createElement: r,
            createDocumentFragment: t
        };
        e.html5 = v,
        o(a)
    }(this, t),
    u._version = s,
    l.className = l.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (c ? " js " + m.join(" ") : ""),
    u
}(0, this.document),
function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(k, e) {
    "use strict";
    function m(e, t, n) {
        var r, i, o = (n = n || ue).createElement("script");
        if (o.text = e,
        t)
            for (r in De)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o)
    }
    function g(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? pe[me.call(e)] || "object" : typeof e
    }
    function s(e) {
        var t = !!e && "length"in e && e.length
          , n = g(e);
        return !xe(e) && !we(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    function c(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    function t(e, n, r) {
        return xe(n) ? ke.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== r
        }) : n.nodeType ? ke.grep(e, function(e) {
            return e === n !== r
        }) : "string" != typeof n ? ke.grep(e, function(e) {
            return -1 < he.call(n, e) !== r
        }) : ke.filter(n, e, r)
    }
    function n(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    function l(e) {
        var n = {};
        return ke.each(e.match($e) || [], function(e, t) {
            n[t] = !0
        }),
        n
    }
    function f(e) {
        return e
    }
    function d(e) {
        throw e
    }
    function u(e, t, n, r) {
        var i;
        try {
            e && xe(i = e.promise) ? i.call(e).done(t).fail(n) : e && xe(i = e.then) ? i.call(e, t, n) : t.apply(undefined, [e].slice(r))
        } catch (e) {
            n.apply(undefined, [e])
        }
    }
    function r() {
        ue.removeEventListener("DOMContentLoaded", r),
        k.removeEventListener("load", r),
        ke.ready()
    }
    function i(e, t) {
        return t.toUpperCase()
    }
    function h(e) {
        return e.replace(Re, "ms-").replace(Pe, i)
    }
    function o() {
        this.expando = ke.expando + o.uid++
    }
    function a(e) {
        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Be.test(e) ? JSON.parse(e) : e)
    }
    function p(e, t, n) {
        var r;
        if (n === undefined && 1 === e.nodeType)
            if (r = "data-" + t.replace(Ue, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = a(n)
                } catch (i) {}
                We.set(e, t, n)
            } else
                n = undefined;
        return n
    }
    function y(e, t, n, r) {
        var i, o, a = 20, s = r ? function() {
            return r.cur()
        }
        : function() {
            return ke.css(e, t, "")
        }
        , u = s(), c = n && n[3] || (ke.cssNumber[t] ? "" : "px"), l = e.nodeType && (ke.cssNumber[t] || "px" !== c && +u) && Xe.exec(ke.css(e, t));
        if (l && l[3] !== c) {
            for (u /= 2,
            c = c || l[3],
            l = +u || 1; a--; )
                ke.style(e, t, l + c),
                (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0),
                l /= o;
            l *= 2,
            ke.style(e, t, l + c),
            n = n || []
        }
        return n && (l = +l || +u || 0,
        i = n[1] ? l + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = c,
        r.start = l,
        r.end = i)),
        i
    }
    function v(e) {
        var t, n = e.ownerDocument, r = e.nodeName, i = et[r];
        return i || (t = n.body.appendChild(n.createElement(r)),
        i = ke.css(t, "display"),
        t.parentNode.removeChild(t),
        "none" === i && (i = "block"),
        et[r] = i)
    }
    function b(e, t) {
        for (var n, r, i = [], o = 0, a = e.length; o < a; o++)
            (r = e[o]).style && (n = r.style.display,
            t ? ("none" === n && (i[o] = Fe.get(r, "display") || null,
            i[o] || (r.style.display = "")),
            "" === r.style.display && Ke(r) && (i[o] = v(r))) : "none" !== n && (i[o] = "none",
            Fe.set(r, "display", n)));
        for (o = 0; o < a; o++)
            null != i[o] && (e[o].style.display = i[o]);
        return e
    }
    function x(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
        t === undefined || t && c(e, t) ? ke.merge([e], n) : n
    }
    function w(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            Fe.set(e[n], "globalEval", !t || Fe.get(t[n], "globalEval"))
    }
    function D(e, t, n, r, i) {
        for (var o, a, s, u, c, l, f = t.createDocumentFragment(), d = [], h = 0, p = e.length; h < p; h++)
            if ((o = e[h]) || 0 === o)
                if ("object" === g(o))
                    ke.merge(d, o.nodeType ? [o] : o);
                else if (st.test(o)) {
                    for (a = a || f.appendChild(t.createElement("div")),
                    s = (nt.exec(o) || ["", ""])[1].toLowerCase(),
                    u = it[s] || it._default,
                    a.innerHTML = u[1] + ke.htmlPrefilter(o) + u[2],
                    l = u[0]; l--; )
                        a = a.lastChild;
                    ke.merge(d, a.childNodes),
                    (a = f.firstChild).textContent = ""
                } else
                    d.push(t.createTextNode(o));
        for (f.textContent = "",
        h = 0; o = d[h++]; )
            if (r && -1 < ke.inArray(o, r))
                i && i.push(o);
            else if (c = Ve(o),
            a = x(f.appendChild(o), "script"),
            c && w(a),
            n)
                for (l = 0; o = a[l++]; )
                    rt.test(o.type || "") && n.push(o);
        return f
    }
    function T() {
        return !0
    }
    function C() {
        return !1
    }
    function M(e, t) {
        return e === S() == ("focus" === t)
    }
    function S() {
        try {
            return ue.activeElement
        } catch (e) {}
    }
    function E(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n,
            n = undefined),
            t)
                E(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n,
        r = n = undefined) : null == i && ("string" == typeof n ? (i = r,
        r = undefined) : (i = r,
        r = n,
        n = undefined)),
        !1 === i)
            i = C;
        else if (!i)
            return e;
        return 1 === o && (a = i,
        (i = function(e) {
            return ke().off(e),
            a.apply(this, arguments)
        }
        ).guid = a.guid || (a.guid = ke.guid++)),
        e.each(function() {
            ke.event.add(this, t, i, r, n)
        })
    }
    function _(e, i, o) {
        o ? (Fe.set(e, i, !1),
        ke.event.add(e, i, {
            namespace: !1,
            handler: function(e) {
                var t, n, r = Fe.get(this, i);
                if (1 & e.isTrigger && this[i]) {
                    if (r.length)
                        (ke.event.special[i] || {}).delegateType && e.stopPropagation();
                    else if (r = le.call(arguments),
                    Fe.set(this, i, r),
                    t = o(this, i),
                    this[i](),
                    r !== (n = Fe.get(this, i)) || t ? Fe.set(this, i, !1) : n = {},
                    r !== n)
                        return e.stopImmediatePropagation(),
                        e.preventDefault(),
                        n.value
                } else
                    r.length && (Fe.set(this, i, {
                        value: ke.event.trigger(ke.extend(r[0], ke.Event.prototype), r.slice(1), this)
                    }),
                    e.stopImmediatePropagation())
            }
        })) : Fe.get(e, i) === undefined && ke.event.add(e, i, T)
    }
    function N(e, t) {
        return c(e, "table") && c(11 !== t.nodeType ? t : t.firstChild, "tr") && ke(e).children("tbody")[0] || e
    }
    function j(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function A(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function L(e, t) {
        var n, r, i, o, a, s, u, c;
        if (1 === t.nodeType) {
            if (Fe.hasData(e) && (o = Fe.access(e),
            a = Fe.set(t, o),
            c = o.events))
                for (i in delete a.handle,
                a.events = {},
                c)
                    for (n = 0,
                    r = c[i].length; n < r; n++)
                        ke.event.add(t, i, c[i][n]);
            We.hasData(e) && (s = We.access(e),
            u = ke.extend({}, s),
            We.set(t, u))
        }
    }
    function q(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && tt.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
    }
    function $(n, r, i, o) {
        r = fe.apply([], r);
        var e, t, a, s, u, c, l = 0, f = n.length, d = f - 1, h = r[0], p = xe(h);
        if (p || 1 < f && "string" == typeof h && !be.checkClone && ht.test(h))
            return n.each(function(e) {
                var t = n.eq(e);
                p && (r[0] = h.call(this, e, t.html())),
                $(t, r, i, o)
            });
        if (f && (t = (e = D(r, n[0].ownerDocument, !1, n, o)).firstChild,
        1 === e.childNodes.length && (e = t),
        t || o)) {
            for (s = (a = ke.map(x(e, "script"), j)).length; l < f; l++)
                u = e,
                l !== d && (u = ke.clone(u, !0, !0),
                s && ke.merge(a, x(u, "script"))),
                i.call(n[l], u, l);
            if (s)
                for (c = a[a.length - 1].ownerDocument,
                ke.map(a, A),
                l = 0; l < s; l++)
                    u = a[l],
                    rt.test(u.type || "") && !Fe.access(u, "globalEval") && ke.contains(c, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? ke._evalUrl && !u.noModule && ke._evalUrl(u.src, {
                        nonce: u.nonce || u.getAttribute("nonce")
                    }) : m(u.textContent.replace(pt, ""), u, c))
        }
        return n
    }
    function H(e, t, n) {
        for (var r, i = t ? ke.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || ke.cleanData(x(r)),
            r.parentNode && (n && Ve(r) && w(x(r, "script")),
            r.parentNode.removeChild(r));
        return e
    }
    function O(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || gt(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || Ve(e) || (a = ke.style(e, t)),
        !be.pixelBoxStyles() && mt.test(a) && yt.test(t) && (r = s.width,
        i = s.minWidth,
        o = s.maxWidth,
        s.minWidth = s.maxWidth = s.width = a,
        a = n.width,
        s.width = r,
        s.minWidth = i,
        s.maxWidth = o)),
        a !== undefined ? a + "" : a
    }
    function I(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    function R(e) {
        for (var t = e[0].toUpperCase() + e.slice(1), n = vt.length; n--; )
            if ((e = vt[n] + t)in bt)
                return e
    }
    function P(e) {
        var t = ke.cssProps[e] || xt[e];
        return t || (e in bt ? e : xt[e] = R(e) || e)
    }
    function z(e, t, n) {
        var r = Xe.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function F(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0
          , s = 0
          , u = 0;
        if (n === (r ? "border" : "content"))
            return 0;
        for (; a < 4; a += 2)
            "margin" === n && (u += ke.css(e, n + Je[a], !0, i)),
            r ? ("content" === n && (u -= ke.css(e, "padding" + Je[a], !0, i)),
            "margin" !== n && (u -= ke.css(e, "border" + Je[a] + "Width", !0, i))) : (u += ke.css(e, "padding" + Je[a], !0, i),
            "padding" !== n ? u += ke.css(e, "border" + Je[a] + "Width", !0, i) : s += ke.css(e, "border" + Je[a] + "Width", !0, i));
        return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0),
        u
    }
    function W(e, t, n) {
        var r = gt(e)
          , i = (!be.boxSizingReliable() || n) && "border-box" === ke.css(e, "boxSizing", !1, r)
          , o = i
          , a = O(e, t, r)
          , s = "offset" + t[0].toUpperCase() + t.slice(1);
        if (mt.test(a)) {
            if (!n)
                return a;
            a = "auto"
        }
        return (!be.boxSizingReliable() && i || "auto" === a || !parseFloat(a) && "inline" === ke.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === ke.css(e, "boxSizing", !1, r),
        (o = s in e) && (a = e[s])),
        (a = parseFloat(a) || 0) + F(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
    }
    function B(e, t, n, r, i) {
        return new B.prototype.init(e,t,n,r,i)
    }
    function U() {
        Mt && (!1 === ue.hidden && k.requestAnimationFrame ? k.requestAnimationFrame(U) : k.setTimeout(U, ke.fx.interval),
        ke.fx.tick())
    }
    function Y() {
        return k.setTimeout(function() {
            Ct = undefined
        }),
        Ct = Date.now()
    }
    function X(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = Je[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function J(e, t, n) {
        for (var r, i = (Z.tweeners[t] || []).concat(Z.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function G(e, t, n) {
        var r, i, o, a, s, u, c, l, f = "width"in t || "height"in t, d = this, h = {}, p = e.style, m = e.nodeType && Ke(e), g = Fe.get(e, "fxshow");
        for (r in n.queue || (null == (a = ke._queueHooks(e, "fx")).unqueued && (a.unqueued = 0,
        s = a.empty.fire,
        a.empty.fire = function() {
            a.unqueued || s()
        }
        ),
        a.unqueued++,
        d.always(function() {
            d.always(function() {
                a.unqueued--,
                ke.queue(e, "fx").length || a.empty.fire()
            })
        })),
        t)
            if (i = t[r],
            _t.test(i)) {
                if (delete t[r],
                o = o || "toggle" === i,
                i === (m ? "hide" : "show")) {
                    if ("show" !== i || !g || g[r] === undefined)
                        continue;
                    m = !0
                }
                h[r] = g && g[r] || ke.style(e, r)
            }
        if ((u = !ke.isEmptyObject(t)) || !ke.isEmptyObject(h))
            for (r in f && 1 === e.nodeType && (n.overflow = [p.overflow, p.overflowX, p.overflowY],
            null == (c = g && g.display) && (c = Fe.get(e, "display")),
            "none" === (l = ke.css(e, "display")) && (c ? l = c : (b([e], !0),
            c = e.style.display || c,
            l = ke.css(e, "display"),
            b([e]))),
            ("inline" === l || "inline-block" === l && null != c) && "none" === ke.css(e, "float") && (u || (d.done(function() {
                p.display = c
            }),
            null == c && (l = p.display,
            c = "none" === l ? "" : l)),
            p.display = "inline-block")),
            n.overflow && (p.overflow = "hidden",
            d.always(function() {
                p.overflow = n.overflow[0],
                p.overflowX = n.overflow[1],
                p.overflowY = n.overflow[2]
            })),
            u = !1,
            h)
                u || (g ? "hidden"in g && (m = g.hidden) : g = Fe.access(e, "fxshow", {
                    display: c
                }),
                o && (g.hidden = !m),
                m && b([e], !0),
                d.done(function() {
                    for (r in m || b([e]),
                    Fe.remove(e, "fxshow"),
                    h)
                        ke.style(e, r, h[r])
                })),
                u = J(m ? g[r] : 0, r, d),
                r in g || (g[r] = u.start,
                m && (u.end = u.start,
                u.start = 0))
    }
    function V(e, t) {
        var n, r, i, o, a;
        for (n in e)
            if (i = t[r = h(n)],
            o = e[n],
            Array.isArray(o) && (i = o[1],
            o = e[n] = o[0]),
            n !== r && (e[r] = o,
            delete e[n]),
            (a = ke.cssHooks[r]) && "expand"in a)
                for (n in o = a.expand(o),
                delete e[r],
                o)
                    n in e || (e[n] = o[n],
                    t[n] = i);
            else
                t[r] = i
    }
    function Z(o, e, t) {
        var n, a, r = 0, i = Z.prefilters.length, s = ke.Deferred().always(function() {
            delete u.elem
        }), u = function() {
            if (a)
                return !1;
            for (var e = Ct || Y(), t = Math.max(0, c.startTime + c.duration - e), n = 1 - (t / c.duration || 0), r = 0, i = c.tweens.length; r < i; r++)
                c.tweens[r].run(n);
            return s.notifyWith(o, [c, n, t]),
            n < 1 && i ? t : (i || s.notifyWith(o, [c, 1, 0]),
            s.resolveWith(o, [c]),
            !1)
        }, c = s.promise({
            elem: o,
            props: ke.extend({}, e),
            opts: ke.extend(!0, {
                specialEasing: {},
                easing: ke.easing._default
            }, t),
            originalProperties: e,
            originalOptions: t,
            startTime: Ct || Y(),
            duration: t.duration,
            tweens: [],
            createTween: function(e, t) {
                var n = ke.Tween(o, c.opts, e, t, c.opts.specialEasing[e] || c.opts.easing);
                return c.tweens.push(n),
                n
            },
            stop: function(e) {
                var t = 0
                  , n = e ? c.tweens.length : 0;
                if (a)
                    return this;
                for (a = !0; t < n; t++)
                    c.tweens[t].run(1);
                return e ? (s.notifyWith(o, [c, 1, 0]),
                s.resolveWith(o, [c, e])) : s.rejectWith(o, [c, e]),
                this
            }
        }), l = c.props;
        for (V(l, c.opts.specialEasing); r < i; r++)
            if (n = Z.prefilters[r].call(c, o, l, c.opts))
                return xe(n.stop) && (ke._queueHooks(c.elem, c.opts.queue).stop = n.stop.bind(n)),
                n;
        return ke.map(l, J, c),
        xe(c.opts.start) && c.opts.start.call(o, c),
        c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always),
        ke.fx.timer(ke.extend(u, {
            elem: o,
            anim: c,
            queue: c.opts.queue
        })),
        c
    }
    function K(e) {
        return (e.match($e) || []).join(" ")
    }
    function Q(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function ee(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match($e) || []
    }
    function te(n, e, r, i) {
        var t;
        if (Array.isArray(e))
            ke.each(e, function(e, t) {
                r || zt.test(n) ? i(n, t) : te(n + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, r, i)
            });
        else if (r || "object" !== g(e))
            i(n, e);
        else
            for (t in e)
                te(n + "[" + t + "]", e[t], r, i)
    }
    function ne(o) {
        return function(e, t) {
            "string" != typeof e && (t = e,
            e = "*");
            var n, r = 0, i = e.toLowerCase().match($e) || [];
            if (xe(t))
                for (; n = i[r++]; )
                    "+" === n[0] ? (n = n.slice(1) || "*",
                    (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }
    function re(t, i, o, a) {
        function s(e) {
            var r;
            return u[e] = !0,
            ke.each(t[e] || [], function(e, t) {
                var n = t(i, o, a);
                return "string" != typeof n || c || u[n] ? c ? !(r = n) : void 0 : (i.dataTypes.unshift(n),
                s(n),
                !1)
            }),
            r
        }
        var u = {}
          , c = t === Qt;
        return s(i.dataTypes[0]) || !u["*"] && s("*")
    }
    function ie(e, t) {
        var n, r, i = ke.ajaxSettings.flatOptions || {};
        for (n in t)
            t[n] !== undefined && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && ke.extend(!0, e, r),
        e
    }
    function oe(e, t, n) {
        for (var r, i, o, a, s = e.contents, u = e.dataTypes; "*" === u[0]; )
            u.shift(),
            r === undefined && (r = e.mimeType || t.getResponseHeader("Content-Type"));
        if (r)
            for (i in s)
                if (s[i] && s[i].test(r)) {
                    u.unshift(i);
                    break
                }
        if (u[0]in n)
            o = u[0];
        else {
            for (i in n) {
                if (!u[0] || e.converters[i + " " + u[0]]) {
                    o = i;
                    break
                }
                a || (a = i)
            }
            o = o || a
        }
        if (o)
            return o !== u[0] && u.unshift(o),
            n[o]
    }
    function ae(e, t, n, r) {
        var i, o, a, s, u, c = {}, l = e.dataTypes.slice();
        if (l[1])
            for (a in e.converters)
                c[a.toLowerCase()] = e.converters[a];
        for (o = l.shift(); o; )
            if (e.responseFields[o] && (n[e.responseFields[o]] = t),
            !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
            u = o,
            o = l.shift())
                if ("*" === o)
                    o = u;
                else if ("*" !== u && u !== o) {
                    if (!(a = c[u + " " + o] || c["* " + o]))
                        for (i in c)
                            if ((s = i.split(" "))[1] === o && (a = c[u + " " + s[0]] || c["* " + s[0]])) {
                                !0 === a ? a = c[i] : !0 !== c[i] && (o = s[0],
                                l.unshift(s[1]));
                                break
                            }
                    if (!0 !== a)
                        if (a && e["throws"])
                            t = a(t);
                        else
                            try {
                                t = a(t)
                            } catch (f) {
                                return {
                                    state: "parsererror",
                                    error: a ? f : "No conversion from " + u + " to " + o
                                }
                            }
                }
        return {
            state: "success",
            data: t
        }
    }
    var se = []
      , ue = k.document
      , ce = Object.getPrototypeOf
      , le = se.slice
      , fe = se.concat
      , de = se.push
      , he = se.indexOf
      , pe = {}
      , me = pe.toString
      , ge = pe.hasOwnProperty
      , ye = ge.toString
      , ve = ye.call(Object)
      , be = {}
      , xe = function xe(e) {
        return "function" == typeof e && "number" != typeof e.nodeType
    }
      , we = function we(e) {
        return null != e && e === e.window
    }
      , De = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    }
      , Te = "3.4.1"
      , ke = function(e, t) {
        return new ke.fn.init(e,t)
    }
      , Ce = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    ke.fn = ke.prototype = {
        jquery: Te,
        constructor: ke,
        length: 0,
        toArray: function() {
            return le.call(this)
        },
        get: function(e) {
            return null == e ? le.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = ke.merge(this.constructor(), e);
            return t.prevObject = this,
            t
        },
        each: function(e) {
            return ke.each(this, e)
        },
        map: function(n) {
            return this.pushStack(ke.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(le.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: de,
        sort: se.sort,
        splice: se.splice
    },
    ke.extend = ke.fn.extend = function(e) {
        var t, n, r, i, o, a, s = e || {}, u = 1, c = arguments.length, l = !1;
        for ("boolean" == typeof s && (l = s,
        s = arguments[u] || {},
        u++),
        "object" == typeof s || xe(s) || (s = {}),
        u === c && (s = this,
        u--); u < c; u++)
            if (null != (t = arguments[u]))
                for (n in t)
                    i = t[n],
                    "__proto__" !== n && s !== i && (l && i && (ke.isPlainObject(i) || (o = Array.isArray(i))) ? (r = s[n],
                    a = o && !Array.isArray(r) ? [] : o || ke.isPlainObject(r) ? r : {},
                    o = !1,
                    s[n] = ke.extend(l, a, i)) : i !== undefined && (s[n] = i));
        return s
    }
    ,
    ke.extend({
        expando: "jQuery" + (Te + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== me.call(e)) && (!(t = ce(e)) || "function" == typeof (n = ge.call(t, "constructor") && t.constructor) && ye.call(n) === ve)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t) {
            m(e, {
                nonce: t && t.nonce
            })
        },
        each: function(e, t) {
            var n, r = 0;
            if (s(e))
                for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++)
                    ;
            else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(Ce, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (s(Object(e)) ? ke.merge(n, "string" == typeof e ? [e] : e) : de.call(n, e)),
            n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : he.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                !t(e[i], i) !== a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, i, o = 0, a = [];
            if (s(e))
                for (r = e.length; o < r; o++)
                    null != (i = t(e[o], o, n)) && a.push(i);
            else
                for (o in e)
                    null != (i = t(e[o], o, n)) && a.push(i);
            return fe.apply([], a)
        },
        guid: 1,
        support: be
    }),
    "function" == typeof Symbol && (ke.fn[Symbol.iterator] = se[Symbol.iterator]),
    ke.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        pe["[object " + t + "]"] = t.toLowerCase()
    });
    var Me = function(n) {
        function x(e, t, n, r) {
            var i, o, a, s, u, c, l, f = t && t.ownerDocument, d = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== d && 9 !== d && 11 !== d)
                return n;
            if (!r && ((t ? t.ownerDocument || t : z) !== L && A(t),
            t = t || L,
            $)) {
                if (11 !== d && (u = be.exec(e)))
                    if (i = u[1]) {
                        if (9 === d) {
                            if (!(a = t.getElementById(i)))
                                return n;
                            if (a.id === i)
                                return n.push(a),
                                n
                        } else if (f && (a = f.getElementById(i)) && R(t, a) && a.id === i)
                            return n.push(a),
                            n
                    } else {
                        if (u[2])
                            return Q.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((i = u[3]) && D.getElementsByClassName && t.getElementsByClassName)
                            return Q.apply(n, t.getElementsByClassName(i)),
                            n
                    }
                if (D.qsa && !X[e + " "] && (!H || !H.test(e)) && (1 !== d || "object" !== t.nodeName.toLowerCase())) {
                    if (l = e,
                    f = t,
                    1 === d && fe.test(e)) {
                        for ((s = t.getAttribute("id")) ? s = s.replace(Te, ke) : t.setAttribute("id", s = P),
                        o = (c = M(e)).length; o--; )
                            c[o] = "#" + s + " " + m(c[o]);
                        l = c.join(","),
                        f = xe.test(e) && p(t.parentNode) || t
                    }
                    try {
                        return Q.apply(n, f.querySelectorAll(l)),
                        n
                    } catch (h) {
                        X(e, !0)
                    } finally {
                        s === P && t.removeAttribute("id")
                    }
                }
            }
            return E(e.replace(ue, "$1"), t, n, r)
        }
        function e() {
            function n(e, t) {
                return r.push(e + " ") > T.cacheLength && delete n[r.shift()],
                n[e + " "] = t
            }
            var r = [];
            return n
        }
        function u(e) {
            return e[P] = !0,
            e
        }
        function i(e) {
            var t = L.createElement("fieldset");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function t(e, t) {
            for (var n = e.split("|"), r = n.length; r--; )
                T.attrHandle[n[r]] = t
        }
        function c(e, t) {
            var n = t && e
              , r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r)
                return r;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function r(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }
        function o(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }
        function a(t) {
            return function(e) {
                return "form"in e ? e.parentNode && !1 === e.disabled ? "label"in e ? "label"in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && Me(e) === t : e.disabled === t : "label"in e && e.disabled === t
            }
        }
        function s(a) {
            return u(function(o) {
                return o = +o,
                u(function(e, t) {
                    for (var n, r = a([], e.length, o), i = r.length; i--; )
                        e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }
        function p(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        function l() {}
        function m(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function f(s, e, t) {
            var u = e.dir
              , c = e.next
              , l = c || u
              , f = t && "parentNode" === l
              , d = W++;
            return e.first ? function(e, t, n) {
                for (; e = e[u]; )
                    if (1 === e.nodeType || f)
                        return s(e, t, n);
                return !1
            }
            : function(e, t, n) {
                var r, i, o, a = [F, d];
                if (n) {
                    for (; e = e[u]; )
                        if ((1 === e.nodeType || f) && s(e, t, n))
                            return !0
                } else
                    for (; e = e[u]; )
                        if (1 === e.nodeType || f)
                            if (i = (o = e[P] || (e[P] = {}))[e.uniqueID] || (o[e.uniqueID] = {}),
                            c && c === e.nodeName.toLowerCase())
                                e = e[u] || e;
                            else {
                                if ((r = i[l]) && r[0] === F && r[1] === d)
                                    return a[2] = r[2];
                                if ((i[l] = a)[2] = s(e, t, n))
                                    return !0
                            }
                return !1
            }
        }
        function d(i) {
            return 1 < i.length ? function(e, t, n) {
                for (var r = i.length; r--; )
                    if (!i[r](e, t, n))
                        return !1;
                return !0
            }
            : i[0]
        }
        function v(e, t, n) {
            for (var r = 0, i = t.length; r < i; r++)
                x(e, t[r], n);
            return n
        }
        function w(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, c = null != t; s < u; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o),
                c && t.push(s)));
            return a
        }
        function b(h, p, m, g, y, e) {
            return g && !g[P] && (g = b(g)),
            y && !y[P] && (y = b(y, e)),
            u(function(e, t, n, r) {
                var i, o, a, s = [], u = [], c = t.length, l = e || v(p || "*", n.nodeType ? [n] : n, []), f = !h || !e && p ? l : w(l, s, h, n, r), d = m ? y || (e ? h : c || g) ? [] : t : f;
                if (m && m(f, d, n, r),
                g)
                    for (i = w(d, u),
                    g(i, [], n, r),
                    o = i.length; o--; )
                        (a = i[o]) && (d[u[o]] = !(f[u[o]] = a));
                if (e) {
                    if (y || h) {
                        if (y) {
                            for (i = [],
                            o = d.length; o--; )
                                (a = d[o]) && i.push(f[o] = a);
                            y(null, d = [], i, r)
                        }
                        for (o = d.length; o--; )
                            (a = d[o]) && -1 < (i = y ? te(e, a) : s[o]) && (e[i] = !(t[i] = a))
                    }
                } else
                    d = w(d === t ? d.splice(c, d.length) : d),
                    y ? y(null, t, d, r) : Q.apply(t, d)
            })
        }
        function h(e) {
            for (var i, t, n, r = e.length, o = T.relative[e[0].type], a = o || T.relative[" "], s = o ? 1 : 0, u = f(function(e) {
                return e === i
            }, a, !0), c = f(function(e) {
                return -1 < te(i, e)
            }, a, !0), l = [function(e, t, n) {
                var r = !o && (n || t !== _) || ((i = t).nodeType ? u(e, t, n) : c(e, t, n));
                return i = null,
                r
            }
            ]; s < r; s++)
                if (t = T.relative[e[s].type])
                    l = [f(d(l), t)];
                else {
                    if ((t = T.filter[e[s].type].apply(null, e[s].matches))[P]) {
                        for (n = ++s; n < r && !T.relative[e[n].type]; n++)
                            ;
                        return b(1 < s && d(l), 1 < s && m(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(ue, "$1"), t, s < n && h(e.slice(s, n)), n < r && h(e = e.slice(n)), n < r && m(e))
                    }
                    l.push(t)
                }
            return d(l)
        }
        function g(g, y) {
            var v = 0 < y.length
              , b = 0 < g.length
              , e = function(e, t, n, r, i) {
                var o, a, s, u = 0, c = "0", l = e && [], f = [], d = _, h = e || b && T.find.TAG("*", i), p = F += null == d ? 1 : Math.random() || .1, m = h.length;
                for (i && (_ = t === L || t || i); c !== m && null != (o = h[c]); c++) {
                    if (b && o) {
                        for (a = 0,
                        t || o.ownerDocument === L || (A(o),
                        n = !$); s = g[a++]; )
                            if (s(o, t || L, n)) {
                                r.push(o);
                                break
                            }
                        i && (F = p)
                    }
                    v && ((o = !s && o) && u--,
                    e && l.push(o))
                }
                if (u += c,
                v && c !== u) {
                    for (a = 0; s = y[a++]; )
                        s(l, f, t, n);
                    if (e) {
                        if (0 < u)
                            for (; c--; )
                                l[c] || f[c] || (f[c] = Z.call(r));
                        f = w(f)
                    }
                    Q.apply(r, f),
                    i && !e && 0 < f.length && 1 < u + y.length && x.uniqueSort(r)
                }
                return i && (F = p,
                _ = d),
                l
            };
            return v ? u(e) : e
        }
        var y, D, T, k, C, M, S, E, _, N, j, A, L, q, $, H, O, I, R, P = "sizzle" + 1 * new Date, z = n.document, F = 0, W = 0, B = e(), U = e(), Y = e(), X = e(), J = function(e, t) {
            return e === t && (j = !0),
            0
        }, G = {}.hasOwnProperty, V = [], Z = V.pop, K = V.push, Q = V.push, ee = V.slice, te = function(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, ne = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", re = "[\\x20\\t\\r\\n\\f]", ie = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+", oe = "\\[" + re + "*(" + ie + ")(?:" + re + "*([*^$|!~]?=)" + re + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ie + "))|)" + re + "*\\]", ae = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)", se = new RegExp(re + "+","g"), ue = new RegExp("^" + re + "+|((?:^|[^\\\\])(?:\\\\.)*)" + re + "+$","g"), ce = new RegExp("^" + re + "*," + re + "*"), le = new RegExp("^" + re + "*([>+~]|" + re + ")" + re + "*"), fe = new RegExp(re + "|>"), de = new RegExp(ae), he = new RegExp("^" + ie + "$"), pe = {
            ID: new RegExp("^#(" + ie + ")"),
            CLASS: new RegExp("^\\.(" + ie + ")"),
            TAG: new RegExp("^(" + ie + "|[*])"),
            ATTR: new RegExp("^" + oe),
            PSEUDO: new RegExp("^" + ae),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + re + "*(even|odd|(([+-]|)(\\d*)n|)" + re + "*(?:([+-]|)" + re + "*(\\d+)|))" + re + "*\\)|)","i"),
            bool: new RegExp("^(?:" + ne + ")$","i"),
            needsContext: new RegExp("^" + re + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + re + "*((?:-\\d)?\\d*)" + re + "*\\)|)(?=[^-]|$)","i")
        }, me = /HTML$/i, ge = /^(?:input|select|textarea|button)$/i, ye = /^h\d$/i, ve = /^[^{]+\{\s*\[native \w/, be = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, xe = /[+~]/, we = new RegExp("\\\\([\\da-f]{1,6}" + re + "?|(" + re + ")|.)","ig"), De = function(e, t, n) {
            var r = "0x" + t - 65536;
            return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
        }, Te = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ke = function(e, t) {
            return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }, Ce = function() {
            A()
        }, Me = f(function(e) {
            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            Q.apply(V = ee.call(z.childNodes), z.childNodes),
            V[z.childNodes.length].nodeType
        } catch (Se) {
            Q = {
                apply: V.length ? function(e, t) {
                    K.apply(e, ee.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        for (y in D = x.support = {},
        C = x.isXML = function(e) {
            var t = e.namespaceURI
              , n = (e.ownerDocument || e).documentElement;
            return !me.test(t || n && n.nodeName || "HTML")
        }
        ,
        A = x.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : z;
            return r !== L && 9 === r.nodeType && r.documentElement && (q = (L = r).documentElement,
            $ = !C(L),
            z !== L && (n = L.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Ce, !1) : n.attachEvent && n.attachEvent("onunload", Ce)),
            D.attributes = i(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            D.getElementsByTagName = i(function(e) {
                return e.appendChild(L.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            D.getElementsByClassName = ve.test(L.getElementsByClassName),
            D.getById = i(function(e) {
                return q.appendChild(e).id = P,
                !L.getElementsByName || !L.getElementsByName(P).length
            }),
            D.getById ? (T.filter.ID = function(e) {
                var t = e.replace(we, De);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            T.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && $) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }
            ) : (T.filter.ID = function(e) {
                var n = e.replace(we, De);
                return function(e) {
                    var t = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return t && t.value === n
                }
            }
            ,
            T.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && $) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                        for (i = t.getElementsByName(e),
                        r = 0; o = i[r++]; )
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                                return [o]
                    }
                    return []
                }
            }
            ),
            T.find.TAG = D.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : D.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" !== e)
                    return o;
                for (; n = o[i++]; )
                    1 === n.nodeType && r.push(n);
                return r
            }
            ,
            T.find.CLASS = D.getElementsByClassName && function(e, t) {
                if ("undefined" != typeof t.getElementsByClassName && $)
                    return t.getElementsByClassName(e)
            }
            ,
            O = [],
            H = [],
            (D.qsa = ve.test(L.querySelectorAll)) && (i(function(e) {
                q.appendChild(e).innerHTML = "<a id='" + P + "'></a><select id='" + P + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && H.push("[*^$]=" + re + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || H.push("\\[" + re + "*(?:value|" + ne + ")"),
                e.querySelectorAll("[id~=" + P + "-]").length || H.push("~="),
                e.querySelectorAll(":checked").length || H.push(":checked"),
                e.querySelectorAll("a#" + P + "+*").length || H.push(".#.+[+~]")
            }),
            i(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = L.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && H.push("name" + re + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && H.push(":enabled", ":disabled"),
                q.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && H.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                H.push(",.*:")
            })),
            (D.matchesSelector = ve.test(I = q.matches || q.webkitMatchesSelector || q.mozMatchesSelector || q.oMatchesSelector || q.msMatchesSelector)) && i(function(e) {
                D.disconnectedMatch = I.call(e, "*"),
                I.call(e, "[s!='']:x"),
                O.push("!=", ae)
            }),
            H = H.length && new RegExp(H.join("|")),
            O = O.length && new RegExp(O.join("|")),
            t = ve.test(q.compareDocumentPosition),
            R = t || ve.test(q.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            J = t ? function(e, t) {
                if (e === t)
                    return j = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !D.sortDetached && t.compareDocumentPosition(e) === n ? e === L || e.ownerDocument === z && R(z, e) ? -1 : t === L || t.ownerDocument === z && R(z, t) ? 1 : N ? te(N, e) - te(N, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return j = !0,
                    0;
                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
                if (!i || !o)
                    return e === L ? -1 : t === L ? 1 : i ? -1 : o ? 1 : N ? te(N, e) - te(N, t) : 0;
                if (i === o)
                    return c(e, t);
                for (n = e; n = n.parentNode; )
                    a.unshift(n);
                for (n = t; n = n.parentNode; )
                    s.unshift(n);
                for (; a[r] === s[r]; )
                    r++;
                return r ? c(a[r], s[r]) : a[r] === z ? -1 : s[r] === z ? 1 : 0
            }
            ),
            L
        }
        ,
        x.matches = function(e, t) {
            return x(e, null, null, t)
        }
        ,
        x.matchesSelector = function(e, t) {
            if ((e.ownerDocument || e) !== L && A(e),
            D.matchesSelector && $ && !X[t + " "] && (!O || !O.test(t)) && (!H || !H.test(t)))
                try {
                    var n = I.call(e, t);
                    if (n || D.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (Se) {
                    X(t, !0)
                }
            return 0 < x(t, L, null, [e]).length
        }
        ,
        x.contains = function(e, t) {
            return (e.ownerDocument || e) !== L && A(e),
            R(e, t)
        }
        ,
        x.attr = function(e, t) {
            (e.ownerDocument || e) !== L && A(e);
            var n = T.attrHandle[t.toLowerCase()]
              , r = n && G.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !$) : undefined;
            return r !== undefined ? r : D.attributes || !$ ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }
        ,
        x.escape = function(e) {
            return (e + "").replace(Te, ke)
        }
        ,
        x.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        x.uniqueSort = function(e) {
            var t, n = [], r = 0, i = 0;
            if (j = !D.detectDuplicates,
            N = !D.sortStable && e.slice(0),
            e.sort(J),
            j) {
                for (; t = e[i++]; )
                    t === e[i] && (r = n.push(i));
                for (; r--; )
                    e.splice(n[r], 1)
            }
            return N = null,
            e
        }
        ,
        k = x.getText = function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += k(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                for (; t = e[r++]; )
                    n += k(t);
            return n
        }
        ,
        (T = x.selectors = {
            cacheLength: 50,
            createPseudo: u,
            match: pe,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(we, De),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(we, De),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || x.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && x.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return pe.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && de.test(n) && (t = M(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(we, De).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = B[e + " "];
                    return t || (t = new RegExp("(^|" + re + ")" + e + "(" + re + "|$)")) && B(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(n, r, i) {
                    return function(e) {
                        var t = x.attr(e, n);
                        return null == t ? "!=" === r : !r || (t += "",
                        "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(se, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"))
                    }
                },
                CHILD: function(p, e, t, m, g) {
                    var y = "nth" !== p.slice(0, 3)
                      , v = "last" !== p.slice(-4)
                      , b = "of-type" === e;
                    return 1 === m && 0 === g ? function(e) {
                        return !!e.parentNode
                    }
                    : function(e, t, n) {
                        var r, i, o, a, s, u, c = y !== v ? "nextSibling" : "previousSibling", l = e.parentNode, f = b && e.nodeName.toLowerCase(), d = !n && !b, h = !1;
                        if (l) {
                            if (y) {
                                for (; c; ) {
                                    for (a = e; a = a[c]; )
                                        if (b ? a.nodeName.toLowerCase() === f : 1 === a.nodeType)
                                            return !1;
                                    u = c = "only" === p && !u && "nextSibling"
                                }
                                return !0
                            }
                            if (u = [v ? l.firstChild : l.lastChild],
                            v && d) {
                                for (h = (s = (r = (i = (o = (a = l)[P] || (a[P] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[p] || [])[0] === F && r[1]) && r[2],
                                a = s && l.childNodes[s]; a = ++s && a && a[c] || (h = s = 0) || u.pop(); )
                                    if (1 === a.nodeType && ++h && a === e) {
                                        i[p] = [F, s, h];
                                        break
                                    }
                            } else if (d && (h = s = (r = (i = (o = (a = e)[P] || (a[P] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[p] || [])[0] === F && r[1]),
                            !1 === h)
                                for (; (a = ++s && a && a[c] || (h = s = 0) || u.pop()) && ((b ? a.nodeName.toLowerCase() !== f : 1 !== a.nodeType) || !++h || (d && ((i = (o = a[P] || (a[P] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[p] = [F, h]),
                                a !== e)); )
                                    ;
                            return (h -= g) === m || h % m == 0 && 0 <= h / m
                        }
                    }
                },
                PSEUDO: function(e, o) {
                    var t, a = T.pseudos[e] || T.setFilters[e.toLowerCase()] || x.error("unsupported pseudo: " + e);
                    return a[P] ? a(o) : 1 < a.length ? (t = [e, e, "", o],
                    T.setFilters.hasOwnProperty(e.toLowerCase()) ? u(function(e, t) {
                        for (var n, r = a(e, o), i = r.length; i--; )
                            e[n = te(e, r[i])] = !(t[n] = r[i])
                    }) : function(e) {
                        return a(e, 0, t)
                    }
                    ) : a
                }
            },
            pseudos: {
                not: u(function(e) {
                    var r = []
                      , i = []
                      , s = S(e.replace(ue, "$1"));
                    return s[P] ? u(function(e, t, n, r) {
                        for (var i, o = s(e, null, r, []), a = e.length; a--; )
                            (i = o[a]) && (e[a] = !(t[a] = i))
                    }) : function(e, t, n) {
                        return r[0] = e,
                        s(r, null, n, i),
                        r[0] = null,
                        !i.pop()
                    }
                }),
                has: u(function(t) {
                    return function(e) {
                        return 0 < x(t, e).length
                    }
                }),
                contains: u(function(t) {
                    return t = t.replace(we, De),
                    function(e) {
                        return -1 < (e.textContent || k(e)).indexOf(t)
                    }
                }),
                lang: u(function(n) {
                    return he.test(n || "") || x.error("unsupported lang: " + n),
                    n = n.replace(we, De).toLowerCase(),
                    function(e) {
                        var t;
                        do {
                            if (t = $ ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                        } while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1
                    }
                }),
                target: function(e) {
                    var t = n.location && n.location.hash;
                    return t && t.slice(1) === e.id
                },
                root: function(e) {
                    return e === q
                },
                focus: function(e) {
                    return e === L.activeElement && (!L.hasFocus || L.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: a(!1),
                disabled: a(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !T.pseudos.empty(e)
                },
                header: function(e) {
                    return ye.test(e.nodeName)
                },
                input: function(e) {
                    return ge.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: s(function() {
                    return [0]
                }),
                last: s(function(e, t) {
                    return [t - 1]
                }),
                eq: s(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: s(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: s(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: s(function(e, t, n) {
                    for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r; )
                        e.push(r);
                    return e
                }),
                gt: s(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = T.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            T.pseudos[y] = r(y);
        for (y in {
            submit: !0,
            reset: !0
        })
            T.pseudos[y] = o(y);
        return l.prototype = T.filters = T.pseudos,
        T.setFilters = new l,
        M = x.tokenize = function(e, t) {
            var n, r, i, o, a, s, u, c = U[e + " "];
            if (c)
                return t ? 0 : c.slice(0);
            for (a = e,
            s = [],
            u = T.preFilter; a; ) {
                for (o in n && !(r = ce.exec(a)) || (r && (a = a.slice(r[0].length) || a),
                s.push(i = [])),
                n = !1,
                (r = le.exec(a)) && (n = r.shift(),
                i.push({
                    value: n,
                    type: r[0].replace(ue, " ")
                }),
                a = a.slice(n.length)),
                T.filter)
                    !(r = pe[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(),
                    i.push({
                        value: n,
                        type: o,
                        matches: r
                    }),
                    a = a.slice(n.length));
                if (!n)
                    break
            }
            return t ? a.length : a ? x.error(e) : U(e, s).slice(0)
        }
        ,
        S = x.compile = function(e, t) {
            var n, r = [], i = [], o = Y[e + " "];
            if (!o) {
                for (t || (t = M(e)),
                n = t.length; n--; )
                    (o = h(t[n]))[P] ? r.push(o) : i.push(o);
                (o = Y(e, g(i, r))).selector = e
            }
            return o
        }
        ,
        E = x.select = function(e, t, n, r) {
            var i, o, a, s, u, c = "function" == typeof e && e, l = !r && M(e = c.selector || e);
            if (n = n || [],
            1 === l.length) {
                if (2 < (o = l[0] = l[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && $ && T.relative[o[1].type]) {
                    if (!(t = (T.find.ID(a.matches[0].replace(we, De), t) || [])[0]))
                        return n;
                    c && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                for (i = pe.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i],
                !T.relative[s = a.type]); )
                    if ((u = T.find[s]) && (r = u(a.matches[0].replace(we, De), xe.test(o[0].type) && p(t.parentNode) || t))) {
                        if (o.splice(i, 1),
                        !(e = r.length && m(o)))
                            return Q.apply(n, r),
                            n;
                        break
                    }
            }
            return (c || S(e, l))(r, t, !$, n, !t || xe.test(e) && p(t.parentNode) || t),
            n
        }
        ,
        D.sortStable = P.split("").sort(J).join("") === P,
        D.detectDuplicates = !!j,
        A(),
        D.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(L.createElement("fieldset"))
        }),
        i(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || t("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        D.attributes && i(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || t("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        i(function(e) {
            return null == e.getAttribute("disabled")
        }) || t(ne, function(e, t, n) {
            var r;
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
        x
    }(k);
    ke.find = Me,
    ke.expr = Me.selectors,
    ke.expr[":"] = ke.expr.pseudos,
    ke.uniqueSort = ke.unique = Me.uniqueSort,
    ke.text = Me.getText,
    ke.isXMLDoc = Me.isXML,
    ke.contains = Me.contains,
    ke.escapeSelector = Me.escape;
    var Se = function(e, t, n) {
        for (var r = [], i = n !== undefined; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (i && ke(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
      , Ee = function(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
      , _e = ke.expr.match.needsContext
      , Ne = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    ke.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? ke.find.matchesSelector(r, e) ? [r] : [] : ke.find.matches(e, ke.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    ke.fn.extend({
        find: function(e) {
            var t, n, r = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(ke(e).filter(function() {
                    for (t = 0; t < r; t++)
                        if (ke.contains(i[t], this))
                            return !0
                }));
            for (n = this.pushStack([]),
            t = 0; t < r; t++)
                ke.find(e, i[t], n);
            return 1 < r ? ke.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(t(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(t(this, e || [], !0))
        },
        is: function(e) {
            return !!t(this, "string" == typeof e && _e.test(e) ? ke(e) : e || [], !1).length
        }
    });
    var je, Ae = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (ke.fn.init = function(e, t, n) {
        var r, i;
        if (!e)
            return this;
        if (n = n || je,
        "string" != typeof e)
            return e.nodeType ? (this[0] = e,
            this.length = 1,
            this) : xe(e) ? n.ready !== undefined ? n.ready(e) : e(ke) : ke.makeArray(e, this);
        if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : Ae.exec(e)) || !r[1] && t)
            return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
        if (r[1]) {
            if (t = t instanceof ke ? t[0] : t,
            ke.merge(this, ke.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : ue, !0)),
            Ne.test(r[1]) && ke.isPlainObject(t))
                for (r in t)
                    xe(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
            return this
        }
        return (i = ue.getElementById(r[2])) && (this[0] = i,
        this.length = 1),
        this
    }
    ).prototype = ke.fn,
    je = ke(ue);
    var Le = /^(?:parents|prev(?:Until|All))/
      , qe = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    ke.fn.extend({
        has: function(e) {
            var t = ke(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (ke.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, o = [], a = "string" != typeof e && ke(e);
            if (!_e.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && ke.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(1 < o.length ? ke.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? he.call(ke(e), this[0]) : he.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(ke.uniqueSort(ke.merge(this.get(), ke(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    ke.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return Se(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return Se(e, "parentNode", n)
        },
        next: function(e) {
            return n(e, "nextSibling")
        },
        prev: function(e) {
            return n(e, "previousSibling")
        },
        nextAll: function(e) {
            return Se(e, "nextSibling")
        },
        prevAll: function(e) {
            return Se(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return Se(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return Se(e, "previousSibling", n)
        },
        siblings: function(e) {
            return Ee((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return Ee(e.firstChild)
        },
        contents: function(e) {
            return "undefined" != typeof e.contentDocument ? e.contentDocument : (c(e, "template") && (e = e.content || e),
            ke.merge([], e.childNodes))
        }
    }, function(r, i) {
        ke.fn[r] = function(e, t) {
            var n = ke.map(this, i, e);
            return "Until" !== r.slice(-5) && (t = e),
            t && "string" == typeof t && (n = ke.filter(t, n)),
            1 < this.length && (qe[r] || ke.uniqueSort(n),
            Le.test(r) && n.reverse()),
            this.pushStack(n)
        }
    });
    var $e = /[^\x20\t\r\n\f]+/g;
    ke.Callbacks = function(r) {
        r = "string" == typeof r ? l(r) : ke.extend({}, r);
        var i, e, t, n, o = [], a = [], s = -1, u = function() {
            for (n = n || r.once,
            t = i = !0; a.length; s = -1)
                for (e = a.shift(); ++s < o.length; )
                    !1 === o[s].apply(e[0], e[1]) && r.stopOnFalse && (s = o.length,
                    e = !1);
            r.memory || (e = !1),
            i = !1,
            n && (o = e ? [] : "")
        }, c = {
            add: function() {
                return o && (e && !i && (s = o.length - 1,
                a.push(e)),
                function n(e) {
                    ke.each(e, function(e, t) {
                        xe(t) ? r.unique && c.has(t) || o.push(t) : t && t.length && "string" !== g(t) && n(t)
                    })
                }(arguments),
                e && !i && u()),
                this
            },
            remove: function() {
                return ke.each(arguments, function(e, t) {
                    for (var n; -1 < (n = ke.inArray(t, o, n)); )
                        o.splice(n, 1),
                        n <= s && s--
                }),
                this
            },
            has: function(e) {
                return e ? -1 < ke.inArray(e, o) : 0 < o.length
            },
            empty: function() {
                return o && (o = []),
                this
            },
            disable: function() {
                return n = a = [],
                o = e = "",
                this
            },
            disabled: function() {
                return !o
            },
            lock: function() {
                return n = a = [],
                e || i || (o = e = ""),
                this
            },
            locked: function() {
                return !!n
            },
            fireWith: function(e, t) {
                return n || (t = [e, (t = t || []).slice ? t.slice() : t],
                a.push(t),
                i || u()),
                this
            },
            fire: function() {
                return c.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!t
            }
        };
        return c
    }
    ,
    ke.extend({
        Deferred: function(e) {
            var o = [["notify", "progress", ke.Callbacks("memory"), ke.Callbacks("memory"), 2], ["resolve", "done", ke.Callbacks("once memory"), ke.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", ke.Callbacks("once memory"), ke.Callbacks("once memory"), 1, "rejected"]]
              , i = "pending"
              , a = {
                state: function() {
                    return i
                },
                always: function() {
                    return s.done(arguments).fail(arguments),
                    this
                },
                "catch": function(e) {
                    return a.then(null, e)
                },
                pipe: function() {
                    var i = arguments;
                    return ke.Deferred(function(r) {
                        ke.each(o, function(e, t) {
                            var n = xe(i[t[4]]) && i[t[4]];
                            s[t[1]](function() {
                                var e = n && n.apply(this, arguments);
                                e && xe(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments)
                            })
                        }),
                        i = null
                    }).promise()
                },
                then: function(t, n, r) {
                    function c(o, a, s, u) {
                        return function() {
                            var n = this
                              , r = arguments
                              , t = function() {
                                var e, t;
                                if (!(o < l)) {
                                    if ((e = s.apply(n, r)) === a.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    t = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    xe(t) ? u ? t.call(e, c(l, a, f, u), c(l, a, d, u)) : (l++,
                                    t.call(e, c(l, a, f, u), c(l, a, d, u), c(l, a, f, a.notifyWith))) : (s !== f && (n = undefined,
                                    r = [e]),
                                    (u || a.resolveWith)(n, r))
                                }
                            }
                              , i = u ? t : function() {
                                try {
                                    t()
                                } catch (e) {
                                    ke.Deferred.exceptionHook && ke.Deferred.exceptionHook(e, i.stackTrace),
                                    l <= o + 1 && (s !== d && (n = undefined,
                                    r = [e]),
                                    a.rejectWith(n, r))
                                }
                            }
                            ;
                            o ? i() : (ke.Deferred.getStackHook && (i.stackTrace = ke.Deferred.getStackHook()),
                            k.setTimeout(i))
                        }
                    }
                    var l = 0;
                    return ke.Deferred(function(e) {
                        o[0][3].add(c(0, e, xe(r) ? r : f, e.notifyWith)),
                        o[1][3].add(c(0, e, xe(t) ? t : f)),
                        o[2][3].add(c(0, e, xe(n) ? n : d))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? ke.extend(e, a) : a
                }
            }
              , s = {};
            return ke.each(o, function(e, t) {
                var n = t[2]
                  , r = t[5];
                a[t[1]] = n.add,
                r && n.add(function() {
                    i = r
                }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock),
                n.add(t[3].fire),
                s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? undefined : this, arguments),
                    this
                }
                ,
                s[t[0] + "With"] = n.fireWith
            }),
            a.promise(s),
            e && e.call(s, s),
            s
        },
        when: function(e) {
            var n = arguments.length
              , t = n
              , r = Array(t)
              , i = le.call(arguments)
              , o = ke.Deferred()
              , a = function(t) {
                return function(e) {
                    r[t] = this,
                    i[t] = 1 < arguments.length ? le.call(arguments) : e,
                    --n || o.resolveWith(r, i)
                }
            };
            if (n <= 1 && (u(e, o.done(a(t)).resolve, o.reject, !n),
            "pending" === o.state() || xe(i[t] && i[t].then)))
                return o.then();
            for (; t--; )
                u(i[t], a(t), o.reject);
            return o.promise()
        }
    });
    var He = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    ke.Deferred.exceptionHook = function(e, t) {
        k.console && k.console.warn && e && He.test(e.name) && k.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    }
    ,
    ke.readyException = function(e) {
        k.setTimeout(function() {
            throw e
        })
    }
    ;
    var Oe = ke.Deferred();
    ke.fn.ready = function(e) {
        return Oe.then(e)["catch"](function(e) {
            ke.readyException(e)
        }),
        this
    }
    ,
    ke.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --ke.readyWait : ke.isReady) || (ke.isReady = !0) !== e && 0 < --ke.readyWait || Oe.resolveWith(ue, [ke])
        }
    }),
    ke.ready.then = Oe.then,
    "complete" === ue.readyState || "loading" !== ue.readyState && !ue.documentElement.doScroll ? k.setTimeout(ke.ready) : (ue.addEventListener("DOMContentLoaded", r),
    k.addEventListener("load", r));
    var Ie = function(e, t, n, r, i, o, a) {
        var s = 0
          , u = e.length
          , c = null == n;
        if ("object" === g(n))
            for (s in i = !0,
            n)
                Ie(e, t, s, n[s], !0, o, a);
        else if (r !== undefined && (i = !0,
        xe(r) || (a = !0),
        c && (a ? (t.call(e, r),
        t = null) : (c = t,
        t = function(e, t, n) {
            return c.call(ke(e), n)
        }
        )),
        t))
            for (; s < u; s++)
                t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : c ? t.call(e) : u ? t(e[0], n) : o
    }
      , Re = /^-ms-/
      , Pe = /-([a-z])/g
      , ze = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    o.uid = 1,
    o.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            ze(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t)
                i[h(t)] = n;
            else
                for (r in t)
                    i[h(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return t === undefined ? this.cache(e) : e[this.expando] && e[this.expando][h(t)]
        },
        access: function(e, t, n) {
            return t === undefined || t && "string" == typeof t && n === undefined ? this.get(e, t) : (this.set(e, t, n),
            n !== undefined ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (r !== undefined) {
                if (t !== undefined) {
                    n = (t = Array.isArray(t) ? t.map(h) : (t = h(t))in r ? [t] : t.match($e) || []).length;
                    for (; n--; )
                        delete r[t[n]]
                }
                (t === undefined || ke.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = undefined : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return t !== undefined && !ke.isEmptyObject(t)
        }
    };
    var Fe = new o
      , We = new o
      , Be = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Ue = /[A-Z]/g;
    ke.extend({
        hasData: function(e) {
            return We.hasData(e) || Fe.hasData(e)
        },
        data: function(e, t, n) {
            return We.access(e, t, n)
        },
        removeData: function(e, t) {
            We.remove(e, t)
        },
        _data: function(e, t, n) {
            return Fe.access(e, t, n)
        },
        _removeData: function(e, t) {
            Fe.remove(e, t)
        }
    }),
    ke.fn.extend({
        data: function(n, e) {
            var t, r, i, o = this[0], a = o && o.attributes;
            if (n !== undefined)
                return "object" == typeof n ? this.each(function() {
                    We.set(this, n)
                }) : Ie(this, function(e) {
                    var t;
                    if (o && e === undefined)
                        return (t = We.get(o, n)) !== undefined ? t : (t = p(o, n)) !== undefined ? t : void 0;
                    this.each(function() {
                        We.set(this, n, e)
                    })
                }, null, e, 1 < arguments.length, null, !0);
            if (this.length && (i = We.get(o),
            1 === o.nodeType && !Fe.get(o, "hasDataAttrs"))) {
                for (t = a.length; t--; )
                    a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = h(r.slice(5)),
                    p(o, r, i[r]));
                Fe.set(o, "hasDataAttrs", !0)
            }
            return i
        },
        removeData: function(e) {
            return this.each(function() {
                We.remove(this, e)
            })
        }
    }),
    ke.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue",
                r = Fe.get(e, t),
                n && (!r || Array.isArray(n) ? r = Fe.access(e, t, ke.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = ke.queue(e, t)
              , r = n.length
              , i = n.shift()
              , o = ke._queueHooks(e, t)
              , a = function() {
                ke.dequeue(e, t)
            };
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(e, a, o)),
            !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Fe.get(e, n) || Fe.access(e, n, {
                empty: ke.Callbacks("once memory").add(function() {
                    Fe.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    ke.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t,
            t = "fx",
            e--),
            arguments.length < e ? ke.queue(this[0], t) : n === undefined ? this : this.each(function() {
                var e = ke.queue(this, t, n);
                ke._queueHooks(this, t),
                "fx" === t && "inprogress" !== e[0] && ke.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                ke.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1, i = ke.Deferred(), o = this, a = this.length, s = function() {
                --r || i.resolveWith(o, [o])
            };
            for ("string" != typeof e && (t = e,
            e = undefined),
            e = e || "fx"; a--; )
                (n = Fe.get(o[a], e + "queueHooks")) && n.empty && (r++,
                n.empty.add(s));
            return s(),
            i.promise(t)
        }
    });
    var Ye = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , Xe = new RegExp("^(?:([+-])=|)(" + Ye + ")([a-z%]*)$","i")
      , Je = ["Top", "Right", "Bottom", "Left"]
      , Ge = ue.documentElement
      , Ve = function(e) {
        return ke.contains(e.ownerDocument, e)
    }
      , Ze = {
        composed: !0
    };
    Ge.getRootNode && (Ve = function(e) {
        return ke.contains(e.ownerDocument, e) || e.getRootNode(Ze) === e.ownerDocument
    }
    );
    var Ke = function(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && Ve(e) && "none" === ke.css(e, "display")
    }
      , Qe = function(e, t, n, r) {
        var i, o, a = {};
        for (o in t)
            a[o] = e.style[o],
            e.style[o] = t[o];
        for (o in i = n.apply(e, r || []),
        t)
            e.style[o] = a[o];
        return i
    }
      , et = {};
    ke.fn.extend({
        show: function() {
            return b(this, !0)
        },
        hide: function() {
            return b(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Ke(this) ? ke(this).show() : ke(this).hide()
            })
        }
    });
    var tt = /^(?:checkbox|radio)$/i
      , nt = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i
      , rt = /^$|^module$|\/(?:java|ecma)script/i
      , it = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    it.optgroup = it.option,
    it.tbody = it.tfoot = it.colgroup = it.caption = it.thead,
    it.th = it.td;
    var ot, at, st = /<|&#?\w+;/;
    ot = ue.createDocumentFragment().appendChild(ue.createElement("div")),
    (at = ue.createElement("input")).setAttribute("type", "radio"),
    at.setAttribute("checked", "checked"),
    at.setAttribute("name", "t"),
    ot.appendChild(at),
    be.checkClone = ot.cloneNode(!0).cloneNode(!0).lastChild.checked,
    ot.innerHTML = "<textarea>x</textarea>",
    be.noCloneChecked = !!ot.cloneNode(!0).lastChild.defaultValue;
    var ut = /^key/
      , ct = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , lt = /^([^.]*)(?:\.(.+)|)/;
    ke.event = {
        global: {},
        add: function(t, e, n, r, i) {
            var o, a, s, u, c, l, f, d, h, p, m, g = Fe.get(t);
            if (g)
                for (n.handler && (n = (o = n).handler,
                i = o.selector),
                i && ke.find.matchesSelector(Ge, i),
                n.guid || (n.guid = ke.guid++),
                (u = g.events) || (u = g.events = {}),
                (a = g.handle) || (a = g.handle = function(e) {
                    return void 0 !== ke && ke.event.triggered !== e.type ? ke.event.dispatch.apply(t, arguments) : undefined
                }
                ),
                c = (e = (e || "").match($e) || [""]).length; c--; )
                    h = m = (s = lt.exec(e[c]) || [])[1],
                    p = (s[2] || "").split(".").sort(),
                    h && (f = ke.event.special[h] || {},
                    h = (i ? f.delegateType : f.bindType) || h,
                    f = ke.event.special[h] || {},
                    l = ke.extend({
                        type: h,
                        origType: m,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && ke.expr.match.needsContext.test(i),
                        namespace: p.join(".")
                    }, o),
                    (d = u[h]) || ((d = u[h] = []).delegateCount = 0,
                    f.setup && !1 !== f.setup.call(t, r, p, a) || t.addEventListener && t.addEventListener(h, a)),
                    f.add && (f.add.call(t, l),
                    l.handler.guid || (l.handler.guid = n.guid)),
                    i ? d.splice(d.delegateCount++, 0, l) : d.push(l),
                    ke.event.global[h] = !0)
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, u, c, l, f, d, h, p, m, g = Fe.hasData(e) && Fe.get(e);
            if (g && (u = g.events)) {
                for (c = (t = (t || "").match($e) || [""]).length; c--; )
                    if (h = m = (s = lt.exec(t[c]) || [])[1],
                    p = (s[2] || "").split(".").sort(),
                    h) {
                        for (f = ke.event.special[h] || {},
                        d = u[h = (r ? f.delegateType : f.bindType) || h] || [],
                        s = s[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        a = o = d.length; o--; )
                            l = d[o],
                            !i && m !== l.origType || n && n.guid !== l.guid || s && !s.test(l.namespace) || r && r !== l.selector && ("**" !== r || !l.selector) || (d.splice(o, 1),
                            l.selector && d.delegateCount--,
                            f.remove && f.remove.call(e, l));
                        a && !d.length && (f.teardown && !1 !== f.teardown.call(e, p, g.handle) || ke.removeEvent(e, h, g.handle),
                        delete u[h])
                    } else
                        for (h in u)
                            ke.event.remove(e, h + t[c], n, r, !0);
                ke.isEmptyObject(u) && Fe.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, a, s = ke.event.fix(e), u = new Array(arguments.length), c = (Fe.get(this, "events") || {})[s.type] || [], l = ke.event.special[s.type] || {};
            for (u[0] = s,
            t = 1; t < arguments.length; t++)
                u[t] = arguments[t];
            if (s.delegateTarget = this,
            !l.preDispatch || !1 !== l.preDispatch.call(this, s)) {
                for (a = ke.event.handlers.call(this, s, c),
                t = 0; (i = a[t++]) && !s.isPropagationStopped(); )
                    for (s.currentTarget = i.elem,
                    n = 0; (o = i.handlers[n++]) && !s.isImmediatePropagationStopped(); )
                        s.rnamespace && !1 !== o.namespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o,
                        s.data = o.data,
                        (r = ((ke.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, u)) !== undefined && !1 === (s.result = r) && (s.preventDefault(),
                        s.stopPropagation()));
                return l.postDispatch && l.postDispatch.call(this, s),
                s.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a, s = [], u = t.delegateCount, c = e.target;
            if (u && c.nodeType && !("click" === e.type && 1 <= e.button))
                for (; c !== this; c = c.parentNode || this)
                    if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                        for (o = [],
                        a = {},
                        n = 0; n < u; n++)
                            a[i = (r = t[n]).selector + " "] === undefined && (a[i] = r.needsContext ? -1 < ke(i, this).index(c) : ke.find(i, this, null, [c]).length),
                            a[i] && o.push(r);
                        o.length && s.push({
                            elem: c,
                            handlers: o
                        })
                    }
            return c = this,
            u < t.length && s.push({
                elem: c,
                handlers: t.slice(u)
            }),
            s
        },
        addProp: function(t, e) {
            Object.defineProperty(ke.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: xe(e) ? function() {
                    if (this.originalEvent)
                        return e(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[t]
                }
                ,
                set: function(e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function(e) {
            return e[ke.expando] ? e : new ke.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return tt.test(t.type) && t.click && c(t, "input") && _(t, "click", T),
                    !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return tt.test(t.type) && t.click && c(t, "input") && _(t, "click"),
                    !0
                },
                _default: function(e) {
                    var t = e.target;
                    return tt.test(t.type) && t.click && c(t, "input") && Fe.get(t, "click") || c(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    ke.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    ke.Event = function(e, t) {
        if (!(this instanceof ke.Event))
            return new ke.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && !1 === e.returnValue ? T : C,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && ke.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[ke.expando] = !0
    }
    ,
    ke.Event.prototype = {
        constructor: ke.Event,
        isDefaultPrevented: C,
        isPropagationStopped: C,
        isImmediatePropagationStopped: C,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = T,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = T,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = T,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    ke.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && ut.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && t !== undefined && ct.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, ke.event.addProp),
    ke.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        ke.event.special[e] = {
            setup: function() {
                return _(this, e, M),
                !1
            },
            trigger: function() {
                return _(this, e),
                !0
            },
            delegateType: t
        }
    }),
    ke.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, o) {
        ke.event.special[e] = {
            delegateType: o,
            bindType: o,
            handle: function(e) {
                var t, n = this, r = e.relatedTarget, i = e.handleObj;
                return r && (r === n || ke.contains(n, r)) || (e.type = i.origType,
                t = i.handler.apply(this, arguments),
                e.type = o),
                t
            }
        }
    }),
    ke.fn.extend({
        on: function(e, t, n, r) {
            return E(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return E(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj,
                ke(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                this;
            if ("object" != typeof e)
                return !1 !== t && "function" != typeof t || (n = t,
                t = undefined),
                !1 === n && (n = C),
                this.each(function() {
                    ke.event.remove(this, e, n, t)
                });
            for (i in e)
                this.off(i, t, e[i]);
            return this
        }
    });
    var ft = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi
      , dt = /<script|<style|<link/i
      , ht = /checked\s*(?:[^=]|=\s*.checked.)/i
      , pt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    ke.extend({
        htmlPrefilter: function(e) {
            return e.replace(ft, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var r, i, o, a, s = e.cloneNode(!0), u = Ve(e);
            if (!(be.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ke.isXMLDoc(e)))
                for (a = x(s),
                r = 0,
                i = (o = x(e)).length; r < i; r++)
                    q(o[r], a[r]);
            if (t)
                if (n)
                    for (o = o || x(e),
                    a = a || x(s),
                    r = 0,
                    i = o.length; r < i; r++)
                        L(o[r], a[r]);
                else
                    L(e, s);
            return 0 < (a = x(s, "script")).length && w(a, !u && x(e, "script")),
            s
        },
        cleanData: function(e) {
            for (var t, n, r, i = ke.event.special, o = 0; (n = e[o]) !== undefined; o++)
                if (ze(n)) {
                    if (t = n[Fe.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? ke.event.remove(n, r) : ke.removeEvent(n, r, t.handle);
                        n[Fe.expando] = undefined
                    }
                    n[We.expando] && (n[We.expando] = undefined)
                }
        }
    }),
    ke.fn.extend({
        detach: function(e) {
            return H(this, e, !0)
        },
        remove: function(e) {
            return H(this, e)
        },
        text: function(e) {
            return Ie(this, function(e) {
                return e === undefined ? ke.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return $(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || N(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return $(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = N(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return $(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return $(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (ke.cleanData(x(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return ke.clone(this, e, t)
            })
        },
        html: function(e) {
            return Ie(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (e === undefined && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !dt.test(e) && !it[(nt.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = ke.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (ke.cleanData(x(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (i) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return $(this, arguments, function(e) {
                var t = this.parentNode;
                ke.inArray(this, n) < 0 && (ke.cleanData(x(this)),
                t && t.replaceChild(e, this))
            }, n)
        }
    }),
    ke.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        ke.fn[e] = function(e) {
            for (var t, n = [], r = ke(e), i = r.length - 1, o = 0; o <= i; o++)
                t = o === i ? this : this.clone(!0),
                ke(r[o])[a](t),
                de.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var mt = new RegExp("^(" + Ye + ")(?!px)[a-z%]+$","i")
      , gt = function(e) {
        var t = e.ownerDocument.defaultView;
        return t && t.opener || (t = k),
        t.getComputedStyle(e)
    }
      , yt = new RegExp(Je.join("|"),"i");
    !function() {
        function e() {
            if (u) {
                s.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                Ge.appendChild(s).appendChild(u);
                var e = k.getComputedStyle(u);
                n = "1%" !== e.top,
                a = 12 === t(e.marginLeft),
                u.style.right = "60%",
                o = 36 === t(e.right),
                r = 36 === t(e.width),
                u.style.position = "absolute",
                i = 12 === t(u.offsetWidth / 3),
                Ge.removeChild(s),
                u = null
            }
        }
        function t(e) {
            return Math.round(parseFloat(e))
        }
        var n, r, i, o, a, s = ue.createElement("div"), u = ue.createElement("div");
        u.style && (u.style.backgroundClip = "content-box",
        u.cloneNode(!0).style.backgroundClip = "",
        be.clearCloneStyle = "content-box" === u.style.backgroundClip,
        ke.extend(be, {
            boxSizingReliable: function() {
                return e(),
                r
            },
            pixelBoxStyles: function() {
                return e(),
                o
            },
            pixelPosition: function() {
                return e(),
                n
            },
            reliableMarginLeft: function() {
                return e(),
                a
            },
            scrollboxSize: function() {
                return e(),
                i
            }
        }))
    }();
    var vt = ["Webkit", "Moz", "ms"]
      , bt = ue.createElement("div").style
      , xt = {}
      , wt = /^(none|table(?!-c[ea]).+)/
      , Dt = /^--/
      , Tt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , kt = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    ke.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = O(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = h(t), u = Dt.test(t), c = e.style;
                if (u || (t = P(s)),
                a = ke.cssHooks[t] || ke.cssHooks[s],
                n === undefined)
                    return a && "get"in a && (i = a.get(e, !1, r)) !== undefined ? i : c[t];
                "string" === (o = typeof n) && (i = Xe.exec(n)) && i[1] && (n = y(e, t, i),
                o = "number"),
                null != n && n == n && ("number" !== o || u || (n += i && i[3] || (ke.cssNumber[s] ? "" : "px")),
                be.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (c[t] = "inherit"),
                a && "set"in a && (n = a.set(e, n, r)) === undefined || (u ? c.setProperty(t, n) : c[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = h(t);
            return Dt.test(t) || (t = P(s)),
            (a = ke.cssHooks[t] || ke.cssHooks[s]) && "get"in a && (i = a.get(e, !0, n)),
            i === undefined && (i = O(e, t, r)),
            "normal" === i && t in kt && (i = kt[t]),
            "" === n || n ? (o = parseFloat(i),
            !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }),
    ke.each(["height", "width"], function(e, u) {
        ke.cssHooks[u] = {
            get: function(e, t, n) {
                if (t)
                    return !wt.test(ke.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? W(e, u, n) : Qe(e, Tt, function() {
                        return W(e, u, n)
                    })
            },
            set: function(e, t, n) {
                var r, i = gt(e), o = !be.scrollboxSize() && "absolute" === i.position, a = (o || n) && "border-box" === ke.css(e, "boxSizing", !1, i), s = n ? F(e, u, n, a, i) : 0;
                return a && o && (s -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - F(e, u, "border", !1, i) - .5)),
                s && (r = Xe.exec(t)) && "px" !== (r[3] || "px") && (e.style[u] = t,
                t = ke.css(e, u)),
                z(e, t, s)
            }
        }
    }),
    ke.cssHooks.marginLeft = I(be.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(O(e, "marginLeft")) || e.getBoundingClientRect().left - Qe(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    ke.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(i, o) {
        ke.cssHooks[i + o] = {
            expand: function(e) {
                for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                    n[i + Je[t] + o] = r[t] || r[t - 2] || r[0];
                return n
            }
        },
        "margin" !== i && (ke.cssHooks[i + o].set = z)
    }),
    ke.fn.extend({
        css: function(e, t) {
            return Ie(this, function(e, t, n) {
                var r, i, o = {}, a = 0;
                if (Array.isArray(t)) {
                    for (r = gt(e),
                    i = t.length; a < i; a++)
                        o[t[a]] = ke.css(e, t[a], !1, r);
                    return o
                }
                return n !== undefined ? ke.style(e, t, n) : ke.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }),
    (ke.Tween = B).prototype = {
        constructor: B,
        init: function(e, t, n, r, i, o) {
            this.elem = e,
            this.prop = n,
            this.easing = i || ke.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = o || (ke.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = B.propHooks[this.prop];
            return e && e.get ? e.get(this) : B.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = B.propHooks[this.prop];
            return this.options.duration ? this.pos = t = ke.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : B.propHooks._default.set(this),
            this
        }
    },
    B.prototype.init.prototype = B.prototype,
    B.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = ke.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                ke.fx.step[e.prop] ? ke.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !ke.cssHooks[e.prop] && null == e.elem.style[P(e.prop)] ? e.elem[e.prop] = e.now : ke.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    },
    B.propHooks.scrollTop = B.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    ke.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    ke.fx = B.prototype.init,
    ke.fx.step = {};
    var Ct, Mt, St, Et, _t = /^(?:toggle|show|hide)$/, Nt = /queueHooks$/;
    ke.Animation = ke.extend(Z, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return y(n.elem, e, Xe.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            xe(e) ? (t = e,
            e = ["*"]) : e = e.match($e);
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r],
                Z.tweeners[n] = Z.tweeners[n] || [],
                Z.tweeners[n].unshift(t)
        },
        prefilters: [G],
        prefilter: function(e, t) {
            t ? Z.prefilters.unshift(e) : Z.prefilters.push(e)
        }
    }),
    ke.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? ke.extend({}, e) : {
            complete: n || !n && t || xe(e) && e,
            duration: e,
            easing: n && t || t && !xe(t) && t
        };
        return ke.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in ke.fx.speeds ? r.duration = ke.fx.speeds[r.duration] : r.duration = ke.fx.speeds._default),
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            xe(r.old) && r.old.call(this),
            r.queue && ke.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    ke.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(Ke).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(t, e, n, r) {
            var i = ke.isEmptyObject(t)
              , o = ke.speed(e, n, r)
              , a = function() {
                var e = Z(this, ke.extend({}, t), o);
                (i || Fe.get(this, "finish")) && e.stop(!0)
            };
            return a.finish = a,
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(i, e, o) {
            var a = function(e) {
                var t = e.stop;
                delete e.stop,
                t(o)
            };
            return "string" != typeof i && (o = e,
            e = i,
            i = undefined),
            e && !1 !== i && this.queue(i || "fx", []),
            this.each(function() {
                var e = !0
                  , t = null != i && i + "queueHooks"
                  , n = ke.timers
                  , r = Fe.get(this);
                if (t)
                    r[t] && r[t].stop && a(r[t]);
                else
                    for (t in r)
                        r[t] && r[t].stop && Nt.test(t) && a(r[t]);
                for (t = n.length; t--; )
                    n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o),
                    e = !1,
                    n.splice(t, 1));
                !e && o || ke.dequeue(this, i)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"),
            this.each(function() {
                var e, t = Fe.get(this), n = t[a + "queue"], r = t[a + "queueHooks"], i = ke.timers, o = n ? n.length : 0;
                for (t.finish = !0,
                ke.queue(this, a, []),
                r && r.stop && r.stop.call(this, !0),
                e = i.length; e--; )
                    i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0),
                    i.splice(e, 1));
                for (e = 0; e < o; e++)
                    n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }),
    ke.each(["toggle", "show", "hide"], function(e, r) {
        var i = ke.fn[r];
        ke.fn[r] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(X(r, !0), e, t, n)
        }
    }),
    ke.each({
        slideDown: X("show"),
        slideUp: X("hide"),
        slideToggle: X("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, r) {
        ke.fn[e] = function(e, t, n) {
            return this.animate(r, e, t, n)
        }
    }),
    ke.timers = [],
    ke.fx.tick = function() {
        var e, t = 0, n = ke.timers;
        for (Ct = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || ke.fx.stop(),
        Ct = undefined
    }
    ,
    ke.fx.timer = function(e) {
        ke.timers.push(e),
        ke.fx.start()
    }
    ,
    ke.fx.interval = 13,
    ke.fx.start = function() {
        Mt || (Mt = !0,
        U())
    }
    ,
    ke.fx.stop = function() {
        Mt = null
    }
    ,
    ke.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    ke.fn.delay = function(r, e) {
        return r = ke.fx && ke.fx.speeds[r] || r,
        e = e || "fx",
        this.queue(e, function(e, t) {
            var n = k.setTimeout(e, r);
            t.stop = function() {
                k.clearTimeout(n)
            }
        })
    }
    ,
    St = ue.createElement("input"),
    Et = ue.createElement("select").appendChild(ue.createElement("option")),
    St.type = "checkbox",
    be.checkOn = "" !== St.value,
    be.optSelected = Et.selected,
    (St = ue.createElement("input")).value = "t",
    St.type = "radio",
    be.radioValue = "t" === St.value;
    var jt, At = ke.expr.attrHandle;
    ke.fn.extend({
        attr: function(e, t) {
            return Ie(this, ke.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                ke.removeAttr(this, e)
            })
        }
    }),
    ke.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return "undefined" == typeof e.getAttribute ? ke.prop(e, t, n) : (1 === o && ke.isXMLDoc(e) || (i = ke.attrHooks[t.toLowerCase()] || (ke.expr.match.bool.test(t) ? jt : undefined)),
                n !== undefined ? null === n ? void ke.removeAttr(e, t) : i && "set"in i && (r = i.set(e, n, t)) !== undefined ? r : (e.setAttribute(t, n + ""),
                n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : null == (r = ke.find.attr(e, t)) ? undefined : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!be.radioValue && "radio" === t && c(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0, i = t && t.match($e);
            if (i && 1 === e.nodeType)
                for (; n = i[r++]; )
                    e.removeAttribute(n)
        }
    }),
    jt = {
        set: function(e, t, n) {
            return !1 === t ? ke.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    ke.each(ke.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var a = At[t] || ke.find.attr;
        At[t] = function(e, t, n) {
            var r, i, o = t.toLowerCase();
            return n || (i = At[o],
            At[o] = r,
            r = null != a(e, t, n) ? o : null,
            At[o] = i),
            r
        }
    });
    var Lt = /^(?:input|select|textarea|button)$/i
      , qt = /^(?:a|area)$/i;
    ke.fn.extend({
        prop: function(e, t) {
            return Ie(this, ke.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[ke.propFix[e] || e]
            })
        }
    }),
    ke.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return 1 === o && ke.isXMLDoc(e) || (t = ke.propFix[t] || t,
                i = ke.propHooks[t]),
                n !== undefined ? i && "set"in i && (r = i.set(e, n, t)) !== undefined ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = ke.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Lt.test(e.nodeName) || qt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }),
    be.optSelected || (ke.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
    ke.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        ke.propFix[this.toLowerCase()] = this
    }),
    ke.fn.extend({
        addClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (xe(t))
                return this.each(function(e) {
                    ke(this).addClass(t.call(this, e, Q(this)))
                });
            if ((e = ee(t)).length)
                for (; n = this[u++]; )
                    if (i = Q(n),
                    r = 1 === n.nodeType && " " + K(i) + " ") {
                        for (a = 0; o = e[a++]; )
                            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = K(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (xe(t))
                return this.each(function(e) {
                    ke(this).removeClass(t.call(this, e, Q(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((e = ee(t)).length)
                for (; n = this[u++]; )
                    if (i = Q(n),
                    r = 1 === n.nodeType && " " + K(i) + " ") {
                        for (a = 0; o = e[a++]; )
                            for (; -1 < r.indexOf(" " + o + " "); )
                                r = r.replace(" " + o + " ", " ");
                        i !== (s = K(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        toggleClass: function(i, t) {
            var o = typeof i
              , a = "string" === o || Array.isArray(i);
            return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : xe(i) ? this.each(function(e) {
                ke(this).toggleClass(i.call(this, e, Q(this), t), t)
            }) : this.each(function() {
                var e, t, n, r;
                if (a)
                    for (t = 0,
                    n = ke(this),
                    r = ee(i); e = r[t++]; )
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else
                    i !== undefined && "boolean" !== o || ((e = Q(this)) && Fe.set(this, "__className__", e),
                    this.setAttribute && this.setAttribute("class", e || !1 === i ? "" : Fe.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            for (t = " " + e + " "; n = this[r++]; )
                if (1 === n.nodeType && -1 < (" " + K(Q(n)) + " ").indexOf(t))
                    return !0;
            return !1
        }
    });
    var $t = /\r/g;
    ke.fn.extend({
        val: function(n) {
            var r, e, i, t = this[0];
            return arguments.length ? (i = xe(n),
            this.each(function(e) {
                var t;
                1 === this.nodeType && (null == (t = i ? n.call(this, e, ke(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = ke.map(t, function(e) {
                    return null == e ? "" : e + ""
                })),
                (r = ke.valHooks[this.type] || ke.valHooks[this.nodeName.toLowerCase()]) && "set"in r && r.set(this, t, "value") !== undefined || (this.value = t))
            })) : t ? (r = ke.valHooks[t.type] || ke.valHooks[t.nodeName.toLowerCase()]) && "get"in r && (e = r.get(t, "value")) !== undefined ? e : "string" == typeof (e = t.value) ? e.replace($t, "") : null == e ? "" : e : void 0
        }
    }),
    ke.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = ke.find.attr(e, "value");
                    return null != t ? t : K(ke.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, i = e.options, o = e.selectedIndex, a = "select-one" === e.type, s = a ? null : [], u = a ? o + 1 : i.length;
                    for (r = o < 0 ? u : a ? o : 0; r < u; r++)
                        if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !c(n.parentNode, "optgroup"))) {
                            if (t = ke(n).val(),
                            a)
                                return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = ke.makeArray(t), a = i.length; a--; )
                        ((r = i[a]).selected = -1 < ke.inArray(ke.valHooks.option.get(r), o)) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    ke.each(["radio", "checkbox"], function() {
        ke.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = -1 < ke.inArray(ke(e).val(), t)
            }
        },
        be.checkOn || (ke.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    be.focusin = "onfocusin"in k;
    var Ht = /^(?:focusinfocus|focusoutblur)$/
      , Ot = function(e) {
        e.stopPropagation()
    };
    ke.extend(ke.event, {
        trigger: function(e, t, n, r) {
            var i, o, a, s, u, c, l, f, d = [n || ue], h = ge.call(e, "type") ? e.type : e, p = ge.call(e, "namespace") ? e.namespace.split(".") : [];
            if (o = f = a = n = n || ue,
            3 !== n.nodeType && 8 !== n.nodeType && !Ht.test(h + ke.event.triggered) && (-1 < h.indexOf(".") && (h = (p = h.split(".")).shift(),
            p.sort()),
            u = h.indexOf(":") < 0 && "on" + h,
            (e = e[ke.expando] ? e : new ke.Event(h,"object" == typeof e && e)).isTrigger = r ? 2 : 3,
            e.namespace = p.join("."),
            e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            e.result = undefined,
            e.target || (e.target = n),
            t = null == t ? [e] : ke.makeArray(t, [e]),
            l = ke.event.special[h] || {},
            r || !l.trigger || !1 !== l.trigger.apply(n, t))) {
                if (!r && !l.noBubble && !we(n)) {
                    for (s = l.delegateType || h,
                    Ht.test(s + h) || (o = o.parentNode); o; o = o.parentNode)
                        d.push(o),
                        a = o;
                    a === (n.ownerDocument || ue) && d.push(a.defaultView || a.parentWindow || k)
                }
                for (i = 0; (o = d[i++]) && !e.isPropagationStopped(); )
                    f = o,
                    e.type = 1 < i ? s : l.bindType || h,
                    (c = (Fe.get(o, "events") || {})[e.type] && Fe.get(o, "handle")) && c.apply(o, t),
                    (c = u && o[u]) && c.apply && ze(o) && (e.result = c.apply(o, t),
                    !1 === e.result && e.preventDefault());
                return e.type = h,
                r || e.isDefaultPrevented() || l._default && !1 !== l._default.apply(d.pop(), t) || !ze(n) || u && xe(n[h]) && !we(n) && ((a = n[u]) && (n[u] = null),
                ke.event.triggered = h,
                e.isPropagationStopped() && f.addEventListener(h, Ot),
                n[h](),
                e.isPropagationStopped() && f.removeEventListener(h, Ot),
                ke.event.triggered = undefined,
                a && (n[u] = a)),
                e.result
            }
        },
        simulate: function(e, t, n) {
            var r = ke.extend(new ke.Event, n, {
                type: e,
                isSimulated: !0
            });
            ke.event.trigger(r, null, t)
        }
    }),
    ke.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                ke.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return ke.event.trigger(e, t, n, !0)
        }
    }),
    be.focusin || ke.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        var i = function(e) {
            ke.event.simulate(r, e.target, ke.event.fix(e))
        };
        ke.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this
                  , t = Fe.access(e, r);
                t || e.addEventListener(n, i, !0),
                Fe.access(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this
                  , t = Fe.access(e, r) - 1;
                t ? Fe.access(e, r, t) : (e.removeEventListener(n, i, !0),
                Fe.remove(e, r))
            }
        }
    });
    var It = k.location
      , Rt = Date.now()
      , Pt = /\?/;
    ke.parseXML = function(e) {
        var t;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new k.DOMParser).parseFromString(e, "text/xml")
        } catch (n) {
            t = undefined
        }
        return t && !t.getElementsByTagName("parsererror").length || ke.error("Invalid XML: " + e),
        t
    }
    ;
    var zt = /\[\]$/
      , Ft = /\r?\n/g
      , Wt = /^(?:submit|button|image|reset|file)$/i
      , Bt = /^(?:input|select|textarea|keygen)/i;
    ke.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            var n = xe(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
        };
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !ke.isPlainObject(e))
            ke.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                te(n, e[n], t, i);
        return r.join("&")
    }
    ,
    ke.fn.extend({
        serialize: function() {
            return ke.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = ke.prop(this, "elements");
                return e ? ke.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !ke(this).is(":disabled") && Bt.test(this.nodeName) && !Wt.test(e) && (this.checked || !tt.test(e))
            }).map(function(e, t) {
                var n = ke(this).val();
                return null == n ? null : Array.isArray(n) ? ke.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Ft, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Ft, "\r\n")
                }
            }).get()
        }
    });
    var Ut = /%20/g
      , Yt = /#.*$/
      , Xt = /([?&])_=[^&]*/
      , Jt = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Gt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
      , Vt = /^(?:GET|HEAD)$/
      , Zt = /^\/\//
      , Kt = {}
      , Qt = {}
      , en = "*/".concat("*")
      , tn = ue.createElement("a");
    tn.href = It.href,
    ke.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: It.href,
            type: "GET",
            isLocal: Gt.test(It.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": en,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": ke.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? ie(ie(e, ke.ajaxSettings), t) : ie(ke.ajaxSettings, e)
        },
        ajaxPrefilter: ne(Kt),
        ajaxTransport: ne(Qt),
        ajax: function(e, t) {
            function n(e, t, n, r) {
                var i, o, a, s, u, c = t;
                p || (p = !0,
                h && k.clearTimeout(h),
                l = undefined,
                d = r || "",
                D.readyState = 0 < e ? 4 : 0,
                i = 200 <= e && e < 300 || 304 === e,
                n && (s = oe(g, D, n)),
                s = ae(g, s, D, i),
                i ? (g.ifModified && ((u = D.getResponseHeader("Last-Modified")) && (ke.lastModified[f] = u),
                (u = D.getResponseHeader("etag")) && (ke.etag[f] = u)),
                204 === e || "HEAD" === g.type ? c = "nocontent" : 304 === e ? c = "notmodified" : (c = s.state,
                o = s.data,
                i = !(a = s.error))) : (a = c,
                !e && c || (c = "error",
                e < 0 && (e = 0))),
                D.status = e,
                D.statusText = (t || c) + "",
                i ? b.resolveWith(y, [o, c, D]) : b.rejectWith(y, [D, c, a]),
                D.statusCode(w),
                w = undefined,
                m && v.trigger(i ? "ajaxSuccess" : "ajaxError", [D, g, i ? o : a]),
                x.fireWith(y, [D, c]),
                m && (v.trigger("ajaxComplete", [D, g]),
                --ke.active || ke.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e,
            e = undefined),
            t = t || {};
            var l, f, d, r, h, i, p, m, o, a, g = ke.ajaxSetup({}, t), y = g.context || g, v = g.context && (y.nodeType || y.jquery) ? ke(y) : ke.event, b = ke.Deferred(), x = ke.Callbacks("once memory"), w = g.statusCode || {}, s = {}, u = {}, c = "canceled", D = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (p) {
                        if (!r)
                            for (r = {}; t = Jt.exec(d); )
                                r[t[1].toLowerCase() + " "] = (r[t[1].toLowerCase() + " "] || []).concat(t[2]);
                        t = r[e.toLowerCase() + " "]
                    }
                    return null == t ? null : t.join(", ")
                },
                getAllResponseHeaders: function() {
                    return p ? d : null
                },
                setRequestHeader: function(e, t) {
                    return null == p && (e = u[e.toLowerCase()] = u[e.toLowerCase()] || e,
                    s[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == p && (g.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (p)
                            D.always(e[D.status]);
                        else
                            for (t in e)
                                w[t] = [w[t], e[t]];
                    return this
                },
                abort: function(e) {
                    var t = e || c;
                    return l && l.abort(t),
                    n(0, t),
                    this
                }
            };
            if (b.promise(D),
            g.url = ((e || g.url || It.href) + "").replace(Zt, It.protocol + "//"),
            g.type = t.method || t.type || g.method || g.type,
            g.dataTypes = (g.dataType || "*").toLowerCase().match($e) || [""],
            null == g.crossDomain) {
                i = ue.createElement("a");
                try {
                    i.href = g.url,
                    i.href = i.href,
                    g.crossDomain = tn.protocol + "//" + tn.host != i.protocol + "//" + i.host
                } catch (T) {
                    g.crossDomain = !0
                }
            }
            if (g.data && g.processData && "string" != typeof g.data && (g.data = ke.param(g.data, g.traditional)),
            re(Kt, g, t, D),
            p)
                return D;
            for (o in (m = ke.event && g.global) && 0 == ke.active++ && ke.event.trigger("ajaxStart"),
            g.type = g.type.toUpperCase(),
            g.hasContent = !Vt.test(g.type),
            f = g.url.replace(Yt, ""),
            g.hasContent ? g.data && g.processData && 0 === (g.contentType || "").indexOf("application/x-www-form-urlencoded") && (g.data = g.data.replace(Ut, "+")) : (a = g.url.slice(f.length),
            g.data && (g.processData || "string" == typeof g.data) && (f += (Pt.test(f) ? "&" : "?") + g.data,
            delete g.data),
            !1 === g.cache && (f = f.replace(Xt, "$1"),
            a = (Pt.test(f) ? "&" : "?") + "_=" + Rt++ + a),
            g.url = f + a),
            g.ifModified && (ke.lastModified[f] && D.setRequestHeader("If-Modified-Since", ke.lastModified[f]),
            ke.etag[f] && D.setRequestHeader("If-None-Match", ke.etag[f])),
            (g.data && g.hasContent && !1 !== g.contentType || t.contentType) && D.setRequestHeader("Content-Type", g.contentType),
            D.setRequestHeader("Accept", g.dataTypes[0] && g.accepts[g.dataTypes[0]] ? g.accepts[g.dataTypes[0]] + ("*" !== g.dataTypes[0] ? ", " + en + "; q=0.01" : "") : g.accepts["*"]),
            g.headers)
                D.setRequestHeader(o, g.headers[o]);
            if (g.beforeSend && (!1 === g.beforeSend.call(y, D, g) || p))
                return D.abort();
            if (c = "abort",
            x.add(g.complete),
            D.done(g.success),
            D.fail(g.error),
            l = re(Qt, g, t, D)) {
                if (D.readyState = 1,
                m && v.trigger("ajaxSend", [D, g]),
                p)
                    return D;
                g.async && 0 < g.timeout && (h = k.setTimeout(function() {
                    D.abort("timeout")
                }, g.timeout));
                try {
                    p = !1,
                    l.send(s, n)
                } catch (T) {
                    if (p)
                        throw T;
                    n(-1, T)
                }
            } else
                n(-1, "No Transport");
            return D
        },
        getJSON: function(e, t, n) {
            return ke.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return ke.get(e, undefined, t, "script")
        }
    }),
    ke.each(["get", "post"], function(e, i) {
        ke[i] = function(e, t, n, r) {
            return xe(t) && (r = r || n,
            n = t,
            t = undefined),
            ke.ajax(ke.extend({
                url: e,
                type: i,
                dataType: r,
                data: t,
                success: n
            }, ke.isPlainObject(e) && e))
        }
    }),
    ke._evalUrl = function(e, t) {
        return ke.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                ke.globalEval(e, t)
            }
        })
    }
    ,
    ke.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (xe(e) && (e = e.call(this[0])),
            t = ke(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(n) {
            return xe(n) ? this.each(function(e) {
                ke(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = ke(this)
                  , t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = xe(t);
            return this.each(function(e) {
                ke(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                ke(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    ke.expr.pseudos.hidden = function(e) {
        return !ke.expr.pseudos.visible(e)
    }
    ,
    ke.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    ke.ajaxSettings.xhr = function() {
        try {
            return new k.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var nn = {
        0: 200,
        1223: 204
    }
      , rn = ke.ajaxSettings.xhr();
    be.cors = !!rn && "withCredentials"in rn,
    be.ajax = rn = !!rn,
    ke.ajaxTransport(function(o) {
        var a, s;
        if (be.cors || rn && !o.crossDomain)
            return {
                send: function(e, t) {
                    var n, r = o.xhr();
                    if (r.open(o.type, o.url, o.async, o.username, o.password),
                    o.xhrFields)
                        for (n in o.xhrFields)
                            r[n] = o.xhrFields[n];
                    for (n in o.mimeType && r.overrideMimeType && r.overrideMimeType(o.mimeType),
                    o.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                    e)
                        r.setRequestHeader(n, e[n]);
                    a = function(e) {
                        return function() {
                            a && (a = s = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null,
                            "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(nn[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {
                                binary: r.response
                            } : {
                                text: r.responseText
                            }, r.getAllResponseHeaders()))
                        }
                    }
                    ,
                    r.onload = a(),
                    s = r.onerror = r.ontimeout = a("error"),
                    r.onabort !== undefined ? r.onabort = s : r.onreadystatechange = function() {
                        4 === r.readyState && k.setTimeout(function() {
                            a && s()
                        })
                    }
                    ,
                    a = a("abort");
                    try {
                        r.send(o.hasContent && o.data || null)
                    } catch (i) {
                        if (a)
                            throw i
                    }
                },
                abort: function() {
                    a && a()
                }
            }
    }),
    ke.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    ke.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return ke.globalEval(e),
                e
            }
        }
    }),
    ke.ajaxPrefilter("script", function(e) {
        e.cache === undefined && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    ke.ajaxTransport("script", function(n) {
        var r, i;
        if (n.crossDomain || n.scriptAttrs)
            return {
                send: function(e, t) {
                    r = ke("<script>").attr(n.scriptAttrs || {}).prop({
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", i = function(e) {
                        r.remove(),
                        i = null,
                        e && t("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    ue.head.appendChild(r[0])
                },
                abort: function() {
                    i && i()
                }
            }
    });
    var on, an = [], sn = /(=)\?(?=&|$)|\?\?/;
    ke.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = an.pop() || ke.expando + "_" + Rt++;
            return this[e] = !0,
            e
        }
    }),
    ke.ajaxPrefilter("json jsonp", function(e, t, n) {
        var r, i, o, a = !1 !== e.jsonp && (sn.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && sn.test(e.data) && "data");
        if (a || "jsonp" === e.dataTypes[0])
            return r = e.jsonpCallback = xe(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
            a ? e[a] = e[a].replace(sn, "$1" + r) : !1 !== e.jsonp && (e.url += (Pt.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
            e.converters["script json"] = function() {
                return o || ke.error(r + " was not called"),
                o[0]
            }
            ,
            e.dataTypes[0] = "json",
            i = k[r],
            k[r] = function() {
                o = arguments
            }
            ,
            n.always(function() {
                i === undefined ? ke(k).removeProp(r) : k[r] = i,
                e[r] && (e.jsonpCallback = t.jsonpCallback,
                an.push(r)),
                o && xe(i) && i(o[0]),
                o = i = undefined
            }),
            "script"
    }),
    be.createHTMLDocument = ((on = ue.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
    2 === on.childNodes.length),
    ke.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t,
        t = !1),
        t || (be.createHTMLDocument ? ((r = (t = ue.implementation.createHTMLDocument("")).createElement("base")).href = ue.location.href,
        t.head.appendChild(r)) : t = ue),
        o = !n && [],
        (i = Ne.exec(e)) ? [t.createElement(i[1])] : (i = D([e], t, o),
        o && o.length && ke(o).remove(),
        ke.merge([], i.childNodes)));
        var r, i, o
    }
    ,
    ke.fn.load = function(e, t, n) {
        var r, i, o, a = this, s = e.indexOf(" ");
        return -1 < s && (r = K(e.slice(s)),
        e = e.slice(0, s)),
        xe(t) ? (n = t,
        t = undefined) : t && "object" == typeof t && (i = "POST"),
        0 < a.length && ke.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            a.html(r ? ke("<div>").append(ke.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    ke.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        ke.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    ke.expr.pseudos.animated = function(t) {
        return ke.grep(ke.timers, function(e) {
            return t === e.elem
        }).length
    }
    ,
    ke.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, u, c = ke.css(e, "position"), l = ke(e), f = {};
            "static" === c && (e.style.position = "relative"),
            s = l.offset(),
            o = ke.css(e, "top"),
            u = ke.css(e, "left"),
            ("absolute" === c || "fixed" === c) && -1 < (o + u).indexOf("auto") ? (a = (r = l.position()).top,
            i = r.left) : (a = parseFloat(o) || 0,
            i = parseFloat(u) || 0),
            xe(t) && (t = t.call(e, n, ke.extend({}, s))),
            null != t.top && (f.top = t.top - s.top + a),
            null != t.left && (f.left = t.left - s.left + i),
            "using"in t ? t.using.call(e, f) : l.css(f)
        }
    },
    ke.fn.extend({
        offset: function(t) {
            if (arguments.length)
                return t === undefined ? this : this.each(function(e) {
                    ke.offset.setOffset(this, t, e)
                });
            var e, n, r = this[0];
            return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(),
            n = r.ownerDocument.defaultView,
            {
                top: e.top + n.pageYOffset,
                left: e.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, r = this[0], i = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === ke.css(r, "position"))
                    t = r.getBoundingClientRect();
                else {
                    for (t = this.offset(),
                    n = r.ownerDocument,
                    e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === ke.css(e, "position"); )
                        e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = ke(e).offset()).top += ke.css(e, "borderTopWidth", !0),
                    i.left += ke.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - ke.css(r, "marginTop", !0),
                    left: t.left - i.left - ke.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === ke.css(e, "position"); )
                    e = e.offsetParent;
                return e || Ge
            })
        }
    }),
    ke.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, i) {
        var o = "pageYOffset" === i;
        ke.fn[t] = function(e) {
            return Ie(this, function(e, t, n) {
                var r;
                if (we(e) ? r = e : 9 === e.nodeType && (r = e.defaultView),
                n === undefined)
                    return r ? r[i] : e[t];
                r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n
            }, t, e, arguments.length)
        }
    }),
    ke.each(["top", "left"], function(e, n) {
        ke.cssHooks[n] = I(be.pixelPosition, function(e, t) {
            if (t)
                return t = O(e, n),
                mt.test(t) ? ke(e).position()[n] + "px" : t
        })
    }),
    ke.each({
        Height: "height",
        Width: "width"
    }, function(a, s) {
        ke.each({
            padding: "inner" + a,
            content: s,
            "": "outer" + a
        }, function(r, o) {
            ke.fn[o] = function(e, t) {
                var n = arguments.length && (r || "boolean" != typeof e)
                  , i = r || (!0 === e || !0 === t ? "margin" : "border");
                return Ie(this, function(e, t, n) {
                    var r;
                    return we(e) ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement,
                    Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : n === undefined ? ke.css(e, t, i) : ke.style(e, t, n, i)
                }, s, n ? e : undefined, n)
            }
        })
    }),
    ke.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, n) {
        ke.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }),
    ke.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    ke.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }),
    ke.proxy = function(e, t) {
        var n, r, i;
        return "string" == typeof t && (n = e[t],
        t = e,
        e = n),
        xe(e) ? (r = le.call(arguments, 2),
        (i = function() {
            return e.apply(t || this, r.concat(le.call(arguments)))
        }
        ).guid = e.guid = e.guid || ke.guid++,
        i) : undefined
    }
    ,
    ke.holdReady = function(e) {
        e ? ke.readyWait++ : ke.ready(!0)
    }
    ,
    ke.isArray = Array.isArray,
    ke.parseJSON = JSON.parse,
    ke.nodeName = c,
    ke.isFunction = xe,
    ke.isWindow = we,
    ke.camelCase = h,
    ke.type = g,
    ke.now = Date.now,
    ke.isNumeric = function(e) {
        var t = ke.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return ke
    });
    var un = k.jQuery
      , cn = k.$;
    return ke.noConflict = function(e) {
        return k.$ === ke && (k.$ = cn),
        e && k.jQuery === ke && (k.jQuery = un),
        ke
    }
    ,
    e || (k.jQuery = k.$ = ke),
    ke
}),
Date.CultureInfo = {
    name: "en-US",
    englishName: "English (United States)",
    nativeName: "English (United States)",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    amDesignator: "AM",
    pmDesignator: "PM",
    firstDayOfWeek: 0,
    twoDigitYearMax: 2029,
    dateElementOrder: "mdy",
    formatPatterns: {
        shortDate: "M/d/yyyy",
        longDate: "dddd, MMMM dd, yyyy",
        shortTime: "h:mm tt",
        longTime: "h:mm:ss tt",
        fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt",
        sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
        universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
        rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
        monthDay: "MMMM dd",
        yearMonth: "MMMM, yyyy"
    },
    regexPatterns: {
        jan: /^jan(uary)?/i,
        feb: /^feb(ruary)?/i,
        mar: /^mar(ch)?/i,
        apr: /^apr(il)?/i,
        may: /^may/i,
        jun: /^jun(e)?/i,
        jul: /^jul(y)?/i,
        aug: /^aug(ust)?/i,
        sep: /^sep(t(ember)?)?/i,
        oct: /^oct(ober)?/i,
        nov: /^nov(ember)?/i,
        dec: /^dec(ember)?/i,
        sun: /^su(n(day)?)?/i,
        mon: /^mo(n(day)?)?/i,
        tue: /^tu(e(s(day)?)?)?/i,
        wed: /^we(d(nesday)?)?/i,
        thu: /^th(u(r(s(day)?)?)?)?/i,
        fri: /^fr(i(day)?)?/i,
        sat: /^sa(t(urday)?)?/i,
        future: /^next/i,
        past: /^last|past|prev(ious)?/i,
        add: /^(\+|after|from)/i,
        subtract: /^(\-|before|ago)/i,
        yesterday: /^yesterday/i,
        today: /^t(oday)?/i,
        tomorrow: /^tomorrow/i,
        now: /^n(ow)?/i,
        millisecond: /^ms|milli(second)?s?/i,
        second: /^sec(ond)?s?/i,
        minute: /^min(ute)?s?/i,
        hour: /^h(ou)?rs?/i,
        week: /^w(ee)?k/i,
        month: /^m(o(nth)?s?)?/i,
        day: /^d(ays?)?/i,
        year: /^y((ea)?rs?)?/i,
        shortMeridian: /^(a|p)/i,
        longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
        timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,
        ordinalSuffix: /^\s*(st|nd|rd|th)/i,
        timeContext: /^\s*(\:|a|p)/i
    },
    abbreviatedTimeZoneStandard: {
        GMT: "-000",
        EST: "-0400",
        CST: "-0500",
        MST: "-0600",
        PST: "-0700"
    },
    abbreviatedTimeZoneDST: {
        GMT: "-000",
        EDT: "-0500",
        CDT: "-0600",
        MDT: "-0700",
        PDT: "-0800"
    }
},
Date.getMonthNumberFromName = function(e) {
    for (var t = Date.CultureInfo.monthNames, n = Date.CultureInfo.abbreviatedMonthNames, r = e.toLowerCase(), i = 0; i < t.length; i++)
        if (t[i].toLowerCase() == r || n[i].toLowerCase() == r)
            return i;
    return -1
}
,
Date.getDayNumberFromName = function(e) {
    for (var t = Date.CultureInfo.dayNames, n = Date.CultureInfo.abbreviatedDayNames, r = (Date.CultureInfo.shortestDayNames,
    e.toLowerCase()), i = 0; i < t.length; i++)
        if (t[i].toLowerCase() == r || n[i].toLowerCase() == r)
            return i;
    return -1
}
,
Date.isLeapYear = function(e) {
    return e % 4 == 0 && e % 100 != 0 || e % 400 == 0
}
,
Date.getDaysInMonth = function(e, t) {
    return [31, Date.isLeapYear(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t]
}
,
Date.getTimezoneOffset = function(e, t) {
    return t ? Date.CultureInfo.abbreviatedTimeZoneDST[e.toUpperCase()] : Date.CultureInfo.abbreviatedTimeZoneStandard[e.toUpperCase()]
}
,
Date.getTimezoneAbbreviation = function(e, t) {
    var n, r = t ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard;
    for (n in r)
        if (r[n] === e)
            return n;
    return null
}
,
Date.prototype.clone = function() {
    return new Date(this.getTime())
}
,
Date.prototype.compareTo = function(e) {
    if (isNaN(this))
        throw new Error(this);
    if (e instanceof Date && !isNaN(e))
        return e < this ? 1 : this < e ? -1 : 0;
    throw new TypeError(e)
}
,
Date.prototype.equals = function(e) {
    return 0 === this.compareTo(e)
}
,
Date.prototype.between = function(e, t) {
    var n = this.getTime();
    return n >= e.getTime() && n <= t.getTime()
}
,
Date.prototype.addMilliseconds = function(e) {
    return this.setMilliseconds(this.getMilliseconds() + e),
    this
}
,
Date.prototype.addSeconds = function(e) {
    return this.addMilliseconds(1e3 * e)
}
,
Date.prototype.addMinutes = function(e) {
    return this.addMilliseconds(6e4 * e)
}
,
Date.prototype.addHours = function(e) {
    return this.addMilliseconds(36e5 * e)
}
,
Date.prototype.addDays = function(e) {
    return this.addMilliseconds(864e5 * e)
}
,
Date.prototype.addWeeks = function(e) {
    return this.addMilliseconds(6048e5 * e)
}
,
Date.prototype.addMonths = function(e) {
    var t = this.getDate();
    return this.setDate(1),
    this.setMonth(this.getMonth() + e),
    this.setDate(Math.min(t, this.getDaysInMonth())),
    this
}
,
Date.prototype.addYears = function(e) {
    return this.addMonths(12 * e)
}
,
Date.prototype.add = function(e) {
    if ("number" == typeof e)
        return this._orient = e,
        this;
    var t = e;
    return (t.millisecond || t.milliseconds) && this.addMilliseconds(t.millisecond || t.milliseconds),
    (t.second || t.seconds) && this.addSeconds(t.second || t.seconds),
    (t.minute || t.minutes) && this.addMinutes(t.minute || t.minutes),
    (t.hour || t.hours) && this.addHours(t.hour || t.hours),
    (t.month || t.months) && this.addMonths(t.month || t.months),
    (t.year || t.years) && this.addYears(t.year || t.years),
    (t.day || t.days) && this.addDays(t.day || t.days),
    this
}
,
Date._validate = function(e, t, n, r) {
    if ("number" != typeof e)
        throw new TypeError(e + " is not a Number.");
    if (e < t || n < e)
        throw new RangeError(e + " is not a valid value for " + r + ".");
    return !0
}
,
Date.validateMillisecond = function(e) {
    return Date._validate(e, 0, 999, "milliseconds")
}
,
Date.validateSecond = function(e) {
    return Date._validate(e, 0, 59, "seconds")
}
,
Date.validateMinute = function(e) {
    return Date._validate(e, 0, 59, "minutes")
}
,
Date.validateHour = function(e) {
    return Date._validate(e, 0, 23, "hours")
}
,
Date.validateDay = function(e, t, n) {
    return Date._validate(e, 1, Date.getDaysInMonth(t, n), "days")
}
,
Date.validateMonth = function(e) {
    return Date._validate(e, 0, 11, "months")
}
,
Date.validateYear = function(e) {
    return Date._validate(e, 1, 9999, "seconds")
}
,
Date.prototype.set = function(e) {
    var t = e;
    return t.millisecond || 0 === t.millisecond || (t.millisecond = -1),
    t.second || 0 === t.second || (t.second = -1),
    t.minute || 0 === t.minute || (t.minute = -1),
    t.hour || 0 === t.hour || (t.hour = -1),
    t.day || 0 === t.day || (t.day = -1),
    t.month || 0 === t.month || (t.month = -1),
    t.year || 0 === t.year || (t.year = -1),
    -1 != t.millisecond && Date.validateMillisecond(t.millisecond) && this.addMilliseconds(t.millisecond - this.getMilliseconds()),
    -1 != t.second && Date.validateSecond(t.second) && this.addSeconds(t.second - this.getSeconds()),
    -1 != t.minute && Date.validateMinute(t.minute) && this.addMinutes(t.minute - this.getMinutes()),
    -1 != t.hour && Date.validateHour(t.hour) && this.addHours(t.hour - this.getHours()),
    -1 !== t.month && Date.validateMonth(t.month) && this.addMonths(t.month - this.getMonth()),
    -1 != t.year && Date.validateYear(t.year) && this.addYears(t.year - this.getFullYear()),
    -1 != t.day && Date.validateDay(t.day, this.getFullYear(), this.getMonth()) && this.addDays(t.day - this.getDate()),
    t.timezone && this.setTimezone(t.timezone),
    t.timezoneOffset && this.setTimezoneOffset(t.timezoneOffset),
    this
}
,
Date.prototype.clearTime = function() {
    return this.setHours(0),
    this.setMinutes(0),
    this.setSeconds(0),
    this.setMilliseconds(0),
    this
}
,
Date.prototype.isLeapYear = function() {
    var e = this.getFullYear();
    return e % 4 == 0 && e % 100 != 0 || e % 400 == 0
}
,
Date.prototype.isWeekday = function() {
    return !(this.is().sat() || this.is().sun())
}
,
Date.prototype.getDaysInMonth = function() {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth())
}
,
Date.prototype.moveToFirstDayOfMonth = function() {
    return this.set({
        day: 1
    })
}
,
Date.prototype.moveToLastDayOfMonth = function() {
    return this.set({
        day: this.getDaysInMonth()
    })
}
,
Date.prototype.moveToDayOfWeek = function(e, t) {
    var n = (e - this.getDay() + 7 * (t || 1)) % 7;
    return this.addDays(0 === n ? n += 7 * (t || 1) : n)
}
,
Date.prototype.moveToMonth = function(e, t) {
    var n = (e - this.getMonth() + 12 * (t || 1)) % 12;
    return this.addMonths(0 === n ? n += 12 * (t || 1) : n)
}
,
Date.prototype.getDayOfYear = function() {
    return Math.floor((this - new Date(this.getFullYear(),0,1)) / 864e5)
}
,
Date.prototype.getWeekOfYear = function(e) {
    var t = this.getFullYear()
      , n = this.getMonth()
      , r = this.getDate()
      , i = e || Date.CultureInfo.firstDayOfWeek
      , o = 8 - new Date(t,0,1).getDay();
    8 == o && (o = 1);
    var a = (Date.UTC(t, n, r, 0, 0, 0) - Date.UTC(t, 0, 1, 0, 0, 0)) / 864e5 + 1
      , s = Math.floor((a - o + 7) / 7);
    if (s === i) {
        t--;
        var u = 8 - new Date(t,0,1).getDay();
        s = 2 == u || 8 == u ? 53 : 52
    }
    return s
}
,
Date.prototype.isDST = function() {
    return "D" == this.toString().match(/(E|C|M|P)(S|D)T/)[2]
}
,
Date.prototype.getTimezone = function() {
    return Date.getTimezoneAbbreviation(this.getUTCOffset, this.isDST())
}
,
Date.prototype.setTimezoneOffset = function(e) {
    var t = this.getTimezoneOffset()
      , n = -6 * Number(e) / 10;
    return this.addMinutes(n - t),
    this
}
,
Date.prototype.setTimezone = function(e) {
    return this.setTimezoneOffset(Date.getTimezoneOffset(e))
}
,
Date.prototype.getUTCOffset = function() {
    var e, t = -10 * this.getTimezoneOffset() / 6;
    return t < 0 ? (e = (t - 1e4).toString())[0] + e.substr(2) : "+" + (e = (t + 1e4).toString()).substr(1)
}
,
Date.prototype.getDayName = function(e) {
    return e ? Date.CultureInfo.abbreviatedDayNames[this.getDay()] : Date.CultureInfo.dayNames[this.getDay()]
}
,
Date.prototype.getMonthName = function(e) {
    return e ? Date.CultureInfo.abbreviatedMonthNames[this.getMonth()] : Date.CultureInfo.monthNames[this.getMonth()]
}
,
Date.prototype._toString = Date.prototype.toString,
Date.prototype.toString = function(e) {
    var t = this
      , n = function n(e) {
        return 1 == e.toString().length ? "0" + e : e
    };
    return e ? e.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, function(e) {
        switch (e) {
        case "hh":
            return n(t.getHours() < 13 ? t.getHours() : t.getHours() - 12);
        case "h":
            return t.getHours() < 13 ? t.getHours() : t.getHours() - 12;
        case "HH":
            return n(t.getHours());
        case "H":
            return t.getHours();
        case "mm":
            return n(t.getMinutes());
        case "m":
            return t.getMinutes();
        case "ss":
            return n(t.getSeconds());
        case "s":
            return t.getSeconds();
        case "yyyy":
            return t.getFullYear();
        case "yy":
            return t.getFullYear().toString().substring(2, 4);
        case "dddd":
            return t.getDayName();
        case "ddd":
            return t.getDayName(!0);
        case "dd":
            return n(t.getDate());
        case "d":
            return t.getDate().toString();
        case "MMMM":
            return t.getMonthName();
        case "MMM":
            return t.getMonthName(!0);
        case "MM":
            return n(t.getMonth() + 1);
        case "M":
            return t.getMonth() + 1;
        case "t":
            return t.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
        case "tt":
            return t.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
        case "zzz":
        case "zz":
        case "z":
            return ""
        }
    }) : this._toString()
}
,
Date.now = function() {
    return new Date
}
,
Date.today = function() {
    return Date.now().clearTime()
}
,
Date.prototype._orient = 1,
Date.prototype.next = function() {
    return this._orient = 1,
    this
}
,
Date.prototype.last = Date.prototype.prev = Date.prototype.previous = function() {
    return this._orient = -1,
    this
}
,
Date.prototype._is = !1,
Date.prototype.is = function() {
    return this._is = !0,
    this
}
,
Number.prototype._dateElement = "day",
Number.prototype.fromNow = function() {
    var e = {};
    return e[this._dateElement] = this,
    Date.now().add(e)
}
,
Number.prototype.ago = function() {
    var e = {};
    return e[this._dateElement] = -1 * this,
    Date.now().add(e)
}
,
function() {
    for (var e, t = Date.prototype, n = Number.prototype, r = "sunday monday tuesday wednesday thursday friday saturday".split(/\s/), i = "january february march april may june july august september october november december".split(/\s/), o = "Millisecond Second Minute Hour Day Week Month Year".split(/\s/), a = function(e) {
        return function() {
            return this._is ? (this._is = !1,
            this.getDay() == e) : this.moveToDayOfWeek(e, this._orient)
        }
    }, s = 0; s < r.length; s++)
        t[r[s]] = t[r[s].substring(0, 3)] = a(s);
    for (var u = function(e) {
        return function() {
            return this._is ? (this._is = !1,
            this.getMonth() === e) : this.moveToMonth(e, this._orient)
        }
    }, c = 0; c < i.length; c++)
        t[i[c]] = t[i[c].substring(0, 3)] = u(c);
    for (var l = function(e) {
        return function() {
            return "s" != e.substring(e.length - 1) && (e += "s"),
            this["add" + e](this._orient)
        }
    }, f = function(e) {
        return function() {
            return this._dateElement = e,
            this
        }
    }, d = 0; d < o.length; d++)
        t[e = o[d].toLowerCase()] = t[e + "s"] = l(o[d]),
        n[e] = n[e + "s"] = f(e)
}(),
Date.prototype.toJSONString = function() {
    return this.toString("yyyy-MM-ddThh:mm:ssZ")
}
,
Date.prototype.toShortDateString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern)
}
,
Date.prototype.toLongDateString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.longDatePattern)
}
,
Date.prototype.toShortTimeString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern)
}
,
Date.prototype.toLongTimeString = function() {
    return this.toString(Date.CultureInfo.formatPatterns.longTimePattern)
}
,
Date.prototype.getOrdinal = function() {
    switch (this.getDate()) {
    case 1:
    case 21:
    case 31:
        return "st";
    case 2:
    case 22:
        return "nd";
    case 3:
    case 23:
        return "rd";
    default:
        return "th"
    }
}
,
function() {
    Date.Parsing = {
        Exception: function(e) {
            this.message = "Parse error at '" + e.substring(0, 10) + " ...'"
        }
    };
    for (var g = Date.Parsing, y = g.Operators = {
        rtoken: function(n) {
            return function(e) {
                var t = e.match(n);
                if (t)
                    return [t[0], e.substring(t[0].length)];
                throw new g.Exception(e)
            }
        },
        token: function() {
            return function(e) {
                return y.rtoken(new RegExp("^s*" + e + "s*"))(e)
            }
        },
        stoken: function(e) {
            return y.rtoken(new RegExp("^" + e))
        },
        until: function(i) {
            return function(e) {
                for (var t = [], n = null; e.length; ) {
                    try {
                        n = i.call(this, e)
                    } catch (r) {
                        t.push(n[0]),
                        e = n[1];
                        continue
                    }
                    break
                }
                return [t, e]
            }
        },
        many: function(i) {
            return function(e) {
                for (var t = [], n = null; e.length; ) {
                    try {
                        n = i.call(this, e)
                    } catch (r) {
                        return [t, e]
                    }
                    t.push(n[0]),
                    e = n[1]
                }
                return [t, e]
            }
        },
        optional: function(r) {
            return function(e) {
                var t = null;
                try {
                    t = r.call(this, e)
                } catch (n) {
                    return [null, e]
                }
                return [t[0], t[1]]
            }
        },
        not: function(n) {
            return function(e) {
                try {
                    n.call(this, e)
                } catch (t) {
                    return [null, e]
                }
                throw new g.Exception(e)
            }
        },
        ignore: function(t) {
            return t ? function(e) {
                return [null, t.call(this, e)[1]]
            }
            : null
        },
        product: function(e) {
            for (var t = e, n = Array.prototype.slice.call(arguments, 1), r = [], i = 0; i < t.length; i++)
                r.push(y.each(t[i], n));
            return r
        },
        cache: function(n) {
            var r = {}
              , i = null;
            return function(e) {
                try {
                    i = r[e] = r[e] || n.call(this, e)
                } catch (t) {
                    i = r[e] = t
                }
                if (i instanceof g.Exception)
                    throw i;
                return i
            }
        },
        any: function() {
            var i = arguments;
            return function(e) {
                for (var t = null, n = 0; n < i.length; n++)
                    if (null != i[n]) {
                        try {
                            t = i[n].call(this, e)
                        } catch (r) {
                            t = null
                        }
                        if (t)
                            return t
                    }
                throw new g.Exception(e)
            }
        },
        each: function() {
            var o = arguments;
            return function(e) {
                for (var t = [], n = null, r = 0; r < o.length; r++)
                    if (null != o[r]) {
                        try {
                            n = o[r].call(this, e)
                        } catch (i) {
                            throw new g.Exception(e)
                        }
                        t.push(n[0]),
                        e = n[1]
                    }
                return [t, e]
            }
        },
        all: function() {
            var e = arguments
              , t = t;
            return t.each(t.optional(e))
        },
        sequence: function(u, c, l) {
            return c = c || y.rtoken(/^\s*/),
            l = l || null,
            1 == u.length ? u[0] : function(e) {
                for (var t = null, n = null, r = [], i = 0; i < u.length; i++) {
                    try {
                        t = u[i].call(this, e)
                    } catch (o) {
                        break
                    }
                    r.push(t[0]);
                    try {
                        n = c.call(this, t[1])
                    } catch (a) {
                        n = null;
                        break
                    }
                    e = n[1]
                }
                if (!t)
                    throw new g.Exception(e);
                if (n)
                    throw new g.Exception(n[1]);
                if (l)
                    try {
                        t = l.call(this, t[1])
                    } catch (s) {
                        throw new g.Exception(t[1])
                    }
                return [r, t ? t[1] : e]
            }
        },
        between: function(e, t, n) {
            n = n || e;
            var i = y.each(y.ignore(e), t, y.ignore(n));
            return function(e) {
                var t = i.call(this, e);
                return [[t[0][0], r[0][2]], t[1]]
            }
        },
        list: function(e, t, n) {
            return t = t || y.rtoken(/^\s*/),
            n = n || null,
            e instanceof Array ? y.each(y.product(e.slice(0, -1), y.ignore(t)), e.slice(-1), y.ignore(n)) : y.each(y.many(y.each(e, y.ignore(t))), px, y.ignore(n))
        },
        set: function(h, p, m) {
            return p = p || y.rtoken(/^\s*/),
            m = m || null,
            function(e) {
                for (var t = null, n = null, r = null, i = null, o = [[], e], a = !1, s = 0; s < h.length; s++) {
                    t = n = r = null,
                    a = 1 == h.length;
                    try {
                        t = h[s].call(this, e)
                    } catch (l) {
                        continue
                    }
                    if (i = [[t[0]], t[1]],
                    0 < t[1].length && !a)
                        try {
                            r = p.call(this, t[1])
                        } catch (f) {
                            a = !0
                        }
                    else
                        a = !0;
                    if (a || 0 !== r[1].length || (a = !0),
                    !a) {
                        for (var u = [], c = 0; c < h.length; c++)
                            s != c && u.push(h[c]);
                        0 < (n = y.set(u, p).call(this, r[1]))[0].length && (i[0] = i[0].concat(n[0]),
                        i[1] = n[1])
                    }
                    if (i[1].length < o[1].length && (o = i),
                    0 === o[1].length)
                        break
                }
                if (0 === o[0].length)
                    return o;
                if (m) {
                    try {
                        r = m.call(this, o[1])
                    } catch (d) {
                        throw new g.Exception(o[1])
                    }
                    o[1] = r[1]
                }
                return o
            }
        },
        forward: function(t, n) {
            return function(e) {
                return t[n].call(this, e)
            }
        },
        replace: function(n, r) {
            return function(e) {
                var t = n.call(this, e);
                return [r, t[1]]
            }
        },
        process: function(n, r) {
            return function(e) {
                var t = n.call(this, e);
                return [r.call(this, t[0]), t[1]]
            }
        },
        min: function(n, r) {
            return function(e) {
                var t = r.call(this, e);
                if (t[0].length < n)
                    throw new g.Exception(e);
                return t
            }
        }
    }, e = function(o) {
        return function(e) {
            var t = null
              , n = [];
            if (1 < arguments.length ? t = Array.prototype.slice.call(arguments) : e instanceof Array && (t = e),
            !t)
                return o.apply(null, arguments);
            for (var r = 0, i = t.shift(); r < i.length; r++)
                return t.unshift(i[r]),
                n.push(o.apply(null, t)),
                t.shift(),
                n
        }
    }, t = "optional not ignore cache".split(/\s/), n = 0; n < t.length; n++)
        y[t[n]] = e(y[t[n]]);
    for (var i = function(t) {
        return function(e) {
            return e instanceof Array ? t.apply(null, e) : t.apply(null, arguments)
        }
    }, o = "each any all".split(/\s/), a = 0; a < o.length; a++)
        y[o[a]] = i(y[o[a]])
}(),
function() {
    var a = function(e) {
        for (var t = [], n = 0; n < e.length; n++)
            e[n]instanceof Array ? t = t.concat(a(e[n])) : e[n] && t.push(e[n]);
        return t
    };
    Date.Grammar = {},
    Date.Translator = {
        hour: function(e) {
            return function() {
                this.hour = Number(e)
            }
        },
        minute: function(e) {
            return function() {
                this.minute = Number(e)
            }
        },
        second: function(e) {
            return function() {
                this.second = Number(e)
            }
        },
        meridian: function(e) {
            return function() {
                this.meridian = e.slice(0, 1).toLowerCase()
            }
        },
        timezone: function(t) {
            return function() {
                var e = t.replace(/[^\d\+\-]/g, "");
                e.length ? this.timezoneOffset = Number(e) : this.timezone = t.toLowerCase()
            }
        },
        day: function(e) {
            var t = e[0];
            return function() {
                this.day = Number(t.match(/\d+/)[0])
            }
        },
        month: function(e) {
            return function() {
                this.month = 3 == e.length ? Date.getMonthNumberFromName(e) : Number(e) - 1
            }
        },
        year: function(t) {
            return function() {
                var e = Number(t);
                this.year = 2 < t.length ? e : e + (e + 2e3 < Date.CultureInfo.twoDigitYearMax ? 2e3 : 1900)
            }
        },
        rday: function(e) {
            return function() {
                switch (e) {
                case "yesterday":
                    this.days = -1;
                    break;
                case "tomorrow":
                    this.days = 1;
                    break;
                case "today":
                    this.days = 0;
                    break;
                case "now":
                    this.days = 0,
                    this.now = !0
                }
            }
        },
        finishExact: function(e) {
            e = e instanceof Array ? e : [e];
            var t = new Date;
            this.year = t.getFullYear(),
            this.month = t.getMonth(),
            this.day = 1,
            this.hour = 0,
            this.minute = 0;
            for (var n = this.second = 0; n < e.length; n++)
                e[n] && e[n].call(this);
            if (this.hour = "p" == this.meridian && this.hour < 13 ? this.hour + 12 : this.hour,
            this.day > Date.getDaysInMonth(this.year, this.month))
                throw new RangeError(this.day + " is not a valid value for days.");
            var r = new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);
            return this.timezone ? r.set({
                timezone: this.timezone
            }) : this.timezoneOffset && r.set({
                timezoneOffset: this.timezoneOffset
            }),
            r
        },
        finish: function(e) {
            if (0 === (e = e instanceof Array ? a(e) : [e]).length)
                return null;
            for (var t = 0; t < e.length; t++)
                "function" == typeof e[t] && e[t].call(this);
            if (this.now)
                return new Date;
            var n, r, i, o = Date.today();
            return !(null == this.days && !this.orient && !this.operator) ? (i = "past" == this.orient || "subtract" == this.operator ? -1 : 1,
            this.weekday && (this.unit = "day",
            n = Date.getDayNumberFromName(this.weekday) - o.getDay(),
            r = 7,
            this.days = n ? (n + i * r) % r : i * r),
            this.month && (this.unit = "month",
            n = this.month - o.getMonth(),
            r = 12,
            this.months = n ? (n + i * r) % r : i * r,
            this.month = null),
            this.unit || (this.unit = "day"),
            null != this[this.unit + "s"] && null == this.operator || (this.value || (this.value = 1),
            "week" == this.unit && (this.unit = "day",
            this.value = 7 * this.value),
            this[this.unit + "s"] = this.value * i),
            o.add(this)) : (this.meridian && this.hour && (this.hour = this.hour < 13 && "p" == this.meridian ? this.hour + 12 : this.hour),
            this.weekday && !this.day && (this.day = o.addDays(Date.getDayNumberFromName(this.weekday) - o.getDay()).getDate()),
            this.month && !this.day && (this.day = 1),
            o.set(this))
        }
    };
    var e, s = Date.Parsing.Operators, r = Date.Grammar, t = Date.Translator;
    r.datePartDelimiter = s.rtoken(/^([\s\-\.\,\/\x27]+)/),
    r.timePartDelimiter = s.stoken(":"),
    r.whiteSpace = s.rtoken(/^\s*/),
    r.generalDelimiter = s.rtoken(/^(([\s\,]|at|on)+)/);
    var u = {};
    r.ctoken = function(e) {
        var t = u[e];
        if (!t) {
            for (var n = Date.CultureInfo.regexPatterns, r = e.split(/\s+/), i = [], o = 0; o < r.length; o++)
                i.push(s.replace(s.rtoken(n[r[o]]), r[o]));
            t = u[e] = s.any.apply(null, i)
        }
        return t
    }
    ,
    r.ctoken2 = function(e) {
        return s.rtoken(Date.CultureInfo.regexPatterns[e])
    }
    ,
    r.h = s.cache(s.process(s.rtoken(/^(0[0-9]|1[0-2]|[1-9])/), t.hour)),
    r.hh = s.cache(s.process(s.rtoken(/^(0[0-9]|1[0-2])/), t.hour)),
    r.H = s.cache(s.process(s.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/), t.hour)),
    r.HH = s.cache(s.process(s.rtoken(/^([0-1][0-9]|2[0-3])/), t.hour)),
    r.m = s.cache(s.process(s.rtoken(/^([0-5][0-9]|[0-9])/), t.minute)),
    r.mm = s.cache(s.process(s.rtoken(/^[0-5][0-9]/), t.minute)),
    r.s = s.cache(s.process(s.rtoken(/^([0-5][0-9]|[0-9])/), t.second)),
    r.ss = s.cache(s.process(s.rtoken(/^[0-5][0-9]/), t.second)),
    r.hms = s.cache(s.sequence([r.H, r.mm, r.ss], r.timePartDelimiter)),
    r.t = s.cache(s.process(r.ctoken2("shortMeridian"), t.meridian)),
    r.tt = s.cache(s.process(r.ctoken2("longMeridian"), t.meridian)),
    r.z = s.cache(s.process(s.rtoken(/^(\+|\-)?\s*\d\d\d\d?/), t.timezone)),
    r.zz = s.cache(s.process(s.rtoken(/^(\+|\-)\s*\d\d\d\d/), t.timezone)),
    r.zzz = s.cache(s.process(r.ctoken2("timezone"), t.timezone)),
    r.timeSuffix = s.each(s.ignore(r.whiteSpace), s.set([r.tt, r.zzz])),
    r.time = s.each(s.optional(s.ignore(s.stoken("T"))), r.hms, r.timeSuffix),
    r.d = s.cache(s.process(s.each(s.rtoken(/^([0-2]\d|3[0-1]|\d)/), s.optional(r.ctoken2("ordinalSuffix"))), t.day)),
    r.dd = s.cache(s.process(s.each(s.rtoken(/^([0-2]\d|3[0-1])/), s.optional(r.ctoken2("ordinalSuffix"))), t.day)),
    r.ddd = r.dddd = s.cache(s.process(r.ctoken("sun mon tue wed thu fri sat"), function(e) {
        return function() {
            this.weekday = e
        }
    })),
    r.M = s.cache(s.process(s.rtoken(/^(1[0-2]|0\d|\d)/), t.month)),
    r.MM = s.cache(s.process(s.rtoken(/^(1[0-2]|0\d)/), t.month)),
    r.MMM = r.MMMM = s.cache(s.process(r.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), t.month)),
    r.y = s.cache(s.process(s.rtoken(/^(\d\d?)/), t.year)),
    r.yy = s.cache(s.process(s.rtoken(/^(\d\d)/), t.year)),
    r.yyy = s.cache(s.process(s.rtoken(/^(\d\d?\d?\d?)/), t.year)),
    r.yyyy = s.cache(s.process(s.rtoken(/^(\d\d\d\d)/), t.year)),
    e = function() {
        return s.each(s.any.apply(null, arguments), s.not(r.ctoken2("timeContext")))
    }
    ,
    r.day = e(r.d, r.dd),
    r.month = e(r.M, r.MMM),
    r.year = e(r.yyyy, r.yy),
    r.orientation = s.process(r.ctoken("past future"), function(e) {
        return function() {
            this.orient = e
        }
    }),
    r.operator = s.process(r.ctoken("add subtract"), function(e) {
        return function() {
            this.operator = e
        }
    }),
    r.rday = s.process(r.ctoken("yesterday tomorrow today now"), t.rday),
    r.unit = s.process(r.ctoken("minute hour day week month year"), function(e) {
        return function() {
            this.unit = e
        }
    }),
    r.value = s.process(s.rtoken(/^\d\d?(st|nd|rd|th)?/), function(e) {
        return function() {
            this.value = e.replace(/\D/g, "")
        }
    }),
    r.expression = s.set([r.rday, r.operator, r.value, r.unit, r.orientation, r.ddd, r.MMM]),
    e = function() {
        return s.set(arguments, r.datePartDelimiter)
    }
    ,
    r.mdy = e(r.ddd, r.month, r.day, r.year),
    r.ymd = e(r.ddd, r.year, r.month, r.day),
    r.dmy = e(r.ddd, r.day, r.month, r.year),
    r.date = function(e) {
        return (r[Date.CultureInfo.dateElementOrder] || r.mdy).call(this, e)
    }
    ,
    r.format = s.process(s.many(s.any(s.process(s.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function(e) {
        if (r[e])
            return r[e];
        throw Date.Parsing.Exception(e)
    }), s.process(s.rtoken(/^[^dMyhHmstz]+/), function(e) {
        return s.ignore(s.stoken(e))
    }))), function(e) {
        return s.process(s.each.apply(null, e), t.finishExact)
    });
    var n = {}
      , i = function(e) {
        return n[e] = n[e] || r.format(e)[0]
    };
    r.formats = function(e) {
        if (e instanceof Array) {
            for (var t = [], n = 0; n < e.length; n++)
                t.push(i(e[n]));
            return s.any.apply(null, t)
        }
        return i(e)
    }
    ,
    r._formats = r.formats(["yyyy-MM-ddTHH:mm:ss", "ddd, MMM dd, yyyy H:mm:ss tt", "ddd MMM d yyyy HH:mm:ss zzz", "d"]),
    r._start = s.process(s.set([r.date, r.time, r.expression], r.generalDelimiter, r.whiteSpace), t.finish),
    r.start = function(e) {
        try {
            var t = r._formats.call({}, e);
            if (0 === t[1].length)
                return t
        } catch (n) {}
        return r._start.call({}, e)
    }
}(),
Date._parse = Date.parse,
Date.parse = function(e) {
    var t = null;
    if (!e)
        return null;
    try {
        t = Date.Grammar.start.call({}, e)
    } catch (n) {
        return null
    }
    return 0 === t[1].length ? t[0] : null
}
,
Date.getParseFunction = function(e) {
    var r = Date.Grammar.formats(e);
    return function(e) {
        var t = null;
        try {
            t = r.call({}, e)
        } catch (n) {
            return null
        }
        return 0 === t[1].length ? t[0] : null
    }
}
,
Date.parseExact = function(e, t) {
    return Date.getParseFunction(t)(e)
}
,
function() {
    function e(e) {
        this.icon = e,
        this.opacity = .4,
        this.canvas = document.createElement("canvas"),
        this.font = "Helvetica, Arial, sans-serif"
    }
    function r(e) {
        return e = Math.round(e),
        isNaN(e) || e < 1 ? "" : e < 10 ? " " + e : 99 < e ? "99" : e
    }
    function i(e, t, n, r, i) {
        var o, a, s, u, c, l, f, d = document.getElementsByTagName("head")[0], h = document.createElement("link");
        h.rel = "icon",
        a = 11 * (o = r.width / 16),
        c = 11 * (u = o),
        f = 2 * (l = o),
        e.height = e.width = r.width,
        (s = e.getContext("2d")).font = "bold " + a + "px " + n,
        i && (s.globalAlpha = t),
        s.drawImage(r, 0, 0),
        s.globalAlpha = 1,
        s.shadowColor = "#FFF",
        s.shadowBlur = f,
        s.shadowOffsetX = 0,
        s.shadowOffsetY = 0,
        s.fillStyle = "#FFF",
        s.fillText(i, u, c),
        s.fillText(i, u + l, c),
        s.fillText(i, u, c + l),
        s.fillText(i, u + l, c + l),
        s.fillStyle = "#000",
        s.fillText(i, u + l / 2, c + l / 2),
        h.href = e.toDataURL("image/png"),
        d.removeChild(document.querySelector("link[rel=icon]")),
        d.appendChild(h)
    }
    e.prototype.set = function(e) {
        var t = this
          , n = document.createElement("img");
        t.canvas.getContext && (n.crossOrigin = "anonymous",
        n.onload = function() {
            i(t.canvas, t.opacity, t.font, n, r(e))
        }
        ,
        n.src = this.icon)
    }
    ,
    this.Favcount = e
}
.call(this),
function() {
    Favcount.VERSION = "1.5.0"
}
.call(this),
function(t) {
    function s(e, t) {
        for (var n = e.length; n--; )
            if (e[n] === t)
                return n;
        return -1
    }
    function u(e, t) {
        if (e.length != t.length)
            return !1;
        for (var n = 0; n < e.length; n++)
            if (e[n] !== t[n])
                return !1;
        return !0
    }
    function c(e) {
        for (b in w)
            w[b] = e[S[b]]
    }
    function n(e) {
        var t, n, r, i, o, a;
        if (t = e.keyCode,
        -1 == s(M, t) && M.push(t),
        93 != t && 224 != t || (t = 91),
        t in w)
            for (r in w[t] = !0,
            T)
                T[r] == t && (l[r] = !0);
        else if (c(e),
        l.filter.call(this, e) && t in x)
            for (a = h(),
            i = 0; i < x[t].length; i++)
                if ((n = x[t][i]).scope == a || "all" == n.scope) {
                    for (r in o = 0 < n.mods.length,
                    w)
                        (!w[r] && -1 < s(n.mods, +r) || w[r] && -1 == s(n.mods, +r)) && (o = !1);
                    (0 != n.mods.length || w[16] || w[18] || w[17] || w[91]) && !o || !1 === n.method(e, n) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1,
                    e.stopPropagation && e.stopPropagation(),
                    e.cancelBubble && (e.cancelBubble = !0))
                }
    }
    function e(e) {
        var t, n = e.keyCode, r = s(M, n);
        if (0 <= r && M.splice(r, 1),
        93 != n && 224 != n || (n = 91),
        n in w)
            for (t in w[n] = !1,
            T)
                T[t] == n && (l[t] = !1)
    }
    function r() {
        for (b in w)
            w[b] = !1;
        for (b in T)
            l[b] = !1
    }
    function l(e, t, n) {
        var r, i;
        r = m(e),
        n === undefined && (n = t,
        t = "all");
        for (var o = 0; o < r.length; o++)
            i = [],
            1 < (e = r[o].split("+")).length && (i = g(e),
            e = [e[e.length - 1]]),
            e = e[0],
            (e = C(e))in x || (x[e] = []),
            x[e].push({
                shortcut: r[o],
                scope: t,
                method: n,
                key: r[o],
                mods: i
            })
    }
    function i(e, t) {
        var n, r, i, o, a, s = [];
        for (n = m(e),
        o = 0; o < n.length; o++) {
            if (1 < (r = n[o].split("+")).length && (s = g(r),
            e = r[r.length - 1]),
            e = C(e),
            t === undefined && (t = h()),
            !x[e])
                return;
            for (i = 0; i < x[e].length; i++)
                (a = x[e][i]).scope === t && u(a.mods, s) && (x[e][i] = {})
        }
    }
    function o(e) {
        return "string" == typeof e && (e = C(e)),
        -1 != s(M, e)
    }
    function a() {
        return M.slice(0)
    }
    function f(e) {
        var t = (e.target || e.srcElement).tagName;
        return !("INPUT" == t || "SELECT" == t || "TEXTAREA" == t)
    }
    function d(e) {
        D = e || "all"
    }
    function h() {
        return D || "all"
    }
    function p(e) {
        var t, n, r;
        for (t in x)
            for (n = x[t],
            r = 0; r < n.length; )
                n[r].scope === e ? n.splice(r, 1) : r++
    }
    function m(e) {
        var t;
        return "" == (t = (e = e.replace(/\s/g, "")).split(","))[t.length - 1] && (t[t.length - 2] += ","),
        t
    }
    function g(e) {
        for (var t = e.slice(0, e.length - 1), n = 0; n < t.length; n++)
            t[n] = T[t[n]];
        return t
    }
    function y(e, t, n) {
        e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent("on" + t, function() {
            n(window.event)
        })
    }
    function v() {
        var e = t.key;
        return t.key = E,
        e
    }
    var b, x = {}, w = {
        16: !1,
        18: !1,
        17: !1,
        91: !1
    }, D = "all", T = {
        "\u21e7": 16,
        shift: 16,
        "\u2325": 18,
        alt: 18,
        option: 18,
        "\u2303": 17,
        ctrl: 17,
        control: 17,
        "\u2318": 91,
        command: 91
    }, k = {
        backspace: 8,
        tab: 9,
        clear: 12,
        enter: 13,
        "return": 13,
        esc: 27,
        escape: 27,
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        del: 46,
        "delete": 46,
        home: 36,
        end: 35,
        pageup: 33,
        pagedown: 34,
        ",": 188,
        ".": 190,
        "/": 191,
        "`": 192,
        "-": 189,
        "=": 187,
        ";": 186,
        "'": 222,
        "[": 219,
        "]": 221,
        "\\": 220
    }, C = function(e) {
        return k[e] || e.toUpperCase().charCodeAt(0)
    }, M = [];
    for (b = 1; b < 20; b++)
        k["f" + b] = 111 + b;
    var S = {
        16: "shiftKey",
        18: "altKey",
        17: "ctrlKey",
        91: "metaKey"
    };
    for (b in T)
        l[b] = !1;
    y(document, "keydown", function(e) {
        n(e)
    }),
    y(document, "keyup", e),
    y(window, "focus", r);
    var E = t.key;
    t.key = l,
    t.key.setScope = d,
    t.key.getScope = h,
    t.key.deleteScope = p,
    t.key.filter = f,
    t.key.isPressed = o,
    t.key.getPressedKeyCodes = a,
    t.key.noConflict = v,
    t.key.unbind = i,
    "undefined" != typeof module && (module.exports = key)
}(this),
Window.prototype.forceJURL = !1,
function(e) {
    "use strict";
    function v(e) {
        return T[e] !== undefined
    }
    function b() {
        i.call(this),
        this._isInvalid = !0
    }
    function x(e) {
        return "" == e && b.call(this),
        e.toLowerCase()
    }
    function w(e) {
        var t = e.charCodeAt(0);
        return 32 < t && t < 127 && -1 == [34, 35, 60, 62, 63, 96].indexOf(t) ? e : encodeURIComponent(e)
    }
    function D(e) {
        var t = e.charCodeAt(0);
        return 32 < t && t < 127 && -1 == [34, 35, 60, 62, 96].indexOf(t) ? e : encodeURIComponent(e)
    }
    function r(e, t, n) {
        function r(e) {
            c.push(e)
        }
        var i = t || "scheme start"
          , o = 0
          , a = ""
          , s = !1
          , u = !1
          , c = [];
        e: for (; (e[o - 1] != C || 0 == o) && !this._isInvalid; ) {
            var l = e[o];
            switch (i) {
            case "scheme start":
                if (!l || !M.test(l)) {
                    if (t) {
                        r("Invalid scheme.");
                        break e
                    }
                    a = "",
                    i = "no scheme";
                    continue
                }
                a += l.toLowerCase(),
                i = "scheme";
                break;
            case "scheme":
                if (l && S.test(l))
                    a += l.toLowerCase();
                else {
                    if (":" != l) {
                        if (t) {
                            if (C == l)
                                break e;
                            r("Code point not allowed in scheme: " + l);
                            break e
                        }
                        a = "",
                        o = 0,
                        i = "no scheme";
                        continue
                    }
                    if (this._scheme = a,
                    a = "",
                    t)
                        break e;
                    v(this._scheme) && (this._isRelative = !0),
                    i = "file" == this._scheme ? "relative" : this._isRelative && n && n._scheme == this._scheme ? "relative or authority" : this._isRelative ? "authority first slash" : "scheme data"
                }
                break;
            case "scheme data":
                "?" == l ? (this._query = "?",
                i = "query") : "#" == l ? (this._fragment = "#",
                i = "fragment") : C != l && "\t" != l && "\n" != l && "\r" != l && (this._schemeData += w(l));
                break;
            case "no scheme":
                if (n && v(n._scheme)) {
                    i = "relative";
                    continue
                }
                r("Missing scheme."),
                b.call(this);
                break;
            case "relative or authority":
                if ("/" != l || "/" != e[o + 1]) {
                    r("Expected /, got: " + l),
                    i = "relative";
                    continue
                }
                i = "authority ignore slashes";
                break;
            case "relative":
                if (this._isRelative = !0,
                "file" != this._scheme && (this._scheme = n._scheme),
                C == l) {
                    this._host = n._host,
                    this._port = n._port,
                    this._path = n._path.slice(),
                    this._query = n._query,
                    this._username = n._username,
                    this._password = n._password;
                    break e
                }
                if ("/" == l || "\\" == l)
                    "\\" == l && r("\\ is an invalid code point."),
                    i = "relative slash";
                else if ("?" == l)
                    this._host = n._host,
                    this._port = n._port,
                    this._path = n._path.slice(),
                    this._query = "?",
                    this._username = n._username,
                    this._password = n._password,
                    i = "query";
                else {
                    if ("#" != l) {
                        var f = e[o + 1]
                          , d = e[o + 2];
                        ("file" != this._scheme || !M.test(l) || ":" != f && "|" != f || C != d && "/" != d && "\\" != d && "?" != d && "#" != d) && (this._host = n._host,
                        this._port = n._port,
                        this._username = n._username,
                        this._password = n._password,
                        this._path = n._path.slice(),
                        this._path.pop()),
                        i = "relative path";
                        continue
                    }
                    this._host = n._host,
                    this._port = n._port,
                    this._path = n._path.slice(),
                    this._query = n._query,
                    this._fragment = "#",
                    this._username = n._username,
                    this._password = n._password,
                    i = "fragment"
                }
                break;
            case "relative slash":
                if ("/" != l && "\\" != l) {
                    "file" != this._scheme && (this._host = n._host,
                    this._port = n._port,
                    this._username = n._username,
                    this._password = n._password),
                    i = "relative path";
                    continue
                }
                "\\" == l && r("\\ is an invalid code point."),
                i = "file" == this._scheme ? "file host" : "authority ignore slashes";
                break;
            case "authority first slash":
                if ("/" != l) {
                    r("Expected '/', got: " + l),
                    i = "authority ignore slashes";
                    continue
                }
                i = "authority second slash";
                break;
            case "authority second slash":
                if (i = "authority ignore slashes",
                "/" == l)
                    break;
                r("Expected '/', got: " + l);
                continue;
            case "authority ignore slashes":
                if ("/" != l && "\\" != l) {
                    i = "authority";
                    continue
                }
                r("Expected authority, got: " + l);
                break;
            case "authority":
                if ("@" == l) {
                    s && (r("@ already seen."),
                    a += "%40"),
                    s = !0;
                    for (var h = 0; h < a.length; h++) {
                        var p = a[h];
                        if ("\t" != p && "\n" != p && "\r" != p)
                            if (":" != p || null !== this._password) {
                                var m = w(p);
                                null !== this._password ? this._password += m : this._username += m
                            } else
                                this._password = "";
                        else
                            r("Invalid whitespace in authority.")
                    }
                    a = ""
                } else {
                    if (C == l || "/" == l || "\\" == l || "?" == l || "#" == l) {
                        o -= a.length,
                        a = "",
                        i = "host";
                        continue
                    }
                    a += l
                }
                break;
            case "file host":
                if (C == l || "/" == l || "\\" == l || "?" == l || "#" == l) {
                    2 != a.length || !M.test(a[0]) || ":" != a[1] && "|" != a[1] ? (0 == a.length || (this._host = x.call(this, a),
                    a = ""),
                    i = "relative path start") : i = "relative path";
                    continue
                }
                "\t" == l || "\n" == l || "\r" == l ? r("Invalid whitespace in file host.") : a += l;
                break;
            case "host":
            case "hostname":
                if (":" != l || u) {
                    if (C == l || "/" == l || "\\" == l || "?" == l || "#" == l) {
                        if (this._host = x.call(this, a),
                        a = "",
                        i = "relative path start",
                        t)
                            break e;
                        continue
                    }
                    "\t" != l && "\n" != l && "\r" != l ? ("[" == l ? u = !0 : "]" == l && (u = !1),
                    a += l) : r("Invalid code point in host/hostname: " + l)
                } else if (this._host = x.call(this, a),
                a = "",
                i = "port",
                "hostname" == t)
                    break e;
                break;
            case "port":
                if (/[0-9]/.test(l))
                    a += l;
                else {
                    if (C == l || "/" == l || "\\" == l || "?" == l || "#" == l || t) {
                        if ("" != a) {
                            var g = parseInt(a, 10);
                            g != T[this._scheme] && (this._port = g + ""),
                            a = ""
                        }
                        if (t)
                            break e;
                        i = "relative path start";
                        continue
                    }
                    "\t" == l || "\n" == l || "\r" == l ? r("Invalid code point in port: " + l) : b.call(this)
                }
                break;
            case "relative path start":
                if ("\\" == l && r("'\\' not allowed in path."),
                i = "relative path",
                "/" != l && "\\" != l)
                    continue;
                break;
            case "relative path":
                var y;
                if (C != l && "/" != l && "\\" != l && (t || "?" != l && "#" != l))
                    "\t" != l && "\n" != l && "\r" != l && (a += w(l));
                else
                    "\\" == l && r("\\ not allowed in relative path."),
                    (y = k[a.toLowerCase()]) && (a = y),
                    ".." == a ? (this._path.pop(),
                    "/" != l && "\\" != l && this._path.push("")) : "." == a && "/" != l && "\\" != l ? this._path.push("") : "." != a && ("file" == this._scheme && 0 == this._path.length && 2 == a.length && M.test(a[0]) && "|" == a[1] && (a = a[0] + ":"),
                    this._path.push(a)),
                    a = "",
                    "?" == l ? (this._query = "?",
                    i = "query") : "#" == l && (this._fragment = "#",
                    i = "fragment");
                break;
            case "query":
                t || "#" != l ? C != l && "\t" != l && "\n" != l && "\r" != l && (this._query += D(l)) : (this._fragment = "#",
                i = "fragment");
                break;
            case "fragment":
                C != l && "\t" != l && "\n" != l && "\r" != l && (this._fragment += l)
            }
            o++
        }
    }
    function i() {
        this._scheme = "",
        this._schemeData = "",
        this._username = "",
        this._password = null,
        this._host = "",
        this._port = "",
        this._path = [],
        this._query = "",
        this._fragment = "",
        this._isInvalid = !1,
        this._isRelative = !1
    }
    function o(e, t) {
        t === undefined || t instanceof o || (t = new o(String(t))),
        this._url = "" + e,
        i.call(this);
        var n = this._url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
        r.call(this, n, null, t)
    }
    var t = !1;
    if (!e.forceJURL)
        try {
            var n = new URL("b","http://a");
            n.pathname = "c%20d",
            t = "http://a/c%20d" === n.href
        } catch (s) {}
    if (!t) {
        var T = Object.create(null);
        T.ftp = 21,
        T.file = 0,
        T.gopher = 70,
        T.http = 80,
        T.https = 443,
        T.ws = 80,
        T.wss = 443;
        var k = Object.create(null);
        k["%2e"] = ".",
        k[".%2e"] = "..",
        k["%2e."] = "..",
        k["%2e%2e"] = "..";
        var C = undefined
          , M = /[a-zA-Z]/
          , S = /[a-zA-Z0-9\+\-\.]/;
        o.prototype = {
            toString: function() {
                return this.href
            },
            get href() {
                if (this._isInvalid)
                    return this._url;
                var e = "";
                return "" == this._username && null == this._password || (e = this._username + (null != this._password ? ":" + this._password : "") + "@"),
                this.protocol + (this._isRelative ? "//" + e + this.host : "") + this.pathname + this._query + this._fragment
            },
            set href(e) {
                i.call(this),
                r.call(this, e)
            },
            get protocol() {
                return this._scheme + ":"
            },
            set protocol(e) {
                this._isInvalid || r.call(this, e + ":", "scheme start")
            },
            get host() {
                return this._isInvalid ? "" : this._port ? this._host + ":" + this._port : this._host
            },
            set host(e) {
                !this._isInvalid && this._isRelative && r.call(this, e, "host")
            },
            get hostname() {
                return this._host
            },
            set hostname(e) {
                !this._isInvalid && this._isRelative && r.call(this, e, "hostname")
            },
            get port() {
                return this._port
            },
            set port(e) {
                !this._isInvalid && this._isRelative && r.call(this, e, "port")
            },
            get pathname() {
                return this._isInvalid ? "" : this._isRelative ? "/" + this._path.join("/") : this._schemeData
            },
            set pathname(e) {
                !this._isInvalid && this._isRelative && (this._path = [],
                r.call(this, e, "relative path start"))
            },
            get search() {
                return this._isInvalid || !this._query || "?" == this._query ? "" : this._query
            },
            set search(e) {
                !this._isInvalid && this._isRelative && ((this._query = "?") == e[0] && (e = e.slice(1)),
                r.call(this, e, "query"))
            },
            get hash() {
                return this._isInvalid || !this._fragment || "#" == this._fragment ? "" : this._fragment
            },
            set hash(e) {
                this._isInvalid || (e ? ((this._fragment = "#") == e[0] && (e = e.slice(1)),
                r.call(this, e, "fragment")) : this._fragment = "")
            },
            get origin() {
                var e;
                if (this._isInvalid || !this._scheme)
                    return "";
                switch (this._scheme) {
                case "data":
                case "file":
                case "javascript":
                case "mailto":
                    return "null"
                }
                return (e = this.host) ? this._scheme + "://" + e : ""
            }
        };
        var a = e.URL;
        a && (o.createObjectURL = function() {
            return a.createObjectURL.apply(a, arguments)
        }
        ,
        o.revokeObjectURL = function(e) {
            a.revokeObjectURL(e)
        }
        ),
        e.URL = o
    }
}(window),
function() {
    var e, p = function(e, t) {
        return function() {
            return e.apply(t, arguments)
        }
    };
    jQuery.expr.pseudos.icontains = function(e, t, n) {
        var r, i;
        return 0 <= (null != (r = null != (i = e.textContent) ? i : e.innerText) ? r : "").toUpperCase().indexOf(n[3].toUpperCase())
    }
    ,
    e = function() {
        function e() {
            var t, n, r, e, i, o, a, s, u, c, l, f, d, h;
            this.nextTab = p(this.nextTab, this),
            this.previousTab = p(this.previousTab, this),
            this.openTab = p(this.openTab, this),
            this.selectedTab = p(this.selectedTab, this),
            this.getTab = p(this.getTab, this),
            $("#messages").on("click", "tr", (t = this,
            function(e) {
                return e.preventDefault(),
                t.loadMessage($(e.currentTarget).attr("data-message-id"))
            }
            )),
            $("input[name=search]").on("keyup", (n = this,
            function(e) {
                var t;
                return (t = $.trim($(e.currentTarget).val())) ? n.searchMessages(t) : n.clearSearch()
            }
            )),
            $("#message").on("click", ".views .format.tab a", (r = this,
            function(e) {
                return e.preventDefault(),
                r.loadMessageBody(r.selectedMessage(), $($(e.currentTarget).parent("li")).data("message-format"))
            }
            )),
            $("#message iframe").on("load", (e = this,
            function() {
                return e.decorateMessageBody()
            }
            )),
            $("#resizer").on("mousedown", (i = this,
            function(e) {
                var t;
                return e.preventDefault(),
                t = {
                    mouseup: function(e) {
                        return e.preventDefault(),
                        $(window).off(t)
                    },
                    mousemove: function(e) {
                        return e.preventDefault(),
                        i.resizeTo(e.clientY)
                    }
                },
                $(window).on(t)
            }
            )),
            this.resizeToSaved(),
            $("nav.app .clear a").on("click", (o = this,
            function(e) {
                if (e.preventDefault(),
                confirm("You will lose all your received messages.\n\nAre you sure you want to clear all messages?"))
                    return $.ajax({
                        url: new URL("messages",document.baseURI).toString(),
                        type: "DELETE",
                        success: function() {
                            return o.clearMessages()
                        },
                        error: function() {
                            return alert("Error while clearing all messages.")
                        }
                    })
            }
            )),
            $("nav.app .quit a").on("click", (a = this,
            function(e) {
                if (e.preventDefault(),
                confirm("You will lose all your received messages.\n\nAre you sure you want to quit?"))
                    return a.quitting = !0,
                    $.ajax({
                        type: "DELETE",
                        success: function() {
                            return a.hasQuit()
                        },
                        error: function() {
                            return a.quitting = !1,
                            alert("Error while quitting.")
                        }
                    })
            }
            )),
            this.favcount = new Favcount($('link[rel="icon"]').attr("href")),
            key("up", (s = this,
            function() {
                return s.selectedMessage() ? s.loadMessage($("#messages tr.selected").prevAll(":visible").first().data("message-id")) : s.loadMessage($("#messages tbody tr[data-message-id]").first().data("message-id")),
                !1
            }
            )),
            key("down", (u = this,
            function() {
                return u.selectedMessage() ? u.loadMessage($("#messages tr.selected").nextAll(":visible").data("message-id")) : u.loadMessage($("#messages tbody tr[data-message-id]:first").data("message-id")),
                !1
            }
            )),
            key("\u2318+up, ctrl+up", (c = this,
            function() {
                return c.loadMessage($("#messages tbody tr[data-message-id]:visible").first().data("message-id")),
                !1
            }
            )),
            key("\u2318+down, ctrl+down", (l = this,
            function() {
                return l.loadMessage($("#messages tbody tr[data-message-id]:visible").first().data("message-id")),
                !1
            }
            )),
            key("left", (f = this,
            function() {
                return f.openTab(f.previousTab()),
                !1
            }
            )),
            key("right", (d = this,
            function() {
                return d.openTab(d.nextTab()),
                !1
            }
            )),
            key("backspace, delete", (h = this,
            function() {
                var e;
                return null != (e = h.selectedMessage()) && $.ajax({
                    url: new URL("messages/" + e,document.baseURI).toString(),
                    type: "DELETE",
                    success: function() {
                        return h.removeMessage(e)
                    },
                    error: function() {
                        return alert("Error while removing message.")
                    }
                }),
                !1
            }
            )),
            this.refresh(),
            this.subscribe()
        }
        return e.prototype.parseDateRegexp = /^(\d{4})[-\/\\](\d{2})[-\/\\](\d{2})(?:\s+|T)(\d{2})[:-](\d{2})[:-](\d{2})(?:([ +-]\d{2}:\d{2}|\s*\S+|Z?))?$/,
        e.prototype.parseDate = function(e) {
            var t;
            if (t = this.parseDateRegexp.exec(e))
                return new Date(t[1],t[2] - 1,t[3],t[4],t[5],t[6],0)
        }
        ,
        e.prototype.offsetTimeZone = function(e) {
            var t;
            return t = 6e4 * Date.now().getTimezoneOffset(),
            e.setTime(e.getTime() - t),
            e
        }
        ,
        e.prototype.formatDate = function(e) {
            return "string" == typeof e && e && (e = this.parseDate(e)),
            e && (e = this.offsetTimeZone(e)),
            e && e.toString("dddd, d MMM yyyy h:mm:ss tt")
        }
        ,
        e.prototype.messagesCount = function() {
            return $("#messages tr").length - 1
        }
        ,
        e.prototype.updateMessagesCount = function() {
            return this.favcount.set(this.messagesCount()),
            document.title = "MailCatcher (" + this.messagesCount() + ")"
        }
        ,
        e.prototype.tabs = function() {
            return $("#message ul").children(".tab")
        }
        ,
        e.prototype.getTab = function(e) {
            return $(this.tabs()[e])
        }
        ,
        e.prototype.selectedTab = function() {
            return this.tabs().index($("#message li.tab.selected"))
        }
        ,
        e.prototype.openTab = function(e) {
            return this.getTab(e).children("a").click()
        }
        ,
        e.prototype.previousTab = function(e) {
            var t;
            return (t = e || 0 === e ? e : this.selectedTab() - 1) < 0 && (t = this.tabs().length - 1),
            this.getTab(t).is(":visible") ? t : this.previousTab(t - 1)
        }
        ,
        e.prototype.nextTab = function(e) {
            var t;
            return (t = e || this.selectedTab() + 1) > this.tabs().length - 1 && (t = 0),
            this.getTab(t).is(":visible") ? t : this.nextTab(t + 1)
        }
        ,
        e.prototype.haveMessage = function(e) {
            return null != e.id && (e = e.id),
            0 < $('#messages tbody tr[data-message-id="' + e + '"]').length
        }
        ,
        e.prototype.selectedMessage = function() {
            return $("#messages tr.selected").data("message-id")
        }
        ,
        e.prototype.searchMessages = function(i) {
            var e, t, o;
            return t = function() {
                var e, t, n, r;
                for (r = [],
                e = 0,
                t = (n = i.split(/\s+/)).length; e < t; e++)
                    o = n[e],
                    r.push(":icontains('" + o + "')");
                return r
            }().join(""),
            (e = $("#messages tbody tr")).not(t).hide(),
            e.filter(t).show()
        }
        ,
        e.prototype.clearSearch = function() {
            return $("#messages tbody tr").show()
        }
        ,
        e.prototype.addMessage = function(e) {
            return $("<tr />").attr("data-message-id", e.id.toString()).append($("<td/>").text(e.sender || "No sender").toggleClass("blank", !e.sender)).append($("<td/>").text((e.recipients || []).join(", ") || "No receipients").toggleClass("blank", !e.recipients.length)).append($("<td/>").text(e.subject || "No subject").toggleClass("blank", !e.subject)).append($("<td/>").text(this.formatDate(e.created_at))).prependTo($("#messages tbody")),
            this.updateMessagesCount()
        }
        ,
        e.prototype.removeMessage = function(e) {
            var t, n, r;
            return (t = (n = $('#messages tbody tr[data-message-id="' + e + '"]')).is(".selected")) && (r = n.next().data("message-id") || n.prev().data("message-id")),
            n.remove(),
            t && (r ? this.loadMessage(r) : this.unselectMessage()),
            this.updateMessagesCount()
        }
        ,
        e.prototype.clearMessages = function() {
            return $("#messages tbody tr").remove(),
            this.unselectMessage(),
            this.updateMessagesCount()
        }
        ,
        e.prototype.scrollToRow = function(e) {
            var t, n;
            return (n = e.offset().top - $("#messages").offset().top) < 0 ? $("#messages").scrollTop($("#messages").scrollTop() + n - 20) : 0 < (t = n + e.height() - $("#messages").height()) ? $("#messages").scrollTop($("#messages").scrollTop() + t + 20) : void 0
        }
        ,
        e.prototype.unselectMessage = function() {
            return $("#messages tbody, #message .metadata dd").empty(),
            $("#message .metadata .attachments").hide(),
            $("#message iframe").attr("src", "about:blank"),
            null
        }
        ,
        e.prototype.loadMessage = function(o) {
            var e, t;
            if (null != (null != o ? o.id : void 0) && (o = o.id),
            o || (o = $("#messages tr.selected").attr("data-message-id")),
            null != o)
                return $("#messages tbody tr:not([data-message-id='" + o + "'])").removeClass("selected"),
                (e = $("#messages tbody tr[data-message-id='" + o + "']")).addClass("selected"),
                this.scrollToRow(e),
                $.getJSON("messages/" + o + ".json", (t = this,
                function(i) {
                    var n;
                    return $("#message .metadata dd.created_at").text(t.formatDate(i.created_at)),
                    $("#message .metadata dd.from").text(i.sender),
                    $("#message .metadata dd.to").text((i.recipients || []).join(", ")),
                    $("#message .metadata dd.subject").text(i.subject),
                    $("#message .views .tab.format").each(function(e, t) {
                        var n, r;
                        return r = (n = $(t)).attr("data-message-format"),
                        0 <= $.inArray(r, i.formats) ? (n.find("a").attr("href", "messages/" + o + "." + r),
                        n.show()) : n.hide()
                    }),
                    $("#message .views .tab.selected:not(:visible)").length && ($("#message .views .tab.selected").removeClass("selected"),
                    $("#message .views .tab:visible:first").addClass("selected")),
                    i.attachments.length ? (n = $("<ul/>").appendTo($("#message .metadata dd.attachments").empty()),
                    $.each(i.attachments, function(e, t) {
                        return n.append($("<li>").append($("<a>").attr("href", "messages/" + o + "/parts/" + t.cid).addClass(t.type.split("/", 1)[0]).addClass(t.type.replace("/", "-")).text(t.filename)))
                    }),
                    $("#message .metadata .attachments").show()) : $("#message .metadata .attachments").hide(),
                    $("#message .views .download a").attr("href", "messages/" + o + ".eml"),
                    t.loadMessageBody()
                }
                ))
        }
        ,
        e.prototype.loadMessageBody = function(e, t) {
            if (e || (e = this.selectedMessage()),
            t || (t = $("#message .views .tab.format.selected").attr("data-message-format")),
            t || (t = "html"),
            $('#message .views .tab[data-message-format="' + t + '"]:not(.selected)').addClass("selected"),
            $('#message .views .tab:not([data-message-format="' + t + '"]).selected').removeClass("selected"),
            null != e)
                return $("#message iframe").attr("src", "messages/" + e + "." + t)
        }
        ,
        e.prototype.decorateMessageBody = function() {
            var e, t, n;
            switch ($("#message .views .tab.format.selected").attr("data-message-format")) {
            case "html":
                return e = $("#message iframe").contents().find("body"),
                $("a", e).attr("target", "_blank");
            case "plain":
                return n = (n = (n = (n = (n = (n = (t = $("#message iframe").contents()).text()).replace(/&/g, "&amp;")).replace(/</g, "&lt;")).replace(/>/g, "&gt;")).replace(/"/g, "&quot;")).replace(/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?)/g, '<a href="$1" target="_blank">$1</a>'),
                t.find("html").html('<body style="font-family: sans-serif; white-space: pre-wrap">' + n + "</body>")
            }
        }
        ,
        e.prototype.refresh = function() {
            return $.getJSON("messages", (n = this,
            function(e) {
                return $.each(e, function(e, t) {
                    if (!n.haveMessage(t))
                        return n.addMessage(t)
                }),
                n.updateMessagesCount()
            }
            ));
            var n
        }
        ,
        e.prototype.subscribe = function() {
            return "undefined" != typeof WebSocket && null !== WebSocket ? this.subscribeWebSocket() : this.subscribePoll()
        }
        ,
        e.prototype.subscribeWebSocket = function() {
            var e, t, n;
            return e = "https:" === window.location.protocol,
            (t = new URL("messages",document.baseURI)).protocol = e ? "wss" : "ws",
            this.websocket = new WebSocket(t.toString()),
            this.websocket.onmessage = (n = this,
            function(e) {
                var t;
                return "add" === (t = JSON.parse(e.data)).type ? n.addMessage(t.message) : "remove" === t.type ? n.removeMessage(t.id) : "clear" === t.type ? n.clearMessages() : "quit" !== t.type || n.quitting ? void 0 : (alert("MailCatcher has been quit"),
                n.hasQuit())
            }
            )
        }
        ,
        e.prototype.subscribePoll = function() {
            if (null == this.refreshInterval)
                return this.refreshInterval = setInterval((e = this,
                function() {
                    return e.refresh()
                }
                ), 1e3);
            var e
        }
        ,
        e.prototype.resizeToSavedKey = "mailcatcherSeparatorHeight",
        e.prototype.resizeTo = function(e) {
            var t;
            return $("#messages").css({
                height: e - $("#messages").offset().top
            }),
            null != (t = window.localStorage) ? t.setItem(this.resizeToSavedKey, e) : void 0
        }
        ,
        e.prototype.resizeToSaved = function() {
            var e, t;
            if (e = parseInt(null != (t = window.localStorage) ? t.getItem(this.resizeToSavedKey) : void 0),
            !isNaN(e))
                return this.resizeTo(e)
        }
        ,
        e.prototype.hasQuit = function() {
            return location.assign($("body > header h1 a").attr("href"))
        }
        ,
        e
    }(),
    $(function() {
        return window.MailCatcher = new e
    })
}
.call(this);
