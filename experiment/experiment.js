/*init*/
// console.log("尚未付費，僅供預覽，請勿盜用")
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

function upload_to_gs(roundDurations){
  // 將資料發送到 Google Sheets
  fetch(excel_upload_url, {
    redirect: "follow",
    method: 'POST',
    body: JSON.stringify(roundDurations), // 將資料轉換成 JSON 格式
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

var jsPsych = initJsPsych({
  override_safe_mode:true,
  // timeline: timeline,
  // show_progress_bar: true, // 需要progress bar嗎?
  on_finish: function() {
    jsPsych.data.displayData('csv');
    jsPsych.data.get().localSave
    // jsPsychSheet.uploadData(jsPsych.data.get().csv());
    var finish_data_json = jsPsych.data.get() // json
    var finish_data_csv  = jsPsych.data.get().csv() // csv
    console.log(finish_data_csv);
    var timeElapsedData = finish_data_json.select('time_elapsed').values; // 提取 time_elapsed 欄位
    // 創建一個新的陣列，來存儲每個回合所花費的時間
    let roundDurations = [];

    // 計算每個回合的持續時間
    for (let i = 1; i < timeElapsedData.length; i++) {
        let duration = timeElapsedData[i] - timeElapsedData[i - 1];  // 當前時間點 - 上一個時間點
        roundDurations.push(duration);
    }

    // 顯示每個回合所花費的時間
    console.log(roundDurations)
    roundDurations.unshift(tag_time())
    
    upload_to_gs(roundDurations)
    
  },
});


// -----------------------------------------------------------------------------------------------------------
var timeline = [];
var invest_game_user_money = 1000; // default 1000
var invest_game_bot_money = 1000; // default 1000
var reward = 0;
var current_slider_value = 0;

var practice_times = 0;
var real_times = 0;
var invest_round = 0;
var emotion_level_round = 0;
const practice_face_img = ["img/練習圖片1.png", "img/練習圖片2.png"];
var emotion_face_img = ["img/練習圖片1.png", "img/練習圖片2.png", "img/生氣臉a.png", "img/生氣臉b.png", "img/快樂臉a.png", "img/快樂臉b.png"]

/**
 * 把emotion_face_img後面四項洗牌
 */
function shuffle_emotion_face_img(){
  // 取出後面四項
  var subArray = emotion_face_img.splice(2);

  // 使用 Fisher-Yates 演算法打亂
  for (let i = subArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [subArray[i], subArray[j]] = [subArray[j], subArray[i]];
  }

  // 合併回原來的 array
  emotion_face_img = emotion_face_img.concat(subArray)
}


/*預加載*/
var preload = {
  type: jsPsychPreload,
  images: ["img/練習圖片1.png", "img/練習圖片2.png", "img/生氣臉a.png", "img/生氣臉b.png", "img/快樂臉a.png", "img/快樂臉b.png"]
};


/** 
 * 練習階段
 * 畫面不動不被影響，3秒後跳脫 
 * **/
var practice_start = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<h2>練習階段</h2>",
  choices: "NO_KEYS",
  trial_duration: 3000,
};


/** 
 * 練習階段
 * 畫面不動不被影響，3秒後跳脫 
 * **/
var real_start = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<h2>正式階段</h2>",
  choices: "NO_KEYS",
  trial_duration: 3000,
};


/**
 * timeline next element
 */
function nextTrial() {
  jsPsych.finishTrial(); // End current trial
}


/**
 * slider display update
 */
function updateSliderValue() {
  var slider = document.querySelector('input[type="range"]'); // 找到滑動條元素
  var display = document.getElementById('slider-value'); // 找到顯示數字的元素
  display.innerHTML = slider.value; // 初始顯示值

  
  slider.addEventListener('mousemove', function() { // 當滑動條被focus且滑鼠有移動到就會更新
    display.innerHTML = slider.value;
    current_slider_value = slider.value;
  });
  slider.addEventListener('click', function() { // 當滑動條被focus且滑鼠被release就會更新
    display.innerHTML = slider.value;
    current_slider_value = slider.value;
  });
}

/**
 * invest algorithm
 */
function invest_algo(max,min){
  let randomValue = Math.random() * (max - min) + min;
  console.log('倍率為' + randomValue)

  invest_game_user_money -= current_slider_value
  invest_game_bot_money += current_slider_value*3

  reward = Math.round(randomValue*current_slider_value*3)

  invest_game_bot_money -= reward
  invest_game_user_money += reward
  console.log(invest_game_user_money,invest_game_bot_money,current_slider_value)
}


/**
 * rich algorithm 
 * 1到5 跟 11到16輪
 *     x3x(0.6~0.7)
 * let randomValue = Math.random() * (0.7 - 0.6) + 0.6;
 * console.log(randomValue);
 */
function invest_rich(){
  invest_algo(0.7, 0.6)
}


/**
 * poor algorithm 
 * 6到10輪 
 *     x3x(0.3到0.4)
 * let randomValue = Math.random() * (0.4 - 0.3) + 0.3;
 * console.log(randomValue);
 */
function invest_poor(){
  invest_algo(0.4, 0.3)
}


/**
 * listen 滑塊按鈕 輸出錢錢
 * target.id抓下一步的按鈕
 */
/*
function handleClick(event) {
  if (event.target && event.target.id === 'jspsych-html-slider-response-next') {
      console.log('第' + invest_round + '輪投資了$' + current_slider_value + '錢錢')
  }
}*/

/**
 * 洗牌挑選快樂臉跟生氣臉
 */
function drawImages() {
  // 定義圖片檔案
  const angryFaces = ["img/生氣臉a.png", "img/生氣臉b.png"];
  const happyFaces = ["img/快樂臉a.png", "img/快樂臉b.png"];

  // 隨機抽取一張生氣臉圖片
  const randomAngryFace = angryFaces[Math.floor(Math.random() * angryFaces.length)];

  // 隨機抽取一張快樂臉圖片
  const randomHappyFace = happyFaces[Math.floor(Math.random() * happyFaces.length)];

  // 將兩張圖片加入到一個陣列並隨機排序
  const results = [randomAngryFace, randomHappyFace].sort(() => Math.random() - 0.5);

  return results; // 回傳抽取結果
}

/** 
 * 在console內顯示有無做出反應或是反應時間和投資金額
 * **/
function handle_invest_respond(data){
  if (data.rt === null) {
    console.log('第' + invest_round + "輪未作出任何反應"+"，反應時間: " + data.rt + " ms");
  } 
  else {
    console.log('第' + invest_round + '輪投資了$' + current_slider_value + '元'+"，反應時間: " + data.rt + " ms");
  }
  data.timeout = data.rt === null; // timeout設定值true 表示超時，false 表示有回應
}

/** 
 * 20 秒後自動結束
 * 練習遊戲畫面
 * 滑塊、顯示畫面、數字
 * **/
var invest_game_practice = {
  type: jsPsychHtmlSliderResponse,
  on_load: function() { 
    updateSliderValue(); // 更新滑動條顯示值
    current_slider_value = 0;
    console.log("練習階段: ")
  },
  on_finish: function(data) { 
    handle_invest_respond(data)
  },
  stimulus:function(){
    practice_times++;
    return `<h1>您選擇投資多少錢？</h1> <img src="`+ practice_face_img[practice_times-1] + `" alt="如果您看見這段文字就代表您的瀏覽器不支援圖片顯示或是網速過慢，此問題請盡快聯繫實驗者" width="500"> <p>請移動滑桿選擇數值並點擊以完成投資確認</p>`;
  },
  require_movement: true,
  trial_duration: 20000, // 20 秒後自動結束
  labels: ['$0', '$1000'],
  min: 0,
  max: 1000,
  slider_start: 500,
  button_label: '確定',
  prompt: '<p>投資金額: $<span id="slider-value">0</span></p>',
};


/** 
 * 20 秒後自動結束
 * 正式遊戲畫面
 * 滑塊、顯示畫面、數字
 * **/
var invest_game = {
  type: jsPsychHtmlSliderResponse,
  on_load: function() { 
    updateSliderValue(); // 更新滑動條顯示值
    current_slider_value = 0;
    invest_round++;
  },
  on_finish: function(data) { 
    handle_invest_respond(data)
    if (invest_round === 15) {
      pickImg.shift();
      console.log("在陣列中移除第一張照片，這應該只會發生一次")
    }
  },
  stimulus:function(){
    return `<h1>您選擇投資多少錢？</h1> <img src="`+ pickImg[0] + `" alt="如果您看見這段文字就代表您的瀏覽器不支援圖片顯示或是網速過慢，此問題請盡快聯繫實驗者" width="500"> <p>請移動滑桿選擇數值並點擊以完成投資確認</p> `;
  },
  trial_duration: 20000, // 20 秒後自動結束
  require_movement: true,
  labels: ['$0', '$1000'],
  min: 0,
  max: 1000,
  slider_start: 500,
  button_label: '確定',
  prompt: '<p>投資金額: $<span id="slider-value">0</span></p>',
};


/**
 * 回饋畫面計算中...
 *  目前秒數是2秒
 */
var cauculating = {
  type: jsPsychHtmlKeyboardResponse, // 隨便找一個type 但是不給他choices就好
  choices: "NO_KEYS",
  stimulus: "回饋金額計算中...",
  trial_duration: 2000
};


function display_invest_money(){
  var reward_value = document.getElementById('reward_value'); // 找到顯示數字的元素
  var your_money = document.getElementById('your_money'); // 找到顯示數字的元素
  var his_money = document.getElementById('his_money'); // 找到顯示數字的元素
  reward_value.innerHTML = reward
  your_money.innerHTML = invest_game_user_money
  his_money.innerHTML = invest_game_bot_money
}


/**
 * 
 * 練習練習練習練習
 * 輸出最後大家剩多少錢
 * 目前秒數是5秒
 */
var invest_practice_results = {
  type: jsPsychHtmlKeyboardResponse, // 隨便找一個type 但是不給他choices就好
  choices: "NO_KEYS",
  stimulus: `<h2>以下以💰替代，正式遊戲會顯示實際數值</h2><p>夥伴回饋給您：<span id="reward_value">💰💰💰</span></p><p>您的金額：<span id="your_money">💰💰💰</span></p><p>他的金額：<span id="his_money">💰💰💰</span></p>`,
  trial_duration: 5000
};


/**
 * 
 * 有錢有錢有錢有錢
 * 輸出最後大家剩多少錢
 * 目前秒數是5秒
 */
var invest_rich_results = {
  type: jsPsychHtmlKeyboardResponse, // 隨便找一個type 但是不給他choices就好
  on_load: function() { 

    invest_rich() // 變有錢算法
    display_invest_money()
  },
  choices: "NO_KEYS",
  stimulus: '<p>夥伴回饋給您：<span id="reward_value">0</span></p><p>您的金額：<span id="your_money">0</span></p><p>他的金額：<span id="his_money">0</span></p>',
  trial_duration: 5000
};


/**
 * 變窮變窮變窮變窮
 * 輸出最後大家剩多少錢
 * 目前秒數是5秒
 */
var invest_poor_results = {
  type: jsPsychHtmlKeyboardResponse, // 隨便找一個type 但是不給他choices就好
  on_load: function() { 
    invest_poor() // 虧錢算法
    display_invest_money()
  },
  choices: "NO_KEYS",
  stimulus: '<p>夥伴回饋給您：<span id="reward_value">0</span></p><p>您的金額：<span id="your_money">0</span></p><p>他的金額：<span id="his_money">0</span></p>',
  trial_duration: 5000
};


/**
 * 專注點0.8秒
 */
var focus_point_800 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 800
};


