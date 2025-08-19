import os
import yaml

# --- 설정 (이 부분을 필요에 맞게 수정하세요) ---

# 1. 마크다운 문서를 검사할 최상위 폴더 목록
ROOT_DOCS_DIRS = ['docs', 'en']  # <-- 검사할 폴더 목록을 리스트로 지정

# 2. 생성될 설정 파일 이름
OUTPUT_YAML_FILE = 'generated_config.yml'

# 3. 모든 컬렉션에 공통으로 적용될 필드 구조
COMMON_FIELDS = [
    {'label': '파일명 (URL, 영문)', 'name': 'slug', 'widget': 'string'},
    {'label': '문서 제목', 'name': 'title', 'widget': 'string'},
    {'label': '버전', 'name': 'version', 'widget': 'string', 'required': False},
    {'label': '최종 수정일', 'name': 'last_updated', 'widget': 'datetime', 'required': False},
    {'label': '본문', 'name': 'body', 'widget': 'markdown'}
]

# ----------------------------------------------------


def find_markdown_folders(root_dirs):
    """지정된 여러 루트 디렉토리에서 마크다운 파일이 있는 폴더를 모두 찾습니다."""
    all_target_dirs = set() # 중복 방지를 위해 set 사용
    for root_dir in root_dirs:
        if not os.path.isdir(root_dir):
            print(f"경고: '{root_dir}' 폴더를 찾을 수 없습니다. 건너뜁니다.")
            continue
            
        for dirpath, _, filenames in os.walk(root_dir):
            if any(fname.endswith('.md') for fname in filenames):
                all_target_dirs.add(dirpath)
    return sorted(list(all_target_dirs))


def generate_decap_config(target_dirs):
    """폴더 목록을 기반으로 Decap CMS collections 설정을 생성합니다."""
    if not target_dirs:
        print("검사할 폴더 목록에서 마크다운 파일을 찾을 수 없습니다.")
        return None

    collections = []
    for i, dir_path in enumerate(target_dirs):
        clean_path = dir_path.replace('\\', '/')
        collection_name = clean_path.replace('/', '_')
        collection_label = clean_path 

        collection_item = {
            'name': collection_name,
            'label': collection_label,
            'folder': clean_path,
            'summary': '{{title}} ({{slug}})', # <-- ✅ 이 줄을 추가하여 목록 제목(summary)을 설정합니다.
            'create': True,
            'slug': '{{slug}}',
            'extension': 'md',
            'nested': {'depth': 100},
            'media_folder': '',
            'public_folder': ''
        }
        
        if i == 0:
            collection_item['fields'] = COMMON_FIELDS
        else:
            collection_item['fields'] = 'PLACEHOLDER_FOR_ALIAS'

        collections.append(collection_item)

    config = {
        'backend': {'name': 'git-gateway', 'branch': 'main'},
        'media_folder': 'public/assets/images', # 기본 업로드 경로
        'public_folder': '/assets/images',
        'collections': collections
    }
    return config


def main():
    """메인 실행 함수"""
    print(f"'{', '.join(ROOT_DOCS_DIRS)}' 폴더들을 스캔하여 Decap CMS 설정을 생성합니다...")
    
    target_dirs = find_markdown_folders(ROOT_DOCS_DIRS)
    config_data = generate_decap_config(target_dirs)
    
    if config_data:
        yaml_string = yaml.dump(config_data, allow_unicode=True, sort_keys=False, indent=2)

        first_fields_block = yaml.dump({'fields': COMMON_FIELDS}, indent=2, sort_keys=False)
        replacement_anchor_block = "fields: &manual_fields" + first_fields_block[len("fields:"):]
        final_yaml_string = yaml_string.replace(first_fields_block, replacement_anchor_block, 1)

        final_yaml_string = final_yaml_string.replace("fields: PLACEHOLDER_FOR_ALIAS", "fields: *manual_fields")
        
        print("\n--- 생성된 config.yml 내용 ---")
        print(final_yaml_string)
        
        with open(OUTPUT_YAML_FILE, 'w', encoding='utf-8') as f:
            f.write(final_yaml_string)
        print(f"\n✅ 성공! 결과가 '{OUTPUT_YAML_FILE}' 파일에 저장되었습니다.")


if __name__ == '__main__':
    main()