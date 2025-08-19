---
slug: EZ_Controller(CT-01)_Manual.md
title: EZ_Controller(CT-01)_Manual
modified: 
version:
---
# 1 개 요
Arduino 기반의 EZ Controller는 mightyZAP 리니어 액츄에이터를 손쉽게 동작 / 테스트해보기 위한 컨트롤러입니다.

**EZ Controller의 특징은 다음과 같습니다.**
- 제품 구매 시 이미 내장되어 있는 기본 프로그램을 이용하여 보드 상의 여러 입력 장치를 통해 리니어 액츄에이터를 간단히 손 쉽게 동작시킬 수 있습니다.
- 당사가 제공한 다양한 예제 프로그램을 이용하거나, 아두이노 프로그램을 통해서 원하는 프로그램을 자유롭게 직접 만들어, 원하는 동작을 만들어낼 수도 있으며, 목적에 맞는 다양한 제어가 가능합니다.
- 다양한 기능의 외부 악세서리들이 연결 가능한 구조입니다.
- MightyZAP 리니어액츄에이터를 제어하기 위한 별도의 회로 구성이 필요 없으며 역극성 방지, 과전류 방지, 정전기 방지 등 전원 보호회로가 내장되어 있어 안전하게 사용하실 수 있습니다.
## 1.1 사용 시 주의 사항
아래 주의사항은 사용시 각별히 주의를 요하는 사항이므로, 반드시 숙지를 하여 주십시오. 아래 사항을 준수하지 못해 발생한 문제에 대해서는 보증 서비스를 받을 수 없음을 알려드립니다.
1. 제품 연결 시 **무리한 힘으로 결합하지 마십시오**. 또한, 소자 또는 외부로 돌출  
    된 핀에 무리한 힘을 가하지 마십시오. 고장의 원인이 됩니다.
2. 절연이 되어 있지 않은 금속판 위에서 전원 연결 시 단락이 될 수 있습니다.  
   반드시 **동봉된 플라스틱 서포트를 기판에 장착 후 사용하여 주시기 바랍니다**.  
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_b4f9c252.png)  
   **단락방지를 위해 사용 전 반드시 동봉된 플라스틱 서포트 장착**

3. 이지 컨트롤러에 인가된 전압이 연결 액츄에이터에 바로 인가 되므로, 액츄에이터의 구동 전압범위를 확인하시고 **전원 연결 시 극성을 확인하십시오**.
   예) 입력 전압 범위가 6.5V – 8.9V인 7.4V 인가 전압의 액츄에이터(D7또는 L7계열) 연결 시, 실수로 12V전원을 연결하면 액츄에이터가 구동을 하지 않고  파손 위험이 있습니다.
4. 이지 컨트롤러에 **전원 인가 시 꼭 메인 전원 입력 단자를 통해 공급하십시오****.**
5. 이지 컨트롤러에 **배터리를 전원 공급원으로 사용하지 마십시오****.**
6. 제품에 액츄에이터 연결 시 **핀의 극성을 꼭 확인하고 결합하십시오**.  
    극성이 바뀔 경우 모터 손상의 원인이 됩니다
7. **알맞은 규격의 커넥터를 사용하십시오**. 액츄에이터와 연결 시 오삽에 따른 제품 파손의 위험이 있습니다.
8. **각 단자에 용도에 맞는 입력을 넣어주십시오**. 오동작의 원인이 됩니다.  
    알맞은 전압레벨의 신호단자와 전원/신호 단자의 혼란에 유의 하십시오.
9. 로드의 시작 및 종료 지점을 설정하기 위한 **가변저항의 노브를 과도하게 많이 돌리지 마십시오**.
10. 제품을 화기, 물기, 먼지, 기름으로부터 멀리하십시오.
11. 본 제품은 실내용도로 설계된 제품입니다. 실외에서의 사용은 최대한 자제하여 주십시오.
12. 어린이의 손이 닿지 않는 곳에 제품을 보관하십시오.  
## 1.2 적절한 보관  
아래와 같은 극한환경에서 제품을 사용하거나 보관하지 마십시오. 오작동이나 제품의 파손을 불러올 수 있습니다.  
- 섭씨 60도 이상의 고온환경 또는 섭씨영하 20도의 극저온환경    
- 직사광선 또는 화기근처    
- 고온다습하고 먼지가 많은 장소    
- 진동이 심한 장소    
- 정전기를 유발할 수 있는 장소    
# 2 제품 기능 및 기본동작
# 2.1제품 기능 설명
  
- **EZ Controller** **구성 부품 및 설명**
  ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_377eee1.png)  
>[!note] 참고
>청색 가변저항 ③(A포지션), ④(B포지션)를 각각 시계·반시계 방향으로 조절하여 A와 B지점의 위치를 조정합니다.            
>편의상 아래와 같이 A는 최소위치, B는 최대 위치로 설정하는 것이 편합니다.            
>- 시계 방향 : - (액츄에이터 수축방향)    
>- 반시계 방향 : + (액츄에이터 확장방향)              
>- A 지점(부품③) : 시계(수축) 방향으로 돌려 최소 위치 설정    
>- B 지점(부품④) : 반시계(확장) 방향으로 돌려 최대 위치 설정            
>다만, 사용자 설정에 따라 A와 B의 최소/최대위치가 역전되어 변경될 수도 있습니다.

1. **A Position** 외부 스위치 입력 (○: +, ●:-)
2. **B Position** 외부 스위치 입력 (○: +, ●:-)
   : ①, ②번 단자는 외부 스위치 연결 또는 외부 입력 신호를 받아 동작 (⑨, ⑩번 푸시버튼과 같은 기능이며 포지션 설정은 마찬가지로 ③과 ④를 통해 설정함)

