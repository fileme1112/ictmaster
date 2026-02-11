import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, ArrowRight, Brain, Settings, Calculator, Wifi, Monitor, Database, Cpu, Code, Globe, AlertCircle } from 'lucide-react';

// ==========================================
// 1. 靜態題庫 (Static Question Bank)
// ==========================================
// 這裡補充了 PDF 中出現的算法題與社會議題題目
const STATIC_DB = [
  // --- System (電腦系統) ---
  {
    templateId: 's1',
    category: 'System',
    question: "下列哪項「不是」操作系統 (Operating System)？",
    options: ["JAVA", "LINUX", "DOS", "UNIX"],
    correctIndex: 0,
    explanation: "JAVA 是一種程式編寫語言或平台，而 LINUX、DOS 和 UNIX 均為操作系統。"
  },
  {
    templateId: 's2',
    category: 'System',
    question: "下列哪項是操作系統內使用圖形用戶介面 (GUI) 的原因？\n(1) 方便用戶使用系統\n(2) 用戶毋須強記指令\n(3) 系統反應更快",
    options: ["只有 (3)", "只有 (2) 和 (3)", "只有 (1) 和 (2)", "只有 (1)"],
    correctIndex: 2,
    explanation: "GUI 提供友善介面 (1) 並減少記憶指令需求 (2)。但 GUI 通常消耗更多資源，反應未必比文字介面 (CLI) 快 (3)。"
  },
  
  // --- Programming (程式與算法) - 根據 PDF 補充 ---
  {
    templateId: 'p1',
    category: 'Programming',
    question: "在算法設計上使用陣列 (Array) 的主要優點是什麼？",
    options: ["在設計上可使用模組方法", "在迭代 (Iteration) / 循環設計上是很有用的", "陣列大小有彈性", "使用較少記憶體"],
    correctIndex: 1,
    explanation: "陣列配合循環 (Loop/Iteration) 可以高效處理大量相似數據。標準陣列大小通常固定，且未必節省記憶體。"
  },
  {
    templateId: 'p2',
    category: 'Programming',
    question: "下列流程圖展示一算法，其目的是輸出四個輸入數目中的最大數值。這個算法在下列其中一組數字不能產生正確結果。這是哪一組？\n(假設算法邏輯有缺陷)",
    options: ["4, 3, 2, 1", "1, 2, 3, 4", "1, 4, 2, 3", "所有數字相同時"],
    correctIndex: 3, // 假設題意，通常簡單比較算法易忽略相等情況
    explanation: "許多基礎排序或比較算法在未處理「相等」(>=) 情況時，遇到所有數字相同可能會導致邏輯錯誤或死循環。"
  },

  // --- Social (社會議題) ---
  {
    templateId: 'so1',
    category: 'Social',
    question: "下列哪一句關於「開放源碼 (Open Source)」軟件是正確的？",
    options: ["必須使用開放源碼語言編寫", "只能在 Linux 執行", "其源碼可自由地複製、更改和發放", "私人公司不能利用它賺錢"],
    correctIndex: 2,
    explanation: "開放源碼的核心是用戶可存取、修改和分發源代碼。商業公司仍可透過服務獲利。"
  },
  
  // --- Internet (網絡) ---
  {
    templateId: 'i1',
    category: 'Internet',
    question: "下列哪項「不是」一個普通網絡操作系統 (NOS) 的功能？",
    options: ["軟件開發管理", "使用者戶口管理", "列印管理", "監察及限制網絡資源的存取"],
    correctIndex: 0,
    explanation: "NOS 負責網絡資源(列印、檔案)、保安及用戶管理。軟件開發管理屬於 IDE 工具的功能。"
  }
];

// ==========================================
// 2. 模擬 AI 生成引擎 (Generative Engine)
// ==========================================

const generateBinaryQuestion = () => {
  const num = Math.floor(Math.random() * 255) + 1; 
  const binary = num.toString(2).padStart(8, '0');
  
  const wrong1 = num + Math.floor(Math.random() * 5) + 1;
  const wrong2 = num - Math.floor(Math.random() * 5) - 1;
  const wrong3 = parseInt(binary.split('').reverse().join(''), 2);

  const options = [num, wrong1, wrong2, wrong3].map(n => n.toString());
  const shuffled = options.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
  const correctIndex = shuffled.indexOf(num.toString());

  return {
    id: `gen-bin-${Date.now()}-${Math.random()}`,
    category: 'Data',
    question: `將二進制數值 ${binary} 轉換為十進制數值：`,
    options: shuffled,
    correctIndex: correctIndex,
    explanation: `二進制 ${binary} = ${num} (十進制)。\n計算方法：${binary.split('').map((b, i) => b === '1' ? `2^${7-i}` : null).filter(Boolean).join(' + ')} = ${num}`
  };
};