/**
 * 專注點0.2秒
 */
var focus_point_200 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 200
};


/**
 * 下一位夥伴提示語
 * 目前是5秒
 */
var next_partner = {
  type: jsPsychHtmlKeyboardResponse, // 隨便找一個type 但是不給他choices就好
  choices: "NO_KEYS",
  stimulus: "<h2>與下一位遊戲夥伴的投資遊戲即將開始！</h2>",
  trial_duration: 5000
};


/**
 * 練習->正式
 */
var invest_game_ready_real_game = {
  type: jsPsychInstructions,
  pages: [
      "<h2>準備好進入遊戲，請按【開始】</h2>",
  ],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_previous: '上一步',
  button_label_next: '開始'
}


/**
 * define debrief
 * 
 * 這段是實驗執行完成後，會先呈現一些簡單的結果數據給受試者看
 * 
 * trials: 把被標記為 response 的 task 資料給撈出來
 * correct_trials: 把作答是正確的 trials 資料給撈出來
 * accuracy: 計算受試者在實驗中的整體作答平均正確率
 * rt: 計算受試者在實驗中的整體作答平均反應時間
 */
var debrief_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {

    var trials = jsPsych.data.get().filter({task: 'response'});
    var correct_trials = trials.filter({correct: true});
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(correct_trials.select('rt').mean());

    return `<p>You responded correctly on ${accuracy}% of the trials.</p>
      <p>Your average response time was ${rt}ms.</p>
      <p>Press any key to complete the experiment. Thank you!</p>`;

  }
};


