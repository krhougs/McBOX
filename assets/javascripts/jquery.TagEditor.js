(function ($) {
    $.fn.tagEditor = function (opts) {

        opts = $.extend({}, { url: '/Tags', param: 'q', method: 'get', suggestChars: 1, suggestDelay: 300, cache: true, ignoreCase: true, maxTags: 3, tagMaxLength: 20 }, opts);

        return this.each(function () {

            var $$ = $(this).wrap('<span class="tags-container"></span>'),
                $container = $$.closest('.tags-container'),
                $hidden = $('<input type="hidden" />').appendTo($$.closest('form')),
                allTags = [],
                menu = null,
                lastXhr = null,
                cache = {};
            $hidden.prop('name', $$.attr('name'));
            $$.prop('name', '');

            $container.click(function () {
                $$.focus();
            });

            var keys = { RETURN: 13, COMMA: 188, BACKSPACE: 8, SPACE: 32 };
            $$.keydown(function (e) {
                switch (e.keyCode) {
                    case keys.BACKSPACE:
                        if ($$.val() == '') {
                            if (allTags.length > 0) {
                                removeTag(allTags[allTags.length - 1]);
                                updateHidden();
                            }
                        }
                        break;
                    case keys.RETURN:
                        {
                            e.preventDefault();
                            if (menu)
                                menu.select();
                        }
                        //intentionally no break here
                    case keys.COMMA:
                    case keys.SPACE:
                        {
                            e.preventDefault();
                            $$.autocomplete('disable');
                            tryAcceptInputValue();
                            $$.autocomplete('enable');
                        }
                        break;
                    default:
                        break;
                }
            }).blur(function () {
                if (menu)
                    return;
                tryAcceptInputValue();
            });

            if ($$.val()) {
                var t = tagsFromString($$.val());
                for (var k in t) {
                    if (!existsTag(t[k])) {
                        addNewTag(t[k]);
                        updateHidden();
                    }
                }
                $$.val('');
            }

            $$.autocomplete({
                source: function (request, response) {
                    var term = request.term;
                    if (opts.cache) {
                        var cached = findFromCache(term);
                        if (cached) {
                            handleItems(cached);
                            return;
                        }
                    }

                    var p = {};
                    p[opts.param] = request.term;

                    var ajax = opts.method == 'post' ? $.post : $.get;
                    lastXhr = ajax(opts.url, p, function (data, status, xhr) {
                        var items = [];
                        for (var i in data) {
                            var tag = data[i];
                            items.push({ label: tag, value: tag });
                        }
                        if (opts.cache)
                            cache[term] = items;
                        if (xhr === lastXhr) {
                            handleItems(items);
                        }
                    }, 'json');

                    function handleItems(items) {
                        var suggestions = [];
                        for (var j in items) {
                            var item = items[j];
                            if (!existsTag(item.label)) {
                                suggestions.push(item);
                            }
                        }
                        response(suggestions);
                    }
                },
                minLength: opts.suggestChars,
                delay: opts.suggestDelay,
                select: function (event, ui) {
                    if (ui.item) {
                        var tag = ui.item.label;
                        if (!existsTag(tag)) {
                            addNewTag(tag);
                            updateHidden();
                        }
                    }
                    event.preventDefault();
                    $$.autocomplete('close');
                    $$.val('');
                },
                open: function () {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    menu = $(this).data("autocomplete").menu;
                    menu.activate($.Event({ type: "mouseenter" }), menu.element.children().first());
                },
                close: function () {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                    menu = null;
                    if (!$$.is(':focus') && $$.val()) {
                        tryAcceptInputValue();
                    }
                }
            });

            function tryAcceptInputValue() {
                var v = $.trim($$.val());
                if (v != '') {
                    if (!existsTag(v)) {
                        addNewTag(v);
                        updateHidden();
                    }
                    $$.val('');
                }
            }

            function addNewTag(tag) {
                if (opts.maxTags <= 0 || allTags.length < opts.maxTags) {
                    if (opts.tagMaxLength <= 0 || tag.length <= opts.tagMaxLength) {
                        var newTag = $('<span class="tag">' + tag + '<a href="#" title="remove tag">x</a></span>').data('tag', tag);
                        newTag.insertBefore($$).find('a').click(function (e) {
                            removeTag(tag);
                            e.preventDefault();
                        });
                        fixIeAbsoluteRefreshingIssue();
                        allTags.push(tag);
                    }
                }
            }

            function removeTag(tag) {
                var i = findTagIndex(allTags, tag);
                if (i < 0)
                    return;
                allTags.splice(i, 1);
                $container.find('span.tag').filter(function () {
                    return $(this).data('tag').toLowerCase() == tag.toLowerCase();
                }).remove();
                fixIeAbsoluteRefreshingIssue();
            }

            function fixIeAbsoluteRefreshingIssue() {
                var ie = $.browser.msie && typeof window['XMLHttpRequest'] !== "object";
                if (ie)
                    $(window).resize();
            }

            function updateHidden() {
                $hidden.val(stringFromTags(allTags));
            }

            function existsTag(tag) {
                return findTagIndex(allTags, tag) >= 0;
            }

            function tagsFromString(s) {
                var splited = s.split(',');
                var tags = [];
                for (var i = 0; i < splited.length; i++) {
                    var tag = $.trim(splited[i]);
                    if (tag && findTagIndex(tags, tag) < 0)
                        tags.push(tag);
                }
                return tags;
            }

            function stringFromTags(tags) {
                var s = '';
                for (var i = 0; i < tags.length; i++) {
                    s += tags[i] + ', ';
                }
                if (s.length > 0)
                    s = s.substr(0, s.length - 2);
                return s;
            }

            function findFromCache(term) {
                for (var i in cache) {
                    var t1 = opts.ignoreCase ? i.toLowerCase() : i;
                    var t2 = opts.ignoreCase ? term.toLowerCase() : term;
                    if (t1 == t2)
                        return cache[i];
                }
                return null;
            }

            function findTagIndex(tags, tag) {
                for (var i = 0; i < tags.length; i++) {
                    var t1 = opts.ignoreCase ? tag.toLowerCase() : tag;
                    var t2 = opts.ignoreCase ? tags[i].toLowerCase() : tags[i];
                    if (t1 == t2)
                        return i;
                }
                return -1;
            }
        });
    };
})(jQuery);