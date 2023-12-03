// ==UserScript==
// @name         OKX brc20市值
// @namespace    https://www.okx.com/
// @version      1.1
// @description  监控 OKX 请求并执行功能
// @author       twitter : https://twitter.com/yinghe_web3
// @match        https://www.okx.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let pairsArray = [];
    window.addEventListener('scroll', function() {

        if(pairsArray.length>0){
            const jiancediv = document.querySelector('.index_mint-progress__sz');
            if(!jiancediv){
                const referenceElement = document.querySelector('.index_mint-progress__bbswj');
                if (referenceElement) {
                    // 创建要插入的新 div 元素
                    const newDivToInsert = '<div class="flex index_mint-progress__sz" style="width: 200px;margin-left:40px;"><span class="index_trname__M4N7r index_arrow__Hj1DC">市值</span></div>';
                    referenceElement.insertAdjacentHTML('afterend', newDivToInsert);
                } else {
                    console.error('未找到参考元素');
                }
            }
            // 当滚动发生时触发的操作
            const tableContentLinks = document.querySelectorAll('.index_tab-awrap__MSvMF');//('div.table-content a');

            // 遍历所有匹配的 a 元素
            tableContentLinks.forEach(document => {
                // 在这里对每个链接执行操作
                const name = document.href.split('/').pop();
                const jiancediv = document.querySelector('.index_mint-progress__sz');
                if(!jiancediv){

                    let lists = document.querySelectorAll('.index_mint-progress__bbswj');
                    lists.forEach(element => {
                        const shizhi = sz(decodeURIComponent(name),pairsArray)
                        const newDivToInsert = '<div class="flex index_mint-progress__sz" style="width: 200px;margin-left:10px;"><span class="index_trname__M4N7r index_arrow__Hj1DC">'+shizhi+'</span></div>';
                        element.insertAdjacentHTML('afterend', newDivToInsert);
                    });
                }

                // 可以执行其他操作，比如修改链接属性、样式等
            });
        }



});
   var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (method === 'GET' && url.includes('priapi/v1/nft/brc/tokens?t=')) {
            this.addEventListener('load', function() {
                if (this.status === 200) {
                    var responseJSON = JSON.parse(this.responseText);
                   console.log(responseJSON)

                    // 假设 JSON 数组名为 jsonData
                    for (let i = 0; i < responseJSON['data']['list'].length; i++) {
                        // 使用 jsonData[i] 访问数组中的每个元素
                        let number = responseJSON.data.list[i].totalMinted*responseJSON.data.list[i].usdPrice;
                        let formattedNumber = number.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,');

                        pairsArray.push({ name:responseJSON.data.list[i].ticker, value: formattedNumber });
                    }
                    console.log(pairsArray)
                }
            });
        }


        originalOpen.apply(this, arguments);
    };
    // Your code here...
    function sz(nameToFind,array){
        // 使用 find() 方法查找匹配的对象
        let foundObject = array.find(item => item.name === nameToFind);
        // 如果找到匹配的对象，返回对应的 value 值；否则返回 null 或适当的默认值
        return foundObject ? foundObject.value : null;

    }

})();