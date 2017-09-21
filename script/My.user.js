(function (window, uid) {  // [2] нормализуем window
    var w;
    if (typeof unsafeWindow != 'undefined') {
        w = unsafeWindow
    } else {
        w = window;
    }

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    if (w.self != w.top) {
        return;
    }
    // [4] дополнительная проверка наряду с @include
    if (/https:\/\/vk\.com\//.test(w.location.href)) {
        if (w.ObjExport) {
            var {dApi, vk_lib} =w.ObjExport;
        }

        setTimeout(onchange, 0);// переписат на добавление по клику
        addGlobalStyle('\n' +
            '.amcharts-pie-slice {\n' +
            ' transform: scale(1);\n' +
            ' transform-origin: 50% 50%;\n' +
            ' transition-duration: 0.3s;\n' +
            ' transition: all .3s ease-out;\n' +
            '-webkit-transition: all .3s ease-out;\n' +
            ' -moz-transition: all .3s ease-out;\n' +
            '-o-transition: all .3s ease-out;\n' +
            ' cursor: pointer;\n' +
            'box-shadow: 0 0 30px 0 #000;\n' +
            '}' +
            '.amcharts-pie-slice:hover {\n' +
            ' transform: scale(1.1);\n' +
            'filter: url(#shadow);\n' +
            ' }\n' +
            '.user_progress {\n' +
            ' margin-left: 30%;\n' +
            ' }\n' +
            '.user_chart {\n' +
            'width :100%;\n' +
            'height :' + (w.document.documentElement.clientHeight - 100) + 'px;\n' +
            'font-size :11px;\n' +
            ' }', 'amchat');

        //console.log('onload');

        let lastPathname = '', offset = 0, execute = false;


        function onchange() {
            if (w.location.pathname == '/im') {
                if (!(w.document.querySelector('.ui_actions_menu > .user_element') || w.document.querySelectorAll('.ui_actions_menu')[1].childNodes.length < 3)) {
                    addChart(); //setTimeout(onchange, 30);
                } else {
                    //addChart();

                }
            }
            setTimeout(onchange, 3600);
            // debugger;
        };

        let addChart = function () {
            let actionsMenu = w.document.querySelectorAll('.ui_actions_menu')[1];
            let div = w.document.createElement('div');
            div.className = 'ui_actions_menu_sep';
            actionsMenu.appendChild(div);

            div = w.document.createElement('a');
            div.onclick = OpenDialogVK;
            div.className = 'ui_actions_menu_item _im_action im-action user_element';
            div.textContent = 'Показать график';
            div.setAttribute('role', 'link');
            div.setAttribute('tabindex', '0');
            actionsMenu.appendChild(div);
            //div.addEventListener('DOMNodeRemoved', onchange);
        };
        //addChart();

        // let  sideBar = w.document.getElementById('side_bar_inner');
        //let  im =  sideBar.querySelector('#l_msg > a');
        //im.addEventListener(onclick, MyOnclick);

        //addGlobalStyle('#im--page  {width: 80%;} .ui_clean_list {width: 80%;} .im-page .im-page--history-new-bar {width: 60%;}'); //уменьшает сообщения в вк
        // addGlobalStyle('#im--page  {width: 85%;} ');
        //w.document.querySelectorAll('.im-page--chat-body-abs').forEach(val => { val.style.width='';});


        //;
    }

    function OpenDialogVK(element) {
        var countHistory = new MessagesUserCount(cur.peer);
        var html = '<div id="svg_side"  class="user_progress"></div>';
        var Box = new MessageBox({title: 'Говорливость'});
        var progress = new CircularProgress({
            radius: 70,
            strokeStyle: 'black',
            lineCap: 'round',
            lineWidth: 4
        });
        let optionChart = {
            "type": "pie",
            "angle": 43.2,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "depth3D": 16,
            "gradientType": "linear",
            "labelRadius": 5,
            "pullOutRadius": "35%",
            "radius": "60%",
            "baseColor": "",
            "hoverAlpha": 0.72,
            "labelTickAlpha": 0,
            "maxLabelWidth": 0,
            "outlineAlpha": 0,
            "outlineThickness": 0,
            "titleField": "country",
            "valueField": "litres",
            "fontSize": 12,
            "autoDisplay": true,
            "handDrawThickness": 2,
            "theme": "dark",
            "allLabels": [],
            "balloon": {},
            "titles": [],
            "dataProvider": []
        };


        Box.removeButtons();
        Box.addButton('закрыть', function () {
            Box.hide();
            Box = null;
            countHistory = null;
        }, 'no', true);


        Box.content(html).show();
        Box.bodyNode.firstChild.appendChild(progress.el);

        console.dir(Box);
        //debugger;

        let controlProgress = function ({detail}) {
            if (detail.type == "Progress") { // считаем нужно вывести прогрессбар
                progress.update(detail.Progress);
            }
            else if (detail.type == "Finish") {// посчитали будем рисовать
                progress.update(100);
                Box.bodyNode.firstChild.removeChild(progress.el);
                Box.setOptions({
                    'height': w.document.documentElement.clientHeight - 80 + 'px',
                    'width': '80%'
                });
                countHistory.dataProvider(detail.massageCount, function (value) {
                        let boxContainer = Box.bodyNode.closest('.popup_box_container');
                        boxContainer.style.marginTop = '40px';
                        //Box.bodyNode.firstChild.removeAttribute('style');
                        Box.bodyNode.firstChild.className = 'user_chart';
                        Box.addButton('График 1', function () {
                            drawGoogleTable(value.googleData);
                        }, 'yes', true);
                        Box.addButton('График 2', function () {
                            amGraf();
                        }, 'yes', true);

                        var amGraf = function () {
                            if (value.dataProvider.length > 10) {
                                optionChart.radius = "30%";
                            }
                            optionChart.dataProvider = value.dataProvider;
                            //  console.log(JSON.stringify(optionChart));
                            chart = AmCharts.makeChart("svg_side", optionChart);
                        };
                        // boxContainer.style.width='80%';
                        // boxContainer.style.height =  w.document.documentElement.clientHeight -@@@@50 +'px';

                        if (value.dataProvider.length > 50) {
                            drawGoogleTable(value.googleData);
                        } else amGraf();


                        // debugger;
                    }
                );
            }

            // debugger;
        };
        //countHistory.clearlocalStorege();
        countHistory.addEventHistoryCountFinish(controlProgress).addEventProgress(controlProgress);
        countHistory.getCount();
        //countHistory.close();
        ;

    }

    function MessagesUserCount(uid) {
        var self = this;
        var sall = uid + Math.random() * 1000, events = {};
        this.message_id = 0;

        this.addEventProgress = function (func) {
            addEvent('Progress', func);
            return this;
        };

        this.addEventHistoryCountFinish = function (func) {
            addEvent('Finish', func);
            return this;
        };

        function addEvent(name, func) {
            let sname = name + sall;
            w.addEventListener(name + sall, func);
            events[sname] || (events[sname] = []);
            events[sname].push(func);
        }

        this.dataProvider = function (massageCount, func) {// на вход получаем объект ключ ид пользователя значение некое число которое мы визуализируем
            var promise = new Promise(function (resolve, reject) {
                try {
                    dApi.call('users.get', {
                            'user_ids': Object.keys(massageCount).join(','),
                            'fields': 'first_name,last_name',
                            'v': '5.60'
                        },
                        function (r) {
                            let data = [], googleData = [], total = massageCount.total;
                            r.response.forEach((value) => {
                                data.push({
                                    "country": value.first_name + ' ' + value.last_name,
                                    "litres": +(100 * massageCount[value.id] / total).toFixed(2) // считаем процент округляем до 2х после запятой
                                });
                                let portion = [];
                                googleData.push(portion);
                                portion.push(data[data.length - 1].country);
                                portion.push(data[data.length - 1].litres);
                            });

                            //debugger;

                            resolve({'dataProvider': data, massageCount, googleData});
                        });
                }
                catch (e) {
                    reject(e);
                }

            });
            promise.then((value) => func(value));
            promise.catch((reason) => {
                throw reason;
            });
            //debugger;
            /*for (key in massageCount){
             if(!massageCount.hasOwnProperty(key)) continue;


             }*/
        };

        this.clearlocalStorege = function () { //чистим хранилище данных
            local = localStorage.removeItem(document.domain + uid);
        }
        this.close = function () {
            Object.keys(events).forEach((key) => {
                events[key].forEach((func) => w.removeEventListener(key, func));
            });

        };
        function setLocalStorage(massageCount) {
            localStorage.setItem(document.domain + uid, JSON.stringify({
                'massageCount': massageCount,
                'message_id': self.message_id
            }));

        }

        this.getCount = function () {
            var local = localStorage.getItem(document.domain + uid) || '{}';
            var {massageCount = {}, message_id = 0} = JSON.parse(local);
            Object.defineProperties(massageCount, {
                'length': {
                    get: function () {
                        return Object.keys(this).length;
                    }, enumerable: false
                },
                'total': {
                    get: function () {
                        let sum = 0;
                        for (key in this) {
                            if (!this.hasOwnProperty(key) || !this.propertyIsEnumerable(key)) continue;
                            sum += this[key];
                        }
                        return sum;
                    },
                    enumerable: false
                }
            });
            if (!this.message_id) this.message_id = message_id;

            var offset = PER_REQ = 100;// сколько выбираем за раз и смешение относительно id_massage
            var totalProgress = 0; //здесь мы будем накапливать количество элементов в массиве каждый раз приблежая его к  count
            var scan;
            scan = function () {
                //document.title='offset:'+offset;
                //debugger;
                /*count - количество сообщений (отсчитывается от start_message_id в сторону первого сообщения в переписки)
                 соответственно
                 API.messages.getHistory({  count:10, offset:-1'
                 вернет 1 сообщение*/
                var code = [];
                for (var i = 0; i < 10; i++) {
                    code.unshift('API.messages.getHistory({user_id:' + uid + ', start_message_id:' + self.message_id + ', count:' + PER_REQ + ', offset:' + (-offset) + '}).items');//
                    offset += PER_REQ;
                }
                dApi.call('execute', {
                    code: 'return {count:API.messages.getHistory({user_id:' + uid + ', start_message_id:' + self.message_id + ', count:0, offset:0}), items:' + code.join('+') + '};',
                    v: '5.60'
                }, function (r) {
                    let msgs = r.response.items;
                    if (!msgs.length) {
                        CallEvent('Finish', {'massageCount': massageCount});
                        return;
                    }
                    let count = r.response.count.count;
                    let id = msgs[0].id;
                    totalProgress += msgs.length;
                    CallEvent('Progress', {Progress: Math.round(100 * totalProgress / count, 2)});
                    msgs.forEach((value) => {
                        massageCount[value.from_id] ? massageCount[value.from_id]++ : massageCount[value.from_id] = 1;

                        // debugger;
                    });
                    if (id > self.message_id) {
                        self.message_id = id;
                        offset = 100;
                    } // следуящая выборка начнется с этого сообщения, убираем смешение
                    //messages = messages.concat(msgs);
                    //debugger;
                    if (id != r.response.count.in_read && id != r.response.count.out_read) {
                        setTimeout(scan, 350);
                    } else {
                        setLocalStorage(massageCount); // пишем в локальное хранилище;
                        CallEvent('Finish', {'massageCount': massageCount});
                    }
                });
            };
            scan();
        };
        function CallEvent(name, obj) {
            obj.type = name;
            obj.name = name + sall;
            obj.uid = uid;
            let widgetEvent = new CustomEvent(name + sall, {
                bubbles: true,
                // detail - стандартное свойство CustomEvent для произвольных данных
                detail: obj
            });
            w.dispatchEvent(widgetEvent);
        }
    }


    function addGlobalStyle(css, id) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        ;

        style = head.querySelector('style[userteg=' + id + ']') || document.createElement('style');
        style.type = 'text/css';
        style.setAttribute('userteg', id);
        style.innerHTML = css;
        head.appendChild(style);
    }


    var CircularProgress = (function () {

        // List of 2D context properties
        var ctxProperties = ['fillStyle', 'font', 'globalAlpha', 'globalCompositeOperation',
            'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth',
            'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX',
            'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseLine'];

        // Autoscale function from https://github.com/component/autoscale-canvas
        var autoscale = function (canvas) {
            var ctx = canvas.getContext('2d'),
                ratio = window.devicePixelRatio || 1;

            if (1 !== ratio) {
                canvas.style.width = canvas.width + 'px';
                canvas.style.height = canvas.height + 'px';
                canvas.width *= ratio;
                canvas.height *= ratio;
                ctx.scale(ratio, ratio);
            }

            return canvas;
        };

        // Utility function to extend a 2D context with some options
        var extendCtx = function (ctx, options) {
            for (var i in options) {
                if (ctxProperties.indexOf(i) === -1) continue;

                ctx[i] = options[i];
            }
        };

        // Main CircularProgress object exposes on global context
        var CircularProgress = function (options) {
            var ctx, i, property;

            options = options || {};
            this.el = document.createElement('canvas');

            this.options = options;

            options.text = options.text || {};
            options.text.value = options.text.value || null;

            ctx = this.el.getContext('2d');

            for (i in ctxProperties) {
                property = ctxProperties[i];
                options[property] = typeof options[property] !== 'undefined' ? options[property] : ctx[property];
            }

            if (options.radius) this.radius(options.radius);
        };

        // Update with a new `percent` value and redraw the canvas
        CircularProgress.prototype.update = function (value) {
            this._percent = value;
            this.draw();
            return this;
        };

        // Specify a new `radius` for the circle
        CircularProgress.prototype.radius = function (value) {
            var size = value * 2;
            this.el.width = size;
            this.el.height = size;
            autoscale(this.el);
            return this;
        };

        // Draw the canvas
        CircularProgress.prototype.draw = function () {
            var tw, text, fontSize,
                options = this.options,
                ctx = this.el.getContext('2d'),
                percent = Math.min(this._percent, 100),
                ratio = window.devicePixelRatio || 1,
                angle = Math.PI * 2 * percent / 100,
                size = this.el.width / ratio,
                half = size / 2,
                x = half,
                y = half;

            ctx.clearRect(0, 0, size, size);

            // Initial circle
            if (options.initial) {
                extendCtx(ctx, options);
                extendCtx(ctx, options.initial);

                ctx.beginPath();
                ctx.arc(x, y, half - ctx.lineWidth, 0, 2 * Math.PI, false);
                ctx.stroke();
            }

            // Progress circle
            extendCtx(ctx, options);

            ctx.beginPath();
            ctx.arc(x, y, half - ctx.lineWidth, 0, angle, false);
            ctx.stroke();

            // Text
            if (options.text) {
                extendCtx(ctx, options);
                extendCtx(ctx, options.text);
            }

            text = options.text.value === null ? (percent | 0) + '%' : options.text.value;
            tw = ctx.measureText(text).width;
            fontSize = ctx.font.match(/(\d+)px/);
            fontSize = fontSize ? fontSize[1] : 0;

            ctx.fillText(text, x - tw / 2 + 1, y + fontSize / 2 - 1);

            return CircularProgress;
        };
        return CircularProgress;
    })();


    function drawGoogleTable(dataTable) {
        if (!w.google) {// загружаем
            let s = document.createElement('script');
            s.addEventListener('load', () => {
                google.charts.load('current', {'packages': ['corechart']});
                google.charts.setOnLoadCallback(() => drawGoogleTable(dataTable));
            });
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('charset', 'utf-8');
            s.setAttribute('src', 'https://www.gstatic.com/charts/loader.js');
            // s.async = false;
            w.document.body.appendChild(s);
            return;
        }
        ;//google.charts.load('current', {'packages':['corechart']});
        dataTable[0][0] == 'Task' ? {} : dataTable.unshift(['Task', 'Hours per Day']);
        var data = google.visualization.arrayToDataTable(dataTable);


        var table = new google.visualization.PieChart(document.getElementById('svg_side'));

        table.draw(data, {
            title: '',
            pieHole: 0.4,
            legend: {position: 'labeled'}


        });
    }


    var attachmentsAndLink = {
        module_id: 'attachments_and_link',
        COUNT_ROW: 8,
        cursor: 0,
        _timer: null,
        _content: null,
        _uid: null,
        /* первое выполнение сразу, последующее с указанной задержкой*/
        onInit: function () {
            var self = this;

            //инициализируем шаблон
            self.template = self.template();
            ['addBottom', 'clickMenu', 'getAttach', 'getHistoryAttr', 'tplProcess', 'pasteHTML', 'scrolling', 'processResponse',
                'callEvent', 'normalazeMessage'].reduce(function (func, value) {
                    func[value] = func[value].bind(func);
                    return func;
                },
                self);


            self.getAttach = self.debounce(self.getAttach); // тормозим функцию

            // var menuClick = (function (e) {
            //     var target = e.target;
            //     if (target.matches && target.matches('.ui_actions_menu > [data-action="photos"]')) {
            //         this._timer = setTimeout(this.addBottom, 20);
            //     } else if (target.closest('.ui_tabs_box')) setTimeout(this.addBottom, 20); //щелкнули на одну из вкладок
            //     else if (this._timer) {
            //         clearTimeout(this._timer);
            //         //document.removeEventListener('scroll', this.scrolling, true);
            //     } // нажали сразу в другом месте, окно не успело прогрузится либо закрылось. убираем таймер и обработчики
            // }).bind(self);
            // document.addEventListener('click', menuClick, true);

            /*обработчики */
            window.addEventListener("my_ready", self.onready);


            document.addEventListener('scroll', self.scrolling, true);

        },
        onRequestQuery: function (url, query, options) {
            if (url == 'wkview.php') {
                var self = this;
                setTimeout(self.addBottom);
            }
        },
        css: function () {
            return vk_lib.get_block_comments(function () {
                /*css:
                 .no_link{
                 pointer-events: none;

                 }
                 .media_position {
                 display : inline-block;
                 float: left;
                 margin : 1px;
                 vertical-align : top;
                 line-height : normal;
                 width: auto;
                 height: 150px;
                 }
                 .history_im_fwd {
                 margin-left: 14%;
                 }
                 .history_im_media_fwd {
                 margin-left: -15%
                 }
                 .history_message {
                 border-bottom: 1px dotted #ecf1f5;
                 padding-bottom: 10px;
                 }
                 */
            }).css;
        },
        loader: (function () {
            var displayed;
            return function () {
                if (w.vk_DEBUG) return; //не показывать окно при включенной отладке
                if (displayed) {
                    hide(boxLoader);
                    hide(boxLayerWrap);
                    displayed = null;
                } else {
                    show(boxLoader);
                    show(boxLayerWrap);
                    displayed = true;
                }
            }
        })(),
        tplProcess: function (template) { //применяет к шаблону весь массив аргументов
            for (var i = 1; i < arguments.length; i++) {
                template = vk_lib.tpl_process(template, arguments[i]);
            }
            return template;
        },
        addBottom: function () {
            var self = this;
            var tabsBox = geByClass1('ui_tabs_box', null, '#wk_history_wrap ');// ищем нужный див
            if (tabsBox && !tabsBox.querySelector('.my_link_repost')) {
                this._timer = null;
                tabsBox.lastElementChild.insertAdjacentHTML('afterEnd', vk_lib.tpl_process(this.template.menu_button, {
                    module_id: this.module_id
                }));
                tabsBox.querySelector('.my_link_repost').onclick = function () {
                    self.clickMenu(cur.peer)
                };

            } else   this._timer = setTimeout(this.addBottom, 20); // похоже страница не прогрузилась, ждем еще

        },
        clickMenu: function (uid) {
            var content = ge('wk_history_rows'), menu = document.querySelector('#wk_history_wrap  .my_link_repost');
            this._content = content;
            if (menu.classList.contains('ui_tab_sel')) return; // повторный клик
            document.querySelectorAll('#wk_history_wrap  .ui_tab_sel').forEach(function (value) {
                value.classList.remove('ui_tab_sel');
            });
            menu.classList.toggle('ui_tab_sel');
            ge('wk_history_more_link').remove(); //удаляем скролл
            content.innerHTML = '';//'<span style="height:'+document.documentElement.clientHeight+'px"></span>';
            // this.state = 0;
            if (uid != this._uid || !this.itemMessage) this.itemMessage = {};
            this._uid = uid;
            this.cursor = 0;
            this.start = true;
            nav.objLoc.w = 'history' + nav.objLoc.sel + '_document';
            wkcur.wkRaw = nav.objLoc.w;
            nav.setLoc(nav.objLoc);
            //history.pushState(null, null, location.search.replace(/(=history.*_)(.*$)/, '$1document'));

            this.getlocalStorage(uid);
            this.getAttach({uid: uid}, this.processResponse);

        },


        scrolling: function (e) {
            if (!this._content) return;
            if (!(e.currentTarget.location && e.currentTarget.location.search.match(/_document$/))) return;
            if (this.cursor == this.local.strongIdMessages.length - 1 && this.local.lastid == 'eof') return; //достигли конца ленты
            var coords = this._content.getBoundingClientRect();

            if (coords.height - document.documentElement.clientHeight + coords.top < 0) {
                this.getAttach({uid: this._uid, scroll: true}, this.processResponse);
            }
        },
        pasteHTML: function pasteHTML(node, options, position) {
            var lastdiv;
            var qlast = function (select) {
                return (node = node.querySelectorAll(select)) && node[node.length - 1] || node;
            };

            switch (position) {
                case 'begin':
                    node.classList.add('history_message');
                    node.insertAdjacentHTML('beforeEnd', this.tplProcess.apply(null, Array.prototype.concat.apply([this.template.content_row], options)));
                    pasteHTML.lastdiv = node;
                    pasteHTML.typePaste = {};
                    break;

                case 'repost':
                case 'forward':
                    var div = document.createElement('div');
                    options[0].no_link = options[0].location ? '' : 'no_link';
                    if (position == 'forward' && (lastdiv = pasteHTML.lastdiv.querySelector('[data-deep="' + (options[0].depth || 0) + '"]:last-child'))) {
                        node = lastdiv.children[0];
                        div.insertAdjacentHTML('beforeEnd', this.template.content_repost_deep);
                    } else {
                        node = qlast('[name=content_repost]');

                        div.insertAdjacentHTML('beforeEnd', this.template.content_repost);
                        div.querySelector('[data-deep]').setAttribute('data-deep', options[0].depth || 0);
                    }

                    geByClass1('im-mess-stack_fwd', div).insertAdjacentHTML('afterEnd', this.tplProcess.apply(null, Array.prototype.concat.apply([this.template.content_row], options)));
                    node.appendChild(div);
                    node = div;
                    if (options[0].nocontent) break;
                case 'content':
                    node.querySelector('[name=content]').insertAdjacentHTML('beforeEnd',
                        this.tplProcess.apply(null, Array.prototype.concat.apply([this.template.content_message], options)));
                    break;
                case 'repost_link':
                case 'repost_link_no_photo':
                    node.querySelector('[name=content_repost]').insertAdjacentHTML('beforeEnd',
                        this.tplProcess.apply(null, Array.prototype.concat.apply([position == 'repost_link' ? this.template.content_link : this.template.content_link_no_photo], options)));
                    break;
                case 'photo':
                case 'gif':
                case 'doc':
                case 'audio':
                case 'poll':
                case 'video':
                    div = pasteHTML.typePaste[position] || ( pasteHTML.typePaste[position] = document.createElement('div') ) && position == 'photo' ? (pasteHTML.typePaste[position].setAttribute('style', 'display: inline-block;'), pasteHTML.typePaste[position]) : pasteHTML.typePaste[position];
                    div.insertAdjacentHTML('beforeEnd', this.tplProcess.apply(null, Array.prototype.concat.apply([this.template[position]], options)));
                    qlast('[name=content_repost]').appendChild(div);
                    break;
                case 'poll_answers':
                    div = document.createElement('div');
                    div.insertAdjacentHTML('afterBegin', this.tplProcess.apply(null, Array.prototype.concat.apply([this.template.poll_answers], options)));
                    qlast('.page_poll_stats').appendChild(div);
                    break;
                case 'json':
                    div = document.createElement('div');
                    div.textContent = options[0];
                    qlast('[name=content_repost]').appendChild(div);
                    node = div;
                    break;


            }
            return node;
        },

        debounce: function (f) {
            var start_form = 0;
            this.state = null;

            return function () {
                if (this.state) return;

                this.state = 1;
                this.loader();
                //try {
                f.apply(this, arguments);
                //}
                /// catch (e) {
                //   self.state = null;
                // }

                /* setTimeout(function() {
                 self.state = null;
                 }, ms);*/
            }

        },
        TimeStamp: function (timeStamp) {
            return new Date(timeStamp * 1000).toLocaleString();
        },
        geId: function (arr, id) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == id) return arr[i];
            }
        },


        onready: (function () {
            var func, self;
            return function (e) {
                if (isFunction(e)) {
                    func = e;
                    self = this;
                } else {
                    func(e.detail);
                }
            }

        })(),
        callEvent: function (name, obj) {
            obj = obj || {};
            obj.name = name;
            obj.uid = self._uid;
            var widgetEvent = new CustomEvent("my_ready", {
                bubbles: true,
                // detail - стандартное свойство CustomEvent для произвольных данных
                detail: obj
            });
            window.dispatchEvent(widgetEvent);
        },

        errorProcessing: function (r) {
            if (!r.response) {// ошибка
                this.loader();
                new Error(r.error.error_msg);
            }
        },
        getlocalStorage: function (uid) {
            this.local = JSON.parse(localStorage.getItem('vkopt_' + this.module_id + '_' + uid) || '{}');
            this.local.strongIdMessages = this.local.strongIdMessages || [];
            this.local.firstid = this.local.firstid || 0;
            this.local.lastid = this.local.lastid || 0;

        },
        setlocalStorage: function (uid) {
            localStorage.setItem('vkopt_' + this.module_id + '_' + uid, JSON.stringify({
                strongIdMessages: this.local.strongIdMessages,
                firstid: this.local.firstid,
                lastid: this.local.lastid
            }));
        },
        clearSetLocal: function (uid) {
            localStorage.clear('vkopt_' + this.module_id + '_' + uid);
        },


        processResponse: function (items) {
            var self = this, uid = self._uid, content = self._content;
            var content_row = self.template.content_row, content_message = self.template.content_message, content_repost = self.template.content_repost;
            var fragment = document.createDocumentFragment();
            var getName = function (item) {
                return item.first_name && item.first_name + ' ' + item.last_name;
            };
            var getLocation = function (item, type) {
                type = type || 'fwd';
                if (type == 'wall') {
                    return item.id ? 'wall-' + item.sender.id + '_' + item.id : '';
                } else {
                    return item.id ? 'im?msgid=' + item.id + '&sel=' + uid : '';
                }

            };
            var parseHash = function (url) {
                return /hash=(.+?)\&/.exec(url)[1];
            };
            var linkIt = function (text) {
                text = text.replace(/(^|[\n ])([\w]*?)((ht|f)tp(s)?:\/\/[\w]+[^ \,\"\n\r\t<]*)/ig, '$1$2<a href=\"$3\" target="_blank">$3</a>');

                text = text.replace(/(^|[\n ])([\w]*?)((www|ftp)\.[^ \,\"\t\n\r<]*)/ig, '$1$2<a href=\"http://$3\" target="_blank">$3</a>');

                text = text.replace(/(^|[\n ])([a-z0-9&\-_\.]+?)@([\w\-]+\.([\w\-\.]+)+)/i, '$1<a href=\"mailto:$2@$3\">$2@$3</a>');

                text = text.replace(/\[((?:club|id)\d+)\|(.+?)]/ig, '<a href="\$1" target="_blank">$2</a>');


                return (text);
            };
            items.forEach(function (item) {
                var attNames = ['fwd_messages', 'attachments'];

                var el = self.pasteHTML(document.createElement('div'), [{
                    name: getName(item.user),
                    time: self.TimeStamp(item.date),
                    location: getLocation(item)
                }, item.user], 'begin');
                fragment.appendChild(el);
                // content.appendChild(el);

                self.pasteHTML(el, [{text_content: linkIt(item.body), time: self.TimeStamp(item.date)}], 'content');


                attNames.forEach(function (attName) {
                    if (!item[attName]) return;
                    item[attName].forEach(function (att) {

                        repost(att[att.type] || att, att.type || 'fwd', 0, att.id);
                        function repost(att, type, depth, parentid) {
                            depth = depth || 0;
                            if (att.id == 0) return; // нет доступа, удалено.
                            /* репост */
                            if (type == 'wall' || type == 'fwd') {
                                self.pasteHTML(el, [{
                                    text_content: linkIt(att.body || att.text || ''),
                                    time: self.TimeStamp(att.date),
                                    name: getName(att.sender),
                                    location: getLocation(att, type),
                                    domain: att.sender.screen_name || att.sender.domain,
                                    depth: depth
                                }, att.sender], type == 'wall' ? 'repost' : 'forward');
                                if (att.fwd_messages) att.fwd_messages.forEach(function (wall) {
                                    repost(wall, 'fwd', depth + 1);
                                });
                                if (att.copy_history) att.copy_history.forEach(function (wall) {
                                    repost(wall.wall || wall[wall.type] || wall, wall.type || 'wall', 0, att.id)
                                });
                                if (att.attachments) att.attachments.forEach(function (wall) {
                                    repost(wall.wall || wall[wall.type] || wall, wall.type || 'wall', 0, att.id);
                                });

                            }
                            else if (type == 'photo') {
                                self.pasteHTML(el, [att], 'photo');
                            }
                            else if (type == 'video') {
                                self.pasteHTML(el, [{
                                    photo_320: att.photo_320
                                }, att], 'video');
                            }
                            else if (type == 'doc') {
                                if (att.type == 3) {
                                    self.pasteHTML(el, [{
                                        photo_size_src_o: att.preview.photo.sizes[2].src,
                                        url_parse_hash: parseHash(att.url),
                                        width: att.preview.photo.sizes[0].width + 100,//att.preview.video.width,
                                        height: att.preview.photo.sizes[0].height + 100, //att.preview.video.height
                                        dataWidth: att.preview.video.width,
                                        dataHeight: att.preview.video.height
                                    }, att], 'gif');
                                } else {
                                    self.pasteHTML(el, [{
                                        size: Math.round(att.size / 1000)
                                    }, att], 'doc');
                                }
                            }
                            else if (type == 'link') {
                                self.pasteHTML(el, [{text_content: ''}, att, att.photo], att.photo ? 'repost_link' : 'repost_link_no_photo');
                            }
                            else if (type == 'sticker') {
                                self.pasteHTML(el, [{photo_604: att['photo_' + att.width]}], 'photo');
                            }
                            else if (type == 'audio') {
                                self.pasteHTML(el, [{artist_encode: encodeURI(att.artist)}, att], 'audio');
                            }
                            else if (type == 'poll') {
                                self.pasteHTML(el, [{
                                    state: att.anonymous ? 'Открытый' : 'Анонимный',
                                    postId: att.owner_id + '_' + parentid
                                }, att], 'poll');
                                for (var i = att.answers.length - 1; i >= 0; i--) {
                                    self.pasteHTML(el, [att.answers[i]], 'poll_answers');
                                }
                            }
                            else {// не ясно что это отправляем в json
                                self.pasteHTML(el, ['\n' + JSON.stringify(att)], 'json');
                            }


                        }
                    });
                });
                self.cursor++;
            });
            content.appendChild(fragment);
            self.state = null;
            self.loader();
            self.setlocalStorage(uid);


        },
        getAttach: function (options, func) {
            var self = this, opt = Object.create(options), uid = opt.uid;
            var count = opt.count || 8;
            var offset = PER_REQ = 100;// сколько выбираем за раз и смешение относительно id_massage


            if (opt.scroll) self.getById(self.cursor);// скроллинг
            else {// проверяем был ли диалог с нашего последнего посещения
                dApi.call('messages.getHistory', {
                    'user_id': uid,
                    'count': 1,
                    'offset': 0,
                    'v': '5.60'
                }, function (r) {
                    self.errorProcessing(r);
                    if (self.local.firstid < Math.max(r.response.in_read, r.response.out_read)) {
                        self.getHistoryAttr(Math.max(r.response.in_read, r.response.out_read), self.local.firstid);
                    } else {
                        self.getById(self.cursor);
                    }
                    self.local.firstid = Math.max(r.response.in_read, r.response.out_read);
                });
            }
            // ждем окончания события
            self.onready(function (detail) {
                var strongId = self.local.strongIdMessages, topCursor = self.cursor,
                    fragment = [], count = Math.min(self.local.strongIdMessages.length - 1, self.COUNT_ROW + self.cursor);

                for (; topCursor <= count; topCursor++) {
                    if (!self.itemMessage[strongId[topCursor]]) {
                        console.log('сообщение не найдено в itemMessage по id. ' + strongId[topCursor]);
                        continue;
                    }
                    fragment.push(self.itemMessage[strongId[topCursor]]);
                }
                func(fragment);
            });

        },
        getById: function (sCursor) {
            /*формируем очередь по count штук и отправляем ее на вывод
             strongIdMessages - адреса сообщений с вложениями
             itemMessage полученные сообщения методом getHistoryAttr или методом getById
             sCursor копия курсора self.cursor
             значение курсора изменяется только при окончательном выводе
             */
            var param = [];
            var self = this, strongId = self.local.strongIdMessages;
            var count = Math.min(sCursor + self.COUNT_ROW, strongId.length - 1); // предотвращаем выход за границу массива
            /* если вышли за границу и не eof запускаем поиск по истории*/
            if (count <= sCursor && self.local.lastid != 'eof') {
                self.getHistoryAttr(self.local.lastid);
                return;
            }

            for (; sCursor <= count; sCursor++) {
                var id = strongId[sCursor];
                self.itemMessage[id] || param.push(id + '_' + self._uid);
            }
            if (param.length) {
                dApi.call('messages.getById', {
                    'message_ids': param.join(','),
                    'v': '5.60'
                }, function (r) {
                    self.errorProcessing(r);
                    if (r.response.items.length != param.length) console.log('API не вернул одно из сообщений? сообщение удалено?');
                    self.normalazeMessage(r.response.items);
                });
            } else  self.callEvent('my_ready'); // раз не нужен normalazeMessage вызываем событие.
            return self;
        },
        getHistoryAttr: function (first, last) {
            if (first == 'eof') {
                this.callEvent('my_ready');
                return;
            } // нечего искать
            var self = this;
            var count = 100;
            var correctType = function (att) {
                for (var i = 0; i < att.length; i++) {
                    if (att[i].type == 'wall' || att[i].type == 'link')  return att[i].type;
                }
                return false;
            };
            var containsLink = function (text) {
                return /\w{2,6}?:\/\//ig.test(text);
            };
            var code = {
                'user_id': self._uid,
                'start_message_id': first,
                'count': count,
                'offset': last || self.start ? 0 : 1,
                'v': '5.60'
            };
            dApi.call('messages.getHistory', code, function (r) {
                self.errorProcessing(r);
                var obj = [];
                for (i = 0; i < r.response.items.length; i++) {
                    var value = r.response.items[i];
                    if (last == value.id) break;
                    if (value.fwd_messages && value.fwd_messages.length || value.attachments && correctType(value.attachments) || containsLink(value.body)) {
                        self.local.strongIdMessages[last ? 'unshift' : 'push'](value.id);
                        obj.push(value);
                    }
                }

                if (r.response.items.length < count) self.local.lastid = 'eof';// достигнут конец истории
                else self.local.lastid = r.response.items[r.response.items.length - 1].id;
                if (obj.length) {
                    self.normalazeMessage(obj);
                } else if (last) { // искали в приделах отрезка, (появились новые сообщения в диалоге, но без вложений
                    self.getById(obj.length);
                }
                else {
                    self.getHistoryAttr(self.local.lastid);
                }

            });
            self.start = null;
            return self;
        },
        normalazeMessage: function (obj, func) {
            var self = this;
            var response = {idGroup: [vk.id], senders: []};


            scan(obj);
            getGoupsUsers();

            function fscan(att) {
                if (att.wall || att.link) {
                    fscan(att.wall || att.link);
                    return;
                } else if (att.fwd_messages) scan(att.fwd_messages); //внутри может быть еще
                if (att.to_id) response.idGroup.push(att.to_id);
                else if (att.from_id) response.idGroup.push(att.from_id);
                if (att.user_id) response.idGroup.push(att.user_id);
                if (att.copy_history) scan(att.copy_history);
                if (att.attachments) scan(att.attachments);
            }

            function scan(arr) {
                Array.isArray(arr) ? arr.forEach(fscan) : fscan(arr);
            }// так как @ в execute не работает должным образом прийдется делать несколько запросов


            function getGoupsUsers() {
                var code = [];
                var param = response.idGroup.filter(function (value) {
                    if (value && value < 0) return true;
                }).map(function (value) {
                    return -value;
                }).join(',');
                if (param) code.push(' API.groups.getById({group_ids:"' + param + '"})');
                param = response.idGroup.filter(function (value) {
                    if (value && value > 0) return true;
                }).join(',');
                if (param) code.push(' API.users.get({user_ids:"' + param + '",fields:"domain,name,photo_50"})'); // могут быть репосты от других пользователей
                if (code.length) {
                    dApi.call('execute', {code: 'return ' + code.join('+') + ';', v: '5.60'}, function (b) {
                        self.errorProcessing(b);
                        b.response.forEach(function (value) {
                            /* if (value.type='users'){
                             response.users.push.apply( response.users, value.resp );
                             } else {*/
                            if (!response.senders) response.senders = b.response;
                            else response.senders.push.apply(response.senders, b.response);
                            //  }
                            // });
                        });
                        rearrange();
                    });
                } else {
                    rearrange();
                }
            }


            function rearrange() {

                function append(value) {
                    if (value.attachments) {
                        value.attachments.forEach(function (att) {
                            if (att.type == 'wall') {
                                att.wall.sender = self.geId(response.senders, Math.abs(att.wall.to_id));
                                if (att.wall.attachments || att.wall.copy_history) append(att.wall);
                            }
                        });
                    }

                    if (value.copy_history) value.copy_history.forEach(function (wall) {
                        wall.sender = self.geId(response.senders, Math.abs(wall.from_id));
                        if (wall.attachments || wall.copy_history) append(wall);
                    });

                    if (value.fwd_messages) {
                        value.fwd_messages.forEach(function (att) {
                            att.sender = self.geId(response.senders, Math.abs(att.user_id));
                            append(att);
                        });

                    }
                }

                obj.forEach(function (value) {
                    value.user = self.geId(response.senders, value.out ? vk.id : value.user_id);
                    append(value);
                    self.itemMessage[value.id] = value;
                });

                self.callEvent('my_ready');
            }


        },

        template: function () {
            return vk_lib.get_block_comments(function () {/*menu_button:
             <li>
             <div class="ui_tab my_link_repost" onclick="vkopt['{vals.module_id}'].clickMenu(cur.peer)">
             {lng.LinksAndRepost}
             </div>
             </li>
             */
                /*content_row:
                 <div class="im-mess-stack _im_mess_stack " style="margin-left: -7%;">
                 <div class="im-mess-stack--photo">
                 <div class="nim-peer nim-peer_small fl_l">
                 <div class="nim-peer--photo-w">
                 <div class="nim-peer--photo">
                 <a target="_blank" class="im_grid" href="/{vals.domain}"  onclick="nav.setLoc(this.getAttribute('href'));  nav.reload();"><img alt="{vals.name}" src="{vals.photo_50}"></a>
                 </div>
                 </div>
                 </div>
                 </div>
                 <div class="im-mess-stack--content">
                 <div class="im-mess-stack--info">
                 <div class="im-mess-stack--pname">
                 <a href="/{vals.domain}" class="im-mess-stack--lnk" title="" target="_blank">{vals.name}</a>
                 <span class="im-mess-stack--tools">
                 <a href="/{vals.location}" class="_im_mess_link {vals.no_link}" onclick="nav.setLoc(this.getAttribute('href'));  nav.reload();">{vals.time}</a>    <!--a href="/im?sel=c25&amp;msgid=868870" relocation  -->
                 </span>
                 </div>
                 </div>
                 <span name="content"><span><!-- контент -->
                 </div>
                 </div>
                 */
                /*content_message:
                 <ul class="ui_clean_list im-mess-stack--mess _im_stack_messages">
                 <li class="im-mess im_in" style="padding-right: 8px;"> <!-- im-mess_selected выделяет-->
                 <div class="im-mess--text wall_module _im_log_body">
                 <div class="im_msg_text" name="content_repost"><div style="margin-top: 2px;">{vals.text_content}</div></div>
                 </li>
                 </ul>
                 </div>
                 </div>
                 */
                /*content_repost:
                 <div class="media_desc im-mess--inline-fwd history_im_media_fwd" data-deep="0">
                 <div class="im_fwd_log_wrap history_im_fwd"><div class="im-mess-stack _im_mess_stack im-mess-stack_fwd">
                 </div>
                 </div>
                 */
                /*content_repost_deep:
                 <div class="im-mess-stack _im_mess_stack im-mess-stack_fwd">
                 </div>
                 */
                /*content_link:
                 <div class="_im_msg_media"><div class="im_msg_media im_msg_media_link"><div class="page_media_thumbed_link page_media_thumbed_link_big ">
                 <div class="page_media_link_photo"><a href="{vals.url}" target="_blank" class="page_media_link_img_wrap">
                 <img data-width="537" data-height="240" width="391" height="175" class="page_media_link_img" src="{vals.photo_604}"></a>
                 </div>
                 <div class="page_media_link_desc_wrap ">
                 <div class="page_media_link_desc_block">
                 <div class="page_media_link_title"><a href="{vals.url}" target="_blank">{vals.title}</a>
                 </div>
                 <a href="{vals.url}" target="_blank" class="page_media_link_url page_market_owner_link"><div class="page_media_link_text">{vals.caption}
                 </div></a>
                 </div>
                 </div>
                 */
                /*content_link_no_photo:
                 <div class="im_msg_media im_msg_media_link">
                 <div class="media_desc">
                 <a class="lnk lnk_mail clear_fix" href="{vals.url}" target="_blank">
                 <span class="lnk_mail_title a clear_fix">{vals.title}</span>
                 <span class="lnk_mail_domain clear_fix">{vals.caption}</span>
                 </a>
                 </div>
                 </div>
                 */
                /*photo:
                 <img data-width="537" data-height="240"  class="page_media_link_img media_position" src="{vals.photo_604}"  onclick="showPhoto('{vals.owner_id}_{vals.id}',null,{img:this, queue: 1 }, event)">
                 */
                /*gif:
                 <div class="clear_fix page_gif_large">
                 <a class="photo page_doc_photo_href" href="{vals.url}" onclick="return Page.showGif(this, event)" data-doc="{vals.owner_id}_{vals.id}" data-hash="{vals.url_parse_hash}"  data-add-txt="Скопировать в мои документы" data-share-txt="Поделиться" data-preview="1" data-thumb="{vals.photo_size_src_o}" data-width="{vals.dataWidth}" data-height="{vals.dataHeight}" style="width:{vals.width}px; height:{vals.height}px; display: block;">
                 <div class="page_doc_photo" style="background-image: url({vals.photo_size_src_o});width:{vals.width}px;height:{vals.height}px;background-size:cover;"></div>
                 <div class="page_gif_label">gif</div>
                 <div class="page_gif_play_icon"></div>
                 <div class="page_gif_actions">
                 <div class="page_gif_share" onmouseover="showTooltip(this, {text: 'Поделиться', black: 1, shift: [7, 6, 6], toup: 0, needLeft: 1})" onclick="return 0 ? false : Page.shareGif(this, '{vals.owner_id}_{vals.id}', '{vals.url_parse_hash}', event)">
                 <div class="page_gif_share_icon"></div>
                 </div>
                 </div>
                 </a>
                 </div>
                 */
                /*doc:
                 <div class="media_desc media_desc__doc ">
                 <div class="page_doc_row" id="post_media_lnk{vals.owner_id}_{vals.id}">
                 <a class="page_doc_icon page_doc_icon1" href="{vals.url}" target="_blank"></a>
                 <a class="page_doc_title" href="{vals.url}" target="_blank">{vals.title}</a>
                 <div class="page_doc_size">{vals.size} КБ</div>
                 </div>
                 </div>
                 */
                /*audio:
                 <div class="wall_audio_rows _wall_audio_rows">
                 <div class="audio_row _audio_row _audio_row_{vals.owner_id}_{vals.id} inlined canadd lpb clear_fix" onclick="return getAudioPlayer().toggleAudio(this, event)" data-audio="[&quot;{vals.id}&quot;,&quot;{vals.owner_id}&quot;,&quot;&quot;,&quot;{vals.title}&quot;,&quot;{vals.artist}&quot;,145,0,0,&quot;&quot;,0,16393,&quot;post-114356242_181&quot;,&quot;[]&quot;,&quot;abd77f44bf2391e1f4\/\/b8d78debc3b4fafcf6&quot;]" data-full-id="{vals.owner_id}_{vals.id}" id="audio_{vals.owner_id}_{vals.id}">
                 <div class="audio_play_wrap" data-nodrag="1"><button class="audio_play _audio_play" id="play_{vals.owner_id}_{vals.id}" aria-label="Воспроизвести "></button></div>
                 <div class="audio_info">
                 <div class="audio_duration_wrap _audio_duration_wrap">
                 <div class="audio_hq_label"></div>
                 <div class="audio_duration _audio_duration">{vals.duration}</div>
                 </div>
                 <div class="audio_title_wrap"><a href="/search?c[section]=audio&amp;c[q]={vals.artist_encode}&amp;c[performer]=1" onmouseover="setTitle(this)" nodrag="1" onclick="return audioSearchPerformer(this, event)" class="audio_performer">{vals.artist}</a><span class="audio_info_divider">–</span><span class="audio_title _audio_title" onmouseover="setTitle(this, domPN(this))"><span class="audio_title_inner" tabindex="0" nodrag="1" aria-label="{vals.title}" onclick="return toggleAudioLyrics(event, this, '{vals.owner_id}_{vals.id}', '0')">{vals.title}</span>
                 <span class="audio_author" onclick="cur.cancelClick=true"></span>
                 </span></div>
                 </div>
                 <div class="_audio_player_wrap"></div>
                 <div class="_audio_lyrics_wrap audio_lyrics" data-nodrag="1"></div>
                 </div>
                 </div>
                 */
                /*video:
                 <div class="page_post_sized_thumbs  clear_fix" style="width:320px; height:240px;">
                 <a href="/video{vals.owner_id}_{vals.id}?list={vals.access_key}" data-video="{vals.owner_id}_{vals.id}" data-list="{vals.access_key}" data-duration="{vals.duration}" aria-label="{vals.title}&amp;#33;" onclick="return showInlineVideo('{vals.owner_id}_{vals.id}', '{vals.access_key}', {autoplay: 1, addParams: { post_id: '{vals.owner_id}_{vals.id}' }}, event, this);" style="width:320px; height:240px; background-image: url({vals.photo_320})" class="page_post_thumb_wrap image_cover  page_post_thumb_video page_post_thumb_last_column page_post_thumb_last_row">
                 <div class="page_post_video_play_inline"></div>
                 <div class="page_wm"></div>
                 <div class="page_post_video_duration_single">{vals.duration}</div>
                 </a>
                 </div>
                 <div class="a post_video_title" onclick="return showVideo('{vals.owner_id}_{vals.id}', '{vals.access_key}', {autoplay: 1, queue: 1, addParams: { post_id: '{vals.owner_id}_{vals.id}' }}, event);" style="width: 320px;">{vals.title}</div>
                 */
                /*poll:
                 <div class="page_media_poll_wrap">
                 <div class="page_media_poll_title_wrap clear_fix">
                 <div class="page_media_poll_desc">{vals.state}</div>
                 <div class="page_media_poll_title">{vals.question}</div>
                 </div>
                 <div class="page_media_poll" id="post_poll{vals.postId}"><div class="page_poll_stats" onclick="Wall.pollFull(false, '{vals.postId}', event);">
                 <input type="hidden" id="post_poll_raw{vals.postId}" value="{vals.owner_id}_{vals.id}" class="user_revote"><input type="hidden" id="post_poll_open{vals.postId}" value="1"><div class="page_poll_bottom">
                 <div class="page_poll_total">
                 <span class="divider fl_r"></span>
                 <div class="page_poll_total_count">Неравнодушны <b>{vals.votes}</b> граждан.</div>
                 </div>
                 </div></div>
                 </div>
                 */
                /*poll_answers:
                 <div class="page_poll_stat" onmouseover="Wall.pollOver(this, '{vals.postId}', {vals.id})">
                 <div class="page_poll_text">{vals.text}</div>
                 <div class="page_poll_row_wrap">
                 <div class="page_poll_row_percent">{vals.rate}%</div>
                 <div class="page_poll_row page_poll_voted">
                 <div class="page_poll_percent" style="width: 49%"></div>
                 <div class="page_poll_row_count">{vals.votes}</div>
                 </div>
                 </div>
                 </div>
                 */
            })
        }
    };

    attachmentsAndLink.onInit();
    addGlobalStyle(attachmentsAndLink.css(), 'vk_css');
    ajax.post = new Proxy(ajax.post, {
        apply: function (target, thisArg, argumentsList) {
            let url = argumentsList[0];
            if (!(attachmentsAndLink.onRequestQuery(url, argumentsList[1], argumentsList[2]) === false)) {
                argumentsList[0] = url; //строка могла изменится
                return target.apply(thisArg, argumentsList);
            }
        }
    });

})(window);