3. A Position 설정 가변저항 **:** 가변 저항을 조절하여 ① 또는 ⑨번 입력 시 액츄에이터가 움직일Position을 설정
4. B Position 설정 가변저항 **:** 가변 저항을 조절하여 ② 또는 ⑩번 입력 시 액츄에이터가 움직일 Position을 설정
5. PC 연결 USB Type-C 단자 : 아두이노 스케치 다운 / Serial 통신
6. Reset 스위치 : 컨트롤러의 동작에 이상이 있을 시, 동작을 초기화
7. 12V 메인 전원 입력 단자(VIN) : EZ Controller, 액츄에이터 메인 전원
8. Mode 변환 스위치 (내용 2.2 참고)
9. A Position 택트 스위치
10. B Position 택트 스위치
11. MCU F/W 다운로드 커넥터(ICSP) : 사용자 조작 금지
12. 아두이노 I/O 핀(Digital:3 , Analog:3 / GND, 5V, SIG)
13. 내부 전원 단자(GND / 3.3V / 5V / VIN(12V)) : 내부에서 사용하는 전원 출력 단자  
    [각 단자의 Current Limit]  
    - 3.3V : ~150mA / 5V : ~ 900 mA / VIN(12V) : Depending on Input Voltage Source
14. 니어 액츄에이터 PWM 포트
15. 리니어 액츄에이터 TTL 포트
16. 리니어 액츄에이터 RS-485 포트
17. 리니어 액츄에이터 위치 조작 **Potentiometer**
18. 사용자 외부 통신 단자 (Bluetooth : TX / RX / GND / 3.3V)

## 2.2모드 선택  
- EZ Controller에 내장되어 있는 기본동작 프로그램을 이용하여 액츄에이터의 동작을 테스트 합니다.    
- 기본 동작 프로그램은 Manual Mode, Position Select Mode, Position Toggle Mode로 구성되어 있습니다.  (모드스위치는 기본 내장된 프로그램에서만 영향을 미칩니다.)  
  ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_b69acc1b.jpg)   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_df0d198e.jpg)   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_d48ef3fe.jpg)   
	    Manual                    Position Select             Position Toggle
- **Manual Mode** : 액츄에이터를 연결하고 Mode 스위치를 하단으로 내려 Manual Mode로 설정하고 중앙부 선형 Potentiometer의 위치를 변화시켜 액츄에이터를 조작할 수 있습니다.    
- **Position Select Mode :** 액츄에이터를 연결하고 Mode 스위치를 중간단으로 올려 Position Select Mode로 설정하고 파란색 포지션 설정 가변 저항을 조절하여 A, B Position을 각각 설정한 후, 중앙부 흰색 Push Button을 눌러 액츄에이터를 A지점과 B지점으로 동작시킬 수 있습니다.    
- **Position Toggle Mode :** 액츄에이터를 연결하고 Mode 스위치를 상단으로 올려 Position Toggle Mode로 설정하고 파란색 포지션 설정 가변 저항을 조절하여 A, B Position을 각각 설정한 다음 중앙부 흰색 Push Button 둘중 아무 버튼을 눌러 액츄에이터를 A지점과 B지점으로 반전 동작시킬 수 있습니다.      
## 2.3외부 스위치 및 외부 신호 입력  
**A/B 포지션 외부 스위치 및 신호 입력을 통한 위치 명령** (사진의 ①,②번 단자)
스위치를 연결하거나, 또는 전압 레벨 신호를 인가하여 위치 이동 명령을 내립니다. 흰색의 택트 스위치(⑨,⑩)와 동일한 기능을 합니다. 위치 명령만 내릴 뿐, 위치 지정은 청색 가변저항(③과④)을 통해 셋팅을 합니다.

1. **External Switch 연결**    
   : 단자의 양단을 스위치를 통해 연결해 신호를 입력해줍니다. (단자 양단 단락)
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_4b965bed.png)  
2. **External Signal 입력**
   : 단자의 두번째 홀에 신호 인식을 위하여 3.3~12V 전압 레벨의 신호를 인가 시킵니다.
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_8cbb9f88.png)
## 2.4 파트 핀 맵  
| **Part No** | **Pin Name** | **Purpose**          | **Part No** | **Pin Name** | **Purpose**           |
| ----------- | ------------ | -------------------- | ----------- | ------------ | --------------------- |
| ①,⑨         | I/O10        | GPIO– A Signal       | ⑫           | A0,A2,A3     | GPIO - Analog         |
| ②,⑩         | D3           | GPIO– B Signal       | ⑫           | D7,IO11,IO13 | GPIO - Digital        |
| ③           | A4           | Analog–A 가변저항        | ⑭           | D5           | GPIO - PWM            |
| ④           | A5           | Analog–B 가변저항        | ⑮,⑯         | D0,D1        | TTL,RS485 통신 전용       |
| ⑤           | Serial       | USB Serial, Sketch다운 | ⑰           | A1           | Analog -Potentiometer |
| ⑧           | D4,IO12,D6   | GPIO – Slide SW      | ⑱           | IO8,IO9      | Software Serial       |

- Parts No : 구성 부품 표기 번호    
- Pin Name : Arduino(Leonardo) I/O핀    
- Purpose : I/O핀 Function
![[Pasted image 20250717103346.png]]
# 3 아두이노 개발환경 구축하기
IRROBOT Ez Controller를 통해 테스트 프로그램을 동작시키기 위해선 PC에 아두이노 개발 환경을 구성해야 합니다.
## 3.1 아두이노 IDE 설치
1. [https://www.arduino.cc/en/main/software](https://www.arduino.cc/en/main/software) 에서 Window Installer를 선택
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_d504b821.png)
2. JUST DOWNLOAD를 눌러 다운로드를 진행합니다.
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_528dcc08.png)
   3. 다운로드가 완료 되면 arduino-xxx-windows.exe를 실행 합니다.
      ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_c5b1a5b9.png)
