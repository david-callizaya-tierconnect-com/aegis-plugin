::short-name, jar and xpi files name. Must be lowercase with no spaces
SET APP_NAME=aegis
:: which chrome providers we have (space-separated list)        
SET CHROME_PROVIDERS=content
:: ...and these directories       (space separated list)
SET ROOT_DIRS=defaults     
 
SET ROOT_DIR=%~dp0
SET TMP_DIR=build

::remove any left-over files from previous build
del %APP_NAME%.jar %APP_NAME%.xpi
rd /s /q %TMP_DIR%
 
mkdir %TMP_DIR%
 
cp -v -R chrome %TMP_DIR%
cp -v -R components %TMP_DIR%
cp -v install.rdf %TMP_DIR%
cp -v chrome.manifest %TMP_DIR%
 
::generate the XPI file
cd %TMP_DIR%
::echo "Generating %APP_NAME%.xpi..."

::rar -r ../%APP_NAME%.xpi *
rar a -r %APP_NAME%.xpi *.*
cp %APP_NAME%.xpi %ROOT_DIR%
 
cd "%ROOT_DIR%"
rd /s /q %TMP_DIR%