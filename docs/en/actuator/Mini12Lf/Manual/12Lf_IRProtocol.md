---
slug: 12Lf_IRProtocol.md
title: 12Lf_IRProtocol
modified: 
version:
---
# 12Lf IRProtocol
## 1. 개요
mightyZAP을 제어하기 위해서는 Protocol에 맞추어 통신을 해야하며, mightyZAP에서는 제어를 위한 전용 IR Protocol을 제공하고 있습니다.  
IR Protocol 을 지원하는 모델은 아래와 같습니다.
- D7/D12 Series
- L12 Series
- 12Lf Series
### 1.2 Packet Description
#### 1.2.1 Command Packet
It is command packets for mightyZAP operation. Its structure and elements are as below.
**Structure**
![commandPacket](./img/CommandPacket.png)
**Element**

| Index | Data | 설명 |
| ---- | ---- | ---- |
| 0 | Start Bytes 1 | Start Byte 1 (0xFF) |
| 1 | Start Bytes 2 | Start Byte 2 (0xFF) |
| 2 | Start Bytes 3 | Start Byte 3 (0xFF) |
| 3 | ID | mightyZAP ID (Range: 0 ~ 253, Broadcast ID: 254) |
| 4 | SIZE | Packet Size (COMMAND+FACTOR+CHECKSUM) |
| 5 | COMMAND | Instruction |
| 5+1 | FACTOR ## 1 | First Parameter |
| 5+m | FACTOR ## M | 'm'th  Parameter |
| 5+N | FACTOR ## N | Last Parameter |
| 5+N+1 | Check Sum | Check Sum = 0xff – ( LOWER_BYTE( ID + SIZE + COMMAND + FACTOR#1 + … + FACTOR#N ) ) |

**Element Descroption**
1. Header (3 Bytes)
	- Code to recognize Packet start :  0xFFFFFF
2. ID (1 Byte)
	- The ID is an unique number of each mightyZAP to support Daisy Chain connection.
	- Factory default value(ID) is 0.
	- In case of ID = 0 ~253, ID "N" which is stored in the mightyZAP will be operated.
	- n case of ID = 254 (0xFE), it is operated under "Broadcasting Mode (move all mightyZAP)" and Feedback Packet does not work.
3. SIZE (1 Byte)
	- Packet length in Byte unit
	- Data counting value after "Size" data (COMMAND+FACTOR+CHECKSUM)
	- That is, Size value = Number of byte of "Factor" + 2
1. COMMAND (1 Byte)
	- Command codes defining the purpose of Packet
		
| Function | CODE | Description |
| ---- | ---- | ---- |
| Echo | 0xF1 | Feedback Packet Reception |
| Load Data | 0xF2 | Send "Address" and get feedback of Data |
| Store Data | 0xF3 | Send "Address" and "Data". Then Save. |
| Send Data | 0xF4 | Send "Address" and "Data" for temporary storage |
| Excution | 0xF5 | Execute temporarily stored data that is made by<br>SendData. |
| Factory Reset | 0xF6 | Reset to Factory default parameter value |
| Restart | 0xF8 | Restart system |
| Symmetric Store | 0x73 | Store data in the same address of multiple qty mightyZAP |
5. FACTOR
	- Additional Packet factor according to Command
6. CHECKSUM
	Verification data to check omission and any changes of Packet data. The interaction formula will be as below.
	- Checksum = 0xff – ( LOWER_BYTE( ID + SIZE + COMMAND + FACTOR#1 + … + FACTOR#N ) )
	- LOWER_BYTE = Only the lower 1 byte is taken among the summed data values.
		  = Divide the summed data value by 0x100 and take only the remainder.
	- Here is the formula for above.
		LOWER_BYTE( ID + SIZE + COMMAND + FACTOR#1 + ... + FACTOR#N ) == ( ID + SIZE + COMMAND + FACTOR#1 + ... + FACTOR#N ) % 0x100
	
#### 1.2.2 Feedback Packet
After reception of command packet, mightyZAP sends Feedback packet including requested information. Its structure and factors are as below.  
**Structure**  
![feedbackPacket](./img/feedbackPacket.png)
**Element**  

| Index | Data | 설명 |
| ---- | ---- | ---- |
| 0 | Start Bytes 1 | Start Byte 1 (0xFF) |
| 1 | Start Bytes 2 | Start Byte 2 (0xFF) |
| 2 | Start Bytes 3 | Start Byte 3 (0xFF) |
| 3 | ID | mightyZAP ID (Range: 0 ~253, Broadcast ID:254) |
| 4 | SIZE | Packet Size (COMMAND+FACTOR+CHECKSUM) |
| 5 | ERROR | Error Code |
| 5+1 | FACTOR ## 1 | First Parameter |
| 5+m | FACTOR ## M | 'm' th  Parameter |
| 5+N | FACTOR ## N | Last Parameter |
| 5+N+1 | Check Sum | Check Sum = 0xff – ( LOWER_BYTE( ID + SIZE + COMMAND + FACTOR#1 + … + FACTOR#N ) ) |

**Element Descroption**
1. Header (3 Bytes)
	- Recognizing "Packet start" code. 0xFFFFFF
2. ID (1 Byte)
	- Individual ID number for each mightyZAP (0 ~253)
3. SIZE (1 Byte)
	- Packet length in Byte unit
	- Data counting value after "Size" data (ERROR+FACTOR+CHECKSUM)
	- That is, Size value = Number of byte of "Factor" + 2
4. COMMAND (1 Byte)
	- Error status during operation for each bit
		
| Error | bit | Description | LED 표시 |
| ---- | ---- | ---- | ---- |
| Overload Error | 5 | In case that current load cannot be controlled with the<br>designated maximum force, it will be set as "1" | Red<br>Blink |
| Input voltage Error | 0 | In case that the input voltage is out of operating voltage<br>range designated in the Control table, it will be set as "1" | Red On |

5. FACTOR
	- Additional Packet factor according to Feedback data.
6. CHECKSUM
	Verification data to check omission and any changes of Packet data. The interaction formula will be as below.
	- Checksum = 0xff – ( LOWER_BYTE( ID + SIZE + COMMAND + FACTOR#1 + … + FACTOR#N ) )
	- LOWER_BYTE = Only the lower 1 byte is taken among the summed data values. 
		  = Divide the summed data value by 0x100 and take only the remainder
	-Here is the formula for above.
		LOWER_BYTE( ID + SIZE + COMMAND + FACTOR#1 + ... + FACTOR#N ) == ( ID + SIZE + ERROR + FACTOR#1 + ... + FACTOR#N ) % 0x100
## 2. Instruction 
## 2.1 Echo
Receiving Feedback Packet (Refer to the” Load Data” parameter for feedback on position )
#### 2.1.1 예제
Command packet to recognize status of mightyZAP connection.
##### 2.1.2.1 Command Packet
| HEADER | ID | Size | Command | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x02 | 0xF1 | 0x0c |

##### 2.1.2.1 Feedback Packet
| HEADER | ID | Size | Error | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x02 | 0x00 | 0xFD |

## 2.2 Factory Reset
Basic parameter (Memory & Parameter) to be reset to Default value. Additional Reset to be determined according to options.
- mightyZAP을 리셋하기 위해서는 아래의 Option Data를 설정해야 합니다.
 - If concerned bit is "1", it means Reset. If it is "0", it means Hold.

| Option | Bit | 리셋 동작 |
| ---- | ---- | ---- |
| ID | 0 | Reset mightyZAP ID to 0 |
| Baudrate | 1 | Reset to 32 (57600 bps) |

#### 2.2.1 예제
mightyZAP ID to be reset to 0(ID Default) and Baud Rate to be maintained current status.
##### 2.2.2.1 Command Packet
| HEADER | ID | Size | Command | Factor<br>(option) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x03 | 0xF6 | 0x01 | 0x04 |

##### 2.2.2.1 Feedback Packet
| HEADER | ID | Size | Error | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x02 | 0x00 | 0xFD |

## 2.3 Restart
mightyZAP system Restart  
<font color="#ff0000">Feedback packet informing receipt of Restart command of mightyZAP system (Only feedback in the Feedback Return Mode 2)</font>
#### 2.3.1 example
Command packet to reboot mightyZAP system.
##### 2.3.2.1 Command Packet
| HEADER | ID | Size | Command | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x02 | 0xF8 | 0x05 |
##### 2.3.2.1 Feedback Packet
| HEADER | ID | Size | Command | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x02 | 0xF8 | 0x05 |
## 2.4 Store Data
Store data after sending Address and Data to set ID, goal position, Force limit, Stroke limit, Speed, Force On/Off and etc.
<font color="#ff0000">Feedback packet informing receipt of Restart command of mightyZAP system (Only feedback in the Feedback Return Mode 2)</font>
#### 2.4.1 ID change
##### 2.4.1.1 Description
Change ID‘0’ into ID ‘1’(0x01)
- ID :  mightyZAP ID
- Command : Save data at respective address in order
- Address : the address which mightyZAP ID is saved. (see User Manual Data Map)
- Data : Desired mightyZAP ID (put 0x01 at address 0x03)
##### 2.4.1.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x04 | 0xF3 | 0x03 | 0x01 | 0x04 |
#### 2.4.2 Goal Position command
##### 2.4.2.1 Description
Command packet to assign goal position to 2047(0x07FF)
- ID : mightyZAP ID 
- Command : : Save data at respective address in order.
- Address : the address which goal position value is saved. (see User Manual Data Map)
- Data #1 : Desired goal position’s lower byte (address 0x86 : 0xFF)
- Data #2 : Desired goal position’s lower byte (address 0x86 : 0xFF)
	※Goal position value Hex change (decimal number -> hexadecimal number) : 2047 -> 0x07FF
##### 2.4.2.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data) | Factor #3<br>(Data) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x05 | 0xF3 | 0x86 | 0xFF | 0x07 | 0x7A |
#### 2.4.3 Goal Speed 
##### 2.4.3.1 Description
Command packet to assign Goal Speed to 512(0x0200)
- ID : mightyZAP ID 
- Command : Save data at respective address in order
- Address : the address which Goal Speed value is saved. (see User Manual Data Map)
- Data #1 : Desired Goal Speed value’s lower byte (address 0x15 : 0x00)
- Data #2 : Desired Goal Speed value’s upper byte (address 0x16 : 0x02)
	※Goal Speedvalue Hex change (decimal number -> hexadecimal number) : 512 -> 0x0200
##### 2.4.3.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data) | Factor #3<br>(Data) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x05 | 0xF3 | 0x88 | 0x00 | 0x02 |  |
#### 2.4.4 Goal Current
##### 2.4.4.1 Description
Command packet to assign Goal Current to 800(0x0320)
- ID :  mightyZAP ID 
- Command : Save data at respective address in order
- Address : the address which Goal Current value is saved. (see User Manual Data Map)
- Data #1 : Desired Goal Current value’s lower byte (address 0x34: 0x20)
- Data #2 : Desired Goal Current value’s upper byte (address 0x35: 0x03)
	※※Goal Current value Hex change (decimal number -> hexadecimal number) : 800 -> 0x0320
##### 2.4.4.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data) | Factor #3<br>(Data) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x05 | 0xF3 | 0x88 | 0x00 | 0x02 |  |
#### 2.4.5 Stroke Limit
##### 2.4.5.1 Description
Command packet to assign Short Stroke limit to 100(0x0064)
- ID : mightyZAP ID 
- Command : Save data at respective address in order
- Address : the address which short stroke limit value is saved. (see User Manual Data Map)
- Data #1 : Desired Short stroke limit value’s lower byte (address 0x06 : 0x64)
- Data #2 : Desired Short stroke limit value’s upper byte (address 0x07 : 0x00)
	※Stroke limit value Hex change(decimal number -> hexadecimal number) : 100 -> 0x0064
##### 2.4.5.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data) | Factor #3<br>(Data) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x05 | 0xF3 | 0x06 | 0x64 | 0x00 | 0x9C |
#### 2.4.6 Force On/Off
##### 2.4.6.1 Description
Command packet to cut off Motor power while communication is alive.
- ID : mightyZAP ID 
- Command : Save data at respective address in order.
- Address : the address which Force On/Off value is saved. (see User Manual Data Map)
- Data : Desired Force On/Off Data byte (address0x80 : 0x00(Off) / 0x01(On))
- After force-off, automatically Force On when next goal position command is made.
##### 2.4.6.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x04 | 0xF3 | 0x80 | 0x00 | 0x87 |
#### 2.4.7 Feedback Return Mode
##### 2.4.7.1 Description
Command packet to send Feedback packet for All commands.
- ID : mightyZAP ID 
- Command : Save data at respective address in order.
- Address : the address which Feedback Return Mode value is saved. (see User Manual Data Map)
- Data : Feedback Return Mode Data (address 0x10 : 0x02)
	1 :: Send Feedback packet only to Load Data(0xF3) Command
	2 : Send Feedback packet to All
##### 2.4.7.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x04 | 0xF3 | 0x10 | 0x02 | 0xF5 |
## 2.5 Load Data
Send address and Get data feedback
#### 2.5.1 Present Position
##### 2.5.1.1 Description
Command packet to read present Position
##### 2.5.1.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Length) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x04 | 0xf2 | 0x8C | 0x02 | 0x7B |

- ID : mightyZAP ID
- Command : Read byte (equivalent to the Length number) from Address
- Address : : Address where present position value is saved. (see User Manual Data Map)
- Length : The number of byte to read from Address (present position value consists of 2byte.)
##### 2.5.1.3 Feeback Packet
| HEADER | ID | Size | Error | Factor #1 | Factor #2 | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x04 | 0x00 | 0xFF | 0x07 | 0xF5 |

-  ID : mightyZAP ID
- Error : Error indication during operation
- Factor 1 : Present position value’s lower byte (ex> 0xff)
- Factor 2 : Present position value’s upper byte (ex> 0x07)
	※ Present position value Hex change(hexadecimal number -> decimal number) : 0x07ff -> 2047
#### 2.5.2 Present Motor Operating Rate
##### 2.5.1.1 Description
Command packet to read present Motor Operating Rate
##### 2.5.1.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Length) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x04 | 0xF2 | 0x90 | 0x02 | 0x77 |

- ID : mightyZAP의 ID
- Command : Read byte (equivalent to the Length number) from Address
- Address : Address where present motor operating rate value is saved. (see User Manual Data Map)
- Length : The number of byte to read from Address (present load value consists of 2byte.)
##### 2.5.1.3 Feeback Packet
| HEADER | ID | Size | Error | Factor #1 | Factor #2 | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x04 | 0x00 | 0xFF | 0x03 | 0xF9 |

-  ID : mightyZAP ID
- Error : Error indication during operation
- Factor 1 : Present motor operating rate value lower byte (ex> 0xff)
- Factor 2 : Present motor operating rate value upper byte (ex> 0x03)
	※ Present motor operating rate value Hex change(hexadecimal number ->  decimal number) : 0x03ff -> 1023
#### 2.5.3 Present Voltage
##### 2.5.1.1 Description
Command packet to read present input Voltage
##### 2.5.1.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Length) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x04 | 0xF2 | 0x92 | 0x01 | 0x76 |

- ID : 대상 mightyZAP의 ID
- Command : Read byte (equivalent to the Length number) from Address
- Address : Address where present voltage value is saved. (see User Manual Data Map)
- Length : The number of byte to read from Address (present voltage value consists of 2byte.)
##### 2.5.1.3 Feeback Packet
| HEADER | ID | Size | Error | Factor #1 | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x00 | 0x03 | 0x00 | 0x7B | 0x81 |

-  ID : mightyZAP ID
- Error : : Error indication during operation
- Factor 1 :: Present Voltage value byte (ex> 0x7B)
	※ Present voltage value Hex change(hexadecimal number -> decimal number): 0x7B -> 123(12.3V)
## 2.6 Send Data
Send "Address" and "Data", Then temporarily store it.
#### 2.6.1 Gaol Position
##### 2.6.1.1 Description
Command packet for temporary store of goal position as 2047(0x07FF).
##### 2.6.1.2 Command Packet
| HEADER | ID | Size | Command | Factor #1<br>(Address) | Factor #2<br>(Data 1) | Factor #2<br>(Data 2) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x05 | 0xF4 | 0x86 | 0xff | 0x07 | 0x79 |
##### 2.6.1.3 Feedback Packet
| HEADER | ID | Size | Error | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x02 | 0x00 | 0xFC |
## 2.7 Excution
Execute temporarily stored data that is made by Send Data.
#### 2.6.1 Example
##### 2.6.1.1 Description
Command packet to execute all temporarily stored data at the same time.
Feedback packet informing receipt of execution command for temporarily stored data. (Only feedback in the Feedback Return Mode2)
##### 2.6.1.2 Command Packet
| HEADER | ID | Size | Command | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x02 | 0xF5 | 0x07 |
##### 2.6.1.3 Feedback Packet
| HEADER | ID | Size | Error | Checksum |
| ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x02 | 0x00 | 0xFC |
## 2.7 Symmetric Store
Save data in the same address of multiple mightyZAP
#### 2.7.1 Goal Position
##### 2.7.1.1 Description
Command packet to assign multiple mightyZAP’s goal positions.
- ID 1 : 1023(0x03FF)
- ID 2 : 2047(0x07FF)
##### 2.7.1.2 Command Packet
| HEADER | ID | Size | Command | Factor 1<br>(Address) | Factor 2<br>(Length) |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 0xFFFFFF | 0x01 | 0x0A | 0x73 | 0x86 | 0x02 |

| Factor 3<br>(1> ID) | Factor 4<br>(1> Data 1) | Factor 4<br>(1> Data 2) | Factor 4<br>(2> ID) | Factor 7<br>(2> Data 1) | Factor 8<br>(2> Data 2) | Checksum |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0x01 | 0xFF | 0x03 | 0x02 | 0xFF | 0x07 | 0xF1 |

- Command packet to assign respective goal position to multiple qty mightyZAP motors at the same time. 
- Better synchronization without delay than respective command is made for each mightyZAP. 
- ID : Broadcast ID (Command to all connected IDs) 
- Command : Send data at the same time to the ID defined in Factor (1>ID, 2>ID …) 
- Address : Address present position value is saved. (See User Manual Data Map) 
- Length: The number of byte to read from Address (present position value consists of 2byte.) 
- feedback Packet : No Feedback.
## Packet Test