4. 다음의 과정을 따라 소프트웨어를 설치를 진행 합니다.
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_8d2a625f.png)
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_e8a7f879.png)
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_7e588720.png)
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_f5d889ce.png)
5. 설치 과정에서 나오는 추가 드라이버를 설치합니다.
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_68bbb95c.png)

6. 소프트웨어 설치가 완료되면 Close를 누릅니다.
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_6eadcd61.png)
7. 바탕화면에 생성된 아두이노를 실행 합니다.
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_be49b087.png)  
## 3.2. 아두이노 IDE 기본 구성
아두이노 개발환경 기본 구성은 다음과 같습니다.
![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_440dde32.png)

1. 컴파일 버튼 : 이 버튼을 누르면 프로그램이 컴파일 합니다.(컴파일 결과는 4번에 표시)    
2. 업로드 버튼 : 컴파일과 동시에 Arduino에 업로드 합니다. (컴파일 오류 또는 Arduino와의 USB 연결 오류가 발생하면 4번 영역에 표시)    
3. 시리얼 모니터 버튼 : USB로 아두이노와 연결된 상태로 아두이노가 동작하면 아두이노에서 PC로 메시지를 보낼 수 있습니다. Serial.write() 또는 Serial.print()같은 함수를 사용하여 프로그램이 작성된 경우 시리얼 모니터를 통해 메시지를 확인할 수 있습니다.    
4. 메시지 영역 :아두이노 개발환경을 사용하면서 발생하는 알림 메시지나 컴파일, 업로드 결과 등이 표시되는 영역입니다.    
## 3.3. 아두이노 라이브러리 추가    
1. 당사 웹사이트([http://www.mightyzap.com](http://www.mightyzap.com/)) API 자료실에서 IRROBOT_EZController_XXXX.Zip을 내려 받습니다.
   (사용하는 액츄에이터가 Position control제품인지, Force Control제품군인지 확인후 그에 맞는 자료실을 선택해 주세요)
2. [스케치] – [라이브러리 포함하기] – [.ZIP 라이브러리 추가…] 선택
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_4331bc1.png)

3. IRROBOT_EZController_XXXX.Zip를 선택 (파일명은 업데이트에 따라 변경될 수 있습니다.)
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_d04c68c.png)
## 3.4. 예제 불러오기
1. 아두이노 IDE 실행
2. [파일] - [예제] - [IRROBOT_EZController_FC]-[EZ] – 사용할 예제 선택
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_1d3bae97.png)
## 3.5. 프로그램 업로드 하기
1. [툴]-[보드]-[Arduino Leonardo] 선택
2. [툴]-[포트]-[COMXX (Arduino Leonardo)] 연결된 보드의 포트 선택
   ![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_1fcc460b.png)
3. 업로드 버튼을 통해 실행된 프로그램을 보드에 업로드 시켜줍니다.


# 4. 아두이노 IDE를 통한 액츄에이터 제어 예제
아두이노 IDE의 데이터 통신 프로토콜(RS-485 또는 TTL)을 통해 액츄에이터를 제어합니다. 데이터 통신을 통해 액츄에이터를 보다 자유롭게 제어하고 싶을 때 사용합니다.
## 4.1 개요  
EZ Controller를 통해 mightyZAP을 제어하기 위한 아두이노 예제입니다. 본 예제는 시리얼 데이터 통신(TTL 혹은 RS-485통신)을 통한 제어가 가능하며 PWM통신은 지원하지 않습니다.

EZ Controller는 아두이노 레오나르도 기반으로 제작된 보드이며, 당사에서 제공한 아두이노 API는 아두이노 레오나르도/우노 기준입니다. 각 파라메터 기능에 대한 구체적인 설명은 마이티잽 사용자 매뉴얼을 참고하여 주십시오.
## 4.2 예제 - 2 Position Control (RS-485/TTL)

두 지점을 지정할 수 있는 가변저항 2개(사진의 3, 4번)와 지정한 지점에 도달하도록 동작시킬 수 있는 Switch 2개(사진의 9,10번)를 내장하고 있습니다. 또는 외부 물리 스위치, 외부 전압 신호 (사진의 1번 또는 2번)로도 지정한 지점에 도달할 수 있도록 할 수 있습니다.

가변저항으로 지정시킨 2Position을 2개의 스위치를 통해 이동시키는 예제입니다.  
[예제] - [IRROBOT_EZController] - [EZ]–[EZController_2Positions] 선택