/**
 * 感謝您完成投資遊戲作業。接下來，您將進行最後一項作業－情緒評級作業。
 */
var invest_done = {
  type: jsPsychInstructions,
  pages: [
  `
  <h3>感謝您完成投資遊戲作業。</h3>
  <h3>接下來，您將進行最後一項作業－情緒評級作業。請注意，為了確保研究的有效性，我們希望您能一次性完成所有試驗，並盡量避免中斷。</h3>
  <h3>整個過程預計需要約 5分鐘。</h3>

  <h3>在進行過程中，請根據畫面上的指示進行操作。若您感到不適或有任何問題，您可以隨時選擇中止實驗。</h3>
  <h3>只需點擊出現在不同階段界面上的「中止實驗」按鈕，或直接關閉網頁（按下「x」），我們會尊重您的選擇。</h3>
  <h3>謝謝您的參與，請準備好開始！</h3>
  `
  ],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_previous: '上一步',
  button_label_next: '下一步'
}


/**
 * 情緒評級作業指導語	內定超過60秒參與者未按「下一步」直接跳下一頁
 * 接下來將於螢幕上看見臉孔表情圖片，一次一張，您的任務是評估每張臉孔表情圖片
 */
var emotion_guide = {
  type: jsPsychInstructions,
  pages: [
`
<h3>接下來將於螢幕上看見臉孔表情圖片，一次一張</h3>
<h3>您的任務是評估每張臉孔表情圖片</h3>
<h3>「正面或負面程度如何?」、「讓您感到威脅的程度如何?」與「您信任他/她的程度如何？」。</h3>

`
  ],
  on_load: () => {
    startTimer(); // 啟動計時器
  },
  on_finish: () => {
    clearTimeout(timeout); // 清除計時器
  },
  trial_duration: 60000,
  show_clickable_nav: true,
  allow_backward: false,
  button_label_previous: '上一步',
  button_label_next: '下一步'
}


