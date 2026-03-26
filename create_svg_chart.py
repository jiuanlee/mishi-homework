#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Indonesia & Thailand Diesel Price Chart - SVG Version
No external dependencies required
"""

from datetime import datetime
import math

def create_svg_chart():
    # 印度尼西亚数据
    indo_dates = [
        datetime(2026, 1, 1),
        datetime(2026, 2, 1),
        datetime(2026, 3, 1),
        datetime(2026, 3, 16),
        datetime(2026, 3, 23)
    ]
    indo_non_sub = [13550, 13375, 14350, 14620, 14620]
    indo_sub = [6800, 6800, 6800, 6800, 6800]
    
    # 泰国数据
    thai_dates = [
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
    thai_diesel = [28.50, 28.50, 29.00, 29.00, 29.50, 29.94, 29.94, 30.44, 31.14, 31.14]
    
    # SVG 配置
    width = 1200
    height = 900
    margin = {'top': 80, 'right': 50, 'bottom': 60, 'left': 80}
    chart_width = (width - margin['left'] - margin['right']) / 2
    chart_height = (height - margin['top'] - margin['bottom']) / 2 - 20
    
    def date_to_x(date, start_date, end_date, chart_w, offset):
        total_days = (end_date - start_date).days
        if total_days == 0:
            return offset + chart_w / 2
        days_from_start = (date - start_date).days
        return offset + (days_from_start / total_days) * chart_w
    
    def price_to_y(price, min_p, max_p, chart_h, offset):
        range_p = max_p - min_p
        if range_p == 0:
            return offset + chart_h / 2
        normalized = (price - min_p) / range_p
        return offset + chart_h - (normalized * chart_h)
    
    # 开始构建 SVG
    svg_parts = []
    svg_parts.append(f'<?xml version="1.0" encoding="UTF-8"?>')
    svg_parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">')
    
    # 背景
    svg_parts.append(f'<rect width="{width}" height="{height}" fill="#f8f9fa"/>')
    
    # 标题
    svg_parts.append(f'<text x="{width/2}" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#333">')
    svg_parts.append('🇮🇩 印度尼西亚 & 🇹🇭 泰国 官方柴油价格走势图 (2026 年 1 月 -3 月)')
    svg_parts.append('</text>')
    
    svg_parts.append(f'<text x="{width/2}" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">')
    svg_parts.append('数据来源：Pertamina 官网、泰国能源部、GlobalPetrolPrices.com')
    svg_parts.append('</text>')
    
    # === 印度尼西亚图表 ===
    indo_x_offset = margin['left']
    indo_y_offset = margin['top']
    indo_end_x = indo_x_offset + chart_width
    indo_end_y = indo_y_offset + chart_height
    
    # 图表标题
    svg_parts.append(f'<text x="{indo_x_offset + chart_width/2}" y="{indo_y_offset - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#667eea">🇮🇩 印度尼西亚柴油价格 (印尼盾/升)</text>')
    
    # 网格线
    indo_min_y = 5000
    indo_max_y = 16000
    for i in range(7):
        y_pos = indo_y_offset + (i / 6) * chart_height
        price_val = indo_max_y - (i / 6) * (indo_max_y - indo_min_y)
        svg_parts.append(f'<line x1="{indo_x_offset}" y1="{y_pos}" x2="{indo_end_x}" y2="{y_pos}" stroke="#e0e0e0" stroke-width="1"/>')
        svg_parts.append(f'<text x="{indo_x_offset - 10}" y="{y_pos + 4}" text-anchor="end" font-family="Arial" font-size="10" fill="#666">{int(price_val):,}</text>')
    
    # 印尼数据线 (非补贴)
    indo_start = indo_dates[0]
    indo_end = indo_dates[-1]
    
    non_sub_points = []
    for date, price in zip(indo_dates, indo_non_sub):
        x = date_to_x(date, indo_start, indo_end, chart_width, indo_x_offset)
        y = price_to_y(price, indo_min_y, indo_max_y, chart_height, indo_y_offset)
        non_sub_points.append((x, y))
    
    # 绘制面积
    area_points = ' '.join([f'{x},{y}' for x, y in non_sub_points])
    svg_parts.append(f'<polygon points="{indo_x_offset},{indo_end_y} {area_points} {indo_end_x},{indo_end_y}" fill="rgba(102, 126, 234, 0.1)"/>')
    
    # 绘制线条
    line_points = ' '.join([f'{x},{y}' for x, y in non_sub_points])
    svg_parts.append(f'<polyline points="{line_points}" fill="none" stroke="#667eea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
    
    # 绘制数据点
    for x, y in non_sub_points:
        svg_parts.append(f'<circle cx="{x}" cy="{y}" r="6" fill="#667eea" stroke="white" stroke-width="2"/>')
    
    # 印尼补贴柴油线 (水平线)
    sub_y = price_to_y(6800, indo_min_y, indo_max_y, chart_height, indo_y_offset)
    svg_parts.append(f'<line x1="{indo_x_offset}" y1="{sub_y}" x2="{indo_end_x}" y2="{sub_y}" stroke="#28a745" stroke-width="3" stroke-dasharray="5,5"/>')
    svg_parts.append(f'<text x="{indo_end_x - 100}" y="{sub_y - 8}" font-family="Arial" font-size="11" fill="#28a745" font-weight="bold">补贴柴油 Rp 6,800 (固定)</text>')
    
    # 标注价格
    for (x, y), price in zip(non_sub_points, indo_non_sub):
        svg_parts.append(f'<text x="{x}" y="{y - 12}" text-anchor="middle" font-family="Arial" font-size="10" fill="#333">Rp {price:,}</text>')
    
    # 3 月 1 日事件标注
    mar1_x = date_to_x(datetime(2026, 3, 1), indo_start, indo_end, chart_width, indo_x_offset)
    svg_parts.append(f'<line x1="{mar1_x}" y1="{indo_y_offset}" x2="{mar1_x}" y2="{indo_end_y}" stroke="#ffc107" stroke-width="2" stroke-dasharray="3,3" opacity="0.5"/>')
    svg_parts.append(f'<text x="{mar1_x}" y="{indo_y_offset - 5}" text-anchor="middle" font-family="Arial" font-size="10" fill="#ff9800">⬆️ 3/1 涨价</text>')
    
    # X 轴
    svg_parts.append(f'<line x1="{indo_x_offset}" y1="{indo_end_y}" x2="{indo_end_x}" y2="{indo_end_y}" stroke="#333" stroke-width="2"/>')
    
    # X 轴标签
    for i, date in enumerate(indo_dates):
        x = date_to_x(date, indo_start, indo_end, chart_width, indo_x_offset)
        label = date.strftime('%m/%d')
        svg_parts.append(f'<text x="{x}" y="{indo_end_y + 20}" text-anchor="middle" font-family="Arial" font-size="11" fill="#333">{label}</text>')
    
    # === 泰国图表 ===
    thai_x_offset = margin['left'] + chart_width + 50
    thai_y_offset = margin['top']
    thai_end_x = thai_x_offset + chart_width
    thai_end_y = thai_y_offset + chart_height
    
    # 图表标题
    svg_parts.append(f'<text x="{thai_x_offset + chart_width/2}" y="{thai_y_offset - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#dc3545">🇹🇭 泰国柴油价格 (泰铢/升)</text>')
    
    # 网格线
    thai_min_y = 27
    thai_max_y = 33
    for i in range(7):
        y_pos = thai_y_offset + (i / 6) * chart_height
        price_val = thai_max_y - (i / 6) * (thai_max_y - thai_min_y)
        svg_parts.append(f'<line x1="{thai_x_offset}" y1="{y_pos}" x2="{thai_end_x}" y2="{y_pos}" stroke="#e0e0e0" stroke-width="1"/>')
        svg_parts.append(f'<text x="{thai_x_offset - 10}" y="{y_pos + 4}" text-anchor="end" font-family="Arial" font-size="10" fill="#666">{price_val:.2f}</text>')
    
    # 泰国数据线
    thai_start = thai_dates[0]
    thai_end = thai_dates[-1]
    
    thai_points = []
    for date, price in zip(thai_dates, thai_diesel):
        x = date_to_x(date, thai_start, thai_end, chart_width, thai_x_offset)
        y = price_to_y(price, thai_min_y, thai_max_y, chart_height, thai_y_offset)
        thai_points.append((x, y))
    
    # 绘制面积
    area_points = ' '.join([f'{x},{y}' for x, y in thai_points])
    svg_parts.append(f'<polygon points="{thai_x_offset},{thai_end_y} {area_points} {thai_end_x},{thai_end_y}" fill="rgba(220, 53, 69, 0.1)"/>')
    
    # 绘制线条
    line_points = ' '.join([f'{x},{y}' for x, y in thai_points])
    svg_parts.append(f'<polyline points="{line_points}" fill="none" stroke="#dc3545" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
    
    # 绘制数据点
    for x, y in thai_points:
        svg_parts.append(f'<circle cx="{x}" cy="{y}" r="5" fill="#dc3545" stroke="white" stroke-width="2"/>')
    
    # 标注价格
    for (x, y), price in zip(thai_points, thai_diesel):
        svg_parts.append(f'<text x="{x}" y="{y - 8}" text-anchor="middle" font-family="Arial" font-size="9" fill="#333">฿{price:.2f}</text>')
    
    # 事件标注
    # 3 月 3 日限价
    mar3_x = date_to_x(datetime(2026, 3, 3), thai_start, thai_end, chart_width, thai_x_offset)
    svg_parts.append(f'<line x1="{mar3_x}" y1="{thai_y_offset}" x2="{mar3_x}" y2="{thai_end_y}" stroke="#9c27b0" stroke-width="2" stroke-dasharray="3,3" opacity="0.5"/>')
    svg_parts.append(f'<text x="{mar3_x}" y="{thai_y_offset - 5}" text-anchor="middle" font-family="Arial" font-size="9" fill="#9c27b0">📌 3/3 限价</text>')
    
    # 3 月 18 日涨价
    mar18_x = date_to_x(datetime(2026, 3, 18), thai_start, thai_end, chart_width, thai_x_offset)
    svg_parts.append(f'<line x1="{mar18_x}" y1="{thai_y_offset}" x2="{mar18_x}" y2="{thai_end_y}" stroke="#ff9800" stroke-width="2" stroke-dasharray="3,3" opacity="0.5"/>')
    svg_parts.append(f'<text x="{mar18_x}" y="{thai_y_offset - 5}" text-anchor="middle" font-family="Arial" font-size="9" fill="#ff9800">⬆️ 3/18</text>')
    
    # 3 月 21 日涨价
    mar21_x = date_to_x(datetime(2026, 3, 21), thai_start, thai_end, chart_width, thai_x_offset)
    svg_parts.append(f'<line x1="{mar21_x}" y1="{thai_y_offset}" x2="{mar21_x}" y2="{thai_end_y}" stroke="#f44336" stroke-width="2" stroke-dasharray="3,3" opacity="0.5"/>')
    svg_parts.append(f'<text x="{mar21_x}" y="{thai_y_offset - 5}" text-anchor="middle" font-family="Arial" font-size="9" fill="#f44336">⬆️ 3/21</text>')
    
    # X 轴
    svg_parts.append(f'<line x1="{thai_x_offset}" y1="{thai_end_y}" x2="{thai_end_x}" y2="{thai_end_y}" stroke="#333" stroke-width="2"/>')
    
    # X 轴标签 (只显示部分)
    thai_labels = [0, 2, 4, 6, 7, 8, 9]  # 索引
    for i in thai_labels:
        if i < len(thai_dates):
            x = date_to_x(thai_dates[i], thai_start, thai_end, chart_width, thai_x_offset)
            label = thai_dates[i].strftime('%m/%d')
            svg_parts.append(f'<text x="{x}" y="{thai_end_y + 20}" text-anchor="middle" font-family="Arial" font-size="10" fill="#333">{label}</text>')
    
    # === 图例 ===
    legend_y = height - 35
    svg_parts.append(f'<rect x="{margin['left']}" y="{legend_y - 15}" width="15" height="15" fill="rgba(102, 126, 234, 0.3)" stroke="#667eea" stroke-width="2"/>')
    svg_parts.append(f'<text x="{margin['left'] + 20}" y="{legend_y - 3}" font-family="Arial" font-size="11" fill="#333">印尼非补贴柴油</text>')
    
    svg_parts.append(f'<line x1="{margin['left'] + 150}" y1="{legend_y - 7}" x2="{margin['left'] + 180}" y2="{legend_y - 7}" stroke="#28a745" stroke-width="3" stroke-dasharray="5,5"/>')
    svg_parts.append(f'<text x="{margin['left'] + 185}" y="{legend_y - 3}" font-family="Arial" font-size="11" fill="#333">印尼补贴柴油 (固定)</text>')
    
    svg_parts.append(f'<rect x="{margin['left'] + 400}" y="{legend_y - 15}" width="15" height="15" fill="rgba(220, 53, 69, 0.3)" stroke="#dc3545" stroke-width="2"/>')
    svg_parts.append(f'<text x="{margin['left'] + 420}" y="{legend_y - 3}" font-family="Arial" font-size="11" fill="#333">泰国柴油</text>')
    
    # === 说明框 ===
    info_box_x = margin['left']
    info_box_y = height - 80
    info_box_w = width - margin['left'] - margin['right']
    info_box_h = 60
    
    svg_parts.append(f'<rect x="{info_box_x}" y="{info_box_y}" width="{info_box_w}" height="{info_box_h}" fill="#fff3cd" stroke="#ffc107" stroke-width="2" rx="5"/>')
    svg_parts.append(f'<text x="{info_box_x + 10}" y="{info_box_y + 20}" font-family="Arial" font-size="11" font-weight="bold" fill="#856404">📝 说明:</text>')
    svg_parts.append(f'<text x="{info_box_x + 10}" y="{info_box_y + 38}" font-family="Arial" font-size="10" fill="#856404">• 印尼补贴柴油价格由政府固定 (Rp 6,800/升) • 泰国柴油价格由能源部石油燃料基金管理委员会定期调整</text>')
    svg_parts.append(f'<text x="{info_box_x + 10}" y="{info_box_y + 55}" font-family="Arial" font-size="10" fill="#856404">• 3 月中东冲突导致全球油价上涨，两国均面临调价压力 • 数据截至 2026 年 3 月 23 日</text>')
    
    svg_parts.append('</svg>')
    
    return '\n'.join(svg_parts)

# 生成 SVG
svg_content = create_svg_chart()

# 保存文件
output_path = '/home/rocky/.openclaw/workspace/diesel_price_chart_2026.svg'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f'SVG 图表已保存至：{output_path}')
print(f'文件大小：{len(svg_content)} 字节')
