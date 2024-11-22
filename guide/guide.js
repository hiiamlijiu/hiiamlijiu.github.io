const dialog_box = document.getElementById('dialog-box');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const btnContainer = document.getElementById('button-container');
const quizContainer =  document.getElementById('quizFrame');

var option_choose = 0;
const min_index = 1;
const max_index = 5;
let currentStep = 1;

const radioButtons = document.querySelectorAll('input[name="participation"]');

function hide_buttons(){
  /*
  保留元素長寬高 按鈕不作用
  const btnContainer = document.getElementById('button-container');
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  */
  btnContainer.classList.add('fade-out');
  leftBtn.disabled = true;
  rightBtn.disabled = true;
}

function show_buttons(){
  /*
  const btnContainer = document.getElementById('button-container');
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  */
  btnContainer.classList.remove('fade-out');
  leftBtn.disabled = false;
  rightBtn.disabled = false;
}

function hide_dialog(){
  dialog_box.classList.add('fade-out');
}

function show_dialog(){
  dialog_box.classList.remove('fade-out');
}

function doloop(){
  console.log(currentStep)
  hide_buttons();
  hide_dialog();
  if (currentStep === 2) {
    setTimeout(() => {
      dialog_box.innerHTML = `
      <h2>作業階段不會使用到鍵盤，請使用觸控板或滑鼠點擊任意地方繼續請使用電腦施測，不要使用手機</h2>

      
      <div class="animation_container">
      <!-- 滑鼠動畫 -->
      <div class="mouse-area">
        <div class="mouse">
          <div class="scroll-wheel"></div>
        </div>
        <div class="finger mouse-finger"></div>
      </div>
    
      <!-- 觸控板動畫 -->
      <div class="trackpad-area">
        <div class="laptop">
          <div class="trackpad"></div>
        </div>
        <div class="finger trackpad-finger"></div>
      </div>
    </div>`;
      show_buttons();
      show_dialog();
    },500)
  } 
  else if (currentStep === 3) { // 答題頁面
    dialog_box.classList.add('fade-out');// hide dialog
    setTimeout(() => {
      dialog_box.innerHTML = `` // hide dialog
      quizContainer.classList.remove('fade-out'); // show quiz
    },500)
  }
  else if (currentStep === 4) {
    dialog_box.innerHTML = `<h1>投資遊戲</h1>`
    dialog_box.classList.remove('fade-out');
    quizContainer.classList.add('fade-out');
    show_buttons();

    setTimeout(() => {
      quizContainer.classList.add('hide');
    },500)
  }
  else if (currentStep === 5) {
    setTimeout(() => {
      dialog_box.innerHTML = `<h2>接下來，您將與電腦上的遊戲夥伴進行一項投資
      遊戲您的任務是決定要投資夥伴0~1000元間的任意金額</h2>
    
      <h2>（遊戲規則後續會再次說明與可以選擇重新觀看，請您放心繼續進行）</h2>`
      show_buttons();
      show_dialog();
    },500)
  }
  else if (currentStep === 6) {
    setTimeout(() => {
      dialog_box.innerHTML = `<h2>遊戲開始時，您將於螢幕上看見遊戲夥伴的頭像。
      每一輪投資前，您和您的夥伴每人將會各獲得1000元的投資基金，您可以選擇投資任何金額給遊戲夥伴。</h2>`
      show_buttons();
      show_dialog();
    },500)
  }
  else if (currentStep === 7) {
    setTimeout(() => {
      dialog_box.innerHTML = `<h2>一旦投資，金額將會增加三倍（例如：投資5元將變成遊戲夥伴收到15元）。</h2>`
      show_buttons();
      show_dialog();
    },500)
  }
  else if (currentStep === 8) {
    setTimeout(() => {
      dialog_box.innerHTML = `<h2>隨後，遊戲夥伴可以將任何金額回饋給您。如此ㄧ來，您和您的遊戲夥伴將有機會合力獲得投資基金額外的獲利。每次投資您會立即看見遊戲夥伴的回饋金額，您可以決定用它來調整下一輪的投資。</h2>`
      show_buttons();
      show_dialog();
    },500)
  }
  else if (currentStep === 9) {
    setTimeout(() => {
      dialog_box.innerHTML = `<h2>投資開始前，請您先輸入三個欲投資金額：（此輪金額不影響後續投資，請您不要停留過久考慮！）</h2>
        <div class="investment-container">
          <div class="investment-item">
            <label for="investment1">投資一金額:</label>
            <input type="range" id="investment1" min="0" max="1000" value="100">
            <span id="investment1-value">100</span>元
          </div>

          <div class="investment-item">
            <label for="investment2">投資二金額:</label>
            <input type="range" id="investment2" min="0" max="1000" value="100">
            <span id="investment2-value">100</span>元
          </div>

          <div class="investment-item">
            <label for="investment3">投資三金額:</label>
            <input type="range" id="investment3" min="0" max="1000" value="100">
            <span id="investment3-value">100</span>元
          </div>
        </div>`

        show_buttons();
        show_dialog();
        const investment1 = document.getElementById('investment1');
        const investment2 = document.getElementById('investment2');
        const investment3 = document.getElementById('investment3');
    
        const investment1Value = document.getElementById('investment1-value');
        const investment2Value = document.getElementById('investment2-value');
        const investment3Value = document.getElementById('investment3-value');
    
        const confirmButton = document.getElementById('confirm-button');
    
        investment1.addEventListener('input', () => {
          investment1Value.textContent = investment1.value;
        });
    
        investment2.addEventListener('input', () => {
          investment2Value.textContent = investment2.value;
        });
    
        investment3.addEventListener('input', () => {
          investment3Value.textContent = investment3.value;
        });
    
      },500)
  }
  else if (currentStep === 10) {
    quizContainer.disabled = true;
    // yield results
    const investment1Amount = parseInt(investment1.value);
    const investment2Amount = parseInt(investment2.value);
    const investment3Amount = parseInt(investment3.value);

    console.log('投資一', investment1Amount);
    console.log('投資二', investment2Amount);
    console.log('投資三', investment3Amount);
    // yield results end

    setTimeout(() => {
      dialog_box.innerHTML = `
      <h2>基本遊戲規則說明<br>*這裡以10元投資基金示例</h2>
      <div class="images-container">
        <div class="image-item">
          <img src="1.png" alt="Image 1">
          <div class="image-caption">每一輪投資前，您和您的夥伴每人將會各獲得 1000 元的投資基金。</div>
        </div>
        <div class="image-item">
          <img src="2.png" alt="Image 2">
          <div class="image-caption">一旦投資，金額將會增加三倍（例如：投資 10 元將變成遊戲夥伴收到 30 元）</div>
        </div>
        <div class="image-item">
          <img src="3.png" alt="Image 3">
          <div class="image-caption">隨後，遊戲夥伴可以將任何金額回饋給您。</div>
        </div>
      </div>
      <div class="notice-box">如此一來，您和您的遊戲夥伴將有機會合力獲得投資基金額外的獲利。每次投資您會立即看見遊戲夥伴的回饋金額，您可以決定用它來調整下一輪的投資。</div>
      `
      show_buttons();
      show_dialog();
    },500)
  }

  else if (currentStep === 11) {
    setTimeout(() => {
      dialog_box.innerHTML = `
      <h2>讓我們再說明一次基本遊戲規則</h2>
      <video controls><source src="1.mp4" type="video/mp4">您的網頁不支援影片撥放</video>
      `
      show_buttons();
      show_dialog();
    },500)
  }

  else if (currentStep === 12) {
    setTimeout(() => {
      dialog_box.innerHTML = `
      <h2>是否已了解基本遊戲規則呢?</h2>
      <button class="understand-button" onclick="currentStep=13;doloop()">我已了解</button>
      <br>
      <button class="again-button" onclick="currentStep=5;doloop()">再說一次</button>
      `
      // show_buttons();
      show_dialog();
    },500)
  }

  else if (currentStep === 13) {
    setTimeout(() => {
      dialog_box.innerHTML = `
      <h2>按下下一步將跳轉到實驗頁面。</h2>
      <h3>接下來您將與電腦上的遊戲夥伴進行一項投資遊戲。遊戲開始時，您將於螢幕上看見遊戲夥伴的頭像。</h3>
      <div class="notice-box"><h3>
      每一輪投資前，您和您的夥伴每人將會各獲得 1000 元的投資基金。您的任務是決定要投資夥伴0~1000元間的任意金額。</h3></div>
      `
      show_buttons();
      show_dialog();
    },500)
  }

  else if (currentStep === 14) {
    window.location.href = `../experiment/experiment.html?token=${token}`;
  }

  else {
    // 不應該會出現這種狀況
    console.log("錯誤");
    window.location.href = `../error/error.html`
  }
}


leftBtn.addEventListener('click', () => {
    leftBtn.disabled = true;
    currentStep++;
    doloop();
});


window.addEventListener('message', function(event) {
  if (event.data.type === 'quizCompleted') {
      if (event.data.success) {
          console.log('答題完成且通過！');
          // 這裡可以加入測驗通過後的處理邏輯
          // 例如：顯示下一個環節、儲存結果等
          setTimeout(() => {
            currentStep++;
            doloop();
          },1000)

      } else {
          console.log('答題完成但未通過！');
          alert("感謝您的耐心與參與！我們非常重視您的投入，但根據目前的設置，您已達到測驗次數上限，您可以重複參加測驗。這並不影響您未來參與研究的資格，並且您在本次填答的努力已幫助我們改進研究流程。期待在未來的研究中再次與您合作！謝謝您對我們研究的支持與理解。")
          window.location.href = "../index.html"
          // 處理未通過的情況
      }
  }
});


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