/**
 * 準備好時，請按【開始】
 */
var emotion_start = {
  type: jsPsychInstructions,
  pages: [
`
<h3>準備好時，請按【開始】</h3>
`,
  ],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_previous: '上一步',
  button_label_next: '開始'
}


/** 
 * slider滑塊 -4 到 4 
 * 這個表情的正面或負面程度如何？
 * **/
var negative_positive_level = {
  type: jsPsychHtmlSliderResponse,
  data: { varname: 'V' },
  on_load: function() { 
    updateSliderValue(); // 更新滑動條顯示值
  },
  stimulus:function(){
    return `<h1>(part2-1)這個表情的正面或負面程度如何？</h1> <img src="`+ emotion_face_img[emotion_level_round] + `" alt="如果您看見這段文字就代表您的瀏覽器不支援圖片顯示或是網速過慢，此問題請盡快聯繫實驗者" width="500"> `;
  },
  labels: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
  min: -4,
  max: 4,
  slider_start: 0,
  button_label: '下一步',
  require_movement: true,
  prompt: '<p>當前值: <span id="slider-value">0</span></p>',
}


/** 
 * slider滑塊 0 到 9 
 * 這個表情讓您感到威脅的程度如何？
 * **/
var feel_threat_level = {
  type: jsPsychHtmlSliderResponse,
  data: { varname: 'Threat' },
  on_load: function() { 
    updateSliderValue(); // 更新滑動條顯示值
  },
  stimulus:function(){
    return `<h1>(part2-2)這個表情讓您感到威脅的程度如何？</h1> <img src="`+ emotion_face_img[emotion_level_round] + `" alt="如果您看見這段文字就代表您的瀏覽器不支援圖片顯示或是網速過慢，此問題請盡快聯繫實驗者" width="500"> `;
  },
  labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  min: 0,
  max: 9,
  slider_start: 5,
  button_label: '下一步',
  require_movement: true,
  prompt: '<p>當前值: <span id="slider-value">0</span></p>',
}


/** 
 * slider滑塊 0 到 9 
 * 您信任他/她的程度如何？
 * **/