![](file:///C:/Users/PARKSU~1/AppData/Local/Temp/lu153281491wx.tmp/lu153281491x1_tmp_498f67a6.jpg)  
  
### 4.3.1 사용 설명
- 모드 스위치(8번)는 어디에 위치시켜도 무방합니다. (기본 내장 프로그램에서만 모드 스위치 동작)
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 연결합니다.
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (14번 PWM / 15번 TTL / 16번 RS-485) **(PWM 커넥터(14번)의 경우 6페이지 핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오)**
- A, B 지점의 위치를 조절하는 가변저항(3, 4번)을 시계(-), 반시계(+) 방향으로 돌려 동작시킬 지점을 설정합니다.  
  시계 방향은 수축(short stroke), 반시계 방향은 확장(long stroke) 방향입니다.    
- A, B 스위치(9, 10번)를 눌러 원하는 위치로의 명령을 내립니다.
- 좌측 상단의 단자(1, 2번)를 이용하여 외부 스위치·신호를 이용하여 동작시킬 시, 5페이지를 참고하여 주십시오.
### 4.3.2 프로그램 설명
가변 저항의 값으로 두 지점을 설정하며 A와 B의 버튼이 눌렸을 때 해당 지점으로 움직이게 해주는 예제
```C++
#include <IRROBOT_EZController.h>  
#define ID_MAX 11
#define A_POSITION_VR Easy.VR_2
#define B_POSITION_VR Easy.VR_3
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define IS_A_POSITION_ON Easy.POS_A.isOFF()
#define IS_B_POSITION_ON Easy.POS_B.isOFF()
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)

IRROBOT_EZController Easy(&Serial1);

void setup() {
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);
}

void loop()
{
  unsigned char MightyZap_actID = ID_NUM;
  short A_stroke_val, B_stroke_val, position_val;
  int A_stroke_limit, B_stroke_limit;
  A_stroke_val = map(A_POSITION_VR.read(), VR_MIN, VR_MAX, VAL_MIN, VAL_MAX);
  B_stroke_val = map(B_POSITION_VR.read(), VR_MIN, VR_MAX, VAL_MIN, VAL_MAX);

  if(IS_A_POSITION_ON)
    position_val = A_stroke_val;
  else if(IS_B_POSITION_ON)
    position_val = B_stroke_val;

  Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
  delay(10);

}
```

- **PWM 값 매핑**
	``` C++
	#define PWM_MIN 900                         
	#define PWM_MAX 2100                       \	
	#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)
	```
	- short : 900
	- long : 2100

- **가변저항을 이용한 위치값 입력**
  ```C++
  A_stroke_val = map(A_POSITION_VR.read(), VR_MIN, VR_MAX, VAL_MIN, VAL_MAX);
  B_stroke_val = map(B_POSITION_VR.read(), VR_MIN, VR_MAX, VAL_MIN, VAL_MAX);
	```
	- Position A 와 Position B 의 가변 저항 값을 읽어 A_stroke_val 변수와 B_stroke_val 변수에 각각 값을 할당해 줍니다.
	- map()함수를 통해 가변저항의 저항 값을 액츄에이터의 위치 범위에 맞게 매핑시켜줍니다.
	- 가변 저항을 이용하지 않을 시 아래의 값을 사용하시기 바랍니다.
	  A_stroke_val = 100;
	  B_stroke_val = 3600;
	
- **출력 제어**
	-  Easy.MightyZap.GoalPosition() : TTL/RS485 출력 제어
	- Easy.servo_CH1.writeMicroseconds() : PWM 출력 제어
  ```C++
    Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
	Easy.servo_CH1.writeMicroseconds(PWM_VAL);
	```  
## 4.3. 예제 - TogglePosition      
1개의 스위치로 지정시킨 2 Position을 반전시켜주는 예제 입니다.
[예제] - [IRROBOT_EZController] - [EZ]– [EasyControl_TogglePosition] 선택
### 4.3.1 사용설명
- 모드 스위치(8번)는 어디에 위치시켜도 무방합니다. (기본 내장 프로그램에서만 모드 스위치 동작)    
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 합니다.    
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (14번 PWM / 15번 TTL / 16번 RS-485)    
  (PWM 커넥터(14번)의 경우 6페이지 핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오)
- A, B 지점의 위치를 조절하는 가변저항(3, 4번)을 시계(-), 반시계(+) 방향으로 돌려 동작시킬 지점을 설정합니다.  
  시계 방향은 수축(short stroke), 반시계 방향은 확장(long stroke) 방향입니다.    
- A 또는 B 스위치(사진의 9 또는 10번)를 눌러 원하는 위치로의 명령을 내립니다.    
- A와 B 스위치 상관없이, 동일한 스위치를 반복하여 누르면 A->B 지점으로 B->A 지점으로 액츄에이터가 이동합니다.    
- 좌측 상단의 단자(1, 2번)를 이용하여 외부 스위치·신호를 이용하여 동작시킬 시, 5페이지를 참고하여 주십시오.      

### 4.3.2 프로그램 설명
가변저항으로 설정된 두 지점을 A나 B 버튼을 눌렀을 시, A 지점에서 B지점 또는 B지점에서 A지점으로 반전 동작
![[toggle.png]]
```C++
#include <IRROBOT_EZController.h>  
#define ID_MAX 11
#define A_POSITION_VR Easy.VR_2
#define B_POSITION_VR Easy.VR_3
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define IS_A_POSITION_ON Easy.POS_A.isOFF()
#define IS_B_POSITION_ON Easy.POS_B.isOFF()
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)  

IRROBOT_EZController Easy(&Serial1);  

short position_val;
bool tg_flag,Sw_status = 0;
int sw_cnt = 0,cnt =0 ;  

void setup() {
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);
}

void loop() {
  unsigned char MightyZap_actID = ID_NUM;
  short A_stroke_val;
  short B_stroke_val;
  A_stroke_val = map(A_POSITION_VR.read(),VR_MIN,VR_MAX,VAL_MIN,VAL_MAX);
  B_stroke_val = map(B_POSITION_VR.read(),VR_MIN,VR_MAX,VAL_MIN,VAL_MAX);
    
  if(IS_A_POSITION_ON || IS_B_POSITION_ON) tg_flag ^= 1;
  if(tg_flag) position_val = A_stroke_val;
  else position_val = B_stroke_val;

  Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
  delay(10);

}
```

- **toggle 동작**
	- A 나 B 버튼이 눌렸을 시에 bool 형으로 선언된 tg_flag 값을 반전시키고 그 값이 1 일 때는 A 지점을, 0 일 때는 B 지점으로 이동한다
  ```C++
	if(IS_A_POSITION_ON || IS_B_POSITION_ON) tg_flag ^= 1;
	if(tg_flag) position_val = A_stroke_val;
	else position_val = B_stroke_val;
	```

# 4.4. 예제 –Manual Position
Linear Potentiometer의 이동거리만큼 액츄에이터의 위치를 움직여줍니다.  
[예제] - [IRROBOT_EZController] - [EZ]– [EasyControl_MPosition] 선택
### 4.4.1 사용설명
- 모드 스위치는 어디에 위치시켜도 무방합니다. (기본 내장 프로그램에서만 모드 스위치 동작)    
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 연결시켜 줍니다.    
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (사진의 14번 PWM / 15번 TTL / 16번 RS-485) 
  (PWM 커넥터의 경우 핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오)
- 중단의 가변 Potentiometer(사진의 17번) 를 조절하여 액츄에이터를 동작시켜 줍니다. 매뉴얼 모드에서는 위치 가변저항  
  (사진의 3, 4번)의 설정에 영향을 받지 않고, Potentiometer가 움직이는 만큼 full stroke 구간에서 위치 제어가 됩니다.  
### 4.4.2 프로그램 설명
![[manual.png]]

```C++
#include <IRROBOT_EZController.h>  

#define ID_MAX 11
#define MANUAL_POSITION_VR Easy.VR_1
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)  

IRROBOT_EZController Easy(&Serial1);  

short position_val;
  
void setup() {
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);
}

void loop()
{
  unsigned char MightyZap_actID = ID_NUM;
  short Manual_position_val;
  short A_stroke_val;
  short B_stroke_val;
  Manual_position_val  = map(MANUAL_POSITION_VR.read(),VR_MIN,VR_MAX,VAL_MIN,VAL_MAX);  
  position_val = Manual_position_val;
  Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
  delay(10);
}
```

- **Potentiometer 를 이용한 Manual  제어**
	- Manual_position_val변수로 Potentiometer 의 값을 읽은 후 액츄에이터 위치 동작
	```C++
	 Manual_position_val  = map(MANUAL_POSITION_VR.read(),VR_MIN,VR_MAX,VAL_MIN,VAL_MAX);  
	  position_val = Manual_position_val;
	  Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
	  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
	```
  
## 4.5. 예제 –Basic Function
Slide 스위치를 통하여 액츄에이터 제어 방식을 전환시키며 제어하는 예제입니다. 공장 출하 프로그램*
[예제] - [IRROBOT_EZController] - [EZ]-[EasyControl_BasicFunction] 선택
### 4.5.1 사용설명
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 연결합니다.    
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (사진의 14번 PWM / 15번 TTL / 16번 RS-485)    
  (PWM 커넥터의 경우 페이지 핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오
- 모드 슬라이드 스위치(사진의 8) 로 Mode를 변환시켜 액츄에이터를 동작시켜 줍니다.  
  ![[modeSw.png]]
	1) Mode0 : Manual Control (스위치 최하단)  
	2) Mode1 : 2 Position Control (스위치 중간단)  
	3) Mode2 : Toggle Control (스위치 최상단)
