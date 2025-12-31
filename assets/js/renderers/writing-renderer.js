/**
 * 檔案位置：assets/js/renderers/writing-renderer.js
 * 功能：創意寫作課程專用渲染引擎 (含句子整容、議題分流、紅包反思)
 */

const WritingRenderer = {
    
    renderStep: function(stepData, container) {
        container.innerHTML = ''; 
        
        // 渲染通用標題
        if(stepData.title) {
            const header = document.createElement('h2');
            header.className = 'lesson-step-title';
            header.innerText = stepData.title;
            container.appendChild(header);
        }

        // 根據類型分派任務
        switch(stepData.type) {
            case 'game_random_sense':
                this.renderSenseGame(stepData, container);
                break;
            case 'sentence_surgery': // [NEW] 句子整容院
                this.renderSentenceSurgery(stepData, container);
                break;
            case 'interactive_budget': // [NEW] 紅包規劃+反思
                this.renderBudgetPlanner(stepData, container);
                break;
            case 'topic_selector': // [NEW] 差異化選題
                this.renderTopicSelector(stepData, container);
                break;
            case 'guided_writing':
                this.renderWritingInput(stepData, container);
                break;
            default:
                // 預設純文字顯示
                const content = document.createElement('div');
                content.className = 'lesson-text';
                content.style = "font-size: 1.1rem; line-height: 1.6; color: #444;";
                content.innerHTML = stepData.content || '';
                container.appendChild(content);
        }
    },

    // 1. 五感抽籤
    renderSenseGame: function(data, container) {
        const instruction = document.createElement('p');
        instruction.style = "font-size: 1.1rem; color: #555; margin-bottom: 20px;";
        instruction.innerText = data.instruction;
        
        const resultBox = document.createElement('div');
        resultBox.className = 'sense-result-box';
        resultBox.innerText = "❓ 等待抽取...";

        const btn = document.createElement('button');
        btn.innerText = "🎲 啟動五感雷達";
        btn.className = 'action-btn';
        
        btn.onclick = () => {
            let count = 0;
            const interval = setInterval(() => {
                const randomIdx = Math.floor(Math.random() * data.options.length);
                resultBox.innerText = data.options[randomIdx];
                count++;
                if (count > 15) {
                    clearInterval(interval);
                    resultBox.classList.add('highlight');
                    
                    // 國七進階提示
                    if(!resultBox.querySelector('.extra-tip')) {
                        const extraTip = document.createElement('div');
                        extraTip.className = 'extra-tip';
                        extraTip.style = "font-size: 0.9rem; color: #d35400; margin-top:15px; font-weight:normal;";
                        extraTip.innerHTML = "💡 <strong>國七進階思考：</strong>這個感官帶給你什麼情緒？(熱鬧還是煩躁？溫暖還是孤單？)";
                        resultBox.appendChild(extraTip);
                    }
                }
            }, 50);
        };

        container.appendChild(instruction);
        container.appendChild(resultBox);
        container.appendChild(btn);
    },

    // 2. 句子整容院 (Before & After)
    renderSentenceSurgery: function(data, container) {
        const desc = document.createElement('p');
        desc.innerHTML = data.description;
        container.appendChild(desc);

        const surgeryTable = document.createElement('div');
        surgeryTable.style = "display: flex; gap: 20px; margin: 25px 0; flex-wrap: wrap;";

        // 左邊：生病的原句
        const badSide = document.createElement('div');
        badSide.style = "flex: 1; min-width: 250px; background: #ffeaa7; padding: 20px; border-radius: 10px; color: #555;";
        badSide.innerHTML = `<h4 style="margin-top:0;">🤢 枯燥的原句 (流水帳)</h4><p style="font-size: 1.2rem; font-weight:bold;">"${data.badExample}"</p>`;
        
        // 右邊：整容後的句子
        const goodSide = document.createElement('div');
        goodSide.id = 'good-sentence-box';
        goodSide.style = "flex: 1; min-width: 250px; background: #55efc4; padding: 20px; border-radius: 10px; color: #00b894; display: none; box-shadow: 0 4px 15px rgba(85, 239, 196, 0.4);"; 
        goodSide.innerHTML = `<h4 style="margin-top:0;">✨ 施展魔法後</h4><p style="font-size: 1.1rem; line-height:1.6; color:#2d3436;">${data.goodExample}</p>`;

        surgeryTable.appendChild(badSide);
        surgeryTable.appendChild(goodSide);
        container.appendChild(surgeryTable);

        // 操作按鈕
        const btn = document.createElement('button');
        btn.id = 'magic-btn';
        btn.className = 'action-btn';
        btn.innerText = "🪄 施展寫作魔法 (點擊查看)";
        btn.onclick = () => {
            document.getElementById('good-sentence-box').style.display = 'block';
            btn.style.display = 'none'; // 按鈕消失
        };
        container.appendChild(btn);

        // 練習區
        const practiceArea = document.createElement('div');
        practiceArea.style = "margin-top: 40px; border-top: 2px dashed #e0e0e0; padding-top: 25px;";
        practiceArea.innerHTML = `
            <h4 style="color:#d35400;">換你試試看！</h4>
            <p style="background:#eee; padding:10px; border-radius:5px;"><strong>題目：</strong>${data.practicePrompt}</p>
            <textarea class="student-input" placeholder="小五提示：加入動作、表情、聲音。\n國七提示：加入譬喻法、心理描寫。" style="height: 120px;"></textarea>
        `;
        container.appendChild(practiceArea);
    },

    // 3. 議題選擇器 (差異化分流)
    renderTopicSelector: function(data, container) {
        const intro = document.createElement('p');
        intro.innerText = "不同年級有不同的挑戰目標，請點擊下方卡片選擇你的寫作路線：";
        container.appendChild(intro);

        const optionsDiv = document.createElement('div');
        optionsDiv.style = "display: flex; gap: 15px; flex-wrap: wrap; margin-top: 20px;";

        data.choices.forEach((choice, idx) => {
            const card = document.createElement('div');
            card.className = 'topic-card';
            card.style = `flex: 1; min-width: 220px; padding: 20px; border: 2px solid #eee; border-radius: 12px; cursor: pointer; transition: 0.2s; position: relative; overflow: hidden;`;
            
            // 裝飾線條
            const bar = document.createElement('div');
            bar.style = `height: 6px; width: 100%; background: ${choice.color}; position: absolute; top:0; left:0;`;
            
            card.innerHTML = `<h3 style="color:${choice.color}; margin-top: 10px;">${choice.level}</h3><h4 style="margin: 10px 0;">${choice.title}</h4><p style="font-size:0.9rem; color:#666;">${choice.desc}</p>`;
            card.prepend(bar);

            // 互動事件
            card.onclick = () => {
                // 清除其他卡片樣式
                document.querySelectorAll('.topic-card').forEach(c => {
                    c.style.background = 'white'; 
                    c.style.borderColor = '#eee';
                    c.style.transform = 'scale(1)';
                });
                // 凸顯當前卡片
                card.style.background = '#fffbf0';
                card.style.borderColor = choice.color;
                card.style.transform = 'scale(1.02)';
                
                // 顯示對應的詳細引導
                this.showTopicDetail(choice, container);
            };
            
            optionsDiv.appendChild(card);
        });
        container.appendChild(optionsDiv);
        
        // 預留詳情容器
        const detailContainer = document.createElement('div');
        detailContainer.id = 'topic-detail-area';
        container.appendChild(detailContainer);
    },

    showTopicDetail: function(choice, container) {
        const area = document.getElementById('topic-detail-area');
        area.innerHTML = ''; // 清空
        area.style = `margin-top:25px; padding:25px; background:#fafafa; border-radius:12px; border-left: 5px solid ${choice.color}; animation: fadeIn 0.5s;`;
        
        const guideList = choice.guides.map(g => `<li>${g}</li>`).join('');
        
        area.innerHTML = `
            <h3 style="color: ${choice.color}; margin-top:0;">📝 ${choice.title} - 寫作引導</h3>
            <ul style="color:#555; line-height: 1.8;">${guideList}</ul>
            <div style="margin-top: 20px;">
                <label style="font-weight:bold; display:block; margin-bottom:8px;">在此寫下你的段落草稿：</label>
                <textarea class="student-input" placeholder="開始寫作..." style="height: 180px;"></textarea>
            </div>
        `;
    },

    // 4. 紅包規劃 + 國七反思
    renderBudgetPlanner: function(data, container) {
        const info = document.createElement('div');
        info.innerHTML = `<p>${data.instruction}</p>`;
        
        const budgetDisplay = document.createElement('div');
        budgetDisplay.className = 'budget-display';
        budgetDisplay.innerHTML = `💰 總預算: $${data.budget} <span id="remain-val" style="font-size:0.9em; margin-left:10px; color:#27ae60;">(剩餘: $${data.budget})</span>`;
        
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="text" id="item-name" placeholder="想買什麼？" class="input-text">
            <input type="number" id="item-cost" placeholder="金額" class="input-num">
            <button id="add-item-btn" class="add-btn">➕ 新增</button>
        `;

        const listContainer = document.createElement('ul');
        listContainer.id = 'budget-list';
        listContainer.className = 'budget-list';

        // 國七反思區塊
        const reflectionDiv = document.createElement('div');
        reflectionDiv.style = "margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee;";
        reflectionDiv.innerHTML = `
            <h4 style="color: #2c3e50; margin-bottom: 10px;">🤔 (國七/進階) 深度思考：紅包的意義？</h4>
            <div style="background: #eef2f3; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-size: 0.9rem; color: #555;">
                <strong>引導問題：</strong><br>
                1. 這些錢是長輩辛苦工作換來的，我們收得理所當然嗎？<br>
                2. 有些親戚會互相比較紅包厚度，這是不是讓祝福變質了？
            </div>
            <textarea class="student-input" placeholder="寫下你的看法 (例如：我覺得紅包變成了一種比較的工具，其實...)" style="height: 100px;"></textarea>
        `;

        container.appendChild(info);
        container.appendChild(budgetDisplay);
        container.appendChild(inputGroup);
        container.appendChild(listContainer);
        container.appendChild(reflectionDiv);

        // 簡單邏輯
        let currentUsed = 0;
        setTimeout(() => {
            const addBtn = document.getElementById('add-item-btn');
            if(addBtn) {
                addBtn.onclick = () => {
                    const name = document.getElementById('item-name').value;
                    const cost = parseInt(document.getElementById('item-cost').value);
                    const remainSpan = document.getElementById('remain-val');
                    
                    if(name && cost) {
                        if(currentUsed + cost > data.budget) {
                            alert("⚠️ 預算爆表啦！請重新規劃！");
                            return;
                        }
                        currentUsed += cost;
                        const li = document.createElement('li');
                        li.innerHTML = `<span>${name}</span> <span>$${cost}</span>`;
                        document.getElementById('budget-list').appendChild(li);
                        
                        const remain = data.budget - currentUsed;
                        remainSpan.innerText = `(剩餘: $${remain})`;
                        if(remain < 0) remainSpan.style.color = 'red';
                        
                        document.getElementById('item-name').value = '';
                        document.getElementById('item-cost').value = '';
                    }
                };
            }
        }, 100);
    },

    // 5. 基礎寫作框
    renderWritingInput: function(data, container) {
        const prompt = document.createElement('div');
        prompt.className = 'writing-prompt';
        prompt.innerHTML = `💡 <strong>寫作提示：</strong><br>${data.prompt}`;

        const textArea = document.createElement('textarea');
        textArea.placeholder = data.placeholder;
        textArea.className = 'student-input';
        
        const charCount = document.createElement('div');
        charCount.style = "text-align:right; font-size:0.8rem; color:#888; margin-top:5px;";
        charCount.innerText = "字數: 0";
        
        textArea.oninput = (e) => {
            charCount.innerText = `字數: ${e.target.value.length}`;
        };

        container.appendChild(prompt);
        container.appendChild(textArea);
        container.appendChild(charCount);
    }
};