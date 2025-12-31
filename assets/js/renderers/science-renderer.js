// 檔案路徑：assets/js/renderers/science-renderer.js

const ScienceRenderer = {
    renderStep: function(stepData, container) {
        container.innerHTML = ''; 

        // 標題
        if(stepData.title) {
            const header = document.createElement('h2');
            header.className = 'lesson-step-title';
            header.style.color = '#27ae60'; // 生物/理化綠
            header.innerText = stepData.title;
            container.appendChild(header);
        }

        // 1. 實驗模擬 (Lab Sim)
        if (stepData.type === 'lab_experiment') {
            this.renderExperiment(stepData, container);
        }
        // 2. 互動模型 (Interactive Model)
        else if (stepData.type === 'interactive_model') {
            this.renderModel(stepData, container);
        }
        // 純文字/圖片
        else {
            const content = document.createElement('div');
            content.className = 'lesson-content-text';
            content.innerHTML = stepData.content || '';
            container.appendChild(content);
        }
    },

    // --- 子功能：實驗點擊模擬 ---
    renderExperiment: function(data, container) {
        const box = document.createElement('div');
        box.style = "border: 2px dashed #27ae60; padding: 20px; text-align: center; background: #eafaf1; border-radius: 15px;";
        
        const statusText = document.createElement('h3');
        statusText.innerText = data.initialState;
        
        const actionBtn = document.createElement('button');
        actionBtn.innerText = data.actionBtnText;
        actionBtn.className = "action-btn";
        actionBtn.style = "background: #27ae60; margin-top: 15px;";
        
        const resultArea = document.createElement('div');
        resultArea.style = "margin-top: 20px; font-size: 3rem; transition: 0.5s;";
        resultArea.innerText = data.initialIcon || '🧪';

        actionBtn.onclick = () => {
            statusText.innerText = data.finalState;
            resultArea.innerText = data.finalIcon || '💥';
            resultArea.style.transform = "scale(1.5) rotate(10deg)";
            
            // 顯示實驗結論
            const conclusion = document.createElement('div');
            conclusion.innerHTML = `<br><strong>實驗結論：</strong> ${data.conclusion}`;
            conclusion.style.color = "#145a32";
            box.appendChild(conclusion);
            actionBtn.disabled = true; // 防止重複點擊
            actionBtn.style.opacity = 0.5;
        };

        box.appendChild(statusText);
        box.appendChild(resultArea);
        box.appendChild(actionBtn);
        container.appendChild(box);
    },

    // --- 子功能：圖文對照模型 ---
    renderModel: function(data, container) {
        const layout = document.createElement('div');
        layout.style = "display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;";
        
        const imgBlock = document.createElement('div');
        imgBlock.style = "font-size: 4rem; text-align: center;";
        imgBlock.innerText = data.icon; // 這裡也可以放真實圖片 <img src="...">
        
        const textBlock = document.createElement('div');
        textBlock.innerHTML = data.description;
        
        layout.appendChild(imgBlock);
        layout.appendChild(textBlock);
        container.appendChild(layout);
    }
};