- Mode1(Manual Control) 동작 시, 사진의, 4번의 가변저항 값이 17번 가변  
  Potentiometer의 가동범위 Limit 값으로 설정 되니 참고바랍니다.
### 4.5.2 프로그램 설명
```C++
#include <IRROBOT_EZController.h>

#define ID_MAX 11
#define MANUAL_POSITION_VR Easy.VR_1
#define A_POSITION_VR Easy.VR_2
#define B_POSITION_VR Easy.VR_3
#define IS_MANUAL_MODE_ON Easy.MODE_0.isOFF()
#define IS_2P_MODE_ON Easy.MODE_1.isOFF()
#define IS_TOGGLE_MODE_ON Easy.MODE_2.isOFF()
#define IS_A_POSITION_ON Easy.POS_A.isOFF()
#define IS_B_POSITION_ON Easy.POS_B.isOFF()
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)

IRROBOT_EZController Easy(&Serial1);

short position_val;
bool tg_flag,Sw_status = 0;
int sw_cnt = 0, cnt = 0;
int nFilter=0;

void setup() {
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);
}

void loop()
{
  unsigned char MightyZap_actID = ID_NUM;
  short Manual_position_val,A_stroke_val,B_stroke_val;
  int A_stroke_limit, B_stroke_limit, stroke_limit_dir;

  Manual_position_val  = map(MANUAL_POSITION_VR.read(),VR_MIN,VR_MAX,VAL_MIN,VAL_MAX);
  nFilter = nFilter - (nFilter >> 3) + Manual_position_val;
  Manual_position_val = (uint16_t)(nFilter >> 3);

  A_stroke_val = map(A_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);
  B_stroke_val = map(B_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);

  if(A_stroke_val>B_stroke_val)
  {
    int temp = A_stroke_limit;
    A_stroke_limit = B_stroke_val;
    B_stroke_limit = temp;
  }

  if(IS_MANUAL_MODE_ON) position_val = Manual_position_val;
  else if(IS_2P_MODE_ON)
  {
    if(IS_A_POSITION_ON) position_val = A_stroke_val;
    else if(IS_B_POSITION_ON) position_val = B_stroke_val;
  }
  else if(IS_TOGGLE_MODE_ON)
  {
    if(IS_A_POSITION_ON || IS_B_POSITION_ON){
      if(!Sw_status){
        if(sw_cnt++>7){
          tg_flag ^= 1;
          Sw_status = 1;
          sw_cnt = 0;
        }
      }
      else sw_cnt = 0;
    }
    else {
      sw_cnt = 0;
      if(!IS_A_POSITION_ON && !IS_B_POSITION_ON){
        if(cnt++>7){
          cnt = 0;
          Sw_status = 0;
        }
      }
    }
    if(tg_flag ==1) position_val = A_stroke_val;
    else position_val = B_stroke_val;
  }
  Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
  delay(10);
}
```

- **Slide Switch Mode 정의**
	- Slide Switch 의 하단, 중단, 상단이 각 순서대로 MODE_0,MODE_1,MODE_2 로 정의되어 있습니다.
  ```
	#define IS_MANUAL_MODE_ON Easy.MODE_0.isOFF()
	#define IS_2P_MODE_ON Easy.MODE_1.isOFF()
	#define IS_TOGGLE_MODE_ON Easy.MODE_2.isOFF()
	```
