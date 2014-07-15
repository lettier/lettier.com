#!/bin/bash

java -jar ~/Downloads/yuicompressor-2.4.8.jar ../assets/dependencies/js/three.min.js -o ../assets/dependencies/js/three.min.min.js

java -jar ~/Downloads/yuicompressor-2.4.8.jar ../assets/dependencies/js/tween.min.js -o ../assets/dependencies/js/tween.min.min.js

java -jar ~/Downloads/yuicompressor-2.4.8.jar ../assets/dependencies/js/TrackballControls.js -o ../assets/dependencies/js/TrackballControls.min.js

java -jar ~/Downloads/yuicompressor-2.4.8.jar ../assets/dependencies/js/Detector.js -o ../assets/dependencies/js/Detector.min.js

java -jar ~/Downloads/yuicompressor-2.4.8.jar ../assets/scripts/js/index.js -o ../assets/scripts/js/index.min.js

java -jar ~/Downloads/yuicompressor-2.4.8.jar ../assets/scripts/js/contact_form_handler.js -o ../assets/scripts/js/contact_form_handler.min.js

java -jar ~/Downloads/yuicompressor-2.4.8.jar ../assets/styles/index.css -o ../assets/styles/index.min.css

cat ../assets/dependencies/js/three.min.min.js ../assets/dependencies/js/tween.min.min.js ../assets/dependencies/js/TrackballControls.min.js ../assets/dependencies/js/Detector.min.js ../assets/scripts/js/index.min.js ../assets/scripts/js/contact_form_handler.min.js > ../assets/allscripts/all.js