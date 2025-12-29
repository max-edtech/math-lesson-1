#!/bin/bash

# --- 設定區 ---
# 這裡可以改成你預設想傳達的訊息
DEFAULT_MSG="內容優化與教材更新"
# ----------------

echo "🚀 STEM INSIGHT 部署系統啟動..."
echo "--------------------------------"

# 1. 加入所有檔案
git add .

# 2. 詢問提交訊息 (如果直接按 Enter，就使用預設訊息)
read -p "📝 請輸入更新備註 (直接按 Enter 則使用預設值): " user_msg

# 判斷使用者有沒有輸入
if [ -z "$user_msg" ]; then
    COMMIT_MSG="$DEFAULT_MSG"
else
    COMMIT_MSG="$user_msg"
fi

# 3. 提交
echo "📦 正在打包：$COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 4. 推送
echo "☁️  正在推送到 GitHub..."
git push

echo "--------------------------------"
echo "✅ 部署完成！"
echo "🌍 你的網站將在 1-2 分鐘後更新。"