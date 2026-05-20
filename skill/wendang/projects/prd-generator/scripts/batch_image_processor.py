#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量图片处理器
用于解压ZIP包、扫描图片文件、生成图片列表报告
"""

import os
import sys
import json
import zipfile
import argparse
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple


def extract_zip(zip_path: str, extract_dir: str) -> Tuple[bool, str]:
    """
    解压ZIP文件到指定目录
    
    Args:
        zip_path: ZIP文件路径
        extract_dir: 解压目标目录
        
    Returns:
        (成功标志, 消息)
    """
    try:
        if not os.path.exists(zip_path):
            return False, f"ZIP文件不存在: {zip_path}"
        
        # 创建解压目录
        os.makedirs(extract_dir, exist_ok=True)
        
        # 解压文件
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        return True, f"成功解压到: {extract_dir}"
    except Exception as e:
        return False, f"解压失败: {str(e)}"


def scan_images(directory: str) -> List[Dict]:
    """
    扫描目录中的所有图片文件
    
    Args:
        directory: 要扫描的目录
        
    Returns:
        图片文件信息列表
    """
    supported_formats = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}
    images = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_ext = os.path.splitext(file)[1].lower()
            
            if file_ext in supported_formats:
                # 获取文件大小（MB）
                file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
                
                # 推断图片类型（基于文件名）
                image_type = infer_image_type(file)
                
                images.append({
                    'file_name': file,
                    'file_path': file_path,
                    'relative_path': os.path.relpath(file_path, directory),
                    'file_size_mb': round(file_size_mb, 2),
                    'file_extension': file_ext,
                    'inferred_type': image_type
                })
    
    return images


def infer_image_type(file_name: str) -> str:
    """
    根据文件名推断图片类型
    
    Args:
        file_name: 文件名
        
    Returns:
        图片类型描述
    """
    file_name_lower = file_name.lower()
    
    # 流程图关键词
    flow_keywords = ['流程', 'flow', 'process', 'workflow', '流转']
    for keyword in flow_keywords:
        if keyword in file_name_lower:
            return '流程图'
    
    # 原型图/线框图关键词
    prototype_keywords = ['原型', 'prototype', '线框', 'wireframe', '低保真', 'mock', '草图']
    for keyword in prototype_keywords:
        if keyword in file_name_lower:
            return '原型图/线框图'
    
    # 界面设计图关键词
    ui_keywords = ['界面', 'ui', '设计', 'design', '高保真', '视觉', 'visual', '页面', 'page', 'screen']
    for keyword in ui_keywords:
        if keyword in file_name_lower:
            return '界面设计图'
    
    return '未分类'


def generate_image_report(images: List[Dict], report_path: str) -> bool:
    """
    生成图片列表报告（JSON格式）
    
    Args:
        images: 图片信息列表
        report_path: 报告文件路径
        
    Returns:
        成功标志
    """
    try:
        report = {
            'total_images': len(images),
            'generated_at': datetime.now().isoformat(),
            'images': images
        }
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        return True
    except Exception as e:
        print(f"生成报告失败: {str(e)}", file=sys.stderr)
        return False


def create_result_directory(output_dir: str, result_dir_name: str) -> str:
    """
    创建解析结果目录
    
    Args:
        output_dir: 输出根目录
        result_dir_name: 结果目录名称
        
    Returns:
        结果目录完整路径
    """
    result_dir = os.path.join(output_dir, result_dir_name)
    os.makedirs(result_dir, exist_ok=True)
    return result_dir


def main():
    parser = argparse.ArgumentParser(description='批量图片处理器 - 解压ZIP包并生成图片列表报告')
    parser.add_argument('--zip_path', required=True, help='ZIP文件路径')
    parser.add_argument('--output_dir', default='.', help='输出根目录（默认：当前目录）')
    parser.add_argument('--extract_dir_name', default='extracted_images', help='解压目录名（默认：extracted_images）')
    parser.add_argument('--result_dir_name', default='image_analysis_results', help='解析结果目录名（默认：image_analysis_results）')
    parser.add_argument('--report_name', default='image_list_report.json', help='图片列表报告文件名（默认：image_list_report.json）')
    
    args = parser.parse_args()
    
    # 构建完整路径
    extract_dir = os.path.join(args.output_dir, args.extract_dir_name)
    result_dir = os.path.join(args.output_dir, args.result_dir_name)
    report_path = os.path.join(args.output_dir, args.report_name)
    
    print("=" * 60)
    print("批量图片处理器")
    print("=" * 60)
    
    # 步骤1：解压ZIP文件
    print("\n[步骤1] 解压ZIP文件...")
    success, message = extract_zip(args.zip_path, extract_dir)
    print(message)
    
    if not success:
        print("\n处理失败，程序退出")
        return 1
    
    # 步骤2：扫描图片文件
    print("\n[步骤2] 扫描图片文件...")
    images = scan_images(extract_dir)
    print(f"发现 {len(images)} 张图片")
    
    if len(images) == 0:
        print("未发现支持的图片文件")
        return 0
    
    # 步骤3：创建解析结果目录
    print("\n[步骤3] 创建解析结果目录...")
    create_result_directory(args.output_dir, args.result_dir_name)
    print(f"创建目录: {result_dir}")
    
    # 步骤4：生成图片列表报告
    print("\n[步骤4] 生成图片列表报告...")
    if generate_image_report(images, report_path):
        print(f"报告已生成: {report_path}")
    else:
        print("报告生成失败")
        return 1
    
    # 输出图片列表概览
    print("\n" + "=" * 60)
    print("图片列表概览")
    print("=" * 60)
    for idx, img in enumerate(images, 1):
        print(f"\n{idx}. {img['file_name']}")
        print(f"   路径: {img['relative_path']}")
        print(f"   大小: {img['file_size_mb']} MB")
        print(f"   推断类型: {img['inferred_type']}")
    
    # 输出下一步指引
    print("\n" + "=" * 60)
    print("下一步操作")
    print("=" * 60)
    print(f"1. 图片列表报告: {report_path}")
    print(f"2. 图片解压目录: {extract_dir}")
    print(f"3. 解析结果目录: {result_dir}")
    print("\n请使用智能体逐个解析图片，并将结果保存到解析结果目录中")
    print(f"解析结果文件命名格式: {{原图片名}}_analysis.md")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
