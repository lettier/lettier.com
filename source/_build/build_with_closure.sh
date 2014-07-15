#!/bin/bash

java -jar ./closure_compiler/compiler.jar --js ../assets/dependencies/js/three.min.js         --js_output_file ../assets/dependencies/js/three.min.min.js

java -jar ./closure_compiler/compiler.jar --js ../assets/dependencies/js/tween.min.js         --js_output_file ../assets/dependencies/js/tween.min.min.js

java -jar ./closure_compiler/compiler.jar --js ../assets/dependencies/js/TrackballControls.js --js_output_file ../assets/dependencies/js/TrackballControls.min.js

java -jar ./closure_compiler/compiler.jar --js ../assets/dependencies/js/Detector.js          --js_output_file ../assets/dependencies/js/Detector.min.js

java -jar ./closure_compiler/compiler.jar --js ../assets/scripts/js/index.js                  --js_output_file ../assets/scripts/js/index.min.js

java -jar ./closure_compiler/compiler.jar --js ../assets/scripts/js/contact_form_handler.js   --js_output_file ../assets/scripts/js/contact_form_handler.min.js

java -jar ./closure_compiler/compiler.jar --js ../assets/styles/index.css                     --js_output_file ../assets/styles/index.min.css

cat ../assets/dependencies/js/three.min.min.js ../assets/dependencies/js/tween.min.min.js ../assets/dependencies/js/TrackballControls.min.js ../assets/dependencies/js/Detector.min.js ../assets/scripts/js/index.min.js ../assets/scripts/js/contact_form_handler.min.js > ../assets/allscripts/all.js