### **[업데이트 내역 - 액츄에이터 펌웨어 V1.1.0]**
- **Update Model:** All 17Lf Series
- **Version:** V1.1.0 (Dec 4, 2024)
- **Key Changes :**
	- Add "Force Off Level" (default : electric brake / optional : coast)
	- Bug fix - Improved periodical communication failure after communication fail

### Prerequisites Before Updating

업데이트를 진행하기 전, 아래 항목을 반드시 준비해주세요.
- **PC Interface:** IR-USB02 or  IR-USB03
- **Manager Software:** ** Install the new version V3.1.1**
	- [**Download New Manager Software / Update Manual**](http://www.mightyzap.com/ko/digitalarchive6/?mod=document&pageid=1&uid=211)
- 반드시 보유한 액츄에이터의 모델명에 맞는 펌웨어를 설치해야 합니다. 모델명에 주의하여 업데이트 파일을 다운로드 받아 주십시오.

### 중요 주의사항
안전하고 원활한 업데이트를 위해 아래 주의 사항을 반드시 읽어주세요.
- **설비 테스트 필수:** 기존 설비에 적용된 액츄에이터의 펌웨어를 업데이트한 경우, **반드시 설비 테스트를 다시 진행**하여 동작 특성에 문제가 없는지 확인해야 합니다.
- **정확한 모델 선택:** 보유한 액츄에이터의 **모델명과 일치하는 펌웨어**를 설치해야 합니다. 실수로 다른 펌웨어를 설치했다면, 올바른 펌웨어로 다시 업데이트를 진행하면 됩니다.
- **개별 업데이트:** 액츄에이터는 **반드시 1개씩** 업데이트해야 합니다. 여러 개를 동시에 업데이트하면 에러가 발생할 수 있습니다.
- **연결선 확인:** 업데이트 중에는 PC, 인터페이스, 액츄에이터 사이의 통신선과 전원선을 만지지 마십시오. 통신 에러가 발생하면 매뉴얼을 참고하여 재시도 바랍니다.
- **캘리브레이션 절차 변경:** V2.0 이상 버전에서는 업데이트 완료 후 `Stroke Calibration` 절차가 **생략됩니다.**

### Firmware Download

보유한 제품의 모델명을 확인 후 아래 링크에서 V1.1.0 펌웨어를 다운로드하세요.

<FirmwareSelector17Lf/>

### Release Notes (Changelog)

#### **V1.1.0 변경 사항 (2024-12-04)**
- 기능추가 : Force Off Level (default : Electric brake / Optional : Coast)
- 버그 수정 - 통신 실패 후 주기적 통신 실패 개선
#### **V1.0.3 변경 사항 (2024-09-13)**
-  ID '0'번으로는 저장되지 않도록 수정
- ID, Baudrate가 Limit 값을 벗어나서 저장을 시도할 경우, 저장이 되지 않도록 수정