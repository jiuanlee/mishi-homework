#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Indonesia & Thailand Diesel Price Chart (Jan-Mar 2026)
数据来源：Pertamina 官网、泰国能源部、GlobalPetrolPrices.com
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime
import numpy as np

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'DejaVu Sans', 'SimHei', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# 印度尼西亚柴油价格数据 (印尼盾/升)
# 补贴柴油 (Solar) 价格固定
indonesia_dates = [
    datetime(2026, 1, 1),
    datetime(2026, 2, 1),
    datetime(2026, 3, 1),
    datetime(2026, 3, 16),
    datetime(2026, 3, 23)
]

# 非补贴柴油价格 (Dexlite/Pertamina Dex 平均)
indonesia_non_subsidized = [13550, 13375, 14350, 14620, 14620]

# 补贴柴油价格 (固定)
indonesia_subsidized = [6800, 6800, 6800, 6800, 6800]

# 泰国柴油价格数据 (泰铢/升)
thailand_dates = [
    datetime(2026, 1, 1),
    datetime(2026, 1, 15),
    datetime(2026, 2, 1),
    datetime(2026, 2, 15),
    datetime(2026, 3, 1),
    datetime(2026, 3, 10),
    datetime(2026, 3, 17),
    datetime(2026, 3, 18),
    datetime(2026, 3, 21),
    datetime(2026, 3, 23)
]

# 泰国柴油价格 (零售价格，有政府补贴)
thailand_diesel = [
    28.50,  # 1 月 1 日 (估算)
    28.50,  # 1 月 15 日
    29.00,  # 2 月 1 日
    29.00,  # 2 月 15 日
    29.50,  # 3 月 1 日
    29.94,  # 3 月 10 日 (政府限价)
    29.94,  # 3 月 17 日
    30.44,  # 3 月 18 日 (上涨 0.50)
    31.14,  # 3 月 21 日 (上涨 0.70)
    31.14   # 3 月 23 日
]

# 创建图表
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
fig.suptitle('🇮🇩 印度尼西亚 & 🇹🇭 泰国 官方柴油价格走势图 (2026 年 1 月 -3 月)\n数据来源：Pertamina 官网、泰国能源部、GlobalPetrolPrices.com', 
             fontsize=14, fontweight='bold')

# === 图表 1: 印度尼西亚 ===
ax1.plot(indonesia_dates, indonesia_non_subsidized, 'b-o', linewidth=2, markersize=8, label='非补贴柴油 (Dexlite/Pertamina Dex)')
ax1.plot(indonesia_dates, indonesia_subsidized, 'g-s', linewidth=2, markersize=8, label='补贴柴油 (Solar) - 政府固定价格')

# 标注关键事件
ax1.axvline(datetime(2026, 3, 1), color='orange', linestyle='--', alpha=0.5, label='3 月 1 日价格上涨')
ax1.text(datetime(2026, 3, 1), 15000, '⬆️ 3 月 1 日\n全球油价上涨', fontsize=9, ha='center', color='orange')

ax1.set_title('🇮🇩 印度尼西亚柴油价格 (印尼盾 IDR/升)', fontsize=12, fontweight='bold')
ax1.set_xlabel('日期', fontsize=10)
ax1.set_ylabel('价格 (印尼盾/升)', fontsize=10)
ax1.legend(loc='upper left', fontsize=9)
ax1.grid(True, alpha=0.3)
ax1.set_axisbelow(True)

# 格式化 x 轴日期
ax1.xaxis.set_major_formatter(mdates.DateFormatter('%m/%d'))
ax1.xaxis.set_major_locator(mdates.DayLocator(interval=15))
plt.setp(ax1.xaxis.get_majorticklabels(), rotation=45, ha='right')

# 在数据点上标注价格
for i, (date, price) in enumerate(zip(indonesia_dates, indonesia_non_subsidized)):
    ax1.annotate(f'Rp {price:,}', xy=(date, price), xytext=(0, 10),
                textcoords='offset points', ha='center', fontsize=8)

for i, (date, price) in enumerate(zip(indonesia_dates, indonesia_subsidized)):
    ax1.annotate(f'Rp {price:,}', xy=(date, price), xytext=(0, -15),
                textcoords='offset points', ha='center', fontsize=8, color='green')

# === 图表 2: 泰国 ===
ax2.plot(thailand_dates, thailand_diesel, 'r-o', linewidth=2, markersize=6, label='柴油 (Diesel B7)')

# 标注关键事件
ax2.axvline(datetime(2026, 3, 3), color='purple', linestyle='--', alpha=0.5)
ax2.text(datetime(2026, 3, 3), 32, '📌 3 月 3 日\n政府限价 29.94 泰铢', fontsize=9, ha='center', color='purple')

ax2.axvline(datetime(2026, 3, 18), color='orange', linestyle='--', alpha=0.5)
ax2.text(datetime(2026, 3, 18), 31.5, '⬆️ 3 月 18 日\n上涨至 30.44 泰铢', fontsize=9, ha='center', color='orange')

ax2.axvline(datetime(2026, 3, 21), color='red', linestyle='--', alpha=0.5)
ax2.text(datetime(2026, 3, 21), 32, '⬆️ 3 月 21 日\n上涨至 31.14 泰铢', fontsize=9, ha='center', color='red')

ax2.set_title('🇹🇭 泰国柴油价格 (泰铢 THB/升)', fontsize=12, fontweight='bold')
ax2.set_xlabel('日期', fontsize=10)
ax2.set_ylabel('价格 (泰铢/升)', fontsize=10)
ax2.legend(loc='upper left', fontsize=9)
ax2.grid(True, alpha=0.3)
ax2.set_axisbelow(True)

# 格式化 x 轴日期
ax2.xaxis.set_major_formatter(mdates.DateFormatter('%m/%d'))
ax2.xaxis.set_major_locator(mdates.DayLocator(interval=15))
plt.setp(ax2.xaxis.get_majorticklabels(), rotation=45, ha='right')

# 在数据点上标注价格
for date, price in zip(thailand_dates, thailand_diesel):
    ax2.annotate(f'฿{price:.2f}', xy=(date, price), xytext=(0, 8),
                textcoords='offset points', ha='center', fontsize=7)

# 设置 y 轴范围
ax2.set_ylim(27, 33)

# 添加说明文本框
props = dict(boxstyle='round', facecolor='wheat', alpha=0.5)
textstr = ('📝 说明:\n'
           '• 印尼补贴柴油价格由政府固定 (Rp 6,800/升)\n'
           '• 泰国柴油价格由能源部石油燃料基金管理委员会定期调整\n'
           '• 3 月中东冲突导致全球油价上涨，两国均面临调价压力\n'
           '• 数据截至 2026 年 3 月 23 日')
fig.text(0.02, 0.02, textstr, fontsize=9, verticalalignment='bottom',
         bbox=props, fontfamily='monospace')

plt.tight_layout()

# 保存图表
output_path = '/home/rocky/.openclaw/workspace/indonesia_thailand_diesel_price_chart_2026.png'
plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
print(f'图表已保存至：{output_path}')

# 也保存为 PDF 格式
pdf_path = '/home/rocky/.openclaw/workspace/indonesia_thailand_diesel_price_chart_2026.pdf'
plt.savefig(pdf_path, bbox_inches='tight', facecolor='white')
print(f'PDF 已保存至：{pdf_path}')

plt.show()
