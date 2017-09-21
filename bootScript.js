bootInspector([{
    test: 'AmCharts',
    boot: ['/script/amchart/amcharts.js', '/script/amchart/pie.js']
},
    {
        test: 'dApi',
        boot: ["/script/vkApi.js"]
    }
]);


function bootInspector(insect) {
    let boots = [];
    // We only accept messages from ourselves
    insect.forEach((value) => {
        if (!window[value.test]) Array.prototype.push.apply(boots, value.boot);
    });
    window.postMessage({type: "inject_vk_lib", text: JSON.stringify(boots)}, "*");
}