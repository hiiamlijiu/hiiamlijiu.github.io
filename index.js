const dialogBox = document.getElementById('dialog-box');
const header = document.getElementById('header');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const dots = document.querySelectorAll('.navigation .dot');
const dotsarray = document.getElementById('dots');
const options = document.getElementById('options');
var upload_data = [];
const min_index = 1;
const max_index = 5;
let currentStep = 1;
const token = generate_token();
const radioButtons = document.querySelectorAll('input[name="participation"]');

// 為每個單選按鈕添加change事件監聽器
radioButtons.forEach(radio => {
    radio.addEventListener('change', (event) => {
      if (event.target.checked) {
          const selectedValue = event.target.value;
          console.log('選擇值:', selectedValue);
          // 根據不同的選項執行不同的操作
          switch(selectedValue) {
            case 'no': // 執行選擇"否"時的操作
            upload_data.push("否");
              break;
                
            case 'partial': // 執行選擇"是，但未完成完整研究"時的操作
              upload_data.push("是，但未完成完整研究");
              break;
                
            case 'yes': // 執行選擇"是"時的操作
            upload_data.push("是");
              break;
          }
          leftBtn.disabled = false;
          leftBtn.classList.remove('fade-out');
      }
    });
});

function no5do(){
  rightBtn.addEventListener('click', () => {

    dialogBox.innerHTML = `
    <h2>謝謝您的參與，很抱歉您並未符合實驗資格</h2>
    `;
    console.log("user quit study")
    leftBtn.classList.add('fade-out');
    rightBtn.classList.add('fade-out');

  });

}

leftBtn.addEventListener('click', () => {
    leftBtn.disabled = true;
    currentStep++;
    dialogBox.classList.add('fade-out');
    setTimeout(() => {
        if (currentStep === 2) {
            dialogBox.innerHTML = `
            <h2>本研究旨在了解人們在不同情境下的決策行為與情緒反應，並探討個人經歷（包括創傷經歷）對其中的影響。</h2>
            <p>稍等我們將一起閱讀知情同意書，若您同意參與研究，您會先填寫一些問卷，之後進入作業階段，並在結束時收到相關的研究回饋。</p>
            `;
        } 
        else if (currentStep === 3) {
            dialogBox.innerHTML = `
            <h2>研究全程約需 30–40 分鐘。</h2>
            <p>請預留充足的時間，並在網路連線穩定的情況下進行。此研究需要一次性完成，且若在過程中畫面超過10分鐘無回應，系統將視為中止，並跳轉至提醒視窗。當然，您在過程中也可以隨時選擇中止研究，我們會尊重您的決定。</p>
            `;
        } 
        else if (currentStep === 4) {
            dialogBox.innerHTML = `
            <h2>當您準備好時，請點擊「開始」按鈕，研究將正式開始。</h2>
            <p>再次感謝您的參與,期待與您共同邁向更多發現!</p>
            `;
            leftBtn.textContent = "開始";
        } 
        else if (currentStep === 5) {
          dialogBox.innerHTML = `
          <h2>您是否參與過本研究？</h2>
          `;
          leftBtn.classList.add('fade-out');
          header.classList.remove('fade-out');
          options.classList.remove('fade-out');
          leftBtn.textContent = "確定";
        }

        else if (currentStep === 6) {
          options.classList.add('fade-out');
          dialogBox.innerHTML = `
          <h2>您是否年滿十八歲？</h2>
          <p>（本研究對象為十八歲以上成人，未滿十八歲者將未能參與，感謝您的興趣參與與體諒！）</p>
          `;
          header.classList.add('fade-out');
          rightBtn.classList.remove('hide');
          rightBtn.classList.remove('fade-out');
          leftBtn.classList.remove('fade-out');
          leftBtn.textContent = "是，我實際年齡已滿十八歲。繼續進行";
          rightBtn.textContent = "否，我實際年齡未滿十八歲。退出研究";
          no5do();
          upload_to_gs(upload_data);
        }

        else if (currentStep === 7){
          dialogBox.innerHTML = `
          <h2>接下來，請閱讀知情同意書</h2>
          <h3>研究團隊並建議您下載此文件以便詳閱內容。若您同意參與研究，請勾選『同意』以進入研究。</h3>
          `;
          rightBtn.classList.add('hide');
          leftBtn.textContent = "下一步";
          leftBtn.classList.remove('fade-out');

        }
        else if (currentStep === 8){
          window.location.href = `pdf_agree/pdf_agree.html?token=${token}`;
        }
        else {
          // 不應該出現
          // 做一個error 404
        }

        dialogBox.classList.remove('fade-out');
        
    },500)
    
    if ((currentStep >= (min_index+1)) && (currentStep <= max_index-1 )) { // 在1~4頁的時候
      dots[currentStep - 1].classList.add('active');
      dots[currentStep - 2].classList.remove('active');
    }
    else {
      dots.forEach(function(dot) {
        dotsarray.classList.add('fade-out');
      });
    }
    setTimeout(() => {
      leftBtn.disabled = false;
    },500)
});

/**
 * token產生器
 * require: MD5 function
 * @returns token:str
 */
function generate_token() {
  var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
  function generate_temp_token() {
    const length = 126
    const charset = "CDEFGHJKLMPQSTUVWXZacdefghjkmnprstuvwxyz123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return token
  }

  let token = 't' + generate_temp_token() + 'n'
  let part1 = token.substring(0, 64);
  let part2 = token.substring(64);
  // Step 3
  let md5_part1 = MD5(part1);
  let md5_part2 = MD5(part2);
  // Step 4
  let final_md5 = MD5(md5_part1 + md5_part2);
  let final_token = part1 + final_md5 + part2

  console.log(final_token)
  return final_token
}

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
    return;
  }
  // 2.字元集
  if (!validChars.test(first64) || !validChars.test(last64)) {
    console.error("token非法的字元集")
    return;
  }

  // 3. 檢查首尾字元
  if (token_input[0] !== 't' || token_input[token_input.length - 1] !== 'n') {
    console.error("token頭尾非t或n")
    return;
  }

  // 4. 檢查 MD5 驗證
  const middle32 = token_input.slice(64, 96);  // 中間32字
  const md5First64 = MD5(first64);   // 對前64字進行MD5
  const md5Last64 = MD5(last64);     // 對後64字進行MD5
  const finalHash = MD5(md5First64 + md5Last64);  // 兩個MD5結果拼接後再MD5

  if (middle32 !== finalHash) {
    console.error("MD5不合法")
    return;
  }

  console.log("合法")
}



var excel_upload_url = "https://script.google.com/macros/s/AKfycbxUWMbFmIYcRZEhnt0By9FXuC4FPmuzR9_VLFQVAvhzOy6oL8zGIM9PIp56N1KulzCA4g/exec"

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
  upload_data.unshift(token)
  upload_data.unshift(tag_time())
  // 將資料發送到 Google Sheets
  fetch(excel_upload_url, {
    redirect: "follow",
    method: 'POST',
    body: JSON.stringify(upload_data), // 將資料轉換成 JSON 格式
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  })
    .then(response => response.text())
    .then(data => {
      if (data === "Success") {
        console.log("上傳成功"); // 改為輸出中文訊息
      } else {
        console.log("伺服器回應:", data);
      }
    })
    .catch(error => console.error('Error:', error));
}
