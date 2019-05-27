! function (a, b, c, d) {
    function e(b, c) {
        this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        }, this._states = {
            current: {},
            tags: {
                initializing: ["busy"],
                animating: ["busy"],
                dragging: ["interacting"]
            }
        }, a.each(["onResize", "onThrottledResize"], a.proxy(function (b, c) {
            this._handlers[c] = a.proxy(this[c], this)
        }, this)), a.each(e.Plugins, a.proxy(function (a, b) {
            this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this)
        }, this)), a.each(e.Workers, a.proxy(function (b, c) {
            this._pipe.push({
                filter: c.filter,
                run: a.proxy(c.run, this)
            })
        }, this)), this.setup(), this.initialize()
    }
    e.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: b,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    }, e.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    }, e.Type = {
        Event: "event",
        State: "state"
    }, e.Plugins = {}, e.Workers = [{
        filter: ["width", "settings"],
        run: function () {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            a.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            var b = this.settings.margin || "",
                c = !this.settings.autoWidth,
                d = this.settings.rtl,
                e = {
                    width: "auto",
                    "margin-left": d ? b : "",
                    "margin-right": d ? "" : b
                };
            !c && this.$stage.children().css(e), a.css = e
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                c = null,
                d = this._items.length,
                e = !this.settings.autoWidth,
                f = [];
            for (a.items = {
                    merge: !1,
                    width: b
                }; d--;) c = this._mergers[d], c = this.settings.mergeFit && Math.min(c, this.settings.items) || c, a.items.merge = c > 1 || a.items.merge, f[d] = e ? b * c : this._items[d].width();
            this._widths = f
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            var b = [],
                c = this._items,
                d = this.settings,
                e = Math.max(2 * d.items, 4),
                f = 2 * Math.ceil(c.length / 2),
                g = d.loop && c.length ? d.rewind ? e : Math.max(e, f) : 0,
                h = "",
                i = "";
            for (g /= 2; g--;) b.push(this.normalize(b.length / 2, !0)), h += c[b[b.length - 1]][0].outerHTML, b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)), i = c[b[b.length - 1]][0].outerHTML + i;
            this._clones = b, a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b;) d = f[c - 1] || 0, e = this._widths[this.relative(c)] + this.settings.margin, f.push(d + e * a);
            this._coordinates = f
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            var a = this.settings.stagePadding,
                b = this._coordinates,
                c = {
                    width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
                    "padding-left": a || "",
                    "padding-right": a || ""
                };
            this.$stage.css(c)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            var b = this._coordinates.length,
                c = !this.settings.autoWidth,
                d = this.$stage.children();
            if (c && a.items.merge)
                for (; b--;) a.css.width = this._widths[this.relative(b)], d.eq(b).css(a.css);
            else c && (a.css.width = a.items.width, d.css(a.css))
        }
    }, {
        filter: ["items"],
        run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            a.current = a.current ? this.$stage.children().index(a.current) : 0, a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current)), this.reset(a.current)
        }
    }, {
        filter: ["position"],
        run: function () {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"],
        run: function () {
            var a, b, c, d, e = this.settings.rtl ? 1 : -1,
                f = 2 * this.settings.stagePadding,
                g = this.coordinates(this.current()) + f,
                h = g + this.width() * e,
                i = [];
            for (c = 0, d = this._coordinates.length; c < d; c++) a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
            this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"), this.settings.center && (this.$stage.children(".center").removeClass("center"), this.$stage.children().eq(this.current()).addClass("center"))
        }
    }], e.prototype.initialize = function () {
        if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
            var b, c, e;
            b = this.$element.find("img"), c = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, e = this.$element.children(c).width(), b.length && e <= 0 && this.preloadAutoWidthImages(b)
        }
        this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this.$element.is(":visible") ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
    }, e.prototype.setup = function () {
        var b = this.viewport(),
            c = this.options.responsive,
            d = -1,
            e = null;
        c ? (a.each(c, function (a) {
            a <= b && a > d && (d = Number(a))
        }), e = a.extend({}, this.options, c[d]), "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()), delete e.responsive, e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d))) : e = a.extend({}, this.options), this.trigger("change", {
            property: {
                name: "settings",
                value: e
            }
        }), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }, e.prototype.optionsLogic = function () {
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, e.prototype.prepare = function (b) {
        var c = this.trigger("prepare", {
            content: b
        });
        return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b)), this.trigger("prepared", {
            content: c.data
        }), c.data
    }, e.prototype.update = function () {
        for (var b = 0, c = this._pipe.length, d = a.proxy(function (a) {
                return this[a]
            }, this._invalidated), e = {}; b < c;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
        this._invalidated = {}, !this.is("valid") && this.enter("valid")
    }, e.prototype.width = function (a) {
        switch (a = a || e.Width.Default) {
            case e.Width.Inner:
            case e.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, e.prototype.refresh = function () {
        this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
    }, e.prototype.onThrottledResize = function () {
        b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }, e.prototype.onResize = function () {
        return !!this._items.length && (this._width !== this.$element.width() && (!!this.$element.is(":visible") && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))))
    }, e.prototype.registerEventHandlers = function () {
        a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)), this.settings.responsive !== !1 && this.on(b, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
            return !1
        })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)))
    }, e.prototype.onDragStart = function (b) {
        var d = null;
        3 !== b.which && (a.support.transform ? (d = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d = {
            x: d[16 === d.length ? 12 : 4],
            y: d[16 === d.length ? 13 : 5]
        }) : (d = this.$stage.position(), d = {
            x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left,
            y: d.top
        }), this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = a(b.target), this._drag.stage.start = d, this._drag.stage.current = d, this._drag.pointer = this.pointer(b), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), Math.abs(d.x) < Math.abs(d.y) && this.is("valid") || (b.preventDefault(), this.enter("dragging"), this.trigger("drag"))
        }, this)))
    }, e.prototype.onDragMove = function (a) {
        var b = null,
            c = null,
            d = null,
            e = this.difference(this._drag.pointer, this.pointer(a)),
            f = this.difference(this._drag.stage.start, e);
        this.is("dragging") && (a.preventDefault(), this.settings.loop ? (b = this.coordinates(this.minimum()), c = this.coordinates(this.maximum() + 1) - b, f.x = ((f.x - b) % c + c) % c + b) : (b = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), c = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), d = this.settings.pullDrag ? -1 * e.x / 5 : 0, f.x = Math.max(Math.min(f.x, b + d), c + d)), this._drag.stage.current = f, this.animate(f.x))
    }, e.prototype.onDragEnd = function (b) {
        var d = this.difference(this._drag.pointer, this.pointer(b)),
            e = this._drag.stage.current,
            f = d.x > 0 ^ this.settings.rtl ? "left" : "right";
        a(c).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== d.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function () {
            return !1
        })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
    }, e.prototype.closest = function (b, c) {
        var d = -1,
            e = 30,
            f = this.width(),
            g = this.coordinates();
        return this.settings.freeDrag || a.each(g, a.proxy(function (a, h) {
            return "left" === c && b > h - e && b < h + e ? d = a : "right" === c && b > h - f - e && b < h - f + e ? d = a + 1 : this.op(b, "<", h) && this.op(b, ">", g[a + 1] || h - f) && (d = "left" === c ? a + 1 : a), d === -1
        }, this)), this.settings.loop || (this.op(b, ">", g[this.minimum()]) ? d = b = this.minimum() : this.op(b, "<", g[this.maximum()]) && (d = b = this.maximum())), d
    }, e.prototype.animate = function (b) {
        var c = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd(), c && (this.enter("animating"), this.trigger("translate")), a.support.transform3d && a.support.transition ? this.$stage.css({
            transform: "translate3d(" + b + "px,0px,0px)",
            transition: this.speed() / 1e3 + "s"
        }) : c ? this.$stage.animate({
            left: b + "px"
        }, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({
            left: b + "px"
        })
    }, e.prototype.is = function (a) {
        return this._states.current[a] && this._states.current[a] > 0
    }, e.prototype.current = function (a) {
        if (a === d) return this._current;
        if (0 === this._items.length) return d;
        if (a = this.normalize(a), this._current !== a) {
            var b = this.trigger("change", {
                property: {
                    name: "position",
                    value: a
                }
            });
            b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, e.prototype.invalidate = function (b) {
        return "string" === a.type(b) && (this._invalidated[b] = !0, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function (a, b) {
            return b
        })
    }, e.prototype.reset = function (a) {
        a = this.normalize(a), a !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]))
    }, e.prototype.normalize = function (a, b) {
        var c = this._items.length,
            e = b ? 0 : this._clones.length;
        return !this.isNumeric(a) || c < 1 ? a = d : (a < 0 || a >= c + e) && (a = ((a - e / 2) % c + c) % c + e / 2), a
    }, e.prototype.relative = function (a) {
        return a -= this._clones.length / 2, this.normalize(a, !0)
    }, e.prototype.maximum = function (a) {
        var b, c, d, e = this.settings,
            f = this._coordinates.length;
        if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
        else if (e.autoWidth || e.merge) {
            for (b = this._items.length, c = this._items[--b].width(), d = this.$element.width(); b-- && (c += this._items[b].width() + this.settings.margin, !(c > d)););
            f = b + 1
        } else f = e.center ? this._items.length - 1 : this._items.length - e.items;
        return a && (f -= this._clones.length / 2), Math.max(f, 0)
    }, e.prototype.minimum = function (a) {
        return a ? 0 : this._clones.length / 2
    }, e.prototype.items = function (a) {
        return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a])
    }, e.prototype.mergers = function (a) {
        return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a])
    }, e.prototype.clones = function (b) {
        var c = this._clones.length / 2,
            e = c + this._items.length,
            f = function (a) {
                return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2
            };
        return b === d ? a.map(this._clones, function (a, b) {
            return f(b)
        }) : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null
        })
    }, e.prototype.speed = function (a) {
        return a !== d && (this._speed = a), this._speed
    }, e.prototype.coordinates = function (b) {
        var c, e = 1,
            f = b - 1;
        return b === d ? a.map(this._coordinates, a.proxy(function (a, b) {
            return this.coordinates(b)
        }, this)) : (this.settings.center ? (this.settings.rtl && (e = -1, f = b + 1), c = this._coordinates[b], c += (this.width() - c + (this._coordinates[f] || 0)) / 2 * e) : c = this._coordinates[f] || 0, c = Math.ceil(c))
    }, e.prototype.duration = function (a, b, c) {
        return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed)
    }, e.prototype.to = function (a, b) {
        var c = this.current(),
            d = null,
            e = a - this.relative(c),
            f = (e > 0) - (e < 0),
            g = this._items.length,
            h = this.minimum(),
            i = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += f * -1 * g), a = c + e, d = ((a - h) % g + g) % g + h, d !== a && d - e <= i && d - e > 0 && (c = d - e, a = d, this.reset(c))) : this.settings.rewind ? (i += 1, a = (a % i + i) % i) : a = Math.max(h, Math.min(i, a)), this.speed(this.duration(c, a, b)), this.current(a), this.$element.is(":visible") && this.update()
    }, e.prototype.next = function (a) {
        a = a || !1, this.to(this.relative(this.current()) + 1, a)
    }, e.prototype.prev = function (a) {
        a = a || !1, this.to(this.relative(this.current()) - 1, a)
    }, e.prototype.onTransitionEnd = function (a) {
        if (a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))) return !1;
        this.leave("animating"), this.trigger("translated")
    }, e.prototype.viewport = function () {
        var d;
        return this.options.responsiveBaseElement !== b ? d = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d
    }, e.prototype.replace = function (b) {
        this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function () {
            return 1 === this.nodeType
        }).each(a.proxy(function (a, b) {
            b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, e.prototype.add = function (b, c) {
        var e = this.relative(this._current);
        c = c === d ? this._items.length : this.normalize(c, !0), b = b instanceof jQuery ? b : a(b), this.trigger("add", {
            content: b,
            position: c
        }), b = this.prepare(b), 0 === this._items.length || c === this._items.length ? (0 === this._items.length && this.$stage.append(b), 0 !== this._items.length && this._items[c - 1].after(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[c].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[e] && this.reset(this._items[e].index()), this.invalidate("items"), this.trigger("added", {
            content: b,
            position: c
        })
    }, e.prototype.remove = function (a) {
        a = this.normalize(a, !0), a !== d && (this.trigger("remove", {
            content: this._items[a],
            position: a
        }), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: a
        }))
    }, e.prototype.preloadAutoWidthImages = function (b) {
        b.each(a.proxy(function (b, c) {
            this.enter("pre-loading"), c = a(c), a(new Image).one("load", a.proxy(function (a) {
                c.attr("src", a.target.src), c.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
            }, this)).attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina"))
        }, this))
    }, e.prototype.destroy = function () {
        this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), this.settings.responsive !== !1 && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
        for (var d in this._plugins) this._plugins[d].destroy();
        this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
    }, e.prototype.op = function (a, b, c) {
        var d = this.settings.rtl;
        switch (b) {
            case "<":
                return d ? a > c : a < c;
            case ">":
                return d ? a < c : a > c;
            case ">=":
                return d ? a <= c : a >= c;
            case "<=":
                return d ? a >= c : a <= c
        }
    }, e.prototype.on = function (a, b, c, d) {
        a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
    }, e.prototype.off = function (a, b, c, d) {
        a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
    }, e.prototype.trigger = function (b, c, d, f, g) {
        var h = {
                item: {
                    count: this._items.length,
                    index: this.current()
                }
            },
            i = a.camelCase(a.grep(["on", b, d], function (a) {
                return a
            }).join("-").toLowerCase()),
            j = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({
                relatedTarget: this
            }, h, c));
        return this._supress[b] || (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(j)
        }), this.register({
            type: e.Type.Event,
            name: b
        }), this.$element.trigger(j), this.settings && "function" == typeof this.settings[i] && this.settings[i].call(this, j)), j
    }, e.prototype.enter = function (b) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
            this._states.current[b] === d && (this._states.current[b] = 0), this._states.current[b]++
        }, this))
    }, e.prototype.leave = function (b) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
            this._states.current[b]--
        }, this))
    }, e.prototype.register = function (b) {
        if (b.type === e.Type.Event) {
            if (a.event.special[b.name] || (a.event.special[b.name] = {}), !a.event.special[b.name].owl) {
                var c = a.event.special[b.name]._default;
                a.event.special[b.name]._default = function (a) {
                    return !c || !c.apply || a.namespace && a.namespace.indexOf("owl") !== -1 ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments)
                }, a.event.special[b.name].owl = !0
            }
        } else b.type === e.Type.State && (this._states.tags[b.name] ? this._states.tags[b.name] = this._states.tags[b.name].concat(b.tags) : this._states.tags[b.name] = b.tags, this._states.tags[b.name] = a.grep(this._states.tags[b.name], a.proxy(function (c, d) {
            return a.inArray(c, this._states.tags[b.name]) === d
        }, this)))
    }, e.prototype.suppress = function (b) {
        a.each(b, a.proxy(function (a, b) {
            this._supress[b] = !0
        }, this))
    }, e.prototype.release = function (b) {
        a.each(b, a.proxy(function (a, b) {
            delete this._supress[b]
        }, this))
    }, e.prototype.pointer = function (a) {
        var c = {
            x: null,
            y: null
        };
        return a = a.originalEvent || a || b.event, a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a, a.pageX ? (c.x = a.pageX, c.y = a.pageY) : (c.x = a.clientX, c.y = a.clientY), c
    }, e.prototype.isNumeric = function (a) {
        return !isNaN(parseFloat(a))
    }, e.prototype.difference = function (a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }, a.fn.owlCarousel = function (b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var d = a(this),
                f = d.data("owl.carousel");
            f || (f = new e(this, "object" == typeof b && b), d.data("owl.carousel", f), a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (b, c) {
                f.register({
                    type: e.Type.Event,
                    name: c
                }), f.$element.on(c + ".owl.carousel.core", a.proxy(function (a) {
                    a.namespace && a.relatedTarget !== this && (this.suppress([c]), f[c].apply(this, [].slice.call(arguments, 1)), this.release([c]))
                }, f))
            })), "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c)
        })
    }, a.fn.owlCarousel.Constructor = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._interval = null, this._visible = null, this._handlers = {
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        autoRefresh: !0,
        autoRefreshInterval: 500
    }, e.prototype.watch = function () {
        this._interval || (this._visible = this._core.$element.is(":visible"), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }, e.prototype.refresh = function () {
        this._core.$element.is(":visible") !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
    }, e.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (b) {
                if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type))
                    for (var c = this._core.settings, e = c.center && Math.ceil(c.items / 2) || c.items, f = c.center && e * -1 || 0, g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f, h = this._core.clones().length, i = a.proxy(function (a, b) {
                            this.load(b)
                        }, this); f++ < e;) this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        lazyLoad: !1
    }, e.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c),
            e = d && d.find(".owl-lazy");
        !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function (c, d) {
            var e, f = a(d),
                g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src");
            this._core.trigger("load", {
                element: f,
                url: g
            }, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function () {
                f.css("opacity", 1), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy")
            }, this)).attr("src", g) : (e = new Image, e.onload = a.proxy(function () {
                f.css({
                    "background-image": 'url("' + g + '")',
                    opacity: "1"
                }), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy")
            }, this), e.src = g)
        }, this)), this._loaded.push(d.get(0)))
    }, e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoHeight && this.update()
            }, this),
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoHeight && "position" == a.property.name && this.update()
            }, this),
            "loaded.owl.lazy": a.proxy(function (a) {
                a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    }, e.prototype.update = function () {
        var b = this._core._current,
            c = b + this._core.settings.items,
            d = this._core.$stage.children().toArray().slice(b, c),
            e = [],
            f = 0;
        a.each(d, function (b, c) {
            e.push(a(c).height())
        }), f = Math.max.apply(null, e), this._core.$stage.parent().height(f).addClass(this._core.settings.autoHeightClass)
    }, e.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._videos = {}, this._playing = null, this._handlers = {
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.register({
                    type: "state",
                    name: "playing",
                    tags: ["interacting"]
                })
            }, this),
            "resize.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault()
            }, this),
            "refreshed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this),
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && "position" === a.property.name && this._playing && this.stop()
            }, this),
            "prepared.owl.carousel": a.proxy(function (b) {
                if (b.namespace) {
                    var c = a(b.content).find(".owl-video");
                    c.length && (c.css("display", "none"), this.fetch(c, a(b.content)))
                }
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function (a) {
            this.play(a)
        }, this))
    };
    e.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    }, e.prototype.fetch = function (a, b) {
        var c = function () {
                return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube"
            }(),
            d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"),
            e = a.attr("data-width") || this._core.settings.videoWidth,
            f = a.attr("data-height") || this._core.settings.videoHeight,
            g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (d = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
            if (!(d[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
            c = "vzaar"
        }
        d = d[6], this._videos[g] = {
            type: c,
            id: d,
            width: e,
            height: f
        }, b.attr("data-video", g), this.thumbnail(a, this._videos[g])
    }, e.prototype.thumbnail = function (b, c) {
        var d, e, f, g = c.width && c.height ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"' : "",
            h = b.find("img"),
            i = "src",
            j = "",
            k = this._core.settings,
            l = function (a) {
                e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? '<div class="owl-video-tn ' + j + '" ' + i + '="' + a + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + a + ')"></div>', b.after(d), b.after(e)
            };
        if (b.wrap('<div class="owl-video-wrapper"' + g + "></div>"), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length) return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type ? (f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type ? a.ajax({
            type: "GET",
            url: "//vimeo.com/api/v2/video/" + c.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (a) {
                f = a[0].thumbnail_large, l(f)
            }
        }) : "vzaar" === c.type && a.ajax({
            type: "GET",
            url: "//vzaar.com/api/videos/" + c.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (a) {
                f = a.framegrab_url, l(f)
            }
        })
    }, e.prototype.stop = function () {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
    }, e.prototype.play = function (b) {
        var c, d = a(b.target),
            e = d.closest("." + this._core.settings.itemClass),
            f = this._videos[e.attr("data-video")],
            g = f.width || "100%",
            h = f.height || this._core.$stage.height();
        this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e = this._core.items(this._core.relative(e.index())), this._core.reset(e.index()), "youtube" === f.type ? c = '<iframe width="' + g + '" height="' + h + '" src="//www.youtube.com/embed/' + f.id + "?autoplay=1&rel=0&v=" + f.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === f.type ? c = '<iframe src="//player.vimeo.com/video/' + f.id + '?autoplay=1" width="' + g + '" height="' + h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' : "vzaar" === f.type && (c = '<iframe frameborder="0"height="' + h + '"width="' + g + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' + f.id + '/player?autoplay=true"></iframe>'), a('<div class="owl-video-frame">' + c + "</div>").insertAfter(e.find(".owl-video")), this._playing = e.addClass("owl-video-playing"))
    }, e.prototype.isInFullScreen = function () {
        var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame")
    }, e.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Video = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = {
            "change.owl.carousel": a.proxy(function (a) {
                a.namespace && "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value)
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) {
                a.namespace && (this.swapping = "translated" == a.type)
            }, this),
            "translate.owl.carousel": a.proxy(function (a) {
                a.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    e.Defaults = {
            animateOut: !1,
            animateIn: !1
        }, e.prototype.swap = function () {
            if (1 === this.core.settings.items && a.support.animation && a.support.transition) {
                this.core.speed(0);
                var b, c = a.proxy(this.clear, this),
                    d = this.core.$stage.children().eq(this.previous),
                    e = this.core.$stage.children().eq(this.next),
                    f = this.core.settings.animateIn,
                    g = this.core.settings.animateOut;
                this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.one(a.support.animation.end, c).css({
                    left: b + "px"
                }).addClass("animated owl-animated-out").addClass(g)), f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f))
            }
        }, e.prototype.clear = function (b) {
            a(b.target).css({
                left: ""
            }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
        }, e.prototype.destroy = function () {
            var a, b;
            for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
            for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
        },
        a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._timeout = null, this._paused = !1, this._handlers = {
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._core.settings.autoplay && this._setAutoPlayInterval()
            }, this),
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoplay && this.play()
            }, this),
            "play.owl.autoplay": a.proxy(function (a, b, c) {
                a.namespace && this.play(b, c)
            }, this),
            "stop.owl.autoplay": a.proxy(function (a) {
                a.namespace && this.stop()
            }, this),
            "mouseover.owl.autoplay": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "mouseleave.owl.autoplay": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this),
            "touchstart.owl.core": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "touchend.owl.core": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        }, this._core.$element.on(this._handlers), this._core.options = a.extend({}, e.Defaults, this._core.options)
    };
    e.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, e.prototype.play = function (a, b) {
        this._paused = !1, this._core.is("rotating") || (this._core.enter("rotating"), this._setAutoPlayInterval())
    }, e.prototype._getNextTimeout = function (d, e) {
        return this._timeout && b.clearTimeout(this._timeout), b.setTimeout(a.proxy(function () {
            this._paused || this._core.is("busy") || this._core.is("interacting") || c.hidden || this._core.next(e || this._core.settings.autoplaySpeed)
        }, this), d || this._core.settings.autoplayTimeout)
    }, e.prototype._setAutoPlayInterval = function () {
        this._timeout = this._getNextTimeout()
    }, e.prototype.stop = function () {
        this._core.is("rotating") && (b.clearTimeout(this._timeout), this._core.leave("rotating"))
    }, e.prototype.pause = function () {
        this._core.is("rotating") && (this._paused = !0)
    }, e.prototype.destroy = function () {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.autoplay = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    "use strict";
    var e = function (b) {
        this._core = b, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": a.proxy(function (b) {
                b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this),
            "added.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop())
            }, this),
            "remove.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1)
            }, this),
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && "position" == a.property.name && this.draw()
            }, this),
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
            }, this),
            "refreshed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    e.Defaults = {
        nav: !1,
        navText: ["prev", "next"],
        navSpeed: !1,
        navElement: "div",
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotsData: !1,
        dotsSpeed: !1,
        dotsContainer: !1
    }, e.prototype.initialize = function () {
        var b, c = this._core.settings;
        this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function (a) {
            this.prev(c.navSpeed)
        }, this)), this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function (a) {
            this.next(c.navSpeed)
        }, this)), c.dotsData || (this._templates = [a("<div>").addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]), this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "div", a.proxy(function (b) {
            var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index();
            b.preventDefault(), this.to(d, c.dotsSpeed)
        }, this));
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this)
    }, e.prototype.destroy = function () {
        var a, b, c, d;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls) this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
    }, e.prototype.update = function () {
        var a, b, c, d = this._core.clones().length / 2,
            e = d + this._core.items().length,
            f = this._core.maximum(!0),
            g = this._core.settings,
            h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy)
            for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
                if (b >= h || 0 === b) {
                    if (this._pages.push({
                            start: Math.min(f, a - d),
                            end: a - d + h - 1
                        }), Math.min(f, a - d) === f) break;
                    b = 0, ++c
                }
                b += this._core.mergers(this._core.relative(a))
            }
    }, e.prototype.draw = function () {
        var b, c = this._core.settings,
            d = this._core.items().length <= c.items,
            e = this._core.relative(this._core.current()),
            f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d), c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !c.dots || d), c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0])) : b < 0 && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"))
    }, e.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {
            index: a.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items)
        }
    }, e.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a.grep(this._pages, a.proxy(function (a, c) {
            return a.start <= b && a.end >= b
        }, this)).pop()
    }, e.prototype.getPosition = function (b) {
        var c, d, e = this._core.settings;
        return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c
    }, e.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b)
    }, e.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b)
    }, e.prototype.to = function (b, c, d) {
        var e;
        !d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c)
    }, a.fn.owlCarousel.Constructor.Plugins.Navigation = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    "use strict";
    var e = function (c) {
        this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": a.proxy(function (c) {
                c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation")
            }, this),
            "prepared.owl.carousel": a.proxy(function (b) {
                if (b.namespace) {
                    var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!c) return;
                    this._hashes[c] = b.content
                }
            }, this),
            "changed.owl.carousel": a.proxy(function (c) {
                if (c.namespace && "position" === c.property.name) {
                    var d = this._core.items(this._core.relative(this._core.current())),
                        e = a.map(this._hashes, function (a, b) {
                            return a === d ? b : null
                        }).join();
                    if (!e || b.location.hash.slice(1) === e) return;
                    b.location.hash = e
                }
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function (a) {
            var c = b.location.hash.substring(1),
                e = this._core.$stage.children(),
                f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0)
        }, this))
    };
    e.Defaults = {
        URLhashListener: !1
    }, e.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Hash = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    function e(b, c) {
        var e = !1,
            f = b.charAt(0).toUpperCase() + b.slice(1);
        return a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
            if (g[b] !== d) return e = !c || b, !1
        }), e
    }

    function f(a) {
        return e(a, !0)
    }
    var g = a("<support>").get(0).style,
        h = "Webkit Moz O ms".split(" "),
        i = {
            transition: {
                end: {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd",
                    transition: "transitionend"
                }
            },
            animation: {
                end: {
                    WebkitAnimation: "webkitAnimationEnd",
                    MozAnimation: "animationend",
                    OAnimation: "oAnimationEnd",
                    animation: "animationend"
                }
            }
        },
        j = {
            csstransforms: function () {
                return !!e("transform")
            },
            csstransforms3d: function () {
                return !!e("perspective")
            },
            csstransitions: function () {
                return !!e("transition")
            },
            cssanimations: function () {
                return !!e("animation")
            }
        };
    j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d())
}(window.Zepto || window.jQuery, window, document);
window.devicePixelRatio = 2;
/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
! function (a) {
    var b = navigator.userAgent;
    a.HTMLPictureElement && /ecko/.test(b) && b.match(/rv\:(\d+)/) && RegExp.$1 < 45 && addEventListener("resize", function () {
        var b, c = document.createElement("source"),
            d = function (a) {
                var b, d, e = a.parentNode;
                "PICTURE" === e.nodeName.toUpperCase() ? (b = c.cloneNode(), e.insertBefore(b, e.firstElementChild), setTimeout(function () {
                    e.removeChild(b)
                })) : (!a._pfLastSize || a.offsetWidth > a._pfLastSize) && (a._pfLastSize = a.offsetWidth, d = a.sizes, a.sizes += ",100vw", setTimeout(function () {
                    a.sizes = d
                }))
            },
            e = function () {
                var a, b = document.querySelectorAll("picture > img, img[srcset][sizes]");
                for (a = 0; a < b.length; a++) d(b[a])
            },
            f = function () {
                clearTimeout(b), b = setTimeout(e, 99)
            },
            g = a.matchMedia && matchMedia("(orientation: landscape)"),
            h = function () {
                f(), g && g.addListener && g.addListener(f)
            };
        return c.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", /^[c|i]|d$/.test(document.readyState || "") ? h() : document.addEventListener("DOMContentLoaded", h), f
    }())
}(window),
function (a, b, c) {
    "use strict";

    function d(a) {
        return " " === a || "	" === a || "\n" === a || "\f" === a || "\r" === a
    }

    function e(b, c) {
        var d = new a.Image;
        return d.onerror = function () {
            A[b] = !1, ba()
        }, d.onload = function () {
            A[b] = 1 === d.width, ba()
        }, d.src = c, "pending"
    }

    function f() {
        M = !1, P = a.devicePixelRatio, N = {}, O = {}, s.DPR = P || 1, Q.width = Math.max(a.innerWidth || 0, z.clientWidth), Q.height = Math.max(a.innerHeight || 0, z.clientHeight), Q.vw = Q.width / 100, Q.vh = Q.height / 100, r = [Q.height, Q.width, P].join("-"), Q.em = s.getEmValue(), Q.rem = Q.em
    }

    function g(a, b, c, d) {
        var e, f, g, h;
        return "saveData" === B.algorithm ? a > 2.7 ? h = c + 1 : (f = b - c, e = Math.pow(a - .6, 1.5), g = f * e, d && (g += .1 * e), h = a + g) : h = c > 1 ? Math.sqrt(a * b) : a, h > c
    }

    function h(a) {
        var b, c = s.getSet(a),
            d = !1;
        "pending" !== c && (d = r, c && (b = s.setRes(c), s.applySetCandidate(b, a))), a[s.ns].evaled = d
    }

    function i(a, b) {
        return a.res - b.res
    }

    function j(a, b, c) {
        var d;
        return !c && b && (c = a[s.ns].sets, c = c && c[c.length - 1]), d = k(b, c), d && (b = s.makeUrl(b), a[s.ns].curSrc = b, a[s.ns].curCan = d, d.res || aa(d, d.set.sizes)), d
    }

    function k(a, b) {
        var c, d, e;
        if (a && b)
            for (e = s.parseSet(b), a = s.makeUrl(a), c = 0; c < e.length; c++)
                if (a === s.makeUrl(e[c].url)) {
                    d = e[c];
                    break
                } return d
    }

    function l(a, b) {
        var c, d, e, f, g = a.getElementsByTagName("source");
        for (c = 0, d = g.length; d > c; c++) e = g[c], e[s.ns] = !0, f = e.getAttribute("srcset"), f && b.push({
            srcset: f,
            media: e.getAttribute("media"),
            type: e.getAttribute("type"),
            sizes: e.getAttribute("sizes")
        })
    }

    function m(a, b) {
        function c(b) {
            var c, d = b.exec(a.substring(m));
            return d ? (c = d[0], m += c.length, c) : void 0
        }

        function e() {
            var a, c, d, e, f, i, j, k, l, m = !1,
                o = {};
            for (e = 0; e < h.length; e++) f = h[e], i = f[f.length - 1], j = f.substring(0, f.length - 1), k = parseInt(j, 10), l = parseFloat(j), X.test(j) && "w" === i ? ((a || c) && (m = !0), 0 === k ? m = !0 : a = k) : Y.test(j) && "x" === i ? ((a || c || d) && (m = !0), 0 > l ? m = !0 : c = l) : X.test(j) && "h" === i ? ((d || c) && (m = !0), 0 === k ? m = !0 : d = k) : m = !0;
            m || (o.url = g, a && (o.w = a), c && (o.d = c), d && (o.h = d), d || c || a || (o.d = 1), 1 === o.d && (b.has1x = !0), o.set = b, n.push(o))
        }

        function f() {
            for (c(T), i = "", j = "in descriptor";;) {
                if (k = a.charAt(m), "in descriptor" === j)
                    if (d(k)) i && (h.push(i), i = "", j = "after descriptor");
                    else {
                        if ("," === k) return m += 1, i && h.push(i), void e();
                        if ("(" === k) i += k, j = "in parens";
                        else {
                            if ("" === k) return i && h.push(i), void e();
                            i += k
                        }
                    }
                else if ("in parens" === j)
                    if (")" === k) i += k, j = "in descriptor";
                    else {
                        if ("" === k) return h.push(i), void e();
                        i += k
                    }
                else if ("after descriptor" === j)
                    if (d(k));
                    else {
                        if ("" === k) return void e();
                        j = "in descriptor", m -= 1
                    } m += 1
            }
        }
        for (var g, h, i, j, k, l = a.length, m = 0, n = [];;) {
            if (c(U), m >= l) return n;
            g = c(V), h = [], "," === g.slice(-1) ? (g = g.replace(W, ""), e()) : f()
        }
    }

    function n(a) {
        function b(a) {
            function b() {
                f && (g.push(f), f = "")
            }

            function c() {
                g[0] && (h.push(g), g = [])
            }
            for (var e, f = "", g = [], h = [], i = 0, j = 0, k = !1;;) {
                if (e = a.charAt(j), "" === e) return b(), c(), h;
                if (k) {
                    if ("*" === e && "/" === a[j + 1]) {
                        k = !1, j += 2, b();
                        continue
                    }
                    j += 1
                } else {
                    if (d(e)) {
                        if (a.charAt(j - 1) && d(a.charAt(j - 1)) || !f) {
                            j += 1;
                            continue
                        }
                        if (0 === i) {
                            b(), j += 1;
                            continue
                        }
                        e = " "
                    } else if ("(" === e) i += 1;
                    else if (")" === e) i -= 1;
                    else {
                        if ("," === e) {
                            b(), c(), j += 1;
                            continue
                        }
                        if ("/" === e && "*" === a.charAt(j + 1)) {
                            k = !0, j += 2;
                            continue
                        }
                    }
                    f += e, j += 1
                }
            }
        }

        function c(a) {
            return k.test(a) && parseFloat(a) >= 0 ? !0 : l.test(a) ? !0 : "0" === a || "-0" === a || "+0" === a ? !0 : !1
        }
        var e, f, g, h, i, j, k = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,
            l = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
        for (f = b(a), g = f.length, e = 0; g > e; e++)
            if (h = f[e], i = h[h.length - 1], c(i)) {
                if (j = i, h.pop(), 0 === h.length) return j;
                if (h = h.join(" "), s.matchesMedia(h)) return j
            } return "100vw"
    }
    b.createElement("picture");
    var o, p, q, r, s = {},
        t = !1,
        u = function () {},
        v = b.createElement("img"),
        w = v.getAttribute,
        x = v.setAttribute,
        y = v.removeAttribute,
        z = b.documentElement,
        A = {},
        B = {
            algorithm: ""
        },
        C = "data-pfsrc",
        D = C + "set",
        E = navigator.userAgent,
        F = /rident/.test(E) || /ecko/.test(E) && E.match(/rv\:(\d+)/) && RegExp.$1 > 35,
        G = "currentSrc",
        H = /\s+\+?\d+(e\d+)?w/,
        I = /(\([^)]+\))?\s*(.+)/,
        J = a.picturefillCFG,
        K = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",
        L = "font-size:100%!important;",
        M = !0,
        N = {},
        O = {},
        P = a.devicePixelRatio,
        Q = {
            px: 1,
            "in": 96
        },
        R = b.createElement("a"),
        S = !1,
        T = /^[ \t\n\r\u000c]+/,
        U = /^[, \t\n\r\u000c]+/,
        V = /^[^ \t\n\r\u000c]+/,
        W = /[,]+$/,
        X = /^\d+$/,
        Y = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,
        Z = function (a, b, c, d) {
            a.addEventListener ? a.addEventListener(b, c, d || !1) : a.attachEvent && a.attachEvent("on" + b, c)
        },
        $ = function (a) {
            var b = {};
            return function (c) {
                return c in b || (b[c] = a(c)), b[c]
            }
        },
        _ = function () {
            var a = /^([\d\.]+)(em|vw|px)$/,
                b = function () {
                    for (var a = arguments, b = 0, c = a[0]; ++b in a;) c = c.replace(a[b], a[++b]);
                    return c
                },
                c = $(function (a) {
                    return "return " + b((a || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi, "") + ";"
                });
            return function (b, d) {
                var e;
                if (!(b in N))
                    if (N[b] = !1, d && (e = b.match(a))) N[b] = e[1] * Q[e[2]];
                    else try {
                        N[b] = new Function("e", c(b))(Q)
                    } catch (f) {}
                return N[b]
            }
        }(),
        aa = function (a, b) {
            return a.w ? (a.cWidth = s.calcListLength(b || "100vw"), a.res = a.w / a.cWidth) : a.res = a.d, a
        },
        ba = function (a) {
            if (t) {
                var c, d, e, f = a || {};
                if (f.elements && 1 === f.elements.nodeType && ("IMG" === f.elements.nodeName.toUpperCase() ? f.elements = [f.elements] : (f.context = f.elements, f.elements = null)), c = f.elements || s.qsa(f.context || b, f.reevaluate || f.reselect ? s.sel : s.selShort), e = c.length) {
                    for (s.setupRun(f), S = !0, d = 0; e > d; d++) s.fillImg(c[d], f);
                    s.teardownRun(f)
                }
            }
        };
    o = a.console && console.warn ? function (a) {
        console.warn(a)
    } : u, G in v || (G = "src"), A["image/jpeg"] = !0, A["image/gif"] = !0, A["image/png"] = !0, A["image/svg+xml"] = b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"), s.ns = ("pf" + (new Date).getTime()).substr(0, 9), s.supSrcset = "srcset" in v, s.supSizes = "sizes" in v, s.supPicture = !!a.HTMLPictureElement, s.supSrcset && s.supPicture && !s.supSizes && ! function (a) {
        v.srcset = "data:,a", a.src = "data:,a", s.supSrcset = v.complete === a.complete, s.supPicture = s.supSrcset && s.supPicture
    }(b.createElement("img")), s.supSrcset && !s.supSizes ? ! function () {
        var a = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==",
            c = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
            d = b.createElement("img"),
            e = function () {
                var a = d.width;
                2 === a && (s.supSizes = !0), q = s.supSrcset && !s.supSizes, t = !0, setTimeout(ba)
            };
        d.onload = e, d.onerror = e, d.setAttribute("sizes", "9px"), d.srcset = c + " 1w," + a + " 9w", d.src = c
    }() : t = !0, s.selShort = "picture>img,img[srcset]", s.sel = s.selShort, s.cfg = B, s.DPR = P || 1, s.u = Q, s.types = A, s.setSize = u, s.makeUrl = $(function (a) {
        return R.href = a, R.href
    }), s.qsa = function (a, b) {
        return "querySelector" in a ? a.querySelectorAll(b) : []
    }, s.matchesMedia = function () {
        return a.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches ? s.matchesMedia = function (a) {
            return !a || matchMedia(a).matches
        } : s.matchesMedia = s.mMQ, s.matchesMedia.apply(this, arguments)
    }, s.mMQ = function (a) {
        return a ? _(a) : !0
    }, s.calcLength = function (a) {
        var b = _(a, !0) || !1;
        return 0 > b && (b = !1), b
    }, s.supportsType = function (a) {
        return a ? A[a] : !0
    }, s.parseSize = $(function (a) {
        var b = (a || "").match(I);
        return {
            media: b && b[1],
            length: b && b[2]
        }
    }), s.parseSet = function (a) {
        return a.cands || (a.cands = m(a.srcset, a)), a.cands
    }, s.getEmValue = function () {
        var a;
        if (!p && (a = b.body)) {
            var c = b.createElement("div"),
                d = z.style.cssText,
                e = a.style.cssText;
            c.style.cssText = K, z.style.cssText = L, a.style.cssText = L, a.appendChild(c), p = c.offsetWidth, a.removeChild(c), p = parseFloat(p, 10), z.style.cssText = d, a.style.cssText = e
        }
        return p || 16
    }, s.calcListLength = function (a) {
        if (!(a in O) || B.uT) {
            var b = s.calcLength(n(a));
            O[a] = b ? b : Q.width
        }
        return O[a]
    }, s.setRes = function (a) {
        var b;
        if (a) {
            b = s.parseSet(a);
            for (var c = 0, d = b.length; d > c; c++) aa(b[c], a.sizes)
        }
        return b
    }, s.setRes.res = aa, s.applySetCandidate = function (a, b) {
        if (a.length) {
            var c, d, e, f, h, k, l, m, n, o = b[s.ns],
                p = s.DPR;
            if (k = o.curSrc || b[G], l = o.curCan || j(b, k, a[0].set), l && l.set === a[0].set && (n = F && !b.complete && l.res - .1 > p, n || (l.cached = !0, l.res >= p && (h = l))), !h)
                for (a.sort(i), f = a.length, h = a[f - 1], d = 0; f > d; d++)
                    if (c = a[d], c.res >= p) {
                        e = d - 1, h = a[e] && (n || k !== s.makeUrl(c.url)) && g(a[e].res, c.res, p, a[e].cached) ? a[e] : c;
                        break
                    } h && (m = s.makeUrl(h.url), o.curSrc = m, o.curCan = h, m !== k && s.setSrc(b, h), s.setSize(b))
        }
    }, s.setSrc = function (a, b) {
        var c;
        a.src = b.url, "image/svg+xml" === b.set.type && (c = a.style.width, a.style.width = a.offsetWidth + 1 + "px", a.offsetWidth + 1 && (a.style.width = c))
    }, s.getSet = function (a) {
        var b, c, d, e = !1,
            f = a[s.ns].sets;
        for (b = 0; b < f.length && !e; b++)
            if (c = f[b], c.srcset && s.matchesMedia(c.media) && (d = s.supportsType(c.type))) {
                "pending" === d && (c = d), e = c;
                break
            } return e
    }, s.parseSets = function (a, b, d) {
        var e, f, g, h, i = b && "PICTURE" === b.nodeName.toUpperCase(),
            j = a[s.ns];
        (j.src === c || d.src) && (j.src = w.call(a, "src"), j.src ? x.call(a, C, j.src) : y.call(a, C)), (j.srcset === c || d.srcset || !s.supSrcset || a.srcset) && (e = w.call(a, "srcset"), j.srcset = e, h = !0), j.sets = [], i && (j.pic = !0, l(b, j.sets)), j.srcset ? (f = {
            srcset: j.srcset,
            sizes: w.call(a, "sizes")
        }, j.sets.push(f), g = (q || j.src) && H.test(j.srcset || ""), g || !j.src || k(j.src, f) || f.has1x || (f.srcset += ", " + j.src, f.cands.push({
            url: j.src,
            d: 1,
            set: f
        }))) : j.src && j.sets.push({
            srcset: j.src,
            sizes: null
        }), j.curCan = null, j.curSrc = c, j.supported = !(i || f && !s.supSrcset || g && !s.supSizes), h && s.supSrcset && !j.supported && (e ? (x.call(a, D, e), a.srcset = "") : y.call(a, D)), j.supported && !j.srcset && (!j.src && a.src || a.src !== s.makeUrl(j.src)) && (null === j.src ? a.removeAttribute("src") : a.src = j.src), j.parsed = !0
    }, s.fillImg = function (a, b) {
        var c, d = b.reselect || b.reevaluate;
        a[s.ns] || (a[s.ns] = {}), c = a[s.ns], (d || c.evaled !== r) && ((!c.parsed || b.reevaluate) && s.parseSets(a, a.parentNode, b), c.supported ? c.evaled = r : h(a))
    }, s.setupRun = function () {
        (!S || M || P !== a.devicePixelRatio) && f()
    }, s.supPicture ? (ba = u, s.fillImg = u) : ! function () {
        var c, d = a.attachEvent ? /d$|^c/ : /d$|^c|^i/,
            e = function () {
                var a = b.readyState || "";
                f = setTimeout(e, "loading" === a ? 200 : 999), b.body && (s.fillImgs(), c = c || d.test(a), c && clearTimeout(f))
            },
            f = setTimeout(e, b.body ? 9 : 99),
            g = function (a, b) {
                var c, d, e = function () {
                    var f = new Date - d;
                    b > f ? c = setTimeout(e, b - f) : (c = null, a())
                };
                return function () {
                    d = new Date, c || (c = setTimeout(e, b))
                }
            },
            h = z.clientHeight,
            i = function () {
                M = Math.max(a.innerWidth || 0, z.clientWidth) !== Q.width || z.clientHeight !== h, h = z.clientHeight, M && s.fillImgs()
            };
        Z(a, "resize", g(i, 99)), Z(b, "readystatechange", e)
    }(), s.picturefill = ba, s.fillImgs = ba, s.teardownRun = u, ba._ = s, a.picturefillCFG = {
        pf: s,
        push: function (a) {
            var b = a.shift();
            "function" == typeof s[b] ? s[b].apply(s, a) : (B[b] = a[0], S && s.fillImgs({
                reselect: !0
            }))
        }
    };
    for (; J && J.length;) a.picturefillCFG.push(J.shift());
    a.picturefill = ba, "object" == typeof module && "object" == typeof module.exports ? module.exports = ba : "function" == typeof define && define.amd && define("picturefill", function () {
        return ba
    }), s.supPicture || (A["image/webp"] = e("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))
}(window, document);
(function ($) {
    $.fn.validationEngineLanguage = function () {};
    $.validationEngineLanguage = {
        newLang: function () {
            $.validationEngineLanguage.allRules = {
                "required": {
                    "regex": "none",
                    "alertText": "* This field is required",
                    "alertTextCheckboxMultiple": "* Please select an option",
                    "alertTextCheckboxe": "* This checkbox is required",
                    "alertTextDateRange": "* Both date range fields are required"
                },
                "requiredInFunction": {
                    "func": function (field, rules, i, options) {
                        return (field.val() == "test") ? true : false;
                    },
                    "alertText": "* Field must equal test"
                },
                "dateRange": {
                    "regex": "none",
                    "alertText": "* Invalid ",
                    "alertText2": "Date Range"
                },
                "dateTimeRange": {
                    "regex": "none",
                    "alertText": "* Invalid ",
                    "alertText2": "Date Time Range"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "* Minimum ",
                    "alertText2": " characters required"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "* Maximum ",
                    "alertText2": " characters allowed"
                },
                "groupRequired": {
                    "regex": "none",
                    "alertText": "* You must fill one of the following fields",
                    "alertTextCheckboxMultiple": "* Please select an option",
                    "alertTextCheckboxe": "* This checkbox is required"
                },
                "min": {
                    "regex": "none",
                    "alertText": "* Minimum value is "
                },
                "max": {
                    "regex": "none",
                    "alertText": "* Maximum value is "
                },
                "past": {
                    "regex": "none",
                    "alertText": "* Date prior to "
                },
                "future": {
                    "regex": "none",
                    "alertText": "* Date past "
                },
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "* Maximum ",
                    "alertText2": " options allowed"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "* Please select ",
                    "alertText2": " options"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "* Fields do not match"
                },
                "creditCard": {
                    "regex": "none",
                    "alertText": "* Invalid credit card number"
                },
                "phone": {
                    "regex": /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/,
                    "alertText": "* Invalid phone number"
                },
                "email": {
                    "regex": /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    "alertText": "* Invalid email address"
                },
                "fullname": {
                    "regex": /^([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]*)+[ ]([a-zA-Z]+[\'\,\.\-]?[a-zA-Z ]+)+$/,
                    "alertText": "* Must be first and last name"
                },
                "zip": {
                    "regex": /^\d{5}$|^\d{5}-\d{4}$/,
                    "alertText": "* Invalid zip format"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "* Not a valid integer"
                },
                "number": {
                    "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
                    "alertText": "* Invalid floating decimal number"
                },
                "date": {
                    "func": function (field) {
                        var pattern = new RegExp(/^(\d{4})[\/\-\.](0?[1-9]|1[012])[\/\-\.](0?[1-9]|[12][0-9]|3[01])$/);
                        var match = pattern.exec(field.val());
                        if (match == null)
                            return false;
                        var year = match[1];
                        var month = match[2] * 1;
                        var day = match[3] * 1;
                        var date = new Date(year, month - 1, day);
                        return (date.getFullYear() == year && date.getMonth() == (month - 1) && date.getDate() == day);
                    },
                    "alertText": "* Invalid date, must be in YYYY-MM-DD format"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* Invalid IP address"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                    "alertText": "* Invalid URL"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "* Numbers only"
                },
                "onlyLetterSp": {
                    "regex": /^[a-zA-Z\ \']+$/,
                    "alertText": "* Letters only"
                },
                "onlyLetterAccentSp": {
                    "regex": /^[a-z\u00C0-\u017F\ ]+$/i,
                    "alertText": "* Letters only (accents allowed)"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "* No special characters allowed"
                },
                "ajaxUserCall": {
                    "url": "ajaxValidateFieldUser",
                    "extraData": "name=eric",
                    "alertText": "* This user is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
                "ajaxUserCallPhp": {
                    "url": "phpajax/ajaxValidateFieldUser.php",
                    "extraData": "name=eric",
                    "alertTextOk": "* This username is available",
                    "alertText": "* This user is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
                "ajaxNameCall": {
                    "url": "ajaxValidateFieldName",
                    "alertText": "* This name is already taken",
                    "alertTextOk": "* This name is available",
                    "alertTextLoad": "* Validating, please wait"
                },
                "ajaxNameCallPhp": {
                    "url": "phpajax/ajaxValidateFieldName.php",
                    "alertText": "* This name is already taken",
                    "alertTextLoad": "* Validating, please wait"
                },
                "validate2fields": {
                    "alertText": "* Please input HELLO"
                },
                "dateFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
                    "alertText": "* Invalid Date"
                },
                "dateTimeFormat": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                    "alertText": "* Invalid Date or Date Format",
                    "alertText2": "Expected Format: ",
                    "alertText3": "mm/dd/yyyy hh:mm:ss AM|PM or ",
                    "alertText4": "yyyy-mm-dd hh:mm:ss AM|PM"
                }
            };
        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);
(function ($) {
    "use strict";
    var methods = {
        init: function (options) {
            var form = this;
            if (!form.data('jqv') || form.data('jqv') == null) {
                options = methods._saveOptions(form, options);
                $(document).on("click", ".formError", function () {
                    $(this).fadeOut(150, function () {
                        $(this).parent('.formErrorOuter').remove();
                        $(this).remove();
                    });
                });
            }
            return this;
        },
        attach: function (userOptions) {
            var form = this;
            var options;
            if (userOptions)
                options = methods._saveOptions(form, userOptions);
            else
                options = form.data('jqv');
            options.validateAttribute = (form.find("[data-validation-engine*=validate]").length) ? "data-validation-engine" : "class";
            if (options.binded) {
                form.on(options.validationEventTrigger, "[" + options.validateAttribute + "*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)", methods._onFieldEvent);
                form.on("click", "[" + options.validateAttribute + "*=validate][type=checkbox],[" + options.validateAttribute + "*=validate][type=radio]", methods._onFieldEvent);
                form.on(options.validationEventTrigger, "[" + options.validateAttribute + "*=validate][class*=datepicker]", {
                    "delay": 300
                }, methods._onFieldEvent);
            }
            if (options.autoPositionUpdate) {
                $(window).bind("resize", {
                    "noAnimation": true,
                    "formElem": form
                }, methods.updatePromptsPosition);
            }
            form.on("click", "a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", methods._submitButtonClick);
            form.removeData('jqv_submitButton');
            form.on("submit", methods._onSubmitEvent);
            return this;
        },
        detach: function () {
            var form = this;
            var options = form.data('jqv');
            form.find("[" + options.validateAttribute + "*=validate]").not("[type=checkbox]").off(options.validationEventTrigger, methods._onFieldEvent);
            form.find("[" + options.validateAttribute + "*=validate][type=checkbox],[class*=validate][type=radio]").off("click", methods._onFieldEvent);
            form.off("submit", methods.onAjaxFormComplete);
            form.off("submit", methods.onAjaxFormComplete);
            form.removeData('jqv');
            form.off("click", "a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", methods._submitButtonClick);
            form.removeData('jqv_submitButton');
            if (options.autoPositionUpdate)
                $(window).unbind("resize", methods.updatePromptsPosition);
            return this;
        },
        validate: function () {
            var element = $(this);
            var valid = null;
            if (element.is("form") || element.hasClass("validationEngineContainer")) {
                if (element.hasClass('validating')) {
                    return false;
                } else {
                    element.addClass('validating');
                    var options = element.data('jqv');
                    var valid = methods._validateFields(this);
                    setTimeout(function () {
                        element.removeClass('validating');
                    }, 100);
                    if (valid && options.onSuccess) {
                        options.onSuccess();
                    } else if (!valid && options.onFailure) {
                        options.onFailure();
                    }
                }
            } else if (element.is('form') || element.hasClass('validationEngineContainer')) {
                element.removeClass('validating');
            } else {
                var form = element.closest('form, .validationEngineContainer'),
                    options = (form.data('jqv')) ? form.data('jqv') : $.validationEngine.defaults,
                    valid = methods._validateField(element, options);
                if (valid && options.onFieldSuccess)
                    options.onFieldSuccess();
                else if (options.onFieldFailure && options.InvalidFields.length > 0) {
                    options.onFieldFailure();
                }
            }
            if (options.onValidationComplete) {
                return !!options.onValidationComplete(form, valid);
            }
            return valid;
        },
        updatePromptsPosition: function (event) {
            if (event && this == window) {
                var form = event.data.formElem;
                var noAnimation = event.data.noAnimation;
            } else
                var form = $(this.closest('form, .validationEngineContainer'));
            var options = form.data('jqv');
            form.find('[' + options.validateAttribute + '*=validate]').not(":disabled").each(function () {
                var field = $(this);
                if (options.prettySelect && field.is(":hidden"))
                    field = form.find("#" + options.usePrefix + field.attr('id') + options.useSuffix);
                var prompt = methods._getPrompt(field);
                var promptText = $(prompt).find(".formErrorContent").html();
                if (prompt)
                    methods._updatePrompt(field, $(prompt), promptText, undefined, false, options, noAnimation);
            });
            return this;
        },
        showPrompt: function (promptText, type, promptPosition, showArrow) {
            var form = this.closest('form, .validationEngineContainer');
            var options = form.data('jqv');
            if (!options)
                options = methods._saveOptions(this, options);
            if (promptPosition)
                options.promptPosition = promptPosition;
            options.showArrow = showArrow == true;
            methods._showPrompt(this, promptText, type, false, options);
            return this;
        },
        hide: function () {
            var form = $(this).closest('form, .validationEngineContainer');
            var options = form.data('jqv');
            var fadeDuration = (options && options.fadeDuration) ? options.fadeDuration : 0.3;
            var closingtag;
            if ($(this).is("form") || $(this).hasClass("validationEngineContainer")) {
                closingtag = "parentForm" + methods._getClassName($(this).attr("id"));
            } else {
                closingtag = methods._getClassName($(this).attr("id")) + "formError";
            }
            $('.' + closingtag).fadeTo(fadeDuration, 0.3, function () {
                $(this).parent('.formErrorOuter').remove();
                $(this).remove();
            });
            return this;
        },
        hideAll: function () {
            var form = this;
            var options = form.data('jqv');
            var duration = options ? options.fadeDuration : 300;
            $('.formError').fadeTo(duration, 300, function () {
                $(this).parent('.formErrorOuter').remove();
                $(this).remove();
            });
            return this;
        },
        _onFieldEvent: function (event) {
            var field = $(this);
            var form = field.closest('form, .validationEngineContainer');
            var options = form.data('jqv');
            options.eventTrigger = "field";
            window.setTimeout(function () {
                methods._validateField(field, options);
                if (options.InvalidFields.length == 0 && options.onFieldSuccess) {
                    options.onFieldSuccess();
                } else if (options.InvalidFields.length > 0 && options.onFieldFailure) {
                    options.onFieldFailure();
                }
            }, (event.data) ? event.data.delay : 0);
        },
        _onSubmitEvent: function () {
            var form = $(this);
            var options = form.data('jqv');
            if (form.data("jqv_submitButton")) {
                var submitButton = $("#" + form.data("jqv_submitButton"));
                if (submitButton) {
                    if (submitButton.length > 0) {
                        if (submitButton.hasClass("validate-skip") || submitButton.attr("data-validation-engine-skip") == "true")
                            return true;
                    }
                }
            }
            options.eventTrigger = "submit";
            var r = methods._validateFields(form);
            if (r && options.ajaxFormValidation) {
                methods._validateFormWithAjax(form, options);
                return false;
            }
            if (options.onValidationComplete) {
                return !!options.onValidationComplete(form, r);
            }
            return r;
        },
        _checkAjaxStatus: function (options) {
            var status = true;
            $.each(options.ajaxValidCache, function (key, value) {
                if (!value) {
                    status = false;
                    return false;
                }
            });
            return status;
        },
        _checkAjaxFieldStatus: function (fieldid, options) {
            return options.ajaxValidCache[fieldid] == true;
        },
        _validateFields: function (form) {
            var options = form.data('jqv');
            var errorFound = false;
            form.trigger("jqv.form.validating");
            var first_err = null;
            form.find('[' + options.validateAttribute + '*=validate]').not(":disabled").each(function () {
                var field = $(this);
                var names = [];
                if ($.inArray(field.attr('name'), names) < 0) {
                    errorFound |= methods._validateField(field, options);
                    if (errorFound && first_err == null)
                        if (field.is(":hidden") && options.prettySelect)
                            first_err = field = form.find("#" + options.usePrefix + methods._jqSelector(field.attr('id')) + options.useSuffix);
                        else
                            first_err = field;
                    if (options.doNotShowAllErrosOnSubmit)
                        return false;
                    names.push(field.attr('name'));
                    if (options.showOneMessage == true && errorFound) {
                        return false;
                    }
                }
            });
            form.trigger("jqv.form.result", [errorFound]);
            if (errorFound) {
                if (options.scroll) {
                    var destination = first_err.offset().top;
                    var fixleft = first_err.offset().left;
                    var positionType = options.promptPosition;
                    if (typeof (positionType) == 'string' && positionType.indexOf(":") != -1)
                        positionType = positionType.substring(0, positionType.indexOf(":"));
                    if (positionType != "bottomRight" && positionType != "bottomLeft") {
                        var prompt_err = methods._getPrompt(first_err);
                        if (prompt_err) {
                            destination = prompt_err.offset().top;
                        }
                    }
                    if (options.scrollOffset) {
                        destination -= options.scrollOffset;
                    }
                    if (options.isOverflown) {
                        var overflowDIV = $(options.overflownDIV);
                        if (!overflowDIV.length) return false;
                        var scrollContainerScroll = overflowDIV.scrollTop();
                        var scrollContainerPos = -parseInt(overflowDIV.offset().top);
                        destination += scrollContainerScroll + scrollContainerPos - 5;
                        var scrollContainer = $(options.overflownDIV + ":not(:animated)");
                        scrollContainer.animate({
                            scrollTop: destination
                        }, 1100, function () {
                            if (options.focusFirstField) first_err.focus();
                        });
                    } else {
                        $("html, body").animate({
                            scrollTop: destination
                        }, 1100, function () {
                            if (options.focusFirstField) first_err.focus();
                        });
                        $("html, body").animate({
                            scrollLeft: fixleft
                        }, 1100)
                    }
                } else if (options.focusFirstField)
                    first_err.focus();
                return false;
            }
            return true;
        },
        _validateFormWithAjax: function (form, options) {
            var data = form.serialize();
            var type = (options.ajaxFormValidationMethod) ? options.ajaxFormValidationMethod : "GET";
            var url = (options.ajaxFormValidationURL) ? options.ajaxFormValidationURL : form.attr("action");
            var dataType = (options.dataType) ? options.dataType : "json";
            $.ajax({
                type: type,
                url: url,
                cache: false,
                dataType: dataType,
                data: data,
                form: form,
                methods: methods,
                options: options,
                beforeSend: function () {
                    return options.onBeforeAjaxFormValidation(form, options);
                },
                error: function (data, transport) {
                    methods._ajaxError(data, transport);
                },
                success: function (json) {
                    if ((dataType == "json") && (json !== true)) {
                        var errorInForm = false;
                        for (var i = 0; i < json.length; i++) {
                            var value = json[i];
                            var errorFieldId = value[0];
                            var errorField = $($("#" + errorFieldId)[0]);
                            if (errorField.length == 1) {
                                var msg = value[2];
                                if (value[1] == true) {
                                    if (msg == "" || !msg) {
                                        methods._closePrompt(errorField);
                                    } else {
                                        if (options.allrules[msg]) {
                                            var txt = options.allrules[msg].alertTextOk;
                                            if (txt)
                                                msg = txt;
                                        }
                                        if (options.showPrompts) methods._showPrompt(errorField, msg, "pass", false, options, true);
                                    }
                                } else {
                                    errorInForm |= true;
                                    if (options.allrules[msg]) {
                                        var txt = options.allrules[msg].alertText;
                                        if (txt)
                                            msg = txt;
                                    }
                                    if (options.showPrompts) methods._showPrompt(errorField, msg, "", false, options, true);
                                }
                            }
                        }
                        options.onAjaxFormComplete(!errorInForm, form, json, options);
                    } else
                        options.onAjaxFormComplete(true, form, json, options);
                }
            });
        },
        _validateField: function (field, options, skipAjaxValidation) {
            if (!field.attr("id")) {
                field.attr("id", "form-validation-field-" + $.validationEngine.fieldIdCounter);
                ++$.validationEngine.fieldIdCounter;
            }
            if (!options.validateNonVisibleFields && (field.is(":hidden") && !options.prettySelect || field.parent().is(":hidden")))
                return false;
            var rulesParsing = field.attr(options.validateAttribute);
            var getRules = /validate\[(.*)\]/.exec(rulesParsing);
            if (!getRules)
                return false;
            var str = getRules[1];
            var rules = str.split(/\[|,|\]/);
            var isAjaxValidator = false;
            var fieldName = field.attr("name");
            var promptText = "";
            var promptType = "";
            var required = false;
            var limitErrors = false;
            options.isError = false;
            options.showArrow = true;
            if (options.maxErrorsPerField > 0) {
                limitErrors = true;
            }
            var form = $(field.closest("form, .validationEngineContainer"));
            for (var i = 0; i < rules.length; i++) {
                rules[i] = rules[i].replace(" ", "");
                if (rules[i] === '') {
                    delete rules[i];
                }
            }
            for (var i = 0, field_errors = 0; i < rules.length; i++) {
                if (limitErrors && field_errors >= options.maxErrorsPerField) {
                    if (!required) {
                        var have_required = $.inArray('required', rules);
                        required = (have_required != -1 && have_required >= i);
                    }
                    break;
                }
                var errorMsg = undefined;
                switch (rules[i]) {
                    case "required":
                        required = true;
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._required);
                        break;
                    case "custom":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._custom);
                        break;
                    case "groupRequired":
                        var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
                        var firstOfGroup = form.find(classGroup).eq(0);
                        if (firstOfGroup[0] != field[0]) {
                            methods._validateField(firstOfGroup, options, skipAjaxValidation);
                            options.showArrow = true;
                        }
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._groupRequired);
                        if (errorMsg) required = true;
                        options.showArrow = false;
                        break;
                    case "ajax":
                        errorMsg = methods._ajax(field, rules, i, options);
                        if (errorMsg) {
                            promptType = "load";
                        }
                        break;
                    case "minSize":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._minSize);
                        break;
                    case "maxSize":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._maxSize);
                        break;
                    case "min":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._min);
                        break;
                    case "max":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._max);
                        break;
                    case "past":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._past);
                        break;
                    case "future":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._future);
                        break;
                    case "dateRange":
                        var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
                        options.firstOfGroup = form.find(classGroup).eq(0);
                        options.secondOfGroup = form.find(classGroup).eq(1);
                        if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
                            errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._dateRange);
                        }
                        if (errorMsg) required = true;
                        options.showArrow = false;
                        break;
                    case "dateTimeRange":
                        var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
                        options.firstOfGroup = form.find(classGroup).eq(0);
                        options.secondOfGroup = form.find(classGroup).eq(1);
                        if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
                            errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._dateTimeRange);
                        }
                        if (errorMsg) required = true;
                        options.showArrow = false;
                        break;
                    case "maxCheckbox":
                        field = $(form.find("input[name='" + fieldName + "']"));
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._maxCheckbox);
                        break;
                    case "minCheckbox":
                        field = $(form.find("input[name='" + fieldName + "']"));
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._minCheckbox);
                        break;
                    case "equals":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._equals);
                        break;
                    case "funcCall":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._funcCall);
                        break;
                    case "creditCard":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._creditCard);
                        break;
                    case "condRequired":
                        errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._condRequired);
                        if (errorMsg !== undefined) {
                            required = true;
                        }
                        break;
                    default:
                }
                var end_validation = false;
                if (typeof errorMsg == "object") {
                    switch (errorMsg.status) {
                        case "_break":
                            end_validation = true;
                            break;
                        case "_error":
                            errorMsg = errorMsg.message;
                            break;
                        case "_error_no_prompt":
                            return true;
                            break;
                        default:
                            break;
                    }
                }
                if (end_validation) {
                    break;
                }
                if (typeof errorMsg == 'string') {
                    promptText += errorMsg + "<br/>";
                    options.isError = true;
                    field_errors++;
                }
            }
            if (!required && !(field.val()) && field.val().length < 1) options.isError = false;
            var fieldType = field.prop("type");
            var positionType = field.data("promptPosition") || options.promptPosition;
            if ((fieldType == "radio" || fieldType == "checkbox") && form.find("input[name='" + fieldName + "']").size() > 1) {
                if (positionType === 'inline') {
                    field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:last"));
                } else {
                    field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
                }
                options.showArrow = false;
            }
            if (field.is(":hidden") && options.prettySelect) {
                field = form.find("#" + options.usePrefix + methods._jqSelector(field.attr('id')) + options.useSuffix);
            }
            if (options.isError && options.showPrompts) {
                methods._showPrompt(field, promptText, promptType, false, options);
            } else {
                if (!isAjaxValidator) methods._closePrompt(field);
            }
            if (!isAjaxValidator) {
                field.trigger("jqv.field.result", [field, options.isError, promptText]);
            }
            var errindex = $.inArray(field[0], options.InvalidFields);
            if (errindex == -1) {
                if (options.isError)
                    options.InvalidFields.push(field[0]);
            } else if (!options.isError) {
                options.InvalidFields.splice(errindex, 1);
            }
            methods._handleStatusCssClasses(field, options);
            if (options.isError && options.onFieldFailure)
                options.onFieldFailure(field);
            if (!options.isError && options.onFieldSuccess)
                options.onFieldSuccess(field);
            return options.isError;
        },
        _handleStatusCssClasses: function (field, options) {
            if (options.addSuccessCssClassToField)
                field.removeClass(options.addSuccessCssClassToField);
            if (options.addFailureCssClassToField)
                field.removeClass(options.addFailureCssClassToField);
            if (options.addSuccessCssClassToField && !options.isError)
                field.addClass(options.addSuccessCssClassToField);
            if (options.addFailureCssClassToField && options.isError)
                field.addClass(options.addFailureCssClassToField);
        },
        _getErrorMessage: function (form, field, rule, rules, i, options, originalValidationMethod) {
            var rule_index = jQuery.inArray(rule, rules);
            if (rule === "custom" || rule === "funcCall") {
                var custom_validation_type = rules[rule_index + 1];
                rule = rule + "[" + custom_validation_type + "]";
                delete(rules[rule_index]);
            }
            var alteredRule = rule;
            var element_classes = (field.attr("data-validation-engine")) ? field.attr("data-validation-engine") : field.attr("class");
            var element_classes_array = element_classes.split(" ");
            var errorMsg;
            if (rule == "future" || rule == "past" || rule == "maxCheckbox" || rule == "minCheckbox") {
                errorMsg = originalValidationMethod(form, field, rules, i, options);
            } else {
                errorMsg = originalValidationMethod(field, rules, i, options);
            }
            if (errorMsg != undefined) {
                var custom_message = methods._getCustomErrorMessage($(field), element_classes_array, alteredRule, options);
                if (custom_message) errorMsg = custom_message;
            }
            return errorMsg;
        },
        _getCustomErrorMessage: function (field, classes, rule, options) {
            var custom_message = false;
            var validityProp = methods._validityProp[rule];
            if (validityProp != undefined) {
                custom_message = field.attr("data-errormessage-" + validityProp);
                if (custom_message != undefined)
                    return custom_message;
            }
            custom_message = field.attr("data-errormessage");
            if (custom_message != undefined)
                return custom_message;
            var id = '#' + field.attr("id");
            if (typeof options.custom_error_messages[id] != "undefined" && typeof options.custom_error_messages[id][rule] != "undefined") {
                custom_message = options.custom_error_messages[id][rule]['message'];
            } else if (classes.length > 0) {
                for (var i = 0; i < classes.length && classes.length > 0; i++) {
                    var element_class = "." + classes[i];
                    if (typeof options.custom_error_messages[element_class] != "undefined" && typeof options.custom_error_messages[element_class][rule] != "undefined") {
                        custom_message = options.custom_error_messages[element_class][rule]['message'];
                        break;
                    }
                }
            }
            if (!custom_message && typeof options.custom_error_messages[rule] != "undefined" && typeof options.custom_error_messages[rule]['message'] != "undefined") {
                custom_message = options.custom_error_messages[rule]['message'];
            }
            return custom_message;
        },
        _validityProp: {
            "required": "value-missing",
            "custom": "custom-error",
            "groupRequired": "value-missing",
            "ajax": "custom-error",
            "minSize": "range-underflow",
            "maxSize": "range-overflow",
            "min": "range-underflow",
            "max": "range-overflow",
            "past": "type-mismatch",
            "future": "type-mismatch",
            "dateRange": "type-mismatch",
            "dateTimeRange": "type-mismatch",
            "maxCheckbox": "range-overflow",
            "minCheckbox": "range-underflow",
            "equals": "pattern-mismatch",
            "funcCall": "custom-error",
            "creditCard": "pattern-mismatch",
            "condRequired": "value-missing"
        },
        _required: function (field, rules, i, options, condRequired) {
            switch (field.prop("type")) {
                case "text":
                case "password":
                case "textarea":
                case "file":
                case "select-one":
                case "select-multiple":
                default:
                    var field_val = $.trim(field.val());
                    var dv_placeholder = $.trim(field.attr("data-validation-placeholder"));
                    var placeholder = $.trim(field.attr("placeholder"));
                    if ((!field_val) || (dv_placeholder && field_val == dv_placeholder) || (placeholder && field_val == placeholder)) {
                        return options.allrules[rules[i]].alertText;
                    }
                    break;
                case "radio":
                case "checkbox":
                    if (condRequired) {
                        if (!field.attr('checked')) {
                            return options.allrules[rules[i]].alertTextCheckboxMultiple;
                        }
                        break;
                    }
                    var form = field.closest("form, .validationEngineContainer");
                    var name = field.attr("name");
                    if (form.find("input[name='" + name + "']:checked").size() == 0) {
                        if (form.find("input[name='" + name + "']:visible").size() == 1)
                            return options.allrules[rules[i]].alertTextCheckboxe;
                        else
                            return options.allrules[rules[i]].alertTextCheckboxMultiple;
                    }
                    break;
            }
        },
        _groupRequired: function (field, rules, i, options) {
            var classGroup = "[" + options.validateAttribute + "*=" + rules[i + 1] + "]";
            var isValid = false;
            field.closest("form, .validationEngineContainer").find(classGroup).each(function () {
                if (!methods._required($(this), rules, i, options)) {
                    isValid = true;
                    return false;
                }
            });
            if (!isValid) {
                return options.allrules[rules[i]].alertText;
            }
        },
        _custom: function (field, rules, i, options) {
            var customRule = rules[i + 1];
            var rule = options.allrules[customRule];
            var fn;
            if (!rule) {
                alert("jqv:custom rule not found - " + customRule);
                return;
            }
            if (rule["regex"]) {
                var ex = rule.regex;
                if (!ex) {
                    alert("jqv:custom regex not found - " + customRule);
                    return;
                }
                var pattern = new RegExp(ex);
                if (!pattern.test(field.val())) return options.allrules[customRule].alertText;
            } else if (rule["func"]) {
                fn = rule["func"];
                if (typeof (fn) !== "function") {
                    alert("jqv:custom parameter 'function' is no function - " + customRule);
                    return;
                }
                if (!fn(field, rules, i, options))
                    return options.allrules[customRule].alertText;
            } else {
                alert("jqv:custom type not allowed " + customRule);
                return;
            }
        },
        _funcCall: function (field, rules, i, options) {
            var functionName = rules[i + 1];
            var fn;
            if (functionName.indexOf('.') > -1) {
                var namespaces = functionName.split('.');
                var scope = window;
                while (namespaces.length) {
                    scope = scope[namespaces.shift()];
                }
                fn = scope;
            } else
                fn = window[functionName] || options.customFunctions[functionName];
            if (typeof (fn) == 'function')
                return fn(field, rules, i, options);
        },
        _equals: function (field, rules, i, options) {
            var equalsField = rules[i + 1];
            if (field.val() != $("#" + equalsField).val())
                return options.allrules.equals.alertText;
        },
        _maxSize: function (field, rules, i, options) {
            var max = rules[i + 1];
            var len = field.val().length;
            if (len > max) {
                var rule = options.allrules.maxSize;
                return rule.alertText + max + rule.alertText2;
            }
        },
        _minSize: function (field, rules, i, options) {
            var min = rules[i + 1];
            var len = field.val().length;
            if (len < min) {
                var rule = options.allrules.minSize;
                return rule.alertText + min + rule.alertText2;
            }
        },
        _min: function (field, rules, i, options) {
            var min = parseFloat(rules[i + 1]);
            var len = parseFloat(field.val());
            if (len < min) {
                var rule = options.allrules.min;
                if (rule.alertText2) return rule.alertText + min + rule.alertText2;
                return rule.alertText + min;
            }
        },
        _max: function (field, rules, i, options) {
            var max = parseFloat(rules[i + 1]);
            var len = parseFloat(field.val());
            if (len > max) {
                var rule = options.allrules.max;
                if (rule.alertText2) return rule.alertText + max + rule.alertText2;
                return rule.alertText + max;
            }
        },
        _past: function (form, field, rules, i, options) {
            var p = rules[i + 1];
            var fieldAlt = $(form.find("input[name='" + p.replace(/^#+/, '') + "']"));
            var pdate;
            if (p.toLowerCase() == "now") {
                pdate = new Date();
            } else if (undefined != fieldAlt.val()) {
                if (fieldAlt.is(":disabled"))
                    return;
                pdate = methods._parseDate(fieldAlt.val());
            } else {
                pdate = methods._parseDate(p);
            }
            var vdate = methods._parseDate(field.val());
            if (vdate > pdate) {
                var rule = options.allrules.past;
                if (rule.alertText2) return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
                return rule.alertText + methods._dateToString(pdate);
            }
        },
        _future: function (form, field, rules, i, options) {
            var p = rules[i + 1];
            var fieldAlt = $(form.find("input[name='" + p.replace(/^#+/, '') + "']"));
            var pdate;
            if (p.toLowerCase() == "now") {
                pdate = new Date();
            } else if (undefined != fieldAlt.val()) {
                if (fieldAlt.is(":disabled"))
                    return;
                pdate = methods._parseDate(fieldAlt.val());
            } else {
                pdate = methods._parseDate(p);
            }
            var vdate = methods._parseDate(field.val());
            if (vdate < pdate) {
                var rule = options.allrules.future;
                if (rule.alertText2)
                    return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
                return rule.alertText + methods._dateToString(pdate);
            }
        },
        _isDate: function (value) {
            var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
            return dateRegEx.test(value);
        },
        _isDateTime: function (value) {
            var dateTimeRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/);
            return dateTimeRegEx.test(value);
        },
        _dateCompare: function (start, end) {
            return (new Date(start.toString()) < new Date(end.toString()));
        },
        _dateRange: function (field, rules, i, options) {
            if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
            if (!methods._isDate(options.firstOfGroup[0].value) || !methods._isDate(options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
            if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
        },
        _dateTimeRange: function (field, rules, i, options) {
            if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
            if (!methods._isDateTime(options.firstOfGroup[0].value) || !methods._isDateTime(options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
            if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
                return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            }
        },
        _maxCheckbox: function (form, field, rules, i, options) {
            var nbCheck = rules[i + 1];
            var groupname = field.attr("name");
            var groupSize = form.find("input[name='" + groupname + "']:checked").size();
            if (groupSize > nbCheck) {
                options.showArrow = false;
                if (options.allrules.maxCheckbox.alertText2)
                    return options.allrules.maxCheckbox.alertText + " " + nbCheck + " " + options.allrules.maxCheckbox.alertText2;
                return options.allrules.maxCheckbox.alertText;
            }
        },
        _minCheckbox: function (form, field, rules, i, options) {
            var nbCheck = rules[i + 1];
            var groupname = field.attr("name");
            var groupSize = form.find("input[name='" + groupname + "']:checked").size();
            if (groupSize < nbCheck) {
                options.showArrow = false;
                return options.allrules.minCheckbox.alertText + " " + nbCheck + " " + options.allrules.minCheckbox.alertText2;
            }
        },
        _creditCard: function (field, rules, i, options) {
            var valid = false,
                cardNumber = field.val().replace(/ +/g, '').replace(/-+/g, '');
            var numDigits = cardNumber.length;
            if (numDigits >= 14 && numDigits <= 16 && parseInt(cardNumber) > 0) {
                var sum = 0,
                    i = numDigits - 1,
                    pos = 1,
                    digit, luhn = new String();
                do {
                    digit = parseInt(cardNumber.charAt(i));
                    luhn += (pos++ % 2 == 0) ? digit * 2 : digit;
                } while (--i >= 0)
                for (i = 0; i < luhn.length; i++) {
                    sum += parseInt(luhn.charAt(i));
                }
                valid = sum % 10 == 0;
            }
            if (!valid) return options.allrules.creditCard.alertText;
        },
        _ajax: function (field, rules, i, options) {
            var errorSelector = rules[i + 1];
            var rule = options.allrules[errorSelector];
            var extraData = rule.extraData;
            var extraDataDynamic = rule.extraDataDynamic;
            var data = {
                "fieldId": field.attr("id"),
                "fieldValue": field.val()
            };
            if (typeof extraData === "object") {
                $.extend(data, extraData);
            } else if (typeof extraData === "string") {
                var tempData = extraData.split("&");
                for (var i = 0; i < tempData.length; i++) {
                    var values = tempData[i].split("=");
                    if (values[0] && values[0]) {
                        data[values[0]] = values[1];
                    }
                }
            }
            if (extraDataDynamic) {
                var tmpData = [];
                var domIds = String(extraDataDynamic).split(",");
                for (var i = 0; i < domIds.length; i++) {
                    var id = domIds[i];
                    if ($(id).length) {
                        var inputValue = field.closest("form, .validationEngineContainer").find(id).val();
                        var keyValue = id.replace('#', '') + '=' + escape(inputValue);
                        data[id.replace('#', '')] = inputValue;
                    }
                }
            }
            if (options.eventTrigger == "field") {
                delete(options.ajaxValidCache[field.attr("id")]);
            }
            if (!options.isError && !methods._checkAjaxFieldStatus(field.attr("id"), options)) {
                $.ajax({
                    type: options.ajaxFormValidationMethod,
                    url: rule.url,
                    cache: false,
                    dataType: "json",
                    data: data,
                    field: field,
                    rule: rule,
                    methods: methods,
                    options: options,
                    beforeSend: function () {},
                    error: function (data, transport) {
                        methods._ajaxError(data, transport);
                    },
                    success: function (json) {
                        var errorFieldId = json[0];
                        var errorField = $("#" + errorFieldId).eq(0);
                        if (errorField.length == 1) {
                            var status = json[1];
                            var msg = json[2];
                            if (!status) {
                                options.ajaxValidCache[errorFieldId] = false;
                                options.isError = true;
                                if (msg) {
                                    if (options.allrules[msg]) {
                                        var txt = options.allrules[msg].alertText;
                                        if (txt) {
                                            msg = txt;
                                        }
                                    }
                                } else
                                    msg = rule.alertText;
                                if (options.showPrompts) methods._showPrompt(errorField, msg, "", true, options);
                            } else {
                                options.ajaxValidCache[errorFieldId] = true;
                                if (msg) {
                                    if (options.allrules[msg]) {
                                        var txt = options.allrules[msg].alertTextOk;
                                        if (txt) {
                                            msg = txt;
                                        }
                                    }
                                } else
                                    msg = rule.alertTextOk;
                                if (options.showPrompts) {
                                    if (msg)
                                        methods._showPrompt(errorField, msg, "pass", true, options);
                                    else
                                        methods._closePrompt(errorField);
                                }
                                if (options.eventTrigger == "submit")
                                    field.closest("form").submit();
                            }
                        }
                        errorField.trigger("jqv.field.result", [errorField, options.isError, msg]);
                    }
                });
                return rule.alertTextLoad;
            }
        },
        _ajaxError: function (data, transport) {
            if (data.status == 0 && transport == null)
                alert("The page is not served from a server! ajax call failed");
            else if (typeof console != "undefined")
                console.log("Ajax error: " + data.status + " " + transport);
        },
        _dateToString: function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },
        _parseDate: function (d) {
            var dateParts = d.split("-");
            if (dateParts == d)
                dateParts = d.split("/");
            if (dateParts == d) {
                dateParts = d.split(".");
                return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
            }
            return new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
        },
        _showPrompt: function (field, promptText, type, ajaxed, options, ajaxform) {
            var prompt = methods._getPrompt(field);
            if (ajaxform) prompt = false;
            if ($.trim(promptText)) {
                if (prompt)
                    methods._updatePrompt(field, prompt, promptText, type, ajaxed, options);
                else
                    methods._buildPrompt(field, promptText, type, ajaxed, options);
            }
        },
        _buildPrompt: function (field, promptText, type, ajaxed, options) {
            var prompt = $('<div>');
            prompt.addClass(methods._getClassName(field.attr("id")) + "formError");
            prompt.addClass("parentForm" + methods._getClassName(field.closest('form, .validationEngineContainer').attr("id")));
            prompt.addClass("formError");
            switch (type) {
                case "pass":
                    prompt.addClass("greenPopup");
                    break;
                case "load":
                    prompt.addClass("blackPopup");
                    break;
                default:
            }
            if (ajaxed)
                prompt.addClass("ajaxed");
            var promptContent = $('<div>').addClass("formErrorContent").html(promptText).appendTo(prompt);
            var positionType = field.data("promptPosition") || options.promptPosition;
            if (options.showArrow) {
                var arrow = $('<div>').addClass("formErrorArrow");
                if (typeof (positionType) == 'string') {
                    var pos = positionType.indexOf(":");
                    if (pos != -1)
                        positionType = positionType.substring(0, pos);
                }
                switch (positionType) {
                    case "bottomLeft":
                    case "bottomRight":
                        prompt.find(".formErrorContent").before(arrow);
                        arrow.addClass("formErrorArrowBottom").html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
                        break;
                    case "topLeft":
                    case "topRight":
                        arrow.html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
                        prompt.append(arrow);
                        break;
                }
            }
            if (options.addPromptClass)
                prompt.addClass(options.addPromptClass);
            var requiredOverride = field.attr('data-required-class');
            if (requiredOverride !== undefined) {
                prompt.addClass(requiredOverride);
            } else {
                if (options.prettySelect) {
                    if ($('#' + field.attr('id')).next().is('select')) {
                        var prettyOverrideClass = $('#' + field.attr('id').substr(options.usePrefix.length).substring(options.useSuffix.length)).attr('data-required-class');
                        if (prettyOverrideClass !== undefined) {
                            prompt.addClass(prettyOverrideClass);
                        }
                    }
                }
            }
            prompt.css({
                "opacity": 0
            });
            if (positionType === 'inline') {
                prompt.addClass("inline");
                if (typeof field.attr('data-prompt-target') !== 'undefined' && $('#' + field.attr('data-prompt-target')).length > 0) {
                    prompt.appendTo($('#' + field.attr('data-prompt-target')));
                } else {
                    field.after(prompt);
                }
            } else {
                field.before(prompt);
            }
            var pos = methods._calculatePosition(field, prompt, options);
            prompt.css({
                'position': positionType === 'inline' ? 'relative' : 'absolute',
                "top": pos.callerTopPosition,
                "left": pos.callerleftPosition,
                "marginTop": pos.marginTopSize,
                "opacity": 0
            }).data("callerField", field);
            if (options.autoHidePrompt) {
                setTimeout(function () {
                    prompt.animate({
                        "opacity": 0
                    }, function () {
                        prompt.closest('.formErrorOuter').remove();
                        prompt.remove();
                    });
                }, options.autoHideDelay);
            }
            return prompt.animate({
                "opacity": 0.87
            });
        },
        _updatePrompt: function (field, prompt, promptText, type, ajaxed, options, noAnimation) {
            if (prompt) {
                if (typeof type !== "undefined") {
                    if (type == "pass")
                        prompt.addClass("greenPopup");
                    else
                        prompt.removeClass("greenPopup");
                    if (type == "load")
                        prompt.addClass("blackPopup");
                    else
                        prompt.removeClass("blackPopup");
                }
                if (ajaxed)
                    prompt.addClass("ajaxed");
                else
                    prompt.removeClass("ajaxed");
                prompt.find(".formErrorContent").html(promptText);
                var pos = methods._calculatePosition(field, prompt, options);
                var css = {
                    "top": pos.callerTopPosition,
                    "left": pos.callerleftPosition,
                    "marginTop": pos.marginTopSize
                };
                if (noAnimation)
                    prompt.css(css);
                else
                    prompt.animate(css);
            }
        },
        _closePrompt: function (field) {
            var prompt = methods._getPrompt(field);
            if (prompt)
                prompt.fadeTo("fast", 0, function () {
                    prompt.parent('.formErrorOuter').remove();
                    prompt.remove();
                });
        },
        closePrompt: function (field) {
            return methods._closePrompt(field);
        },
        _getPrompt: function (field) {
            var formId = $(field).closest('form, .validationEngineContainer').attr('id');
            var className = methods._getClassName(field.attr("id")) + "formError";
            var match = $("." + methods._escapeExpression(className) + '.parentForm' + formId)[0];
            if (match)
                return $(match);
        },
        _escapeExpression: function (selector) {
            return selector.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, "\\$1");
        },
        isRTL: function (field) {
            var $document = $(document);
            var $body = $('body');
            var rtl = (field && field.hasClass('rtl')) || (field && (field.attr('dir') || '').toLowerCase() === 'rtl') || $document.hasClass('rtl') || ($document.attr('dir') || '').toLowerCase() === 'rtl' || $body.hasClass('rtl') || ($body.attr('dir') || '').toLowerCase() === 'rtl';
            return Boolean(rtl);
        },
        _calculatePosition: function (field, promptElmt, options) {
            var promptTopPosition, promptleftPosition, marginTopSize;
            var fieldWidth = field.width();
            var fieldLeft = field.position().left;
            var fieldTop = field.position().top;
            var fieldHeight = field.height();
            var promptHeight = promptElmt.height();
            promptTopPosition = promptleftPosition = 0;
            marginTopSize = -promptHeight;
            var positionType = field.data("promptPosition") || options.promptPosition;
            var shift1 = "";
            var shift2 = "";
            var shiftX = 0;
            var shiftY = 0;
            if (typeof (positionType) == 'string') {
                if (positionType.indexOf(":") != -1) {
                    shift1 = positionType.substring(positionType.indexOf(":") + 1);
                    positionType = positionType.substring(0, positionType.indexOf(":"));
                    if (shift1.indexOf(",") != -1) {
                        shift2 = shift1.substring(shift1.indexOf(",") + 1);
                        shift1 = shift1.substring(0, shift1.indexOf(","));
                        shiftY = parseInt(shift2);
                        if (isNaN(shiftY)) shiftY = 0;
                    };
                    shiftX = parseInt(shift1);
                    if (isNaN(shift1)) shift1 = 0;
                };
            };
            switch (positionType) {
                default:
                case "topRight":
                    promptleftPosition += fieldLeft + fieldWidth - 30;
                    promptTopPosition += fieldTop;
                    break;
                case "topLeft":
                    promptTopPosition += fieldTop;
                    promptleftPosition += fieldLeft;
                    break;
                case "centerRight":
                    promptTopPosition = fieldTop + 4;
                    marginTopSize = 0;
                    promptleftPosition = fieldLeft + field.outerWidth(true) + 5;
                    break;
                case "centerLeft":
                    promptleftPosition = fieldLeft - (promptElmt.width() + 2);
                    promptTopPosition = fieldTop + 4;
                    marginTopSize = 0;
                    break;
                case "bottomLeft":
                    promptTopPosition = fieldTop + field.height() + 5;
                    marginTopSize = 0;
                    promptleftPosition = fieldLeft;
                    break;
                case "bottomRight":
                    promptleftPosition = fieldLeft + fieldWidth - 30;
                    promptTopPosition = fieldTop + field.height() + 5;
                    marginTopSize = 0;
                    break;
                case "inline":
                    promptleftPosition = 0;
                    promptTopPosition = 0;
                    marginTopSize = 0;
            };
            promptleftPosition += shiftX;
            promptTopPosition += shiftY;
            return {
                "callerTopPosition": promptTopPosition + "px",
                "callerleftPosition": promptleftPosition + "px",
                "marginTopSize": marginTopSize + "px"
            };
        },
        _saveOptions: function (form, options) {
            if ($.validationEngineLanguage)
                var allRules = $.validationEngineLanguage.allRules;
            else
                $.error("jQuery.validationEngine rules are not loaded, plz add localization files to the page");
            $.validationEngine.defaults.allrules = allRules;
            var userOptions = $.extend(true, {}, $.validationEngine.defaults, options);
            form.data('jqv', userOptions);
            return userOptions;
        },
        _getClassName: function (className) {
            if (className)
                return className.replace(/:/g, "_").replace(/\./g, "_");
        },
        _jqSelector: function (str) {
            return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
        },
        _condRequired: function (field, rules, i, options) {
            var idx, dependingField;
            for (idx = (i + 1); idx < rules.length; idx++) {
                dependingField = jQuery("#" + rules[idx]).first();
                if (dependingField.length && methods._required(dependingField, ["required"], 0, options, true) == undefined) {
                    return methods._required(field, ["required"], 0, options);
                }
            }
        },
        _submitButtonClick: function (event) {
            var button = $(this);
            var form = button.closest('form, .validationEngineContainer');
            form.data("jqv_submitButton", button.attr("id"));
        }
    };
    $.fn.validationEngine = function (method) {
        var form = $(this);
        if (!form[0]) return form;
        if (typeof (method) == 'string' && method.charAt(0) != '_' && methods[method]) {
            if (method != "showPrompt" && method != "hide" && method != "hideAll")
                methods.init.apply(form);
            return methods[method].apply(form, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method == 'object' || !method) {
            methods.init.apply(form, arguments);
            return methods.attach.apply(form);
        } else {
            $.error('Method ' + method + ' does not exist in jQuery.validationEngine');
        }
    };
    $.validationEngine = {
        fieldIdCounter: 0,
        defaults: {
            validationEventTrigger: "blur",
            scroll: true,
            focusFirstField: true,
            showPrompts: true,
            validateNonVisibleFields: false,
            promptPosition: "topRight",
            bindMethod: "bind",
            inlineAjax: false,
            ajaxFormValidation: false,
            ajaxFormValidationURL: false,
            ajaxFormValidationMethod: 'get',
            onAjaxFormComplete: $.noop,
            onBeforeAjaxFormValidation: $.noop,
            onValidationComplete: false,
            doNotShowAllErrosOnSubmit: false,
            custom_error_messages: {},
            binded: true,
            showArrow: true,
            isError: false,
            maxErrorsPerField: false,
            ajaxValidCache: {},
            autoPositionUpdate: false,
            InvalidFields: [],
            onFieldSuccess: false,
            onFieldFailure: false,
            onSuccess: false,
            onFailure: false,
            validateAttribute: "class",
            addSuccessCssClassToField: "",
            addFailureCssClassToField: "",
            autoHidePrompt: false,
            autoHideDelay: 10000,
            fadeDuration: 0.3,
            prettySelect: false,
            addPromptClass: "",
            usePrefix: "",
            useSuffix: "",
            showOneMessage: false
        }
    };
    $(function () {
        $.validationEngine.defaults.promptPosition = methods.isRTL() ? 'topLeft' : "topRight"
    });
})(jQuery);

function version_compare(t, i) {
    if (t === i) return 0;
    for (var a = t.split("."), n = i.split("."), l = Math.min(a.length, n.length), e = 0; l > e; e++) {
        if (parseInt(a[e]) > parseInt(n[e])) return 1;
        if (parseInt(a[e]) < parseInt(n[e])) return -1
    }
    return a.length > n.length ? 1 : a.length < n.length ? -1 : 0
}
jQuery(function (t) {
    void 0 === t.fn.on && (t.fn.on = function (i, a, n, l) {
        return "function" == typeof a ? t(this.context).live(i, a) : t(a).live(i, n, l), this
    }), t(document).on("click", ".showerrors", function () {
        return t(".xdetailed-errors").toggle(), !1
    }), t(document).on("click", ".shownotices", function () {
        return t(".xdetailed-updated").toggle(), !1
    }), t("form.widget_wysija").on("focus", "input[placeholder]", function () {
        t(this).val() === t(this).attr("placeholder") && t(this).val("")
    }), t("form.widget_wysija").on("blur", "input[placeholder]", function () {
        "" === t(this).val() && t(this).val(t(this).attr("placeholder"))
    }), t("form.widget_wysija").on("focus", "input.defaultlabels", function () {
        t(this).val() === t(this).attr("title") && t(this).val("")
    }), t("form.widget_wysija").on("blur", "input.defaultlabels", function () {
        "" === t(this).val() && t(this).val(t(this).attr("title"))
    }), t(document).on("submit", "form.widget_wysija", function (i) {
        if (i.preventDefault(), void 0 !== wysijaAJAX.noajax) return t(this).validationEngine("validate");
        if (t(this).validationEngine("validate") === !0) {
            var a = t(this).find('input[name="action"]').val(),
                n = t(this).find('input[name="controller"]').val(),
                l = t(this).attr("id"),
                e = t(this).serializeArray();
            wysijaAJAX.task = a, wysijaAJAX.controller = n, wysijaAJAX.formid = l, t.each(e, function (t, i) {
                wysijaAJAX["data[" + t + "][name]"] = i.name, wysijaAJAX["data[" + t + "][value]"] = i.value
            }), t("#msg-" + l).html('<div class="allmsgs"><blink>' + wysijaAJAX.loadingTrans + "</blink></div>"), t("#" + l).fadeOut(), t.ajax({
                type: "post",
                url: wysijaAJAX.ajaxurl,
                data: wysijaAJAX,
                success: function (i) {
                    t("#msg-" + l).html('<div class="allmsgs"></div>'), i.result || t("#" + l).fadeIn(), t.each(i.msgs, function (i, a) {
                        t("#msg-" + l + " .allmsgs ." + i + " ul").length || t("#msg-" + l + " .allmsgs").append('<div class="' + i + '"><ul></ul></div>'), t.each(a, function (a, n) {
                            t("#msg-" + l + " .allmsgs ." + i + " ul").append("<li>" + n + "</li>")
                        })
                    })
                },
                error: function (i, a, n) {
                    t("#msg-" + l).html('<div class="allmsgs"></div>'), t("#msg-" + l + " .allmsgs").html('<div class="error"><ul><li>Oops! There is a problem with this form:</li><li>textStatus:' + a + "</li><li>errorThrown:" + n + "</li><li>responseText:" + i.responseText + "</li></ul></div>")
                },
                dataType: "jsonp"
            })
        }
        return !1
    }), t(function () {
        var i = "centerRight";
        wysijaAJAX.is_rtl && (i = "centerLeft"), t("form.widget_wysija").validationEngine("attach", {
            promptPosition: i,
            scroll: !1
        }), t("form.widget_wysija").bind("jqv.form.validating", function () {
            t(this).find("input[placeholder]").each(function () {
                t(this).val() === t(this).attr("placeholder") && t(this).val("")
            })
        }), t("form.widget_wysija").find("input[placeholder]").each(function () {
            "" === t(this).val() && t(this).val(t(this).attr("placeholder"))
        }), t("form.widget_wysija").bind("jqv.form.validating", function () {
            t(this).find("input.defaultlabels").each(function () {
                t(this).val() === t(this).attr("title") && t(this).val("")
            })
        }), t("form.widget_wysija").find("input.defaultlabels").each(function () {
            "" === t(this).val() && t(this).val(t(this).attr("title"))
        })
    })
});

function version_compare(t, i) {
    if (t === i) return 0;
    for (var a = t.split("."), n = i.split("."), l = Math.min(a.length, n.length), e = 0; l > e; e++) {
        if (parseInt(a[e]) > parseInt(n[e])) return 1;
        if (parseInt(a[e]) < parseInt(n[e])) return -1
    }
    return a.length > n.length ? 1 : a.length < n.length ? -1 : 0
}
jQuery(function (t) {
    void 0 === t.fn.on && (t.fn.on = function (i, a, n, l) {
        return "function" == typeof a ? t(this.context).live(i, a) : t(a).live(i, n, l), this
    }), t(document).on("click", ".showerrors", function () {
        return t(".xdetailed-errors").toggle(), !1
    }), t(document).on("click", ".shownotices", function () {
        return t(".xdetailed-updated").toggle(), !1
    }), t("form.widget_wysija").on("focus", "input[placeholder]", function () {
        t(this).val() === t(this).attr("placeholder") && t(this).val("")
    }), t("form.widget_wysija").on("blur", "input[placeholder]", function () {
        "" === t(this).val() && t(this).val(t(this).attr("placeholder"))
    }), t("form.widget_wysija").on("focus", "input.defaultlabels", function () {
        t(this).val() === t(this).attr("title") && t(this).val("")
    }), t("form.widget_wysija").on("blur", "input.defaultlabels", function () {
        "" === t(this).val() && t(this).val(t(this).attr("title"))
    }), t(document).on("submit", "form.widget_wysija", function (i) {
        if (i.preventDefault(), void 0 !== wysijaAJAX.noajax) return t(this).validationEngine("validate");
        if (t(this).validationEngine("validate") === !0) {
            var a = t(this).find('input[name="action"]').val(),
                n = t(this).find('input[name="controller"]').val(),
                l = t(this).attr("id"),
                e = t(this).serializeArray();
            wysijaAJAX.task = a, wysijaAJAX.controller = n, wysijaAJAX.formid = l, t.each(e, function (t, i) {
                wysijaAJAX["data[" + t + "][name]"] = i.name, wysijaAJAX["data[" + t + "][value]"] = i.value
            }), t("#msg-" + l).html('<div class="allmsgs"><blink>' + wysijaAJAX.loadingTrans + "</blink></div>"), t("#" + l).fadeOut(), t.ajax({
                type: "post",
                url: wysijaAJAX.ajaxurl,
                data: wysijaAJAX,
                success: function (i) {
                    t("#msg-" + l).html('<div class="allmsgs"></div>'), i.result || t("#" + l).fadeIn(), t.each(i.msgs, function (i, a) {
                        t("#msg-" + l + " .allmsgs ." + i + " ul").length || t("#msg-" + l + " .allmsgs").append('<div class="' + i + '"><ul></ul></div>'), t.each(a, function (a, n) {
                            t("#msg-" + l + " .allmsgs ." + i + " ul").append("<li>" + n + "</li>")
                        })
                    })
                },
                error: function (i, a, n) {
                    t("#msg-" + l).html('<div class="allmsgs"></div>'), t("#msg-" + l + " .allmsgs").html('<div class="error"><ul><li>Oops! There is a problem with this form:</li><li>textStatus:' + a + "</li><li>errorThrown:" + n + "</li><li>responseText:" + i.responseText + "</li></ul></div>")
                },
                dataType: "jsonp"
            })
        }
        return !1
    }), t(function () {
        var i = "centerRight";
        wysijaAJAX.is_rtl && (i = "centerLeft"), t("form.widget_wysija").validationEngine("attach", {
            promptPosition: i,
            scroll: !1
        }), t("form.widget_wysija").bind("jqv.form.validating", function () {
            t(this).find("input[placeholder]").each(function () {
                t(this).val() === t(this).attr("placeholder") && t(this).val("")
            })
        }), t("form.widget_wysija").find("input[placeholder]").each(function () {
            "" === t(this).val() && t(this).val(t(this).attr("placeholder"))
        }), t("form.widget_wysija").bind("jqv.form.validating", function () {
            t(this).find("input.defaultlabels").each(function () {
                t(this).val() === t(this).attr("title") && t(this).val("")
            })
        }), t("form.widget_wysija").find("input.defaultlabels").each(function () {
            "" === t(this).val() && t(this).val(t(this).attr("title"))
        })
    })
});

! function ($) {
    $.vidbg = function (o, e) {
        function t(o) {
            var e = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            o = o.replace(e, function (o, e, t, i) {
                return e + e + t + t + i + i
            });
            var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);
            return t ? {
                r: parseInt(t[1], 16),
                g: parseInt(t[2], 16),
                b: parseInt(t[3], 16)
            } : null
        }
        var i = this;
        i.$el = $(o), i.el = o, i.$el.data("vidbg", i), i.init = function () {
            i.options = $.extend({}, $.vidbg.defaultOptions, e), i.container(), i.displayPoster(), i.selfHostVideo(), i.tapToUnmute(), i.overlay()
        }, i.isMobile = function () {
            return !!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)
        }, i.container = function () {
            var o = i.$container = $('<div class="vidbg-container">');
            "static" === i.$el.css("position") && i.$el.css("position", "relative"), i.$el.css("z-index", "1"), $(i.$el).prepend(o), i.$el.is("body") && o.css({
                position: "fixed"
            })
        }, i.overlay = function () {
            var o = i.$container,
                e = i.$overlay = $('<div class="vidbg-overlay">');
            !0 === i.options.overlay && e.css({
                background: "rgba(" + t(i.options.overlayColor).r + ", " + t(i.options.overlayColor).g + ", " + t(i.options.overlayColor).b + ", " + i.options.overlayAlpha + ")"
            }), o.append(e)
        }, i.tapToUnmute = function () {
            if (!1 !== i.options.tapToUnmute) {
                var o = i.$tapToUnmuteButton = $('<div class="vidbg-tap-to-unmute">' + i.options.tapToUnmuteText + "</div>");
                o.on("click", function (o) {
                    o.preventDefault(), i.$selfHostVideo.prop("muted", !1), this.remove()
                }), i.$el.append(o)
            }
        }, i.displayPoster = function (o) {
            var e = i.$container;
            "#" !== i.options.poster && (!0 === o && e.css("background-image", "url(" + i.options.poster + ")"), !0 === i.isMobile() ? e.css("background-image", "url(" + i.options.poster + ")") : "#" === i.options.mp4 && "#" === i.options.webm && e.css("background-image", "url(" + i.options.poster + ")"))
        }, i.selfHostVideo = function () {
            if (!0 !== i.isMobile() && ("#" !== i.options.mp4 || "#" !== i.options.webm)) {
                var o = i.$container,
                    e = i.$selfHostVideo = $('<video playsinline><source src="' + i.options.mp4 + '" type="video/mp4"><source src="' + i.options.webm + '" type="video/webm"></video>');
                try {
                    e.prop({
                        autoplay: !0,
                        loop: i.options.repeat,
                        volume: 1,
                        muted: i.options.mute,
                        defaultMuted: i.options.mute,
                        playbackRate: 1,
                        defaultPlaybackRate: 1
                    })
                } catch (o) {
                    console.log("error")
                }
                var t = e.get(0).play();
                void 0 !== t && t.then(function () {}).catch(function (o) {
                    i.displayPoster(!0)
                }), e.one("canplaythrough.vidbg", function () {
                    i.resize()
                }), e.one("playing.vidbg", function () {
                    e.css({
                        opacity: 1
                    })
                }), o.append(e)
            }
        }, i.resize = function () {
            if (!0 !== i.isMobile() && ("#" !== i.options.mp4 || "#" !== i.options.webm)) {
                var o = i.$container,
                    e = o.outerHeight(),
                    t = o.outerWidth(),
                    n;
                n = i.$selfHostVideo;
                var a, s;
                a = n[0].videoHeight, s = n[0].videoWidth, t / s > e / a ? n.css({
                    width: t + 2,
                    height: "auto"
                }) : n.css({
                    width: "auto",
                    height: e + 2
                })
            }
        }, i.init()
    }, $.vidbg.defaultOptions = {
        mp4: "#",
        webm: "#",
        poster: "#",
        mute: !0,
        tapToUnmute: !1,
        tapToUnmuteText: "Tap to unmute",
        repeat: !0,
        overlay: !1,
        overlayColor: "#000",
        overlayAlpha: "0.3"
    }, $.fn.vidbg = function (o) {
        return this.each(function () {
            var e = new $.vidbg(this, o);
            $(this).data("vidbg", e), $(window).resize(function () {
                e.resize()
            })
        })
    }
}(jQuery);
(function () {
    var container, button, menu, links, i, len;
    container = document.getElementById('site-navigation');
    if (!container) {
        return;
    }
    button = container.getElementsByTagName('button')[0];
    if ('undefined' === typeof button) {
        return;
    }
    menu = container.getElementsByTagName('ul')[0];
    if ('undefined' === typeof menu) {
        button.style.display = 'none';
        return;
    }
    menu.setAttribute('aria-expanded', 'false');
    if (-1 === menu.className.indexOf('nav-menu')) {
        menu.className += ' nav-menu';
    }
    button.onclick = function () {
        if (-1 !== container.className.indexOf('toggled')) {
            container.className = container.className.replace(' toggled', '');
            button.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-expanded', 'false');
        } else {
            container.className += ' toggled';
            button.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-expanded', 'true');
        }
    };
    links = menu.getElementsByTagName('a');
    for (i = 0, len = links.length; i < len; i++) {
        links[i].addEventListener('focus', toggleFocus, true);
        links[i].addEventListener('blur', toggleFocus, true);
    }

    function toggleFocus() {
        var self = this;
        while (-1 === self.className.indexOf('nav-menu')) {
            if ('li' === self.tagName.toLowerCase()) {
                if (-1 !== self.className.indexOf('focus')) {
                    self.className = self.className.replace(' focus', '');
                } else {
                    self.className += ' focus';
                }
            }
            self = self.parentElement;
        }
    }
    (function (container) {
        var touchStartFn, i, parentLink = container.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');
        if ('ontouchstart' in window) {
            touchStartFn = function (e) {
                var menuItem = this.parentNode,
                    i;
                if (!menuItem.classList.contains('focus')) {
                    e.preventDefault();
                    for (i = 0; i < menuItem.parentNode.children.length; ++i) {
                        if (menuItem === menuItem.parentNode.children[i]) {
                            continue;
                        }
                        menuItem.parentNode.children[i].classList.remove('focus');
                    }
                    menuItem.classList.add('focus');
                } else {
                    menuItem.classList.remove('focus');
                }
            };
            for (i = 0; i < parentLink.length; ++i) {
                parentLink[i].addEventListener('touchstart', touchStartFn, false);
            }
        }
    }(container));
})();
(function () {
    var isIe = /(trident|msie)/i.test(navigator.userAgent);
    if (isIe && document.getElementById && window.addEventListener) {
        window.addEventListener('hashchange', function () {
            var id = location.hash.substring(1),
                element;
            if (!(/^[A-z0-9_-]+$/.test(id))) {
                return;
            }
            element = document.getElementById(id);
            if (element) {
                if (!(/^(?:a|select|input|button|textarea)$/i.test(element.tagName))) {
                    element.tabIndex = -1;
                }
                element.focus();
            }
        }, false);
    }
})();
! function (a, b) {
    "use strict";

    function c() {
        if (!e) {
            e = !0;
            var a, c, d, f, g = -1 !== navigator.appVersion.indexOf("MSIE 10"),
                h = !!navigator.userAgent.match(/Trident.*rv:11\./),
                i = b.querySelectorAll("iframe.wp-embedded-content");
            for (c = 0; c < i.length; c++) {
                if (d = i[c], !d.getAttribute("data-secret")) f = Math.random().toString(36).substr(2, 10), d.src += "#?secret=" + f, d.setAttribute("data-secret", f);
                if (g || h) a = d.cloneNode(!0), a.removeAttribute("security"), d.parentNode.replaceChild(a, d)
            }
        }
    }
    var d = !1,
        e = !1;
    if (b.querySelector)
        if (a.addEventListener) d = !0;
    if (a.wp = a.wp || {}, !a.wp.receiveEmbedMessage)
        if (a.wp.receiveEmbedMessage = function (c) {
                var d = c.data;
                if (d)
                    if (d.secret || d.message || d.value)
                        if (!/[^a-zA-Z0-9]/.test(d.secret)) {
                            var e, f, g, h, i, j = b.querySelectorAll('iframe[data-secret="' + d.secret + '"]'),
                                k = b.querySelectorAll('blockquote[data-secret="' + d.secret + '"]');
                            for (e = 0; e < k.length; e++) k[e].style.display = "none";
                            for (e = 0; e < j.length; e++)
                                if (f = j[e], c.source === f.contentWindow) {
                                    if (f.removeAttribute("style"), "height" === d.message) {
                                        if (g = parseInt(d.value, 10), g > 1e3) g = 1e3;
                                        else if (~~g < 200) g = 200;
                                        f.height = g
                                    }
                                    if ("link" === d.message)
                                        if (h = b.createElement("a"), i = b.createElement("a"), h.href = f.getAttribute("src"), i.href = d.value, i.host === h.host)
                                            if (b.activeElement === f) a.top.location.href = d.value
                                } else;
                        }
            }, d) a.addEventListener("message", a.wp.receiveEmbedMessage, !1), b.addEventListener("DOMContentLoaded", c, !1), a.addEventListener("load", c, !1)
}(window, document);

! function (t, e) {
    "function" == typeof define && define.amd ? define(function () {
        return e(t)
    }) : e(t)
}(this, function (t) {
    var e = function () {
        function $(t) {
            return null == t ? String(t) : S[C.call(t)] || "object"
        }

        function F(t) {
            return "function" == $(t)
        }

        function k(t) {
            return null != t && t == t.window
        }

        function M(t) {
            return null != t && t.nodeType == t.DOCUMENT_NODE
        }

        function R(t) {
            return "object" == $(t)
        }

        function Z(t) {
            return R(t) && !k(t) && Object.getPrototypeOf(t) == Object.prototype
        }

        function z(t) {
            var e = !!t && "length" in t && t.length,
                n = r.type(t);
            return "function" != n && !k(t) && ("array" == n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
        }

        function q(t) {
            return a.call(t, function (t) {
                return null != t
            })
        }

        function H(t) {
            return t.length > 0 ? r.fn.concat.apply([], t) : t
        }

        function I(t) {
            return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
        }

        function V(t) {
            return t in l ? l[t] : l[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
        }

        function _(t, e) {
            return "number" != typeof e || h[I(t)] ? e : e + "px"
        }

        function B(t) {
            var e, n;
            return c[t] || (e = f.createElement(t), f.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), c[t] = n), c[t]
        }

        function U(t) {
            return "children" in t ? u.call(t.children) : r.map(t.childNodes, function (t) {
                return 1 == t.nodeType ? t : void 0
            })
        }

        function X(t, e) {
            var n, r = t ? t.length : 0;
            for (n = 0; r > n; n++) this[n] = t[n];
            this.length = r, this.selector = e || ""
        }

        function J(t, r, i) {
            for (n in r) i && (Z(r[n]) || L(r[n])) ? (Z(r[n]) && !Z(t[n]) && (t[n] = {}), L(r[n]) && !L(t[n]) && (t[n] = []), J(t[n], r[n], i)) : r[n] !== e && (t[n] = r[n])
        }

        function W(t, e) {
            return null == e ? r(t) : r(t).filter(e)
        }

        function Y(t, e, n, r) {
            return F(e) ? e.call(t, n, r) : e
        }

        function G(t, e, n) {
            null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
        }

        function K(t, n) {
            var r = t.className || "",
                i = r && r.baseVal !== e;
            return n === e ? i ? r.baseVal : r : void(i ? r.baseVal = n : t.className = n)
        }

        function Q(t) {
            try {
                return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : +t + "" == t ? +t : /^[\[\{]/.test(t) ? r.parseJSON(t) : t) : t
            } catch (e) {
                return t
            }
        }

        function tt(t, e) {
            e(t);
            for (var n = 0, r = t.childNodes.length; r > n; n++) tt(t.childNodes[n], e)
        }
        var e, n, r, i, O, P, o = [],
            s = o.concat,
            a = o.filter,
            u = o.slice,
            f = t.document,
            c = {},
            l = {},
            h = {
                "column-count": 1,
                columns: 1,
                "font-weight": 1,
                "line-height": 1,
                opacity: 1,
                "z-index": 1,
                zoom: 1
            },
            p = /^\s*<(\w+|!)[^>]*>/,
            d = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            m = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            g = /^(?:body|html)$/i,
            v = /([A-Z])/g,
            y = ["val", "css", "html", "text", "data", "width", "height", "offset"],
            x = ["after", "prepend", "before", "append"],
            b = f.createElement("table"),
            E = f.createElement("tr"),
            j = {
                tr: f.createElement("tbody"),
                tbody: b,
                thead: b,
                tfoot: b,
                td: E,
                th: E,
                "*": f.createElement("div")
            },
            w = /complete|loaded|interactive/,
            T = /^[\w-]*$/,
            S = {},
            C = S.toString,
            N = {},
            A = f.createElement("div"),
            D = {
                tabindex: "tabIndex",
                readonly: "readOnly",
                "for": "htmlFor",
                "class": "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable"
            },
            L = Array.isArray || function (t) {
                return t instanceof Array
            };
        return N.matches = function (t, e) {
            if (!e || !t || 1 !== t.nodeType) return !1;
            var n = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
            if (n) return n.call(t, e);
            var r, i = t.parentNode,
                o = !i;
            return o && (i = A).appendChild(t), r = ~N.qsa(i, e).indexOf(t), o && A.removeChild(t), r
        }, O = function (t) {
            return t.replace(/-+(.)?/g, function (t, e) {
                return e ? e.toUpperCase() : ""
            })
        }, P = function (t) {
            return a.call(t, function (e, n) {
                return t.indexOf(e) == n
            })
        }, N.fragment = function (t, n, i) {
            var o, s, a;
            return d.test(t) && (o = r(f.createElement(RegExp.$1))), o || (t.replace && (t = t.replace(m, "<$1></$2>")), n === e && (n = p.test(t) && RegExp.$1), n in j || (n = "*"), a = j[n], a.innerHTML = "" + t, o = r.each(u.call(a.childNodes), function () {
                a.removeChild(this)
            })), Z(i) && (s = r(o), r.each(i, function (t, e) {
                y.indexOf(t) > -1 ? s[t](e) : s.attr(t, e)
            })), o
        }, N.Z = function (t, e) {
            return new X(t, e)
        }, N.isZ = function (t) {
            return t instanceof N.Z
        }, N.init = function (t, n) {
            var i;
            if (!t) return N.Z();
            if ("string" == typeof t)
                if (t = t.trim(), "<" == t[0] && p.test(t)) i = N.fragment(t, RegExp.$1, n), t = null;
                else {
                    if (n !== e) return r(n).find(t);
                    i = N.qsa(f, t)
                }
            else {
                if (F(t)) return r(f).ready(t);
                if (N.isZ(t)) return t;
                if (L(t)) i = q(t);
                else if (R(t)) i = [t], t = null;
                else if (p.test(t)) i = N.fragment(t.trim(), RegExp.$1, n), t = null;
                else {
                    if (n !== e) return r(n).find(t);
                    i = N.qsa(f, t)
                }
            }
            return N.Z(i, t)
        }, r = function (t, e) {
            return N.init(t, e)
        }, r.extend = function (t) {
            var e, n = u.call(arguments, 1);
            return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function (n) {
                J(t, n, e)
            }), t
        }, N.qsa = function (t, e) {
            var n, r = "#" == e[0],
                i = !r && "." == e[0],
                o = r || i ? e.slice(1) : e,
                s = T.test(o);
            return t.getElementById && s && r ? (n = t.getElementById(o)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType ? [] : u.call(s && !r && t.getElementsByClassName ? i ? t.getElementsByClassName(o) : t.getElementsByTagName(e) : t.querySelectorAll(e))
        }, r.contains = f.documentElement.contains ? function (t, e) {
            return t !== e && t.contains(e)
        } : function (t, e) {
            for (; e && (e = e.parentNode);)
                if (e === t) return !0;
            return !1
        }, r.type = $, r.isFunction = F, r.isWindow = k, r.isArray = L, r.isPlainObject = Z, r.isEmptyObject = function (t) {
            var e;
            for (e in t) return !1;
            return !0
        }, r.isNumeric = function (t) {
            var e = Number(t),
                n = typeof t;
            return null != t && "boolean" != n && ("string" != n || t.length) && !isNaN(e) && isFinite(e) || !1
        }, r.inArray = function (t, e, n) {
            return o.indexOf.call(e, t, n)
        }, r.camelCase = O, r.trim = function (t) {
            return null == t ? "" : String.prototype.trim.call(t)
        }, r.uuid = 0, r.support = {}, r.expr = {}, r.noop = function () {}, r.map = function (t, e) {
            var n, i, o, r = [];
            if (z(t))
                for (i = 0; i < t.length; i++) n = e(t[i], i), null != n && r.push(n);
            else
                for (o in t) n = e(t[o], o), null != n && r.push(n);
            return H(r)
        }, r.each = function (t, e) {
            var n, r;
            if (z(t)) {
                for (n = 0; n < t.length; n++)
                    if (e.call(t[n], n, t[n]) === !1) return t
            } else
                for (r in t)
                    if (e.call(t[r], r, t[r]) === !1) return t;
            return t
        }, r.grep = function (t, e) {
            return a.call(t, e)
        }, t.JSON && (r.parseJSON = JSON.parse), r.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (t, e) {
            S["[object " + e + "]"] = e.toLowerCase()
        }), r.fn = {
            constructor: N.Z,
            length: 0,
            forEach: o.forEach,
            reduce: o.reduce,
            push: o.push,
            sort: o.sort,
            splice: o.splice,
            indexOf: o.indexOf,
            concat: function () {
                var t, e, n = [];
                for (t = 0; t < arguments.length; t++) e = arguments[t], n[t] = N.isZ(e) ? e.toArray() : e;
                return s.apply(N.isZ(this) ? this.toArray() : this, n)
            },
            map: function (t) {
                return r(r.map(this, function (e, n) {
                    return t.call(e, n, e)
                }))
            },
            slice: function () {
                return r(u.apply(this, arguments))
            },
            ready: function (t) {
                return w.test(f.readyState) && f.body ? t(r) : f.addEventListener("DOMContentLoaded", function () {
                    t(r)
                }, !1), this
            },
            get: function (t) {
                return t === e ? u.call(this) : this[t >= 0 ? t : t + this.length]
            },
            toArray: function () {
                return this.get()
            },
            size: function () {
                return this.length
            },
            remove: function () {
                return this.each(function () {
                    null != this.parentNode && this.parentNode.removeChild(this)
                })
            },
            each: function (t) {
                return o.every.call(this, function (e, n) {
                    return t.call(e, n, e) !== !1
                }), this
            },
            filter: function (t) {
                return F(t) ? this.not(this.not(t)) : r(a.call(this, function (e) {
                    return N.matches(e, t)
                }))
            },
            add: function (t, e) {
                return r(P(this.concat(r(t, e))))
            },
            is: function (t) {
                return this.length > 0 && N.matches(this[0], t)
            },
            not: function (t) {
                var n = [];
                if (F(t) && t.call !== e) this.each(function (e) {
                    t.call(this, e) || n.push(this)
                });
                else {
                    var i = "string" == typeof t ? this.filter(t) : z(t) && F(t.item) ? u.call(t) : r(t);
                    this.forEach(function (t) {
                        i.indexOf(t) < 0 && n.push(t)
                    })
                }
                return r(n)
            },
            has: function (t) {
                return this.filter(function () {
                    return R(t) ? r.contains(this, t) : r(this).find(t).size()
                })
            },
            eq: function (t) {
                return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
            },
            first: function () {
                var t = this[0];
                return t && !R(t) ? t : r(t)
            },
            last: function () {
                var t = this[this.length - 1];
                return t && !R(t) ? t : r(t)
            },
            find: function (t) {
                var e, n = this;
                return e = t ? "object" == typeof t ? r(t).filter(function () {
                    var t = this;
                    return o.some.call(n, function (e) {
                        return r.contains(e, t)
                    })
                }) : 1 == this.length ? r(N.qsa(this[0], t)) : this.map(function () {
                    return N.qsa(this, t)
                }) : r()
            },
            closest: function (t, e) {
                var n = [],
                    i = "object" == typeof t && r(t);
                return this.each(function (r, o) {
                    for (; o && !(i ? i.indexOf(o) >= 0 : N.matches(o, t));) o = o !== e && !M(o) && o.parentNode;
                    o && n.indexOf(o) < 0 && n.push(o)
                }), r(n)
            },
            parents: function (t) {
                for (var e = [], n = this; n.length > 0;) n = r.map(n, function (t) {
                    return (t = t.parentNode) && !M(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
                });
                return W(e, t)
            },
            parent: function (t) {
                return W(P(this.pluck("parentNode")), t)
            },
            children: function (t) {
                return W(this.map(function () {
                    return U(this)
                }), t)
            },
            contents: function () {
                return this.map(function () {
                    return this.contentDocument || u.call(this.childNodes)
                })
            },
            siblings: function (t) {
                return W(this.map(function (t, e) {
                    return a.call(U(e.parentNode), function (t) {
                        return t !== e
                    })
                }), t)
            },
            empty: function () {
                return this.each(function () {
                    this.innerHTML = ""
                })
            },
            pluck: function (t) {
                return r.map(this, function (e) {
                    return e[t]
                })
            },
            show: function () {
                return this.each(function () {
                    "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = B(this.nodeName))
                })
            },
            replaceWith: function (t) {
                return this.before(t).remove()
            },
            wrap: function (t) {
                var e = F(t);
                if (this[0] && !e) var n = r(t).get(0),
                    i = n.parentNode || this.length > 1;
                return this.each(function (o) {
                    r(this).wrapAll(e ? t.call(this, o) : i ? n.cloneNode(!0) : n)
                })
            },
            wrapAll: function (t) {
                if (this[0]) {
                    r(this[0]).before(t = r(t));
                    for (var e;
                        (e = t.children()).length;) t = e.first();
                    r(t).append(this)
                }
                return this
            },
            wrapInner: function (t) {
                var e = F(t);
                return this.each(function (n) {
                    var i = r(this),
                        o = i.contents(),
                        s = e ? t.call(this, n) : t;
                    o.length ? o.wrapAll(s) : i.append(s)
                })
            },
            unwrap: function () {
                return this.parent().each(function () {
                    r(this).replaceWith(r(this).children())
                }), this
            },
            clone: function () {
                return this.map(function () {
                    return this.cloneNode(!0)
                })
            },
            hide: function () {
                return this.css("display", "none")
            },
            toggle: function (t) {
                return this.each(function () {
                    var n = r(this);
                    (t === e ? "none" == n.css("display") : t) ? n.show(): n.hide()
                })
            },
            prev: function (t) {
                return r(this.pluck("previousElementSibling")).filter(t || "*")
            },
            next: function (t) {
                return r(this.pluck("nextElementSibling")).filter(t || "*")
            },
            html: function (t) {
                return 0 in arguments ? this.each(function (e) {
                    var n = this.innerHTML;
                    r(this).empty().append(Y(this, t, e, n))
                }) : 0 in this ? this[0].innerHTML : null
            },
            text: function (t) {
                return 0 in arguments ? this.each(function (e) {
                    var n = Y(this, t, e, this.textContent);
                    this.textContent = null == n ? "" : "" + n
                }) : 0 in this ? this.pluck("textContent").join("") : null
            },
            attr: function (t, r) {
                var i;
                return "string" != typeof t || 1 in arguments ? this.each(function (e) {
                    if (1 === this.nodeType)
                        if (R(t))
                            for (n in t) G(this, n, t[n]);
                        else G(this, t, Y(this, r, e, this.getAttribute(t)))
                }) : 0 in this && 1 == this[0].nodeType && null != (i = this[0].getAttribute(t)) ? i : e
            },
            removeAttr: function (t) {
                return this.each(function () {
                    1 === this.nodeType && t.split(" ").forEach(function (t) {
                        G(this, t)
                    }, this)
                })
            },
            prop: function (t, e) {
                return t = D[t] || t, 1 in arguments ? this.each(function (n) {
                    this[t] = Y(this, e, n, this[t])
                }) : this[0] && this[0][t]
            },
            removeProp: function (t) {
                return t = D[t] || t, this.each(function () {
                    delete this[t]
                })
            },
            data: function (t, n) {
                var r = "data-" + t.replace(v, "-$1").toLowerCase(),
                    i = 1 in arguments ? this.attr(r, n) : this.attr(r);
                return null !== i ? Q(i) : e
            },
            val: function (t) {
                return 0 in arguments ? (null == t && (t = ""), this.each(function (e) {
                    this.value = Y(this, t, e, this.value)
                })) : this[0] && (this[0].multiple ? r(this[0]).find("option").filter(function () {
                    return this.selected
                }).pluck("value") : this[0].value)
            },
            offset: function (e) {
                if (e) return this.each(function (t) {
                    var n = r(this),
                        i = Y(this, e, t, n.offset()),
                        o = n.offsetParent().offset(),
                        s = {
                            top: i.top - o.top,
                            left: i.left - o.left
                        };
                    "static" == n.css("position") && (s.position = "relative"), n.css(s)
                });
                if (!this.length) return null;
                if (f.documentElement !== this[0] && !r.contains(f.documentElement, this[0])) return {
                    top: 0,
                    left: 0
                };
                var n = this[0].getBoundingClientRect();
                return {
                    left: n.left + t.pageXOffset,
                    top: n.top + t.pageYOffset,
                    width: Math.round(n.width),
                    height: Math.round(n.height)
                }
            },
            css: function (t, e) {
                if (arguments.length < 2) {
                    var i = this[0];
                    if ("string" == typeof t) {
                        if (!i) return;
                        return i.style[O(t)] || getComputedStyle(i, "").getPropertyValue(t)
                    }
                    if (L(t)) {
                        if (!i) return;
                        var o = {},
                            s = getComputedStyle(i, "");
                        return r.each(t, function (t, e) {
                            o[e] = i.style[O(e)] || s.getPropertyValue(e)
                        }), o
                    }
                }
                var a = "";
                if ("string" == $(t)) e || 0 === e ? a = I(t) + ":" + _(t, e) : this.each(function () {
                    this.style.removeProperty(I(t))
                });
                else
                    for (n in t) t[n] || 0 === t[n] ? a += I(n) + ":" + _(n, t[n]) + ";" : this.each(function () {
                        this.style.removeProperty(I(n))
                    });
                return this.each(function () {
                    this.style.cssText += ";" + a
                })
            },
            index: function (t) {
                return t ? this.indexOf(r(t)[0]) : this.parent().children().indexOf(this[0])
            },
            hasClass: function (t) {
                return t ? o.some.call(this, function (t) {
                    return this.test(K(t))
                }, V(t)) : !1
            },
            addClass: function (t) {
                return t ? this.each(function (e) {
                    if ("className" in this) {
                        i = [];
                        var n = K(this),
                            o = Y(this, t, e, n);
                        o.split(/\s+/g).forEach(function (t) {
                            r(this).hasClass(t) || i.push(t)
                        }, this), i.length && K(this, n + (n ? " " : "") + i.join(" "))
                    }
                }) : this
            },
            removeClass: function (t) {
                return this.each(function (n) {
                    if ("className" in this) {
                        if (t === e) return K(this, "");
                        i = K(this), Y(this, t, n, i).split(/\s+/g).forEach(function (t) {
                            i = i.replace(V(t), " ")
                        }), K(this, i.trim())
                    }
                })
            },
            toggleClass: function (t, n) {
                return t ? this.each(function (i) {
                    var o = r(this),
                        s = Y(this, t, i, K(this));
                    s.split(/\s+/g).forEach(function (t) {
                        (n === e ? !o.hasClass(t) : n) ? o.addClass(t): o.removeClass(t)
                    })
                }) : this
            },
            scrollTop: function (t) {
                if (this.length) {
                    var n = "scrollTop" in this[0];
                    return t === e ? n ? this[0].scrollTop : this[0].pageYOffset : this.each(n ? function () {
                        this.scrollTop = t
                    } : function () {
                        this.scrollTo(this.scrollX, t)
                    })
                }
            },
            scrollLeft: function (t) {
                if (this.length) {
                    var n = "scrollLeft" in this[0];
                    return t === e ? n ? this[0].scrollLeft : this[0].pageXOffset : this.each(n ? function () {
                        this.scrollLeft = t
                    } : function () {
                        this.scrollTo(t, this.scrollY)
                    })
                }
            },
            position: function () {
                if (this.length) {
                    var t = this[0],
                        e = this.offsetParent(),
                        n = this.offset(),
                        i = g.test(e[0].nodeName) ? {
                            top: 0,
                            left: 0
                        } : e.offset();
                    return n.top -= parseFloat(r(t).css("margin-top")) || 0, n.left -= parseFloat(r(t).css("margin-left")) || 0, i.top += parseFloat(r(e[0]).css("border-top-width")) || 0, i.left += parseFloat(r(e[0]).css("border-left-width")) || 0, {
                        top: n.top - i.top,
                        left: n.left - i.left
                    }
                }
            },
            offsetParent: function () {
                return this.map(function () {
                    for (var t = this.offsetParent || f.body; t && !g.test(t.nodeName) && "static" == r(t).css("position");) t = t.offsetParent;
                    return t
                })
            }
        }, r.fn.detach = r.fn.remove, ["width", "height"].forEach(function (t) {
            var n = t.replace(/./, function (t) {
                return t[0].toUpperCase()
            });
            r.fn[t] = function (i) {
                var o, s = this[0];
                return i === e ? k(s) ? s["inner" + n] : M(s) ? s.documentElement["scroll" + n] : (o = this.offset()) && o[t] : this.each(function (e) {
                    s = r(this), s.css(t, Y(this, i, e, s[t]()))
                })
            }
        }), x.forEach(function (n, i) {
            var o = i % 2;
            r.fn[n] = function () {
                var n, a, s = r.map(arguments, function (t) {
                        var i = [];
                        return n = $(t), "array" == n ? (t.forEach(function (t) {
                            return t.nodeType !== e ? i.push(t) : r.zepto.isZ(t) ? i = i.concat(t.get()) : void(i = i.concat(N.fragment(t)))
                        }), i) : "object" == n || null == t ? t : N.fragment(t)
                    }),
                    u = this.length > 1;
                return s.length < 1 ? this : this.each(function (e, n) {
                    a = o ? n : n.parentNode, n = 0 == i ? n.nextSibling : 1 == i ? n.firstChild : 2 == i ? n : null;
                    var c = r.contains(f.documentElement, a);
                    s.forEach(function (e) {
                        if (u) e = e.cloneNode(!0);
                        else if (!a) return r(e).remove();
                        a.insertBefore(e, n), c && tt(e, function (e) {
                            if (!(null == e.nodeName || "SCRIPT" !== e.nodeName.toUpperCase() || e.type && "text/javascript" !== e.type || e.src)) {
                                var n = e.ownerDocument ? e.ownerDocument.defaultView : t;
                                n.eval.call(n, e.innerHTML)
                            }
                        })
                    })
                })
            }, r.fn[o ? n + "To" : "insert" + (i ? "Before" : "After")] = function (t) {
                return r(t)[n](this), this
            }
        }), N.Z.prototype = X.prototype = r.fn, N.uniq = P, N.deserializeValue = Q, r.zepto = N, r
    }();
    return t.Zepto = e, void 0 === t.$ && (t.$ = e),
        function (e) {
            function h(t) {
                return t._zid || (t._zid = n++)
            }

            function p(t, e, n, r) {
                if (e = d(e), e.ns) var i = m(e.ns);
                return (a[h(t)] || []).filter(function (t) {
                    return t && (!e.e || t.e == e.e) && (!e.ns || i.test(t.ns)) && (!n || h(t.fn) === h(n)) && (!r || t.sel == r)
                })
            }

            function d(t) {
                var e = ("" + t).split(".");
                return {
                    e: e[0],
                    ns: e.slice(1).sort().join(" ")
                }
            }

            function m(t) {
                return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
            }

            function g(t, e) {
                return t.del && !f && t.e in c || !!e
            }

            function v(t) {
                return l[t] || f && c[t] || t
            }

            function y(t, n, i, o, s, u, f) {
                var c = h(t),
                    p = a[c] || (a[c] = []);
                n.split(/\s/).forEach(function (n) {
                    if ("ready" == n) return e(document).ready(i);
                    var a = d(n);
                    a.fn = i, a.sel = s, a.e in l && (i = function (t) {
                        var n = t.relatedTarget;
                        return !n || n !== this && !e.contains(this, n) ? a.fn.apply(this, arguments) : void 0
                    }), a.del = u;
                    var c = u || i;
                    a.proxy = function (e) {
                        if (e = T(e), !e.isImmediatePropagationStopped()) {
                            e.data = o;
                            var n = c.apply(t, e._args == r ? [e] : [e].concat(e._args));
                            return n === !1 && (e.preventDefault(), e.stopPropagation()), n
                        }
                    }, a.i = p.length, p.push(a), "addEventListener" in t && t.addEventListener(v(a.e), a.proxy, g(a, f))
                })
            }

            function x(t, e, n, r, i) {
                var o = h(t);
                (e || "").split(/\s/).forEach(function (e) {
                    p(t, e, n, r).forEach(function (e) {
                        delete a[o][e.i], "removeEventListener" in t && t.removeEventListener(v(e.e), e.proxy, g(e, i))
                    })
                })
            }

            function T(t, n) {
                return (n || !t.isDefaultPrevented) && (n || (n = t), e.each(w, function (e, r) {
                    var i = n[e];
                    t[e] = function () {
                        return this[r] = b, i && i.apply(n, arguments)
                    }, t[r] = E
                }), t.timeStamp || (t.timeStamp = Date.now()), (n.defaultPrevented !== r ? n.defaultPrevented : "returnValue" in n ? n.returnValue === !1 : n.getPreventDefault && n.getPreventDefault()) && (t.isDefaultPrevented = b)), t
            }

            function S(t) {
                var e, n = {
                    originalEvent: t
                };
                for (e in t) j.test(e) || t[e] === r || (n[e] = t[e]);
                return T(n, t)
            }
            var r, n = 1,
                i = Array.prototype.slice,
                o = e.isFunction,
                s = function (t) {
                    return "string" == typeof t
                },
                a = {},
                u = {},
                f = "onfocusin" in t,
                c = {
                    focus: "focusin",
                    blur: "focusout"
                },
                l = {
                    mouseenter: "mouseover",
                    mouseleave: "mouseout"
                };
            u.click = u.mousedown = u.mouseup = u.mousemove = "MouseEvents", e.event = {
                add: y,
                remove: x
            }, e.proxy = function (t, n) {
                var r = 2 in arguments && i.call(arguments, 2);
                if (o(t)) {
                    var a = function () {
                        return t.apply(n, r ? r.concat(i.call(arguments)) : arguments)
                    };
                    return a._zid = h(t), a
                }
                if (s(n)) return r ? (r.unshift(t[n], t), e.proxy.apply(null, r)) : e.proxy(t[n], t);
                throw new TypeError("expected function")
            }, e.fn.bind = function (t, e, n) {
                return this.on(t, e, n)
            }, e.fn.unbind = function (t, e) {
                return this.off(t, e)
            }, e.fn.one = function (t, e, n, r) {
                return this.on(t, e, n, r, 1)
            };
            var b = function () {
                    return !0
                },
                E = function () {
                    return !1
                },
                j = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
                w = {
                    preventDefault: "isDefaultPrevented",
                    stopImmediatePropagation: "isImmediatePropagationStopped",
                    stopPropagation: "isPropagationStopped"
                };
            e.fn.delegate = function (t, e, n) {
                return this.on(e, t, n)
            }, e.fn.undelegate = function (t, e, n) {
                return this.off(e, t, n)
            }, e.fn.live = function (t, n) {
                return e(document.body).delegate(this.selector, t, n), this
            }, e.fn.die = function (t, n) {
                return e(document.body).undelegate(this.selector, t, n), this
            }, e.fn.on = function (t, n, a, u, f) {
                var c, l, h = this;
                return t && !s(t) ? (e.each(t, function (t, e) {
                    h.on(t, n, a, e, f)
                }), h) : (s(n) || o(u) || u === !1 || (u = a, a = n, n = r), (u === r || a === !1) && (u = a, a = r), u === !1 && (u = E), h.each(function (r, o) {
                    f && (c = function (t) {
                        return x(o, t.type, u), u.apply(this, arguments)
                    }), n && (l = function (t) {
                        var r, s = e(t.target).closest(n, o).get(0);
                        return s && s !== o ? (r = e.extend(S(t), {
                            currentTarget: s,
                            liveFired: o
                        }), (c || u).apply(s, [r].concat(i.call(arguments, 1)))) : void 0
                    }), y(o, t, u, a, n, l || c)
                }))
            }, e.fn.off = function (t, n, i) {
                var a = this;
                return t && !s(t) ? (e.each(t, function (t, e) {
                    a.off(t, n, e)
                }), a) : (s(n) || o(i) || i === !1 || (i = n, n = r), i === !1 && (i = E), a.each(function () {
                    x(this, t, i, n)
                }))
            }, e.fn.trigger = function (t, n) {
                return t = s(t) || e.isPlainObject(t) ? e.Event(t) : T(t), t._args = n, this.each(function () {
                    t.type in c && "function" == typeof this[t.type] ? this[t.type]() : "dispatchEvent" in this ? this.dispatchEvent(t) : e(this).triggerHandler(t, n)
                })
            }, e.fn.triggerHandler = function (t, n) {
                var r, i;
                return this.each(function (o, a) {
                    r = S(s(t) ? e.Event(t) : t), r._args = n, r.target = a, e.each(p(a, t.type || t), function (t, e) {
                        return i = e.proxy(r), r.isImmediatePropagationStopped() ? !1 : void 0
                    })
                }), i
            }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function (t) {
                e.fn[t] = function (e) {
                    return 0 in arguments ? this.bind(t, e) : this.trigger(t)
                }
            }), e.Event = function (t, e) {
                s(t) || (e = t, t = e.type);
                var n = document.createEvent(u[t] || "Events"),
                    r = !0;
                if (e)
                    for (var i in e) "bubbles" == i ? r = !!e[i] : n[i] = e[i];
                return n.initEvent(t, r, !0), T(n)
            }
        }(e),
        function (e) {
            function p(t, n, r) {
                var i = e.Event(n);
                return e(t).trigger(i, r), !i.isDefaultPrevented()
            }

            function d(t, e, n, i) {
                return t.global ? p(e || r, n, i) : void 0
            }

            function m(t) {
                t.global && 0 === e.active++ && d(t, null, "ajaxStart")
            }

            function g(t) {
                t.global && !--e.active && d(t, null, "ajaxStop")
            }

            function v(t, e) {
                var n = e.context;
                return e.beforeSend.call(n, t, e) === !1 || d(e, n, "ajaxBeforeSend", [t, e]) === !1 ? !1 : void d(e, n, "ajaxSend", [t, e])
            }

            function y(t, e, n, r) {
                var i = n.context,
                    o = "success";
                n.success.call(i, t, o, e), r && r.resolveWith(i, [t, o, e]), d(n, i, "ajaxSuccess", [e, n, t]), b(o, e, n)
            }

            function x(t, e, n, r, i) {
                var o = r.context;
                r.error.call(o, n, e, t), i && i.rejectWith(o, [n, e, t]), d(r, o, "ajaxError", [n, r, t || e]), b(e, n, r)
            }

            function b(t, e, n) {
                var r = n.context;
                n.complete.call(r, e, t), d(n, r, "ajaxComplete", [e, n]), g(n)
            }

            function E(t, e, n) {
                if (n.dataFilter == j) return t;
                var r = n.context;
                return n.dataFilter.call(r, t, e)
            }

            function j() {}

            function w(t) {
                return t && (t = t.split(";", 2)[0]), t && (t == c ? "html" : t == f ? "json" : a.test(t) ? "script" : u.test(t) && "xml") || "text"
            }

            function T(t, e) {
                return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
            }

            function S(t) {
                t.processData && t.data && "string" != e.type(t.data) && (t.data = e.param(t.data, t.traditional)), !t.data || t.type && "GET" != t.type.toUpperCase() && "jsonp" != t.dataType || (t.url = T(t.url, t.data), t.data = void 0)
            }

            function C(t, n, r, i) {
                return e.isFunction(n) && (i = r, r = n, n = void 0), e.isFunction(r) || (i = r, r = void 0), {
                    url: t,
                    data: n,
                    success: r,
                    dataType: i
                }
            }

            function O(t, n, r, i) {
                var o, s = e.isArray(n),
                    a = e.isPlainObject(n);
                e.each(n, function (n, u) {
                    o = e.type(u), i && (n = r ? i : i + "[" + (a || "object" == o || "array" == o ? n : "") + "]"), !i && s ? t.add(u.name, u.value) : "array" == o || !r && "object" == o ? O(t, u, r, n) : t.add(n, u)
                })
            }
            var i, o, n = +new Date,
                r = t.document,
                s = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                a = /^(?:text|application)\/javascript/i,
                u = /^(?:text|application)\/xml/i,
                f = "application/json",
                c = "text/html",
                l = /^\s*$/,
                h = r.createElement("a");
            h.href = t.location.href, e.active = 0, e.ajaxJSONP = function (i, o) {
                if (!("type" in i)) return e.ajax(i);
                var c, p, s = i.jsonpCallback,
                    a = (e.isFunction(s) ? s() : s) || "Zepto" + n++,
                    u = r.createElement("script"),
                    f = t[a],
                    l = function (t) {
                        e(u).triggerHandler("error", t || "abort")
                    },
                    h = {
                        abort: l
                    };
                return o && o.promise(h), e(u).on("load error", function (n, r) {
                    clearTimeout(p), e(u).off().remove(), "error" != n.type && c ? y(c[0], h, i, o) : x(null, r || "error", h, i, o), t[a] = f, c && e.isFunction(f) && f(c[0]), f = c = void 0
                }), v(h, i) === !1 ? (l("abort"), h) : (t[a] = function () {
                    c = arguments
                }, u.src = i.url.replace(/\?(.+)=\?/, "?$1=" + a), r.head.appendChild(u), i.timeout > 0 && (p = setTimeout(function () {
                    l("timeout")
                }, i.timeout)), h)
            }, e.ajaxSettings = {
                type: "GET",
                beforeSend: j,
                success: j,
                error: j,
                complete: j,
                context: null,
                global: !0,
                xhr: function () {
                    return new t.XMLHttpRequest
                },
                accepts: {
                    script: "text/javascript, application/javascript, application/x-javascript",
                    json: f,
                    xml: "application/xml, text/xml",
                    html: c,
                    text: "text/plain"
                },
                crossDomain: !1,
                timeout: 0,
                processData: !0,
                cache: !0,
                dataFilter: j
            }, e.ajax = function (n) {
                var u, f, s = e.extend({}, n || {}),
                    a = e.Deferred && e.Deferred();
                for (i in e.ajaxSettings) void 0 === s[i] && (s[i] = e.ajaxSettings[i]);
                m(s), s.crossDomain || (u = r.createElement("a"), u.href = s.url, u.href = u.href, s.crossDomain = h.protocol + "//" + h.host != u.protocol + "//" + u.host), s.url || (s.url = t.location.toString()), (f = s.url.indexOf("#")) > -1 && (s.url = s.url.slice(0, f)), S(s);
                var c = s.dataType,
                    p = /\?.+=\?/.test(s.url);
                if (p && (c = "jsonp"), s.cache !== !1 && (n && n.cache === !0 || "script" != c && "jsonp" != c) || (s.url = T(s.url, "_=" + Date.now())), "jsonp" == c) return p || (s.url = T(s.url, s.jsonp ? s.jsonp + "=?" : s.jsonp === !1 ? "" : "callback=?")), e.ajaxJSONP(s, a);
                var P, d = s.accepts[c],
                    g = {},
                    b = function (t, e) {
                        g[t.toLowerCase()] = [t, e]
                    },
                    C = /^([\w-]+:)\/\//.test(s.url) ? RegExp.$1 : t.location.protocol,
                    N = s.xhr(),
                    O = N.setRequestHeader;
                if (a && a.promise(N), s.crossDomain || b("X-Requested-With", "XMLHttpRequest"), b("Accept", d || "*/*"), (d = s.mimeType || d) && (d.indexOf(",") > -1 && (d = d.split(",", 2)[0]), N.overrideMimeType && N.overrideMimeType(d)), (s.contentType || s.contentType !== !1 && s.data && "GET" != s.type.toUpperCase()) && b("Content-Type", s.contentType || "application/x-www-form-urlencoded"), s.headers)
                    for (o in s.headers) b(o, s.headers[o]);
                if (N.setRequestHeader = b, N.onreadystatechange = function () {
                        if (4 == N.readyState) {
                            N.onreadystatechange = j, clearTimeout(P);
                            var t, n = !1;
                            if (N.status >= 200 && N.status < 300 || 304 == N.status || 0 == N.status && "file:" == C) {
                                if (c = c || w(s.mimeType || N.getResponseHeader("content-type")), "arraybuffer" == N.responseType || "blob" == N.responseType) t = N.response;
                                else {
                                    t = N.responseText;
                                    try {
                                        t = E(t, c, s), "script" == c ? (1, eval)(t) : "xml" == c ? t = N.responseXML : "json" == c && (t = l.test(t) ? null : e.parseJSON(t))
                                    } catch (r) {
                                        n = r
                                    }
                                    if (n) return x(n, "parsererror", N, s, a)
                                }
                                y(t, N, s, a)
                            } else x(N.statusText || null, N.status ? "error" : "abort", N, s, a)
                        }
                    }, v(N, s) === !1) return N.abort(), x(null, "abort", N, s, a), N;
                var A = "async" in s ? s.async : !0;
                if (N.open(s.type, s.url, A, s.username, s.password), s.xhrFields)
                    for (o in s.xhrFields) N[o] = s.xhrFields[o];
                for (o in g) O.apply(N, g[o]);
                return s.timeout > 0 && (P = setTimeout(function () {
                    N.onreadystatechange = j, N.abort(), x(null, "timeout", N, s, a)
                }, s.timeout)), N.send(s.data ? s.data : null), N
            }, e.get = function () {
                return e.ajax(C.apply(null, arguments))
            }, e.post = function () {
                var t = C.apply(null, arguments);
                return t.type = "POST", e.ajax(t)
            }, e.getJSON = function () {
                var t = C.apply(null, arguments);
                return t.dataType = "json", e.ajax(t)
            }, e.fn.load = function (t, n, r) {
                if (!this.length) return this;
                var a, i = this,
                    o = t.split(/\s/),
                    u = C(t, n, r),
                    f = u.success;
                return o.length > 1 && (u.url = o[0], a = o[1]), u.success = function (t) {
                    i.html(a ? e("<div>").html(t.replace(s, "")).find(a) : t), f && f.apply(i, arguments)
                }, e.ajax(u), this
            };
            var N = encodeURIComponent;
            e.param = function (t, n) {
                var r = [];
                return r.add = function (t, n) {
                    e.isFunction(n) && (n = n()), null == n && (n = ""), this.push(N(t) + "=" + N(n))
                }, O(r, t, n), r.join("&").replace(/%20/g, "+")
            }
        }(e),
        function (t) {
            t.fn.serializeArray = function () {
                var e, n, r = [],
                    i = function (t) {
                        return t.forEach ? t.forEach(i) : void r.push({
                            name: e,
                            value: t
                        })
                    };
                return this[0] && t.each(this[0].elements, function (r, o) {
                    n = o.type, e = o.name, e && "fieldset" != o.nodeName.toLowerCase() && !o.disabled && "submit" != n && "reset" != n && "button" != n && "file" != n && ("radio" != n && "checkbox" != n || o.checked) && i(t(o).val())
                }), r
            }, t.fn.serialize = function () {
                var t = [];
                return this.serializeArray().forEach(function (e) {
                    t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
                }), t.join("&")
            }, t.fn.submit = function (e) {
                if (0 in arguments) this.bind("submit", e);
                else if (this.length) {
                    var n = t.Event("submit");
                    this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit()
                }
                return this
            }
        }(e),
        function () {
            try {
                getComputedStyle(void 0)
            } catch (e) {
                var n = getComputedStyle;
                t.getComputedStyle = function (t, e) {
                    try {
                        return n(t, e)
                    } catch (r) {
                        return null
                    }
                }
            }
        }(), e
});
/*!
 * imagesLoaded PACKAGED v4.1.1
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
! function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var i = this._events = this._events || {},
                n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {},
                n = i[t] = i[t] || {};
            return n[e] = !0, this
        }
    }, e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = 0,
                o = i[n];
            e = e || [];
            for (var r = this._onceEvents && this._onceEvents[t]; o;) {
                var s = r && r[o];
                s && (this.off(t, o), delete r[o]), o.apply(this, e), n += s ? 0 : 1, o = i[n]
            }
            return this
        }
    }, t
}),
function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (i) {
        return e(t, i)
    }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter")) : t.imagesLoaded = e(t, t.EvEmitter)
}(window, function (t, e) {
    function i(t, e) {
        for (var i in e) t[i] = e[i];
        return t
    }

    function n(t) {
        var e = [];
        if (Array.isArray(t)) e = t;
        else if ("number" == typeof t.length)
            for (var i = 0; i < t.length; i++) e.push(t[i]);
        else e.push(t);
        return e
    }

    function o(t, e, r) {
        return this instanceof o ? ("string" == typeof t && (t = document.querySelectorAll(t)), this.elements = n(t), this.options = i({}, this.options), "function" == typeof e ? r = e : i(this.options, e), r && this.on("always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(function () {
            this.check()
        }.bind(this))) : new o(t, e, r)
    }

    function r(t) {
        this.img = t
    }

    function s(t, e) {
        this.url = t, this.element = e, this.img = new Image
    }
    var h = t.jQuery,
        a = t.console;
    o.prototype = Object.create(e.prototype), o.prototype.options = {}, o.prototype.getImages = function () {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, o.prototype.addElementImages = function (t) {
        "IMG" == t.nodeName && this.addImage(t), this.options.background === !0 && this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && d[e]) {
            for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var o = i[n];
                this.addImage(o)
            }
            if ("string" == typeof this.options.background) {
                var r = t.querySelectorAll(this.options.background);
                for (n = 0; n < r.length; n++) {
                    var s = r[n];
                    this.addElementBackgroundImages(s)
                }
            }
        }
    };
    var d = {
        1: !0,
        9: !0,
        11: !0
    };
    return o.prototype.addElementBackgroundImages = function (t) {
        var e = getComputedStyle(t);
        if (e)
            for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage); null !== n;) {
                var o = n && n[2];
                o && this.addBackground(o, t), n = i.exec(e.backgroundImage)
            }
    }, o.prototype.addImage = function (t) {
        var e = new r(t);
        this.images.push(e)
    }, o.prototype.addBackground = function (t, e) {
        var i = new s(t, e);
        this.images.push(i)
    }, o.prototype.check = function () {
        function t(t, i, n) {
            setTimeout(function () {
                e.progress(t, i, n)
            })
        }
        var e = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function (e) {
            e.once("progress", t), e.check()
        }) : void this.complete()
    }, o.prototype.progress = function (t, e, i) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded, this.emitEvent("progress", [this, t, e]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, t, e)
    }, o.prototype.complete = function () {
        var t = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(t, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var e = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[e](this)
        }
    }, r.prototype = Object.create(e.prototype), r.prototype.check = function () {
        var t = this.getIsImageComplete();
        return t ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, r.prototype.getIsImageComplete = function () {
        return this.img.complete && void 0 !== this.img.naturalWidth
    }, r.prototype.confirm = function (t, e) {
        this.isLoaded = t, this.emitEvent("progress", [this, this.img, e])
    }, r.prototype.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, r.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, r.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, r.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype = Object.create(r.prototype), s.prototype.check = function () {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var t = this.getIsImageComplete();
        t && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, s.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype.confirm = function (t, e) {
        this.isLoaded = t, this.emitEvent("progress", [this, this.element, e])
    }, o.makeJQueryPlugin = function (e) {
        e = e || t.jQuery, e && (h = e, h.fn.imagesLoaded = function (t, e) {
            var i = new o(this, t, e);
            return i.jqDeferred.promise(h(this))
        })
    }, o.makeJQueryPlugin(), o
});
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-cssmask-setclasses !*/
! function (e, n, t) {
    function r(e, n) {
        return typeof e === n
    }

    function s() {
        var e, n, t, s, o, i, a;
        for (var l in C)
            if (C.hasOwnProperty(l)) {
                if (e = [], n = C[l], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
                    for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
                for (s = r(n.fn, "function") ? n.fn() : n.fn, o = 0; o < e.length; o++) i = e[o], a = i.split("."), 1 === a.length ? Modernizr[a[0]] = s : (!Modernizr[a[0]] || Modernizr[a[0]] instanceof Boolean || (Modernizr[a[0]] = new Boolean(Modernizr[a[0]])), Modernizr[a[0]][a[1]] = s), g.push((s ? "" : "no-") + a.join("-"))
            }
    }

    function o(e) {
        var n = _.className,
            t = Modernizr._config.classPrefix || "";
        if (S && (n = n.baseVal), Modernizr._config.enableJSClass) {
            var r = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
            n = n.replace(r, "$1" + t + "js$2")
        }
        Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), S ? _.className.baseVal = n : _.className = n)
    }

    function i(e, n) {
        return !!~("" + e).indexOf(n)
    }

    function a() {
        return "function" != typeof n.createElement ? n.createElement(arguments[0]) : S ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments)
    }

    function l(e) {
        return e.replace(/([a-z])-([a-z])/g, function (e, n, t) {
            return n + t.toUpperCase()
        }).replace(/^-/, "")
    }

    function f(e, n) {
        return function () {
            return e.apply(n, arguments)
        }
    }

    function u(e, n, t) {
        var s;
        for (var o in e)
            if (e[o] in n) return t === !1 ? e[o] : (s = n[e[o]], r(s, "function") ? f(s, t || n) : s);
        return !1
    }

    function p(e) {
        return e.replace(/([A-Z])/g, function (e, n) {
            return "-" + n.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }

    function d() {
        var e = n.body;
        return e || (e = a(S ? "svg" : "body"), e.fake = !0), e
    }

    function c(e, t, r, s) {
        var o, i, l, f, u = "modernizr",
            p = a("div"),
            c = d();
        if (parseInt(r, 10))
            for (; r--;) l = a("div"), l.id = s ? s[r] : u + (r + 1), p.appendChild(l);
        return o = a("style"), o.type = "text/css", o.id = "s" + u, (c.fake ? c : p).appendChild(o), c.appendChild(p), o.styleSheet ? o.styleSheet.cssText = e : o.appendChild(n.createTextNode(e)), p.id = u, c.fake && (c.style.background = "", c.style.overflow = "hidden", f = _.style.overflow, _.style.overflow = "hidden", _.appendChild(c)), i = t(p, e), c.fake ? (c.parentNode.removeChild(c), _.style.overflow = f, _.offsetHeight) : p.parentNode.removeChild(p), !!i
    }

    function m(n, r) {
        var s = n.length;
        if ("CSS" in e && "supports" in e.CSS) {
            for (; s--;)
                if (e.CSS.supports(p(n[s]), r)) return !0;
            return !1
        }
        if ("CSSSupportsRule" in e) {
            for (var o = []; s--;) o.push("(" + p(n[s]) + ":" + r + ")");
            return o = o.join(" or "), c("@supports (" + o + ") { #modernizr { position: absolute; } }", function (e) {
                return "absolute" == getComputedStyle(e, null).position
            })
        }
        return t
    }

    function h(e, n, s, o) {
        function f() {
            p && (delete z.style, delete z.modElem)
        }
        if (o = r(o, "undefined") ? !1 : o, !r(s, "undefined")) {
            var u = m(e, s);
            if (!r(u, "undefined")) return u
        }
        for (var p, d, c, h, v, y = ["modernizr", "tspan", "samp"]; !z.style && y.length;) p = !0, z.modElem = a(y.shift()), z.style = z.modElem.style;
        for (c = e.length, d = 0; c > d; d++)
            if (h = e[d], v = z.style[h], i(h, "-") && (h = l(h)), z.style[h] !== t) {
                if (o || r(s, "undefined")) return f(), "pfx" == n ? h : !0;
                try {
                    z.style[h] = s
                } catch (g) {}
                if (z.style[h] != v) return f(), "pfx" == n ? h : !0
            } return f(), !1
    }

    function v(e, n, t, s, o) {
        var i = e.charAt(0).toUpperCase() + e.slice(1),
            a = (e + " " + b.join(i + " ") + i).split(" ");
        return r(n, "string") || r(n, "undefined") ? h(a, n, s, o) : (a = (e + " " + E.join(i + " ") + i).split(" "), u(a, n, t))
    }

    function y(e, n, r) {
        return v(e, t, t, n, r)
    }
    var g = [],
        C = [],
        w = {
            _version: "3.3.1",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function (e, n) {
                var t = this;
                setTimeout(function () {
                    n(t[e])
                }, 0)
            },
            addTest: function (e, n, t) {
                C.push({
                    name: e,
                    fn: n,
                    options: t
                })
            },
            addAsyncTest: function (e) {
                C.push({
                    name: null,
                    fn: e
                })
            }
        },
        Modernizr = function () {};
    Modernizr.prototype = w, Modernizr = new Modernizr;
    var _ = n.documentElement,
        S = "svg" === _.nodeName.toLowerCase(),
        x = "Moz O ms Webkit",
        b = w._config.usePrefixes ? x.split(" ") : [];
    w._cssomPrefixes = b;
    var E = w._config.usePrefixes ? x.toLowerCase().split(" ") : [];
    w._domPrefixes = E;
    var P = {
        elem: a("modernizr")
    };
    Modernizr._q.push(function () {
        delete P.elem
    });
    var z = {
        style: P.elem.style
    };
    Modernizr._q.unshift(function () {
        delete z.style
    }), w.testAllProps = v, w.testAllProps = y, Modernizr.addTest("cssmask", y("maskRepeat", "repeat-x", !0)), s(), o(g), delete w.addTest, delete w.addAsyncTest;
    for (var N = 0; N < Modernizr._q.length; N++) Modernizr._q[N]();
    e.Modernizr = Modernizr
}(window, document);
/*! modernizr 3.0.0-alpha.3 (Custom Build) | MIT *
 * https://v3.modernizr.com/download/#-videoautoplay !*/
! function (A, e) {
    function o(A, e) {
        return typeof A === e
    }

    function n() {
        var A, e, n, t, a, c, R;
        for (var E in i) {
            if (A = [], e = i[E], e.name && (A.push(e.name.toLowerCase()), e.options && e.options.aliases && e.options.aliases.length))
                for (n = 0; n < e.options.aliases.length; n++) A.push(e.options.aliases[n].toLowerCase());
            for (t = o(e.fn, "function") ? e.fn() : e.fn, a = 0; a < A.length; a++) c = A[a], R = c.split("."), 1 === R.length ? Modernizr[R[0]] = t : (!Modernizr[R[0]] || Modernizr[R[0]] instanceof Boolean || (Modernizr[R[0]] = new Boolean(Modernizr[R[0]])), Modernizr[R[0]][R[1]] = t), l.push((t ? "" : "no-") + R.join("-"))
        }
    }

    function t(A) {
        var e = R.className,
            o = Modernizr._config.classPrefix || "";
        if (Modernizr._config.enableJSClass) {
            var n = new RegExp("(^|\\s)" + o + "no-js(\\s|$)");
            e = e.replace(n, "$1" + o + "js$2")
        }
        Modernizr._config.enableClasses && (e += " " + o + A.join(" " + o), R.className = e)
    }

    function a(A, e) {
        if ("object" == typeof A)
            for (var o in A) s(A, o) && a(o, A[o]);
        else {
            A = A.toLowerCase();
            var n = A.split("."),
                i = Modernizr[n[0]];
            if (2 == n.length && (i = i[n[1]]), "undefined" != typeof i) return Modernizr;
            e = "function" == typeof e ? e() : e, 1 == n.length ? Modernizr[n[0]] = e : (!Modernizr[n[0]] || Modernizr[n[0]] instanceof Boolean || (Modernizr[n[0]] = new Boolean(Modernizr[n[0]])), Modernizr[n[0]][n[1]] = e), t([(e && 0 != e ? "" : "no-") + n.join("-")]), Modernizr._trigger(A, e)
        }
        return Modernizr
    }
    var i = [],
        c = {
            _version: "3.0.0-alpha.3",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function (A, e) {
                var o = this;
                setTimeout(function () {
                    e(o[A])
                }, 0)
            },
            addTest: function (A, e, o) {
                i.push({
                    name: A,
                    fn: e,
                    options: o
                })
            },
            addAsyncTest: function (A) {
                i.push({
                    name: null,
                    fn: A
                })
            }
        },
        Modernizr = function () {};
    Modernizr.prototype = c, Modernizr = new Modernizr;
    var l = [],
        R = e.documentElement,
        E = function () {
            return "function" != typeof e.createElement ? e.createElement(arguments[0]) : e.createElement.apply(e, arguments)
        };
    Modernizr.addTest("video", function () {
        var A = E("video"),
            e = !1;
        try {
            (e = !!A.canPlayType) && (e = new Boolean(e), e.ogg = A.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), e.h264 = A.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), e.webm = A.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ""), e.vp9 = A.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, ""), e.hls = A.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, ""))
        } catch (o) {}
        return e
    });
    var s;
    ! function () {
        var A = {}.hasOwnProperty;
        s = o(A, "undefined") || o(A.call, "undefined") ? function (A, e) {
            return e in A && o(A.constructor.prototype[e], "undefined")
        } : function (e, o) {
            return A.call(e, o)
        }
    }(), c._l = {}, c.on = function (A, e) {
        this._l[A] || (this._l[A] = []), this._l[A].push(e), Modernizr.hasOwnProperty(A) && setTimeout(function () {
            Modernizr._trigger(A, Modernizr[A])
        }, 0)
    }, c._trigger = function (A, e) {
        if (this._l[A]) {
            var o = this._l[A];
            setTimeout(function () {
                var A, n;
                for (A = 0; A < o.length; A++)(n = o[A])(e)
            }, 0), delete this._l[A]
        }
    }, Modernizr._q.push(function () {
        c.addTest = a
    }), Modernizr.addAsyncTest(function () {
        var A, e = 300,
            o = E("video"),
            n = o.style,
            t = function (e) {
                clearTimeout(A), o.removeEventListener("playing", t), a("videoautoplay", e && "playing" === e.type || 0 !== o.currentTime), o.parentNode.removeChild(o)
            };
        if (!(Modernizr.video && "autoplay" in o)) return void a("videoautoplay", !1);
        n.position = "absolute", n.height = 0, n.width = 0;
        try {
            if (Modernizr.video.ogg) o.src = "data:video/ogg;base64,T2dnUwACAAAAAAAAAABmnCATAAAAAHDEixYBKoB0aGVvcmEDAgEAAQABAAAQAAAQAAAAAAAFAAAAAQAAAAAAAAAAAGIAYE9nZ1MAAAAAAAAAAAAAZpwgEwEAAAACrA7TDlj///////////////+QgXRoZW9yYSsAAABYaXBoLk9yZyBsaWJ0aGVvcmEgMS4xIDIwMDkwODIyIChUaHVzbmVsZGEpAQAAABoAAABFTkNPREVSPWZmbXBlZzJ0aGVvcmEtMC4yOYJ0aGVvcmG+zSj3uc1rGLWpSUoQc5zmMYxSlKQhCDGMYhCEIQhAAAAAAAAAAAAAEW2uU2eSyPxWEvx4OVts5ir1aKtUKBMpJFoQ/nk5m41mUwl4slUpk4kkghkIfDwdjgajQYC8VioUCQRiIQh8PBwMhgLBQIg4FRba5TZ5LI/FYS/Hg5W2zmKvVoq1QoEykkWhD+eTmbjWZTCXiyVSmTiSSCGQh8PB2OBqNBgLxWKhQJBGIhCHw8HAyGAsFAiDgUCw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDAwPEhQUFQ0NDhESFRUUDg4PEhQVFRUOEBETFBUVFRARFBUVFRUVEhMUFRUVFRUUFRUVFRUVFRUVFRUVFRUVEAwLEBQZGxwNDQ4SFRwcGw4NEBQZHBwcDhATFhsdHRwRExkcHB4eHRQYGxwdHh4dGxwdHR4eHh4dHR0dHh4eHRALChAYKDM9DAwOExo6PDcODRAYKDlFOA4RFh0zV1A+EhYlOkRtZ00YIzdAUWhxXDFATldneXhlSFxfYnBkZ2MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEhIVGRoaGhoSFBYaGhoaGhUWGRoaGhoaGRoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhESFh8kJCQkEhQYIiQkJCQWGCEkJCQkJB8iJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQREhgvY2NjYxIVGkJjY2NjGBo4Y2NjY2MvQmNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRISEhUXGBkbEhIVFxgZGxwSFRcYGRscHRUXGBkbHB0dFxgZGxwdHR0YGRscHR0dHhkbHB0dHR4eGxwdHR0eHh4REREUFxocIBERFBcaHCAiERQXGhwgIiUUFxocICIlJRcaHCAiJSUlGhwgIiUlJSkcICIlJSUpKiAiJSUlKSoqEBAQFBgcICgQEBQYHCAoMBAUGBwgKDBAFBgcICgwQEAYHCAoMEBAQBwgKDBAQEBgICgwQEBAYIAoMEBAQGCAgAfF5cdH1e3Ow/L66wGmYnfIUbwdUTe3LMRbqON8B+5RJEvcGxkvrVUjTMrsXYhAnIwe0dTJfOYbWrDYyqUrz7dw/JO4hpmV2LsQQvkUeGq1BsZLx+cu5iV0e0eScJ91VIQYrmqfdVSK7GgjOU0oPaPOu5IcDK1mNvnD+K8LwS87f8Jx2mHtHnUkTGAurWZlNQa74ZLSFH9oF6FPGxzLsjQO5Qe0edcpttd7BXBSqMCL4k/4tFrHIPuEQ7m1/uIWkbDMWVoDdOSuRQ9286kvVUlQjzOE6VrNguN4oRXYGkgcnih7t13/9kxvLYKQezwLTrO44sVmMPgMqORo1E0sm1/9SludkcWHwfJwTSybR4LeAz6ugWVgRaY8mV/9SluQmtHrzsBtRF/wPY+X0JuYTs+ltgrXAmlk10xQHmTu9VSIAk1+vcvU4ml2oNzrNhEtQ3CysNP8UeR35wqpKUBdGdZMSjX4WVi8nJpdpHnbhzEIdx7mwf6W1FKAiucMXrWUWVjyRf23chNtR9mIzDoT/6ZLYailAjhFlZuvPtSeZ+2oREubDoWmT3TguY+JHPdRVSLKxfKH3vgNqJ/9emeEYikGXDFNzaLjvTeGAL61mogOoeG3y6oU4rW55ydoj0lUTSR/mmRhPmF86uwIfzp3FtiufQCmppaHDlGE0r2iTzXIw3zBq5hvaTldjG4CPb9wdxAme0SyedVKczJ9AtYbgPOzYKJvZZImsN7ecrxWZg5dR6ZLj/j4qpWsIA+vYwE+Tca9ounMIsrXMB4Stiib2SPQtZv+FVIpfEbzv8ncZoLBXc3YBqTG1HsskTTotZOYTG+oVUjLk6zhP8bg4RhMUNtfZdO7FdpBuXzhJ5Fh8IKlJG7wtD9ik8rWOJxy6iQ3NwzBpQ219mlyv+FLicYs2iJGSE0u2txzed++D61ZWCiHD/cZdQVCqkO2gJpdpNaObhnDfAPrT89RxdWFZ5hO3MseBSIlANppdZNIV/Rwe5eLTDvkfWKzFnH+QJ7m9QWV1KdwnuIwTNtZdJMoXBf74OhRnh2t+OTGL+AVUnIkyYY+QG7g9itHXyF3OIygG2s2kud679ZWKqSFa9n3IHD6MeLv1lZ0XyduRhiDRtrNnKoyiFVLcBm0ba5Yy3fQkDh4XsFE34isVpOzpa9nR8iCpS4HoxG2rJpnRhf3YboVa1PcRouh5LIJv/uQcPNd095ickTaiGBnWLKVWRc0OnYTSyex/n2FofEPnDG8y3PztHrzOLK1xo6RAml2k9owKajOC0Wr4D5x+3nA0UEhK2m198wuBHF3zlWWVKWLN1CHzLClUfuoYBcx4b1llpeBKmbayaR58njtE9onD66lUcsg0Spm2snsb+8HaJRn4dYcLbCuBuYwziB8/5U1C1DOOz2gZjSZtrLJk6vrLF3hwY4Io9xuT/ruUFRSBkNtUzTOWhjh26irLEPx4jPZL3Fo3QrReoGTTM21xYTT9oFdhTUIvjqTkfkvt0bzgVUjq/hOYY8j60IaO/0AzRBtqkTS6R5ellZd5uKdzzhb8BFlDdAcrwkE0rbXTOPB+7Y0FlZO96qFL4Ykg21StJs8qIW7h16H5hGiv8V2Cflau7QVDepTAHa6Lgt6feiEvJDM21StJsmOH/hynURrKxvUpQ8BH0JF7BiyG2qZpnL/7AOU66gt+reLEXY8pVOCQvSsBtqZTNM8bk9ohRcwD18o/WVkbvrceVKRb9I59IEKysjBeTMmmbA21xu/6iHadLRxuIzkLpi8wZYmmbbWi32RVAUjruxWlJ//iFxE38FI9hNKOoCdhwf5fDe4xZ81lgREhK2m1j78vW1CqkuMu/AjBNK210kzRUX/B+69cMMUG5bYrIeZxVSEZISmkzbXOi9yxwIfPgdsov7R71xuJ7rFcACjG/9PzApqFq7wEgzNJm2suWESPuwrQvejj7cbnQxMkxpm21lUYJL0fKmogPPqywn7e3FvB/FCNxPJ85iVUkCE9/tLKx31G4CgNtWTTPFhMvlu8G4/TrgaZttTChljfNJGgOT2X6EqpETy2tYd9cCBI4lIXJ1/3uVUllZEJz4baqGF64yxaZ+zPLYwde8Uqn1oKANtUrSaTOPHkhvuQP3bBlEJ/LFe4pqQOHUI8T8q7AXx3fLVBgSCVpMba55YxN3rv8U1Dv51bAPSOLlZWebkL8vSMGI21lJmmeVxPRwFlZF1CpqCN8uLwymaZyjbXHCRytogPN3o/n74CNykfT+qqRv5AQlHcRxYrC5KvGmbbUwmZY/29BvF6C1/93x4WVglXDLFpmbapmF89HKTogRwqqSlGbu+oiAkcWFbklC6Zhf+NtTLFpn8oWz+HsNRVSgIxZWON+yVyJlE5tq/+GWLTMutYX9ekTySEQPLVNQQ3OfycwJBM0zNtZcse7CvcKI0V/zh16Dr9OSA21MpmmcrHC+6pTAPHPwoit3LHHqs7jhFNRD6W8+EBGoSEoaZttTCZljfduH/fFisn+dRBGAZYtMzbVMwvul/T/crK1NQh8gN0SRRa9cOux6clC0/mDLFpmbarmF8/e6CopeOLCNW6S/IUUg3jJIYiAcDoMcGeRbOvuTPjXR/tyo79LK3kqqkbxkkMRAOB0GODPItnX3Jnxro/25Ud+llbyVVSN4ySGIgHA6DHBnkWzr7kz410f7cqO/Syt5KqpFVJwn6gBEvBM0zNtZcpGOEPiysW8vvRd2R0f7gtjhqUvXL+gWVwHm4XJDBiMpmmZtrLfPwd/IugP5+fKVSysH1EXreFAcEhelGmbbUmZY4Xdo1vQWVnK19P4RuEnbf0gQnR+lDCZlivNM22t1ESmopPIgfT0duOfQrsjgG4tPxli0zJmF5trdL1JDUIUT1ZXSqQDeR4B8mX3TrRro/2McGeUvLtwo6jIEKMkCUXWsLyZROd9P/rFYNtXPBli0z398iVUlVKAjFlY437JXImUTm2r/4ZYtMy61hf16RPJIU9nZ1MABAwAAAAAAAAAZpwgEwIAAABhp658BScAAAAAAADnUFBQXIDGXLhwtttNHDhw5OcpQRMETBEwRPduylKVB0HRdF0A";
            else {
                if (!Modernizr.video.h264) return void a("videoautoplay", !1);
                o.src = "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAz5tb292AAAAbG12aGQAAAAAzaNacc2jWnEAAV+QAAFfkAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAGGlvZHMAAAAAEICAgAcAT////3//AAACQ3RyYWsAAABcdGtoZAAAAAHNo1pxzaNacQAAAAEAAAAAAAFfkAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAEAAAABAAAAAAAd9tZGlhAAAAIG1kaGQAAAAAzaNacc2jWnEAAV+QAAFfkFXEAAAAAAAhaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAAAAAAGWbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABVnN0YmwAAACpc3RzZAAAAAAAAAABAAAAmWF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAEAAQAEgAAABIAAAAAAAAAAEOSlZUL0FWQyBDb2RpbmcAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwH0AAr/4QAZZ/QACq609NQYBBkAAAMAAQAAAwAKjxImoAEABWjOAa8gAAAAEmNvbHJuY2xjAAYAAQAGAAAAGHN0dHMAAAAAAAAAAQAAAAUAAEZQAAAAKHN0c3oAAAAAAAAAAAAAAAUAAAIqAAAACAAAAAgAAAAIAAAACAAAAChzdHNjAAAAAAAAAAIAAAABAAAABAAAAAEAAAACAAAAAQAAAAEAAAAYc3RjbwAAAAAAAAACAAADYgAABaQAAAAUc3RzcwAAAAAAAAABAAAAAQAAABFzZHRwAAAAAAREREREAAAAb3VkdGEAAABnbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcgAAAAAAAAAAAAAAAAAAAAA6aWxzdAAAADKpdG9vAAAAKmRhdGEAAAABAAAAAEhhbmRCcmFrZSAwLjkuOCAyMDEyMDcxODAwAAACUm1kYXQAAAHkBgX/4NxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxMjAgLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDExIC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MCByZWY9MSBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgxOjAgbWU9ZXNhIHN1Ym1lPTkgcHN5PTAgbWl4ZWRfcmVmPTAgbWVfcmFuZ2U9NCBjaHJvbWFfbWU9MSB0cmVsbGlzPTAgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0wIGNocm9tYV9xcF9vZmZzZXQ9MCB0aHJlYWRzPTYgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTUwIGtleWludF9taW49NSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmM9Y3FwIG1idHJlZT0wIHFwPTAAgAAAAD5liISscR8A+E4ACAACFoAAITAAAgsAAPgYCoKgoC+L4vi+KAvi+L4YfAEAACMzgABF9AAEUGUgABDJiXnf4AAAAARBmiKUAAAABEGaQpQAAAAEQZpilAAAAARBmoKU"
            }
        } catch (i) {
            return void a("videoautoplay", !1)
        }
        o.setAttribute("autoplay", ""), o.style = "display:none", R.appendChild(o), setTimeout(function () {
            o.addEventListener("playing", t), A = setTimeout(t, e)
        }, 0)
    }), n(), delete c.addTest, delete c.addAsyncTest;
    for (var r = 0; r < Modernizr._q.length; r++) Modernizr._q[r]();
    A.Modernizr = Modernizr
}(window, document);
Modernizr.on('videoautoplay', function (result) {
    if (result) {
        $('#block-about-hero').addClass('ok');
    } else {
        $('#block-about-hero').addClass('no-video');
    }
});
$(document).ready(function () {
    var timeInterval, tabCount = 0,
        currnetIndex = 1;
    tabCount = $('ul#tabs').find('li a').length;
    var tabContentObj = $('.tab-content');
    changeTabIndex();
    timeInterval = setInterval(function () {
        changeTabIndex();
    }, 4 * 1000);

    function changeTabIndex() {
        if (currnetIndex > tabCount) {
            currnetIndex = 1;
        }
        tabContentObj.hide();
        $('ul#tabs').find('li.selected').removeClass('selected');
        var currentAncorObj = $('ul#tabs').find('li a').eq(currnetIndex - 1);
        currentAncorObj.parent().addClass('selected');
        $(currentAncorObj.attr('href')).show();
        currnetIndex++;
    };
    $('#tabs li').mouseenter(function () {
        clearInterval(timeInterval);
    }).mouseleave(function () {
        timeInterval = setInterval(function () {
            changeTabIndex();
        }, 4 * 1000);
    });
    $('#tabs li a').click(function () {
        tabContentObj.hide();
        $('ul#tabs').find('li.selected').removeClass('selected');
        var currentAncorObj = $(this);
        currnetIndex = $('ul#tabs').find('li a').index($(this)) + 1;
        currentAncorObj.parent().addClass('selected');
        $(currentAncorObj.attr('href')).show();
        currnetIndex++;
    });
});
(function ($) {
    $(function () {
        var scroll = $(document).scrollTop();
        var headerHeight = 90;
        $(window).scroll(function () {
            var scrolled = $(document).scrollTop();
            if (scrolled > headerHeight) {
                $('.site-header').addClass('off-canvas');
            } else {
                $('.site-header').removeClass('off-canvas');
            }
            if (scrolled > scroll) {
                $('.site-header').removeClass('fixed');
                $('#nav-subpage').removeClass('scrolled');
            } else {
                $('.site-header').addClass('fixed');
                $('#nav-subpage').addClass('scrolled');
            }
            scroll = $(document).scrollTop();
        });
    });
})(jQuery);
jQuery(document).ready(function ($) {
    var sync1 = $("#sync1");
    sync1.owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: true,
        dots: true,
        loop: true,
        responsiveRefreshRate: 2000,
        navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>', '<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],
    }).on('changed.owl.carousel', syncPosition);

    function syncPosition(el) {
        var count = el.item.count - 1;
        var current = Math.round(el.item.index - (el.item.count / 2) - .5);
        if (current < 0) {
            current = count;
        }
        if (current > count) Â {
            current = 0;
        }
    }
});
jQuery(document).ready(function ($) {
    $('.owl').owlCarousel({
        autoplay: true,
        autoplayHoverPause: true,
        margin: 0,
        responsiveClass: true,
        nav: true,
        autoWidth: false,
        loop: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    }).on('changed.owl.carousel', active);

    function active(el) {
        $(".owl-item").removeClass("grayscale");
        if ($(".owl-item.active").prev(".owl-item:not(.active)")) {
            $(".owl-item.active").prev(".owl-item:not(.active)").addClass("grayscale");
            $(".owl-item.grayscale").prev(".owl-item").addClass("grayscale");
        }
    }
});