var trust_level = {
  type: jsPsychHtmlSliderResponse,
  data: { varname: 'Trust' },
  on_load: function() { 
    updateSliderValue(); // 更新滑動條顯示值
  },
  on_finish:function(){
    emotion_level_round++;
  },
  stimulus:function(){
    return `<h1>(part2-3)您信任他/她的程度如何？</h1> <img src="`+ emotion_face_img[emotion_level_round] + `" alt="如果您看見這段文字就代表您的瀏覽器不支援圖片顯示或是網速過慢，此問題請盡快聯繫實驗者" width="500"> `;
  },
  labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  min: 0,
  max: 9,
  slider_start: 5,
  button_label: '下一步',
  require_movement: true,
  prompt: '<p>當前值: <span id="slider-value">0</span></p>',
}


/** 
 * 您認為您的遊戲夥伴是一名真實的人類玩家嗎？（請選擇最符合您感受的選項）
 * **/
var trust_robot_survey = {
  type: jsPsychSurveyLikert,
  questions: [
    {
      prompt: '<h2>請評估您對於信任遊戲中的遊戲夥伴（對方玩家）是否為真實人類的相信程度。您認為您的遊戲夥伴是一名真實的人類玩家嗎？（請選擇最符合您感受的選項）</h2>',
      labels: ["完全是人類", "大部分是人類", "不確定", "大部分是電腦", "完全是電腦"],
      required: true
    }
  ],
  button_label: "確定>>"
};


/** 
 * 全部實驗結束
 * **/
var all_exp_done = {
  type: jsPsychInstructions,
  pages: [
  `<h2>感謝您完成實驗作業！接下來，請閱讀研究後的知情同意書與回饋資訊。若您同意本研究使用您的數據，請勾選『同意』。再次感謝您的參與！</h2>`
  ],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_previous: '上一步',
  button_label_next: '下一步'
}

/**
 * ===================================================QUEUE=ITEM=========================================================
 */

/** 
 * 練習練習練習練習練習練習
 * 投資遊戲 練習2輪
 */
var invest_game_practice_queue = {
  timeline: [focus_point_800, invest_game_practice, cauculating, invest_practice_results],
  repetitions: 2,
};

/**
 * 💰💰💰💰
 * 正式正式正式正式正式正式
 * 投資實驗 part1、2 第1到5輪
 * 💵💵💵💵
 */
var invest_game_queue_rich_1_5 = {
  timeline: [focus_point_800, invest_game, cauculating, invest_rich_results],
  repetitions: 5,
};

/**
 * 🥲🥲🥲🥲
 * 正式正式正式正式正式正式
 * 投資實驗 part1、2 第6到10輪
 * 👎👎👎👎
 */
var invest_game_queue_poor_6_10 = {
  timeline: [focus_point_800, invest_game, cauculating, invest_poor_results],
  repetitions: 5,
};
/**
 * 💰💰💰💰
 * 正式正式正式正式正式正式
 * 投資實驗 part1、2 第11到16輪
 * 💵💵💵💵
 */
var invest_game_queue_rich_11_15 = {
  timeline: [focus_point_800, invest_game, cauculating, invest_rich_results],
  repetitions: 5,
};

/**
 * 💰💰💰💰
 * 正式正式正式正式正式正式
 * 投資實驗 part1、2 第16輪
 * 💵💵💵💵
 */
var invest_game_queue_rich_16 = {
  timeline: [focus_point_800, invest_game, cauculating, invest_rich_results],
  repetitions: 1,
};

/**
 * 練習練習練習練習練習練習
 * 情緒評估實驗
 */
var emotion_level_practice_queue = {
  timeline: [focus_point_200, negative_positive_level, feel_threat_level, trust_level],
  repetitions: 2,
}

/**
 * 正式正式正式正式正式正式
 * 情緒評估實驗
 */
var emotion_level_queue = {
  timeline: [focus_point_200, negative_positive_level, feel_threat_level, trust_level],
  repetitions: 4,
}


//=========================================================main=========================================================
//===================================================QUEUES=TIMELINE====================================================

// 使用抽取功能抽出實驗一的圖片
var pickImg = drawImages();
console.log("抽取的圖片順序：", pickImg);
shuffle_emotion_face_img()
console.log("emotion_face抽取的圖片順序：", emotion_face_img);
// preload資源
timeline.push(preload);


/**
 * ==========第一部分：投資遊戲==========
 */

// 剛開始進去歡迎畫面
timeline.push(practice_start);

// 練習兩次投資
timeline.push(invest_game_practice_queue);