- **스위치  Debounce**
	- Sw_status : 스위치가 눌러져 있는 상태 판별 
	- sw_cnt : SW On 시, Debouncing 후 인식
	```C++
	if(IS_A_POSITION_ON || IS_B_POSITION_ON){
      if(!Sw_status){
        if(sw_cnt++>7){
          tg_flag ^= 1;
          Sw_status = 1;
          sw_cnt = 0;
        }
      }
      else sw_cnt = 0;
    }
    else {
      sw_cnt = 0;
      if(!IS_A_POSITION_ON && !IS_B_POSITION_ON){
        if(cnt++>7){
          cnt = 0;
          Sw_status = 0;
        }
      }
    }
	```
## 4.6. 예제 –Extra IO(1)  
상단의 Digital IO핀의 입력을 받아 액츄에이터를 제어하는 예제 입니다.  
[예제] - [IRROBOT_EZController] - [EZ]–[EasyControl_ExtIO] 선택
### 4.6.1 사용설명
- 모드 스위치는 어디에 위치시켜도 무방합니다. (기본 내장 프로그램에서만 모드 스위치 동작)    
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 연결합니다.    
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (사진의 14번 PWM / 15번 TTL / 16번 RS-485)    
  (PWM 커넥터의 경우 핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오)
- 상단의 헤더핀(사진의 12번) 중 좌측 3개는 Digital 단자이며, 이 중에서 좌측에서부터 첫 번째와 두 번째 핀을 사용합니다.    
- 신호 단자는 3핀 중 제일 하단의 있는 핀이며 해당 핀은 5V의 신호 레벨을 가집니다. (아래 사진의 참조) 
  (Active Low / 5V : High Signal / 0V : Low Signal)    
- 좌측 두 개의 가변저항(사진의 3,4번)를 통해 이전방법과 동일하게 이동시킬 두 지점을 설정해줍니다.    
- 첫 번째 핀에 Low 신호를 가하게 되면 설정한 A지점으로 액츄에이터가 이동하며,  
  두 번째 핀에 Low 신호를 가하게 되면 설정한 B 지점으로 액츄에이터가 이동합니다.
- Push Button Switch 위에 6 개의 부가적인 IO 핀이 있으며 좌측 3 개는 Arduino 의 Digital IO, 우측 3 개는 Analog IO 핀 입니다.
### 4.6.2 프로그램 설명
![[extraio_pinmap.png]]  
```C++
#include <IRROBOT_EZController.h>
#define ID_MAX 11
#define A_POSITION_VR Easy.VR_2
#define B_POSITION_VR Easy.VR_3
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)  

IRROBOT_EZController Easy(&Serial1);  

short position_val;  

void setup() {
  pinMode(7,INPUT);
  pinMode(11,INPUT);
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);
}

void loop() {
  unsigned char MightyZap_actID = ID_NUM;
  short A_stroke_val,B_stroke_val;
  A_stroke_val = map(A_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);
  B_stroke_val = map(B_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);  

  if(digitalRead(7) == HIGH) position_val = A_stroke_val;
  else if(digitalRead(11) == HIGH) position_val = B_stroke_val;
  else position_val = position_val;

  Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);

  delay(10);
}
```

- ** IO Pin 설정**
	- Digital IO (7,11,13)중 7 번과 11 번 IO 를 입력으로 선언
	```C++
	pinMode(7,INPUT);
	pinMode(11,INPUT);
	```
- **IO input 제어**
	- 7 번핀에 5V 신호가 인가되면 액츄에이터는 설정한 지점 A 로 11 번핀에 5V 신호가 인가되면 액츄에이터는 설정한 지점 B 로 이동한다.
  ```C++
	if(digitalRead(7) == HIGH) position_val = A_stroke_val;
    else if(digitalRead(11) == HIGH) position_val = B_stroke_val;
    else position_val = position_val;
	```
## 4.7. 예제 -Extra IO(2)  
상단 Analog IO핀에 외부 센서의 입력을 받아 액츄에이터를 제어하는 예제 입니다.  
[예제] - [IRROBOT_EZController] - [EZ]–[EasyControl_Sensing] 선택  
### 4.7.1 사용설명
- 모드 스위치는 어디에 위치시켜도 무방합니다. (기본 내장 프로그램에서만 모드 스위치 동작)    
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 연결합니다.    
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (사진의 14번 PWM / 15번 TTL / 16번 RS-485)    
  (PWM 커넥터의 경우 핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오)
- 상단의 헤더 핀(사진의 12번) 중 우측 3개는 Analog 단자이며, 본 우측에서 3개의 핀을 사용합니다. (아래 사진 참조)    
- 해당 핀에 Analog 값을 읽을 센서를 용도에 알맞게 연결시켜줍니다.    
- 센서의 값에 따라 액츄에이터가 이동하게 됩니다.  
  ex) CDS => 밝을수록 전진, 어두울수록 후진 동작      
### 4.7.2 프로그램 설명
- 라이브러리 내부적으로 상단의 아날로그핀 A0,A2,A3 가 각각 VR_4,VR_5,VR_6 으로 정의되어 있으며 사용하고자 하는 핀을 정의되어있는 이름으로 선언 또는 매칭되어 있는 아날로그 핀을 직접 선언하여 사용합니다.
![[extraIO2.png]]
```C++
#include <IRROBOT_EZController.h>

IRROBOT_EZController Easy(&Serial1);

#define ID_MAX 11
#define MANUAL_POSITION_VR Easy.VR_1
#define A_POSITION_VR Easy.VR_2
#define B_POSITION_VR Easy.VR_3
#define EXT_ANALOG_VR Easy.VR_4   //VR4 : A0  //VR5 : A2  //VR6 : A3
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)

short position_val;
  
void setup(){
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX, 0, 1023);
}

void loop() {
  unsigned char MightyZap_actID = ID_NUM;
  short Ext_analog_val;

  Ext_analog_val = map(EXT_ANALOG_VR.read(), VR_MIN, VR_MAX, VAL_MIN, VAL_MAX);
  position_val = Ext_analog_val;
  Easy.MightyZap.GoalPosition(ID_NUM, position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
  delay(10);
}
```

