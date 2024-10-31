
function fetchBibTexFromSerpApi(scholar_id) {
  var apiKey = "************";  // Your SerpApi key
  var apiUrl = 'https://serpapi.com/search.json?engine=google_scholar_cite&q=' + encodeURIComponent(scholar_id) + '&no_cache=true&api_key=' + apiKey;

  var response = UrlFetchApp.fetch(apiUrl);
  var json = JSON.parse(response.getContentText());

  Utilities.sleep(500);
  return UrlFetchApp.fetch(json["links"][0]["link"]);
}


function processTitlesAndFetchBibTex() {
  Logger.log("Fetching titles from Google Sheet...");
  var titles = fetchTitlesFromGoogleSheet();  // Step 1: Fetch titles
  
  if (titles.length === 0) {
    Logger.log("No titles found.");
    return;
  }
  
  Logger.log("Titles passed for processing: " + JSON.stringify(titles));  // Log the titles
  
  var bibtexResults = [];  // To store the BibTeX for each title
  
  titles.forEach(function(title) {
    Logger.log("Processing title: " + title);
    
    var scholar_id = getScholarIdFromSerpApi(title);  // Step 2: Fetch scholar_id
    
    if (scholar_id) {
      var bibtex = fetchBibTexFromSerpApi(scholar_id);  // Step 3: Fetch BibTeX
      bibtexResults.push(bibtex);
    } else {
      Logger.log("No scholar_id found for title: " + title);
    }
  });
  
  Logger.log("Final BibTeX Results: " + bibtexResults);  // Log final BibTeX results
  appendBibTexToGoogleDoc(bibtexResults);  // Append BibTeX results to the specified Google Doc
}

function fetchTitlesFromGoogleSheet() {
  var sheetId = '19OagQT81o7N108SRBHrPYMB_PatmPsIp95GeUkpNHmg';  // Your Google Sheet ID
  var sheetName = 'Sheet1';  // Replace with the correct sheet name if necessary
  
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    Logger.log("No data found in the sheet.");
    return [];  // Exit if there's no data
  }
  
  var dataRange = sheet.getRange(2, 1, lastRow - 1, 1);  // From A2 to the last row in column A
  var data = dataRange.getValues();
  var titles = [];
  
  // Collect and clean all titles
  data.forEach(function(row) {
    var cleanTitle = row[0].trim();  // Clean extra spaces and newlines
    titles.push(cleanTitle);  // Add cleaned title to the array
  });
  
  Logger.log("Fetched and Cleaned Titles: " + JSON.stringify(titles));  // Log titles for debugging
  return titles;  // Return the array of cleaned titles
}

function getScholarIdFromSerpApi(title) {
  var apiKey = "5e726cec3612bc5b401db44dc7f72727d063e3f8000b6f7138b77021d5fd6981";  // Your SerpApi key
  var apiUrl = 'https://serpapi.com/search.json?engine=google_scholar&q=' + encodeURIComponent(title) + '&api_key=' + apiKey;
  
  try {
    Logger.log("Fetching scholar_id for title: " + title);
    var response = UrlFetchApp.fetch(apiUrl);
    var json = JSON.parse(response.getContentText());
    
    // Log the full response for debugging
    Logger.log("SerpApi Response for scholar_id: " + JSON.stringify(json));
    
    if (json && json.organic_results && json.organic_results.length > 0) {
      var firstResult = json.organic_results[0];
      if (firstResult.result_id) {
        Logger.log("Found scholar_id: " + firstResult.result_id + " for title: " + title);
        return firstResult.result_id;  // Return the scholar_id
      }
    }
    
    Logger.log("No scholar_id found for title: " + title);
    return null;

  } catch (error) {
    Logger.log("Error fetching scholar_id: " + error);
    return null;
  }
}

function appendBibTexToGoogleDoc(bibtexResults) {
  var docId = '1MtLaOCmw6MZAUvBfRmyjYiQ4theM9MCX0VQqynT-6kQ';  // Your Google Doc ID
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  
  // Iterate over the array of BibTeX results (assuming it's a collection of HTTP responses)
  for (var i = 0; i < bibtexResults.length; i++) {
    var response = bibtexResults[i];
    
    // Check if the response is of type HTTPResponse, extract content
    if (response.getContentText) {
      var bibtexText = response.getContentText();  // Extract the text from the response
      Logger.log("Appending BibTeX result: " + bibtexText);
      body.appendParagraph(bibtexText);  // Append the text to the document
    } else {
      Logger.log("The BibTeX result is not a valid HTTPResponse: " + response);
    }
  }
  
  Logger.log("Appended all BibTeX results to Google Doc.");
}



processTitlesAndFetchBibTex();


