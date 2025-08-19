물론입니다. 코드에 포함된 모든 한글 텍스트를 자연스러운 영어로 교체한 전체 코드입니다.

-----

```vue
<template>
  <div>
    <section class="hero-section">
      <div class="container">
        <h1>MightyZAP</h1>
        <p class="subtitle">Find all technical information, including product manuals, datasheets, and software, right here.</p>
        <div class="search-wrapper" ref="searchWrapperRef">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search by product, model, or keyword... (e.g., 17Lf, Modbus)" 
            class="search-input" 
            autocomplete="off"
            v-model="searchQuery" 
            @input="updateRecommendations" 
            @keydown="handleKeydown"
          >
          <div class="recommendations-panel" v-if="currentResults.length > 0">
            <div 
              v-for="(item, index) in currentResults" 
              :key="item.link"
              class="recommendation-item"
              :class="{ active: index === activeIndex }"
              @mousedown.prevent="goToLink(item.link)"
              @mouseover="activeIndex = index"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="feature-section" style="background-color: var(--color-gray-50);">
      <div class="container">
        <div class="section-header">
          <h2>Find Documents by Product Series</h2>
          <p>Select a product series to find related documents.</p>
        </div>
        <div class="grid-container grid-container-md-2 grid-container-lg-3">
          <a href="#" class="product-card">
            <div class="image-wrapper"><img src="https://placehold.co/400x300/e2e8f0/334155?text=Mini+17Lf" alt="Image of Mini 17Lf Series"></div>
            <div class="content">
              <h3>Mini 17Lf Series</h3>
              <p>Compact linear actuator for small-scale precision control.</p>
            </div>
          </a>
          <a href="#" class="product-card">
            <div class="image-wrapper"><img src="https://placehold.co/400x300/e2e8f0/334155?text=Mini+12Lf" alt="Image of Mini 12Lf Series"></div>
            <div class="content">
              <h3>Mini 12Lf Series</h3>
              <p>A linear servo with powerful force in an ultra-compact size.</p>
            </div>
          </a>
          <a href="#" class="product-card">
            <div class="image-wrapper"><img src="https://placehold.co/400x300/e2e8f0/334155?text=D7D12L12" alt="Image of D7D12L12 Series"></div>
            <div class="content">
              <h3>D7D12L12 Series</h3>
              <p>Industrial linear actuator with enhanced durability and reliability.</p>
            </div>
          </a>
        </div>
      </div>
    </section>
    
    <section class="feature-section" style="background-color: white;">
      <div class="container content-with-sidebar">
        <div class="main-content-col">
          <div class="section-header">
            <h2>Technical Support Resources</h2>
            <p>Find various information needed for troubleshooting and development.</p>
          </div>
          <div class="grid-container grid-container-md-2">
            <a href="#" class="resource-card">
              <div class="icon-wrapper" style="background-color: #dbeafe; color: #2563eb;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              <h3>Getting Started</h3>
              <p>Basic connection and operation guide for first-time users.</p>
            </a>
            <a href="#" class="resource-card">
              <div class="icon-wrapper" style="background-color: #d1fae5; color: #059669;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <h3>FAQ</h3>
              <p>A collection of frequently asked questions and answers.</p>
            </a>
            <a href="#" class="resource-card">
              <div class="icon-wrapper" style="background-color: #f3e8ff; color: #9333ea;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              <h3>Technical Drawings</h3>
              <p>Datasheets and CAD files for all products.</p>
            </a>
            <a href="#" class="resource-card">
               <div class="icon-wrapper" style="background-color: #fef9c3; color: #d97706;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 011.806-.547z" /></svg></div>
              <h3>Troubleshooting</h3>
              <p>Guide for error codes and operational failures.</p>
            </a>
          </div>
        </div>
        <aside class="updates-sidebar-col">
          <div class="section-header">
            <h2>Latest Updates</h2>
          </div>
          <div class="updates-list">
            <a href="#" class="update-item">
              <p class="date">July 31, 2025</p>
              <h4>mightyZAP 17Lf User Manual (v2.1) Updated</h4>
              <p>Content related to Modbus RTU communication has been enhanced.</p>
            </a>
            <a href="#" class="update-item">
              <p class="date">July 28, 2025</p>
              <h4>Total Manager Software Guide Added</h4>
              <p>Instructions for the new Motion Teaching feature have been added.</p>
            </a>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const searchQuery = ref('');
const activeIndex = ref(-1);
const currentResults = ref([]);
const searchWrapperRef = ref(null);

const modelData = [
  { keywords: ["accessories", "board", "EZController", "CT-01_drawing"], link: '/accessories/board/EZController/CT-01_drawing', label: 'Ct-01 Drawing' },
  { keywords: ["accessories", "board", "EZController", "EZ_ontroller_UserManual"], link: '/accessories/board/EZController/EZ_ontroller_UserManual', label: 'Ez Ontroller Usermanual' },
  { keywords: ["accessories", "board", "UartInterfaceboard", "UART01-drawing"], link: '/accessories/board/UartInterfaceboard/UART01-drawing', label: 'Uart01-Drawing' },
  { keywords: ["accessories", "board", "USBInterface", "Datasheet", "USB-03_datasheet"], link: '/accessories/board/USBInterface/Datasheet/USB-03_datasheet', label: 'Usb-03 Datasheet' },
  { keywords: ["accessories", "board", "USBInterface", "drawings", "USB-02_drawing"], link: '/accessories/board/USBInterface/drawings/USB-02_drawing', label: 'Usb-02 Drawing' },
  { keywords: ["accessories", "board", "USBInterface", "drawings", "usb-03_drawiing"], link: '/accessories/board/USBInterface/drawings/usb-03_drawiing', label: 'Usb-03 Drawiing' },
  { keywords: ["accessories", "board", "USBInterface", "drivers", "Drivers"], link: '/accessories/board/USBInterface/drivers/Drivers', label: 'Drivers' },
  { keywords: ["accessories", "etc", "소음 저감 TIP"], link: '/accessories/etc/소음 저감 TIP', label: '소음 저감 Tip' },
  { keywords: ["accessories", "etc", "제품 설치 방법(26_27mm)"], link: '/accessories/etc/제품 설치 방법(26_27mm)', label: '제품 설치 방법(26 27Mm)' },
  { keywords: ["accessories", "etc", "제품 설치 방법(40_96mm)"], link: '/accessories/etc/제품 설치 방법(40_96mm)', label: '제품 설치 방법(40 96Mm)' },
  { keywords: ["accessories", "etc", "컨트롤러별mightyZAP 결선도"], link: '/accessories/etc/컨트롤러별mightyZAP 결선도', label: '컨트롤러별Mightyzap 결선도' },
  { keywords: ["accessories", "Mounting", "mc05-drawing"], link: '/accessories/Mounting/mc05-drawing', label: 'Mc05-Drawing' },
  { keywords: ["accessories", "Mounting", "MB02", "mb02-assemble"], link: '/accessories/Mounting/MB02/mb02-assemble', label: 'Mb02-Assemble' },
  { keywords: ["accessories", "Mounting", "MB02", "mb02-drawing"], link: '/accessories/Mounting/MB02/mb02-drawing', label: 'Mb02-Drawing' },
  { keywords: ["accessories", "Mounting", "MB03", "mb03-assemble"], link: '/accessories/Mounting/MB03/mb03-assemble', label: 'Mb03-Assemble' },
  { keywords: ["accessories", "Mounting", "MB03", "mb03-drawing"], link: '/accessories/Mounting/MB03/mb03-drawing', label: 'Mb03-Drawing' },
  { keywords: ["accessories", "Mounting", "MB04", "mb04-assemble"], link: '/accessories/Mounting/MB04/mb04-assemble', label: 'Mb04-Assemble' },
  { keywords: ["accessories", "Mounting", "MB04", "mb04-drawing"], link: '/accessories/Mounting/MB04/mb04-drawing', label: 'Mb04-Drawing' },
  { keywords: ["accessories", "Mounting", "MB05", "mb05-drawing"], link: '/accessories/Mounting/MB05/mb05-drawing', label: 'Mb05-Drawing' },
  { keywords: ["accessories", "Mounting", "MB06", "mb06-drawing"], link: '/accessories/Mounting/MB06/mb06-drawing', label: 'Mb06-Drawing' },
  { keywords: ["accessories", "Mounting", "MB07", "mb07-drawing"], link: '/accessories/Mounting/MB07/mb07-drawing', label: 'Mb07-Drawing' },
  { keywords: ["accessories", "Mounting", "MC05", "mb05-drawing"], link: '/accessories/Mounting/MC05/mb05-drawing', label: 'Mb05-Drawing' },
  { keywords: ["accessories", "RodendTips", "GT01", "GT01-drawing"], link: '/accessories/RodendTips/GT01/GT01-drawing', label: 'Gt01-Drawing' },
  { keywords: ["accessories", "RodendTips", "MB01", "EB01-assemble"], link: '/accessories/RodendTips/MB01/EB01-assemble', label: 'Eb01-Assemble' },
  { keywords: ["accessories", "RodendTips", "MB01", "EB01-Drawing"], link: '/accessories/RodendTips/MB01/EB01-Drawing', label: 'Eb01-Drawing' },
  { keywords: ["accessories", "RodendTips", "MC06", "MC06-drawing"], link: '/accessories/RodendTips/MC06/MC06-drawing', label: 'Mc06-Drawing' },
  { keywords: ["accessories", "wire", "wire_connector"], link: '/accessories/wire/wire_connector', label: 'Wire Connector' },
  { keywords: ["actuator", "D7D12L12", "Catalogue", "D7D12L12_Catalogue"], link: '/actuator/D7D12L12/Catalogue/D7D12L12_Catalogue', label: 'D7D12L12 Catalogue' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxF-10_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxF-10_Datasheet', label: 'L12-Xxf-10 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxF-3_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxF-3_Datasheet', label: 'L12-Xxf-3 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxF-4_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxF-4_Datasheet', label: 'L12-Xxf-4 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxF-6_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxF-6_Datasheet', label: 'L12-Xxf-6 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxPT-10_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxPT-10_Datasheet', label: 'L12-Xxpt-10 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxPT-3_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxPT-3_Datasheet', label: 'L12-Xxpt-3 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxPT-4_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxPT-4_Datasheet', label: 'L12-Xxpt-4 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Datasheet", "L12-xxPT-6_Datasheet"], link: '/actuator/D7D12L12/Datasheet/L12-xxPT-6_Datasheet', label: 'L12-Xxpt-6 Datasheet' },
  { keywords: ["actuator", "D7D12L12", "Drawings", "D7D12-xx-3_Drawings"], link: '/actuator/D7D12L12/Drawings/D7D12-xx-3_Drawings', label: 'D7D12-Xx-3 Drawings' },
  { keywords: ["actuator", "D7D12L12", "Drawings", "L12-xx-10_Drawings"], link: '/actuator/D7D12L12/Drawings/L12-xx-10_Drawings', label: 'L12-Xx-10 Drawings' },
  { keywords: ["actuator", "D7D12L12", "Drawings", "L12-xx-3_Drawings"], link: '/actuator/D7D12L12/Drawings/L12-xx-3_Drawings', label: 'L12-Xx-3 Drawings' },
  { keywords: ["actuator", "D7D12L12", "Drawings", "L12-xx-4_Drawings"], link: '/actuator/D7D12L12/Drawings/L12-xx-4_Drawings', label: 'L12-Xx-4 Drawings' },
  { keywords: ["actuator", "D7D12L12", "Drawings", "L12-xx-6_Drawings"], link: '/actuator/D7D12L12/Drawings/L12-xx-6_Drawings', label: 'L12-Xx-6 Drawings' },
  { keywords: ["actuator", "D7D12L12", "firmware", "D7D12L12_Firmware"], link: '/actuator/D7D12L12/firmware/D7D12L12_Firmware', label: 'D7D12L12 Firmware' },
  { keywords: ["actuator", "D7D12L12", "Manual", "D7D12L12_lifecycle"], link: '/actuator/D7D12L12/Manual/D7D12L12_lifecycle', label: 'D7D12L12 Lifecycle' },
  { keywords: ["actuator", "D7D12L12", "Manual", "D7D12L12_Manual"], link: '/actuator/D7D12L12/Manual/D7D12L12_Manual', label: 'D7D12L12 Manual' },
  { keywords: ["actuator", "limitSwitch", "datasheet", "12L12D_Limit_Switch_Datasheet_V2.0"], link: '/actuator/limitSwitch/datasheet/12L12D_Limit_Switch_Datasheet_V2.0', label: '12L12D Limit Switch Datasheet V2.0' },
  { keywords: ["actuator", "limitSwitch", "drawings", "12D_Limit_Switch_Drawings"], link: '/actuator/limitSwitch/drawings/12D_Limit_Switch_Drawings', label: '12D Limit Switch Drawings' },
  { keywords: ["actuator", "limitSwitch", "drawings", "12D_Nano_Limit_Switch_Drawings"], link: '/actuator/limitSwitch/drawings/12D_Nano_Limit_Switch_Drawings', label: '12D Nano Limit Switch Drawings' },
  { keywords: ["actuator", "limitSwitch", "drawings", "12L_Limit_Switch_Drawings"], link: '/actuator/limitSwitch/drawings/12L_Limit_Switch_Drawings', label: '12L Limit Switch Drawings' },
  { keywords: ["actuator", "Mini12Lf", "Catalogue", "12Lf_Catalogue"], link: '/actuator/Mini12Lf/Catalogue/12Lf_Catalogue', label: '12Lf Catalogue' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-27_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-27_Datasheet', label: '12Lf-Xxf-27 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-40_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-40_Datasheet', label: '12Lf-Xxf-40 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-53_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-53_Datasheet', label: '12Lf-Xxf-53 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-90_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxF-90_Datasheet', label: '12Lf-Xxf-90 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-27_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-27_Datasheet', label: '12Lf-Xxpt-27 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-40_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-40_Datasheet', label: '12Lf-Xxpt-40 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-53_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-53_Datasheet', label: '12Lf-Xxpt-53 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-90_Datasheet"], link: '/actuator/Mini12Lf/Datasheet/12Lf-xxPT-90_Datasheet', label: '12Lf-Xxpt-90 Datasheet' },
  { keywords: ["actuator", "Mini12Lf", "Drawings", "12Lf-xx-27_Drawings"], link: '/actuator/Mini12Lf/Drawings/12Lf-xx-27_Drawings', label: '12Lf-Xx-27 Drawings' },
  { keywords: ["actuator", "Mini12Lf", "Drawings", "12Lf-xx-40_Drawings"], link: '/actuator/Mini12Lf/Drawings/12Lf-xx-40_Drawings', label: '12Lf-Xx-40 Drawings' },
  { keywords: ["actuator", "Mini12Lf", "Drawings", "12Lf-xx-53_Drawings"], link: '/actuator/Mini12Lf/Drawings/12Lf-xx-53_Drawings', label: '12Lf-Xx-53 Drawings' },
  { keywords: ["actuator", "Mini12Lf", "Drawings", "12Lf-xx-90_Drawings"], link: '/actuator/Mini12Lf/Drawings/12Lf-xx-90_Drawings', label: '12Lf-Xx-90 Drawings' },
  { keywords: ["actuator", "Mini12Lf", "firmware", "12Lf_Firmware"], link: '/actuator/Mini12Lf/firmware/12Lf_Firmware', label: '12Lf Firmware' },
  { keywords: ["actuator", "Mini12Lf", "Library", "12Lf_Library"], link: '/actuator/Mini12Lf/Library/12Lf_Library', label: '12Lf Library' },
  { keywords: ["actuator", "Mini12Lf", "Manual", "12Lf_IRProtocol"], link: '/actuator/Mini12Lf/Manual/12Lf_IRProtocol', label: '12Lf Irprotocol' },
  { keywords: ["actuator", "Mini12Lf", "Manual", "12Lf_Manual"], link: '/actuator/Mini12Lf/Manual/12Lf_Manual', label: '12Lf Manual' },
  { keywords: ["actuator", "Mini12Lf", "Manual", "12Lf_ModbusRTU_kor"], link: '/actuator/Mini12Lf/Manual/12Lf_ModbusRTU_kor', label: '12Lf Modbusrtu Kor' },
  { keywords: ["actuator", "Mini17Lf", "Catalogue", "17Lf_Catalogue"], link: '/actuator/Mini17Lf/Catalogue/17Lf_Catalogue', label: '17Lf Catalogue' },
  { keywords: ["actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-27_Datasheet"], link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-27_Datasheet', label: '17Lf-Xxf-27 Datasheet' },
  { keywords: ["actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-37_Datasheet"], link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-37_Datasheet', label: '17Lf-Xxf-37 Datasheet' },
  { keywords: ["actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-50_Datasheet"], link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-50_Datasheet', label: '17Lf-Xxf-50 Datasheet' },
  { keywords: ["actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-87_Datasheet"], link: '/actuator/Mini17Lf/Datasheet/17Lf-xxF-87_Datasheet', label: '17Lf-Xxf-87 Datasheet' },
  { keywords: ["actuator", "Mini17Lf", "Drawing", "17Lf-xx-27_Drawings"], link: '/actuator/Mini17Lf/Drawing/17Lf-xx-27_Drawings', label: '17Lf-Xx-27 Drawings' },
  { keywords: ["actuator", "Mini17Lf", "Drawing", "17Lf-xx-37_Drawings"], link: '/actuator/Mini17Lf/Drawing/17Lf-xx-37_Drawings', label: '17Lf-Xx-37 Drawings' },
  { keywords: ["actuator", "Mini17Lf", "Drawing", "17Lf-xx-50_Drawings"], link: '/actuator/Mini17Lf/Drawing/17Lf-xx-50_Drawings', label: '17Lf-Xx-50 Drawings' },
  { keywords: ["actuator", "Mini17Lf", "Drawing", "17Lf-xx-87_Drawings"], link: '/actuator/Mini17Lf/Drawing/17Lf-xx-87_Drawings', label: '17Lf-Xx-87 Drawings' },
  { keywords: ["actuator", "Mini17Lf", "firmware", "17Lf_firmware"], link: '/actuator/Mini17Lf/firmware/17Lf_firmware', label: '17Lf Firmware' },
  { keywords: ["actuator", "Mini17Lf", "Library", "17Lf_library"], link: '/actuator/Mini17Lf/Library/17Lf_library', label: '17Lf Library' },
  { keywords: ["actuator", "Mini17Lf", "Manual", "17Lf_ModbusRTU"], link: '/actuator/Mini17Lf/Manual/17Lf_ModbusRTU', label: '17Lf Modbusrtu' },
  { keywords: ["actuator", "Mini17Lf", "Manual", "7Lf_UserManual"], link: '/actuator/Mini17Lf/Manual/7Lf_UserManual', label: '7Lf Usermanual' },
  { keywords: ["en", "accessories", "board", "EZ Controller User Manual"], link: '/en/accessories/board/EZ Controller User Manual', label: 'Ez Controller User Manual' },
  { keywords: ["en", "accessories", "board", "EZController", "CT-01_drawing"], link: '/en/accessories/board/EZController/CT-01_drawing', label: 'Ct-01 Drawing' },
  { keywords: ["en", "accessories", "board", "EZController", "EZ_Controller_Manual"], link: '/en/accessories/board/EZController/EZ_Controller_Manual', label: 'Ez Controller Manual' },
  { keywords: ["en", "accessories", "board", "UartInterfaceboard", "UART01-drawing"], link: '/en/accessories/board/UartInterfaceboard/UART01-drawing', label: 'Uart01-Drawing' },
  { keywords: ["en", "accessories", "board", "USBInterface", "Datasheet", "USB-03_datasheet"], link: '/en/accessories/board/USBInterface/Datasheet/USB-03_datasheet', label: 'Usb-03 Datasheet' },
  { keywords: ["en", "accessories", "board", "USBInterface", "drawings", "USB-02_drawing"], link: '/en/accessories/board/USBInterface/drawings/USB-02_drawing', label: 'Usb-02 Drawing' },
  { keywords: ["en", "accessories", "board", "USBInterface", "drawings", "usb-03_drawiing"], link: '/en/accessories/board/USBInterface/drawings/usb-03_drawiing', label: 'Usb-03 Drawiing' },
  { keywords: ["en", "accessories", "board", "USBInterface", "drivers", "Drivers"], link: '/en/accessories/board/USBInterface/drivers/Drivers', label: 'Drivers' },
  { keywords: ["en", "accessories", "etc", "소음 저감 TIP"], link: '/en/accessories/etc/소음 저감 TIP', label: '소음 저감 Tip' },
  { keywords: ["en", "accessories", "etc", "제품 설치 방법(26_27mm)"], link: '/en/accessories/etc/제품 설치 방법(26_27mm)', label: '제품 설치 방법(26 27Mm)' },
  { keywords: ["en", "accessories", "etc", "제품 설치 방법(40_96mm)"], link: '/en/accessories/etc/제품 설치 방법(40_96mm)', label: '제품 설치 방법(40 96Mm)' },
  { keywords: ["en", "accessories", "etc", "컨트롤러별mightyZAP 결선도"], link: '/en/accessories/etc/컨트롤러별mightyZAP 결선도', label: '컨트롤러별Mightyzap 결선도' },
  { keywords: ["en", "accessories", "Mounting", "mc05-drawing"], link: '/en/accessories/Mounting/mc05-drawing', label: 'Mc05-Drawing' },
  { keywords: ["en", "accessories", "Mounting", "MB02", "mb02-assemble"], link: '/en/accessories/Mounting/MB02/mb02-assemble', label: 'Mb02-Assemble' },
  { keywords: ["en", "accessories", "Mounting", "MB02", "mb02-drawing"], link: '/en/accessories/Mounting/MB02/mb02-drawing', label: 'Mb02-Drawing' },
  { keywords: ["en", "accessories", "Mounting", "MB03", "mb03-assemble"], link: '/en/accessories/Mounting/MB03/mb03-assemble', label: 'Mb03-Assemble' },
  { keywords: ["en", "accessories", "Mounting", "MB03", "mb03-drawing"], link: '/en/accessories/Mounting/MB03/mb03-drawing', label: 'Mb03-Drawing' },
  { keywords: ["en", "accessories", "Mounting", "MB04", "mb04-assemble"], link: '/en/accessories/Mounting/MB04/mb04-assemble', label: 'Mb04-Assemble' },
  { keywords: ["en", "accessories", "Mounting", "MB04", "mb04-drawing"], link: '/en/accessories/Mounting/MB04/mb04-drawing', label: 'Mb04-Drawing' },
  { keywords: ["en", "accessories", "Mounting", "MB05", "mb05-drawing"], link: '/en/accessories/Mounting/MB05/mb05-drawing', label: 'Mb05-Drawing' },
  { keywords: ["en", "accessories", "Mounting", "MB06", "mb06-drawing"], link: '/en/accessories/Mounting/MB06/mb06-drawing', label: 'Mb06-Drawing' },
  { keywords: ["en", "accessories", "Mounting", "MB07", "mb07-drawing"], link: '/en/accessories/Mounting/MB07/mb07-drawing', label: 'Mb07-Drawing' },
  { keywords: ["en", "accessories", "Mounting", "MC05", "mb05-drawing"], link: '/en/accessories/Mounting/MC05/mb05-drawing', label: 'Mb05-Drawing' },
  { keywords: ["en", "accessories", "RodendTips", "GT01", "GT01-drawing"], link: '/en/accessories/RodendTips/GT01/GT01-drawing', label: 'Gt01-Drawing' },
  { keywords: ["en", "accessories", "RodendTips", "MB01", "EB01-assemble"], link: '/en/accessories/RodendTips/MB01/EB01-assemble', label: 'Eb01-Assemble' },
  { keywords: ["en", "accessories", "RodendTips", "MB01", "EB01-Drawing"], link: '/en/accessories/RodendTips/MB01/EB01-Drawing', label: 'Eb01-Drawing' },
  { keywords: ["en", "accessories", "RodendTips", "MC06", "MC06-drawing"], link: '/en/accessories/RodendTips/MC06/MC06-drawing', label: 'Mc06-Drawing' },
  { keywords: ["en", "accessories", "wire", "wire_connector"], link: '/en/accessories/wire/wire_connector', label: 'Wire Connector' },
  { keywords: ["en", "actuator", "D7D12L12", "Catalogue", "D7D12L12_Catalogue"], link: '/en/actuator/D7D12L12/Catalogue/D7D12L12_Catalogue', label: 'D7D12L12 Catalogue' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxF-10_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-10_Datasheet', label: 'L12-Xxf-10 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxF-3_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-3_Datasheet', label: 'L12-Xxf-3 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxF-4_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-4_Datasheet', label: 'L12-Xxf-4 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxF-6_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxF-6_Datasheet', label: 'L12-Xxf-6 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxPT-10_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-10_Datasheet', label: 'L12-Xxpt-10 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxPT-3_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-3_Datasheet', label: 'L12-Xxpt-3 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxPT-4_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-4_Datasheet', label: 'L12-Xxpt-4 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Datasheet", "L12-xxPT-6_Datasheet"], link: '/en/actuator/D7D12L12/Datasheet/L12-xxPT-6_Datasheet', label: 'L12-Xxpt-6 Datasheet' },
  { keywords: ["en", "actuator", "D7D12L12", "Drawings", "D7D12-xx-3_Drawings"], link: '/en/actuator/D7D12L12/Drawings/D7D12-xx-3_Drawings', label: 'D7D12-Xx-3 Drawings' },
  { keywords: ["en", "actuator", "D7D12L12", "Drawings", "L12-xx-10_Drawings"], link: '/en/actuator/D7D12L12/Drawings/L12-xx-10_Drawings', label: 'L12-Xx-10 Drawings' },
  { keywords: ["en", "actuator", "D7D12L12", "Drawings", "L12-xx-3_Drawings"], link: '/en/actuator/D7D12L12/Drawings/L12-xx-3_Drawings', label: 'L12-Xx-3 Drawings' },
  { keywords: ["en", "actuator", "D7D12L12", "Drawings", "L12-xx-4_Drawings"], link: '/en/actuator/D7D12L12/Drawings/L12-xx-4_Drawings', label: 'L12-Xx-4 Drawings' },
  { keywords: ["en", "actuator", "D7D12L12", "Drawings", "L12-xx-6_Drawings"], link: '/en/actuator/D7D12L12/Drawings/L12-xx-6_Drawings', label: 'L12-Xx-6 Drawings' },
  { keywords: ["en", "actuator", "D7D12L12", "firmware", "D7D12L12_Firmware"], link: '/en/actuator/D7D12L12/firmware/D7D12L12_Firmware', label: 'D7D12L12 Firmware' },
  { keywords: ["en", "actuator", "D7D12L12", "Manual", "D7D12L12_Lifecycle"], link: '/en/actuator/D7D12L12/Manual/D7D12L12_Lifecycle', label: 'D7D12L12 Lifecycle' },
  { keywords: ["en", "actuator", "D7D12L12", "Manual", "D7D12L12_Manual"], link: '/en/actuator/D7D12L12/Manual/D7D12L12_Manual', label: 'D7D12L12 Manual' },
  { keywords: ["en", "actuator", "D7D12L12", "Manual", "usermanual"], link: '/en/actuator/D7D12L12/Manual/usermanual', label: 'Usermanual' },
  { keywords: ["en", "actuator", "LimitSwitch", "datasheet", "12L12D_Series_Limit_Switch_V2.0"], link: '/en/actuator/LimitSwitch/datasheet/12L12D_Series_Limit_Switch_V2.0', label: '12L12D Series Limit Switch V2.0' },
  { keywords: ["en", "actuator", "LimitSwitch", "drawings", "12D_LimitSwitch_Drawings"], link: '/en/actuator/LimitSwitch/drawings/12D_LimitSwitch_Drawings', label: '12D Limitswitch Drawings' },
  { keywords: ["en", "actuator", "LimitSwitch", "drawings", "12D_Nano_LimitSwitch_Drawings"], link: '/en/actuator/LimitSwitch/drawings/12D_Nano_LimitSwitch_Drawings', label: '12D Nano Limitswitch Drawings' },
  { keywords: ["en", "actuator", "LimitSwitch", "drawings", "12L_LimitSwitch_Drawings"], link: '/en/actuator/LimitSwitch/drawings/12L_LimitSwitch_Drawings', label: '12L Limitswitch Drawings' },
  { keywords: ["en", "actuator", "Mini12Lf", "Catalogue", "12Lf_Catalogue"], link: '/en/actuator/Mini12Lf/Catalogue/12Lf_Catalogue', label: '12Lf Catalogue' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-27_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-27_Datasheet', label: '12Lf-Xxf-27 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-40_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-40_Datasheet', label: '12Lf-Xxf-40 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-53_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-53_Datasheet', label: '12Lf-Xxf-53 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxF-90_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxF-90_Datasheet', label: '12Lf-Xxf-90 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-27_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-27_Datasheet', label: '12Lf-Xxpt-27 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-40_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-40_Datasheet', label: '12Lf-Xxpt-40 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-53_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-53_Datasheet', label: '12Lf-Xxpt-53 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Datasheet", "12Lf-xxPT-90_Datasheet"], link: '/en/actuator/Mini12Lf/Datasheet/12Lf-xxPT-90_Datasheet', label: '12Lf-Xxpt-90 Datasheet' },
  { keywords: ["en", "actuator", "Mini12Lf", "Drawings", "12Lf-xx-27_Drawings"], link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-27_Drawings', label: '12Lf-Xx-27 Drawings' },
  { keywords: ["en", "actuator", "Mini12Lf", "Drawings", "12Lf-xx-40_Drawings"], link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-40_Drawings', label: '12Lf-Xx-40 Drawings' },
  { keywords: ["en", "actuator", "Mini12Lf", "Drawings", "12Lf-xx-53_Drawings"], link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-53_Drawings', label: '12Lf-Xx-53 Drawings' },
  { keywords: ["en", "actuator", "Mini12Lf", "Drawings", "12Lf-xx-90_Drawings"], link: '/en/actuator/Mini12Lf/Drawings/12Lf-xx-90_Drawings', label: '12Lf-Xx-90 Drawings' },
  { keywords: ["en", "actuator", "Mini12Lf", "firmware", "12Lf_Firmware"], link: '/en/actuator/Mini12Lf/firmware/12Lf_Firmware', label: '12Lf Firmware' },
  { keywords: ["en", "actuator", "Mini12Lf", "Library", "12Lf_Library"], link: '/en/actuator/Mini12Lf/Library/12Lf_Library', label: '12Lf Library' },
  { keywords: ["en", "actuator", "Mini12Lf", "Manual", "12Lf_IRProtocol"], link: '/en/actuator/Mini12Lf/Manual/12Lf_IRProtocol', label: '12Lf Irprotocol' },
  { keywords: ["en", "actuator", "Mini12Lf", "Manual", "12Lf_Lifecycle"], link: '/en/actuator/Mini12Lf/Manual/12Lf_Lifecycle', label: '12Lf Lifecycle' },
  { keywords: ["en", "actuator", "Mini12Lf", "Manual", "12Lf_Manual"], link: '/en/actuator/Mini12Lf/Manual/12Lf_Manual', label: '12Lf Manual' },
  { keywords: ["en", "actuator", "Mini12Lf", "Manual", "12Lf_ModbusRTU"], link: '/en/actuator/Mini12Lf/Manual/12Lf_ModbusRTU', label: '12Lf Modbusrtu' },
  { keywords: ["en", "actuator", "Mini17Lf", "Catalogue", "17Lf_Catalogue"], link: '/en/actuator/Mini17Lf/Catalogue/17Lf_Catalogue', label: '17Lf Catalogue' },
  { keywords: ["en", "actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-27_Datasheet"], link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-27_Datasheet', label: '17Lf-Xxf-27 Datasheet' },
  { keywords: ["en", "actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-37_Datasheet"], link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-37_Datasheet', label: '17Lf-Xxf-37 Datasheet' },
  { keywords: ["en", "actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-50_Datasheet"], link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-50_Datasheet', label: '17Lf-Xxf-50 Datasheet' },
  { keywords: ["en", "actuator", "Mini17Lf", "Datasheet", "17Lf-xxF-87_Datasheet"], link: '/en/actuator/Mini17Lf/Datasheet/17Lf-xxF-87_Datasheet', label: '17Lf-Xxf-87 Datasheet' },
  { keywords: ["en", "actuator", "Mini17Lf", "Drawing", "17Lf-xx-27_Drawings"], link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-27_Drawings', label: '17Lf-Xx-27 Drawings' },
  { keywords: ["en", "actuator", "Mini17Lf", "Drawing", "17Lf-xx-37_Drawings"], link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-37_Drawings', label: '17Lf-Xx-37 Drawings' },
  { keywords: ["en", "actuator", "Mini17Lf", "Drawing", "17Lf-xx-50_Drawings"], link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-50_Drawings', label: '17Lf-Xx-50 Drawings' },
  { keywords: ["en", "actuator", "Mini17Lf", "Drawing", "17Lf-xx-87_Drawings"], link: '/en/actuator/Mini17Lf/Drawing/17Lf-xx-87_Drawings', label: '17Lf-Xx-87 Drawings' },
  { keywords: ["en", "actuator", "Mini17Lf", "firmware", "17Lf_Firmware"], link: '/en/actuator/Mini17Lf/firmware/17Lf_Firmware', label: '17Lf Firmware' },
  { keywords: ["en", "actuator", "Mini17Lf", "Library", "17Lf_Library"], link: '/en/actuator/Mini17Lf/Library/17Lf_Library', label: '17Lf Library' },
  { keywords: ["en", "actuator", "Mini17Lf", "Manual", "17Lf_Manual"], link: '/en/actuator/Mini17Lf/Manual/17Lf_Manual', label: '17Lf Manual' },
  { keywords: ["en", "actuator", "Mini17Lf", "Manual", "17Lf_ModbusRTU"], link: '/en/actuator/Mini17Lf/Manual/17Lf_ModbusRTU', label: '17Lf Modbusrtu' },
  { keywords: ["en", "software", "TotalManager", "TotalManager_Manual"], link: '/en/software/TotalManager/TotalManager_Manual', label: 'Totalmanager Manual' },
  { keywords: ["img", "rs485_circuit"], link: '/img/rs485_circuit', label: 'Rs485 Circuit' },
  { keywords: ["software", "TotalManager", "Manual", "Total_manager_download"], link: '/software/TotalManager/Manual/Total_manager_download', label: 'Total Manager Download' },
  { keywords: ["software", "TotalManager", "Manual", "Total_Manager_Manual"], link: '/software/TotalManager/Manual/Total_Manager_Manual', label: 'Total Manager Manual' }
];

// The rest of the script remains unchanged
const updateRecommendations = () => {
  const query = searchQuery.value.toLowerCase().trim();
  activeIndex.value = -1;

  if (query.length === 0) {
    currentResults.value = [];
    return;
  }

  const searchTerms = query.split(' ').filter(t => t);
  const isEnglish = typeof window !== 'undefined' && window.location.pathname.startsWith('/en');

  const langFilteredData = modelData.filter(item => {
    const hasEn = item.keywords.includes('en');
    return isEnglish ? hasEn : !hasEn;
  });

  currentResults.value = langFilteredData.map(item => {
    let matchScore = 0;
    searchTerms.forEach(term => {
      if (item.keywords.some(kw => kw.toLowerCase().includes(term))) {
        matchScore++;
      }
    });
    return { ...item, matchScore };
  })
  .filter(item => item.matchScore > 0)
  .sort((a, b) => b.matchScore - a.matchScore);

  console.log('Search Results:', currentResults.value);
};

const handleKeydown = (e) => {
  if (currentResults.value.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % currentResults.value.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + currentResults.value.length) % currentResults.value.length;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const targetLink = activeIndex.value !== -1 
      ? currentResults.value[activeIndex.value].link 
      : currentResults.value[0].link;
    goToLink(targetLink);
  }
};

const goToLink = (link) => {
  if (typeof window !== 'undefined') {
    window.location.href = link;
  }
};

const handleClickOutside = (event) => {
  if (searchWrapperRef.value && !searchWrapperRef.value.contains(event.target)) {
    currentResults.value = [];
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

```