const generateFileSizeQuestion = () => {
  const width = [800, 1024, 1920][Math.floor(Math.random() * 3)];
  const height = [600, 768, 1080][Math.floor(Math.random() * 3)];
  const depth = [8, 16, 24][Math.floor(Math.random() * 3)];
  
  const sizeBits = width * height * depth;
  const sizeBytes = sizeBits / 8;
  const sizeKB = Math.round((sizeBytes / 1024) * 100) / 100;
  
  const wrong1 = Math.round((sizeKB * 8) * 100) / 100; 
  const wrong2 = Math.round((sizeKB / 8) * 100) / 100; 
  const wrong3 = Math.round((sizeKB * 1.5) * 100) / 100;

  const options = [`${sizeKB} KB`, `${wrong1} KB`, `${wrong2} KB`, `${wrong3} KB`];
  const shuffled = options.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
  const correctIndex = shuffled.indexOf(`${sizeKB} KB`);

  return {
    id: `gen-img-${Date.now()}-${Math.random()}`,
    category: 'Multimedia',
    question: `計算一張解像度為 ${width} x ${height} 且顏色深度為 ${depth}-bit 的點陣圖(Bitmap)檔案大小 (以 KB 為單位，不計算標頭檔)：`,
    options: shuffled,
    correctIndex: correctIndex,
    explanation: `公式：(闊 x 高 x 顏色深度) / 8 / 1024。\n(${width} x ${height} x ${depth}) / 8 / 1024 ≈ ${sizeKB} KB`
  };
};

const generateHardwareQuestion = () => {
  const devices = [
    { name: "硬碟 (HDD)", type: "Storage", desc: "非易失性儲存裝置" },
    { name: "隨機存取記憶體 (RAM)", type: "Memory", desc: "易失性記憶體，關機後資料消失" },
    { name: "唯讀記憶體 (ROM)", type: "Memory", desc: "非易失性，存放啟動程式" },
    { name: "固態硬碟 (SSD)", type: "Storage", desc: "使用快閃記憶體的高速儲存" }
  ];
  
  const correctItem = devices[Math.floor(Math.random() * devices.length)];
  const isVolatile = correctItem.name === "隨機存取記憶體 (RAM)";
  
  const questionType = Math.random() > 0.5 ? "volatile" : "ssd_hdd";

  if (questionType === "volatile") {
    return {
      id: `gen-hw-${Date.now()}-${Math.random()}`,
      category: 'System',
      question: "下列哪項屬於「易失性 (Volatile)」記憶體，即關機後資料會消失？",
      options: ["硬碟 (HDD)", "隨機存取記憶體 (RAM)", "唯讀記憶體 (ROM)", "快閃記憶體 (Flash Memory)"],
      correctIndex: 1,
      explanation: "RAM 是易失性記憶體，當電源中斷時，其儲存的資料會消失。"
    };
  } else {
    return {
        id: `gen-hw2-${Date.now()}-${Math.random()}`,
        category: 'System',
        question: "下列關於 SSD (固態硬碟) 與 HDD (傳統硬碟) 的比較，哪項是「錯誤」的？",
        options: ["SSD 讀寫速度通常比 HDD 快", "SSD 運作時比 HDD 更寧靜", "SSD 比 HDD 更容易因震動而損壞", "SSD 使用快閃記憶體儲存資料"],
        correctIndex: 2,
        explanation: "錯誤的是 C。SSD 沒有移動機械部件，因此比傳統 HDD 更「耐震」且不易因震動損壞。"
    }
  }
};

const generateQuiz = (count, categories) => {
  let questions = [];
  
  // 1. 篩選靜態題目
  const filteredStatic = STATIC_DB.filter(q => categories.includes(q.category) || categories.includes('All'));
  questions = [...questions, ...filteredStatic];
  
  // 2. 補充 AI 生成題目
  // 為了演示效果，如果靜態題目不夠，我們會用生成器來填補
  // 並且確保生成的題目類別符合使用者選擇
  while (questions.length < count) {
    const rand = Math.random();
    let newQ = null;
    
    // 檢查目前啟用的類別
    const allowData = categories.includes('Data') || categories.includes('All');
    const allowMedia = categories.includes('Multimedia') || categories.includes('All');
    const allowSystem = categories.includes('System') || categories.includes('All');
    
    // 嘗試生成符合類別的題目
    if (allowData && (rand < 0.4 || (!allowMedia && !allowSystem))) {
      newQ = generateBinaryQuestion();
    } else if (allowMedia && (rand < 0.7 || !allowSystem)) {
      newQ = generateFileSizeQuestion();
    } else if (allowSystem) {
      newQ = generateHardwareQuestion();
    } 
    
    // 如果因為類別限制 (例如只選了 Social) 導致沒有生成器可用，
    // 則直接複製隨機一個靜態題目以避免死循環 (實際應用應編寫更多生成器)
    if (!newQ) {
       if (filteredStatic.length > 0) {
         newQ = { ...filteredStatic[Math.floor(Math.random() * filteredStatic.length)], id: `dup-${Date.now()}-${Math.random()}` };
       } else {
         // Fallback default
         newQ = generateBinaryQuestion();
       }
    }
    
    questions.push(newQ);
  }
  
  // 洗牌並截取指定數量
  return questions.sort(() => 0.5 - Math.random()).slice(0, count);
};


