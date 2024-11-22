const fetch_form = [
    "PDS_q1", "PDS_q2", "PDS_q3", "PDS_q4", "PDS_q5", "PDS_q6", "PDS_q7",
    "PDS_q8", "PDS_q9", "PDS_q10", "PDS_q11", "PDS_q12", "PDS_q13", "PDS_q14", "PDS_q15",
    "PDS_q16", "PDS_q17", "PDS_q18", "PDS_q19", "PDS_q20", "PDS_q21", "PDS_q22", "PDS_q23",
    "PDS_q24",
    "DASS_q1", "DASS_q2", "DASS_q3", "DASS_q4", "DASS_q5", "DASS_q6",
    "DASS_q7", "DASS_q8", "DASS_q9", "DASS_q10", "DASS_q11", "DASS_q12", "DASS_q13",
    "DASS_q14", "DASS_q15", "DASS_q16", "DASS_q17", "DASS_q18", "DASS_q19", "DASS_q20",
    "DASS_q21",
    "PMBS_q1", "PMBS_q2", "PMBS_q3", "PMBS_q4", "PMBS_q5", "PMBS_q6", "PMBS_q7", "PMBS_q8",
    "PMBS_q9", "PMBS_q10", "PMBS_q11", "PMBS_q12", "PMBS_q13", "PMBS_q14", "PMBS_q15"
    ]

function chk_force_fill(chk_fill_list) {
  let formValid = true; // 表單是否有效
  chk_fill_list.forEach(name => {
    const element = document.querySelector(`[name="${name}"]`); // 查找表單元素

    if (element) {
      if (element.type === "checkbox" || element.type === "radio") {
        // 查找父容器的結構
        const parentOptionList = element.closest('tr') || element.closest('.option-list'); 
        const radioChecked = document.querySelector(`[name="${name}"]:checked`); // 檢查是否有選中
        if (!radioChecked) {
          formValid = false;
          if (parentOptionList) {
            parentOptionList.style.border = "2px solid red"; // 在父容器添加紅框
          }
        } 
        else if (parentOptionList) {
          // 清除可能之前的錯誤提示
          parentOptionList.style.border = "none";
        }
      }
    }
  });
  return formValid;
}
    


// 按下提交鍵
document.getElementById('surveyForm').addEventListener('submit', function(e) {
   e.preventDefault(); // 防止表單提交
   let formValid = true; // 追蹤counter 如果下面有問題就會變成false

   // 清除先前的紅框
   const optionLists = document.querySelectorAll('tr');
   optionLists.forEach(optionList => {
       optionList.style.border = ""; // 清除紅框
   });

   if (!chk_force_fill(fetch_form)){// 無論如何都要檢查section1
       formValid = false;
   } 

   if (formValid){ // 如果上面檢查都沒問題那就送出表單了
       form_submit(e)
   }
   else{
       alert('請填寫所有必填欄位');
   }
});


// form送出邏輯
function form_submit(e){
   const formData = new FormData(e.target);
   const results = {};

   // 自動補齊缺失的鍵並將值設為 "null"，或是說創建好一個初始值都弄好的json到results裡面
   fetch_form.forEach(key => {
       if (!(key in results)) {
           results[key] = "null";
       }
   });

   // 手動處理所有欄位
   fetch_form.forEach(name => {
       const checkboxes = document.querySelectorAll(`[name="${name}"]`);
       if (checkboxes.length > 0 && checkboxes[0].type === "checkbox") {
           // 多選框：收集所有選中的值為一個陣列
           results[name] = Array.from(checkboxes)
               .filter(checkbox => checkbox.checked)
               .map(checkbox => checkbox.value);
       } 
       else {
           // 其他類型（如 text, textarea, radio）：直接取值
           const value = formData.get(name);
           if (value !== "") {
               results[name] = value;
           }
       }
   });
   results.token = token
   results.timestamp = tag_time()

   console.log('Survey Results:', results);
   alert('問卷正在上傳中，請勿離開或關閉頁面');
   upload_to_gs(results) // call api
}


// ====================================================================================
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

//============================================================================================================
var excel_upload_url = 
"https://script.google.com/macros/s/AKfycbzfgUKrIj5dfeCk1c4aVMZ1wvPucYKuVYdi9-LUxmmFDWfe0PTWEEWoq_EeKp0tWM2wzA/exec"

// 產生時間戳章
function tag_time(){
 var currentTime = new Date();
 var formattedTime = currentTime.getFullYear() + '/' + 
                     (currentTime.getMonth() + 1) + '/' + 
                     currentTime.getDate() + ' ' + 
                     currentTime.getHours() + ':' + 
                     (currentTime.getMinutes().toString().padStart(2, '0'));
 return formattedTime
}

function upload_to_gs(upload_data){
  // 將資料發送到 Google Sheets
  fetch(excel_upload_url, {
    redirect: "follow",
    method: 'POST',
    body: JSON.stringify(upload_data), // 將資料轉換成 JSON 格式
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    }
  })
    .then(response => response.text())
    .then(data => {
      if (data === "Success") {
        console.log("上傳成功"); // 改為輸出中文訊息
        alert("上傳成功，網頁將進行跳轉"); // 改為輸出中文訊息
        window.location.href = `../guide/guide.html?token=${token}`;
      } 
      else {
        console.log("伺服器回應:", data);
      }
    })
    .catch(error => console.error('Error:', error));
}