- 아날로그 PIn  설정
  ```C++
	#define EXT_ANALOG_VR Easy.VR_4   //VR4 : A0  //VR5 : A2  //VR6 : A3
	```
- 아날로그 입력 제어
  ```C++
    Ext_analog_val = map(EXT_ANALOG_VR.read(), VR_MIN, VR_MAX, VAL_MIN, VAL_MAX);
	```
## 4.8. 예제 –External Communication
우측 하단의 Bluetooth 포트를 통해 외부 통신을 하며 액츄에이터를 제어하는 예제 입니다.  
[예제] - [IRROBOT_EZController] - [EZ]–[EasyControl_ExtCom] 선택
### 4.8.1 사용설명
- 모드 스위치는 어디에 위치시켜도 무방합니다. (기본 내장 프로그램에서만 모드 스위치 동작)    
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 연결시켜 줍니다.    
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (사진의 14번 PWM / 15번 TTL / 16번 RS-485)    
  (PWM 커넥터의 경우핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오)
- 우측 하단 외부 통신을 위한 핀(사진의 18번)이 있으며 해당 핀에 연결하고자 하는 장비를 핀 배열에 맞게 연결합니다.
- 해당 예제에선 A버튼을 누르면 ASCII값으로 ‘A’가 송신되고 B버튼을 누르면 ASCII값 ‘B’가 송신됩니다.  
    보드가 ASCII값으로 ‘A’를 수신하면 이전과 동일하게 설정해두었던 A 지점으로 액츄에이터가 이동하며,  마찬가지로 ASCII값 ‘B’를 수신하면 설정해두었던 B지점으로 액츄에이터가 이동합니다.
### 4.8.2 프로그램 설명
- 아두이노 상으로 IO8,IO9 핀을 각각 RX,TX 로 선언시켜줍니다.
- Serial.begin()함수로 시리얼 모니터의 baud rate 설정 Sw_func()함수와 ExtComData_Func()함수에서 송수신 된 데이터를 시리얼 모니터에 출력하여 확인합니다.
- ExtComData_Listen() 함수를 통하여 통신 데이터를 한 바이트씩 수신해줍 니다.
- Sw_Func()함수에선 A 와 B 각각 해당하는 ASCII 코드 값을 송신하며 ExtComData_Func()함수에선 수신된 ASCII 코드값에 해당하는 Position 으로 액츄에이터를 이동시켜줍니다.
![[externalUart.png]]
```C++
#include <IRROBOT_EZController.h>

IRROBOT_EZController Easy(&Serial1);
SoftwareSerial userSerial(8,9);

#define ID_MAX 11
#define A_POSITION_VR Easy.VR_2
#define B_POSITION_VR Easy.VR_3
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define IS_A_POSITION_ON Easy.POS_A.isOFF()
#define IS_B_POSITION_ON Easy.POS_B.isOFF()
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)

short position_val;
char RxChar;
short A_stroke_val,B_stroke_val;

void setup() {
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);

  Serial.begin(9600);
  userSerial.begin(9600);
}

void loop() {
  unsigned char MightyZap_actID = ID_NUM;
  A_stroke_val = map(A_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);
  B_stroke_val = map(B_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);
  Sw_Func();
  ExtComData_Listen();
  ExtComData_Func();
}

void Sw_Func(void){
  if(IS_A_POSITION_ON){
    userSerial.write('A');
    Serial.println("'A' Send");
    delay(500);
  }
  else if(IS_B_POSITION_ON){
    userSerial.write('B');
    Serial.println("'B' Send");
    delay(500);
  }
}

void ExtComData_Listen(void){
  if(userSerial.available()>0){
    RxChar = userSerial.read();
  }
}

bool ExtComData_Func(){
  if(RxChar == 'A'){
    position_val = A_stroke_val;
    Serial.println("'A' Recieved");
  }
  else if(RxChar == 'B'){
    position_val = B_stroke_val;
    Serial.println("'B' Recieved");
  }
  Easy.MightyZap.GoalPosition(ID_NUM, position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
  delay(10);
}
```

## 4.9. 예제 – Mode Selection
좌측 Slide Switch(사진의 8번)의 값에 따라 동작할 수 있는 모드를 설정할 수 있는 예제 입니다.  
[예제] - [IRROBOT_EZController] - [EZ]–[EasyControl _ModeSelect] 선택
### 4.9.1 사용설명
- [Basic Function]과 동일하게 슬라이드 스위치 위치에 따라 동작이 다르며 Mode별로 동작을 지정할 수 있습니다.
### 4.9.2 프로그램 설명
![[modeSelect.png]]
```C++
#include <IRROBOT_EZController.h>

#define ID_MAX 11
#define ModeSW_1 Easy.MODE_0.isOFF()
#define ModeSW_2 Easy.MODE_1.isOFF()
#define ModeSW_3 Easy.MODE_2.isOFF()
#define MANUAL_MODE 1
#define POS2_MODE 2
#define TOGGLE_MODE 3
#define EXT_IO_MODE 4
#define EXT_SENSING_MODE 5
#define EXT_COM_MODE 6

IRROBOT_EZController Easy(&Serial1);

void setup() {
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);
}

void loop()
{
  int sw_val;
  if(ModeSW_1)sw_val = 1;
  else if(ModeSW_2) sw_val = 2;
  else if(ModeSW_3) sw_val = 3;
  Easy.ModeSelect(MANUAL_MODE,POS2_MODE,TOGGLE_MODE,sw_val);
  delay(10);
}
```
- **Mode 정의**
  ```C++
	#define MANUAL_MODE 1
	#define POS2_MODE 2
	#define TOGGLE_MODE 3
	#define EXT_IO_MODE 4
	#define EXT_SENSING_MODE 5
	#define EXT_COM_MODE 6
	```
