## **mightyZAP Force Control Lineup (Model: 12Lf) V2.1 Firmware Update**
This is the V2.1 firmware update for performance improvement and stabilization of the **mightyZAP Force Control lineup** (Model: 12Lf).
  * **Target Models:** All 12Lf models
  * **Update Version:** **V2.1** (Last updated: February 28, 2022)
  * **Key Changes:** Bug fixes and stability improvements (includes V2.0 enhancements such as MODBUS RTU support).

### **Prerequisites for Update**
Before proceeding with the update, please ensure you have the following items ready.

  * **PC Interface:** IR-USB01 or IR-USB02
  * **Manager Software:** Install the **new version V3.1.1**
      * [**Download New Manager Software / Update Manual**](https://www.google.com/search?q=http://www.mightyzap.com/en/digitalarchive6/%3Fmod%3Ddocument%26pageid%3D1%26uid%3D211)

### **Important Precautions**
Please read the following precautions carefully to ensure a safe and smooth update.
  * **Mandatory Equipment Test:** After updating the firmware of an actuator already installed in your equipment, you **must conduct an equipment test again** to verify that there are no issues with its operational characteristics.
  * **Correct Model Selection:** You must install the firmware that **matches the model name** of your actuator. If you accidentally install the wrong firmware, you can simply update it again with the correct one.
  * **Individual Updates:** Actuators **must be updated one at a time.** Attempting to update multiple units simultaneously may cause errors.
  * **Check Connections:** Do not touch the communication and power cables connecting the PC, interface, and actuator during the update. If a communication error occurs, please refer to the manual and try again.
  * **Change in Calibration Procedure:** For V2.0 and later versions, the `Stroke Calibration` procedure is **omitted** after the update is complete.

### **Firmware Download**
  * Please refer to the old and new firmware number for each actuator model.
  * The firmware version number can be found on the mightyZAP manager software. Connect your actuator with the software, then see the "Management" -> "Information" window or "System" -> "Firmware version".
  * If your firmware version is an older version, please update it for better performance.

<FirmwareSelector12Lf />

### **Release Notes (Changelog)**
#### **V2.1 Changes (2022-02-28)**
  * Resolved an issue where Min/Max Position Calibration data failed to save after a reset. (Saved Min/Max Position Calibration data is now retained even after a reset).
  * Fixed a save failure issue that occurred after setting the Current Limit.
#### **V2.0 Changes (2021-10-06)**
  * **Major Feature Additions and Improvements**
      * **Expanded Communication Protocol:** Added support for the **MODBUS RTU** protocol (selectable with IR Open Protocol).
      * **Additional Communication Speed Option:** Added **38400 Baudrate**.
      * **Added User Configuration Feature:** Start/end points can now be set using the **Min/Max Position Calibration** feature.
  * **Stability and Convenience Improvements**
      * **Improved Boot-up Stability:** Prevents drifting by immediately turning ON with **Force Enable** upon power-up.
      * **Ensured Communication Stability:** Changed Return Delay to a fixed value dependent on the Baudrate.
      * **Enhanced System Stability:** Stroke Pulse width and Center Difference parameters are now fixed and cannot be changed.
      * **Simplified Error Indication:** The error status display has been simplified from 7 types to 2, with the LED color simplified to **solid/blinking RED**.
      * **Improved Configuration Convenience:** Changed Compliance Margin to a **non-volatile parameter** to retain its value even after power is turned off.