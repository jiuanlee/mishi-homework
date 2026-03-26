#!/bin/bash
echo "======================================"
echo "WSL2 systemd + OpenClaw 验证脚本"
echo "======================================"
echo ""

echo "1. 检查 systemd 状态："
if systemctl --user status >/dev/null 2>&1; then
    echo "   ✅ systemd 已启动"
else
    echo "   ❌ systemd 未启动"
    echo "   解决：在 Windows PowerShell 执行 'wsl --shutdown'，然后重新打开 WSL"
    exit 1
fi

echo ""
echo "2. 检查 Gateway 状态："
if openclaw gateway status 2>&1 | grep -q "Listening"; then
    echo "   ✅ Gateway 运行中"
else
    echo "   ⚠️ Gateway 未运行，尝试启动..."
    openclaw gateway start
fi

echo ""
echo "3. 检查浏览器状态："
BROWSER_STATUS=$(openclaw browser --browser-profile openclaw status 2>&1)
if echo "$BROWSER_STATUS" | grep -q "running.*true"; then
    echo "   ✅ 浏览器已就绪"
elif echo "$BROWSER_STATUS" | grep -q "enabled.*true"; then
    echo "   ⚠️ 浏览器已启用但未运行，尝试启动..."
    openclaw browser --browser-profile openclaw start
else
    echo "   ❌ 浏览器不可用"
fi

echo ""
echo "======================================"
echo "验证完成！"
echo "======================================"