function isElementInViewport(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return ((rect.top <= 0 && rect.bottom >= 0) || (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) && rect.top <= (window.innerHeight || document.documentElement.clientHeight)) || rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight));
}
var addClassIfVisible = function () {
    $('.animation').each(function (index, item) {
        if (isElementInViewport(item)) {
            $(item).addClass('active');
        } else {
            $(item).removeClass('active');
        }
    });
    $('#block-stories').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('#nav-subpage').addClass('hidden');
        } else {
            $('#nav-subpage').removeClass('hidden');
        }
    });
    $('#block-callinspector-7 article p + p').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('#nav-subpage').addClass('hidden');
        } else {
            $('#nav-subpage').removeClass('hidden');
        }
    });
    $('#block-market-locator-5 article p + p').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('#nav-subpage').addClass('hidden');
        } else {
            $('#nav-subpage').removeClass('hidden');
        }
    });
    $('.page-id-70 #block-stories').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('#nav-subpage').removeClass('fixed');
        }
    });
    $('.page-id-68 #block-stories').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('#nav-subpage').removeClass('fixed');
        }
    });
    $('#block-blog').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('#nav-subpage').removeClass('fixed');
        }
    });
    $('#block-adalytics-2').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.adalytics-nav-1').addClass('active');
            $('.adalytics-nav-2').removeClass('active');
        }
    });
    $('#block-adalytics-3').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.adalytics-nav-1').addClass('active');
            $('.adalytics-nav-2').removeClass('active');
        }
    });
    $('#block-adalytics-4').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.adalytics-nav-1').addClass('active');
            $('.adalytics-nav-2').removeClass('active');
        }
    });
    $('#block-adalytics-5').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.adalytics-nav-1').addClass('active');
            $('.adalytics-nav-2').removeClass('active');
        }
    });
    $('#block-adalytics-6 .headline').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.adalytics-nav-2').addClass('active');
            $('.adalytics-nav-1').removeClass('active');
        }
    });
    $('#block-adalytics-7').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.adalytics-nav-2').addClass('active');
            $('.adalytics-nav-1').removeClass('active');
        }
    });
    $('#block-adalytics-8').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.adalytics-nav-2').addClass('active');
            $('.adalytics-nav-1').removeClass('active');
        }
    });
    $('#block-market-locator-2 .headline').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.market-locator-nav-1').addClass('active');
            $('.market-locator-nav-2').removeClass('active');
            $('.market-locator-nav-3').removeClass('active');
        }
    });
    $('#block-market-locator-3 .headline').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.market-locator-nav-1').removeClass('active');
            $('.market-locator-nav-2').addClass('active');
            $('.market-locator-nav-3').removeClass('active');
        }
    });
    $('#block-market-locator-4 .headline').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.market-locator-nav-1').removeClass('active');
            $('.market-locator-nav-2').removeClass('active');
            $('.market-locator-nav-3').addClass('active');
        }
    });
    $('#block-callinspector-2').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.callinspector-nav-1').addClass('active');
            $('.callinspector-nav-2').removeClass('active');
            $('.callinspector-nav-3').removeClass('active');
        }
    });
    $('#block-callinspector-3').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.callinspector-nav-1').addClass('active');
            $('.callinspector-nav-2').removeClass('active');
            $('.callinspector-nav-3').removeClass('active');
        }
    });
    $('#block-callinspector-4').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.callinspector-nav-1').addClass('active');
            $('.callinspector-nav-2').removeClass('active');
            $('.callinspector-nav-3').removeClass('active');
        }
    });
    $('#block-callinspector-5 .headline').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.callinspector-nav-1').removeClass('active');
            $('.callinspector-nav-2').addClass('active');
            $('.callinspector-nav-3').removeClass('active');
        }
    });
    $('#block-callinspector-6 .headline').each(function (index, item) {
        if (isElementInViewport(item)) {
            $('.callinspector-nav-1').removeClass('active');
            $('.callinspector-nav-2').removeClass('active');
            $('.callinspector-nav-3').addClass('active');
        }
    });
}
jQuery(window).ready(function () {
    $(window).on('DOMContentLoaded load resize scroll', addClassIfVisible);
});
if ($('#nav-subpage').length > 0) {
    var fixmeTop = $('#nav-subpage').offset().top;
    $(window).scroll(function () {
        var currentScroll = $(window).scrollTop();
        if (currentScroll >= fixmeTop) {
            $('#nav-subpage').addClass('fixed');
        } else {
            $('#nav-subpage').removeClass('fixed');
        }
    });
}
if ((($(".article-img img").width()) / ($(".article-img img").height())) < 2) {
    $(".article-img").addClass("portrait");
}
jQuery(window).load(function () {
    $('.thumb img').each(function (index, item) {
        if ((($(item).width()) / ($(item).height())) < 2) {
            $(item).addClass('portrait');
        }
    });
});
