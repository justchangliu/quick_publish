// Helper functions to get content from Google Docs and Sheets
function getDocContent(docId) {
  var doc = DocumentApp.openById(docId);
  return doc.getBody().getText();
}

function getSheetContent(sheetId) {
  var sheet = SpreadsheetApp.openById(sheetId);
  var range = sheet.getActiveSheet().getDataRange();
  return range.getValues();  // Returns a 2D array
}

function getFigurePaths(folderId) {
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFilesByType(MimeType.PNG);
  var figurePaths = [];
  while (files.hasNext()) {
    var file = files.next();
    figurePaths.push(file.getUrl());
  }
  return figurePaths;
}

// Main function to create the LaTeX manuscript
function createLatexManuscript() {
  var latexTemplate = `
  \\documentclass{webofc}
  \\usepackage[varg]{txfonts}   % Web of Conferences font
  \\begin{document}
  
  \\title{Your Manuscript Title Here}
  
  \\author{
    \\firstname{First author} \\lastname{First author}\\inst{1} \\fnsep\\thanks{\\email{email@example.com}} \\and
    \\firstname{Second author} \\lastname{Second author}\\inst{2} \\and
    \\firstname{Third author} \\lastname{Third author}\\inst{3}
  }
  
  \\institute{
    Institute 1 address \\and
    Institute 2 address \\and
    Institute 3 address
  }
  
  \\abstract{
    ${getDocContent('14i6APMoZSwUMDhuc2IfVO64H6_zmFC8uRB2aS56lOBg')}  % Abstract
  }
  
  \\maketitle
  
  \\section{Introduction}
  ${getDocContent('1Rl2q-5NktTEbXOEa3P9lERBqWZeojoE7CHpacdJddJM')}  % Introduction
  
  \\section{Materials and Methods}
  ${getDocContent('1jigkk32DvrOi9GxlDYZ6C1Ebj07p6F2yrWjfc8-J44s')}  % Materials and Methods
  
  \\section{Results}
  ${getDocContent('1fXtIONZKV8Nk8J5VrD8YbI7R1b69tK1kKJZEGCm3yZw')}  % Results
  
  \\section{Discussion}
  ${getDocContent('1DKqiz_Zll6p0OzKzeby0wPR5ix2LNBWZpoPT8Brv6J4')}  % Discussion
  
  \\section{Table}
  \\begin{table}[h]
  \\centering
  \\caption{Your table caption here}
  \\begin{tabular}{lll}
  \\hline
  ${getSheetContent('19OagQT81o7N108SRBHrPYMB_PatmPsIp95GeUkpNHmg').map(row => row.join(' & ') + ' \\\\ \\hline').join('\n')}
  \\end{tabular}
  \\end{table}
  
  \\section{Figures}
  \\begin{figure}[h]
    \\centering
    \\includegraphics[width=0.5\\textwidth]{${getFigurePaths('1LCPGI7uXjwNgGYPKu3dHP1kw2GREDaAZ')[0]}}
    \\caption{Figure 1: Your figure caption here}
  \\end{figure}

  \\begin{figure}[h]
    \\centering
    \\includegraphics[width=0.5\\textwidth]{${getFigurePaths('1LCPGI7uXjwNgGYPKu3dHP1kw2GREDaAZ')[1]}}
    \\caption{Figure 2: Your figure caption here}
  \\end{figure}
  
  \\section{Bibliography}
  \\begin{thebibliography}{}
  ${getDocContent('1MtLaOCmw6MZAUvBfRmyjYiQ4theM9MCX0VQqynT-6kQ')}  % Bibliography
  \\end{thebibliography}
  
  \\end{document}
  `;

  // Create the LaTeX file in Google Drive
  var file = DriveApp.createFile('manuscript.tex', latexTemplate, MimeType.PLAIN_TEXT);
  Logger.log('LaTeX file created: ' + file.getUrl());
}
