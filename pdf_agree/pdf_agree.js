// 配置 PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
const canvas = document.getElementById('pdf-viewer');
const ctx = canvas.getContext('2d');
const PDF_URL = '知情與研究參與同意書.pdf'; // 預設 PDF 檔案路徑

// 載入 PDF
pdfjsLib.getDocument(PDF_URL).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page-num').textContent = 
        `第 ${pageNum} 頁，共 ${pdfDoc.numPages} 頁`;
    // 初始渲染第一頁
    renderPage(pageNum);
}).catch(function(error) {
    console.error('Error loading PDF:', error);
    alert('PDF 載入失敗，請確認檔案路徑是否正確，或是不要在本地端開啟此份文件');
});

// index.html傳來的token
const params = new URLSearchParams(window.location.search);
const token = params.get("token") || "0";
if (!verifyToken(token)) { // 驗證token錯誤
    alert("警告，token錯誤，這將導致實驗收集異常，請不要進行實驗，盡快聯絡實驗者")
    console.error("警告，token錯誤，這將導致實驗收集異常，請不要進行實驗，盡快聯絡實驗者")
} // 都沒事就什麼訊息都不用


/**
 * token驗證器
 * require: MD5 function
 */
function verifyToken(token_input) {
    var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
    const charset = "CDEFGHJKLMPQSTUVWXZacdefghjkmnprstuvwxyz123456789";
    const validChars = new RegExp(`^[${charset}]+$`);
  
    const first64 = token_input.slice(0,64);  // 前64字
    const last64 = token_input.slice(-64);    // 後64字
    
    // 1.長度
    if (token_input.length !== 160) {
      console.error("token非法的長度")
      return false;
    }
    // 2.字元集
    if (!validChars.test(first64) || !validChars.test(last64)) {
      console.error("token非法的字元集")
      return false;
    }
  
    // 3. 檢查首尾字元
    if (token_input[0] !== 't' || token_input[token_input.length - 1] !== 'n') {
      console.error("token頭尾非t或n")
      return false;
    }
  
    // 4. 檢查 MD5 驗證
    const middle32 = token_input.slice(64, 96);  // 中間32字
    const md5First64 = MD5(first64);   // 對前64字進行MD5
    const md5Last64 = MD5(last64);     // 對後64字進行MD5
    const finalHash = MD5(md5First64 + md5Last64);  // 兩個MD5結果拼接後再MD5
  
    if (middle32 !== finalHash) {
      console.error("MD5不合法")
      return false;
    }
  
    console.log("合法")
    return true;
}

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        // 計算適合的縮放比例
        const viewport = page.getViewport({scale: 1.0});
        const containerWidth = document.getElementById('pdf-container').clientWidth - 40; // 減去padding
        scale = containerWidth / viewport.width;
        
        // 使用新的縮放比例創建viewport
        const scaledViewport = page.getViewport({scale: scale});
        
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    document.getElementById('page-num').textContent = 
        `第 ${num} 頁，共 ${pdfDoc.numPages} 頁`;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

// 下載 PDF 功能
document.getElementById('download-btn').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = PDF_URL;
    link.download = PDF_URL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

document.getElementById('prev').addEventListener('click', onPrevPage);
document.getElementById('next').addEventListener('click', onNextPage);

// 監聽視窗大小變化
window.addEventListener('resize', function() {
    if (pdfDoc) {
        renderPage(pageNum);
    }
});

function updateSubmitButton() {
    const checkbox = document.getElementById('consent-checkbox');
    const submitButton = document.getElementById('submit-button');
    const errorMessage = document.getElementById('error-message');
    
    submitButton.disabled = !checkbox.checked;
    errorMessage.style.display = checkbox.checked ? 'none' : 'block';
}

function submitForm() {
    const checkbox = document.getElementById('consent-checkbox');
    if (checkbox.checked) {
        alert('表單已成功送出！');
        window.location.href = `../question/baseLEC5.html?token=${token}`;
    } else {
        alert('請先勾選同意項目');
    }
}




