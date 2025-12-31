// 檔案路徑：assets/js/renderers/math-renderer.js

const MathRenderer = {
    renderStep: function(stepData, container) {
        container.innerHTML = ''; 

        // 標題
        if(stepData.title) {
            const header = document.createElement('h2');
            header.className = 'lesson-step-title';
            header.style.color = '#2980b9'; // 數學藍
            header.innerText = stepData.title;
            container.appendChild(header);
        }

        // 1. 幾何/圖像展示 (Visualizer)
        if (stepData.type === 'visual_concept') {
            this.renderVisualizer(stepData, container);
        }
        // 2. 逐步解題 (Step Solver)
        else if (stepData.type === 'step_solver') {
            this.renderStepSolver(stepData, container);
        }
        // 3. 互動練習題 (Practice)
        else if (stepData.type === 'interactive_quiz') {
            this.renderQuiz(stepData, container);
        }
        // 純文字說明
        else {
            const content = document.createElement('div');
            content.className = 'lesson-content-text';
            content.innerHTML = stepData.content || '';
            container.appendChild(content);
        }
    },

    // --- 子功能：圖像化概念 ---
    renderVisualizer: function(data, container) {
        const wrapper = document.createElement('div');
        wrapper.style = "text-align:center; padding: 20px; background: #f0f8ff; border-radius: 12px;";
        
        // 這裡未來可以換成 Canvas 或 SVG 動畫
        // 目前先用 emoji 或圖片模擬
        const visual = document.createElement('div');
        visual.style = "font-size: 5rem; margin-bottom: 10px;";
        visual.innerHTML = data.icon || '📐';
        
        const desc = document.createElement('p');
        desc.innerHTML = data.description;
        
        wrapper.appendChild(visual);
        wrapper.appendChild(desc);
        container.appendChild(wrapper);
    },

    // --- 子功能：逐步解題驗證 ---
    renderStepSolver: function(data, container) {
        const instruction = document.createElement('p');
        instruction.innerHTML = `<strong>題目：</strong> ${data.question}`;
        container.appendChild(instruction);

        const inputGroup = document.createElement('div');
        inputGroup.style = "display: flex; gap: 10px; align-items: center; margin-top: 15px;";
        
        const label = document.createElement('span');
        label.innerText = data.prefix || "答：";
        
        const input = document.createElement('input');
        input.type = "text";
        input.className = "student-input"; // 共用樣式
        input.style = "height: 40px; width: 150px;";
        
        const checkBtn = document.createElement('button');
        checkBtn.innerText = "驗算";
        checkBtn.className = "action-btn"; // 共用樣式
        checkBtn.style = "width: auto; background: #2980b9;";

        const feedback = document.createElement('div');
        feedback.style = "margin-top: 10px; font-weight: bold;";

        checkBtn.onclick = () => {
            if(input.value.trim() == data.answer) {
                feedback.innerText = "✅ 正確！邏輯通順！";
                feedback.style.color = "green";
            } else {
                feedback.innerText = `❌ 再試試看！提示：${data.hint}`;
                feedback.style.color = "red";
            }
        };

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        inputGroup.appendChild(checkBtn);
        container.appendChild(inputGroup);
        container.appendChild(feedback);
    },
    
    // --- 子功能：選擇題 ---
    renderQuiz: function(data, container) {
        const question = document.createElement('p');
        question.innerText = data.question;
        container.appendChild(question);
        
        data.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.innerText = opt;
            btn.style = "display:block; width:100%; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background:white; cursor:pointer;";
            btn.onclick = () => {
                if(idx === data.correctIdx) {
                    btn.style.background = "#d5f5e3";
                    btn.innerText += " (⭕ 正確)";
                } else {
                    btn.style.background = "#fadbd8";
                    btn.innerText += " (❌)";
                }
            };
            container.appendChild(btn);
        });
    }
};