// 準備就緒
timeline.push(focus_point_800);
timeline.push(invest_game_ready_real_game);

// 正式投資遊戲開始提示語
timeline.push(real_start)

// 正式第一part投資
timeline.push(invest_game_queue_rich_1_5);
timeline.push(invest_game_queue_poor_6_10);
timeline.push(invest_game_queue_rich_11_15);
timeline.push(invest_game_queue_rich_16);

// 第一張圖片會自動被踢掉
timeline.push(next_partner);

// 正式第二part投資
timeline.push(invest_game_queue_rich_1_5);
timeline.push(invest_game_queue_poor_6_10);
timeline.push(invest_game_queue_rich_11_15);
timeline.push(invest_game_queue_rich_16);

// 感謝您完成投資遊戲作業。投資遊戲結束
timeline.push(invest_done);



/**
 * ==========第二部分：情緒評估==========
 */

// 情緒評估說明
timeline.push(emotion_guide)

// 情緒評估開始按鈕
timeline.push(emotion_start)

// 練習情緒評估開始提示語
timeline.push(practice_start)

// 練習兩次情緒評估
timeline.push(emotion_level_practice_queue);

// 正式情緒評估開始提示語
timeline.push(real_start)

// 正式四次情緒評估
timeline.push(emotion_level_queue);

//信任機器人遊戲夥伴
timeline.push(trust_robot_survey);

//結束
timeline.push(all_exp_done);

// run
jsPsych.run(timeline);


// ==============================懸浮視窗=====================================
let timeout;
/*
function startTimer() {
  timeout = setTimeout(() => {
    showPrompt();
  }, 10 * 60 * 1000); // 10分鐘
}
*/
function startTimer() {
  timeout = setTimeout(() => {
    showPrompt();
  }, 3* 1000); // 10分鐘
}

function resetTimer() {
  clearTimeout(timeout);
  startTimer();
}

function showPrompt() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.style.display = 'block';

  const prompt = document.createElement('div');
  prompt.id = 'timeoutPrompt';
  prompt.style.display = 'block';
  prompt.innerHTML = `
    <p>您還在螢幕前嗎？提醒您的畫面已停滯許久，5分鐘後若未能繼續進行，將會中止此研究！
    請點擊下方按鈕繼續進行研究，謝謝！↓</p>
    <p>再次感謝您的參與！如果需要任何幫助，請聯絡我們：<br>
    聯絡人/主試者：廖彗君<br>
    email：<adress><a href="mailto:trauma.cycu.psych@gmail.com">trauma.cycu.psych@gmail.com</a></adress><br>
    指導教授：洪福建</p>
    <p>此外，您也可以點擊以下【回饋表單】填寫您的意見（可匿名或選填聯絡資訊），或直接透過上述聯絡方式與我們聯繫。如您在參與過程中感到情緒不適並感到需要支持，我們已準備了相關資源資訊，您可以視需求下載或隨時聯繫我們。</p>
    <button id="terminateResearch">我希望終止研究</button>
    <button id="feedbackForm">回饋表單</button>
    <button id="downloadResources">下載心理衛教單</button>
    <button id="return">返回</button>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(prompt);

  // 按鈕事件綁定
  document.getElementById('terminateResearch').addEventListener('click', terminateResearch);
  document.getElementById('feedbackForm').addEventListener('click', () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfSK85PjVf8gPqx-17YZu935HX9TzyoB71CbzegUuonasJPow/viewform', '_blank'); 
  });
  document.getElementById('downloadResources').addEventListener('click', () => {
    window.open('download/【04】心理衛教單-20241111.pdf', '_blank'); 
  });
  document.getElementById('return').addEventListener('click', () => {
    closePrompt();
  });
}

// 關閉提示框
function closePrompt() {
  document.body.removeChild(document.getElementById('overlay'));
  document.body.removeChild(document.getElementById('timeoutPrompt'));
}

// 終止研究邏輯
function terminateResearch() {
  const confirmTerminate = confirm('終止後將喪失所有進度，確定要繼續?');
  if (confirmTerminate) {
    alert('研究已終止，感謝您的參與！');
    closePrompt();
    jsPsych.endExperiment('實驗已中止');
    // 在此處添加任何需要的終止處理，例如跳轉到結束頁面
  }
}

function closePrompt() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('timeoutPrompt').style.display = 'none';
  resetTimer(); // 重置計時器
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
