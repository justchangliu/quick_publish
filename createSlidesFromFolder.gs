function createSlidesFromFolder() {
  // Use your folder ID
  var folderId = "1LCPGI7uXjwNgGYPKu3dHP1kw2GREDaAZ";
  var folder = DriveApp.getFolderById(folderId);
  
  // Get all files in the folder
  var files = folder.getFiles();
  
  // Create a new Google Slides presentation
  var slideDeck = SlidesApp.create("Generated Slide Deck");
  
  // Initialize variables for images and notes
  var notesText = "";
  
  // Loop through the files in the folder
  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var mimeType = file.getMimeType();
    
    if (mimeType === MimeType.PNG) {
      // Add a slide and insert image if the file is a PNG
      var slide = slideDeck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
      var image = slide.insertImage(file.getBlob());
      
      // Resize the image to fit the slide
      var slideWidth = slideDeck.getPageWidth();
      var slideHeight = slideDeck.getPageHeight();
      var imageWidth = image.getWidth();
      var imageHeight = image.getHeight();
      
      // Scale image to fit within slide dimensions
      var widthRatio = slideWidth / imageWidth;
      var heightRatio = slideHeight / imageHeight;
      var scalingFactor = Math.min(widthRatio, heightRatio);
      
      image.setWidth(imageWidth * scalingFactor);
      image.setHeight(imageHeight * scalingFactor);
      
      // Center the image on the slide
      var left = (slideWidth - image.getWidth()) / 2;
      var top = (slideHeight - image.getHeight()) / 2;
      image.setLeft(left);
      image.setTop(top);
      
    } else if (fileName === "notes.txt") {
      // Read the text from the notes.txt file
      var textBlob = file.getBlob().getDataAsString();
      notesText = textBlob;
    }
  }
  
  // If notes text exists, add it as speaker notes to each slide
  if (notesText !== "") {
    var slides = slideDeck.getSlides();
    for (var i = 0; i < slides.length; i++) {
      var notesPage = slides[i].getNotesPage();
      var speakerNotesShape = notesPage.getSpeakerNotesShape();
      
      // Check if speaker notes shape exists
      if (speakerNotesShape) {
        speakerNotesShape.setText(notesText);
      } else {
        // Create speaker notes if they don't exist
        var shape = notesPage.insertShape(SlidesApp.ShapeType.TEXT_BOX, 0, 0, slides[i].getPageWidth(), slides[i].getPageHeight());
        shape.setText(notesText);
      }
    }
  }
  
  Logger.log("Slides created: " + slideDeck.getUrl());
}