// ==========================================
// 組件邏輯
// ==========================================

export default function ICTQuizApp() {
  const [currentMode, setCurrentMode] = useState('menu'); 
  const [config, setConfig] = useState({
    count: 10,
    categories: ['All']
  });
  
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // 新增：使用者輸入的臨時題數
  const [inputCount, setInputCount] = useState("10");
  
  const [stats, setStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    maxStreak: 0
  });

  // 完整的 ICT DSE 範疇分類
  const categoriesList = [
    { id: 'All', label: '所有範疇 (All)', icon: <Database className="w-4 h-4" /> },
    { id: 'System', label: '電腦系統 (System)', icon: <Cpu className="w-4 h-4" /> },
    { id: 'Data', label: '資訊處理 (Data)', icon: <Calculator className="w-4 h-4" /> },
    { id: 'Internet', label: '互聯網 (Internet)', icon: <Wifi className="w-4 h-4" /> },
    { id: 'Multimedia', label: '多媒體 (Multimedia)', icon: <Monitor className="w-4 h-4" /> },
    { id: 'Programming', label: '程式與算法 (Prog)', icon: <Code className="w-4 h-4" /> },
    { id: 'Social', label: '社會議題 (Social)', icon: <Globe className="w-4 h-4" /> },
  ];

  const startQuiz = () => {
    // 驗證輸入數量
    let finalCount = parseInt(inputCount);
    if (isNaN(finalCount) || finalCount < 1) finalCount = 5;
    if (finalCount > 100) finalCount = 100; // 設定上限以免瀏覽器卡頓

    const newQueue = generateQuiz(finalCount, config.categories);
    setQueue(newQueue);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentMode('quiz');
  };

  const toggleCategory = (catId) => {
    setConfig(prev => {
      if (catId === 'All') return { ...prev, categories: ['All'] };
      
      let newCats = prev.categories.filter(c => c !== 'All');
      if (newCats.includes(catId)) {
        newCats = newCats.filter(c => c !== catId);
      } else {
        newCats.push(catId);
      }
      
      if (newCats.length === 0) newCats = ['All'];
      return { ...prev, categories: newCats };
    });
  };

  const handleAnswer = (optionIndex) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === queue[currentIndex].correctIndex;
    
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setStats(prev => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + 1,
        maxStreak: Math.max(prev.maxStreak, streak + 1)
      }));
    } else {
      setStreak(0);
      setStats(prev => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1
      }));
    }
  };

  const nextQuestion = () => {
    if (currentIndex >= queue.length - 1) {
      setCurrentMode('result');
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    }
  };

  const goHome = () => {
    setCurrentMode('menu');
  };

  const getCategoryLabel = (cat) => {
    const found = categoriesList.find(c => c.id === cat);
    return found ? found.label : cat;
  };

  // ==========================================
  // VIEW: 主選單 (設定頁面)
  // ==========================================
  if (currentMode === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center relative overflow-hidden">
            <Brain className="w-16 h-16 text-white mx-auto mb-4 relative z-10" />
            <h1 className="text-3xl font-bold text-white mb-1 relative z-10">ICT AI Master</h1>
            <p className="text-indigo-200 text-sm relative z-10">全方位 DSE 題目生成系統</p>
          </div>
          
          <div className="p-6 space-y-8">
            {/* 統計概覽 */}
            <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex-1 text-center border-r border-slate-200">
                <div className="text-2xl font-bold text-indigo-600">{stats.totalCorrect}</div>
                <div className="text-xs text-slate-500">累積答對</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-emerald-500">
                  {stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0}%
                </div>
                <div className="text-xs text-slate-500">準確率</div>
              </div>
            </div>

            {/* 設定區域 */}
            <div className="space-y-6">
              
              {/* 1. 題目數量輸入 (Input Field) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> 題目數量 (Target Questions)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      min="1" 
                      max="100"
                      value={inputCount}
                      onChange={(e) => setInputCount(e.target.value)}
                      className="w-full p-3 pl-4 bg-slate-100 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white outline-none font-bold text-lg text-slate-700 transition-all"
                      placeholder="輸入數量..."
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">題</span>
                  </div>
                  <div className="text-xs text-slate-400 w-24 leading-tight">
                    建議輸入 5 至 50 題以達最佳效果
                  </div>
                </div>
              </div>

              {/* 2. 課題範疇選擇 (Categories) */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Database className="w-4 h-4" /> 選擇課題範疇 (Topic Selection)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categoriesList.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`
                        flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border
                        ${config.categories.includes(cat.id) 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-[1.02]' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
                      `}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 開始按鈕 */}
            <button 
              onClick={startQuiz}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group mt-4"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              建立測驗
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: 結算頁面
  // ==========================================
  if (currentMode === 'result') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-in zoom-in duration-300">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">挑戰完成</h2>
          <p className="text-slate-500 mb-8">AI 根據你的表現正在分析數據...</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-1">{score}</div>
              <div className="text-xs font-medium text-green-700 uppercase tracking-wider">答對題數</div>
            </div>
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="text-4xl font-bold text-indigo-600 mb-1">
                {Math.round((score / queue.length) * 100)}%
              </div>
              <div className="text-xs font-medium text-indigo-700 uppercase tracking-wider">準確率</div>
            </div>
          </div>

          <button 
            onClick={goHome}
            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors"
          >
            返回主頁
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: 答題頁面
  // ==========================================
  const currentQ = queue[currentIndex];
  if (!currentQ) return <div className="flex items-center justify-center h-screen text-slate-500">AI 正在生成題目...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-8 px-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <button onClick={goHome} className="text-slate-400 hover:text-slate-700 font-medium text-sm transition-colors">
            ✕ 結束
          </button>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-bold border border-orange-100">
               <Trophy className="w-3.5 h-3.5" /> 
               {streak} 連勝
             </div>
             <div className="w-px h-4 bg-slate-200"></div>
             <div className="text-slate-500 font-medium text-sm">
               {currentIndex + 1} <span className="text-slate-300">/</span> {queue.length}
             </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6 transition-all">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              {getCategoryLabel(currentQ.category)}
            </span>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">AI Question</span>
          </div>
          
          <div className="p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed mb-8 whitespace-pre-line">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group relative overflow-hidden ";
                
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnClass += "border-green-500 bg-green-50/50 text-green-900"; 
                  } else if (idx === selectedOption && idx !== currentQ.correctIndex) {
                    btnClass += "border-red-500 bg-red-50/50 text-red-900 opacity-80"; 
                  } else {
                    btnClass += "border-transparent bg-slate-50 opacity-40"; 
                  }
                } else {
                  btnClass += "border-slate-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md text-slate-700";
                }

                return (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                      ${isAnswered && idx === currentQ.correctIndex ? 'bg-green-500 text-white shadow-green-200' : 
                        isAnswered && idx === selectedOption ? 'bg-red-500 text-white shadow-red-200' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600'}
                    `}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </div>
                    <span className="font-medium">{opt}</span>
                    
                    {isAnswered && idx === currentQ.correctIndex && 
                      <CheckCircle className="w-6 h-6 ml-auto text-green-500 animate-in zoom-in duration-300" />
                    }
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && 
                      <XCircle className="w-6 h-6 ml-auto text-red-500 animate-in zoom-in duration-300" />
                    }
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation / Next Button */}
        {isAnswered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`rounded-2xl p-6 shadow-sm mb-6 border ${selectedOption === currentQ.correctIndex ? 'bg-green-50 border-green-100' : 'bg-white border-slate-200'}`}>
               <div className="flex gap-4">
                 <div className="mt-1 shrink-0">
                   {selectedOption === currentQ.correctIndex ? 
                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                     </div> : 
                     <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-slate-500" />
                     </div>
                   }
                 </div>
                 <div>
                   <h4 className={`font-bold text-lg mb-2 ${selectedOption === currentQ.correctIndex ? 'text-green-800' : 'text-slate-800'}`}>
                     {selectedOption === currentQ.correctIndex ? "正確！AI 解析：" : "學習重點："}
                   </h4>
                   <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                     {currentQ.explanation}
                   </p>
                 </div>
               </div>
            </div>

            <button 
              onClick={nextQuestion}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200/50 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              下一題 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper icons
function CheckCircle({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function XCircle({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}