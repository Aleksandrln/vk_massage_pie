/**
 * Created by Aleksandr on 16.01.2017.
 */
(function (w) {
    if (w.dApi) {// уже существует

        return;
    }
    w.ObjExport = w.ObjExport || {};

    var dApi = {
        ACCESS_TOKEN: null,
        call: function (metod, param, onDoneRequest) {
            var rand = Math.round(Math.random() * 10000);
            strparam = '';
            param.access_token = dApi.ACCESS_TOKEN || (dApi.ACCESS_TOKEN = localStorage['vkaccess_token']);
            Object.keys(param).forEach(function (key) {
                strparam += key + '=' + encodeURIComponent(param[key]) + '&';
            });
            var script = document.createElement('SCRIPT');
            script.src = "https://api.vk.com/method/" + metod + "?" + strparam + "callback=ObjExport.dApi.callback" + rand;
            dApi['callback' + rand] = function (result) {
                setTimeout(del, 0)
                onDoneRequest(result);
            };
            document.getElementsByTagName("head")[0].appendChild(script);
            function del() {
                delete dApi['callback' + rand];
                script.remove();
            }
        },

    };


// шаблоны
    let vk_lib = w.vk_lib || {};
    vk_lib.get_block_comments = function (func) { // извлекаем из кода функции содержимое блоковых комментариев
        var FRegEx = /function[^\(]*\(\s*([^\)]*?)\s*\)[^\{]*\{([\s\S]+)\}/i;
        var fn = isFunction(func) ? func : eval('window.' + func);
        if (!fn)
            vkopt.log('Inj_Error: "' + func + '" not found', 1);
        var res = fn ? String(fn).match(FRegEx) : ['', '', ''];
        //res[2] = res[2].replace(/\r?\n/g, " ");
        var code = res[2];
        var obj_rx = /\*([a-z0-9_]+):\s*([\s\S]+?)\s*\*\//ig; // при нахождении /*comment_name: содержимое */ всё будет распарсенно в объект {comment_name: содержимое}
        var arr_rx = /\*(\s*)([\s\S]+?)\s*\*\//g;             // иначе всё будет в виде массива
        var is_obj = obj_rx.test(code);
        var comments = is_obj ? {} : [];
        code.replace(is_obj ? obj_rx : arr_rx, function (s, name, comment) { // просто взял replace вместо while..regexp.exec
            if (is_obj)
                comments[name] = comment;
            else
                comments.push(comment);
            return s;
        });
        return comments;
    };

    vk_lib.tpl_process = function (tpl, values) {
        return (tpl || '').replace(/\{([a-z]+)\.([a-z0-9_-]+)\}/ig, function (s, type, id) {
            switch (type.toLowerCase()) {
                case 'vals':
                    return (values && typeof values[id] != 'undefined') ? values[id] : s;
                case 'lng':
                    return lngs[id];
                default:
                    return s;
            }

        })
    };


    let lngs = {'LinksAndRepost': 'Ссылки и репосты'};
    w.ObjExport.dApi = dApi;
    w.ObjExport.vk_lib = vk_lib;

})(window);