- **Switch 값 정의**
	- Slide Switch 가 하단일 때는 1, 중단일 때는 2, 상단일 때는 3 으로 구분 지어 줍니다.
	- Tester.ModeSelect(int mode1, int mode2. int mode3, int sw); 
	  mode1 : sw 값이 1 일 때의 동작 
	  mode 2 : sw 값이 2 일 때의 동작 
	  mode3 : sw 값이 3 일 때의 동작 
	  sw : Slide Switch 에 의해 설정된 Mode 값
	```C++
	if(ModeSW_1)sw_val = 1;
	else if(ModeSW_2) sw_val = 2;
	else if(ModeSW_3) sw_val = 3;
	Easy.ModeSelect(MANUAL_MODE,POS2_MODE,TOGGLE_MODE,sw_val);
	```
## 4.10. 예제 –Stroke Limit      
좌측 2개의 가변저항으로 Stroke의 Max/Min Limit을 설정할 수 있는 예제 입니다.  
[예제] - [IRROBOT_EZController] - [EZ]–[EasyControl  StrokeLimit] 선택
## 4.10.1 사용설명
- 모드 스위치는 어디에 위치시켜도 무방합니다. (기본 내장 프로그램에서만 모드 스위치 동작)    
- 전원 입력 단자(7번)에 사용하고 하는 액츄에이터에 맞는 VCC전원(7.4V or 12V)과 GND를 방향에 맞게 연결합니다.    
- 선택한 통신에 알맞은 커넥터에 방향을 유의하여 삽입해줍니다. (사진의 14번 PWM / 15번 TTL / 16번 RS-485)
  (PWM 커넥터의 경우 핀맵을 참고하여 극성에 유의하여 삽입하여 주십시오)
- Stroke의 Max와 Min 지점의 위치를 조절하는 가변저항(사진의 3, 4번)을 시계(-), 반시계(+) 방향으로돌려 동작시킬 지점을 설정합니다. 시계 방향은 수축(short stroke), 반시계 방향은 확장(long stroke) 방향입니다.    
- 중단의 가변 Potentiometer(사진의 17번) 를 조절하여 액츄에이터를 동작시켜 줍니다.  
  해당 프로그램에선 위치 가변저항 (사진의 3 ,4번)의 설정에 영향을 받으며, Potentiometer를 움직여도 가변저항으로 설정한 구간에서만 위치 제어가 됩니다.      
### 4.10.2 프로그램 설명
![[accessories_etc/img/strokeLimit.png]]
```C++
#include <IRROBOT_EZController.h>

#define ID_MAX 11
#define MANUAL_POSITION_VR Easy.VR_1
#define A_POSITION_VR Easy.VR_2
#define B_POSITION_VR Easy.VR_3
#define IS_A_POSITION_ON Easyter.POS_A.isOFF()
#define IS_B_POSITION_ON Easy.POS_B.isOFF()
#define SW_A Easy.POS_A
#define SW_B Easy.POS_B
#define VR_MIN 0
#define VR_MAX 1023
#define VAL_MIN 0
#define VAL_MAX 4095
#define ID_NUM 0
#define PWM_MIN 900
#define PWM_MAX 2100
#define PWM_VAL map(position_val,VAL_MIN,VAL_MAX,PWM_MIN,PWM_MAX)

IRROBOT_EZController Easy(&Serial1);

short position_val;
bool tg_flag,Sw_status = 1;
int sw_cnt = 0;

void setup() {
  Easy.begin();
  Easy.MightyZap.begin(32);
  Easy.setStep(ID_MAX,0,1023);
}

void loop()
{
  unsigned char MightyZap_actID = ID_NUM;
  short Manual_position_val,A_stroke_val,B_stroke_val;
  int A_stroke_limit, B_stroke_limit, stroke_limit_dir;
  int short_stroke_limit,long_stroke_limit;
  
  Manual_position_val  = map(MANUAL_POSITION_VR.read(),VR_MIN,VR_MAX,VAL_MIN,VAL_MAX);  
  short_stroke_limit = map(A_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);
  long_stroke_limit = map(B_POSITION_VR.read(),  VR_MIN, VR_MAX,  VAL_MIN, VAL_MAX);


  if(short_stroke_limit>long_stroke_limit)
  {
    int temp = short_stroke_limit;
    short_stroke_limit = long_stroke_limit;
    long_stroke_limit = temp;
  }

  if(Manual_position_val<short_stroke_limit) Manual_position_val = short_stroke_limit;
  else if(Manual_position_val>long_stroke_limit) Manual_position_val = long_stroke_limit;
  position_val = Manual_position_val;
  
  Easy.MightyZap.GoalPosition(MightyZap_actID,position_val);
  Easy.servo_CH1.writeMicroseconds(PWM_VAL);
  delay(10);
}
```
- **아날로그 값 Min/Max 설정**
	- 두 개의 아날로그 값을 읽어와 가장 작은 쪽을 Short stroke limit로 큰 쪽을 Long stroke limit로 설정합니다.
  ```C++
	if(short_stroke_limit>long_stroke_limit)
	{
		int temp = short_stroke_limit;
		short_stroke_limit = long_stroke_limit;
		long_stroke_limit = temp;
	}
	```
- **Position Limit 값 설정**
	- 가변 Potentiometer 의 값이 설정한 범위를 벗어나지 못하도록 값 판별
  ```C++
	if(Manual_position_val<short_stroke_limit) Manual_position_val = short_stroke_limit;
	else if(Manual_position_val>long_stroke_limit) Manual_position_val = long_stroke_limit;
	position_val = Manual_position_val;
	```