# 🌍 Environmental & Social Training Portal

This repository contains the front-end JavaScript code for the **E&S Training Portal**, developed for managing and monitoring environmental and social awareness training sessions for construction teams.

---

## 📁 Repository Contents

| File | Description |
|------|--------------|
| `app_integrated_final.js` | The latest integrated version that combines form submission, Google Apps Script integration, and a dynamic dashboard with charts. |

---

## 🚀 Project Overview

The portal allows users to:
- Register participants in training sessions.
- Automatically store the data in **Google Sheets** using **Google Apps Script**.
- Display a **dashboard** that shows KPIs, tables, and charts generated using **Chart.js**.

---

## 🧩 Key Features

- 📝 Online registration form connected to Google Sheets  
- 📊 Real-time dashboard (total trainees, daily count, companies)  
- 🧠 Multi-language and multi-topic training selection  
- 📈 Dynamic charts (Pie, Bar, Line) for language, topic, and monthly stats  
- 🛠 Offline-safe mechanism (optional local storage fallback)  

---

## ⚙️ Integration with Google Apps Script

To connect the portal with Google Sheets:

1. Open [Google Apps Script](https://script.google.com/macros/s/AKfycbwXKtB7mMqlOVop4jNpYA9EFra2ffbobC7Atk1i-DW8d9y4YnW-M1Ja-uh-3DgiyILI/exec).
2. Create a new project and paste this code:

   ```javascript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
   const SHEET_NAME = "Sheet1";

   function doPost(e) {
     var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
     sheet.appendRow([
       new Date().toISOString(),
       e.parameter.name,
       e.parameter.company,
       e.parameter.jobTitle,
       e.parameter.topic,
       e.parameter.language,
       e.parameter.trainingLink
     ]);
     return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
   }

   function doGet(e) {
     var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
     var data = sheet.getDataRange().getValues();
     var rows = [];

     for (var i = 1; i < data.length; i++) {
       rows.push({
         timestamp: data[i][0],
         name: data[i][1],
         company: data[i][2],
         jobTitle: data[i][3],
         topic: data[i][4],
         language: data[i][5],
         trainingLink: data[i][6]
       });
     }

     var today = new Date().toISOString().slice(0, 10);
     var totals = {
       total: rows.length,
       today: rows.filter(r => (r.timestamp || "").slice(0, 10) === today).length,
       companies: new Set(rows.map(r => r.company)).size
     };

     var languages = {}, topics = {}, monthly = {};
     rows.forEach(r => {
       languages[r.language] = (languages[r.language] || 0) + 1;
       topics[r.topic] = (topics[r.topic] || 0) + 1;
       var m = (r.timestamp || "").slice(0, 7);
       if (m) monthly[m] = (monthly[m] || 0) + 1;
     });

     return ContentService.createTextOutput(JSON.stringify({
       totals: totals,
       languages: Object.entries(languages).map(([label, value]) => ({ label, value })),
       topics: Object.entries(topics).map(([label, value]) => ({ label, value })),
       monthly: Object.entries(monthly).map(([label, value]) => ({ label, value })),
       rows: rows
     })).setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Replace `"YOUR_SPREADSHEET_ID"` with your actual sheet ID.
4. Go to **Deploy → New Deployment → Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the **Web App URL** and replace it in the JS file:
   ```js
   const SCRIPT_URL = "YOUR_NEW_DEPLOYED_WEBAPP_URL";
   ```

---

## 🧮 Dashboard Elements Required in HTML

Make sure your HTML page includes the following IDs:

```html
<div id="section-portal"></div>
<div id="section-dashboard" class="hidden"></div>
<span id="kpiTotal"></span>
<span id="kpiToday"></span>
<span id="kpiCompanies"></span>
<table><tbody id="tableBody"></tbody></table>
<canvas id="chartLanguages"></canvas>
<canvas id="chartTopics"></canvas>
<canvas id="chartMonthly"></canvas>
<form id="trainingForm"></form>
<p id="formStatus"></p>
```

---

## 🧱 Technology Stack

- **HTML / CSS / JavaScript**
- **Google Apps Script** (for backend)
- **Google Sheets** (for data storage)
- **Chart.js** (for dashboard charts)

---

## 📄 License
This project is owned and maintained by **PowerChina – Environmental Department**.  
All rights reserved © 2025.
