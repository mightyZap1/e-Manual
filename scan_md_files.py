import os
import json

def create_file_tree_structure(start_path):
    """
    지정된 경로의 마크다운 파일 구조를 읽어 객체 리스트를 생성합니다.
    - 'index.md' 파일은 제외합니다.
    - keywords는 전체 경로를 포함합니다.
    - label은 오직 파일명으로만 생성합니다.
    """
    file_structure_list = []
    if not os.path.isdir(start_path):
        print(f"오류: '{start_path}' 폴더를 찾을 수 없습니다.")
        return []

    for root, _, files in os.walk(start_path):
        for file in files:
            if file.endswith('.md') and file.lower() != 'index.md':
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, start_path)
                path_without_ext, _ = os.path.splitext(relative_path)
                
                link = '/' + path_without_ext.replace(os.sep, '/')
                keywords = path_without_ext.split(os.sep)
                
                label_text = ''
                if keywords:
                    label_text = keywords[-1].replace('_', ' ').title()

                file_structure_list.append({
                    'keyword': keywords,
                    'link': link,
                    'label': label_text
                })
    return file_structure_list

def format_to_js_array_string(data_list):
    """
    파일 구조 리스트를 'const modelData = [...]' 형식의 문자열로 변환합니다.
    """
    string_parts = ["const modelData = ["]
    for item in data_list:
        # ⭐ 변경점: json.dumps에 ensure_ascii=False 옵션 추가
        keyword_str = json.dumps(item['keyword'], ensure_ascii=False) 
        
        link_str = f"'{item['link']}'"
        label_str = f"'{item['label']}'"
        line = f"  {{ keywords: {keyword_str}, link: {link_str}, label: {label_str} }},"
        string_parts.append(line)
    
    if len(string_parts) > 1:
      string_parts[-1] = string_parts[-1][:-1]

    string_parts.append("];")
    return "\n".join(string_parts)

# --- 메인 코드 실행 부분 ---
if __name__ == "__main__":
    target_folder = 'docs'
    output_filename = 'output.txt'
    
    scanned_data = create_file_tree_structure(target_folder)
    
    if scanned_data:
        # 파일 저장 시 인코딩은 이전부터 'utf-8'로 올바르게 설정되어 있었습니다.
        formatted_string = format_to_js_array_string(scanned_data)
        with open(output_filename, 'w', encoding='utf-8') as f:
            f.write(formatted_string)
        print(f"✅ 성공! 한글 인코딩 문제를 해결하여 '{output_filename}' 파일에 저장했습니다.")
    else:
        print(f"처리할 파일이 없거나 '{target_folder}' 폴더를 찾을 수 없습니다.")